const fs = require('fs');

const missingKeys = {
  "Rent premium cars, vans, SUVs, and tourist buses with experienced English-speaking drivers. Fuel, highway tolls, and full insurance included.": {
    hi: "अनुभवी अंग्रेजी बोलने वाले ड्राइवरों के साथ प्रीमियम कार, वैन, एसयूवी और पर्यटक बसें किराए पर लें। ईंधन, राजमार्ग टोल और पूर्ण बीमा शामिल है।",
    fr: "Louez des voitures haut de gamme, des fourgonnettes, des SUV et des bus touristiques avec des chauffeurs anglophones expérimentés. Carburant, péages autoroutiers et assurance complète inclus.",
    de: "Mieten Sie Premium-Autos, Vans, SUVs und Touristenbusse mit erfahrenen englischsprachigen Fahrern. Treibstoff, Autobahngebühren und Vollkaskoversicherung inklusive.",
    nl: "Huur premium auto's, busjes, SUV's en toeristenbussen met ervaren Engelssprekende chauffeurs. Brandstof, tol op de snelweg en volledige verzekering inbegrepen.",
    ru: "Арендуйте автомобили премиум-класса, фургоны, внедорожники и туристические автобусы с опытными англоговорящими водителями. Топливо, дорожные сборы и полная страховка включены.",
    ja: "経験豊富な英語を話す運転手付きの高級車、バン、SUV、観光バスをレンタルします。燃料、高速道路料金、完全な保険が含まれています。",
    zh: "租用高级轿车、面包车、SUV 和旅游巴士，配备经验丰富的英语司机。包括燃油、高速公路通行费和全额保险。",
    ar: "استأجر سيارات فاخرة، وشاحنات صغيرة، وسيارات دفع رباعي، وحافلات سياحية مع سائقين ذوي خبرة يتحدثون الإنجليزية. شامل الوقود ورسوم الطرق السريعة والتأمين الشامل.",
    es: "Alquile autos premium, camionetas, SUV y autobuses turísticos con conductores experimentados que hablan inglés. Combustible, peajes y seguro a todo riesgo incluidos.",
    pt: "Alugue carros premium, vans, SUVs e ônibus de turismo com motoristas experientes que falam inglês. Combustível, pedágios rodoviários e seguro total incluídos."
  }
};

const langs = ['hi', 'fr', 'de', 'nl', 'ru', 'ja', 'zh', 'ar', 'es', 'pt'];
langs.forEach(lang => {
  const path = `src/locales/${lang}.json`;
  if (fs.existsSync(path)) {
    const data = JSON.parse(fs.readFileSync(path, 'utf8'));
    for (const [key, transMap] of Object.entries(missingKeys)) {
      if (transMap[lang]) {
        data[key] = transMap[lang];
      }
    }
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
    console.log(`Fixed ${lang}.json`);
  }
});
