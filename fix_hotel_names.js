const fs = require('fs');

const d = {
  "The Grand Hotel Nuwara Eliya": { hi: "द ग्रैंड होटल नुवारा एलिया", fr: "Le Grand Hôtel Nuwara Eliya", de: "Das Grand Hotel Nuwara Eliya", nl: "Het Grand Hotel Nuwara Eliya", ru: "Гранд Отель Нувара Элия", ja: "ザ グランド ホテル ヌワラエリヤ", zh: "努沃勒埃利耶大酒店", ar: "جراند هوتيل نوارا إليا", es: "El Grand Hotel Nuwara Eliya", pt: "O Grand Hotel Nuwara Eliya" },
  "Water Garden Sigiriya": { hi: "वाटर गार्डन सिगिरिया", fr: "Jardin d'eau de Sigirîya", de: "Wassergarten Sigiriya", nl: "Watertuin Sigiriya", ru: "Водный сад Сигирия", ja: "ウォーターガーデン シギリヤ", zh: "锡吉里耶水上花园", ar: "ووتر جاردن سيجيريا", es: "Jardín acuático de Sigiriya", pt: "Jardim aquático de Sigiriya" }
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
    console.log(`Fixed hotel names in ${lang}.json`);
  }
});
