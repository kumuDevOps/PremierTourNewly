const fs = require('fs');
const path = require('path');

const masterEnPath = path.join(__dirname, '../src/locales/en.json');
const masterEn = JSON.parse(fs.readFileSync(masterEnPath, 'utf8'));

const fixMap = {
  de: {
    "Administrator": "Administrator",
    "All-inclusive transparent pricing upfront.": "All-inclusive, transparente Preise im Voraus.",
    "August 2026": "August 2026",
    "BUY E-SIM": "E-SIM KAUFEN",
    "Baggage Allowances": "Gepäckbestimmungen",
    "Bank of Ceylon (BOC Online)": "Bank of Ceylon (BOC Online)",
    "Boutique": "Boutique",
    "Budget / Tuk Tuk": "Budget / Tuk-Tuk",
    "Budget:": "Budget:",
    "CVC": "CVC",
    "DROP-OFF LOCATION": "ABGABEORT",
    "E-Ticket": "E-Ticket",
    "Enter reset token": "Rücksetz-Token eingeben",
    "Export": "Exportieren",
    "Flight Number or Arrival Notes (Optional)": "Flugnummer oder Ankunftshinweise (Optional)",
    "Forecast": "Wettervorhersage",
    "FriMi Digital Banking": "FriMi Digital Banking",
    "Google Map": "Google Map",
    "Google Pay": "Google Pay",
    "HIGHLIGHTS": "HIGHLIGHTS",
    "Hatton National Bank (HNB SOLO)": "Hatton National Bank (HNB SOLO)",
    "Hotels": "Hotels",
    "Hotline": "Hotline",
    "Optional": "Optional",
    "Passwords do not match.": "Passwörter stimmen nicht überein.",
    "PayPal Express": "PayPal Express",
    "Premier Digital Colombo Google Map": "Premier Digital Colombo Google Map",
    "Real-time Chauffeur Telematics": "Echtzeit-Chauffeur-Telematik",
    "Regain secure access to your member profile": "Sichern Sie sich wieder den Zugriff auf Ihr Mitgliedsprofil",
    "Resort & Spa": "Resort & Spa",
    "Route:": "Route:",
    "SUV": "SUV",
    "Sending...": "Wird gesendet...",
    "Solo & Wellness": "Solo & Wellness",
    "Spa": "Spa",
    "Spa & Wellness": "Spa & Wellness",
    "Sri Lanka Currency & Foreign Exchange": "Sri Lanka Währung & Devisen",
    "Start Exploring Now": "Jetzt erkunden",
    "Status": "Status",
    "Super Admin": "Super-Administrator",
    "Terrain": "Gelände",
    "The email address format is invalid.": "Das E-Mail-Adressformat ist ungültig.",
    "Transport:": "Transport:",
    "Trending Stories": "Angesagte Geschichten",
    "Trustpilot": "Trustpilot",
    "Van": "Van",
    "Websites": "Websites",
    "eZ Cash / mCash Mobile Wallet": "eZ Cash / mCash Mobile Wallet",
    "pax": "Pers."
  },
  fr: {
    "Action": "Action",
    "Boutique": "Boutique",
    "Brochures": "Brochures",
    "Budget / Tuk Tuk": "Budget / Tuk-Tuk",
    "CVC": "CVC",
    "Casino": "Casino",
    "Chauffeur": "Chauffeur",
    "Date": "Date",
    "Destination": "Destination",
    "Distance": "Distance",
    "EXCELLENT": "EXCELLENT",
    "Excellent": "Excellent",
    "Exclusions": "Exclusions",
    "Inclusions": "Inclusions",
    "Inclusions:": "Inclusions :",
    "Message": "Message",
    "Protection": "Protection",
    "Satellite": "Satellite",
    "Spa": "Spa",
    "Terrain": "Terrain",
    "Total": "Total",
    "Transmission": "Transmission",
    "destinationPlaceholder": "Nom de la destination ou de l'hôtel",
    "startDate && currentStr": "Date de début & Sélection"
  },
  nl: {
    "Budget / Tuk Tuk": "Budget / Tuk-tuk",
    "CVC": "CVC",
    "Casino": "Casino",
    "Chauffeur": "Chauffeur",
    "Comfort": "Comfort",
    "Dashboard": "Dashboard",
    "Google Pay": "Google Pay",
    "Hotels": "Hotels",
    "Hotline": "Hotline",
    "PayPal Express": "PayPal Express",
    "Personal shopping, souvenirs & tips": "Persoonlijk winkelen, souvenirs & fooien",
    "Premier": "Premier",
    "SUV": "SUV",
    "Sedan": "Sedan",
    "Spa & Wellness": "Spa & Wellness",
    "Status": "Status",
    "Trustpilot": "Trustpilot",
    "Van": "Bestelwagen",
    "Websites": "Websites",
    "adminPanel": "Beheerderspaneel",
    "dashboard": "Dashboard",
    "hotline": "Hotline",
    "pax": "pers."
  },
  ja: {
    "CVC": "CVC",
    "Google Pay": "Google Pay",
    "SUV": "SUV",
    "startDate && currentStr": "開始日と選択"
  },
  zh: {
    "SUV": "SUV"
  },
  ru: {
    "Google Pay": "Google Pay"
  },
  hi: {
    "dailyDatabaseSnapshot": "दैनिक डेटाबेस स्नैपशॉट"
  },
  ar: {
    "dailyDatabaseSnapshot": "لقطة من قاعدة البيانات اليومية"
  }
};

const langs = ['de', 'fr', 'ar', 'nl', 'ja', 'zh', 'ru', 'hi'];

langs.forEach(lang => {
  const srcPath = path.join(__dirname, `../src/locales/${lang}.json`);
  const pubPath = path.join(__dirname, `../public/locales/${lang}.json`);

  let data = {};
  if (fs.existsSync(srcPath)) {
    data = JSON.parse(fs.readFileSync(srcPath, 'utf8'));
  }

  // Sync all keys from masterEn
  for (const [k, v] of Object.entries(masterEn)) {
    if (!data[k]) {
      data[k] = v;
    }
  }

  // Apply specific fix maps
  if (fixMap[lang]) {
    for (const [k, v] of Object.entries(fixMap[lang])) {
      data[k] = v;
    }
  }

  // Remove any remaining (DE), (FR), etc. suffixes if any
  for (const [k, v] of Object.entries(data)) {
    if (typeof v === 'string') {
      data[k] = v.replace(/\s*\((DE|FR|NL|AR|JA|ZH|RU|HI)\)\s*$/g, '').trim();
    }
  }

  fs.writeFileSync(srcPath, JSON.stringify(data, null, 2), 'utf8');
  fs.writeFileSync(pubPath, JSON.stringify(data, null, 2), 'utf8');

  console.log(`Updated ${lang.toUpperCase()} -> ${Object.keys(data).length} keys.`);
});

console.log('SUCCESSFULLY FIXED ALL LOCALES!');
