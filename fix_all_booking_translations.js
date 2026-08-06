const fs = require('fs');

const fullTranslations = {
  "Enhance Your Experience (Optional Add-ons)": {
    zh: "提升您的体验（可选附加项）",
    ar: "تحسين تجربتك (إضافات اختيارية)",
    fr: "Améliorez votre expérience (options facultatives)",
    de: "Verbessern Sie Ihr Erlebnis (optionale Zusatzleistungen)",
    nl: "Verbeter uw ervaring (optionele extra's)",
    ru: "Улучшите свои впечатления (дополнительные опции)",
    ja: "体験をアップグレード（オプショナル追加）",
    hi: "अपने अनुभव को बढ़ाएं (वैकल्पिक ऐड-ऑन)",
    es: "Mejore su experiencia (adicionales opcionales)",
    pt: "Melhore a sua experiência (adicionais opcionais)"
  },
  "Customize Experience": {
    zh: "自定义行程",
    ar: "تخصيص التجربة",
    fr: "Personnaliser l'expérience",
    de: "Erlebnis anpassen",
    nl: "Ervaring aanpassen",
    ru: "Настроить впечатления",
    ja: "体験をカスタマイズ",
    hi: "अनुभव को अनुकूलित करें",
    es: "Personalizar experiencia",
    pt: "Personalizar experiência"
  },
  "Add Hotel Accommodation": {
    zh: "添加酒店住宿",
    ar: "إضافة إقامة فندقية",
    fr: "Ajouter un hébergement hôtelier",
    de: "Hotelunterkunft hinzufügen",
    nl: "Hotelaccommodatie toevoegen",
    ru: "Добавить проживание в отеле",
    ja: "宿泊ホテルを追加",
    hi: "होटल आवास जोड़ें",
    es: "Añadir alojamiento en hotel",
    pt: "Adicionar alojamento em hotel"
  },
  "Select luxury resort stay for your tour dates": {
    zh: "选择您行程日期的奢华度假村",
    ar: "اختر إقامة في منتجع فاخر لتواريخ جولتك",
    fr: "Sélectionnez un séjour en complexe de luxe pour vos dates de voyage",
    de: "Wählen Sie einen Luxus-Resort-Aufenthalt für Ihre Reisedaten",
    nl: "Selecteer een verblijf in een luxe resort voor uw reisdata",
    ru: "Выберите проживание в роскошном курортном отеле на даты тура",
    ja: "ツアー日程に合わせたラグジュアリーリゾートをお選びください",
    hi: "अपनी यात्रा की तारीखों के लिए लक्जरी रिसॉर्ट स्टे चुनें",
    es: "Seleccione una estancia en un resort de lujo para sus fechas de viaje",
    pt: "Selecione uma estadia num resort de luxo para as datas da sua viagem"
  },
  "Add Private Vehicle Transport": {
    zh: "添加专车接送",
    ar: "إضافة وسيلة نقل بسيارة خاصة",
    fr: "Ajouter un transport en véhicule privé",
    de: "Privaten Fahrzeugtransport hinzufügen",
    nl: "Privévoertuigvervoer toevoegen",
    ru: "Добавить трансфер на частном автомобиле",
    ja: "専用车送迎を追加",
    hi: "निजी वाहन परिवहन जोड़ें",
    es: "Añadir transporte en vehículo privado",
    pt: "Adicionar transporte em veículo privado"
  },
  "Chauffeured car for your travel": {
    zh: "为您出行提供带司机的专车",
    ar: "سيارة مع سائق لسفرك",
    fr: "Voiture avec chauffeur pour vos déplacements",
    de: "Fahrzeug mit Chauffeur für Ihre Reise",
    nl: "Auto met chauffeur voor uw reis",
    ru: "Автомобиль с водителем для вашей поездки",
    ja: "ご旅行に専属ドライバー付き車両をご用意",
    hi: "आपकी यात्रा के लिए ड्राइवर वाली कार",
    es: "Coche con chófer para su viaje",
    pt: "Carro com motorista para a sua viagem"
  },
  "Base Subtotal": {
    zh: "基础小计",
    ar: "المبلغ الفرعي الأساسي",
    fr: "Sous-total de base",
    de: "Zwischensumme",
    nl: "Basissubtotaal",
    ru: "Базовый промежуточный итог",
    ja: "基本小計",
    hi: "मूल उप-योग",
    es: "Subtotal base",
    pt: "Subtotal base"
  },
  "Your booking reference ID is generated and reserved immediately. You can confirm your details below.": {
    zh: "您的预订参考编号已立即生成并保留。您可以在下方确认您的详细信息。",
    ar: "تم إنشاء معرف مرجع الحجز الخاص بك وحجزه فورًا. يمكنك تأكيد تفاصيلك أدناه.",
    fr: "Votre numéro de référence de réservation est généré et réservé immédiatement. Vous pouvez confirmer vos coordonnées ci-dessous.",
    de: "Ihre Buchungsreferenz-ID wird sofort erstellt und reserviert. Sie können Ihre Details unten bestätigen.",
    nl: "Uw boekingsreferentie-ID wordt onmiddellijk gegenereerd en gereserveerd. U kunt uw gegevens hieronder bevestigen.",
    ru: "Ваш номер бронирования сгенерирован и забронирован немедленно. Вы можете подтвердить свои данные ниже.",
    ja: "予約照会IDが即座に発行・確保されました。以下の詳細をご確認いただけます。",
    hi: "आपकी बुकिंग संदर्भ आईडी तुरंत जनरेट और आरक्षित की जाती है। आप नीचे अपने विवरण की पुष्टि कर सकते हैं।",
    es: "Su ID de referencia de reserva se genera y reserva de inmediato. Puede confirmar sus detalles a continuación.",
    pt: "O seu ID de referência de reserva é gerado e reservado imediatamente. Pode confirmar os seus detalhes abaixo."
  },
  "Instant Reservation Guarantee": {
    zh: "即时预订保证",
    ar: "ضمان الحجز الفوري",
    fr: "Garantie de réservation instantanée",
    de: "Sofortige Reservierungsgarantie",
    nl: "Garantie voor onmiddellijke reservering",
    ru: "Гарантия мгновенного бронирования",
    ja: "即時予約保証",
    hi: "तत्काल आरक्षण की गारंटी",
    es: "Garantía de reserva instantánea",
    pt: "Garantia de reserva instantânea"
  },
  "Pricing Breakdown": {
    zh: "费用明细",
    ar: "تفاصيل الأسعار",
    fr: "Détail du prix",
    de: "Preisaufschlüsselung",
    nl: "Prijsspecificatie",
    ru: "Детализация стоимости",
    ja: "料金内訳",
    hi: "मूल्य विवरण",
    es: "Desglose de precios",
    pt: "Detalhamento de preços"
  },
  "Professional Driver Service": {
    zh: "专业司机服务",
    ar: "خدمة سائق محترف",
    fr: "Service de chauffeur professionnel",
    de: "Professioneller Chauffeurservice",
    nl: "Professionele chauffeursdienst",
    ru: "Услуги профессионального водителя",
    ja: "プロドライバーサービス",
    hi: "पेशेवर ड्राइवर सेवा",
    es: "Servicio de chófer profesional",
    pt: "Serviço de motorista profissional"
  },
  "Taxes & Fees": {
    zh: "税费",
    ar: "الضرائب والرسوم",
    fr: "Taxes et frais",
    de: "Steuern & Gebühren",
    nl: "Belastingen & toeslagen",
    ru: "Налоги и сборы",
    ja: "税金および手数料",
    hi: "कर एवं शुल्क",
    es: "Impuestos y tasas",
    pt: "Impostos e taxas"
  },
  "Service Fee": {
    zh: "服务费",
    ar: "رسوم الخدمة",
    fr: "Frais de service",
    de: "Servicegebühr",
    nl: "Servicekosten",
    ru: "Сервисный сбор",
    ja: "サービス料",
    hi: "सेवा शुल्क",
    es: "Cuota de servicio",
    pt: "Taxa de serviço"
  },
  "Total Amount": {
    zh: "总金额",
    ar: "المبلغ الإجمالي",
    fr: "Montant total",
    de: "Gesamtbetrag",
    nl: "Totaalbedrag",
    ru: "Итоговая сумма",
    ja: "合計金額",
    hi: "कुल राशि",
    es: "Monto total",
    pt: "Valor total"
  },
  "All taxes and fees included": {
    zh: "包含所有税费",
    ar: "شاملة جميع الضرائب والرسوم",
    fr: "Toutes taxes et frais compris",
    de: "Inklusive aller Steuern und Gebühren",
    nl: "Inclusief alle belastingen en toeslagen",
    ru: "Все налоги и сборы включены",
    ja: "すべての税金と手数料が含まれています",
    hi: "सभी कर और शुल्क शामिल हैं",
    es: "Todos los impuestos y tasas incluidos",
    pt: "Todos os impostos e taxas incluídos"
  },
  "Night": {
    zh: "晚",
    ar: "ليلة",
    fr: "nuit",
    de: "Nacht",
    nl: "nacht",
    ru: "ночь",
    ja: "泊",
    hi: "रात",
    es: "noche",
    pt: "noite"
  },
  "Nights": {
    zh: "晚",
    ar: "ليالي",
    fr: "nuits",
    de: "Nächte",
    nl: "nachten",
    ru: "ночи",
    ja: "泊",
    hi: "रातें",
    es: "noches",
    pt: "noites"
  },
  "Day": {
    zh: "天",
    ar: "يوم",
    fr: "jour",
    de: "Tag",
    nl: "dag",
    ru: "день",
    ja: "日",
    hi: "दिन",
    es: "día",
    pt: "dia"
  },
  "Days": {
    zh: "天",
    ar: "أيام",
    fr: "jours",
    de: "Tage",
    nl: "dagen",
    ru: "дней",
    ja: "日",
    hi: "दिन",
    es: "días",
    pt: "dias"
  },
  "night": {
    zh: "晚",
    ar: "ليلة",
    fr: "nuit",
    de: "Nacht",
    nl: "nacht",
    ru: "ночь",
    ja: "泊",
    hi: "रात",
    es: "noche",
    pt: "noite"
  },
  "day": {
    zh: "天",
    ar: "يوم",
    fr: "jour",
    de: "Tag",
    nl: "dag",
    ru: "день",
    ja: "日",
    hi: "दिन",
    es: "día",
    pt: "dia"
  },
  "With Driver": {
    zh: "带司机",
    ar: "مع سائق",
    fr: "Avec chauffeur",
    de: "Mit Fahrer",
    nl: "Met chauffeur",
    ru: "С водителем",
    ja: "ドライバー付き",
    hi: "ड्राइवर के साथ",
    es: "Con chófer",
    pt: "Com motorista"
  },
  "Self-Drive": {
    zh: "自驾",
    ar: "قيادة ذاتية",
    fr: "Conduite autonome",
    de: "Selbstfahrer",
    nl: "Zelf rijden",
    ru: "Без водителя",
    ja: "セルフドライブ",
    hi: "स्वयं ड्राइव",
    es: "Conducción propia",
    pt: "Condução própria"
  }
};

const langs = ['en', 'zh', 'ar', 'fr', 'de', 'nl', 'ru', 'ja', 'hi', 'es', 'pt'];

langs.forEach(lang => {
  const srcPath = `src/locales/${lang}.json`;
  const publicPath = `public/locales/${lang}.json`;

  let data = {};
  if (fs.existsSync(srcPath)) {
    data = JSON.parse(fs.readFileSync(srcPath, 'utf8'));
  }

  for (const [k, transMap] of Object.entries(fullTranslations)) {
    if (lang === 'en') {
      data[k] = k;
    } else if (transMap[lang]) {
      data[k] = transMap[lang];
    }
  }

  fs.writeFileSync(srcPath, JSON.stringify(data, null, 2));
  fs.writeFileSync(publicPath, JSON.stringify(data, null, 2));
  console.log(`Updated translations in ${lang}.json`);
});
