const fs = require('fs');
const langs = ['en', 'de', 'fr', 'nl', 'ja', 'zh', 'ru', 'hi', 'ar'];

const translations = {
  hi: {
    "At least 8 characters": "कम से कम 8 अक्षर",
    "Uppercase letter (A-Z)": "बड़ा अक्षर (A-Z)",
    "Lowercase letter (a-z)": "छोटा अक्षर (a-z)",
    "Number (0-9)": "संख्या (0-9)",
    "Special char (!@#$)": "विशेष वर्ण (!@#$)",
    "Passwords match": "पासवर्ड मेल खाते हैं",
    "Light Mode": "लाइट मोड",
    "Dark Mode": "डार्क मोड",
    "Star Luxury": "स्टार लक्ज़री",
    "We couldn't locate any active flight, car, or guided tour reservations linked to your registered email account.": "हम आपके पंजीकृत ईमेल खाते से जुड़े किसी भी सक्रिय उड़ान, कार, या निर्देशित टूर आरक्षण का पता नहीं लगा सके।",
    "You\\'re all set!": "आप बिल्कुल तैयार हैं!",
    "Please present this physical PDF voucher or digital screen pass upon arrival.": "कृपया आगमन पर यह भौतिक PDF वाउचर या डिजिटल स्क्रीन पास प्रस्तुत करें।",
    "For 24/7 concierge assistance, contact support@premiertourbooking.com or +1 800-555-PREMIER.": "24/7 कंसीयज सहायता के लिए, support@premiertourbooking.com या +1 800-555-PREMIER पर संपर्क करें।"
  },
  de: {
    "At least 8 characters": "Mindestens 8 Zeichen",
    "Uppercase letter (A-Z)": "Großbuchstabe (A-Z)",
    "Lowercase letter (a-z)": "Kleinbuchstabe (a-z)",
    "Number (0-9)": "Zahl (0-9)",
    "Special char (!@#$)": "Sonderzeichen (!@#$)",
    "Passwords match": "Passwörter stimmen überein",
    "Light Mode": "Heller Modus",
    "Dark Mode": "Dunkler Modus",
    "Star Luxury": "Sterne Luxus",
    "We couldn't locate any active flight, car, or guided tour reservations linked to your registered email account.": "Wir konnten keine aktiven Flug-, Auto- oder geführten Tourreservierungen finden, die mit Ihrem registrierten E-Mail-Konto verknüpft sind.",
    "You\\'re all set!": "Alles ist bereit!",
    "Please present this physical PDF voucher or digital screen pass upon arrival.": "Bitte legen Sie bei der Ankunft diesen physischen PDF-Gutschein oder den digitalen Bildschirm-Pass vor.",
    "For 24/7 concierge assistance, contact support@premiertourbooking.com or +1 800-555-PREMIER.": "Für 24/7 Concierge-Unterstützung kontaktieren Sie support@premiertourbooking.com oder +1 800-555-PREMIER."
  },
  fr: {
    "At least 8 characters": "Au moins 8 caractères",
    "Uppercase letter (A-Z)": "Lettre majuscule (A-Z)",
    "Lowercase letter (a-z)": "Lettre minuscule (a-z)",
    "Number (0-9)": "Chiffre (0-9)",
    "Special char (!@#$)": "Caractère spécial (!@#$)",
    "Passwords match": "Les mots de passe correspondent",
    "Light Mode": "Mode clair",
    "Dark Mode": "Mode sombre",
    "Star Luxury": "Étoiles Luxe",
    "We couldn't locate any active flight, car, or guided tour reservations linked to your registered email account.": "Nous n'avons pu trouver aucune réservation active de vol, de voiture ou de visite guidée liée à votre compte de messagerie enregistré.",
    "You\\'re all set!": "Tout est prêt !",
    "Please present this physical PDF voucher or digital screen pass upon arrival.": "Veuillez présenter ce bon PDF physique ou pass d'écran numérique à votre arrivée.",
    "For 24/7 concierge assistance, contact support@premiertourbooking.com or +1 800-555-PREMIER.": "Pour une assistance de conciergerie 24h/24 et 7j/7, contactez support@premiertourbooking.com ou +1 800-555-PREMIER."
  },
  nl: {
    "At least 8 characters": "Minimaal 8 tekens",
    "Uppercase letter (A-Z)": "Hoofdletter (A-Z)",
    "Lowercase letter (a-z)": "Kleine letter (a-z)",
    "Number (0-9)": "Cijfer (0-9)",
    "Special char (!@#$)": "Speciaal teken (!@#$)",
    "Passwords match": "Wachtwoorden komen overeen",
    "Light Mode": "Lichte modus",
    "Dark Mode": "Donkere modus",
    "Star Luxury": "Sterren Luxe",
    "We couldn't locate any active flight, car, or guided tour reservations linked to your registered email account.": "We konden geen actieve vlucht-, auto- of begeleide tourreserveringen vinden die zijn gekoppeld aan uw geregistreerde e-mailaccount.",
    "You\\'re all set!": "Je bent er helemaal klaar voor!",
    "Please present this physical PDF voucher or digital screen pass upon arrival.": "Gelieve deze fysieke PDF-voucher of digitale schermpas bij aankomst te tonen.",
    "For 24/7 concierge assistance, contact support@premiertourbooking.com or +1 800-555-PREMIER.": "Neem voor 24/7 conciërge-ondersteuning contact op met support@premiertourbooking.com of +1 800-555-PREMIER."
  },
  ja: {
    "At least 8 characters": "8文字以上",
    "Uppercase letter (A-Z)": "大文字（A-Z）",
    "Lowercase letter (a-z)": "小文字（a-z）",
    "Number (0-9)": "数字（0-9）",
    "Special char (!@#$)": "特殊文字（!@#$）",
    "Passwords match": "パスワードが一致します",
    "Light Mode": "ライトモード",
    "Dark Mode": "ダークモード",
    "Star Luxury": "スター・ラグジュアリー",
    "We couldn't locate any active flight, car, or guided tour reservations linked to your registered email account.": "登録されたメールアカウントに関連付けられている、アクティブなフライト、車、またはガイド付きツアーの予約が見つかりませんでした。",
    "You\\'re all set!": "準備完了です！",
    "Please present this physical PDF voucher or digital screen pass upon arrival.": "到着時に、この物理的なPDFバウチャーまたはデジタルスクリーンパスをご提示ください。",
    "For 24/7 concierge assistance, contact support@premiertourbooking.com or +1 800-555-PREMIER.": "24時間年中無休のコンシェルジュサポートについては、support@premiertourbooking.com または +1 800-555-PREMIER にお問い合わせください。"
  },
  zh: {
    "At least 8 characters": "至少 8 个字符",
    "Uppercase letter (A-Z)": "大写字母 (A-Z)",
    "Lowercase letter (a-z)": "小写字母 (a-z)",
    "Number (0-9)": "数字 (0-9)",
    "Special char (!@#$)": "特殊字符 (!@#$)",
    "Passwords match": "密码匹配",
    "Light Mode": "浅色模式",
    "Dark Mode": "深色模式",
    "Star Luxury": "星级奢华",
    "We couldn't locate any active flight, car, or guided tour reservations linked to your registered email account.": "我们找不到任何与您的注册电子邮件帐户关联的活动航班、汽车或导游预订。",
    "You\\'re all set!": "一切准备就绪！",
    "Please present this physical PDF voucher or digital screen pass upon arrival.": "抵达时，请出示此纸质 PDF 优惠券或数字屏幕通行证。",
    "For 24/7 concierge assistance, contact support@premiertourbooking.com or +1 800-555-PREMIER.": "如需全天候礼宾服务，请联系 support@premiertourbooking.com 或 +1 800-555-PREMIER。"
  },
  ru: {
    "At least 8 characters": "Не менее 8 символов",
    "Uppercase letter (A-Z)": "Заглавная буква (A-Z)",
    "Lowercase letter (a-z)": "Строчная буква (a-z)",
    "Number (0-9)": "Цифра (0-9)",
    "Special char (!@#$)": "Специальный символ (!@#$)",
    "Passwords match": "Пароли совпадают",
    "Light Mode": "Светлый режим",
    "Dark Mode": "Темный режим",
    "Star Luxury": "Звезды Люкс",
    "We couldn't locate any active flight, car, or guided tour reservations linked to your registered email account.": "Мы не смогли найти никаких активных бронирований авиабилетов, автомобилей или экскурсий с гидом, связанных с вашим зарегистрированным адресом электронной почты.",
    "You\\'re all set!": "Всё готово!",
    "Please present this physical PDF voucher or digital screen pass upon arrival.": "Пожалуйста, предъявите этот физический ваучер в формате PDF или цифровой пропуск на экране по прибытии.",
    "For 24/7 concierge assistance, contact support@premiertourbooking.com or +1 800-555-PREMIER.": "Для круглосуточной консьерж-поддержки обращайтесь по адресу support@premiertourbooking.com или по телефону +1 800-555-PREMIER."
  }
};

langs.forEach(lang => {
  const p = `./src/locales/${lang}.json`;
  if (fs.existsSync(p)) {
    const data = JSON.parse(fs.readFileSync(p, 'utf8'));
    if (translations[lang]) {
      Object.assign(data, translations[lang]);
    }
    // ensure english strings map to themselves
    if (lang === 'en') {
      const hiKeys = Object.keys(translations.hi);
      hiKeys.forEach(k => data[k] = k);
    }
    fs.writeFileSync(p, JSON.stringify(data, null, 2));
  }
});

console.log('Fixed all missing locales');
