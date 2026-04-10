#!/usr/bin/env node
/**
 * Add English translations (title_en, summary_en) to a curated set of events.
 * Idempotent: only writes the field if missing or different.
 *
 * This is a one-off i18n POC. The same pattern works for any field that
 * needs a `_en` parallel form.
 */
import fs from "node:fs";
import path from "node:path";

const dataDir = path.join(process.cwd(), "data", "events");

// Translations keyed by event id. Add more entries here as we translate.
const TRANSLATIONS = {
  "jobs-2005-06-12-stanford": {
    summary_en:
      "His commencement address to Stanford University's class of 2005, structured as three stories from his life: connecting the dots (from his Reed College calligraphy class to Mac typography), love and loss (being fired from Apple as the best thing that ever happened to him), and death (a year after his pancreatic cancer diagnosis). Closes with the famous \"Stay hungry, stay foolish.\" Widely considered one of the most influential commencement speeches ever delivered.",
  },
  "jobs-2007-01-09-iphone": {
    summary_en:
      "\"Today, Apple is going to reinvent the phone.\" Using the famous suspense opening — \"three revolutionary products: a widescreen iPod, a revolutionary phone, a breakthrough internet communications device\" — he reveals the original iPhone. Widely considered the most important keynote in tech history.",
  },
  "jobs-1976-04-01-apple-founded": {
    summary_en:
      "Founded Apple in his adoptive parents' Los Altos garage with Wozniak and Ronald Wayne. Wayne held 10% but withdrew 11 days later for $800. Their first product, the Apple I, sold for $666.66.",
  },
  "jobs-2011-08-24-resigns-ceo": {
    summary_en:
      "Submitted his resignation letter to the board for health reasons: \"I have always said if there ever came a day when I could no longer meet my duties and expectations as Apple's CEO, I would be the first to let you know. Unfortunately, that day has come.\" Recommended Tim Cook as his successor.",
  },
  "musk-2002-03-14-spacex-founding": {
    summary_en:
      "After two failed trips to Moscow trying to buy refurbished Russian ICBMs, Musk decided to build rockets himself. SpaceX was officially incorporated in California on March 14, 2002. He committed $100M of his $180M PayPal proceeds to the company and served as CEO and Chief Engineer. Goal: drop the cost of getting to space by two orders of magnitude, ultimately to colonize Mars.",
  },
  "musk-2015-12-21-falcon-9-landing": {
    summary_en:
      "Falcon 9 flight 20 successfully delivered 11 Orbcomm satellites to orbit AND landed its first stage vertically at Cape Canaveral's Landing Zone 1. The first time in history that an orbital-class rocket booster returned to Earth intact. From this moment forward, rockets could be reused — dropping the cost of access to space by an order of magnitude and defining the 21st century launch industry.",
  },
  "musk-2020-05-30-crew-dragon-demo2": {
    summary_en:
      "SpaceX Crew Dragon \"Endeavour\" launched NASA astronauts Doug Hurley and Bob Behnken from Kennedy Space Center LC-39A to the International Space Station. The first crewed orbital spaceflight launched from US soil since the Space Shuttle's retirement in 2011, and the first ever operated by a commercial provider. SpaceX went from zero to crewed ISS launch in 18 years.",
  },

  // === Additional Jobs translations ===
  "jobs-1955-02-24-birth": {
    summary_en:
      "Born to graduate student Joanne Schieble and Syrian-born academic Abdulfattah Jandali, then placed for adoption with Paul and Clara Jobs the same year.",
  },
  "jobs-1984-01-22-1984-ad": {
    summary_en:
      "The 60-second commercial directed by Ridley Scott aired during Super Bowl XVIII on national television exactly once, teasing the Macintosh launch two days later. Widely regarded as the greatest TV commercial ever made.",
  },
  "jobs-1984-01-24-mac-launch": {
    summary_en:
      "At Apple's annual shareholder meeting, Jobs unveiled the original Macintosh by pulling it from a bag, pressing the floppy drive, and letting the machine introduce itself in a synthesized voice: \"Hello, I am Macintosh.\" The first GUI-based personal computer to reach a mass audience.",
  },
  "jobs-1985-09-17-leaves-apple": {
    summary_en:
      "After losing the power struggle with Sculley, Jobs was stripped of all operational authority. He submitted his resignation to the board and walked out with five Apple veterans to found NeXT, a workstation company aimed at higher education.",
  },
  "jobs-1986-02-pixar-acquisition": {
    summary_en:
      "Bought the computer animation division of Lucasfilm from George Lucas for about $5M and committed another $5M in operating capital. Initially viewed as a failed investment; nine years later it would become one of the most successful animation studios in history.",
  },
  "jobs-1995-11-22-toy-story": {
    summary_en:
      "Pixar released Toy Story, the first feature film made entirely with computer animation. The film's success made Pixar's IPO a week later possible and instantly multiplied Jobs' net worth.",
  },
  "jobs-1996-12-20-next-acquired": {
    summary_en:
      "Apple announced its $429M cash + 1.5M-share acquisition of NeXT, bringing Jobs back as an \"advisor.\" NeXTSTEP would become the foundation of Mac OS X.",
  },
  "jobs-1997-08-06-macworld-boston": {
    summary_en:
      "Jobs' first major public appearance after returning to Apple. He announced Microsoft's $150M investment and a five-year commitment to keep developing Office for Mac. Bill Gates appeared via satellite on a giant screen, drawing audible boos from the audience.",
  },
  "jobs-2001-10-23-ipod": {
    summary_en:
      "At a small press event in Apple's Town Hall auditorium, Jobs unveiled the original iPod, positioned as \"1,000 songs in your pocket.\" $399, Mac-only, FireWire-synced.",
  },
  "jobs-2010-01-27-ipad": {
    summary_en:
      "Introduced the original iPad at Yerba Buena Center as a \"third category\" device sitting between iPhone and laptop. The last major product launch Jobs would personally lead.",
  },
  "jobs-2011-10-05-death": {
    summary_en:
      "Died at his home in Palo Alto, California, age 56, from complications of pancreatic cancer. Apple's homepage was replaced with a black-and-white portrait of Jobs.",
  },

  // === Additional Musk translations ===
  "musk-1971-06-28-birth": {
    summary_en:
      "Born in Pretoria, South Africa, to Errol Musk (a South African engineer) and Maye Musk (a Canadian-born model and dietitian). Got his first computer (a Commodore VIC-20) at age 10, taught himself BASIC, and sold his first game program Blastar at age 12 for about $500.",
  },
  "musk-1995-06-zip2-founding": {
    summary_en:
      "After enrolling in Stanford's applied physics PhD program for two days, Musk dropped out to start Zip2 in Palo Alto with his brother Kimbal. The company built online city guide software for newspapers. Early on the brothers slept in the office and showered at the YMCA, bootstrapped with about $28,000 from their father.",
  },
  "musk-1999-02-compaq-zip2": {
    summary_en:
      "Compaq acquired Zip2 in an all-cash deal, folding it into AltaVista. Musk's 7% stake earned him $22 million — his first significant payout. Within a month he poured $12 million into his next venture, X.com.",
  },
  "musk-2002-10-03-ebay-paypal": {
    summary_en:
      "eBay acquired PayPal for $1.5 billion in stock. Musk, holding 11.72% at closing, walked away with around $176 million pre-tax — capital that would fund both SpaceX and his early Tesla investment.",
  },
  "musk-2008-09-28-falcon-1-orbit": {
    summary_en:
      "After three failures, SpaceX nearly out of money. Musk would later say \"we only had money for the fourth try.\" At 19:15 EDT on September 28 from Kwajalein Atoll, Falcon 1 finally reached orbit — the first privately developed liquid-fueled rocket to do so. Two months later NASA's $1.6B contract would save the company from bankruptcy.",
  },
  "musk-2010-06-29-tesla-ipo": {
    summary_en:
      "Tesla raised $226 million by selling 13.3 million shares at $17 on NASDAQ. The first IPO of a US carmaker since Ford in 1956. Shares closed up 40.53% at $23.89 on day one. 15 years later TSLA would be up nearly 300x.",
  },
  "musk-2012-05-25-dragon-iss": {
    summary_en:
      "SpaceX Dragon docked with the International Space Station, becoming the first commercial spacecraft to reach the ISS. The first substantive delivery under NASA's Commercial Resupply Services contract — proof that private companies could perform missions previously reserved for national space agencies.",
  },
  "musk-2018-09-06-joe-rogan": {
    summary_en:
      "Two-and-a-half hour interview on the Joe Rogan Experience podcast. AI risk, Neuralink, Mars colonization, and human consciousness — but every headline focused on the moment near the end when Musk and Rogan smoked a joint together. Tesla stock dropped the next day. Often cited as the moment Musk's public image shifted from \"Silicon Valley wunderkind\" to \"chronically online CEO.\"",
  },
  "musk-2022-10-27-twitter-close": {
    summary_en:
      "After six months of public reversal, Delaware Chancery Court litigation, and being forced to honor the deal, Musk finalized the $44 billion Twitter acquisition and immediately fired CEO Parag Agrawal, CFO Ned Segal, and head of legal Vijaya Gadde. The next day he tweeted \"the bird is freed.\" Nine months later he renamed Twitter to X.",
  },
};

const files = fs
  .readdirSync(dataDir)
  .filter((f) => f.endsWith(".json"));

let updated = 0;
for (const file of files) {
  const fullPath = path.join(dataDir, file);
  const events = JSON.parse(fs.readFileSync(fullPath, "utf8"));
  let mutated = false;

  for (const event of events) {
    const translations = TRANSLATIONS[event.id];
    if (!translations) continue;

    for (const [key, value] of Object.entries(translations)) {
      if (event[key] !== value) {
        event[key] = value;
        mutated = true;
        console.log(`  ${event.id} → ${key}`);
        updated++;
      }
    }
  }

  if (mutated) {
    fs.writeFileSync(fullPath, JSON.stringify(events, null, 2) + "\n");
    console.log(`→ wrote ${file}`);
  }
}

console.log(`\nupdated ${updated} translation fields`);
