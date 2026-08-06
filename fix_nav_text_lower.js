const fs = require('fs');
const missingKeys = {
  "hotels": {
    hi: "होटल", fr: "hôtels", de: "hotels", nl: "hotels",
    ru: "отели", ja: "ホテル", zh: "酒店", ar: "فنادق", es: "hoteles", pt: "hoteis"
  },
  "tours": {
    hi: "टूर", fr: "circuits", de: "touren", nl: "tours",
    ru: "туры", ja: "ツアー", zh: "旅游", ar: "جولات", es: "tours", pt: "tours"
  },
  "flights": {
    hi: "उड़ानें", fr: "vols", de: "flüge", nl: "vluchten",
    ru: "рейсы", ja: "航空券", zh: "航班", ar: "رحلات جوية", es: "vuelos", pt: "voos"
  },
  "blog": {
    hi: "ब्लॉग", fr: "blog", de: "blog", nl: "blog",
    ru: "блог", ja: "ブログ", zh: "博客", ar: "مدونة", es: "blog", pt: "blog"
  }
};
const langs = ['hi', 'fr', 'de', 'nl', 'ru', 'ja', 'zh', 'ar', 'es', 'pt'];
langs.forEach(lang => {
  const path = `src/locales/${lang}.json`;
  if (fs.existsSync(path)) {
    const data = JSON.parse(fs.readFileSync(path, 'utf8'));
    for (const [key, transMap] of Object.entries(missingKeys)) {
      if (transMap[lang]) {
        data[key] = transMap[lang];
      }
    }
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
    console.log(`Fixed lowercase nav ${lang}.json`);
  }
});
