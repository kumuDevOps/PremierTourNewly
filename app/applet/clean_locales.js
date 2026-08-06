const fs = require('fs');
const langs = ['zh', 'ar', 'fr', 'de', 'nl', 'ru', 'ja', 'hi', 'es', 'pt'];

const keyFixes = {
  "Select luxury resort stay for your tour dates": {
    zh: "选择您行程日期的奢华度假村住宿",
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
  "Add Private Vehicle Transport": {
    zh: "添加专车接送",
    ar: "إضافة وسيلة نقل بسيارة خاصة",
    fr: "Ajouter un transport en véhicule privé",
    de: "Privaten Fahrzeugtransport hinzufügen",
    nl: "Privévoertuigvervoer toevoegen",
    ru: "Добавить трансфер на частном автомобиле",
    ja: "専用車送迎を追加",
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
  "Tangalle": {
    zh: "唐加勒",
    ar: "تانغالي",
    fr: "Tangalle",
    de: "Tangalle",
    nl: "Tangalle",
    ru: "Тангалле",
    ja: "タンガッラ",
    hi: "टंगले",
    es: "Tangalle",
    pt: "Tangalle"
  },
  "Hatton": {
    zh: "哈顿",
    ar: "هاتون",
    fr: "Hatton",
    de: "Hatton",
    nl: "Hatton",
    ru: "Хаттон",
    ja: "ハトン",
    hi: "हैटन",
    es: "Hatton",
    pt: "Hatton"
  },
  "Yala": {
    zh: "雅拉",
    ar: "يالا",
    fr: "Yala",
    de: "Yala",
    nl: "Yala",
    ru: "Яла",
    ja: "ヤラ",
    hi: "याला",
    es: "Yala",
    pt: "Yala"
  },
  "Colombo": {
    zh: "科伦坡",
    ar: "كولومبو",
    fr: "Colombo",
    de: "Colombo",
    nl: "Colombo",
    ru: "Коломбо",
    ja: "コロンボ",
    hi: "कोलंबो",
    es: "Colombo",
    pt: "Colombo"
  },
  "Dambulla": {
    zh: "丹布勒",
    ar: "دامبولا",
    fr: "Dambulla",
    de: "Dambulla",
    nl: "Dambulla",
    ru: "Дамбулла",
    ja: "ダンブッラ",
    hi: "दंबुला",
    es: "Dambulla",
    pt: "Dambulla"
  },
  "Luxury": {
    zh: "豪华",
    ar: "فاخر",
    fr: "Luxe",
    de: "Luxus",
    nl: "Luxe",
    ru: "Люкс",
    ja: "ラグジュアリー",
    hi: "लक्जरी",
    es: "Lujo",
    pt: "Luxo"
  },
  "SUV": {
    zh: "SUV越野车",
    ar: "سيارة دفع رباعي",
    fr: "SUV",
    de: "SUV",
    nl: "SUV",
    ru: "Внедорожник",
    ja: "SUV",
    hi: "एसयूवी",
    es: "SUV",
    pt: "SUV"
  },
  "Prestige SUV": {
    zh: "尊贵SUV",
    ar: "سيارة دفع رباعي فاخرة",
    fr: "SUV Prestige",
    de: "Prestige SUV",
    nl: "Prestige SUV",
    ru: "Престижный внедорожник",
    ja: "プレステージ SUV",
    hi: "प्रतिष्ठित एसयूवी",
    es: "SUV Prestige",
    pt: "SUV Prestige"
  },
  "Sports": {
    zh: "跑车",
    ar: "رياضية",
    fr: "Sportive",
    de: "Sportwagen",
    nl: "Sportief",
    ru: "Спортивный",
    ja: "スポーツ",
    hi: "स्पोर्ट्स",
    es: "Deportivo",
    pt: "Desportivo"
  },
  "Panoramic": {
    zh: "全景式",
    ar: "بانورامي",
    fr: "Panoramique",
    de: "Panoramablick",
    nl: "Panoramisch",
    ru: "Панорамный",
    ja: "パノラマ",
    hi: "पैनोरामिक",
    es: "Panorámico",
    pt: "Panorâmico"
  }
};

langs.forEach(lang => {
  const srcPath = `src/locales/${lang}.json`;
  const publicPath = `public/locales/${lang}.json`;
  
  if (!fs.existsSync(srcPath)) return;
  const data = JSON.parse(fs.readFileSync(srcPath, 'utf8'));
  for (const [k, v] of Object.entries(keyFixes)) {
    if (v[lang]) {
      data[k] = v[lang];
    }
  }

  // Sanitize any residual mixed English sentences containing "stay for your", "Base Sub", "Enhance Your"
  for (const [k, v] of Object.entries(data)) {
    if (typeof v === 'string' && (v.includes('stay for your') || v.includes('Base Sub') || v.includes('Enhance Your'))) {
      if (keyFixes[k] && keyFixes[k][lang]) {
        data[k] = keyFixes[k][lang];
      }
    }
  }

  fs.writeFileSync(srcPath, JSON.stringify(data, null, 2));
  fs.writeFileSync(publicPath, JSON.stringify(data, null, 2));
});
console.log('Successfully cleaned all mixed English keys across all languages!');
