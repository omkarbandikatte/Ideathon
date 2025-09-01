// Authentication utilities for SehatLink admin system

export interface AdminUser {
  username: string
  name: string
  role: "doctor" | "chw"
  loginTime: string
}

export const getAdminUser = (): AdminUser | null => {
  if (typeof window === "undefined") return null

  try {
    const userData = localStorage.getItem("sehatlink_admin")
    return userData ? JSON.parse(userData) : null
  } catch {
    return null
  }
}

export const isAuthenticated = (): boolean => {
  return getAdminUser() !== null
}

export const logout = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("sehatlink_admin")
    window.location.href = "/admin/login"
  }
}

export const requireAuth = (callback: () => void): void => {
  if (!isAuthenticated()) {
    window.location.href = "/admin/login"
    return
  }
  callback()
}

// Check if user has specific role
export const hasRole = (requiredRole: "doctor" | "chw"): boolean => {
  const user = getAdminUser()
  return user?.role === requiredRole
}

// Get user display name
export const getUserDisplayName = (): string => {
  const user = getAdminUser()
  return user?.name || "Unknown User"
}

// Check session validity (24 hours)
export const isSessionValid = (): boolean => {
  const user = getAdminUser()
  if (!user) return false

  const loginTime = new Date(user.loginTime)
  const now = new Date()
  const hoursDiff = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60)

  return hoursDiff < 24
}

// Refresh session
export const refreshSession = (): void => {
  const user = getAdminUser()
  if (user) {
    const updatedUser = {
      ...user,
      loginTime: new Date().toISOString(),
    }
    localStorage.setItem("sehatlink_admin", JSON.stringify(updatedUser))
  }
}
