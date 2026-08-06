const fs = require('fs');

function cleanAr(data) {
  const fixes = {
    "Category Container Image Preview": "معاينة صورة حاوية الفئة",
    "LIVE ROUTE & TRANSFER MAP PREVIEW": "معاينة حية للمسار وخريطة النقل",
    "PayPal Express Checkout Preview:": "معاينة الدفع السريع عبر PayPal:",
    "Route Preview": "معاينة المسار",
    "LIVE ROUTE PREVIEW": "معاينة حية للمسار",
    "Preview": "معاينة",
    "Reviews": "الآراء",
    "reviews": "آراء",
    "Guest Reviews": "آراء الضيوف",
    "Review": "تقييم",
    "View": "عرض",
    "Overview": "نظرة عامة",
    "List View": "عرض القائمة",
    "Map View": "عرض الخريطة",
    "Grid View": "عرض الشبكة",
    "Bookings": "الحجوزات",
    "bookings": "حجوزات",
    "Booking": "الحجز",
    "booking": "حجز",
    "Tours": "الجولات",
    "tours": "جولات",
    "Tour": "الجولة",
    "tour": "جولة",
    "Flight": "رحلة طيران",
    "flight": "رحلة طيران",
    "Flights": "رحلات الطيران",
    "flights": "رحلات الطيران",
    "Luxury": "فاخر",
    "luxury": "فاخر",
    "Wishlist": "قائمة الأمنيات",
    "wishlist": "قائمة الأمنيات",
    "Payment": "الدفع",
    "payment": "دفع",
    "Select": "تحديد",
    "select": "تحديد",
    "Voucher": "قسيمة",
    "voucher": "قسيمة"
  };

  for (const key in data) {
    if (typeof data[key] === 'string') {
      // Manual overrides
      if (fixes[key]) {
        data[key] = fixes[key];
        continue;
      }
      
      let val = data[key];
      val = val.replace(/Reعرضs/gi, 'آراء');
      val = val.replace(/Reعرض/gi, 'مراجعة');
      val = val.replace(/Preعرض/gi, 'معاينة');
      val = val.replace(/Overعرض/gi, 'نظرة عامة');
      val = val.replace(/List عرض/gi, 'عرض القائمة');
      val = val.replace(/Map عرض/gi, 'عرض الخريطة');
      val = val.replace(/Grid عرض/gi, 'عرض الشبكة');
      val = val.replace(/حجزs/gi, 'حجوزات');
      val = val.replace(/جولةs/gi, 'جولات');
      data[key] = val;
    }
  }
  return data;
}

function cleanNl(data) {
  const fixes = {
    "Based on 1,480+ verified reviews": "Gebaseerd op 1.480+ geverifieerde beoordelingen",
    "Based on 1,480+ verified reviews \u2022 5.0 / 4.9": "Gebaseerd op 1.480+ geverifieerde beoordelingen \u2022 5.0 / 4.9",
    "Best Price Match Guarantee against any verified tour operator.": "Beste prijsgarantie in vergelijking met elke geverifieerde touroperator.",
    "Browse verified guided excursions and adventure trails designed around the world.": "Blader door geverifieerde begeleide excursies en avontuurlijke routes over de hele wereld.",
    "Download or share your verified travel document": "Download of deel uw geverifieerde reisdocument",
    "GPS Verified Location": "GPS Geverifieerde Locatie",
    "No authenticated login log sessions recorded for this customer account.": "Er zijn geen geverifieerde inloglogsessies geregistreerd voor dit klantaccount.",
    "Our state-of-the-art booking system brings real-time rates directly from verified hotels, airlines, and premium vehicle operators, helping you secure the best prices with fully custom dates, and customizable payment structures.": "Ons state-of-the-art boekingssysteem biedt realtime tarieven rechtstreeks van geverifieerde hotels, luchtvaartmaatschappijen en premium autoverhuurbedrijven, waardoor u de beste prijzen kunt vastleggen met volledig aangepaste data en aanpasbare betalingsstructuren.",
    "Over 8 years of continuous booking experience, verified tour experts, and ATOL/ABTA protected travel networks.": "Meer dan 8 jaar onafgebroken boekingservaring, geverifieerde tourexperts en ATOL/ABTA-beschermde reisnetwerken.",
    "Pre-planned verified tours": "Vooraf geplande geverifieerde tours",
    "Pre-planned verified tours with expert local guides.": "Vooraf geplande geverifieerde tours met deskundige lokale gidsen.",
    "Publish Verified Traveler Story": "Publiceer Geverifieerd Reizigersverhaal",
    "Submit Verified Review": "Dien Geverifieerde Beoordeling in",
    "Submit Your Verified Rental Review": "Dien Uw Geverifieerde Huurbeoordeling in",
    "VERIFIED GUEST REVIEWS": "GEVERIFIEERDE GASTENBEOORDELINGEN",
    "VERIFIED SOCIAL PROOF": "GEVERIFIEERD SOCIAAL BEWIJS",
    "Verified": "Geverifieerd",
    "Verified Account": "Geverifieerd Account",
    "Verified Customer Reviews": "Geverifieerde Klantbeoordelingen",
    "Verified Guest": "Geverifieerde Gast",
    "Verified Guest Only": "Alleen Geverifieerde Gasten",
    "Verified Guest Reviews": "Geverifieerde Gastenbeoordelingen",
    "Verified Guest badge will be automatically attached!": "De Geverifieerde Gast-badge wordt automatisch toegevoegd!",
    "Verified Social Proof": "Geverifieerd Sociaal Bewijs",
    
    // Other bad NL translations
    "Best Prijs Guarantee": "Beste Prijsgarantie",
    "Direct relationships with Hoteliers and global flight networks let us match and beat any competitor pricing.": "Directe relaties met hoteliers en wereldwijde vluchtnetwerken stellen ons in staat om elke concurrentieprijs te evenaren en te overtreffen.",
    "Connecting 45 countries with local vehicle rental pickup counters and Luxe Resort options.": "Verbindt 45 landen met lokale afhaalbalies voor autoverhuur en luxe resortopties.",
    "Over 8 years of continuous Boeking Ervaring, Geverifieerd Tour experts, and ATOL/ABTA protected travel networks.": "Ruim 8 jaar onafgebroken boekingservaring, geverifieerde tourexperts en ATOL/ABTA-beschermde reisnetwerken.",
    "Trusted Ervaring": "Vertrouwde Ervaring",
    "Immediate conci\u00ebrgeondersteuning in Londen, Dubai en Singapore om annuleringen of omleidingen direct af te handelen.": "Directe conciërge-ondersteuning in Londen, Dubai en Singapore om annuleringen of omboekingen direct af te handelen."
  };

  for (const key in data) {
    if (fixes[key]) {
      data[key] = fixes[key];
    } else {
      let val = data[key];
      val = val.replace(/Boeking/g, 'Boeking');
      val = val.replace(/ReBekijken/g, 'Beoordeling');
      val = val.replace(/Reiziger/g, 'Reiziger');
      data[key] = val;
    }
  }
  return data;
}

const arPath = './src/locales/ar.json';
const nlPath = './src/locales/nl.json';

let arData = JSON.parse(fs.readFileSync(arPath, 'utf8'));
arData = cleanAr(arData);
fs.writeFileSync(arPath, JSON.stringify(arData, null, 2));

let nlData = JSON.parse(fs.readFileSync(nlPath, 'utf8'));
nlData = cleanNl(nlData);
fs.writeFileSync(nlPath, JSON.stringify(nlData, null, 2));

console.log('Fixed locales');
