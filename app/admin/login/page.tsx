"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

interface LoginCredentials {
  username: string
  password: string
  role: "doctor" | "chw"
}

export default function AdminLoginPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: "",
    password: "",
    role: "doctor",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetPhone, setResetPhone] = useState("")

  // Predefined credentials for static website
  const predefinedUsers = [
    { username: "dr.sharma", password: "doctor123", role: "doctor", name: "Dr. Rajesh Sharma" },
    { username: "chw.priya", password: "chw123", role: "chw", name: "Priya Devi (CHW)" },
    { username: "dr.patel", password: "doctor456", role: "doctor", name: "Dr. Meera Patel" },
    { username: "chw.ram", password: "chw456", role: "chw", name: "Ram Kumar (CHW)" },
  ]

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Check predefined credentials
    const user = predefinedUsers.find(
      (u) => u.username === credentials.username && u.password === credentials.password && u.role === credentials.role,
    )

    if (user) {
      // Store user session in localStorage (for static website)
      localStorage.setItem(
        "sehatlink_admin",
        JSON.stringify({
          username: user.username,
          name: user.name,
          role: user.role,
          loginTime: new Date().toISOString(),
        }),
      )

      // Redirect to dashboard
      router.push("/admin/dashboard")
    } else {
      setError(t("invalidCredentials"))
    }

    setIsLoading(false)
  }

  const handleForgotPassword = async () => {
    if (!resetPhone) return

    // Simulate SMS sending
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)

    alert(`Password reset SMS sent to ${resetPhone}`)
    setShowForgotPassword(false)
    setResetPhone("")
  }

  const fillDemoCredentials = (userType: "doctor" | "chw") => {
    const demoUser = predefinedUsers.find((u) => u.role === userType)
    if (demoUser) {
      setCredentials({
        username: demoUser.username,
        password: demoUser.password,
        role: demoUser.role,
      })
    }
  }

  return (
    <div>
      {/* Header */}
      <header className="header">
        <div className="container">
          <h1>{t("title_admin")}</h1>
          <p>{t("subtitle_admin")}</p>
          <Link href="/" className="btn btn-secondary" style={{ marginTop: "12px" }}>
            {t("backHome")}
          </Link>
        </div>
      </header>

      <main className="container" style={{ padding: "32px 16px", maxWidth: "500px" }}>
        {!showForgotPassword ? (
          <>
            {/* Demo Credentials Info */}
            <div className="card" style={{ marginBottom: "24px", backgroundColor: "#e7f3ff" }}>
              <div className="card-header">
                <h3>{t("demoCredentials")}</h3>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <button className="btn btn-primary" onClick={() => fillDemoCredentials("doctor")}>
                  {t("doctor")}
                  <br />
                  <small>dr.sharma / doctor123</small>
                </button>
                <button className="btn btn-secondary" onClick={() => fillDemoCredentials("chw")}>
                  {t("chw")}
                  <br />
                  <small>chw.priya / chw123</small>
                </button>
              </div>
            </div>

            {/* Login Form */}
            <div className="card">
              <form onSubmit={handleLogin}>
                {/* Role Selection */}
                <div className="form-group">
                  <label className="form-label">{t("role")}</label>
                  <select
                    className="form-select"
                    value={credentials.role}
                    onChange={(e) => setCredentials((prev) => ({ ...prev, role: e.target.value as "doctor" | "chw" }))}
                    required
                  >
                    <option value="doctor">{t("doctor")}</option>
                    <option value="chw">{t("chw")}</option>
                  </select>
                </div>

                {/* Username */}
                <div className="form-group">
                  <label className="form-label">{t("username")}</label>
                  <input
                    type="text"
                    className="form-input"
                    value={credentials.username}
                    onChange={(e) => setCredentials((prev) => ({ ...prev, username: e.target.value }))}
                    placeholder="Enter your username"
                    required
                  />
                </div>

                {/* Password */}
                <div className="form-group">
                  <label className="form-label">{t("password")}</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-input"
                      value={credentials.password}
                      onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
                      placeholder="Enter your password"
                      required
                      style={{ paddingRight: "120px" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: "absolute",
                        right: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        color: "#666",
                        fontSize: "14px",
                        cursor: "pointer",
                      }}
                    >
                      {showPassword ? t("hidePassword") : t("showPassword")}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="alert alert-danger" style={{ marginBottom: "20px" }}>
                    {error}
                  </div>
                )}

                {/* Login Button */}
                <button type="submit" className="btn btn-primary btn-large" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span className="loading" style={{ marginRight: "12px" }}></span>
                      {t("loggingIn")}
                    </>
                  ) : (
                    t("login")
                  )}
                </button>

                {/* Forgot Password Link */}
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#2c5aa0",
                      textDecoration: "underline",
                      cursor: "pointer",
                      fontSize: "16px",
                    }}
                  >
                    {t("forgotPassword")}
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : (
          /* Forgot Password Form */
          <div className="card">
            <div className="card-header">
              <h2>{t("resetPassword")}</h2>
            </div>

            <div className="form-group">
              <label className="form-label">{t("phoneNumber")}</label>
              <input
                type="tel"
                className="form-input"
                value={resetPhone}
                onChange={(e) => setResetPhone(e.target.value)}
                placeholder="+91-9876543210"
                required
              />
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button className="btn btn-primary" onClick={handleForgotPassword} disabled={isLoading || !resetPhone}>
                {isLoading ? (
                  <>
                    <span className="loading" style={{ marginRight: "8px" }}></span>
                    Sending...
                  </>
                ) : (
                  t("sendSMS")
                )}
              </button>
              <button className="btn btn-secondary" onClick={() => setShowForgotPassword(false)}>
                {t("backToLogin")}
              </button>
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="card" style={{ marginTop: "24px", backgroundColor: "#f8f9fa" }}>
          <h4>Access Information</h4>
          <ul style={{ paddingLeft: "20px", marginBottom: "0" }}>
            <li>Doctors can access patient records and analytics</li>
            <li>CHWs can update patient status and add notes</li>
            <li>All sessions are secure and logged</li>
            <li>Contact IT support for account issues</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
