const fs = require('fs');

const d = {
  "Premier Aviation Schedules": {
    hi: "प्रीमियर एविएशन अनुसूचियां",
    fr: "Horaires de Premier Aviation",
    de: "Premier Aviation Flugpläne",
    nl: "Premier Aviation Schema's",
    ru: "Расписание Premier Aviation",
    ja: "プレミアアビエーションのスケジュール",
    zh: "高级航空时刻表",
    ar: "جداول الطيران الممتازة",
    es: "Horarios de Premier Aviation",
    pt: "Horários da Premier Aviation"
  },
  "Your boarding itinerary has been registered. We have sent tickets to your email address.": {
    hi: "आपका बोर्डिंग यात्रा कार्यक्रम पंजीकृत कर लिया गया है। हमने आपके ईमेल पते पर टिकट भेज दिए हैं।",
    fr: "Votre itinéraire d'embarquement a été enregistré. Nous avons envoyé les billets à votre adresse e-mail.",
    de: "Ihr Boarding-Plan wurde registriert. Wir haben Tickets an Ihre E-Mail-Adresse gesendet.",
    nl: "Uw instaproute is geregistreerd. We hebben tickets naar uw e-mailadres gestuurd.",
    ru: "Ваш маршрут посадки зарегистрирован. Мы отправили билеты на ваш адрес электронной почты.",
    ja: "搭乗の旅程が登録されました。メールアドレスにチケットを送信しました。",
    zh: "您的登机行程已注册。我们已将机票发送至您的电子邮件地址。",
    ar: "تم تسجيل خط سير الصعود إلى الطائرة الخاص بك. لقد أرسلنا التذاكر إلى عنوان بريدك الإلكتروني.",
    es: "Su itinerario de embarque ha sido registrado. Hemos enviado los boletos a su dirección de correo electrónico.",
    pt: "O seu itinerário de embarque foi registado. Enviamos bilhetes para o seu endereço de e-mail."
  },
  "Flight Seat Confirmed!": {
    hi: "उड़ान सीट की पुष्टि हो गई!",
    fr: "Siège de vol confirmé !",
    de: "Flugsitzplatz bestätigt!",
    nl: "Vluchtstoel bevestigd!",
    ru: "Место на рейсе подтверждено!",
    ja: "フライトの座席が確定しました！",
    zh: "航班座位已确认！",
    ar: "تم تأكيد مقعد الرحلة!",
    es: "¡Asiento de vuelo confirmado!",
    pt: "Assento de voo confirmado!"
  },
  "Search More Flights": {
    hi: "और उड़ानें खोजें",
    fr: "Rechercher plus de vols",
    de: "Weitere Flüge suchen",
    nl: "Zoek meer vluchten",
    ru: "Искать больше рейсов",
    ja: "さらにフライトを検索",
    zh: "搜索更多航班",
    ar: "ابحث عن المزيد من الرحلات الجوية",
    es: "Buscar más vuelos",
    pt: "Pesquisar mais voos"
  },
  "From City/Airport": {
    hi: "शहर/हवाई अड्डे से",
    fr: "De la ville/l'aéroport",
    de: "Von Stadt/Flughafen",
    nl: "Van stad/luchthaven",
    ru: "Из города/аэропорта",
    ja: "出発都市/空港",
    zh: "出发城市/机场",
    ar: "من المدينة / المطار",
    es: "Desde ciudad/aeropuerto",
    pt: "De Cidade/Aeroporto"
  },
  "To City/Airport": {
    hi: "शहर/हवाई अड्डे तक",
    fr: "Vers la ville/l'aéroport",
    de: "Nach Stadt/Flughafen",
    nl: "Naar stad/luchthaven",
    ru: "В город/аэропорт",
    ja: "到着都市/空港",
    zh: "到达城市/机场",
    ar: "إلى المدينة/المطار",
    es: "A ciudad/aeropuerto",
    pt: "Para a cidade/aeroporto"
  },
  "e.g. London (LHR)": {
    hi: "उदा. लंदन (LHR)",
    fr: "ex. Londres (LHR)",
    de: "z.B. London (LHR)",
    nl: "bijv. Londen (LHR)",
    ru: "например, Лондон (LHR)",
    ja: "例：ロンドン（LHR）",
    zh: "例如 伦敦 (LHR)",
    ar: "مثال لندن (LHR)",
    es: "ej. Londres (LHR)",
    pt: "ex. Londres (LHR)"
  },
  "e.g. Maldives (MLE)": {
    hi: "उदा. मालदीव (MLE)",
    fr: "ex. Maldives (MLE)",
    de: "z.B. Malediven (MLE)",
    nl: "bijv. Malediven (MLE)",
    ru: "например, Мальдивы (MLE)",
    ja: "例：モルディブ（MLE）",
    zh: "例如 马尔代夫 (MLE)",
    ar: "مثال جزر المالديف (MLE)",
    es: "ej. Maldivas (MLE)",
    pt: "ex. Maldivas (MLE)"
  },
  "Available Flight Schedules": {
    hi: "उपलब्ध उड़ान अनुसूचियां",
    fr: "Horaires des vols disponibles",
    de: "Verfügbare Flugpläne",
    nl: "Beschikbare vluchtschema's",
    ru: "Доступные расписания рейсов",
    ja: "利用可能なフライトスケジュール",
    zh: "可用航班时刻表",
    ar: "جداول الرحلات المتاحة",
    es: "Horarios de vuelos disponibles",
    pt: "Horários de voos disponíveis"
  },
  "No Flights Found matching criteria": {
    hi: "मानदंडों से मेल खाने वाली कोई उड़ान नहीं मिली",
    fr: "Aucun vol trouvé correspondant aux critères",
    de: "Keine passenden Flüge gefunden",
    nl: "Geen vluchten gevonden die aan de criteria voldoen",
    ru: "Рейсы, соответствующие критериям, не найдены",
    ja: "条件に一致するフライトは見つかりませんでした",
    zh: "未找到符合条件的航班",
    ar: "لم يتم العثور على رحلات تطابق المعايير",
    es: "No se encontraron vuelos que coincidan con los criterios",
    pt: "Nenhum voo encontrado correspondente aos critérios"
  },
  "Scanning international skies...": {
    hi: "अंतरराष्ट्रीय आसमान को स्कैन किया जा रहा है...",
    fr: "Scan des ciels internationaux...",
    de: "Internationale Lufträume werden gescannt...",
    nl: "Internationale luchten scannen...",
    ru: "Сканирование международного неба...",
    ja: "国際空域をスキャン中...",
    zh: "扫描国际天空...",
    ar: "مسح الأجواء الدولية...",
    es: "Escaneando los cielos internacionales...",
    pt: "Verificando os céus internacionais..."
  },
  "Select Seat": {
    hi: "सीट चुनें",
    fr: "Sélectionner un siège",
    de: "Sitzplatz auswählen",
    nl: "Selecteer stoel",
    ru: "Выбрать место",
    ja: "座席を選択",
    zh: "选座",
    ar: "حدد المقعد",
    es: "Seleccionar asiento",
    pt: "Selecionar assento"
  },
  "Change Flight": {
    hi: "उड़ान बदलें",
    fr: "Changer de vol",
    de: "Flug ändern",
    nl: "Vlucht wijzigen",
    ru: "Изменить рейс",
    ja: "フライトを変更する",
    zh: "更改航班",
    ar: "تغيير الرحلة",
    es: "Cambiar vuelo",
    pt: "Mudar voo"
  },
  "Total": {
    hi: "कुल",
    fr: "Total",
    de: "Gesamt",
    nl: "Totaal",
    ru: "Итого",
    ja: "合計",
    zh: "总计",
    ar: "المجموع",
    es: "Total",
    pt: "Total"
  },
  "Stops": {
    hi: "स्टॉप",
    fr: "Arrêts",
    de: "Stopps",
    nl: "Stops",
    ru: "Остановки",
    ja: "ストップ",
    zh: "停靠点",
    ar: "توقفات",
    es: "Paradas",
    pt: "Paradas"
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
    console.log(`Fixed flight translations 2 in ${lang}.json`);
  }
});
