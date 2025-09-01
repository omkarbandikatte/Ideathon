// Symptoms Page JavaScript

let currentResult = null
let selectedSymptoms = []
let savedChecks = []
let isAnalyzing = false
let isListening = false

const commonSymptoms = [
  "Fever",
  "Cough",
  "Headache",
  "Body Pain",
  "Nausea",
  "Diarrhea",
  "Chest Pain",
  "Difficulty Breathing",
  "Stomach Pain",
  "Dizziness",
  "Fatigue",
  "Sore Throat",
]

const symptomsTranslations = {
  en: {
    title: "AI Symptom Checker",
    enterSymptoms: "Enter Your Symptoms",
    commonSymptoms: "Common Symptoms",
    analyzeSymptoms: "Analyze Symptoms",
    analyzing: "Analyzing...",
    result: "Analysis Result",
    confidence: "Confidence",
    basedOnCases: "based on similar cases",
    recommendations: "Recommendations",
    seekHelp: "Seek Medical Help",
    saveOffline: "Save Offline",
    requestCHW: "Request CHW Visit",
    viewSimilar: "View Similar Cases",
    savedChecks: "Saved Checks",
    backHome: "Back to Home",
    voiceInput: "Voice Input",
    clearSymptoms: "Clear All",
    lowSeverity: "Low Risk",
    mediumSeverity: "Medium Risk",
    highSeverity: "High Risk",
    criticalSeverity: "Critical - Seek Immediate Help",
    placeholder: "Describe your symptoms (e.g., fever for 3 days, headache, body pain)",
    offlineNotice: "You're offline. Analysis will use cached data.",
    savedOffline: "Saved offline - will sync when online",
  },
  hi: {
    title: "AI लक्षण जांचकर्ता",
    enterSymptoms: "अपने लक्षण दर्ज करें",
    commonSymptoms: "सामान्य लक्षण",
    analyzeSymptoms: "लक्षणों का विश्लेषण करें",
    analyzing: "विश्लेषण कर रहे हैं...",
    result: "विश्लेषण परिणाम",
    confidence: "विश्वास",
    basedOnCases: "समान मामलों के आधार पर",
    recommendations: "सुझाव",
    seekHelp: "चिकित्सा सहायता लें",
    saveOffline: "ऑफलाइन सेव करें",
    requestCHW: "CHW विज़िट का अनुरोध करें",
    viewSimilar: "समान मामले देखें",
    savedChecks: "सेव की गई जांच",
    backHome: "होम पर वापस",
    voiceInput: "आवाज़ इनपुट",
    clearSymptoms: "सभी साफ़ करें",
    lowSeverity: "कम जोखिम",
    mediumSeverity: "मध्यम जोखिम",
    highSeverity: "उच्च जोखिम",
    criticalSeverity: "गंभीर - तुरंत सहायता लें",
    placeholder: "अपने लक्षणों का वर्णन करें (जैसे 3 दिन से बुखार, सिरदर्द, शरीर दर्द)",
    offlineNotice: "आप ऑफलाइन हैं। विश्लेषण कैश्ड डेटा का उपयोग करेगा।",
    savedOffline: "ऑफलाइन सेव किया गया - ऑनलाइन होने पर सिंक होगा",
  },
}

// Initialize symptoms page
document.addEventListener("DOMContentLoaded", () => {
  initializeSymptomsPage()
  loadSavedChecks()
  updateOfflineStatus()

  // Setup offline detection
  window.addEventListener("online", updateOfflineStatus)
  window.addEventListener("offline", updateOfflineStatus)
})

function initializeSymptomsPage() {
  const currentLang = window.SehatLink?.currentLanguage() || "en"
  updateSymptomsLanguage(currentLang)
  renderCommonSymptoms()

  // Update placeholder
  const input = document.getElementById("symptoms-input")
  const t = symptomsTranslations[currentLang] || symptomsTranslations.en
  input.placeholder = t.placeholder
}

