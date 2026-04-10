#!/usr/bin/env node
/**
 * Bootstrap Elon Musk events into data/events/musk.json.
 * Idempotent: skips events whose id already exists.
 * After running, run audit-urls.mjs --write + parse-youtube.mjs --write + verify-embeds.mjs.
 */
import fs from "node:fs";
import path from "node:path";

const filePath = path.join(process.cwd(), "data", "events", "musk.json");
const events = fs.existsSync(filePath)
  ? JSON.parse(fs.readFileSync(filePath, "utf8"))
  : [];
const existingIds = new Set(events.map((e) => e.id));

const HUMAN = { license: "all-rights-reserved", authored_by: "human", mentions: [] };
const CCBYSA = { license: "cc-by-sa", authored_by: "human", mentions: [] };

const newEvents = [
  // ============ 1971-06-28 Birth ============
  {
    id: "musk-1971-06-28-birth",
    person_id: "musk",
    date: "1971-06-28",
    date_precision: "day",
    type: "life",
    title: "出生于南非比勒陀利亚",
    title_en: "Born in Pretoria, South Africa",
    summary:
      "出生于南非比勒陀利亚，父亲 Errol Musk 是一名南非工程师，母亲 Maye Musk 是加拿大裔模特和营养师。家境优渥但充满冲突。10 岁拿到第一台电脑（Commodore VIC-20），自学 BASIC 编程，12 岁卖出第一款游戏程序 Blastar 赚了 500 美元。",
    location: "Pretoria, South Africa",
    key: true,
    tags: ["出生", "童年"],
    sources: [
      {
        id: "wikipedia-musk-bio",
        url: "https://en.wikipedia.org/wiki/Elon_Musk",
        kind: "article",
        title: "Elon Musk (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
    ],
    source_hints: "Ashlee Vance《Elon Musk: Tesla, SpaceX, and the Quest for a Fantastic Future》第 2 章",
  },

  // ============ 1995-06 Zip2 founding ============
  {
    id: "musk-1995-06-zip2-founding",
    person_id: "musk",
    date: "1995-06-01",
    date_precision: "month",
    type: "founding",
    title: "与弟弟 Kimbal 创立 Zip2",
    title_en: "Co-founds Zip2 with brother Kimbal",
    summary:
      "刚到 Stanford 读应用物理博士两天后就退学，在 Palo Alto 与弟弟 Kimbal 创立 Zip2——一家给报纸做在线城市指南的公司。早期他和弟弟睡在办公室、洗澡去 YMCA，靠他父亲投的 28,000 美元起步。Zip2 后来给纽约时报、芝加哥论坛报等大报供应在线分类广告系统。",
    location: "Palo Alto, CA",
    key: true,
    tags: ["创业", "Zip2"],
    sources: [
      {
        id: "wikipedia-zip2",
        url: "https://en.wikipedia.org/wiki/Zip2",
        kind: "article",
        title: "Zip2 (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
      {
        id: "britannica-zip2",
        url: "https://www.britannica.com/money/Zip2",
        kind: "article",
        title: "Zip2 — Britannica Money",
        publisher: "Encyclopedia Britannica",
        lang: "en",
        primary: false,
        ...HUMAN,
      },
    ],
    source_hints: null,
  },

  // ============ 1999-02 Compaq acquires Zip2 ============
  {
    id: "musk-1999-02-compaq-zip2",
    person_id: "musk",
    date: "1999-02-01",
    date_precision: "month",
    type: "deal",
    title: "Compaq 以 3.07 亿美元现金收购 Zip2",
    title_en: "Compaq acquires Zip2 for $307 million",
    summary:
      "Compaq 全现金收购 Zip2，并入旗下 AltaVista 搜索引擎部门。28 岁的 Musk 持股 7%，套现 2,200 万美元——他人生第一桶金。一个月后他立刻把 1,200 万美元砸进下一个项目 X.com。",
    location: "Houston, TX / Palo Alto, CA",
    key: true,
    tags: ["Zip2", "退出", "Compaq"],
    sources: [
      {
        id: "wikipedia-zip2-acquisition",
        url: "https://en.wikipedia.org/wiki/Zip2",
        kind: "article",
        title: "Zip2 (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
    ],
    source_hints: null,
  },

  // ============ 1999-03 X.com founding ============
  {
    id: "musk-1999-03-x-com-founding",
    person_id: "musk",
    date: "1999-03-01",
    date_precision: "month",
    type: "founding",
    title: "创立 X.com（在线金融服务公司）",
    title_en: "Founds X.com (online financial services)",
    summary:
      "用 Zip2 套现的 1,200 万美元创立 X.com——目标是做一家\"全数字银行\"。这是他人生第一次用 X 这个字母作为公司名（之后会用很多次）。Musk 最初的愿景非常激进：取代传统银行、整合所有金融服务到一个互联网账户。",
    location: "Palo Alto, CA",
    key: true,
    tags: ["创业", "X.com", "金融"],
    sources: [
      {
        id: "wikipedia-paypal",
        url: "https://en.wikipedia.org/wiki/PayPal",
        kind: "article",
        title: "PayPal (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
    ],
    source_hints: null,
  },

  // ============ 2000-03 X.com / Confinity merger → PayPal ============
  {
    id: "musk-2000-03-paypal-merger",
    person_id: "musk",
    date: "2000-03-01",
    date_precision: "month",
    type: "deal",
    title: "X.com 与 Confinity 合并 → PayPal",
    title_en: "X.com merges with Confinity to form PayPal",
    summary:
      "X.com 与 Peter Thiel 和 Max Levchin 的 Confinity 合并。Confinity 旗下的电子邮件支付产品叫 PayPal——合并后这成为新公司的旗舰产品。Musk 出任合并后公司的 CEO，但因为他想把公司从 Unix 切到 Microsoft 后端的决定，半年后被董事会赶走（他正在度蜜月）。Peter Thiel 接任 CEO，公司正式更名 PayPal。",
    location: "Palo Alto, CA",
    key: true,
    tags: ["PayPal", "合并", "Peter Thiel"],
    sources: [
      {
        id: "wikipedia-paypal-merger",
        url: "https://en.wikipedia.org/wiki/PayPal",
        kind: "article",
        title: "PayPal (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
    ],
    source_hints: null,
  },

  // ============ 2002-03-14 SpaceX founding ============
  {
    id: "musk-2002-03-14-spacex-founding",
    person_id: "musk",
    date: "2002-03-14",
    date_precision: "day",
    type: "founding",
    title: "创立 SpaceX",
    title_en: "Founds SpaceX",
    summary:
      "在两次飞往莫斯科想买俄罗斯洲际弹道导弹改装失败之后，Musk 决定自己造火箭。SpaceX 于 2002 年 3 月 14 日在加州正式注册成立。他用 PayPal 出售套现的 1.8 亿美元里拿出 1 亿投入这家公司，并担任 CEO + 首席工程师。最初团队只有几个人，包括从 TRW 挖来的火箭引擎工程师 Tom Mueller。目标：让上太空的成本下降两个数量级，最终殖民火星。",
    location: "El Segundo, CA",
    key: true,
    tags: ["SpaceX", "创业", "火星"],
    sources: [
      {
        id: "wikipedia-spacex",
        url: "https://en.wikipedia.org/wiki/SpaceX",
        kind: "article",
        title: "SpaceX (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
      {
        id: "britannica-spacex",
        url: "https://www.britannica.com/money/SpaceX",
        kind: "article",
        title: "SpaceX — Britannica Money",
        publisher: "Encyclopedia Britannica",
        lang: "en",
        primary: false,
        ...HUMAN,
      },
    ],
    source_hints: null,
  },

  // ============ 2002-10-03 eBay acquires PayPal ============
  {
    id: "musk-2002-10-03-ebay-paypal",
    person_id: "musk",
    date: "2002-10-03",
    date_precision: "day",
    type: "deal",
    title: "eBay 以 15 亿美元收购 PayPal",
    title_en: "eBay acquires PayPal for $1.5 billion",
    summary:
      "eBay 以 15 亿美元股票收购 PayPal。Musk 当时持股 11.72%，套现约 1.76 亿美元（税前）。这是他真正的第一笔大钱——刚好赶上他需要现金维持 SpaceX 和投资 Tesla。讽刺的是 13 年后 eBay 又把 PayPal 拆分独立。",
    location: "San Jose, CA",
    key: true,
    tags: ["PayPal", "退出", "eBay"],
    sources: [
      {
        id: "wikipedia-paypal-ebay",
        url: "https://en.wikipedia.org/wiki/PayPal",
        kind: "article",
        title: "PayPal (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
    ],
    source_hints: null,
  },

  // ============ 2004-02 Tesla Series A + chairman ============
  {
    id: "musk-2004-02-tesla-chairman",
    person_id: "musk",
    date: "2004-02-01",
    date_precision: "month",
    type: "deal",
    title: "领投 Tesla Series A，出任董事长",
    title_en: "Leads Tesla Series A, becomes chairman",
    summary:
      "Tesla 由 Martin Eberhard 和 Marc Tarpenning 在 2003 年 7 月创立。Musk 在 2004 年 2 月领投 750 万美元的 Series A，成为最大股东和董事长。他不是 Tesla 的创立者，但从 A 轮就深度参与产品决策，特别是 Roadster 的设计方向。这个角色后来在 2008 年金融危机中升级成 CEO。",
    location: "San Carlos, CA",
    key: true,
    tags: ["Tesla", "投资", "Series A"],
    sources: [
      {
        id: "wikipedia-tesla-history",
        url: "https://en.wikipedia.org/wiki/History_of_Tesla,_Inc.",
        kind: "article",
        title: "History of Tesla, Inc. (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
    ],
    source_hints: null,
  },

  // ============ 2008-09-28 Falcon 1 first orbital ============
  {
    id: "musk-2008-09-28-falcon-1-orbit",
    person_id: "musk",
    date: "2008-09-28",
    date_precision: "day",
    type: "product",
    title: "Falcon 1 第四次发射成功，首个进入轨道的私人液体火箭",
    title_en: "Falcon 1 reaches orbit on fourth attempt — first private liquid-fueled rocket",
    summary:
      "前三次 Falcon 1 发射全部失败。SpaceX 已经几乎花光所有资金，Musk 后来说\"我们只剩第四次的钱\"。9 月 28 日 19:15 EDT 从 Kwajalein 环礁的 Omelek 岛发射，第四次终于成功——Falcon 1 成为史上第一枚抵达轨道的私人开发液体燃料火箭。两个月后 NASA 的 16 亿美元合同就把 SpaceX 从破产边缘救回来。",
    location: "Omelek Island, Kwajalein Atoll",
    key: true,
    tags: ["SpaceX", "Falcon 1", "里程碑"],
    sources: [
      {
        id: "wikipedia-falcon-1",
        url: "https://en.wikipedia.org/wiki/Falcon_1",
        kind: "article",
        title: "Falcon 1 (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
      {
        id: "space-com-falcon-1-orbit",
        url: "https://www.space.com/5905-spacex-successfully-launches-falcon-1-rocket-orbit.html",
        kind: "article",
        title: "SpaceX Successfully Launches Falcon 1 Rocket Into Orbit",
        publisher: "Space.com",
        lang: "en",
        primary: false,
        ...HUMAN,
      },
    ],
    source_hints: null,
  },

  // ============ 2008-10-08 Tesla CEO ============
  {
    id: "musk-2008-10-tesla-ceo",
    person_id: "musk",
    date: "2008-10-08",
    date_precision: "day",
    type: "career",
    title: "出任 Tesla CEO（金融危机最深处）",
    title_en: "Becomes Tesla CEO during the financial crisis",
    summary:
      "2008 年 10 月 Tesla 几乎破产——金融危机让融资市场冻结，Roadster 量产严重落后，Tesla 现金只够撑几周。Musk 罢免了创始人 CEO Martin Eberhard，亲自接任 CEO。同时 SpaceX 也在生死边缘——Falcon 1 那时刚刚成功 10 天。Musk 用最后的个人资金同时输血两家公司，并抵押了所有个人资产。",
    location: "San Carlos, CA",
    key: true,
    tags: ["Tesla", "CEO", "危机"],
    sources: [
      {
        id: "wikipedia-tesla-2008",
        url: "https://en.wikipedia.org/wiki/History_of_Tesla,_Inc.",
        kind: "article",
        title: "History of Tesla, Inc. (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
    ],
    source_hints: "Ashlee Vance 传记第 7-8 章；2008 年 12 月 Musk 同时给 Tesla 和 SpaceX 续命",
  },

  // ============ 2010-06-29 Tesla IPO ============
  {
    id: "musk-2010-06-29-tesla-ipo",
    person_id: "musk",
    date: "2010-06-29",
    date_precision: "day",
    type: "deal",
    title: "Tesla 在纳斯达克 IPO",
    title_en: "Tesla IPO on NASDAQ",
    summary:
      "Tesla 以 17 美元/股发行 1330 万股，融资 2.26 亿美元，股票代码 TSLA。这是自 1956 年福特上市以来美国第一家上市的汽车公司。首日股价上涨 40.53%，收于 23.89 美元。15 年后 TSLA 涨幅近 300 倍。",
    location: "NASDAQ",
    key: true,
    tags: ["Tesla", "IPO"],
    sources: [
      {
        id: "tesla-ir-ipo-pricing",
        url: "https://ir.tesla.com/press-release/tesla-announces-pricing-initial-public-offering",
        kind: "article",
        title: "Tesla Announces Pricing of Initial Public Offering",
        publisher: "Tesla Investor Relations",
        lang: "en",
        primary: true,
        ...HUMAN,
      },
      {
        id: "cnbc-tesla-ipo-15yrs",
        url: "https://www.cnbc.com/2025/06/29/teslas-ipo-was-15-years-ago-the-stock-is-up-300-fold-since-then.html",
        kind: "article",
        title: "Tesla's IPO was 15 years ago. The stock is up almost 300-fold",
        publisher: "CNBC",
        lang: "en",
        primary: false,
        ...HUMAN,
      },
    ],
    source_hints: null,
  },

  // ============ 2012-05-25 Dragon ISS ============
  {
    id: "musk-2012-05-25-dragon-iss",
    person_id: "musk",
    date: "2012-05-25",
    date_precision: "day",
    type: "product",
    title: "SpaceX Dragon 与国际空间站对接",
    title_en: "SpaceX Dragon docks with ISS — first commercial spacecraft to ISS",
    summary:
      "SpaceX Dragon 货运飞船与国际空间站对接，成为史上第一艘抵达 ISS 的商业航天器。这是 NASA 商业补给服务（CRS）合同的首次实质交付，证明私人公司可以承担过去只有国家航天局才能完成的任务。",
    location: "International Space Station (orbit)",
    key: true,
    tags: ["SpaceX", "Dragon", "ISS", "里程碑"],
    sources: [
      {
        id: "wikipedia-dragon-c2plus",
        url: "https://en.wikipedia.org/wiki/SpaceX_Dragon",
        kind: "article",
        title: "SpaceX Dragon (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
    ],
    source_hints: null,
  },

  // ============ 2015-12-21 Falcon 9 landing ============
  {
    id: "musk-2015-12-21-falcon-9-landing",
    person_id: "musk",
    date: "2015-12-21",
    date_precision: "day",
    type: "product",
    title: "Falcon 9 第一次回收一级火箭——人类航天史的转折点",
    title_en: "First successful Falcon 9 first-stage landing",
    summary:
      "Falcon 9 第 20 次飞行，成功把 11 颗 Orbcomm 卫星送入轨道，**同时一级火箭垂直降落在 Cape Canaveral 的 Landing Zone 1**。这是人类历史上第一次有运载火箭一级在执行轨道任务后完整降落回地球。从此火箭可以重复使用——一举把进入太空的成本下降了一个数量级，直接定义了 21 世纪的航天工业。",
    location: "Cape Canaveral SLC-40 / LZ-1, FL",
    key: true,
    tags: ["SpaceX", "Falcon 9", "可重用", "经典", "里程碑"],
    sources: [
      {
        id: "wikipedia-falcon-9-flight-20",
        url: "https://en.wikipedia.org/wiki/Falcon_9_flight_20",
        kind: "article",
        title: "Falcon 9 flight 20 (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
      {
        id: "space-com-falcon-9-landing",
        url: "https://www.space.com/31420-spacex-rocket-landing-success.html",
        kind: "article",
        title: "Wow! SpaceX Lands Orbital Rocket Successfully in Historic First",
        publisher: "Space.com",
        lang: "en",
        primary: false,
        ...HUMAN,
      },
    ],
    source_hints: null,
  },

  // ============ 2018-09-06 Joe Rogan podcast ============
  {
    id: "musk-2018-09-06-joe-rogan",
    person_id: "musk",
    date: "2018-09-06",
    date_precision: "day",
    type: "interview",
    title: "Joe Rogan Experience #1169（抽烟争议）",
    title_en: "Joe Rogan Experience #1169",
    summary:
      "在 Joe Rogan 的播客上接受 2 小时 30 分钟长访。内容涵盖 AI 风险、Neuralink、火星殖民、人类意识——但事后让所有头条都聚焦在节目最后他和 Rogan 一起抽了一口大麻烟卷。Tesla 股价隔天大跌。这场播客后来被认为是 Musk 公开形象从\"硅谷神童\"过渡到\"网红 CEO\"的转折点。",
    location: "Los Angeles, CA",
    key: true,
    tags: ["采访", "Joe Rogan", "争议", "Neuralink"],
    sources: [
      {
        id: "wikipedia-jre-1169",
        url: "https://en.wikipedia.org/wiki/Elon_Musk",
        kind: "article",
        title: "Elon Musk (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
    ],
    source_hints: "原始播客已从 Spotify 下架；YouTube 仍有完整版本",
  },

  // ============ 2020-05-30 Crew Dragon Demo-2 ============
  {
    id: "musk-2020-05-30-crew-dragon-demo2",
    person_id: "musk",
    date: "2020-05-30",
    date_precision: "day",
    type: "product",
    title: "Crew Dragon Demo-2 — 美国本土首次商业载人发射",
    title_en: "Crew Dragon Demo-2 launches astronauts from US soil",
    summary:
      "SpaceX Crew Dragon \"Endeavour\" 号搭载 NASA 宇航员 Doug Hurley 和 Bob Behnken 从佛罗里达 Kennedy 航天中心 39A 发射台升空，前往国际空间站。这是自 2011 年航天飞机退役以来美国本土首次发射载人航天器，**也是人类历史上第一次商业载人轨道飞行**。SpaceX 用 18 年时间从 0 到把宇航员送上 ISS。",
    location: "Kennedy Space Center LC-39A, FL",
    key: true,
    tags: ["SpaceX", "Crew Dragon", "载人航天", "NASA", "里程碑"],
    sources: [
      {
        id: "wikipedia-crew-dragon-demo-2",
        url: "https://en.wikipedia.org/wiki/Crew_Dragon_Demo-2",
        kind: "article",
        title: "Crew Dragon Demo-2 (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
      {
        id: "nasa-demo2-historic",
        url: "https://www.nasa.gov/news-release/nasa-astronauts-launch-from-america-in-historic-test-flight-of-spacex-crew-dragon/",
        kind: "article",
        title: "NASA Astronauts Launch from America in Historic Test Flight of SpaceX Crew Dragon",
        publisher: "NASA",
        lang: "en",
        primary: true,
        ...HUMAN,
      },
    ],
    source_hints: null,
  },

  // ============ 2022-04-25 Twitter agreement ============
  {
    id: "musk-2022-04-25-twitter-agreement",
    person_id: "musk",
    date: "2022-04-25",
    date_precision: "day",
    type: "deal",
    title: "Twitter 同意 440 亿美元收购协议",
    title_en: "Twitter agrees to $44 billion acquisition",
    summary:
      "在数月公开拉锯后，Twitter 董事会一致接受 Musk 每股 54.20 美元的收购报价，总额约 440 亿美元。Musk 当时是 Twitter 的最大个人股东（持股约 9%）。这只是开始——之后是几个月的反悔、起诉、和解，直到 10 月才正式完成。",
    location: "San Francisco, CA",
    key: true,
    tags: ["Twitter", "收购"],
    sources: [
      {
        id: "wikipedia-twitter-acquisition",
        url: "https://en.wikipedia.org/wiki/Acquisition_of_Twitter_by_Elon_Musk",
        kind: "article",
        title: "Acquisition of Twitter by Elon Musk (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
    ],
    source_hints: null,
  },

  // ============ 2022-10-27 Twitter close ============
  {
    id: "musk-2022-10-27-twitter-close",
    person_id: "musk",
    date: "2022-10-27",
    date_precision: "day",
    type: "deal",
    title: "Twitter 收购正式完成",
    title_en: "Closes Twitter acquisition",
    summary:
      "经过 6 个月的反悔、特拉华州法院起诉、最后被迫履约后，Musk 正式完成对 Twitter 的 440 亿美元收购，并立刻解雇 CEO Parag Agrawal、CFO Ned Segal、法律负责人 Vijaya Gadde。次日他在 Twitter 发推 \"the bird is freed\"。9 个月后他把 Twitter 改名为 X。",
    location: "San Francisco, CA",
    key: true,
    tags: ["Twitter", "收购", "X"],
    sources: [
      {
        id: "wikipedia-twitter-close",
        url: "https://en.wikipedia.org/wiki/Acquisition_of_Twitter_by_Elon_Musk",
        kind: "article",
        title: "Acquisition of Twitter by Elon Musk (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
      {
        id: "cnn-musk-twitter-close",
        url: "https://www.cnn.com/2022/10/28/tech/elon-musk-twitter-deal-close",
        kind: "article",
        title: "Twitter confirms completion of Elon Musk's $44 billion acquisition deal",
        publisher: "CNN Business",
        lang: "en",
        primary: false,
        ...HUMAN,
      },
    ],
    source_hints: null,
  },
];

const toAdd = newEvents.filter((e) => !existingIds.has(e.id));
const skipped = newEvents.length - toAdd.length;

if (toAdd.length === 0) {
  console.log("nothing to add");
  process.exit(0);
}

const merged = [...events, ...toAdd].sort((a, b) =>
  a.date.localeCompare(b.date)
);

fs.writeFileSync(filePath, JSON.stringify(merged, null, 2) + "\n");
console.log(
  `added ${toAdd.length} musk events (skipped ${skipped}); total now ${merged.length}`
);
