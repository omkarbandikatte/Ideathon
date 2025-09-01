"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import PWAInstall from "@/components/pwa-install"
import NotificationManager from "@/components/notification-manager"
import OfflineIndicator from "@/components/offline-indicator"
import { initializeOfflineSupport } from "@/lib/offline-storage"
import { useLanguage } from "@/contexts/language-context"
import LanguageSelector from "@/components/language-selector"

export default function HomePage() {
  const { t, playVoice } = useLanguage()
  const [isOffline, setIsOffline] = useState(false)

  const languages = [
    { code: "en", name: "English", nativeName: "English" },
    { code: "hi", name: "Hindi", nativeName: "हिंदी" },
    { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
    { code: "mr", name: "Marathi", nativeName: "मराठी" },
    { code: "bho", name: "Bhojpuri", nativeName: "भोजपुरी" },
  ]

  useEffect(() => {
    const initializeApp = async () => {
      // Register service worker
      if ("serviceWorker" in navigator) {
        try {
          // Check if we're in a preview environment
          const isPreview =
            window.location.hostname.includes("vusercontent.net") || window.location.hostname.includes("preview")

          if (isPreview) {
            console.log("[v0] Preview environment detected, skipping service worker registration")
            return
          }

          const registration = await navigator.serviceWorker.register("/sw.js", {
            scope: "/",
          })
          console.log("[v0] Service Worker registered successfully:", registration)

          // Handle updates
          registration.addEventListener("updatefound", () => {
            console.log("[v0] Service Worker update found")
          })
        } catch (error) {
          console.log("[v0] Service Worker registration failed, continuing without offline features:", error.message)
          // Fallback: Create a minimal inline service worker if external file fails
          // Gracefully continue without service worker
        }
      }

      // Initialize offline storage
      await initializeOfflineSupport()
    }

    // Set up offline detection
    const updateOfflineStatus = () => {
      setIsOffline(!navigator.onLine)
    }

    updateOfflineStatus()
    window.addEventListener("online", updateOfflineStatus)
    window.addEventListener("offline", updateOfflineStatus)

    initializeApp()

    return () => {
      window.removeEventListener("online", updateOfflineStatus)
      window.removeEventListener("offline", updateOfflineStatus)
    }
  }, [])

  return (
    <div>
      {/* Header */}
      <header className="header">
        <div className="container">
          <h1>{t("welcome")}</h1>
          <p>{t("subtitle")}</p>

          <LanguageSelector />

          {/* Status Indicators */}
          <div style={{ marginTop: "16px" }}>
            {isOffline ? (
              <span className="status-indicator status-offline">{t("offlineMode")}</span>
            ) : (
              <span className="status-indicator status-online">Online</span>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container" style={{ padding: "32px 16px" }}>
        {/* Patient Features - No Login Required */}
        <section className="card">
          <div className="card-header">
            <h2>Patient Services</h2>
            <p>Access health services without login</p>
          </div>

          <div className="button-grid">
            <Link href="/reminders" className="btn btn-primary btn-large">
              {t("viewReminders")}
              <button
                className="voice-btn"
                onClick={(e) => {
                  e.preventDefault()
                  playVoice(t("viewReminders"))
                }}
                style={{ marginLeft: "12px" }}
              >
                🔊
              </button>
            </Link>

            <Link href="/symptoms" className="btn btn-secondary btn-large">
              {t("checkSymptoms")}
              <button
                className="voice-btn"
                onClick={(e) => {
                  e.preventDefault()
                  playVoice(t("checkSymptoms"))
                }}
                style={{ marginLeft: "12px" }}
              >
                🔊
              </button>
            </Link>

            <Link href="/health-tips" className="btn btn-warning btn-large">
              {t("healthTips")}
              <button
                className="voice-btn"
                onClick={(e) => {
                  e.preventDefault()
                  playVoice(t("healthTips"))
                }}
                style={{ marginLeft: "12px" }}
              >
                🔊
              </button>
            </Link>

            <Link href="/nutrition" className="btn btn-primary btn-large">
              {t("trackNutrition")}
              <button
                className="voice-btn"
                onClick={(e) => {
                  e.preventDefault()
                  playVoice(t("trackNutrition"))
                }}
                style={{ marginLeft: "12px" }}
              >
                🔊
              </button>
            </Link>

            <Link href="/emergency" className="btn btn-danger btn-large">
              {t("emergencyHelp")}
              <button
                className="voice-btn"
                onClick={(e) => {
                  e.preventDefault()
                  playVoice(t("emergencyHelp"))
                }}
                style={{ marginLeft: "12px" }}
              >
                🔊
              </button>
            </Link>

            <Link href="/alerts" className="btn btn-warning btn-large">
              {t("communityAlerts")}
              <button
                className="voice-btn"
                onClick={(e) => {
                  e.preventDefault()
                  playVoice(t("communityAlerts"))
                }}
                style={{ marginLeft: "12px" }}
              >
                🔊
              </button>
            </Link>
          </div>
        </section>

        {/* Admin Access */}
        <section className="card">
          <div className="card-header">
            <h2>Healthcare Professionals</h2>
            <p>Secure access for doctors and CHWs</p>
          </div>

          <div style={{ textAlign: "center" }}>
            <Link href="/admin/login" className="btn btn-primary btn-large">
              {t("adminLogin")}
            </Link>
          </div>
        </section>

        {/* PWA Install Prompt */}
        <section className="card">
          <div style={{ textAlign: "center" }}>
            <h3>{t("installApp")}</h3>
            <p>Install SehatLink on your device for offline access</p>
            <button
              className="btn btn-secondary"
              onClick={() => {
                // PWA install logic will be added later
                alert("Install feature will be available soon")
              }}
            >
              {t("installApp")}
            </button>
          </div>
        </section>
      </main>

      {/* PWA Install Prompt */}
      <PWAInstall />

      {/* Notification Manager */}
      <NotificationManager />

      <OfflineIndicator />
    </div>
  )
}
