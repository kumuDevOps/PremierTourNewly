const fs = require('fs');
const missingKeys = {
  "Tour Booking Completed!": {
    hi: "टूर बुकिंग पूर्ण!", fr: "Réservation de circuit terminée !", de: "Tourbuchung abgeschlossen!", nl: "Tourboeking voltooid!",
    ru: "Бронирование тура завершено!", ja: "ツアー予約完了！", zh: "旅游预订完成！", ar: "اكتمل حجز الجولة!", es: "¡Reserva de tour completada!", pt: "Reserva de tour concluída!"
  },
  "Stay Reservation Completed!": {
    hi: "ठहरना आरक्षण पूर्ण!", fr: "Réservation de séjour terminée !", de: "Aufenthaltsreservierung abgeschlossen!", nl: "Verblijfsreservering voltooid!",
    ru: "Бронирование проживания завершено!", ja: "宿泊予約完了！", zh: "住宿预订完成！", ar: "اكتمل حجز الإقامة!", es: "¡Reserva de estancia completada!", pt: "Reserva de estadia concluída!"
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
    console.log(`Fixed completed ${lang}.json`);
  }
});