function updateSymptomsLanguage(languageCode) {
  const t = symptomsTranslations[languageCode] || symptomsTranslations.en

  // Update all text elements
  document.getElementById("page-title").textContent = t.title
  document.getElementById("back-home-btn").textContent = t.backHome
  document.getElementById("saved-checks-text").textContent = t.savedChecks
  document.getElementById("enter-symptoms-title").textContent = t.enterSymptoms
  document.getElementById("common-symptoms-title").textContent = t.commonSymptoms
  document.getElementById("clear-btn").textContent = t.clearSymptoms
  document.getElementById("analyze-text").textContent = t.analyzeSymptoms
  document.getElementById("result-title").textContent = t.result
  document.getElementById("recommendations-title").textContent = t.recommendations
  document.getElementById("save-offline-btn").textContent = t.saveOffline
  document.getElementById("request-chw-btn").textContent = t.requestCHW
  document.getElementById("view-similar-btn").textContent = t.viewSimilar
  document.getElementById("seek-help-text").textContent = t.seekHelp
  document.getElementById("saved-checks-title").textContent = t.savedChecks
  document.getElementById("offline-notice-text").textContent = t.offlineNotice

  const emergencyBtn = document.getElementById("emergency-btn")
  if (emergencyBtn) emergencyBtn.textContent = t.seekHelp
}

function renderCommonSymptoms() {
  const grid = document.getElementById("symptoms-grid")
  grid.innerHTML = ""

  commonSymptoms.forEach((symptom) => {
    const button = document.createElement("button")
    button.className = `btn ${selectedSymptoms.includes(symptom) ? "btn-primary" : "btn-secondary"}`
    button.textContent = symptom
    button.style.cssText = "padding: 12px; font-size: 16px;"
    button.onclick = () => toggleSymptom(symptom)
    grid.appendChild(button)
  })
}

function toggleSymptom(symptom) {
  if (selectedSymptoms.includes(symptom)) {
    selectedSymptoms = selectedSymptoms.filter((s) => s !== symptom)
  } else {
    selectedSymptoms.push(symptom)
  }
  renderCommonSymptoms()
}

function clearSymptoms() {
  document.getElementById("symptoms-input").value = ""
  selectedSymptoms = []
  renderCommonSymptoms()
}

function startVoiceInput() {
  const recognition = window.webkitSpeechRecognition ? new window.webkitSpeechRecognition() : null
  if (recognition) {
    const currentLang = window.SehatLink?.currentLanguage() || "en"
    recognition.lang = currentLang === "hi" ? "hi-IN" : "en-US"
    recognition.continuous = false
    recognition.interimResults = false

    isListening = true
    const btn = document.getElementById("voice-input-btn")
    btn.textContent = "🎤"
    btn.disabled = true

    recognition.start()

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      const input = document.getElementById("symptoms-input")
      input.value = input.value ? `${input.value}, ${transcript}` : transcript
      isListening = false
      btn.disabled = false
    }

    recognition.onerror = () => {
      isListening = false
      btn.disabled = false
    }

    recognition.onend = () => {
      isListening = false
      btn.disabled = false
    }
  }
}

async function analyzeSymptoms() {
  const symptomsText = document.getElementById("symptoms-input").value
  const allSymptoms = [...selectedSymptoms, symptomsText].filter(Boolean).join(", ")

  if (!allSymptoms.trim()) return

  isAnalyzing = true
  const analyzeBtn = document.getElementById("analyze-btn")
  const currentLang = window.SehatLink?.currentLanguage() || "en"
  const t = symptomsTranslations[currentLang] || symptomsTranslations.en

  analyzeBtn.innerHTML = `<span class="loading" style="margin-right: 12px;"></span>${t.analyzing}`
  analyzeBtn.disabled = true

  // Simulate AI analysis delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Mock AI analysis result
  let mockResult = {
    condition: "Common Cold",
    confidence: 75,
    severity: "low",
    description:
      "Based on your symptoms, you likely have a common cold. This is a viral infection that usually resolves on its own.",
    recommendations: [
      "Rest and drink plenty of fluids",
      "Take paracetamol for fever and pain",
      "Use warm salt water gargle for sore throat",
      "Monitor symptoms for 3-5 days",
    ],
    similarCases: 1247,
    seekMedicalHelp: false,
  }

  // Adjust result based on symptoms
  if (allSymptoms.toLowerCase().includes("chest pain") || allSymptoms.toLowerCase().includes("breathing")) {
    mockResult = {
      condition: "Respiratory Infection",
      confidence: 85,
      severity: "medium",
      description: "Your symptoms suggest a respiratory infection that requires medical attention.",
      recommendations: [
        "Seek medical attention within 24 hours",
        "Monitor breathing difficulty",
        "Take prescribed medications",
        "Rest and avoid physical exertion",
      ],
      similarCases: 892,
      seekMedicalHelp: true,
    }
  }

  if (allSymptoms.toLowerCase().includes("severe") || allSymptoms.toLowerCase().includes("critical")) {
    mockResult = {
      condition: "Serious Condition",
      confidence: 90,
      severity: "critical",
      description: "Your symptoms indicate a serious condition requiring immediate medical attention.",
      recommendations: [
        "Seek immediate medical attention",
        "Call emergency services (108)",
        "Do not delay treatment",
        "Have someone accompany you",
      ],
      similarCases: 234,
      seekMedicalHelp: true,
    }
  }

  const isOffline = !navigator.onLine
  if (isOffline) {
    mockResult.confidence = Math.max(50, mockResult.confidence - 20)
    mockResult.description += " (Analysis performed offline with limited data)"
  }

  currentResult = mockResult
  displayResult(mockResult)

  isAnalyzing = false
  analyzeBtn.innerHTML = t.analyzeSymptoms
  analyzeBtn.disabled = false
}

