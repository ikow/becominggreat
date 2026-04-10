/**
 * i18n core types and helpers.
 *
 * Design goals:
 *   - Adding a new locale requires only updating SUPPORTED_LOCALES and adding
 *     translations to uiStrings + (optionally) data files
 *   - Existing zh-only data continues to work without modification
 *   - Both bare strings and locale maps are accepted on data fields
 *
 * See docs/ARCHITECTURE.md → "i18n 设计" for the rationale.
 */

export const SUPPORTED_LOCALES = ["zh", "en"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "zh";

/**
 * A string field that may exist in multiple languages.
 * - A bare `string` is treated as `{ [DEFAULT_LOCALE]: string }`
 * - A `Partial<Record<Locale, string>>` allows per-locale overrides
 *
 * Existing JSON data with bare strings is forward-compatible.
 */
export type LocalizedString = string | Partial<Record<Locale, string>>;

/**
 * Resolve a LocalizedString to a single string in the requested locale.
 * Fallback chain: requested locale → default locale → any other locale → "".
 */
export function pick(
  value: LocalizedString | undefined | null,
  locale: Locale
): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (value[locale] != null) return value[locale]!;
  if (value[DEFAULT_LOCALE] != null) return value[DEFAULT_LOCALE]!;
  for (const l of SUPPORTED_LOCALES) {
    if (value[l] != null) return value[l]!;
  }
  return "";
}

// === UI strings (always present in every locale) ===
//
// Add new UI keys here. Adding a new locale requires adding it to
// SUPPORTED_LOCALES above AND filling in every entry below.

const uiStrings = {
  // Site
  "site.brand": { zh: "成为伟大", en: "Becoming Great" },
  "site.tagline": { zh: "向缔造者学习", en: "Learn from Builders" },
  "site.description": {
    zh: "收集创造者的一手资料：他们说过什么、做过什么、在什么时间。",
    en: "First-hand records of builders: what they said, what they did, and when.",
  },

  // Navigation
  "nav.home": { zh: "首页", en: "Home" },
  "nav.allPeople": { zh: "全部人物", en: "All people" },
  "nav.quotes": { zh: "经典语录", en: "Quotes" },
  "nav.back": { zh: "← 返回", en: "← Back" },
  "nav.breadcrumb.root": { zh: "BeGreat", en: "BeGreat" },

  // Sections (source page)
  "section.editorTake": { zh: "我们的解读", en: "Our take" },
  "section.keyQuotes": { zh: "关键引用", en: "Key quotes" },
  "section.original": { zh: "原文", en: "Original" },
  "section.waybackOriginal": {
    zh: "原文（Internet Archive 快照）",
    en: "Original (Internet Archive snapshot)",
  },
  "section.citation": { zh: "原始出处", en: "Source" },
  "section.relatedEvent": { zh: "关联事件", en: "Related event" },

  // Citation card
  "cite.kind": { zh: "类型", en: "Type" },
  "cite.lang": { zh: "语言", en: "Language" },
  "cite.duration": { zh: "时长", en: "Duration" },
  "cite.license": { zh: "协议", en: "License" },
  "cite.primary": { zh: "一手资料", en: "Primary source" },
  "cite.viewOriginal": { zh: "在原始页面查看 →", en: "View original →" },
  "cite.publisher": { zh: "出版方", en: "Publisher" },

  // Authorship
  "auth.human": { zh: "人工撰写", en: "Written by human" },
  "auth.ai": { zh: "AI 自动生成（待 review）", en: "AI generated (pending review)" },
  "auth.aiEdited": { zh: "AI 生成 · 人工编辑", en: "AI generated, human edited" },

  // Wayback caption
  "wayback.caption": {
    zh: "本快照由 Internet Archive 归档保存。如果上方区域空白或加载缓慢，archive.org 可能暂时不可用。",
    en: "This snapshot is preserved by the Internet Archive. If the embed is blank or slow, archive.org may be temporarily unavailable.",
  },
  "wayback.viewLive": { zh: "直接访问原始页面", en: "Visit live original" },

  // Source list / timeline
  "timeline.empty": { zh: "暂无事件", en: "No events yet" },
  "timeline.searchPlaceholder": {
    zh: "搜索事件、地点、引用…",
    en: "Search events, places, quotes…",
  },
  "timeline.filterByTag": { zh: "按标签筛选", en: "Filter by tag" },
  "timeline.clearFilters": { zh: "清空筛选", en: "Clear filters" },
  "timeline.matched": { zh: "匹配", en: "matched" },
  "timeline.of": { zh: "/", en: "of" },
  "timeline.eventsTotal": { zh: "条事件", en: "events" },
  "timeline.years": { zh: "岁", en: "yrs" },

  // Quotes page
  "quotes.title": { zh: "经典语录", en: "Quotes" },
  "quotes.tagline": {
    zh: "所有人物在所有 source 里说过的话，按时间排列。",
    en: "Every recorded quote across all people and sources, in chronological order.",
  },
  "quotes.filterByPerson": { zh: "按人物", en: "By person" },
  "quotes.filterBySpeaker": { zh: "按说话人", en: "By speaker" },
  "quotes.allPeople": { zh: "全部人物", en: "All people" },
  "quotes.allSpeakers": { zh: "全部说话人", en: "All speakers" },
  "quotes.viewSource": { zh: "查看出处 →", en: "View source →" },
  "quotes.empty": { zh: "暂无引用", en: "No quotes yet" },

  // Person card
  "person.atNow": { zh: "至今", en: "now" },
  "person.eventsCount": { zh: "条事件", en: "events" },
  "person.sourcedCount": { zh: "条已附来源", en: "with sources" },

  // Type labels
  "type.life": { zh: "人生", en: "Life" },
  "type.education": { zh: "求学", en: "Education" },
  "type.career": { zh: "职业", en: "Career" },
  "type.founding": { zh: "创立", en: "Founding" },
  "type.product": { zh: "产品", en: "Product" },
  "type.deal": { zh: "交易", en: "Deal" },
  "type.speech": { zh: "演讲", en: "Speech" },
  "type.interview": { zh: "采访", en: "Interview" },
  "type.writing": { zh: "著作", en: "Writing" },
  "type.award": { zh: "荣誉", en: "Award" },
  "type.other": { zh: "其他", en: "Other" },

  // Source kinds
  "kind.video": { zh: "视频", en: "Video" },
  "kind.audio": { zh: "音频", en: "Audio" },
  "kind.article": { zh: "文章", en: "Article" },
  "kind.transcript": { zh: "文字稿", en: "Transcript" },
  "kind.book": { zh: "书", en: "Book" },
  "kind.image": { zh: "图片", en: "Image" },
  "kind.document": { zh: "文档", en: "Document" },

  // License
  "license.allRightsReserved": { zh: "© 版权所有", en: "© All rights reserved" },
  "license.fairUseOnly": { zh: "合理使用引用", en: "Fair use only" },
  "license.ccBy": { zh: "CC BY", en: "CC BY" },
  "license.ccBySa": { zh: "CC BY-SA", en: "CC BY-SA" },
  "license.publicDomain": { zh: "公共领域", en: "Public domain" },
} as const satisfies Record<string, Record<Locale, string>>;

export type UIKey = keyof typeof uiStrings;

/**
 * Translate a UI key into a string for the given locale.
 * Throws TypeScript error if `key` is not a known UI string.
 */
export function t(key: UIKey, locale: Locale): string {
  return uiStrings[key][locale] ?? uiStrings[key][DEFAULT_LOCALE];
}
