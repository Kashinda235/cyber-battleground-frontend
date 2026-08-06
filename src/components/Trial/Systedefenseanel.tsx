import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldAlert,
    Flame,
    Eye,
    Target,
    Wrench,
    Activity,
    Cpu,
    Power,
    RefreshCw,
    Sliders,
    ChevronRight,
    AlertTriangle,
    Lock,
    Wifi,
    Terminal,
    CheckCircle2,
    XCircle,
    Database
} from 'lucide-react';

export default function SystemDefensePanel() {
    // System Module States
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [firewallActive, setFirewallActive] = useState(true);
    const [idsActive, setIdsActive] = useState(true);
    const [honeypotActive, setHoneypotActive] = useState(true);

    // Active module context view
    const [selectedModule, setSelectedModule] = useState<string | null>(null);

    // Quick logs data stream simulation
    const [logs] = useState([
        { id: 1, time: '13:24:02', source: 'IDS', msg: 'Port scan detected from 192.168.1.105', type: 'warning' },
        { id: 2, time: '13:22:15', source: 'Honeypot', msg: 'Decoy ssh-trap-01 triggered by 45.33.18.9', type: 'alert' },
        { id: 3, time: '13:18:40', source: 'Firewall', msg: 'Rule #104 blocked TCP traffic on port 8080', type: 'info' },
        { id: 4, time: '13:00:00', source: 'Maintenance', msg: 'Kernel patch KB-9021 installed successfully', type: 'success' },
    ]);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans antialiased">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* TOP HEADER / STATUS BAR */}
                <header className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-slate-900/80 border border-slate-800 rounded-xl backdrop-blur-md gap-4">
                    <div className="flex items-center space-x-3">
                        <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-indigo-400">
                            <ShieldAlert className="w-7 h-7" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-wide text-white">SYSTEM DEFENSE CONTROL</h1>
                            <p className="text-xs text-slate-400 flex items-center gap-2">
                                <span>Node: defense-core-01</span>
                                <span>•</span>
                                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Operational
                </span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-3 bg-slate-950/60 px-4 py-2 rounded-lg border border-slate-800">
                            <Cpu className="w-4 h-4 text-cyan-400" />
                            <div>
                                <p className="text-xs text-slate-400">Load</p>
                                <p className="font-mono font-medium text-slate-200">18.4%</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-slate-950/60 px-4 py-2 rounded-lg border border-slate-800">
                            <Wifi className="w-4 h-4 text-indigo-400" />
                            <div>
                                <p className="text-xs text-slate-400">Bandwidth</p>
                                <p className="font-mono font-medium text-slate-200">1.2 GB/s</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-slate-950/60 px-4 py-2 rounded-lg border border-slate-800">
                            <AlertTriangle className="w-4 h-4 text-amber-400" />
                            <div>
                                <p className="text-xs text-slate-400">Threat Level</p>
                                <p className="font-mono font-medium text-amber-400">LOW</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* DEFENSE MODULES GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                    {/* 1. MAINTENANCE MODULE */}
                    <motion.div
                        whileHover={{ y: -2 }}
                        className={`flex flex-col justify-between p-5 rounded-xl border transition-all ${
                            maintenanceMode
                                ? 'bg-amber-950/20 border-amber-500/40 shadow-lg shadow-amber-500/5'
                                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                        }`}
                    >
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-2.5">
                                    <div className={`p-2 rounded-lg ${maintenanceMode ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'}`}>
                                        <Wrench className="w-5 h-5" />
                                    </div>
                                    <h2 className="font-semibold text-slate-100">Maintenance</h2>
                                </div>
                                <button
                                    onClick={() => setMaintenanceMode(!maintenanceMode)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                        maintenanceMode ? 'bg-amber-500' : 'bg-slate-800'
                                    }`}
                                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                                </button>
                            </div>

                            <p className="text-xs text-slate-400 mb-4">
                                System health management, routine diagnosis, and security patch automation.
                            </p>

                            <div className="space-y-2 text-xs font-mono mb-4">
                                <div className="flex justify-between py-1 border-b border-slate-800/60">
                                    <span className="text-slate-400">Scheduled Check</span>
                                    <span className="text-slate-200">03:00 UTC</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-slate-800/60">
                                    <span className="text-slate-400">Pending Updates</span>
                                    <span className="text-amber-400">2 Patches</span>
                                </div>
                                <div className="flex justify-between py-1">
                                    <span className="text-slate-400">System Lock</span>
                                    <span className={maintenanceMode ? 'text-amber-400' : 'text-slate-500'}>
                    {maintenanceMode ? 'ENABLED' : 'DISABLED'}
                  </span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setSelectedModule('Maintenance')}
                            className="mt-2 w-full py-2 px-3 flex items-center justify-between text-xs font-medium text-slate-300 bg-slate-800/60 hover:bg-slate-800 rounded-lg border border-slate-700/50 transition-colors group"
                        >
                            <span>Configure Maintenance</span>
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </motion.div>

                    {/* 2. FIREWALL MODULE */}
                    <motion.div
                        whileHover={{ y: -2 }}
                        className={`flex flex-col justify-between p-5 rounded-xl border transition-all ${
                            firewallActive
                                ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                                : 'bg-rose-950/20 border-rose-500/40 shadow-lg shadow-rose-500/5'
                        }`}
                    >
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-2.5">
                                    <div className={`p-2 rounded-lg ${firewallActive ? 'bg-orange-500/20 text-orange-400' : 'bg-slate-800 text-slate-500'}`}>
                                        <Flame className="w-5 h-5" />
                                    </div>
                                    <h2 className="font-semibold text-slate-100">Firewall</h2>
                                </div>
                                <button
                                    onClick={() => setFirewallActive(!firewallActive)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                        firewallActive ? 'bg-emerald-500' : 'bg-slate-800'
                                    }`}
                                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      firewallActive ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                                </button>
                            </div>

                            <p className="text-xs text-slate-400 mb-4">
                                Packet filtering, ingress/egress traffic rules, and active port surveillance.
                            </p>

                            <div className="space-y-2 text-xs font-mono mb-4">
                                <div className="flex justify-between py-1 border-b border-slate-800/60">
                                    <span className="text-slate-400">Active Rules</span>
                                    <span className="text-slate-200">1,420 Active</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-slate-800/60">
                                    <span className="text-slate-400">Blocked 24h</span>
                                    <span className="text-emerald-400">12,849 req</span>
                                </div>
                                <div className="flex justify-between py-1">
                                    <span className="text-slate-400">Default Policy</span>
                                    <span className="text-slate-200">DENY INBOUND</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setSelectedModule('Firewall')}
                            className="mt-2 w-full py-2 px-3 flex items-center justify-between text-xs font-medium text-slate-300 bg-slate-800/60 hover:bg-slate-800 rounded-lg border border-slate-700/50 transition-colors group"
                        >
                            <span>Manage Rules & Traffic</span>
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </motion.div>

                    {/* 3. IDS MODULE */}
                    <motion.div
                        whileHover={{ y: -2 }}
                        className="flex flex-col justify-between p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all"
                    >
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-2.5">
                                    <div className={`p-2 rounded-lg ${idsActive ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-500'}`}>
                                        <Eye className="w-5 h-5" />
                                    </div>
                                    <h2 className="font-semibold text-slate-100">IDS Engine</h2>
                                </div>
                                <button
                                    onClick={() => setIdsActive(!idsActive)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                        idsActive ? 'bg-emerald-500' : 'bg-slate-800'
                                    }`}
                                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      idsActive ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                                </button>
                            </div>

                            <p className="text-xs text-slate-400 mb-4">
                                Intrusion Detection System analyzing behavioral anomalies & signatures.
                            </p>

                            <div className="space-y-2 text-xs font-mono mb-4">
                                <div className="flex justify-between py-1 border-b border-slate-800/60">
                                    <span className="text-slate-400">Signature DB</span>
                                    <span className="text-slate-200">v2.026.84</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-slate-800/60">
                                    <span className="text-slate-400">Inspect Rate</span>
                                    <span className="text-cyan-400">98.4 Mbps</span>
                                </div>
                                <div className="flex justify-between py-1">
                                    <span className="text-slate-400">Alert Sensitivity</span>
                                    <span className="text-slate-200">HIGH</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setSelectedModule('IDS')}
                            className="mt-2 w-full py-2 px-3 flex items-center justify-between text-xs font-medium text-slate-300 bg-slate-800/60 hover:bg-slate-800 rounded-lg border border-slate-700/50 transition-colors group"
                        >
                            <span>View Alerts & Signatures</span>
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </motion.div>

                    {/* 4. HONEYPOT MODULE */}
                    <motion.div
                        whileHover={{ y: -2 }}
                        className="flex flex-col justify-between p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all"
                    >
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-2.5">
                                    <div className={`p-2 rounded-lg ${honeypotActive ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-800 text-slate-500'}`}>
                                        <Target className="w-5 h-5" />
                                    </div>
                                    <h2 className="font-semibold text-slate-100">Honeypot</h2>
                                </div>
                                <button
                                    onClick={() => setHoneypotActive(!honeypotActive)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                        honeypotActive ? 'bg-emerald-500' : 'bg-slate-800'
                                    }`}
                                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      honeypotActive ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                                </button>
                            </div>

                            <p className="text-xs text-slate-400 mb-4">
                                Decoy systems deployed to lure, isolate, and log unauthorized intruder vectors.
                            </p>

                            <div className="space-y-2 text-xs font-mono mb-4">
                                <div className="flex justify-between py-1 border-b border-slate-800/60">
                                    <span className="text-slate-400">Active Decoys</span>
                                    <span className="text-slate-200">6 Instances</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-slate-800/60">
                                    <span className="text-slate-400">Trapped IPs</span>
                                    <span className="text-purple-400">14 Unique</span>
                                </div>
                                <div className="flex justify-between py-1">
                                    <span className="text-slate-400">Capture State</span>
                                    <span className="text-emerald-400">LOGGING</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setSelectedModule('Honeypot')}
                            className="mt-2 w-full py-2 px-3 flex items-center justify-between text-xs font-medium text-slate-300 bg-slate-800/60 hover:bg-slate-800 rounded-lg border border-slate-700/50 transition-colors group"
                        >
                            <span>Inspect Traps & Telemetry</span>
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </motion.div>

                </div>

                {/* BOTTOM PANEL: REAL-TIME CONSOLE & ROUTING STUB */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* CONSOLE TELEMETRY STREAM */}
                    <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                            <div className="flex items-center space-x-2">
                                <Terminal className="w-4 h-4 text-slate-400" />
                                <h3 className="text-sm font-semibold text-slate-200">System Activity Stream</h3>
                            </div>
                            <span className="text-xs text-slate-500 font-mono">Live Telemetry</span>
                        </div>

                        <div className="space-y-2 font-mono text-xs max-h-48 overflow-y-auto pr-2">
                            {logs.map((log) => (
                                <div key={log.id} className="flex items-start space-x-3 p-2 rounded bg-slate-950/40 border border-slate-800/40">
                                    <span className="text-slate-500 shrink-0">{log.time}</span>
                                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase shrink-0 ${
                                        log.type === 'alert' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                                            log.type === 'warning' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                                                log.type === 'success' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                                    'bg-slate-800 text-slate-300'
                                    }`}>
                    {log.source}
                  </span>
                                    <span className="text-slate-300 truncate">{log.msg}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ACTIVE ROUTING MODAL / SELECTION PREVIEW */}
                    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center space-x-2 mb-3 pb-3 border-b border-slate-800">
                                <Sliders className="w-4 h-4 text-indigo-400" />
                                <h3 className="text-sm font-semibold text-slate-200">Control Target</h3>
                            </div>

                            {selectedModule ? (
                                <div className="space-y-3">
                                    <p className="text-xs text-slate-400">
                                        Ready to route control interface for:
                                    </p>
                                    <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
                                        <p className="text-sm font-semibold text-indigo-300">{selectedModule} Subsystem</p>
                                        <p className="text-xs text-slate-400 mt-1">Status: Endpoint target ready for connection.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 text-center border border-dashed border-slate-800 rounded-lg text-slate-500 text-xs my-4">
                                    Select a module from above to attach specialized management controls.
                                </div>
                            )}
                        </div>

                        <button
                            disabled={!selectedModule}
                            className={`w-full py-2.5 px-4 rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
                                selectedModule
                                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            }`}
                        >
                            <span>Launch {selectedModule || 'Panel'} Controls</span>
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
}