#!/usr/bin/env node
/**
 * Add new events to data/events/jobs.json. Idempotent: skips events whose
 * `id` already exists. After running, run scripts/audit-urls.mjs --write to
 * fill in real wayback timestamps.
 */
import fs from "node:fs";
import path from "node:path";

const filePath = path.join(process.cwd(), "data", "events", "jobs.json");
const events = JSON.parse(fs.readFileSync(filePath, "utf8"));
const existingIds = new Set(events.map((e) => e.id));

// Helpers to keep the data block below readable
const HUMAN = { license: "all-rights-reserved", authored_by: "human", mentions: [] };
const CCBYSA = { license: "cc-by-sa", authored_by: "human", mentions: [] };
const PUBDOM = { license: "public-domain", authored_by: "human", mentions: [] };

const newEvents = [
  // ============ 1968 Hewlett cold call ============
  {
    id: "jobs-1968-hewlett-call",
    person_id: "jobs",
    date: "1968-01-01",
    date_precision: "year",
    type: "life",
    title: "12 岁打电话给 Bill Hewlett 要零件",
    title_en: "Cold-calls Bill Hewlett at age 12",
    summary:
      "12 岁的乔布斯想做一个频率计，缺零件，就从电话簿里翻出 HP 联合创始人 Bill Hewlett 的家里电话直接打过去。Hewlett 接了，跟他聊了 20 分钟，不仅给了零件，还在那年夏天给了他一份 HP 流水线上的暑期工。乔布斯后来反复用这件事讲一个观点：大多数人不去争取，是因为他们从来不开口要。",
    location: "Mountain View, CA",
    key: true,
    tags: ["童年", "经典语录"],
    sources: [
      {
        id: "cnbc-hewlett-call",
        url: "https://www.cnbc.com/2018/07/25/how-steve-jobs-cold-called-his-way-to-an-internship-at-hewlett-packard.html",
        kind: "article",
        title: "How a cold call helped a young Steve Jobs score his first internship at Hewlett-Packard",
        publisher: "CNBC",
        lang: "en",
        primary: false,
        ...HUMAN,
        quotes: [
          {
            text: "Hi, I'm Steve Jobs, I'm twelve years old. I am a student in high school, and I want to build a frequency counter and I was wondering if you had any spare parts I could have.",
            text_zh: "你好，我叫 Steve Jobs，12 岁，我是一名高中生。我想做一个频率计，不知道您有没有多余的零件可以给我。",
            speaker: "Steve Jobs",
            context: "12 岁的乔布斯打电话给 HP 联合创始人 Bill Hewlett 时的开场白。Hewlett 笑了，给了他零件，还给了他一个 HP 暑期工",
          },
        ],
      },
    ],
    source_hints: null,
  },

  // ============ 1972 Reed College ============
  {
    id: "jobs-1972-09-reed-college",
    person_id: "jobs",
    date: "1972-09-01",
    date_precision: "month",
    type: "education",
    title: "进入 Reed College 一学期后退学，旁听书法课",
    title_en: "Enters Reed College, drops out after one semester",
    summary:
      "1972 年秋季入读 Oregon 的 Reed College——一所学费昂贵的文理学院。养父母把全部积蓄都拿出来给他付学费。一个学期后他主动退学，但又在校园里旁听了 18 个月，其中最重要的一门是 Trappist 修道士 Robert Palladino 教授的西方书法课。十年后，这门课变成了 Macintosh 第一次让大众电脑拥有了真正的字体排印（typography）。",
    location: "Reed College, Portland, OR",
    key: true,
    tags: ["求学", "书法", "Reed"],
    sources: [
      {
        id: "reed-jobs-page",
        url: "https://www.reed.edu/about/steve-jobs.html",
        kind: "article",
        title: "Steve Jobs and Reed College",
        publisher: "Reed College",
        lang: "en",
        primary: true,
        ...HUMAN,
      },
      {
        id: "reed-magazine-jobs-obit",
        url: "https://www.reed.edu/reed-magazine/in-memoriam/obituaries/december2011/steve-jobs-1976.html",
        kind: "article",
        title: "Steve Jobs '76 (In Memoriam)",
        publisher: "Reed Magazine",
        lang: "en",
        primary: true,
        ...HUMAN,
      },
    ],
    source_hints: null,
  },

  // ============ 1974 India trip ============
  {
    id: "jobs-1974-india",
    person_id: "jobs",
    date: "1974-07-01",
    date_precision: "month",
    type: "life",
    title: "印度之行寻找精神导师",
    title_en: "Travels to India seeking spiritual teacher",
    summary:
      "受 Reed 校友 Robert Friedland 影响，乔布斯和 Daniel Kottke 飞往印度，去 Kainchi 山的 Neem Karoli Baba 修行所朝圣。但他们到的时候，大师已经在 1973 年 9 月去世，修行所几乎空无一人。两人在印度待了七个月，剃了光头穿当地长袍，体验贫困和饥饿。乔布斯回美后认为东方哲学比西方理性主义更接近真理——这种感受塑造了他后来对设计的简约和直觉的偏执。",
    location: "Kainchi, India",
    key: true,
    tags: ["印度", "禅", "精神探索"],
    sources: [
      {
        id: "wikipedia-jobs-bio",
        url: "https://en.wikipedia.org/wiki/Steve_Jobs",
        kind: "article",
        title: "Steve Jobs (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
    ],
    source_hints: "Isaacson 传记第 4 章；Daniel Kottke 后来的回忆录",
  },

  // ============ 1982-02-15 Time cover ============
  {
    id: "jobs-1982-02-15-time-cover",
    person_id: "jobs",
    date: "1982-02-15",
    date_precision: "day",
    type: "award",
    title: "首次登上 Time 封面",
    title_en: "First Time magazine cover",
    summary:
      "27 岁的乔布斯成为 Time 杂志 1982 年 2 月 15 日封面人物，专题《Striking It Rich》（暴富）讲美国新一代技术创业者。这是他第一次进入主流大众视野。年底 Time 又做\"年度风云人物\"，所有人都以为是乔布斯，结果 Time 选了\"个人电脑\"作为\"年度机器\"。乔布斯崩溃哭了——后来他把这件事讲了一辈子。",
    location: "USA (national publication)",
    key: true,
    tags: ["Time", "媒体"],
    sources: [
      {
        id: "time-1982-cover",
        url: "https://content.time.com/time/covers/0,16641,19820215,00.html",
        kind: "image",
        title: "TIME Magazine Cover: Risk Takers (Feb. 15, 1982)",
        publisher: "Time",
        lang: "en",
        primary: true,
        ...HUMAN,
      },
      {
        id: "cultofmac-1982-time-cover",
        url: "https://www.cultofmac.com/apple-history/steve-jobs-time-magazine-cover",
        kind: "article",
        title: "Steve Jobs appears on cover of 'Time'",
        publisher: "Cult of Mac",
        lang: "en",
        primary: false,
        ...HUMAN,
      },
    ],
    source_hints: null,
  },

  // ============ 1983-01-19 Apple Lisa launch ============
  {
    id: "jobs-1983-01-19-lisa",
    person_id: "jobs",
    date: "1983-01-19",
    date_precision: "day",
    type: "product",
    title: "Apple Lisa 发布",
    title_en: "Apple Lisa launched",
    summary:
      "Apple 在年度股东大会上发布 Lisa——第一台面向商业用户的图形界面个人电脑，售价 9,995 美元。Lisa 在商业上失败，但定义了 GUI 在桌面电脑上的未来。乔布斯本人当时已被赶出 Lisa 项目，转而带领更小、更便宜的 Macintosh 团队，所以 Lisa 发布会上他几乎没有参与——这是导致他与 Sculley 的权力斗争开始的伏笔之一。",
    location: "Cupertino, CA",
    key: true,
    tags: ["Lisa", "GUI", "失败"],
    sources: [
      {
        id: "wikipedia-apple-lisa",
        url: "https://en.wikipedia.org/wiki/Apple_Lisa",
        kind: "article",
        title: "Apple Lisa (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
      {
        id: "chm-apple-lisa",
        url: "https://computerhistory.org/blog/the-lisa-apples-most-influential-failure/",
        kind: "article",
        title: "The Lisa: Apple's Most Influential Failure",
        publisher: "Computer History Museum",
        lang: "en",
        primary: false,
        ...HUMAN,
      },
    ],
    source_hints: null,
  },

  // ============ 1985-02 Playboy interview ============
  {
    id: "jobs-1985-02-playboy-interview",
    person_id: "jobs",
    date: "1985-02-01",
    date_precision: "month",
    type: "interview",
    title: "Playboy 杂志深度采访发表",
    title_en: "Playboy interview published",
    summary:
      "由 David Sheff 主持的长篇采访发表在 Playboy 1985 年 2 月号。这是 Mac 发布一年后、乔布斯被赶出 Apple 几个月前。采访长度足足 12 页，乔布斯谈论从童年到产品哲学到 Apple 内部斗争。是他生涯早期最坦率、信息量最大的一次访谈，许多后来反复被引用的早期金句都来自这里。",
    location: "USA (Playboy magazine)",
    key: true,
    tags: ["采访", "经典", "早期"],
    sources: [
      {
        id: "allaboutstevejobs-playboy-1985",
        url: "https://allaboutstevejobs.com/verbatim/interviews/playboy_1985",
        kind: "transcript",
        title: "Playboy Interview: Steven Jobs (1985)",
        publisher: "All About Steve Jobs",
        lang: "en",
        primary: true,
        ...HUMAN,
        summary:
          "All About Steve Jobs 整理的完整文字稿。访谈由 David Sheff 主持（他后来做过约翰·列侬的最后一次大采访），是 1980 年代关于乔布斯本人最深入的采访记录。",
      },
      {
        id: "archive-jobs-playboy-1985",
        url: "https://archive.org/details/jobs-playboy",
        kind: "document",
        title: "Steven Jobs Playboy Interview (Feb 1985)",
        publisher: "Internet Archive",
        lang: "en",
        primary: true,
        ...HUMAN,
      },
    ],
    source_hints: null,
  },

  // ============ 1988-10-12 NeXT Computer launch ============
  {
    id: "jobs-1988-10-12-next-computer",
    person_id: "jobs",
    date: "1988-10-12",
    date_precision: "day",
    type: "product",
    title: "NeXT Computer 发布",
    title_en: "NeXT Computer launched at Davies Symphony Hall",
    summary:
      "在旧金山 Davies Symphony Hall 举办盛大的 NeXT 计算机发布会，3,000 多人到场。两小时的演出包括产品演示和音乐表演——NeXT Cube 与一位交响乐团小提琴手合奏了一段巴赫。这台机器的工业设计、NeXTSTEP 操作系统、面向对象编程框架，后来都成为 Mac OS X 的基础，奠定了乔布斯回归后整个 21 世纪 Apple 的技术底色。Tim Berners-Lee 用 NeXT Cube 写出了第一个 Web 浏览器和服务器。",
    location: "Davies Symphony Hall, San Francisco, CA",
    key: true,
    tags: ["NeXT", "Keynote", "经典"],
    sources: [
      {
        id: "wikipedia-next-introduction",
        url: "https://en.wikipedia.org/wiki/NeXT_Introduction",
        kind: "article",
        title: "NeXT Introduction (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
      {
        id: "allaboutstevejobs-next-cube-1988",
        url: "https://allaboutstevejobs.com/videos/keynotes/next_cube_introduction_1988",
        kind: "video",
        title: "NeXT Cube Introduction (1988-10-12)",
        publisher: "All About Steve Jobs",
        lang: "en",
        primary: true,
        ...HUMAN,
      },
    ],
    source_hints: null,
  },

  // ============ 1991-03-18 marriage ============
  {
    id: "jobs-1991-03-18-marries-laurene",
    person_id: "jobs",
    date: "1991-03-18",
    date_precision: "day",
    type: "life",
    title: "与 Laurene Powell 在 Yosemite 结婚",
    title_en: "Marries Laurene Powell at Yosemite",
    summary:
      "在 Yosemite 国家公园的 Ahwahnee Hotel 举行禅宗婚礼，由日本禅师乙川弘文（Kōbun Chino Otogawa）主持。约 50 位亲友到场，包括养父 Paul Jobs 和亲妹妹 Mona Simpson。结婚蛋糕是素食的，做成 Yosemite 半圆顶（Half Dome）的形状。婚礼后大家在雪地里徒步。两人 1989 年 10 月在乔布斯去 Stanford 商学院演讲时认识，结婚时 Laurene 已经怀着大儿子 Reed。",
    location: "Ahwahnee Hotel, Yosemite National Park, CA",
    key: true,
    tags: ["家庭", "婚姻", "Laurene"],
    sources: [
      {
        id: "wikipedia-laurene-powell-jobs",
        url: "https://en.wikipedia.org/wiki/Laurene_Powell_Jobs",
        kind: "article",
        title: "Laurene Powell Jobs (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
      {
        id: "cultofmac-jobs-marriage",
        url: "https://www.cultofmac.com/apple-history/steve-jobs-marries-laurene-powell",
        kind: "article",
        title: "Laurene Powell marries Steve Jobs",
        publisher: "Cult of Mac",
        lang: "en",
        primary: false,
        ...HUMAN,
      },
    ],
    source_hints: null,
  },

  // ============ 1995-11-29 Pixar IPO ============
  {
    id: "jobs-1995-11-29-pixar-ipo",
    person_id: "jobs",
    date: "1995-11-29",
    date_precision: "day",
    type: "deal",
    title: "Pixar 上市，乔布斯成为亿万富翁",
    title_en: "Pixar IPO makes Jobs a billionaire",
    summary:
      "Toy Story 上映一周后，Pixar 在纳斯达克挂牌。每股开盘 22 美元，收盘 39 美元，公司估值 15 亿美元。持有 80% 股份的乔布斯一夜之间从财务困境（前 9 年累计亏损约 5000 万美元）变成 40 岁的亿万富翁。这次 IPO 比 1980 年 Apple 上市让他赚的钱还多——颇具讽刺意味的是，让乔布斯真正成为亿万富翁的是 Pixar 而不是 Apple。",
    location: "NASDAQ",
    key: true,
    tags: ["Pixar", "IPO", "亿万富翁"],
    sources: [
      {
        id: "wikipedia-pixar",
        url: "https://en.wikipedia.org/wiki/Pixar",
        kind: "article",
        title: "Pixar (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
      {
        id: "cultofmac-pixar-ipo",
        url: "https://www.cultofmac.com/apple-history/pixar-ipo-makes-steve-jobs-billionaire",
        kind: "article",
        title: "Pixar IPO makes Steve Jobs a billionaire",
        publisher: "Cult of Mac",
        lang: "en",
        primary: false,
        ...HUMAN,
      },
    ],
    source_hints: null,
  },

  // ============ 1996-02 Wired interview ============
  {
    id: "jobs-1996-02-wired-interview",
    person_id: "jobs",
    date: "1996-02-01",
    date_precision: "month",
    type: "interview",
    title: "Wired \"The Next Insanely Great Thing\" 采访",
    title_en: "Wired \"The Next Insanely Great Thing\" interview",
    summary:
      "Wired 1996 年 2 月号封面采访，由 Gary Wolf 主持。乔布斯在 NeXT 末期、Apple 收购之前几个月接受访谈。他在采访里宣告\"桌面电脑产业已经死了\"\"创新基本停止了\"，并预言下一波是\"对象\"和\"Web\"——并且 \"Web 的核心将是商业\"——这些预言后来全都成真。",
    location: "USA (Wired magazine)",
    key: true,
    tags: ["采访", "Wired", "前瞻"],
    sources: [
      {
        id: "allaboutstevejobs-wired-1996",
        url: "https://allaboutstevejobs.com/verbatim/interviews",
        kind: "transcript",
        title: "Wired Interview: The Next Insanely Great Thing (1996)",
        publisher: "All About Steve Jobs",
        lang: "en",
        primary: true,
        ...HUMAN,
        quotes: [
          {
            text: "The desktop computer industry is dead. Innovation has virtually ceased.",
            text_zh: "桌面电脑产业已经死了。创新基本上已经停止了。",
            speaker: "Steve Jobs",
            context: "1996 年 NeXT 末期接受 Wired 采访时的判断。一个月后 Apple 就宣布收购 NeXT，他回归 Apple",
          },
          {
            text: "The heart of the Web will be commerce, and the heart of commerce will be corporate America serving custom products to individual consumers.",
            text_zh: "Web 的核心将是商业，而商业的核心将是企业为每一个独立消费者提供定制产品。",
            speaker: "Steve Jobs",
            context: "1996 年的预言，今天的电商和个性化推荐算法是这句话的应验",
          },
        ],
      },
    ],
    source_hints: "原始 Wired 1996-02 issue（实体杂志）；wired.com 网站可能未存档全文",
  },

  // ============ 1997-09-28 Think Different ============
  {
    id: "jobs-1997-09-28-think-different",
    person_id: "jobs",
    date: "1997-09-28",
    date_precision: "day",
    type: "product",
    title: "\"Think Different\" 广告战役上线",
    title_en: "\"Think Different\" campaign launches",
    summary:
      "Apple 推出标志性的 \"Think Different\" 广告——黑白镜头展示爱因斯坦、甘地、约翰·列侬、毕加索、马丁·路德·金等\"疯狂的人\"。文案 \"Here's to the crazy ones\" 由 TBWA\\Chiat\\Day 的 Rob Siltanen 与 Lee Clow 团队撰写，乔布斯亲自参与定稿。这是他回归 Apple 后第一次重新定义品牌，明确告诉世界：Apple 不是一家电脑公司，是一家\"为想要改变世界的人服务\"的公司。次年这条广告拿下 Emmy 最佳广告奖。",
    location: "USA (national broadcast)",
    key: true,
    tags: ["广告", "品牌", "经典", "Lee Clow"],
    sources: [
      {
        id: "wikipedia-think-different",
        url: "https://en.wikipedia.org/wiki/Think_different",
        kind: "article",
        title: "Think different (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
      {
        id: "cultofmac-think-different",
        url: "https://www.cultofmac.com/apple-history/apple-think-different-ad-campaign",
        kind: "article",
        title: "Today in Apple history: 'Here's to the crazy ones' who 'think different'",
        publisher: "Cult of Mac",
        lang: "en",
        primary: false,
        ...HUMAN,
      },
    ],
    source_hints: null,
  },

  // ============ 1998-05-06 iMac unveiled ============
  {
    id: "jobs-1998-05-06-imac-unveiled",
    person_id: "jobs",
    date: "1998-05-06",
    date_precision: "day",
    type: "product",
    title: "在 Flint Center 揭幕 iMac",
    title_en: "Unveils iMac at Flint Center",
    summary:
      "乔布斯在 De Anza College Flint Center 拉开黑布揭幕初代 iMac。他说：\"iMac 来自 Internet 的兴奋和 Macintosh 的简单的婚姻。\" 半透明邦迪蓝外壳由 Jonathan Ive 设计，取消软驱、内置 USB、一体化造型——彻底重新定义了消费级电脑应该长什么样。3 个月后正式上市，6 周内卖出 27.8 万台，成为乔布斯回归 Apple 后第一个真正的爆款，挽救了一家几乎破产的公司。",
    location: "Flint Center, De Anza College, Cupertino, CA",
    key: true,
    tags: ["iMac", "Jony Ive", "Keynote"],
    sources: [
      {
        id: "archive-imac-1998-intro",
        url: "https://archive.org/details/1998-05-06-i-mac-introduction_202110",
        kind: "video",
        title: "Apple Special Event May 1998 (iMac Introduction)",
        publisher: "Internet Archive",
        lang: "en",
        primary: true,
        ...HUMAN,
        summary:
          "1998 年 5 月 6 日 iMac 揭幕的发布会录像，托管于 Internet Archive。包括\"iMac comes from the marriage of the excitement of the Internet with the simplicity of Macintosh\" 这句话的现场。",
      },
      {
        id: "allaboutstevejobs-imac-1998",
        url: "https://allaboutstevejobs.com/videos/keynotes/imac_introduction_1998",
        kind: "video",
        title: "iMac Introduction (1998-05-06)",
        publisher: "All About Steve Jobs",
        lang: "en",
        primary: true,
        ...HUMAN,
      },
    ],
    source_hints: null,
  },

  // ============ 2000-01-05 Macworld + permanent CEO ============
  {
    id: "jobs-2000-01-05-permanent-ceo",
    person_id: "jobs",
    date: "2000-01-05",
    date_precision: "day",
    type: "career",
    title: "Macworld 2000：宣布转正 CEO，揭幕 Mac OS X",
    title_en: "Macworld 2000: drops \"interim\" CEO title, unveils Mac OS X",
    summary:
      "在 Macworld San Francisco 2000 主题演讲上，乔布斯宣布把头衔里的 \"interim\" 拿掉——正式成为 Apple 的 CEO（在他自创的 \"iCEO\" 阶段两年半之后）。同一场演讲上还揭幕了 Mac OS X。两周后董事会批准给他 1000 万股期权和一架 Gulfstream V 飞机作为 \"为公司服务两年半的奖励\"。Apple 的复活就此正式完成。",
    location: "Moscone Center, San Francisco, CA",
    key: true,
    tags: ["CEO", "Mac OS X", "Keynote"],
    sources: [
      {
        id: "apple-newsroom-mac-os-x-2000",
        url: "https://www.apple.com/newsroom/2000/01/05Apple-Unveils-Mac-OS-X-and-Internet-Strategy-at-Macworld-Expo/",
        kind: "article",
        title: "Apple Unveils Mac OS X and Internet Strategy at Macworld Expo",
        publisher: "Apple Newsroom",
        lang: "en",
        primary: true,
        ...HUMAN,
      },
      {
        id: "apple-newsroom-ceo-comp-2000",
        url: "https://www.apple.com/newsroom/2000/01/19Apple-Board-of-Directors-Announces-CEO-Compensation/",
        kind: "article",
        title: "Apple Board of Directors Announces CEO Compensation",
        publisher: "Apple Newsroom",
        lang: "en",
        primary: true,
        ...HUMAN,
        summary:
          "两周后董事会发布的 CEO 薪酬公告：1000 万股期权 + 一架 Gulfstream V 喷气机，作为对乔布斯过去 30 个月把 Apple 从破产边缘救回来的回报。",
      },
    ],
    source_hints: null,
  },

  // ============ 2001-05-19 First Apple Store ============
  {
    id: "jobs-2001-05-19-first-apple-store",
    person_id: "jobs",
    date: "2001-05-19",
    date_precision: "day",
    type: "founding",
    title: "第一家 Apple Store 在 Tysons Corner 开业",
    title_en: "First Apple Store opens at Tysons Corner",
    summary:
      "Apple 的第一两家零售店同日在弗吉尼亚州 Tysons Corner 和加州 Glendale 开业。开业前几天乔布斯亲自带记者参观 Tysons Corner 店并录制了一段视频导览。当时业内人都觉得 Apple 开实体店是疯狂的——业内分析师 David Goldstein 公开断言 \"Apple Store 两年内必倒\"。事实正相反：Apple Store 后来定义了 21 世纪的零售设计，开业当日就有 500 人凌晨排队，第一周末两家店共接待 7,700 人、营业额 59.9 万美元。",
    location: "Tysons Corner Center, Tysons, VA",
    key: true,
    tags: ["零售", "Apple Store", "Ron Johnson"],
    sources: [
      {
        id: "apple-newsroom-25-stores-2001",
        url: "https://www.apple.com/newsroom/2001/05/15Apple-to-Open-25-Retail-Stores-in-2001/",
        kind: "article",
        title: "Apple to Open 25 Retail Stores in 2001",
        publisher: "Apple Newsroom",
        lang: "en",
        primary: true,
        ...HUMAN,
      },
      {
        id: "cultofmac-first-apple-store",
        url: "https://www.cultofmac.com/news/may-2001-the-first-apple-store-opens",
        kind: "article",
        title: "May 2001: The First Apple Store Opens",
        publisher: "Cult of Mac",
        lang: "en",
        primary: false,
        ...HUMAN,
      },
    ],
    source_hints: null,
  },

  // ============ 2003-04-28 iTunes Music Store ============
  {
    id: "jobs-2003-04-28-itunes-music-store",
    person_id: "jobs",
    date: "2003-04-28",
    date_precision: "day",
    type: "product",
    title: "iTunes Music Store 上线",
    title_en: "iTunes Music Store launches",
    summary:
      "Apple 上线 iTunes Music Store——首个被五大唱片公司全部支持的合法数字音乐商店。每首歌 99 美分，无订阅费、无 DRM 限制（最初每首歌可在 5 台机器上播放）。这件事改变了整个音乐产业：盗版下载因此下降，音乐人开始按曲计费、不再被绑定到完整专辑销售。第一周卖出 100 万首歌。",
    location: "Apple Town Hall, Cupertino, CA",
    key: true,
    tags: ["iTunes", "音乐", "产业改变"],
    sources: [
      {
        id: "apple-newsroom-itunes-store",
        url: "https://www.apple.com/newsroom/2003/04/28Apple-Launches-the-iTunes-Music-Store/",
        kind: "article",
        title: "Apple Launches the iTunes Music Store",
        publisher: "Apple Newsroom",
        lang: "en",
        primary: true,
        ...HUMAN,
      },
    ],
    source_hints: null,
  },

  // ============ 2003-10 Cancer diagnosis ============
  {
    id: "jobs-2003-10-cancer-diagnosis",
    person_id: "jobs",
    date: "2003-10-01",
    date_precision: "month",
    type: "life",
    title: "确诊胰腺胰岛细胞瘤",
    title_en: "Diagnosed with pancreatic islet cell tumor",
    summary:
      "10 月一次例行 CT 扫描发现胰腺有阴影，活检确诊为胰岛细胞瘤（islet cell tumor / GEP-NET）——一种比常见的胰腺腺癌罕见得多、生长慢得多、可手术治愈的胰腺癌。但乔布斯拒绝立即手术，9 个月里尝试针灸、果汁疗法、植物饮食、灵性咨询等\"替代医学\"。这 9 个月的延迟在医学界引发巨大争议，许多人认为这是他后来死于癌症的关键原因。",
    location: "Stanford University Medical Center, Palo Alto, CA",
    key: true,
    tags: ["健康", "胰腺癌"],
    sources: [
      {
        id: "abc-news-cancer-timeline",
        url: "https://abcnews.go.com/Health/CancerPreventionAndTreatment/steve-jobs-pancreatic-cancer-timeline/story?id=14681812",
        kind: "article",
        title: "Steve Jobs' Pancreatic Cancer: A Timeline",
        publisher: "ABC News",
        lang: "en",
        primary: false,
        ...HUMAN,
      },
    ],
    source_hints: null,
  },

  // ============ 2004-08-01 Whipple surgery ============
  {
    id: "jobs-2004-08-01-whipple-surgery",
    person_id: "jobs",
    date: "2004-08-01",
    date_precision: "day",
    type: "life",
    title: "接受 Whipple 手术切除胰腺肿瘤",
    title_en: "Undergoes Whipple procedure for pancreatic tumor",
    summary:
      "在 9 个月的替代疗法之后，乔布斯终于同意手术。7 月 31 日在 Stanford 大学医学中心接受 \"Whipple 手术\"（胰十二指肠切除术），切除胰腺肿瘤。手术后他给 Apple 全员发了一封简短邮件：\"这个周末我成功接受了切除胰腺肿瘤的手术……我会在 9 月返回工作。\" 当时他和外界都认为是治愈了；后来证明癌细胞已经扩散，9 个月的延迟是致命的。",
    location: "Stanford University Medical Center, Palo Alto, CA",
    key: true,
    tags: ["健康", "手术"],
    sources: [
      {
        id: "abc-news-cancer-timeline-2",
        url: "https://abcnews.go.com/Health/CancerPreventionAndTreatment/steve-jobs-pancreatic-cancer-timeline/story?id=14681812",
        kind: "article",
        title: "Steve Jobs' Pancreatic Cancer: A Timeline",
        publisher: "ABC News",
        lang: "en",
        primary: false,
        ...HUMAN,
      },
    ],
    source_hints: "Apple 当时无对外新闻稿；员工内部邮件全文流出后被多家媒体转载",
  },

  // ============ 2006-01-24 Disney acquires Pixar ============
  {
    id: "jobs-2006-01-24-disney-pixar",
    person_id: "jobs",
    date: "2006-01-24",
    date_precision: "day",
    type: "deal",
    title: "Disney 以 74 亿美元收购 Pixar",
    title_en: "Disney acquires Pixar for $7.4 billion",
    summary:
      "Bob Iger 上任 Disney CEO 后立刻推动这次收购，作为重启 Disney 动画的赌注。每股 Pixar 换 2.3 股 Disney，交易总额约 74 亿美元。乔布斯因此成为 Disney 最大个人股东（约 7%）和 Disney 董事会成员。Pixar 团队进入 Disney 后掌管 Disney + Pixar 两边的动画业务（Ed Catmull 任总裁、John Lasseter 任首席创意官），开启 Disney 动画的第二个黄金时代。",
    location: "Burbank, CA / Emeryville, CA",
    key: true,
    tags: ["Disney", "Pixar", "收购"],
    sources: [
      {
        id: "disney-pixar-acquisition",
        url: "https://thewaltdisneycompany.com/disney-to-acquire-pixar/",
        kind: "article",
        title: "Disney To Acquire Pixar",
        publisher: "The Walt Disney Company",
        lang: "en",
        primary: true,
        ...HUMAN,
      },
      {
        id: "history-disney-pixar",
        url: "https://www.history.com/this-day-in-history/january-24/walt-disney-announces-7-4-billion-purchase-of-pixar",
        kind: "article",
        title: "Walt Disney announces $7.4 billion purchase of Pixar",
        publisher: "History.com",
        lang: "en",
        primary: false,
        ...HUMAN,
      },
    ],
    source_hints: "SEC EDGAR 8-K 文件（sec.gov 对 bot 有 403）",
  },

  // ============ 2008-03-06 SDK / App Store ============
  {
    id: "jobs-2008-03-06-iphone-sdk",
    person_id: "jobs",
    date: "2008-03-06",
    date_precision: "day",
    type: "product",
    title: "发布 iPhone SDK 和 App Store 计划",
    title_en: "Announces iPhone SDK and App Store",
    summary:
      "在 Cupertino 总部 Town Hall 礼堂宣布 iPhone 2.0 软件 + iPhone SDK + App Store。开发者只需 99 美元一年就能拿到 SDK、把应用通过 App Store 无线分发给全球用户。这是平台思维的胜利：Apple 把 iPhone 从一台单纯的手机变成一个开发者生态。4 个月后 App Store 正式上线，500 个 app 起步。今天 App Store 是一个 1,000 亿美元规模的产业。",
    location: "Apple Town Hall, Cupertino, CA",
    key: true,
    tags: ["App Store", "SDK", "平台"],
    sources: [
      {
        id: "apple-newsroom-iphone-sdk",
        url: "https://www.apple.com/newsroom/2008/03/06Apple-Announces-iPhone-2-0-Software-Beta/",
        kind: "article",
        title: "Apple Announces iPhone 2.0 Software Beta",
        publisher: "Apple Newsroom",
        lang: "en",
        primary: true,
        ...HUMAN,
      },
    ],
    source_hints: null,
  },

  // ============ 2009-01-05 Medical leave letter ============
  {
    id: "jobs-2009-01-05-medical-leave",
    person_id: "jobs",
    date: "2009-01-05",
    date_precision: "day",
    type: "life",
    title: "宣布因健康原因请假",
    title_en: "Announces medical leave",
    summary:
      "乔布斯在 Apple 官网发表一封致员工和顾客的公开信，承认 2008 年体重持续下降，原因是\"激素失衡\"，需要休假治疗。但实际情况比这严重得多——他正在等待肝脏移植。3 月 21 日他在 Memphis Methodist 医院接受了肝脏移植手术，6 月底回到 Apple。",
    location: "Cupertino, CA",
    key: true,
    tags: ["健康", "肝移植"],
    sources: [
      {
        id: "apple-newsroom-medical-leave-2009",
        url: "https://www.apple.com/newsroom/2009/01/05Letter-from-Apple-CEO-Steve-Jobs/",
        kind: "transcript",
        title: "Letter from Apple CEO Steve Jobs",
        publisher: "Apple Newsroom",
        lang: "en",
        primary: true,
        ...HUMAN,
        summary:
          "Apple 官网原文发布的健康公开信。乔布斯在信中说\"我去年的体重下降是因为激素失衡，剥夺了身体所需的蛋白质\"，并承诺\"我会继续担任 Apple CEO\"。信里没有提到将进行肝脏移植——这件事直到 6 月手术成功后才被外界知道。",
      },
      {
        id: "fortune-liver-transplant",
        url: "https://fortune.com/2009/06/20/inside-steve-jobs-liver-transplant/",
        kind: "article",
        title: "Inside Steve Jobs' liver transplant",
        publisher: "Fortune",
        lang: "en",
        primary: false,
        ...HUMAN,
        summary:
          "Fortune 2009 年 6 月发表的深度调查，第一次公开了乔布斯 3 月 21 日在 Memphis Methodist 医院接受肝脏移植的细节。手术由 James Eason 主刀。",
      },
    ],
    source_hints: null,
  },

  // ============ 2010-04-29 Thoughts on Flash ============
  {
    id: "jobs-2010-04-29-thoughts-on-flash",
    person_id: "jobs",
    date: "2010-04-29",
    date_precision: "day",
    type: "writing",
    title: "发表公开信《Thoughts on Flash》",
    title_en: "Publishes \"Thoughts on Flash\" open letter",
    summary:
      "乔布斯在 Apple 官网亲自署名发布公开信，详细解释为什么 iPhone / iPad / iPod touch 不会支持 Adobe Flash。理由有六条：Flash 是封闭的、Web 视频已经不需要它（H.264）、它影响电池续航、不支持触屏、是 iOS 安全漏洞的最大来源、它在 Apple 平台和开发者之间多了一层第三方层。Adobe 当时反击称 Apple 是为了保护 App Store——乔布斯在信里直接否认这种说法。这封信加速了 Flash 在 Web 上的死亡：两年后 Adobe 自己宣布停止移动 Flash 开发，2020 年彻底退役。",
    location: "Cupertino, CA",
    key: true,
    tags: ["Flash", "公开信", "Adobe"],
    sources: [
      {
        id: "wikipedia-thoughts-on-flash",
        url: "https://en.wikipedia.org/wiki/Thoughts_on_Flash",
        kind: "article",
        title: "Thoughts on Flash (Wikipedia)",
        publisher: "Wikipedia",
        lang: "en",
        primary: false,
        ...CCBYSA,
      },
      {
        id: "newslang-thoughts-on-flash-pdf",
        url: "https://newslang.ch/wp-content/uploads/2022/06/Thoughts-on-Flash.pdf",
        kind: "document",
        title: "Thoughts on Flash (PDF mirror)",
        publisher: "newslang.ch (mirror)",
        lang: "en",
        primary: true,
        ...HUMAN,
        summary:
          "原始 apple.com/hotnews/thoughts-on-flash/ 页面已下线（被新的新闻稿系统取代）。这是 PDF 镜像。",
        quotes: [
          {
            text: "Adobe's Flash products are 100% proprietary. By almost any definition, Flash is a closed system.",
            text_zh: "Adobe 的 Flash 产品 100% 私有。按任何合理的定义，Flash 都是一个封闭系统。",
            speaker: "Steve Jobs",
            context: "公开信中关于 Flash 封闭性的核心论点。极具讽刺意味的是 Apple 自己也常被批评封闭",
          },
        ],
      },
    ],
    source_hints: null,
  },

  // ============ 2010-06-07 iPhone 4 ============
  {
    id: "jobs-2010-06-07-iphone-4",
    person_id: "jobs",
    date: "2010-06-07",
    date_precision: "day",
    type: "product",
    title: "WWDC 2010 发布 iPhone 4",
    title_en: "Announces iPhone 4 at WWDC 2010",
    summary:
      "在 WWDC 2010 主题演讲上发布 iPhone 4——他称之为\"自初代 iPhone 以来最大的飞跃\"。新功能包括 Retina Display（视网膜屏，328 ppi）、FaceTime 视频通话、A4 芯片（Apple 自研）、新工业设计（玻璃 + 钢圈天线）。但发布两周后用户发现握持方式会让钢圈天线短路、信号下降——\"Antennagate\"由此爆发。",
    location: "Moscone West, San Francisco, CA",
    key: true,
    tags: ["iPhone 4", "Retina", "Keynote"],
    sources: [
      {
        id: "apple-newsroom-iphone-4",
        url: "https://www.apple.com/newsroom/2010/06/07Apple-Presents-iPhone-4/",
        kind: "article",
        title: "Apple Presents iPhone 4",
        publisher: "Apple Newsroom",
        lang: "en",
        primary: true,
        ...HUMAN,
      },
    ],
    source_hints: null,
  },

  // ============ 2010-07-16 Antennagate press conference ============
  {
    id: "jobs-2010-07-16-antennagate",
    person_id: "jobs",
    date: "2010-07-16",
    date_precision: "day",
    type: "speech",
    title: "Antennagate 危机记者会",
    title_en: "Antennagate press conference",
    summary:
      "iPhone 4 发布一个月后，因为左下角钢圈天线握持时会短路导致信号下降，舆论崩溃。Consumer Reports 拒绝推荐，主流媒体连日轰炸。乔布斯紧急召集媒体到 Apple 总部开了一场约 1 小时的记者会，亲自演示信号问题、辩解\"所有手机都有这个问题\"，并宣布给所有 iPhone 4 用户免费送保护壳。这是他生涯里少数几次直面公关危机的现场。",
    location: "Apple Town Hall, Cupertino, CA",
    key: true,
    tags: ["Antennagate", "危机公关", "iPhone 4"],
    sources: [
      {
        id: "apple-newsroom-antennagate-letter",
        url: "https://www.apple.com/newsroom/2010/07/02Letter-from-Apple-Regarding-iPhone-4/",
        kind: "article",
        title: "Letter from Apple Regarding iPhone 4",
        publisher: "Apple Newsroom",
        lang: "en",
        primary: true,
        ...HUMAN,
        summary:
          "记者会前 14 天，Apple 先发了一封\"向用户致信\"，承认信号显示 bug 但否认天线设计问题。这封信没能平息舆论，所以才有了 7 月 16 日的现场记者会。",
      },
      {
        id: "allaboutstevejobs-antennagate",
        url: "https://allaboutstevejobs.com/videos/keynotes/antennagate_2010",
        kind: "video",
        title: "Antennagate Press Conference (2010)",
        publisher: "All About Steve Jobs",
        lang: "en",
        primary: true,
        ...HUMAN,
        quotes: [
          {
            text: "We're not perfect. Phones aren't perfect either. We want to make all of our users happy.",
            text_zh: "我们并不完美。手机也不完美。我们只是想让所有用户开心。",
            speaker: "Steve Jobs",
            context: "Antennagate 记者会上的核心立场：承认问题但拒绝召回。这场记者会的处理至今仍被 PR 学院当作\"如何在不认错的情况下让公众满意\"的经典案例",
          },
        ],
      },
    ],
    source_hints: null,
  },

  // ============ 2011-06-06 WWDC 2011 last keynote ============
  {
    id: "jobs-2011-06-06-wwdc-icloud",
    person_id: "jobs",
    date: "2011-06-06",
    date_precision: "day",
    type: "speech",
    title: "WWDC 2011 主题演讲：发布 iCloud（生前最后一场 keynote）",
    title_en: "WWDC 2011 keynote: introduces iCloud (his last keynote)",
    summary:
      "乔布斯**生前最后一场 Apple 主题演讲**。当时他已经病得很重——明显消瘦——但坚持登台介绍三件大事：Mac OS X Lion、iOS 5、iCloud。iCloud 是他给 Apple 留下的最后一个战略转向：从 \"Mac 是数字中枢\" 改为 \"云是中枢，所有设备只是访问云的窗口\"。三天后他向 Cupertino 市议会展示 Apple Park 方案，那是他人生最后一次公开露面。",
    location: "Moscone West, San Francisco, CA",
    key: true,
    tags: ["WWDC", "iCloud", "最后的 Keynote"],
    sources: [
      {
        id: "apple-newsroom-icloud-2011",
        url: "https://www.apple.com/newsroom/2011/06/06Apple-Introduces-iCloud/",
        kind: "article",
        title: "Apple Introduces iCloud",
        publisher: "Apple Newsroom",
        lang: "en",
        primary: true,
        ...HUMAN,
      },
    ],
    source_hints: null,
  },
];

// Filter out events whose id already exists (idempotent)
const toAdd = newEvents.filter((e) => !existingIds.has(e.id));
const skipped = newEvents.length - toAdd.length;

if (toAdd.length === 0) {
  console.log("nothing to add (all event ids already present)");
  process.exit(0);
}

const merged = [...events, ...toAdd].sort((a, b) =>
  a.date.localeCompare(b.date)
);

fs.writeFileSync(filePath, JSON.stringify(merged, null, 2) + "\n");
console.log(
  `added ${toAdd.length} events (skipped ${skipped} duplicates); total now ${merged.length}`
);
