import { initializeApp, getApps, getApp } from 'firebase/app'
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
  Messaging,
} from 'firebase/messaging'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase (singleton)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

// Messaging instance (only in browser)
let messagingInstance: Messaging | null = null

/**
 * Get Firebase Messaging instance
 * Returns null if not supported (SSR, unsupported browser)
 */
export async function getMessagingInstance(): Promise<Messaging | null> {
  if (typeof window === 'undefined') return null

  const supported = await isSupported()
  if (!supported) {
    console.warn('Firebase Messaging not supported in this browser')
    return null
  }

  if (!messagingInstance) {
    messagingInstance = getMessaging(app)
  }

  return messagingInstance
}

/**
 * Get FCM token for push notifications
 */
export async function getFCMToken(): Promise<string | null> {
  try {
    const messaging = await getMessagingInstance()
    if (!messaging) return null

    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
    if (!vapidKey) {
      console.error('VAPID key not configured')
      return null
    }

    // Register service worker
    const registration = await navigator.serviceWorker.register(
      '/firebase-messaging-sw.js'
    )

    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: registration,
    })

    return token
  } catch (error) {
    // Secure logging - avoid exposing stack traces in production
    console.error('Failed to get FCM token details:', {
      code: (error as any).code,
      message: (error as any).message,
    })
    return null
  }
}

/**
 * Listen for foreground messages
 */
export function onForegroundMessage(
  callback: (payload: any) => void
): () => void {
  let unsubscribe: () => void = () => {}

  getMessagingInstance().then((messaging) => {
    if (messaging) {
      unsubscribe = onMessage(messaging, callback)
    }
  })

  return () => unsubscribe()
}

export { app }
