const fs = require('fs');

const file = 'src/lib/i18n.tsx';
let content = fs.readFileSync(file, 'utf8');

const additions = {
  hi: `
    searchStaysTravel: "रहने और यात्रा की खोज करें",
    holidaysDesc: "कस्टम-अनुरूप उड़ानें, ठहरने, पर्यटन, और प्रीमियम वाहन। लचीले भुगतान के साथ बुक करें।",
    hotelsDesc: "हैंड-पिक्ड लग्जरी सूट, प्रीमियम बीच रिट्रीट और पुरस्कार विजेता निजी ठहरने की जगहों में आराम करें।",
    flightsDesc: "लचीले भुगतान के साथ वैश्विक प्रीमियम हवाई किराया बुक करें।",
    carsDesc: "दुनिया भर में प्रीमियम निजी वाहन किराए पर लें।",
    goingTo: "कहाँ जा रहे हैं",
    flyingFrom: "कहाँ से उड़ान",
    travelDate: "यात्रा की तिथि",
    guestsCabin: "अतिथि और केबिन श्रेणी",
    searchBtn: "खोज",
    destinationPlaceholder: "गंतव्य या होटल का नाम",
    cityAirportPlaceholder: "शहर, हवाई अड्डा या होटल",`,
  fr: `
    searchStaysTravel: "Rechercher des séjours et voyages",
    holidaysDesc: "Vols, séjours, circuits et véhicules haut de gamme sur mesure. Réservez avec des paiements flexibles.",
    hotelsDesc: "Détendez-vous dans des suites de luxe triées sur le volet, des retraites premium sur la plage et des séjours privés primés.",
    flightsDesc: "Réservez des vols premium internationaux avec des paiements flexibles.",
    carsDesc: "Louez des véhicules privés haut de gamme dans le monde entier.",
    goingTo: "Destination",
    flyingFrom: "Départ",
    travelDate: "Date de voyage",
    guestsCabin: "Passagers & Classe",
    searchBtn: "Rechercher",
    destinationPlaceholder: "Destination ou nom de l'hôtel",
    cityAirportPlaceholder: "Ville, aéroport ou hôtel",`,
  nl: `
    searchStaysTravel: "Zoek verblijven & reizen",
    holidaysDesc: "Op maat gemaakte vluchten, verblijven, tours en premium voertuigen. Boek met flexibele betalingen.",
    hotelsDesc: "Ontspan in zorgvuldig geselecteerde luxe suites, premium strandretraites en bekroonde privéverblijven.",
    flightsDesc: "Boek wereldwijde premium vluchten met flexibele betalingen.",
    carsDesc: "Huur wereldwijd premium privévoertuigen.",
    goingTo: "Bestemming",
    flyingFrom: "Vertrek vanaf",
    travelDate: "Reisdatum",
    guestsCabin: "Gasten & Klasse",
    searchBtn: "Zoeken",
    destinationPlaceholder: "Bestemming of hotelnaam",
    cityAirportPlaceholder: "Stad, luchthaven of hotel",`,
  ru: `
    searchStaysTravel: "Поиск жилья и поездок",
    holidaysDesc: "Индивидуальные рейсы, проживание, туры и автомобили премиум-класса. Бронируйте с гибкой оплатой.",
    hotelsDesc: "Отдохните в тщательно отобранных роскошных люксах, премиальных пляжных отелях и отмеченных наградами частных домах.",
    flightsDesc: "Бронируйте авиабилеты премиум-класса по всему миру с гибкой оплатой.",
    carsDesc: "Арендуйте премиальные частные автомобили по всему миру.",
    goingTo: "Куда",
    flyingFrom: "Откуда",
    travelDate: "Дата поездки",
    guestsCabin: "Гости и класс",
    searchBtn: "Найти",
    destinationPlaceholder: "Пункт назначения или отель",
    cityAirportPlaceholder: "Город, аэропорт или отель",`
};

for (const lang of Object.keys(additions)) {
  const parts = content.split(new RegExp('^\\s*' + lang + ':\\s*\\{', 'm'));
  if (parts.length > 1) {
    const endIdx = parts[1].indexOf('\n  },');
    if (endIdx !== -1) {
      const block = parts[1].substring(0, endIdx);
      if (!block.includes('holidaysDesc')) {
        parts[1] = block + additions[lang] + parts[1].substring(endIdx);
        content = parts.join('\n  ' + lang + ': {');
        console.log('Patched', lang);
      }
    }
  }
}

fs.writeFileSync(file, content);
