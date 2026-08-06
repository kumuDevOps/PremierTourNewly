const fs = require('fs');

const extraKeys = {
  "15% Deposit Now": {
    zh: "先付15%定金",
    ar: "إيداع 15٪ الآن",
    fr: "15% d'acompte maintenant",
    de: "15% Anzahlung jetzt",
    nl: "15% Aanbetaling Nu",
    ru: "Депозит 15% сейчас",
    ja: "今すぐ15%のデポジット",
    hi: "अभी 15% जमा करें",
    es: "15% de depósito ahora",
    pt: "15% de depósito agora"
  },
  "15% Deposit Guarantee": {
    zh: "15%定金保障",
    ar: "ضمان إيداع 15٪",
    fr: "Garantie d'acompte de 15%",
    de: "15% Anzahlungsgarantie",
    nl: "15% Aanbetalingsgarantie",
    ru: "Гарантия депозита 15%",
    ja: "15%デポジット保証",
    hi: "15% जमा गारंटी",
    es: "Garantía de depósito del 15%",
    pt: "Garantia de depósito de 15%"
  },
  "An automated security deposit hold of": {
    zh: "预扣押金预授权",
    ar: "احتجاز تأمين تلقائي قدره",
    fr: "Une retenue de dépôt de garantie automatisée de",
    de: "Eine automatische Kaution von",
    nl: "Een automatische borgsom van",
    ru: "Автоматическая залоговая сумма в размере",
    ja: "自動セキュリティデポジット",
    hi: "एक स्वचालित सुरक्षा जमा राशि",
    es: "Un depósito de garantía automatizado de",
    pt: "Um depósito de garantia automatizado de"
  },
  "is pre-authorized on your card. No money is charged; the temporary hold is automatically released 24 hours after vehicle return post-inspection.": {
    zh: "在您的卡上预授权。不收取资金；在还车检查后24小时内自动解除临时冻结。",
    ar: "مجهزة مسبقاً على بطاقتك. لا يتم خصم أي أموال؛ يتم إطلاق الحجز المؤقت تلقائيًا بعد 24 ساعة من إرجاع السيارة.",
    fr: "est pré-autorisée sur votre carte. Aucun argent n'est débité; le blocage temporaire est automatiquement levé 24h après le retour du véhicule.",
    de: "wird auf Ihrer Karte vorautorisiert. Es wird kein Geld abgebucht; die vorübergehende Sperre wird 24 Stunden nach Fahrzeugrückgabe aufgehoben.",
    nl: "is geautoriseerd op uw kaart. Er wordt geen geld afgeschreven; de reservering wordt 24 uur na inlevering automatisch opgeheven.",
    ru: "предварительно авторизована на вашей карте. Списание не производится; временное удержание снимается автоматически через 24 часа после возврата автомобиля.",
    ja: "がカードで事前承認されます。料金は引き落とされません。車両返却後24時間以内に自動解除されます。",
    hi: "आपके कार्ड पर पूर्व-अधिकृत है। कोई पैसा नहीं काटा जाता है; वाहन वापसी के 24 घंटे बाद अस्थायी होल्ड स्वचालित रूप से जारी किया जाता है।",
    es: "está preautorizada en su tarjeta. No se cobra dinero; la retención temporal se libera automáticamente 24 horas después de devolver el vehículo.",
    pt: "é pré-autorizada no seu cartão. Nenhum valor é cobrado; o bloqueio temporário é libertado automaticamente 24 horas após a devolução do veículo."
  },
  "Mobile Phone Number (SMS OTP Verification)": {
    zh: "手机号码（短信验证码验证）",
    ar: "رقم الهاتف المحمول (التحقق من رمز OTP)",
    fr: "Numéro de téléphone portable (Vérification SMS OTP)",
    de: "Mobiltelefonnummer (SMS-OTP-Verifizierung)",
    nl: "Mobiel telefoonnummer (SMS OTP-verificatie)",
    ru: "Номер мобильного телефона (SMS OTP проверка)",
    ja: "携帯電話番号（SMS OTP認証）",
    hi: "मोबाइल फोन नंबर (एसएमएस ओटीपी सत्यापन)",
    es: "Número de teléfono móvil (Verificación de SMS OTP)",
    pt: "Número de telemóvel (Verificação SMS OTP)"
  },
  "PayPal Express Checkout Preview:": {
    zh: "PayPal 快捷结账预览：",
    ar: "معاينة الدفع السريع عبر PayPal:",
    fr: "Aperçu du paiement PayPal Express :",
    de: "PayPal Express-Checkout Vorschau:",
    nl: "PayPal Express Checkout Voorbeeld:",
    ru: "Предварительный просмотр экспресс-оплаты PayPal:",
    ja: "PayPal エクスプレスチェックアウト プレビュー:",
    hi: "पेपैल एक्सप्रेस चेकआउट पूर्वावलोकन:",
    es: "Vista previa de pago rápido con PayPal:",
    pt: "Pré-visualização do PayPal Express Checkout:"
  },
  "Deposit Due Today (15%)": {
    zh: "今日应付定金 (15%)",
    ar: "الوديعة المستحقة اليوم (15٪)",
    fr: "Acompte dû aujourd'hui (15%)",
    de: "Heute fällige Anzahlung (15%)",
    nl: "Vandaag verschuldigde aanbetaling (15%)",
    ru: "Депозит к оплате сегодня (15%)",
    ja: "本日のお支払いデポジット (15%)",
    hi: "आज देय जमा (15%)",
    es: "Depósito adeudado hoy (15%)",
    pt: "Depósito devido hoje (15%)"
  },
  "Balance Upon Arrival (85%)": {
    zh: "到达时支付尾款 (85%)",
    ar: "الرصيد عند الوصول (85٪)",
    fr: "Solde à l'arrivée (85%)",
    de: "Restbetrag bei Ankunft (85%)",
    nl: "Saldo bij aankomst (85%)",
    ru: "Остаток по прибытии (85%)",
    ja: "到着時のお支払い残高 (85%)",
    hi: "आगमन पर शेष राशि (85%)",
    es: "Saldo a la llegada (85%)",
    pt: "Saldo na chegada (85%)"
  },
  "Flight Number or Arrival Notes (Optional)": {
    zh: "航班号或到达备注（选填）",
    ar: "رقم الرحلة أو ملاحظات الوصول (اختياري)",
    fr: "Numéro de vol ou remarques d'arrivée (Optionnel)",
    de: "Flugnummer oder Ankunftshinweise (Optional)",
    nl: "Vluchtnummer of aankomstnotities (Optioneel)",
    ru: "Номер рейса или примечания по прибытию (необязательно)",
    ja: "便名または到着の注意事項（任意）",
    hi: "उड़ान संख्या या आगमन नोट्स (वैकल्पिक)",
    es: "Número de vuelo u notas de llegada (Opcional)",
    pt: "Número de voo ou notas de chegada (Opcional)"
  },
  "Pay only": {
    zh: "只需支付",
    ar: "ادفع فقط",
    fr: "Payez seulement",
    de: "Zahlen Sie nur",
    nl: "Betaal slechts",
    ru: "Оплатите только",
    ja: "お支払い額：",
    hi: "केवल भुगतान करें",
    es: "Pague solo",
    pt: "Pague apenas"
  },
  "today to lock in your reservation. The remaining balance can be paid in cash or card upon arrival.": {
    zh: "今日锁定您的预订。剩余尾款可在到达时现金或刷卡支付。",
    ar: "اليوم لتأكيد حجزك. يمكن دفع الرصيد المتبقي نقداً أو بالبطاقة عند الوصول.",
    fr: "aujourd'hui pour verrouiller votre réservation. Le solde restant peut être réglé en espèces ou par carte à l'arrivée.",
    de: "heute, um Ihre Reservierung zu sichern. Der Restbetrag kann bei der Ankunft bar oder per Karte bezahlt werden.",
    nl: "vandaag om uw reservering vast te leggen. Het resterende saldo kan bij aankomst contant of per kaart worden voldaan.",
    ru: "сегодня, чтобы зафиксировать бронирование. Оставшаяся сумма оплачивается наличными или картой по прибытии.",
    ja: "で予約を確定できます。残額は到着時に現金またはカードでお支払いいただけます。",
    hi: "आज अपनी बुकिंग लॉक करने के लिए। शेष राशि का भुगतान आगमन पर नकद या कार्ड द्वारा किया जा सकता है।",
    es: "hoy para asegurar su reserva. El saldo restante se puede pagar en efectivo o tarjeta a la llegada.",
    pt: "hoje para garantir a sua reserva. O valor restante pode ser pago em dinheiro ou cartão à chegada."
  },
  "Proceed with PayHere": {
    zh: "通过 PayHere 继续支付",
    ar: "المتابعة مع PayHere",
    fr: "Poursuivre avec PayHere",
    de: "Weiter mit PayHere",
    nl: "Doorgaan met PayHere",
    ru: "Продолжить с PayHere",
    ja: "PayHere で進む",
    hi: "PayHere के साथ आगे बढ़ें",
    es: "Continuar con PayHere",
    pt: "Prosseguir com PayHere"
  },
  "Pay with PayPal": {
    zh: "使用 PayPal 支付",
    ar: "الدفع بواسطة PayPal",
    fr: "Payer avec PayPal",
    de: "Mit PayPal bezahlen",
    nl: "Betalen met PayPal",
    ru: "Оплатить с помощью PayPal",
    ja: "PayPal で支払う",
    hi: "पेपैल से भुगतान करें",
    es: "Pagar con PayPal",
    pt: "Pagar com PayPal"
  },
  "Pay 15% Deposit": {
    zh: "支付 15% 定金",
    ar: "دفع إيداع 15٪",
    fr: "Payer 15% d'acompte",
    de: "15% Anzahlung leisten",
    nl: "Betaal 15% Aanbetaling",
    ru: "Оплатить депозит 15%",
    ja: "15%のデポジットを支払う",
    hi: "15% जमा राशि का भुगतान करें",
    es: "Pagar el 15% de depósito",
    pt: "Pagar 15% de depósito"
  },
  "Confirm": {
    zh: "确认",
    ar: "تأكيد",
    fr: "Confirmer",
    de: "Bestätigen",
    nl: "Bevestigen",
    ru: "Подтвердить",
    ja: "確認する",
    hi: "पुष्टि करें",
    es: "Confirmar",
    pt: "Confirmar"
  }
};

