const fs = require('fs');

const missingKeys = {
  "Experience luxury in the heart of Colombo with world-class dining and amenities.": {
    hi: "विश्व स्तरीय भोजन और सुविधाओं के साथ कोलंबो के केंद्र में लक्जरी का अनुभव करें।",
    fr: "Vivez le luxe au cœur de Colombo avec une restauration et des équipements de classe mondiale.",
    de: "Erleben Sie Luxus im Herzen von Colombo mit erstklassigen Restaurants und Annehmlichkeiten.",
    nl: "Ervaar luxe in het hart van Colombo met dineren en voorzieningen van wereldklasse.",
    ru: "Ощутите роскошь в самом сердце Коломбо с первоклассными ресторанами и удобствами.",
    ja: "コロンボの中心部で、ワールドクラスのダイニングとアメニティを備えたラグジュアリーなひとときを。",
    zh: "在科伦坡市中心体验奢华，享受世界一流的餐饮和设施。",
    ar: "جرب الفخامة في قلب كولومبو مع تناول الطعام والمرافق ذات المستوى العالمي.",
    es: "Experimente el lujo en el corazón de Colombo con restaurantes y comodidades de clase mundial.",
    pt: "Experimente o luxo no coração de Colombo com restaurantes e comodidades de classe mundial."
  },
  "An eco-hotel designed by Geoffrey Bawa, blending seamlessly into the lush jungle.": {
    hi: "जेफ्री बावा द्वारा डिजाइन किया गया एक इको-होटल, जो हरे-भरे जंगल में मूल रूप से मिश्रित होता है।",
    fr: "Un éco-hôtel conçu par Geoffrey Bawa, se fondant parfaitement dans la jungle luxuriante.",
    de: "Ein Öko-Hotel, entworfen von Geoffrey Bawa, das sich nahtlos in den üppigen Dschungel einfügt.",
    nl: "Een eco-hotel ontworpen door Geoffrey Bawa, dat naadloos overgaat in de weelderige jungle.",
    ru: "Эко-отель, спроектированный Джеффри Бавой, плавно вписывающийся в пышные джунгли.",
    ja: "ジェフリー・バワが設計したエコホテルで、緑豊かなジャングルにシームレスに溶け込んでいます。",
    zh: "由杰弗里·巴瓦设计的环保酒店，无缝融入茂密的丛林中。",
    ar: "فندق بيئي صممه جيفري باوا، يمتزج بسلاسة مع الغابة المورقة.",
    es: "Un eco-hotel diseñado por Geoffrey Bawa, que se integra perfectamente en la exuberante jungla.",
    pt: "Um hotel ecológico projetado por Geoffrey Bawa, misturando-se perfeitamente à selva exuberante."
  },
  "A sprawling luxury resort on the southern coast offering endless activities and relaxation.": {
    hi: "दक्षिणी तट पर एक विशाल लक्जरी रिसॉर्ट जो अंतहीन गतिविधियों और विश्राम की पेशकश करता है।",
    fr: "Un vaste complexe de luxe sur la côte sud offrant des activités et une détente infinies.",
    de: "Ein weitläufiges Luxusresort an der Südküste, das endlose Aktivitäten und Entspannung bietet.",
    nl: "Een uitgestrekt luxe resort aan de zuidkust met eindeloze activiteiten en ontspanning.",
    ru: "Обширный роскошный курорт на южном побережье, предлагающий бесконечные развлечения и отдых.",
    ja: "南海岸にある広大なラグジュアリーリゾートで、無限のアクティビティとリラクゼーションを提供します。",
    zh: "位于南部海岸的广阔豪华度假村，提供无尽的活动和放松。",
    ar: "منتجع فاخر مترامي الأطراف على الساحل الجنوبي يقدم أنشطة لا حصر لها واسترخاء.",
    es: "Un extenso complejo de lujo en la costa sur que ofrece infinitas actividades y relajación.",
    pt: "Um extenso resort de luxo na costa sul oferecendo infinitas atividades e relaxamento."
  },
  "Breathtaking views of the Indian Ocean with world-class hospitality.": {
    hi: "विश्व स्तरीय आतिथ्य के साथ हिंद महासागर के लुभावने दृश्य।",
    fr: "Des vues imprenables sur l'océan Indien avec une hospitalité de classe mondiale.",
    de: "Atemberaubende Ausblicke auf den Indischen Ozean mit erstklassiger Gastfreundschaft.",
    nl: "Adembenemend uitzicht op de Indische Oceaan met gastvrijheid van wereldklasse.",
    ru: "Захватывающий вид на Индийский океан и первоклассное гостеприимство.",
    ja: "ワールドクラスのホスピタリティを備えたインド洋の息を呑むような景色。",
    zh: "令人惊叹的印度洋全景和世界一流的热情款待。",
    ar: "إطلالات خلابة على المحيط الهندي مع ضيافة ذات مستوى عالمي.",
    es: "Impresionantes vistas del Océano Índico con una hospitalidad de clase mundial.",
    pt: "Vistas deslumbrantes do Oceano Índico com hospitalidade de classe mundial."
  },
  "Elegant mountain retreat in Sri Lanka's hill country with cool weather and scenic landscapes.": {
    hi: "ठंडे मौसम और प्राकृतिक परिदृश्य के साथ श्रीलंका के पहाड़ी देश में सुरुचिपूर्ण पहाड़ी वापसी।",
    fr: "Retraite élégante à la montagne dans la région des collines du Sri Lanka avec un temps frais et des paysages pittoresques.",
    de: "Eleganter Bergurlaub im srilankischen Hügelland mit kühlem Wetter und malerischen Landschaften.",
    nl: "Elegante toevluchtsoord in de bergen in het heuvelland van Sri Lanka met koel weer en schilderachtige landschappen.",
    ru: "Элегантный горный курорт в холмистой местности Шри-Ланки с прохладной погодой и живописными пейзажами.",
    ja: "涼しい気候と風光明媚な景色を楽しめる、スリランカの丘陵地帯にあるエレガントな山の隠れ家。",
    zh: "斯里兰卡山区优雅的山间度假胜地，气候凉爽，风景如画。",
    ar: "ملاذ جبلي أنيق في التلال السريلانكية مع طقس بارد ومناظر خلابة.",
    es: "Elegante refugio de montaña en la región montañosa de Sri Lanka con clima fresco y paisajes pintorescos.",
    pt: "Elegante refúgio de montanha na região montanhosa do Sri Lanka com clima frio e paisagens pitorescas."
  },
  "Boutique luxury hotel with breathtaking views of Sigiriya Rock Fortress and tranquil surroundings.": {
    hi: "सिगिरिया रॉक किले और शांत परिवेश के लुभावने दृश्यों के साथ बुटीक लक्जरी होटल।",
    fr: "Hôtel-boutique de luxe avec une vue imprenable sur la forteresse rocheuse de Sigiriya et un cadre tranquille.",
    de: "Boutique-Luxushotel mit atemberaubendem Blick auf die Felsenfestung Sigiriya und ruhiger Umgebung.",
    nl: "Boetiek luxe hotel met een adembenemend uitzicht op het Sigiriya Rock Fortress en een rustige omgeving.",
    ru: "Бутик-отель класса люкс с захватывающим видом на скальную крепость Сигирия и спокойные окрестности.",
    ja: "シギリヤ・ロック要塞の息をのむような絶景と静かな環境を楽しめるブティックラグジュアリーホテル。",
    zh: "这家精品豪华酒店享有锡吉里耶狮子岩的壮丽景色，环境宁静。",
    ar: "فندق بوتيك فاخر يتمتع بإطلالات خلابة على قلعة سيجيريا الصخرية والمناطق المحيطة الهادئة.",
    es: "Hotel boutique de lujo con impresionantes vistas a la fortaleza de roca de Sigiriya y un entorno tranquilo.",
    pt: "Hotel boutique de luxo com vistas deslumbrantes da Fortaleza de Rocha de Sigiriya e arredores tranquilos."
  },
  "REGISTER PROPERTY": {
    hi: "संपत्ति पंजीकृत करें", fr: "ENREGISTRER LA PROPRIÉTÉ", de: "UNTERKUNFT REGISTRIEREN", nl: "REGISTREER EIGENDOM",
    ru: "РЕГИСТРАЦИЯ СОБСТВЕННОСТИ", ja: "宿泊施設を登録", zh: "注册物业", ar: "تسجيل العقار", es: "REGISTRAR PROPIEDAD", pt: "REGISTRAR PROPRIEDADE"
  },
  "List View": {
    hi: "सूची दृश्य", fr: "Vue en liste", de: "Listenansicht", nl: "Lijstweergave",
    ru: "Вид списком", ja: "リスト表示", zh: "列表视图", ar: "عرض القائمة", es: "Vista de lista", pt: "Exibição de lista"
  },
  "Map View": {
    hi: "मानचित्र दृश्य", fr: "Vue carte", de: "Kartenansicht", nl: "Kaartweergave",
    ru: "Вид карты", ja: "地図表示", zh: "地图视图", ar: "عرض الخريطة", es: "Vista de mapa", pt: "Exibição de mapa"
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
    console.log(`Fixed hotel texts in ${lang}.json`);
  }
});
