const fs = require('fs');

const d = {
  "All international departures hosted by Premier Tour include 1 cabin carry-on (up to 8kg) and 1 checked suitcase (up to 23kg) at no extra charge.": {
    hi: "प्रीमियर टूर द्वारा आयोजित सभी अंतरराष्ट्रीय प्रस्थानों में 1 केबिन कैरी-ऑन (8 किग्रा तक) और 1 चेक किया हुआ सूटकेस (23 किग्रा तक) बिना किसी अतिरिक्त शुल्क के शामिल हैं।",
    fr: "Tous les départs internationaux organisés par Premier Tour incluent 1 bagage cabine (jusqu'à 8 kg) et 1 valise enregistrée (jusqu'à 23 kg) sans frais supplémentaires.",
    de: "Bei allen internationalen Abflügen von Premier Tour sind 1 Handgepäckstück (bis zu 8 kg) und 1 aufgegebener Koffer (bis zu 23 kg) ohne Aufpreis inbegriffen.",
    nl: "Alle internationale vertrekken georganiseerd door Premier Tour zijn inclusief 1 handbagage (tot 8 kg) en 1 ingecheckte koffer (tot 23 kg) zonder extra kosten.",
    ru: "Все международные рейсы, организованные Premier Tour, включают 1 ручную кладь (до 8 кг) и 1 зарегистрированный чемодан (до 23 кг) без дополнительной оплаты.",
    ja: "プレミアツアーが主催するすべての国際線の出発には、機内持ち込み手荷物1個（最大8kg）と預け入れ荷物1個（最大23kg）が追加料金なしで含まれています。",
    zh: "由 Premier Tour 主办的所有国际航班均免费提供 1 件手提行李（不超过 8 公斤）和 1 件托运行李（不超过 23 公斤）。",
    ar: "تتضمن جميع رحلات المغادرة الدولية التي تنظمها شركة Premier Tour حقيبة يد واحدة (حتى 8 كجم) وحقيبة سفر واحدة مسجلة (حتى 23 كجم) دون أي تكلفة إضافية.",
    es: "Todas las salidas internacionales organizadas por Premier Tour incluyen 1 equipaje de mano (hasta 8 kg) y 1 maleta facturada (hasta 23 kg) sin cargo adicional.",
    pt: "Todas as partidas internacionais organizadas pela Premier Tour incluem 1 bagagem de mão (até 8 kg) e 1 mala despachada (até 23 kg) sem custo adicional."
  },
  "Compare international flights and reserve your premium cabin seats seamlessly.": {
    hi: "अंतरराष्ट्रीय उड़ानों की तुलना करें और अपनी प्रीमियम केबिन सीटों को निर्बाध रूप से आरक्षित करें।",
    fr: "Comparez les vols internationaux et réservez vos sièges en cabine premium en toute transparence.",
    de: "Vergleichen Sie internationale Flüge und reservieren Sie Ihre Premium-Kabinenplätze nahtlos.",
    nl: "Vergelijk internationale vluchten en reserveer uw premium cabinestoelen naadloos.",
    ru: "Сравнивайте международные рейсы и легко бронируйте места в салонах премиум-класса.",
    ja: "国際線を比較し、プレミアムキャビンの座席をシームレスに予約します。",
    zh: "比较国际航班并无缝预订高级客舱座位。",
    ar: "قارن الرحلات الجوية الدولية واحجز مقاعدك في الكابينة المميزة بسلاسة.",
    es: "Compare vuelos internacionales y reserve sus asientos en cabina premium sin problemas.",
    pt: "Compare voos internacionais e reserve seus assentos em cabines premium perfeitamente."
  },
  "Flight Search": {
    hi: "उड़ान खोज",
    fr: "Recherche de vol",
    de: "Flugsuche",
    nl: "Vlucht zoeken",
    ru: "Поиск рейсов",
    ja: "フライト検索",
    zh: "航班搜索",
    ar: "البحث عن رحلة",
    es: "Búsqueda de vuelos",
    pt: "Pesquisa de voos"
  },
  "Baggage Allowances": {
    hi: "सामान की सीमा",
    fr: "Franchises de bagages",
    de: "Gepäckbestimmungen",
    nl: "Toegestane bagage",
    ru: "Нормы провоза багажа",
    ja: "手荷物許容量",
    zh: "行李额度",
    ar: "أوزان الأمتعة المسموح بها",
    es: "Equipaje permitido",
    pt: "Franquias de bagagem"
  },
  "Passenger Registration": {
    hi: "यात्री पंजीकरण",
    fr: "Enregistrement des passagers",
    de: "Passagierregistrierung",
    nl: "Passagiersregistratie",
    ru: "Регистрация пассажиров",
    ja: "乗客登録",
    zh: "乘客登记",
    ar: "تسجيل المسافرين",
    es: "Registro de pasajeros",
    pt: "Registro de passageiros"
  },
  "Reviewing Flight Details": {
    hi: "उड़ान विवरण की समीक्षा",
    fr: "Examen des détails du vol",
    de: "Überprüfung der Flugdetails",
    nl: "Vluchtdetails bekijken",
    ru: "Проверка деталей рейса",
    ja: "フライトの詳細の確認",
    zh: "查看航班详情",
    ar: "مراجعة تفاصيل الرحلة",
    es: "Revisando detalles del vuelo",
    pt: "Revisando detalhes do voo"
  },
  "Primary Passenger Name": {
    hi: "प्राथमिक यात्री का नाम",
    fr: "Nom du passager principal",
    de: "Name des Hauptpassagiers",
    nl: "Naam hoofdreiziger",
    ru: "Имя основного пассажира",
    ja: "主な乗客の名前",
    zh: "主要乘客姓名",
    ar: "اسم المسافر الرئيسي",
    es: "Nombre del pasajero principal",
    pt: "Nome do passageiro principal"
  },
  "Mobile Phone": {
    hi: "मोबाइल फोन",
    fr: "Téléphone portable",
    de: "Mobiltelefon",
    nl: "Mobiele telefoon",
    ru: "Мобильный телефон",
    ja: "携帯電話",
    zh: "移动电话",
    ar: "الهاتف المحمول",
    es: "Teléfono móvil",
    pt: "Telefone celular"
  },
  "Passenger Email": {
    hi: "यात्री ईमेल",
    fr: "E-mail du passager",
    de: "Passagier-E-Mail",
    nl: "E-mail passagier",
    ru: "Электронная почта пассажира",
    ja: "乗客のメールアドレス",
    zh: "乘客邮箱",
    ar: "البريد الإلكتروني للمسافر",
    es: "Correo electrónico del pasajero",
    pt: "E-mail do passageiro"
  },
  "Query Flight Schedule": {
    hi: "उड़ान अनुसूची खोजें",
    fr: "Interroger l'horaire des vols",
    de: "Flugplan abfragen",
    nl: "Vluchtschema opvragen",
    ru: "Запросить расписание рейсов",
    ja: "フライトスケジュールを照会する",
    zh: "查询航班时刻表",
    ar: "الاستعلام عن جدول الرحلات",
    es: "Consultar horario de vuelos",
    pt: "Consultar horário de voos"
  },
  "Place Secure Flight Booking": {
    hi: "सुरक्षित उड़ान बुकिंग करें",
    fr: "Placer une réservation de vol sécurisée",
    de: "Sichere Flugbuchung vornehmen",
    nl: "Plaats veilige vluchtboeking",
    ru: "Забронировать безопасный рейс",
    ja: "安全なフライト予約を行う",
    zh: "进行安全的航班预订",
    ar: "إجراء حجز طيران آمن",
    es: "Hacer reserva de vuelo segura",
    pt: "Fazer reserva de voo segura"
  },
  "Securing Flight Seats...": {
    hi: "उड़ान की सीटें सुरक्षित की जा रही हैं...",
    fr: "Sécurisation des sièges de vol...",
    de: "Flugsitze werden gesichert...",
    nl: "Vluchtstoelen beveiligen...",
    ru: "Обеспечение мест на рейсе...",
    ja: "フライトの座席を確保中...",
    zh: "正在保留航班座位...",
    ar: "جارٍ تأمين مقاعد الرحلة...",
    es: "Asegurando asientos de vuelo...",
    pt: "Garantindo assentos de voo..."
  }
};

const langs = ['hi', 'fr', 'de', 'nl', 'ru', 'ja', 'zh', 'ar', 'es', 'pt'];
langs.forEach(lang => {
  const path = `src/locales/${lang}.json`;
  if (fs.existsSync(path)) {
    const data = JSON.parse(fs.readFileSync(path, 'utf8'));
    for (const [key, transMap] of Object.entries(d)) {
      if (transMap[lang]) {
        data[key] = transMap[lang];
      }
    }
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
    console.log(`Fixed flight translations in ${lang}.json`);
  }
});
