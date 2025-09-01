// SehatLink - Main Application JavaScript

// Global state
let currentLanguage = "en"
let isOffline = false
let deferredPrompt = null

// Translations
const translations = {
  en: {
    welcome: "Welcome to SehatLink",
    subtitle: "Your Health Companion for Rural Communities",
    selectLanguage: "Select Language",
    viewReminders: "View Reminders",
    checkSymptoms: "Check Symptoms",
    healthTips: "Health Tips",
    trackNutrition: "Track Nutrition",
    emergencyHelp: "Emergency Help",
    communityAlerts: "Community Alerts",
    adminLogin: "Admin Login",
    offlineMode: "Offline Mode Active",
    installApp: "Add to Home Screen",
    patientServices: "Patient Services",
    patientServicesDesc: "Access health services without login",
    adminSectionTitle: "Healthcare Professionals",
    adminSectionDesc: "Secure access for doctors and CHWs",
    installAppDesc: "Install SehatLink on your device for offline access",
  },
  hi: {
    welcome: "सेहतलिंक में आपका स्वागत है",
    subtitle: "ग्रामीण समुदायों के लिए आपका स्वास्थ्य साथी",
    selectLanguage: "भाषा चुनें",
    viewReminders: "रिमाइंडर देखें",
    checkSymptoms: "लक्षण जांचें",
    healthTips: "स्वास्थ्य सुझाव",
    trackNutrition: "पोषण ट्रैक करें",
    emergencyHelp: "आपातकालीन सहायता",
    communityAlerts: "सामुदायिक अलर्ट",
    adminLogin: "एडमिन लॉगिन",
    offlineMode: "ऑफलाइन मोड सक्रिय",
    installApp: "होम स्क्रीन पर जोड़ें",
    patientServices: "रोगी सेवाएं",
    patientServicesDesc: "बिना लॉगिन के स्वास्थ्य सेवाओं का उपयोग करें",
    adminSectionTitle: "स्वास्थ्य पेशेवर",
    adminSectionDesc: "डॉक्टरों और CHW के लिए सुरक्षित पहुंच",
    installAppDesc: "ऑफलाइन पहुंच के लिए अपने डिवाइस पर SehatLink इंस्टॉल करें",
  },
}

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
  setupEventListeners()
  checkOfflineStatus()
  setupPWA()
})

// Initialize application
function initializeApp() {
  // Load saved language preference
  const savedLanguage = localStorage.getItem("sehatlink-language") || "en"
  currentLanguage = savedLanguage

  const languageSelect = document.getElementById("language-select")
  if (languageSelect) {
    languageSelect.value = savedLanguage
  }

  // Update UI with selected language
  updateLanguage(savedLanguage)

  // Register service worker
  registerServiceWorker()

  // Setup PWA features
  setupPWA()

  // Process any pending sync data
  processSyncQueue()

  console.log("[SehatLink] App initialized with PWA features")
}

// Setup event listeners
function setupEventListeners() {
  // Language selector
  document.getElementById("language-select").addEventListener("change", (e) => {
    const newLanguage = e.target.value
    updateLanguage(newLanguage)
    localStorage.setItem("sehatlink-language", newLanguage)
  })

  // Language voice button
  document.getElementById("language-voice-btn").addEventListener("click", () => {
    const text = translations[currentLanguage].selectLanguage
    playVoice("selectLanguage")
  })

  // Install app button
  document.getElementById("install-app-btn").addEventListener("click", () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("[SehatLink] User accepted the install prompt")
        }
        deferredPrompt = null
      })
    } else {
      alert("Install feature will be available soon")
    }
  })

  // Online/offline event listeners
  window.addEventListener("online", updateOfflineStatus)
  window.addEventListener("offline", updateOfflineStatus)
}

// Update language throughout the app
function updateLanguage(languageCode) {
  currentLanguage = languageCode
  const t = translations[languageCode] || translations.en

  // Update all text elements
  document.getElementById("welcome-title").textContent = t.welcome
  document.getElementById("subtitle").textContent = t.subtitle
  document.getElementById("language-label").textContent = t.selectLanguage
  document.getElementById("view-reminders-text").textContent = t.viewReminders
  document.getElementById("check-symptoms-text").textContent = t.checkSymptoms
  document.getElementById("health-tips-text").textContent = t.healthTips
  document.getElementById("track-nutrition-text").textContent = t.trackNutrition
  document.getElementById("emergency-help-text").textContent = t.emergencyHelp
  document.getElementById("community-alerts-text").textContent = t.communityAlerts
  document.getElementById("admin-login-text").textContent = t.adminLogin
  document.getElementById("patient-services-title").textContent = t.patientServices
  document.getElementById("patient-services-desc").textContent = t.patientServicesDesc
  document.getElementById("admin-section-title").textContent = t.adminSectionTitle
  document.getElementById("admin-section-desc").textContent = t.adminSectionDesc
  document.getElementById("install-app-title").textContent = t.installApp
  document.getElementById("install-app-desc").textContent = t.installAppDesc
  document.getElementById("install-app-text").textContent = t.installApp
  document.getElementById("offline-text").textContent = t.offlineMode

  console.log("[SehatLink] Language updated to:", languageCode)
}

