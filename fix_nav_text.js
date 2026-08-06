const fs = require('fs');
const missingKeys = {
  "Cars": {
    hi: "कारें", fr: "Voitures", de: "Autos", nl: "Auto's",
    ru: "Автомобили", ja: "レンタカー", zh: "租车", ar: "سيارات", es: "Coches", pt: "Carros"
  },
  "About": {
    hi: "हमारे बारे में", fr: "À propos", de: "Über uns", nl: "Over ons",
    ru: "О нас", ja: "会社概要", zh: "关于我们", ar: "معلومات عنا", es: "Acerca de", pt: "Sobre"
  },
  "cars": {
    hi: "कारें", fr: "Voitures", de: "Autos", nl: "Auto's",
    ru: "Автомобили", ja: "レンタカー", zh: "租车", ar: "سيارات", es: "Coches", pt: "Carros"
  },
  "about": {
    hi: "हमारे बारे में", fr: "À propos", de: "Über uns", nl: "Over ons",
    ru: "О нас", ja: "会社概要", zh: "关于我们", ar: "معلومات عنا", es: "Acerca de", pt: "Sobre"
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
    console.log(`Fixed ${lang}.json`);
  }
});
