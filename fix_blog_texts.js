const fs = require('fs');
const missingKeys = {
  "DISCOVER SRI LANKA": {
    hi: "श्रीलंका की खोज करें", fr: "DÉCOUVREZ LE SRI LANKA", de: "ENTDECKEN SIE SRI LANKA", nl: "ONTDEK SRI LANKA",
    ru: "ОТКРОЙТЕ ДЛЯ СЕБЯ ШРИ-ЛАНКУ", ja: "スリランカを発見", zh: "发现斯里兰卡", ar: "اكتشف سريلانكا", es: "DESCUBRE SRI LANKA", pt: "DESCUBRA O SRI LANKA"
  },
  "TRAVEL EXPERIENCES": {
    hi: "यात्रा अनुभव", fr: "EXPÉRIENCES DE VOYAGE", de: "REISEERLEBNISSE", nl: "REISERVARINGEN",
    ru: "ВПЕЧАТЛЕНИЯ ОТ ПУТЕШЕСТВИЙ", ja: "旅行体験", zh: "旅行体验", ar: "تجارب السفر", es: "EXPERIENCIAS DE VIAJE", pt: "EXPERIÊNCIAS DE VIAGEM"
  },
  "& INSIGHTS": {
    hi: "और अंतर्दृष्टि", fr: "& PERSPECTIVES", de: "& EINBLICKE", nl: "& INZICHTEN",
    ru: "& ИДЕИ", ja: "＆洞察", zh: "和见解", ar: "ورؤى", es: "& PERSPECTIVAS", pt: "& INSIGHTS"
  },
  "From pristine beaches to misty tea plantations. Dive deep into the heart of Sri Lanka with our expert-curated travel guides, cultural insights, and hidden gems.": {
    hi: "प्राचीन समुद्र तटों से लेकर धुंधले चाय बागानों तक। हमारे विशेषज्ञ द्वारा तैयार किए गए यात्रा गाइड, सांस्कृतिक अंतर्दृष्टि और छिपे हुए रत्नों के साथ श्रीलंका के दिल में गहराई से गोता लगाएँ।",
    fr: "Des plages immaculées aux plantations de thé brumeuses. Plongez au cœur du Sri Lanka avec nos guides de voyage sélectionnés par des experts, nos aperçus culturels et nos trésors cachés.",
    de: "Von unberührten Stränden bis zu nebligen Teeplantagen. Tauchen Sie tief in das Herz von Sri Lanka ein mit unseren von Experten zusammengestellten Reiseführern, kulturellen Einblicken und versteckten Schätzen.",
    nl: "Van ongerepte stranden tot mistige theeplantages. Duik diep in het hart van Sri Lanka met onze door experts samengestelde reisgidsen, culturele inzichten en verborgen juweeltjes.",
    ru: "От нетронутых пляжей до туманных чайных плантаций. Погрузитесь в самое сердце Шри-Ланки с нашими туристическими путеводителями, культурными знаниями и скрытыми жемчужинами от экспертов.",
    ja: "手つかずのビーチから霧に包まれた茶畑まで。専門家が厳選した旅行ガイド、文化的な洞察、隠れた名所で、スリランカの中心部に深く飛び込みましょう。",
    zh: "从原始的海滩到迷雾笼罩的茶园。跟随我们专家精心策划的旅游指南、文化见解和隐藏的瑰宝，深入斯里兰卡的中心。",
    ar: "من الشواطئ البكر إلى مزارع الشاي الضبابية. تعمق في قلب سريلانكا مع أدلة السفر التي أعدها خبراؤنا والرؤى الثقافية والجواهر الخفية.",
    es: "Desde playas vírgenes hasta brumosas plantaciones de té. Sumérgete en el corazón de Sri Lanka con nuestras guías de viaje seleccionadas por expertos, conocimientos culturales y gemas ocultas.",
    pt: "De praias intocadas a plantações de chá enevoadas. Mergulhe fundo no coração do Sri Lanka com nossos guias de viagem selecionados por especialistas, percepções culturais e joias escondidas."
  },
  "Curated": {
    hi: "चयनित", fr: "Sélectionné", de: "Kuratierte", nl: "Samengesteld",
    ru: "Кураторский", ja: "厳選", zh: "精选", ar: "مختارة", es: "Seleccionado", pt: "Selecionado"
  },
  "Editor's": {
    hi: "संपादक की", fr: "De l'éditeur", de: "Des Herausgebers", nl: "Van de redacteur",
    ru: "Редактора", ja: "編集者の", zh: "编辑的", ar: "المحرر", es: "Del editor", pt: "Do editor"
  },
  "Picks": {
    hi: "पसंद", fr: "Choix", de: "Auswahl", nl: "Keuzes",
    ru: "Выбор", ja: "ピック", zh: "选择", ar: "اختيارات", es: "Selecciones", pt: "Escolhas"
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
    console.log(`Fixed blog texts ${lang}.json`);
  }
});
