const fs = require('fs');

const missingFallbacks = {
  "Experience ultimate comfort with bespoke guest concierge services, refined dining, and sweeping coastal vistas.": {
    zh: "通过定制客房礼宾服务、精致餐饮和壮丽的海岸景观，体验极致舒适。",
    ja: "オーダーメイドのゲストコンシェルジュサービス、洗練されたダイニング、壮大な海岸の景色で究極の快適さを体験してください。",
    de: "Erleben Sie ultimativen Komfort mit maßgeschneiderten Gäste-Concierge-Services, feinem Essen und weitem Küstenblick.",
    fr: "Faites l'expérience du confort ultime avec des services de conciergerie sur mesure, une restauration raffinée et des vues panoramiques sur la côte.",
    nl: "Ervaar ultiem comfort met op maat gemaakte gastenconciërgediensten, verfijnd dineren en uitgestrekte kustgezichten.",
    ru: "Испытайте максимальный комфорт с индивидуальными услугами консьержа, изысканными ресторанами и потрясающим видом на побережье.",
    hi: "कस्टम अतिथि कंसीयज सेवाओं, परिष्कृत भोजन और शानदार तटीय दृश्यों के साथ परम आराम का अनुभव करें।",
    ar: "استمتع بالراحة القصوى مع خدمات الكونسيرج المخصصة للضيوف، وتناول الطعام الراقي، والإطلالات الساحلية البانورامية."
  },
  "Includes professional English-speaking driver, fuel, highway tolls, passenger liability insurance, and 24/7 breakdown support.": {
    zh: "包含专业的英语司机、燃油费、高速公路通行费、乘客责任险以及全天候（24/7）的故障救援支持。",
    ja: "プロの英語を話すドライバー、燃料費、高速道路料金、乗客賠償責任保険、24時間年中無休の故障サポートが含まれています。",
    de: "Inklusive professionellem englischsprachigem Fahrer, Treibstoff, Autobahngebühren, Insassenhaftpflichtversicherung und 24/7-Pannenhilfe.",
    fr: "Comprend un chauffeur professionnel anglophone, le carburant, les péages autoroutiers, l'assurance responsabilité civile des passagers et une assistance dépannage 24h/24 et 7j/7.",
    nl: "Inclusief professionele Engelssprekende chauffeur, brandstof, tolwegen, aansprakelijkheidsverzekering voor passagiers en 24/7 pechhulp.",
    ru: "Включает профессионального англоговорящего водителя, топливо, дорожные сборы, страхование гражданской ответственности пассажиров и круглосуточную поддержку при поломках.",
    hi: "पेशेवर अंग्रेजी भाषी ड्राइवर, ईंधन, राजमार्ग टोल, यात्री देयता बीमा और 24/7 ब्रेकडाउन समर्थन शामिल है।",
    ar: "يشمل سائقًا محترفًا يتحدث الإنجليزية، والوقود، ورسوم الطرق السريعة، وتأمين مسؤولية الركاب، ودعم الأعطال على مدار الساعة طوال أيام الأسبوع."
  },
  "Detailed itinerary information is currently unavailable.": {
    zh: "目前无法提供详细的行程信息。",
    ja: "詳細な旅程情報は現在利用できません。",
    de: "Detaillierte Reiserouteninformationen sind derzeit nicht verfügbar.",
    fr: "Les informations détaillées sur l'itinéraire sont actuellement indisponibles.",
    nl: "Gedetailleerde reisschema-informatie is momenteel niet beschikbaar.",
    ru: "Подробная информация о маршруте в настоящее время недоступна.",
    hi: "विस्तृत यात्रा कार्यक्रम की जानकारी वर्तमान में अनुपलब्ध है।",
    ar: "معلومات خط سير الرحلة التفصيلية غير متوفرة حاليًا."
  },
  "No summary available": {
    zh: "无可用摘要",
    ja: "要約はありません",
    de: "Keine Zusammenfassung verfügbar",
    fr: "Aucun résumé disponible",
    nl: "Geen samenvatting beschikbaar",
    ru: "Резюме недоступно",
    hi: "कोई सारांश उपलब्ध नहीं है",
    ar: "لا يوجد ملخص متاح"
  }
};

const locales = ["en", "de", "fr", "nl", "ja", "zh", "ru", "hi", "ar"];
let fixes = 0;

locales.forEach(lang => {
  const filePath = `src/locales/${lang}.json`;
  if (fs.existsSync(filePath)) {
    const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    for (const [key, langMap] of Object.entries(missingFallbacks)) {
      if (lang === 'en') {
        json[key] = key;
      } else if (langMap[lang]) {
        json[key] = langMap[lang];
      }
      fixes++;
    }
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
  }
});
console.log('Fixed fallbacks, keys modified:', fixes);
