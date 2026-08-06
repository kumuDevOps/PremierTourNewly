const fs = require('fs');

const missingFallbacks = {
  "Working together to bring you the best of each destination": {
    zh: "携手为您带来每个目的地的最佳体验",
    ja: "各目的地の最高の体験をお届けするために協力しています",
    de: "Wir arbeiten zusammen, um Ihnen das Beste jedes Reiseziels zu bieten",
    fr: "Nous travaillons ensemble pour vous offrir le meilleur de chaque destination",
    nl: "Samenwerken om u het beste van elke bestemming te bieden",
    ru: "Работаем вместе, чтобы предложить вам лучшее в каждом направлении",
    hi: "प्रत्येक गंतव्य का सर्वश्रेष्ठ आपके लिए लाने के लिए एक साथ काम कर रहे हैं",
    ar: "نعمل معًا لتقديم أفضل ما في كل وجهة"
  },
  "Explore carefully curated escapes and top holiday deals selected by our expert travel guides.": {
    zh: "探索由我们的专业旅游指南精心挑选的度假胜地和顶级假日优惠。",
    ja: "専門のトラベルガイドが厳選した、慎重に選ばれたエスケープとトップホリデーのお得な情報をご覧ください。",
    de: "Entdecken Sie sorgfältig kuratierte Ausflugsziele und Top-Urlaubsangebote, ausgewählt von unseren Experten.",
    fr: "Explorez des escapades soigneusement sélectionnées et les meilleures offres de vacances par nos guides de voyage experts.",
    nl: "Ontdek zorgvuldig samengestelde ontsnappingen en top vakantiedeals geselecteerd door onze deskundige reisgidsen.",
    ru: "Откройте для себя тщательно отобранные места для отдыха и лучшие предложения на отпуск, выбранные нашими экспертами.",
    hi: "हमारे विशेषज्ञ यात्रा गाइडों द्वारा चुने गए ध्यानपूर्वक तैयार किए गए एस्केप और शीर्ष अवकाश सौदों का अन्वेषण करें।",
    ar: "استكشف ملاذات مختارة بعناية وأفضل عروض العطلات التي اختارها خبراء السفر لدينا."
  },
  "Exquisite Luxury,": {
    zh: "极致奢华，",
    ja: "極上の贅沢、",
    de: "Exquisiter Luxus,",
    fr: "Luxe exquis,",
    nl: "Prachtige Luxe,",
    ru: "Изысканная роскошь,",
    hi: "उत्कृष्ट विलासिता,",
    ar: "فخامة رائعة،"
  },
  "Unrestricted Paths": {
    zh: "无界之旅",
    ja: "制限のない道",
    de: "Unbegrenzte Wege",
    fr: "Chemins sans restriction",
    nl: "Onbeperkte Wegen",
    ru: "Неограниченные пути",
    hi: "अप्रतिबंधित पथ",
    ar: "مسارات غير مقيدة"
  },
  "The Ultimate Luxury Guide to Sigiriya Rock Fortress": {
    zh: "狮子岩终极奢华指南",
    ja: "シギリヤ・ロックの究極のラグジュアリーガイド",
    de: "Der ultimative Luxus-Guide für die Felsenfestung Sigiriya",
    fr: "Le guide de luxe ultime de la forteresse du rocher de Sigiriya",
    nl: "De ultieme luxe gids voor het rotsfort van Sigiriya",
    ru: "Полный путеводитель по роскоши в скальной крепости Сигирия",
    hi: "सिगिरिया रॉक किले के लिए अंतिम विलासिता गाइड",
    ar: "الدليل الفاخر المطلق لقلعة صخرة سيجيريا"
  },
  "Ella – Sri Lanka's Most Beautiful Mountain Escape": {
    zh: "埃拉——斯里兰卡最美的山区避世胜地",
    ja: "エラ – スリランカで最も美しい山の逃避行",
    de: "Ella – Sri Lankas schönster Bergrückzugsort",
    fr: "Ella – La plus belle escapade en montagne du Sri Lanka",
    nl: "Ella – Sri Lanka's mooiste bergresort",
    ru: "Элла – Самый красивый горный курорт Шри-Ланки",
    hi: "एला - श्रीलंका का सबसे खूबसूरत पहाड़ी एस्केप",
    ar: "إيلا - أجمل ملاذ جبلي في سريلانكا"
  },
  "10 Hidden Beaches You Must Visit in Sri Lanka": {
    zh: "斯里兰卡必去的 10 个隐藏海滩",
    ja: "スリランカで絶対に訪れるべき10の隠れたビーチ",
    de: "10 versteckte Strände in Sri Lanka, die Sie besuchen müssen",
    fr: "10 plages cachées à visiter absolument au Sri Lanka",
    nl: "10 verborgen stranden die je moet bezoeken in Sri Lanka",
    ru: "10 скрытых пляжей, которые вы должны посетить на Шри-Ланке",
    hi: "श्रीलंका में आपको 10 छिपे हुए समुद्र तटों का दौरा करना चाहिए",
    ar: "10 شواطئ مخفية يجب عليك زيارتها في سريلانكا"
  },
  "The Scenic Train Journey from Kandy to Ella": {
    zh: "从康提到埃拉的绝美火车之旅",
    ja: "キャンディからエラへの風光明媚な列車の旅",
    de: "Die malerische Zugfahrt von Kandy nach Ella",
    fr: "Le voyage pittoresque en train de Kandy à Ella",
    nl: "De schilderachtige treinreis van Kandy naar Ella",
    ru: "Живописная поездка на поезде из Канди в Эллу",
    hi: "कैंडी से एला तक की सुंदर ट्रेन यात्रा",
    ar: "رحلة القطار ذات المناظر الخلابة من كاندي إلى إيلا"
  },
  "Yala National Park Safari Guide": {
    zh: "雅拉国家公园野生动物园指南",
    ja: "ヤーラ国立公園サファリガイド",
    de: "Safari-Leitfaden für den Yala-Nationalpark",
    fr: "Guide du safari dans le parc national de Yala",
    nl: "Yala National Park Safarigids",
    ru: "Руководство по сафари в национальном парке Яла",
    hi: "याला राष्ट्रीय उद्यान सफारी गाइड",
    ar: "دليل رحلات السفاري في حديقة يالا الوطنية"
  },
  "Luxury Hotels in Sri Lanka Worth Every Dollar": {
    zh: "斯里兰卡物超所值的豪华酒店",
    ja: "スリランカの価値ある高級ホテル",
    de: "Luxushotels in Sri Lanka, die jeden Dollar wert sind",
    fr: "Hôtels de luxe au Sri Lanka qui valent chaque dollar",
    nl: "Luxe hotels in Sri Lanka die elke dollar waard zijn",
    ru: "Роскошные отели Шри-Ланки, стоящие каждого доллара",
    hi: "श्रीलंका में हर डॉलर के लायक लक्जरी होटल",
    ar: "فنادق فخمة في سريلانكا تستحق كل دولار"
  },
  "Tea Plantation Experiences in Nuwara Eliya": {
    zh: "努沃勒埃利耶的茶园体验",
    ja: "ヌワラエリヤでの茶畑体験",
    de: "Teepflanzung-Erlebnisse in Nuwara Eliya",
    fr: "Expériences dans les plantations de thé à Nuwara Eliya",
    nl: "Theeplantage-ervaringen in Nuwara Eliya",
    ru: "Опыт на чайных плантациях в Нувара-Элии",
    hi: "नुवारा एलिया में चाय बागान के अनुभव",
    ar: "تجارب مزارع الشاي في نوارا إليا"
  },
  "Best Waterfalls in Sri Lanka": {
    zh: "斯里兰卡最美的瀑布",
    ja: "スリランカの最高の滝",
    de: "Die besten Wasserfälle in Sri Lanka",
    fr: "Les meilleures cascades du Sri Lanka",
    nl: "Beste watervallen in Sri Lanka",
    ru: "Лучшие водопады на Шри-Ланке",
    hi: "श्रीलंका में सबसे अच्छे झरने",
    ar: "أفضل الشلالات في سريلانكا"
  },
  "A Complete Guide to Galle Fort": {
    zh: "加勒古堡完整指南",
    ja: "ゴール・フォートへの完全なガイド",
    de: "Ein kompletter Reiseführer für das Galle Fort",
    fr: "Un guide complet du fort de Galle",
    nl: "Een complete gids voor Galle Fort",
    ru: "Полный путеводитель по форту Галле",
    hi: "गैले फोर्ट के लिए एक पूरी गाइड",
    ar: "دليل شامل لقلعة جالي"
  },
  "The Best Time to Visit Sri Lanka": {
    zh: "访问斯里兰卡的最佳时间",
    ja: "スリランカを訪れるのに最適な時期",
    de: "Die beste Zeit für einen Besuch in Sri Lanka",
    fr: "La meilleure période pour visiter le Sri Lanka",
    nl: "De beste tijd om Sri Lanka te bezoeken",
    ru: "Лучшее время для посещения Шри-Ланки",
    hi: "श्रीलंका की यात्रा का सबसे अच्छा समय",
    ar: "أفضل وقت لزيارة سريلانكا"
  },
  "Top Romantic Honeymoon Destinations": {
    zh: "顶级浪漫蜜月目的地",
    ja: "トップのロマンチックなハネムーンの目的地",
    de: "Top romantische Flitterwochenziele",
    fr: "Top des destinations de lune de miel romantiques",
    nl: "Top romantische huwelijksreisbestemmingen",
    ru: "Лучшие романтические места для медового месяца",
    hi: "शीर्ष रोमांटिक हनीमून गंतव्य",
    ar: "أفضل وجهات شهر العسل الرومانسية"
  },
  "Luxury Wellness Retreats in Sri Lanka": {
    zh: "斯里兰卡的豪华健康疗养地",
    ja: "スリランカの豪華なウェルネスリトリート",
    de: "Luxuriöse Wellness-Retreats in Sri Lanka",
    fr: "Retraites de bien-être de luxe au Sri Lanka",
    nl: "Luxe wellness-retraites in Sri Lanka",
    ru: "Роскошные оздоровительные курорты на Шри-Ланке",
    hi: "श्रीलंका में लक्जरी वेलनेस रिट्रीट",
    ar: "منتجعات العافية الفاخرة في سريلانكا"
  },
  "Ascend the ancient Lion Rock in style. Discover private guided tours, nearby boutique luxury stays, and hidden sunset viewpoints away from the crowds.": {
    zh: "以格调登顶古老的狮子岩。探索私人导览、附近的精品豪华住宿和远离人群的隐藏日落观景点。",
    ja: "スタイリッシュに古代のライオンロックに登ります。プライベートガイドツアー、近くのブティックラグジュアリーステイ、人混みから離れた隠れた夕日の絶景ポイントを発見してください。",
    de: "Erklimmen Sie den alten Löwenfelsen mit Stil. Entdecken Sie private Führungen, luxuriöse Boutique-Aufenthalte in der Nähe und versteckte Aussichtspunkte für Sonnenuntergänge abseits der Massen.",
    fr: "Ascensionnez l'ancien rocher du Lion avec style. Découvrez des visites guidées privées, des séjours de luxe en boutique à proximité et des points de vue cachés sur le coucher du soleil loin des foules.",
    nl: "Beklim de oude Leeuwenrots in stijl. Ontdek privé-rondleidingen, nabijgelegen luxe boetiekverblijven en verborgen zonsondergang-uitkijkpunten weg van de drukte.",
    ru: "Поднимитесь на древнюю Львиную скалу стильно. Откройте для себя частные экскурсии, близлежащие бутик-отели и скрытые места для наблюдения за закатом вдали от толпы.",
    hi: "स्टाइल में प्राचीन शेर रॉक पर चढ़ें। निजी निर्देशित पर्यटन, आस-पास के बुटीक लक्जरी प्रवास और भीड़ से दूर छिपे हुए सूर्यास्त के दृष्टिकोण की खोज करें।",
    ar: "اصعد صخرة الأسد القديمة بأناقة. اكتشف الجولات الإرشادية الخاصة، والإقامات الفاخرة القريبة، ونقاط مراقبة غروب الشمس المخفية بعيدًا عن الزحام."
  },
  "Mist-shrouded tea estates, the iconic Nine Arch Bridge, and exclusive eco-lodges make Ella the crown jewel of the high country.": {
    zh: "雾气缭绕的茶园、标志性的九孔桥和独家生态小屋使埃拉成为高地的皇冠明珠。",
    ja: "霧に包まれた茶畑、象徴的なナインアーチブリッジ、そして高級エコロッジがエラを高地の最高の宝石にしています。",
    de: "Nebelverhangene Teeplantagen, die ikonische Nine Arch Bridge und exklusive Öko-Lodges machen Ella zum Kronjuwel des Hochlandes.",
    fr: "Des plantations de thé enveloppées de brume, l'emblématique pont aux neuf arches et des écolodges exclusifs font d'Ella le joyau de la couronne des hautes terres.",
    nl: "In mist gehulde theeplantages, de iconische Nine Arch Bridge en exclusieve eco-lodges maken Ella tot de kroonjuweel van het hoogland.",
    ru: "Окутанные туманом чайные плантации, знаменитый девятиарочный мост и эксклюзивные эко-лоджи делают Эллу жемчужиной высокогорья.",
    hi: "कोहरे से ढकी चाय की संपदा, प्रतिष्ठित नाइन आर्क ब्रिज और विशेष इको-लॉज एला को उच्च देश का ताज गहना बनाते हैं।",
    ar: "تعد مزارع الشاي المغطاة بالضباب، وجسر ذو الأقواس التسعة الشهير، والنزل البيئية الحصرية إيلا جوهرة التاج في المنطقة المرتفعة."
  },
  "Escape the popular southern coast and discover secluded golden sands where luxury villas and pristine waters await.": {
    zh: "逃离热门的南部海岸，发现豪华别墅和原始水域等待着的隐秘金色沙滩。",
    ja: "人気の南海岸を逃れ、豪華なヴィラと手つかずの海が待つ人里離れた黄金の砂浜を発見してください。",
    de: "Entfliehen Sie der beliebten Südküste und entdecken Sie abgelegene goldene Sandstrände, wo Luxusvillen und unberührtes Wasser auf Sie warten.",
    fr: "Échappez à la côte sud populaire et découvrez des sables dorés isolés où des villas de luxe et des eaux immaculées vous attendent.",
    nl: "Ontsnap aan de populaire zuidkust en ontdek afgelegen gouden zandstranden waar luxe villa's en ongerepte wateren wachten.",
    ru: "Сбегите от популярного южного побережья и откройте для себя уединенные золотые пески, где вас ждут роскошные виллы и чистейшие воды.",
    hi: "लोकप्रिय दक्षिणी तट से बचें और एकान्त सुनहरी रेत की खोज करें जहाँ लक्जरी विला और प्राचीन जल आपका इंतजार कर रहे हैं।",
    ar: "اهرب من الساحل الجنوبي الشهير واكتشف الرمال الذهبية المنعزلة حيث تنتظرك الفيلات الفاخرة والمياه النقية."
  },
  "Experience the world's most beautiful train ride. Tips for securing first-class observation tickets and capturing the best photos.": {
    zh: "体验世界上最美的火车之旅。确保获取头等舱全景车厢车票和拍摄最佳照片的提示。",
    ja: "世界で最も美しい列車の旅を体験してください。ファーストクラスの展望席チケットを確保し、最高の写真を撮るためのヒント。",
    de: "Erleben Sie die schönste Zugfahrt der Welt. Tipps zur Sicherung von Erstklass-Aussichtstickets und zum Einfangen der besten Fotos.",
    fr: "Vivez le plus beau voyage en train du monde. Conseils pour obtenir des billets d'observation en première classe et capturer les meilleures photos.",
    nl: "Ervaar de mooiste treinreis ter wereld. Tips voor het beveiligen van eersterangs observatietickets en het maken van de beste foto's.",
    ru: "Испытайте самую красивую в мире поездку на поезде. Советы по получению билетов в смотровой вагон первого класса и съемке лучших фотографий.",
    hi: "दुनिया की सबसे खूबसूरत ट्रेन की सवारी का अनुभव करें। प्रथम श्रेणी के अवलोकन टिकट हासिल करने और सर्वोत्तम तस्वीरें खींचने के लिए टिप्स।",
    ar: "جرب أجمل رحلة قطار في العالم. نصائح للحصول على تذاكر الدرجة الأولى لكابينة المراقبة والتقاط أفضل الصور."
  },
  "Track leopards in their natural habitat while staying in ultra-luxury tented camps that blend wilderness with five-star comfort.": {
    zh: "在自然栖息地追踪豹子，同时入住将荒野与五星级舒适相结合的超豪华帐篷营地。",
    ja: "自然の生息地でヒョウを追跡しながら、荒野と5つ星の快適さを融合させた超豪華なテントキャンプに滞在します。",
    de: "Verfolgen Sie Leoparden in ihrem natürlichen Lebensraum und übernachten Sie in ultra-luxuriösen Zeltcamps, die Wildnis mit 5-Sterne-Komfort verbinden.",
    fr: "Pistez les léopards dans leur habitat naturel tout en séjournant dans des camps de tentes ultra-luxueux qui allient nature sauvage et confort cinq étoiles.",
    nl: "Volg luipaarden in hun natuurlijke habitat terwijl je verblijft in ultraluxe tentenkampen die wildernis combineren met vijfsterrencomfort.",
    ru: "Выслеживайте леопардов в их естественной среде обитания, останавливаясь в ультра-роскошных палаточных лагерях, которые сочетают дикую природу с пятизвездочным комфортом.",
    hi: "प्रकृति के साथ पाँच-सितारा आराम को मिलाने वाले अल्ट्रा-लक्जरी टेंट शिविरों में रहते हुए उनके प्राकृतिक आवास में तेंदुओं को ट्रैक करें।",
    ar: "تتبع الفهود في بيئتها الطبيعية أثناء الإقامة في مخيمات الخيام الفاخرة للغاية التي تمزج البرية مع راحة خمس نجوم."
  },
  "An exclusive curation of Aman resorts, boutique colonial manors, and contemporary wellness retreats across the island.": {
    zh: "安缦度假村、精品殖民地庄园和遍布全岛的现代健康疗养地的独家精选。",
    ja: "島全体に広がるアマンリゾート、ブティックコロニアルマナー、現代的なウェルネスリトリートの独占的なキュレーション。",
    de: "Eine exklusive Auswahl an Aman-Resorts, Boutique-Kolonialherrenhäusern und modernen Wellness-Retreats auf der ganzen Insel.",
    fr: "Une sélection exclusive de complexes hôteliers Aman, de manoirs coloniaux de charme et de retraites de bien-être contemporaines à travers l'île.",
    nl: "Een exclusieve selectie van Aman resorts, boutique koloniale landhuizen en hedendaagse wellness retraites verspreid over het eiland.",
    ru: "Эксклюзивная подборка курортов Аман, бутиковых колониальных поместий и современных оздоровительных курортов по всему острову.",
    hi: "द्वीप भर में अमन रिसॉर्ट्स, बुटीक औपनिवेशिक जागीरों और समकालीन वेलनेस रिट्रीट का एक विशेष क्यूरेशन।",
    ar: "مجموعة حصرية من منتجعات أمان، والقصور الاستعمارية البوتيكية، ومنتجعات العافية المعاصرة في جميع أنحاء الجزيرة."
  },
  "Step back in time to \"Little England.\" Experience high tea, private tasting tours, and stays in meticulously restored planter bungalows.": {
    zh: "回到“小英格兰”。体验下午茶、私人品鉴之旅，以及入住经过精心修复的种植园小屋。",
    ja: "「リトルイングランド」へタイムスリップ。ハイティー、プライベートテイスティングツアー、そして細心の注意を払って復元されたプランターバンガローでの滞在を体験してください。",
    de: "Machen Sie eine Zeitreise nach „Little England“. Erleben Sie High Tea, private Verkostungstouren und Aufenthalte in sorgfältig restaurierten Pflanzer-Bungalows.",
    fr: "Remontez le temps jusqu'à la « petite Angleterre ». Faites l'expérience du goûter, de visites de dégustation privées et de séjours dans des bungalows de planteurs méticuleusement restaurés.",
    nl: "Ga terug in de tijd naar \"Little England\". Ervaar high tea, privé proeverij tours en verblijven in zorgvuldig gerestaureerde planter bungalows.",
    ru: "Совершите путешествие во времени в «Маленькую Англию». Испытайте послеобеденный чай, частные дегустационные туры и пребывание в тщательно отреставрированных бунгало плантаторов.",
    hi: "\"लिटल इंग्लैंड\" में समय में पीछे कदम रखें। हाई टी, निजी चखने के पर्यटन और सावधानीपूर्वक बहाल किए गए प्लांटर बंगलों में प्रवास का अनुभव करें।",
    ar: "عد بالزمن إلى الوراء إلى \"إنجلترا الصغيرة\". جرب الشاي العالي، وجولات التذوق الخاصة، والإقامات في بنغلات المزارعين التي تم ترميمها بدقة."
  },
  "From Bambarakanda to Diyaluma. Discover the island's majestic cascading falls and the best times to visit for swimming.": {
    zh: "从班巴拉坎达到迪亚卢马。探索岛上壮丽的层叠瀑布以及最适合游泳的访问时间。",
    ja: "バンバラカンダからディヤルマまで。島を代表する雄大な滝と水泳に最適な訪問時期を発見してください。",
    de: "Von Bambarakanda nach Diyaluma. Entdecken Sie die majestätischen Wasserfälle der Insel und die besten Zeiten für einen Besuch zum Schwimmen.",
    fr: "De Bambarakanda à Diyaluma. Découvrez les majestueuses chutes d'eau de l'île et les meilleurs moments pour les visiter pour la baignade.",
    nl: "Van Bambarakanda tot Diyaluma. Ontdek de majestueuze watervallen van het eiland en de beste tijden om te bezoeken om te zwemmen.",
    ru: "От Бамбараканды до Диялумы. Откройте для себя величественные каскадные водопады острова и лучшее время для посещения для купания.",
    hi: "बंबराकांडा से दियालुमा तक। द्वीप के राजसी झरनों की खोज करें और तैरने के लिए यात्रा करने का सबसे अच्छा समय।",
    ar: "من بامباراكاندا إلى ديالوما. اكتشف الشلالات المتتالية المهيبة في الجزيرة وأفضل الأوقات لزيارتها للسباحة."
  },
  "Wander cobbled streets lined with Dutch-colonial buildings, chic boutiques, and world-class seafood restaurants.": {
    zh: "漫步在两旁排列着荷兰殖民时期建筑、别致精品店和世界级海鲜餐厅的鹅卵石街道上。",
    ja: "オランダ植民地時代の建物、シックなブティック、世界クラスのシーフードレストランが並ぶ石畳の通りを散策します。",
    de: "Schlendern Sie durch gepflasterte Straßen, gesäumt von Gebäuden aus der holländischen Kolonialzeit, schicken Boutiquen und erstklassigen Fischrestaurants.",
    fr: "Promenez-vous dans les rues pavées bordées de bâtiments coloniaux néerlandais, de boutiques chics et de restaurants de fruits de mer de classe mondiale.",
    nl: "Dwaal door geplaveide straten omzoomd met gebouwen uit de Nederlandse koloniale tijd, chique boetieks en visrestaurants van wereldklasse.",
    ru: "Бродите по мощеным улицам с зданиями в стиле голландского колониализма, шикарными бутиками и ресторанами мирового класса, предлагающими морепродукты.",
    hi: "डच-औपनिवेशिक इमारतों, ठाठ बुटीक और विश्व स्तरीय समुद्री भोजन रेस्तरां से सजी कोब्बलस्टोन सड़कों पर घूमें।",
    ar: "تجول في الشوارع المرصوفة بالحصى التي تصطف على جانبيها المباني الاستعمارية الهولندية والبوتيكات الأنيقة ومطاعم المأكولات البحرية ذات المستوى العالمي."
  },
  "Navigate the island's two monsoon seasons. A month-by-month breakdown to help you plan the perfect tropical getaway.": {
    zh: "应对岛上的两个季风季节。按月划分的详细指南，帮助您规划完美的热带假期。",
    ja: "島の2つのモンスーンシーズンを乗り越えましょう。完璧なトロピカルな休暇を計画するのに役立つ月ごとの内訳。",
    de: "Navigieren Sie durch die beiden Monsunzeiten der Insel. Eine monatliche Aufschlüsselung, die Ihnen bei der Planung des perfekten tropischen Kurzurlaubs hilft.",
    fr: "Naviguez à travers les deux saisons de mousson de l'île. Une répartition mois par mois pour vous aider à planifier l'escapade tropicale parfaite.",
    nl: "Navigeer door de twee moessonseizoenen van het eiland. Een maand-tot-maand specificatie om u te helpen bij het plannen van het perfecte tropische uitje.",
    ru: "Изучите два сезона дождей на острове. Помесячный разбор, который поможет вам спланировать идеальный тропический отдых.",
    hi: "द्वीप के दो मानसून मौसमों को नेविगेट करें। सही उष्णकटिबंधीय पलायन की योजना बनाने में आपकी मदद करने के लिए महीने-दर-महीने का टूटना।",
    ar: "تصفح موسمي الرياح الموسمية في الجزيرة. تحليل شهري لمساعدتك في التخطيط لعطلة استوائية مثالية."
  },
  "From secluded private pool villas in Tangalle to misty romantic hideaways in the central highlands.": {
    zh: "从唐加勒隐秘的私人泳池别墅到中部高地雾气蒙蒙的浪漫避风港。",
    ja: "タンガレの静かなプライベートプールヴィラから、中央高地の霧に包まれたロマンチックな隠れ家まで。",
    de: "Von abgelegenen privaten Poolvillen in Tangalle bis hin zu nebligen, romantischen Verstecken im zentralen Hochland.",
    fr: "Des villas isolées avec piscine privée à Tangalle aux refuges romantiques et brumeux dans les hauts plateaux du centre.",
    nl: "Van afgelegen privézwembadvilla's in Tangalle tot mistige romantische schuilplaatsen in de centrale hooglanden.",
    ru: "От уединенных вилл с частным бассейном в Тангалле до туманных романтических укрытий в центральном высокогорье.",
    hi: "तंगाले में एकांत निजी पूल विला से लेकर मध्य हाइलैंड्स में धुंधले रोमांटिक ठिकाने तक।",
    ar: "من فيلات حمامات السباحة الخاصة المنعزلة في تانجالي إلى المخابئ الرومانسية الضبابية في المرتفعات الوسطى."
  },
  "Rejuvenate your mind, body, and soul with authentic Ayurvedic treatments in the world's most serene natural settings.": {
    zh: "在世界上最宁静的自然环境中，通过正宗的阿育吠陀疗法使您的身心和灵魂重新焕发活力。",
    ja: "世界で最も穏やかな自然環境の中で、本格的なアーユルヴェーダトリートメントで心、体、魂を活性化させましょう。",
    de: "Verjüngen Sie Ihren Geist, Körper und Ihre Seele mit authentischen Ayurveda-Behandlungen in den friedlichsten natürlichen Umgebungen der Welt.",
    fr: "Rajeunissez votre esprit, votre corps et votre âme avec des traitements ayurvédiques authentiques dans les environnements naturels les plus sereins au monde.",
    nl: "Verjong je geest, lichaam en ziel met authentieke Ayurvedische behandelingen in 's werelds meest serene natuurlijke omgevingen.",
    ru: "Омолодите свой разум, тело и душу с помощью аутентичных аюрведических процедур в самых безмятежных природных уголках мира.",
    hi: "दुनिया की सबसे शांत प्राकृतिक सेटिंग्स में प्रामाणिक आयुर्वेदिक उपचार के साथ अपने दिमाग, शरीर और आत्मा को फिर से जीवंत करें।",
    ar: "جدد نشاط عقلك وجسدك وروحك من خلال علاجات الأيورفيدا الأصيلة في أكثر البيئات الطبيعية هدوءًا في العالم."
  },
  "Heritage": {
    zh: "遗产",
    ja: "遺産",
    de: "Erbe",
    fr: "Patrimoine",
    nl: "Erfgoed",
    ru: "Наследие",
    hi: "विरासत",
    ar: "تراث"
  },
  "Hill Country": {
    zh: "高地",
    ja: "山岳地帯",
    de: "Bergland",
    fr: "Région des collines",
    nl: "Heuvelland",
    ru: "Горная страна",
    hi: "पहाड़ी देश",
    ar: "منطقة التلال"
  },
  "Beaches": {
    zh: "海滩",
    ja: "ビーチ",
    de: "Strände",
    fr: "Plages",
    nl: "Stranden",
    ru: "Пляжи",
    hi: "समुद्र तटों",
    ar: "شواطئ"
  },
  "Trains": {
    zh: "火车",
    ja: "列車",
    de: "Züge",
    fr: "Trains",
    nl: "Treinen",
    ru: "Поезда",
    hi: "ट्रेनें",
    ar: "القطارات"
  },
  "Luxury Escapes": {
    zh: "豪华之旅",
    ja: "豪華なエスケープ",
    de: "Luxus-Kurzurlaube",
    fr: "Escapades de luxe",
    nl: "Luxe Uitjes",
    ru: "Роскошный отдых",
    hi: "लक्जरी एस्केप",
    ar: "ملاذات فاخرة"
  },
  "Eco Tourism": {
    zh: "生态旅游",
    ja: "エコツーリズム",
    de: "Ökotourismus",
    fr: "Écotourisme",
    nl: "Ecotourisme",
    ru: "Экотуризм",
    hi: "इको टूरिज्म",
    ar: "السياحة البيئية"
  },
  "Travel Tips": {
    zh: "旅行提示",
    ja: "旅行のヒント",
    de: "Reisetipps",
    fr: "Conseils de voyage",
    nl: "Reistips",
    ru: "Советы путешественникам",
    hi: "यात्रा युक्तियाँ",
    ar: "نصائح السفر"
  },
  "8 min read": { zh: "8 分钟阅读", ja: "8分で読める", de: "8 Min Lesezeit", fr: "8 min de lecture", nl: "8 min leestijd", ru: "8 мин чтения", hi: "8 मिनट का पाठ", ar: "قراءة لمدة 8 دقائق" },
  "6 min read": { zh: "6 分钟阅读", ja: "6分で読める", de: "6 Min Lesezeit", fr: "6 min de lecture", nl: "6 min leestijd", ru: "6 мин чтения", hi: "6 मिनट का पाठ", ar: "قراءة لمدة 6 دقائق" },
  "7 min read": { zh: "7 分钟阅读", ja: "7分で読める", de: "7 Min Lesezeit", fr: "7 min de lecture", nl: "7 min leestijd", ru: "7 мин чтения", hi: "7 मिनट का पाठ", ar: "قراءة لمدة 7 دقائق" },
  "5 min read": { zh: "5 分钟阅读", ja: "5分で読める", de: "5 Min Lesezeit", fr: "5 min de lecture", nl: "5 min leestijd", ru: "5 мин чтения", hi: "5 मिनट का पाठ", ar: "قراءة لمدة 5 دقائق" },
  "10 min read": { zh: "10 分钟阅读", ja: "10分で読める", de: "10 Min Lesezeit", fr: "10 min de lecture", nl: "10 min leestijd", ru: "10 мин чтения", hi: "10 मिनट का पाठ", ar: "قراءة لمدة 10 دقائق" },
  "12 min read": { zh: "12 分钟阅读", ja: "12分で読める", de: "12 Min Lesezeit", fr: "12 min de lecture", nl: "12 min leestijd", ru: "12 мин чтения", hi: "12 मिनट का पाठ", ar: "قراءة لمدة 12 دقائق" },
  "4 min read": { zh: "4 分钟阅读", ja: "4分で読める", de: "4 Min Lesezeit", fr: "4 min de lecture", nl: "4 min leestijd", ru: "4 мин чтения", hi: "4 मिनट का पाठ", ar: "قراءة لمدة 4 دقائق" },
  "9 min read": { zh: "9 分钟阅读", ja: "9分で読める", de: "9 Min Lesezeit", fr: "9 min de lecture", nl: "9 min leestijd", ru: "9 мин чтения", hi: "9 मिनट का पाठ", ar: "قراءة لمدة 9 دقائق" },
  "11 min read": { zh: "11 分钟阅读", ja: "11分で読める", de: "11 Min Lesezeit", fr: "11 min de lecture", nl: "11 min leestijd", ru: "11 мин чтения", hi: "11 मिनट का पाठ", ar: "قراءة لمدة 11 دقائق" }
};

const dirs = ["src/locales", "public/locales"];
const locales = ["en", "de", "fr", "nl", "ja", "zh", "ru", "hi", "ar"];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) return;
  locales.forEach(lang => {
    const filePath = `${dir}/${lang}.json`;
    if (fs.existsSync(filePath)) {
      let json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      for (const [key, langMap] of Object.entries(missingFallbacks)) {
        if (lang === 'en') {
          json[key] = key;
        } else if (langMap[lang]) {
          json[key] = langMap[lang];
        } else {
          // just in case we miss it, don't crash
        }
      }
      fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
    }
  });
});

console.log('done patching translations in both folders');
