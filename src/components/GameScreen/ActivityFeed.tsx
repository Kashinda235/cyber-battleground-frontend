import ChatBlock from '../Feed/ChatBlock.tsx';
import ActionMode from '../Feed/Action/ActionMode.tsx';
import Events from "../Feed/Events.tsx";
import PlayerProfileCard from "../Feed/Profile.tsx";
import {useGame} from "../../context/GameContext.tsx";
import SecurityControlPanel from "../Feed/Defense/DefenseMode.tsx";
import {NAV_ITEMS, NavButton} from "../../utils/FeedUtils.tsx";
import MailFeature from "../Feed/Notifications.tsx";

export default function ActivityFeed() {
  const { activeTab, setActiveTab } = useGame();

    return (
        <>
            <style>{`
      @keyframes cooldown-spin {
        from { stroke-dashoffset: 100; }
        to { stroke-dashoffset: 0; }
      }
    `}</style>

            {/* Parent Container: Always vertical column */}
            <div className="relative mx-auto flex h-full w-full flex-col overflow-hidden rounded-xl border border-gray-800 bg-gray-950 font-sans text-gray-100 shadow-2xl">

                {/* Navigation: Locked as a top bar across all breakpoints */}
                <div className="z-10 flex h-16 w-full shrink-0 flex-row items-center justify-around border-b border-gray-800 bg-gray-900 px-2">
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
                <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-gray-950">
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
                    {activeTab === "alerts" && <MailFeature />}
                </div>
            </div>
        </>
    );
}
