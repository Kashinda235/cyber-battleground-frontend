import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldCheck,
    ShieldAlert,
    Flame,
    Radar,
    Bug,
    Wrench,
    Activity,
    Server,
    Lock,
    Terminal,
    AlertTriangle,
    RefreshCw,
    Zap,
    CheckCircle2,
    XCircle,
    Eye,
    Sliders,
    Radio
} from 'lucide-react';

const DefenseControlCenter = () => {
    const [activeTab, setActiveTab] = useState('firewall');
    const [maintenanceMode, setMaintenanceMode] = useState(false);

    // Firewall State
    const [firewallActive, setFirewallActive] = useState(true);
    const [strictMode, setStrictMode] = useState(false);
    const [blockedIPs, setBlockedIPs] = useState([
        { id: 1, ip: '192.168.1.104', reason: 'Syn Flood Attempt', time: '2 mins ago' },
        { id: 2, ip: '10.0.4.89', reason: 'Rate Limit Exceeded', time: '14 mins ago' },
        { id: 3, ip: '172.16.0.22', reason: 'Port Scanning (Nmap)', time: '1 hour ago' },
    ]);

    // IDS State
    const [idsActive, setIdsActive] = useState(true);
    const [sensitivity, setSensitivity] = useState('High');
    const [alerts, setAlerts] = useState([
        { id: 'ALT-901', severity: 'Critical', source: 'Internal Gateway', desc: 'Potential SQL Injection payload in POST /api/v1/auth' },
        { id: 'ALT-902', severity: 'Medium', source: 'DMZ Segment', desc: 'Abnormal ICMP traffic burst' },
    ]);

    // Honeypot State
    const [honeypots, setHoneypots] = useState([
        { id: 'hp-ssh', name: 'Fake SSH Bastion', type: 'SSH Trapper', status: 'Active', captures: 142 },
        { id: 'hp-db', name: 'Decoy Postgres DB', type: 'Database Trap', status: 'Active', captures: 89 },
        { id: 'hp-admin', name: 'Mock Admin Portal', type: 'HTTP Canary', status: 'Idle', captures: 12 },
    ]);

    const tabs = [
        { id: 'firewall', label: 'Firewall', icon: Flame, badge: firewallActive ? 'Active' : 'Off' },
        { id: 'ids', label: 'IDS / Detection', icon: Radar, badge: `${alerts.length} Alerts` },
        { id: 'honeypot', label: 'Honeypot Decoys', icon: Bug, badge: `${honeypots.filter(h => h.status === 'Active').length} Live` },
        { id: 'maintenance', label: 'Maintenance', icon: Wrench, badge: maintenanceMode ? 'Lockdown' : 'Normal' },
    ];

    return (
        <div className="w-full min-h-screen bg-slate-950 text-slate-100 p-6 font-mono selection:bg-cyan-500 selection:text-slate-950">
            {/* Top Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-5 mb-6 gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="w-8 h-8 text-cyan-400 animate-pulse" />
                        <h1 className="text-2xl font-bold tracking-wider text-slate-50 uppercase">
                            System Defense Control
                        </h1>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                        Real-time Threat Neutralization & Infrastructure Controls
                    </p>
                </div>

                {/* Global Emergency Status Indicator */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-xs">
                        <span className="text-slate-400">Node Cluster:</span>
                        <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              ONLINE
            </span>
                    </div>

                    <button
                        onClick={() => setMaintenanceMode(!maintenanceMode)}
                        className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-bold uppercase transition-all duration-200 border ${
                            maintenanceMode
                                ? 'bg-rose-950/80 border-rose-600 text-rose-300 shadow-[0_0_15px_rgba(225,29,72,0.4)]'
                                : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-cyan-500 hover:text-cyan-400'
                        }`}
                    >
                        <Lock className="w-4 h-4" />
                        {maintenanceMode ? 'Lockdown Enabled' : 'Trigger Maintenance'}
                    </button>
                </div>
            </header>

            {/* Main Tab Navigation */}
            <nav className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`relative flex items-center justify-between p-4 rounded-lg border text-left transition-all duration-200 ${
                                isActive
                                    ? 'bg-slate-900/90 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.15)] text-slate-100'
                                    : 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                                <span className="text-sm font-medium">{tab.label}</span>
                            </div>
                            <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                                isActive ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'bg-slate-800 text-slate-400'
                            }`}>
                {tab.badge}
              </span>
                            {isActive && (
                                <motion.div
                                    layoutId="activeIndicator"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-b-lg"
                                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                />
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Dynamic Module Content */}
            <main className="min-h-[460px]">
                <AnimatePresence mode="wait">
                    {activeTab === 'firewall' && (
                        <motion.div
                            key="firewall"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-6"
                        >
                            {/* Firewall Controls */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-1 bg-slate-900/60 border border-slate-800 rounded-lg p-5 space-y-6">
                                    <h2 className="text-sm font-semibold uppercase text-slate-300 tracking-wider flex items-center gap-2">
                                        <Sliders className="w-4 h-4 text-cyan-400" /> Policy Configuration
                                    </h2>

                                    <div className="flex items-center justify-between p-3 bg-slate-950 rounded border border-slate-800">
                                        <div>
                                            <p className="text-sm font-medium text-slate-200">Firewall Engine</p>
                                            <p className="text-xs text-slate-500">Filter packet layer 3/4/7</p>
                                        </div>
                                        <button
                                            onClick={() => setFirewallActive(!firewallActive)}
                                            className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${
                                                firewallActive ? 'bg-cyan-500 justify-end' : 'bg-slate-700 justify-start'
                                            }`}
                                        >
                                            <motion.div layout className="w-4 h-4 rounded-full bg-slate-950 shadow" />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-slate-950 rounded border border-slate-800">
                                        <div>
                                            <p className="text-sm font-medium text-slate-200">Strict Rate Limiting</p>
                                            <p className="text-xs text-slate-500">Drop traffic above 500 req/s</p>
                                        </div>
                                        <button
                                            onClick={() => setStrictMode(!strictMode)}
                                            className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${
                                                strictMode ? 'bg-amber-500 justify-end' : 'bg-slate-700 justify-start'
                                            }`}
                                        >
                                            <motion.div layout className="w-4 h-4 rounded-full bg-slate-950 shadow" />
                                        </button>
                                    </div>

                                    <div className="p-4 bg-cyan-950/20 border border-cyan-900/40 rounded text-xs space-y-2">
                                        <p className="text-cyan-400 font-semibold flex items-center gap-1.5">
                                            <Zap className="w-3.5 h-3.5" /> Rule Execution Status
                                        </p>
                                        <p className="text-slate-400">1,482 dynamic rules active. Average packet analysis latency: 0.42ms.</p>
                                    </div>
                                </div>

                                {/* Blocklist Table */}
                                <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-lg p-5">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-sm font-semibold uppercase text-slate-300 tracking-wider flex items-center gap-2">
                                            <ShieldAlert className="w-4 h-4 text-rose-400" /> Active IP Blocklist ({blockedIPs.length})
                                        </h2>
                                        <span className="text-xs text-slate-500">Auto-purged every 24h</span>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-xs">
                                            <thead>
                                            <tr className="border-b border-slate-800 text-slate-400 uppercase">
                                                <th className="pb-3 font-mono">IP Address</th>
                                                <th className="pb-3 font-mono">Trigger Event</th>
                                                <th className="pb-3 font-mono">Timestamp</th>
                                                <th className="pb-3 font-mono text-right">Action</th>
                                            </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-800/50">
                                            {blockedIPs.map((item) => (
                                                <tr key={item.id} className="hover:bg-slate-800/30">
                                                    <td className="py-3 text-slate-200 font-mono text-cyan-300">{item.ip}</td>
                                                    <td className="py-3 text-slate-400">{item.reason}</td>
                                                    <td className="py-3 text-slate-500">{item.time}</td>
                                                    <td className="py-3 text-right">
                                                        <button
                                                            onClick={() => setBlockedIPs(blockedIPs.filter(b => b.id !== item.id))}
                                                            className="text-xs text-rose-400 hover:text-rose-300 hover:underline"
                                                        >
                                                            Unblock
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'ids' && (
                        <motion.div
                            key="ids"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-6"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* IDS Controls */}
                                <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-5 space-y-5">
                                    <h2 className="text-sm font-semibold uppercase text-slate-300 tracking-wider flex items-center gap-2">
                                        <Radar className="w-4 h-4 text-cyan-400" /> Engine Diagnostics
                                    </h2>

                                    <div className="space-y-3">
                                        <label className="text-xs text-slate-400 block">Detection Sensitivity</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {['Low', 'Medium', 'High'].map((level) => (
                                                <button
                                                    key={level}
                                                    onClick={() => setSensitivity(level)}
                                                    className={`py-2 text-xs rounded border transition-all ${
                                                        sensitivity === level
                                                            ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold'
                                                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                                                    }`}
                                                >
                                                    {level}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-4 bg-slate-950 rounded border border-slate-800 space-y-2">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-400">Signature Database:</span>
                                            <span className="text-emerald-400">v2026.08.06 (Latest)</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-400">Inspect Deep Packets:</span>
                                            <span className="text-cyan-400">Enabled</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Threat Stream */}
                                <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-lg p-5">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-sm font-semibold uppercase text-slate-300 tracking-wider flex items-center gap-2">
                                            <Activity className="w-4 h-4 text-amber-400" /> Live Threat Stream
                                        </h2>
                                        <button
                                            onClick={() => setAlerts([])}
                                            className="text-xs text-slate-500 hover:text-slate-300"
                                        >
                                            Clear Feed
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        {alerts.length === 0 ? (
                                            <div className="p-8 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded">
                                                No active intrusion alerts detected in current telemetry window.
                                            </div>
                                        ) : (
                                            alerts.map((alt) => (
                                                <div key={alt.id} className="p-4 bg-slate-950 border border-slate-800 rounded flex items-start justify-between gap-4">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  alt.severity === 'Critical' ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                              }`}>
                                {alt.severity}
                              </span>
                                                            <span className="text-xs text-slate-300 font-bold">{alt.id}</span>
                                                            <span className="text-xs text-slate-500">• {alt.source}</span>
                                                        </div>
                                                        <p className="text-xs text-slate-400">{alt.desc}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => setAlerts(alerts.filter(a => a.id !== alt.id))}
                                                        className="text-xs bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1 rounded"
                                                    >
                                                        Quarantine
                                                    </button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'honeypot' && (
                        <motion.div
                            key="honeypot"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-6"
                        >
                            <div className="flex justify-between items-center">
                                <h2 className="text-sm font-semibold uppercase text-slate-300 tracking-wider flex items-center gap-2">
                                    <Bug className="w-4 h-4 text-emerald-400" /> Decoy Environment Status
                                </h2>
                                <span className="text-xs text-slate-400">Total Capture Payload Count: 243</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {honeypots.map((hp) => (
                                    <div key={hp.id} className="bg-slate-900/60 border border-slate-800 rounded-lg p-5 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-200">{hp.name}</h3>
                                                <p className="text-xs text-slate-500">{hp.type}</p>
                                            </div>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                                                hp.status === 'Active' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'
                                            }`}>
                        {hp.status}
                      </span>
                                        </div>

                                        <div className="p-3 bg-slate-950 rounded border border-slate-800 flex justify-between items-center text-xs">
                                            <span className="text-slate-400">Trapped Probe Attacks:</span>
                                            <span className="text-cyan-400 font-bold">{hp.captures}</span>
                                        </div>

                                        <button
                                            onClick={() => {
                                                setHoneypots(honeypots.map(h =>
                                                    h.id === hp.id ? { ...h, status: h.status === 'Active' ? 'Idle' : 'Active' } : h
                                                ));
                                            }}
                                            className="w-full py-1.5 text-xs bg-slate-950 border border-slate-800 hover:border-slate-700 rounded text-slate-300"
                                        >
                                            Toggle Trap Node
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'maintenance' && (
                        <motion.div
                            key="maintenance"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                            className="bg-slate-900/60 border border-slate-800 rounded-lg p-6 space-y-6"
                        >
                            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                                <div>
                                    <h2 className="text-sm font-semibold uppercase text-slate-300 tracking-wider flex items-center gap-2">
                                        <Wrench className="w-4 h-4 text-amber-400" /> Emergency System Maintenance
                                    </h2>
                                    <p className="text-xs text-slate-500 mt-1">Drains inbound user sessions and isolates compute nodes.</p>
                                </div>
                                <button
                                    onClick={() => setMaintenanceMode(!maintenanceMode)}
                                    className={`px-4 py-2 rounded text-xs font-bold ${
                                        maintenanceMode ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                    }`}
                                >
                                    {maintenanceMode ? 'DISABLE LOCKDOWN' : 'ENABLE LOCKDOWN'}
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                                <div className="p-4 bg-slate-950 rounded border border-slate-800 space-y-3">
                                    <p className="font-bold text-slate-300">Cluster Node Drain</p>
                                    <p className="text-slate-400">Reroute live user traffic away from working nodes to perform zero-downtime hot patches.</p>
                                    <button className="px-3 py-1.5 bg-slate-900 border border-slate-700 hover:border-cyan-500 text-slate-200 rounded">
                                        Execute Traffic Drain
                                    </button>
                                </div>

                                <div className="p-4 bg-slate-950 rounded border border-slate-800 space-y-3">
                                    <p className="font-bold text-slate-300">Kernel Security Patching</p>
                                    <p className="text-slate-400">Staged update for Linux host kernels (Target: v6.12 LTS hardening package).</p>
                                    <button className="px-3 py-1.5 bg-slate-900 border border-slate-700 hover:border-cyan-500 text-slate-200 rounded">
                                        Stage Kernel Patch
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default DefenseControlCenter;