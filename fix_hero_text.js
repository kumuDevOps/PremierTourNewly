const fs = require('fs');
const missingKeys = {
  "Premium Fleet": {
    hi: "प्रीमियम बेड़ा", fr: "Flotte Premium", de: "Premium Flotte", nl: "Premium Wagenpark",
    ru: "Премиальный парк", ja: "プレミアムフリート", zh: "高级车队", ar: "أسطول مميز", es: "Flota Premium", pt: "Frota Premium"
  },
  "Secure Booking": {
    hi: "सुरक्षित बुकिंग", fr: "Réservation sécurisée", de: "Sichere Buchung", nl: "Veilige Boeking",
    ru: "Безопасное бронирование", ja: "安全な予約", zh: "安全预订", ar: "حجز آمن", es: "Reserva segura", pt: "Reserva Segura"
  },
  "Confirm Your Vehicle": {
    hi: "अपने वाहन की पुष्टि करें", fr: "Confirmez votre véhicule", de: "Bestätigen Sie Ihr Fahrzeug", nl: "Bevestig uw voertuig",
    ru: "Подтвердите свой автомобиль", ja: "車両を確認する", zh: "确认您的车辆", ar: "تأكيد سيارتك", es: "Confirme su vehículo", pt: "Confirme seu veículo"
  },
  "Sri Lanka Vehicle Rental Packages": {
    hi: "श्रीलंका वाहन किराया पैकेज", fr: "Forfaits de location de véhicules au Sri Lanka", de: "Sri Lanka Fahrzeugmietpakete", nl: "Autoverhuurpakketten Sri Lanka",
    ru: "Пакеты аренды автомобилей на Шри-Ланке", ja: "スリランカレンタカーパッケージ", zh: "斯里兰卡车辆租赁套餐", ar: "باقات تأجير المركبات في سريلانكا", es: "Paquetes de alquiler de vehículos en Sri Lanka", pt: "Pacotes de aluguel de veículos no Sri Lanka"
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
