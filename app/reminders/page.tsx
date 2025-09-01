"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { offlineStorage, isOnline } from "@/lib/offline-storage"
import { useLanguage } from "@/contexts/language-context"

interface Reminder {
  id: string
  title: string
  time: string
  status: "pending" | "done" | "missed"
  type: "medication" | "checkup" | "exercise"
  description: string
  offline?: boolean
}

export default function RemindersPage() {
  const { t, playVoice } = useLanguage()
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [newReminder, setNewReminder] = useState({
    title: "",
    time: "",
    type: "medication" as const,
    description: "",
  })
  const [showAddForm, setShowAddForm] = useState(false)
  const [offlineMode, setOfflineMode] = useState(false)

  useEffect(() => {
    const updateOfflineStatus = () => {
      setOfflineMode(!navigator.onLine)
    }

    const loadReminders = async () => {
      try {
        const savedReminders = await offlineStorage.getReminders()
        if (savedReminders.length > 0) {
          setReminders(savedReminders)
        } else {
          // Load default reminders if none saved
          const defaultReminders: Reminder[] = [
            {
              id: "1",
              title: "Take TB Medicine",
              time: "20:00",
              status: "pending",
              type: "medication",
              description: "Take your tuberculosis medication with water",
            },
            {
              id: "2",
              title: "Blood Pressure Check",
              time: "09:00",
              status: "done",
              type: "checkup",
              description: "Visit health center for BP monitoring",
            },
            {
              id: "3",
              title: "Morning Walk",
              time: "06:00",
              status: "missed",
              type: "exercise",
              description: "30 minutes walking exercise",
            },
          ]
          setReminders(defaultReminders)
          // Save default reminders to offline storage
          for (const reminder of defaultReminders) {
            await offlineStorage.saveReminder(reminder)
          }
        }
      } catch (error) {
        console.error("Failed to load reminders:", error)
      }
    }

    updateOfflineStatus()
    loadReminders()

    window.addEventListener("online", updateOfflineStatus)
    window.addEventListener("offline", updateOfflineStatus)

    return () => {
      window.removeEventListener("online", updateOfflineStatus)
      window.removeEventListener("offline", updateOfflineStatus)
    }
  }, [])

  const handleStatusChange = async (id: string, newStatus: "done" | "missed") => {
    const updatedReminders = reminders.map((reminder) =>
      reminder.id === id ? { ...reminder, status: newStatus, offline: !isOnline() } : reminder,
    )
    setReminders(updatedReminders)

    // Save to offline storage
    try {
      const updatedReminder = updatedReminders.find((r) => r.id === id)
      if (updatedReminder) {
        await offlineStorage.saveReminder(updatedReminder)
      }
    } catch (error) {
      console.error("Failed to save reminder update:", error)
    }
  }

  const handleAddReminder = async () => {
    if (newReminder.title && newReminder.time) {
      const reminder: Reminder = {
        id: Date.now().toString(),
        title: newReminder.title,
        time: newReminder.time,
        status: "pending",
        type: newReminder.type,
        description: newReminder.description,
        offline: !isOnline(),
      }

      try {
        await offlineStorage.saveReminder(reminder)
        setReminders((prev) => [...prev, reminder])
        setNewReminder({ title: "", time: "", type: "medication", description: "" })
        setShowAddForm(false)

        if (offlineMode) {
          alert(t("savedOffline"))
        } else {
          alert("Reminder saved!")
        }
      } catch (error) {
        console.error("Failed to save reminder:", error)
        alert("Failed to save reminder")
      }
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case "done":
        return "status-online"
      case "missed":
        return "status-offline"
      default:
        return "status-pending"
    }
  }

  return (
    <div>
      {/* Header */}
      <header className="header">
        <div className="container">
          <h1>{t("title_reminders")}</h1>
          <Link href="/" className="btn btn-secondary" style={{ marginTop: "12px" }}>
            {t("backHome")}
          </Link>
        </div>
      </header>

      <main className="container" style={{ padding: "32px 16px" }}>
        {offlineMode && (
          <div className="alert alert-warning" style={{ marginBottom: "24px" }}>
            <strong>⚠️ {t("offlineNotice")}</strong>
          </div>
        )}

        {/* Action Buttons */}
        <div className="button-grid" style={{ gridTemplateColumns: "1fr 1fr 1fr", marginBottom: "32px" }}>
          <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
            {t("addReminder")}
          </button>
          <button className="btn btn-warning" disabled={offlineMode}>
            {t("familyReminders")} {offlineMode && "(Offline)"}
          </button>
          <button className="btn btn-secondary">{t("reminderHistory")}</button>
        </div>

        {/* Add Reminder Form */}
        {showAddForm && (
          <div className="card">
            <div className="card-header">
              <h2>{t("addReminder")}</h2>
            </div>

            <div className="form-group">
              <label className="form-label">{t("reminderTitle")}</label>
              <input
                type="text"
                className="form-input"
                value={newReminder.title}
                onChange={(e) => setNewReminder((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Enter reminder title"
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t("reminderTime")}</label>
              <input
                type="time"
                className="form-input"
                value={newReminder.time}
                onChange={(e) => setNewReminder((prev) => ({ ...prev, time: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t("reminderType")}</label>
              <select
                className="form-select"
                value={newReminder.type}
                onChange={(e) => setNewReminder((prev) => ({ ...prev, type: e.target.value as any }))}
              >
                <option value="medication">{t("medication")}</option>
                <option value="checkup">{t("checkup")}</option>
                <option value="exercise">{t("exercise")}</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">{t("description")}</label>
              <textarea
                className="form-input"
                rows={3}
                value={newReminder.description}
                onChange={(e) => setNewReminder((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Enter description"
              />
            </div>

            <div style={{ display: "flex", gap: "16px" }}>
              <button className="btn btn-primary" onClick={handleAddReminder}>
                {t("save")}
              </button>
              <button className="btn btn-secondary" onClick={() => setShowAddForm(false)}>
                {t("cancel")}
              </button>
            </div>
          </div>
        )}

        {/* Reminders List */}
        <div>
          {reminders.map((reminder) => (
            <div
              key={reminder.id}
              className="card"
              style={{
                border: reminder.offline ? "2px solid #ffc107" : "2px solid #dee2e6",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "16px",
                }}
              >
                <div style={{ flex: 1 }}>
                  <h3>{reminder.title}</h3>
                  <p style={{ color: "#666", marginBottom: "8px" }}>{reminder.time}</p>
                  <p>{reminder.description}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span className={`status-indicator ${getStatusClass(reminder.status)}`}>{t(reminder.status)}</span>
                  {reminder.offline && (
                    <span className="status-indicator status-pending" style={{ fontSize: "12px" }}>
                      Offline
                    </span>
                  )}
                  <button
                    className="voice-btn"
                    onClick={() => playVoice(`${reminder.title} at ${reminder.time}. ${reminder.description}`)}
                  >
                    🔊
                  </button>
                </div>
              </div>

              {reminder.status === "pending" && (
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <button className="btn btn-secondary" onClick={() => handleStatusChange(reminder.id, "done")}>
                    {t("markDone")}
                  </button>
                  <button className="btn btn-warning" onClick={() => handleStatusChange(reminder.id, "missed")}>
                    {t("reschedule")}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
