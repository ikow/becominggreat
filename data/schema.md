# BeGreat 数据 schema (v0)

目标：把每个人物的人生当成一条**事件流**。任何东西（出生、产品发布、采访、演讲、投资、写作）都是一个 `Event`。

## 文件布局

```
data/
  people.json           # 所有人物的元数据
  events/
    jobs.json           # 一个人一个文件，内容是 Event 数组
    musk.json
    rockefeller.json
    munger.json
```

## Person

```json
{
  "id": "jobs",
  "name_zh": "史蒂夫·乔布斯",
  "name_en": "Steve Jobs",
  "born": "1955-02-24",
  "died": "2011-10-05",
  "tagline": "Apple、NeXT、Pixar 联合创始人"
}
```

## Event

```json
{
  "id": "jobs-2005-06-12-stanford",      // 稳定 id：人物-日期-slug
  "person_id": "jobs",
  "date": "2005-06-12",                  // ISO，未知部分用 01 占位
  "date_precision": "day",               // "day" | "month" | "year"
  "type": "speech",                      // 见下方 type 枚举
  "title": "斯坦福大学毕业典礼演讲",
  "title_en": "Stanford Commencement Address",
  "summary": "讲述人生三个故事：连接生命中的点、爱与失去、关于死亡。结尾以 \"Stay hungry, stay foolish\" 作结。",
  "location": "Stanford University, CA",
  "key": true,                           // 是否里程碑事件（首页/精华页用）
  "tags": ["演讲", "人生哲学"],
  "sources": [],                         // 见下方 Source；先留空
  "source_hints": "Stanford News 官方文字稿；Stanford 官方 YouTube 频道完整视频"
}
```

### type 枚举（先定一版，不够再加）

- `life` — 出生、家庭、健康、死亡等人生节点
- `education` — 求学
- `career` — 加入/离开公司、职位变动
- `founding` — 创立公司/组织
- `product` — 产品发布、作品上线
- `deal` — 收购、合并、投资交易
- `speech` — 演讲、主题报告
- `interview` — 采访、对话
- `writing` — 著作、文章、信件、备忘录
- `award` — 获奖、荣誉
- `other`

### Source

```json
{
  "id": "stanford-news-transcript",     // 站内稳定 id，一旦发布不可变
  "url": "https://news.stanford.edu/stories/2005/06/youve-got-find-love-jobs-says",
  "embed_url": null,                     // 可选：内嵌预览用的另一个 URL（YouTube 等）
  "kind": "transcript",                  // video|audio|article|transcript|book|image|document
  "title": "'You've got to find what you love,' Jobs says",
  "publisher": "Stanford Report",
  "lang": "en",
  "duration_sec": null,                  // 视频/音频才填
  "primary": true,                       // 是否一手来源

  // === 层 1: 我们的内容 (100% 合法) ===
  "summary": "中文长评 300-500 字",       // 我们写的长评 / 编辑按语
  "quotes": [                            // 关键引用（短句 fair use）
    {
      "text": "Stay hungry. Stay foolish.",
      "text_zh": "求知若饥，虚心若愚。",
      "speaker": "Steve Jobs",
      "context": "演讲结尾，引自《Whole Earth Catalog》"
    }
  ],

  // === 层 2: 原文承载方式 (按 license 决定可用范围) ===
  "wayback": {                           // Internet Archive 快照（任何 URL 都能用）
    "snapshot_url": "https://web.archive.org/web/2024if_/https://news.stanford.edu/...",
    "timestamp": "2024",                 // YYYYMMDDHHMMSS 或部分前缀
    "archived_at": "2024-06-01"          // 可选，显示用
  },
  "hosted_text": null,                   // 完整本地文本，仅 license 允许时填

  // === 层 3: 法律状态 ===
  "license": "all-rights-reserved",      // all-rights-reserved | fair-use-only |
                                          // cc-by | cc-by-sa | public-domain
                                          // 默认 all-rights-reserved

  // === 来源追溯 ===
  "authored_by": "human",                // human | ai | ai-edited
                                          // 决定内容是否需要 review
  "mentions": []                         // 这条 source 提到的其他人物 id（cross-link）
}
```

### 法律状态对照表

| license | summary | quotes | wayback | hosted_text |
|---|---|---|---|---|
| `all-rights-reserved` (默认) | ✓ | ✓ 短引用 | ✓ | ✗ |
| `fair-use-only` | ✓ | ✓ 短引用 | ✓ | ✗ |
| `cc-by` / `cc-by-sa` | ✓ | ✓ | ✓ | ✓ 须标注 |
| `public-domain` | ✓ | ✓ | ✓ | ✓ 无限制 |

build 阶段会强制 enforce：如果 license 不允许，`hosted_text` 字段会被拒绝。

### 三层渲染顺序

source 详情页按下面顺序渲染区块（每块没内容就跳过）：

1. 头部：badge / publisher / title / license badge
2. 内嵌视频 / 音频 / PDF
3. **我们的解读** (`summary`)
4. **关键引用** (`quotes`)
5. **原文** — 三选一：本地 `hosted_text` (license 允许时) → wayback iframe → 跳过
6. 原始出处卡片（含 license 标注 + 外链按钮）
7. 关联事件卡

### authored_by 与 review

- `authored_by: "human"` — 人工撰写，已可信
- `authored_by: "ai"` — AI 自动生成，**待 review**，页面会显示提示
- `authored_by: "ai-edited"` — AI 生成 + 人工编辑过

后期社区 review 流程会读这个字段筛选"待审"内容。

## 规则

1. **不编 URL**。`sources` 只放真正访问验证过的链接；不确定就留空 + 写 `source_hints`。
2. **第一手优先**。官方稿、本人发言 > 二手报道。`primary: true` 标出来。
3. **日期不确定**就降精度，不要瞎猜。`date_precision: "month"` 时 day 用 `01`。
4. **id 不可变**。事件 id 和 source id 一旦发布就不要改，标题/摘要可以改。

## 站内嵌入支持

`/people/[id]/sources/[sid]` 详情页会自动检测并尝试在站内嵌入：

- `archive.org/details/X` → 自动转换为 `archive.org/embed/X` iframe（视频）
- YouTube watch / `youtu.be` / embed → 自动转换为 `youtube-nocookie.com/embed` iframe
- URL 以 `.pdf` 结尾 → 浏览器原生 PDF 阅读器嵌入

如果一条 source 的"权威引用 URL"是文字（比如 Stanford News 文字稿），但你想内嵌一个视频版本（比如对应的 YouTube 视频），用 `embed_url` 字段独立指定：

```json
{
  "id": "stanford-news-transcript",
  "url": "https://news.stanford.edu/.../jobs-061505/",
  "embed_url": "https://www.youtube.com/watch?v=jiHZqamCD8c",
  "kind": "transcript",
  ...
}
```

详情页会优先使用 `embed_url` 决定内嵌内容，而 `url` 仍是页面引用的权威链接。

**为什么大部分文章嵌不进来**：Apple newsroom、Wikipedia、Stanford News、Stratechery 等都在 HTTP 头里设置了 `X-Frame-Options: DENY` 或 `Content-Security-Policy: frame-ancestors 'none'`，浏览器会强制拦截 iframe。这是发布方的明确选择，**任何站点**都没法绕过。对这类来源，详情页会展示编辑按语（`description`）作为主体内容，并把原始链接做成"原始出处"引用卡片——而不是当成"加载失败"。
