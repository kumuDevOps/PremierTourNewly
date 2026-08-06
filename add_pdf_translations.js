const fs = require('fs');
const path = require('path');

const arDict = {
  "Unforgettable Honeymoon in Paradise!": "شهر عسل لا يُنسى في الفردوس!",
  "Our 14-day luxury tour surpassed all expectations! From the breathtaking sunrise at Sigiriya Fortress to private tea tasting in Ella and the thrilling Yala leopard safari, Premier Tours handled every detail flawlessly. Our chauffeur guide was extraordinarily attentive. Truly a 5-star experience!": "تجاوزت جولتنا الفاخرة التي استمرت 14 يومًا كل التوقعات! من شروق الشمس الخلاب في قلعة سيجيريا إلى تذوق الشاي الخاص في إيلا وسفاري الفهود المثير في يالا، تعاملت بريمير تورز مع كل التفاصيل بلا أخطاء. كان دليلنا السائق مهتمًا بشكل استثنائي. تجربة حقيقية بمستوى 5 نجوم!",
  "Impeccable Cultural Odyssey!": "ملحمة ثقافية لا تشوبها شائبة!",
  "Scaling Sigiriya Rock and exploring the ancient Dambulla cave temples with Premier Tours was the highlight of our family trip. The private air-conditioned vehicle was pristine, and the luxury boutique hotels booked for us were heavenly. Highly recommended for family travelers!": "كان تسلق صخرة سيجيريا واستكشاف معابد كهف دامبولا القديمة مع بريمير تورز أبرز ما في رحلتنا العائلية. كانت السيارة الخاصة المكيفة ممتازة ونظيفة، وكانت الفنادق الفاخرة التي تم حجزها لنا رائعة للغاية. موصى به بشدة للمسافرين مع عائلاتهم!",
  "Scenic Nine Arch Bridge & Ella Magic": "جسر الأقواس التسعة الخلاب وسحر إيلا",
  "The iconic blue train journey from Kandy to Ella was pure magic. Premier Tours arranged reserved First Class seats, seamless luggage transfers, and a private villa overlooking Little Adam's Peak. The tea factory tasting was top-notch. Will return soon!": "كانت رحلة القطار الأزرق الشهيرة من كاندي إلى إيلا سحرًا خالصًا. رتبت بريمير تورز مقاعد محجوزة في الدرجة الأولى، ونقل الأمتعة بسلاسة، وفيلا خاصة تطل على قمة آدم الصغير. كان تذوق الشاي في المصنع ممتازًا للغاية. سنعود قريبًا!",
  "Blue Whales in Mirissa & Colonial Galle Fort": "الحيتان الزرقاء في ميريسا وحصن غالي الاستعماري",
  "Seeing blue whales in Mirissa up close was awe-inspiring! Walking through the historic Galle Dutch Fort at sunset and relaxing in our private beachfront villa made this vacation unforgettable. 24/7 customer support was always on hand.": "كانت رؤية الحيتان الزرقاء في ميريسا عن قرب تجربة مذهلة! جعل المشي عبر حصن غالي الهولندي التاريخي عند الغروب والاسترخاء في فيلتنا الخاصة المطلة على الشاطئ هذه العطلة لا تُنسى. كان دعم العملاء على مدار الساعة متواجدًا دائمًا.",
  "Thrilling Elephant Gathering at Minneriya": "تجمع الفيلة المثير في مينيريا",
  "Witnessing hundreds of wild elephants gather at Minneriya Lake was a bucket-list dream come true! Premier Tours provided an expert naturalist guide and a custom 4x4 open-top jeep safari. Phenomenal organization and warm hospitality throughout!": "كانت مشاهدة مئات الفيلة البرية وهي تتجمع في بحيرة مينيريا حلمًا تحقق! قدمت بريمير تورز خبيرًا طبيعيًا وسفاري بجيب مكشوف 4x4. تنظيم مذهل وضيافة دافئة طوال الرحلة!",
  "Sophia & Liam Miller": "صوفيا وليام ميلر",
  "Marcus & Elena Vance": "ماركوس وإلينا فانس",
  "David & Chloe Dubois": "ديفيد وكلوي دوبوا",
  "Aarav & Meera Sharma": "آراف وميرا شارما",
  "Hannah & Lukas Weber": "هانا ولوكاس فيبر",
  "London, United Kingdom": "لندن، المملكة المتحدة",
  "Sydney, Australia": "سيدني، أستراليا",
  "Paris, France": "باريس، فرنسا",
  "Mumbai, India": "مومباي، الهند",
  "Munich, Germany": "ميونخ، ألمانيا",
  "Luxury Sri Lanka Grand Tour • 14 Days": "الجولة الكبرى الفاخرة في سريلانكا • 14 يومًا",
  "Cultural Triangle & Ancient Wonders • 5 Days": "المثلث الثقافي والعجائب القديمة • 5 أيام",
  "Hill Country & Tea Plantation Escape • 4 Days": "ملاذ المرتفعات ومزارع الشاي • 4 أيام",
  "Southern Coastal Bliss & Whale Watching • 6 Days": "نعيم الساحل الجنوبي ومراقبة الحيتان • 6 أيام",
  "Wild Sri Lanka & Elephant Safari Expedition • 7 Days": "سريلانكا البرية واستكشاف سفاري الفيلة • 7 أيام",
  "August 2026": "أغسطس 2026",
  "Incredible Sri Lanka Experience!": "تجربة رائعة في سريلانكا!"
};

let code = fs.readFileSync('src/lib/i18n.tsx', 'utf8');

const arEntry = `  ar: ${JSON.stringify(arDict, null, 4)},`;

if (code.includes('ar: {},};')) {
  code = code.replace('ar: {},};', arEntry + '};');
  fs.writeFileSync('src/lib/i18n.tsx', code, 'utf8');
  console.log('Successfully injected ar dictionary into src/lib/i18n.tsx');
} else {
  console.log('ar: {},}; pattern not found or already injected');
}
