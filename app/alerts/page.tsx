"use client"

import { useState } from "react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

interface CommunityAlert {
  id: string
  title: string
  description: string
  type: "outbreak" | "weather" | "health" | "safety"
  severity: "low" | "medium" | "high" | "critical"
  date: string
  location: string
  actionRequired: string
}

export default function AlertsPage() {
  const { t, playVoice } = useLanguage()
  const [filterType, setFilterType] = useState("all")
  const [filterSeverity, setFilterSeverity] = useState("all")

  const alerts: CommunityAlert[] = [
    {
      id: "1",
      title: "Dengue Outbreak Alert",
      description: "Increased dengue cases reported in the area. Take preventive measures.",
      type: "outbreak",
      severity: "high",
      date: "2024-01-15",
      location: "Village Center",
      actionRequired: "Remove stagnant water, use mosquito nets, seek medical help for fever",
    },
    {
      id: "2",
      title: "Heavy Rain Warning",
      description: "Heavy rainfall expected for next 3 days. Risk of waterborne diseases.",
      type: "weather",
      severity: "medium",
      date: "2024-01-14",
      location: "Entire District",
      actionRequired: "Boil drinking water, avoid flood areas, stock essential medicines",
    },
    {
      id: "3",
      title: "Vaccination Drive",
      description: "Free vaccination camp for children under 5 years.",
      type: "health",
      severity: "low",
      date: "2024-01-13",
      location: "Primary Health Center",
      actionRequired: "Bring vaccination cards, arrive between 9 AM - 4 PM",
    },
    {
      id: "4",
      title: "Water Contamination Alert",
      description: "Main water supply contaminated. Use alternative sources.",
      type: "safety",
      severity: "critical",
      date: "2024-01-16",
      location: "Sectors 1-5",
      actionRequired: "Use bottled water, boil all water for 15 minutes before use",
    },
  ]

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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "outbreak":
        return "🦠"
      case "weather":
        return "🌧️"
      case "health":
        return "💉"
      case "safety":
        return "⚠️"
      default:
        return "📢"
    }
  }

  const filteredAlerts = alerts.filter((alert) => {
    const typeMatch = filterType === "all" || alert.type === filterType
    const severityMatch = filterSeverity === "all" || alert.severity === filterSeverity
    return typeMatch && severityMatch
  })

  const shareAlert = (alert: CommunityAlert) => {
    if (navigator.share) {
      navigator.share({
        title: alert.title,
        text: `${alert.description}\n\nAction Required: ${alert.actionRequired}`,
        url: window.location.href,
      })
    } else {
      // Fallback for browsers that don't support Web Share API
      const text = `${alert.title}\n${alert.description}\n\nAction Required: ${alert.actionRequired}`
      navigator.clipboard.writeText(text)
      alert("Alert copied to clipboard!")
    }
  }

  return (
    <div>
      {/* Header */}
      <header className="header">
        <div className="container">
          <h1>{t("title_alerts")}</h1>
          <Link href="/" className="btn btn-secondary" style={{ marginTop: "12px" }}>
            {t("backHome")}
          </Link>
        </div>
      </header>

      <main className="container" style={{ padding: "32px 16px" }}>
        {/* Filters */}
        <div className="card">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="form-group">
              <label className="form-label">{t("filterByType")}</label>
              <select className="form-select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="all">{t("allTypes")}</option>
                <option value="outbreak">{t("outbreak")}</option>
                <option value="weather">{t("weather")}</option>
                <option value="health">{t("health")}</option>
                <option value="safety">{t("safety")}</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">{t("filterBySeverity")}</label>
              <select
                className="form-select"
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
              >
                <option value="all">{t("allSeverity")}</option>
                <option value="critical">{t("critical")}</option>
                <option value="high">{t("high")}</option>
                <option value="medium">{t("medium")}</option>
                <option value="low">{t("low")}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Alerts List */}
        <div>
          {filteredAlerts.map((alert) => (
            <div key={alert.id} className="card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "16px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "24px" }}>{getTypeIcon(alert.type)}</span>
                  <div>
                    <h3>{alert.title}</h3>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center", marginTop: "8px" }}>
                      <span className={`status-indicator ${getSeverityClass(alert.severity)}`}>
                        {t(alert.severity)}
                      </span>
                      <span style={{ color: "#666", fontSize: "14px" }}>
                        {t("date")}: {alert.date}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  className="voice-btn"
                  onClick={() => playVoice(`${alert.title}. ${alert.description}. ${alert.actionRequired}`)}
                >
                  🔊
                </button>
              </div>

              <p style={{ marginBottom: "16px" }}>{alert.description}</p>

              <div style={{ backgroundColor: "#f8f9fa", padding: "16px", borderRadius: "6px", marginBottom: "16px" }}>
                <p>
                  <strong>{t("location")}:</strong> {alert.location}
                </p>
                <p>
                  <strong>{t("actionRequired")}:</strong> {alert.actionRequired}
                </p>
              </div>

              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <button className="btn btn-primary" onClick={() => shareAlert(alert)}>
                  {t("shareAlert")}
                </button>
                <button className="btn btn-secondary">{t("markAsRead")}</button>
              </div>
            </div>
          ))}
        </div>

        {filteredAlerts.length === 0 && (
          <div className="card" style={{ textAlign: "center" }}>
            <h3>No alerts found</h3>
            <p>No alerts match your current filters.</p>
          </div>
        )}
      </main>
    </div>
  )
}
