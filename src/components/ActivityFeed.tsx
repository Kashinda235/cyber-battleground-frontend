import React, { useState, useEffect, useRef } from "react"
import {
  Send, MessageSquare, Zap, Shield, Swords,
  Flame, Heart, Bell, AlertTriangle, Info,
} from "lucide-react"
import type {Ability, ActionRequest, ActionResult, ChatLog, Player} from "../utils/types.ts";

// --- Types ---
type Mode = "chat" | "actions" | "alerts"

interface FeedProps {
  players: Player[],
  currentPlayer: Player,
  chats: ChatLog[],
  sendChat: (message: string) => Promise<ChatLog>,
  abilities: Ability[],
  performAction: (data: ActionRequest) => Promise<ActionResult>
}
interface Message {
  id: string
  text: string
  sender: "user" | "other"
  senderName: string
}

interface ActionDef {
  id: string
  title: string
  icon: React.ReactNode
  cooldown: string
  color: string
}

interface Alert {
  id: string
  type: "danger" | "warning" | "info"
  message: string
  time: string
}

// --- Mock Data ---
const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    text: "Are you ready for the raid?",
    sender: "other",
    senderName: "Alex_Shadow",
  },
  {
    id: "2",
    text: "Almost, let me buff up first.",
    sender: "user",
    senderName: "You",
  },
  {
    id: "3",
    text: "We need to pull in 30 seconds.",
    sender: "other",
    senderName: "Ironclad_Tank",
  },
]

const ACTIONS: ActionDef[] = [
  {
    id: "1",
    title: "Power Strike",
    icon: <Swords size={20} />,
    cooldown: "4s",
    color: "text-red-400",
  },
  {
    id: "2",
    title: "Fireball",
    icon: <Flame size={20} />,
    cooldown: "8s",
    color: "text-orange-400",
  },
  {
    id: "3",
    title: "Shield Wall",
    icon: <Shield size={20} />,
    cooldown: "15s",
    color: "text-blue-400",
  },
  {
    id: "4",
    title: "Greater Heal",
    icon: <Heart size={20} />,
    cooldown: "12s",
    color: "text-emerald-400",
  },
]

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

