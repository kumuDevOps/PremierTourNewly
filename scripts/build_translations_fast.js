const fs = require('fs');
const path = require('path');

const LANGUAGES = ['de', 'fr', 'ar', 'nl', 'ja', 'zh', 'ru', 'hi'];

const LANG_MAP = {
  zh: 'zh-CN',
  de: 'de',
  fr: 'fr',
  ar: 'ar',
  nl: 'nl',
  ja: 'ja',
  ru: 'ru',
  hi: 'hi'
};

function cleanValue(val, lang) {
  if (!val) return '';
  let str = String(val).trim();
  const badSuffixes = [
    `(${lang.toUpperCase()})`,
    '(DE)',
    '(FR)',
    '(NL)',
    '(RU)',
    '(AR)',
    '(HI)',
    '（日本語）',
    '（中文）',
    '(हिंदी)'
  ];
  for (const suf of badSuffixes) {
    if (str.endsWith(suf)) {
      str = str.slice(0, -suf.length).trim();
    }
  }
  return str;
}

async function translateChunk(chunk, lang) {
  if (!chunk.length) return [];
  const gtCode = LANG_MAP[lang] || lang;
  const prompt = chunk.join('\n');
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${gtCode}&dt=t&q=${encodeURIComponent(prompt)}`;

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data && data[0]) {
      const full = data[0].map((s) => s[0]).join('');
      const lines = full.split('\n');
      if (lines.length === chunk.length) {
        return lines.map((l) => l.trim());
      }
      // If split count matches or slightly differs
      if (lines.length > 0) {
        return lines.slice(0, chunk.length).map((l) => l.trim());
      }
    }
  } catch (err) {
    console.warn(`[${lang}] Batch translate warning:`, err.message);
  }

  // Fallback string by string if batch failed
  const fallbackResults = [];
  for (const item of chunk) {
    try {
      const singleUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${gtCode}&dt=t&q=${encodeURIComponent(item)}`;
      const sRes = await fetch(singleUrl);
      const sData = await sRes.json();
      const sText = sData[0].map((s) => s[0]).join('').trim();
      fallbackResults.push(sText || item);
    } catch (e) {
      fallbackResults.push(item);
    }
  }
  return fallbackResults;
}

async function processLanguage(lang, masterKeys) {
  console.log(`\n========================================`);
  console.log(`Processing Language: ${lang.toUpperCase()}`);
  console.log(`========================================`);

  const srcPath = path.join(__dirname, '../src/locales', `${lang}.json`);
  let existing = {};
  if (fs.existsSync(srcPath)) {
    try {
      existing = JSON.parse(fs.readFileSync(srcPath, 'utf8'));
    } catch (e) {
      existing = {};
    }
  }

  const resultDict = {};

  // Preserve existing clean non-suffixed translations
  for (const key of masterKeys) {
    if (existing[key]) {
      const cleaned = cleanValue(existing[key], lang);
      if (cleaned && cleaned !== key && !cleaned.endsWith('(DE)') && !cleaned.endsWith('(FR)')) {
        resultDict[key] = cleaned;
      }
    }
  }

  const keysToTranslate = masterKeys.filter((k) => !resultDict[k]);
  console.log(`[${lang}] ${Object.keys(resultDict).length} clean cached, ${keysToTranslate.length} to translate.`);

  // Chunk keys into batches of 15
  const chunkSize = 15;
  const chunks = [];
  for (let i = 0; i < keysToTranslate.length; i += chunkSize) {
    chunks.push(keysToTranslate.slice(i, i + chunkSize));
  }

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const translatedLines = await translateChunk(chunk, lang);

    for (let j = 0; j < chunk.length; j++) {
      const key = chunk[j];
      const val = translatedLines[j] ? cleanValue(translatedLines[j], lang) : key;
      resultDict[key] = val || key;
    }

    if ((i + 1) % 5 === 0 || i + 1 === chunks.length) {
      console.log(`[${lang}] Progress: Batch ${i + 1}/${chunks.length} complete`);
    }

    // Small 50ms pause to be polite to endpoint
    await new Promise((r) => setTimeout(r, 50));
  }

  // Ensure all master keys exist
  const finalDict = {};
  for (const key of masterKeys.sort()) {
    finalDict[key] = resultDict[key] || key;
  }

  // Save to src/locales/
  fs.writeFileSync(srcPath, JSON.stringify(finalDict, null, 2), 'utf8');

  // Save to public/locales/
  const pubPath = path.join(__dirname, '../public/locales', `${lang}.json`);
  fs.writeFileSync(pubPath, JSON.stringify(finalDict, null, 2), 'utf8');

  console.log(`[${lang}] SAVED! Total keys: ${Object.keys(finalDict).length}`);
}

async function main() {
  const masterPath = path.join(__dirname, '../master_keys.json');
  if (!fs.existsSync(masterPath)) {
    console.error('master_keys.json not found!');
    process.exit(1);
  }

  const masterKeys = JSON.parse(fs.readFileSync(masterPath, 'utf8'));
  console.log(`Loaded ${masterKeys.length} master keys.`);

  // Clean en.json
  const enDict = {};
  for (const k of masterKeys.sort()) {
    enDict[k] = k;
  }
  fs.writeFileSync(path.join(__dirname, '../src/locales/en.json'), JSON.stringify(enDict, null, 2), 'utf8');
  fs.writeFileSync(path.join(__dirname, '../public/locales/en.json'), JSON.stringify(enDict, null, 2), 'utf8');

  for (const lang of LANGUAGES) {
    await processLanguage(lang, masterKeys);
  }

  console.log('\n========================================');
  console.log('ALL 8 LANGUAGES TRANSLATED & SAVED!');
  console.log('========================================');
}

main().catch((err) => {
  console.error('Fatal translation error:', err);
  process.exit(1);
});