// Play voice for text
function playVoice(textKey) {
  if ("speechSynthesis" in window) {
    const t = translations[currentLanguage] || translations.en
    const text = t[textKey] || textKey

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = currentLanguage === "hi" ? "hi-IN" : "en-US"
    speechSynthesis.speak(utterance)

    console.log("[SehatLink] Playing voice for:", text)
  }
}

// Check and update offline status
function checkOfflineStatus() {
  updateOfflineStatus()
}

function updateOfflineStatus() {
  isOffline = !navigator.onLine
  const statusElement = document.getElementById("connection-status")
  const offlineIndicator = document.getElementById("offline-indicator")

  if (isOffline) {
    statusElement.textContent = translations[currentLanguage].offlineMode
    statusElement.className = "status-indicator status-offline"
    offlineIndicator.style.display = "block"
  } else {
    statusElement.textContent = "Online"
    statusElement.className = "status-indicator status-online"
    offlineIndicator.style.display = "none"
  }

  console.log("[SehatLink] Connection status:", isOffline ? "Offline" : "Online")
}

// PWA Setup
function setupPWA() {
  // Listen for beforeinstallprompt event
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault()
    deferredPrompt = e
    showInstallBanner()
  })

  // Listen for app installed event
  window.addEventListener("appinstalled", (evt) => {
    console.log("[SehatLink] App was installed")
    hideInstallBanner()
  })

  // Request notification permission
  requestNotificationPermission()
}

// Request notification permission
async function requestNotificationPermission() {
  if ("Notification" in window && "serviceWorker" in navigator) {
    const permission = await Notification.requestPermission()
    if (permission === "granted") {
      console.log("[SehatLink] Notification permission granted")
      setupPushNotifications()
    }
  }
}

// Setup push notifications
async function setupPushNotifications() {
  try {
    const registration = await navigator.serviceWorker.ready

    // In a real app, you would subscribe to push notifications here
    console.log("[SehatLink] Push notifications setup ready")

    // Schedule local notifications for health reminders
    scheduleHealthReminders()
  } catch (error) {
    console.error("[SehatLink] Push notification setup failed:", error)
  }
}

// Schedule health reminders
function scheduleHealthReminders() {
  // Get saved reminders from localStorage
  const reminders = JSON.parse(localStorage.getItem("sehatlink-reminders") || "[]")

  reminders.forEach((reminder) => {
    if (reminder.active) {
      scheduleNotification(reminder)
    }
  })
}

// Schedule a notification
function scheduleNotification(reminder) {
  // Calculate next notification time
  const now = new Date()
  const [hours, minutes] = reminder.time.split(":")
  const notificationTime = new Date()
  notificationTime.setHours(Number.parseInt(hours), Number.parseInt(minutes), 0, 0)

  // If time has passed today, schedule for tomorrow
  if (notificationTime <= now) {
    notificationTime.setDate(notificationTime.getDate() + 1)
  }

  const delay = notificationTime.getTime() - now.getTime()

  setTimeout(() => {
    showLocalNotification(reminder)

    // Reschedule for next occurrence based on frequency
    if (reminder.frequency === "daily") {
      setTimeout(() => scheduleNotification(reminder), 24 * 60 * 60 * 1000)
    }
  }, delay)
}

// Show local notification
function showLocalNotification(reminder) {
  if ("Notification" in window && Notification.permission === "granted") {
    const notification = new Notification("SehatLink Health Reminder", {
      body: reminder.title,
      icon: "icon-192x192.png",
      badge: "icon-192x192.png",
      tag: `reminder-${reminder.id}`,
      data: { url: "reminders.html" },
    })

    notification.onclick = () => {
      window.focus()
      window.location.href = "reminders.html"
      notification.close()
    }

    // Auto close after 10 seconds
    setTimeout(() => notification.close(), 10000)
  }
}

