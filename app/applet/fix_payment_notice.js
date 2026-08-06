const fs = require('fs');

const keysToFix = {
  "Use test card numbers (e.g. 4242 4242 4242 4242) for instant booking confirmation.": {
    zh: "使用测试卡号（例如 4242 4242 4242 4242）以获得即时预订确认。",
    ar: "استخدم أرقام بطاقات الاختبار (مثل 4242 4242 4242 4242) للحصول على تأكيد حجز فوري.",
    fr: "Utilisez les numéros de carte de test (ex. 4242 4242 4242 4242) pour une confirmation de réservation instantanée.",
    de: "Verwenden Sie Testkartennummern (z. B. 4242 4242 4242 4242) für eine sofortige Buchungsbestätigung.",
    nl: "Gebruik testkaartnummers (bijv. 4242 4242 4242 4242) voor onmiddellijke boekingsbevestiging.",
    ru: "Используйте тестовые номера карт (например, 4242 4242 4242 4242) для мгновенного подтверждения бронирования.",
    ja: "即時予約確認のためにテストカード番号（例: 4242 4242 4242 4242）をご利用ください。",
    hi: "तत्काल बुकिंग की पुष्टि के लिए परीक्षण कार्ड नंबर (जैसे 4242 4242 4242 4242) का उपयोग करें।",
    es: "Utilice números de tarjeta de prueba (p. ej., 4242 4242 4242 4242) para una confirmación de reserva instantánea.",
    pt: "Utilize números de cartão de teste (ex. 4242 4242 4242 4242) para confirmação de reserva instantânea."
  },
  "SELECT PAYMENT GATEWAY": {
    zh: "选择支付网关",
    ar: "اختر بوابة الدفع",
    fr: "SÉLECTIONNER LA PASSERELLE DE PAIEMENT",
    de: "ZAHLUNGSGATEWAY AUSWÄHLEN",
    nl: "SELECTEER BETAALMETHODE",
    ru: "ВЫБЕРИТЕ ПЛАТЕЖНЫЙ ШЛЮЗ",
    ja: "決済ゲートウェイを選択",
    hi: "भुगतान गेटवे चुनें",
    es: "SELECCIONAR PASARELA DE PAGO",
    pt: "SELECIONAR PORTAL DE PAGAMENTO"
  },
  "BOOKING REFERENCE CARD": {
    zh: "预订参考卡",
    ar: "بطاقة مرجع الحجز",
    fr: "CARTE DE RÉFÉRENCE DE RÉSERVATION",
    de: "BUCHUNGSREFERENZKARTE",
    nl: "BOEKINGSREFERENTIEKAART",
    ru: "КАРТА ССЫЛКИ БРОНИРОВАНИЯ",
    ja: "予約照会カード",
    hi: "बुकिंग संदर्भ कार्ड",
    es: "TARJETA DE REFERENCIA DE RESERVA",
    pt: "CARTÃO DE REFERÊNCIA DE RESERVA"
  },
  "Cardholder Name": {
    zh: "持卡人姓名",
    ar: "اسم حامل البطاقة",
    fr: "Nom du titulaire de la carte",
    de: "Name des Karteninhabers",
    nl: "Naam kaarthouder",
    ru: "Имя владельца карты",
    ja: "カード名義人名",
    hi: "कार्डधारक का नाम",
    es: "Nombre del titular de la tarjeta",
    pt: "Nome do titular do cartão"
  },
  "Card Number": {
    zh: "卡号",
    ar: "رقم البطاقة",
    fr: "Numéro de carte",
    de: "Kartennummer",
    nl: "Kaartnummer",
    ru: "Номер карты",
    ja: "カード番号",
    hi: "कार्ड नंबर",
    es: "Número de tarjeta",
    pt: "Número do cartão"
  },
  "Expiry Date": {
    zh: "到期日",
    ar: "تاريخ الانتهاء",
    fr: "Date d'expiration",
    de: "Ablaufdatum",
    nl: "Vervaldatum",
    ru: "Срок действия",
    ja: "有効期限",
    hi: "समाप्ति तिथि",
    es: "Fecha de caducidad",
    pt: "Data de validade"
  },
  "Cardholder": {
    zh: "持卡人",
    ar: "حامل البطاقة",
    fr: "Titulaire",
    de: "Karteninhaber",
    nl: "Kaarthouder",
    ru: "Владелец",
    ja: "名義人",
    hi: "कार्डधारक",
    es: "Titular",
    pt: "Titular"
  },
  "Expires": {
    zh: "过期",
    ar: "ينتهي",
    fr: "Expire",
    de: "Ablauf",
    nl: "Vervalt",
    ru: "Истекает",
    ja: "期限",
    hi: "समाप्त",
    es: "Caduca",
    pt: "Expira"
  }
};

const langs = ["en", "zh", "ar", "fr", "de", "nl", "ru", "ja", "hi", "es", "pt"];

langs.forEach(lang => {
  const srcPath = `src/locales/${lang}.json`;
  const publicPath = `public/locales/${lang}.json`;

  if (!fs.existsSync(srcPath)) return;
  const data = JSON.parse(fs.readFileSync(srcPath, "utf8"));

  for (const [k, v] of Object.entries(keysToFix)) {
    if (lang === "en") {
      data[k] = k;
    } else if (v[lang]) {
      data[k] = v[lang];
    }
  }

  fs.writeFileSync(srcPath, JSON.stringify(data, null, 2));
  fs.writeFileSync(publicPath, JSON.stringify(data, null, 2));
});

console.log("Updated locale files with clean payment confirmation translations.");
