import ChatBlock from '../Feed/ChatBlock.tsx';
import ActionMode from '../Feed/ActionMode.tsx';
import {
  Bell, AlertTriangle, Info
} from "lucide-react"
import Events from "../Feed/Events.tsx";
// import {useToast} from "../../context/ToastContext.tsx";
import PlayerProfileCard from "../Trial/Profile.tsx";
import {useGame} from "../../context/GameContext.tsx";
import SecurityControlPanel from "../Feed/DefenseMode.tsx";
import {NAV_ITEMS, SYSTEM_ALERTS, NavButton} from "../../utils/FeedUtils.tsx";

export default function ActivityFeed() {
  const { activeTab, setActiveTab } = useGame();
  // const { showToast } = useToast();

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
                  key={item.targetTab}
                  activeTab={activeTab}
                  targetTab={item.targetTab}
                  onClick={setActiveTab}
                  icon={item.icon}
                  title={item.title}
                  activeColorClass={item.activeColorClass}
                  hasBadge={item.hasBadge}
              />
          ))}
        </div>
        {/* Main Content Area */}
        <div className="relative flex flex-1 flex-col overflow-hidden bg-gray-950">
          {/* --- [PROFILE] --- */}
          {activeTab === "profile" && <PlayerProfileCard />}

          {/* --- CHAT MODE --- */}
          {activeTab === "chat" && <ChatBlock />}

          {/* --- ACTIONS MODE --- */}
          {activeTab === "actions" && <ActionMode />}

          {/* --- DEFENCE MODE --- */}
          {activeTab === "defence" && <SecurityControlPanel />}

          {/* EVENTS MODE */}
          {activeTab === "events" && <Events />}

          {/* --- ALERTS MODE --- */}
          {activeTab === "alerts" && (
            <div className="flex h-full animate-in flex-col duration-300 fade-in">
              {/* Alerts Top */}
              <header className="flex h-16 shrink-0 items-center border-b border-gray-800 bg-amber-950/20 px-6">
                <div>
                  <div className='flex items-center gap-3'>
                    <span className="font-bold text-amber-400">
                                <Bell size={30}/>
                            </span>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                      System Alerts
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
