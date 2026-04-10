#!/usr/bin/env node
/**
 * Expand Charlie Munger timeline with ~20 new events covering
 * speeches, interviews, business decisions, writings, and life milestones.
 * Idempotent: skips events whose id already exists.
 * Run audit-urls.mjs --write after.
 */
import fs from "node:fs";
import path from "node:path";

const filePath = path.join(process.cwd(), "data", "events", "munger.json");
const events = fs.existsSync(filePath)
  ? JSON.parse(fs.readFileSync(filePath, "utf8"))
  : [];
const existingIds = new Set(events.map((e) => e.id));

const HUMAN = { license: "all-rights-reserved", authored_by: "human", mentions: [] };
const CCBYSA = { license: "cc-by-sa", authored_by: "human", mentions: [] };

const wikipediaMungerSource = {
  id: "wikipedia-munger-bio",
  url: "https://en.wikipedia.org/wiki/Charlie_Munger",
  kind: "article",
  title: "Charlie Munger (Wikipedia)",
  publisher: "Wikipedia",
  lang: "en",
  primary: false,
  ...CCBYSA,
};

const newEvents = [
  // ── 1. Munger, Tolles & Olson founding ──
  {
    id: "munger-1962-munger-tolles-founding",
    person_id: "munger",
    date: "1962-01-01",
    date_precision: "year",
    type: "founding",
    title: "联合创立 Munger, Tolles & Olson 律师事务所",
    title_en: "Co-founds Munger, Tolles & Olson law firm",
    summary:
      "1962 年，芒格与 Roderick Hills、Robert Olson 等人在洛杉矶联合创立了 Munger, Tolles & Olson 律师事务所。该所在公司法、诉讼和知识产权领域迅速建立声誉，至今仍是美国最受尊敬的精品律所之一。尽管芒格很快将重心转向投资，但他始终以创始合伙人的身份与事务所保持联系，并将律师训练中习得的严谨逻辑视为自己投资哲学的基石。Munger Tolles 也成为硅谷和好莱坞众多高端交易背后的法律顾问。",
    summary_en:
      "In 1962 Munger co-founded the law firm Munger, Tolles & Olson in Los Angeles. Though he soon shifted to investing, the firm grew into one of America's most prestigious boutique practices. Munger credited his legal training with forming the rigorous analytical habits underlying his investment philosophy.",
    location: "Los Angeles, CA",
    key: true,
    tags: ["创立", "律所", "Munger Tolles"],
    sources: [
      { ...wikipediaMungerSource },
      {
        id: "wikipedia-munger-tolles",
        url: "https://en.wikipedia.org/wiki/Munger,_Tolles_%26_Olson",
        kind: "article",
        title: "Munger, Tolles & Olson (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
    ],
    source_hints: null,
  },

  // ── 2. See's Candies acquisition ──
  {
    id: "munger-1972-sees-candies",
    person_id: "munger",
    date: "1972-01-01",
    date_precision: "year",
    type: "deal",
    title: "推动收购 See's Candies——改变巴菲特和芒格的投资哲学",
    title_en: "Drives See's Candies acquisition — transforms Buffett-Munger investment philosophy",
    summary:
      "1972 年，芒格力主通过 Blue Chip Stamps 以 2500 万美元收购加州巧克力品牌 See's Candies。这是巴菲特首次「破格」以高于账面价值的价格收购企业——正是芒格说服他，优质品牌的定价权和忠实客户基础值得溢价。此后 See's Candies 累计创造了超过 20 亿美元的税前利润，几乎不需要追加资本。巴菲特后来称这笔收购是他投资生涯的「转折点」——从追求「烟蒂股」的格雷厄姆路线，转向以合理价格买入卓越企业的「芒格路线」。",
    summary_en:
      "In 1972 Munger convinced Buffett to buy See's Candies for $25 million via Blue Chip Stamps — paying above book value for the first time. The deal proved transformational: See's generated over $2 billion in pre-tax earnings with minimal reinvestment. Buffett later called it the turning point from 'cigar butt' investing to buying wonderful businesses at fair prices — the Munger way.",
    location: "Los Angeles, CA",
    key: true,
    tags: ["See's Candies", "投资哲学", "品牌", "Blue Chip Stamps"],
    sources: [
      { ...wikipediaMungerSource },
      {
        id: "berkshire-letters",
        url: "https://www.berkshirehathaway.com/letters/letters.html",
        kind: "document",
        title: "Berkshire Hathaway Shareholder Letters",
        publisher: "Berkshire Hathaway",
        lang: "en",
        primary: true,
        ...HUMAN,
      },
    ],
    source_hints: "Buffett discusses See's Candies as pivotal in multiple annual letters",
  },

  // ── 3. Blue Chip Stamps involvement ──
  {
    id: "munger-1974-blue-chip-stamps",
    person_id: "munger",
    date: "1974-01-01",
    date_precision: "year",
    type: "career",
    title: "成为 Blue Chip Stamps 关键股东和决策者",
    title_en: "Becomes key shareholder and decision-maker at Blue Chip Stamps",
    summary:
      "1970 年代初，芒格与巴菲特、Rick Guerin 等人分别大量买入 Blue Chip Stamps 股票。Blue Chip 是一家贸易印花公司，但其真正价值在于持有的大量浮存金（float）。芒格作为核心决策者之一，利用 Blue Chip 的资金先后收购了 See's Candies（1972 年）、Wesco Financial（1973 年）和 Buffalo Evening News（1977 年），将一家平凡的印花公司改造为控股投资平台。1983 年 Blue Chip 完全并入伯克希尔·哈撒韦，成为后者版图的重要基石。",
    summary_en:
      "In the early 1970s Munger, Buffett, and Rick Guerin accumulated large positions in Blue Chip Stamps. Munger helped deploy its float to acquire See's Candies, Wesco Financial, and Buffalo Evening News. Blue Chip was fully merged into Berkshire Hathaway in 1983.",
    location: "Los Angeles, CA",
    key: false,
    tags: ["Blue Chip Stamps", "浮存金", "收购平台"],
    sources: [
      { ...wikipediaMungerSource },
      {
        id: "wikipedia-blue-chip-stamps",
        url: "https://en.wikipedia.org/wiki/Blue_Chip_Stamps",
        kind: "article",
        title: "Blue Chip Stamps (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
    ],
    source_hints: null,
  },

  // ── 4. 1994 USC "Elementary Worldly Wisdom" speech ──
  {
    id: "munger-1994-04-14-usc-worldly-wisdom",
    person_id: "munger",
    date: "1994-04-14",
    date_precision: "day",
    type: "speech",
    title: "USC 商学院演讲《论基本的、普世的智慧》",
    title_en: "\"A Lesson on Elementary, Worldly Wisdom\" at USC Marshall School of Business",
    summary:
      "1994 年 4 月 14 日，芒格应邀在南加州大学马歇尔商学院发表了日后被广泛传播的演讲《论基本的、普世的智慧》（A Lesson on Elementary, Worldly Wisdom, As It Relates to Investment Management and Business）。在这场演讲中，芒格首次系统地阐述了「心智模型格栅」（latticework of mental models）理论——即投资者必须掌握来自数学、物理学、生物学、心理学和经济学等多学科的关键模型，才能做出真正优秀的判断。这篇演讲后来被收入《穷查理宝典》，成为芒格思想的标志性文本。",
    summary_en:
      "On April 14, 1994, Munger delivered 'A Lesson on Elementary, Worldly Wisdom' at USC's Marshall School of Business, introducing his famous 'latticework of mental models' framework — the idea that investors need key models from mathematics, physics, biology, psychology, and economics to make superior decisions. It became one of his most influential and widely-read speeches.",
    location: "Los Angeles, CA",
    key: true,
    tags: ["演讲", "心智模型", "USC", "跨学科"],
    sources: [
      { ...wikipediaMungerSource },
      {
        id: "poor-charlies-almanack",
        url: "https://en.wikipedia.org/wiki/Poor_Charlie%27s_Almanack",
        kind: "article",
        title: "Poor Charlie's Almanack (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
    ],
    source_hints: "Full text published in Outstanding Investor Digest (1994) and Poor Charlie's Almanack",
  },

  // ── 5. 1998 "The Great Financial Scandal of 2003" ──
  {
    id: "munger-1998-great-financial-scandal",
    person_id: "munger",
    date: "1998-01-01",
    date_precision: "year",
    type: "speech",
    title: "预言式演讲《2003 年的大金融丑闻》",
    title_en: "\"The Great Financial Scandal of 2003\" — prescient speech on accounting fraud",
    summary:
      "1998 年，芒格在 Wesco 股东大会上发表了一篇虚构预言式演讲《2003 年的大金融丑闻》（The Great Financial Scandal of 2003），以讽刺寓言的方式描绘了一家虚构公司如何通过期权会计、收入操纵和养老金假设等手段制造虚假利润——而审计师和监管机构对此视而不见。令人震惊的是，这些情节在几年后的安然（Enron）、世通（WorldCom）和泰科（Tyco）等丑闻中一一应验。这篇演讲展示了芒格对制度性激励扭曲的深刻洞察，后被收入《穷查理宝典》。",
    summary_en:
      "In 1998, Munger delivered the fictional/prophetic speech 'The Great Financial Scandal of 2003' at a Wesco meeting, vividly predicting how companies would abuse stock-option accounting, revenue manipulation, and pension assumptions. The scenarios eerily foreshadowed the Enron, WorldCom, and Tyco scandals that erupted years later.",
    location: "Pasadena, CA",
    key: true,
    tags: ["演讲", "预言", "会计欺诈", "Wesco"],
    sources: [
      { ...wikipediaMungerSource },
      {
        id: "poor-charlies-almanack",
        url: "https://en.wikipedia.org/wiki/Poor_Charlie%27s_Almanack",
        kind: "article",
        title: "Poor Charlie's Almanack (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
    ],
    source_hints: "Published in Poor Charlie's Almanack; also circulated via Outstanding Investor Digest",
  },

  // ── 6. 1998 Gen Re acquisition ──
  {
    id: "munger-1998-gen-re",
    person_id: "munger",
    date: "1998-12-21",
    date_precision: "day",
    type: "deal",
    title: "参与伯克希尔以 220 亿美元收购 General Re",
    title_en: "Berkshire acquires General Re for $22 billion with Munger's counsel",
    summary:
      "1998 年 12 月，伯克希尔·哈撒韦以约 220 亿美元完成了对再保险巨头 General Re 的收购。这是伯克希尔历史上最大的一笔交易，芒格在决策中发挥了关键顾问作用。收购初期 Gen Re 暴露出严重的衍生品敞口和承保纪律缺失，芒格后来将衍生品称为「金融大规模杀伤性武器」——这一判断在 2008 年金融危机中得到印证。经过多年整顿，Gen Re 最终成为伯克希尔再保险帝国的基石之一。",
    summary_en:
      "In December 1998, Berkshire Hathaway completed its $22 billion acquisition of General Re, its largest deal ever. Munger played a key advisory role. The early struggles with Gen Re's derivatives book led Munger to call derivatives 'financial weapons of mass destruction.' After years of restructuring, Gen Re became a cornerstone of Berkshire's reinsurance empire.",
    location: "Stamford, CT",
    key: false,
    tags: ["Gen Re", "再保险", "衍生品", "伯克希尔"],
    sources: [
      { ...wikipediaMungerSource },
      {
        id: "wikipedia-gen-re",
        url: "https://en.wikipedia.org/wiki/General_Re",
        kind: "article",
        title: "General Re (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
    ],
    source_hints: "Buffett's 1998 annual letter discusses the deal at length",
  },

  // ── 7. 2003 UCSB "Academic Economics" speech ──
  {
    id: "munger-2003-10-03-academic-economics",
    person_id: "munger",
    date: "2003-10-03",
    date_precision: "day",
    type: "speech",
    title: "UCSB 演讲《学术经济学：优势与缺陷》",
    title_en: "\"Academic Economics: Strengths and Faults\" speech at UC Santa Barbara",
    summary:
      "2003 年 10 月 3 日，芒格在加州大学圣巴巴拉分校 Herbert Simon 经济学讲座上发表了《学术经济学：在考虑了跨学科需求之后谈其优势与缺陷》。他尖锐批评主流经济学过度依赖数学模型、忽视心理学偏差、排斥其他学科的洞见，并以可口可乐的成功为案例展示了多学科思维的力量。他提出的核心观点——「软科学中的嫉妒/领地心理」是阻碍学术进步的一大恶因——引发了经济学界的广泛讨论。该演讲被收入《穷查理宝典》。",
    summary_en:
      "On October 3, 2003, Munger delivered 'Academic Economics: Strengths and Faults After Considering Interdisciplinary Needs' at UCSB's Herbert Simon lecture series. He criticized mainstream economics for over-reliance on mathematical models, ignoring psychological biases, and rejecting insights from other disciplines. The speech was collected in Poor Charlie's Almanack.",
    location: "Santa Barbara, CA",
    key: true,
    tags: ["演讲", "经济学", "跨学科", "UCSB"],
    sources: [
      {
        id: "poor-charlies-almanack",
        url: "https://en.wikipedia.org/wiki/Poor_Charlie%27s_Almanack",
        kind: "article",
        title: "Poor Charlie's Almanack (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
      { ...wikipediaMungerSource },
    ],
    source_hints: "Herb Simon Memorial Lecture at UCSB Economics Dept; full text in Poor Charlie's Almanack",
  },

  // ── 8. 2007 Harvard "Psychology of Human Misjudgment" (updated version) ──
  {
    id: "munger-2007-psychology-misjudgment-harvard",
    person_id: "munger",
    date: "2007-01-01",
    date_precision: "year",
    type: "speech",
    title: "哈佛大学更新版《人类误判心理学》演讲",
    title_en: "Updated \"Psychology of Human Misjudgment\" talk at Harvard",
    summary:
      "芒格最初于 1995 年在哈佛法学院发表了《人类误判心理学》演讲，列出了 20 种常见的认知偏差。2005-2007 年间，他将清单扩展至 25 种心理倾向，并以更新版发表于哈佛等场合，同时收录入《穷查理宝典》扩展版。这份清单涵盖了「激励超级反应」「喜欢/厌恶倾向」「社会认同」「对比错误反应」「压力影响」等系统性心理偏差，是芒格对行为经济学最重要的贡献之一，也成为全球投资者和管理者的必读材料。",
    summary_en:
      "Munger originally delivered 'The Psychology of Human Misjudgment' at Harvard Law School in 1995, listing 20 cognitive biases. He expanded it to 25 tendencies and re-delivered the updated version circa 2005-2007, including at Harvard. The expanded talk — covering incentive super-response, social proof, contrast misreaction, and stress-influence tendencies — became one of his most widely studied contributions.",
    location: "Cambridge, MA",
    key: true,
    tags: ["演讲", "心理学", "认知偏差", "哈佛"],
    sources: [
      {
        id: "youtube-munger-psychology-misjudgement",
        url: "https://www.youtube.com/watch?v=pqzcCfUglws",
        kind: "video",
        title: "The Psychology of Human Misjudgement - Charlie Munger Full Speech",
        publisher: "BuffettMungerWisdom (YouTube)",
        lang: "en",
        primary: true,
        ...HUMAN,
      },
      {
        id: "poor-charlies-almanack",
        url: "https://en.wikipedia.org/wiki/Poor_Charlie%27s_Almanack",
        kind: "article",
        title: "Poor Charlie's Almanack (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
    ],
    source_hints: "The 25-tendency version is the canonical one in Poor Charlie's Almanack (2005/2006 editions)",
  },

  // ── 9. 2008 Caltech DuBridge Distinguished Lecture ──
  {
    id: "munger-2008-12-caltech-dubridge",
    person_id: "munger",
    date: "2008-12-01",
    date_precision: "month",
    type: "speech",
    title: "加州理工学院 DuBridge 杰出讲座：论金融危机的成因",
    title_en: "Caltech DuBridge Distinguished Lecture on the causes of the financial crisis",
    summary:
      "2008 年 12 月，正值全球金融危机最严重之际，芒格受邀在加州理工学院发表 Lee A. DuBridge 杰出讲座。他深入剖析了导致危机的系统性原因：激励错位的衍生品交易、监管套利、信用评级机构的利益冲突、以及华尔街的「赌场化」文化。芒格将这场危机比作「下水道的溢出」——长期积累的不当行为终于溃堤。他呼吁恢复银行业的「工程文化」和「安全边际」思维，展示了他作为多学科思考者在实时危机中的洞察力。",
    summary_en:
      "In December 2008, amid the worst of the financial crisis, Munger gave the DuBridge Distinguished Lecture at Caltech. He dissected the systemic causes — misaligned derivatives incentives, regulatory arbitrage, conflicted rating agencies, and Wall Street's casino culture — calling for a return to engineering-style safety margins in banking.",
    location: "Pasadena, CA",
    key: true,
    tags: ["演讲", "金融危机", "Caltech", "衍生品"],
    sources: [
      {
        id: "youtube-munger-caltech-2008",
        url: "https://www.youtube.com/watch?v=4ibabROYccs",
        kind: "video",
        title: "Charlie Munger - Caltech 2008 DuBridge Distinguished Lecture",
        publisher: "alexjusty (YouTube)",
        lang: "en",
        primary: true,
        ...HUMAN,
      },
      { ...wikipediaMungerSource },
    ],
    source_hints: null,
  },

  // ── 10. 2008 BYD investment ──
  {
    id: "munger-2008-09-byd-investment",
    person_id: "munger",
    date: "2008-09-01",
    date_precision: "month",
    type: "deal",
    title: "力主投资比亚迪（BYD）——芒格最重要的独立推荐",
    title_en: "Championing the BYD investment — Munger's most important independent recommendation",
    summary:
      "2008 年 9 月，在芒格的强烈推荐下，伯克希尔通过 MidAmerican Energy 以约 2.3 亿美元购入中国比亚迪（BYD）约 10% 的股份。芒格在参观 BYD 深圳工厂并会见创始人王传福后，将其评价为「爱迪生与杰克·韦尔奇的结合体」。这笔投资到 2020 年代增值超过 30 倍，成为伯克希尔最成功的投资之一。BYD 交易也标志着芒格对中国市场的长期看好，他后来多次公开表示中国拥有全球最好的发展前景。",
    summary_en:
      "In September 2008, on Munger's strong recommendation, Berkshire's MidAmerican Energy invested ~$230 million for a ~10% stake in China's BYD. After visiting BYD's Shenzhen factory and meeting founder Wang Chuanfu — whom Munger called 'a combination of Thomas Edison and Jack Welch' — the investment grew over 30x, becoming one of Berkshire's most successful bets.",
    location: "Shenzhen, China / Omaha, NE",
    key: true,
    tags: ["BYD", "比亚迪", "中国", "电动车", "投资"],
    sources: [
      { ...wikipediaMungerSource },
      {
        id: "wikipedia-byd",
        url: "https://en.wikipedia.org/wiki/BYD_Company",
        kind: "article",
        title: "BYD Company (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
    ],
    source_hints: "Buffett's 2008 annual letter; extensive CNBC coverage",
  },

  // ── 11. 2010 BBC HARDtalk interview ──
  {
    id: "munger-2010-bbc-hardtalk",
    person_id: "munger",
    date: "2010-01-01",
    date_precision: "year",
    type: "interview",
    title: "BBC HARDtalk 专访：论金融危机后的资本主义",
    title_en: "BBC HARDtalk interview: on capitalism after the financial crisis",
    summary:
      "2010 年芒格接受了 BBC HARDtalk 节目的深度专访，这是他少有的对欧洲媒体的公开对话。在采访中，他坦率地批评了华尔街的贪婪文化和政客的短视行为，但同时为资本主义辩护，认为问题不在于制度本身而在于人性弱点的放大。他用招牌式的尖锐幽默和历史类比回应了主持人关于不平等、银行救助和监管的尖锐提问，展现了他在公共讨论中罕见的直率与深度。",
    summary_en:
      "In 2010 Munger gave a rare in-depth interview on BBC HARDtalk, candidly criticizing Wall Street greed and political short-termism while defending capitalism as a system. He deployed his trademark sharp humor and historical analogies to address inequality, bank bailouts, and regulation.",
    location: "London / Los Angeles",
    key: false,
    tags: ["采访", "BBC", "金融危机", "资本主义"],
    sources: [
      {
        id: "youtube-munger-bbc-hardtalk",
        url: "https://www.youtube.com/watch?v=UC7Gx8jmeFQ",
        kind: "video",
        title: "Charlie Munger - BBC HARDtalk Interview",
        publisher: "BBC (YouTube)",
        lang: "en",
        primary: true,
        ...HUMAN,
      },
    ],
    source_hints: null,
  },

  // ── 12. 2010 Nancy Munger death ──
  {
    id: "munger-2010-nancy-death",
    person_id: "munger",
    date: "2010-01-01",
    date_precision: "year",
    type: "life",
    title: "妻子 Nancy Munger 去世",
    title_en: "Wife Nancy Munger dies",
    summary:
      "2010 年，芒格相伴 54 年的第二任妻子 Nancy Barry Borthwick Munger 去世。Nancy 是芒格背后最重要的支持者之一，两人自 1956 年结婚以来共同养育了八个孩子（包括 Nancy 带来的两个儿子和两人共同生育的四个孩子）。芒格在此后的公开场合中很少提及这段丧偶之痛，但其一贯的斯多葛态度——「承受你必须承受的，继续前行」——在此时得到了最私密的检验。",
    summary_en:
      "In 2010, Munger's second wife Nancy Barry Borthwick Munger died after 54 years of marriage. Together they had raised eight children. Munger rarely spoke publicly about this loss, embodying his stoic philosophy of enduring what must be endured.",
    location: "Los Angeles, CA",
    key: false,
    tags: ["家庭", "丧妻"],
    sources: [{ ...wikipediaMungerSource }],
    source_hints: null,
  },

  // ── 13. Daily Journal chairman role ──
  {
    id: "munger-2014-daily-journal-chairman",
    person_id: "munger",
    date: "2014-01-01",
    date_precision: "year",
    type: "career",
    title: "Daily Journal 年会成为芒格智慧的新舞台",
    title_en: "Daily Journal annual meetings become Munger's new wisdom platform",
    summary:
      "Wesco Financial 于 2011 年并入伯克希尔后，芒格失去了每年独立主持股东问答会的平台。从 2014 年起，他将这一传统转移到他自 1977 年即担任董事长的 Daily Journal Corporation 年会上。每年二月，数百名投资者和芒格追随者涌入洛杉矶参加 Daily Journal 年会，聆听芒格长达数小时的即兴问答。这些年会覆盖投资、政治、人生哲学、中国、科技等广泛主题，成为继 Wesco 年会之后「朝圣」芒格智慧的核心场所。",
    summary_en:
      "After the Wesco merger in 2011, Munger shifted his annual Q&A tradition to the Daily Journal Corporation, where he had served as chairman since 1977. Starting around 2014, the Daily Journal annual meeting became a pilgrimage for hundreds of investors eager to hear Munger's multi-hour extemporaneous sessions on investing, life, China, and technology.",
    location: "Los Angeles, CA",
    key: true,
    tags: ["Daily Journal", "年会", "问答"],
    sources: [
      {
        id: "wikipedia-daily-journal",
        url: "https://en.wikipedia.org/wiki/Daily_Journal_Corporation",
        kind: "article",
        title: "Daily Journal Corporation (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
      {
        id: "youtube-munger-daily-journal-2017",
        url: "https://www.youtube.com/watch?v=BLctqhNClqY",
        kind: "video",
        title: "Charlie Munger speaks at the Daily Journal annual meeting (2017)",
        publisher: "Laixin Wei (YouTube)",
        lang: "en",
        primary: true,
        ...HUMAN,
        summary: "2017 年 Daily Journal 年会全程录像——典型的芒格式多小时问答。",
      },
    ],
    source_hints: null,
  },

  // ── 14. 2019 CNBC interview ──
  {
    id: "munger-2019-cnbc-interview",
    person_id: "munger",
    date: "2019-01-01",
    date_precision: "year",
    type: "interview",
    title: "CNBC 深度专访：论投资、中国与人生",
    title_en: "CNBC in-depth interview: on investing, China, and life",
    summary:
      "2019 年，95 岁的芒格接受了 CNBC 的一次长时间深度访谈，涵盖他对中美关系、科技公司估值泡沫、加密货币（他称之为「老鼠药」）、指数基金的看法，以及他对漫长人生中积累的智慧的总结。在这次采访中，芒格罕见地回忆了早年的苦难经历——包括丧子之痛和投资失利——以及这些经历如何塑造了他的韧性和哲学。这次访谈被视为芒格晚年最完整的公开自传式对话之一。",
    summary_en:
      "In 2019, the 95-year-old Munger sat for an extensive CNBC interview covering U.S.-China relations, tech valuations, cryptocurrency ('rat poison'), index funds, and personal reflections on tragedy and resilience. It was one of his most comprehensive late-career autobiographical conversations.",
    location: "Los Angeles, CA",
    key: false,
    tags: ["采访", "CNBC", "中国", "加密货币"],
    sources: [
      {
        id: "youtube-munger-cnbc-2019",
        url: "https://www.youtube.com/watch?v=nJh3VLpGbWE",
        kind: "video",
        title: "Watch CNBC's full interview with billionaire investor Charlie Munger",
        publisher: "CNBC Television (YouTube)",
        lang: "en",
        primary: true,
        ...HUMAN,
      },
    ],
    source_hints: null,
  },

  // ── 15. 2020 Daily Journal meeting (virtual / COVID era) ──
  {
    id: "munger-2020-02-12-daily-journal-covid",
    person_id: "munger",
    date: "2020-02-12",
    date_precision: "day",
    type: "speech",
    title: "2020 年 Daily Journal 年会——疫情前最后一次线下会议",
    title_en: "2020 Daily Journal annual meeting — last in-person meeting before COVID",
    summary:
      "2020 年 2 月 12 日，芒格主持了 Daily Journal 年度股东大会。这是 COVID-19 大流行前的最后一次线下年会（2021 年改为线上举行）。96 岁的芒格在会上讨论了伯克希尔的航空业投资（后在疫情中全部清仓）、对 Costco 的长期看好、中国经济前景，以及他对「社交媒体正在毒害年轻人思维」的警告。当被问及长寿的秘诀时，他的回答一如既往地简洁：「不嫉妒、不怨恨、不超支、面对困难保持微笑、与可靠的人交往，以及做自己应该做的事。」",
    summary_en:
      "On February 12, 2020, Munger chaired the Daily Journal annual meeting — the last in-person session before COVID forced the 2021 meeting online. The 96-year-old discussed Berkshire's airline investments (later sold), Costco, China's outlook, and warned about social media poisoning young minds. When asked about longevity, he quipped: 'Don't be envious, don't be resentful, don't overspend, keep smiling, deal with reliable people, and do what you're supposed to do.'",
    location: "Los Angeles, CA",
    key: false,
    tags: ["Daily Journal", "年会", "COVID"],
    sources: [
      {
        id: "youtube-munger-daily-journal-2020",
        url: "https://www.youtube.com/watch?v=1tjJcpFkafE",
        kind: "video",
        title: "Charlie Munger: Daily Journal Annual Meeting 2020",
        publisher: "Yahoo Finance (YouTube)",
        lang: "en",
        primary: true,
        ...HUMAN,
      },
    ],
    source_hints: null,
  },

  // ── 16. 2021 UCSB dormitory controversy ──
  {
    id: "munger-2021-ucsb-dormitory",
    person_id: "munger",
    date: "2021-10-01",
    date_precision: "month",
    type: "other",
    title: "UCSB 巨型宿舍楼设计引发争议",
    title_en: "Munger's controversial UCSB mega-dormitory design",
    summary:
      "2021 年 10 月，芒格向加州大学圣巴巴拉分校（UCSB）捐赠 2 亿美元并亲自设计了一座可容纳 4500 名学生的 11 层巨型宿舍楼 Munger Hall。设计的最大争议在于：绝大多数卧室没有窗户，取而代之的是人工照明和通风系统。UCSB 设计审查委员会顾问建筑师 Dennis McFadden 以「前所未有的建筑密度对学生心理健康的潜在危害」为由公开辞职抗议。芒格坚持认为无窗设计可以促进社交互动、降低建造成本，并引用了他在邮轮内舱房间的舒适体验作为论据。该项目引发了建筑界、教育界和公众的广泛讨论。",
    summary_en:
      "In October 2021, Munger donated $200 million to UCSB and personally designed Munger Hall, a massive 11-story dormitory for 4,500 students. The design was highly controversial: most bedrooms had no windows. UCSB's consulting architect resigned in protest, citing mental health concerns. Munger defended the windowless design as promoting social interaction and cost efficiency, comparing rooms to cruise-ship cabins.",
    location: "Santa Barbara, CA",
    key: false,
    tags: ["UCSB", "建筑", "争议", "捐赠"],
    sources: [
      { ...wikipediaMungerSource },
      {
        id: "wikipedia-munger-hall",
        url: "https://en.wikipedia.org/wiki/Munger_Hall",
        kind: "article",
        title: "Munger Hall (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
    ],
    source_hints: "Dennis McFadden resignation letter widely covered; Munger responded in several interviews",
  },

  // ── 17. 2023-02-15 Last Daily Journal annual meeting ──
  {
    id: "munger-2023-02-15-last-daily-journal",
    person_id: "munger",
    date: "2023-02-15",
    date_precision: "day",
    type: "speech",
    title: "最后一次 Daily Journal 年度股东大会",
    title_en: "Final Daily Journal annual meeting",
    summary:
      "2023 年 2 月 15 日，99 岁的芒格主持了他最后一次 Daily Journal 年度股东大会。在超过两小时的问答中，他谈到了人工智能（持谨慎乐观态度）、中国投资前景、通胀预期、加密货币（重申「老鼠药」立场）、以及他对年轻人的忠告：「降低期望值是获得幸福的最佳途径之一。」这场年会吸引了来自全球的数百名投资者到场，许多人将其视为「最后的朝圣」。九个月后芒格辞世，这场年会成为他公开主持的最后一次大型投资者问答活动。",
    summary_en:
      "On February 15, 2023, the 99-year-old Munger chaired his final Daily Journal annual meeting. Over two hours of Q&A, he addressed AI (cautiously optimistic), China investing, inflation, crypto ('rat poison squared'), and life advice: 'Lowering your expectations is one of the best ways to be happy.' Hundreds attended from around the world. Munger died nine months later, making this his last major public investor Q&A.",
    location: "Los Angeles, CA",
    key: true,
    tags: ["Daily Journal", "最后一次", "年会", "AI"],
    sources: [
      {
        id: "youtube-munger-daily-journal-2023",
        url: "https://www.youtube.com/watch?v=9VVPO3KWj3A",
        kind: "video",
        title: "Charlie Munger at Daily Journal Shareholders Meeting 2/15/2023",
        publisher: "CNBC Television (YouTube)",
        lang: "en",
        primary: true,
        ...HUMAN,
        summary: "CNBC 官方转播芒格最后一次 Daily Journal 股东年会全程。",
      },
    ],
    source_hints: null,
  },

  // ── 18. 2023-05 Last Berkshire annual meeting ──
  {
    id: "munger-2023-05-06-last-berkshire-meeting",
    person_id: "munger",
    date: "2023-05-06",
    date_precision: "day",
    type: "speech",
    title: "最后一次出席伯克希尔·哈撒韦年度股东大会",
    title_en: "Final appearance at Berkshire Hathaway annual meeting",
    summary:
      "2023 年 5 月 6 日，99 岁的芒格最后一次与巴菲特并肩出席在奥马哈举行的伯克希尔·哈撒韦年度股东大会。在长达五小时的问答中，芒格以一贯的犀利风格点评了银行业危机（硅谷银行倒闭后）、商业地产风险、AI 的局限性，以及他对投资中「耐心」的再次强调。当被问及伯克希尔的未来时，巴菲特深情地称赞了芒格六十多年来的贡献，而芒格则以「我没什么要补充的」作为标志性回应。这场年会吸引了约四万名股东到场，许多人意识到这可能是两位传奇最后一次同台。",
    summary_en:
      "On May 6, 2023, the 99-year-old Munger made his final appearance alongside Buffett at the Berkshire Hathaway annual meeting in Omaha. During the five-hour Q&A, he commented on the banking crisis, commercial real estate risks, AI limitations, and patience in investing. Buffett praised Munger's 60+ year contributions; Munger responded with his trademark 'I have nothing to add.' About 40,000 shareholders attended what many sensed would be their last joint appearance.",
    location: "Omaha, Nebraska",
    key: true,
    tags: ["伯克希尔", "最后一次", "巴菲特", "年会"],
    sources: [
      {
        id: "youtube-berkshire-2023-annual",
        url: "https://www.youtube.com/watch?v=UKw_NjWtg5w",
        kind: "video",
        title: "Warren Buffett and Charlie Munger at the 2023 Berkshire Hathaway Annual Meeting",
        publisher: "CNBC Television (YouTube)",
        lang: "en",
        primary: true,
        ...HUMAN,
        summary: "2023 年伯克希尔年会（芒格最后一次出席）——CNBC 官方全程转播。",
      },
      { ...wikipediaMungerSource },
    ],
    source_hints: null,
  },

  // ── 19. 2023 Poor Charlie's Almanack final/expanded edition ──
  {
    id: "munger-2023-12-poor-charlies-final-edition",
    person_id: "munger",
    date: "2023-12-05",
    date_precision: "day",
    type: "writing",
    title: "《穷查理宝典》最终扩展版出版（Stripe Press）",
    title_en: "Poor Charlie's Almanack final expanded edition published by Stripe Press",
    summary:
      "2023 年 12 月 5 日——芒格去世仅一周后——由 Stripe Press 出版的《穷查理宝典》全新扩展版正式面世。这一版本由芒格生前参与审定，新增了他 2007 年以来的多篇演讲和采访文本，以及 Peter Kaufman 的全新导言。Stripe Press 创始人 Patrick Collison（Stripe CEO）亲自推动了这一出版项目。新版以更精美的装帧和更完整的内容，成为芒格思想遗产的最终定本，首批印刷即被抢购一空。",
    summary_en:
      "On December 5, 2023 — just one week after Munger's death — Stripe Press published the final expanded edition of Poor Charlie's Almanack, which Munger had helped prepare before his passing. Edited by Peter Kaufman with new material from Munger's post-2007 speeches and interviews, and championed by Stripe CEO Patrick Collison, it became the definitive edition of Munger's intellectual legacy.",
    location: "USA",
    key: true,
    tags: ["著作", "穷查理宝典", "Stripe Press"],
    sources: [
      {
        id: "wikipedia-poor-charlies",
        url: "https://en.wikipedia.org/wiki/Poor_Charlie%27s_Almanack",
        kind: "article",
        title: "Poor Charlie's Almanack (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
      {
        id: "stripe-press-pca",
        url: "https://press.stripe.com/poor-charlies-almanack",
        kind: "website",
        title: "Poor Charlie's Almanack — Stripe Press",
        publisher: "Stripe Press",
        lang: "en",
        primary: true,
        ...HUMAN,
      },
    ],
    source_hints: "Stripe Press edition; Patrick Collison announced via Twitter/X",
  },

  // ── 20. 2023-11-14 Final CNBC interview ──
  {
    id: "munger-2023-11-14-final-cnbc-interview",
    person_id: "munger",
    date: "2023-11-14",
    date_precision: "day",
    type: "interview",
    title: "最后一次公开采访——CNBC 独家专访",
    title_en: "Final public interview — CNBC exclusive, 14 days before death",
    summary:
      "2023 年 11 月 14 日，距离去世仅 14 天，芒格录制了他的最后一次公开采访——CNBC 的独家长篇专访。在这次采访中，年近百岁的芒格头脑依然清晰，讨论了伯克希尔的未来继任计划（对 Greg Abel 表达了充分信心）、他对投资中「耐心」的毕生信仰、对加密货币和 ESG 投资的批评，以及他对「过好一生」的最终建议：保持理性、终身学习、与好人为伍。这次采访在芒格去世后被 CNBC 作为纪念特别节目播出，被广泛视为一位伟大思想家的「遗言」。",
    summary_en:
      "On November 14, 2023 — just 14 days before his death — Munger recorded his final public interview with CNBC. Sharp as ever at nearly 100, he discussed Berkshire's succession (confidence in Greg Abel), his lifelong belief in patience, criticism of crypto and ESG investing, and final life advice: stay rational, never stop learning, and associate with good people. CNBC aired it as a memorial special after his passing.",
    location: "Los Angeles, CA",
    key: true,
    tags: ["采访", "CNBC", "最后一次", "遗言"],
    sources: [
      {
        id: "youtube-munger-final-interview-cnbc",
        url: "https://www.youtube.com/watch?v=H5Oom5Rjp_Y",
        kind: "video",
        title: "Watch Legendary Investor Charlie Munger's Final Interview With CNBC",
        publisher: "CNBC (YouTube)",
        lang: "en",
        primary: true,
        ...HUMAN,
        summary: "CNBC 纪念特别节目——芒格 2023 年 11 月 14 日录制的最后一次采访。",
      },
    ],
    source_hints: null,
  },
];

const toAdd = newEvents.filter((e) => !existingIds.has(e.id));
const skipped = newEvents.length - toAdd.length;

if (toAdd.length === 0) {
  console.log("nothing to add — all 20 events already exist");
  process.exit(0);
}

const merged = [...events, ...toAdd].sort((a, b) =>
  a.date.localeCompare(b.date)
);

fs.writeFileSync(filePath, JSON.stringify(merged, null, 2) + "\n");
console.log(
  `added ${toAdd.length} munger events (skipped ${skipped}); total now ${merged.length}`
);
