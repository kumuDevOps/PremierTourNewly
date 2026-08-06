const fs = require('fs');

const missingKeys = {
  "Dec-Mar for South/West. May-Sep for East.": {
    hi: "दक्षिण/पश्चिम के लिए दिसंबर-मार्च। पूर्व के लिए मई-सितंबर।",
    fr: "Déc-Mar pour le Sud/Ouest. Mai-Sep pour l'Est.",
    de: "Dez-Mär für Süd/West. Mai-Sep für Ost.",
    nl: "Dec-mrt voor Zuid/West. Mei-sep voor Oost.",
    ru: "Дек-мар для юга/запада. Май-сен для востока.",
    ja: "南/西部は12月〜3月。東部は5月〜9月。",
    zh: "南部/西部：12月至3月。东部：5月至9月。",
    ar: "ديسمبر-مارس للجنوب/الغرب. مايو-سبتمبر للشرق.",
    es: "Dic-Mar para el Sur/Oeste. May-Sep para el Este.",
    pt: "Dez-Mar para o Sul/Oeste. Mai-Set para o Leste."
  },
  "Pick up a tourist e-SIM at the airport.": {
    hi: "हवाई अड्डे पर एक पर्यटक ई-सिम लें।",
    fr: "Achetez une e-SIM touristique à l'aéroport.",
    de: "Holen Sie sich eine Touristen-e-SIM am Flughafen.",
    nl: "Koop een toeristen e-SIM op de luchthaven.",
    ru: "Приобретите туристическую e-SIM в аэропорту.",
    ja: "空港で旅行者用e-SIMを入手。",
    zh: "在机场购买游客 e-SIM 卡。",
    ar: "احصل على شريحة إلكترونية سياحية في المطار.",
    es: "Recoja una e-SIM turística en el aeropuerto.",
    pt: "Compre um e-SIM turístico no aeroporto."
  },
  "Private luxury chauffeurs are highly recommended.": {
    hi: "निजी लग्ज़री ड्राइवरों की अत्यधिक अनुशंसा की जाती है।",
    fr: "Les chauffeurs privés de luxe sont fortement recommandés.",
    de: "Private Luxus-Chauffeure werden sehr empfohlen.",
    nl: "Privé luxe chauffeurs worden ten zeerste aanbevolen.",
    ru: "Настоятельно рекомендуются частные роскошные водители.",
    ja: "専属の高級運転手がお勧めです。",
    zh: "强烈建议私人豪华专车司机。",
    ar: "يوصى بشدة باستخدام سائقين خاصين فاخرين.",
    es: "Se recomiendan chóferes privados de lujo.",
    pt: "Motoristas particulares de luxo são altamente recomendados."
  },
  "Very safe for tourists. Standard precautions apply.": {
    hi: "पर्यटकों के लिए बहुत सुरक्षित। मानक सावधानियां लागू होती हैं।",
    fr: "Très sûr pour les touristes. Les précautions standard s'appliquent.",
    de: "Sehr sicher für Touristen. Übliche Vorsichtsmaßnahmen gelten.",
    nl: "Zeer veilig voor toeristen. Standaard voorzorgsmaatregelen zijn van toepassing.",
    ru: "Очень безопасно для туристов. Применяются стандартные меры предосторожности.",
    ja: "観光客にとって非常に安全です。標準的な予防措置が適用されます。",
    zh: "对游客非常安全。适用标准预防措施。",
    ar: "آمن جدا للسياح. تنطبق الاحتياطات القياسية.",
    es: "Muy seguro para los turistas. Se aplican precauciones estándar.",
    pt: "Muito seguro para os turistas. Precauções padrão se aplicam."
  },
  "Sinhala & Tamil. English is widely spoken.": {
    hi: "सिंहली और तमिल। अंग्रेजी व्यापक रूप से बोली जाती है।",
    fr: "Cinghalais & Tamoul. L'anglais est largement parlé.",
    de: "Singhalesisch & Tamil. Englisch ist weit verbreitet.",
    nl: "Singalees & Tamil. Engels wordt veel gesproken.",
    ru: "Сингальский и тамильский. Широко говорят на английском.",
    ja: "シンハラ語とタミル語。英語も広く話されています。",
    zh: "僧伽罗语和泰米尔语。英语广泛使用。",
    ar: "السنهالية والتاميلية. اللغة الإنجليزية يتم التحدث بها على نطاق واسع.",
    es: "Cingalés y tamil. El inglés se habla ampliamente.",
    pt: "Cingalês e tâmil. O inglês é amplamente falado."
  }
};

const langs = ['hi', 'fr', 'de', 'nl', 'ru', 'ja', 'zh', 'ar', 'es', 'pt'];
const fs = require('fs');
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
  }
});
console.log('Fixed missing keys in all languages.');
