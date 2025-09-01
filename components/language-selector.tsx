"use client"

import { useLanguage } from "@/contexts/language-context"

export default function LanguageSelector() {
  const { selectedLanguage, setSelectedLanguage, languages, t, playVoice } = useLanguage()

  return (
    <div className="language-selector">
      <label className="form-label" style={{ color: "white" }}>
        {t("selectLanguage")}
      </label>
      <div style={{ position: "relative", maxWidth: "200px", margin: "0 auto" }}>
        <select
          className="form-select"
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          aria-label={t("selectLanguage")}
          style={{
            backgroundColor: "white",
            color: "#333",
            border: "2px solid #dee2e6",
          }}
        >
          {languages.map((lang) => (
            <option
              key={lang.code}
              value={lang.code}
              style={{
                backgroundColor: "white",
                color: "#333",
                padding: "8px",
              }}
            >
              {lang.nativeName} ({lang.name})
            </option>
          ))}
        </select>
      </div>
      <button className="voice-btn" onClick={() => playVoice(t("selectLanguage"))} title="Play voice">
        🔊
      </button>
    </div>
  )
}
