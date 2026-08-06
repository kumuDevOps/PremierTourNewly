const fs = require('fs');

const d = {
  "Beach Holidays": {
    hi: "समुद्री तट की छुट्टियां",
    fr: "Vacances à la plage",
    de: "Strandurlaub",
    nl: "Strandvakanties",
    ru: "Пляжный отдых",
    ja: "ビーチホリデー",
    zh: "海滩度假",
    ar: "عطلات الشاطئ",
    es: "Vacaciones en la playa",
    pt: "Férias na praia"
  },
  "City Tours": {
    hi: "शहर के दौरे",
    fr: "Visites de la ville",
    de: "Städtetouren",
    nl: "Stadstours",
    ru: "Городские туры",
    ja: "市内ツアー",
    zh: "城市游览",
    ar: "جولات المدينة",
    es: "Tours por la ciudad",
    pt: "Passeios pela cidade"
  },
  "Adventure Tours": {
    hi: "रोमांचक यात्राएं",
    fr: "Tours d'aventure",
    de: "Abenteuertouren",
    nl: "Avontuurlijke tours",
    ru: "Приключенческие туры",
    ja: "アドベンチャーツアー",
    zh: "冒险之旅",
    ar: "جولات المغامرات",
    es: "Tours de aventura",
    pt: "Passeios de aventura"
  },
  "Group Tours": {
    hi: "समूह पर्यटन",
    fr: "Visites de groupe",
    de: "Gruppentouren",
    nl: "Groepstours",
    ru: "Групповые туры",
    ja: "グループツアー",
    zh: "团体旅游",
    ar: "جولات جماعية",
    es: "Tours grupales",
    pt: "Passeios em grupo"
  },
  "Flights": {
    hi: "उड़ानें",
    fr: "Vols",
    de: "Flüge",
    nl: "Vluchten",
    ru: "Рейсы",
    ja: "フライト",
    zh: "航班",
    ar: "الرحلات الجوية",
    es: "Vuelos",
    pt: "Voos"
  }
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
    console.log(`Fixed navbar translations in ${lang}.json`);
  }
});
