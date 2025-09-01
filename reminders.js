// Reminders Page JavaScript

let reminders = []

const reminderTranslations = {
  en: {
    title: "Health Reminders",
    backHome: "Back to Home",
    addReminder: "Add Reminder",
    todayReminders: "Today's Reminders",
    allReminders: "All Reminders",
    addReminderTitle: "Add New Reminder",
    reminderType: "Reminder Type",
    reminderTitle: "Title",
    reminderTime: "Time",
    reminderFrequency: "Frequency",
    reminderNotes: "Notes (Optional)",
    cancel: "Cancel",
    saveReminder: "Save Reminder",
    medication: "Medication",
    appointment: "Doctor Appointment",
    exercise: "Exercise",
    checkup: "Health Checkup",
    custom: "Custom",
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly",
    once: "One Time",
    activeReminders: "active reminders",
    noRemindersToday: "No reminders for today",
    noReminders: "No reminders set",
    markDone: "Mark Done",
    edit: "Edit",
    delete: "Delete",
    reminderAdded: "Reminder added successfully!",
    reminderDeleted: "Reminder deleted",
    reminderCompleted: "Reminder marked as completed",
  },
  hi: {
    title: "स्वास्थ्य रिमाइंडर",
    backHome: "होम पर वापस",
    addReminder: "रिमाइंडर जोड़ें",
    todayReminders: "आज के रिमाइंडर",
    allReminders: "सभी रिमाइंडर",
    addReminderTitle: "नया रिमाइंडर जोड़ें",
    reminderType: "रिमाइंडर प्रकार",
    reminderTitle: "शीर्षक",
    reminderTime: "समय",
    reminderFrequency: "आवृत्ति",
    reminderNotes: "नोट्स (वैकल्पिक)",
    cancel: "रद्द करें",
    saveReminder: "रिमाइंडर सेव करें",
    medication: "दवा",
    appointment: "डॉक्टर अपॉइंटमेंट",
    exercise: "व्यायाम",
    checkup: "स्वास्थ्य जांच",
    custom: "कस्टम",
    daily: "दैनिक",
    weekly: "साप्ताहिक",
    monthly: "मासिक",
    once: "एक बार",
    activeReminders: "सक्रिय रिमाइंडर",
    noRemindersToday: "आज के लिए कोई रिमाइंडर नहीं",
    noReminders: "कोई रिमाइंडर सेट नहीं",
    markDone: "पूर्ण चिह्नित करें",
    edit: "संपादित करें",
    delete: "हटाएं",
    reminderAdded: "रिमाइंडर सफलतापूर्वक जोड़ा गया!",
    reminderDeleted: "रिमाइंडर हटा दिया गया",
    reminderCompleted: "रिमाइंडर पूर्ण के रूप में चिह्नित",
  },
}

// Initialize reminders page
document.addEventListener("DOMContentLoaded", () => {
  initializeRemindersPage()
  loadReminders()
  updateTodayDate()
  renderReminders()
})

function initializeRemindersPage() {
  const currentLang = window.SehatLink?.currentLanguage() || "en"
  updateRemindersLanguage(currentLang)
}

function updateRemindersLanguage(languageCode) {
  const t = reminderTranslations[languageCode] || reminderTranslations.en

  // Update all text elements
  document.getElementById("page-title").textContent = t.title
  document.getElementById("back-home-btn").textContent = t.backHome
  document.getElementById("add-reminder-btn").textContent = t.addReminder
  document.getElementById("today-reminders-title").textContent = t.todayReminders
  document.getElementById("all-reminders-title").textContent = t.allReminders
  document.getElementById("add-reminder-title").textContent = t.addReminderTitle
  document.getElementById("reminder-type-label").textContent = t.reminderType
  document.getElementById("reminder-title-label").textContent = t.reminderTitle
  document.getElementById("reminder-time-label").textContent = t.reminderTime
  document.getElementById("reminder-frequency-label").textContent = t.reminderFrequency
  document.getElementById("reminder-notes-label").textContent = t.reminderNotes
  document.getElementById("cancel-btn").textContent = t.cancel
  document.getElementById("save-reminder-btn").textContent = t.saveReminder

  // Update select options
  const typeSelect = document.getElementById("reminder-type")
  typeSelect.innerHTML = `
        <option value="medication">${t.medication}</option>
        <option value="appointment">${t.appointment}</option>
        <option value="exercise">${t.exercise}</option>
        <option value="checkup">${t.checkup}</option>
        <option value="custom">${t.custom}</option>
    `

  const frequencySelect = document.getElementById("reminder-frequency")
  frequencySelect.innerHTML = `
        <option value="daily">${t.daily}</option>
        <option value="weekly">${t.weekly}</option>
        <option value="monthly">${t.monthly}</option>
        <option value="once">${t.once}</option>
    `
}

