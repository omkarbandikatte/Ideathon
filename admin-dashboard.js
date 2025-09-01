// Admin Dashboard JavaScript

let currentUser = null
let patients = []
let outbreakAlerts = []
let filteredPatients = []
let viewMode = "table"
let selectedPatient = null
const newNote = ""

// Initialize dashboard
document.addEventListener("DOMContentLoaded", () => {
  checkAuthentication()
  initializeDashboard()
  loadMockData()
  renderDashboard()
})

function checkAuthentication() {
  const session = localStorage.getItem("sehatlink_admin")
  if (!session) {
    window.location.href = "admin-login.html"
    return
  }

  try {
    currentUser = JSON.parse(session)
    const loginTime = new Date(currentUser.loginTime)
    const now = new Date()
    const hoursDiff = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60)

    // Session expires after 24 hours
    if (hoursDiff >= 24) {
      localStorage.removeItem("sehatlink_admin")
      window.location.href = "admin-login.html"
      return
    }

    // Update welcome message
    document.getElementById("welcome-message").textContent = `Welcome back, ${currentUser.name}`
    document.getElementById("user-role").textContent = currentUser.role.toUpperCase()
  } catch (error) {
    localStorage.removeItem("sehatlink_admin")
    window.location.href = "admin-login.html"
  }
}

function initializeDashboard() {
  const currentLang = window.SehatLink?.currentLanguage() || "en"
  updateDashboardLanguage(currentLang)
}

function updateDashboardLanguage(languageCode) {
  // For now, keeping English labels
  // In a full implementation, would add translation support
}

function loadMockData() {
  // Mock patient data
  patients = [
    {
      id: "1",
      name: "Rajesh Kumar",
      age: 45,
      condition: "Diabetes",
      adherence: 85,
      riskLevel: "medium",
      lastVisit: "2024-01-10",
      chw: "Priya Devi",
      region: "North Village",
      notes: "Patient showing good progress with medication compliance",
      contactNumber: "+91-9876543210",
    },
    {
      id: "2",
      name: "Sunita Sharma",
      age: 32,
      condition: "Hypertension",
      adherence: 92,
      riskLevel: "low",
      lastVisit: "2024-01-12",
      chw: "Ram Kumar",
      region: "South Village",
      notes: "Excellent adherence, blood pressure well controlled",
      contactNumber: "+91-9876543211",
    },
    {
      id: "3",
      name: "Mohan Singh",
      age: 58,
      condition: "Tuberculosis",
      adherence: 45,
      riskLevel: "critical",
      lastVisit: "2024-01-08",
      chw: "Priya Devi",
      region: "North Village",
      notes: "Poor adherence, requires immediate intervention",
      contactNumber: "+91-9876543212",
    },
    {
      id: "4",
      name: "Geeta Patel",
      age: 28,
      condition: "Pregnancy Care",
      adherence: 78,
      riskLevel: "medium",
      lastVisit: "2024-01-14",
      chw: "Meera Joshi",
      region: "East Village",
      notes: "Regular checkups needed, iron deficiency noted",
      contactNumber: "+91-9876543213",
    },
    {
      id: "5",
      name: "Amit Verma",
      age: 52,
      condition: "Heart Disease",
      adherence: 95,
      riskLevel: "high",
      lastVisit: "2024-01-15",
      chw: "Ram Kumar",
      region: "South Village",
      notes: "High adherence but condition requires monitoring",
      contactNumber: "+91-9876543214",
    },
  ]

  // Mock outbreak data
  outbreakAlerts = [
    {
      id: "1",
      disease: "Dengue",
      cases: 23,
      region: "North Village",
      trend: "rising",
      severity: "high",
    },
    {
      id: "2",
      disease: "Diarrhea",
      cases: 12,
      region: "South Village",
      trend: "stable",
      severity: "medium",
    },
    {
      id: "3",
      disease: "Respiratory Infection",
      cases: 8,
      region: "East Village",
      trend: "declining",
      severity: "low",
    },
  ]

  filteredPatients = [...patients]
}

function renderDashboard() {
  updateStatistics()
  renderOutbreakAlerts()
  renderPatientList()
}

function updateStatistics() {
  const totalPatients = patients.length
  const highRiskPatients = patients.filter((p) => p.riskLevel === "high" || p.riskLevel === "critical").length
  const avgAdherence = Math.round(patients.reduce((sum, p) => sum + p.adherence, 0) / patients.length)

  document.getElementById("total-patients").textContent = totalPatients
  document.getElementById("high-risk-count").textContent = highRiskPatients
  document.getElementById("avg-adherence").textContent = `${avgAdherence}%`
  document.getElementById("alerts-count").textContent = outbreakAlerts.length
}

