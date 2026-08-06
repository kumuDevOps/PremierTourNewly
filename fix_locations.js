const fs = require('fs');

const d = {
  "Tangalle, Sri Lanka": { hi: "टंगले, श्रीलंका", fr: "Tangalle, Sri Lanka", de: "Tangalle, Sri Lanka", nl: "Tangalle, Sri Lanka", ru: "Тангалле, Шри-Ланка", ja: "タンガッレ、スリランカ", zh: "坦加勒，斯里兰卡", ar: "تانجالي، سريلانكا", es: "Tangalle, Sri Lanka", pt: "Tangalle, Sri Lanka" },
  "Nuwara Eliya, Sri Lanka": { hi: "नुवारा एलिया, श्रीलंका", fr: "Nuwara Eliya, Sri Lanka", de: "Nuwara Eliya, Sri Lanka", nl: "Nuwara Eliya, Sri Lanka", ru: "Нувара Элия, Шри-Ланка", ja: "ヌワラエリヤ、スリランカ", zh: "努沃勒埃利耶，斯里兰卡", ar: "نوارا إليا، سريلانكا", es: "Nuwara Eliya, Sri Lanka", pt: "Nuwara Eliya, Sri Lanka" },
  "Sigiriya, Sri Lanka": { hi: "सिगिरिया, श्रीलंका", fr: "Sigirîya, Sri Lanka", de: "Sigiriya, Sri Lanka", nl: "Sigiriya, Sri Lanka", ru: "Сигирия, Шри-Ланка", ja: "シギリヤ、スリランカ", zh: "锡吉里耶，斯里兰卡", ar: "سيجيريا، سريلانكا", es: "Sigiriya, Sri Lanka", pt: "Sigiriya, Sri Lanka" }
};

const langs = ['hi', 'fr', 'de', 'nl', 'ru', 'ja', 'zh', 'ar', 'es', 'pt'];
langs.forEach(lang => {
  const path = `src/locales/${lang}.json`;
  if (fs.existsSync(path)) {
    const data = JSON.parse(fs.readFileSync(path, 'utf8'));
    for (const [key, transMap] of Object.entries(d)) {
      if (transMap[lang]) {
        data[key] = transMap[lang];
      }
    }
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
    console.log(`Fixed locations in ${lang}.json`);
  }
});
