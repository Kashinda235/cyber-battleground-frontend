import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldAlert,
    ShieldCheck,
    Activity,
    Terminal as TerminalIcon,
    Search,
    Lock,
    Unlock,
    Radio,
    FileCode,
    Zap,
    RefreshCw,
    Eye,
    Database,
    Sliders,
    AlertTriangle,
    Server,
    Layers,
    Key,
    Flame,
    UserX,
    History,
    RotateCcw, Download, X
} from 'lucide-react';
import { useCyberSecurityCenter, type DefenseToolId, type AttackEvent } from './useCyberSecurityCenter';
import {NetworkTopologyMap} from "./TopologyMap.tsx";

export const DefenseDashboard: React.FC = () => {
    const { defenseState, logs, activeAlert, dispatchAttackEvent, toggleDefense } =
        useCyberSecurityCenter();

    // Active Tool Modal / Configuration Drawer State
    const [activeTab, setActiveTab] = useState<'splunk' | 'wireshark' | 'yara'>('splunk');
    const [activeModal, setActiveModal] = useState<DefenseToolId | null>(null);
    const [manualIp, setManualIp] = useState('');
    const [traceIp, setTraceIp] = useState('192.168.1.105');
    const [traceHops, setTraceHops] = useState<string[]>([]);
    const [yaraRuleCode, setYaraRuleCode] = useState(`rule Webshell_PHP {
    strings:
        $passthru = "passthru"
        $shell_exec = "shell_exec"
    condition:
        any of them
}`);

    // Interactive Action Handlers
    const runTraceback = () => {
        setTraceHops(['Initiating hops...', 'Hop 1: 10.0.0.1 (Local Router)', 'Hop 2: 172.16.0.45 (ISP Gateway)', 'Hop 3: 192.168.1.105 (MALICIOUS ORIGIN)']);
    };

    // Simulated attack triggers for testing the interface integration
    const triggerSimulatedAttack = (type: AttackEvent['attackType'], severity: AttackEvent['severity'], port: number) => {
        dispatchAttackEvent({
            eventId: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            attackType: type,
            sourceIp: `192.168.1.${Math.floor(Math.random() * 200) + 10}`,
            targetPort: port,
            payloadSignature: 'CVE-2026-X8912_EXPLOIT',
            severity
        });
    };

    const isUnderAttack = activeAlert && activeAlert.severity === 'CRITICAL';

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 space-y-4">
            {/* HEADER BAR */}
            <header className="flex flex-col md:flex-row items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-xl shadow-lg gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400">
                        <ShieldCheck className="w-7 h-7" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                            CYBER DEFENSE OPERATIONS DECK
                            <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 border border-blue-500/30 text-blue-300 font-mono">
                v2.6 SEC-OS
              </span>
                        </h1>
                        <p className="text-xs text-slate-400">Real-Time Threat Prevention & Telemetry Command</p>
                    </div>
                </div>

                {/* Global Security Status & Emergency Lockdown */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg">
                        <Radio className={`w-4 h-4 ${isUnderAttack ? 'text-red-500 animate-pulse' : 'text-emerald-500'}`} />
                        <div className="text-xs">
                            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Security State</span>
                            <span className={`font-mono font-bold ${isUnderAttack ? 'text-red-400' : 'text-emerald-400'}`}>
                {defenseState.emergencyLockdown.active
                    ? 'EMERGENCY LOCKDOWN'
                    : isUnderAttack
                        ? 'UNDER ATTACK'
                        : 'MONITORING / SECURE'}
              </span>
                        </div>
                    </div>

                    <button
                        onClick={() => toggleDefense('emergencyLockdown')}
                        className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-all shadow-md ${
                            defenseState.emergencyLockdown.active
                                ? 'bg-red-600 hover:bg-red-700 text-white border border-red-500 animate-pulse'
                                : 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}
                    >
                        <Flame className="w-4 h-4" />
                        {defenseState.emergencyLockdown.active ? 'LIFT LOCKDOWN' : 'EMERGENCY LOCKDOWN'}
                    </button>
                </div>
            </header>

            {/* QUICK ATTACK SIMULATION TRIGGER BAR (FOR DEMO / TESTING) */}
            <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between text-xs overflow-x-auto gap-2">
        <span className="text-slate-400 font-mono font-semibold flex items-center gap-1.5 whitespace-nowrap">
          <Zap className="w-3.5 h-3.5 text-amber-400" /> Test Attack Vector Triggers:
        </span>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => triggerSimulatedAttack('BRUTE_FORCE', 'MEDIUM', 22)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-slate-300 font-mono"
                    >
                        SSH Brute Force
                    </button>
                    <button
                        onClick={() => triggerSimulatedAttack('MALWARE_DROP', 'CRITICAL', 443)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-slate-300 font-mono"
                    >
                        Malware Payload Drop
                    </button>
                    <button
                        onClick={() => triggerSimulatedAttack('SYN_FLOOD', 'HIGH', 80)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-slate-300 font-mono"
                    >
                        SYN Flood Attack
                    </button>
                </div>
            </div>

            {/* MAIN LAYOUT GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* LEFT COLUMN: 15 DEFENSE TOOL CONTROLS (7 COLS) */}
                <div className="lg:col-span-7 space-y-4">
                    {/* MAIN 15 INTERACTIVE TOOL GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* 1. FIREWALL UPGRADE */}
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                            <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400" /> Firewall Policy
            </span>
                                <span className="text-xs font-mono text-blue-400">{defenseState.firewallUpgrade.level}</span>
                            </div>
                            <p className="text-xs text-slate-400">Cycle through perimeter firewall rule strictness.</p>
                            <div className="flex gap-1.5 pt-1">
                                {(['STANDARD', 'STRICT', 'ZERO_TRUST'] as const).map((lvl) => (
                                    <button
                                        key={lvl}
                                        onClick={() => toggleDefense('firewallUpgrade', { level: lvl })}
                                        className={`flex-1 py-1 text-[10px] font-mono rounded border transition-all ${
                                            defenseState.firewallUpgrade.level === lvl
                                                ? 'bg-blue-600 border-blue-400 text-white font-bold'
                                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                                        }`}
                                    >
                                        {lvl}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 2. TRAFFIC FILTER */}
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                            <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" /> Traffic Filter Rate
            </span>
                                <span className="text-xs font-mono text-cyan-400">{defenseState.trafficFilter.rateLimitMbps} Mbps</span>
                            </div>
                            <p className="text-xs text-slate-400">Adjust max allowable incoming bandwidth threshold.</p>
                            <input
                                type="range"
                                min="10"
                                max="500"
                                value={defenseState.trafficFilter.rateLimitMbps}
                                onChange={(e) => toggleDefense('trafficFilter', { rateLimitMbps: Number(e.target.value) })}
                                className="w-full accent-cyan-500 cursor-pointer"
                            />
                        </div>

                        {/* 3. IP BLOCK */}
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                            <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <UserX className="w-4 h-4 text-red-400" /> IP Blacklist
            </span>
                                <span className="text-xs font-mono text-red-400">{defenseState.ipBlock.blacklistedIps.length} Banned</span>
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="e.g. 192.168.1.50"
                                    value={manualIp}
                                    onChange={(e) => setManualIp(e.target.value)}
                                    className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs font-mono w-full text-slate-200 focus:outline-none focus:border-red-500"
                                />
                                <button
                                    onClick={() => {
                                        if (manualIp) {
                                            toggleDefense('ipBlock', { ip: manualIp });
                                            setManualIp('');
                                        }
                                    }}
                                    className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-mono font-bold"
                                >
                                    Block
                                </button>
                            </div>
                        </div>

                        {/* 4. WIRESHARK */}
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                            <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-400" /> Wireshark PCAP
            </span>
                                <button
                                    onClick={() => setActiveModal('wireshark')}
                                    className="text-xs text-indigo-400 hover:underline font-mono"
                                >
                                    Inspect Packets
                                </button>
                            </div>
                            <p className="text-xs text-slate-400">Captured Packets: <span className="font-mono text-slate-200">{defenseState.wireshark.packetCount}</span></p>
                        </div>

                        {/* 5. YARA RULE ENGINE */}
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                            <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <FileCode className="w-4 h-4 text-amber-400" /> YARA Rules
            </span>
                                <button
                                    onClick={() => setActiveModal('yara')}
                                    className="text-xs text-amber-400 hover:underline font-mono"
                                >
                                    Configure Rules
                                </button>
                            </div>
                            <p className="text-xs text-slate-400">{defenseState.yara.loadedRules.length} Active Signatures Loaded</p>
                        </div>

                        {/* 6. IDS/IPS MODE */}
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                            <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-purple-400" /> IDS / IPS Engine
            </span>
                                <span className="text-xs font-mono text-purple-400">{defenseState.idsIps.mode}</span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => toggleDefense('idsIps', { mode: 'PASSIVE_IDS' })}
                                    className={`flex-1 py-1 text-[10px] font-mono rounded border ${
                                        defenseState.idsIps.mode === 'PASSIVE_IDS'
                                            ? 'bg-purple-600 text-white font-bold'
                                            : 'bg-slate-950 border-slate-800 text-slate-400'
                                    }`}
                                >
                                    Passive Log
                                </button>
                                <button
                                    onClick={() => toggleDefense('idsIps', { mode: 'ACTIVE_IPS' })}
                                    className={`flex-1 py-1 text-[10px] font-mono rounded border ${
                                        defenseState.idsIps.mode === 'ACTIVE_IPS'
                                            ? 'bg-purple-600 text-white font-bold'
                                            : 'bg-slate-950 border-slate-800 text-slate-400'
                                    }`}
                                >
                                    Active Drop
                                </button>
                            </div>
                        </div>

                        {/* 7. HONEYPOT DECOYS */}
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                            <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Server className="w-4 h-4 text-yellow-400" /> Honeypots
            </span>
                                <button
                                    onClick={() => setActiveModal('honeypot')}
                                    className="text-xs text-yellow-400 hover:underline font-mono"
                                >
                                    Manage Traps
                                </button>
                            </div>
                            <p className="text-xs text-slate-400">Active Decoy Traps: <span className="font-mono text-yellow-400">{defenseState.honeypot.activeTraps}</span></p>
                        </div>

                        {/* 8. AUTO PATCH */}
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                            <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-teal-400" /> Auto-Patching
            </span>
                                <button
                                    onClick={() => toggleDefense('autoPatch')}
                                    className={`px-3 py-1 rounded text-xs font-mono font-bold ${
                                        defenseState.autoPatch.enabled ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                                    }`}
                                >
                                    {defenseState.autoPatch.enabled ? 'ON' : 'OFF'}
                                </button>
                            </div>
                            <p className="text-xs text-slate-400">Automatically patches known CVE vulnerabilities upon detection.</p>
                        </div>

                        {/* 9. TRACEBACK ORIGIN */}
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                            <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <History className="w-4 h-4 text-cyan-400" /> IP Traceback
            </span>
                                <button
                                    onClick={() => setActiveModal('traceback')}
                                    className="text-xs text-cyan-400 hover:underline font-mono"
                                >
                                    Execute Trace
                                </button>
                            </div>
                            <p className="text-xs text-slate-400">Trace malicious traffic back through upstream ISP hops.</p>
                        </div>
                    </div>

                    {/* DYNAMIC INTERACTIVE TOOL MODAL OVERLAYS */}
                    <AnimatePresence>
                        {activeModal && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                            >
                                <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl p-6 space-y-4 relative shadow-2xl">
                                    <button
                                        onClick={() => setActiveModal(null)}
                                        className="absolute top-4 right-4 text-slate-400 hover:text-white"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>

                                    {/* WIRESHARK MODAL */}
                                    {activeModal === 'wireshark' && (
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-bold text-indigo-400 flex items-center gap-2">
                                                <Eye className="w-5 h-5" /> Wireshark Packet Inspection
                                            </h3>
                                            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs space-y-1 h-60 overflow-y-auto">
                                                <p className="text-slate-500">10:42:01.002 ETH0 IP 192.168.1.105.80 &gt; 10.0.0.5.54122: Flags [S], seq 1049281</p>
                                                <p className="text-slate-500">10:42:01.005 ETH0 IP 192.168.1.105.80 &gt; 10.0.0.5.54123: Flags [S], seq 1049282</p>
                                                <p className="text-red-400">10:42:02.110 ETH0 [SYN FLOOD DETECTED] High packet density on port 80</p>
                                            </div>
                                            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-mono flex items-center gap-2">
                                                <Download className="w-4 h-4" /> Export Captured .pcap Dump
                                            </button>
                                        </div>
                                    )}

                                    {/* YARA MODAL */}
                                    {activeModal === 'yara' && (
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2">
                                                <FileCode className="w-5 h-5" /> Edit YARA Signatures
                                            </h3>
                                            <textarea
                                                value={yaraRuleCode}
                                                onChange={(e) => setYaraRuleCode(e.target.value)}
                                                className="w-full bg-slate-950 border border-slate-800 rounded p-3 font-mono text-xs text-amber-200 h-48 focus:outline-none focus:border-amber-500"
                                            />
                                            <button
                                                onClick={() => setActiveModal(null)}
                                                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-mono font-bold"
                                            >
                                                Compile &amp; Deploy Rule
                                            </button>
                                        </div>
                                    )}

                                    {/* TRACEBACK MODAL */}
                                    {activeModal === 'traceback' && (
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-bold text-cyan-400 flex items-center gap-2">
                                                <History className="w-5 h-5" /> Execute IP Origin Traceback
                                            </h3>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={traceIp}
                                                    onChange={(e) => setTraceIp(e.target.value)}
                                                    className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs font-mono w-full text-slate-200"
                                                />
                                                <button
                                                    onClick={runTraceback}
                                                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-mono font-bold"
                                                >
                                                    Trace
                                                </button>
                                            </div>
                                            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs space-y-1 h-40 overflow-y-auto">
                                                {traceHops.map((hop, idx) => (
                                                    <p key={idx} className="text-cyan-300">{hop}</p>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* RIGHT COLUMN: LIVE TELEMETRY, LOG STREAM & ANALYSIS DECK (5 COLS) */}
                <div className="lg:col-span-5 space-y-4">
                    {/* TOPOLOGY MAP */}
                    <NetworkTopologyMap
                        activeAlert={activeAlert}
                        defenseState={defenseState}
                    />

                    {/* LIVE ALERT NOTIFICATION BANNER */}
                    <AnimatePresence>
                        {activeAlert && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className={`p-3 rounded-xl border flex items-start gap-3 shadow-lg ${
                                    activeAlert.severity === 'CRITICAL'
                                        ? 'bg-red-950/80 border-red-500/50 text-red-200'
                                        : 'bg-amber-950/80 border-amber-500/50 text-amber-200'
                                }`}
                            >
                                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 animate-bounce" />
                                <div className="text-xs space-y-1 w-full">
                                    <div className="flex items-center justify-between font-mono font-bold">
                                        <span>INTRUSION ALERT: {activeAlert.attackType}</span>
                                        <span className="bg-red-500/20 px-1.5 py-0.5 rounded text-[10px] border border-red-500/30">
                      {activeAlert.severity}
                    </span>
                                    </div>
                                    <p className="font-mono text-[11px] opacity-90">
                                        Source: <span className="underline">{activeAlert.sourceIp}</span> | Port: {activeAlert.targetPort}
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* TELEMETRY CONSOLE DECK */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
                        {/* TAB SELECTOR */}
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setActiveTab('splunk')}
                                    className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                                        activeTab === 'splunk'
                                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                            : 'text-slate-400 hover:text-slate-200'
                                    }`}
                                >
                                    Splunk Logs
                                </button>
                                <button
                                    onClick={() => setActiveTab('wireshark')}
                                    className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                                        activeTab === 'wireshark'
                                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                            : 'text-slate-400 hover:text-slate-200'
                                    }`}
                                >
                                    Wireshark Stream
                                </button>
                                <button
                                    onClick={() => setActiveTab('yara')}
                                    className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                                        activeTab === 'yara'
                                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                            : 'text-slate-400 hover:text-slate-200'
                                    }`}
                                >
                                    YARA Rules
                                </button>
                            </div>

                            <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                <TerminalIcon className="w-3 h-3" /> LIVE STREAM
              </span>
                        </div>

                        {/* LOG STREAM DISPLAY */}
                        <div className="bg-slate-950 border border-slate-800/80 rounded-lg p-3 h-80 overflow-y-auto font-mono text-[11px] space-y-2">
                            {logs.length === 0 ? (
                                <div className="h-full flex items-center justify-center text-slate-600">
                                    Awaiting telemetry events...
                                </div>
                            ) : (
                                logs.map((log) => (
                                    <div
                                        key={log.id}
                                        className="flex items-start gap-2 border-b border-slate-900 pb-1.5 last:border-none"
                                    >
                                        <span className="text-slate-600 shrink-0">{log.timestamp}</span>
                                        <span
                                            className={`px-1 rounded text-[9px] font-bold shrink-0 ${
                                                log.level === 'ALERT'
                                                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                                    : log.level === 'BLOCKED'
                                                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                                        : 'bg-amber-500/20 text-amber-400'
                                            }`}
                                        >
                      {log.level}
                    </span>
                                        <span className="text-slate-300 break-all">{log.message}</span>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* HONEYPOT CAPTURED CREDENTIALS FEED */}
                        {defenseState.honeypot.caughtCredentials.length > 0 && (
                            <div className="bg-yellow-950/20 border border-yellow-500/30 rounded-lg p-2.5 text-xs space-y-1">
                <span className="text-yellow-400 font-mono font-bold flex items-center gap-1">
                  <Server className="w-3.5 h-3.5" /> Captured Honeypot Credentials:
                </span>
                                <div className="font-mono text-[11px] text-yellow-200/80 space-y-0.5">
                                    {defenseState.honeypot.caughtCredentials.map((cred, idx) => (
                                        <div key={idx} className="bg-yellow-950/40 px-2 py-0.5 rounded border border-yellow-500/20">
                                            {cred}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DefenseDashboard;