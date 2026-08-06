const fs = require('fs');
const path = require('path');

const locales = ['de', 'fr', 'nl', 'ja', 'zh', 'ru', 'hi', 'ar'];

const seedDict = {
  // Hotels
  "Cinnamon Grand Colombo": {
    zh: "科伦坡肉桂大饭店", ja: "シナモン グランド コロンボ", de: "Cinnamon Grand Colombo", fr: "Cinnamon Grand Colombo", nl: "Cinnamon Grand Colombo", ru: "Cinnamon Grand Colombo", hi: "सिनमन ग्रैंड कोलंबो", ar: "سينامون غراند كولومبو"
  },
  "Experience luxury in the heart of Colombo with world-class dining and amenities.": {
    zh: "在科伦坡市中心体验奢华入住，享受世界级的餐饮与设施。",
    ja: "コロンボの中心部で世界クラスのダイニングとアメニティを満喫するラグジュアリー体験。",
    de: "Erleben Sie Luxus im Herzen von Colombo mit erstklassiger Gastronomie und Annehmlichkeiten.",
    fr: "Découvrez le luxe au cœur de Colombo avec une gastronomie et des équipements de classe mondiale.",
    nl: "Ervaar luxe in het hart van Colombo met gastronomie en voorzieningen van wereldklasse.",
    ru: "Испытайте роскошь в самом сердце Коломбо с ресторанами и удобствами мирового класса.",
    hi: "विश्व स्तरीय भोजन और सुविधाओं के साथ कोलंबो के केंद्र में विलासिता का अनुभव करें।",
    ar: "استمتع بالفخامة في قلب كولومبو مع مطاعم ووسائل الراحة ذات المستوى العالمي."
  },
  "Heritance Kandalama": {
    zh: "坎达拉玛遗产酒店", ja: "ヘリタンス カンダラマ", de: "Heritance Kandalama", fr: "Heritance Kandalama", nl: "Heritance Kandalama", ru: "Heritance Kandalama", hi: "हेरिटेंस कंडालामा", ar: "هيريتانس كاندالاما"
  },
  "An eco-hotel designed by Geoffrey Bawa, blending seamlessly into the lush jungle.": {
    zh: "由建筑大师杰弗里·巴瓦设计的生态酒店，完美融入生机勃勃的丛林之中。",
    ja: "ジェフリー・バワが設計した、豊かなジャングルと調和するエコホテル。",
    de: "Ein von Geoffrey Bawa entworfenes Öko-Hotel, das sich nahtlos in den dichten Dschungel einfügt.",
    fr: "Un éco-hôtel conçu par Geoffrey Bawa, s'intégrant parfaitement dans la jungle luxuriante.",
    nl: "Een ecohotel ontworpen door Geoffrey Bawa, dat naadloos opgaat in de weelderige jungle.",
    ru: "Эко-отель, спроектированный Джеффри Бавой, гармонично вписывающийся в пышные джунгли.",
    hi: "जेफ्री बावा द्वारा डिजाइन किया गया एक इको-होटल, जो हरे-भरे जंगल में सहजता से घुलमिल जाता है।",
    ar: "فندق بيئي من تصميم جيفري باوا، يندمج بسلاسة في الأدغال الغناء."
  },
  "Shangri-La Hambantota": {
    zh: "香格里拉汉班托塔度假酒店", ja: "シャングリ・ラ ハンバントタ", de: "Shangri-La Hambantota", fr: "Shangri-La Hambantota", nl: "Shangri-La Hambantota", ru: "Shangri-La Hambantota", hi: "शांगरी-ला हम्बनटोटा", ar: "شانغريلا هامبانتوتا"
  },
  "A sprawling luxury resort on the southern coast offering endless activities and relaxation.": {
    zh: "坐落于南部海岸的宏伟奢华度假村，提供无尽的休闲活动与放松享受。",
    ja: "多彩なアクティビティと癒やしを提供する、南海岸に広がるラグジュアリーリゾート。",
    de: "Ein weitläufiges Luxusresort an der Südküste, das unendliche Aktivitäten und Entspannung bietet.",
    fr: "Un vaste complexe de luxe sur la côte sud offrant des activités infinies et de la relaxation.",
    nl: "Een uitgestrekt luxeresort aan de zuidkust met een scala aan activiteiten en ontspanning.",
    ru: "Масштабный роскошный курорт на южном побережье, предлагающий бесконечные развлечения и отдых.",
    hi: "दक्षिणी तट पर एक विशाल लक्जरी रिज़ॉर्ट जो अनंत गतिविधियों और विश्राम की पेशकश करता है।",
    ar: "منتجع فاخر ممتد على الساحل الجنوبي يقدم أنشطة لا حصر لها وراحة تامة."
  },
  "Taj Bentota Resort & Spa": {
    zh: "泰姬本托塔水疗度假酒店", ja: "タージ ベントタ リゾート ＆ スパ", de: "Taj Bentota Resort & Spa", fr: "Taj Bentota Resort & Spa", nl: "Taj Bentota Resort & Spa", ru: "Taj Bentota Resort & Spa", hi: "ताज बेंटोटा रिज़ॉर्ट और स्पा", ar: "منتجع وسبا تاج بانتوتا"
  },
  "Breathtaking views of the Indian Ocean with world-class hospitality.": {
    zh: "壮丽的印度洋景观配合世界顶尖的热情热情服务。",
    ja: "世界クラスのおもてなしとともに望む、インド洋の息をのむような絶景。",
    de: "Atemberaubende Blicke auf den Indischen Ozean und erstklassige Gastfreundschaft.",
    fr: "Des vues à couper le souffle sur l'océan Indien associées à une hospitalité de classe mondiale.",
    nl: "Adembenemend uitzicht op de Indische Oceaan met gastvrijheid van wereldklasse.",
    ru: "Захватывающий вид на Индийский океан и гостеприимство мирового класса.",
    hi: "विश्व स्तरीय आतिथ्य के साथ हिंद महासागर के मनमोहक दृश्य।",
    ar: "إطلالات خلابة على المحيط الهندي مع ضيافة ذات مستوى عالمي."
  },
  "Araliya Green Hills": {
    zh: "阿拉利亚绿丘酒店", ja: "アラリヤ グリーン ヒルズ", de: "Araliya Green Hills", fr: "Araliya Green Hills", nl: "Araliya Green Hills", ru: "Araliya Green Hills", hi: "अरालिया ग्रीन हिल्स", ar: "أراليا غرين هيلز"
  },
  "Elegant mountain retreat in Sri Lanka's hill country with cool weather and scenic landscapes.": {
    zh: "位于斯里兰卡山区高原的高雅山景度假避暑胜地，气候宜人，风光旖旎。",
    ja: "涼しい気候と美景に包まれた、スリランカ高地にあるエレガントな山のリゾート。",
    de: "Elegantes Bergrefugium im Hochland von Sri Lanka mit kühlem Wetter und malerischen Landschaften.",
    fr: "Élégante retraite de montagne dans les hautes terres du Sri Lanka au climat frais et aux paysages pittoresques.",
    nl: "Elegant bergverbljif in het bergland van Sri Lanka met koele temperaturen en schilderachtige landschappen.",
    ru: "Элегантный горный отель в высокогорье Шри-Ланки с прохладной погодой и живописными пейзажами.",
    hi: "श्रीलंका के पहाड़ी इलाके में ठंडे मौसम और सुरम्य परिदृश्यों के साथ सुंदर पर्वतीय विश्राम स्थल।",
    ar: "ملاذ جبل أنيق في مرتفعات سريلانكا يتميز بطقس عليل ومناظر طبيعية خلابة."
  },
  "EKHO Sigiriya": {
    zh: "EKHO 锡吉里耶酒店", ja: "EKHO シギリヤ", de: "EKHO Sigiriya", fr: "EKHO Sigiriya", nl: "EKHO Sigiriya", ru: "EKHO Sigiriya", hi: "एक्हो सिगिरिया", ar: "إيكو سيجيريا"
  },
  "Boutique luxury hotel with breathtaking views of Sigiriya Rock Fortress and tranquil surroundings.": {
    zh: "精品奢华酒店，拥有锡吉里耶狮子岩石堡垒的壮丽景色与宁静祥和的氛围。",
    ja: "シギリヤロックの絶景と穏やかな環境を誇る、ブティックラグジュアリーホテル。",
    de: "Boutique-Luxushotel mit atemberaubendem Blick auf die Felsenfestung Sigiriya und ruhiger Umgebung.",
    fr: "Hôtel boutique de luxe avec vue imprenable sur le rocher de Sigiriya et environnement paisible.",
    nl: "Boutique luxehotel met adembenemend uitzicht op het Sigiriya-rotsfort en een rustige omgeving.",
    ru: "Бутик-отель класса люкс с захватывающим видом на скальную крепость Сигирия и спокойной атмосферой.",
    hi: "सिगिरिया रॉक किले और शांत परिवेश के अद्भुत दृश्यों के साथ बुटीक लक्जरी होटल।",
    ar: "فندق بوتيك فاخر يوفر إطلالات ساحرة على قلعة صخرة سيجيريا وأجواء هادئة."
  },

  // Locations
  "Colombo, Sri Lanka": {
    zh: "斯里兰卡 科伦坡", ja: "スリランカ コロンボ", de: "Colombo, Sri Lanka", fr: "Colombo, Sri Lanka", nl: "Colombo, Sri Lanka", ru: "Коломбо, Шри-Ланка", hi: "कोलंबो, श्रीलंका", ar: "كولومبو، سريلانكا"
  },
  "Dambulla, Sri Lanka": {
    zh: "斯里兰卡 丹布勒", ja: "スリランカ ダンブッラ", de: "Dambulla, Sri Lanka", fr: "Dambulla, Sri Lanka", nl: "Dambulla, Sri Lanka", ru: "Дамбулла, Шри-Ланка", hi: "डंबुला, श्रीलंका", ar: "دامبولا، سريلانكا"
  },
  "Hambantota, Sri Lanka": {
    zh: "斯里兰卡 汉班托塔", ja: "スリランカ ハンバントタ", de: "Hambantota, Sri Lanka", fr: "Hambantota, Sri Lanka", nl: "Hambantota, Sri Lanka", ru: "Хамбантота, Шри-Ланка", hi: "हम्बनटोटा, श्रीलंका", ar: "هامبانتوتا، سريلانكا"
  },
  "Bentota, Sri Lanka": {
    zh: "斯里兰卡 本托塔", ja: "スリランカ ベントタ", de: "Bentota, Sri Lanka", fr: "Bentota, Sri Lanka", nl: "Bentota, Sri Lanka", ru: "Бентота, Шри-Ланка", hi: "बेंटोटा, श्रीलंका", ar: "بانتوتا، سريلانكا"
  },
  "Nuwara Eliya": {
    zh: "努瓦勒埃利耶", ja: "ヌワラエリヤ", de: "Nuwara Eliya", fr: "Nuwara Eliya", nl: "Nuwara Eliya", ru: "Нувара-Элия", hi: "नुवारा एलिया", ar: "نوارا إيليا"
  },
  "Dambulla": {
    zh: "丹布勒", ja: "ダンブッラ", de: "Dambulla", fr: "Dambulla", nl: "Dambulla", ru: "Дамбулла", hi: "डंबुला", ar: "دامبولا"
  },
  "Sigiriya, Sri Lanka": {
    zh: "斯里兰卡 锡吉里耶", ja: "スリランカ シギリヤ", de: "Sigiriya, Sri Lanka", fr: "Sigiriya, Sri Lanka", nl: "Sigiriya, Sri Lanka", ru: "Сигирия, Шри-Ланка", hi: "सिगिरिया, श्रीलंका", ar: "سيجيريا، سريلانكا"
  },
  "Ella & Nuwara Eliya": {
    zh: "埃拉与努瓦勒埃利耶", ja: "エラ＆ヌワラエリヤ", de: "Ella & Nuwara Eliya", fr: "Ella & Nuwara Eliya", nl: "Ella & Nuwara Eliya", ru: "Элла и Нувара-Элия", hi: "एला और नुवारा एलिया", ar: "إيلا ونوارا إيليا"
  },
  "Yala National Park": {
    zh: "雅拉国家公园", ja: "ヤーラ国立公園", de: "Yala-Nationalpark", fr: "Parc national de Yala", nl: "Yala Nationaal Park", ru: "Национальный парк Яла", hi: "याला राष्ट्रीय उद्यान", ar: "متنزه يالا الوطني"
  },
  "Mirissa & Galle": {
    zh: "美蕊沙与加勒", ja: "ミリッサ＆ゴール", de: "Mirissa & Galle", fr: "Mirissa & Galle", nl: "Mirissa & Galle", ru: "Мирисса и Галле", hi: "मिरिसा और गाले", ar: "ميريسا وغالي"
  },
  "Cultural Triangle": {
    zh: "文化三角区", ja: "文化三角地帯", de: "Kulturdreieck", fr: "Triangle culturel", nl: "Culturele Driehoek", ru: "Культурный треугольник", hi: "सांस्कृतिक त्रिभुज", ar: "المثلث الثقافي"
  },

  // Tours
  "Sigiriya & Dambulla Heritage Tour": {
    zh: "锡吉里耶与丹布勒文化遗产之旅", ja: "シギリヤ＆ダンブッラ 世界遺産ツアー", de: "Sigiriya & Dambulla Kulturerbe-Tour", fr: "Circuit Patrimoine Sigiriya & Dambulla", nl: "Sigiriya & Dambulla Erfgoed Tour", ru: "Культурный тур Сигирия и Дамбулла", hi: "सिगिरिया और डंबुला हेरिटेज टूर", ar: "جولة التراث في سيجيريا دامبولا"
  },
  "Climb the ancient 5th-century Sigiriya Rock Fortress (UNESCO World Heritage) and explore the sacred Dambulla Cave Temple complex featuring over 150 Buddha statues.": {
    zh: "攀登公元5世纪古老的锡吉里耶狮子岩堡垒（联合国教科文组织世界遗产），探秘供奉有150多尊佛像的圣洁丹布勒石窟寺。",
    ja: "ユネスコ世界遺産の5世紀の古代シギリヤロックに登り、150体以上の仏像が安置された聖なるダンブッラ石窟寺院を探索します。",
    de: "Besteigen Sie die antike Felsenfestung Sigiriya aus dem 5. Jahrhundert (UNESCO-Weltkulturerbe) und erkunden Sie den Höhlentempel von Dambulla.",
    fr: "Montez sur l'ancienne forteresse du rocher de Sigiriya (UNESCO) et explorez le temple rupestre sacré de Dambulla.",
    nl: "Beklim het oude 5e-eeuwse Sigiriya-rotsfort (UNESCO-werelderfgoed) en verken het heilige Dambulla-grottempelcomplex.",
    ru: "Поднимитесь на древнюю скальную крепость Сигирия 5-го века (ЮНЕСКО) и исследуйте священный пещерный храм Дамбулла.",
    hi: "प्राचीन 5वीं शताब्दी के सिगिरिया रॉक किले (यूनेस्को विश्व धरोहर) पर चढ़ें और पवित्र डंबुला गुफा मंदिर परिसर का अन्वेषण करें।",
    ar: "تسلق قلعة صخرة سيجيريا القديمة من القرن الخامس (تراث عالمي لليونسكو) واستكشف مجمع معبد كهف دامبولا المقدس."
  },
  "Ella Hill Country & Nine Arch Railway Journey": {
    zh: "埃拉高地山区与九拱桥铁道之旅", ja: "エラ高地＆九つのアーチ橋 鉄道の旅", de: "Ella Bergland & Neun-Bogen-Brücke Zugreise", fr: "Voyage au cœur des montagnes d'Ella & le pont aux Neuf Arches", nl: "Ella Bergland & Nine Arch Spoorwegreis", ru: "Путешествие по высокогорью Элла и мосту Девяти Арок", hi: "एला हिल कंट्री और नाइन आर्क रेलवे यात्रा", ar: "رحلة جبال إيلا وجسر الأقواس التسعة بالقطار"
  },
  "Experience the world-famous blue train ride through lush tea plantations, marvel at Nine Arch Bridge, and hike Little Adam's Peak.": {
    zh: "体验穿梭于郁郁葱葱茶园之中的世界著名蓝色高山火车，惊叹于九拱桥的壮观，并徒步登顶小亚当峰。",
    ja: "茶畑を駆け抜ける世界的に有名な青い高山列車に乗り、九つのアーチ橋に感嘆し、リトルアダムスピークのハイキングを楽しみます。",
    de: "Erleben Sie die weltberühmte Fahrt mit dem blauen Zug durch Teoplantagen, bestaunen Sie die Nine Arch Bridge und wandern Sie auf den Little Adam's Peak.",
    fr: "Montez à bord du célèbre train bleu traversant les plantations de thé, admirez le pont des Neuf Arches et randonnez sur le Little Adam's Peak.",
    nl: "Ervaar de beroemde blauwe treinrit door theeplantages, bewonder de Nine Arch Bridge en wandel naar Little Adam's Peak.",
    ru: "Прокатитесь на всемирно известном синем поезде через чайные плантации, полюбуйтесь мостом Девяти Арок и поднимитесь на малый пик Адама.",
    hi: "हरे-भरे चाय बागानों के माध्यम से विश्व प्रसिद्ध नीली ट्रेन की सवारी का अनुभव करें, नाइन आर्क ब्रिज का आनंद लें और लिटिल एडम्स पीक पर ट्रेक करें।",
    ar: "استمتع بركوب القطار الأزرق الشهير عالميًا عبر مزارع الشاي، واستمتع بمشاهدة جسر الأقواس التسعة، وتسلق قمة أدامز الصغرى."
  },
  "Yala National Park Wild Leopard Safari": {
    zh: "雅拉国家公园野生金钱豹越野猎游", ja: "ヤーラ国立公園 野生ヒョウ サファリ", de: "Yala-Nationalpark Wildtier-Safari & Leoparden", fr: "Safari léopards sauvages au parc national de Yala", nl: "Yala Nationaal Park Luipaard Safaritocht", ru: "Сафари с дикими леопардами в национальном парке Яла", hi: "याला राष्ट्रीय उद्यान वन्य तेंदुआ सफारी", ar: "سفاري النمور البرية في متنزه يالا الوطني"
  },
  "Embark on an exciting 4x4 Jeep Safari in Yala, world-renowned for highest leopard density, wild elephants, sloth bears, and exotic birds.": {
    zh: "搭乘四驱敞篷吉普车在雅拉国家公园展开刺激的猎游，这里以全球最高的金钱豹密度、野生大象、懒熊和珍稀飞禽闻名于世。",
    ja: "ヒョウの生息密度が世界一とされるヤーラで、野生の象やナマケグマ、珍しい鳥類を追うエキサイティングな4x4ジープサファリへ。",
    de: "Unternehmens Sie eine aufregende 4x4-Jeep-Safari im Yala-Nationalpark, der für die höchste Leopardendichte der Welt bekannt ist.",
    fr: "Embarquez pour un safari en Jeep 4x4 exaltant à Yala, mondialement connu pour sa forte densité de léopards, ses éléphants et ses ours.",
    nl: "Ga op een opwindende 4x4 Jeep Safari in Yala, wereldberoemd om de hoogste luipaarddichtheid, wilde olifanten en exotische vogels.",
    ru: "Отправляйтесь в захватывающее сафари на джипе 4x4 в парке Яла, всемирно известном высокой плотностью леопардов и дикими слонами.",
    hi: "याला में एक रोमांचक 4x4 जीप सफारी पर निकलें, जो उच्चतम तेंदुए के घनत्व, जंगली हाथियों और विदेशी पक्षियों के लिए दुनिया भर में प्रसिद्ध है।",
    ar: "انطلق في رحلة سفاري مثيرة بمركبة 4x4 في متنزه يالا، المشهور عالميًا بأعلى كثافة للنمور، والفيال البرية والطيور النادرة."
  },
  "Mirissa Blue Whale Watching & Galle Fort": {
    zh: "美蕊沙蓝鲸出海观赏与加勒古堡观光", ja: "ミリッサ ホエールウォッチング＆ゴールフォート", de: "Mirissa Blauwal-Beobachtung & Galle Fort", fr: "Observation des baleines bleues à Mirissa & Fort de Galle", nl: "Mirissa Blauwe Walvis Spotten & Galle Fort", ru: "Наблюдение за синими китами в Мириссе и Форт Галле", hi: "मििरिसा ब्लू व्हेल देखना और गाले किला", ar: "مشاهدة الحيتان الزرقاء في ميريسا وقلعة غالي"
  },
  "Sail into the Indian Ocean to spot Blue Whales and Dolphins, followed by a sunset walking tour of 16th-century Portuguese Galle Fort.": {
    zh: "启航驶入印度洋寻找蓝鲸与海豚的踪迹，随后在日落时分漫步于16世纪由葡萄牙人建造的加勒城堡古镇。",
    ja: "インド洋へ航行してシロナガスクジラやイルカを探し、夕暮れ時には16世紀の歴史あるゴールフォート散策を楽しみます。",
    de: "Segeln Sie auf den Indischen Ozean, um Blauwale zu beobachten, gefolgt von einem Rundgang bei Sonnenuntergang im Galle Fort aus dem 16. Jahrhundert.",
    fr: "Naviguez sur l'océan Indien pour apercevoir baleines bleues et dauphins, puis profitez d'une visite à pied du fort de Galle du XVIe siècle au coucher du soleil.",
    nl: "Vaar de Indische Oceaan op om blauwe walvissen te spotten, gevolgd door een wandeling bij zonsondergang door het 16e-eeuwse Galle Fort.",
    ru: "Отправляйтесь в Индийский океан для наблюдения за синими китами и дельфинами, а затем прогуляйтесь по историческому форту Галле 16 века.",
    hi: "ब्लू व्हेल और डॉल्फ़िन को देखने के लिए हिंद महासागर में पाल बांधें, जिसके बाद 16वीं शताब्दी के पुर्तगाली गाले किले का सूर्यास्त वॉक टूर होगा।",
    ar: "أبحر في المحيط الهندي لمشاهدة الحيتان الزرقاء والدلافين، تليها جولة سيرًا على الأقدام عند غروب الشمس في قلعة غالي البرتغالية من القرن السادس عشر."
  },
  "Cultural Heritage Explorer (Kandy, Polonnaruwa & Anuradhapura)": {
    zh: "古都文明与文化遗产探秘全景游（康提、波隆纳鲁沃与阿努拉德普勒）", ja: "文化遺産エクスプローラー（キャンディ、ポロンナルワ＆アヌラーダプラ）", de: "Kulturerbe-Entdecker (Kandy, Polonnaruwa & Anuradhapura)", fr: "Explorateur du patrimoine culturel (Kandy, Polonnaruwa & Anuradhapura)", nl: "Cultureel Erfgoed Ontdekker (Kandy, Polonnaruwa & Anuradhapura)", ru: "Исследователь культурного наследия (Канди, Полоннарува и Анурадхапура)", hi: "सांस्कृतिक विरासत एक्सप्लोरर (कैंडी, पोलोनारुवा और अनुराधापुरा)", ar: "استكشاف التراث الثقافي (كاندي، بولوناروا وأنواردابورا)"
  },
  "Comprehensive week-long journey through Sri Lanka's ancient royal kingdoms, sacred temples, and UNESCO world heritage sites.": {
    zh: "为期一周的深度文化之旅，带您穿梭于斯里兰卡古老王朝的故都、神圣的寺庙与联合国教科文组织世界遗产名胜。",
    ja: "スリランカの古代王国の遺跡、聖なる寺院、ユネスコ世界遺産を巡る充実の1週間ツアー。",
    de: "Umfassende einwöchige Reise durch die antiken Königsreiche, heiligen Tempel und UNESCO-Weltkulturerbestätten Sri Lankas.",
    fr: "Un voyage complet d'une semaine à travers les anciens royaumes royaux, les temples sacrés et les sites de l'UNESCO au Sri Lanka.",
    nl: "Een uitgebreide weekreis langs de oude koninkrijken, heilige tempels en UNESCO-werelderfgoedlocaties van Sri Lanka.",
    ru: "Всеобъемлющее недельное путешествие по древним королевствам Шри-Ланки, священным храмам и объектам ЮНЕСКО.",
    hi: "श्रीलंका के प्राचीन शाही राज्यों, पवित्र मंदिरों और यूनेस्को विश्व धरोहर स्थलों के माध्यम से एक सप्ताह की व्यापक यात्रा।",
    ar: "رحلة شاملة لمدة أسبوع عبر الممالك الملكية القديمة والمعابد المقدسة ومواقع التراث العالمي لليونسكو في سريلانكا."
  },
  "Sri Lanka Grand Luxury Escape": {
    zh: "斯里兰卡至尊奢华全景之旅", ja: "スリランカ グランド ラグジュアリー エスケープ", de: "Sri Lanka Grand Luxusauszeit", fr: "Grand Évasion de Luxe au Sri Lanka", nl: "Sri Lanka Grand Luxe Ontsnapping", ru: "Грандиозный роскошный тур по Шри-Ланке", hi: "श्रीलंका ग्रैंड लक्जरी एस्केप", ar: "هروب فاخر كبير في سريلانكا"
  },
  "Experience the ultimate luxury journey across Sri Lanka from private helicopter tours to 5-star beachfront resorts.": {
    zh: "体验贯穿斯里兰卡的顶级奢华之旅，涵盖私人直升机包机俯瞰与五星级海滨观景度假村。",
    ja: "プライベートヘリコプターツアーから5つ星ビーチフロントリゾートまで、スリランカを巡る至高のラグジュアリー体験。",
    de: "Erleben Sie die ultimative Luxusreise durch Sri Lanka von privaten Helikopterflügen bis hin zu 5-Sterne-Resorts am Strand.",
    fr: "Vivez le voyage de luxe ultime à travers le Sri Lanka, des vols privés en hélicoptère aux complexes 5 étoiles en bord de mer.",
    nl: "Ervaar de ultieme luxereis door Sri Lanka, van helikoptervluchten tot 5-sterren resorts aan het strand.",
    ru: "Испытайте высший уровень роскоши в Шри-Ланке: от полетов на вертолете до 5-звездочных курортов у океана.",
    hi: "निजी हेलीकॉप्टर पर्यटन से लेकर 5-सितारा बीचफ्रंट रिसॉर्ट्स तक श्रीलंका में अंतिम लक्जरी यात्रा का अनुभव करें।",
    ar: "استمتع برحلة الفخامة القصوى عبر سريلانكا من جولات المروحيات الخاصة إلى المنتجات الخمس نجوم على الشاطئ."
  },
  "Tropical Wildlife & Beach Safari": {
    zh: "热带野生动物探险与阳光海滩游", ja: "トロピカル ワイルドライフ ＆ ビーチ サファリ", de: "Tropische Tierwelt & Strand-Safari", fr: "Safari faune tropicale & plage", nl: "Tropische Wildernis & Strand Safari", ru: "Тропическое сафари с дикими животными и пляжный отдых", hi: "ट्रॉपिकल वाइल्डलाइफ और बीच सफारी", ar: "سفاري الحياة البرية الاستوائية والشواطئ"
  },
  "Discover Yala leopards, blue whales of Mirissa, and pristine coastal sanctuaries.": {
    zh: "探索雅拉国家公园的金钱豹、美蕊沙的巨型蓝鲸以及纯净安宁的沿海野生动物栖息地。",
    ja: "ヤーラのヒョウ、ミリッサのシロナガスクジラ、手つかずの沿海保護区をめぐる冒険。",
    de: "Entdecken Sie die Leoparden von Yala, die Blauwale von Mirissa und unberührte Küstenschutzgebiete.",
    fr: "Découvrez les léopards de Yala, les baleines bleues de Mirissa et des sanctuaires côtiers préservés.",
    nl: "Ontdek de luipaarden van Yala, blauwe walvissen van Mirissa en ongerepte kustreservaten.",
    ru: "Откройте для себя леопардов в Яла, синих китов в Мириссе и нетронутые прибрежные заповедники.",
    hi: "याला तेंदुओं, मिरिसा की ब्लू व्हेल और प्राचीन तटीय अभयारण्यों की खोज करें।",
    ar: "اكتشف نمور يالا، والحيتان الزرقاء في ميريسا، والمحميات الساحلية البكر."
  },

  // Itinerary Days
  "Arrival & Sigiriya Ascent": {
    zh: "抵达与攀登锡吉里耶狮子岩", ja: "到着とシギリヤロック登頂", de: "Ankunft & Aufstieg nach Sigiriya", fr: "Arrivée & ascension de Sigiriya", nl: "Aankomst & Beklimming van Sigiriya", ru: "Прибытие и подъем на Сигирию", hi: "आगमन और सिगिरिया चढ़ाई", ar: "الوصول وصعود سيجيريا"
  },
  "Arrival and climb the magnificent Sigiriya Rock Fortress.": {
    zh: "接机抵达并攀登壮丽的锡吉里耶狮子岩堡垒。", ja: "空港到着後、壮大なシギリヤロックへ登頂します。", de: "Ankunft und Besteigung der beeindruckenden Felsenfestung Sigiriya.", fr: "Arrivée et ascension de la magnifique forteresse du rocher de Sigiriya.", nl: "Aankomst en beklimming van het prachtige Sigiriya-rotsfort.", ru: "Прибытие и подъем на величественную скальную крепость Сигирия.", hi: "आगमन और शानदार सिगिरिया रॉक किले पर चढ़ाई।", ar: "الوصول وتسلق قلعة صخرة سيجيريا المهيبة."
  },
  "Arrive at the airport, transfer to Sigiriya, and spend the afternoon climbing the iconic 5th-century Sigiriya Rock Fortress with its stunning frescoes and palace ruins.": {
    zh: "抵达机场后专车前往锡吉里耶，下午攀登公元5世纪建造的标志性狮子岩堡垒，欣赏壁画与宫殿遗址。",
    ja: "空港に到着後、シギリヤへ移動。午後は素晴らしい壁画と王宫跡が残る5世紀のシギリヤロックを登ります。",
    de: "Ankunft am Flughafen, Transfer nach Sigiriya und Nachmittagsaufstieg auf die Felsenfestung aus dem 5. Jahrhundert.",
    fr: "Arrivée à l'aéroport, transfert à Sigiriya et après-midi consacré à l'ascension de la forteresse du Ve siècle.",
    nl: "Aankomst op de luchthaven, transfer naar Sigiriya en 's middags het beklimmen van het iconische 5e-eeuwse rotsfort.",
    ru: "Прибытие в аэропорт, трансфер в Сигирию и подъем во второй половине дня на скальную крепость 5 века.",
    hi: "हवाई अड्डे पर पहुंचें, सिगिरिया स्थानांतरण, और दोपहर 5वीं शताब्दी के प्रसिद्ध सिगिरिया रॉक किले पर चढ़ने में बिताएं।",
    ar: "الوصول إلى المطار، الانتقال إلى سيجيريا، وقضاء بعد الظهر في تسلق قلعة سيجيريا القرن الخامس."
  },
  "Scenic Train & Tea Fields": {
    zh: "高山景观火车与茶园观光", ja: "景観列車＆茶畑散策", de: "Aussichtszug & Teefelder", fr: "Train panoramique & champs de thé", nl: "Panoramische Trein & Theevelden", ru: "Живописный поезд и чайные плантации", hi: "सुरम्य ट्रेन और चाय के खेत", ar: "القطار البانورامي ومزارع الشاي"
  },
  "Train journey to Ella through scenic tea estates.": {
    zh: "乘坐高山观光火车穿越迷人茶园前往埃拉。", ja: "美しい紅茶農園を通り抜けるエラ行きの鉄道の旅。", de: "Zugfahrt nach Ella durch malerische Teeplantagen.", fr: "Voyage en train vers Ella à travers de magnifiques plantations de thé.", nl: "Treinreis naar Ella door schilderachtige theeplantages.", ru: "Поездка на поезде в Эллу через живописные чайные плантации.", hi: "सुरम्य चाय बागानों के माध्यम से एला के लिए ट्रेन यात्रा।", ar: "رحلة بالقطار إلى إيلا عبر مزارع الشاي الساحرة."
  },
  "Board the famous blue train from Kandy to Ella, winding through lush tea plantations, and check into your mountain view hotel.": {
    zh: "搭乘从康提前往埃拉的著名高山蓝色火车，穿行于连绵茶山间，随后入住具有绝佳山景的度假酒店。",
    ja: "キャンディからエラまでの有名な青い列車に乗り、緑豊かな茶畑を縫うように進み、山を見渡すホテルにチェックインします。",
    de: "Gehen Sie an Bord des berühmten blauen Zuges von Kandy nach Ella und checken Sie in Ihr Hotel mit Bergblick ein.",
    fr: "Montez à bord du célèbre train bleu de Kandy à Ella à travers les plantations de thé, puis installez-vous à votre hôtel.",
    nl: "Stap op de beroemde blauwe trein van Kandy naar Ella en check in bij uw hotel met uitzicht op de bergen.",
    ru: "Сядьте на знаменитый синий поезд из Канди в Эллу, виющийся через чайные плантации, и заселитесь в отель с видом на горы.",
    hi: "कैंडी से एला तक प्रसिद्ध नीली ट्रेन में सवार हों, हरे-भरे चाय बागानों से गुजरते हुए, और अपने माउंटेन व्यू होटल में चेक-इन करें।",
    ar: "استقل القطار الأزرق الشهير من كاندي إلى إيلا عبر مزارع الشاي الخضراء، وسجل وصولك في الفندق الجبلي."
  },
  "Ella Views & Hike": {
    zh: "埃拉山谷风光与徒步登顶", ja: "エラの絶景＆ハイキング", de: "Ella Aussichten & Wanderung", fr: "Vues d'Ella & Randonnée", nl: "Ella Uitzichten & Wandeling", ru: "Виды Эллы и пешая прогулка", hi: "एला दृश्य और लंबी पैदल यात्रा", ar: "مناظر إيلا والتسلق"
  },
  "Hike to Little Adam's Peak and Nine Arch Bridge.": {
    zh: "徒步前往小亚当峰并游览九拱拱桥。", ja: "リトルアダムスピークと九つのアーチ橋へハイキング。", de: "Wanderung zum Little Adam's Peak und zur Nine Arch Bridge.", fr: "Randonnée au Little Adam's Peak et au pont des Neuf Arches.", nl: "Wandeling naar Little Adam's Peak en de Nine Arch Bridge.", ru: "Прогулка к Малому пику Адама и мосту Девяти Арок.", hi: "लिटिल एडम्स पीक और नाइन आर्क ब्रिज के लिए ट्रेक।", ar: "رحلة سير إلى قمة أدامز الصغرى وجسر الأقواس التسعة."
  },
  "Early morning hike to Little Adam's Peak for sunrise views, visit the spectacular Nine Arch Bridge, and return in the afternoon.": {
    zh: "清晨徒步登顶小亚当峰欣赏壮丽日出，随后探访震撼的九拱桥，下午返回休息。",
    ja: "早朝にリトルアダムスピークへ登って朝日を望み、圧巻の九つのアーチ橋を訪れた後、午後に戻ります。",
    de: "Frühwanderung zum Little Adam's Peak für den Sonnenaufgang, Besuch der Nine Arch Bridge und Rückkehr am Nachmittag.",
    fr: "Randonnée tôt le matin au Little Adam's Peak pour le lever du soleil, visite du magnifique pont des Neuf Arches.",
    nl: "Vroege ochtendwandeling naar Little Adam's Peak voor de zonsopgang, bezoek de indrukwekkende Nine Arch Bridge.",
    ru: "Ранняя утренняя прогулка на Малый пик Адама на рассвете, посещение моста Девяти Арок и возвращение днём.",
    hi: "सूर्योदय के दृश्यों के लिए लिटिल एडम्स पीक पर सुबह-सुबह ट्रेक करें, शानदार नाइन आर्क ब्रिज पर जाएं।",
    ar: "رحلة صباحية إلى قمة أدامز الصغرى لمشاهدة الشروق، وزيارة جسر الأقواس التسعة."
  },
  "Wildlife Safari Adventure": {
    zh: "野生动物游猎探险之旅", ja: "ワイルドライフ サファリ アドベンチャー", de: "Wildtier-Safari Abenteuer", fr: "Aventure Safari Faune", nl: "Wildernis Safari Avontuur", ru: "Сафари-приключение в дикой природе", hi: "वन्यजीव सफारी साहसिक", ar: "مغامرة السفاري والحيوانات البرية"
  },
  "Full-day safari tracking leopards and elephants.": {
    zh: "全天深入丛林追踪野生金钱豹与大象。", ja: "ヒョウやゾウを追う終日サファリ体験。", de: "Ganztagessafari auf den Spuren von Leoparden und Elefanten.", fr: "Safari d'une journée complète sur la piste des léopards et éléphants.", nl: "Volledige dag op safari op zoek naar luipaarden en olifanten.", ru: "Сафари на целый день по следам леопардов и слонов.", hi: "तेंदुओं और हाथियों की खोज के लिए पूरे दिन की सफारी।", ar: "سفاري يوم كامل لتتبع النمور والفيلة."
  },
  "Start early for a morning game drive in Yala to spot leopards, break for a picnic lunch, and continue with an afternoon drive for more wildlife encounters.": {
    zh: "清晨开启雅拉早间游猎寻找金钱豹，中午在林间野餐，下午继续乘车寻找野生动物踪影。",
    ja: "早朝からヤーラでのモーニングゲームドライブでヒョウを探し、野外ランチの後、午後のドライブへ続きます。",
    de: "Morgens früh Start zur ersten Safari in Yala, Picknick-Mittagessen und nachmittags zweite Pirschfahrt.",
    fr: "Départ matinal pour un safari à Yala pour repérer les léopards, déjeuner pique-nique puis safari l'après-midi.",
    nl: "Vroeg vertrek voor een ochtendsafari in Yala om luipaarden te spotten, picknicklunch en middagsafari.",
    ru: "Ранний выезд на утреннее сафари в Яла для наблюдения за леопардами, обед-пикник и дневная поездка.",
    hi: "तेंदुओं को देखने के लिए याला में सुबह की सफारी के लिए जल्दी शुरुआत करें, दोपहर के भोजन का आनंद लें।", ar: "البدء مبكرًا في جولة صباحية لمشاهدة النمور، وتناول الغداء، والمتابعة في بعد الظهر."
  },
  "Whale Spotting & Colonial Fort": {
    zh: "观赏巨鲸与探秘殖民古堡", ja: "ホエールウォッチング＆コロニアルフォート", de: "Walbeobachtung & Kolonialfestung", fr: "Observation des baleines & fort colonial", nl: "Walvis spotten & Koloniaal Fort", ru: "Наблюдение за китами и колониальный форт", hi: "व्हेल देखना और औपनिवेशिक किला", ar: "مشاهدة الحيتان والقلعة الاستعمارية"
  },
  "Morning whale watching followed by historic Galle Fort tour.": {
    zh: "清晨出海观鲸，下午前往历史悠久的加勒古堡漫步。", ja: "午前中にホエールウォッチング、午後は歴史あるゴールフォート観光。", de: "Morgendliche Walbeobachtung, gefolgt von einer Führung im historischen Galle Fort.", fr: "Observation des baleines le matin suivie d'une visite du fort de Galle.", nl: "Ochtend walvis spotten gevolgd door een tour door het historische Galle Fort.", ru: "Утреннее наблюдение за китами и экскурсия по форту Галле.", hi: "सुबह व्हेल देखना जिसके बाद ऐतिहासिक गाले किले का दौरा।", ar: "مشاهدة الحيتان صباحًا ثم جولة في قلعة غالي التاريخية."
  },
  "Enjoy a catamaran cruise for whale and dolphin spotting in Mirissa, followed by a scenic seafood lunch and a guided walking tour of the historic Galle Fort.": {
    zh: "搭乘双体帆船出海前往美蕊沙观赏鲸鱼与海豚，随后享用海鲜午餐，并在导游带领下游览加勒古镇。",
    ja: "ミリッサでカタマラン船に乗ってクジラやイルカを探し、シーフードランチの後はガイド付きでゴールフォートを散策します。",
    de: "Genießen Sie eine Katamaran-Fahrt zur Walbeobachtung in Mirissa, gefolgt von einem Meeresfrüchte-Mittagessen und einer Führung durch Galle Fort.",
    fr: "Profitez d'une croisière en catamaran à Mirissa, suivie d'un déjeuner de fruits de mer et d'une visite guidée du fort de Galle.",
    nl: "Geniet van een catamarancruise in Mirissa om walvissen te spotten, gevolgd door een lunch en een tour door Galle Fort.",
    ru: "Морская прогулка на катамаране в Мириссе для наблюдения за китами, обед с морепродуктами и экскурсия по форту Галле.",
    hi: "मिरिसा में व्हेल और डॉल्फ़िन देखने के लिए कटमरैन क्रूज़ का आनंद लें, जिसके बाद सीफूड लंच और गाले किले का निर्देशित वॉक टूर होगा।",
    ar: "استمتع برحلة كاثاماران لمشاهدة الحيتان في ميريسا، ووجبة غداء مأكولات بحرية وجولة سيرًا في قلعة غالي."
  },
  "Arrival & Kandy": {
    zh: "抵达与康提圣城观光", ja: "到着とキャンディ観光", de: "Ankunft & Kandy", fr: "Arrivée & Kandy", nl: "Aankomst & Kandy", ru: "Прибытие и Канди", hi: "आगमन और कैंडी", ar: "الوصول وكاندي"
  },
  "Transfer to Kandy and visit the Temple of the Tooth.": {
    zh: "专车前往康提并参拜神圣的佛牙寺。", ja: "キャンディへ移動し、仏歯寺を参拝します。", de: "Transfer nach Kandy und Besuch des Zahntempels.", fr: "Transfert à Kandy et visite du Temple de la Dent.", nl: "Transfer naar Kandy en bezoek aan de Tempel van de Tand.", ru: "Трансфер в Канди и посещение Храма Зуба Будды.", hi: "कैंडी स्थानांतरण और टूथ मंदिर का दौरा।", ar: "الانتقال إلى كاندي وزيارة معبد السن المقدس."
  },
  "Arrive in Sri Lanka and transfer to Kandy, visiting the sacred Temple of the Tooth Relic in the evening.": {
    zh: "抵达斯里兰卡后前往圣城康提，傍晚参拜供奉有佛祖牙舍利的佛牙寺。",
    ja: "スリランカに到着後キャンディへ移動し、夕刻に聖なる仏歯寺を参拝します。",
    de: "Ankunft in Sri Lanka, Transfer nach Kandy und Besuch des heiligen Zahntempels am Abend.",
    fr: "Arrivée au Sri Lanka et transfert à Kandy, visite du Temple de la Dent sacrée en soirée.",
    nl: "Aankomst in Sri Lanka en transfer naar Kandy, 's avonds bezoek aan de Tempel van de Tand.",
    ru: "Прибытие в Шри-Ланку, трансфер в Канди и посещение священного Храма Зуба Будды вечером.",
    hi: "श्रीलंका पहुंचे और कैंडी स्थानांतरित हुए, शाम को पवित्र टूथ अवशेष मंदिर का दौरा किया।",
    ar: "الوصول إلى سريلانكا والانتقال إلى كاندي وزيارة معبد السن المقدس مساءً."
  },
  "Kandy Botanical Gardens": {
    zh: "康提皇家植物园", ja: "キャンディ 王立植物園", de: "Kandy Botanischer Garten", fr: "Jardin botanique de Kandy", nl: "Kandy Botanische Tuinen", ru: "Ботанический сад Канди", hi: "कैंडी वनस्पति उद्यान", ar: "حدائق كاندي النباتية"
  },
  "Explore the lush Peradeniya Botanical Gardens.": {
    zh: "游览郁郁葱葱佩拉德尼亚皇家植物园。", ja: "緑豊かなペラデニヤ王立植物園を散策します。", de: "Erkunden Sie den botanischen Garten von Peradeniya.", fr: "Explorez le jardin botanique royal de Peradeniya.", nl: "Verken de koninklijke botanische tuinen van Peradeniya.", ru: "Прогуляйтесь по Королевскому ботаническому саду Перадения.", hi: "हरे-भरे पेराडेनिया वनस्पति उद्यान का अन्वेषण करें।", ar: "استكشف حدائق بيرادينيا النباتية الملكية الغناء."
  },
  "Spend the day exploring the beautiful Peradeniya Royal Botanical Gardens and enjoy a cultural dance performance.": {
    zh: "漫步于风景如画的佩拉德尼亚皇家植物园，并于傍晚欣赏精彩的康提传统文化舞蹈表演。",
    ja: "美しいペラデニヤ王立植物園を1日かけて散策し、伝統的な文化ダンスパフォーマンスを観賞します。",
    de: "Verbringe den Tag im wunderschönen Botanischen Garten von Peradeniya und genieße eine Tanzaufführung.",
    fr: "Passez la journée à explorer les jardins botaniques royaux et profitez d'un spectacle de danse culturelle.",
    nl: "Breng de dag door in de prachtige Peradeniya Royal Botanical Gardens en geniet van een dansvoorstelling.",
    ru: "Проведите день в Королевском ботаническом саду Перадении и посмотрите культурное танцевальное шоу.",
    hi: "सुंदर पेराडेनिया रॉयल बोटेनिकल गार्डन की खोज में दिन बिताएं और एक सांस्कृतिक नृत्य प्रदर्शन का आनंद लें।",
    ar: "قضاء اليوم في استكشاف حدائق بيرادينيا النباتية والاستمتاع بعرض رقص ثقافي."
  },
  "Sigiriya Rock Fortress": {
    zh: "锡吉里耶狮子岩堡垒", ja: "シギリヤ ロック", de: "Felsenfestung Sigiriya", fr: "Forteresse de Sigiriya", nl: "Sigiriya Rotsfort", ru: "Крепость Сигирия", hi: "सिगिरिया रॉक किला", ar: "قلعة صخرة سيجيريا"
  },
  "Climb the iconic Sigiriya Rock.": {
    zh: "攀登举世闻名的锡吉里耶狮子岩。", ja: "象徴的なシギリヤロックに登ります。", de: "Besteigen Sie den ikonischen Sigiriya-Felsen.", fr: "L'ascension du célèbre rocher de Sigiriya.", nl: "Beklim de iconische Sigiriya-rots.", ru: "Поднимитесь на знаменитую скалу Сигирия.", hi: "प्रसिद्ध सिगिरिया रॉक पर चढ़ें।", ar: "تسلق صخرة سيجيريا الشهيرة."
  },
  "Travel to Sigiriya and climb the 5th-century rock fortress, marveling at the frescoes and ancient water gardens.": {
    zh: "前往锡吉里耶攀登公元5世纪空中堡垒，观赏优雅千年仕女壁画与古代皇家水景园林。",
    ja: "シギリヤへ移動し、壁画や古代の庭園に感嘆しながら5世紀の空中宮殿跡に登ります。",
    de: "Reisen Sie nach Sigiriya und besteigen Sie die Felsenfestung aus dem 5. Jahrhundert mit ihren Fresken.",
    fr: "Voyagez vers Sigiriya et montez sur la forteresse du Ve siècle en admirant ses magnifiques fresques.",
    nl: "Reis naar Sigiriya en beklim het 5e-eeuwse rotsfort om de muurschilderingen en tuinen te bewonderen.",
    ru: "Отправьтесь в Сигирию и поднимитесь на скальную крепость 5 века, любуясь фресками и садами.",
    hi: "सिगिरिया की यात्रा करें और 5वीं शताब्दी के रॉक किले पर चढ़ें, सुंदर भित्तिचित्रों का आनंद लें।",
    ar: "السفر إلى سيجيريا وتسلق قلعة القرن الخامس، والاستمتاع باللوحات الجدارية والحدائق."
  },
  "Dambulla Cave Temples": {
    zh: "丹布勒石窟寺群", ja: "ダンブッラ 石窟寺院", de: "Dambulla Höhlentempel", fr: "Temples rupestres de Dambulla", nl: "Dambulla Grottempels", ru: "Пещерные храмы Дамбулла", hi: "डंबुला गुफा मंदिर", ar: "معابد كهف دامبولا"
  },
  "Visit the sacred Dambulla cave complex.": {
    zh: "参观圣洁尊贵的丹布勒石窟古刹。", ja: "神聖なダンブッラ石窟寺院群を訪れます。", de: "Besuchen Sie den heiligen Höhlenkomplex von Dambulla.", fr: "Visitez le complexe sacré de grottes de Dambulla.", nl: "Bezoek het heilige grotcomplex van Dambulla.", ru: "Посетите священный пещерный комплекс Дамбулла.", hi: "पवित्र डंबुला गुफा परिसर का दौरा करें।", ar: "زيارة مجمع كهوف دامبولا المقدس."
  },
  "Explore the cave temple complex of Dambulla, featuring ancient murals and hundreds of Buddha statues.": {
    zh: "探秘丹布勒五座开凿于岩石上的石窟寺，欣赏历经千年的绚丽壁画与数百尊慈祥佛像。",
    ja: "古代の壁画や数百体もの仏像が安置された、ダンブッラの石窟寺院群を巡ります。",
    de: "Erkunden Sie den Höhlentempelkomplex von Dambulla mit seinen Wandgemälden und Hunderten von Buddha-Statuen.",
    fr: "Explorez le complexe rupestre de Dambulla abritant des peintures rupestres et des centaines de bouddhas.",
    nl: "Verken het grottempelcomplex van Dambulla met oude muurschilderingen en honderden boeddhabeelden.",
    ru: "Исследуйте пещерный комплекс Дамбуллы с древними фресками и сотнями статуй Будды.",
    hi: "डंबुला के गुफा मंदिर परिसर का अन्वेषण करें, जिसमें प्राचीन भित्तिचित्र और सैकड़ों बुद्ध प्रतिमाएं हैं।",
    ar: "استكشف مجمع معبد كهوف دامبولا، الذي يضم جداريات قديمة ومئات المتمثيلات للبوذا."
  },
  "Polonnaruwa Ruins": {
    zh: "波隆纳鲁沃古城遗址", ja: "ポロンナルワ 遺跡", de: "Polonnaruwa Ruinen", fr: "Ruines de Polonnaruwa", nl: "Polonnaruwa Ruïnes", ru: "Руины Полоннарувы", hi: "पोलोनारुवा खंडहर", ar: "أنقاض بولوناروا"
  },
  "Discover the medieval capital of Polonnaruwa.": {
    zh: "探索斯里兰卡中世纪古都波隆纳鲁沃。", ja: "中世の首都ポロンナルワの遺跡を巡ります。", de: "Entdecken Sie die mittelalterliche Hauptstadt Polonnaruwa.", fr: "Découvrez la capitale médiévale de Polonnaruwa.", nl: "Ontdek de middeleeuwse hoofdstad Polonnaruwa.", ru: "Откройте для себя средневековую столицу Полоннаруву.", hi: "मध्यकालीन राजधानी पोलोनारुवा की खोज करें।", ar: "اكتشف العاصمة العصور الوسطى بولوناروا."
  },
  "Visit the extensive archaeological park of Polonnaruwa, the ancient medieval capital of Sri Lanka.": {
    zh: "游览波隆纳鲁沃广阔的考古公园，参观中世纪王宫遗址、佛塔与精美雕刻的伽尔寺。",
    ja: "スリランカの中世の首都であった、ポロンナルワの広大な考古学公園を訪れます。",
    de: "Besuchen Sie den weitläufigen Archäologiepark von Polonnaruwa, der antiken mittelalterlichen Hauptstadt.",
    fr: "Visitez le vaste parc archéologique de Polonnaruwa, ancienne capitale médiévale du Sri Lanka.",
    nl: "Bezoek het archeologische park van Polonnaruwa, de oude middeleeuwse hoofdstad van Sri Lanka.",
    ru: "Посетите обширный археологический парк Полоннарувы — древней средневековой столицы Шри-Ланки.",
    hi: "श्रीलंका की प्राचीन मध्यकालीन राजधानी पोलोनारुवा के व्यापक पुरातात्विक पार्क का दौरा करें।",
    ar: "زيارة المتنزه الأثري الواسع في بولوناروا، العاصمة القديمة لسريلانكا."
  },
  "Anuradhapura Sacred City": {
    zh: "阿努拉德普勒圣城", ja: "アヌラーダプラ 聖地", de: "Heilige Stadt Anuradhapura", fr: "Cité sacrée d'Anuradhapura", nl: "Anuradhapura Heilige Stad", ru: "Священный город Анурадхапура", hi: "अनुराधापुरा पवित्र शहर", ar: "مدينة أنورادابورا المقدسة"
  },
  "Tour the ancient sacred city of Anuradhapura.": {
    zh: "巡礼第一古都与朝圣圣地阿努拉德普勒。", ja: "古代の聖なる都アヌラーダプラを巡ります。", de: "Tour durch die antike heilige Stadt Anuradhapura.", fr: "Visite de l'ancienne cité sacrée d'Anuradhapura.", nl: "Tour door de oude heilige stad Anuradhapura.", ru: "Экскурсия по древнему священному городу Анурадхапура.", hi: "प्राचीन पवित्र शहर अनुराधापुरा का दौरा करें।", ar: "جولة في مدينة أنورادابورا المقدسة القديمة."
  },
  "Spend the day in Anuradhapura, the first ancient capital and a sacred site containing numerous stupas and ancient bodhi trees.": {
    zh: "全天游览斯里兰卡最古老的首府阿努拉德普勒，参拜千年圣菩提树与耸立的古老巨大佛塔。",
    ja: "最初の首都であり、多くの仏塔や聖なる菩提樹が佇む聖地アヌラーダプラを終日散策します。",
    de: "Verbringe den Tag in Anuradhapura, der ersten Hauptstadt mit zahlreichen Stupas und heiligen Bodhi-Bäumen.",
    fr: "Passez la journée à Anuradhapura, première capitale abritant de grands stupas et l'arbre Bodhi sacré.",
    nl: "Breng de dag door in Anuradhapura, de eerste hoofdstad met talloze stupa's en heilige bodhibomen.",
    ru: "Проведите день в Анурадхапуре — первой столице Шри-Ланки со множеством ступ и священным деревом Бодхи.",
    hi: "अंतिम राजधानी अनुराधापुरा में दिन बिताएं, जहां कई स्तूप और प्राचीन बोधि वृक्ष हैं।",
    ar: "قضاء اليوم في أنورادابورا، العاصمة الأولى والموقع المقدس الذي يضم أبراج ودور الشجرة المقدسة."
  },
  "Departure": {
    zh: "行程告别与送机", ja: "ご出発・送迎", de: "Abreise", fr: "Départ", nl: "Vertrek", ru: "Отъезд", hi: "प्रस्थान", ar: "المغادرة"
  },
  "Transfer to airport for departure.": {
    zh: "享用早餐后送往国际机场回国。", ja: "空港へお送りし、帰国の途へ就きます。", de: "Transfer zum Flughafen für Ihre Abreise.", fr: "Transfert à l'aéroport pour le vol de retour.", nl: "Transfer naar de luchthaven voor vertrek.", ru: "Трансфер в аэропорт для вылета домой.", hi: "प्रस्थान के लिए हवाई अड्डे पर स्थानांतरण।", ar: "الانتقال إلى المطار للمغادرة."
  },
  "Final breakfast and transfer to the airport for your flight home.": {
    zh: "享用美味的晨间早餐，随后搭乘专车前往班达拉奈克国际机场离境。",
    ja: "最後の朝食を楽しんだ後、帰国便に合わせて空港へ送迎いたします。",
    de: "Abschließendes Frühstück und Transfer zum Flughafen für Ihren Heimflug.",
    fr: "Dernier petit-déjeuner et transfert à l'aéroport pour votre vol de retour.",
    nl: "Laatste ontbijt en transfer naar de luchthaven voor uw vlucht naar huis.",
    ru: "Заключительный завтрак и трансфер в аэропорт для вылета домой.",
    hi: "अंतिम नाश्ता और आपकी घर की उड़ान के लिए हवाई अड्डे पर स्थानांतरण।",
    ar: "الإفطار الأخير والانتقال إلى المطار لرحلتك العودة إلى الوطن."
  }
};

locales.forEach(lang => {
  const filePath = path.join(__dirname, `../src/locales/${lang}.json`);
  if (!fs.existsSync(filePath)) return;

  const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let updated = 0;

  for (const [key, langMap] of Object.entries(seedDict)) {
    if (langMap[lang]) {
      json[key] = langMap[lang];
      updated++;
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
  console.log(`Updated ${lang}.json with seed dictionary (${updated} keys).`);
});

// Also update en.json
const enPath = path.join(__dirname, '../src/locales/en.json');
if (fs.existsSync(enPath)) {
  const enJson = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  for (const key of Object.keys(seedDict)) {
    enJson[key] = key;
  }
  fs.writeFileSync(enPath, JSON.stringify(enJson, null, 2), 'utf8');
  console.log('Updated en.json with seed keys.');
}
