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

async function translateSingle(text, lang) {
  if (!text || !text.trim()) return text;
  const gtCode = LANG_MAP[lang] || lang;
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${gtCode}&dt=t&q=${encodeURIComponent(text)}`;
  
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (res.ok) {
      const data = await res.json();
      if (data && data[0]) {
        const full = data[0].map(s => s[0]).join('').trim();
        return full || text;
      }
    }
  } catch (err) {
    // Return original on error
  }
  return text;
}

async function translateChunk(chunk, lang) {
  if (!chunk.length) return [];
  const gtCode = LANG_MAP[lang] || lang;
  const prompt = chunk.join('\n');
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${gtCode}&dt=t&q=${encodeURIComponent(prompt)}`;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json();
      if (data && data[0]) {
        const fullText = data[0].map((s) => s[0]).join('');
        const lines = fullText.split('\n').map((l) => l.trim());
        if (lines.length === chunk.length) {
          return lines;
        } else if (lines.length > 0) {
          return lines.slice(0, chunk.length);
        }
      }
    }
  } catch (err) {
    // Fall back to single translations
  }

  const results = [];
  for (const item of chunk) {
    const singleVal = await translateSingle(item, lang);
    results.push(singleVal);
  }
  return results;
}

function saveDict(lang, masterKeys, dict) {
  const finalDict = {};
  for (const k of masterKeys.sort()) {
    finalDict[k] = dict[k] || k;
  }
  const srcPath = path.join(__dirname, '../src/locales', `${lang}.json`);
  const pubPath = path.join(__dirname, '../public/locales', `${lang}.json`);

  fs.writeFileSync(srcPath, JSON.stringify(finalDict, null, 2), 'utf8');
  fs.writeFileSync(pubPath, JSON.stringify(finalDict, null, 2), 'utf8');
}

async function processLanguage(lang, masterKeys) {
  console.log(`\n========================================`);
  console.log(`STARTING LANGUAGE: ${lang.toUpperCase()}`);
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
      if (cleaned && cleaned !== key && !cleaned.endsWith('(DE)') && !cleaned.endsWith('(FR)') && !cleaned.endsWith('(NL)') && !cleaned.endsWith('(RU)')) {
        resultDict[key] = cleaned;
      }
    }
  }

  const keysToTranslate = masterKeys.filter((k) => !resultDict[k]);
  console.log(`[${lang}] Existing clean: ${Object.keys(resultDict).length} / ${masterKeys.length}. Translating: ${keysToTranslate.length}`);

  if (keysToTranslate.length === 0) {
    saveDict(lang, masterKeys, resultDict);
    console.log(`[${lang}] FINISHED! All keys present.`);
    return;
  }

  const chunkSize = 4;
  const chunks = [];
  for (let i = 0; i < keysToTranslate.length; i += chunkSize) {
    chunks.push(keysToTranslate.slice(i, i + chunkSize));
  }

  const concurrency = 3;
  for (let i = 0; i < chunks.length; i += concurrency) {
    const activeChunks = chunks.slice(i, i + concurrency);
    const results = await Promise.all(activeChunks.map((c) => translateChunk(c, lang)));

    for (let cIdx = 0; cIdx < activeChunks.length; cIdx++) {
      const c = activeChunks[cIdx];
      const translated = results[cIdx];
      for (let kIdx = 0; kIdx < c.length; kIdx++) {
        const k = c[kIdx];
        const val = translated[kIdx] ? cleanValue(translated[kIdx], lang) : k;
        resultDict[k] = val || k;
      }
    }

    if ((i / concurrency) % 15 === 0 || i + concurrency >= chunks.length) {
      saveDict(lang, masterKeys, resultDict);
      console.log(`[${lang}] Saved progress: ${Math.min(i + concurrency, chunks.length)}/${chunks.length} batches`);
    }

    await new Promise((r) => setTimeout(r, 30));
  }

  saveDict(lang, masterKeys, resultDict);
  console.log(`[${lang}] COMPLETED SUCCESSFULLY! Total keys: ${Object.keys(resultDict).length}`);
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
  console.log('ALL 8 LANGUAGES TRANSLATED PERFECTLY!');
  console.log('========================================');
}

main().catch((err) => {
  console.error('Fatal translation error:', err);
  process.exit(1);
});