function updateTodayDate() {
  const today = new Date()
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }
  document.getElementById("today-date").textContent = today.toLocaleDateString("en-US", options)
}

function loadReminders() {
  try {
    const stored = localStorage.getItem("sehatlink-reminders")
    if (stored) {
      reminders = JSON.parse(stored)
    } else {
      // Add some sample reminders
      reminders = [
        {
          id: "1",
          type: "medication",
          title: "Take Blood Pressure Medicine",
          time: "08:00",
          frequency: "daily",
          notes: "Take with food",
          active: true,
          created: Date.now(),
        },
        {
          id: "2",
          type: "appointment",
          title: "Doctor Checkup",
          time: "14:00",
          frequency: "monthly",
          notes: "Bring previous reports",
          active: true,
          created: Date.now(),
        },
      ]
      saveReminders()
    }
  } catch (error) {
    console.error("Failed to load reminders:", error)
    reminders = []
  }
}

function saveReminders() {
  try {
    localStorage.setItem("sehatlink-reminders", JSON.stringify(reminders))
  } catch (error) {
    console.error("Failed to save reminders:", error)
  }
}

function renderReminders() {
  renderTodayReminders()
  renderAllReminders()
  updateRemindersCount()
}

function renderTodayReminders() {
  const container = document.getElementById("today-reminders-list")
  const currentLang = window.SehatLink?.currentLanguage() || "en"
  const t = reminderTranslations[currentLang] || reminderTranslations.en

  // Filter today's reminders (simplified - in real app would check actual dates)
  const todayReminders = reminders.filter((r) => r.active && (r.frequency === "daily" || r.frequency === "once"))

  if (todayReminders.length === 0) {
    container.innerHTML = `<p style="padding: 24px; text-align: center; color: #6c757d;">${t.noRemindersToday}</p>`
    return
  }

  container.innerHTML = ""
  todayReminders.forEach((reminder) => {
    const div = document.createElement("div")
    div.className = "reminder-item"
    div.innerHTML = `
            <div class="reminder-content">
                <div class="reminder-icon">${getReminderIcon(reminder.type)}</div>
                <div class="reminder-details">
                    <h4>${reminder.title}</h4>
                    <p>${reminder.time} - ${t[reminder.frequency] || reminder.frequency}</p>
                    ${reminder.notes ? `<p class="reminder-notes">${reminder.notes}</p>` : ""}
                </div>
                <div class="reminder-actions">
                    <button class="btn btn-primary btn-sm" onclick="markReminderDone('${reminder.id}')">${t.markDone}</button>
                </div>
            </div>
        `
    container.appendChild(div)
  })
}

function renderAllReminders() {
  const container = document.getElementById("all-reminders-list")
  const currentLang = window.SehatLink?.currentLanguage() || "en"
  const t = reminderTranslations[currentLang] || reminderTranslations.en

  if (reminders.length === 0) {
    container.innerHTML = `<p style="padding: 24px; text-align: center; color: #6c757d;">${t.noReminders}</p>`
    return
  }

  container.innerHTML = ""
  reminders.forEach((reminder) => {
    const div = document.createElement("div")
    div.className = "reminder-item"
    div.innerHTML = `
            <div class="reminder-content">
                <div class="reminder-icon">${getReminderIcon(reminder.type)}</div>
                <div class="reminder-details">
                    <h4>${reminder.title}</h4>
                    <p>${reminder.time} - ${t[reminder.frequency] || reminder.frequency}</p>
                    ${reminder.notes ? `<p class="reminder-notes">${reminder.notes}</p>` : ""}
                    <span class="status-indicator ${reminder.active ? "status-online" : "status-offline"}">
                        ${reminder.active ? "Active" : "Inactive"}
                    </span>
                </div>
                <div class="reminder-actions">
                    <button class="btn btn-secondary btn-sm" onclick="editReminder('${reminder.id}')">${t.edit}</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteReminder('${reminder.id}')">${t.delete}</button>
                </div>
            </div>
        `
    container.appendChild(div)
  })
}

function getReminderIcon(type) {
  switch (type) {
    case "medication":
      return "💊"
    case "appointment":
      return "👨‍⚕️"
    case "exercise":
      return "🏃‍♂️"
    case "checkup":
      return "🩺"
    default:
      return "⏰"
  }
}

