"use client"

import Link from "next/link"

export default function OfflinePage() {
  return (
    <div>
      {/* Header */}
      <header className="header">
        <div className="container">
          <h1>You're Offline</h1>
          <p>SehatLink is working in offline mode</p>
        </div>
      </header>

      <main className="container" style={{ padding: "32px 16px", textAlign: "center" }}>
        <div className="card">
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>📱</div>
          <h2>No Internet Connection</h2>
          <p style={{ fontSize: "18px", marginBottom: "24px" }}>
            Don't worry! You can still access your health information and use many features of SehatLink while offline.
          </p>

          <div className="alert alert-info" style={{ marginBottom: "24px" }}>
            <strong>Available Offline:</strong>
            <ul style={{ textAlign: "left", marginTop: "12px" }}>
              <li>View saved health reminders</li>
              <li>Access health tips and nutrition information</li>
              <li>Use the symptom checker with saved data</li>
              <li>View emergency contacts</li>
              <li>Read community alerts</li>
            </ul>
          </div>

          <div className="button-grid">
            <Link href="/reminders" className="btn btn-primary btn-large">
              View Reminders
            </Link>
            <Link href="/symptoms" className="btn btn-secondary btn-large">
              Symptom Checker
            </Link>
            <Link href="/health-tips" className="btn btn-warning btn-large">
              Health Tips
            </Link>
            <Link href="/emergency" className="btn btn-danger btn-large">
              Emergency Contacts
            </Link>
          </div>

          <div style={{ marginTop: "32px", padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
            <h3>When You're Back Online</h3>
            <p>
              Your data will automatically sync when your internet connection is restored. Any information you add while
              offline will be saved and uploaded automatically.
            </p>
            <div className="status-indicator status-offline" style={{ marginTop: "12px" }}>
              Offline Mode Active
            </div>
          </div>

          <button className="btn btn-primary" onClick={() => window.location.reload()} style={{ marginTop: "24px" }}>
            Try Again
          </button>
        </div>
      </main>
    </div>
  )
}
