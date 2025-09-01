// Admin Login JavaScript

let isLoading = false
let showPassword = false

// Predefined users for static website
const predefinedUsers = [
  { username: "dr.sharma", password: "doctor123", role: "doctor", name: "Dr. Rajesh Sharma" },
  { username: "chw.priya", password: "chw123", role: "chw", name: "Priya Devi (CHW)" },
  { username: "dr.patel", password: "doctor456", role: "doctor", name: "Dr. Meera Patel" },
  { username: "chw.ram", password: "chw456", role: "chw", name: "Ram Kumar (CHW)" },
]

const adminTranslations = {
  en: {
    title: "Admin Login",
    subtitle: "Healthcare Professionals Access",
    username: "Username",
    password: "Password",
    role: "Role",
    doctor: "Doctor",
    chw: "Community Health Worker",
    login: "Login",
    forgotPassword: "Forgot Password?",
    showPassword: "Show Password",
    hidePassword: "Hide Password",
    loggingIn: "Logging in...",
    backHome: "Back to Home",
    resetPassword: "Reset Password",
    phoneNumber: "Phone Number",
    sendSMS: "Send SMS Reset",
    backToLogin: "Back to Login",
    invalidCredentials: "Invalid username or password",
    selectRole: "Please select your role",
    demoCredentials: "Demo Credentials",
    loginSuccess: "Login successful! Redirecting...",
    resetSent: "Password reset SMS sent!",
  },
  hi: {
    title: "एडमिन लॉगिन",
    subtitle: "स्वास्थ्य पेशेवरों की पहुंच",
    username: "उपयोगकर्ता नाम",
    password: "पासवर्ड",
    role: "भूमिका",
    doctor: "डॉक्टर",
    chw: "सामुदायिक स्वास्थ्य कार्यकर्ता",
    login: "लॉगिन",
    forgotPassword: "पासवर्ड भूल गए?",
    showPassword: "पासवर्ड दिखाएं",
    hidePassword: "पासवर्ड छुपाएं",
    loggingIn: "लॉगिन हो रहा है...",
    backHome: "होम पर वापस",
    resetPassword: "पासवर्ड रीसेट करें",
    phoneNumber: "फोन नंबर",
    sendSMS: "SMS रीसेट भेजें",
    backToLogin: "लॉगिन पर वापस",
    invalidCredentials: "गलत उपयोगकर्ता नाम या पासवर्ड",
    selectRole: "कृपया अपनी भूमिका चुनें",
    demoCredentials: "डेमो क्रेडेंशियल",
    loginSuccess: "लॉगिन सफल! रीडायरेक्ट हो रहा है...",
    resetSent: "पासवर्ड रीसेट SMS भेजा गया!",
  },
}

// Initialize admin login page
document.addEventListener("DOMContentLoaded", () => {
  initializeAdminLogin()
  checkExistingSession()
})

function initializeAdminLogin() {
  const currentLang = window.SehatLink?.currentLanguage() || "en"
  updateAdminLanguage(currentLang)
}

function updateAdminLanguage(languageCode) {
  const t = adminTranslations[languageCode] || adminTranslations.en

  // Update all text elements
  document.getElementById("page-title").textContent = t.title
  document.getElementById("page-subtitle").textContent = t.subtitle
  document.getElementById("back-home-btn").textContent = t.backHome
  document.getElementById("demo-title").textContent = t.demoCredentials
  document.getElementById("doctor-text").textContent = t.doctor
  document.getElementById("chw-text").textContent = t.chw
  document.getElementById("role-label").textContent = t.role
  document.getElementById("username-label").textContent = t.username
  document.getElementById("password-label").textContent = t.password
  document.getElementById("login-text").textContent = t.login
  document.getElementById("forgot-password-btn").textContent = t.forgotPassword
  document.getElementById("reset-password-title").textContent = t.resetPassword
  document.getElementById("phone-label").textContent = t.phoneNumber
  document.getElementById("send-sms-btn").textContent = t.sendSMS
  document.getElementById("back-to-login-btn").textContent = t.backToLogin

  // Update select options
  document.getElementById("doctor-option").textContent = t.doctor
  document.getElementById("chw-option").textContent = t.chw

  // Update toggle password button
  const toggleBtn = document.getElementById("toggle-password-btn")
  toggleBtn.textContent = showPassword ? t.hidePassword : t.showPassword
}

