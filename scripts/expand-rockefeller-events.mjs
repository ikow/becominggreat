#!/usr/bin/env node
/**
 * Expand John D. Rockefeller timeline with ~25 additional events.
 * Idempotent: skips events whose id already exists.
 * Run: node scripts/expand-rockefeller-events.mjs
 * Then: node scripts/audit-urls.mjs --write 2>&1 | tail -20
 */
import fs from "node:fs";
import path from "node:path";

const filePath = path.join(process.cwd(), "data", "events", "rockefeller.json");
const events = fs.existsSync(filePath)
  ? JSON.parse(fs.readFileSync(filePath, "utf8"))
  : [];
const existingIds = new Set(events.map((e) => e.id));

const HUMAN = { license: "all-rights-reserved", authored_by: "human", mentions: [] };
const CCBYSA = { license: "cc-by-sa", authored_by: "human", mentions: [] };

const wikiRockefeller = {
  id: "wikipedia-john-d-rockefeller",
  url: "https://en.wikipedia.org/wiki/John_D._Rockefeller",
  kind: "article",
  title: "John D. Rockefeller",
  publisher: "Wikipedia",
  lang: "en",
  primary: false,
  ...CCBYSA,
};

const britannicaRockefeller = {
  id: "britannica-rockefeller",
  url: "https://www.britannica.com/biography/John-D-Rockefeller",
  kind: "article",
  title: "John D. Rockefeller | Biography, Industry, Philanthropy & Facts",
  publisher: "Encyclopaedia Britannica",
  lang: "en",
  primary: false,
  ...HUMAN,
};

const wikiStandardOil = {
  id: "wikipedia-standard-oil",
  url: "https://en.wikipedia.org/wiki/Standard_Oil",
  kind: "article",
  title: "Standard Oil",
  publisher: "Wikipedia",
  lang: "en",
  primary: false,
  ...CCBYSA,
};

const historyCom = {
  id: "history-com-rockefeller",
  url: "https://www.history.com/topics/19th-century/john-d-rockefeller",
  kind: "article",
  title: "John D. Rockefeller",
  publisher: "History.com",
  lang: "en",
  primary: false,
  ...HUMAN,
};

const rockefellerArchive = {
  id: "rockefeller-archive-center",
  url: "https://rockarch.org/",
  kind: "article",
  title: "Rockefeller Archive Center",
  publisher: "Rockefeller Archive Center",
  lang: "en",
  primary: false,
  ...HUMAN,
};

