#!/usr/bin/env node
/**
 * Comprehensive expansion of Elon Musk timeline.
 * Adds ~30 new events covering early life, education, products, speeches,
 * interviews, and milestones not yet in the database.
 *
 * Idempotent: skips events whose id already exists.
 * After running, run audit-urls.mjs --write + parse-youtube.mjs --write.
 */
import fs from "node:fs";
import path from "node:path";

const filePath = path.join(process.cwd(), "data", "events", "musk.json");
const events = JSON.parse(fs.readFileSync(filePath, "utf8"));
const existingIds = new Set(events.map((e) => e.id));

const HUMAN = { license: "all-rights-reserved", authored_by: "human", mentions: [] };
const CCBYSA = { license: "cc-by-sa", authored_by: "human", mentions: [] };

const wikiMusk = {
  id: "wikipedia-musk-bio",
  url: "https://en.wikipedia.org/wiki/Elon_Musk",
  kind: "article",
  title: "Elon Musk (Wikipedia)",
  publisher: "Wikipedia",
  lang: "en",
  primary: false,
  ...CCBYSA,
};

const newEvents = [
  // ============ 1989 — Moves to Canada ============
  {
    id: "musk-1989-06-move-to-canada",
    person_id: "musk",
    date: "1989-06-01",
    date_precision: "month",
    type: "life",
    title: "17 岁离开南非，只身前往加拿大",
    title_en: "Leaves South Africa for Canada at age 17",
    summary:
      "17 岁的 Musk 拿到加拿大护照后独自离开南非，落地蒙特利尔。他想去美国，而加拿大是跳板——他的母亲 Maye 出生在加拿大。抵达后他在 Saskatchewan 省的亲戚农场干体力活、在木材厂打工，吃了不少苦。一年后他进入安大略省的 Queen's University 读书。离开南非的直接原因包括逃避南非征兵制度和对种族隔离制度的不满。",
    summary_en:
      "At 17, Musk left South Africa alone with a Canadian passport (his mother Maye was Canadian-born). He arrived in Montreal, worked odd jobs on a relative's farm in Saskatchewan and at a lumber mill before enrolling at Queen's University in Ontario. He later said he left partly to avoid conscription under apartheid.",
    location: "Montreal, QC, Canada",
    key: true,
    tags: ["移民", "加拿大", "人生转折"],
    sources: [{ ...wikiMusk }],
    source_hints: "Ashlee Vance 传记第 3 章",
  },

  // ============ 1992 — Transfers to UPenn ============
  {
    id: "musk-1992-upenn-transfer",
    person_id: "musk",
    date: "1992-09-01",
    date_precision: "month",
    type: "education",
    title: "转入宾夕法尼亚大学，主修经济学与物理学",
    title_en: "Transfers to University of Pennsylvania (Economics & Physics)",
    summary:
      "在 Queen's University 读了两年后转入宾大沃顿商学院，最终获得经济学学士学位，同时在文理学院拿到物理学学士。UPenn 时期的 Musk 已经开始和同学 Adeo Ressi 一起搞商业项目——他们把租来的学生公寓改造成非法夜店，周末卖票给几百个人。这段经历奠定了他同时兼具商业直觉和工程思维的双重基因。",
    summary_en:
      "After two years at Queen's University, Musk transferred to the University of Pennsylvania where he earned dual bachelor's degrees in Economics (Wharton) and Physics. During this time he and classmate Adeo Ressi famously ran an unlicensed nightclub out of their student house.",
    location: "Philadelphia, PA",
    key: false,
    tags: ["教育", "UPenn", "沃顿"],
    sources: [{ ...wikiMusk }],
    source_hints: null,
  },

  // ============ 2008-02 — Tesla Roadster first deliveries ============
  {
    id: "musk-2008-02-tesla-roadster",
    person_id: "musk",
    date: "2008-02-01",
    date_precision: "month",
    type: "product",
    title: "Tesla Roadster 开始交付——史上第一款量产锂电池电动跑车",
    title_en: "Tesla Roadster begins deliveries — first production lithium-ion EV",
    summary:
      "Tesla Roadster 正式开始向客户交付，这是世界上第一款采用锂离子电池组的量产公路电动汽车。基于 Lotus Elise 底盘改造，0-60 mph 加速约 3.9 秒，续航约 245 英里。总共生产了约 2,450 辆。Roadster 证明了电动车可以既快又有型，为整个电动汽车行业打开了一扇门——尽管它的开发过程充满成本超支和工程危机。",
    summary_en:
      "Tesla Roadster began customer deliveries — the world's first highway-legal, production electric car powered by lithium-ion batteries. Based on a Lotus Elise chassis, it did 0-60 mph in ~3.9 seconds with ~245 miles of range. About 2,450 units were produced.",
    location: "San Carlos, CA",
    key: true,
    tags: ["Tesla", "Roadster", "电动汽车", "里程碑"],
    sources: [
      {
        id: "wikipedia-tesla-roadster-gen1",
        url: "https://en.wikipedia.org/wiki/Tesla_Roadster_(first_generation)",
        kind: "article",
        title: "Tesla Roadster (first generation) (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
    ],
    source_hints: null,
  },

  // ============ 2010-06-04 — Falcon 9 first flight ============
  {
    id: "musk-2010-06-04-falcon-9-first-flight",
    person_id: "musk",
    date: "2010-06-04",
    date_precision: "day",
    type: "product",
    title: "Falcon 9 首次发射成功",
    title_en: "Falcon 9 first flight succeeds",
    summary:
      "SpaceX 的中型运载火箭 Falcon 9 从 Cape Canaveral SLC-40 首次发射，搭载 Dragon 飞船资质模型。发射圆满成功，标志着 SpaceX 从小型 Falcon 1 跨越到真正具备商业运力的主力火箭。这也是 NASA 商业轨道运输服务（COTS）计划的关键验证。Falcon 9 此后成为全球发射次数最多的现役火箭。",
    summary_en:
      "SpaceX's Falcon 9 medium-lift rocket launched successfully for the first time from Cape Canaveral SLC-40, carrying a Dragon spacecraft qualification unit. This validated SpaceX's jump from the small Falcon 1 to a commercially viable workhorse rocket under NASA's COTS program.",
    location: "Cape Canaveral SLC-40, FL",
    key: true,
    tags: ["SpaceX", "Falcon 9", "首飞"],
    sources: [
      {
        id: "wikipedia-falcon-9-v1-flight-1",
        url: "https://en.wikipedia.org/wiki/Falcon_9_v1.0",
        kind: "article",
        title: "Falcon 9 v1.0 (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
    ],
    source_hints: null,
  },

  // ============ 2012-06 — Model S deliveries begin ============
  {
    id: "musk-2012-06-22-model-s-delivery",
    person_id: "musk",
    date: "2012-06-22",
    date_precision: "day",
    type: "product",
    title: "Model S 开始交付——Tesla 从小众跑车走向大众豪华轿车",
    title_en: "Model S deliveries begin",
    summary:
      "Tesla 在 Fremont 工厂举办交付仪式，首批 Model S 交到客户手中。这款全尺寸豪华电动轿车续航 265 英里（85 kWh 版本），被 Motor Trend 评为 2013 年度汽车——这是非内燃机汽车首次获此殊荣。Model S 彻底改变了人们对电动车的认知：它不再是妥协的代名词，而是同级最快、最安全、最先进的车。Model S 的成功让 Tesla 从利基玩家变成了主流汽车制造商。",
    summary_en:
      "First Model S sedans delivered to customers at the Fremont factory. The full-size luxury EV offered 265 miles of range and was later named Motor Trend's 2013 Car of the Year — the first non-ICE vehicle to win. Model S proved EVs could compete at the top of the market.",
    location: "Fremont, CA",
    key: true,
    tags: ["Tesla", "Model S", "里程碑"],
    sources: [
      {
        id: "wikipedia-tesla-model-s",
        url: "https://en.wikipedia.org/wiki/Tesla_Model_S",
        kind: "article",
        title: "Tesla Model S (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
    ],
    source_hints: null,
  },

  // ============ 2013-02 — TED Talk ============
  {
    id: "musk-2013-02-27-ted-talk",
    person_id: "musk",
    date: "2013-02-27",
    date_precision: "day",
    type: "speech",
    title: "TED 演讲「Tesla、SpaceX、SolarCity 背后的思维」",
    title_en: "TED Talk: \"The mind behind Tesla, SpaceX, SolarCity\"",
    summary:
      "Musk 在 TED 2013 大会上接受 Chris Anderson 的舞台访谈。他详细阐述了 Tesla 的\"三步走\"战略（先做跑车、再做中端车、最终做大众车）、SpaceX 的火箭可复用蓝图和火星殖民时间表，以及 SolarCity 的分布式太阳能愿景。这场演讲第一次系统地把他三家公司的使命串在一起——\"加速世界向可持续能源的过渡\"和\"让人类成为多星球物种\"——在技术界和投资界产生了巨大影响。",
    summary_en:
      "At TED 2013, Musk laid out the grand visions for Tesla, SpaceX, and SolarCity in a single on-stage interview with Chris Anderson. He described Tesla's three-step plan, SpaceX's reusable rocket roadmap, and SolarCity's distributed solar vision — the first time the three missions were woven together publicly.",
    location: "Long Beach, CA",
    key: true,
    tags: ["TED", "演讲", "Tesla", "SpaceX", "SolarCity"],
    sources: [
      {
        id: "youtube-musk-ted-2013",
        url: "https://www.youtube.com/watch?v=IgKWPdJWuBQ",
        kind: "video",
        title: "Elon Musk: The mind behind Tesla, SpaceX, SolarCity | TED",
        publisher: "TED (YouTube)",
        lang: "en",
        primary: true,
        ...HUMAN,
      },
    ],
    source_hints: null,
  },

  // ============ 2013-08-12 — Hyperloop white paper ============
  {
    id: "musk-2013-08-12-hyperloop",
    person_id: "musk",
    date: "2013-08-12",
    date_precision: "day",
    type: "writing",
    title: "发布 Hyperloop Alpha 白皮书",
    title_en: "Publishes Hyperloop Alpha white paper",
    summary:
      "Musk 在 SpaceX 和 Tesla 官网上发布了 57 页的《Hyperloop Alpha》白皮书，提出一种在近真空管道中以超音速运输乘客的新型交通概念——洛杉矶到旧金山只需 35 分钟。他本人声称没有时间亲自建造，所以把设计开源。白皮书激发了多家初创公司（Hyperloop One、HTT 等）投入数十亿美元尝试商业化，虽然至今没有一条运营线路，但 Hyperloop 概念本身已经成为交通工程界最具争议和想象力的提案之一。",
    summary_en:
      "Musk published the 57-page Hyperloop Alpha white paper on the SpaceX and Tesla websites, proposing near-supersonic passenger transport in low-pressure tubes — LA to SF in 35 minutes. He open-sourced the design, sparking multiple startups (Hyperloop One, HTT) and billions in investment.",
    location: "Hawthorne, CA",
    key: true,
    tags: ["Hyperloop", "白皮书", "交通"],
    sources: [
      {
        id: "wikipedia-hyperloop",
        url: "https://en.wikipedia.org/wiki/Hyperloop",
        kind: "article",
        title: "Hyperloop (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
    ],
    source_hints: "原始白皮书: https://www.spacex.com/hyperloop",
  },

  // ============ 2014-10-24 — MIT AeroAstro interview ============
  {
    id: "musk-2014-10-24-mit-interview",
    person_id: "musk",
    date: "2014-10-24",
    date_precision: "day",
    type: "interview",
    title: "MIT AeroAstro 百年论坛访谈",
    title_en: "MIT AeroAstro Centennial Symposium interview",
    summary:
      "Musk 在 MIT 航空航天工程系百年庆典上接受长篇访谈。他讨论了火箭可复用的工程挑战、对 AI 的担忧（称 AI 是\"人类最大的生存性威胁\"，引发广泛争议），以及太空殖民的哲学基础。这场访谈因为他把 AI 比作\"召唤恶魔\"而登上各大媒体头条，是 Musk 作为 AI 风险预警者角色的早期关键时刻。",
    summary_en:
      "At MIT's AeroAstro Centennial Symposium, Musk discussed reusable rockets, AI safety (calling AI \"our biggest existential threat\" and comparing it to \"summoning the demon\"), and the philosophy of space colonization. The AI comments made global headlines.",
    location: "Cambridge, MA",
    key: false,
    tags: ["采访", "MIT", "AI", "SpaceX"],
    sources: [
      {
        id: "youtube-musk-mit-2014",
        url: "https://www.youtube.com/watch?v=h97fXhDN5qE",
        kind: "video",
        title: "Elon Musk | MIT AeroAstro Centennial Symposium (2014)",
        publisher: "MIT AeroAstro (YouTube)",
        lang: "en",
        primary: true,
        ...HUMAN,
      },
    ],
    source_hints: null,
  },

  // ============ 2015-09-29 — Model X launch ============
  {
    id: "musk-2015-09-29-model-x-launch",
    person_id: "musk",
    date: "2015-09-29",
    date_precision: "day",
    type: "product",
    title: "Tesla Model X 正式交付——带鹰翼门的电动 SUV",
    title_en: "Tesla Model X deliveries begin",
    summary:
      "Tesla 在 Fremont 工厂举办 Model X 交付活动，首批车辆交到客户手中。Model X 是全球第一款量产全电动 SUV，最引人注目的是其标志性的\"鹰翼门\"（Falcon Wing doors）——但这个设计也成为量产地狱的源头，导致交付时间表严重滞后。尽管如此，Model X 以其七座布局、生化武器防御模式空气过滤和全轮驱动性能，成功填补了 Tesla 在 SUV 市场的空白。",
    summary_en:
      "Tesla began Model X deliveries at its Fremont factory. The world's first mass-produced all-electric SUV featured signature Falcon Wing doors — a design that caused severe production delays but became iconic. The Model X filled Tesla's SUV gap with seven-seat capacity and all-wheel drive.",
    location: "Fremont, CA",
    key: false,
    tags: ["Tesla", "Model X", "SUV"],
    sources: [
      {
        id: "wikipedia-tesla-model-x",
        url: "https://en.wikipedia.org/wiki/Tesla_Model_X",
        kind: "article",
        title: "Tesla Model X (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
    ],
    source_hints: null,
  },

  // ============ 2016-07 — Neuralink founded ============
  {
    id: "musk-2016-07-neuralink-founding",
    person_id: "musk",
    date: "2016-07-01",
    date_precision: "month",
    type: "founding",
    title: "创立 Neuralink——脑机接口公司",
    title_en: "Founds Neuralink (brain-computer interfaces)",
    summary:
      "Musk 联合创立 Neuralink，目标是开发超高带宽脑机接口（BCI），让人脑直接与计算机通信。他的长期愿景是让人类通过与 AI 的\"共生\"来避免被 AI 超越。Neuralink 的首款产品 N1 芯片通过外科手术机器人植入大脑皮层，可以读取神经信号。2024 年 1 月 Neuralink 完成了首例人体植入手术。公司虽然饱受伦理争议和动物实验问题的批评，但其技术路线代表了脑科学工程化的前沿。",
    summary_en:
      "Musk co-founded Neuralink to develop ultra-high-bandwidth brain-computer interfaces. The long-term vision: achieve human-AI symbiosis. Neuralink's N1 chip is surgically implanted by a robotic system; the first human implant was performed in January 2024.",
    location: "San Francisco, CA",
    key: true,
    tags: ["Neuralink", "创业", "脑机接口", "AI"],
    sources: [
      {
        id: "wikipedia-neuralink",
        url: "https://en.wikipedia.org/wiki/Neuralink",
        kind: "article",
        title: "Neuralink (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
    ],
    source_hints: null,
  },

  // ============ 2016-11-17 — SolarCity acquisition ============
  {
    id: "musk-2016-11-17-solarcity",
    person_id: "musk",
    date: "2016-11-17",
    date_precision: "day",
    type: "deal",
    title: "Tesla 以 26 亿美元收购 SolarCity",
    title_en: "Tesla acquires SolarCity for $2.6 billion",
    summary:
      "Tesla 以全股票交易方式以约 26 亿美元收购太阳能安装公司 SolarCity。SolarCity 由 Musk 的表兄弟 Lyndon 和 Peter Rive 创立，Musk 本人是其董事长和最大股东。这笔关联交易在股东中引发巨大争议，后来甚至导致了一场股东诉讼。但从战略上看，收购让 Tesla 得以整合电动车、储能电池和太阳能发电——打通了\"可持续能源的完整链条\"。",
    summary_en:
      "Tesla acquired SolarCity for ~$2.6 billion in an all-stock deal. SolarCity was founded by Musk's cousins and Musk served as its chairman. The related-party transaction was controversial and led to a shareholder lawsuit, but strategically integrated EVs, battery storage, and solar under one roof.",
    location: "San Carlos, CA",
    key: true,
    tags: ["Tesla", "SolarCity", "收购", "太阳能"],
    sources: [
      {
        id: "wikipedia-solarcity-acquisition",
        url: "https://en.wikipedia.org/wiki/SolarCity",
        kind: "article",
        title: "SolarCity (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
    ],
    source_hints: null,
  },

  // ============ 2016-12-17 — The Boring Company founded ============
  {
    id: "musk-2016-12-boring-company",
    person_id: "musk",
    date: "2016-12-17",
    date_precision: "day",
    type: "founding",
    title: "创立 The Boring Company——地下隧道交通",
    title_en: "Founds The Boring Company",
    summary:
      "据说是在洛杉矶 405 公路堵车时萌生灵感，Musk 创立 The Boring Company，目标是大幅降低隧道挖掘成本，建设地下高速交通系统。他最初在 SpaceX 总部停车场开始挖第一段测试隧道。公司后来在拉斯维加斯会展中心建成了\"Vegas Loop\"运营线路，但其\"解决交通拥堵\"的宏大愿景仍然充满争议。",
    summary_en:
      "Allegedly inspired by LA traffic on the 405, Musk founded The Boring Company to drastically reduce tunneling costs for underground transport. The first test tunnel was dug in the SpaceX HQ parking lot. The company later built the Vegas Loop at the Las Vegas Convention Center.",
    location: "Hawthorne, CA",
    key: false,
    tags: ["Boring Company", "创业", "交通", "隧道"],
    sources: [
      {
        id: "wikipedia-boring-company",
        url: "https://en.wikipedia.org/wiki/The_Boring_Company",
        kind: "article",
        title: "The Boring Company (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
    ],
    source_hints: null,
  },

  // ============ 2017-07-28 — Model 3 first deliveries ============
  {
    id: "musk-2017-07-28-model-3-delivery",
    person_id: "musk",
    date: "2017-07-28",
    date_precision: "day",
    type: "product",
    title: "Model 3 首批交付——Tesla「三步走」的最后一步",
    title_en: "Model 3 first deliveries — Tesla's mass-market vehicle arrives",
    summary:
      "Tesla 在 Fremont 工厂将首批 30 辆 Model 3 交到员工手中。Model 3 起步价 35,000 美元（后来涨价），是 Musk 2006 年\"Master Plan\"中描述的第三步——用 Roadster 和 Model S 的利润资助一款大众价位电动车。发布后积累了超过 50 万份预订。但随之而来的是\"量产地狱\"——2017 下半年到 2018 上半年，Model 3 的产能爬坡成为 Musk 职业生涯中最严酷的考验之一，他甚至睡在工厂地板上督产。",
    summary_en:
      "Tesla delivered the first 30 Model 3 sedans to employees at the Fremont factory. Starting at $35,000, it was the mass-market EV Musk had outlined in his 2006 Master Plan. Over 500,000 reservations poured in. The subsequent \"production hell\" in late 2017-early 2018 became one of the most grueling periods of Musk's career.",
    location: "Fremont, CA",
    key: true,
    tags: ["Tesla", "Model 3", "大众市场", "里程碑"],
    sources: [
      {
        id: "wikipedia-tesla-model-3",
        url: "https://en.wikipedia.org/wiki/Tesla_Model_3",
        kind: "article",
        title: "Tesla Model 3 (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
    ],
    source_hints: null,
  },

  // ============ 2017-09-29 — IAC 2017 updated Mars architecture ============
  {
    id: "musk-2017-09-29-iac-mars",
    person_id: "musk",
    date: "2017-09-29",
    date_precision: "day",
    type: "speech",
    title: "IAC 2017 演讲——更新版火星殖民方案（BFR）",
    title_en: "IAC 2017: Updated Mars architecture — introduces BFR",
    summary:
      "Musk 在澳大利亚阿德莱德国际宇航大会（IAC）上发表演讲，展示了 SpaceX 更新后的火星殖民方案。他将前一年提出的超大号 ITS（Interplanetary Transport System）缩小为更务实的 BFR（Big Falcon Rocket，后来改名 Starship）。新方案的核心想法是用同一款可完全复用的运载器同时满足地球轨道、月球和火星任务——\"一种火箭替代所有现有火箭\"。他还首次提到用 BFR 做地球上的\"点对点\"超音速客运。",
    summary_en:
      "At IAC 2017 in Adelaide, Musk presented SpaceX's revised Mars colonization plan, downsizing the ITS to the more practical BFR (later renamed Starship). The key insight: one fully reusable vehicle for Earth orbit, Moon, and Mars. He also floated Earth-to-Earth point-to-point supersonic travel.",
    location: "Adelaide, Australia",
    key: true,
    tags: ["SpaceX", "IAC", "火星", "BFR", "Starship", "演讲"],
    sources: [
      {
        id: "youtube-musk-iac-2017",
        url: "https://www.youtube.com/watch?v=tdUX3ypDVwI",
        kind: "video",
        title: "Making Life Multiplanetary — IAC 2017",
        publisher: "SpaceX (YouTube)",
        lang: "en",
        primary: true,
        ...HUMAN,
      },
      {
        id: "wikipedia-starship-spacex",
        url: "https://en.wikipedia.org/wiki/SpaceX_Starship",
        kind: "article",
        title: "SpaceX Starship (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
    ],
    source_hints: null,
  },

  // ============ 2018-02-06 — Falcon Heavy first launch ============
  {
    id: "musk-2018-02-06-falcon-heavy",
    person_id: "musk",
    date: "2018-02-06",
    date_precision: "day",
    type: "product",
    title: "Falcon Heavy 首飞——Starman 乘 Tesla 飞向火星轨道",
    title_en: "Falcon Heavy maiden flight — Starman Tesla launched toward Mars",
    summary:
      "SpaceX Falcon Heavy 从 Kennedy 航天中心 LC-39A（曾是阿波罗和航天飞机的发射台）首飞成功。作为测试载荷，Musk 把自己那辆樱桃红 Tesla Roadster 送上了日心轨道，驾驶座上坐着穿 SpaceX 宇航服的假人\"Starman\"，车载音响循环播放 David Bowie 的《Space Oddity》。两枚助推器同步降落在 Cape Canaveral 的场景成为航天史上最具视觉冲击力的画面之一。这次发射让 Falcon Heavy 成为当时运力最强的现役火箭。",
    summary_en:
      "Falcon Heavy launched from LC-39A at Kennedy Space Center on its maiden flight. As a test payload, Musk sent his cherry-red Tesla Roadster into heliocentric orbit with a spacesuit-clad mannequin 'Starman' at the wheel playing David Bowie. The synchronized dual booster landing became one of spaceflight's most iconic images.",
    location: "Kennedy Space Center LC-39A, FL",
    key: true,
    tags: ["SpaceX", "Falcon Heavy", "Starman", "里程碑", "经典"],
    sources: [
      {
        id: "wikipedia-falcon-heavy-test-flight",
        url: "https://en.wikipedia.org/wiki/Falcon_Heavy_test_flight",
        kind: "article",
        title: "Falcon Heavy test flight (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
    ],
    source_hints: null,
  },

  // ============ 2018-03-11 — SXSW interview with Jonathan Nolan ============
  {
    id: "musk-2018-03-11-sxsw",
    person_id: "musk",
    date: "2018-03-11",
    date_precision: "day",
    type: "interview",
    title: "SXSW 2018 对谈（Jonathan Nolan 主持）",
    title_en: "SXSW 2018 interview with Jonathan Nolan",
    summary:
      "在 SXSW 2018 大会上，《西部世界》创作者 Jonathan Nolan 与 Musk 进行了长达一小时的炉边对谈。Musk 讨论了 AI 监管的紧迫性、SpaceX 的火星时间表（\"大概明年做无人测试飞行\"——又一次延期）、Boring Company 的隧道进展，并分享了自己创业过程中的心理健康问题。他坦言自己\"在大多数时间里都不快乐\"，这段话被广泛引用。",
    summary_en:
      "At SXSW 2018, Westworld creator Jonathan Nolan interviewed Musk for an hour. Topics included AI regulation, SpaceX's Mars timeline, Boring Company progress, and Musk's mental health during startup life — he admitted being \"not happy most of the time.\"",
    location: "Austin, TX",
    key: false,
    tags: ["采访", "SXSW", "AI", "心理健康"],
    sources: [
      {
        id: "youtube-musk-sxsw-2018",
        url: "https://www.youtube.com/watch?v=kzlUyrccbos",
        kind: "video",
        title: "Elon Musk Answers Your Questions! | SXSW 2018",
        publisher: "SXSW (YouTube)",
        lang: "en",
        primary: true,
        ...HUMAN,
      },
    ],
    source_hints: null,
  },

  // ============ 2019-03-14 — Model Y unveiled ============
  {
    id: "musk-2019-03-14-model-y-unveil",
    person_id: "musk",
    date: "2019-03-14",
    date_precision: "day",
    type: "product",
    title: "Tesla Model Y 发布",
    title_en: "Tesla Model Y unveiled",
    summary:
      "Musk 在洛杉矶 Tesla 设计工作室揭幕了 Model Y——一款基于 Model 3 平台的紧凑型电动 SUV。Model Y 后来成为 Tesla 有史以来销量最高的车型，2023 年甚至成为全球最畅销的汽车（不限动力类型），年销量超过 120 万辆。它的成功验证了 Musk \"Master Plan\" 的核心假设：大众价位的电动 SUV 才是真正的市场甜点。",
    summary_en:
      "Musk unveiled the Model Y compact electric SUV at Tesla's LA design studio. Based on the Model 3 platform, Model Y became Tesla's best-selling vehicle and the world's best-selling car (all powertrains) in 2023, with over 1.2 million units sold.",
    location: "Los Angeles, CA",
    key: true,
    tags: ["Tesla", "Model Y", "SUV"],
    sources: [
      {
        id: "wikipedia-tesla-model-y",
        url: "https://en.wikipedia.org/wiki/Tesla_Model_Y",
        kind: "article",
        title: "Tesla Model Y (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
    ],
    source_hints: null,
  },

  // ============ 2019-11-21 — Cybertruck unveiling ============
  {
    id: "musk-2019-11-21-cybertruck",
    person_id: "musk",
    date: "2019-11-21",
    date_precision: "day",
    type: "product",
    title: "Cybertruck 发布——\"防弹\"玻璃现场碎裂",
    title_en: "Cybertruck unveiling — \"armored glass\" shatters on stage",
    summary:
      "Musk 在洛杉矶 Tesla 设计工作室揭幕了外形极具争议的全电动皮卡 Cybertruck。其不锈钢外壳和三角形轮廓引发了\"丑到极致就是美\"的全民讨论。发布会上的经典意外：设计总监 Franz von Holzhausen 向\"防弹\"车窗投掷金属球，玻璃当场碎裂。Musk 尴尬地说了一句\"Well, maybe that was a little too hard.\"这个画面传遍全球，反而成为 Cybertruck 最成功的免费营销。",
    summary_en:
      "Musk unveiled the radically angular Cybertruck at Tesla's LA design studio. The stainless steel exoskeleton was polarizing. In the event's most memorable moment, designer Franz von Holzhausen threw a metal ball at the \"armored glass\" window — which promptly shattered. The blooper went viral and became Cybertruck's most effective marketing.",
    location: "Los Angeles, CA",
    key: true,
    tags: ["Tesla", "Cybertruck", "发布会", "名场面"],
    sources: [
      {
        id: "wikipedia-tesla-cybertruck",
        url: "https://en.wikipedia.org/wiki/Tesla_Cybertruck",
        kind: "article",
        title: "Tesla Cybertruck (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
    ],
    source_hints: null,
  },

  // ============ 2020-01-22 — Tesla market cap exceeds $100B ============
  {
    id: "musk-2020-01-22-tesla-100b",
    person_id: "musk",
    date: "2020-01-22",
    date_precision: "day",
    type: "other",
    title: "Tesla 市值首次突破 1,000 亿美元",
    title_en: "Tesla market cap exceeds $100 billion",
    summary:
      "Tesla 股价盘中首次推动市值突破 1,000 亿美元大关，超越大众汽车成为全球市值第二高的汽车公司（仅次于丰田）。更重要的是，这触发了 Musk 2018 年那份惊人薪酬方案的第一档解锁条件——他不拿工资，只有当 Tesla 市值和运营指标达到特定阈值时才能获得期权。这个时刻标志着华尔街对电动车革命从怀疑转向拥抱。",
    summary_en:
      "Tesla's market cap surpassed $100 billion for the first time, making it the second most valuable automaker globally behind Toyota. This triggered the first tranche of Musk's 2018 compensation plan, which paid him exclusively in performance-based stock options.",
    location: "NASDAQ",
    key: false,
    tags: ["Tesla", "市值", "里程碑"],
    sources: [{ ...wikiMusk }],
    source_hints: null,
  },

  // ============ 2020-09-22 — Tesla Battery Day ============
  {
    id: "musk-2020-09-22-battery-day",
    person_id: "musk",
    date: "2020-09-22",
    date_precision: "day",
    type: "speech",
    title: "Tesla Battery Day——4680 电池单元发布",
    title_en: "Tesla Battery Day — 4680 cell announced",
    summary:
      "Tesla 在 Fremont 工厂以\"drive-in\"形式（观众坐在车里按喇叭欢呼）举办 Battery Day。Musk 和电池负责人 Drew Baglino 发布了 4680 电池单元——更大的无极耳圆柱形电池，承诺能量密度提升 5 倍、续航增加 16%、每千瓦时成本降低 56%。他描绘了一幅每年生产 20 TWh 电池的远景蓝图，目标是把 25,000 美元电动车变成现实。4680 电池此后经历了漫长的量产爬坡。",
    summary_en:
      "At Tesla's drive-in Battery Day at Fremont, Musk and battery lead Drew Baglino unveiled the 4680 tabless cylindrical cell, promising 5x energy, 16% more range, and 56% cost reduction per kWh. Musk laid out a roadmap for 20 TWh annual production and a future $25,000 EV.",
    location: "Fremont, CA",
    key: true,
    tags: ["Tesla", "电池", "4680", "Battery Day"],
    sources: [
      {
        id: "wikipedia-tesla-battery-day",
        url: "https://en.wikipedia.org/wiki/Tesla,_Inc.#Battery_and_powertrain",
        kind: "article",
        title: "Tesla, Inc. — Battery and powertrain (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
    ],
    source_hints: null,
  },

  // ============ 2020-12-21 — Tesla joins S&P 500 ============
  {
    id: "musk-2020-12-21-sp500",
    person_id: "musk",
    date: "2020-12-21",
    date_precision: "day",
    type: "other",
    title: "Tesla 正式加入标普 500 指数",
    title_en: "Tesla joins the S&P 500",
    summary:
      "Tesla 正式被纳入标普 500 指数，是该指数历史上权重最大的一次新增成分股。在纳入生效前的交易日，TSLA 成交额创纪录。Tesla 的纳入意味着全球追踪 S&P 500 的数万亿美元被动基金必须买入 TSLA 股票——这直接推动了股价在 2020 年底的飙升。对 Musk 而言，Tesla 从一家华尔街嘲笑的小众车企变成了美国股市核心成分股，用了不到 11 年。",
    summary_en:
      "Tesla was added to the S&P 500, the largest company ever added by market cap. The inclusion forced trillions of dollars in index-tracking funds to buy TSLA shares. In under 11 years since its IPO, Tesla went from a niche EV startup to a core member of America's benchmark stock index.",
    location: "New York, NY",
    key: true,
    tags: ["Tesla", "S&P 500", "里程碑"],
    sources: [
      {
        id: "wikipedia-tesla-sp500",
        url: "https://en.wikipedia.org/wiki/Tesla,_Inc.",
        kind: "article",
        title: "Tesla, Inc. (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
    ],
    source_hints: null,
  },

  // ============ 2020-12-01 — Axel Springer Award interview ============
  {
    id: "musk-2020-12-01-axel-springer",
    person_id: "musk",
    date: "2020-12-01",
    date_precision: "day",
    type: "interview",
    title: "获 Axel Springer Award 并接受深度访谈（柏林）",
    title_en: "Axel Springer Award ceremony and interview in Berlin",
    summary:
      "Musk 在柏林接受 Axel Springer 奖，并与 Axel Springer CEO Mathias Döpfner 进行了长时间对谈。他透露自己曾感染新冠、讨论了 Tesla 柏林工厂的建设进展、反对新冠封锁措施，并首次暗示可能将 Tesla 总部迁出加州。这场访谈发生在他搬到得州前夕，也是他公开转向右翼政治光谱的一个早期信号。",
    summary_en:
      "Musk received the Axel Springer Award in Berlin and sat for a lengthy interview with CEO Mathias Döpfner. He discussed his COVID-19 infection, Tesla's Berlin Gigafactory progress, opposition to lockdowns, and hinted at moving Tesla's HQ out of California.",
    location: "Berlin, Germany",
    key: false,
    tags: ["采访", "柏林", "奖项"],
    sources: [
      {
        id: "youtube-musk-axel-springer-2020",
        url: "https://www.youtube.com/watch?v=AF2HXId2Xhg",
        kind: "video",
        title: "Elon Musk talks about Donald Trump & more | Axel Springer Award 2020",
        publisher: "Axel Springer SE (YouTube)",
        lang: "en",
        primary: true,
        ...HUMAN,
      },
    ],
    source_hints: null,
  },

  // ============ 2021-05-08 — SNL hosting ============
  {
    id: "musk-2021-05-08-snl",
    person_id: "musk",
    date: "2021-05-08",
    date_precision: "day",
    type: "other",
    title: "主持 Saturday Night Live",
    title_en: "Hosts Saturday Night Live",
    summary:
      "Musk 成为 Saturday Night Live 历史上少数非娱乐圈主持人之一。他在开场独白中透露自己患有 Asperger 综合症（亚斯伯格症），这是他首次公开谈论此事。节目中他扮演了\"Wario\"等多个角色。最大的连锁反应发生在加密货币市场——他在\"Weekend Update\"环节调侃 Dogecoin \"是骗局\"，导致 Doge 币价格暴跌。这一晚同时展现了 Musk 的自嘲能力和他对金融市场的非同寻常的影响力。",
    summary_en:
      "Musk hosted Saturday Night Live, one of few non-entertainment hosts. In his opening monologue he revealed he has Asperger's syndrome — his first public disclosure. During 'Weekend Update' he joked that Dogecoin was 'a hustle,' causing the cryptocurrency to crash.",
    location: "New York, NY",
    key: true,
    tags: ["SNL", "Asperger", "Dogecoin", "文化"],
    sources: [
      { ...wikiMusk },
      {
        id: "wikipedia-snl-musk",
        url: "https://en.wikipedia.org/wiki/Saturday_Night_Live_season_46",
        kind: "article",
        title: "Saturday Night Live season 46 (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
    ],
    source_hints: null,
  },

  // ============ 2021-10-25 — Tesla hits $1T market cap ============
  {
    id: "musk-2021-10-25-tesla-1t",
    person_id: "musk",
    date: "2021-10-25",
    date_precision: "day",
    type: "other",
    title: "Tesla 市值突破一万亿美元",
    title_en: "Tesla market cap hits $1 trillion",
    summary:
      "Hertz 宣布向 Tesla 订购 10 万辆电动车后，TSLA 股价飙升至超过 1,000 美元/股，推动 Tesla 市值首次突破一万亿美元大关——成为仅次于苹果、微软、亚马逊和 Alphabet 的第五家达到此里程碑的美国公司。Musk 的个人净资产随之超过 3,000 亿美元，成为有记录以来最富有的人。从 IPO 时的 17 美元到万亿市值，Tesla 用了 11 年。",
    summary_en:
      "After Hertz announced an order for 100,000 Teslas, TSLA surged past $1,000/share pushing Tesla's market cap above $1 trillion — the fifth US company to reach the milestone. Musk's net worth exceeded $300 billion, making him the richest person in recorded history.",
    location: "NASDAQ",
    key: true,
    tags: ["Tesla", "市值", "万亿", "里程碑"],
    sources: [
      {
        id: "wikipedia-tesla-trillion",
        url: "https://en.wikipedia.org/wiki/Tesla,_Inc.",
        kind: "article",
        title: "Tesla, Inc. (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
    ],
    source_hints: null,
  },

  // ============ 2022-04-14 — TED Talk Vancouver ============
  {
    id: "musk-2022-04-14-ted-2022",
    person_id: "musk",
    date: "2022-04-14",
    date_precision: "day",
    type: "speech",
    title: "TED 2022 演讲「我的 Twitter 计划和其他事」",
    title_en: "TED 2022: Elon Musk talks Twitter, Tesla, and SpaceX",
    summary:
      "在正式宣布 Twitter 收购要约的同一周，Musk 在温哥华 TED 大会上接受 Chris Anderson 的专访。他首次公开阐述收购 Twitter 的动机——\"言论自由对文明的存续至关重要\"，并讨论了 Starship 进展和 Tesla 的自动驾驶路线图。这场演讲让外界第一次从 Musk 本人口中听到完整的 Twitter 收购逻辑。",
    summary_en:
      "At TED 2022 in Vancouver, the same week as his Twitter bid, Musk explained his Twitter acquisition rationale to Chris Anderson — 'free speech is essential for a functioning democracy.' He also discussed Starship progress and Tesla's FSD roadmap.",
    location: "Vancouver, BC, Canada",
    key: true,
    tags: ["TED", "Twitter", "演讲", "言论自由"],
    sources: [
      {
        id: "youtube-musk-ted-2022",
        url: "https://www.youtube.com/watch?v=cdZZpaB2kDM",
        kind: "video",
        title: "Elon Musk talks Twitter, Tesla and how his brain works | TED",
        publisher: "TED (YouTube)",
        lang: "en",
        primary: true,
        ...HUMAN,
      },
    ],
    source_hints: null,
  },

  // ============ 2023-04-20 — Starship first integrated flight test ============
  {
    id: "musk-2023-04-20-starship-ift1",
    person_id: "musk",
    date: "2023-04-20",
    date_precision: "day",
    type: "product",
    title: "Starship 首次全系统集成飞行测试",
    title_en: "Starship first integrated flight test (IFT-1)",
    summary:
      "SpaceX 从得克萨斯 Starbase 发射了完整的 Starship/Super Heavy 组合体——人类有史以来最大、最强的运载火箭。33 台 Raptor 引擎同时点火产生约 7,590 吨推力。火箭在升空约 4 分钟后未能完成级间分离，触发飞行终止系统自毁。虽然\"结果\"是爆炸，但 SpaceX 的快速迭代开发理念视每次飞行为数据收集——Musk 称之为\"rapid unscheduled disassembly\"（快速非计划拆解）。发射台也遭到严重损坏。",
    summary_en:
      "SpaceX launched the full Starship/Super Heavy stack from Starbase, Texas — the largest and most powerful rocket ever flown. All 33 Raptor engines ignited producing ~7,590 tons of thrust. The vehicle failed to separate and was destroyed via FTS ~4 minutes in. SpaceX called it a 'rapid unscheduled disassembly.' The launch pad sustained significant damage.",
    location: "Starbase, Boca Chica, TX",
    key: true,
    tags: ["SpaceX", "Starship", "首飞", "里程碑"],
    sources: [
      {
        id: "wikipedia-starship-ift1",
        url: "https://en.wikipedia.org/wiki/Starship_flight_test_1",
        kind: "article",
        title: "Starship flight test 1 (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
    ],
    source_hints: null,
  },

  // ============ 2023-12-20 — Lex Fridman interview #5 ============
  {
    id: "musk-2023-12-20-lex-fridman",
    person_id: "musk",
    date: "2023-12-20",
    date_precision: "day",
    type: "interview",
    title: "Lex Fridman Podcast 长篇访谈",
    title_en: "Lex Fridman Podcast extended interview",
    summary:
      "Musk 再次做客 Lex Fridman 播客，进行了超过两小时的深度对谈。话题涵盖 xAI 和 Grok 的开发哲学、Neuralink 首例人体植入的准备工作、Starship 的最新进展、他对 OpenAI 的批评（称其已偏离非营利使命），以及他对人类未来的长期思考。这是 Musk 在学术型播客上最深入的一次技术和哲学讨论之一。",
    summary_en:
      "Musk sat for a 2+ hour conversation on the Lex Fridman Podcast covering xAI/Grok development, Neuralink's first human implant preparations, Starship updates, his criticism of OpenAI's drift from nonprofit mission, and long-term thinking about humanity's future.",
    location: "Austin, TX",
    key: false,
    tags: ["采访", "Lex Fridman", "xAI", "Grok"],
    sources: [
      {
        id: "youtube-lex-musk-2023",
        url: "https://www.youtube.com/watch?v=JN3KPFbWCy8",
        kind: "video",
        title: "Elon Musk: War, AI, Aliens, Politics, Physics, Video Games, and Humanity | Lex Fridman Podcast #400",
        publisher: "Lex Fridman (YouTube)",
        lang: "en",
        primary: true,
        ...HUMAN,
      },
    ],
    source_hints: null,
  },

  // ============ 2023-09-12 — Isaacson biography published ============
  {
    id: "musk-2023-09-12-isaacson-biography",
    person_id: "musk",
    date: "2023-09-12",
    date_precision: "day",
    type: "writing",
    title: "Walter Isaacson 传记《Elon Musk》出版",
    title_en: "Walter Isaacson's biography \"Elon Musk\" published",
    summary:
      "普利策奖级传记作家 Walter Isaacson（乔布斯传记、爱因斯坦传记作者）出版了长达 688 页的《Elon Musk》传记。Isaacson 跟踪采访 Musk 两年，深入描写了他的童年创伤、Twitter 收购内幕、和多家公司的管理风格。书中透露 Musk 在乌克兰战争中秘密关闭了 Starlink 信号以阻止乌军袭击克里米亚的俄国舰队——这一披露引发了巨大的地缘政治争议。传记登上纽约时报畅销书排行榜首位。",
    summary_en:
      "Walter Isaacson published his 688-page biography \"Elon Musk\" after two years of shadowing its subject. The book detailed Musk's childhood trauma, Twitter acquisition backstory, and management style. Its revelation that Musk secretly disabled Starlink near Crimea to prevent a Ukrainian attack on Russian ships sparked geopolitical controversy. It debuted at #1 on the NYT bestseller list.",
    location: "USA",
    key: true,
    tags: ["传记", "Walter Isaacson", "Starlink", "乌克兰"],
    sources: [
      {
        id: "wikipedia-isaacson-musk",
        url: "https://en.wikipedia.org/wiki/Elon_Musk_(Isaacson_book)",
        kind: "article",
        title: "Elon Musk (Isaacson book) (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
    ],
    source_hints: null,
  },

  // ============ 2024-06-06 — Starship Flight 4 ============
  {
    id: "musk-2024-06-06-starship-flight4",
    person_id: "musk",
    date: "2024-06-06",
    date_precision: "day",
    type: "product",
    title: "Starship Flight 4——首次成功再入大气层与溅落",
    title_en: "Starship Flight 4 — first successful reentry and splashdown",
    summary:
      "SpaceX Starship 第四次集成飞行测试取得重大突破。Super Heavy 助推器成功执行减速燃烧并在墨西哥湾精准溅落，Starship 飞船完成了从次轨道高度穿越大气层的完整再入过程——尽管隔热瓦严重受损、一片襟翼几乎烧穿，飞船仍然成功在印度洋完成软溅落。这是 Starship 第一次证明其再入热防护系统在真实条件下能让飞船存活，为后续的回收着陆扫清了关键障碍。",
    summary_en:
      "Starship Flight 4 achieved a major milestone: Super Heavy performed a successful landing burn and splashdown in the Gulf of Mexico, while the Starship upper stage completed a full reentry from suborbital altitude despite severe heat shield damage and a nearly burned-through flap. First successful Starship reentry and splashdown.",
    location: "Starbase, Boca Chica, TX / Indian Ocean",
    key: true,
    tags: ["SpaceX", "Starship", "再入", "里程碑"],
    sources: [
      {
        id: "wikipedia-starship-ift4",
        url: "https://en.wikipedia.org/wiki/Starship_flight_test_4",
        kind: "article",
        title: "Starship flight test 4 (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
    ],
    source_hints: null,
  },

  // ============ 2024-10-13 — Starship Flight 5 (chopstick catch) ============
  {
    id: "musk-2024-10-13-starship-flight5",
    person_id: "musk",
    date: "2024-10-13",
    date_precision: "day",
    type: "product",
    title: "Starship Flight 5——\"筷子\"机械臂捕获助推器回收",
    title_en: "Starship Flight 5 — booster caught by launch tower \"chopsticks\"",
    summary:
      "SpaceX 完成了可能是航天史上最震撼的工程壮举之一：233 英尺高、重达数百吨的 Super Heavy 助推器在发射后飞回发射塔，被两根巨大的机械臂（\"筷子\"，Mechazilla）精准夹住，悬在半空中。这意味着火箭不需要着陆腿，直接\"回到\"发射工位上——理论上可以快速加注再次发射。同时 Starship 飞船也成功完成了精确的印度洋溅落。Musk 在社交媒体上写道：\"The tower has caught the rocket!!\"",
    summary_en:
      "SpaceX achieved one of the most stunning engineering feats in spaceflight history: the 233-foot Super Heavy booster flew back to the launch tower and was caught mid-air by the giant mechanical arms ('chopsticks' / Mechazilla). No landing legs needed — the booster returned directly to the launch mount. Starship also completed a precise Indian Ocean splashdown. Musk posted: 'The tower has caught the rocket!!'",
    location: "Starbase, Boca Chica, TX",
    key: true,
    tags: ["SpaceX", "Starship", "Mechazilla", "回收", "里程碑", "经典"],
    sources: [
      {
        id: "wikipedia-starship-ift5",
        url: "https://en.wikipedia.org/wiki/Starship_flight_test_5",
        kind: "article",
        title: "Starship flight test 5 (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
    ],
    source_hints: null,
  },

  // ============ 2023-07 — xAI founded ============
  {
    id: "musk-2023-07-12-xai-founding",
    person_id: "musk",
    date: "2023-07-12",
    date_precision: "day",
    type: "founding",
    title: "创立 xAI——进军大模型 AI",
    title_en: "Founds xAI",
    summary:
      "Musk 正式宣布成立 xAI，目标是\"理解宇宙的真实本质\"。团队核心成员来自 Google DeepMind、OpenAI 和多伦多大学。公司的首款产品 Grok 是一个集成于 X（前 Twitter）平台的大语言模型，以幽默和直率著称，可以回答其他 AI 拒绝回答的争议性问题。xAI 的成立标志着 Musk 从 AI 批评者转变为 AI 建设者——他认为只有亲自下场才能确保 AI 发展方向不被少数公司垄断。",
    summary_en:
      "Musk officially launched xAI with the goal of 'understanding the true nature of the universe.' The team included veterans from Google DeepMind, OpenAI, and the University of Toronto. Its first product, Grok, was a large language model integrated into X. xAI marked Musk's transition from AI critic to AI builder.",
    location: "USA",
    key: true,
    tags: ["xAI", "创业", "AI", "Grok"],
    sources: [
      {
        id: "wikipedia-xai",
        url: "https://en.wikipedia.org/wiki/XAI_(company)",
        kind: "article",
        title: "xAI (company) (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
    ],
    source_hints: null,
  },

  // ============ 2025-01-20 — DOGE involvement ============
  {
    id: "musk-2025-01-20-doge",
    person_id: "musk",
    date: "2025-01-20",
    date_precision: "day",
    type: "career",
    title: "出任政府效率部（DOGE）负责人",
    title_en: "Takes charge of Department of Government Efficiency (DOGE)",
    summary:
      "随着 Donald Trump 于 2025 年 1 月 20 日就任总统，Musk 正式开始领导\"政府效率部\"（Department of Government Efficiency，缩写 DOGE——故意致敬 Dogecoin）。这个由总统行政令设立的咨询机构旨在削减联邦政府开支和官僚机构，Musk 的角色是\"特别政府雇员\"顾问。他带领团队对多个联邦机构进行大刀阔斧的裁员和预算削减，引发了激烈的政治争议和多起法律挑战。这是 Musk 首次深度介入美国政府运作。",
    summary_en:
      "As Trump took office on January 20, 2025, Musk formally began leading the Department of Government Efficiency (DOGE — intentionally named after the cryptocurrency meme). Established by executive order, DOGE aimed to slash federal spending and bureaucracy. Musk's aggressive workforce reductions across federal agencies triggered fierce political controversy and legal challenges.",
    location: "Washington, D.C.",
    key: true,
    tags: ["DOGE", "政治", "Trump", "政府"],
    sources: [
      {
        id: "wikipedia-doge-dept",
        url: "https://en.wikipedia.org/wiki/Department_of_Government_Efficiency",
        kind: "article",
        title: "Department of Government Efficiency (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
    ],
    source_hints: null,
  },

  // ============ 2019-05-24 — Starlink first batch launch ============
  {
    id: "musk-2019-05-24-starlink-launch",
    person_id: "musk",
    date: "2019-05-24",
    date_precision: "day",
    type: "product",
    title: "首批 60 颗 Starlink 卫星发射——太空互联网时代开启",
    title_en: "First batch of 60 Starlink satellites launched",
    summary:
      "SpaceX 用 Falcon 9 一次发射了 60 颗 Starlink 卫星进入近地轨道，正式拉开太空互联网星座的序幕。Starlink 的目标是在低轨道部署数千颗卫星，为全球提供高速互联网——特别是偏远地区和传统基础设施难以覆盖的区域。到 2024 年，Starlink 已拥有超过 5,000 颗在轨卫星和数百万用户，成为全球最大的卫星星座。这个项目也成为 SpaceX 最重要的收入来源之一。",
    summary_en:
      "SpaceX launched 60 Starlink satellites on a single Falcon 9, kicking off the space internet constellation. Starlink aimed to provide global broadband via thousands of LEO satellites. By 2024 it had 5,000+ operational satellites and millions of users, becoming SpaceX's major revenue driver.",
    location: "Cape Canaveral SLC-40, FL",
    key: true,
    tags: ["SpaceX", "Starlink", "卫星互联网", "里程碑"],
    sources: [
      {
        id: "wikipedia-starlink",
        url: "https://en.wikipedia.org/wiki/Starlink",
        kind: "article",
        title: "Starlink (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
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