const langs = ["en", "zh", "ar", "fr", "de", "nl", "ru", "ja", "hi", "es", "pt"];

langs.forEach(lang => {
  const srcPath = `src/locales/${lang}.json`;
  const publicPath = `public/locales/${lang}.json`;

  if (!fs.existsSync(srcPath)) return;
  const data = JSON.parse(fs.readFileSync(srcPath, "utf8"));

  for (const [k, v] of Object.entries(extraKeys)) {
    if (lang === "en") {
      data[k] = k;
    } else if (v[lang]) {
      data[k] = v[lang];
    }
  }

  fs.writeFileSync(srcPath, JSON.stringify(data, null, 2));
  fs.writeFileSync(publicPath, JSON.stringify(data, null, 2));
});

let i18nContent = fs.readFileSync('src/lib/i18n.tsx', 'utf8');

for (const lang of ['zh', 'ar', 'fr', 'de', 'nl', 'ru', 'ja', 'hi', 'es', 'pt']) {
  const entries = Object.entries(extraKeys)
    .map(([k, v]) => `    ${JSON.stringify(k)}: ${JSON.stringify(v[lang] || k)}`)
    .join(',\n');

  const langBlockRegex = new RegExp(`(${lang}:\\s*\\{)([^}]*?)(\\})`, 's');
  if (langBlockRegex.test(i18nContent)) {
    i18nContent = i18nContent.replace(langBlockRegex, (match, p1, p2, p3) => {
      const cleanP2 = p2.trim();
      const separator = cleanP2.length > 0 ? ',\n' : '\n';
      return `${p1}\n${cleanP2}${separator}${entries}\n  ${p3}`;
    });
  }
}

fs.writeFileSync('src/lib/i18n.tsx', i18nContent);
console.log("Injected extra payment notice translations successfully.");