const newEvents = [
  // ── 1853 family moves to Cleveland ──
  {
    id: "rockefeller-1853-move-to-cleveland",
    person_id: "rockefeller",
    date: "1853-01-01",
    date_precision: "year",
    type: "life",
    title: "随家人迁居克利夫兰",
    title_en: "Family moves to Cleveland, Ohio",
    summary:
      "1853 年,14 岁的洛克菲勒随家人从纽约州奥韦格搬到俄亥俄州克利夫兰。父亲威廉·洛克菲勒常年在外行医贩药,母亲伊丽莎独力带着六个孩子迁居中西部,寻求更好的发展机会。克利夫兰当时正处于快速工业化阶段,凭借伊利运河、俄亥俄运河与多条铁路的交汇,已成为五大湖地区最重要的商业中心之一。这座城市将成为洛克菲勒的商业起点与炼油帝国的大本营。他在克利夫兰中央高中完成学业,并在 Folsom 商业学院学习簿记与银行学——这些实用技能为他两年后进入商界打下基础。",
    summary_en:
      "In 1853 the 14-year-old Rockefeller moved with his family from Owego, New York to Cleveland, Ohio. His mother Eliza, managing six children largely alone while his father William roamed selling patent medicines, sought better opportunities in the booming Midwest. Cleveland, at the junction of the Erie and Ohio canals and several rail lines, was already one of the Great Lakes' foremost commercial hubs. The city would become the launchpad for Rockefeller's business career and the headquarters of his refining empire. He finished school at Cleveland Central High and took courses in bookkeeping and banking at Folsom's Commercial College — practical skills that prepared him to enter business two years later.",
    location: "Cleveland, Ohio",
    key: false,
    tags: ["early-life", "cleveland", "family"],
    sources: [{ ...wikiRockefeller }, { ...britannicaRockefeller }],
    source_hints: null,
  },

  // ── 1855 first tithe ──
  {
    id: "rockefeller-1855-first-tithe",
    person_id: "rockefeller",
    date: "1855-01-01",
    date_precision: "year",
    type: "life",
    title: "首次什一奉献——从第一份薪水开始捐赠",
    title_en: "First tithe — begins lifelong practice of charitable giving from first paycheck",
    summary:
      "1855 年,16 岁的洛克菲勒从 Hewitt & Tuttle 公司领取第一笔薪水后,立即将约 6% 捐给教会和慈善机构——他把每一笔收支都记录在一本名为「Ledger A」的小账本中。从这一年起,他终生坚持将收入的一定比例(后来增至十分之一乃至更多)捐给宗教、教育和社会事业。这个习惯源于母亲伊丽莎的浸信会教导和主日学校的什一税教育。「Ledger A」不仅记录了他最早的商业交易,也记录了他每一笔慈善捐款,成为研究洛克菲勒早期生涯最珍贵的一手史料。这种从第一美元就开始系统性捐赠的做法,预示了他晚年建立的庞大慈善帝国。",
    summary_en:
      "In 1855 the 16-year-old Rockefeller, upon receiving his very first wages from Hewitt & Tuttle, immediately donated about 6 percent to his church and charitable causes — meticulously recording every cent in a small notebook he called 'Ledger A.' From that year on he gave a fixed share of his income (eventually a full tithe and far beyond) to religious, educational, and social causes for the rest of his life. The habit was instilled by his mother Eliza's Baptist faith and Sunday-school tithing lessons. Ledger A — which recorded both his earliest commercial transactions and every charitable gift — has become the most precious primary source for studying young Rockefeller's career. This practice of systematic giving from the very first dollar foreshadowed the colossal philanthropic empire he would build in later decades.",
    location: "Cleveland, Ohio",
    key: true,
    tags: ["philanthropy", "tithe", "religion", "ledger-a"],
    sources: [{ ...wikiRockefeller }, { ...rockefellerArchive }],
    source_hints: null,
  },

  // ── 1859 Clark & Rockefeller ──
  {
    id: "rockefeller-1859-clark-rockefeller-founded",
    person_id: "rockefeller",
    date: "1859-01-01",
    date_precision: "year",
    type: "founding",
    title: "与 Maurice Clark 合伙创办 Clark & Rockefeller 农产品佣金商行",
    title_en: "Co-founds Clark & Rockefeller produce commission firm",
    summary:
      "1859 年,年仅 19 岁的洛克菲勒决定不再为人打工,与比自己年长十岁的英裔商人 Maurice B. Clark 合伙创办 Clark & Rockefeller,从事农产品与肉类的佣金贸易和转运业务。洛克菲勒投入积蓄约 800 美元,并从父亲处借入 1,000 美元(按年利率 10% 偿还)作为启动资金。公司设在克利夫兰河边,利用城市铁路与水路枢纽优势,从事谷物、干草、肉类和杂货的买卖代理。第一年营业额即达约 45 万美元,净利润约 4,400 美元,证明了洛克菲勒对物流、成本控制和客户管理的天赋。这是他第一家公司,也标志着他从雇员到企业家的关键转型。",
    summary_en:
      "In 1859, at just 19, Rockefeller decided to stop working for others and co-founded Clark & Rockefeller with Maurice B. Clark, an English-born merchant a decade his senior, dealing in produce commission — grain, hay, meats, and sundries. Rockefeller contributed about $800 in savings and borrowed $1,000 from his father at 10 percent annual interest as seed capital. Located on Cleveland's riverfront and leveraging the city's rail-and-water hub, the firm grossed roughly $450,000 in its first year with about $4,400 in net profit, proving Rockefeller's gift for logistics, cost control, and client management. It was his first company and the pivotal step from employee to entrepreneur.",
    location: "Cleveland, Ohio",
    key: true,
    tags: ["founding", "produce", "first-company", "clark"],
    sources: [{ ...wikiRockefeller }, { ...britannicaRockefeller }],
    source_hints: null,
  },

  // ── 1863 moves to Euclid Avenue ──
  {
    id: "rockefeller-1863-euclid-avenue-mansion",
    person_id: "rockefeller",
    date: "1863-01-01",
    date_precision: "year",
    type: "life",
    title: "迁入克利夫兰欧几里得大道豪宅",
    title_en: "Moves to Euclid Avenue mansion in Cleveland",
    summary:
      "约 1863 年前后,洛克菲勒在克利夫兰著名的「百万富翁大道」(Millionaires' Row)——欧几里得大道(Euclid Avenue)上购入一栋宅邸。欧几里得大道在 19 世纪后半叶被誉为「全美最美的街道」,汇聚了克利夫兰工商精英的豪华住宅。洛克菲勒在此居住超过二十年,期间他的家族不断壮大,四女一子在这里出生和长大。这处居所也见证了他从一位中等规模的炼油商成长为美国石油工业绝对霸主的全过程。搬入欧几里得大道标志着年仅二十多岁的洛克菲勒已跻身克利夫兰上层社会,但他始终保持着节俭低调的生活方式。",
    summary_en:
      "Around 1863, Rockefeller purchased a home on Cleveland's Euclid Avenue, the famed 'Millionaires' Row' — considered 'the most beautiful street in America' in the late 19th century and lined with the mansions of Cleveland's industrial elite. He lived there for over two decades; his five children were born and raised in the house. The residence witnessed his entire ascent from a mid-sized refiner to the undisputed ruler of the American oil industry. Moving to Euclid Avenue signaled that the young man in his twenties had already entered Cleveland's upper echelons, though he maintained the frugal, understated lifestyle for which he was known.",
    location: "Cleveland, Ohio",
    key: false,
    tags: ["residence", "euclid-avenue", "cleveland"],
    sources: [{ ...wikiRockefeller }],
    source_hints: null,
  },

  // ── 1867 Rockefeller, Andrews & Flagler ──
  {
    id: "rockefeller-1867-andrews-flagler-partnership",
    person_id: "rockefeller",
    date: "1867-01-01",
    date_precision: "year",
    type: "founding",
    title: "Henry Flagler 加入,组建 Rockefeller, Andrews & Flagler",
    title_en: "Henry Flagler joins; Rockefeller, Andrews & Flagler formed",
    summary:
      "1867 年,洛克菲勒引入他最重要的商业盟友之一——Henry Morrison Flagler。Flagler 自带资金和人脉,更关键的是他在铁路运费谈判方面的天才。三人将合伙企业重组为 Rockefeller, Andrews & Flagler,迅速成为克利夫兰乃至全美最大的炼油企业。Flagler 主导与 Lake Shore Railroad 等铁路公司的秘密回扣谈判,以大批量保证运量换取远低于公开价的运费,使美孚在成本上获得碾压性优势。洛克菲勒后来称 Flagler 为「公司最伟大的资产」。这一合伙关系直接孕育了三年后 Standard Oil 的诞生,Flagler 也成为美孚核心决策层的灵魂人物之一。",
    summary_en:
      "In 1867 Rockefeller brought in one of his most important business allies — Henry Morrison Flagler. Flagler contributed capital and connections but, crucially, a genius for railroad freight negotiations. The trio reorganized as Rockefeller, Andrews & Flagler, quickly becoming the largest refinery in Cleveland and one of the biggest in the nation. Flagler spearheaded secret rebate deals with the Lake Shore Railroad and others, trading guaranteed high-volume shipments for freight rates far below published tariffs — giving Standard Oil a crushing cost advantage. Rockefeller later called Flagler 'the greatest asset the company had.' This partnership was the direct precursor to the 1870 founding of Standard Oil, and Flagler became one of its core strategic minds.",
    location: "Cleveland, Ohio",
    key: true,
    tags: ["founding", "flagler", "partnership", "rebates"],
    sources: [
      { ...wikiStandardOil },
      {
        id: "wikipedia-henry-flagler",
        url: "https://en.wikipedia.org/wiki/Henry_Flagler",
        kind: "article",
        title: "Henry Flagler",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
    ],
    source_hints: null,
  },

  // ── 1868 Lake Shore Railroad rebate deals ──
  {
    id: "rockefeller-1868-lake-shore-rebates",
    person_id: "rockefeller",
    date: "1868-01-01",
    date_precision: "year",
    type: "deal",
    title: "与 Lake Shore Railroad 达成秘密运费回扣协议",
    title_en: "Secures secret freight rebate deal with Lake Shore Railroad",
    summary:
      "1868 至 1869 年间,洛克菲勒和 Flagler 与 Cornelius Vanderbilt 控制的 Lake Shore and Michigan Southern Railway 达成里程碑式的秘密运费回扣协议:美孚承诺每天固定运出 60 车皮精炼油,铁路则给予远低于公开运价的优惠费率,并在每桶运费中返还一定金额的回扣。这种「以量换价」的策略在当时并不违法,但给予了美孚相对于小型竞争对手的巨大成本优势——小炼油商无法提供同等运量,因此无法获得同等费率。这一做法成为美孚后来系统性整合全国炼油业的核心武器,也是日后公众舆论和反托拉斯诉讼中最受争议的商业行为之一。",
    summary_en:
      "Between 1868 and 1869, Rockefeller and Flagler struck a landmark secret freight rebate deal with the Lake Shore and Michigan Southern Railway, controlled by Cornelius Vanderbilt. Standard Oil guaranteed 60 carloads of refined oil per day; in return, the railroad charged far below its published rates, rebating a fixed amount per barrel. This 'volume-for-price' strategy was not yet illegal but gave Standard Oil an enormous cost advantage over smaller competitors who could not match the volume and thus could not get the same rates. The practice became Standard Oil's core weapon in its systematic consolidation of the national refining industry and remained one of the most controversial business tactics in antitrust history.",
    location: "Cleveland, Ohio",
    key: true,
    tags: ["deal", "rebate", "railroad", "lake-shore"],
    sources: [{ ...wikiStandardOil }, { ...wikiRockefeller }],
    source_hints: null,
  },

  // ── 1873 Panic — buying distressed refineries ──
  {
    id: "rockefeller-1873-panic-buys-refineries",
    person_id: "rockefeller",
    date: "1873-09-01",
    date_precision: "month",
    type: "deal",
    title: "1873 年经济恐慌中大举收购廉价炼油厂",
    title_en: "Acquires distressed refineries during the Panic of 1873",
    summary:
      "1873 年 9 月,美国爆发严重经济恐慌(Panic of 1873),银行倒闭、铁路破产、工厂停工,全国经济陷入长达六年的「长萧条」(Long Depression)。对大多数企业而言这是灾难,但对现金充裕且管理高效的美孚石油而言却是千载难逢的扩张机遇。洛克菲勒利用其雄厚的现金储备和稳定的银行信用,以远低于正常价格的成本收购了大批面临破产的炼油厂,将它们整合进美孚体系。他的名言之一即来自这一时期:「逆境中的好运气,往往是之前准备好的结果。」到恐慌结束时,美孚已牢牢控制了美国炼油业的大部分产能,从一家地区性领军企业跃升为全国性垄断力量。",
    summary_en:
      "In September 1873 the United States plunged into the Panic of 1873 — banks failed, railroads collapsed, and factories shut down in what became the six-year 'Long Depression.' For most businesses it was catastrophic, but for cash-rich, efficiently managed Standard Oil it was a once-in-a-generation buying opportunity. Rockefeller used his deep cash reserves and solid bank credit to acquire bankrupt and distressed refineries at a fraction of their normal cost, folding them into the Standard Oil system. By the time the panic subsided, Standard Oil had consolidated control over much of U.S. refining capacity, leaping from a regional leader to a national monopoly force.",
    location: "Cleveland, Ohio",
    key: true,
    tags: ["deal", "panic-1873", "consolidation", "counter-cyclical"],
    sources: [{ ...wikiRockefeller }, { ...historyCom }],
    source_hints: null,
  },

  // ── 1878 controls 90% of US refining ──
  {
    id: "rockefeller-1878-controls-90pct-refining",
    person_id: "rockefeller",
    date: "1878-01-01",
    date_precision: "year",
    type: "other",
    title: "美孚控制美国 90% 以上的炼油产能",
    title_en: "Standard Oil controls over 90% of U.S. oil refining",
    summary:
      "到 1878 年,经过十余年的系统性收购、合并和垂直整合,美孚石油已经控制了美国约 90% 的石油精炼产能,同时大幅渗透到输油管道、铁路油罐车和石油运输等上下游环节。这一市场份额在美国工业史上史无前例。洛克菲勒通过三大策略实现了这一壮举:一是利用铁路回扣压低成本,二是在经济衰退中低价收购竞争对手,三是通过极致的效率管理(自制油桶、回收废料、优化炼化流程)降低生产成本至行业最低水平。美孚此时已不仅是一家公司,而是一个事实上的全国性石油垄断体。",
    summary_en:
      "By 1878, after more than a decade of systematic acquisitions, mergers, and vertical integration, Standard Oil controlled roughly 90 percent of U.S. oil refining capacity and had penetrated deeply into pipelines, railroad tank cars, and petroleum transport. This market share was unprecedented in American industrial history. Rockefeller achieved it through three main strategies: railroad rebates to suppress costs, counter-cyclical buying of competitors during economic downturns, and relentless operational efficiency — manufacturing his own barrels, recycling waste products, and optimizing refining processes to achieve the lowest production costs in the industry. Standard Oil was no longer merely a company; it was a de facto national oil monopoly.",
    location: "Cleveland, Ohio",
    key: true,
    tags: ["monopoly", "market-share", "consolidation"],
    sources: [{ ...wikiStandardOil }, { ...britannicaRockefeller }],
    source_hints: null,
  },

  // ── 1879 Trust Agreement drafted ──
  {
    id: "rockefeller-1879-trust-agreement-drafted",
    person_id: "rockefeller",
    date: "1879-01-01",
    date_precision: "year",
    type: "deal",
    title: "首版美孚石油托拉斯协议草拟",
    title_en: "First Standard Oil Trust Agreement drafted",
    summary:
      "1879 年,洛克菲勒的法律顾问 Samuel C.T. Dodd 草拟了美国历史上第一份「托拉斯协议」(Trust Agreement)的初稿,旨在解决美孚石油面临的核心法律难题:当时美国各州法律禁止一家公司在其注册州以外持有另一家公司的股份,而美孚的业务已遍及全国数十个州。Dodd 设计的方案是:各州子公司的股东将股份移交给一组「受托人」(trustees),由受托人统一持有并管理所有子公司,股东则按比例获得托拉斯的受益凭证(trust certificates)。这份草案经过两年多的修改完善,于 1882 年 1 月 2 日正式签署执行,成为美国「Trust」概念的法律源头。",
    summary_en:
      "In 1879, Rockefeller's attorney Samuel C.T. Dodd drafted the first version of the Standard Oil Trust Agreement, designed to solve a core legal problem: state laws prohibited corporations from holding shares in companies incorporated in other states, yet Standard Oil's operations spanned dozens of states. Dodd's innovation was to have stockholders of all subsidiary companies transfer their shares to a group of 'trustees' who would hold and manage all subsidiaries centrally, while stockholders received proportional trust certificates. After more than two years of refinement, the agreement was formally executed on January 2, 1882, becoming the legal origin of the American 'trust' concept.",
    location: "New York, New York",
    key: false,
    tags: ["trust", "corporate-law", "dodd"],
    sources: [{ ...wikiStandardOil }, { ...wikiRockefeller }],
    source_hints: null,
  },

  // ── 1884 donates to Spelman Seminary ──
  {
    id: "rockefeller-1884-spelman-seminary-donation",
    person_id: "rockefeller",
    date: "1884-01-01",
    date_precision: "year",
    type: "other",
    title: "向斯佩尔曼神学院捐款,以妻子家族姓氏命名",
    title_en: "Donates to Spelman Seminary, named after his wife's family",
    summary:
      "1884 年,洛克菲勒向亚特兰大的一所黑人女子学校(Atlanta Baptist Female Seminary)提供大额捐款。该校随后更名为 Spelman Seminary(后成为 Spelman College),以纪念洛克菲勒妻子劳拉·斯佩尔曼的家族——斯佩尔曼家族是积极参与地下铁路运动的废奴主义者。这是洛克菲勒最早的大额教育捐赠之一,也反映了他和劳拉对黑人教育事业的持久关注。Spelman College 后来发展成为美国最负盛名的历史性黑人女子文理学院(HBCU),培养了大量非裔美国女性领袖,包括 Alice Walker、Marian Wright Edelman 等。洛克菲勒家族对该校的资助持续了数十年。",
    summary_en:
      "In 1884 Rockefeller made a substantial donation to the Atlanta Baptist Female Seminary, a school for Black women. The school was subsequently renamed Spelman Seminary (later Spelman College) in honor of his wife Laura Spelman's family — the Spelmans had been active abolitionists involved in the Underground Railroad. This was one of Rockefeller's earliest major educational gifts and reflected the couple's enduring commitment to Black education. Spelman College grew into the most prestigious historically Black women's liberal-arts college (HBCU) in the United States, producing generations of African American women leaders including Alice Walker and Marian Wright Edelman. The Rockefeller family continued to support the school for decades.",
    location: "Atlanta, Georgia",
    key: true,
    tags: ["philanthropy", "education", "spelman", "hbcu"],
    sources: [
      { ...wikiRockefeller },
      {
        id: "wikipedia-spelman-college",
        url: "https://en.wikipedia.org/wiki/Spelman_College",
        kind: "article",
        title: "Spelman College",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
    ],
    source_hints: null,
  },

  // ── 1884 Forest Hill estate ──
  {
    id: "rockefeller-1884-forest-hill-estate",
    person_id: "rockefeller",
    date: "1884-01-01",
    date_precision: "year",
    type: "life",
    title: "购入 Forest Hill 庄园作为夏季避暑别墅",
    title_en: "Acquires Forest Hill estate in East Cleveland",
    summary:
      "1884 年,洛克菲勒在东克利夫兰购入 Forest Hill 庄园,将其改建为家族的夏季居所和休养地。这处占地约 700 英亩的庄园原本是一家失败的度假酒店,洛克菲勒以低价购入后大幅扩建,增设农场、花园、高尔夫球场和马车道。Forest Hill 成为洛克菲勒家族生活的核心场所之一,在这里他接待亲友、管理慈善事务并享受户外活动。庄园后来被洛克菲勒家族部分捐赠给克利夫兰高地(Cleveland Heights)和东克利夫兰(East Cleveland)两个城市,成为 Forest Hill Park 公共绿地,至今仍是该地区最重要的城市公园之一。",
    summary_en:
      "In 1884, Rockefeller acquired the Forest Hill estate in East Cleveland, converting it into the family's summer residence and retreat. The roughly 700-acre property had originally been a failed resort hotel; Rockefeller bought it cheaply and expanded it extensively, adding farms, gardens, a golf course, and carriage roads. Forest Hill became one of the family's principal residences, where Rockefeller entertained friends, managed his philanthropic affairs, and pursued outdoor recreation. The estate was later partially donated by the Rockefeller family to the cities of Cleveland Heights and East Cleveland, becoming Forest Hill Park — still one of the area's most important urban green spaces today.",
    location: "East Cleveland, Ohio",
    key: false,
    tags: ["residence", "forest-hill", "estate"],
    sources: [{ ...wikiRockefeller }],
    source_hints: null,
  },

  // ── 1885 HQ moves to 26 Broadway ──
  {
    id: "rockefeller-1885-26-broadway-hq",
    person_id: "rockefeller",
    date: "1885-01-01",
    date_precision: "year",
    type: "career",
    title: "美孚石油总部迁至纽约百老汇 26 号",
    title_en: "Standard Oil moves headquarters to 26 Broadway, New York",
    summary:
      "1885 年,美孚石油将总部从克利夫兰迁至纽约曼哈顿下城百老汇 26 号(26 Broadway),这座位于华尔街金融区核心地带的大楼成为美国镀金时代最具权势的商业地址之一。搬迁反映了美孚从一家中西部炼油企业成长为全球性石油帝国的现实:纽约是国际金融和航运中心,更便于管理遍布全球的子公司网络、协调国际出口业务和对接华尔街资本市场。洛克菲勒本人也将主要居所迁往纽约。「26 Broadway」此后成为美孚石油的代名词,直到 1911 年公司被强制拆分后,继承公司 Standard Oil of New Jersey(后来的 Exxon)仍以此为总部。",
    summary_en:
      "In 1885, Standard Oil relocated its headquarters from Cleveland to 26 Broadway in lower Manhattan, New York — making the address in the heart of Wall Street one of the most powerful business locations of the Gilded Age. The move reflected Standard Oil's evolution from a Midwestern refinery into a global petroleum empire: New York offered proximity to international finance, shipping, and capital markets essential for managing a worldwide network of subsidiaries and export operations. Rockefeller himself moved his primary residence to New York. '26 Broadway' became synonymous with Standard Oil and remained the headquarters of successor company Standard Oil of New Jersey (later Exxon) long after the 1911 breakup.",
    location: "New York, New York",
    key: true,
    tags: ["headquarters", "26-broadway", "new-york"],
    sources: [{ ...wikiStandardOil }, { ...wikiRockefeller }],
    source_hints: null,
  },

  // ── 1890 University of Chicago founded ──
  {
    id: "rockefeller-1890-university-of-chicago",
    person_id: "rockefeller",
    date: "1890-09-10",
    date_precision: "day",
    type: "founding",
    title: "出资创建芝加哥大学",
    title_en: "Founds the University of Chicago with Frederick T. Gates",
    summary:
      "1890 年,在顾问 Frederick T. Gates 和浸信会教育协会(American Baptist Education Society)的推动下,洛克菲勒承诺捐赠 60 万美元(后来累计捐赠达 3,500 万美元以上)用于在芝加哥创建一所世界级研究型大学。芝加哥大学(University of Chicago)于 1890 年 9 月 10 日获特许状,1892 年 10 月正式开学,首任校长 William Rainey Harper 将其定位为以研究生教育和学术研究为核心的「德国式」研究型大学,而非传统的美国本科文理学院。洛克菲勒坚持不让大学以自己名字命名,也拒绝干预学术事务。芝加哥大学此后成为全球顶尖学府,截至 21 世纪已培养出近 100 位诺贝尔奖得主,被视为洛克菲勒最成功的慈善投资之一。",
    summary_en:
      "In 1890, urged by adviser Frederick T. Gates and the American Baptist Education Society, Rockefeller pledged $600,000 (eventually donating over $35 million in total) to create a world-class research university in Chicago. The University of Chicago received its charter on September 10, 1890 and opened in October 1892 under founding president William Rainey Harper, who modeled it as a German-style research university centered on graduate education and scholarly inquiry rather than a traditional American undergraduate college. Rockefeller insisted the university not bear his name and refused to interfere in academic affairs. The University of Chicago became one of the world's great institutions, producing nearly 100 Nobel laureates by the 21st century, and is widely regarded as one of Rockefeller's most successful philanthropic investments.",
    location: "Chicago, Illinois",
    key: true,
    tags: ["philanthropy", "education", "university-of-chicago", "founding"],
    sources: [
      {
        id: "wikipedia-university-of-chicago",
        url: "https://en.wikipedia.org/wiki/University_of_Chicago",
        kind: "article",
        title: "University of Chicago",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
      { ...wikiRockefeller },
    ],
    source_hints: null,
  },

  // ── 1892 Ohio Supreme Court dissolves Trust ──
  {
    id: "rockefeller-1892-ohio-court-dissolves-trust",
    person_id: "rockefeller",
    date: "1892-03-02",
    date_precision: "day",
    type: "other",
    title: "俄亥俄州最高法院裁定解散美孚托拉斯",
    title_en: "Ohio Supreme Court orders dissolution of the Standard Oil Trust",
    summary:
      "1892 年 3 月 2 日,俄亥俄州最高法院在 State of Ohio v. Standard Oil Co. 案中裁定美孚石油托拉斯违反了俄亥俄州的公司法,命令 Standard Oil of Ohio 与托拉斯切断关系。法院认定信托协议构成了对贸易的不当限制,且超越了 Standard Oil of Ohio 在其公司章程下的合法权限。然而,这一判决的实际影响有限:洛克菲勒的律师团队迅速利用各种法律手段拖延执行,同时着手将控股架构迁移到公司法更为宽松的新泽西州。美孚在名义上解散了托拉斯,但实际上通过幕后协调继续保持统一控制,直到 1899 年以 Standard Oil of New Jersey 为控股公司的新架构正式建立。",
    summary_en:
      "On March 2, 1892, the Ohio Supreme Court ruled in State of Ohio v. Standard Oil Co. that the Standard Oil Trust violated Ohio corporate law and ordered Standard Oil of Ohio to sever its ties with the trust. The court found that the trust agreement constituted an improper restraint of trade and exceeded the lawful powers granted to Standard Oil of Ohio under its charter. In practice, however, the ruling had limited impact: Rockefeller's legal team delayed enforcement through various maneuvers while quietly preparing to migrate the holding structure to New Jersey, whose corporate laws were far more permissive. The trust was nominally dissolved, but Standard Oil maintained unified control through behind-the-scenes coordination until the new holding-company structure under Standard Oil of New Jersey was formalized in 1899.",
    location: "Columbus, Ohio",
    key: true,
    tags: ["antitrust", "court", "ohio", "dissolution"],
    sources: [{ ...wikiStandardOil }, { ...wikiRockefeller }],
    source_hints: null,
  },

  // ── 1899 Standard Oil of New Jersey holding company ──
  {
    id: "rockefeller-1899-standard-oil-nj-holding",
    person_id: "rockefeller",
    date: "1899-06-01",
    date_precision: "month",
    type: "founding",
    title: "以 Standard Oil of New Jersey 作为新控股公司重组",
    title_en: "Reorganizes under Standard Oil of New Jersey as holding company",
    summary:
      "1899 年,在俄亥俄州最高法院 1892 年解散托拉斯的判决压力下,洛克菲勒及其律师团队完成了美孚石油的法律架构转型:利用新泽西州 1889 年新通过的宽松公司法(允许一家公司持有其他公司的股份),将 Standard Oil Company of New Jersey(新泽西美孚)改组为控股公司(holding company),持有原托拉斯旗下所有子公司的股权。这种新的法人架构在法律形式上取代了已被法院禁止的托拉斯结构,但在实质上实现了完全相同的统一控制。新泽西美孚成为全球市值最高的公司之一,也是 1911 年最高法院拆分案的被告主体。这一案例还推动了新泽西州成为美国「公司避税天堂」的先驱。",
    summary_en:
      "In 1899, under pressure from the Ohio Supreme Court's 1892 order to dissolve the trust, Rockefeller and his legal team completed a structural transformation: leveraging New Jersey's permissive 1889 corporate law — which allowed one company to hold stock in others — they reorganized Standard Oil Company of New Jersey into a holding company that owned the shares of all former trust subsidiaries. This new corporate form legally replaced the court-banned trust structure while achieving exactly the same unified control. Jersey Standard became one of the most valuable companies on earth and the named defendant in the 1911 Supreme Court breakup. The maneuver also helped pioneer New Jersey's reputation as America's first corporate-law haven.",
    location: "Jersey City, New Jersey",
    key: true,
    tags: ["holding-company", "new-jersey", "corporate-structure"],
    sources: [
      { ...wikiStandardOil },
      {
        id: "wikipedia-standard-oil-nj",
        url: "https://en.wikipedia.org/wiki/Standard_Oil_of_New_Jersey",
        kind: "article",
        title: "Standard Oil of New Jersey",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
    ],
    source_hints: null,
  },

  // ── 1901 Rockefeller Institute for Medical Research ──
  {
    id: "rockefeller-1901-medical-research-institute",
    person_id: "rockefeller",
    date: "1901-06-14",
    date_precision: "day",
    type: "founding",
    title: "创立洛克菲勒医学研究所(今洛克菲勒大学)",
    title_en: "Founds Rockefeller Institute for Medical Research (now Rockefeller University)",
    summary:
      "1901 年 6 月 14 日,在顾问 Frederick T. Gates 的建议和亲身经历的推动下(Gates 在阅读 William Osler 的《医学原理与实践》后深受震撼,敦促洛克菲勒投资医学研究),洛克菲勒正式创建洛克菲勒医学研究所(Rockefeller Institute for Medical Research),是美国第一所专门从事生物医学研究的独立机构。初始捐赠 20 万美元,首任所长为 Simon Flexner。研究所迅速产出了一系列开创性成果:开发脊髓灰质炎(小儿麻痹症)血清、发现肺炎球菌类型、确立病毒是独立致病因子等。1965 年更名为洛克菲勒大学(Rockefeller University),截至 21 世纪已培养出 26 位诺贝尔奖得主,被视为现代生物医学研究的圣殿之一。",
    summary_en:
      "On June 14, 1901, at the urging of adviser Frederick T. Gates — who had been profoundly moved by reading William Osler's 'Principles and Practice of Medicine' and implored Rockefeller to invest in medical research — the Rockefeller Institute for Medical Research was formally established as the first independent biomedical research institution in the United States. Initially endowed with $200,000 and led by Simon Flexner, the institute quickly produced landmark breakthroughs: developing a serum for meningitis, classifying pneumococcal types, and establishing viruses as independent agents of disease. Renamed Rockefeller University in 1965, it has produced 26 Nobel laureates and is considered one of the temples of modern biomedical research.",
    location: "New York, New York",
    key: true,
    tags: ["philanthropy", "medicine", "founding", "rockefeller-university"],
    sources: [
      {
        id: "wikipedia-rockefeller-university",
        url: "https://en.wikipedia.org/wiki/Rockefeller_University",
        kind: "article",
        title: "Rockefeller University",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
      { ...wikiRockefeller },
    ],
    source_hints: null,
  },

  // ── 1901 retires to Pocantico Hills ──
  {
    id: "rockefeller-1901-pocantico-hills-estate",
    person_id: "rockefeller",
    date: "1901-01-01",
    date_precision: "year",
    type: "life",
    title: "退休后定居 Pocantico Hills 庄园(Kykuit)",
    title_en: "Retires to Pocantico Hills estate (Kykuit) in Westchester County",
    summary:
      "1901 年前后,已经从美孚石油日常管理中退出的洛克菲勒将生活重心转移到纽约州威斯特切斯特郡的 Pocantico Hills 庄园。这处占地约 3,400 英亩(后来扩展至近 4,000 英亩)的庄园坐落在哈德逊河畔,主宅名为 Kykuit(荷兰语意为「瞭望」),是一座六层石砌别墅,可俯瞰塔潘泽湾和哈德逊河谷。洛克菲勒在此处度过了退休后的大部分时光,打高尔夫球、驾驶马车、管理慈善事务。Kykuit 后来成为四代洛克菲勒家族的核心居所,现已开放为历史遗迹,由国家信托基金(National Trust for Historic Preservation)管理,供公众参观。",
    summary_en:
      "Around 1901, having stepped back from active management of Standard Oil, Rockefeller shifted his life to the Pocantico Hills estate in Westchester County, New York. The roughly 3,400-acre property (later expanded to nearly 4,000 acres) sits above the Hudson River, with the main house — Kykuit (Dutch for 'lookout') — a six-story stone mansion commanding views of the Tappan Zee and the Hudson Valley. Rockefeller spent most of his retirement years there, playing golf, driving horse-drawn carriages, and managing his philanthropic affairs. Kykuit served as the principal seat for four generations of Rockefellers and is now a historic site open to the public under the National Trust for Historic Preservation.",
    location: "Pocantico Hills, New York",
    key: false,
    tags: ["residence", "kykuit", "pocantico-hills", "retirement"],
    sources: [{ ...wikiRockefeller }, { ...britannicaRockefeller }],
    source_hints: null,
  },

  // ── 1902 General Education Board ──
  {
    id: "rockefeller-1902-general-education-board",
    person_id: "rockefeller",
    date: "1902-01-12",
    date_precision: "day",
    type: "founding",
    title: "创立普通教育委员会(General Education Board)",
    title_en: "Founds the General Education Board",
    summary:
      "1902 年 1 月 12 日,洛克菲勒出资创建普通教育委员会(General Education Board, GEB),由 Frederick T. Gates 担任董事会主席。GEB 获得国会特许状,初始捐赠 100 万美元,后来累计接受洛克菲勒捐赠超过 1.29 亿美元。委员会的核心使命是提升美国教育质量,尤其关注南方各州长期落后的公共教育体系和黑人教育。GEB 资助了数百所南方乡村学校的建设、教师培训项目和农业推广教育,同时也向全国大学和医学院提供配套捐赠(matching grants),推动高等教育机构提高教学和研究水平。GEB 运营至 1964 年,被认为是美国教育慈善史上影响最深远的机构之一。",
    summary_en:
      "On January 12, 1902, Rockefeller established the General Education Board (GEB), with Frederick T. Gates as chairman. Chartered by Congress and initially endowed with $1 million — eventually receiving over $129 million from Rockefeller — the GEB's core mission was to improve American education, with particular focus on the lagging public school systems and Black education in the southern states. The Board funded the construction of hundreds of rural southern schools, teacher training programs, and agricultural extension education, while also providing matching grants to universities and medical schools nationwide to raise their standards of teaching and research. The GEB operated until 1964 and is considered one of the most consequential institutions in the history of American educational philanthropy.",
    location: "New York, New York",
    key: true,
    tags: ["philanthropy", "education", "general-education-board", "founding"],
    sources: [
      {
        id: "wikipedia-general-education-board",
        url: "https://en.wikipedia.org/wiki/General_Education_Board",
        kind: "article",
        title: "General Education Board",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
      { ...rockefellerArchive },
    ],
    source_hints: null,
  },

  // ── 1904 Tarbell book published as volume ──
  {
    id: "rockefeller-1904-tarbell-book-published",
    person_id: "rockefeller",
    date: "1904-11-01",
    date_precision: "month",
    type: "other",
    title: "Ida Tarbell《美孚石油公司史》出版完整版两卷本",
    title_en: "Ida Tarbell's 'History of the Standard Oil Company' published as complete two-volume book",
    summary:
      "1904 年 11 月,Ida Tarbell 在 McClure's Magazine 上连载两年的调查报道《The History of the Standard Oil Company》正式结集出版为两卷本书(由 McClure, Phillips & Co. 出版)。全书共 19 章附大量附录,详尽记录了美孚从克利夫兰小炼油厂崛起为全国垄断体的全过程,系统揭露了回扣协议、South Improvement Company 阴谋、商业间谍和对独立生产商的打压等行为。此书成为美国「扒粪运动」(muckraking)的标志性作品,被评为 20 世纪最重要的新闻作品之一。它极大地激发了公众对大企业的不信任情绪,直接推动了联邦政府于 1906 年对美孚提起反垄断诉讼。",
    summary_en:
      "In November 1904, Ida Tarbell's two-year serialized investigation 'The History of the Standard Oil Company' was published as a complete two-volume book by McClure, Phillips & Co. Spanning 19 chapters with extensive appendices, it documented Standard Oil's rise from a small Cleveland refinery to a national monopoly, systematically exposing secret rebate deals, the South Improvement Company conspiracy, commercial espionage, and the crushing of independent producers. The book became the iconic work of the American 'muckraking' movement and has been ranked among the most important works of journalism in the 20th century. It galvanized public distrust of big business and directly spurred the federal government to file antitrust charges against Standard Oil in 1906.",
    location: "New York, New York",
    key: false,
    tags: ["journalism", "tarbell", "muckraking", "book"],
    sources: [
      {
        id: "wikipedia-tarbell-history",
        url: "https://en.wikipedia.org/wiki/The_History_of_the_Standard_Oil_Company",
        kind: "article",
        title: "The History of the Standard Oil Company",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
    ],
    source_hints: null,
  },

  // ── 1905-1909 William O. Inglis interviews ──
  {
    id: "rockefeller-1905-inglis-interviews",
    person_id: "rockefeller",
    date: "1905-01-01",
    date_precision: "year",
    type: "interview",
    title: "接受 William O. Inglis 长期私人采访(1905-1909)",
    title_en: "Private interview sessions with journalist William O. Inglis (1905-1909)",
    summary:
      "1905 年至 1909 年间,洛克菲勒与纽约《世界报》(New York World)记者 William O. Inglis 进行了一系列广泛的私人采访对话。这些会谈是洛克菲勒一生中最坦率、最详尽的口述记录,涵盖他的童年、商业哲学、美孚石油的战略决策、对竞争对手的看法以及他对 Ida Tarbell 攻击的辩护。与他公开发表的节制言论不同,Inglis 采访中的洛克菲勒展现出更丰富的个性和更直接的表达。这些采访记录手稿现保存于洛克菲勒档案中心(Rockefeller Archive Center),是研究洛克菲勒真实思想和决策过程最重要的一手史料,也是 Ron Chernow 撰写传记《Titan》的核心素材之一。",
    summary_en:
      "Between 1905 and 1909, Rockefeller sat for an extensive series of private interview sessions with William O. Inglis, a journalist from the New York World. These conversations constitute the most candid and comprehensive oral record of Rockefeller's life, covering his childhood, business philosophy, Standard Oil's strategic decisions, his views of competitors, and his defense against Ida Tarbell's attacks. Unlike his guarded public statements, the Inglis interviews reveal a more complex personality and more direct expression. The interview manuscripts are preserved at the Rockefeller Archive Center and remain the single most important primary source for understanding Rockefeller's true thinking and decision-making processes — and a key source for Ron Chernow's biography 'Titan.'",
    location: "New York, New York",
    key: true,
    tags: ["interview", "inglis", "primary-source", "oral-history"],
    sources: [
      { ...rockefellerArchive },
      { ...wikiRockefeller },
    ],
    source_hints: null,
  },

  // ── 1908 Random Reminiscences published ──
  {
    id: "rockefeller-1908-random-reminiscences",
    person_id: "rockefeller",
    date: "1908-01-01",
    date_precision: "year",
    type: "writing",
    title: "出版自传《Random Reminiscences of Men and Events》",
    title_en: "Publishes autobiography 'Random Reminiscences of Men and Events'",
    summary:
      "1908 年,69 岁的洛克菲勒出版了他唯一的一部自传性著作《Random Reminiscences of Men and Events》(《往事随想:人与事》)。全书篇幅不长,先在《世界工作》(The World's Work)杂志上连载,后结集出版。书中洛克菲勒以从容克制的语调回忆了自己的早期生涯、美孚石油的成长历程、对慈善事业的看法以及对商业伦理的思考。他着重阐述了商业整合的合理性,为美孚的垄断行为辩护,认为大规模经营可以降低成本、提高效率,最终惠及消费者。然而他刻意回避了铁路回扣、克利夫兰大屠杀等争议性话题。这本书是了解洛克菲勒自我叙事和公关策略的重要文本,也是少数由镀金时代巨头亲笔留下的一手文献之一。",
    summary_en:
      "In 1908, the 69-year-old Rockefeller published his only autobiographical work, 'Random Reminiscences of Men and Events.' The relatively brief book was first serialized in The World's Work magazine, then published as a volume. In measured, restrained tones Rockefeller recalled his early career, Standard Oil's growth, his views on philanthropy, and his thoughts on business ethics. He emphasized the rationality of industrial consolidation, defending Standard Oil's monopoly practices as reducing costs, improving efficiency, and ultimately benefiting consumers — while carefully avoiding controversial topics like railroad rebates and the Cleveland Massacre. The book remains an important text for understanding Rockefeller's self-narrative and PR strategy, and one of the few firsthand documents left by a Gilded Age titan.",
    location: "New York, New York",
    key: true,
    tags: ["writing", "autobiography", "self-narrative"],
    sources: [
      { ...wikiRockefeller },
      {
        id: "gutenberg-random-reminiscences",
        url: "https://www.gutenberg.org/ebooks/17090",
        kind: "document",
        title: "Random Reminiscences of Men and Events",
        publisher: "Project Gutenberg",
        lang: "en",
        primary: true,
        license: "public-domain",
        authored_by: "human",
        mentions: [],
      },
    ],
    source_hints: null,
  },

  // ── 1913-09-04 Laura Spelman death ──
  {
    id: "rockefeller-1915-03-12-laura-spelman-death",
    person_id: "rockefeller",
    date: "1915-03-12",
    date_precision: "day",
    type: "life",
    title: "妻子劳拉·斯佩尔曼·洛克菲勒去世",
    title_en: "Wife Laura Spelman Rockefeller dies",
    summary:
      "1915 年 3 月 12 日,洛克菲勒的妻子劳拉·塞莱斯蒂亚·斯佩尔曼·洛克菲勒在 Pocantico Hills 庄园去世,享年 75 岁。两人自 1864 年结婚以来共同生活了 51 年,劳拉始终是洛克菲勒最亲密的伴侣和最信任的顾问。她一生支持废奴运动和黑人教育事业,是推动洛克菲勒向斯佩尔曼学院等机构捐赠的重要力量。她的去世令洛克菲勒悲痛欲绝,此后他在冬季居住佛罗里达的时间越来越长。1918 年,为纪念亡妻,小约翰·D·洛克菲勒建立了劳拉·斯佩尔曼·洛克菲勒纪念基金(Laura Spelman Rockefeller Memorial),专注于社会科学和儿童福利研究资助。",
    summary_en:
      "On March 12, 1915, Rockefeller's wife Laura Celestia Spelman Rockefeller died at the Pocantico Hills estate at age 75. The couple had been married for 51 years since 1864, and Laura had been Rockefeller's closest companion and most trusted adviser throughout. A lifelong advocate of abolitionism and Black education, she was an instrumental force behind Rockefeller's donations to Spelman College and other institutions. Her death devastated Rockefeller, who increasingly spent winters in Florida thereafter. In 1918, John D. Rockefeller Jr. established the Laura Spelman Rockefeller Memorial in her honor, dedicated to funding social science and child welfare research.",
    location: "Pocantico Hills, New York",
    key: true,
    tags: ["life", "death", "laura-spelman", "family"],
    sources: [
      {
        id: "wikipedia-laura-spelman",
        url: "https://en.wikipedia.org/wiki/Laura_Spelman_Rockefeller",
        kind: "article",
        title: "Laura Spelman Rockefeller",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
      { ...wikiRockefeller },
    ],
    source_hints: null,
  },

  // ── 1918 Laura Spelman Rockefeller Memorial Fund ──
  {
    id: "rockefeller-1918-laura-spelman-memorial",
    person_id: "rockefeller",
    date: "1918-10-24",
    date_precision: "day",
    type: "founding",
    title: "创建劳拉·斯佩尔曼·洛克菲勒纪念基金",
    title_en: "Laura Spelman Rockefeller Memorial Fund established",
    summary:
      "1918 年 10 月 24 日,小约翰·D·洛克菲勒以洛克菲勒家族的名义创建劳拉·斯佩尔曼·洛克菲勒纪念基金(Laura Spelman Rockefeller Memorial, LSRM),以纪念 1915 年去世的洛克菲勒夫人。基金初始捐赠约 7,400 万美元,成为当时世界上最大的慈善基金之一。在主管 Beardsley Ruml 的领导下,LSRM 开创性地资助了社会科学研究,被认为是将社会科学确立为现代学术学科的关键推手——它资助了芝加哥大学社会科学研究委员会(SSRC)、全国经济研究局(NBER)等机构的创建和运营,并推动了儿童发展研究和家庭福利项目。1929 年 LSRM 并入洛克菲勒基金会。",
    summary_en:
      "On October 24, 1918, John D. Rockefeller Jr. established the Laura Spelman Rockefeller Memorial (LSRM) in honor of his mother, who had died in 1915. Initially endowed with approximately $74 million, it became one of the largest charitable funds in the world. Under director Beardsley Ruml, the LSRM pioneered funding for social science research and is credited as a pivotal force in establishing the social sciences as modern academic disciplines — it funded the creation and operations of the Social Science Research Council (SSRC), the National Bureau of Economic Research (NBER), and other institutions, and promoted child development research and family welfare programs. The LSRM was folded into the Rockefeller Foundation in 1929.",
    location: "New York, New York",
    key: false,
    tags: ["philanthropy", "memorial", "social-science", "laura-spelman"],
    sources: [
      {
        id: "wikipedia-lsrm",
        url: "https://en.wikipedia.org/wiki/Laura_Spelman_Rockefeller_Memorial",
        kind: "article",
        title: "Laura Spelman Rockefeller Memorial",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
      { ...rockefellerArchive },
    ],
    source_hints: null,
  },

  // ── 1930 Rockefeller Center construction begins ──
  {
    id: "rockefeller-1930-rockefeller-center-construction",
    person_id: "rockefeller",
    date: "1930-09-01",
    date_precision: "month",
    type: "other",
    title: "洛克菲勒中心动工建设",
    title_en: "Rockefeller Center construction begins",
    summary:
      "1930 年 9 月,小约翰·D·洛克菲勒主导的洛克菲勒中心(Rockefeller Center)在曼哈顿中城正式动工。这一项目原计划为大都会歌剧院新址,但 1929 年股市崩盘后歌剧院退出,小洛克菲勒决定独力推进这一史上最大的私人城市开发项目。该综合体最终包括 14 栋装饰艺术(Art Deco)风格的商业大楼,核心建筑为 70 层的 30 Rockefeller Plaza(即 GE/Comcast 大楼)。在大萧条最严重的年代,这一项目雇用了约 4 万名工人,成为当时美国最大的私人就业来源之一。虽然项目以小洛克菲勒的名义主导,但老洛克菲勒提供了关键的财务支持,这也是洛克菲勒家族在城市建设和房地产领域最宏大的遗产。",
    summary_en:
      "In September 1930, construction began on Rockefeller Center in Midtown Manhattan, led by John D. Rockefeller Jr. Originally planned as the new site for the Metropolitan Opera, the project lost its anchor tenant after the 1929 stock-market crash, but Rockefeller Jr. decided to proceed alone with what became the largest private urban development in history. The complex ultimately comprised 14 Art Deco commercial buildings, anchored by the 70-story 30 Rockefeller Plaza (GE/Comcast Building). During the worst years of the Great Depression, the project employed roughly 40,000 workers, making it one of the nation's largest private sources of employment. Though led by Rockefeller Jr., the elder Rockefeller provided crucial financial backing, and the center remains the Rockefeller family's grandest legacy in urban development and real estate.",
    location: "New York, New York",
    key: true,
    tags: ["real-estate", "rockefeller-center", "art-deco", "depression"],
    sources: [
      {
        id: "wikipedia-rockefeller-center",
        url: "https://en.wikipedia.org/wiki/Rockefeller_Center",
        kind: "article",
        title: "Rockefeller Center",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
      { ...wikiRockefeller },
    ],
    source_hints: null,
  },

  // ── 1933 Rockefeller Center opens ──
  {
    id: "rockefeller-1933-rockefeller-center-opens",
    person_id: "rockefeller",
    date: "1933-11-01",
    date_precision: "month",
    type: "other",
    title: "洛克菲勒中心首批建筑开放",
    title_en: "Rockefeller Center first buildings open to public",
    summary:
      "1933 年,洛克菲勒中心的核心建筑群陆续竣工并向公众开放,其中包括标志性的 RCA Building(30 Rockefeller Plaza,后更名为 GE Building,现为 Comcast Building)。整个综合体的建设持续到 1939 年才全部完成。洛克菲勒中心以其统一的装饰艺术风格、下沉广场(冬季变为溜冰场)、巨幅壁画和雕塑装饰,成为纽约市最标志性的地标之一,也成为城市综合体规划的全球典范。1987 年洛克菲勒中心被列为国家历史地标(National Historic Landmark)。洛克菲勒家族最初投入约 1 亿美元建造该中心,经历了大萧条年代的巨大财务压力,但最终成为美国房地产史上最成功的长期投资之一。",
    summary_en:
      "In 1933, the core buildings of Rockefeller Center opened to the public, including the iconic RCA Building (30 Rockefeller Plaza, later renamed the GE Building, now the Comcast Building). The full complex was completed by 1939. With its unified Art Deco style, sunken plaza (converted to an ice rink in winter), monumental murals and sculptures, Rockefeller Center became one of New York City's most iconic landmarks and a global model for urban mixed-use development. It was designated a National Historic Landmark in 1987. The Rockefeller family invested roughly $100 million to build the center, enduring enormous financial pressure during the Depression years, but it ultimately proved one of the most successful long-term investments in American real-estate history.",
    location: "New York, New York",
    key: false,
    tags: ["real-estate", "rockefeller-center", "landmark"],
    sources: [
      {
        id: "wikipedia-rockefeller-center",
        url: "https://en.wikipedia.org/wiki/Rockefeller_Center",
        kind: "article",
        title: "Rockefeller Center",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
    ],
    source_hints: null,
  },
];

// ── Merge & sort ──
let added = 0;
for (const ev of newEvents) {
  if (!existingIds.has(ev.id)) {
    events.push(ev);
    existingIds.add(ev.id);
    added++;
    console.log(`  + ${ev.id}`);
  } else {
    console.log(`  = skip (exists) ${ev.id}`);
  }
}

events.sort((a, b) => a.date.localeCompare(b.date));

fs.writeFileSync(filePath, JSON.stringify(events, null, 2) + "\n");
console.log(`\nDone: added ${added} events, total ${events.length} events in ${filePath}`);
