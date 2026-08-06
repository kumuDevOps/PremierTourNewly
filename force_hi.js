const fs = require('fs');
const path = 'src/locales/hi.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const key = "For exclusive deals, tailored holiday packages, and the best of the Premier Tour Booking portfolio, add your email below.";
console.log("OLD VALUE:", data[key]);
data[key] = "विशेष ऑफ़र, अनुकूलित अवकाश पैकेज और प्रीमियर टूर बुकिंग के बेहतरीन पोर्टफोलियो के लिए, नीचे अपना ईमेल जोड़ें।";
console.log("NEW VALUE:", data[key]);

data["Dec-Mar for South/West. May-Sep for East."] = "दक्षिण/पश्चिम के लिए दिसंबर-मार्च। पूर्व के लिए मई-सितंबर।";
data["Pick up a tourist e-SIM at the airport."] = "हवाई अड्डे पर एक पर्यटक ई-सिम लें।";
data["Private luxury chauffeurs are highly recommended."] = "निजी लग्ज़री ड्राइवरों की अत्यधिक अनुशंसा की जाती है।";
data["Very safe for tourists. Standard precautions apply."] = "पर्यटकों के लिए बहुत सुरक्षित। मानक सावधानियां लागू होती हैं।";
data["Sinhala & Tamil. English is widely spoken."] = "सिंहली और तमिल। अंग्रेजी व्यापक रूप से बोली जाती है।";
data["Savor world-class culinary experiences infused with local spices."] = "स्थानीय मसालों से युक्त विश्व स्तरीय पाक अनुभवों का स्वाद लें।";
data["LKR (Sri Lankan Rupee). High-end spots accept USD."] = "LKR (श्रीलंकाई रुपया)। उच्च-स्तरीय स्थान USD स्वीकार करते हैं।";

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log("Saved.");
