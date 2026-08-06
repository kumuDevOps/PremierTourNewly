const fs = require('fs');

const missingKeys = {
  "Thank you for subscribing. Exclusive luxury offers and tailored holiday packages will be delivered to your inbox.": {
    hi: "सब्सक्राइब करने के लिए धन्यवाद। विशेष लक्जरी ऑफ़र और अनुकूलित अवकाश पैकेज आपके इनबॉक्स में वितरित किए जाएंगे।",
    fr: "Merci de vous être abonné. Des offres de luxe exclusives et des forfaits vacances sur mesure vous seront livrés dans votre boîte de réception.",
    de: "Vielen Dank für Ihr Abonnement. Exklusive Luxusangebote und maßgeschneiderte Urlaubspakete werden an Ihren Posteingang gesendet.",
    nl: "Bedankt voor uw aanmelding. Exclusieve luxe aanbiedingen en op maat gemaakte vakantiepakketten worden in uw inbox afgeleverd.",
    ru: "Спасибо за подписку. Эксклюзивные роскошные предложения и индивидуальные праздничные пакеты будут доставлены в ваш почтовый ящик.",
    ja: "ご購読ありがとうございます。限定のラグジュアリーオファーやカスタマイズされたホリデーパッケージが受信トレイに配信されます。",
    zh: "感谢您的订阅。独家豪华优惠和定制度假套餐将发送到您的收件箱。",
    ar: "شكرا لاشتراكك. سيتم تسليم عروض فاخرة حصرية وباقات عطلات مصممة خصيصًا إلى صندوق الوارد الخاص بك.",
    es: "Gracias por suscribirte. Exclusivas ofertas de lujo y paquetes de vacaciones a medida se enviarán a su bandeja de entrada.",
    pt: "Obrigado por se inscrever. Ofertas de luxo exclusivas e pacotes de férias sob medida serão entregues na sua caixa de entrada."
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
