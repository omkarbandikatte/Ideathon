// Offline storage utilities for SehatLink
// Handles IndexedDB operations for offline data persistence

interface OfflineData {
  id?: number
  type: "symptom_check" | "reminder" | "nutrition_log" | "health_tip" | "patient_note"
  data: any
  timestamp: number
  synced: boolean
}

interface HealthReminder {
  id: string
  title: string
  time: string
  status: "pending" | "done" | "missed"
  type: "medication" | "checkup" | "exercise"
  description: string
  offline?: boolean
}

interface NutritionEntry {
  id: string
  food: string
  timestamp: number
  offline?: boolean
}

interface SymptomCheck {
  id: string
  symptoms: string
  result: any
  timestamp: number
  offline?: boolean
}

class OfflineStorage {
  private dbName = "SehatLinkDB"
  private version = 1
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create offline_data store
        if (!db.objectStoreNames.contains("offline_data")) {
          const store = db.createObjectStore("offline_data", {
            keyPath: "id",
            autoIncrement: true,
          })
          store.createIndex("type", "type", { unique: false })
          store.createIndex("synced", "synced", { unique: false })
          store.createIndex("timestamp", "timestamp", { unique: false })
        }

        // Create reminders store
        if (!db.objectStoreNames.contains("reminders")) {
          const reminderStore = db.createObjectStore("reminders", {
            keyPath: "id",
          })
          reminderStore.createIndex("status", "status", { unique: false })
          reminderStore.createIndex("time", "time", { unique: false })
        }

        // Create nutrition store
        if (!db.objectStoreNames.contains("nutrition")) {
          const nutritionStore = db.createObjectStore("nutrition", {
            keyPath: "id",
          })
          nutritionStore.createIndex("timestamp", "timestamp", { unique: false })
        }

        // Create symptom_checks store
        if (!db.objectStoreNames.contains("symptom_checks")) {
          const symptomStore = db.createObjectStore("symptom_checks", {
            keyPath: "id",
          })
          symptomStore.createIndex("timestamp", "timestamp", { unique: false })
        }
      }
    })
  }

  async saveOfflineData(type: OfflineData["type"], data: any): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["offline_data"], "readwrite")
      const store = transaction.objectStore("offline_data")

      const offlineData: OfflineData = {
        type,
        data,
        timestamp: Date.now(),
        synced: false,
      }

      const request = store.add(offlineData)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getOfflineData(type?: OfflineData["type"]): Promise<OfflineData[]> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["offline_data"], "readonly")
      const store = transaction.objectStore("offline_data")

      let request: IDBRequest

      if (type) {
        const index = store.index("type")
        request = index.getAll(type)
      } else {
        request = store.getAll()
      }

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async markAsSynced(id: number): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["offline_data"], "readwrite")
      const store = transaction.objectStore("offline_data")

      const getRequest = store.get(id)
      getRequest.onsuccess = () => {
        const data = getRequest.result
        if (data) {
          data.synced = true
          const updateRequest = store.put(data)
          updateRequest.onsuccess = () => resolve()
          updateRequest.onerror = () => reject(updateRequest.error)
        } else {
          resolve()
        }
      }
      getRequest.onerror = () => reject(getRequest.error)
    })
  }

  async clearSyncedData(): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["offline_data"], "readwrite")
      const store = transaction.objectStore("offline_data")
      const index = store.index("synced")

      const request = index.openCursor(IDBKeyRange.only(true))
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result
        if (cursor) {
          cursor.delete()
          cursor.continue()
        } else {
          resolve()
        }
      }
      request.onerror = () => reject(request.error)
    })
  }

  // Reminder-specific methods
  async saveReminder(reminder: HealthReminder): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["reminders"], "readwrite")
      const store = transaction.objectStore("reminders")

      const request = store.put({ ...reminder, offline: true })
      request.onsuccess = () => {
        // Also save to offline_data for syncing
        this.saveOfflineData("reminder", reminder)
        resolve()
      }
      request.onerror = () => reject(request.error)
    })
  }

  async getReminders(): Promise<HealthReminder[]> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["reminders"], "readonly")
      const store = transaction.objectStore("reminders")

      const request = store.getAll()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  // Nutrition-specific methods
  async saveNutritionEntry(entry: NutritionEntry): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["nutrition"], "readwrite")
      const store = transaction.objectStore("nutrition")

      const request = store.put({ ...entry, offline: true })
      request.onsuccess = () => {
        this.saveOfflineData("nutrition_log", entry)
        resolve()
      }
      request.onerror = () => reject(request.error)
    })
  }

  async getNutritionEntries(): Promise<NutritionEntry[]> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["nutrition"], "readonly")
      const store = transaction.objectStore("nutrition")

      const request = store.getAll()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  // Symptom check methods
  async saveSymptomCheck(check: SymptomCheck): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["symptom_checks"], "readwrite")
      const store = transaction.objectStore("symptom_checks")

      const request = store.put({ ...check, offline: true })
      request.onsuccess = () => {
        this.saveOfflineData("symptom_check", check)
        resolve()
      }
      request.onerror = () => reject(request.error)
    })
  }

  async getSymptomChecks(): Promise<SymptomCheck[]> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["symptom_checks"], "readonly")
      const store = transaction.objectStore("symptom_checks")

      const request = store.getAll()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }
}

// Singleton instance
export const offlineStorage = new OfflineStorage()

// Utility functions
export const isOnline = (): boolean => {
  return navigator.onLine
}

export const waitForOnline = (): Promise<void> => {
  return new Promise((resolve) => {
    if (navigator.onLine) {
      resolve()
    } else {
      const handleOnline = () => {
        window.removeEventListener("online", handleOnline)
        resolve()
      }
      window.addEventListener("online", handleOnline)
    }
  })
}

// Sync data when coming back online
export const syncOfflineData = async (): Promise<void> => {
  if (!navigator.onLine) return

  try {
    const offlineData = await offlineStorage.getOfflineData()
    const unsyncedData = offlineData.filter((item) => !item.synced)

    for (const item of unsyncedData) {
      try {
        // In a real app, this would send to your API
        console.log("Syncing offline data:", item)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mark as synced
        if (item.id) {
          await offlineStorage.markAsSynced(item.id)
        }
      } catch (error) {
        console.error("Failed to sync item:", item, error)
      }
    }

    // Clean up synced data
    await offlineStorage.clearSyncedData()
    console.log("Offline data sync completed")
  } catch (error) {
    console.error("Failed to sync offline data:", error)
  }
}

// Initialize offline storage and set up sync
export const initializeOfflineSupport = async (): Promise<void> => {
  try {
    await offlineStorage.init()
    console.log("Offline storage initialized")

    // Set up online/offline event listeners
    window.addEventListener("online", () => {
      console.log("Back online - syncing data...")
      syncOfflineData()
    })

    window.addEventListener("offline", () => {
      console.log("Gone offline - enabling offline mode")
    })

    // Sync any pending data if online
    if (navigator.onLine) {
      await syncOfflineData()
    }
  } catch (error) {
    console.error("Failed to initialize offline support:", error)
  }
}
