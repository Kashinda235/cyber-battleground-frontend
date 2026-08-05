import React, {useEffect, useState} from "react"
import ChatBlock from '../Feed/ChatBlock.tsx';
import ActionMode from '../Feed/ActionMode.tsx';
import {
  MessageSquare, Zap, Bell, AlertTriangle, Info, ShieldCogCorner, Calendars, Tickets,
} from "lucide-react"
import type { ActionRequest, ActionResult, ChatLog, Player} from "../../utils/types.ts";
import Events from "../Feed/Events.tsx";
import {useToast} from "../../context/ToastContext.tsx";

type Mode = "chat" | "actions" | "defence" | "events" | "alerts"

interface FeedProps {
  players: Player[],
  currentPlayer: Player,
  target: Player,
  chats: ChatLog[],
  sendChat: (message: string) => Promise<ChatLog>,
  performAction: (data: ActionRequest) => Promise<ActionResult>
  setActiveTab: React.Dispatch<React.SetStateAction<Mode>>
}

interface NavButtonProps {
  mode: Mode; targetMode: Mode; onClick: (mode: Mode) => void;
  icon: React.ElementType; title: string; activeColorClass: string; // e.g. "bg-indigo-600 shadow-indigo-900/50"
  hasBadge?: boolean;
}

const NavButton = ({mode, targetMode, onClick, icon: Icon, title, activeColorClass, hasBadge = false,
                          }: NavButtonProps) => {
  const isActive = mode === targetMode;

  return (
      <button
          onClick={() => onClick(targetMode)}
          className={`relative rounded-xl p-3 transition-all duration-200 ${
              isActive
                  ? `${activeColorClass} text-white shadow-lg`
                  : "text-gray-500 hover:bg-gray-800 hover:text-gray-300"
          }`}
          title={title}
      >
        <Icon size={22} />
        {hasBadge && !isActive && (
            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full border border-gray-900 bg-amber-500" />
        )}
      </button>
  );
}

const NAV_ITEMS = [
  {
    targetMode: "chat" as const,
    icon: MessageSquare,
    title: "Chat Room",
    activeColorClass: "bg-indigo-600 shadow-indigo-900/50",
  },
  {
    targetMode: "actions" as const,
    icon: Zap,
    title: "Actions",
    activeColorClass: "bg-rose-600 shadow-rose-900/50",
  },
  {
    targetMode: "defence" as const,
    icon: ShieldCogCorner,
    title: "Defence",
    activeColorClass: "bg-blue-400 shadow-blue-900/50",
  },
  {
    targetMode: "events" as const,
    icon: Calendars,
    title: "Events",
    activeColorClass: "bg-emerald-600 shadow-emerald-900/50",
  },
  {
    targetMode: "alerts" as const,
    icon: Bell,
    title: "System Alerts",
    activeColorClass: "bg-orange-500 shadow-orange-900/50",
    hasBadge: true,
  },
];

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

export default function ActivityFeed( { players, currentPlayer, target, chats, sendChat, performAction, setActiveTab }: FeedProps ) {
  const [mode, setMode] = useState<Mode>("chat")
  const activePlayers:number = players.length;
  const { showToast } = useToast();

  useEffect(() => {
    setActiveTab(mode);
    showToast({ type: 'mission', title: 'New Mission', description: `Mode changed to ${mode.toUpperCase()}` })
  }, [mode]);
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
          {NAV_ITEMS.map((item) => (
              <NavButton
                  key={item.targetMode}
                  mode={mode}
                  targetMode={item.targetMode}
                  onClick={setMode}
                  icon={item.icon}
                  title={item.title}
                  activeColorClass={item.activeColorClass}
                  hasBadge={item.hasBadge}
              />
          ))}
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

          {/* EVENTS MODE */}
          {mode === "events" && <Events />}

          {/* --- ALERTS MODE --- */}
          {mode === "alerts" && (
            <div className="flex h-full animate-in flex-col duration-300 fade-in">
              {/* Alerts Top */}
              <header className="flex h-16 shrink-0 items-center border-b border-gray-800 bg-amber-950/20 px-6">
                <div>
                  <div className='flex items-center gap-3'>
                    <span className="font-bold text-amber-400">
                                <Bell size={30}/>
                            </span>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                      System Alerts and Notifications
                    </h1>
                  </div>
                  <p className="text-xs md:text-sm text-slate-400 mt-1">
                    {SYSTEM_ALERTS.length} Recent entries
                  </p>
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
