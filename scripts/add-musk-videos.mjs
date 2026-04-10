#!/usr/bin/env node
/**
 * Add manually verified YouTube video sources to existing Musk events.
 * These are NEW sources (separate entries) attached to existing event ids,
 * not embed_url overrides on existing sources.
 *
 * IDs verified by an agent run that called the YouTube oEmbed API.
 * Idempotent: skips if a source with the same id already exists.
 */
import fs from "node:fs";
import path from "node:path";

const filePath = path.join(process.cwd(), "data", "events", "musk.json");
const events = JSON.parse(fs.readFileSync(filePath, "utf8"));

const HUMAN = { license: "all-rights-reserved", authored_by: "human", mentions: [] };

// One verified YouTube video per Musk event id
const VIDEO_SOURCES = {
  "musk-2008-09-28-falcon-1-orbit": {
    id: "youtube-spacex-falcon-1-flight-4",
    url: "https://www.youtube.com/watch?v=dLQ2tZEH6G0",
    kind: "video",
    title: "SpaceX — Falcon 1, Flight 4",
    publisher: "SpaceX (YouTube)",
    lang: "en",
    primary: true,
    ...HUMAN,
    summary:
      "SpaceX 官方 YouTube 频道上传的 Falcon 1 第四次飞行视频。第四次终于成功——Falcon 1 成为史上首枚抵达轨道的私人开发液体燃料火箭。",
  },
  "musk-2002-03-14-spacex-founding": {
    id: "youtube-60-minutes-spacex-2012",
    url: "https://www.youtube.com/watch?v=23GzpbNUyI4",
    kind: "video",
    title: "2012: SpaceX — Elon Musk's race to space",
    publisher: "60 Minutes (YouTube)",
    lang: "en",
    primary: true,
    ...HUMAN,
    summary:
      "60 Minutes 2012 年的 SpaceX 专题节目。回溯了从 2002 年创立到 Dragon 飞船首次抵达 ISS 的 10 年。Musk 在镜头前讲述了创立 SpaceX 的动机、早期的失败、和\"如果第四次失败 SpaceX 就完了\"的真实危机。",
  },
  "musk-2012-05-25-dragon-iss": {
    id: "youtube-nasa-dragon-iss-arrival",
    url: "https://www.youtube.com/watch?v=bGoJ66WNapE",
    kind: "video",
    title: "Space Station Crew Welcomes World's First Commercial Cargo Craft",
    publisher: "NASA Johnson (YouTube)",
    lang: "en",
    primary: true,
    ...HUMAN,
    summary:
      "NASA Johnson 中心官方频道。ISS 宇航员打开 Dragon 货舱门、欢迎史上第一艘商业航天器抵达空间站的现场录像。",
  },
  "musk-2015-12-21-falcon-9-landing": {
    id: "youtube-spacex-orbcomm-og2",
    url: "https://www.youtube.com/watch?v=lbHnSu-DLR4",
    kind: "video",
    title: "Orbcomm OG2 | Falcon 9 Satellite Launch",
    publisher: "SpaceX (YouTube)",
    lang: "en",
    primary: true,
    ...HUMAN,
    summary:
      "SpaceX 官方 YouTube 上传的 Orbcomm OG2 任务发射视频，包括人类历史上第一次轨道级一级火箭垂直回收降落 Cape Canaveral LZ-1 的现场。",
  },
  "musk-2018-09-06-joe-rogan": {
    id: "youtube-jre-1169",
    url: "https://www.youtube.com/watch?v=ycPr5-27vSI",
    kind: "video",
    title: "Joe Rogan Experience #1169 — Elon Musk",
    publisher: "PowerfulJRE (YouTube)",
    lang: "en",
    primary: true,
    ...HUMAN,
    summary:
      "Joe Rogan 官方 YouTube 频道 PowerfulJRE 上传的 #1169 期完整节目。2 小时 30 分钟，AI、Neuralink、火星殖民、人类意识全都涉及。著名的「抽烟争议」画面在节目最后阶段。",
  },
  "musk-2020-05-30-crew-dragon-demo2": {
    id: "youtube-spacex-demo-2-recap",
    url: "https://www.youtube.com/watch?v=FMi_m9-e9MU",
    kind: "video",
    title: "Crew Dragon's Second Demonstration Mission",
    publisher: "SpaceX (YouTube)",
    lang: "en",
    primary: true,
    ...HUMAN,
    summary:
      "SpaceX 官方制作的 Demo-2 任务回顾视频。从 5 月 30 日发射、20 小时后与 ISS 对接、到 8 月 2 日溅落回收，完整记录了商业载人航天首次任务全程。",
  },
  "musk-2022-10-27-twitter-close": {
    id: "youtube-musk-sink-twitter",
    url: "https://www.youtube.com/watch?v=GUDxUfpQ1wQ",
    kind: "video",
    title: "Elon Musk carries sink into Twitter HQ: \"Let that sink in\"",
    publisher: "USA TODAY (YouTube)",
    lang: "en",
    primary: false,
    ...HUMAN,
    summary:
      "USA TODAY 转发的 Musk 收购 Twitter 前一天的著名场景——他抱着一个真的水槽（sink）走进 Twitter 总部，配文「let that sink in」（一语双关：让它沉下来 / 让水槽进去）。这成为他接管 Twitter 时代最具标志性的一帧。",
  },
};

let added = 0;
let mutated = false;

for (const event of events) {
  const newSource = VIDEO_SOURCES[event.id];
  if (!newSource) continue;

  // Idempotent: skip if a source with this id already exists on this event
  if (event.sources.some((s) => s.id === newSource.id)) {
    console.log(`skip ${event.id} (already has ${newSource.id})`);
    continue;
  }

  event.sources.push(newSource);
  console.log(`+ ${event.id} → ${newSource.id}`);
  added++;
  mutated = true;
}

if (mutated) {
  fs.writeFileSync(filePath, JSON.stringify(events, null, 2) + "\n");
}
console.log(`\nadded ${added} video sources to musk events`);
