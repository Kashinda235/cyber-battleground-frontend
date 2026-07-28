import { useState, useEffect, useRef } from "react"
import ChatBlock from './ChatBlock.tsx';
import ActionMode from './ActionMode.tsx';
import {
   MessageSquare, Zap, Bell, AlertTriangle, Info, ShieldCogCorner,
} from "lucide-react"
import type {Ability, ActionRequest, ActionResult, ChatLog, Player} from "../utils/types.ts";
// --- Types ---
type Mode = "chat" | "actions" | "defence" | "alerts"

interface FeedProps {
  players: Player[],
  currentPlayer: Player,
  target: Player,
  chats: ChatLog[],
  sendChat: (message: string) => Promise<ChatLog>,
  abilities: Ability[],
  performAction: (data: ActionRequest) => Promise<ActionResult>
}

interface Alert {
  id: string
  type: "danger" | "warning" | "info"
  message: string
  time: string
}

const SYSTEM_ALERTS: Alert[] = [
  {
    id: "1",
    type: "danger",
    message: "Void Dragon Sovereign is casting [Cataclysm]!",
    time: "Just now",
  },
  {
    id: "2",
    type: "warning",
    message: "Mana reserves are dropping below 20%.",
    time: "2 mins ago",
  },
  {
    id: "3",
    type: "info",
    message: "Player [Ironclad_Tank] acquired Taunt aggro.",
    time: "5 mins ago",
  },
  {
    id: "4",
    type: "info",
    message: "Raid instance will reset in 45 minutes.",
    time: "10 mins ago",
  },
]

export default function ActivityFeed( { players, currentPlayer, target, chats, sendChat, abilities, performAction }: FeedProps ) {
  const [mode, setMode] = useState<Mode>("chat")
  const activePlayers:number = players.length;

  return (
    <>
      <style>{`
        @keyframes cooldown-spin {
          from { stroke-dashoffset: 100; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>

      <div className="relative mx-auto h-full flex w-full max-w-3xl overflow-hidden rounded-xl border border-gray-800 bg-gray-950 font-sans text-gray-100 shadow-2xl">
        {/* Side Navigation */}
        <div className="z-10 flex w-16 shrink-0 flex-col items-center gap-4 border-r border-gray-800 bg-gray-900 py-6">
          <button
            onClick={() => setMode("chat")}
            className={`rounded-xl p-3 transition-all duration-200 ${
              mode === "chat"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/50"
                : "text-gray-500 hover:bg-gray-800 hover:text-gray-300"
            }`}
            title="Chat Room"
          >
            <MessageSquare size={22} />
          </button>

          <button
            onClick={() => setMode("actions")}
            className={`rounded-xl p-3 transition-all duration-200 ${
              mode === "actions"
                ? "bg-rose-600 text-white shadow-lg shadow-rose-900/50"
                : "text-gray-500 hover:bg-gray-800 hover:text-gray-300"
            }`}
            title="Actions"
          >
            <Zap size={22} />
          </button>

          <button
              onClick={() => setMode("defence")}
              className={`rounded-xl p-3 transition-all duration-200 ${
                  mode === "defence"
                      ? "bg-blue-400 text-white shadow-lg shadow-rose-900/50"
                      : "text-gray-500 hover:bg-gray-800 hover:text-gray-300"
              }`}
              title="Defence"
          >
            <ShieldCogCorner size={22} />
          </button>

          {/* New Alerts Switch */}
          <button
            onClick={() => setMode("alerts")}
            className={`relative rounded-xl p-3 transition-all duration-200 ${
              mode === "alerts"
                ? "bg-amber-500 text-gray-950 shadow-lg shadow-amber-900/50"
                : "text-gray-500 hover:bg-gray-800 hover:text-gray-300"
            }`}
            title="System Alerts"
          >
            <Bell size={22} />
            {/* Unread indicator dot */}
            {mode !== "alerts" && (
              <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full border border-gray-900 bg-amber-500"></span>
            )}
          </button>
        </div>

        {/* Main Content Area */}
        <div className="relative flex flex-1 flex-col overflow-hidden bg-gray-950">
          {/* --- CHAT MODE --- */}
          {mode === "chat" && <ChatBlock
              chats={chats}
              activePlayers={activePlayers}
              currentPlayer={currentPlayer}
              sendChat={sendChat}
          />}

          {/* --- ACTIONS MODE --- */}
          {mode === "actions" && <ActionMode target={target} performAction={performAction} mode={'attack'}/>}

          {/* --- DEFENCE MODE --- */}
          {mode === "defence" && <ActionMode target={target} performAction={performAction} mode={'defend'}/>}

          {/* --- ALERTS MODE --- */}
          {mode === "alerts" && (
            <div className="flex h-full animate-in flex-col duration-300 fade-in">
              {/* Alerts Top */}
              <header className="flex h-16 shrink-0 items-center border-b border-gray-800 bg-amber-950/20 px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-500/30 bg-amber-900/30 text-amber-500">
                    <Bell size={20} />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-100">
                      System Alerts and Notifications
                    </h2>
                    <p className="text-xs text-gray-500">
                      {SYSTEM_ALERTS.length} Recent entries
                    </p>
                  </div>
                </div>
              </header>

              {/* Alerts List */}
              <div className="custom-scrollbar flex-1 space-y-3 overflow-y-auto p-6">
                {SYSTEM_ALERTS.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-start gap-4 rounded-xl border border-gray-800 bg-gray-900 p-4"
                  >
                    <div className="mt-0.5 shrink-0">
                      {alert.type === "danger" && (
                        <AlertTriangle size={20} className="text-red-500" />
                      )}
                      {alert.type === "warning" && (
                        <AlertTriangle size={20} className="text-amber-500" />
                      )}
                      {alert.type === "info" && (
                        <Info size={20} className="text-blue-400" />
                      )}
                    </div>

                    <div className="flex-1">
                      <p
                        className={`text-sm font-medium ${
                          alert.type === "danger"
                            ? "text-red-200"
                            : alert.type === "warning"
                              ? "text-amber-200"
                              : "text-blue-100"
                        }`}
                      >
                        {alert.message}
                      </p>
                      <span className="mt-1 block font-mono text-[11px] text-gray-500">
                        {alert.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
