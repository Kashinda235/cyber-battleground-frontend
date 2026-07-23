import React, { useState } from "react"
import { User } from "lucide-react"

// --- Types & Mock Data ---
interface Player {
  id: string
  name: string
  status: "online" | "idle"
}

interface ActionLog {
  id: string
  message: string
  time: string
}

const MOCK_PLAYERS: Player[] = [
  { id: "1", name: "CyberNinja", status: "online" },
  { id: "2", name: "Ghost_Protocol", status: "online" },
  { id: "3", name: "NeonRider", status: "idle" },
  { id: "4", name: "ZeroCool", status: "online" },
  { id: "5", name: "AcidBurn", status: "online" },
  { id: "6", name: "CrashOverride", status: "idle" }, // Added to ensure scrolling
]

const MOCK_LOGS: ActionLog[] = [
  { id: "l1", message: "Request from 101", time: "10:42:01" },
  { id: "l2", message: "257 requests from 10.15.0.23", time: "10:45:12" },
  {
    id: "l3",
    message: "Authentication failed for user admin",
    time: "10:48:33",
  },
  {
    id: "l4",
    message: "Connection established on port 8080",
    time: "10:51:05",
  },
  { id: "l5", message: "Firewall block rule triggered", time: "10:52:12" }, // Added to ensure scrolling
]

// --- Component ---
const ActivityLog: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"users" | "logs">("users")

  const onlineCount = MOCK_PLAYERS.filter((p) => p.status === "online").length

  return (
    <div className="mx-auto h-full flex w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-gray-700 bg-gray-900 font-sans text-gray-200 shadow-2xl">
      {/* Dynamic Header */}
      <div className="bg-gray-800/40 px-5 py-4">
        <h2 className="text-lg font-bold tracking-wide text-gray-100">
          {activeTab === "users" ? "Players Active" : "System Action Logs"}
        </h2>
      </div>

      {/* Toggle Controls */}
      <div className="flex border-y border-gray-800 bg-gray-950 p-1">
        <button
          onClick={() => setActiveTab("users")}
          className={`flex-1 rounded-md py-1.5 text-sm font-semibold transition-all duration-200 ${
            activeTab === "users"
              ? "bg-gray-800 text-white shadow"
              : "text-gray-500 hover:bg-gray-800/50 hover:text-gray-300"
          }`}
        >
          Active Users
        </button>
        <button
          onClick={() => setActiveTab("logs")}
          className={`flex-1 rounded-md py-1.5 text-sm font-semibold transition-all duration-200 ${
            activeTab === "logs"
              ? "bg-gray-800 text-white shadow"
              : "text-gray-500 hover:bg-gray-800/50 hover:text-gray-300"
          }`}
        >
          Action Logs
        </button>
      </div>

      {/* Scrollable List Content */}
      <div className="flex-1 [scrollbar-width:thin] [scrollbar-color:theme(colors.gray.700)_transparent] space-y-2 overflow-y-auto p-3 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-700 hover:[&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-track]:bg-transparent">
        {activeTab === "users"
          ? MOCK_PLAYERS.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between rounded-lg border border-transparent bg-gray-800/40 p-3 transition-colors hover:border-gray-700 hover:bg-gray-800"
              >
                <div className="flex items-center space-x-3">
                  <User
                    size={18}
                    strokeWidth={2.5}
                    className={
                      player.status === "online"
                        ? "text-emerald-500"
                        : "text-amber-500"
                    }
                  />
                  <span className="font-medium text-gray-200">
                    {player.name}
                  </span>
                </div>
                <span className="text-xs tracking-wider text-gray-500 uppercase">
                  {player.status}
                </span>
              </div>
            ))
          : MOCK_LOGS.map((log) => (
              <div
                key={log.id}
                className="flex flex-col rounded-lg border border-transparent bg-gray-800/40 p-3 font-mono text-sm transition-colors hover:border-gray-700 hover:bg-gray-800"
              >
                <span className="mb-1 text-emerald-400">[{log.time}]</span>
                <span className="text-gray-300">{log.message}</span>
              </div>
            ))}
      </div>

      {/* Dynamic Footer */}
      <div className="flex items-center justify-between border-t border-gray-800 bg-gray-950 px-5 py-3 text-xs text-gray-400">
        {activeTab === "users" ? (
          <>
            <span>Total Registered: {MOCK_PLAYERS.length}</span>
            <span className="flex items-center space-x-1">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></span>
              <span className="font-medium text-emerald-400">
                {onlineCount} users online
              </span>
            </span>
          </>
        ) : (
          <>
            <span>Log retention: 24h</span>
            <span>Total entries: {MOCK_LOGS.length}</span>
          </>
        )}
      </div>
    </div>
  )
}

export default ActivityLog
