import {Bug, Eye, Flame, Wrench} from "lucide-react";

const getIconCSS = (color: string) => {
    return `defense-plain group-hover:bg-${color}-500/10 group-hover:bg-${color}-500/20 group-hover:text-${color}-400 group-hover:border-${color}-500/20`
}
export const DEFENSE_MODULES = [
    {
        id: 'maintenance',
        name: 'Maintenance Mode',
        description: 'System updates & diagnostic tools',
        icon: Wrench,
        // Violet Accent
        iconBg: getIconCSS('emerald'),
        hoverBorder: 'hover:border-emerald-500/40 hover:shadow-[0_0_20px_rgba(139,92,246,0.08)]',
        arrowColor: 'group-hover:text-emerald-400',
    },
    {
        id: 'firewall',
        name: 'Firewall Configuration',
        description: 'Rules, port forwarding & IP blocking',
        icon: Flame,
        // Vibrant Amber / Rose Accent
        iconBg: getIconCSS('amber'),
        hoverBorder: 'hover:border-amber-500/40 hover:shadow-[0_0_20px_rgba(245,158,11,0.08)]',
        arrowColor: 'group-hover:text-amber-400',
    },
    {
        id: 'ids',
        name: 'Intrusion Detection (IDS)',
        description: 'Real-time traffic monitoring & logs',
        icon: Eye,
        // Electric Cyan Accent
        iconBg: getIconCSS('cyan'),
        hoverBorder: 'hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.08)]',
        arrowColor: 'group-hover:text-cyan-400',
    },
    {
        id: 'honeypot',
        name: 'HoneyPot Network',
        description: 'Decoy telemetry & intruder tracking',
        icon: Bug,
        // Emerald Accent
        iconBg: getIconCSS('red'),
        hoverBorder: 'hover:border-red-500/40 hover:shadow-[0_0_20px_rgba(16,185,129,0.08)]',
        arrowColor: 'group-hover:text-red-400',
    },
];