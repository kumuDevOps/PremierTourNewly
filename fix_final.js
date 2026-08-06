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
  },
  "Savor world-class culinary experiences infused with local spices.": {
    hi: "स्थानीय मसालों से युक्त विश्व स्तरीय पाक अनुभवों का स्वाद लें।",
    fr: "Savourez des expériences culinaires de classe mondiale imprégnées d'épices locales.",
    de: "Genießen Sie erstklassige kulinarische Erlebnisse mit lokalen Gewürzen.",
    nl: "Geniet van culinaire ervaringen van wereldklasse, doordrenkt met lokale kruiden.",
    ru: "Насладитесь кулинарными изысками мирового класса с местными специями.",
    ja: "地元のスパイスを使った世界最高峰の料理をお楽しみください。",
    zh: "品尝融入当地香料的世界级美食体验。",
    ar: "تذوق تجارب الطهي العالمية المليئة بالتوابل المحلية.",
    es: "Saboree experiencias culinarias de clase mundial con especias locales.",
    pt: "Saboreie experiências culinárias de classe mundial infundidas com especias locais."
  },
  "LKR (Sri Lankan Rupee). High-end spots accept USD.": {
    hi: "LKR (श्रीलंकाई रुपया)। उच्च-स्तरीय स्थान USD स्वीकार करते हैं।",
    fr: "LKR (Roupie sri lankaise). Les lieux haut de gamme acceptent les USD.",
    de: "LKR (Sri-Lanka-Rupie). Gehobene Orte akzeptieren USD.",
    nl: "LKR (Sri Lankaanse roepie). Luxe plekken accepteren USD.",
    ru: "LKR (Шри-ланкийская рупия). Престижные места принимают доллары США.",
    ja: "LKR (スリランカルピー)。高級店ではUSDも利用可能です。",
    zh: "LKR（斯里兰卡卢比）。高档场所接受美元。",
    ar: "روبية سريلانكية (LKR). الأماكن الراقية تقبل الدولار الأمريكي.",
    es: "LKR (Rupia de Sri Lanka). Los lugares exclusivos aceptan USD.",
    pt: "LKR (Rupia do Sri Lanka). Locais sofisticados aceitam USD."
  },
  "For exclusive deals, tailored holiday packages, and the best of the Premier Tour Booking portfolio, add your email below.": {
    hi: "विशेष ऑफ़र, अनुकूलित अवकाश पैकेज और प्रीमियर टूर बुकिंग के बेहतरीन पोर्टफोलियो के लिए, नीचे अपना ईमेल जोड़ें।",
    fr: "Pour des offres exclusives, des forfaits de vacances sur mesure et le meilleur du portefeuille Premier Tour Booking, ajoutez votre e-mail ci-dessous.",
    de: "Für exklusive Angebote, maßgeschneiderte Urlaubspakete und das Beste aus dem Premier Tour Booking Portfolio tragen Sie unten Ihre E-Mail-Adresse ein.",
    nl: "Voer hieronder uw e-mailadres in voor exclusieve aanbiedingen, op maat gemaakte vakantiepakketten en het beste van het Premier Tour Booking-portfolio.",
    ru: "Чтобы получать эксклюзивные предложения, индивидуальные турпакеты и лучшее из портфолио Premier Tour Booking, укажите свой адрес электронной почты ниже.",
    ja: "限定特典、オーダーメイドの休暇パッケージ、プレミア・ツアー・ブッキングの最高のポートフォリオについては、以下にメールアドレスを追加してください。",
    zh: "如需获取独家优惠、定制的度假套餐以及顶级旅游预订组合的精华，请在下面添加您的电子邮件。",
    ar: "للحصول على صفقات حصرية وباقات عطلات مصممة خصيصًا وأفضل ما في محفظة Premier Tour Booking، أضف بريدك الإلكتروني أدناه.",
    es: "Para ofertas exclusivas, paquetes de vacaciones a medida y lo mejor del portafolio de Premier Tour Booking, agregue su correo electrónico a continuación.",
    pt: "Para ofertas exclusivas, pacotes de férias sob medida e o melhor do portfólio da Premier Tour Booking, adicione seu e-mail abaixo."
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
    console.log(`Updated ${lang}.json`);
  }
});