function displayResult(result) {
  const resultSection = document.getElementById("result-section")
  const currentLang = window.SehatLink?.currentLanguage() || "en"
  const t = symptomsTranslations[currentLang] || symptomsTranslations.en
  const isOffline = !navigator.onLine

  // Update result display
  document.getElementById("condition-name").textContent = result.condition
  document.getElementById("condition-description").textContent = result.description

  // Update confidence bar
  const confidenceBar = document.getElementById("confidence-bar")
  confidenceBar.style.width = `${result.confidence}%`
  confidenceBar.style.backgroundColor = isOffline ? "#ffc107" : "#28a745"

  // Update confidence text
  const confidenceText = document.getElementById("confidence-text")
  confidenceText.textContent = `${t.confidence}: ${result.confidence}% - ${t.basedOnCases} (${result.similarCases})${isOffline ? " (Offline)" : ""}`

  // Update severity badge
  const severityBadge = document.getElementById("severity-badge")
  severityBadge.className = `status-indicator ${getSeverityClass(result.severity)}`
  severityBadge.textContent = getSeverityText(result.severity, currentLang)

  // Update recommendations
  const recommendationsList = document.getElementById("recommendations-list")
  recommendationsList.innerHTML = ""
  result.recommendations.forEach((rec) => {
    const li = document.createElement("li")
    li.style.cssText = "margin-bottom: 8px; font-size: 18px;"
    li.textContent = rec
    recommendationsList.appendChild(li)
  })

  // Show/hide medical help alert
  const medicalAlert = document.getElementById("medical-help-alert")
  const emergencyBtn = document.getElementById("emergency-btn")
  if (result.seekMedicalHelp) {
    medicalAlert.style.display = "block"
    emergencyBtn.style.display = "inline-flex"
  } else {
    medicalAlert.style.display = "none"
    emergencyBtn.style.display = "none"
  }

  // Update CHW button for offline
  const chwBtn = document.getElementById("request-chw-btn")
  if (isOffline) {
    chwBtn.textContent = `${t.requestCHW} (Offline)`
    chwBtn.disabled = true
  } else {
    chwBtn.textContent = t.requestCHW
    chwBtn.disabled = false
  }

  resultSection.style.display = "block"
}

function getSeverityClass(severity) {
  switch (severity) {
    case "critical":
      return "status-offline"
    case "high":
      return "status-offline"
    case "medium":
      return "status-pending"
    case "low":
      return "status-online"
    default:
      return "status-pending"
  }
}

function getSeverityText(severity, lang) {
  const t = symptomsTranslations[lang] || symptomsTranslations.en
  switch (severity) {
    case "critical":
      return t.criticalSeverity
    case "high":
      return t.highSeverity
    case "medium":
      return t.mediumSeverity
    case "low":
      return t.lowSeverity
    default:
      return severity
  }
}

function playResultVoice() {
  if (currentResult && window.SehatLink?.playVoice) {
    const text = `${currentResult.condition}. ${currentResult.description}`
    window.SehatLink.playVoice(text)
  }
}

