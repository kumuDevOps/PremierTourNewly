const fs = require('fs');

const enLocale = JSON.parse(fs.readFileSync('./src/locales/en.json', 'utf8'));
const locales = ['ar', 'de', 'fr', 'hi', 'ja', 'nl', 'ru', 'zh'];

const dictionary = {
  // --- AMENITIES ---
  "Nature Views": {
    zh: "自然风光景致", ja: "自然の景観", de: "Natur-Aussicht", fr: "Vue sur la nature", nl: "Natuurzicht", ru: "Вид на природу", hi: "प्राकृतिक दृश्य", ar: "إطلالات على الطبيعة"
  },
  "Golf Course": {
    zh: "高尔夫球场", ja: "ゴルフコース", de: "Golfplatz", fr: "Terrain de golf", nl: "Golfbaan", ru: "Гольф-поле", hi: "गोल्फ कोर्स", ar: "ملعب جولف"
  },
  "Free WiFi": {
    zh: "免费 Wi-Fi", ja: "無料 Wi-Fi", de: "Kostenloses WLAN", fr: "Wi-Fi gratuit", nl: "Gratis Wi-Fi", ru: "Бесплатный Wi-Fi", hi: "निःशुल्क वाईफाई", ar: "واي فاي مجاني"
  },
  "Restaurant": {
    zh: "高端餐厅", ja: "レストラン", de: "Restaurant", fr: "Restaurant", nl: "Restaurant", ru: "Ресторан", hi: "रेस्तरां", ar: "مطعم"
  },
  "Air Conditioning": {
    zh: "空调系统", ja: "冷暖房完備", de: "Klimaanlage", fr: "Climatisation", nl: "Airconditioning", ru: "Кондиционер", hi: "एयर कंडीशनिंग", ar: "تكييف هواء"
  },
  "Room Service": {
    zh: "客房服务", ja: "ルームサービス", de: "Zimmerservice", fr: "Service d'étage", nl: "Kamerservice", ru: "Обслуживание номеров", hi: "रूम सर्विस", ar: "خدمة الغرف"
  },
  "Wi-Fi": {
    zh: "无线网络", ja: "Wi-Fi", de: "WLAN", fr: "Wi-Fi", nl: "Wi-Fi", ru: "Wi-Fi", hi: "वाई-फाई", ar: "واي فاي"
  },
  "Swimming Pool": {
    zh: "游泳池", ja: "スイミングプール", de: "Schwimmbad", fr: "Piscine", nl: "Zwembad", ru: "Бассейн", hi: "स्वीमिंग पूल", ar: "حمام سباحة"
  },
  "Luxury Spa": {
    zh: "奢华水疗", ja: "ラグジュアリースパ", de: "Luxus-Spa", fr: "Spa de luxe", nl: "Luxe Spa", ru: "Люкс спа", hi: "लक्जरी स्पा", ar: "سبا فاخر"
  },
  "Fitness Center": {
    zh: "健身中心", ja: "フィットネスセンター", de: "Fitnessstudio", fr: "Centre de remise en forme", nl: "Fitnesscentrum", ru: "Фитнес-центр", hi: "फिटनेस सेंटर", ar: "مركز لياقة بدنية"
  },
  "Breakfast Included": {
    zh: "含早餐", ja: "朝食付き", de: "Frühstück inklusive", fr: "Petit déjeuner inclus", nl: "Inclusief ontbijt", ru: "Завтрак включен", hi: "नाश्ता शामिल है", ar: "الإفطار مشمول"
  },
  "Beachfront": {
    zh: "一线海景", ja: "ビーチフロント", de: "Direkt am Strand", fr: "En bord de mer", nl: "Aan het strand", ru: "Пляжная зона", hi: "समुद्र तट", ar: "مواجه للشاطئ"
  },

  // --- HOTELS ---
  "Cinnamon Grand Colombo": {
    zh: "科伦坡肉桂大饭店", ja: "シナモン・グランド・コロンボ", de: "Cinnamon Grand Colombo", fr: "Cinnamon Grand Colombo", nl: "Cinnamon Grand Colombo", ru: "Cinnamon Grand Colombo", hi: "सिनामन ग्रैंड कोलंबो", ar: "سينامون غراند كولومبو"
  },
  "Experience luxury in the heart of Colombo with world-class dining and amenities.": {
    zh: "在科伦坡市中心体验奢华入住，享受世界级餐饮与配套设施。",
    ja: "世界クラスのダイニングとアメニティを備えたコロンボの中心部でラグジュアリーな滞在をご体験ください。",
    de: "Erleben Sie Luxus im Herzen von Colombo mit erstklassiger Gastronomie und Annehmlichkeiten.",
    fr: "Découvrez le luxe au cœur de Colombo avec des restaurants et des équipements de classe mondiale.",
    nl: "Ervaar luxe in het hart van Colombo met gastronomie en voorzieningen van wereldklasse.",
    ru: "Испытайте роскошь в самом сердце Коломбо с ресторанами и удобствами мирового класса.",
    hi: "विश्व स्तरीय भोजन और सुविधाओं के साथ कोलंबो के केंद्र में विलासिता का अनुभव करें।",
    ar: "تجربة الفخامة في قلب كولومبو مع وسائل الراحة والمطاعم ذات المستوى العالمي."
  },
  "Heritance Kandalama": {
    zh: "坎达拉玛遗产酒店", ja: "ヘリタンス・カンダラマ", de: "Heritance Kandalama", fr: "Heritance Kandalama", nl: "Heritance Kandalama", ru: "Heritance Kandalama", hi: "हेरिटेंस कांडालामा", ar: "هيريتانس كاندالاما"
  },
  "An eco-hotel designed by Geoffrey Bawa, blending seamlessly into the lush jungle.": {
    zh: "由杰弗里·巴瓦设计的生态酒店，完美融入郁郁葱葱的丛林之中。",
    ja: "ジェフリー・バワが設計した、青々としたジャングルに溶け込むエコホテル。",
    de: "Ein von Geoffrey Bawa entworfenes Öko-Hotel, das sich nahtlos in den üppigen Dschungel einfügt.",
    fr: "Un éco-hôtel conçu par Geoffrey Bawa, s'intégrant parfaitement dans la jungle verdoyante.",
    nl: "Een door Geoffrey Bawa ontworpen ecoloog hotel dat naadloos opgaat in de weelderige jungle.",
    ru: "Эко-отель, спроектированный Джеффри Бава, гармонично вписывающийся в пышные джунгли.",
    hi: "जॉफ्रे बावा द्वारा डिज़ाइन किया गया एक पर्यावरण-अनुकूल होटल, जो हरे-भरे जंगल में सहजता से घुलमिल जाता है।",
    ar: "فندق بيئي تصميمه جيفري باوا، يندمج بسلاسة في الأدغال الخضراء."
  },
  "Shangri-La Hambantota": {
    zh: "香格里拉汉班托塔度假酒店", ja: "シャングリ・ラ ハンバントタ", de: "Shangri-La Hambantota", fr: "Shangri-La Hambantota", nl: "Shangri-La Hambantota", ru: "Shangri-La Hambantota", hi: "शांगरी-ला हम्बनटोटा", ar: "شانغريلا هامبانتوتا"
  },
  "A sprawling luxury resort on the southern coast offering endless activities and relaxation.": {
    zh: "位于南部海岸的大型奢华度假村，提供无尽的娱乐活动与休闲放松。",
    ja: "無限のアクティビティとリラクゼーションを提供する南海岸の広大なラグジュアリーリゾート。",
    de: "Ein weitläufiges Luxusresort an der Südküste mit endlosen Aktivitäten und Entspannung.",
    fr: "Un vaste complexe hôtelier de luxe sur la côte sud offrant des activités et une relaxation infinies.",
    nl: "Een uitgestrekt luxeresort aan de zuidkust met eindeloze activiteiten en ontspanning.",
    ru: "Раскинувшийся роскошный курорт на южном побережье, предлагающий бесконечные развлечения и отдых.",
    hi: "दक्षिणी तट पर स्थित एक विशाल लक्जरी रिज़ॉर्ट जो अंतहीन गतिविधियों और विश्राम की पेशकश करता है।",
    ar: "منتجع فاخر مترامي الأطراف على الساحل الجنوبي يقدم أنشطة استرخاء لا حصر لها."
  },
  "Taj Bentota Resort & Spa": {
    zh: "泰姬本托塔水疗度假酒店", ja: "タージ・ベントータ・リゾート＆スパ", de: "Taj Bentota Resort & Spa", fr: "Taj Bentota Resort & Spa", nl: "Taj Bentota Resort & Spa", ru: "Taj Bentota Resort & Spa", hi: "ताज बेंटोटा रिसॉर्ट एंड स्पा", ar: "منتجع وسبا تاج بانتوتا"
  },
  "Breathtaking views of the Indian Ocean with world-class hospitality.": {
    zh: "拥有印度洋的壮丽景致与世界一流的热情招待。",
    ja: "世界クラスのおもてなしとインド洋の息をのむような絶景。",
    de: "Atemberaubender Blick auf den Indischen Ozean mit erstklassiger Gastfreundschaft.",
    fr: "Une vue imprenable sur l'océan Indien avec un accueil chaleureux de classe mondiale.",
    nl: "Adembenemend uitzicht op de Indische Oceaan met gastvrijheid van wereldklasse.",
    ru: "Захватывающий вид на Индийский океан и гостеприимство мирового уровня.",
    hi: "विश्व स्तरीय आतिथ्य के साथ हिंद महासागर के आश्चर्यजनक दृश्य।",
    ar: "إطلالات خلابة على المحيط الهندي مع ضيافة عالمية المستوى."
  },
  "Araliya Green Hills": {
    zh: "阿拉利雅绿丘酒店", ja: "アラリヤ・グリーン・ヒルズ", de: "Araliya Green Hills", fr: "Araliya Green Hills", nl: "Araliya Green Hills", ru: "Araliya Green Hills", hi: "अरालिया ग्रीन हिल्स", ar: "أراليا جرين هيلز"
  },
  "Elegant mountain retreat in Sri Lanka's hill country with cool weather and scenic landscapes.": {
    zh: "位于斯里兰卡山区高地的高雅避暑山庄，气候凉爽，风景如画。",
    ja: "涼しい気候と絵画のような景色を楽しめる、スリランカの高原地帯に位置するエレガントなマウンテンリトリート。",
    de: "Elegantes Rückzugsgebiet in Sri Lankas Bergland mit kühlem Wetter und malerischen Landschaften.",
    fr: "Élégante retraite de montagne dans la région des collines du Sri Lanka avec un temps frais et des paysages pittoresques.",
    nl: "Elegante bergaccommodatie in het bergland van Sri Lanka met koel weer en schilderachtige landschappen.",
    ru: "Элегантный горный отель в горной части Шри-Ланки с прохладной погодой и живописными пейзажами.",
    hi: "ठंडे मौसम और प्राकृतिक परिदृश्यों के साथ श्रीलंका के पहाड़ी क्षेत्र में सुरम्य रिट्रीट।",
    ar: "ملاذ جلي أنيق في المرتفعات الجبلية في سريلانكا مع طقس عليل ومناظر طبيعية خلابة."
  },
  "EKHO Sigiriya": {
    zh: "EKHO 锡吉里耶酒店", ja: "EKHO シーギリヤ", de: "EKHO Sigiriya", fr: "EKHO Sigiriya", nl: "EKHO Sigiriya", ru: "EKHO Sigiriya", hi: "एको सिगिरिया", ar: "إيكو سيجيريا"
  },
  "Boutique luxury hotel with breathtaking views of Sigiriya Rock Fortress and tranquil surroundings.": {
    zh: "精美奢华精品酒店，俯瞰锡吉里耶狮子岩要塞的壮丽全景，环境宁静。",
    ja: "シーギリヤ・ロックの要塞と穏やかな自然の息をのむ絶景を望むブティック・ラグジュアリーホテル。",
    de: "Boutique-Luxushotel mit atemberaubendem Blick auf die Felsenfestung Sigiriya und ruhiger Umgebung.",
    fr: "Hôtel boutique de luxe offrant une vue imprenable sur la forteresse du rocher de Sigiriya et un cadre paisible.",
    nl: "Luxe boetiekhotel met adembenemend uitzicht op het rotsfort van Sigiriya en een rustige omgeving.",
    ru: "Бутик-отель класса люкс с захватывающим видом на скальную крепость Сигирия и спокойной атмосферой.",
    hi: "सिगिरिया रॉक किले और शांत परिवेश के अद्भुत दृश्यों के साथ बुटीक लक्जरी होटल।",
    ar: "فندق بوتيك فاخر يوفر إطلالات ساحرة على قلعة صخرة سيجيريا وأجواء هادئة."
  },

  // --- UI LABELS ---
  "Password Requirements:": {
    zh: "密码设置要求：", ja: "パスワードの要件：", de: "Passwortanforderungen:", fr: "Exigences relatives au mot de passe :", nl: "Wachtwoordvereisten:", ru: "Требования к паролю:", hi: "पासवर्ड आवश्यकताएँ:", ar: "متطلبات كلمة المرور:"
  },
  "At least 8 characters": {
    zh: "至少 8 个字符", ja: "8文字以上", de: "Mindestens 8 Zeichen", fr: "Au moins 8 caractères", nl: "Ten minste 8 tekens", ru: "Не менее 8 символов", hi: "कम से कम 8 अक्षर", ar: "8 أحرف على الأقل"
  },
  "Uppercase letter (A-Z)": {
    zh: "包含大写字母 (A-Z)", ja: "大文字 (A-Z)", de: "Großbuchstabe (A-Z)", fr: "Lettre majuscule (A-Z)", nl: "Hoofdletter (A-Z)", ru: "Заглавная буква (A-Z)", hi: "बड़ा अक्षर (A-Z)", ar: "حرف كبير (A-Z)"
  },
  "Lowercase letter (a-z)": {
    zh: "包含小写字母 (a-z)", ja: "小文字 (a-z)", de: "Kleinbuchstabe (a-z)", fr: "Lettre minuscule (a-z)", nl: "Kleine letter (a-z)", ru: "Строчная буква (a-z)", hi: "छोटा अक्षर (a-z)", ar: "حرف صغير (a-z)"
  },
  "Number (0-9)": {
    zh: "包含数字 (0-9)", ja: "数字 (0-9)", de: "Zahl (0-9)", fr: "Chiffre (0-9)", nl: "Cijfer (0-9)", ru: "Цифра (0-9)", hi: "संख्या (0-9)", ar: "رقم (0-9)"
  },
  "Special char (!@#$)": {
    zh: "特殊字符 (!@#$)", ja: "特殊文字 (!@#$)", de: "Sonderzeichen (!@#$)", fr: "Caractère spécial (!@#$)", nl: "Speciaal teken (!@#$)", ru: "Спецсимвол (!@#$)", hi: "विशेष वर्ण (!@#$)", ar: "رمز خاص (!@#$)"
  },
  "Passwords match": {
    zh: "两次输入密码一致", ja: "パスワード一致", de: "Passwörter stimmen überein", fr: "Les mots de passe correspondent", nl: "Wachtwoorden komen overeen", ru: "Пароли совпадают", hi: "पासवर्ड मेल खाते हैं", ar: "كلمات المرور متطابقة"
  },
  "Upload Custom Photo (JPG, PNG, WebP)": {
    zh: "上传自定义照片 (JPG, PNG, WebP)", ja: "カスタム写真をアップロード (JPG, PNG, WebP)", de: "Benutzerdefiniertes Foto hochladen (JPG, PNG, WebP)", fr: "Télécharger une photo personnalisée (JPG, PNG, WebP)", nl: "Upload eigen foto (JPG, PNG, WebP)", ru: "Загрузить фото (JPG, PNG, WebP)", hi: "कस्टम फोटो अपलोड करें (JPG, PNG, WebP)", ar: "تحميل صورة مخصصة (JPG, PNG, WebP)"
  },
  "Or Choose Luxury Avatar Preset:": {
    zh: "或选择尊享头像预设：", ja: "またはラグジュアリーアバタープリセットを選択：", de: "Oder wählen Sie ein Luxus-Avatar-Preset:", fr: "Ou choisissez un avatar de luxe prédéfini :", nl: "Of kies een luxe avatar-instelling:", ru: "Или выберите готовый аватар:", hi: "या लक्जरी अवतार प्रीसेट चुनें:", ar: "أو اختر صورة رمزية فاخرة مسبقة:"
  },
  "Assigned Room:": {
    zh: "指定分配房间：", ja: "割り当てられた客室：", de: "Zugeordnetes Zimmer:", fr: "Chambre attribuée :", nl: "Toegewezen kamer:", ru: "Назначенный номер:", hi: "आवंटित कमरा:", ar: "الغرفة المخصصة:"
  },
  "Room Category:": {
    zh: "客房类别：", ja: "客室カテゴリー：", de: "Zimmerkategorie:", fr: "Catégorie de chambre :", nl: "Categorie kamer:", ru: "Категория номера:", hi: "कमरे की श्रेणी:", ar: "فئة الغرفة:"
  },
  "Check-Out Date:": {
    zh: "退房日期：", ja: "チェックアウト日：", de: "Abreisedatum:", fr: "Date de départ :", nl: "Uitcheckdatum:", ru: "Дата выезда:", hi: "चेक-आउट तिथि:", ar: "تاريخ المغادرة:"
  },
  "Inclusions:": {
    zh: "包含服务与权益：", ja: "含まれる特典：", de: "Inklusivleistungen:", fr: "Inclusions :", nl: "Inclusief:", ru: "Включено в стоимость:", hi: "शामिल सुविधाएँ:", ar: "الخدمات المشمولة:"
  },
  "Vehicle Category:": {
    zh: "车型级别：", ja: "車両カテゴリー：", de: "Fahrzeugkategorie:", fr: "Catégorie de véhicule :", nl: "Voertuigcategorie:", ru: "Категория авто:", hi: "वाहन श्रेणी:", ar: "فئة المركبة:"
  },
  "Pick-Up Location:": {
    zh: "取车/接载地点：", ja: "乗車場所：", de: "Abholort:", fr: "Lieu de prise en charge :", nl: "Ophaallocatie:", ru: "Место подачи:", hi: "पिक-अप स्थान:", ar: "موقع الاستلام:"
  },
  "Drop-Off Location:": {
    zh: "还车/送达地点：", ja: "降車場所：", de: "Rückgabeort:", fr: "Lieu de restitution :", nl: "Inleverlocatie:", ru: "Место возврата:", hi: "ड्रॉप-ऑफ स्थान:", ar: "موقع التسليم:"
  },
  "Return Date:": {
    zh: "归还/返程日期：", ja: "返却日：", de: "Rückgabedatum:", fr: "Date de retour :", nl: "Retourdatum:", ru: "Дата возврата:", hi: "वापसी की तिथि:", ar: "تاريخ العودة:"
  },
  "Transmission:": {
    zh: "变速箱类型：", ja: "トランスミッション：", de: "Getriebe:", fr: "Transmission :", nl: "Transmissie:", ru: "Трансмиссия:", hi: "ट्रांसमिशन:", ar: "ناقل الحركة:"
  },
  "Airline:": {
    zh: "航空公司：", ja: "航空会社：", de: "Fluggesellschaft:", fr: "Compagnie aérienne :", nl: "Luchtvaartmaatschappij:", ru: "Авиакомпания:", hi: "एयरलाइन:", ar: "شركة الطيران:"
  },
  "Route:": {
    zh: "航线区间：", ja: "路線：", de: "Flugroute:", fr: "Itinéraire :", nl: "Route:", ru: "Маршрут:", hi: "मार्ग:", ar: "المسار:"
  },
  "Cabin Class:": {
    zh: "舱位等级：", ja: "座席クラス：", de: "Kabinenklasse:", fr: "Classe de cabine :", nl: "Culp-klasse:", ru: "Класс обслуживания:", hi: "केबिन क्लास:", ar: "درجة المقصورة:"
  },
  "Package Type:": {
    zh: "套餐类型：", ja: "パッケージタイプ：", de: "Pakettyp:", fr: "Type de forfait :", nl: "Pakkettype:", ru: "Тип пакета:", hi: "पैकेज प्रकार:", ar: "نوع الباقة:"
  },
  "Scheduled Guide:": {
    zh: "安排导游人员：", ja: "担当ガイド：", de: "Geplanter Reiseleiter:", fr: "Guide prévu :", nl: "Toegewezen gids:", ru: "Назначенный гид:", hi: "निर्धारित गाइड:", ar: "المرشد المخصص:"
  },
  "Transport:": {
    zh: "交通工具：", ja: "移動手段：", de: "Transportmittel:", fr: "Moyen de transport :", nl: "Vervoer:", ru: "Транспорт:", hi: "परिवहन:", ar: "وسيلة النقل:"
  },
  "Important Traveler Instructions:": {
    zh: "出行人员重要须知：", ja: "旅行者への重要事項：", de: "Wichtige Anweisungen für Reisende:", fr: "Instructions importantes pour les voyageurs :", nl: "Belangrijke instructies voor reizigers:", ru: "Важная информация для путешественников:", hi: "यात्रियों के लिए महत्वपूर्ण निर्देश:", ar: "تعليمات هامة للمسافرين:"
  },
  "Please present this physical PDF voucher or digital screen pass upon arrival.": {
    zh: "请在抵达时出示此 PDF 纸质凭证或手机电子行程单。",
    ja: "到着時にこのPDFバウチャーまたはデジタルチケットをご提示ください。",
    de: "Bitte legen Sie diesen PDF-Gutschein oder digitalen Pass bei der Ankunft vor.",
    fr: "Veuillez présenter ce bon PDF ou votre pass numérique à l'arrivée.",
    nl: "Toon deze PDF-voucher of digitale pas bij aankomst.",
    ru: "Пожалуйста, предъявите этот PDF-ваучер или электронный билет при прибытии.",
    hi: "कृपया आगमन पर यह पीडीएफ वाउचर या डिजिटल स्क्रीन पास प्रस्तुत करें।",
    ar: "يرجى تقديم قسيمة PDF هذه أو البطاقة الرقمية عند الوصول."
  },
  "For 24/7 concierge assistance, contact support@premiertourbooking.com or +1 800-555-PREMIER.": {
    zh: "如需 24/7 全天候尊享管家服务，请联系 support@premiertourbooking.com 或 +1 800-555-PREMIER。",
    ja: "24時間年中無休のコンシェルジュアシスタンスは support@premiertourbooking.com または +1 800-555-PREMIER までお問い合わせください。",
    de: "Für 24/7 Concierge-Unterstützung kontaktieren Sie support@premiertourbooking.com oder +1 800-555-PREMIER.",
    fr: "Pour une assistance conciergerie 24/7, contactez support@premiertourbooking.com ou +1 800-555-PREMIER.",
    nl: "Voor 24/7 conciërge-ondersteuning, neem contact op met support@premiertourbooking.com of +1 800-555-PREMIER.",
    ru: "Для получения круглосуточной поддержки консьержа свяжитесь с support@premiertourbooking.com или +1 800-555-PREMIER.",
    hi: "24/7 द्वारपाल सहायता के लिए, support@premiertourbooking.com या +1 800-555-PREMIER पर संपर्क करें।",
    ar: "للحصول على مساعدة الكونسيرج على مدار 24/7، تواصل مع support@premiertourbooking.com أو +1 800-555-PREMIER."
  }
};

locales.forEach(loc => {
  const filePath = `./src/locales/${loc}.json`;
  const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  let count = 0;
  Object.entries(dictionary).forEach(([key, valMap]) => {
    if (valMap[loc]) {
      fileData[key] = valMap[loc];
      count++;
    }
  });

  fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2), 'utf8');
  console.log(`Updated ${loc}.json with amenities & hotel data (${count} entries).`);
});
