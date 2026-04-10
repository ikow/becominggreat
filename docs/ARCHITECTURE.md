# BeGreat 架构与扩展决策

最后更新：2026-04

## 数据层

### 当前状态

```
data/
  people.json              # 4 个人物元数据
  events/
    jobs.json              # 单文件，61 events，~3000 行
    musk.json              # 空
    rockefeller.json       # 空
    munger.json            # 空
```

读写都是 `fs.readFileSync` + `JSON.parse`，在 `lib/data.ts` 里集中。
Next.js SSG 在 build 时把所有页面预渲染成静态 HTML，runtime 不做 IO。

### 为什么不上数据库

讨论过的方案 → 决定不做的原因：

| 方案 | 决定 | 原因 |
|---|---|---|
| **SQLite (better-sqlite3)** | 暂不 | 单文件、git-friendly，但 102 sources 用 JSON 在内存里查也是毫秒级。提前引入会增加 schema 迁移、ORM、备份的复杂度，没解决任何当前痛点 |
| **Postgres / Supabase** | 暂不 | 强迫我们要么跑服务器要么做同步管道，丢掉静态部署的优势（免服务器、CDN-friendly、零成本）。也强迫"内容编辑必须经过 UI"的范式 |
| **Notion / Airtable as backend** | 暂不 | 把"内容真相"放在第三方，丢掉版本控制、可 diff、可 review |
| **自建 headless CMS** | 暂不 | 给一个还没有 1000 条数据的项目盖大房子。维护成本远大于编辑成本 |

### 为什么 JSON + Git 现在是对的

1. **规模没到瓶颈**。粗算上限：20 人物 × 100 事件 × 5 source = 10,000 条。整个项目内容塞进一个进程的内存才几 MB
2. **Git 就是内容数据库**。每次改动 = 一个 commit，可 diff、可 review、可 branch。Postgres 没法这样
3. **静态部署是优势**。jobs.json 改完 push，CDN 自动重新构建，零运维成本
4. **可读可编辑**。AI 可以直接 read/edit 文件，bash 脚本可以批量处理。这是我们脚本工作流（add-events / audit-urls / parse-youtube / verify-embeds）能跑的前提
5. **类型安全在边界**。`lib/data.ts` 一处地方 `JSON.parse` 然后强类型出来，所有调用方都有 TypeScript 检查

### 什么时候真要换

明确的迁移触发条件：

| 触发条件 | 迁移到 |
|---|---|
| 单文件 > 10MB 或编辑时 IDE 卡顿 | 拆文件结构（见下） |
| 50K+ 记录 + 复杂跨表查询 | SQLite + better-sqlite3（仍单文件，仍 git-friendly） |
| 多用户并发编辑 | Postgres + 编辑 UI |
| 用户生成内容 / 评论 / 实时同步 | 服务器 + DB |

**当前没有任何一个触发条件成立**。

### 文件结构扩展计划

有 3 个阶段，按需触发：

**阶段 1（今天）**：单文件 per person
```
data/events/jobs.json   # 全部 61 events 在一个文件
```

**阶段 2（200+ events 之后）**：按 event 拆
```
data/events/
  jobs/
    _index.json                       # event id 和顺序
    jobs-1955-02-24-birth.json
    jobs-1976-04-01-apple-founded.json
    ...
```
迁移：写一个 split 脚本，几分钟搞定。`lib/data.ts` 接口不变。

**阶段 3（1000+ sources 之后）**：把 source 也拆出来
```
data/sources/jobs/
  apple-newsroom-iphone.json
  ...
```
event 文件只保留 source id 引用列表。

不要提前拆。每个阶段触发时迁移成本都是几小时，提前拆带来的痛苦是每天都付。

## 验证 & 工具链

`scripts/` 下的脚本是数据治理的核心。每次扩展内容后跑：

```bash
node scripts/add-events.mjs           # 加新事件（手写 JS 数组）
node scripts/audit-urls.mjs --write   # HEAD-check 所有 URL + 填 wayback 时间戳
node scripts/parse-youtube.mjs --write  # 提取 YouTube + archive.org embed
node scripts/remove-bad-embeds.mjs    # 删手工标记的错误匹配
node scripts/verify-embeds.mjs        # 检查所有 embed 真的能播
```

每个脚本是幂等的——可以反复跑，不会重复加。`KNOWN_BAD_EMBEDS` 集合在两个脚本里同步，防止"加 → 删 → 加"循环。

