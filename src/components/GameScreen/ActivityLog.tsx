import { useState } from "react"
import { User } from "lucide-react"
import type {MoveLog, Player} from "../../utils/types.ts";

interface LogProps {
    players: Player[],
    moveLogs: MoveLog[],
    setTarget:  (targetId: Player) => void
}
// --- Component ---
const ActivityLog = ( {players, moveLogs, setTarget}: LogProps) => {
  const [activeTab, setActiveTab] = useState<"users" | "logs">("users")

  const onlineCount = players.filter((p) => p.status === "online").length

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
          ? players.map((player) => (
              <div
                key={player.id}
                onClick={() => setTarget(player)}
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
                    {player.username}
                  </span>
                </div>
                <span className="text-xs tracking-wider text-gray-500 uppercase">
                  {player.status}
                </span>
              </div>
            ))
          : moveLogs.map((log) => (
              <div
                key={log.id}
                className="flex flex-col rounded-lg border border-transparent bg-gray-800/40 p-3 font-mono text-sm transition-colors hover:border-gray-700 hover:bg-gray-800"
              >
                <span className="mb-1 text-emerald-400">[{log.timestamp}]</span>
                <span className="text-gray-300">{log.action}</span>
              </div>
            ))}
      </div>

      {/* Dynamic Footer */}
      <div className="flex items-center justify-between border-t border-gray-800 bg-gray-950 px-5 py-3 text-xs text-gray-400">
        {activeTab === "users" ? (
          <>
            <span>Total Registered: {players.length}</span>
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
            <span>Total entries: {moveLogs.length}</span>
          </>
        )}
      </div>
    </div>
  )
}

export default ActivityLog
