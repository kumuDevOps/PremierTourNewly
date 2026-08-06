const fs = require('fs');
const path = require('path');

const locales = ['de', 'fr', 'nl', 'ja', 'zh', 'ru', 'hi', 'ar'];

// Explicit dictionary for clean UI terms across all languages
const explicitDict = {
  "Curated Experiences": {
    zh: "精选体验", ja: "厳選された体験", de: "Kuratierte Erlebnisse", fr: "Expériences sur mesure", nl: "Gecureerde ervaringen", ru: "Избранные программы", hi: "क्यूरेटेड अनुभव", ar: "تجارب ممتازة"
  },
  "Embark on unforgettable journeys with our meticulously crafted travel packages. From pristine beaches to historic cities.": {
    zh: "开启令人难忘的旅程，享受我们精心打造的旅游套餐。从纯净海滩到历史名城。",
    ja: "心に残る旅へ出発しましょう。美しいビーチから歴史ある街まで、厳選されたツアーパッケージをご用意しています。",
    de: "Begeben Sie sich auf unvergessliche Reisen mit unseren sorgfältig zusammengestellten Reisepaketen. Von makellosen Stränden bis zu historischen Städten.",
    fr: "Embarquez pour des voyages inoubliables avec nos forfaits soigneusement conçus. Des plages immaculées aux villes historiques.",
    nl: "Begin aan onvergetelijke reizen met onze zorgvuldig samengestelde reispakketten. Van stranden tot historische steden.",
    ru: "Отправляйтесь в незабываемые путешествия с нашими тщательно продуманными турпакетами. От пляжей до исторических городов.",
    hi: "हमारे सावधानीपूर्वक तैयार किए गए यात्रा पैकेजों के साथ अविस्मरणीय यात्रा पर निकलें। समुद्र तटों से लेकर ऐतिहासिक शहरों तक।",
    ar: "انطلق في رحلات لا تُنسى مع باقات السفر المصممة بعناية. من الشواطئ البكر إلى المدن التاريخية."
  },
  "Search Tours": {
    zh: "搜索行程", ja: "ツアーを検索", de: "Touren suchen", fr: "Rechercher des circuits", nl: "Zoek tours", ru: "Поиск туров", hi: "टूर खोजें", ar: "البحث عن الجولات"
  },
  "List View": {
    zh: "列表视图", ja: "リスト表示", de: "Listenansicht", fr: "Vue liste", nl: "Lijstweergave", ru: "Списком", hi: "सूची दृश्य", ar: "عرض القائمة"
  },
  "Map View": {
    zh: "地图视图", ja: "マップ表示", de: "Kartenansicht", fr: "Vue carte", nl: "Kaartweergave", ru: "На карте", hi: "मानचित्र दृश्य", ar: "عرض الخريطة"
  },
  "Travel Style": {
    zh: "旅行风格", ja: "旅行スタイル", de: "Reisestil", fr: "Style de voyage", nl: "Reisstijl", ru: "Стиль путешествия", hi: "यात्रा शैली", ar: "نمط السفر"
  },
  "Max Budget": {
    zh: "最高预算", ja: "最大予算", de: "Maximales Budget", fr: "Budget maximum", nl: "Maximaal budget", ru: "Макс. бюджет", hi: "अधिकतम बजट", ar: "الميزانية القصوى"
  },
  "Destination, title...": {
    zh: "目的地、标题...", ja: "目的地、タイトル...", de: "Reiseziel, Titel...", fr: "Destination, titre...", nl: "Bestemming, titel...", ru: "Направление, название...", hi: "गंतव्य, शीर्षक...", ar: "الوجهة، العنوان..."
  },
  "Curated Experience Category Images": {
    zh: "精选体验分类图片", ja: "厳選体験カテゴリー画像", de: "Bilder für kuratierte Erlebniskategorien", fr: "Images des catégories d'expériences sur mesure", nl: "Afbeeldingen voor gecureerde ervaringscategorieën", ru: "Изображения категорий экскурсий", hi: "क्यूरेटेड अनुभव श्रेणी छवियां", ar: "صور فئات التجارب الممتازة"
  },
  "Click or hover over famous locations across the island to discover curated luxury tours and signature travel experiences.": {
    zh: "点击或将鼠标悬停在全岛著名景点上，探索精心策划的奢华行程和特色旅行体验。",
    ja: "島内の有名なスポットをクリックまたはホバーして、厳選されたラグジュアリーツアーやおすすめの体験を見つけましょう。",
    de: "Klicken oder fahren Sie über berühmte Orte auf der Insel, um kuratierte Luxustouren und exklusive Reiseerlebnisse zu entdecken.",
    fr: "Cliquez ou survolez des lieux célèbres de l'île pour découvrir des circuits de luxe sur mesure et des expériences de voyage exclusives.",
    nl: "Klik of zweef over beroemde locaties op het eiland om gecureerde luxetours en exclusieve reiservaringen te ontdekken.",
    ru: "Нажмите или наведите курсор на знаменитые места острова, чтобы открыть для себя эксклюзивные туры и уникальные впечатления.",
    hi: "द्वीप भर के प्रसिद्ध स्थानों पर क्लिक करें या होवर करें और क्यूरेटेड लक्जरी टूर और विशिष्ट यात्रा अनुभवों की खोज करें।",
    ar: "انقر أو مرر فوق المواقع الشهيرة في جميع أنحاء الجزيرة لاكتشاف الجولات الفاخرة الممتازة وتجارب السفر المميزة."
  },
  "100% carbon-neutral tours by offsetting emissions via Sri Lankan forestry projects.": {
    zh: "通过斯里兰卡造林项目抵消碳排放，实现 100% 碳中和行程。",
    ja: "スリランカの森林再生プロジェクトを通じて炭素排出量を相殺し、100%カーボンニュートラルなツアーを実現します。",
    de: "100 % klimaneutrale Touren durch CO2-Kompensation über Aufforstungsprojekte in Sri Lanka.",
    fr: "Circuits 100 % neutres en carbone grâce à la compensation des émissions via des projets forestiers au Sri Lanka.",
    nl: "100% klimaatneutrale tours door CO2-compensatie via bosbouwprojecten in Sri Lanka.",
    ru: "100% углеродно-нейтральные туры за счет компенсации выбросов через лесные проекты в Шри-Ланке.",
    hi: "श्रीलंकाई वानिकी परियोजनाओं के माध्यम से उत्सर्जन को कम करके 100% कार्बन-न्यूट्रल टूर।",
    ar: "جولات محايدة للكربون بنسبة 100% من خلال تعويض الانبعاثات عبر مشاريع الحراجة في سريلانكا."
  },
  "100% carbon-offset options available for all chauffeur transfers and tours.": {
    zh: "所有专车接送和行程均可选择 100% 碳抵消选项。",
    ja: "すべての専属ドライバー付き送迎およびツアーで、100%カーボンオフセットオプションが利用可能です。",
    de: "100 % CO2-Kompensationsoptionen für alle Chauffeur-Transfers und Touren verfügbar.",
    fr: "Options de compensation carbone à 100 % disponibles pour tous les transferts avec chauffeur et circuits.",
    nl: "100% CO2-compensatieopties beschikbaar voor alle chauffeurstransfers en tours.",
    ru: "100% варианты компенсации CO2 доступны для всех трансферов с шофером и туров.",
    hi: "सभी ड्राइवर ट्रांसफर और टूर के लिए 100% कार्बन-ऑफसेट विकल्प उपलब्ध हैं।",
    ar: "تتوفر خيارات تعويض الكربون بنسبة 100% لجميع التنقلات مع سائق والجولات."
  }
};

