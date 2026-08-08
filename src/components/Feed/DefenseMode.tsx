import {
    ShieldCheck, Flame, Eye, Wrench, Bug, ArrowUpRight, Activity, Lock
} from 'lucide-react';
import {useState} from "react";
import MaintenancePanel from "./MaintenancePanel.tsx";
import FirewallPanel from "./FirewallPanel.tsx";
import IDSPanel from "./IDSPanel.tsx";
import HoneypotPanel from "./HoneypotPanel.tsx";

export type PanelType = 'main' | 'firewall' | 'ids' | 'maintenance' | 'honeypot' ;

export default function SecurityControlPanel() {
    const [panel, setPanel] = useState<PanelType>('main');
    const modules = [
        {
            id: 'firewall',
            name: 'Firewall Configuration',
            description: 'Rules, port forwarding & IP blocking',
            icon: Flame,
            // Vibrant Amber / Rose Accent
            iconBg: 'bg-amber-500/10 group-hover:bg-amber-500/20 text-amber-400 border-amber-500/20',
            hoverBorder: 'hover:border-amber-500/40 hover:shadow-[0_0_20px_rgba(245,158,11,0.08)]',
            arrowColor: 'group-hover:text-amber-400',
        },
        {
            id: 'ids',
            name: 'Intrusion Detection (IDS)',
            description: 'Real-time traffic monitoring & logs',
            icon: Eye,
            // Electric Cyan Accent
            iconBg: 'bg-cyan-500/10 group-hover:bg-cyan-500/20 text-cyan-400 border-cyan-500/20',
            hoverBorder: 'hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.08)]',
            arrowColor: 'group-hover:text-cyan-400',
        },
        {
            id: 'maintenance',
            name: 'Maintenance Mode',
            description: 'System updates & diagnostic tools',
            icon: Wrench,
            // Violet Accent
            iconBg: 'bg-violet-500/10 group-hover:bg-violet-500/20 text-violet-400 border-violet-500/20',
            hoverBorder: 'hover:border-violet-500/40 hover:shadow-[0_0_20px_rgba(139,92,246,0.08)]',
            arrowColor: 'group-hover:text-violet-400',
        },
        {
            id: 'honeypot',
            name: 'HoneyPot Network',
            description: 'Decoy telemetry & intruder tracking',
            icon: Bug,
            // Emerald Accent
            iconBg: 'bg-emerald-500/10 group-hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20',
            hoverBorder: 'hover:border-emerald-500/40 hover:shadow-[0_0_20px_rgba(16,185,129,0.08)]',
            arrowColor: 'group-hover:text-emerald-400',
        },
    ];

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
            {modules.map((item) => {
                const Icon = item.icon;
                return (
                    <button
                        key={item.id}
                        onClick={() => setPanel(item.id)}
                        className={`w-full group flex pop-up items-center gap-4 rounded-xl border border-gray-800 bg-gray-900 p-4 text-left transition-all hover:border-gray-600 hover:bg-gray-800/80 active:scale-95`}
                    >
                        <div className={`relative z-10 transition-transform group-hover:scale-110 ${item.iconBg}`}>
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
                            className={`p-1.5 rounded-lg text-zinc-600 transition-all duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${item.arrowColor}`}>
                            <ArrowUpRight className="w-4 h-4"/>
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