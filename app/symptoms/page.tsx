"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { offlineStorage, isOnline } from "@/lib/offline-storage"

interface SymptomResult {
  condition: string
  confidence: number
  severity: "low" | "medium" | "high" | "critical"
  description: string
  recommendations: string[]
  similarCases: number
  seekMedicalHelp: boolean
}

interface SavedSymptomCheck {
  id: string
  symptoms: string
  result: SymptomResult
  date: string
  offline?: boolean
}

export default function SymptomsPage() {
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [symptoms, setSymptoms] = useState("")
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [result, setResult] = useState<SymptomResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [savedChecks, setSavedChecks] = useState<SavedSymptomCheck[]>([])
  const [showSavedChecks, setShowSavedChecks] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [offlineMode, setOfflineMode] = useState(false)

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

  const translations = {
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

  const t = translations[selectedLanguage as keyof typeof translations] || translations.en

  useEffect(() => {
    const updateOfflineStatus = () => {
      setOfflineMode(!navigator.onLine)
    }

    const loadSavedChecks = async () => {
      try {
        const checks = await offlineStorage.getSymptomChecks()
        setSavedChecks(
          checks.map((check) => ({
            id: check.id,
            symptoms: check.symptoms,
            result: check.result,
            date: new Date(check.timestamp).toLocaleDateString(),
            offline: check.offline,
          })),
        )
      } catch (error) {
        console.error("Failed to load saved checks:", error)
      }
    }

    updateOfflineStatus()
    loadSavedChecks()

    window.addEventListener("online", updateOfflineStatus)
    window.addEventListener("offline", updateOfflineStatus)

    return () => {
      window.removeEventListener("online", updateOfflineStatus)
      window.removeEventListener("offline", updateOfflineStatus)
    }
  }, [])

  const playVoice = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = selectedLanguage === "hi" ? "hi-IN" : "en-US"
      speechSynthesis.speak(utterance)
    }
  }

  const startVoiceInput = () => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new (window as any).webkitSpeechRecognition()
      recognition.lang = selectedLanguage === "hi" ? "hi-IN" : "en-US"
      recognition.continuous = false
      recognition.interimResults = false

      setIsListening(true)
      recognition.start()

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setSymptoms((prev) => (prev ? `${prev}, ${transcript}` : transcript))
        setIsListening(false)
      }

      recognition.onerror = () => {
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }
    }
  }

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) => {
      if (prev.includes(symptom)) {
        return prev.filter((s) => s !== symptom)
      } else {
        return [...prev, symptom]
      }
    })
  }

  const analyzeSymptoms = async () => {
    const allSymptoms = [...selectedSymptoms, symptoms].filter(Boolean).join(", ")
    if (!allSymptoms.trim()) return

    setIsAnalyzing(true)

    // Simulate AI analysis delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock AI analysis result
    const mockResult: SymptomResult = {
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
      mockResult.condition = "Respiratory Infection"
      mockResult.confidence = 85
      mockResult.severity = "medium"
      mockResult.seekMedicalHelp = true
      mockResult.recommendations = [
        "Seek medical attention within 24 hours",
        "Monitor breathing difficulty",
        "Take prescribed medications",
        "Rest and avoid physical exertion",
      ]
    }

    if (allSymptoms.toLowerCase().includes("severe") || allSymptoms.toLowerCase().includes("critical")) {
      mockResult.condition = "Serious Condition"
      mockResult.confidence = 90
      mockResult.severity = "critical"
      mockResult.seekMedicalHelp = true
      mockResult.recommendations = [
        "Seek immediate medical attention",
        "Call emergency services (108)",
        "Do not delay treatment",
        "Have someone accompany you",
      ]
    }

    if (offlineMode) {
      mockResult.confidence = Math.max(50, mockResult.confidence - 20)
      mockResult.description += " (Analysis performed offline with limited data)"
    }

    setResult(mockResult)
    setIsAnalyzing(false)
  }

  const saveCheck = async () => {
    if (result) {
      const savedCheck = {
        id: Date.now().toString(),
        symptoms: [...selectedSymptoms, symptoms].filter(Boolean).join(", "),
        result,
        timestamp: Date.now(),
      }

      try {
        await offlineStorage.saveSymptomCheck(savedCheck)
        setSavedChecks((prev) => [
          {
            id: savedCheck.id,
            symptoms: savedCheck.symptoms,
            result: savedCheck.result,
            date: new Date(savedCheck.timestamp).toLocaleDateString(),
            offline: !isOnline(),
          },
          ...prev,
        ])

        if (offlineMode) {
          alert(t.savedOffline)
        } else {
          alert("Symptom check saved!")
        }
      } catch (error) {
        console.error("Failed to save symptom check:", error)
        alert("Failed to save symptom check")
      }
    }
  }

  const getSeverityClass = (severity: string) => {
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

  const getSeverityText = (severity: string) => {
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

  return (
    <div>
      {/* Header */}
      <header className="header">
        <div className="container">
          <h1>{t.title}</h1>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "12px" }}>
            <Link href="/" className="btn btn-secondary">
              {t.backHome}
            </Link>
            <button className="btn btn-warning" onClick={() => setShowSavedChecks(!showSavedChecks)}>
              {t.savedChecks} ({savedChecks.length})
            </button>
          </div>
        </div>
      </header>

      <main className="container" style={{ padding: "32px 16px" }}>
        {offlineMode && (
          <div className="alert alert-warning" style={{ marginBottom: "24px" }}>
            <strong>⚠️ {t.offlineNotice}</strong>
          </div>
        )}

        {/* Saved Checks */}
        {showSavedChecks && (
          <div className="card">
            <div className="card-header">
              <h2>{t.savedChecks}</h2>
            </div>
            {savedChecks.length > 0 ? (
              savedChecks.map((check) => (
                <div
                  key={check.id}
                  style={{
                    padding: "16px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "6px",
                    marginBottom: "12px",
                    border: check.offline ? "2px solid #ffc107" : "1px solid #dee2e6",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <p>
                        <strong>Date:</strong> {check.date}
                      </p>
                      <p>
                        <strong>Symptoms:</strong> {check.symptoms}
                      </p>
                      <p>
                        <strong>Result:</strong> {check.result.condition} ({check.result.confidence}% confidence)
                      </p>
                    </div>
                    {check.offline && (
                      <span className="status-indicator status-pending" style={{ fontSize: "12px" }}>
                        Offline
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>No saved checks yet.</p>
            )}
          </div>
        )}

        {/* Symptom Input */}
        <div className="card">
          <div className="card-header">
            <h2>{t.enterSymptoms}</h2>
          </div>

          {/* Text Input */}
          <div className="form-group">
            <textarea
              className="form-input"
              rows={4}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder={t.placeholder}
            />
            <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
              <button
                className={`voice-btn ${isListening ? "loading" : ""}`}
                onClick={startVoiceInput}
                disabled={isListening}
                title={t.voiceInput}
              >
                {isListening ? "🎤" : "🎤"}
              </button>
              <button className="btn btn-secondary" onClick={() => setSymptoms("")}>
                {t.clearSymptoms}
              </button>
            </div>
          </div>

          {/* Common Symptoms */}
          <div>
            <h3>{t.commonSymptoms}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px" }}>
              {commonSymptoms.map((symptom) => (
                <button
                  key={symptom}
                  className={`btn ${selectedSymptoms.includes(symptom) ? "btn-primary" : "btn-secondary"}`}
                  onClick={() => toggleSymptom(symptom)}
                  style={{ padding: "12px", fontSize: "16px" }}
                >
                  {symptom}
                </button>
              ))}
            </div>
          </div>

          {/* Analyze Button */}
          <div style={{ textAlign: "center", marginTop: "24px" }}>
            <button
              className="btn btn-primary btn-large"
              onClick={analyzeSymptoms}
              disabled={isAnalyzing || (!symptoms.trim() && selectedSymptoms.length === 0)}
            >
              {isAnalyzing ? (
                <>
                  <span className="loading" style={{ marginRight: "12px" }}></span>
                  {t.analyzing}
                </>
              ) : (
                t.analyzeSymptoms
              )}
            </button>
          </div>
        </div>

        {/* Analysis Result */}
        {result && (
          <div className="card">
            <div className="card-header">
              <h2>{t.result}</h2>
              <button className="voice-btn" onClick={() => playVoice(`${result.condition}. ${result.description}`)}>
                🔊
              </button>
            </div>

            {/* Condition and Confidence */}
            <div style={{ marginBottom: "24px" }}>
              <h3>{result.condition}</h3>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      backgroundColor: "#e9ecef",
                      borderRadius: "10px",
                      height: "20px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: offlineMode ? "#ffc107" : "#28a745",
                        height: "100%",
                        width: `${result.confidence}%`,
                        borderRadius: "10px",
                      }}
                    ></div>
                  </div>
                  <p style={{ marginTop: "8px", fontSize: "16px" }}>
                    {t.confidence}: {result.confidence}% - {t.basedOnCases} ({result.similarCases})
                    {offlineMode && " (Offline)"}
                  </p>
                </div>
                <span className={`status-indicator ${getSeverityClass(result.severity)}`}>
                  {getSeverityText(result.severity)}
                </span>
              </div>
              <p>{result.description}</p>
            </div>

            {/* Recommendations */}
            <div style={{ marginBottom: "24px" }}>
              <h3>{t.recommendations}</h3>
              <ul style={{ paddingLeft: "20px" }}>
                {result.recommendations.map((rec, index) => (
                  <li key={index} style={{ marginBottom: "8px", fontSize: "18px" }}>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            {/* Medical Help Alert */}
            {result.seekMedicalHelp && (
              <div className="alert alert-danger">
                <strong>{t.seekHelp}:</strong> Based on your symptoms, it's recommended to consult a healthcare
                professional.
              </div>
            )}

            {/* Action Buttons */}
            <div className="button-grid">
              <button className="btn btn-secondary" onClick={saveCheck}>
                {t.saveOffline}
              </button>
              <button className="btn btn-primary" disabled={offlineMode}>
                {t.requestCHW} {offlineMode && "(Offline)"}
              </button>
              <button className="btn btn-warning">{t.viewSimilar}</button>
              {result.seekMedicalHelp && (
                <Link href="/emergency" className="btn btn-danger">
                  {t.seekHelp}
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Educational Content */}
        <div className="card">
          <div className="card-header">
            <h2>Health Education</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}>
            <div style={{ padding: "16px", backgroundColor: "#f8f9fa", borderRadius: "6px" }}>
              <h4>When to Seek Help</h4>
              <p>Contact a healthcare provider if symptoms worsen or persist for more than 3 days.</p>
            </div>
            <div style={{ padding: "16px", backgroundColor: "#f8f9fa", borderRadius: "6px" }}>
              <h4>Prevention Tips</h4>
              <p>Wash hands regularly, maintain good hygiene, and eat nutritious food to prevent illness.</p>
            </div>
            <div style={{ padding: "16px", backgroundColor: "#f8f9fa", borderRadius: "6px" }}>
              <h4>Emergency Signs</h4>
              <p>Difficulty breathing, chest pain, severe headache, or high fever require immediate attention.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
