const fs = require('fs');

const missingFallbacks = {
  "Discover the World,": {
    zh: "探索世界，",
    ja: "世界を発見し、",
    de: "Entdecken Sie die Welt,",
    fr: "Découvrez le monde,",
    nl: "Ontdek de wereld,",
    ru: "Откройте для себя мир,",
    hi: "दुनिया की खोज करें,",
    ar: "اكتشف العالم،"
  },
  "Perfected For You": {
    zh: "为您完美打造",
    ja: "あなたのために完璧に",
    de: "Perfektioniert für Sie",
    fr: "Perfectionné pour vous",
    nl: "Geperfectioneerd voor jou",
    ru: "Идеально для вас",
    hi: "आपके लिए परिपूर्ण",
    ar: "مثالي لك"
  },
  "The Perfect Stay,": {
    zh: "完美的住宿，",
    ja: "完璧な滞在、",
    de: "Der perfekte Aufenthalt,",
    fr: "Le séjour parfait,",
    nl: "Het perfecte verblijf,",
    ru: "Идеальное пребывание,",
    hi: "सही प्रवास,",
    ar: "إقامة مثالية،"
  },
  "Every Single Time": {
    zh: "每一次都是如此",
    ja: "いつでも完璧に",
    de: "Jedes einzelne Mal",
    fr: "À chaque fois",
    nl: "Elke keer weer",
    ru: "Каждый раз",
    hi: "हर एक बार",
    ar: "في كل مرة"
  },
  "The Perfect Flight,": {
    zh: "完美的飞行，",
    ja: "完璧なフライト、",
    de: "Der perfekte Flug,",
    fr: "Le vol parfait,",
    nl: "De perfecte vlucht,",
    ru: "Идеальный полет,",
    hi: "सही उड़ान,",
    ar: "رحلة طيران مثالية،"
  },
  "✓ Thank you for subscribing! Exquisite offers are on the way.": {
    zh: "✓ 感谢您的订阅！精美优惠即将送达。",
    ja: "✓ 購読ありがとうございます！素晴らしいオファーをお届けします。",
    de: "✓ Danke fürs Abonnieren! Exquisite Angebote sind auf dem Weg.",
    fr: "✓ Merci de votre abonnement! Des offres exquises sont en route.",
    nl: "✓ Bedankt voor het abonneren! Uitstekende aanbiedingen zijn onderweg.",
    ru: "✓ Спасибо за подписку! Изысканные предложения уже в пути.",
    hi: "✓ सदस्यता लेने के लिए धन्यवाद! उत्कृष्ट प्रस्ताव रास्ते में हैं।",
    ar: "✓ شكرا لاشتراكك! عروض رائعة في طريقها إليك."
  },
  "An error occurred. Please try again.": {
    zh: "发生错误。请重试。",
    ja: "エラーが発生しました。もう一度お試しください。",
    de: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
    fr: "Une erreur s'est produite. Veuillez réessayer.",
    nl: "Er is een fout opgetreden. Probeer het opnieuw.",
    ru: "Произошла ошибка. Пожалуйста, попробуйте еще раз.",
    hi: "एक त्रुटि हुई। कृपया पुन: प्रयास करें।",
    ar: "حدث خطأ. يرجى المحاولة مرة أخرى."
  },
  "Custom-tailored flights, stays, tours, and premium vehicles. Book with flexible payments.": {
    zh: "定制机票、住宿、旅游和高级车辆。支持灵活付款预订。",
    ja: "オーダーメイドのフライト、滞在、ツアー、プレミアム車両。柔軟な支払いで予約。",
    de: "Maßgeschneiderte Flüge, Unterkünfte, Touren und Premium-Fahrzeuge. Flexibel bezahlen.",
    fr: "Vols, séjours, circuits et véhicules haut de gamme sur mesure. Réservez avec des paiements flexibles.",
    nl: "Op maat gemaakte vluchten, verblijven, tours en premium voertuigen. Boek met flexibele betalingen.",
    ru: "Индивидуальные рейсы, проживание, туры и автомобили премиум-класса. Бронируйте с гибкой оплатой.",
    hi: "कस्टम-अनुरूप उड़ानें, ठहरने, पर्यटन और प्रीमियम वाहन। लचीले भुगतानों के साथ बुक करें।",
    ar: "رحلات طيران وإقامات وجولات سيارات مصممة خصيصًا لك مع خيارات دفع مرنة."
  },
  "Unwind in hand-picked luxury suites, premium beach retreats, and award-winning private stays.": {
    zh: "在精心挑选的高级套房、优质海滩度假村和屡获殊荣的私人住所中尽情放松。",
    ja: "厳選されたラグジュアリースイート、プレミアムビーチリゾート、受賞歴のあるプライベート滞在でリラックス。",
    de: "Entspannen Sie in handverlesenen Luxussuiten, erstklassigen Strandresorts und preisgekrönten Privatunterkünften.",
    fr: "Détendez-vous dans des suites de luxe triées sur le volet, des retraites de plage de qualité supérieure et des séjours privés primés.",
    nl: "Ontspan in zorgvuldig geselecteerde luxe suites, premium strandretraites en bekroonde privéverblijven.",
    ru: "Расслабьтесь в тщательно отобранных роскошных люксах, премиальных пляжных курортах и отмеченных наградами частных домах.",
    hi: "हाथ से चुने गए लक्जरी सुइट्स, प्रीमियम बीच रिट्रीट और पुरस्कार विजेता निजी प्रवास में आराम करें।",
    ar: "استرخِ في أجنحة فاخرة ومنتجعات شاطئية متميزة وإقامات خاصة فاخرة."
  },
  "Book global premium airfare with flexible payments.": {
    zh: "以灵活的付款方式预订全球优质机票。",
    ja: "柔軟な支払いで、グローバルなプレミアム航空券を予約。",
    de: "Buchen Sie weltweite Premium-Flüge mit flexiblen Zahlungsoptionen.",
    fr: "Réservez des vols premium mondiaux avec des paiements flexibles.",
    nl: "Boek wereldwijde premium vluchten met flexibele betalingen.",
    ru: "Бронируйте авиабилеты премиум-класса по всему миру с гибкими условиями оплаты.",
    hi: "लचीले भुगतानों के साथ वैश्विक प्रीमियम हवाई किराया बुक करें।",
    ar: "احجز رحلات طيران عالمية فاخرة بأسعار ممتازة مع دفع مرن."
  },
  "Rent premium private vehicles around the globe.": {
    zh: "在全求各地租赁优质私人车辆。",
    ja: "世界中でプレミアムなプライベート車両をレンタル。",
    de: "Mieten Sie erstklassige Privatfahrzeuge rund um den Globus.",
    fr: "Louez des véhicules privés haut de gamme dans le monde entier.",
    nl: "Huur wereldwijd premium privévoertuigen.",
    ru: "Арендуйте частные автомобили премиум-класса по всему миру.",
    hi: "दुनिया भर में प्रीमियम निजी वाहन किराए पर लें।",
    ar: "استأجر سيارات خاصة فاخرة حول العالم."
  },
  "Holidays": { zh: "假期", ja: "休日", de: "Urlaub", fr: "Vacances", nl: "Vakanties", ru: "Праздники", hi: "छुट्टियां", ar: "العطلات" },
  "Hotels": { zh: "酒店", ja: "ホテル", de: "Hotels", fr: "Hôtels", nl: "Hotels", ru: "Отели", hi: "होटल", ar: "الفنادق" },
  "Flights": { zh: "航班", ja: "フライト", de: "Flüge", fr: "Vols", nl: "Vluchten", ru: "Авиарейсы", hi: "उड़ानें", ar: "الرحلات الجوية" },
  "Rentals": { zh: "租车", ja: "レンタカー", de: "Mietwagen", fr: "Locations", nl: "Verhuur", ru: "Аренда", hi: "किराये", ar: "تأجير" },
  "Tours": { zh: "旅游", ja: "ツアー", de: "Touren", fr: "Circuits", nl: "Tours", ru: "Туры", hi: "टूर", ar: "جولات" }
};

const dirs = ["src/locales", "public/locales"];
const locales = ["en", "de", "fr", "nl", "ja", "zh", "ru", "hi", "ar"];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) return;
  locales.forEach(lang => {
    const filePath = `${dir}/${lang}.json`;
    if (fs.existsSync(filePath)) {
      let json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      for (const [key, langMap] of Object.entries(missingFallbacks)) {
        if (lang === 'en') {
          json[key] = key;
        } else if (langMap[lang]) {
          json[key] = langMap[lang];
        }
      }
      fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
    }
  });
});

console.log('done patching translations 2 in both folders');
