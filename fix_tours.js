const fs = require('fs');

const missingTours = {
  "Climb the ancient 5th-century Sigiriya Rock Fortress (UNESCO World Heritage) and explore the sacred Dambulla Cave Temple complex featuring over 150 Buddha statues.": {
    zh: "攀登建于公元 5 世纪的古老锡吉里耶狮子岩堡垒（联合国教科文组织世界遗产），并探索拥有 150 多尊佛像的神圣丹布勒石窟寺庙群。",
    ja: "5世紀の古代シギリヤロック（ユネスコ世界遺産）に登り、150体以上の仏像がある神聖なダンブッラ石窟寺院を探索します。",
    de: "Besteigen Sie die antike Sigiriya-Felsenfestung aus dem 5. Jahrhundert (UNESCO-Weltkulturerbe) und erkunden Sie den heiligen Dambulla-Höhlentempelkomplex mit über 150 Buddha-Statuen.",
    fr: "Escaladez l'ancienne forteresse rocheuse de Sigiriya du 5ème siècle (site du patrimoine mondial de l'UNESCO) et explorez le complexe du temple de la grotte sacrée de Dambulla comprenant plus de 150 statues de Bouddha.",
    nl: "Beklim het oude 5e-eeuwse Sigiriya-rotsfort (UNESCO-werelderfgoed) en verken het heilige Dambulla-grottempelcomplex met meer dan 150 Boeddhabeelden.",
    ru: "Поднимитесь на древнюю скальную крепость Сигирия 5-го века (Всемирное наследие ЮНЕСКО) и исследуйте священный комплекс пещерных храмов Дамбулла, где находится более 150 статуй Будды.",
    hi: "प्राचीन 5वीं सदी के सिगिरिया रॉक किले (यूनेस्को विश्व धरोहर) पर चढ़ें और 150 से अधिक बुद्ध मूर्तियों वाले पवित्र दांबुला गुफा मंदिर परिसर का अन्वेषण करें।",
    ar: "تسلق قلعة صخرة سيجيريا القديمة من القرن الخامس (موقع التراث العالمي لليونسكو) واستكشف مجمع معبد كهف دامبولا المقدس الذي يضم أكثر من 150 تمثالًا لبوذا."
  },
  "Experience the world-famous blue train ride through lush tea plantations, marvel at Nine Arch Bridge, and hike Little Adam's Peak.": {
    zh: "体验举世闻名的蓝色火车之旅，穿梭于郁郁葱葱的茶园之中，惊叹于九拱桥的壮丽，并徒步攀登小亚当峰。",
    ja: "緑豊かな茶畑を抜ける世界的に有名な青い列車の旅を体験し、ナインアーチブリッジに驚嘆し、リトルアダムスピークをハイキングします。",
    de: "Erleben Sie die weltberühmte blaue Zugfahrt durch üppige Teeplantagen, bewundern Sie die Nine Arch Bridge und wandern Sie auf den Little Adam's Peak.",
    fr: "Découvrez le célèbre trajet en train bleu à travers des plantations de thé luxuriantes, émerveillez-vous devant le pont aux neuf arches et faites de la randonnée jusqu'au petit pic d'Adam.",
    nl: "Ervaar de wereldberoemde blauwe treinrit door weelderige theeplantages, bewonder de Nine Arch Bridge en wandel naar Little Adam's Peak.",
    ru: "Совершите всемирно известную поездку на синем поезде через пышные чайные плантации, полюбуйтесь Девятиарочным мостом и отправьтесь в поход на Малый пик Адама.",
    hi: "हरे-भरे चाय बागानों के माध्यम से विश्व प्रसिद्ध नीली ट्रेन की सवारी का अनुभव करें, नाइन आर्च ब्रिज पर अचंभा करें, और लिटिल एडम्स पीक पर चढ़ें।",
    ar: "استمتع بركوب القطار الأزرق الشهير عالميًا عبر مزارع الشاي الخصبة، وتأمل في جسر الأقواس التسعة، وتنزه سيرًا على الأقدام في قمة آدم الصغيرة."
  },
  "Embark on an exciting 4x4 Jeep Safari in Yala, world-renowned for highest leopard density, wild elephants, sloth bears, and exotic birds.": {
    zh: "在雅拉开启一场刺激的 4x4 吉普车狩猎之旅，这里以世界上豹子密度最高而闻名，还能看到野生大象、懒熊和珍稀鸟类。",
    ja: "世界で最もヒョウの生息密度が高いことで有名なヤーラで、エキサイティングな4WDジープサファリに出発し、野生のゾウ、ナマケグマ、エキゾチックな鳥を観察します。",
    de: "Begeben Sie sich auf eine aufregende 4x4 Jeep Safari in Yala, das weltweit für die höchste Leopardendichte, wilde Elefanten, Lippenbären und exotische Vögel bekannt ist.",
    fr: "Embarquez pour un safari en jeep 4x4 passionnant à Yala, de renommée mondiale pour la plus forte densité de léopards, des éléphants sauvages, des ours paresseux et des oiseaux exotiques.",
    nl: "Maak een spannende 4x4 jeepsafari in Yala, wereldberoemd om de hoogste dichtheid van luipaarden, wilde olifanten, lippenberen en exotische vogels.",
    ru: "Отправьтесь на захватывающее сафари на джипах 4x4 в Яле, всемирно известной самой высокой плотностью леопардов, дикими слонами, медведями-губачами и экзотическими птицами.",
    hi: "याला में एक रोमांचक 4x4 जीप सफारी पर निकलें, जो उच्चतम तेंदुए के घनत्व, जंगली हाथियों, सुस्त भालू और विदेशी पक्षियों के लिए विश्व प्रसिद्ध है।",
    ar: "انطلق في رحلة سفاري مثيرة بسيارات الدفع الرباعي في يالا، المشهورة عالميًا بأعلى كثافة للفهود والفيلة البرية والدببة الكسلانة والطيور الغريبة."
  },
  "Sail into the Indian Ocean to spot Blue Whales and Dolphins, followed by a sunset walking tour of 16th-century Portuguese Galle Fort.": {
    zh: "驶入印度洋观赏蓝鲸和海豚，然后在日落时分漫步游览建于 16 世纪的葡萄牙加勒堡。",
    ja: "インド洋に船出してシロナガスクジラやイルカを探し、その後、16世紀のポルトガルのガレ要塞のサンセットウォーキングツアーに参加します。",
    de: "Segeln Sie in den Indischen Ozean, um Blauwale und Delfine zu beobachten, gefolgt von einem Spaziergang bei Sonnenuntergang durch das portugiesische Galle Fort aus dem 16. Jahrhundert.",
    fr: "Naviguez dans l'océan Indien pour apercevoir des baleines bleues et des dauphins, suivi d'une visite à pied au coucher du soleil du fort portugais de Galle du 16ème siècle.",
    nl: "Vaar de Indische Oceaan in om blauwe vinvissen en dolfijnen te spotten, gevolgd door een wandeltocht bij zonsondergang door het 16e-eeuwse Portugese fort Galle.",
    ru: "Отправьтесь в Индийский океан, чтобы увидеть синих китов и дельфинов, а затем совершите пешеходную экскурсию на закате по португальскому форту Галле 16-го века.",
    hi: "ब्लू व्हेल और डॉल्फ़िन देखने के लिए हिंद महासागर में नौकायन करें, उसके बाद 16वीं सदी के पुर्तगाली गॉल किले के सूर्यास्त वॉकिंग टूर पर जाएँ।",
    ar: "أبحر في المحيط الهندي لمشاهدة الحيتان الزرقاء والدلافين، تليها جولة مشي عند غروب الشمس في قلعة جالي البرتغالية التي تعود للقرن السادس عشر."
  },
  "Comprehensive week-long journey through Sri Lanka's ancient royal kingdoms, sacred temples, and UNESCO world heritage sites.": {
    zh: "为期一周的全方位旅程，带您领略斯里兰卡古老的皇家王国、神圣的寺庙以及众多联合国教科文组织世界遗产。",
    ja: "スリランカの古代王朝、神聖な寺院、ユネスコ世界遺産を巡る充実した1週間の旅。",
    de: "Umfassende einwöchige Reise durch Sri Lankas antike königliche Königreiche, heilige Tempel und UNESCO-Weltkulturerbestätten.",
    fr: "Voyage complet d'une semaine à travers les anciens royaumes royaux du Sri Lanka, ses temples sacrés et ses sites classés au patrimoine mondial de l'UNESCO.",
    nl: "Uitgebreide reis van een week door de oude koninklijke koninkrijken, heilige tempels en UNESCO-werelderfgoedlocaties van Sri Lanka.",
    ru: "Комплексное недельное путешествие по древним королевствам Шри-Ланки, священным храмам и объектам всемирного наследия ЮНЕСКО.",
    hi: "श्रीलंका के प्राचीन शाही राज्यों, पवित्र मंदिरों और यूनेस्को विश्व धरोहर स्थलों के माध्यम से एक सप्ताह की व्यापक यात्रा।",
    ar: "رحلة شاملة لمدة أسبوع عبر ممالك سريلانكا الملكية القديمة والمعابد المقدسة ومواقع التراث العالمي لليونسكو."
  }
};

const locales = ["en", "de", "fr", "nl", "ja", "zh", "ru", "hi", "ar"];

locales.forEach(lang => {
  const filePath = `src/locales/${lang}.json`;
  if (fs.existsSync(filePath)) {
    const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    for (const [key, langMap] of Object.entries(missingTours)) {
      if (lang === 'en') {
        json[key] = key;
      } else if (langMap[lang]) {
        json[key] = langMap[lang];
      }
    }
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
  }
});
console.log('Fixed tours!');
