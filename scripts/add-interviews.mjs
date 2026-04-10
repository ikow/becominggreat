#!/usr/bin/env node
/**
 * Add a batch of major Steve Jobs interviews. Idempotent.
 * Run audit-urls.mjs --write afterwards to fill wayback snapshots.
 */
import fs from "node:fs";
import path from "node:path";

const filePath = path.join(process.cwd(), "data", "events", "jobs.json");
const events = JSON.parse(fs.readFileSync(filePath, "utf8"));
const existingIds = new Set(events.map((e) => e.id));

const HUMAN = { license: "all-rights-reserved", authored_by: "human", mentions: [] };
const CCBYSA = { license: "cc-by-sa", authored_by: "human", mentions: [] };

const newEvents = [
  // ============ 1981-04-10 ABC Nightline / Bob Brown ============
  {
    id: "jobs-1981-04-10-abc-nightline",
    person_id: "jobs",
    date: "1981-04-10",
    date_precision: "day",
    type: "interview",
    title: "ABC Nightline 与 Ted Koppel 访谈（首次重要电视露面）",
    title_en: "ABC Nightline interview with Ted Koppel",
    summary:
      "26 岁的乔布斯在 ABC 王牌新闻节目 Nightline 接受 Ted Koppel 采访。两个月前他还接受了 ABC 记者 Bob Brown 的拍摄（用于 20/20 节目，1981 年 5 月 28 日播出）。这是他第一次以 Apple 创始人身份在主流电视台亮相，谈个人电脑会如何改变办公室和家庭。当时 Apple II 大热，IBM PC 还没问世——他在镜头前显得既年轻又笃定。",
    location: "USA (national broadcast)",
    key: true,
    tags: ["采访", "电视", "Nightline", "早期"],
    sources: [
      {
        id: "allaboutstevejobs-abc-nightline-1981",
        url: "https://allaboutstevejobs.com/verbatim/interviews/abc_nightline_1981",
        kind: "transcript",
        title: "ABC Nightline (1981)",
        publisher: "All About Steve Jobs",
        lang: "en",
        primary: true,
        ...HUMAN,
      },
      {
        id: "abc-news-jobs-1981",
        url: "https://abcnews.go.com/Technology/apple-40-steve-jobs-computers-1981/story?id=38064087",
        kind: "article",
        title: "Apple at 40: What Steve Jobs Said About Computers in 1981",
        publisher: "ABC News",
        lang: "en",
        primary: true,
        ...HUMAN,
        summary:
          "ABC News 在 Apple 40 周年时重新发表的 1981 年 Bob Brown 采访幕后录像。当时未播出的原始素材被 ABC 数字化后第一次公开。",
      },
    ],
    source_hints: null,
  },

  // ============ 1985-09-23 Newsweek post-resignation ============
  {
    id: "jobs-1985-09-23-newsweek-rise-fall",
    person_id: "jobs",
    date: "1985-09-23",
    date_precision: "day",
    type: "interview",
    title: "Newsweek 离开 Apple 后的 3.5 小时长访",
    title_en: "Newsweek post-resignation interview (3.5 hours)",
    summary:
      "辞职信发出 6 天后，乔布斯在 Newsweek 编辑 Gerald C. Lubenow 和 Michael Rogers 的镜头前坐了 3 个半小时，复盘他的崛起和失败。他在采访里反思自己在 Apple 最后两年的错误、对 Sculley 的评价、以及 NeXT 的下一步。是他离开 Apple 后第一次系统性公开发声。Newsweek 9 月 23 日的封面故事《Showdown in Silicon Valley》同时刊出。",
    location: "Woodside, CA",
    key: true,
    tags: ["采访", "Newsweek", "1985 离职"],
    sources: [
      {
        id: "newsweek-jobs-rise-fall-1985",
        url: "https://www.newsweek.com/jobs-talks-about-his-rise-and-fall-207016",
        kind: "transcript",
        title: "Jobs Talks About His Rise and Fall (Newsweek archive)",
        publisher: "Newsweek",
        lang: "en",
        primary: true,
        ...HUMAN,
        summary:
          "Newsweek 后来重新数字化的当年访谈完整记录。注意：Newsweek 网站对 bot 有 406 防护，浏览器访问正常。",
      },
      {
        id: "newsweek-showdown-silicon-valley-1985",
        url: "https://www.newsweek.com/showdown-silicon-valley-207014",
        kind: "article",
        title: "Showdown in Silicon Valley (Newsweek 1985-09-23 cover)",
        publisher: "Newsweek",
        lang: "en",
        primary: true,
        ...HUMAN,
      },
    ],
    source_hints: null,
  },

  // ============ 1990 PBS NOVA "Machine That Changed the World" ============
  {
    id: "jobs-1990-pbs-machine-that-changed-world",
    person_id: "jobs",
    date: "1990-01-01",
    date_precision: "year",
    type: "interview",
    title: "PBS NOVA《Machine That Changed the World》采访",
    title_en: "PBS NOVA \"The Machine That Changed the World\" interview",
    summary:
      "1990 年初，35 岁的乔布斯（NeXT 时期）罕见地接受了 WGBH PBS 五集纪录片《The Machine That Changed the World》的采访。这是当时最严肃的电脑史纪录片，由 WGBH 制作、PBS 的 NOVA 系列播出。采访里乔布斯回顾了个人电脑的兴起、Apple 早期、被赶走的经历，以及他对未来计算的思考——是 NeXT 中期他罕见的长篇深度发声。",
    location: "Redwood City, CA (NeXT HQ)",
    key: true,
    tags: ["采访", "PBS", "NOVA", "WGBH", "NeXT 时期"],
    sources: [
      {
        id: "archive-wgbh-jobs-1990",
        url: "https://archive.org/details/interview.with.steve.jobs.V_AD9E0BC353BF435E83F28DEF165D4F40",
        kind: "video",
        title: "Interview with Steve Jobs, 1990 (WGBH OpenVault)",
        publisher: "Internet Archive (from WGBH OpenVault)",
        lang: "en",
        primary: true,
        ...HUMAN,
        summary:
          "WGBH OpenVault 数字化的 1990 年原始采访素材，整段约 75 分钟。比纪录片正片用的剪辑长得多。",
      },
      {
        id: "allaboutstevejobs-future-pc-1990",
        url: "https://allaboutstevejobs.com/videos/misc/future_of_pc_1990",
        kind: "video",
        title: "Steve Jobs on the Future of the Personal Computer (1990)",
        publisher: "All About Steve Jobs",
        lang: "en",
        primary: true,
        ...HUMAN,
      },
    ],
    source_hints: null,
  },

  // ============ 1992-04 MIT Sloan ============
  {
    id: "jobs-1992-04-mit-sloan",
    person_id: "jobs",
    date: "1992-04-01",
    date_precision: "month",
    type: "speech",
    title: "MIT Sloan Distinguished Speaker Series 演讲",
    title_en: "MIT Sloan Distinguished Speaker Series talk",
    summary:
      "1992 年春天，乔布斯应邀到麻省理工学院 Sloan 商学院做客座演讲，全长 72 分钟。这是 NeXT 中期他最完整的一次商学院公开发声。他谈了对咨询公司的不屑、用人哲学、被 Apple 赶出去的反思，以及为什么世界还需要一家新的电脑公司。这段录像在 2018 年才被 MIT Video Productions 重新发现并上传到 YouTube。",
    location: "MIT Sloan School of Management, Cambridge, MA",
    key: true,
    tags: ["演讲", "MIT", "NeXT 时期", "商学院"],
    sources: [
      {
        id: "infinite-mit-jobs-1992",
        url: "https://infinite.mit.edu/video/steve-jobs-next-computer-corp-sloan-distinguished-speaker-series/",
        kind: "video",
        title: "Steve Jobs (NeXT Computer Corp) — Sloan Distinguished Speaker Series",
        publisher: "Infinite MIT",
        lang: "en",
        primary: true,
        ...HUMAN,
        summary:
          "MIT 官方视频档案馆 Infinite MIT 上的 1992 年原始演讲录像，72 分钟完整版。",
      },
      {
        id: "mit-sloan-jobs-1992",
        url: "https://mitsloan.mit.edu/ideas-made-to-matter/steve-jobs-talks-consultants-hiring-and-leaving-apple-unearthed-1992-talk",
        kind: "article",
        title: "Steve Jobs talks consultants, hiring, and leaving Apple in unearthed 1992 talk",
        publisher: "MIT Sloan",
        lang: "en",
        primary: true,
        ...HUMAN,
      },
      {
        id: "allaboutstevejobs-mit-1992",
        url: "https://allaboutstevejobs.com/videos/misc/mit_1992",
        kind: "video",
        title: "Class at MIT Sloan (1992)",
        publisher: "All About Steve Jobs",
        lang: "en",
        primary: true,
        ...HUMAN,
      },
    ],
    source_hints: null,
  },

  // ============ 1994-06-16 Rolling Stone (Jeff Goodell) ============
  {
    id: "jobs-1994-06-16-rolling-stone-goodell",
    person_id: "jobs",
    date: "1994-06-16",
    date_precision: "day",
    type: "interview",
    title: "Rolling Stone 长访（Jeff Goodell）",
    title_en: "Rolling Stone interview by Jeff Goodell",
    summary:
      "在 NeXT 已经退出硬件业务、Pixor 还没靠 Toy Story 翻身之前，乔布斯接受 Rolling Stone 记者 Jeff Goodell 的长篇采访（发表在 1994 年 6 月 16 日刊）。是他最沉的低谷期之一——但访谈里他展现了对面向对象编程、互联网未来、和\"为什么 Apple 失败\"的清晰判断。这次采访也是 Goodell 与乔布斯长期关系的开端，9 年后他又做了 2003 年的\"In Conversation\"长访。",
    location: "Cupertino, CA",
    key: true,
    tags: ["采访", "Rolling Stone", "Jeff Goodell", "NeXT 时期"],
    sources: [
      {
        id: "rollingstone-jobs-1994",
        url: "https://www.rollingstone.com/culture/culture-news/steve-jobs-in-1994-the-rolling-stone-interview-231132/",
        kind: "transcript",
        title: "Steve Jobs in 1994: The Rolling Stone Interview",
        publisher: "Rolling Stone",
        lang: "en",
        primary: true,
        ...HUMAN,
      },
      {
        id: "longreads-rs-jobs-1994",
        url: "https://longreads.com/2009/01/01/steve-jobs-the-rolling-stone-interview-1994/",
        kind: "transcript",
        title: "Steve Jobs: The Rolling Stone Interview (1994)",
        publisher: "Longreads",
        lang: "en",
        primary: false,
        ...HUMAN,
      },
    ],
    source_hints: null,
  },

  // ============ 1995-04-20 Smithsonian Oral History ============
  {
    id: "jobs-1995-04-20-smithsonian-oral-history",
    person_id: "jobs",
    date: "1995-04-20",
    date_precision: "day",
    type: "interview",
    title: "Smithsonian 口述历史采访（Daniel Morrow）",
    title_en: "Smithsonian Oral History interview (Daniel Morrow)",
    summary:
      "美国国家博物馆 Smithsonian 的\"Computerworld Smithsonian Awards Program\" 项目派执行总监 Daniel Morrow 对乔布斯做了一场正式的口述历史录像采访。这是为博物馆永久档案录的，用最学术的方式问最严肃的问题：童年、教育、Apple、被赶走、NeXT、价值观。这是关于乔布斯童年和早期成长记录最完整的官方一手资料之一。",
    location: "NeXT Computer, Redwood City, CA",
    key: true,
    tags: ["采访", "Smithsonian", "口述历史", "经典"],
    sources: [
      {
        id: "smithsonian-jobs-oral-history",
        url: "https://americanhistory.si.edu/comphist/sj1.html",
        kind: "transcript",
        title: "Smithsonian Oral and Video Histories: Steve Jobs",
        publisher: "Smithsonian National Museum of American History",
        lang: "en",
        primary: true,
        ...HUMAN,
        summary:
          "Smithsonian 国家美国历史博物馆官方页面，含完整文字稿。这是博物馆永久收藏的口述历史档案，由 Daniel Morrow 主持，1995 年 4 月 20 日录制。",
      },
      {
        id: "allaboutstevejobs-smithsonian-1995",
        url: "https://allaboutstevejobs.com/videos/misc/smithsonian_interview_1995",
        kind: "video",
        title: "Smithsonian Interview (1995)",
        publisher: "All About Steve Jobs",
        lang: "en",
        primary: true,
        ...HUMAN,
      },
    ],
    source_hints: null,
  },

  // ============ 1997-09 Internal "Think Different" speech ============
  {
    id: "jobs-1997-09-think-different-internal",
    person_id: "jobs",
    date: "1997-09-23",
    date_precision: "day",
    type: "speech",
    title: "向 Apple 员工内部发布 Think Different",
    title_en: "Internal Apple Town Hall introducing \"Think Different\"",
    summary:
      "在 Think Different 广告对外发布前几天，乔布斯在 Apple 总部 Town Hall 礼堂向员工内部宣讲新品牌战略。这场讲话原本是私下的，多年后录像泄露上网，被普遍认为是他最坦白的一次\"营销学公开课\"。他的核心观点：营销是关于 values（价值观）的，不是关于功能；伟大的品牌是关于\"信仰什么\"，不是关于\"做什么\"。这段话直接定义了 Apple 之后 25 年的品牌方向。",
    location: "Apple Town Hall, Cupertino, CA",
    key: true,
    tags: ["演讲", "营销", "经典", "Think Different", "内部"],
    sources: [
      {
        id: "allaboutstevejobs-think-different-internal",
        url: "https://allaboutstevejobs.com/videos/misc/think_different_1997_internal",
        kind: "video",
        title: "Think Different — Internal Apple Town Hall (1997)",
        publisher: "All About Steve Jobs",
        lang: "en",
        primary: true,
        ...HUMAN,
        quotes: [
          {
            text: "To me, marketing is about values. This is a very complicated world, it's a very noisy world. And we're not going to get a chance to get people to remember much about us. No company is. So we have to be really clear on what we want them to know about us.",
            text_zh: "对我来说，营销关乎的是价值观。这是一个很复杂、很嘈杂的世界。我们没有太多机会让人们记住我们多少东西，没有任何公司有。所以我们必须非常清楚地知道：我们希望他们记住的是什么。",
            speaker: "Steve Jobs",
            context: "Think Different 广告对外发布前几天，乔布斯在 Apple 内部员工面前讲解新品牌战略。这段话被公认是乔布斯关于营销最系统的一次表达",
          },
        ],
      },
      {
        id: "speakola-think-different-1997",
        url: "https://speakola.com/corp/steve-jobs-marketing-think-differently-1997",
        kind: "transcript",
        title: "Steve Jobs: To me, marketing is about values (1997)",
        publisher: "Speakola",
        lang: "en",
        primary: true,
        ...HUMAN,
      },
    ],
    source_hints: null,
  },

  // ============ 1998-05 BusinessWeek (Andy Reinhardt) ============
  {
    id: "jobs-1998-05-25-businessweek",
    person_id: "jobs",
    date: "1998-05-25",
    date_precision: "day",
    type: "interview",
    title: "BusinessWeek 长访：\"There's Sanity Returning\"",
    title_en: "BusinessWeek interview: \"There's Sanity Returning\"",
    summary:
      "回归 Apple 一年后，乔布斯接受 BusinessWeek 记者 Andy Reinhardt 在 Apple 董事会议室的长访。访谈在 iMac 发布几周后、Apple 真正开始转亏为盈的转折点上进行。乔布斯解释\"为什么简单比复杂更难\"\"为什么不能用焦点小组设计产品\"——这两段后来成为他最常被引用的方法论金句。",
    location: "Cupertino, CA",
    key: true,
    tags: ["采访", "BusinessWeek", "经典金句"],
    sources: [
      {
        id: "bloomberg-jobs-1998",
        url: "https://www.bloomberg.com/news/articles/1998-05-25/steve-jobs-theres-sanity-returning",
        kind: "transcript",
        title: "Steve Jobs: 'There's Sanity Returning'",
        publisher: "Bloomberg / BusinessWeek",
        lang: "en",
        primary: true,
        ...HUMAN,
        quotes: [
          {
            text: "Simple can be harder than complex. You have to work hard to get your thinking clean to make it simple. But it's worth it in the end because once you get there, you can move mountains.",
            text_zh: "简单可以比复杂更难。你必须很用力地把思考清理干净才能让它变得简单。但是值得——因为一旦你到达那里，你能搬动山。",
            speaker: "Steve Jobs",
            context: "1998 年 BusinessWeek 采访中关于设计哲学的核心表达。这句话后来被印在 Apple 的内部宣传册和无数管理书籍上",
          },
          {
            text: "It's really hard to design products by focus groups. A lot of times, people don't know what they want until you show it to them.",
            text_zh: "用焦点小组来设计产品真的很难。很多时候，人们在你给他们看到之前，根本不知道自己想要什么。",
            speaker: "Steve Jobs",
            context: "回应 \"为什么 Apple 不做用户调研\" 时的回答——后来变成科技行业最有名的反市场调研论点",
          },
        ],
      },
    ],
    source_hints: "Bloomberg 对 bot 有 403 防护，浏览器访问正常",
  },

  // ============ 2003 60 Minutes ============
  {
    id: "jobs-2003-60-minutes",
    person_id: "jobs",
    date: "2003-10-01",
    date_precision: "month",
    type: "interview",
    title: "CBS《60 Minutes》深度采访",
    title_en: "60 Minutes interview (CBS)",
    summary:
      "美国王牌新闻杂志节目 CBS《60 Minutes》对乔布斯的罕见长篇电视采访。乔布斯在镜头前谈他被 Apple 解雇的经历、Pixar 的起源、产品哲学，以及他对\"团队 vs 个人英雄\"的看法（用披头士做类比）。这是他回归 Apple 后第一次接受美国主流电视台的严肃长访。",
    location: "Cupertino, CA",
    key: true,
    tags: ["采访", "60 Minutes", "电视"],
    sources: [
      {
        id: "cbs-60-minutes-jobs-2003",
        url: "https://www.cbsnews.com/sanfrancisco/news/steve-jobs-offered-rare-insights-during-60-minutes-interview/",
        kind: "article",
        title: "Steve Jobs Offered Rare Insights During '60 Minutes' Interview",
        publisher: "CBS News",
        lang: "en",
        primary: true,
        ...HUMAN,
      },
      {
        id: "allaboutstevejobs-60-minutes-2003",
        url: "https://allaboutstevejobs.com/videos/misc/60_minutes_2003",
        kind: "video",
        title: "60 Minutes (2003)",
        publisher: "All About Steve Jobs",
        lang: "en",
        primary: true,
        ...HUMAN,
        quotes: [
          {
            text: "I was basically fired from Apple when I was thirty, and was invited to come back twelve years later. That was difficult when it happened, but maybe the best thing that ever happened to me. There would not be a Pixar if that did not happen.",
            text_zh: "我 30 岁的时候基本上是被 Apple 开除的，12 年后又被请回来。当时很难受，但回头看，那也许是发生在我身上最好的事。如果那事没发生，就不会有 Pixar。",
            speaker: "Steve Jobs",
            context: "60 Minutes 采访里关于被 Apple 赶走的反思——和 2 年后斯坦福演讲第二个故事的内容一致，但措辞更直接",
          },
        ],
      },
    ],
    source_hints: "具体播出日期需进一步确认（约 2003 年下半年）",
  },

  // ============ 2003-12-25 Rolling Stone "In Conversation" ============
  {
    id: "jobs-2003-12-rolling-stone-in-conversation",
    person_id: "jobs",
    date: "2003-12-25",
    date_precision: "day",
    type: "interview",
    title: "Rolling Stone \"In Conversation\" 长访",
    title_en: "Rolling Stone \"In Conversation\" interview",
    summary:
      "Jeff Goodell 时隔 9 年再次为 Rolling Stone 采访乔布斯，这次的主题是 iTunes Music Store 上线 8 个月后他对音乐产业的判断。乔布斯在访谈里炮轰订阅制音乐服务（\"破产的商业模式\"）、解释为什么把 iTunes 移植到 Windows 是必须的、回顾 \"Rip. Mix. Burn.\" 广告战役。这次访谈被普遍认为是 21 世纪初音乐产业转型最重要的一手资料。",
    location: "Cupertino, CA",
    key: true,
    tags: ["采访", "Rolling Stone", "iTunes", "音乐产业"],
    sources: [
      {
        id: "rollingstone-jobs-2003-conversation",
        url: "https://www.rollingstone.com/culture/culture-news/steve-jobs-rolling-stones-2003-interview-243284/",
        kind: "transcript",
        title: "Steve Jobs: Rolling Stone's 2003 Interview",
        publisher: "Rolling Stone",
        lang: "en",
        primary: true,
        ...HUMAN,
      },
    ],
    source_hints: null,
  },

  // ============ 2004-07-26 Newsweek "iPod Nation" ============
  {
    id: "jobs-2004-07-26-newsweek-ipod-nation",
    person_id: "jobs",
    date: "2004-07-26",
    date_precision: "day",
    type: "interview",
    title: "Newsweek \"iPod Nation\" 封面采访（Steven Levy）",
    title_en: "Newsweek \"iPod Nation\" cover (Steven Levy)",
    summary:
      "Newsweek 1980 年代以来最资深的科技记者 Steven Levy 在 2004 年 7 月号做封面专题《iPod Nation》，乔布斯在采访里谈了 iPod 文化爆炸的早期信号——\"我走在 Madison Avenue 上，每个街区都有人戴着白色耳机，我心想：天啊，它真的发生了。\" 这次采访发生在乔布斯 Whipple 手术前几天，封面拍摄时他已经知道自己的诊断，但还没告诉任何人。封面用乔布斯手持初代 click wheel iPod 的照片——比 Apple 自己的发布会还早泄露了第四代 iPod 的设计。",
    location: "Cupertino, CA",
    key: true,
    tags: ["采访", "Newsweek", "iPod", "Steven Levy"],
    sources: [
      {
        id: "newsweek-ipod-nation-2004",
        url: "https://www.newsweek.com/ipod-nation-130863",
        kind: "article",
        title: "iPod Nation (Newsweek 2004 cover)",
        publisher: "Newsweek",
        lang: "en",
        primary: true,
        ...HUMAN,
        summary:
          "Newsweek 2004 年 7 月 26 日封面故事，Steven Levy 主笔。注意：Newsweek 网站对 bot 有 406 防护，浏览器访问正常。",
      },
    ],
    source_hints: null,
  },

  // ============ 2007-11 Time "Invention of the Year" ============
  {
    id: "jobs-2007-11-time-invention-of-year",
    person_id: "jobs",
    date: "2007-11-01",
    date_precision: "day",
    type: "interview",
    title: "Time \"Invention of the Year\" 封面（Lev Grossman）",
    title_en: "Time \"Invention of the Year\" feature (Lev Grossman)",
    summary:
      "Time 杂志把初代 iPhone 评为 2007 年度发明（Invention of the Year），由 Lev Grossman 主笔的封面专题对乔布斯做了长篇深度采访。文章描述了 iPhone 团队为期两年的秘密开发过程、和摩托罗拉合作 ROKR 失败之后\"必须自己做一台手机\"的决心，以及 Apple 内部对触屏交互的反复迭代。是 iPhone 从概念到产品幕后过程最权威的同期记录。",
    location: "Cupertino, CA",
    key: true,
    tags: ["采访", "Time", "iPhone", "Lev Grossman"],
    sources: [
      {
        id: "time-invention-of-year-2007",
        url: "https://content.time.com/time/specials/2007/article/0,28804,1677329_1678542_1677891,00.html",
        kind: "article",
        title: "Invention of the Year: The iPhone (Time 2007)",
        publisher: "Time",
        lang: "en",
        primary: true,
        ...HUMAN,
      },
      {
        id: "time-iphone-behind-scenes",
        url: "https://time.com/3222128/apple-iphone/",
        kind: "article",
        title: "Go Behind the Scenes of Apple's First iPhone Release",
        publisher: "Time",
        lang: "en",
        primary: true,
        ...HUMAN,
      },
    ],
    source_hints: null,
  },
];

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
