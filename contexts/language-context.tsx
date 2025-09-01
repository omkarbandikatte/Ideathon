"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface LanguageContextType {
  selectedLanguage: string
  setSelectedLanguage: (language: string) => void
  t: (key: string) => string
  playVoice: (text: string) => void
  languages: Array<{ code: string; name: string; nativeName: string }>
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const languages = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिंदी" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { code: "mr", name: "Marathi", nativeName: "मराठी" },
  { code: "bho", name: "Bhojpuri", nativeName: "भोजपुरी" },
]

// Global translations object
const translations = {
  en: {
    // Common translations
    welcome: "Welcome to SehatLink",
    subtitle: "Your Health Companion for Rural Communities",
    selectLanguage: "Select Language",
    backHome: "Back to Home",
    offlineMode: "Offline Mode Active",
    installApp: "Add to Home Screen",

    // Navigation
    viewReminders: "View Reminders",
    checkSymptoms: "Check Symptoms",
    healthTips: "Health Tips",
    trackNutrition: "Track Nutrition",
    emergencyHelp: "Emergency Help",
    communityAlerts: "Community Alerts",
    adminLogin: "Admin Login",

    // Reminders
    title_reminders: "Health Reminders",
    addReminder: "Add New Reminder",
    reminderTitle: "Reminder Title",
    reminderTime: "Time",
    reminderType: "Type",
    description: "Description",
    medication: "Medication",
    checkup: "Check-up",
    exercise: "Exercise",
    save: "Save Reminder",
    cancel: "Cancel",
    markDone: "Mark Done",
    reschedule: "Reschedule",
    pending: "Pending",
    done: "Completed",
    missed: "Missed",
    familyReminders: "Family Reminders",
    reminderHistory: "View History",
    offlineNotice: "You're offline. Reminders will sync when online.",
    savedOffline: "Reminder saved offline - will sync when online",

    // Emergency
    title_emergency: "Emergency Help",
    selectEmergency: "Select Emergency Type",
    emergencyContacts: "Emergency Contacts",
    callNow: "Call Now",
    available24h: "24/7 Available",
    distance: "Distance",
    firstAid: "First Aid Instructions",
    heartAttack: "Heart Attack: Call 108 immediately. Keep patient calm and sitting.",
    breathing: "Breathing Problems: Sit upright, loosen tight clothes, call for help.",
    injury: "Severe Injury: Do not move patient. Apply pressure to bleeding wounds.",
    fever: "High Fever: Give paracetamol, use cold compress, seek medical help.",
    pregnancy: "Pregnancy Emergency: Call 108, keep mother calm, prepare for delivery.",
    poisoning: "Poisoning: Do not induce vomiting. Call poison control immediately.",
    mentalHealth: "Mental Health: Stay calm, remove harmful objects, call for support.",

    // Health Tips
    title_healthtips: "Health Tips & Nutrition",
    healthTips: "Health Tips",
    nutritionTracker: "Nutrition Tracker",
    allCategories: "All Categories",
    general: "General",
    nutrition: "Nutrition",
    hygiene: "Hygiene",
    logFood: "Log Food Item",
    addFood: "Add Food",
    todaysMeals: "Today's Meals",
    shareWithCHW: "Share with CHW",
    foodPlaceholder: "Enter food item (e.g., Rice, Dal)",
    mealsLogged: "meals logged today",
    saveOffline: "Save Offline",
    playAudio: "Play Audio",
    voiceInput: "Voice Input",

    // Health Tips Content
    tip_clean_water: "Drink Clean Water",
    tip_clean_water_content:
      "Always boil water for 10 minutes before drinking. Clean water prevents waterborne diseases like cholera, typhoid, and diarrhea.",
    tip_green_vegetables: "Eat Green Vegetables",
    tip_green_vegetables_content:
      "Include spinach, fenugreek, and other green leafy vegetables in your daily diet for iron, vitamins A, C, and folate.",
    tip_hand_washing: "Wash Hands Frequently",
    tip_hand_washing_content:
      "Wash hands with soap for 20 seconds before eating, after using the toilet, and after touching animals or contaminated surfaces.",
    tip_daily_exercise: "Daily Exercise",
    tip_daily_exercise_content:
      "Walk for 30 minutes daily or do light exercises. It helps control blood pressure, diabetes, and improves heart health.",
    tip_balanced_diet: "Balanced Diet",
    tip_balanced_diet_content:
      "Include grains, pulses, vegetables, fruits, and dairy in your meals. Avoid excessive oil, sugar, and processed foods.",
    tip_sleep_hygiene: "Good Sleep Habits",
    tip_sleep_hygiene_content:
      "Sleep 7-8 hours daily. Maintain regular sleep times and avoid screens before bedtime for better rest and immunity.",
    tip_oral_hygiene: "Oral Hygiene",
    tip_oral_hygiene_content:
      "Brush teeth twice daily with fluoride toothpaste. Clean tongue and rinse mouth after meals to prevent dental problems.",
    tip_stress_management: "Manage Stress",
    tip_stress_management_content:
      "Practice deep breathing, meditation, or talk to family and friends. Chronic stress can lead to various health problems.",
    tip_seasonal_fruits: "Seasonal Fruits",
    tip_seasonal_fruits_content:
      "Eat seasonal fruits like mangoes in summer, oranges in winter. They provide essential vitamins and boost immunity naturally.",
    tip_yoga_meditation: "Yoga and Meditation",
    tip_yoga_meditation_content:
      "Practice simple yoga poses and 10 minutes of meditation daily. It improves flexibility, mental peace, and overall well-being.",
    nutritionShared: "Nutrition data shared with Community Health Worker successfully!",
  },
  hi: {
    // Common translations
    welcome: "सेहतलिंक में आपका स्वागत है",
    subtitle: "ग्रामीण समुदायों के लिए आपका स्वास्थ्य साथी",
    selectLanguage: "भाषा चुनें",
    backHome: "होम पर वापस",
    offlineMode: "ऑफलाइन मोड सक्रिय",
    installApp: "होम स्क्रीन पर जोड़ें",

    // Navigation
    viewReminders: "रिमाइंडर देखें",
    checkSymptoms: "लक्षण जांचें",
    healthTips: "स्वास्थ्य सुझाव",
    trackNutrition: "पोषण ट्रैक करें",
    emergencyHelp: "आपातकालीन सहायता",
    communityAlerts: "सामुदायिक अलर्ट",
    adminLogin: "एडमिन लॉगिन",

    // Reminders
    title_reminders: "स्वास्थ्य रिमाइंडर",
    addReminder: "नया रिमाइंडर जोड़ें",
    reminderTitle: "रिमाइंडर शीर्षक",
    reminderTime: "समय",
    reminderType: "प्रकार",
    description: "विवरण",
    medication: "दवा",
    checkup: "जांच",
    exercise: "व्यायाम",
    save: "रिमाइंडर सेव करें",
    cancel: "रद्द करें",
    markDone: "पूर्ण चिह्नित करें",
    reschedule: "पुनर्निर्धारण",
    pending: "लंबित",
    done: "पूर्ण",
    missed: "छूट गया",
    familyReminders: "पारिवारिक रिमाइंडर",
    reminderHistory: "इतिहास देखें",
    offlineNotice: "आप ऑफलाइन हैं। रिमाइंडर ऑनलाइन होने पर सिंक होंगे।",
    savedOffline: "रिमाइंडर ऑफलाइन सेव किया गया - ऑनलाइन होने पर सिंक होगा",

    // Emergency
    title_emergency: "आपातकालीन सहायता",
    selectEmergency: "आपातकाल का प्रकार चुनें",
    emergencyContacts: "आपातकालीन संपर्क",
    callNow: "अभी कॉल करें",
    available24h: "24/7 उपलब्ध",
    distance: "दूरी",
    firstAid: "प्राथमिक चिकित्सा निर्देश",
    heartAttack: "दिल का दौरा: तुरंत 108 पर कॉल करें। मरीज़ को शांत और बैठाकर रखें।",
    breathing: "सांस की समस्या: सीधे बैठें, तंग कपड़े ढीले करें, मदद के लिए कॉल करें।",
    injury: "गंभीर चोट: मरीज़ को न हिलाएं। खून बहने वाले घावों पर दबाव डालें।",
    fever: "तेज़ बुखार: पैरासिटामोल दें, ठंडी पट्टी करें, डॉक्टर से मिलें।",
    pregnancy: "गर्भावस्था आपातकाल: 108 पर कॉल करें, माँ को शांत रखें।",
    poisoning: "ज़हर: उल्टी न कराएं। तुरंत ज़हर नियंत्रण को कॉल करें।",
    mentalHealth: "मानसिक स्वास्थ्य: शांत रहें, हानिकारक वस्तुएं हटाएं।",

    // Health Tips
    title_healthtips: "स्वास्थ्य सुझाव और पोषण",
    healthTips: "स्वास्थ्य सुझाव",
    nutritionTracker: "पोषण ट्रैकर",
    allCategories: "सभी श्रेणियां",
    general: "सामान्य",
    nutrition: "पोषण",
    hygiene: "स्वच्छता",
    logFood: "भोजन लॉग करें",
    addFood: "भोजन जोड़ें",
    todaysMeals: "आज का भोजन",
    shareWithCHW: "CHW के साथ साझा करें",
    foodPlaceholder: "भोजन आइटम दर्ज करें (जैसे चावल, दाल)",
    mealsLogged: "आज भोजन लॉग किया गया",
    saveOffline: "ऑफ़लाइन सेव करें",
    playAudio: "ऑडियो चलाएं",
    voiceInput: "आवाज़ इनपुट",

    // Health Tips Content
    tip_clean_water: "साफ पानी पिएं",
    tip_clean_water_content:
      "पीने से पहले हमेशा पानी को 10 मिनट तक उबालें। साफ पानी हैजा, टाइफाइड और दस्त जैसी पानी से होने वाली बीमारियों से बचाता है।",
    tip_green_vegetables: "हरी सब्जियां खाएं",
    tip_green_vegetables_content:
      "अपने दैनिक आहार में पालक, मेथी और अन्य हरी पत्तेदार सब्जियों को शामिल करें जो आयरन, विटामिन ए, सी और फोलेट प्रदान करती हैं।",
    tip_hand_washing: "बार-बार हाथ धोएं",
    tip_hand_washing_content: "खाने से पहले, शौचालय के बाद, और जानवरों या दूषित सतहों को छूने के बाद 20 सेकंड तक साबुन से हाथ धोएं।",
    tip_daily_exercise: "दैनिक व्यायाम",
    tip_daily_exercise_content:
      "रोजाना 30 मिनट पैदल चलें या हल्का व्यायाम करें। यह रक्तचाप, मधुमेह को नियंत्रित करता है और हृदय स्वास्थ्य में सुधार करता है।",
    tip_balanced_diet: "संतुलित आहार",
    tip_balanced_diet_content:
      "अपने भोजन में अनाज, दालें, सब्जियां, फल और डेयरी शामिल करें। अधिक तेल, चीनी और प्रसंस्कृत खाद्य पदार्थों से बचें।",
    tip_sleep_hygiene: "अच्छी नींद की आदतें",
    tip_sleep_hygiene_content:
      "रोजाना 7-8 घंटे सोएं। नियमित सोने का समय बनाए रखें और बेहतर आराम और प्रतिरक्षा के लिए सोने से पहले स्क्रीन से बचें।",
    tip_oral_hygiene: "मुंह की सफाई",
    tip_oral_hygiene_content:
      "फ्लोराइड टूथपेस्ट से दिन में दो बार दांत साफ करें। जीभ साफ करें और दांतों की समस्याओं से बचने के लिए खाने के बाद कुल्ला करें।",
    tip_stress_management: "तनाव का प्रबंधन",
    tip_stress_management_content:
      "गहरी सांस लेने का अभ्यास करें, ध्यान करें, या परिवार और दोस्तों से बात करें। लंबे समय तक तनाव विभिन्न स्वास्थ्य समस्याओं का कारण बन सकता है।",
    tip_seasonal_fruits: "मौसमी फल",
    tip_seasonal_fruits_content:
      "गर्मियों में आम, सर्दियों में संतरे जैसे मौसमी फल खाएं। ये आवश्यक विटामिन प्रदान करते हैं और प्राकृतिक रूप से प्रतिरक्षा बढ़ाते हैं।",
    tip_yoga_meditation: "योग और ध्यान",
    tip_yoga_meditation_content:
      "सरल योग आसन और रोजाना 10 मिनट ध्यान का अभ्यास करें। यह लचीलेपन, मानसिक शांति और समग्र कल्याण में सुधार करता है।",
    nutritionShared: "पोषण डेटा सामुदायिक स्वास्थ्य कार्यकर्ता के साथ सफलतापूर्वक साझा किया गया!",
  },
  ta: {
    // Common translations
    welcome: "SehatLink-க்கு வரவேற்கிறோம்",
    subtitle: "கிராமப்புற சமூகங்களுக்கான உங்கள் சுகாதார துணை",
    selectLanguage: "மொழியைத் தேர்ந்தெடுக்கவும்",
    backHome: "முகப்புக்குத் திரும்பு",
    offlineMode: "ஆஃப்லைன் பயன்முறை செயலில்",
    installApp: "முகப்பு திரையில் சேர்க்கவும்",

    // Navigation
    viewReminders: "நினைவூட்டல்களைப் பார்க்கவும்",
    checkSymptoms: "அறிகுறிகளைச் சரிபார்க்கவும்",
    healthTips: "சுகாதார குறிப்புகள்",
    trackNutrition: "ஊட்டச்சத்தைக் கண்காணிக்கவும்",
    emergencyHelp: "அவசர உதவி",
    communityAlerts: "சமூக எச்சரிக்கைகள்",
    adminLogin: "நிர்வாக உள்நுழைவு",

    // Reminders
    title_reminders: "சுகாதார நினைவூட்டல்கள்",
    addReminder: "புதிய நினைவூட்டல் சேர்க்கவும்",
    reminderTitle: "நினைவூட்டல் தலைப்பு",
    reminderTime: "நேரம்",
    reminderType: "வகை",
    description: "விளக்கம்",
    medication: "மருந்து",
    checkup: "பரிசோதனை",
    exercise: "உடற்பயிற்சி",
    save: "நினைவூட்டலைச் சேமிக்கவும்",
    cancel: "ரத்து செய்",
    markDone: "முடிந்ததாகக் குறிக்கவும்",
    reschedule: "மீண்டும் திட்டமிடவும்",
    pending: "நிலுவையில்",
    done: "முடிந்தது",
    missed: "தவறவிட்டது",
    familyReminders: "குடும்ப நினைவூட்டல்கள்",
    reminderHistory: "வரலாற்றைப் பார்க்கவும்",
    offlineNotice: "நீங்கள் ஆஃப்லைனில் உள்ளீர்கள். ஆன்லைனில் வரும்போது நினைவூட்டல்கள் ஒத்திசைக்கப்படும்.",
    savedOffline: "நினைவூட்டல் ஆஃப்லைனில் சேமிக்கப்பட்டது - ஆன்லைனில் வரும்போது ஒத்திசைக்கப்படும்",

    // Emergency
    title_emergency: "அவசர உதவி",
    selectEmergency: "அவசர வகையைத் தேர்ந்தெடுக்கவும்",
    emergencyContacts: "அவசர தொடர்புகள்",
    callNow: "இப்போது அழைக்கவும்",
    available24h: "24/7 கிடைக்கும்",
    distance: "தூரம்",
    firstAid: "முதலுதவி வழிமுறைகள்",
    heartAttack: "மாரடைப்பு: உடனே 108-ல் அழைக்கவும். நோயாளியை அமைதியாக உட்கார வைக்கவும்.",
    breathing: "சுவாச பிரச்சனை: நேராக உட்காரவும், இறுக்கமான ஆடைகளை தளர்த்தவும், உதவிக்கு அழைக்கவும்.",
    injury: "கடுமையான காயம்: நோயாளியை நகர்த்த வேண்டாம். இரத்தப்போக்கு உள்ள காயங்களில் அழுத்தம் கொடுக்கவும்.",
    fever: "அதிக காய்ச்சல்: பாராசிட்டமால் கொடுக்கவும், குளிர்ந்த ஒத்தடம் கொடுக்கவும், மருத்துவ உதவி பெறவும்.",
    pregnancy: "கர்ப்பகால அவசரநிலை: 108-ல் அழைக்கவும், தாயை அமைதியாக வைக்கவும்.",
    poisoning: "விஷம்: வாந்தி எடுக்க வேண்டாம். உடனே விஷ கட்டுப்பாட்டு மையத்தை அழைக்கவும்.",
    mentalHealth: "மனநலம்: அமைதியாக இருங்கள், தீங்கு விளைவிக்கும் பொருட்களை அகற்றவும்.",

    // Health Tips
    title_healthtips: "சுகாதார குறிப்புகள் மற்றும் ஊட்டச்சத்து",
    healthTips: "சுகாதார குறிப்புகள்",
    nutritionTracker: "ஊட்டச்சத்து கண்காணிப்பாளர்",
    allCategories: "அனைத்து வகைகள்",
    general: "பொது",
    nutrition: "ஊட்டச்சத்து",
    hygiene: "சுகாதாரம்",
    logFood: "உணவு பொருளைப் பதிவு செய்யவும்",
    addFood: "உணவு சேர்க்கவும்",
    todaysMeals: "இன்றைய உணவுகள்",
    shareWithCHW: "CHW உடன் பகிரவும்",
    foodPlaceholder: "உணவு பொருளை உள்ளிடவும் (எ.கா. அரிசி, பருப்பு)",
    mealsLogged: "இன்று உணவுகள் பதிவு செய்யப்பட்டன",
    saveOffline: "ஆஃப்லைனில் சேமிக்கவும்",
    playAudio: "ஆடியோ இயக்கவும்",
    voiceInput: "குரல் உள்ளீடு",

    // Health Tips Content
    tip_clean_water: "சுத்தமான தண்ணீர் குடிக்கவும்",
    tip_clean_water_content:
      "குடிப்பதற்கு முன் எப்போதும் தண்ணீரை 10 நிமிடங்கள் கொதிக்க வைக்கவும். சுத்தமான தண்ணீர் காலரா, டைபாய்டு மற்றும் வயிற்றுப்போக்கு போன்ற நீரால் பரவும் நோய்களைத் தடுக்கிறது.",
    tip_green_vegetables: "பச்சை காய்கறிகள் சாப்பிடுங்கள்",
    tip_green_vegetables_content:
      "உங்கள் தினசரி உணவில் கீரை, வெந்தயக்கீரை மற்றும் பிற பச்சை இலைக் காய்கறிகளை சேர்த்துக் கொள்ளுங்கள், அவை இரும்பு, வைட்டமின் ஏ, சி மற்றும் ஃபோலேட் வழங்குகின்றன.",
    tip_hand_washing: "அடிக்கடி கைகளைக் கழுவவும்",
    tip_hand_washing_content:
      "சாப்பிடுவதற்கு முன், கழிப்பறையைப் பயன்படுத்திய பின், விலங்குகள் அல்லது அசுத்தமான மேற்பரப்புகளைத் தொட்ட பின் 20 வினாடிகள் சோப்பால் கைகளைக் கழுவவும்.",
    tip_daily_exercise: "தினசரி உடற்பயிற்சி",
    tip_daily_exercise_content:
      "தினமும் 30 நிமிடங்கள் நடக்கவும் அல்லது லேசான உடற்பயிற்சி செய்யவும். இது இரத்த அழுத்தம், நீரிழிவு நோயைக் கட்டுப்படுத்தி இதய ஆரோக்கியத்தை மேம்படுத்துகிறது.",
    tip_balanced_diet: "சமச்சீர் உணவு",
    tip_balanced_diet_content:
      "உங்கள் உணவில் தானியங்கள், பருப்பு வகைகள், காய்கறிகள், பழங்கள் மற்றும் பால் பொருட்களைச் சேர்த்துக் கொள்ளுங்கள். அதிக எண்ணெய், சர்க்கரை மற்றும் பதப்படுத்தப்பட்ட உணவுகளைத் தவிர்க்கவும்.",
    tip_sleep_hygiene: "நல்ல தூக்க பழக்கங்கள்",
    tip_sleep_hygiene_content:
      "தினமும் 7-8 மணி நேரம் தூங்குங்கள். வழக்கமான தூக்க நேரத்தை பராமரித்து, சிறந்த ஓய்வு மற்றும் நோய் எதிர்ப்பு சக்திக்காக படுக்கைக்கு முன் திரைகளைத் தவிர்க்கவும்.",
    tip_oral_hygiene: "வாய் சுகாதாரம்",
    tip_oral_hygiene_content:
      "ஃப்ளோரைடு பற்பசையால் தினமும் இரண்டு முறை பற்களைத் துலக்குங்கள். நாக்கைச் சுத்தம் செய்து, பல் பிரச்சனைகளைத் தடுக்க உணவுக்குப் பின் வாயைக் கொப்பளிக்கவும்.",
    tip_stress_management: "மன அழுத்தத்தை நிர்வகிக்கவும்",
    tip_stress_management_content:
      "ஆழ்ந்த சுவாசம், தியானம் அல்லது குடும்பம் மற்றும் நண்பர்களுடன் பேசுவதைப் பயிற்சி செய்யுங்கள். நீண்டகால மன அழுத்தம் பல்வேறு உடல்நலப் பிரச்சனைகளுக்கு வழிவகுக்கும்.",
    tip_seasonal_fruits: "பருவகால பழங்கள்",
    tip_seasonal_fruits_content:
      "கோடையில் மாம்பழம், குளிர்காலத்தில் ஆரஞ்சு போன்ற பருவகால பழங்களை சாப்பிடுங்கள். அவை அத்தியாவசிய வைட்டமின்களை வழங்கி இயற்கையாகவே நோய் எதிர்ப்பு சக்தியை அதிகரிக்கின்றன.",
    tip_yoga_meditation: "யோகா மற்றும் தியானம்",
    tip_yoga_meditation_content:
      "எளிய யோகா ஆசனங்கள் மற்றும் தினமும் 10 நிமிட தியானத்தைப் பயிற்சி செய்யுங்கள். இது நெகிழ்வுத்தன்மை, மன அமைதி மற்றும் ஒட்டுமொத்த நல்வாழ்வை மேம்படுத்துகிறது.",
    nutritionShared: "ஊட்டச்சத்து தரவு சமூக சுகாதார பணியாளருடன் வெற்றிகரமாக பகிரப்பட்டது!",
  },
  mr: {
    // Common translations
    welcome: "SehatLink मध्ये आपले स्वागत आहे",
    subtitle: "ग्रामीण समुदायांसाठी आपला आरोग्य साथी",
    selectLanguage: "भाषा निवडा",
    backHome: "घरी परत जा",
    offlineMode: "ऑफलाइन मोड सक्रिय",
    installApp: "होम स्क्रीनवर जोडा",

    // Navigation
    viewReminders: "स्मरणपत्रे पहा",
    checkSymptoms: "लक्षणे तपासा",
    healthTips: "आरोग्य टिप्स",
    trackNutrition: "पोषण ट्रॅक करा",
    emergencyHelp: "आपत्कालीन मदत",
    communityAlerts: "समुदायिक अलर्ट",
    adminLogin: "अॅडमिन लॉगिन",

    // Reminders
    title_reminders: "आरोग्य स्मरणपत्रे",
    addReminder: "नवीन स्मरणपत्र जोडा",
    reminderTitle: "स्मरणपत्र शीर्षक",
    reminderTime: "वेळ",
    reminderType: "प्रकार",
    description: "वर्णन",
    medication: "औषध",
    checkup: "तपासणी",
    exercise: "व्यायाम",
    save: "स्मरणपत्र जतन करा",
    cancel: "रद्द करा",
    markDone: "पूर्ण म्हणून चिन्हांकित करा",
    reschedule: "पुनर्निर्धारण",
    pending: "प्रलंबित",
    done: "पूर्ण",
    missed: "चुकले",
    familyReminders: "कौटुंबिक स्मरणपत्रे",
    reminderHistory: "इतिहास पहा",
    offlineNotice: "तुम्ही ऑफलाइन आहात. ऑनलाइन आल्यावर स्मरणपत्रे सिंक होतील.",
    savedOffline: "स्मरणपत्र ऑफलाइन जतन केले - ऑनलाइन आल्यावर सिंक होईल",

    // Emergency
    title_emergency: "आपत्कालीन मदत",
    selectEmergency: "आपत्कालीन प्रकार निवडा",
    emergencyContacts: "आपत्कालीन संपर्क",
    callNow: "आता कॉल करा",
    available24h: "24/7 उपलब्ध",
    distance: "अंतर",
    firstAid: "प्राथमिक वैद्यकीय मदत सूचना",
    heartAttack: "हृदयविकाराचा झटका: ताबडतोब 108 वर कॉल करा. रुग्णाला शांत आणि बसवून ठेवा.",
    breathing: "श्वासोच्छवासाची समस्या: सरळ बसा, घट्ट कपडे सैल करा, मदतीसाठी कॉल करा.",
    injury: "गंभीर दुखापत: रुग्णाला हलवू नका. रक्तस्त्राव होणाऱ्या जखमांवर दाब द्या.",
    fever: "तीव्र ताप: पॅरासिटामॉल द्या, थंड पट्टी करा, वैद्यकीय मदत घ्या.",
    pregnancy: "गर्भधारणा आपत्काल: 108 वर कॉल करा, आईला शांत ठेवा.",
    poisoning: "विषबाधा: उलट्या करायला लावू नका. ताबडतोब विष नियंत्रण केंद्राला कॉल करा.",
    mentalHealth: "मानसिक आरोग्य: शांत राहा, हानिकारक वस्तू काढून टाका.",

    // Health Tips
    title_healthtips: "आरोग्य टिप्स आणि पोषण",
    healthTips: "आरोग्य टिप्स",
    nutritionTracker: "पोषण ट्रॅकर",
    allCategories: "सर्व श्रेणी",
    general: "सामान्य",
    nutrition: "पोषण",
    hygiene: "स्वच्छता",
    logFood: "अन्न नोंदवा",
    addFood: "अन्न जोडा",
    todaysMeals: "आजचे जेवण",
    shareWithCHW: "CHW सोबत शेअर करा",
    foodPlaceholder: "अन्न पदार्थ प्रविष्ट करा (उदा. भात, डाळ)",
    mealsLogged: "आज जेवण नोंदवले",
    saveOffline: "ऑफलाइन जतन करा",
    playAudio: "ऑडिओ प्ले करा",
    voiceInput: "आवाज इनपुट",

    // Health Tips Content
    tip_clean_water: "साफ पाणी प्या",
    tip_clean_water_content:
      "पिण्याआधी नेहमी पाणी 10 मिनिटे उकळवा. स्वच्छ पाणी कॉलरा, टायफॉइड आणि अतिसार यासारख्या पाण्यामुळे होणाऱ्या आजारांपासून बचाव करते.",
    tip_green_vegetables: "हिरव्या भाज्या खा",
    tip_green_vegetables_content:
      "तुमच्या दैनंदिन आहारात पालक, मेथी आणि इतर हिरव्या पानेदार भाज्यांचा समावेश करा जे लोह, व्हिटॅमिन ए, सी आणि फोलेट देतात.",
    tip_hand_washing: "वारंवार हात धुवा",
    tip_hand_washing_content:
      "जेवण्यापूर्वी, शौचालयाच्या वापरानंतर आणि प्राणी किंवा दूषित पृष्ठभाग स्पर्श केल्यानंतर 20 सेकंद साबणाने हात धुवा.",
    tip_daily_exercise: "दैनंदिन व्यायाम",
    tip_daily_exercise_content:
      "दररोज 30 मिनिटे चालणे किंवा हलका व्यायाम करा. हे रक्तदाब, मधुमेह नियंत्रित करते आणि हृदयाचे आरोग्य सुधारते.",
    tip_balanced_diet: "संतुलित आहार",
    tip_balanced_diet_content:
      "तुमच्या जेवणात धान्य, डाळी, भाज्या, फळे आणि दुग्धजन्य पदार्थांचा समावेश करा. जास्त तेल, साखर आणि प्रक्रिया केलेले पदार्थ टाळा.",
    tip_sleep_hygiene: "चांगल्या झोपेच्या सवयी",
    tip_sleep_hygiene_content:
      "दररोज 7-8 तास झोप घ्या. नियमित झोपेची वेळ ठेवा आणि चांगल्या विश्रांती आणि रोगप्रतिकारक शक्तीसाठी झोपण्यापूर्वी स्क्रीन टाळा.",
    tip_oral_hygiene: "तोंडाची स्वच्छता",
    tip_oral_hygiene_content:
      "फ्लोराइड टूथपेस्टने दिवसातून दोनदा दात घासा. जीभ स्वच्छ करा आणि दंत समस्या टाळण्यासाठी जेवणानंतर कुल्ला करा.",
    tip_stress_management: "तणाव व्यवस्थापन",
    tip_stress_management_content:
      "खोल श्वासोच्छवास, ध्यान किंवा कुटुंब आणि मित्रांशी बोलण्याचा सराव करा. दीर्घकालीन तणाव विविध आरोग्य समस्यांना कारणीभूत ठरू शकतो.",
    tip_seasonal_fruits: "हंगामी फळे",
    tip_seasonal_fruits_content:
      "उन्हाळ्यात आंबा, हिवाळ्यात संत्री यासारखी हंगामी फळे खा. ती आवश्यक जीवनसत्त्वे देतात आणि नैसर्गिकरित्या रोगप्रतिकारक शक्ती वाढवतात.",
    tip_yoga_meditation: "योग आणि ध्यान",
    tip_yoga_meditation_content:
      "साधे योगासन आणि दररोज 10 मिनिटे ध्यानाचा सराव करा. हे लवचिकता, मानसिक शांती आणि एकूण कल्याण सुधारते.",
    nutritionShared: "पोषण डेटा समुदायिक आरोग्य कार्यकर्त्यासोबत यशस्वीरित्या शेअर केला!",
  },
  bho: {
    // Common translations
    welcome: "SehatLink में आपके स्वागत बा",
    subtitle: "गाँव के समुदाय खातिर आपके स्वास्थ्य साथी",
    selectLanguage: "भाषा चुनीं",
    backHome: "घर वापस जाईं",
    offlineMode: "ऑफलाइन मोड चालू बा",
    installApp: "होम स्क्रीन पर जोड़ीं",

    // Navigation
    viewReminders: "याददाश्त देखीं",
    checkSymptoms: "लक्षण जाँचीं",
    healthTips: "स्वास्थ्य सुझाव",
    trackNutrition: "पोषण ट्रैक करीं",
    emergencyHelp: "आपातकालीन मदद",
    communityAlerts: "समुदायिक अलर्ट",
    adminLogin: "एडमिन लॉगिन",

    // Reminders
    title_reminders: "स्वास्थ्य याददाश्त",
    addReminder: "नया याददाश्त जोड़ीं",
    reminderTitle: "याददाश्त शीर्षक",
    reminderTime: "समय",
    reminderType: "किसिम",
    description: "विवरण",
    medication: "दवाई",
    checkup: "जाँच",
    exercise: "कसरत",
    save: "याददाश्त सेव करीं",
    cancel: "रद्द करीं",
    markDone: "पूरा भइल चिन्हित करीं",
    reschedule: "फिर से समय तय करीं",
    pending: "बाकी बा",
    done: "पूरा",
    missed: "छूट गइल",
    familyReminders: "परिवारिक याददाश्त",
    reminderHistory: "इतिहास देखीं",
    offlineNotice: "रउआ ऑफलाइन बानी। ऑनलाइन होखे पर याददाश्त सिंक हो जाई।",
    savedOffline: "याददाश्त ऑफलाइन सेव भइल - ऑनलाइन होखे पर सिंक हो जाई",

    // Emergency
    title_emergency: "आपातकालीन मदद",
    selectEmergency: "आपातकाल के किसिम चुनीं",
    emergencyContacts: "आपातकालीन संपर्क",
    callNow: "अभिए कॉल करीं",
    available24h: "24/7 उपलब्ध",
    distance: "दूरी",
    firstAid: "प्राथमिक चिकित्सा निर्देश",
    heartAttack: "दिल के दौरा: तुरंत 108 पर कॉल करीं। मरीज के शांत आ बइठार के रखीं।",
    breathing: "साँस के समस्या: सीधा बइठीं, कसल कपड़ा ढीला करीं, मदद खातिर कॉल करीं।",
    injury: "गंभीर चोट: मरीज के ना हिलाईं। खून बहे वाला घाव पर दबाव दीं।",
    fever: "तेज बुखार: पैरासिटामोल दीं, ठंडा पट्टी करीं, डॉक्टर से मिलीं।",
    pregnancy: "गर्भावस्था आपातकाल: 108 पर कॉल करीं, माई के शांत रखीं।",
    poisoning: "जहर: उल्टी ना कराईं। तुरंत जहर नियंत्रण के कॉल करीं।",
    mentalHealth: "मानसिक स्वास्थ्य: शांत रहीं, नुकसान करे वाला चीज हटाईं।",

    // Health Tips
    title_healthtips: "स्वास्थ्य सुझाव आ पोषण",
    healthTips: "स्वास्थ्य सुझाव",
    nutritionTracker: "पोषण ट्रैकर",
    allCategories: "सब श्रेणी",
    general: "सामान्य",
    nutrition: "पोषण",
    hygiene: "सफाई",
    logFood: "खाना लॉग करीं",
    addFood: "खाना जोड़ीं",
    todaysMeals: "आज के खाना",
    shareWithCHW: "CHW के साथ शेयर करीं",
    foodPlaceholder: "खाना आइटम डालीं (जइसे चावल, दाल)",
    mealsLogged: "आज खाना लॉग भइल",
    saveOffline: "ऑफलाइन सेव करीं",
    playAudio: "ऑडियो चलाईं",
    voiceInput: "आवाज इनपुट",

    // Health Tips Content
    tip_clean_water: "साफ पानी पिएं",
    tip_clean_water_content:
      "पीने से पहले हमेशा पानी को 10 मिनट तक उबालें। साफ पानी हैजा, टाइफाइड और दस्त जैसी पानी से होने वाली बीमारियों से बचाता है।",
    tip_green_vegetables: "हरियर सब्जी खाईं",
    tip_green_vegetables_content:
      "अपना रोजाना के खाना में पालक, मेथी आ दोसर हरियर पत्ता वाला सब्जी शामिल करीं जे आयरन, विटामिन ए, सी आ फोलेट देला।",
    tip_hand_washing: "बार-बार हाथ धोईं",
    tip_hand_washing_content: "खाए से पहिले, शौचालय के बाद, आ जानवर या गंदा चीज छूए के बाद 20 सेकंड तक साबुन से हाथ धोईं।",
    tip_daily_exercise: "रोजाना कसरत",
    tip_daily_exercise_content:
      "रोज 30 मिनट पैदल चलीं या हल्का कसरत करीं। ई खून के दबाव, मधुमेह के काबू में रखेला आ दिल के सेहत बढ़ावेला।",
    tip_balanced_diet: "संतुलित आहार",
    tip_balanced_diet_content:
      "अपना खाना में अनाज, दाल, सब्जी, फल आ दूध के चीज शामिल करीं। जादा तेल, चीनी आ बना-बनाया खाना से बचीं।",
    tip_sleep_hygiene: "नीक नींद के आदत",
    tip_sleep_hygiene_content:
      "रोज 7-8 घंटा सोईं। नियमित सोए के समय रखीं आ बेहतर आराम आ रोग से लड़े के शक्ति खातिर सोए से पहिले स्क्रीन से बचीं।",
    tip_oral_hygiene: "वாய் சுகாதாரம்",
    tip_oral_hygiene_content:
      "ஃப்ளோரைடு பற்பசையால் தினமும் இரண்டு முறை பற்களைத் துலக்குங்கள். நாக்கைச் சுத்தம் செய்து, பல் பிரச்சனைகளைத் தடுக்க உணவுக்குப் பின் வாயைக் கொப்பளிக்கவும்.",
    tip_stress_management: "மன அழுத்தத்தை நிர்வகிக்கவும்",
    tip_stress_management_content:
      "ஆழ்ந்த சுவாசம், தியானம் அல்லது குடும்பம் மற்றும் நண்பர்களுடன் பேசுவதைப் பயிற்சி செய்யுங்கள். நீண்டகால மன அழுத்தம் பல்வேறு உடல்நலப் பிரச்சனைகளுக்கு வழிவகுக்கும்.",
    tip_seasonal_fruits: "பருவகால பழங்கள்",
    tip_seasonal_fruits_content:
      "கோடையில் மாம்பழம், குளிர்காலத்தில் ஆரஞ்சு போன்ற பருவகால பழங்களை சாப்பிடுங்கள். அவை அத்தியாவசிய வைட்டமின்களை வழங்கி இயற்கையாகவே நோய் எதிர்ப்பு சக்தியை அதிகரிக்கின்றன.",
    tip_yoga_meditation: "யோகா மற்றும் தியானம்",
    tip_yoga_meditation_content:
      "எளிய யோகா ஆசனங்கள் மற்றும் தினமும் 10 நிமிட தியானத்தைப் பயிற்சி செய்யுங்கள். இது நெகிழ்வுத்தன்மை, மன அமைதி மற்றும் ஒட்டுமொத்த நல்வாழ்வை மேம்படுத்துகிறது.",
    nutritionShared: "ஊட்டச்சத்து தரவு சமூக சுகாதார பணியாளருடன் வெற்றிகரமாக பகிரப்பட்டது!",
  },
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [selectedLanguage, setSelectedLanguageState] = useState("en")

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("sehatlink_language")
    if (savedLanguage && translations[savedLanguage as keyof typeof translations]) {
      setSelectedLanguageState(savedLanguage)
    }
  }, [])

  // Save language to localStorage when changed
  const setSelectedLanguage = (language: string) => {
    setSelectedLanguageState(language)
    localStorage.setItem("sehatlink_language", language)
  }

  // Translation function
  const t = (key: string): string => {
    const currentTranslations = translations[selectedLanguage as keyof typeof translations] || translations.en
    return currentTranslations[key as keyof typeof currentTranslations] || key
  }

  const playVoice = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)

      // Set language-specific voice settings
      switch (selectedLanguage) {
        case "hi":
        case "bho": // Bhojpuri uses Hindi voice as fallback
          utterance.lang = "hi-IN"
          break
        case "ta":
          utterance.lang = "ta-IN"
          break
        case "mr":
          utterance.lang = "mr-IN"
          break
        default:
          utterance.lang = "en-US"
      }

      speechSynthesis.speak(utterance)
    }
  }

  return (
    <LanguageContext.Provider
      value={{
        selectedLanguage,
        setSelectedLanguage,
        t,
        playVoice,
        languages,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
