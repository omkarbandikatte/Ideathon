"use client"

import { useState } from "react"
import AdminLayout from "@/components/admin-layout"

interface Patient {
  id: string
  name: string
  age: number
  condition: string
  adherence: number
  riskLevel: "low" | "medium" | "high" | "critical"
  lastVisit: string
  chw: string
  region: string
  notes: string
  contactNumber: string
}

interface OutbreakAlert {
  id: string
  disease: string
  cases: number
  region: string
  trend: "rising" | "stable" | "declining"
  severity: "low" | "medium" | "high"
}

export default function AdminDashboardPage() {
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [filterRegion, setFilterRegion] = useState("all")
  const [filterCHW, setFilterCHW] = useState("all")
  const [filterRisk, setFilterRisk] = useState("all")
  const [sortBy, setSortBy] = useState("adherence")
  const [viewMode, setViewMode] = useState<"table" | "cards">("table")
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [newNote, setNewNote] = useState("")

  // Mock patient data
  const patients: Patient[] = [
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
  const outbreakAlerts: OutbreakAlert[] = [
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

  const translations = {
    en: {
      title: "Doctor Dashboard",
      overview: "Patient Overview",
      totalPatients: "Total Patients",
      highRisk: "High Risk",
      avgAdherence: "Avg Adherence",
      recentAlerts: "Recent Alerts",
      patientList: "Patient Management",
      outbreakAlerts: "Outbreak Alerts",
      filterRegion: "Filter by Region",
      filterCHW: "Filter by CHW",
      filterRisk: "Filter by Risk",
      sortBy: "Sort by",
      viewMode: "View Mode",
      table: "Table",
      cards: "Cards",
      name: "Name",
      condition: "Condition",
      adherence: "Adherence",
      riskLevel: "Risk Level",
      lastVisit: "Last Visit",
      chw: "CHW",
      region: "Region",
      actions: "Actions",
      viewDetails: "View Details",
      addNote: "Add Note",
      prioritize: "Prioritize",
      exportData: "Export Data",
      patientDetails: "Patient Details",
      contactNumber: "Contact",
      notes: "Notes",
      addNewNote: "Add New Note",
      saveNote: "Save Note",
      cancel: "Cancel",
      cases: "cases",
      rising: "Rising",
      stable: "Stable",
      declining: "Declining",
    },
    hi: {
      title: "डॉक्टर डैशबोर्ड",
      overview: "मरीज़ अवलोकन",
      totalPatients: "कुल मरीज़",
      highRisk: "उच्च जोखिम",
      avgAdherence: "औसत पालन",
      recentAlerts: "हाल की चेतावनी",
      patientList: "मरीज़ प्रबंधन",
      outbreakAlerts: "प्रकोप चेतावनी",
      filterRegion: "क्षेत्र के अनुसार फ़िल्टर करें",
      filterCHW: "CHW के अनुसार फ़िल्टर करें",
      filterRisk: "जोखिम के अनुसार फ़िल्टर करें",
      sortBy: "इसके अनुसार क्रमबद्ध करें",
      viewMode: "देखने का तरीका",
      table: "तालिका",
      cards: "कार्ड",
      name: "नाम",
      condition: "स्थिति",
      adherence: "पालन",
      riskLevel: "जोखिम स्तर",
      lastVisit: "अंतिम यात्रा",
      chw: "CHW",
      region: "क्षेत्र",
      actions: "कार्रवाई",
      viewDetails: "विवरण देखें",
      addNote: "नोट जोड़ें",
      prioritize: "प्राथमिकता दें",
      exportData: "डेटा निर्यात करें",
      patientDetails: "मरीज़ विवरण",
      contactNumber: "संपर्क",
      notes: "नोट्स",
      addNewNote: "नया नोट जोड़ें",
      saveNote: "नोट सेव करें",
      cancel: "रद्द करें",
      cases: "मामले",
      rising: "बढ़ रहा",
      stable: "स्थिर",
      declining: "घट रहा",
    },
  }

  const t = translations[selectedLanguage as keyof typeof translations] || translations.en

  // Filter and sort patients
  const filteredPatients = patients
    .filter((patient) => {
      const regionMatch = filterRegion === "all" || patient.region === filterRegion
      const chwMatch = filterCHW === "all" || patient.chw === filterCHW
      const riskMatch = filterRisk === "all" || patient.riskLevel === filterRisk
      return regionMatch && chwMatch && riskMatch
    })
    .sort((a, b) => {
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

  const getRiskClass = (risk: string) => {
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

  const getTrendIcon = (trend: string) => {
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

  const handleAddNote = () => {
    if (selectedPatient && newNote.trim()) {
      // In a real app, this would save to database
      alert(`Note added for ${selectedPatient.name}: ${newNote}`)
      setNewNote("")
      setSelectedPatient(null)
    }
  }

  const exportData = () => {
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
  }

  // Calculate statistics
  const totalPatients = patients.length
  const highRiskPatients = patients.filter((p) => p.riskLevel === "high" || p.riskLevel === "critical").length
  const avgAdherence = Math.round(patients.reduce((sum, p) => sum + p.adherence, 0) / patients.length)

  return (
    <AdminLayout title={t.title}>
      <div className="container" style={{ padding: "32px 16px" }}>
        {/* Overview Statistics */}
        <section className="card">
          <div className="card-header">
            <h2>{t.overview}</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
            <div style={{ textAlign: "center", padding: "20px", backgroundColor: "#e7f3ff", borderRadius: "8px" }}>
              <h3 style={{ fontSize: "32px", color: "#2c5aa0", marginBottom: "8px" }}>{totalPatients}</h3>
              <p style={{ margin: 0, fontWeight: "bold" }}>{t.totalPatients}</p>
            </div>
            <div style={{ textAlign: "center", padding: "20px", backgroundColor: "#ffe7e7", borderRadius: "8px" }}>
              <h3 style={{ fontSize: "32px", color: "#dc3545", marginBottom: "8px" }}>{highRiskPatients}</h3>
              <p style={{ margin: 0, fontWeight: "bold" }}>{t.highRisk}</p>
            </div>
            <div style={{ textAlign: "center", padding: "20px", backgroundColor: "#e7ffe7", borderRadius: "8px" }}>
              <h3 style={{ fontSize: "32px", color: "#28a745", marginBottom: "8px" }}>{avgAdherence}%</h3>
              <p style={{ margin: 0, fontWeight: "bold" }}>{t.avgAdherence}</p>
            </div>
            <div style={{ textAlign: "center", padding: "20px", backgroundColor: "#fff3e7", borderRadius: "8px" }}>
              <h3 style={{ fontSize: "32px", color: "#ffc107", marginBottom: "8px" }}>{outbreakAlerts.length}</h3>
              <p style={{ margin: 0, fontWeight: "bold" }}>{t.recentAlerts}</p>
            </div>
          </div>
        </section>

        {/* Outbreak Alerts */}
        <section className="card">
          <div className="card-header">
            <h2>{t.outbreakAlerts}</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}>
            {outbreakAlerts.map((alert) => (
              <div
                key={alert.id}
                style={{
                  padding: "16px",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "8px",
                  border: `2px solid ${alert.severity === "high" ? "#dc3545" : alert.severity === "medium" ? "#ffc107" : "#28a745"}`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h4>{alert.disease}</h4>
                  <span style={{ fontSize: "20px" }}>{getTrendIcon(alert.trend)}</span>
                </div>
                <p>
                  <strong>{alert.cases}</strong> {t.cases} in {alert.region}
                </p>
                <span className={`status-indicator ${getRiskClass(alert.severity)}`}>
                  {t[alert.trend as keyof typeof t]} - {alert.severity.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Patient Management */}
        <section className="card">
          <div className="card-header">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "16px",
              }}
            >
              <h2>{t.patientList}</h2>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <button className="btn btn-primary" onClick={exportData}>
                  {t.exportData}
                </button>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    className={`btn ${viewMode === "table" ? "btn-primary" : "btn-secondary"}`}
                    onClick={() => setViewMode("table")}
                  >
                    {t.table}
                  </button>
                  <button
                    className={`btn ${viewMode === "cards" ? "btn-primary" : "btn-secondary"}`}
                    onClick={() => setViewMode("cards")}
                  >
                    {t.cards}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            <div className="form-group">
              <label className="form-label">{t.filterRegion}</label>
              <select className="form-select" value={filterRegion} onChange={(e) => setFilterRegion(e.target.value)}>
                <option value="all">All Regions</option>
                <option value="North Village">North Village</option>
                <option value="South Village">South Village</option>
                <option value="East Village">East Village</option>
                <option value="West Village">West Village</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">{t.filterCHW}</label>
              <select className="form-select" value={filterCHW} onChange={(e) => setFilterCHW(e.target.value)}>
                <option value="all">All CHWs</option>
                <option value="Priya Devi">Priya Devi</option>
                <option value="Ram Kumar">Ram Kumar</option>
                <option value="Meera Joshi">Meera Joshi</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">{t.filterRisk}</label>
              <select className="form-select" value={filterRisk} onChange={(e) => setFilterRisk(e.target.value)}>
                <option value="all">All Risk Levels</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">{t.sortBy}</label>
              <select className="form-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="adherence">Adherence (Low to High)</option>
                <option value="risk">Risk Level</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Patient List */}
          {viewMode === "table" ? (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f8f9fa" }}>
                    <th style={{ padding: "12px", textAlign: "left", border: "1px solid #dee2e6" }}>{t.name}</th>
                    <th style={{ padding: "12px", textAlign: "left", border: "1px solid #dee2e6" }}>{t.condition}</th>
                    <th style={{ padding: "12px", textAlign: "left", border: "1px solid #dee2e6" }}>{t.adherence}</th>
                    <th style={{ padding: "12px", textAlign: "left", border: "1px solid #dee2e6" }}>{t.riskLevel}</th>
                    <th style={{ padding: "12px", textAlign: "left", border: "1px solid #dee2e6" }}>{t.lastVisit}</th>
                    <th style={{ padding: "12px", textAlign: "left", border: "1px solid #dee2e6" }}>{t.chw}</th>
                    <th style={{ padding: "12px", textAlign: "left", border: "1px solid #dee2e6" }}>{t.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map((patient) => (
                    <tr key={patient.id}>
                      <td style={{ padding: "12px", border: "1px solid #dee2e6" }}>
                        <strong>{patient.name}</strong>
                        <br />
                        <small>{patient.age} years</small>
                      </td>
                      <td style={{ padding: "12px", border: "1px solid #dee2e6" }}>{patient.condition}</td>
                      <td style={{ padding: "12px", border: "1px solid #dee2e6" }}>
                        <div
                          style={{
                            backgroundColor: "#e9ecef",
                            borderRadius: "10px",
                            height: "8px",
                            overflow: "hidden",
                            marginBottom: "4px",
                          }}
                        >
                          <div
                            style={{
                              backgroundColor:
                                patient.adherence >= 80 ? "#28a745" : patient.adherence >= 60 ? "#ffc107" : "#dc3545",
                              height: "100%",
                              width: `${patient.adherence}%`,
                              borderRadius: "10px",
                            }}
                          ></div>
                        </div>
                        {patient.adherence}%
                      </td>
                      <td style={{ padding: "12px", border: "1px solid #dee2e6" }}>
                        <span className={`status-indicator ${getRiskClass(patient.riskLevel)}`}>
                          {patient.riskLevel.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: "12px", border: "1px solid #dee2e6" }}>{patient.lastVisit}</td>
                      <td style={{ padding: "12px", border: "1px solid #dee2e6" }}>{patient.chw}</td>
                      <td style={{ padding: "12px", border: "1px solid #dee2e6" }}>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          <button
                            className="btn btn-primary"
                            style={{ padding: "6px 12px", fontSize: "14px" }}
                            onClick={() => setSelectedPatient(patient)}
                          >
                            {t.viewDetails}
                          </button>
                          <button
                            className="btn btn-warning"
                            style={{ padding: "6px 12px", fontSize: "14px" }}
                            onClick={() => alert(`Prioritized ${patient.name}`)}
                          >
                            {t.prioritize}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px" }}>
              {filteredPatients.map((patient) => (
                <div key={patient.id} className="card" style={{ margin: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "12px",
                    }}
                  >
                    <div>
                      <h4>{patient.name}</h4>
                      <p style={{ color: "#666", margin: 0 }}>
                        {patient.age} years • {patient.condition}
                      </p>
                    </div>
                    <span className={`status-indicator ${getRiskClass(patient.riskLevel)}`}>
                      {patient.riskLevel.toUpperCase()}
                    </span>
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span>Adherence</span>
                      <span>{patient.adherence}%</span>
                    </div>
                    <div
                      style={{
                        backgroundColor: "#e9ecef",
                        borderRadius: "10px",
                        height: "8px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          backgroundColor:
                            patient.adherence >= 80 ? "#28a745" : patient.adherence >= 60 ? "#ffc107" : "#dc3545",
                          height: "100%",
                          width: `${patient.adherence}%`,
                          borderRadius: "10px",
                        }}
                      ></div>
                    </div>
                  </div>

                  <div style={{ fontSize: "14px", color: "#666", marginBottom: "16px" }}>
                    <p>CHW: {patient.chw}</p>
                    <p>Region: {patient.region}</p>
                    <p>Last Visit: {patient.lastVisit}</p>
                  </div>

                  <div style={{ display: "flex", gap: "8px" }}>
                    <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setSelectedPatient(patient)}>
                      {t.viewDetails}
                    </button>
                    <button
                      className="btn btn-warning"
                      style={{ flex: 1 }}
                      onClick={() => alert(`Prioritized ${patient.name}`)}
                    >
                      {t.prioritize}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Patient Details Modal */}
        {selectedPatient && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
              padding: "20px",
            }}
            onClick={() => setSelectedPatient(null)}
          >
            <div
              className="card"
              style={{ maxWidth: "500px", width: "100%", maxHeight: "80vh", overflowY: "auto" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="card-header">
                <h2>{t.patientDetails}</h2>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <h3>{selectedPatient.name}</h3>
                <p>
                  <strong>Age:</strong> {selectedPatient.age} years
                </p>
                <p>
                  <strong>{t.condition}:</strong> {selectedPatient.condition}
                </p>
                <p>
                  <strong>{t.contactNumber}:</strong> {selectedPatient.contactNumber}
                </p>
                <p>
                  <strong>{t.adherence}:</strong> {selectedPatient.adherence}%
                </p>
                <p>
                  <strong>{t.riskLevel}:</strong>{" "}
                  <span className={`status-indicator ${getRiskClass(selectedPatient.riskLevel)}`}>
                    {selectedPatient.riskLevel.toUpperCase()}
                  </span>
                </p>
                <p>
                  <strong>{t.chw}:</strong> {selectedPatient.chw}
                </p>
                <p>
                  <strong>{t.region}:</strong> {selectedPatient.region}
                </p>
                <p>
                  <strong>{t.lastVisit}:</strong> {selectedPatient.lastVisit}
                </p>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <h4>{t.notes}</h4>
                <p style={{ backgroundColor: "#f8f9fa", padding: "12px", borderRadius: "6px" }}>
                  {selectedPatient.notes}
                </p>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <h4>{t.addNewNote}</h4>
                <textarea
                  className="form-input"
                  rows={3}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Enter new note..."
                />
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button className="btn btn-primary" onClick={handleAddNote}>
                  {t.saveNote}
                </button>
                <button className="btn btn-secondary" onClick={() => setSelectedPatient(null)}>
                  {t.cancel}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
