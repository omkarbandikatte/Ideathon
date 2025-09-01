"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getAdminUser, logout, isSessionValid, refreshSession, type AdminUser } from "@/lib/auth"

interface AdminLayoutProps {
  children: React.ReactNode
  title: string
  requireRole?: "doctor" | "chw"
}

export default function AdminLayout({ children, title, requireRole }: AdminLayoutProps) {
  const router = useRouter()
  const [user, setUser] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      const currentUser = getAdminUser()

      if (!currentUser || !isSessionValid()) {
        logout()
        return
      }

      if (requireRole && currentUser.role !== requireRole) {
        alert("Access denied. Insufficient permissions.")
        logout()
        return
      }

      // Refresh session
      refreshSession()
      setUser(currentUser)
      setIsLoading(false)
    }

    checkAuth()
  }, [requireRole])

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      logout()
    }
  }

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <div className="loading" style={{ width: "40px", height: "40px" }}></div>
        <p>Loading admin panel...</p>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <div>
      {/* Admin Header */}
      <header className="header">
        <div className="container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div>
              <h1>{title}</h1>
              <p style={{ margin: 0, opacity: 0.9 }}>
                Welcome, {user.name} ({user.role.toUpperCase()})
              </p>
            </div>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <span className="status-indicator status-online">
                {user.role === "doctor" ? "👨‍⚕️" : "👩‍⚕️"} {user.role.toUpperCase()}
              </span>
              <button className="btn btn-danger" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Navigation */}
      <nav className="nav">
        <div className="container">
          <div className="nav-links">
            <a href="/admin/dashboard" className="nav-link">
              📊 Dashboard
            </a>
            <a href="/admin/patients" className="nav-link">
              👥 Patients
            </a>
            <a href="/admin/alerts" className="nav-link">
              🚨 Alerts
            </a>
            {user.role === "doctor" && (
              <a href="/admin/analytics" className="nav-link">
                📈 Analytics
              </a>
            )}
            <a href="/admin/settings" className="nav-link">
              ⚙️ Settings
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: "#f8f9fa",
          padding: "20px 0",
          marginTop: "40px",
          borderTop: "2px solid #dee2e6",
        }}
      >
        <div className="container" style={{ textAlign: "center" }}>
          <p style={{ margin: 0, color: "#666" }}>
            SehatLink Admin Panel - Session expires in{" "}
            {24 - Math.floor((new Date().getTime() - new Date(user.loginTime).getTime()) / (1000 * 60 * 60))} hours
          </p>
        </div>
      </footer>
    </div>
  )
}
