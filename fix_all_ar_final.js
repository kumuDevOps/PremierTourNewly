const fs = require('fs');
const path = './src/locales/ar.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const fixes = {
  "My Dashboard": "لوحة التحكم الخاصة بي",
  "Member Dashboard": "لوحة تحكم العضو",
  "Profile Settings": "إعدادات الملف الشخصي",
  "Admin Panel": "لوحة الإدارة",
  "My Bookings": "حجوزاتي",
  "REGISTER PROPERTY": "تسجيل عقار",
  "Register Property": "تسجيل عقار",
  "Review & Pay": "المراجعة والدفع",
  "Proceed to Review & Pay": "المتابعة إلى المراجعة والدفع",
  "Booking Voucher": "قسيمة الحجز",
  "Select Hotel": "اختر فندقاً",
  "Guest Info": "معلومات الضيف",
  "Guest Details": "تفاصيل الضيف",
  "List View": "عرض القائمة",
  "Map View": "عرض الخريطة",
  "Grid View": "عرض الشبكة",
  "Voucher": "قسيمة",
  "Pay": "الدفع",
  "Search items...": "ابحث عن العناصر...",
  "Searching bookings...": "جاري البحث عن الحجوزات...",
  "Secure panel for internal reservation and tour management": "لوحة آمنة للحجز الداخلي وإدارة الجولات",
  "Securing Flight Seats...": "تأمين مقاعد الرحلة...",
  "Select Car Category": "حدد فئة السيارة",
  "Select End Date": "تحديد تاريخ الانتهاء",
  "Select Guests & Rooms": "اختر الضيوف والغرف",
  "Select Hotel / Resort": "تحديد فندق / منتجع",
  "Your Bookings List": "قائمة حجوزاتك",
  "Sign in to save your wishlist, view and track bookings, and manage your travel itineraries.": "سجل الدخول لحفظ قائمة أمنياتك، وعرض وتتبع الحجوزات، وإدارة مسارات سفرك.",
  "Save to Wishlist": "أضف إلى قائمة الأمنيات",
  "Select Payment Gateway": "تحديد بوابة الدفع",
  "Select any stop below to automatically focus and view live Google map details": "حدد أي محطة أدناه للتركيز تلقائيًا وعرض تفاصيل خرائط جوجل المباشرة",
  "Thank you for booking with The Luxury Experience. Your payment has been processed successfully. Attached to this email is your official PDF Luxury Travel Voucher for reservation": "نشكرك على حجزك مع تجربة الرفاهية. تمت معالجة دفعتك بنجاح. مرفق بهذا البريد الإلكتروني قسيمة السفر الفاخرة الرسمية بصيغة PDF للحجز",
  "You will be securely authenticated with PayPal Express to confirm your booking.": "ستتم مصادقتك بشكل آمن مع PayPal Express لتأكيد حجزك.",
  "to your Wishlist!": "إلى قائمة الأمنيات الخاصة بك!",
  "No hotel listings found. Click Add Hotel to register one.": "لم يتم العثور على قوائم فنادق. انقر فوق إضافة فندق لتسجيل واحد.",
  "Interact with our curated map to discover handpicked destinations, luxury stays, and scenic routes.": "تفاعل مع خريطتنا المنسقة لاكتشاف وجهات مختارة بعناية وإقامات فاخرة وطرق ذات مناظر خلابة.",
  "Luxury Stay Booking Voucher for": "قسيمة حجز إقامة فاخرة لـ",
  "Official Booking Voucher": "قسيمة الحجز الرسمية",
  "Proceed to Payment": "المتابعة إلى الدفع",
  "LIVE ROUTE & TRANSFER MAP PREVIEW": "معاينة حية للمسار وخريطة النقل",
  "SRI LANKA MAP OVERVIEW": "نظرة عامة على خريطة سريلانكا",
  "PayPal Express Checkout Preview:": "معاينة الدفع السريع لـ PayPal:",
  "Seats": "مقاعد",
  "Refresh List": "تحديث القائمة",
  "Light Mode": "الوضع الفاتح",
  "Dark Mode": "الوضع الداكن",
  "Switch to Light Mode": "التبديل إلى الوضع الفاتح",
  "Switch to Dark Mode": "التبديل إلى الوضع الداكن",
  "HOTEL BOOKING PROCESS": "عملية حجز الفندق",
  "FLIGHT BOOKING PROCESS": "عملية حجز الرحلة",
  "CAR BOOKING PROCESS": "عملية حجز السيارة",
  "TOUR BOOKING PROCESS": "عملية حجز الجولة",
  "At least 8 characters": "8 أحرف على الأقل",
  "Uppercase letter (A-Z)": "حرف كبير (A-Z)",
  "Lowercase letter (a-z)": "حرف صغير (a-z)",
  "Number (0-9)": "رقم (0-9)",
  "Special char (!@#$)": "حرف خاص (!@#$)",
  "Passwords match": "تطابق كلمات المرور",
  "We couldn't locate any active flight, car, or guided tour reservations linked to your registered email account.": "لم نتمكن من العثور على أي رحلات جوية نشطة أو سيارات أو حجوزات جولات إرشادية مرتبطة بحساب بريدك الإلكتروني المسجل.",
  "You\\'re all set!": "أنت جاهز تمامًا!",
  "Please present this physical PDF voucher or digital screen pass upon arrival.": "يرجى تقديم هذه القسيمة الورقية بتنسيق PDF أو بطاقة الشاشة الرقمية عند الوصول.",
  "For 24/7 concierge assistance, contact support@premiertourbooking.com or +1 800-555-PREMIER.": "للحصول على مساعدة الكونسيرج على مدار الساعة طوال أيام الأسبوع، اتصل على support@premiertourbooking.com أو +1 800-555-PREMIER.",
  "admin": "مسؤول",
  "vip": "شخصية هامة",
  "standard": "قياسي",
  "Admin": "مسؤول",
  "VIP": "شخصية هامة",
  "Standard": "قياسي",
  "Star Luxury": "نجوم الفخامة"
};

for (const key in fixes) {
  data[key] = fixes[key];
}

// Delete the prefix
for (const key in data) {
  if (typeof data[key] === 'string') {
    data[key] = data[key].replace(/تأكيد:\s*/g, '');
    data[key] = data[key].replace(/تأكيد\s*:\s*/g, '');
  }
}

for (const key in data) {
  if (typeof data[key] === 'string') {
    data[key] = data[key]
      .replace(/Reعرض/g, 'مراجعة')
      .replace(/reعرض/g, 'مراجعة')
      .replace(/Preعرض/g, 'معاينة')
      .replace(/preعرض/g, 'معاينة')
      .replace(/Overعرض/g, 'نظرة عامة')
      .replace(/overعرض/g, 'نظرة عامة')
      .replace(/List عرض/g, 'عرض القائمة')
      .replace(/Map عرض/g, 'عرض الخريطة')
      .replace(/Grid عرض/g, 'عرض الشبكة')
      .replace(/عرضs/g, 'آراء')
      .replace(/حجزs/g, 'حجوزات')
      .replace(/حجز/g, 'حجز')
      .replace(/جولةs/g, 'جولات')
      .replace(/جولة/g, 'جولة')
      .replace(/طيران/g, 'طيران')
      .replace(/فاخر/g, 'فاخر')
      .replace(/المفضلة/g, 'المفضلة')
      .replace(/الدفع/g, 'الدفع')
      .replace(/تحديد/g, 'تحديد')
      .replace(/قسيمة/g, 'قسيمة');
  }
}

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log('Fixed ALL translations');
