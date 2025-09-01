"use client"

import { useState, useEffect } from "react"

export default function NotificationManager() {
  const [permission, setPermission] = useState<NotificationPermission>("default")
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false)

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission)

      // Show permission prompt after user has used the app for a bit
      const timer = setTimeout(() => {
        if (Notification.permission === "default") {
          setShowPermissionPrompt(true)
        }
      }, 30000) // Show after 30 seconds

      return () => clearTimeout(timer)
    }
  }, [])

  const requestPermission = async () => {
    if ("Notification" in window) {
      try {
        const permission = await Notification.requestPermission()
        setPermission(permission)
        setShowPermissionPrompt(false)

        if (permission === "granted") {
          // Register for push notifications
          await registerPushNotifications()

          // Show welcome notification
          new Notification("SehatLink Notifications Enabled", {
            body: "You'll now receive health reminders and important alerts",
            icon: "/icon-192x192.png",
          })
        }
      } catch (error) {
        console.error("Error requesting notification permission:", error)
      }
    }
  }

  const registerPushNotifications = async () => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      try {
        const registration = await navigator.serviceWorker.ready

        // Check if already subscribed
        const existingSubscription = await registration.pushManager.getSubscription()
        if (existingSubscription) {
          console.log("Already subscribed to push notifications")
          return
        }

        // Subscribe to push notifications
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            // In a real app, this would be your VAPID public key
            "BEl62iUYgUivxIkv69yViEuiBIa40HI6YUfXDtkiWQRGTxQoreZmBTrNfBNjdBbhwdXpdsyivxqX3M4SIlOkbA",
          ),
        })

        console.log("Subscribed to push notifications:", subscription)

        // Send subscription to server (in a real app)
        // await fetch('/api/subscribe', {
        //   method: 'POST',
        //   body: JSON.stringify(subscription),
        //   headers: { 'Content-Type': 'application/json' }
        // })
      } catch (error) {
        console.error("Error subscribing to push notifications:", error)
      }
    }
  }

  const dismissPrompt = () => {
    setShowPermissionPrompt(false)
    localStorage.setItem("notification-prompt-dismissed", Date.now().toString())
  }

  if (!showPermissionPrompt || permission !== "default") {
    return null
  }

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        left: "20px",
        right: "20px",
        backgroundColor: "#28a745",
        color: "white",
        padding: "16px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
        zIndex: 1000,
        maxWidth: "400px",
        margin: "0 auto",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
        <div style={{ fontSize: "24px" }}>🔔</div>
        <div>
          <h4 style={{ margin: 0, color: "white" }}>Enable Health Reminders</h4>
          <p style={{ margin: 0, fontSize: "14px", opacity: 0.9 }}>
            Get notified about medication times and health checkups
          </p>
        </div>
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        <button
          className="btn btn-secondary"
          onClick={requestPermission}
          style={{
            flex: 1,
            backgroundColor: "white",
            color: "#28a745",
            border: "none",
          }}
        >
          Enable Notifications
        </button>
        <button
          onClick={dismissPrompt}
          style={{
            background: "none",
            border: "none",
            color: "white",
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer",
            opacity: 0.8,
          }}
        >
          Later
        </button>
      </div>
    </div>
  )
}

// Helper function for push notifications
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

// Export the scheduling function for use in other components
export const scheduleHealthReminder = (reminderTime: string, message: string) => {
  if ("Notification" in window && Notification.permission === "granted") {
    const now = new Date()
    const [hours, minutes] = reminderTime.split(":").map(Number)
    const reminderDate = new Date()
    reminderDate.setHours(hours, minutes, 0, 0)

    if (reminderDate <= now) {
      reminderDate.setDate(reminderDate.getDate() + 1)
    }

    const timeUntilReminder = reminderDate.getTime() - now.getTime()

    setTimeout(() => {
      new Notification("SehatLink Health Reminder", {
        body: message,
        icon: "/icon-192x192.png",
        badge: "/icon-192x192.png",
        vibrate: [200, 100, 200],
        tag: "health-reminder",
        requireInteraction: true,
      })
    }, timeUntilReminder)
  }
}
