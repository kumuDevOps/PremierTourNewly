const fs = require('fs');
const path = require('path');

const locales = ['de', 'fr', 'nl', 'ja', 'zh', 'ru', 'hi', 'ar'];

const exactFixes = {
  "holidaysDesc": {
    fr: "Vols, séjours, circuits et véhicules de luxe sur mesure. Réservez avec des paiements flexibles.",
    nl: "Op maat gemaakte vluchten, verblijven, tours en premium voertuigen. Boek met flexibele betalingen.",
    ja: "カスタムフライト、宿泊、ツアー、プレミアム車両。柔軟な支払い方法で予約できます。",
    zh: "定制航班、住宿、一日游和尊享车辆。支持灵活付款。",
    de: "Maßgeschneiderte Flüge, Aufenthalte, Touren und Premium-Fahrzeuge. Buchen Sie mit flexiblen Zahlungen.",
    ru: "Индивидуальные авиабилеты, проживание, туры и авто премиум-класса. Бронируйте с гибкой оплатой.",
    hi: "कस्टम-अनुकूलित उड़ानें, प्रवास, टूर और प्रीमियम वाहन। लचीले भुगतानों के साथ बुक करें।",
    ar: "رحلات جوية، وإقامات، وجولات، ومركبات فاخرة مصممة خصيصًا. احجز مع خيارات دفع مرنة."
  },
  "At Premier Tour Booking, we prioritize your privacy and data security. By subscribing to our newsletter, you consent to receive curated travel guides, luxury deals, and exclusive holiday packages.": {
    ja: "Premier Tour Bookingでは、お客様のプライバシーとデータセキュリティを最優先しています。ニュースレターに登録することで、厳選された旅行ガイド、ラグジュアリーな特典、限定パッケージツアーの案内を受け取ることに同意したことになります。",
    fr: "Chez Premier Tour Booking, nous priorisons votre confidentialité et la sécurité de vos données. En vous abonnant à notre newsletter, vous acceptez de recevoir nos guides de voyage, offres de luxe et forfaits exclusifs.",
    nl: "Bij Premier Tour Booking stellen we uw privacy en gegevensbeveiliging voorop. Door u te abonneren op onze nieuwsbrief, gaat u akkoord met het ontvangen van gecureerde reisgidsen, luxe deals en exclusieve vakantiepakketten."
  },
  "Book a tour, holiday, or flight to see it here.": {
    ja: "ツアー、ホリデー、またはフライトを予約するとここに表示されます。",
    fr: "Réservez un circuit, un séjour ou un vol pour l'afficher ici.",
    nl: "Boek een tour, vakantie of vlucht om deze hier te bekijken."
  },
  "Failed to retrieve holiday packages and tours.": {
    ja: "ホリデーパッケージとツアーの取得に失敗しました。",
    fr: "Échec de la récupération des forfaits vacances et circuits.",
    nl: "Ophalen van vakantiepakketten en tours mislukt."
  },
  "For exclusive deals, tailored holiday packages, and the best of the Premier Tour Booking portfolio, add your email below.": {
    ja: "限定特典、オーダーメイドのホリデーパッケージ、最新のオファーを受け取るには、以下にメールアドレスを入力してください。",
    fr: "Pour des offres exclusives, des forfaits sur mesure et le meilleur de Premier Tour Booking, saisissez votre e-mail ci-dessous.",
    nl: "Voor exclusieve deals, op maat gemaakte vakantiepakketten en het beste van Premier Tour Booking, vul hieronder uw e-mailadres in."
  },
  "Premier Tour Booking curated the dream luxury holiday for our wedding anniversary. From the helicopter airport transfer to our private chauffeur, Priyantha, every detail was immaculate. Watching sunrise at Sigiriya and staying in a tea estate villa were highlights of a lifetime!": {
    ja: "Premier Tour Bookingは私たちの結婚記念日のために夢のようなラグジュアリーな休暇を企画してくれました。ヘリコプターの空港送迎から専属ドライバーのPriyanthaさんまで、すべての詳細が完璧でした！",
    fr: "Premier Tour Booking a conçu les vacances de luxe de nos rêves pour notre anniversaire de mariage. Du transfert en hélicoptère à notre chauffeur privé, Priyantha, chaque détail était impeccable !",
    nl: "Premier Tour Booking heeft de droomluxe vakantie samengesteld voor onze huwelijksverjaardag. Van de helikoptertransfer tot onze privé chauffeur, Priyantha, elk detail was onberispelijk!"
  },
  "Thank you for subscribing. Exclusive luxury offers and tailored holiday packages will be delivered to your inbox.": {
    ja: "ご登録ありがとうございます。限定のラグジュアリーオファーとオーダーメイドのホリデーパッケージをメールでお届けします。",
    fr: "Merci pour votre abonnement. Des offres de luxe exclusives et des forfaits sur mesure seront livrés dans votre boîte de réception.",
    nl: "Bedankt voor uw inschrijving. Exclusieve luxe aanbiedingen en op maat gemaakte vakantiepakketten worden in uw inbox bezorgd."
  },
  "Welcome to your secure Premier Tour Booking traveler account. You can manage your search preferences and track your holiday itineraries seamlessly.": {
    ja: "Premier Tour Bookingのマイページへようこそ。検索設定の管理や旅行日程の確認をスムーズに行うことができます。",
    fr: "Bienvenue sur votre compte voyageur sécurisé Premier Tour Booking. Vous pouvez gérer vos préférences et suivre vos itinéraires de voyage facilement.",
    nl: "Welkom op uw beveiligde Premier Tour Booking reizigersaccount. U kunt uw zoekvoorkeuren beheren en uw reisroutes naadloos volgen."
  }
};

locales.forEach(lang => {
  const filePath = path.join(__dirname, `../src/locales/${lang}.json`);
  if (!fs.existsSync(filePath)) return;

  const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  for (const [key, langMap] of Object.entries(exactFixes)) {
    if (langMap[lang]) {
      json[key] = langMap[lang];
    }
  }

  // Also clean any remaining holiJour / holiDag / holi日 / holiदिन
  for (const [key, val] of Object.entries(json)) {
    if (typeof val === 'string') {
      if (val.includes('holiJoursDesc')) json[key] = exactFixes.holidaysDesc.fr;
      if (val.includes('holiDagenDesc')) json[key] = exactFixes.holidaysDesc.nl;
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
});

console.log("Applied final exact fixes.");
