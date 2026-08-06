const fs = require('fs');
const path = './src/locales/nl.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const fixes = {
  "Premier Tour Booking was established in 2018 with a humble, powerful vision: to take the complexity out of custom international travel. What began as a local boutique consultation firm has matured into a comprehensive digital portal servicing over 120,000 satisfied passengers globally.": "Premier Tour Booking is in 2018 opgericht met een bescheiden maar krachtige visie: het wegnemen van de complexiteit van internationale reizen op maat. Wat begon als een lokaal boetiekadviesbureau is uitgegroeid tot een uitgebreid digitaal portaal dat wereldwijd meer dan 120.000 tevreden passagiers bedient.",
  "We specialize in bridging flights, bespoke hotel partnerships, guided adventures, and premium vehicle fleets into cohesive, flexible itineraries. By bypassing traditional middlemen, we are able to maintain a premium standard of services while extending best-in-market rates directly to our travelers.": "Wij zijn gespecialiseerd in het samenvoegen van vluchten, op maat gemaakte hotelpartnerschappen, begeleide avonturen en premium wagenparken tot samenhangende, flexibele reisroutes. Door traditionele tussenpersonen te omzeilen, kunnen we een premium servicestandaard handhaven en tegelijkertijd de beste markttarieven rechtstreeks aan onze reizigers aanbieden.",
  "Trusted Experience": "Vertrouwde Ervaring",
  "Over 8 years of continuous booking experience, verified tour experts, and ATOL/ABTA protected travel networks.": "Ruim 8 jaar onafgebroken boekingservaring, geverifieerde tourexperts en ATOL/ABTA-beschermde reisnetwerken.",
  "Best Price Guarantee": "Beste Prijsgarantie",
  "Direct relationships with hoteliers and global flight networks let us match and beat any competitor pricing.": "Dankzij directe relaties met hoteliers en wereldwijde vluchtnetwerken kunnen wij elke concurrentieprijs evenaren en verslaan.",
  "24/7 Live Support": "24/7 Live Ondersteuning",
  "Immediate concierge support in London, Dubai, and Singapore to handle cancellations or re-routing instantly.": "Directe conciërge-ondersteuning in Londen, Dubai en Singapore om annuleringen of omboekingen direct af te handelen.",
  "Global Network": "Wereldwijd Netwerk",
  "Connecting 45 countries with local vehicle rental pickup counters and luxury resort options.": "Verbindt 45 landen met lokale afhaalbalies voor autoverhuur en luxe resortopties."
};

for (const key in fixes) {
  data[key] = fixes[key];
}

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log('Fixed NL translations');
