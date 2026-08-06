const fs = require('fs');
const missingKeys = {
  "Step": {
    hi: "कदम", fr: "Étape", de: "Schritt", nl: "Stap",
    ru: "Шаг", ja: "ステップ", zh: "步骤", ar: "خطوة", es: "Paso", pt: "Passo"
  },
  "of": {
    hi: "का", fr: "sur", de: "von", nl: "van",
    ru: "из", ja: "の", zh: "/", ar: "من", es: "de", pt: "de"
  },
  "Completed": {
    hi: "पूर्ण", fr: "Terminé", de: "Abgeschlossen", nl: "Voltooid",
    ru: "Завершено", ja: "完了", zh: "已完成", ar: "مكتمل", es: "Completado", pt: "Concluído"
  },
  "CAR BOOKING PROCESS": {
    hi: "कार बुकिंग प्रक्रिया", fr: "PROCESSUS DE RÉSERVATION DE VOITURE", de: "AUTOBUCHUNGSPROZESS", nl: "AUTOBEKINGS-PROCES",
    ru: "ПРОЦЕСС БРОНИРОВАНИЯ АВТОМОБИЛЯ", ja: "レンタカー予約プロセス", zh: "租车预订流程", ar: "عملية حجز السيارة", es: "PROCESO DE RESERVA DE COCHE", pt: "PROCESSO DE RESERVA DE CARRO"
  },
  "FLIGHT BOOKING PROCESS": {
    hi: "उड़ान बुकिंग प्रक्रिया", fr: "PROCESSUS DE RÉSERVATION DE VOL", de: "FLUG-BUCHUNGSPROZESS", nl: "VLUCHTBOEKINGS-PROCES",
    ru: "ПРОЦЕСС БРОНИРОВАНИЯ РЕЙСА", ja: "航空券予約プロセス", zh: "航班预订流程", ar: "عملية حجز الطيران", es: "PROCESO DE RESERVA DE VUELO", pt: "PROCESSO DE RESERVA DE VOO"
  },
  "HOTEL BOOKING PROCESS": {
    hi: "होटल बुकिंग प्रक्रिया", fr: "PROCESSUS DE RÉSERVATION D'HÔTEL", de: "HOTELBUCHUNGSPROZESS", nl: "HOTELBOEKINGS-PROCES",
    ru: "ПРОЦЕСС БРОНИРОВАНИЯ ОТЕЛЯ", ja: "ホテル予約プロセス", zh: "酒店预订流程", ar: "عملية حجز الفندق", es: "PROCESO DE RESERVA DE HOTEL", pt: "PROCESSO DE RESERVA DE HOTEL"
  },
  "TOUR BOOKING PROCESS": {
    hi: "टूर बुकिंग प्रक्रिया", fr: "PROCESSUS DE RÉSERVATION DE CIRCUIT", de: "TOURBUCHUNGSPROZESS", nl: "TOURBOEKINGS-PROCES",
    ru: "ПРОЦЕСС БРОНИРОВАНИЯ ТУРА", ja: "ツアー予約プロセス", zh: "旅游预订流程", ar: "عملية حجز الجولة", es: "PROCESO DE RESERVA DE TOUR", pt: "PROCESSO DE RESERVA DE TOUR"
  },
  "Passenger Details": {
    hi: "यात्री विवरण", fr: "Détails du passager", de: "Passagierdaten", nl: "Passagiersgegevens",
    ru: "Данные пассажира", ja: "乗客の詳細", zh: "乘客详情", ar: "تفاصيل الركاب", es: "Detalles del pasajero", pt: "Detalhes do passageiro"
  },
  "Info & baggage": {
    hi: "जानकारी और सामान", fr: "Infos et bagages", de: "Info & Gepäck", nl: "Info & bagage",
    ru: "Информация и багаж", ja: "情報と手荷物", zh: "信息与行李", ar: "معلومات وأمتعة", es: "Info y equipaje", pt: "Info e bagagem"
  },
  "Secure checkout": {
    hi: "सुरक्षित चेकआउट", fr: "Paiement sécurisé", de: "Sichere Kasse", nl: "Veilig afrekenen",
    ru: "Безопасная оплата", ja: "安全なチェックアウト", zh: "安全结账", ar: "دفع آمن", es: "Pago seguro", pt: "Checkout seguro"
  },
  "E-Ticket": {
    hi: "ई-टिकट", fr: "Billet électronique", de: "E-Ticket", nl: "E-Ticket",
    ru: "Электронный билет", ja: "Eチケット", zh: "电子机票", ar: "تذكرة إلكترونية", es: "Boleto electrónico", pt: "Bilhete eletrônico"
  },
  "Boarding pass issued": {
    hi: "बोर्डिंग पास जारी", fr: "Carte d'embarquement émise", de: "Bordkarte ausgestellt", nl: "Instapkaart uitgegeven",
    ru: "Посадочный талон оформлен", ja: "搭乗券発行", zh: "登机牌已发出", ar: "تم إصدار بطاقة الصعود", es: "Tarjeta de embarque emitida", pt: "Cartão de embarque emitido"
  },
  "Select Hotel": {
    hi: "होटल चुनें", fr: "Sélectionner un hôtel", de: "Hotel auswählen", nl: "Selecteer hotel",
    ru: "Выберите отель", ja: "ホテルを選択", zh: "选择酒店", ar: "اختر فندقًا", es: "Seleccionar hotel", pt: "Selecionar hotel"
  },
  "Compare stays & rooms": {
    hi: "ठहरने और कमरों की तुलना करें", fr: "Comparer les séjours et les chambres", de: "Aufenthalte & Zimmer vergleichen", nl: "Vergelijk verblijven & kamers",
    ru: "Сравните пребывание и номера", ja: "滞在と部屋を比較", zh: "比较住宿和房间", ar: "قارن الإقامات والغرف", es: "Comparar estancias y habitaciones", pt: "Comparar estadias e quartos"
  },
  "Guest Info": {
    hi: "अतिथि जानकारी", fr: "Infos client", de: "Gästeinformationen", nl: "Gastinfo",
    ru: "Информация о госте", ja: "ゲスト情報", zh: "客人信息", ar: "معلومات الضيف", es: "Info del huésped", pt: "Informações do hóspede"
  },
  "Dates & occupancy": {
    hi: "तिथियां और अधिभोग", fr: "Dates et occupation", de: "Daten & Belegung", nl: "Data & bezetting",
    ru: "Даты и размещение", ja: "日付と占有率", zh: "日期与入住人数", ar: "التواريخ والإشغال", es: "Fechas y ocupación", pt: "Datas e ocupação"
  },
  "Review & Pay": {
    hi: "समीक्षा करें और भुगतान करें", fr: "Vérifier et Payer", de: "Überprüfen & Bezahlen", nl: "Controleren & Betalen",
    ru: "Проверка и оплата", ja: "確認して支払う", zh: "查看与支付", ar: "المراجعة والدفع", es: "Revisar y pagar", pt: "Revisar e pagar"
  },
  "Instant confirmation": {
    hi: "त्वरित पुष्टि", fr: "Confirmation instantanée", de: "Sofortige Bestätigung", nl: "Directe bevestiging",
    ru: "Мгновенное подтверждение", ja: "即時確認", zh: "即时确认", ar: "تأكيد فوري", es: "Confirmación instantánea", pt: "Confirmação instantânea"
  },
  "Booking Voucher": {
    hi: "बुकिंग वाउचर", fr: "Bon de réservation", de: "Buchungsgutschein", nl: "Boekingsvoucher",
    ru: "Ваучер на бронирование", ja: "予約バウチャー", zh: "预订凭证", ar: "قسيمة الحجز", es: "Bono de reserva", pt: "Voucher de reserva"
  },
  "Stay reserved": {
    hi: "ठहरना आरक्षित", fr: "Séjour réservé", de: "Aufenthalt reserviert", nl: "Verblijf gereserveerd",
    ru: "Пребывание забронировано", ja: "滞在予約済み", zh: "住宿已预订", ar: "تم حجز الإقامة", es: "Estancia reservada", pt: "Estadia reservada"
  },
  "Choose rental car": {
    hi: "किराये की कार चुनें", fr: "Choisissez la voiture de location", de: "Mietwagen auswählen", nl: "Kies huurauto",
    ru: "Выберите арендованный автомобиль", ja: "レンタカーを選ぶ", zh: "选择租车", ar: "اختر سيارة مستأجرة", es: "Elegir coche de alquiler", pt: "Escolher carro alugado"
  },
  "Driver Details": {
    hi: "चालक विवरण", fr: "Détails du conducteur", de: "Fahrerdaten", nl: "Bestuurdersgegevens",
    ru: "Данные водителя", ja: "運転手の詳細", zh: "司机详情", ar: "تفاصيل السائق", es: "Detalles del conductor", pt: "Detalhes do motorista"
  },
  "Dates & location": {
    hi: "तिथियां और स्थान", fr: "Dates et lieu", de: "Daten & Ort", nl: "Data & locatie",
    ru: "Даты и место", ja: "日付と場所", zh: "日期与地点", ar: "التواريخ والموقع", es: "Fechas y ubicación", pt: "Datas e local"
  },
  "Insurance & deposit": {
    hi: "बीमा और जमा", fr: "Assurance et caution", de: "Versicherung & Kaution", nl: "Verzekering & borg",
    ru: "Страховка и залог", ja: "保険と保証金", zh: "保险与押金", ar: "التأمين والوديعة", es: "Seguro y fianza", pt: "Seguro e depósito"
  },
  "Reservation Ready": {
    hi: "आरक्षण तैयार", fr: "Réservation prête", de: "Reservierung bereit", nl: "Reservering klaar",
    ru: "Бронирование готово", ja: "予約準備完了", zh: "预订就绪", ar: "الحجز جاهز", es: "Reserva lista", pt: "Reserva pronta"
  },
  "Voucher issued": {
    hi: "वाउचर जारी", fr: "Bon émis", de: "Gutschein ausgestellt", nl: "Voucher uitgegeven",
    ru: "Ваучер выпущен", ja: "バウチャー発行", zh: "凭证已发出", ar: "تم إصدار القسيمة", es: "Bono emitido", pt: "Voucher emitido"
  },
  "Explore Tours": {
    hi: "टूर का अन्वेषण करें", fr: "Explorer les circuits", de: "Touren erkunden", nl: "Verken rondleidingen",
    ru: "Исследовать туры", ja: "ツアーを探索", zh: "探索旅游", ar: "استكشف الجولات", es: "Explorar tours", pt: "Explorar tours"
  },
  "Choose itinerary": {
    hi: "यात्रा कार्यक्रम चुनें", fr: "Choisissez l'itinéraire", de: "Reiseroute auswählen", nl: "Kies reisplan",
    ru: "Выберите маршрут", ja: "旅程を選ぶ", zh: "选择行程", ar: "اختر مسار الرحلة", es: "Elegir itinerario", pt: "Escolher itinerário"
  },
  "Reservation": {
    hi: "आरक्षण", fr: "Réservation", de: "Reservierung", nl: "Reservering",
    ru: "Бронирование", ja: "予約", zh: "预订", ar: "حجز", es: "Reserva", pt: "Reserva"
  },
  "Travelers & dates": {
    hi: "यात्री और तिथियां", fr: "Voyageurs et dates", de: "Reisende & Daten", nl: "Reizigers & data",
    ru: "Путешественники и даты", ja: "旅行者と日付", zh: "旅客与日期", ar: "المسافرون والتواريخ", es: "Viajeros y fechas", pt: "Viajantes e datas"
  },
  "Payment details": {
    hi: "भुगतान विवरण", fr: "Détails de paiement", de: "Zahlungsdetails", nl: "Betalingsgegevens",
    ru: "Детали оплаты", ja: "支払い詳細", zh: "付款详情", ar: "تفاصيل الدفع", es: "Detalles de pago", pt: "Detalhes de pagamento"
  },
  "Confirmed": {
    hi: "पुष्टीकृत", fr: "Confirmé", de: "Bestätigt", nl: "Bevestigd",
    ru: "Подтверждено", ja: "確認済み", zh: "已确认", ar: "مؤكد", es: "Confirmado", pt: "Confirmado"
  },
  "Pass & details ready": {
    hi: "पास और विवरण तैयार", fr: "Pass et détails prêts", de: "Pass & Details bereit", nl: "Pas & details klaar",
    ru: "Пропуск и детали готовы", ja: "パスと詳細の準備完了", zh: "通行证和详细信息就绪", ar: "التصريح والتفاصيل جاهزة", es: "Pase y detalles listos", pt: "Passe e detalhes prontos"
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
    console.log(`Fixed ${lang}.json`);
  }
});
