const fs = require('fs');
const path = './src/locales/ar.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

// Delete the prefix
for (const key in data) {
  if (typeof data[key] === 'string') {
    data[key] = data[key].replace(/تأكيد:\s*/g, '');
    data[key] = data[key].replace(/تأكيد\s*:\s*/g, '');
  }
}

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
  "Refresh List": "تحديث القائمة"
};

for (const key in fixes) {
  data[key] = fixes[key];
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
console.log('Fixed translations');
