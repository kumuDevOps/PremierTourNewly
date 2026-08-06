const fs = require('fs');

const d = {
  "Failed to fetch scheduled flights.": {
    hi: "निर्धारित उड़ानें लाने में विफल।",
    fr: "Échec de la récupération des vols programmés.",
    de: "Geplante Flüge konnten nicht abgerufen werden.",
    nl: "Ophalen van geplande vluchten mislukt.",
    ru: "Не удалось получить расписание рейсов.",
    ja: "予定されたフライトの取得に失敗しました。",
    zh: "获取预定航班失败。",
    ar: "فشل في جلب الرحلات المجدولة.",
    es: "Error al recuperar los vuelos programados.",
    pt: "Falha ao buscar voos programados."
  },
  "An error occurred while loading flight schedule.": {
    hi: "उड़ान अनुसूची लोड करते समय एक त्रुटि हुई।",
    fr: "Une erreur s'est produite lors du chargement de l'horaire des vols.",
    de: "Beim Laden des Flugplans ist ein Fehler aufgetreten.",
    nl: "Er is een fout opgetreden bij het laden van het vluchtschema.",
    ru: "Произошла ошибка при загрузке расписания рейсов.",
    ja: "フライトスケジュールの読み込み中にエラーが発生しました。",
    zh: "加载航班时刻表时出错。",
    ar: "حدث خطأ أثناء تحميل جدول الرحلات.",
    es: "Ocurrió un error al cargar el horario de vuelos.",
    pt: "Ocorreu um erro ao carregar o horário dos voos."
  },
  "Booking failed. Please try again.": {
    hi: "बुकिंग विफल रही। कृपया पुनः प्रयास करें।",
    fr: "Échec de la réservation. Veuillez réessayer.",
    de: "Buchung fehlgeschlagen. Bitte versuchen Sie es erneut.",
    nl: "Boeking mislukt. Probeer het opnieuw.",
    ru: "Ошибка бронирования. Пожалуйста, попробуйте еще раз.",
    ja: "予約に失敗しました。もう一度お試しください。",
    zh: "预订失败。请重试。",
    ar: "فشل الحجز. يرجى المحاولة مرة أخرى.",
    es: "Reserva fallida. Por favor, inténtelo de nuevo.",
    pt: "A reserva falhou. Por favor, tente novamente."
  },
  "An error occurred while placing your booking.": {
    hi: "आपकी बुकिंग करते समय एक त्रुटि हुई।",
    fr: "Une erreur s'est produite lors de votre réservation.",
    de: "Bei Ihrer Buchung ist ein Fehler aufgetreten.",
    nl: "Er is een fout opgetreden bij het plaatsen van uw boeking.",
    ru: "При бронировании произошла ошибка.",
    ja: "予約の処理中にエラーが発生しました。",
    zh: "预订时出错。",
    ar: "حدث خطأ أثناء إجراء الحجز.",
    es: "Ocurrió un error al realizar su reserva.",
    pt: "Ocorreu um erro ao fazer sua reserva."
  },
  "PREMIER BOARDING PASS": {
    hi: "प्रीमियर बोर्डिंग पास",
    fr: "CARTE D'EMBARQUEMENT PREMIER",
    de: "PREMIER BORDKARTE",
    nl: "PREMIER INSTAPKAART",
    ru: "ПОСАДОЧНЫЙ ТАЛОН ПРЕМИУМ",
    ja: "プレミア搭乗券",
    zh: "高级登机牌",
    ar: "بطاقة صعود بريمير",
    es: "TARJETA DE EMBARQUE PREMIER",
    pt: "CARTÃO DE EMBARQUE PREMIER"
  },
  "Origin": {
    hi: "मूल",
    fr: "Origine",
    de: "Herkunft",
    nl: "Oorsprong",
    ru: "Происхождение",
    ja: "出発地",
    zh: "出发地",
    ar: "الأصل",
    es: "Origen",
    pt: "Origem"
  },
  "Destination": {
    hi: "गंतव्य",
    fr: "Destination",
    de: "Ziel",
    nl: "Bestemming",
    ru: "Место назначения",
    ja: "目的地",
    zh: "目的地",
    ar: "الوجهة",
    es: "Destino",
    pt: "Destino"
  },
  "Passenger": {
    hi: "यात्री",
    fr: "Passager",
    de: "Passagier",
    nl: "Passagier",
    ru: "Пассажир",
    ja: "乗客",
    zh: "乘客",
    ar: "مسافر",
    es: "Pasajero",
    pt: "Passageiro"
  },
  "Airline": {
    hi: "एयरलाइन",
    fr: "Compagnie aérienne",
    de: "Fluggesellschaft",
    nl: "Luchtvaartmaatschappij",
    ru: "Авиакомпания",
    ja: "航空会社",
    zh: "航空公司",
    ar: "شركة طيران",
    es: "Aerolínea",
    pt: "Companhia Aérea"
  },
  "Departure Time": {
    hi: "प्रस्थान का समय",
    fr: "Heure de départ",
    de: "Abflugzeit",
    nl: "Vertrektijd",
    ru: "Время отправления",
    ja: "出発時間",
    zh: "出发时间",
    ar: "وقت المغادرة",
    es: "Hora de salida",
    pt: "Hora de partida"
  },
  "Class / Seats": {
    hi: "श्रेणी / सीटें",
    fr: "Classe / Sièges",
    de: "Klasse / Sitze",
    nl: "Klasse / Stoelen",
    ru: "Класс / Места",
    ja: "クラス/座席",
    zh: "舱位/座位",
    ar: "فئة / مقاعد",
    es: "Clase / Asientos",
    pt: "Classe / Assentos"
  },
  "pax": {
    hi: "यात्री",
    fr: "pax",
    de: "pax",
    nl: "pax",
    ru: "чел.",
    ja: "名",
    zh: "人",
    ar: "أشخاص",
    es: "pax",
    pt: "pax"
  },
  "Passengers": {
    hi: "यात्री",
    fr: "Passagers",
    de: "Passagiere",
    nl: "Passagiers",
    ru: "Пассажиры",
    ja: "乗客",
    zh: "乘客",
    ar: "الركاب",
    es: "Pasajeros",
    pt: "Passageiros"
  },
  "Cabin Class": {
    hi: "केबिन श्रेणी",
    fr: "Classe de cabine",
    de: "Kabinenklasse",
    nl: "Cabineklasse",
    ru: "Класс салона",
    ja: "キャビンクラス",
    zh: "客舱等级",
    ar: "درجة المقصورة",
    es: "Clase de cabina",
    pt: "Classe de cabine"
  },
  "Economy": {
    hi: "इकोनॉमी",
    fr: "Économique",
    de: "Economy",
    nl: "Economy",
    ru: "Эконом",
    ja: "エコノミー",
    zh: "经济舱",
    ar: "اقتصادية",
    es: "Turista",
    pt: "Econômica"
  },
  "Premium": {
    hi: "प्रीमियम",
    fr: "Premium",
    de: "Premium",
    nl: "Premium",
    ru: "Премиум",
    ja: "プレミアム",
    zh: "高级舱",
    ar: "ممتازة",
    es: "Premium",
    pt: "Premium"
  },
  "Business": {
    hi: "बिज़नेस",
    fr: "Affaires",
    de: "Business",
    nl: "Business",
    ru: "Бизнес",
    ja: "ビジネス",
    zh: "商务舱",
    ar: "رجال الأعمال",
    es: "Negocios",
    pt: "Executiva"
  },
  "First": {
    hi: "फर्स्ट",
    fr: "Première",
    de: "First",
    nl: "First",
    ru: "Первый",
    ja: "ファースト",
    zh: "头等舱",
    ar: "الأولى",
    es: "Primera",
    pt: "Primeira"
  },
  "Schedule:": {
    hi: "अनुसूची:",
    fr: "Horaire :",
    de: "Flugplan:",
    nl: "Schema:",
    ru: "Расписание:",
    ja: "スケジュール:",
    zh: "时刻表:",
    ar: "الجدول:",
    es: "Horario:",
    pt: "Horário:"
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
    console.log(`Fixed final flight translations in ${lang}.json`);
  }
});
