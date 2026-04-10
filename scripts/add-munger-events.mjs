#!/usr/bin/env node
/**
 * Bootstrap Charlie Munger events into data/events/munger.json.
 * Idempotent: skips events whose id already exists.
 * Run audit-urls.mjs --write + parse-youtube.mjs --write + verify-embeds.mjs after.
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
  {
    id: "munger-1924-01-01-birth",
    person_id: "munger",
    date: "1924-01-01",
    date_precision: "day",
    type: "life",
    title: "查理·芒格出生于内布拉斯加州奥马哈",
    title_en: "Charlie Munger born in Omaha, Nebraska",
    summary:
      "1924 年 1 月 1 日，查理·托马斯·芒格出生于内布拉斯加州奥马哈，父亲 Alfred Case Munger 是一名律师。少年时期的芒格曾在巴菲特家族开设的杂货店打工——这段经历是他与奥马哈商人圈最早的连接，也为他日后与沃伦·巴菲特长达六十余年的合作埋下伏笔。芒格自幼以博学好读著称，这种多学科求知的习惯成为他一生的标志。",
    summary_en:
      "Charles Thomas Munger was born on New Year's Day 1924 in Omaha, Nebraska, son of lawyer Alfred Case Munger. As a teenager he worked at Buffett & Son grocery store, decades before meeting Warren Buffett.",
    location: "Omaha, Nebraska",
    key: true,
    tags: ["出生", "奥马哈", "童年"],
    sources: [{ ...wikipediaMungerSource }],
    source_hints: null,
  },

  {
    id: "munger-1942-michigan-army",
    person_id: "munger",
    date: "1942-01-01",
    date_precision: "year",
    type: "education",
    title: "进入密歇根大学，后辍学加入陆军航空兵",
    title_en: "Enrolls at University of Michigan, then joins the Army Air Corps",
    summary:
      "1941 年芒格进入密歇根大学攻读数学，珍珠港事件后于 1942 年辍学，加入美国陆军航空兵团。服役期间他被派往加州理工学院学习气象学，并以少尉军衔在阿拉斯加诺姆基地担任气象官。这段战时经历让芒格首次离开中西部，接触工程与科学训练，也促使他养成了概率思维和系统化决策的习惯。",
    summary_en:
      "Munger entered the University of Michigan in 1941 to study mathematics, but dropped out after Pearl Harbor and enlisted in the U.S. Army Air Corps, serving as a meteorologist and rising to second lieutenant.",
    location: "Ann Arbor, MI / Nome, AK",
    key: true,
    tags: ["教育", "二战", "气象学"],
    sources: [{ ...wikipediaMungerSource }],
    source_hints: null,
  },

  {
    id: "munger-1948-harvard-law",
    person_id: "munger",
    date: "1948-01-01",
    date_precision: "year",
    type: "education",
    title: "以最优等成绩毕业于哈佛法学院",
    title_en: "Graduates Harvard Law School magna cum laude",
    summary:
      "1948 年芒格从哈佛法学院毕业，获得 magna cum laude（最优等）荣誉，是该届 335 名学生中的前 12 名之一。最不寻常的是：他根本没有本科学位——哈佛法学院破格录取了他。这一成就奠定了他严谨的法律训练背景，也为他随后在洛杉矶执业律师生涯铺平了道路。芒格后来反复强调，法学院教会他的并不是法条，而是跨学科解决问题的能力。",
    summary_en:
      "Munger graduated from Harvard Law School magna cum laude in 1948, finishing in the top 12 of his class of 335 — despite never completing an undergraduate degree.",
    location: "Cambridge, MA",
    key: true,
    tags: ["教育", "哈佛法学院"],
    sources: [{ ...wikipediaMungerSource }],
    source_hints: null,
  },

  {
    id: "munger-1953-divorce-tragedy",
    person_id: "munger",
    date: "1953-01-01",
    date_precision: "year",
    type: "life",
    title: "与第一任妻子离婚，长子因白血病去世",
    title_en: "Divorces first wife; son Teddy dies of leukemia soon after",
    summary:
      "1953 年芒格与 1945 年结婚的第一任妻子 Nancy Huggins 离婚，留下三个孩子。一年多后，他九岁的儿子 Teddy 被诊断出白血病，并于 1955 年去世。这段经历是芒格一生中最沉重的打击之一。他后来回忆，正是这段苦难塑造了他面对逆境时的斯多葛态度，以及对「避免愚蠢」远胜于「追求聪明」的人生哲学。",
    summary_en:
      "Munger divorced his first wife Nancy Huggins in 1953. Soon after, their young son Teddy was diagnosed with leukemia and died in 1955 — events Munger described as the most painful of his life and formative of his stoic worldview.",
    location: "Los Angeles, CA",
    key: true,
    tags: ["家庭", "丧子", "苦难"],
    sources: [{ ...wikipediaMungerSource }],
    source_hints: null,
  },

  {
    id: "munger-1956-marries-nancy-borthwick",
    person_id: "munger",
    date: "1956-01-01",
    date_precision: "year",
    type: "life",
    title: "与 Nancy Barry Borthwick 结婚",
    title_en: "Marries Nancy Barry Borthwick",
    summary:
      "1956 年芒格与 Nancy Barry Borthwick 结婚。Nancy 带来了两个儿子，两人婚后又生育了四个孩子，组成八口之家。这段婚姻持续了将近 51 年，直到 Nancy 2010 年去世。芒格多次公开表示，妻子的稳定与智慧是他事业与心智成熟的重要支柱，也是他能长期专注投资与思考的家庭基础。",
    summary_en:
      "In 1956 Munger married Nancy Barry Borthwick; the blended family eventually included eight children. The marriage lasted nearly 51 years until Nancy's death in 2010.",
    location: "Los Angeles, CA",
    key: false,
    tags: ["家庭", "婚姻"],
    sources: [{ ...wikipediaMungerSource }],
    source_hints: null,
  },

  {
    id: "munger-1959-meets-buffett",
    person_id: "munger",
    date: "1959-01-01",
    date_precision: "year",
    type: "life",
    title: "在奥马哈晚宴上首次遇见沃伦·巴菲特",
    title_en: "Meets Warren Buffett at an Omaha dinner",
    summary:
      "1959 年，35 岁的芒格因父亲去世返回奥马哈处理遗产，经共同朋友 Davis 医生家族介绍，在一场晚宴上首次认识了 28 岁的沃伦·巴菲特。两人一见如故，从投资聊到商业再到人生哲学，几乎立刻成为终生挚友。这次会面被后世誉为商业史上最重要的相遇之一，直接催生了此后六十余年伯克希尔·哈撒韦的传奇合作关系。",
    summary_en:
      "In 1959 Munger, back in Omaha after his father's death, was introduced to Warren Buffett at a dinner hosted by the Davis family. The two instantly clicked, beginning one of the most consequential partnerships in business history.",
    location: "Omaha, Nebraska",
    key: true,
    tags: ["巴菲特", "伯克希尔", "关键相遇"],
    sources: [{ ...wikipediaMungerSource }],
    source_hints: "Davis family dinner introduction; widely recounted in Buffett biographies",
  },

  {
    id: "munger-1962-wheeler-munger-founding",
    person_id: "munger",
    date: "1962-01-01",
    date_precision: "year",
    type: "founding",
    title: "创立 Wheeler, Munger & Co. 投资合伙公司",
    title_en: "Founds Wheeler, Munger & Co. investment partnership",
    summary:
      "1962 年芒格在洛杉矶与 Jack Wheeler 共同创立了 Wheeler, Munger & Co. 投资合伙公司，正式从全职律师转向专业投资人。同年他还合伙创办了 Munger, Tolles & Olson 律师事务所。Wheeler Munger 在 1962-1975 年间取得了年化约 19.8% 的回报——远远跑赢同期道琼斯指数，展现了芒格作为集中投资者的非凡能力。",
    summary_en:
      "In 1962 Munger co-founded the Wheeler, Munger & Co. investment partnership in Los Angeles, transitioning from full-time law to professional investing. The fund delivered roughly 19.8% annualized returns from 1962-1975, vastly outperforming the Dow.",
    location: "Los Angeles, CA",
    key: true,
    tags: ["创立", "投资合伙", "Wheeler Munger"],
    sources: [{ ...wikipediaMungerSource }],
    source_hints: null,
  },

  {
    id: "munger-1975-closes-wheeler-munger",
    person_id: "munger",
    date: "1975-01-01",
    date_precision: "year",
    type: "career",
    title: "经历 1973-74 熊市后关闭 Wheeler Munger",
    title_en: "Closes Wheeler Munger after the 1973-74 bear market",
    summary:
      "1973-1974 年的严重熊市让 Wheeler, Munger & Co. 连续两年大幅亏损，1973 年下跌约 31.9%，1974 年再跌 31.5%。尽管整个 13 年期内仍取得优秀回报，芒格还是在 1975 年清盘了合伙公司，把精力转向 Blue Chip Stamps 与 Wesco Financial 的运营。这段经历成为他日后反复警示「杠杆与流动性风险」的切身教训。",
    summary_en:
      "After back-to-back losses of about 32% in 1973 and 31% in 1974, Munger wound down Wheeler, Munger & Co. in 1975 and shifted focus to Blue Chip Stamps and Wesco Financial.",
    location: "Los Angeles, CA",
    key: true,
    tags: ["熊市", "清盘", "教训"],
    sources: [{ ...wikipediaMungerSource }],
    source_hints: null,
  },

  {
    id: "munger-1978-berkshire-vice-chairman",
    person_id: "munger",
    date: "1978-01-01",
    date_precision: "year",
    type: "career",
    title: "出任伯克希尔·哈撒韦副董事长",
    title_en: "Becomes Vice Chairman of Berkshire Hathaway",
    summary:
      "1978 年，随着 Diversified Retailing 与 Blue Chip Stamps 等公司逐步并入伯克希尔·哈撒韦的版图，芒格正式加入伯克希尔董事会并出任副董事长。这一角色他担任了长达 45 年，直到去世。作为巴菲特最重要的智囊，芒格推动伯克希尔从「用便宜价格买平庸公司」转向「用合理价格买卓越公司」，彻底改变了公司的投资哲学与长期业绩。",
    summary_en:
      "In 1978 Munger formally joined the Berkshire Hathaway board as Vice Chairman, a role he held for 45 years until his death. He famously pushed Buffett from buying \"cigar butts\" to buying wonderful businesses at fair prices.",
    location: "Omaha, Nebraska",
    key: true,
    tags: ["伯克希尔", "副董事长", "巴菲特"],
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
    source_hints: null,
  },

  {
    id: "munger-1984-wesco-chairman",
    person_id: "munger",
    date: "1984-01-01",
    date_precision: "year",
    type: "career",
    title: "出任 Wesco Financial 董事长",
    title_en: "Becomes Chairman of Wesco Financial",
    summary:
      "1984 年芒格出任 Wesco Financial Corporation 董事长，该公司是伯克希尔通过 Blue Chip Stamps 控股的子公司。在芒格领导下，Wesco 旗下的 See's Candies、Precision Steel、Kansas Bankers Surety 以及 CORT Business Services 等业务持续发展。Wesco 年报中芒格亲笔撰写的董事长信件，成为投资界与伯克希尔股东信齐名的智慧资源，直到 2011 年 Wesco 完全并入伯克希尔。",
    summary_en:
      "In 1984 Munger became Chairman of Wesco Financial, a Berkshire subsidiary. His annual chairman's letters and Wesco shareholder meetings became revered sources of investing and life wisdom.",
    location: "Pasadena, CA",
    key: true,
    tags: ["Wesco", "董事长"],
    sources: [
      {
        id: "wikipedia-wesco",
        url: "https://en.wikipedia.org/wiki/Wesco_Financial",
        kind: "article",
        title: "Wesco Financial (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
    ],
    source_hints: null,
  },

  {
    id: "munger-1995-06-13-harvard-school-speech",
    person_id: "munger",
    date: "1995-06-13",
    date_precision: "day",
    type: "speech",
    title: "Harvard School 毕业演讲《如何保证悲惨的一生》",
    title_en: "Harvard School commencement: \"How to Guarantee a Life of Misery\"",
    summary:
      "1995 年 6 月 13 日，芒格在洛杉矶 Harvard School 毕业典礼上发表了著名的反向演讲《如何保证一生的悲惨》。他用反讽的方式列出了保证人生失败的几条「良方」：依赖化学物质成瘾、嫉妒、怨恨、不可靠、只从亲身经验中学习、屡战屡败仍不放弃。这篇演讲后来被收录进《穷查理宝典》，成为芒格「反向思考」哲学的经典之作。",
    summary_en:
      "On June 13, 1995, Munger delivered his famous \"How to Guarantee a Life of Misery\" inversion speech at Harvard School in Los Angeles, listing surefire prescriptions for failure — later anthologized in Poor Charlie's Almanack.",
    location: "Los Angeles, CA",
    key: true,
    tags: ["演讲", "反向思考", "穷查理宝典"],
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
    source_hints: "Date sometimes given as 1986; 1995 is the most cited",
  },

  {
    id: "munger-2005-poor-charlies-almanack",
    person_id: "munger",
    date: "2005-01-01",
    date_precision: "year",
    type: "writing",
    title: "《穷查理宝典》正式出版",
    title_en: "Poor Charlie's Almanack published",
    summary:
      "由 Peter Kaufman 编辑、芒格本人参与审定的《Poor Charlie's Almanack: The Wit and Wisdom of Charles T. Munger》于 2005 年由 Donning Company 正式出版（此前 2003 年曾以限量版面世）。书中汇集了芒格的演讲、采访、人生哲学以及他著名的「心智模型」清单和「人类误判心理学」演讲。该书迅速成为价值投资者和跨学科思考者的圣经，在中文世界的影响力尤为深远。",
    summary_en:
      "Edited by Peter Kaufman, Poor Charlie's Almanack: The Wit and Wisdom of Charles T. Munger was formally published in 2005 (after a 2003 limited edition), collecting Munger's speeches and his famous \"Psychology of Human Misjudgment\" talk.",
    location: "USA",
    key: true,
    tags: ["著作", "穷查理宝典", "心智模型"],
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
    ],
    source_hints: "Limited 2003 edition; trade edition 2005; expanded editions 2006, 2023",
  },

  {
    id: "munger-2007-05-13-usc-law-speech",
    person_id: "munger",
    date: "2007-05-13",
    date_precision: "day",
    type: "speech",
    title: "南加州大学法学院毕业演讲",
    title_en: "USC Gould School of Law commencement speech",
    summary:
      "2007 年 5 月 13 日，芒格在南加州大学（USC）法学院毕业典礼上发表了被广泛传颂的演讲。他强调「获得智慧是一种道德义务」，倡导终身学习、跨学科思维、避免嫉妒与怨恨，以及最重要的——「想要被信任，就要值得被信任」。这场演讲被誉为芒格最完整阐述其人生哲学的一次，后来被作为《穷查理宝典》新版的核心章节。",
    summary_en:
      "On May 13, 2007, Munger delivered his celebrated USC Gould School of Law commencement address, urging graduates to acquire wisdom as a moral duty and to \"be trustworthy\" as the surest path to a good life.",
    location: "Los Angeles, CA",
    key: true,
    tags: ["演讲", "USC", "经典", "智慧"],
    sources: [
      {
        id: "genius-usc-2007",
        url: "https://genius.com/Charlie-munger-usc-law-commencement-speech-annotated",
        kind: "transcript",
        title: "Charlie Munger – USC Law Commencement Speech (Annotated)",
        publisher: "Genius",
        lang: "en",
        primary: false,
        ...HUMAN,
      },
      { ...wikipediaMungerSource },
    ],
    source_hints: null,
  },

  {
    id: "munger-2011-wesco-merger",
    person_id: "munger",
    date: "2011-06-24",
    date_precision: "day",
    type: "deal",
    title: "Wesco Financial 完全并入伯克希尔·哈撒韦",
    title_en: "Wesco Financial fully merged into Berkshire Hathaway",
    summary:
      "2011 年 6 月，伯克希尔·哈撒韦完成了对 Wesco Financial 剩余约 19.9% 股份的收购，Wesco 正式成为伯克希尔的全资子公司，芒格主持了将近三十年的 Wesco 年会就此落幕。这一传统并未消失——芒格随后将类似的问答会迁移到他另一家担任董事长的公司 Daily Journal 上，从 2014 年起开启了「每日期刊年会」的新阶段。",
    summary_en:
      "In June 2011 Berkshire Hathaway acquired the remaining ~19.9% of Wesco Financial it didn't already own, fully absorbing Wesco. Munger's Wesco annual meetings ended after nearly three decades.",
    location: "Pasadena, CA",
    key: true,
    tags: ["Wesco", "并购", "伯克希尔"],
    sources: [
      {
        id: "wikipedia-wesco-2",
        url: "https://en.wikipedia.org/wiki/Wesco_Financial",
        kind: "article",
        title: "Wesco Financial (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
    ],
    source_hints: "Merger announced Feb 2011, closed June 2011",
  },

  {
    id: "munger-2023-11-28-death",
    person_id: "munger",
    date: "2023-11-28",
    date_precision: "day",
    type: "life",
    title: "在加州 Santa Barbara 去世，享年 99 岁",
    title_en: "Dies at 99 in Santa Barbara, California",
    summary:
      "2023 年 11 月 28 日，距离他 100 岁生日仅 34 天，查理·芒格在加州 Santa Barbara 的一家医院安然辞世。伯克希尔·哈撒韦当日发布声明，巴菲特表示：「如果没有查理的灵感、智慧和参与，伯克希尔不可能达到今天的地位。」芒格留下八个子女、孙辈与曾孙辈，以及一份长达六十余年的合作伙伴遗产——以多学科思维、理性与正直为核心的「芒格主义」，将继续影响一代又一代投资者与思考者。",
    summary_en:
      "Charlie Munger died on November 28, 2023, at a hospital in Santa Barbara, California, just 34 days short of his 100th birthday. Berkshire Hathaway announced his death the same day; Buffett said Berkshire \"could not have been built to its present status without Charlie's inspiration, wisdom and participation.\"",
    location: "Santa Barbara, CA",
    key: true,
    tags: ["逝世", "纪念"],
    sources: [
      {
        id: "berkshire-press-release-munger-death",
        url: "https://www.berkshirehathaway.com/news/nov2823.pdf",
        kind: "document",
        title: "Berkshire Hathaway Press Release on Charlie Munger's Death",
        publisher: "Berkshire Hathaway",
        lang: "en",
        primary: true,
        ...HUMAN,
      },
      { ...wikipediaMungerSource },
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
  `added ${toAdd.length} munger events (skipped ${skipped}); total now ${merged.length}`
);
