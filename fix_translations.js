const fs = require('fs');
const translations = {
  "The Luxury Editorial": {
    hi: "लक्ज़री संपादकीय", fr: "L'éditorial de Luxe", de: "Der Luxus-Leitartikel", nl: "De Luxe Redactioneel",
    ja: "ラグジュアリー・エディトリアル", zh: "奢华社论", ru: "Роскошная редакция", ar: "الافتتاحية الفاخرة"
  },
  "Discover Sri Lanka": {
    hi: "श्रीलंका की खोज करें", fr: "Découvrez le Sri Lanka", de: "Entdecken Sie Sri Lanka", nl: "Ontdek Sri Lanka",
    ja: "スリランカを発見", zh: "探索斯里兰卡", ru: "Откройте для себя Шри-Ланку", ar: "اكتشف سريلانكا"
  },
  "Where Every Journey": {
    hi: "जहाँ हर यात्रा", fr: "Où chaque voyage", de: "Wo jede Reise", nl: "Waar elke reis",
    ja: "すべての旅が", zh: "每一次旅行", ru: "Где каждое путешествие", ar: "حيث كل رحلة"
  },
  "Becomes a Story": {
    hi: "एक कहानी बन जाती है", fr: "Devient une histoire", de: "Zu einer Geschichte wird", nl: "Een verhaal wordt",
    ja: "物語になる", zh: "都成为一个故事", ru: "Становится историей", ar: "تصبح قصة"
  },
  "Explore ancient kingdoms, misty mountains, golden beaches, wildlife safaris, tea plantations, luxury resorts, hidden waterfalls, and unforgettable cultural experiences.": {
    hi: "प्राचीन राज्यों, धुंध भरे पहाड़ों, सुनहरे समुद्र तटों, वन्यजीव सफारी, चाय बागानों, लक्ज़री रिसॉर्ट्स, छिपे हुए झरनों और अविस्मरणीय सांस्कृतिक अनुभवों का अन्वेषण करें।",
    fr: "Explorez d'anciens royaumes, des montagnes brumeuses, des plages dorées, des safaris, des plantations de thé et des expériences culturelles inoubliables.",
    de: "Erkunden Sie alte Königreiche, neblige Berge, goldene Strände, Tiersafaris, Teeplantagen und unvergessliche kulturelle Erlebnisse.",
    nl: "Verken oude koninkrijken, mistige bergen, gouden stranden, wildsafari's, theeplantages en onvergetelijke culturele ervaringen.",
    ja: "古代の王国、霧深い山々、黄金のビーチ、野生動物のサファリ、茶畑、忘れられない文化体験を探索してください。",
    zh: "探索古老的王国、迷雾缭绕的山脉、金色的海滩、野生动物游猎、茶园以及令人难忘的文化体验。",
    ru: "Исследуйте древние королевства, туманные горы, золотые пляжи, сафари, чайные плантации и незабываемые культурные впечатления.",
    ar: "استكشف الممالك القديمة والجبال الضبابية والشواطئ الذهبية ورحلات السفاري للحياة البرية ومزارع الشاي والتجارب الثقافية التي لا تُنسى."
  },
  "Read Articles": {
    hi: "लेख पढ़ें", fr: "Lire les articles", de: "Artikel lesen", nl: "Artikelen lezen",
    ja: "記事を読む", zh: "阅读文章", ru: "Читать статьи", ar: "اقرأ المقالات"
  },
  "Plan Your Journey": {
    hi: "अपनी यात्रा की योजना बनाएं", fr: "Planifiez votre voyage", de: "Planen Sie Ihre Reise", nl: "Plan je reis",
    ja: "旅行を計画する", zh: "计划您的旅程", ru: "Спланируйте свое путешествие", ar: "خطط لرحلتك"
  },
  "Curated Experiences": {
    hi: "क्यूरेटेड अनुभव", fr: "Expériences sur mesure", de: "Kuratierte Erlebnisse", nl: "Samengestelde ervaringen",
    ja: "厳選された体験", zh: "精选体验", ru: "Кураторские впечатления", ar: "تجارب منسقة"
  },
  "Browse our collection of luxury travel stories by destination and experience type.": {
    hi: "गंतव्य और अनुभव प्रकार के अनुसार लक्ज़री यात्रा कहानियों के हमारे संग्रह को ब्राउज़ करें।",
    fr: "Parcourez notre collection d'histoires de voyage de luxe par destination et type d'expérience.",
    de: "Durchsuchen Sie unsere Sammlung von Luxus-Reisegeschichten nach Reiseziel und Erlebnisart.",
    nl: "Blader door onze collectie luxe reisverhalen op bestemming en ervaringstype.",
    ja: "目的地と体験タイプ別にラグジュアリーな旅行ストーリーのコレクションをご覧ください。",
    zh: "按目的地和体验类型浏览我们的豪华旅行故事集。",
    ru: "Просмотрите нашу коллекцию историй о роскошных путешествиях по местам назначения и типам впечатлений.",
    ar: "تصفح مجموعتنا من قصص السفر الفاخرة حسب الوجهة ونوع التجربة."
  },
  "View All Categories": {
    hi: "सभी श्रेणियां देखें", fr: "Voir toutes les catégories", de: "Alle Kategorien ansehen", nl: "Bekijk alle categorieën",
    ja: "すべてのカテゴリーを表示", zh: "查看所有类别", ru: "Просмотреть все категории", ar: "عرض جميع الفئات"
  },
  "Editor's Choice": {
    hi: "संपादक की पसंद", fr: "Choix de l'éditeur", de: "Auswahl der Redaktion", nl: "Keuze van de redactie",
    ja: "編集者の選択", zh: "编辑精选", ru: "Выбор редактора", ar: "اختيار المحرر"
  },
  "Trending Stories": {
    hi: "ट्रेंडिंग कहानियां", fr: "Histoires tendances", de: "Trendige Geschichten", nl: "Populaire verhalen",
    ja: "トレンド記事", zh: "热门故事", ru: "Популярные истории", ar: "القصص الرائجة"
  },
  "Latest from the Journal": {
    hi: "जर्नल से नवीनतम", fr: "Les dernières nouvelles du Journal", de: "Das Neueste aus dem Journal", nl: "Nieuwste uit het tijdschrift",
    ja: "ジャーナルからの最新情報", zh: "期刊最新动态", ru: "Последнее из журнала", ar: "أحدث الأخبار من المجلة"
  },
  "Explore the Map": {
    hi: "नक्शे का अन्वेषण करें", fr: "Explorer la carte", de: "Karte erkunden", nl: "Verken de kaart",
    ja: "マップを探索", zh: "探索地图", ru: "Исследовать карту", ar: "استكشف الخريطة"
  },
  "Interact with our curated map to discover handpicked destinations, luxury stays, and scenic routes.": {
    hi: "चुनिंदा गंतव्यों, लक्ज़री ठहरने के स्थानों और प्राकृतिक मार्गों की खोज करने के लिए हमारे क्यूरेटेड नक्शे के साथ इंटरैक्ट करें।",
    fr: "Interagissez avec notre carte organisée pour découvrir des destinations triées sur le volet, des séjours de luxe et des routes panoramiques.",
    de: "Interagieren Sie mit unserer kuratierten Karte, um handverlesene Ziele, Luxusunterkünfte und malerische Routen zu entdecken.",
    nl: "Communiceer met onze samengestelde kaart om zorgvuldig uitgekozen bestemmingen, luxe verblijven en schilderachtige routes te ontdekken.",
    ja: "厳選されたマップを操作して、厳選された目的地、豪華な滞在先、風光明媚なルートを見つけてください。",
    zh: "与我们精心策划的地图互动，发现精选目的地、豪华住宿和风景优美的路线。",
    ru: "Взаимодействуйте с нашей тщательно отобранной картой, чтобы открыть для себя лучшие направления, роскошные отели и живописные маршруты.",
    ar: "تفاعل مع خريطتنا المنسقة لاكتشاف الوجهات المختارة بعناية والإقامات الفاخرة والطرق ذات المناظر الخلابة."
  },
  "Open in Google Maps": {
    hi: "गूगल मैप्स में खोलें", fr: "Ouvrir dans Google Maps", de: "In Google Maps öffnen", nl: "Open in Google Maps",
    ja: "Googleマップで開く", zh: "在谷歌地图中打开", ru: "Открыть в Google Картах", ar: "افتح في خرائط جوجل"
  },
  "Through the Lens": {
    hi: "लेंस के माध्यम से", fr: "À travers l'objectif", de: "Durch das Objektiv", nl: "Door de lens",
    ja: "レンズを通して", zh: "透过镜头", ru: "Через объектив", ar: "من خلال العدسة"
  },
  "Cinematic moments captured across the island.": {
    hi: "द्वीप भर में कैद किए गए सिनेमाई क्षण।", fr: "Des moments cinématographiques capturés à travers l'île.", de: "Filmische Momente, eingefangen auf der ganzen Insel.", nl: "Filmische momenten vastgelegd over het hele eiland.",
    ja: "島中で撮影された映画のような瞬間。", zh: "捕捉全岛电影般的瞬间。", ru: "Кинематографические моменты, запечатленные по всему острову.", ar: "لحظات سينمائية تم التقاطها في جميع أنحاء الجزيرة."
  },
  "Essential Guides": {
    hi: "आवश्यक मार्गदर्शिकाएँ", fr: "Guides Essentiels", de: "Wichtige Leitfäden", nl: "Essentiële Gidsen",
    ja: "必須ガイド", zh: "基本指南", ru: "Основные руководства", ar: "أدلة أساسية"
  },
  "Travel Extras": {
    hi: "अतिरिक्त यात्रा सामग्री", fr: "Extras de voyage", de: "Reise-Extras", nl: "Reis Extra's",
    ja: "トラベルエクストラ", zh: "旅行附加项目", ru: "Туристические дополнения", ar: "إضافات السفر"
  },
  "Everything you need to take your journey further.": {
    hi: "अपनी यात्रा को और आगे ले जाने के लिए वह सब कुछ जो आपको चाहिए।", fr: "Tout ce dont vous avez besoin pour aller plus loin dans votre voyage.", de: "Alles, was Sie brauchen, um Ihre Reise voranzubringen.", nl: "Alles wat je nodig hebt om je reis verder te brengen.",
    ja: "旅をさらに楽しむために必要なすべて。", zh: "您深入旅程所需的一切。", ru: "Все, что вам нужно для дальнейшего путешествия.", ar: "كل ما تحتاجه للارتقاء برحلتك إلى أبعد من ذلك."
  },
  "You're Subscribed!": {
    hi: "आपने सदस्यता ले ली है!", fr: "Vous êtes abonné(e) !", de: "Sie sind abonniert!", nl: "Je bent geabonneerd!",
    ja: "登録完了しました！", zh: "您已订阅！", ru: "Вы подписаны!", ar: "لقد اشتركت!"
  },
  "Sigiriya": {
    hi: "सीगिरिया", fr: "Sigiriya", de: "Sigiriya", nl: "Sigiriya", ja: "シギリヤ", zh: "锡吉里耶", ru: "Сигирия", ar: "سيجيريا"
  },
  "Ella": {
    hi: "एला", fr: "Ella", de: "Ella", nl: "Ella", ja: "エラ", zh: "埃拉", ru: "Элла", ar: "إيلا"
  },
  "Kandy": {
    hi: "कैंडी", fr: "Kandy", de: "Kandy", nl: "Kandy", ja: "キャンディ", zh: "康提", ru: "Канди", ar: "كاندي"
  },
  "Mirissa": {
    hi: "मिरिसा", fr: "Mirissa", de: "Mirissa", nl: "Mirissa", ja: "ミリッサ", zh: "美蕊沙", ru: "Мирисса", ar: "ميريسا"
  },
  "Bentota": {
    hi: "बेंटोटा", fr: "Bentota", de: "Bentota", nl: "Bentota", ja: "ベントタ", zh: "本托塔", ru: "Бентота", ar: "بينتوتا"
  },
  "Yala": {
    hi: "याला", fr: "Yala", de: "Yala", nl: "Yala", ja: "ヤラ", zh: "雅拉", ru: "Яла", ar: "يالا"
  },
  "Arugam Bay": {
    hi: "अरुगम बे", fr: "Arugam Bay", de: "Arugam Bay", nl: "Arugam Bay", ja: "アルガンベイ", zh: "阿鲁甘湾", ru: "Аругам-Бэй", ar: "أروغام باي"
  },
  "Trincomalee": {
    hi: "ट्रिंकोमाली", fr: "Trincomalee", de: "Trincomalee", nl: "Trincomalee", ja: "トリンコマリー", zh: "亭可马里", ru: "Тринкомали", ar: "ترينكومالي"
  },
  "Nuwara Eliya": {
    hi: "नुवारा एलिया", fr: "Nuwara Eliya", de: "Nuwara Eliya", nl: "Nuwara Eliya", ja: "ヌワラエリヤ", zh: "努沃勒埃利耶", ru: "Нувара-Элия", ar: "نوارا إيليا"
  },
  "Anuradhapura": {
    hi: "अनुराधापुरा", fr: "Anuradhapura", de: "Anuradhapura", nl: "Anuradhapura", ja: "アヌラーダプラ", zh: "阿努拉德普勒", ru: "Анурадхапура", ar: "أنورادابورا"
  },
  "Polonnaruwa": {
    hi: "पोलोन्नारुवा", fr: "Polonnaruwa", de: "Polonnaruwa", nl: "Polonnaruwa", ja: "ポロンナルワ", zh: "波隆纳鲁瓦", ru: "Полоннарува", ar: "بولوناروا"
  },
  "Galle": {
    hi: "गाले", fr: "Galle", de: "Galle", nl: "Galle", ja: "ゴール", zh: "加勒", ru: "Галле", ar: "جالي"
  }
};

const langs = ['hi', 'fr', 'de', 'nl', 'ja', 'zh', 'ru', 'ar'];

for (const lang of langs) {
  const file = `./src/locales/${lang}.json`;
  if (fs.existsSync(file)) {
    let data = JSON.parse(fs.readFileSync(file, 'utf8'));
    for (const [key, tr] of Object.entries(translations)) {
      data[key] = tr[lang];
    }
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    console.log(`Updated ${lang}.json`);
  }
}
