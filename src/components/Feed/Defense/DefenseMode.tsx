import {
    ShieldCheck, ArrowUpRight, Activity, Lock
} from 'lucide-react';
import {useState} from "react";
import MaintenancePanel from "./MaintenancePanel.tsx";
import FirewallPanel from "./FirewallPanel.tsx";
import IDSPanel from "./IDSPanel.tsx";
import HoneypotPanel from "./HoneypotPanel.tsx";
import {DEFENSE_MODULES} from "../../../utils/DefenseUtils.ts";
import {useGame} from "../../../context/GameContext.tsx";
import {useToast} from "../../../context/ToastContext.tsx";

export type PanelType = 'main' | 'firewall' | 'ids' | 'maintenance' | 'honeypot' ;

export default function SecurityControlPanel() {
    const [panel, setPanel] = useState<PanelType>('main');
    const { playerXp } = useGame();
    const { showToast } = useToast();
    const UNLOCK_THRESHOLD = 4500;
    const isUnlocked = playerXp > UNLOCK_THRESHOLD;

    const handleClick = (panel: PanelType) => {
        if (isUnlocked) {
            setPanel(panel);
        } else {
            showToast({
                title: `${panel.toUpperCase()} is locked`,
                description: `Reach ${UNLOCK_THRESHOLD}xp to UNLOCK.`,
            });
        }
    };
    return (
        <div>
            {panel === 'maintenance' && <MaintenancePanel onBack={() => setPanel('main')} />}
            {panel === 'firewall' && <FirewallPanel onBack={() => setPanel('main')}/>}
            {panel === 'ids' && <IDSPanel onBack={() => setPanel('main')} />}
            {panel === 'honeypot' && <HoneypotPanel onBack={() => setPanel('main')} />}
            {panel === 'main' &&
    <div className="flex h-full animate-in flex-col duration-300 fade-in">
        <header
            className="flex h-16 shrink-0 items-center justify-between border-b border-gray-800 bg-gray-900/50 px-6">
            <div className="flex items-center gap-3">
                <div>
                    <div className='flex items-center gap-3'>
                        <span className="font-bold text-sky-400">
                            <ShieldCheck size={35}/>
                        </span>
                        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                            Security Control Panel
                        </h1>
                    </div>
                    <p className="text-xs md:text-sm text-slate-400 mt-1">
                        Secure your system to pervent attackers.
                    </p>
                </div>
            </div>
        </header>

        {/* Scrollable Navigation List */}
        <div className="p-3.5 mt-5 space-y-2.5 overflow-y-auto max-h-[380px] scrollbar-thin scrollbar-thumb-zinc-800">
            {DEFENSE_MODULES.map((item) => {
                const Icon = item.icon;
                return (
                    <button
                        key={item.id}
                        onClick={() => handleClick(item.id)}
                        className={`w-full group flex pop-up items-center gap-4 rounded-xl border border-gray-800 bg-gray-900 p-4 text-left transition-all hover:border-gray-600 hover:bg-gray-800/80 active:scale-95`}
                    >
                        <div className={`relative z-10 transition-transform group-hover:scale-110 ${isUnlocked 
                        ? item.iconBg : "defense-locked"}`}>
                            <Icon size={24}/>
                        </div>

                        <div className="flex-1">
                            <h3
                                className={`font-bold transition-colors ${"text-gray-200 group-hover:text-white"}`}
                            >
                                {item.name}
                            </h3>
                            <div className="mt-1 flex items-center gap-1.5">
                                    <span className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
                              {item.description}
                            </span>
                            </div>
                        </div>
                        <div
                            className={`p-1.5 rounded-lg text-zinc-600 transition-all duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${isUnlocked
                                ? item.arrowColor : "group-hover:text-gray-400"}`}>
                            {!isUnlocked && <Lock className="w-4 h-4"/>}
                            {isUnlocked && <ArrowUpRight className="w-4 h-4"/>}
                        </div>
                    </button>
                );
            })}
        </div>

        {/* Footer */}
        <footer
            className="px-5 py-3 border-t border-zinc-800/80 bg-zinc-900/20 flex items-center justify-between text-xs text-zinc-400">
            <div className="flex items-center space-x-2">
                <Activity className="w-3.5 h-3.5 text-zinc-500"/>
                <span>4 Active Telemetry Nodes</span>
            </div>
            <div className="flex items-center space-x-1.5 text-zinc-400">
                <Lock className="w-3.5 h-3.5 text-zinc-500"/>
                <span className="font-mono text-[11px]">PORTAL ACTIVE</span>
            </div>
        </footer>
    </div>
        }
        </div>
    );
}