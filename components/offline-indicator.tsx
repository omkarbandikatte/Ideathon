"use client"

import { useState, useEffect } from "react"
import { syncOfflineData } from "@/lib/offline-storage"

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [pendingSync, setPendingSync] = useState(false)

  useEffect(() => {
    // Set initial state
    setIsOnline(navigator.onLine)

    const handleOnline = async () => {
      setIsOnline(true)
      if (pendingSync) {
        setIsSyncing(true)
        try {
          await syncOfflineData()
          setPendingSync(false)
        } catch (error) {
          console.error("Sync failed:", error)
        } finally {
          setIsSyncing(false)
        }
      }
    }

    const handleOffline = () => {
      setIsOnline(false)
      setPendingSync(true)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [pendingSync])

  if (isOnline && !isSyncing && !pendingSync) {
    return null // Don't show indicator when everything is normal
  }

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        zIndex: 1000,
        padding: "8px 16px",
        borderRadius: "20px",
        fontSize: "14px",
        fontWeight: "bold",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
      }}
      className={
        isSyncing
          ? "status-indicator status-pending"
          : isOnline
            ? "status-indicator status-online"
            : "status-indicator status-offline"
      }
    >
      {isSyncing ? (
        <>
          <div className="loading" style={{ width: "16px", height: "16px" }}></div>
          Syncing...
        </>
      ) : isOnline ? (
        <>
          🟢 Online
          {pendingSync && " - Sync pending"}
        </>
      ) : (
        <>🔴 Offline</>
      )}
    </div>
  )
}