// Background sync registration
function registerBackgroundSync() {
  if ("serviceWorker" in navigator && "sync" in window.ServiceWorkerRegistration.prototype) {
    navigator.serviceWorker.ready
      .then((registration) => {
        return registration.sync.register("sync-health-data")
      })
      .catch((error) => {
        console.error("[SehatLink] Background sync registration failed:", error)
      })
  }
}

// Enhanced offline storage with sync queue
function saveOfflineDataWithSync(key, data) {
  try {
    // Save the data
    saveOfflineData(key, data)

    // Add to sync queue
    const syncQueue = JSON.parse(localStorage.getItem("sehatlink-sync-queue") || "[]")
    syncQueue.push({
      id: Date.now().toString(),
      type: key,
      data: data,
      timestamp: Date.now(),
    })
    localStorage.setItem("sehatlink-sync-queue", JSON.stringify(syncQueue))

    // Register background sync
    registerBackgroundSync()

    console.log("[SehatLink] Data saved offline with sync queue:", key)
  } catch (error) {
    console.error("[SehatLink] Failed to save offline data with sync:", error)
  }
}

// Process sync queue when online
function processSyncQueue() {
  if (!navigator.onLine) return

  const syncQueue = JSON.parse(localStorage.getItem("sehatlink-sync-queue") || "[]")

  if (syncQueue.length > 0) {
    console.log("[SehatLink] Processing sync queue:", syncQueue.length, "items")

    // In a real app, you would send this data to the server
    syncQueue.forEach((item) => {
      console.log("[SehatLink] Syncing:", item.type, item.data)
    })

    // Clear sync queue after processing
    localStorage.removeItem("sehatlink-sync-queue")
    showNotification("Data synced successfully!", "info")
  }
}

// Service Worker Registration
function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    // Check if we're in a preview environment
    const isPreview =
      window.location.hostname.includes("vusercontent.net") ||
      window.location.hostname.includes("preview") ||
      window.location.hostname.includes("localhost")

    if (isPreview) {
      console.log("[SehatLink] Preview environment detected, skipping service worker registration")
      return
    }

    navigator.serviceWorker
      .register("sw.js")
      .then((registration) => {
        console.log("[SehatLink] Service Worker registered successfully:", registration)

        // Handle updates
        registration.addEventListener("updatefound", () => {
          console.log("[SehatLink] Service Worker update found")
        })
      })
      .catch((error) => {
        console.log(
          "[SehatLink] Service Worker registration failed, continuing without offline features:",
          error.message,
        )
      })
  }
}

// Offline Storage Functions
function saveOfflineData(key, data) {
  try {
    localStorage.setItem(
      `sehatlink-offline-${key}`,
      JSON.stringify({
        data: data,
        timestamp: Date.now(),
      }),
    )
    console.log("[SehatLink] Data saved offline:", key)
  } catch (error) {
    console.error("[SehatLink] Failed to save offline data:", error)
  }
}

function getOfflineData(key) {
  try {
    const stored = localStorage.getItem(`sehatlink-offline-${key}`)
    if (stored) {
      const parsed = JSON.parse(stored)
      return parsed.data
    }
  } catch (error) {
    console.error("[SehatLink] Failed to get offline data:", error)
  }
  return null
}

// Utility Functions
function showNotification(message, type = "info") {
  // Simple notification system
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.textContent = message
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        background-color: ${type === "error" ? "#dc3545" : "#28a745"};
        color: white;
        border-radius: 6px;
        z-index: 1001;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.remove()
  }, 3000)
}

function showInstallBanner() {
  const banner = document.getElementById("pwa-install-banner")
  banner.style.display = "block"

  // Setup banner buttons
  document.getElementById("pwa-install-btn").addEventListener("click", () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("[SehatLink] User accepted the install prompt")
        }
        deferredPrompt = null
        hideInstallBanner()
      })
    }
  })

  document.getElementById("pwa-dismiss-btn").addEventListener("click", () => {
    hideInstallBanner()
  })
}

function hideInstallBanner() {
  const banner = document.getElementById("pwa-install-banner")
  banner.style.display = "none"
}

// Export enhanced functions for use in other pages
window.SehatLink = {
  updateLanguage,
  playVoice,
  saveOfflineData,
  saveOfflineDataWithSync,
  getOfflineData,
  showNotification,
  scheduleNotification,
  processSyncQueue,
  translations,
  currentLanguage: () => currentLanguage,
}