function cleanText(text, lang) {
  if (typeof text !== 'string') return text;

  let s = text;

  // Remove Arabic prefix "تأكيد:"
  if (lang === 'ar' && s.startsWith('تأكيد:')) {
    s = s.replace(/^تأكيد:\s*/, '').trim();
  }

  // Common corrupted replacement patterns across languages
  if (lang === 'fr') {
    s = s.replace(/\bholiJour(s)?\b/gi, 'vacances');
    s = s.replace(/\bJour(s)?\b/gi, 'jours');
    s = s.replace(/\bSélectionnered\b/gi, 'sélectionné');
    s = s.replace(/\bRéservation(s)?\b/gi, 'réservation');
    s = s.replace(/\bCircuit(s)?\b/gi, 'circuit');
    s = s.replace(/\bReعرض(s)?\b/gi, 'avis');
    s = s.replace(/\bLuxe\b/gi, 'luxe');
  } else if (lang === 'nl') {
    s = s.replace(/\bholiDag(en)?\b/gi, 'vakantie');
    s = s.replace(/\bSelecterened\b/gi, 'geselecteerd');
    s = s.replace(/\bErvaring(s|en)?\b/gi, 'ervaringen');
    s = s.replace(/\bLuxe\b/gi, 'luxe');
  } else if (lang === 'zh') {
    s = s.replace(/行程s/g, '行程');
    s = s.replace(/体验s/g, '体验');
    s = s.replace(/海滩es/g, '海滩');
    s = s.replace(/预订s/g, '预订');
    s = s.replace(/holi日/g, '度假');
    s = s.replace(/List 查看/g, '列表视图');
    s = s.replace(/Map 查看/g, '地图视图');
    s = s.replace(/Curated 体验/g, '精选体验');
    s = s.replace(/Curated 奢华/g, '精选奢华');
  } else if (lang === 'ja') {
    s = s.replace(/体験s/g, '体験');
    s = s.replace(/ツアーs/g, 'ツアー');
    s = s.replace(/Curated 体験/g, '厳選された体験');
    s = s.replace(/List 表示/g, 'リスト表示');
    s = s.replace(/Map 表示/g, 'マップ表示');
  } else if (lang === 'ru') {
    s = s.replace(/Опытs/g, 'впечатления');
    s = s.replace(/турыs/g, 'туры');
    s = s.replace(/Curated Опыт/g, 'Избранные программы');
  } else if (lang === 'hi') {
    s = s.replace(/holiदिन/g, 'छुट्टी');
    s = s.replace(/टूरs/g, 'टूर');
    s = s.replace(/अनुभवs/g, 'अनुभव');
  } else if (lang === 'ar') {
    s = s.replace(/جولةs/g, 'جولات');
    s = s.replace(/حجزs/g, 'حجوزات');
    s = s.replace(/فيلاs/g, 'فيلات');
    s = s.replace(/Reعرضs?/g, 'تقييمات');
    s = s.replace(/يومs/g, 'أيام');
    s = s.replace(/مسافرs/g, 'مسافرين');
    s = s.replace(/فندقs/g, 'فنادق');
    s = s.replace(/ضيوفs/g, 'ضيوف');
  }

  // Remove trailing isolated 's' or 'es' following non-ASCII characters
  s = s.replace(/([^\x00-\x7F])\s*s\b/g, '$1');
  s = s.replace(/([^\x00-\x7F])\s*es\b/g, '$1');

  return s;
}

locales.forEach(lang => {
  const filePath = path.join(__dirname, `../src/locales/${lang}.json`);
  if (!fs.existsSync(filePath)) return;

  const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let fixedCount = 0;

  for (const [key, val] of Object.entries(json)) {
    let newVal = val;

    // Check explicit dictionary first
    if (explicitDict[key] && explicitDict[key][lang]) {
      newVal = explicitDict[key][lang];
    } else {
      newVal = cleanText(val, lang);
    }

    if (newVal !== val) {
      json[key] = newVal;
      fixedCount++;
    }
  }

  // Also add any missing explicit dict keys
  for (const [key, langMap] of Object.entries(explicitDict)) {
    if (langMap[lang] && (!json[key] || json[key] !== langMap[lang])) {
      json[key] = langMap[lang];
      fixedCount++;
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
  console.log(`Updated ${lang}.json: ${fixedCount} entries cleaned/updated.`);
});