function updateRemindersCount() {
  const activeCount = reminders.filter((r) => r.active).length
  const currentLang = window.SehatLink?.currentLanguage() || "en"
  const t = reminderTranslations[currentLang] || reminderTranslations.en
  document.getElementById("reminders-count").textContent = `${activeCount} ${t.activeReminders}`
}

function addReminder() {
  document.getElementById("add-reminder-modal").style.display = "flex"
  clearReminderForm()
}

function closeAddReminderModal() {
  document.getElementById("add-reminder-modal").style.display = "none"
}

function clearReminderForm() {
  document.getElementById("reminder-type").value = "medication"
  document.getElementById("reminder-title-input").value = ""
  document.getElementById("reminder-time-input").value = ""
  document.getElementById("reminder-frequency").value = "daily"
  document.getElementById("reminder-notes").value = ""
}

function saveReminder() {
  const type = document.getElementById("reminder-type").value
  const title = document.getElementById("reminder-title-input").value.trim()
  const time = document.getElementById("reminder-time-input").value
  const frequency = document.getElementById("reminder-frequency").value
  const notes = document.getElementById("reminder-notes").value.trim()

  if (!title || !time) {
    window.SehatLink?.showNotification("Please fill in all required fields", "error")
    return
  }

  const newReminder = {
    id: Date.now().toString(),
    type,
    title,
    time,
    frequency,
    notes,
    active: true,
    created: Date.now(),
  }

  reminders.push(newReminder)
  saveReminders()
  renderReminders()
  closeAddReminderModal()

  const currentLang = window.SehatLink?.currentLanguage() || "en"
  const t = reminderTranslations[currentLang] || reminderTranslations.en
  window.SehatLink?.showNotification(t.reminderAdded, "info")
}

function markReminderDone(id) {
  const currentLang = window.SehatLink?.currentLanguage() || "en"
  const t = reminderTranslations[currentLang] || reminderTranslations.en
  window.SehatLink?.showNotification(t.reminderCompleted, "info")

  // In a real app, this would mark the specific instance as completed
  // For now, just show a success message
}

function editReminder(id) {
  // In a real app, this would open the edit modal with pre-filled data
  window.SehatLink?.showNotification("Edit feature coming soon!", "info")
}

function deleteReminder(id) {
  if (confirm("Are you sure you want to delete this reminder?")) {
    reminders = reminders.filter((r) => r.id !== id)
    saveReminders()
    renderReminders()

    const currentLang = window.SehatLink?.currentLanguage() || "en"
    const t = reminderTranslations[currentLang] || reminderTranslations.en
    window.SehatLink?.showNotification(t.reminderDeleted, "info")
  }
}

// Add reminder-specific styles
const style = document.createElement("style")
style.textContent = `
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }
    
    .modal-content {
        background: white;
        border-radius: 12px;
        width: 90%;
        max-width: 500px;
        max-height: 90vh;
        overflow-y: auto;
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid #e9ecef;
    }
    
    .modal-close {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #6c757d;
    }
    
    .modal-body {
        padding: 20px;
    }
    
    .modal-footer {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        padding: 20px;
        border-top: 1px solid #e9ecef;
    }
    
    .reminder-item {
        padding: 16px;
        border-bottom: 1px solid #e9ecef;
    }
    
    .reminder-item:last-child {
        border-bottom: none;
    }
    
    .reminder-content {
        display: flex;
        align-items: flex-start;
        gap: 16px;
    }
    
    .reminder-icon {
        font-size: 24px;
        width: 40px;
        text-align: center;
    }
    
    .reminder-details {
        flex: 1;
    }
    
    .reminder-details h4 {
        margin: 0 0 8px 0;
        font-size: 18px;
        color: #2c3e50;
    }
    
    .reminder-details p {
        margin: 4px 0;
        color: #6c757d;
    }
    
    .reminder-notes {
        font-style: italic;
        font-size: 14px;
    }
    
    .reminder-actions {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    
    .btn-sm {
        padding: 6px 12px;
        font-size: 14px;
        min-height: auto;
    }
    
    .form-group {
        margin-bottom: 16px;
    }
    
    .form-group label {
        display: block;
        margin-bottom: 8px;
        font-weight: 600;
        color: #2c3e50;
    }
    
    @media (max-width: 768px) {
        .reminder-content {
            flex-direction: column;
            gap: 12px;
        }
        
        .reminder-actions {
            flex-direction: row;
            justify-content: flex-start;
        }
    }
`
document.head.appendChild(style)