function renderOutbreakAlerts() {
  const container = document.getElementById("outbreak-alerts-container")
  container.innerHTML = ""

  outbreakAlerts.forEach((alert) => {
    const div = document.createElement("div")
    div.style.cssText = `
            padding: 16px;
            background-color: #f8f9fa;
            border-radius: 8px;
            border: 2px solid ${alert.severity === "high" ? "#dc3545" : alert.severity === "medium" ? "#ffc107" : "#28a745"};
        `

    div.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h4>${alert.disease}</h4>
                <span style="font-size: 20px;">${getTrendIcon(alert.trend)}</span>
            </div>
            <p><strong>${alert.cases}</strong> cases in ${alert.region}</p>
            <span class="status-indicator ${getRiskClass(alert.severity)}">
                ${alert.trend.toUpperCase()} - ${alert.severity.toUpperCase()}
            </span>
        `

    container.appendChild(div)
  })
}

function renderPatientList() {
  const container = document.getElementById("patient-list-container")

  if (viewMode === "table") {
    renderTableView(container)
  } else {
    renderCardsView(container)
  }
}

function renderTableView(container) {
  const table = document.createElement("div")
  table.style.overflowX = "auto"

  table.innerHTML = `
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr style="background-color: #f8f9fa;">
                    <th style="padding: 12px; text-align: left; border: 1px solid #dee2e6;">Name</th>
                    <th style="padding: 12px; text-align: left; border: 1px solid #dee2e6;">Condition</th>
                    <th style="padding: 12px; text-align: left; border: 1px solid #dee2e6;">Adherence</th>
                    <th style="padding: 12px; text-align: left; border: 1px solid #dee2e6;">Risk Level</th>
                    <th style="padding: 12px; text-align: left; border: 1px solid #dee2e6;">Last Visit</th>
                    <th style="padding: 12px; text-align: left; border: 1px solid #dee2e6;">CHW</th>
                    <th style="padding: 12px; text-align: left; border: 1px solid #dee2e6;">Actions</th>
                </tr>
            </thead>
            <tbody>
                ${filteredPatients
                  .map(
                    (patient) => `
                    <tr>
                        <td style="padding: 12px; border: 1px solid #dee2e6;">
                            <strong>${patient.name}</strong><br>
                            <small>${patient.age} years</small>
                        </td>
                        <td style="padding: 12px; border: 1px solid #dee2e6;">${patient.condition}</td>
                        <td style="padding: 12px; border: 1px solid #dee2e6;">
                            <div style="background-color: #e9ecef; border-radius: 10px; height: 8px; overflow: hidden; margin-bottom: 4px;">
                                <div style="background-color: ${getAdherenceColor(patient.adherence)}; height: 100%; width: ${patient.adherence}%; border-radius: 10px;"></div>
                            </div>
                            ${patient.adherence}%
                        </td>
                        <td style="padding: 12px; border: 1px solid #dee2e6;">
                            <span class="status-indicator ${getRiskClass(patient.riskLevel)}">
                                ${patient.riskLevel.toUpperCase()}
                            </span>
                        </td>
                        <td style="padding: 12px; border: 1px solid #dee2e6;">${patient.lastVisit}</td>
                        <td style="padding: 12px; border: 1px solid #dee2e6;">${patient.chw}</td>
                        <td style="padding: 12px; border: 1px solid #dee2e6;">
                            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                                <button class="btn btn-primary" style="padding: 6px 12px; font-size: 14px;" onclick="viewPatientDetails('${patient.id}')">
                                    View Details
                                </button>
                                <button class="btn btn-warning" style="padding: 6px 12px; font-size: 14px;" onclick="prioritizePatient('${patient.id}')">
                                    Prioritize
                                </button>
                            </div>
                        </td>
                    </tr>
                `,
                  )
                  .join("")}
            </tbody>
        </table>
    `

  container.innerHTML = ""
  container.appendChild(table)
}

function renderCardsView(container) {
  const cardsContainer = document.createElement("div")
  cardsContainer.style.cssText =
    "display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px;"

  cardsContainer.innerHTML = filteredPatients
    .map(
      (patient) => `
        <div class="card" style="margin: 0;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                <div>
                    <h4>${patient.name}</h4>
                    <p style="color: #666; margin: 0;">${patient.age} years • ${patient.condition}</p>
                </div>
                <span class="status-indicator ${getRiskClass(patient.riskLevel)}">
                    ${patient.riskLevel.toUpperCase()}
                </span>
            </div>

            <div style="margin-bottom: 16px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                    <span>Adherence</span>
                    <span>${patient.adherence}%</span>
                </div>
                <div style="background-color: #e9ecef; border-radius: 10px; height: 8px; overflow: hidden;">
                    <div style="background-color: ${getAdherenceColor(patient.adherence)}; height: 100%; width: ${patient.adherence}%; border-radius: 10px;"></div>
                </div>
            </div>

            <div style="font-size: 14px; color: #666; margin-bottom: 16px;">
                <p>CHW: ${patient.chw}</p>
                <p>Region: ${patient.region}</p>
                <p>Last Visit: ${patient.lastVisit}</p>
            </div>

            <div style="display: flex; gap: 8px;">
                <button class="btn btn-primary" style="flex: 1;" onclick="viewPatientDetails('${patient.id}')">
                    View Details
                </button>
                <button class="btn btn-warning" style="flex: 1;" onclick="prioritizePatient('${patient.id}')">
                    Prioritize
                </button>
            </div>
        </div>
    `,
    )
    .join("")

  container.innerHTML = ""
  container.appendChild(cardsContainer)
}

function applyFilters() {
  const regionFilter = document.getElementById("filter-region").value
  const chwFilter = document.getElementById("filter-chw").value
  const riskFilter = document.getElementById("filter-risk").value
  const sortBy = document.getElementById("sort-by").value

  filteredPatients = patients.filter((patient) => {
    const regionMatch = regionFilter === "all" || patient.region === regionFilter
    const chwMatch = chwFilter === "all" || patient.chw === chwFilter
    const riskMatch = riskFilter === "all" || patient.riskLevel === riskFilter
    return regionMatch && chwMatch && riskMatch
  })

  // Sort patients
  filteredPatients.sort((a, b) => {
    switch (sortBy) {
      case "adherence":
        return a.adherence - b.adherence
      case "risk":
        const riskOrder = { critical: 0, high: 1, medium: 2, low: 3 }
        return riskOrder[a.riskLevel] - riskOrder[b.riskLevel]
      case "name":
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  renderPatientList()
}

function setViewMode(mode) {
  viewMode = mode
  const tableBtn = document.getElementById("table-view-btn")
  const cardsBtn = document.getElementById("cards-view-btn")

  if (mode === "table") {
    tableBtn.className = "btn btn-primary"
    cardsBtn.className = "btn btn-secondary"
  } else {
    tableBtn.className = "btn btn-secondary"
    cardsBtn.className = "btn btn-primary"
  }

  renderPatientList()
}

function viewPatientDetails(patientId) {
  selectedPatient = patients.find((p) => p.id === patientId)
  if (!selectedPatient) return

  const modal = document.getElementById("patient-modal")
  const content = document.getElementById("patient-details-content")

  content.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h3>${selectedPatient.name}</h3>
            <p><strong>Age:</strong> ${selectedPatient.age} years</p>
            <p><strong>Condition:</strong> ${selectedPatient.condition}</p>
            <p><strong>Contact:</strong> ${selectedPatient.contactNumber}</p>
            <p><strong>Adherence:</strong> ${selectedPatient.adherence}%</p>
            <p><strong>Risk Level:</strong> 
                <span class="status-indicator ${getRiskClass(selectedPatient.riskLevel)}">
                    ${selectedPatient.riskLevel.toUpperCase()}
                </span>
            </p>
            <p><strong>CHW:</strong> ${selectedPatient.chw}</p>
            <p><strong>Region:</strong> ${selectedPatient.region}</p>
            <p><strong>Last Visit:</strong> ${selectedPatient.lastVisit}</p>
        </div>

        <div style="margin-bottom: 20px;">
            <h4>Notes</h4>
            <p style="background-color: #f8f9fa; padding: 12px; border-radius: 6px;">
                ${selectedPatient.notes}
            </p>
        </div>

        <div style="margin-bottom: 20px;">
            <h4>Add New Note</h4>
            <textarea id="new-note-input" class="form-input" rows="3" placeholder="Enter new note..."></textarea>
        </div>
    `

  modal.style.display = "flex"
}

function closePatientModal() {
  document.getElementById("patient-modal").style.display = "none"
  selectedPatient = null
}

function savePatientNote() {
  const noteInput = document.getElementById("new-note-input")
  const note = noteInput.value.trim()

  if (selectedPatient && note) {
    window.SehatLink?.showNotification(`Note added for ${selectedPatient.name}: ${note}`, "info")
    closePatientModal()
  }
}

function prioritizePatient(patientId) {
  const patient = patients.find((p) => p.id === patientId)
  if (patient) {
    window.SehatLink?.showNotification(`${patient.name} has been prioritized`, "info")
  }
}

function exportData() {
  const csvContent = [
    ["Name", "Age", "Condition", "Adherence", "Risk Level", "Last Visit", "CHW", "Region"].join(","),
    ...filteredPatients.map((p) =>
      [p.name, p.age, p.condition, p.adherence + "%", p.riskLevel, p.lastVisit, p.chw, p.region].join(","),
    ),
  ].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv" })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "patient_data.csv"
  a.click()
  window.URL.revokeObjectURL(url)

  window.SehatLink?.showNotification("Patient data exported successfully!", "info")
}

function logout() {
  if (confirm("Are you sure you want to logout?")) {
    localStorage.removeItem("sehatlink_admin")
    window.location.href = "admin-login.html"
  }
}

// Utility functions
function getRiskClass(risk) {
  switch (risk) {
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

function getAdherenceColor(adherence) {
  if (adherence >= 80) return "#28a745"
  if (adherence >= 60) return "#ffc107"
  return "#dc3545"
}

function getTrendIcon(trend) {
  switch (trend) {
    case "rising":
      return "📈"
    case "declining":
      return "📉"
    case "stable":
      return "➡️"
    default:
      return "📊"
  }
}