function checkExistingSession() {
  const session = localStorage.getItem("sehatlink_admin")
  if (session) {
    try {
      const user = JSON.parse(session)
      const loginTime = new Date(user.loginTime)
      const now = new Date()
      const hoursDiff = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60)

      // Session expires after 24 hours
      if (hoursDiff < 24) {
        window.location.href = "admin-dashboard.html"
        return
      } else {
        localStorage.removeItem("sehatlink_admin")
      }
    } catch (error) {
      localStorage.removeItem("sehatlink_admin")
    }
  }
}

function fillDemoCredentials(userType) {
  const demoUser = predefinedUsers.find((u) => u.role === userType)
  if (demoUser) {
    document.getElementById("role-select").value = demoUser.role
    document.getElementById("username-input").value = demoUser.username
    document.getElementById("password-input").value = demoUser.password
  }
}

function togglePassword() {
  const passwordInput = document.getElementById("password-input")
  const toggleBtn = document.getElementById("toggle-password-btn")
  const currentLang = window.SehatLink?.currentLanguage() || "en"
  const t = adminTranslations[currentLang] || adminTranslations.en

  showPassword = !showPassword
  passwordInput.type = showPassword ? "text" : "password"
  toggleBtn.textContent = showPassword ? t.hidePassword : t.showPassword
}

async function handleLogin(event) {
  event.preventDefault()

  if (isLoading) return

  const role = document.getElementById("role-select").value
  const username = document.getElementById("username-input").value.trim()
  const password = document.getElementById("password-input").value
  const errorDiv = document.getElementById("error-message")
  const loginBtn = document.getElementById("login-btn")
  const currentLang = window.SehatLink?.currentLanguage() || "en"
  const t = adminTranslations[currentLang] || adminTranslations.en

  // Clear previous errors
  errorDiv.style.display = "none"
  errorDiv.textContent = ""

  if (!username || !password) {
    showError("Please fill in all fields")
    return
  }

  isLoading = true
  loginBtn.innerHTML = `<span class="loading" style="margin-right: 12px;"></span>${t.loggingIn}`
  loginBtn.disabled = true

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Check predefined credentials
  const user = predefinedUsers.find((u) => u.username === username && u.password === password && u.role === role)

  if (user) {
    // Store user session in localStorage
    localStorage.setItem(
      "sehatlink_admin",
      JSON.stringify({
        username: user.username,
        name: user.name,
        role: user.role,
        loginTime: new Date().toISOString(),
      }),
    )

    window.SehatLink?.showNotification(t.loginSuccess, "info")

    // Redirect to dashboard after short delay
    setTimeout(() => {
      window.location.href = "admin-dashboard.html"
    }, 1000)
  } else {
    showError(t.invalidCredentials)
  }

  isLoading = false
  loginBtn.innerHTML = t.login
  loginBtn.disabled = false
}

function showError(message) {
  const errorDiv = document.getElementById("error-message")
  errorDiv.textContent = message
  errorDiv.style.display = "block"
}

function showForgotPassword() {
  document.getElementById("login-form").style.display = "none"
  document.getElementById("demo-credentials").style.display = "none"
  document.getElementById("forgot-password-form").style.display = "block"
}

function hideForgotPassword() {
  document.getElementById("login-form").style.display = "block"
  document.getElementById("demo-credentials").style.display = "block"
  document.getElementById("forgot-password-form").style.display = "none"
  document.getElementById("phone-input").value = ""
}

async function handleForgotPassword() {
  const phone = document.getElementById("phone-input").value.trim()
  const sendBtn = document.getElementById("send-sms-btn")
  const currentLang = window.SehatLink?.currentLanguage() || "en"
  const t = adminTranslations[currentLang] || adminTranslations.en

  if (!phone) {
    window.SehatLink?.showNotification("Please enter phone number", "error")
    return
  }

  sendBtn.innerHTML = '<span class="loading" style="margin-right: 8px;"></span>Sending...'
  sendBtn.disabled = true

  // Simulate SMS sending
  await new Promise((resolve) => setTimeout(resolve, 2000))

  window.SehatLink?.showNotification(`${t.resetSent} ${phone}`, "info")

  sendBtn.innerHTML = t.sendSMS
  sendBtn.disabled = false

  // Return to login form
  setTimeout(() => {
    hideForgotPassword()
  }, 1500)
}
