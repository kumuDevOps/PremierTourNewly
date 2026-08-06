const fs = require('fs');

const arTranslations = {
    "At least 8 characters": "8 أحرف على الأقل",
    "Uppercase letter (A-Z)": "حرف كبير (A-Z)",
    "Lowercase letter (a-z)": "حرف صغير (a-z)",
    "Number (0-9)": "رقم (0-9)",
    "Special char (!@#$)": "حرف خاص (!@#$)",
    "Passwords match": "تطابق كلمات المرور",
    "Light Mode": "الوضع الفاتح",
    "Dark Mode": "الوضع الداكن",
    "Star Luxury": "نجوم الفخامة",
    "We couldn't locate any active flight, car, or guided tour reservations linked to your registered email account.": "لم نتمكن من العثور على أي رحلات جوية نشطة أو سيارات أو حجوزات جولات إرشادية مرتبطة بحساب بريدك الإلكتروني المسجل.",
    "You\\'re all set!": "أنت جاهز تمامًا!",
    "Please present this physical PDF voucher or digital screen pass upon arrival.": "يرجى تقديم هذه القسيمة الورقية بتنسيق PDF أو بطاقة الشاشة الرقمية عند الوصول.",
    "For 24/7 concierge assistance, contact support@premiertourbooking.com or +1 800-555-PREMIER.": "للحصول على مساعدة الكونسيرج على مدار الساعة طوال أيام الأسبوع، اتصل على support@premiertourbooking.com أو +1 800-555-PREMIER."
};

const p = `./src/locales/ar.json`;
if (fs.existsSync(p)) {
  const data = JSON.parse(fs.readFileSync(p, 'utf8'));
  Object.assign(data, arTranslations);
  fs.writeFileSync(p, JSON.stringify(data, null, 2));
}

console.log('Fixed missing Arabic locales');
