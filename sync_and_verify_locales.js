const fs = require('fs');
const path = require('path');

const keyUpdates = {
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
  },
  "Tours": {
    hi: "यात्राएं",
    fr: "Circuits",
    de: "Touren",
    nl: "Tours",
    ru: "Туры",
    ja: "ツアー",
    zh: "旅游",
    ar: "الجولات السياحية",
    es: "Tours",
    pt: "Passeios"
  },
  "Home": {
    hi: "मुख्य पृष्ठ",
    fr: "Accueil",
    de: "Startseite",
    nl: "Home",
    ru: "Главная",
    ja: "ホーム",
    zh: "首页",
    ar: "الرئيسية",
    es: "Inicio",
    pt: "Início"
  },
  "Hotels": {
    hi: "होटल",
    fr: "Hôtels",
    de: "Hotels",
    nl: "Hotels",
    ru: "Отели",
    ja: "ホテル",
    zh: "酒店",
    ar: "الفنادق",
    es: "Hoteles",
    pt: "Hotéis"
  },
  "Rent A Car": {
    hi: "कार किराए पर लें",
    fr: "Louer une voiture",
    de: "Mietwagen",
    nl: "Huur een auto",
    ru: "Аренда авто",
    ja: "レンタカー",
    zh: "租车服务",
    ar: "استئجار سيارة",
    es: "Alquilar un coche",
    pt: "Alugar um carro"
  },
  "Contact Us": {
    hi: "संपर्क करें",
    fr: "Contactez-nous",
    de: "Kontakt",
    nl: "Contact opnemen",
    ru: "Контакты",
    ja: "お問い合わせ",
    zh: "联系我们",
    ar: "اتصل بنا",
    es: "Contáctenos",
    pt: "Fale Conosco"
  },
  "About Us": {
    hi: "हमारे बारे में",
    fr: "À propos de nous",
    de: "Über uns",
    nl: "Over ons",
    ru: "О нас",
    ja: "私たちについて",
    zh: "关于我们",
    ar: "من نحن",
    es: "Acerca de nosotros",
    pt: "Sobre nós"
  },
  "Visa": {
    hi: "वीजा",
    fr: "Visa",
    de: "Visum",
    nl: "Visum",
    ru: "Виза",
    ja: "ビザ",
    zh: "签证",
    ar: "تأشيرة دخول",
    es: "Visado",
    pt: "Visto"
  },
  "Blog": {
    hi: "ब्लॉग",
    fr: "Blog",
    de: "Blog",
    nl: "Blog",
    ru: "Блог",
    ja: "ブログ",
    zh: "博客",
    ar: "المدونة",
    es: "Blog",
    pt: "Blog"
  }
};

const langs = ['en', 'hi', 'fr', 'de', 'nl', 'ru', 'ja', 'zh', 'ar', 'es', 'pt'];

// Ensure public/locales directory exists
if (!fs.existsSync('public/locales')) {
  fs.mkdirSync('public/locales', { recursive: true });
}

langs.forEach(lang => {
  const srcPath = `src/locales/${lang}.json`;
  const publicPath = `public/locales/${lang}.json`;

  let data = {};
  if (fs.existsSync(srcPath)) {
    data = JSON.parse(fs.readFileSync(srcPath, 'utf8'));
  }

  // Clean up corrupted string keys if any (e.g. key containing "Holi")
  for (const [k, v] of Object.entries(keyUpdates)) {
    if (lang === 'en') {
      data[k] = k;
    } else if (v[lang]) {
      data[k] = v[lang];
    }
  }

  // Also replace any values in data that contain corrupted "Holi" fragments
  for (const key of Object.keys(data)) {
    if (typeof data[key] === 'string' && data[key].includes('Holi')) {
      if (keyUpdates[key] && keyUpdates[key][lang]) {
        data[key] = keyUpdates[key][lang];
      } else {
        // Replace 'Holi' artifact if present
        data[key] = data[key].replace(/Holi[أअ\w]*/gi, '');
      }
    }
  }

  // Save to src/locales/
  fs.writeFileSync(srcPath, JSON.stringify(data, null, 2));

  // Copy to public/locales/
  fs.writeFileSync(publicPath, JSON.stringify(data, null, 2));

  console.log(`Successfully updated and synced ${lang}.json to both src/locales/ and public/locales/`);
});
