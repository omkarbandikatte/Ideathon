// SehatLink Service Worker for PWA functionality
// Optimized for rural healthcare with offline-first approach

const CACHE_NAME = "sehatlink-v1.0.1"
const OFFLINE_URL = "/offline"

// Essential files to cache for offline functionality
const ESSENTIAL_CACHE = [
  "/",
  "/offline",
  "/reminders",
  "/symptoms",
  "/health-tips",
  "/emergency",
  "/alerts",
  "/admin/login",
  "/sehatlink.css",
  "/manifest.json",
  "/icon-192x192.png",
  "/icon-512x512.png",
]

// Install event - cache essential resources
self.addEventListener("install", (event) => {
  console.log("[SW] Installing service worker...")

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("[SW] Caching essential resources")
        return cache.addAll(ESSENTIAL_CACHE)
      })
      .then(() => {
        console.log("[SW] Service worker installed successfully")
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error("[SW] Installation failed:", error)
      }),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating service worker...")

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("[SW] Deleting old cache:", cacheName)
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => {
        console.log("[SW] Service worker activated")
        return self.clients.claim()
      }),
  )
})

// Fetch event - implement offline-first strategy
self.addEventListener("fetch", (event) => {
  const { request } = event

  // Handle navigation requests (pages)
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // If online, cache the response and return it
          if (response.ok) {
            const responseClone = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone))
          }
          return response
        })
        .catch(() => {
          // If offline, try to serve from cache
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse
            }
            // If not in cache, serve offline page or basic HTML
            return caches.match(OFFLINE_URL).then((offlinePage) => {
              if (offlinePage) {
                return offlinePage
              }
              // Fallback HTML response
              return new Response(
                `<!DOCTYPE html>
                <html>
                <head>
                  <title>SehatLink - Offline</title>
                  <meta name="viewport" content="width=device-width, initial-scale=1">
                  <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                    .offline-message { max-width: 400px; margin: 0 auto; }
                  </style>
                </head>
                <body>
                  <div class="offline-message">
                    <h1>SehatLink</h1>
                    <h2>You're Offline</h2>
                    <p>Please check your internet connection and try again.</p>
                    <button onclick="window.location.reload()">Retry</button>
                  </div>
                </body>
                </html>`,
                {
                  status: 200,
                  headers: { "Content-Type": "text/html" },
                },
              )
            })
          })
        }),
    )
    return
  }

  // Default: try network first, then cache
  event.respondWith(fetch(request).catch(() => caches.match(request)))
})

// Push notification handler
self.addEventListener("push", (event) => {
  console.log("[SW] Push notification received")

  const options = {
    body: "Time for your medication reminder",
    icon: "/icon-192x192.png",
    badge: "/icon-192x192.png",
    vibrate: [200, 100, 200],
    data: { url: "/reminders" },
  }

  if (event.data) {
    try {
      const data = event.data.json()
      options.body = data.message || options.body
      options.data = { ...options.data, ...data }
    } catch (e) {
      console.error("[SW] Error parsing push data:", e)
    }
  }

  event.waitUntil(self.registration.showNotification("SehatLink Health Reminder", options))
})

// Notification click handler
self.addEventListener("notificationclick", (event) => {
  console.log("[SW] Notification clicked:", event.action)

  event.notification.close()

  event.waitUntil(clients.openWindow(event.notification.data?.url || "/reminders"))
})