未来要加 image / Vimeo / Twitch 等其他媒体源时，扩 `parse-youtube.mjs` 的正则即可。

## i18n（国际化）设计

### 目标

- 现在：中文（默认）+ 英文
- 后期：可能 日 / 韩 / 西班牙等
- 设计原则：**加新语言不需要改任何核心代码，只需要补字段和翻译表**

### 核心数据类型

`lib/i18n.ts` 定义：

```ts
export const SUPPORTED_LOCALES = ["zh", "en"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

// A field that may be translated. Bare string = default locale (zh).
export type LocalizedString = string | Partial<Record<Locale, string>>;
```

加新语言只要改这一行：`["zh", "en", "ja", "ko"] as const`。所有 `LocalizedString` 字段自动支持新语言。

### 数据迁移路径（向后兼容）

现有数据（全是中文字符串）**不需要修改就能用**。

```ts
// 现在：纯字符串
{ summary: "乔布斯回归 Apple..." }

// 升级后：可以是字符串（默认 zh）或 map
{ summary: "乔布斯回归 Apple..." }                     // 仍然有效
{ summary: { zh: "乔布斯回归 Apple...", en: "Jobs returned..." } }  // 可选升级
```

`pick(value, locale)` helper 处理两种形式 + 多级 fallback：requested locale → 默认 locale → 任意可用 locale。

### UI 字符串 vs 数据字符串

两种类型分开处理：

| 类型 | 例子 | 存哪 | 怎么用 |
|---|---|---|---|
| UI 字符串 | "全部人物" / "我们的解读" / "返回" | `lib/i18n.ts` 的 `uiStrings` dict | `<T k="section.editorTake" />` |
| 数据字符串 | event title / source summary / quote text | jobs.json 等数据文件 | `pick(field, locale)` |

### 路由策略：现在 vs 将来

**现在（这个 turn）**：客户端语言切换
- 服务器永远以默认 locale (zh) 渲染数据
- UI 标签由 `<T>` 客户端组件渲染，读取 `LocaleContext`
- Header 有语言切换按钮，写 `localStorage`，触发 React re-render
- 优点：不用改路由结构，零成本
- 缺点：英文用户进站会看到一闪而过的 zh 标签（hydration 之前）；数据内容仍是 zh（直到数据补完 en 翻译）

**将来（数据 en 翻译完成时）**：迁移到 `[locale]` 路由
- `app/[locale]/people/[id]/page.tsx`
- `generateStaticParams()` 生成所有 locale × 所有 param 的组合
- 页面数翻倍但 build time 没影响（仍是几秒）
- 优点：SEO 友好；no flash；服务器渲染就是正确语言
- 缺点：所有内部 `<Link>` 都要带 locale 前缀

**为什么不一上来就 `[locale]` 路由**：因为现在数据全是 zh，迁移路由也没用。等英文翻译有一定积累再迁移。

## 类型边界

`lib/data.ts` 是唯一一处 `fs.readFileSync` + `JSON.parse` 的地方，所有 page / component 通过 `getEvents() / getPerson() / getAllQuotes()` 等强类型函数访问数据。

JSON 文件本身没有 schema 校验。错字段会到 runtime 才发现。这是技术债。

下一步可以加：
- `zod` 解析 + 校验（在 `lib/data.ts` 加一层）
- 或 `typia` 编译期校验
- 或写一个 `scripts/validate-schema.mjs` 在 CI 跑

不紧急，但 200+ events 之后就该上了。

## 静态构建 & 部署

- `next build` → `out/` 全静态
- 可以丢任何 CDN（Vercel / Cloudflare Pages / GitHub Pages / S3 + CloudFront）
- 没有 server-side runtime
- 数据更新 = git push = CDN 重建

后期如果加用户 / 评论 / 编辑功能：那时再分前后端、加 API 路由。

## TL;DR

- **数据库**：现在 JSON + Git 完全够用。50K 记录之前不要换
- **文件结构**：单文件够用到 200 events，到时候按 event 拆 directory
- **i18n**：用 `LocalizedString` 类型 + `pick()` helper 设计可扩展
- **路由 i18n**：先客户端切换，等数据翻译有积累再迁移到 `[locale]` 路由
- **验证**：现在没有 schema validation，200+ events 之前加上