function saveCheck() {
  if (currentResult) {
    const symptomsText = document.getElementById("symptoms-input").value
    const allSymptoms = [...selectedSymptoms, symptomsText].filter(Boolean).join(", ")

    const savedCheck = {
      id: Date.now().toString(),
      symptoms: allSymptoms,
      result: currentResult,
      date: new Date().toLocaleDateString(),
      offline: !navigator.onLine,
    }

    savedChecks.unshift(savedCheck)
    localStorage.setItem("sehatlink-symptom-checks", JSON.stringify(savedChecks))
    updateSavedChecksCount()

    const currentLang = window.SehatLink?.currentLanguage() || "en"
    const t = symptomsTranslations[currentLang] || symptomsTranslations.en

    if (!navigator.onLine) {
      window.SehatLink?.showNotification(t.savedOffline, "info")
    } else {
      window.SehatLink?.showNotification("Symptom check saved!", "info")
    }
  }
}

function loadSavedChecks() {
  try {
    const stored = localStorage.getItem("sehatlink-symptom-checks")
    if (stored) {
      savedChecks = JSON.parse(stored)
      updateSavedChecksCount()
    }
  } catch (error) {
    console.error("Failed to load saved checks:", error)
  }
}

function updateSavedChecksCount() {
  document.getElementById("saved-count").textContent = savedChecks.length
}

function toggleSavedChecks() {
  const section = document.getElementById("saved-checks-section")
  const isVisible = section.style.display !== "none"

  if (isVisible) {
    section.style.display = "none"
  } else {
    renderSavedChecks()
    section.style.display = "block"
  }
}

function renderSavedChecks() {
  const list = document.getElementById("saved-checks-list")

  if (savedChecks.length === 0) {
    list.innerHTML = '<p id="no-saved-checks">No saved checks yet.</p>'
    return
  }

  list.innerHTML = ""
  savedChecks.forEach((check) => {
    const div = document.createElement("div")
    div.style.cssText = `
            padding: 16px;
            background-color: #f8f9fa;
            border-radius: 6px;
            margin-bottom: 12px;
            border: ${check.offline ? "2px solid #ffc107" : "1px solid #dee2e6"};
        `

    div.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div style="flex: 1;">
                    <p><strong>Date:</strong> ${check.date}</p>
                    <p><strong>Symptoms:</strong> ${check.symptoms}</p>
                    <p><strong>Result:</strong> ${check.result.condition} (${check.result.confidence}% confidence)</p>
                </div>
                ${check.offline ? '<span class="status-indicator status-pending" style="font-size: 12px;">Offline</span>' : ""}
            </div>
        `

    list.appendChild(div)
  })
}

function requestCHW() {
  if (navigator.onLine) {
    window.SehatLink?.showNotification("CHW visit request sent!", "info")
  } else {
    window.SehatLink?.showNotification("Cannot request CHW while offline", "error")
  }
}

function viewSimilarCases() {
  window.SehatLink?.showNotification("Similar cases feature coming soon!", "info")
}

function updateOfflineStatus() {
  const isOffline = !navigator.onLine
  const offlineNotice = document.getElementById("offline-notice")

  if (isOffline) {
    offlineNotice.style.display = "block"
  } else {
    offlineNotice.style.display = "none"
  }
}

// Add loading spinner CSS
const style = document.createElement("style")
style.textContent = `
    .loading {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid #ffffff;
        border-radius: 50%;
        border-top-color: transparent;
        animation: spin 1s ease-in-out infinite;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    
    .alert {
        padding: 16px;
        border-radius: 6px;
        margin-bottom: 16px;
    }
    
    .alert-warning {
        background-color: #fff3cd;
        border: 1px solid #ffeaa7;
        color: #856404;
    }
    
    .alert-danger {
        background-color: #f8d7da;
        border: 1px solid #f5c6cb;
        color: #721c24;
    }
    
    .form-group {
        padding: 24px;
    }
    
    .form-input {
        width: 100%;
        padding: 12px 16px;
        font-size: 16px;
        border: 2px solid #e9ecef;
        border-radius: 8px;
        resize: vertical;
        font-family: inherit;
    }
    
    .form-input:focus {
        outline: none;
        border-color: #28a745;
        box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
    }
    
    .status-pending {
        background-color: rgba(255, 193, 7, 0.2);
        color: #856404;
        border: 1px solid rgba(255, 193, 7, 0.3);
    }
`
document.head.appendChild(style)
