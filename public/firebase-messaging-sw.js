// Firebase Messaging Service Worker
// This file is auto-generated at build time by scripts/generate-firebase-sw.js
// DO NOT EDIT MANUALLY — values are injected from environment variables.
//
// To regenerate, run: node scripts/generate-firebase-sw.js
// Or it runs automatically via `npm run prebuild` before `next build`.
//
// If you see placeholder values below, the build script has not been run yet.
// Set your NEXT_PUBLIC_FIREBASE_* variables in .env and run:
//   node scripts/generate-firebase-sw.js

importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js")
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js")

firebase.initializeApp({
    apiKey: "PLACEHOLDER_RUN_GENERATE_SCRIPT",
    authDomain: "PLACEHOLDER",
    projectId: "PLACEHOLDER",
    storageBucket: "PLACEHOLDER",
    messagingSenderId: "PLACEHOLDER",
    appId: "PLACEHOLDER",
})

const messaging = firebase.messaging()

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log("[SW] Background message received:", payload)

    const title = payload.notification?.title || "New Notification"
    const body = payload.notification?.body || ""
    const link = payload.data?.link || "/dashboard"

    const options = {
        body,
        icon: "/icon-192x192.png",
        badge: "/icon-72x72.png",
        tag: "notification-" + Date.now(),
        data: {
            link,
            ...payload.data,
        },
        actions: [
            { action: "open", title: "Open" },
            { action: "dismiss", title: "Dismiss" },
        ],
    }

    self.registration.showNotification(title, options)
})

// Handle notification click
self.addEventListener("notificationclick", (event) => {
    console.log("[SW] Notification clicked:", event)

    event.notification.close()

    if (event.action === "dismiss") {
        return
    }

    const link = event.notification.data?.link || "/dashboard"

    event.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
            // Focus existing window if open
            for (const client of clientList) {
                if (client.url.includes(self.location.origin) && "focus" in client) {
                    client.navigate(link)
                    return client.focus()
                }
            }
            // Open new window
            if (clients.openWindow) {
                return clients.openWindow(link)
            }
        })
    )
})
