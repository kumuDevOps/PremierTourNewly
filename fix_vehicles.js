const fs = require('fs');

const missingKeys = {
  "Select Vehicle": {
    hi: "वाहन चुनें", fr: "Sélectionner un véhicule", de: "Fahrzeug auswählen", nl: "Selecteer voertuig",
    ru: "Выберите автомобиль", ja: "車両を選択", zh: "选择车辆", ar: "اختر مركبة", es: "Seleccionar vehículo", pt: "Selecionar veículo"
  },
  "Vehicle": {
    hi: "वाहन", fr: "Véhicule", de: "Fahrzeug", nl: "Voertuig",
    ru: "Автомобиль", ja: "車両", zh: "车辆", ar: "مركبة", es: "Vehículo", pt: "Veículo"
  },
  "Select Vehicle Model": {
    hi: "वाहन मॉडल चुनें", fr: "Sélectionner le modèle de véhicule", de: "Fahrzeugmodell auswählen", nl: "Selecteer voertuigmodel",
    ru: "Выберите модель автомобиля", ja: "車両モデルを選択", zh: "选择车型", ar: "حدد طراز المركبة", es: "Seleccionar modelo de vehículo", pt: "Selecionar modelo de veículo"
  },
  "No Premium Vehicles Match Filter": {
    hi: "कोई प्रीमियम वाहन फ़िल्टर से मेल नहीं खाता", fr: "Aucun véhicule premium ne correspond au filtre", de: "Keine Premium-Fahrzeuge entsprechen dem Filter", nl: "Geen premium voertuigen komen overeen met het filter",
    ru: "Ни один автомобиль премиум-класса не соответствует фильтру", ja: "フィルターに一致するプレミアム車両はありません", zh: "没有符合过滤条件的高级车辆", ar: "لا توجد مركبات ممتازة تطابق الفلتر", es: "Ningún vehículo premium coincide con el filtro", pt: "Nenhum veículo premium corresponde ao filtro"
  },
  "Vehicle Category:": {
    hi: "वाहन श्रेणी:", fr: "Catégorie de véhicule :", de: "Fahrzeugkategorie:", nl: "Voertuigcategorie:",
    ru: "Категория транспортного средства:", ja: "車両カテゴリー:", zh: "车辆类别：", ar: "فئة المركبة:", es: "Categoría de vehículo:", pt: "Categoria de veículo:"
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
