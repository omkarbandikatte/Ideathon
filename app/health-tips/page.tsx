"use client"

import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"

interface HealthTip {
  id: string
  titleKey: string
  contentKey: string
  category: "general" | "nutrition" | "exercise" | "hygiene"
  audioUrl?: string
}

export default function HealthTipsPage() {
  const { selectedLanguage, t, playVoice } = useLanguage()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [nutritionLog, setNutritionLog] = useState<string[]>([])
  const [newFood, setNewFood] = useState("")
  const [activeTab, setActiveTab] = useState<"tips" | "nutrition">("tips")
  const [offlineMode, setOfflineMode] = useState(false)

  const healthTips: HealthTip[] = [
    {
      id: "1",
      titleKey: "tip_clean_water",
      contentKey: "tip_clean_water_content",
      category: "hygiene",
    },
    {
      id: "2",
      titleKey: "tip_green_vegetables",
      contentKey: "tip_green_vegetables_content",
      category: "nutrition",
    },
    {
      id: "3",
      titleKey: "tip_hand_washing",
      contentKey: "tip_hand_washing_content",
      category: "hygiene",
    },
    {
      id: "4",
      titleKey: "tip_daily_exercise",
      contentKey: "tip_daily_exercise_content",
      category: "exercise",
    },
    {
      id: "5",
      titleKey: "tip_balanced_diet",
      contentKey: "tip_balanced_diet_content",
      category: "nutrition",
    },
    {
      id: "6",
      titleKey: "tip_sleep_hygiene",
      contentKey: "tip_sleep_hygiene_content",
      category: "general",
    },
    {
      id: "7",
      titleKey: "tip_oral_hygiene",
      contentKey: "tip_oral_hygiene_content",
      category: "hygiene",
    },
    {
      id: "8",
      titleKey: "tip_stress_management",
      contentKey: "tip_stress_management_content",
      category: "general",
    },
    {
      id: "9",
      titleKey: "tip_seasonal_fruits",
      contentKey: "tip_seasonal_fruits_content",
      category: "nutrition",
    },
    {
      id: "10",
      titleKey: "tip_yoga_meditation",
      contentKey: "tip_yoga_meditation_content",
      category: "exercise",
    },
  ]

  const handleAddFood = () => {
    if (newFood.trim()) {
      setNutritionLog([...nutritionLog, newFood.trim()])
      setNewFood("")
      if (offlineMode) {
        localStorage.setItem("nutritionLog", JSON.stringify([...nutritionLog, newFood.trim()]))
      }
    }
  }

  const handleVoiceInput = () => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new (window as any).webkitSpeechRecognition()
      recognition.lang =
        selectedLanguage === "hi"
          ? "hi-IN"
          : selectedLanguage === "ta"
            ? "ta-IN"
            : selectedLanguage === "mr"
              ? "mr-IN"
              : selectedLanguage === "bho"
                ? "hi-IN"
                : "en-US"
      recognition.onresult = (event: any) => {
        setNewFood(event.results[0][0].transcript)
      }
      recognition.start()
    }
  }

  const filteredTips =
    selectedCategory === "all" ? healthTips : healthTips.filter((tip) => tip.category === selectedCategory)

  const shareWithCHW = () => {
    const data = {
      nutritionLog,
      date: new Date().toISOString().split("T")[0],
    }
    if (offlineMode) {
      localStorage.setItem("pendingCHWShare", JSON.stringify(data))
      alert(t("offlineNotice"))
    } else {
      // Simulate sharing with CHW
      alert(t("nutritionShared"))
    }
  }

  return (
    <div className="health-tips-container">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">{t("title_healthtips")}</h1>
        </div>
      </header>

      {offlineMode && (
        <div className="offline-banner">
          <span className="offline-icon">📱</span>
          {t("offlineNotice")}
        </div>
      )}

      <main className="main-content">
        <div className="tab-navigation">
          <button className={`tab-button ${activeTab === "tips" ? "active" : ""}`} onClick={() => setActiveTab("tips")}>
            {t("healthTips")}
          </button>
          <button
            className={`tab-button ${activeTab === "nutrition" ? "active" : ""}`}
            onClick={() => setActiveTab("nutrition")}
          >
            {t("nutritionTracker")}
          </button>
        </div>

        {activeTab === "tips" && (
          <div className="tips-section">
            <div className="category-filter">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="category-dropdown"
              >
                <option value="all">{t("allCategories")}</option>
                <option value="general">{t("general")}</option>
                <option value="nutrition">{t("nutrition")}</option>
                <option value="exercise">{t("exercise")}</option>
                <option value="hygiene">{t("hygiene")}</option>
              </select>
            </div>

            <div className="tips-grid">
              {filteredTips.map((tip) => (
                <div key={tip.id} className="tip-card">
                  <div className="tip-header">
                    <h3 className="tip-title">{t(tip.titleKey)}</h3>
                    <button
                      className="audio-button"
                      onClick={() => playVoice(t(tip.contentKey))}
                      title={t("playAudio")}
                    >
                      🔊
                    </button>
                  </div>
                  <p className="tip-content">{t(tip.contentKey)}</p>
                  <span className={`tip-category ${tip.category}`}>{t(tip.category)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "nutrition" && (
          <div className="nutrition-section">
            <div className="nutrition-input">
              <h3>{t("logFood")}</h3>
              <div className="input-group">
                <input
                  type="text"
                  value={newFood}
                  onChange={(e) => setNewFood(e.target.value)}
                  placeholder={t("foodPlaceholder")}
                  className="food-input"
                />
                <button className="voice-button" onClick={handleVoiceInput} title={t("voiceInput")}>
                  🎤
                </button>
              </div>
              <button className="add-food-button" onClick={handleAddFood}>
                {t("addFood")}
              </button>
            </div>

            <div className="nutrition-log">
              <h3>{t("todaysMeals")}</h3>
              <p className="meals-count">
                {nutritionLog.length} {t("mealsLogged")}
              </p>
              <div className="meals-list">
                {nutritionLog.map((food, index) => (
                  <div key={index} className="meal-item">
                    <span className="meal-icon">🍽️</span>
                    <span className="meal-name">{food}</span>
                    <span className="meal-time">
                      {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                ))}
              </div>

              {nutritionLog.length > 0 && (
                <button className="share-button" onClick={shareWithCHW}>
                  {t("shareWithCHW")}
                </button>
              )}
            </div>
          </div>
        )}

        <div className="navigation-footer">
          <button className="back-button" onClick={() => (window.location.href = "/")}>
            ← {t("backHome")}
          </button>
        </div>
      </main>
    </div>
  )
}