export default function ActivityFeed( { players, currentPlayer, chats, sendChat, abilities, performAction }: FeedProps ) {
  const [mode, setMode] = useState<Mode>("chat")
  const [messages, setMessages] = useState(chats)
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [activeCooldowns, setActiveCooldowns] = useState<Record<string, boolean>>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const activePlayers:number = players.length;
  // Fake typing animation effect
  useEffect(() => {
    if (mode !== "chat") return
    const interval = setInterval(() => {
      setIsTyping((prev) => !prev)
    }, 4500)
    return () => clearInterval(interval)
  }, [mode])

  // Auto-scroll to bottom whenever chats array updates
  useEffect(() => {
    const container = chatEndRef.current;
    if (container) {
      // Scroll ONLY this container to the bottom
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [chats]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    sendChat(inputValue);
    setInputValue("")
  }

  const triggerAction = (actionId: string, cooldownTimeStr: string) => {
    if (activeCooldowns[actionId]) return

    setActiveCooldowns((prev) => ({ ...prev, [actionId]: true }))

    const ms = parseFloat(cooldownTimeStr.replace("s", "")) * 1000

    setTimeout(() => {
      setActiveCooldowns((prev) => ({ ...prev, [actionId]: false }))
    }, ms)
  }

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
          {mode === "chat" && (
            <div className="flex h-full animate-in flex-col duration-300 fade-in">
              <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-800 bg-gray-900/50 px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-indigo-500/30 bg-indigo-900/50">
                    <span className="font-bold text-indigo-400">R1</span>
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-100">
                      Raid Group 1
                    </h2>
                    <div className="h-4">
                      {isTyping ? (
                        <span className="flex items-center gap-1 text-xs text-indigo-400 italic">
                          Alex_Shadow is typing
                          <span className="animate-bounce">.</span>
                          <span className="animate-bounce delay-100">.</span>
                          <span className="animate-bounce delay-200">.</span>
                        </span>
                      ) : (
                        <span className="text-xs text-gray-500">
                          {activePlayers} Members Online
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </header>

              <div ref={chatEndRef} className="custom-scrollbar flex-1 space-y-5 overflow-y-auto p-6">
                {chats.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.senderId === currentPlayer.id ? "items-end" : "items-start"}`}
                  >
                    <span className="mb-1 px-1 text-[11px] font-medium tracking-wide text-gray-500">
                      {msg.metadata.sender}
                    </span>
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${
                          msg.senderId === currentPlayer.id
                          ? "rounded-tr-sm bg-indigo-600 text-white shadow-sm shadow-indigo-900/20"
                          : "rounded-tl-sm border border-gray-700/50 bg-gray-800 text-gray-200"
                      }`}
                    >
                      {msg.message}
                    </div>
                    {/*<div ref={chatEndRef} />*/}
                  </div>
                ))}
              </div>

              <div className="shrink-0 border-t border-gray-800 bg-gray-900/80 p-4">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type to room..."
                    className="flex-1 rounded-lg border border-gray-700 bg-gray-950 px-4 py-2.5 text-sm text-gray-200 transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim()}
                    className="flex w-12 items-center justify-center rounded-lg bg-indigo-600 p-2.5 text-white transition-colors hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600"
                  >
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* --- ACTIONS MODE --- */}
          {mode === "actions" && (
            <div className="flex h-full animate-in flex-col duration-300 fade-in">
              <header className="flex h-16 shrink-0 items-center border-b border-gray-800 bg-red-950/20 px-6">
                <div className="flex w-full items-center gap-3">
                  <div className="h-8 w-2 rounded-full bg-rose-600"></div>
                  <div>
                    <p className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                      Current Target
                    </p>
                    <h2 className="text-lg leading-tight font-bold text-rose-100 drop-shadow-md">
                      Void Dragon Sovereign
                    </h2>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="mb-1 font-mono text-xs text-gray-400">
                      75.0% HP
                    </p>
                    <div className="h-1.5 w-32 overflow-hidden rounded-full bg-gray-800">
                      <div className="h-full w-[75%] bg-rose-600 shadow-[0_0_10px_rgba(225,29,72,0.5)]"></div>
                    </div>
                  </div>
                </div>
              </header>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-2 gap-4">
                  {ACTIONS.map((action) => {
                    const isOnCooldown = activeCooldowns[action.id]
                    return (
                      <button
                        key={action.id}
                        onClick={() =>
                          triggerAction(action.id, action.cooldown)
                        }
                        disabled={isOnCooldown}
                        className={`group flex items-center gap-4 rounded-xl border border-gray-800 bg-gray-900 p-4 text-left transition-all ${isOnCooldown ? "cursor-not-allowed opacity-70" : "hover:border-gray-600 hover:bg-gray-800/80 active:scale-95"}`}
                      >
                        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center">
                          <svg
                            className="absolute inset-0 h-full w-full text-gray-800"
                            viewBox="0 0 36 36"
                          >
                            <path
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                            />
                          </svg>
                          {isOnCooldown && (
                            <svg
                              className="absolute inset-0 z-0 h-full w-full -rotate-90 text-white/50"
                              viewBox="0 0 36 36"
                            >
                              <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeDasharray="100, 100"
                                style={{
                                  animation: `cooldown-spin ${action.cooldown} linear forwards`,
                                }}
                              />
                            </svg>
                          )}
                          <div
                            className={`relative z-10 transition-transform ${!isOnCooldown && "group-hover:scale-110"} ${action.color}`}
                          >
                            {action.icon}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3
                            className={`font-bold transition-colors ${isOnCooldown ? "text-gray-500" : "text-gray-200 group-hover:text-white"}`}
                          >
                            {action.title}
                          </h3>
                          <div className="mt-1 flex items-center gap-1.5">
                            <div
                              className={`h-1.5 w-1.5 rounded-full ${isOnCooldown ? "animate-pulse bg-rose-500" : "bg-emerald-500"}`}
                            ></div>
                            <span className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
                              {isOnCooldown
                                ? "On Cooldown"
                                : `Ready (${action.cooldown})`}
                            </span>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

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
