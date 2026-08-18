import {
    MessageSquare, Zap,  ShieldCogCorner, Calendars, User, AtSign,
} from "lucide-react"
import {type TabType} from "../context/GameContext.tsx";

// eslint-disable-next-line react-refresh/only-export-components
export const NAV_ITEMS = [
    {
        targetTab: "profile" as const,
        icon: User,
        title: "Profile",
        activeColorClass: "bg-gray-600 shadow-gray-900/50",
    },
    {
        targetTab: "chat" as const,
        icon: MessageSquare,
        title: "Chat Room",
        activeColorClass: "bg-indigo-600 shadow-indigo-900/50",
    },
    {
        targetTab: "actions" as const,
        icon: Zap,
        title: "Actions",
        activeColorClass: "bg-rose-600 shadow-rose-900/50",
    },
    {
        targetTab: "defence" as const,
        icon: ShieldCogCorner,
        title: "Defence",
        activeColorClass: "bg-blue-400 shadow-blue-900/50",
    },
    {
        targetTab: "events" as const,
        icon: Calendars,
        title: "Events",
        activeColorClass: "bg-emerald-600 shadow-emerald-900/50",
    },
    {
        targetTab: "alerts" as const,
        icon: AtSign,
        title: "System Alerts",
        activeColorClass: "bg-orange-500 shadow-orange-900/50",
        hasBadge: true,
    },
];

export interface Alert {
    id: string
    type: "danger" | "warning" | "info"
    message: string
    time: string
}

// eslint-disable-next-line react-refresh/only-export-components
export const SYSTEM_ALERTS: Alert[] = [
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

export interface NavButtonProps {
    activeTab: TabType; targetTab: TabType; onClick: (tab: TabType) => void;
    icon: React.ElementType; title: string; activeColorClass: string; // e.g. "bg-indigo-600 shadow-indigo-900/50"
    hasBadge?: boolean;
}

export const NavButton = ({activeTab, targetTab, onClick, icon: Icon, title, activeColorClass, hasBadge = false,
                   }: NavButtonProps) => {
    const isActive = activeTab === targetTab;

    return (
        <button
            onClick={() => onClick(targetTab)}
            className={`relative rounded-xl p-3 transition-all duration-200 ${
                isActive
                    ? `${activeColorClass} text-white shadow-lg`
                    : "text-gray-500 hover:bg-gray-800 hover:text-gray-300"
            }`}
            title={title}
        >
            <Icon size={18} />
            {hasBadge && !isActive && (
                <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full border border-gray-900 bg-amber-500" />
            )}
        </button>
    );
}