import React, { useState } from 'react';

/**
 * IDS Panel Component
 * Features: Real-time IDS Threat Stream, Forensic Traceback Engine, and Dual-Auth Emergency Lockdown.
 */
export default function IDSPanel() {
    const [activeTab, setActiveTab] = useState('ids');
    const [isLockdownActive, setIsLockdownActive] = useState(false);
    const [confirmLockdown, setConfirmLockdown] = useState(false);

    // Traceback state
    const [searchIp, setSearchIp] = useState('185.220.101.5');
    const [isTracing, setIsTracing] = useState(false);

    // Simulated IDS Alerts
    const [alerts] = useState([
        { id: 'ALT-9041', type: 'SQL Injection (Blind)', source: '45.33.32.156', target: '/api/v1/auth', severity: 'CRITICAL', time: '13:42:01' },
        { id: 'ALT-9042', type: 'SYN Flood / Port Sweep', source: '185.220.101.5', target: 'Port 443/8080', severity: 'HIGH', time: '13:43:18' },
        { id: 'ALT-9043', type: 'SSH Brute Force Attack', source: '103.21.244.12', target: '10.0.0.4:22', severity: 'MEDIUM', time: '13:44:50' },
        { id: 'ALT-9044', type: 'Anomalous Payload Size', source: '192.168.1.108', target: '/upload', severity: 'LOW', time: '13:45:10' },
    ]);

    const handleTrace = (e) => {
        e.preventDefault();
        setIsTracing(true);
        setTimeout(() => setIsTracing(false), 1000);
    };

    const triggerLockdown = () => {
        setIsLockdownActive(true);
        setConfirmLockdown(false);
    };

    const releaseLockdown = () => {
        setIsLockdownActive(false);
    };

    return (
        <div className="w-full max-w-6xl mx-auto bg-slate-950 text-slate-100 rounded-xl border border-slate-800 shadow-2xl overflow-hidden font-mono">
            {/* Top Banner / System Status Header */}
            <div className={`px-6 py-4 border-b flex items-center justify-between transition-colors duration-300 ${
                isLockdownActive ? 'bg-red-950/80 border-red-800 text-red-200' : 'bg-slate-900 border-slate-800'
            }`}>
                <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${isLockdownActive ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`} />
                    <h1 className="text-lg font-bold tracking-wider uppercase">
                        System Security Control Center <span className="text-xs text-slate-400 font-normal">v2.4</span>
                    </h1>
                </div>
                <div className="flex items-center gap-4 text-xs">
          <span className="px-2.5 py-1 bg-slate-800 rounded border border-slate-700">
            ENGINE STATUS: <strong className={isLockdownActive ? "text-red-400" : "text-emerald-400"}>
              {isLockdownActive ? "ISOLATED" : "ACTIVE MONITORING"}
            </strong>
          </span>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-900/50">
                <button
                    onClick={() => setActiveTab('ids')}
                    className={`flex-1 py-3 px-4 text-sm font-semibold tracking-wide transition-all border-b-2 ${
                        activeTab === 'ids'
                            ? 'border-cyan-500 bg-slate-800/60 text-cyan-400'
                            : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                    }`}
                >
                    [ 01. IDS MONITOR ]
                </button>
                <button
                    onClick={() => setActiveTab('traceback')}
                    className={`flex-1 py-3 px-4 text-sm font-semibold tracking-wide transition-all border-b-2 ${
                        activeTab === 'traceback'
                            ? 'border-cyan-500 bg-slate-800/60 text-cyan-400'
                            : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                    }`}
                >
                    [ 02. FORENSIC TRACEBACK ]
                </button>
                <button
                    onClick={() => setActiveTab('lockdown')}
                    className={`flex-1 py-3 px-4 text-sm font-semibold tracking-wide transition-all border-b-2 ${
                        activeTab === 'lockdown'
                            ? 'border-red-500 bg-red-950/40 text-red-400'
                            : 'border-transparent text-slate-400 hover:text-red-400 hover:bg-red-950/20'
                    }`}
                >
                    [ 03. EMERGENCY LOCKDOWN ]
                </button>
            </div>

            {/* Panel Body */}
            <div className="p-6">
                {/* TAB 1: IDS MONITOR */}
                {activeTab === 'ids' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
                                <div className="text-xs text-slate-400 uppercase">Threat Level</div>
                                <div className="text-2xl font-bold text-amber-400 mt-1">ELEVATED</div>
                            </div>
                            <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
                                <div className="text-xs text-slate-400 uppercase">Active Detection Rules</div>
                                <div className="text-2xl font-bold text-cyan-400 mt-1">1,428</div>
                            </div>
                            <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
                                <div className="text-xs text-slate-400 uppercase">Blocked Connections (24h)</div>
                                <div className="text-2xl font-bold text-emerald-400 mt-1">9,841</div>
                            </div>
                            <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
                                <div className="text-xs text-slate-400 uppercase">Packet Inspection Rate</div>
                                <div className="text-2xl font-bold text-slate-200 mt-1">4.2 Gbps</div>
                            </div>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
                            <div className="px-4 py-3 bg-slate-900/80 border-b border-slate-800 text-xs font-bold text-slate-400 tracking-wider">
                                LIVE INTRUSION ALERT STREAM
                            </div>
                            <div className="divide-y divide-slate-800/60">
                                {alerts.map((alert) => (
                                    <div key={alert.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-2 hover:bg-slate-800/40 transition-colors">
                                        <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                          alert.severity === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-800' :
                              alert.severity === 'HIGH' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                                  'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}>
                        {alert.severity}
                      </span>
                                            <div>
                                                <div className="text-sm font-semibold text-slate-200">{alert.type}</div>
                                                <div className="text-xs text-slate-400">Target: {alert.target}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6 text-xs text-slate-400">
                                            <div>SRC: <span className="text-cyan-400">{alert.source}</span></div>
                                            <div>{alert.time}</div>
                                            <button
                                                onClick={() => { setSearchIp(alert.source); setActiveTab('traceback'); }}
                                                className="px-2.5 py-1 bg-slate-800 hover:bg-cyan-900/50 hover:text-cyan-300 text-slate-300 rounded border border-slate-700 transition"
                                            >
                                                Trace Origin →
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 2: FORENSIC TRACEBACK */}
                {activeTab === 'traceback' && (
                    <div className="space-y-6">
                        <form onSubmit={handleTrace} className="flex gap-3">
                            <input
                                type="text"
                                value={searchIp}
                                onChange={(e) => setSearchIp(e.target.value)}
                                placeholder="Enter Target IPv4 / IPv6 Address"
                                className="flex-1 bg-slate-900 border border-slate-800 rounded px-4 py-2 text-sm text-cyan-300 focus:outline-none focus:border-cyan-500 font-mono"
                            />
                            <button
                                type="submit"
                                disabled={isTracing}
                                className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded text-sm transition"
                            >
                                {isTracing ? 'Tracing Route...' : 'Initiate Traceback'}
                            </button>
                        </form>

                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-6">
                            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3">
                                <span>QUERY TARGET: <strong className="text-cyan-400">{searchIp}</strong></span>
                                <span>ORIGIN GEO: <strong className="text-slate-200">Frankfurt, DE (AS14061)</strong></span>
                                <span>REPUTATION SCORE: <strong className="text-red-400">12/100 (Malicious)</strong></span>
                            </div>

                            {/* Hop Breakdown */}
                            <div className="space-y-4">
                                <div className="text-xs font-bold text-slate-400 tracking-wider">NETWORK HOP SEQUENCE</div>
                                <div className="relative pl-6 space-y-6 border-l-2 border-slate-800">
                                    <div className="relative">
                                        <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-red-500 border-4 border-slate-950" />
                                        <div className="text-xs font-bold text-red-400">HOP 1: ATTACKER SOURCE NODE</div>
                                        <div className="text-sm font-mono text-slate-300 mt-0.5">{searchIp} [Tor Exit Relay]</div>
                                        <div className="text-xs text-slate-500">Latency: -- | Packet Size: 1420 bytes</div>
                                    </div>

                                    <div className="relative">
                                        <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-amber-500 border-4 border-slate-950" />
                                        <div className="text-xs font-bold text-amber-400">HOP 2: INTERMEDIATE PROXY</div>
                                        <div className="text-sm font-mono text-slate-300 mt-0.5">62.210.180.22 [AS2500 France]</div>
                                        <div className="text-xs text-slate-500">Latency: 28ms | TCP SYN Forwarded</div>
                                    </div>

                                    <div className="relative">
                                        <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-cyan-500 border-4 border-slate-950" />
                                        <div className="text-xs font-bold text-cyan-400">HOP 3: INGRESS EDGE FIREWALL</div>
                                        <div className="text-sm font-mono text-slate-300 mt-0.5">172.16.0.1 [Edge-Router-01]</div>
                                        <div className="text-xs text-slate-500">Latency: 41ms | Rule #402 Flagged</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 3: EMERGENCY LOCKDOWN */}
                {activeTab === 'lockdown' && (
                    <div className="space-y-6">
                        <div className={`p-6 rounded-xl border transition-all ${
                            isLockdownActive
                                ? 'bg-red-950/40 border-red-800 text-red-200'
                                : 'bg-slate-900 border-slate-800'
                        }`}>
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-xl font-bold tracking-wide">
                                        {isLockdownActive ? "🚨 EMERGENCY AIR-GAP ACTIVE" : "EMERGENCY ISOLATION SWITCH"}
                                    </h2>
                                    <p className="text-xs text-slate-400 mt-1 max-w-xl">
                                        Activating lockdown immediately terminates all active external ingress/egress connections, drops non-whitelisted SSH sessions, and restricts internal DB nodes to read-only state.
                                    </p>
                                </div>
                                <div className={`px-3 py-1 rounded text-xs font-bold border ${
                                    isLockdownActive ? 'bg-red-600 text-white border-red-500' : 'bg-slate-800 text-slate-400 border-slate-700'
                                }`}>
                                    {isLockdownActive ? 'STATE: ISOLATED' : 'STATE: NORMAL OPERATION'}
                                </div>
                            </div>

                            <div className="mt-8 border-t border-slate-800/80 pt-6">
                                {!isLockdownActive ? (
                                    !confirmLockdown ? (
                                        <button
                                            onClick={() => setConfirmLockdown(true)}
                                            className="w-full py-4 bg-red-700 hover:bg-red-600 text-white font-bold rounded-lg tracking-wider text-sm transition shadow-lg shadow-red-950/50"
                                        >
                                            ENGAGE EMERGENCY LOCKDOWN PROTOCOL
                                        </button>
                                    ) : (
                                        <div className="p-4 bg-red-950 border border-red-800 rounded-lg space-y-4">
                                            <div className="text-sm font-bold text-red-300 text-center">
                                                ⚠️ CONFIRM LOCKDOWN ACTION: THIS WILL DISCONNECT EXTERNAL TRAFFIC IMMEDIATELY
                                            </div>
                                            <div className="flex gap-4">
                                                <button
                                                    onClick={triggerLockdown}
                                                    className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded text-xs tracking-wider transition"
                                                >
                                                    CONFIRM & ISOLATE
                                                </button>
                                                <button
                                                    onClick={() => setConfirmLockdown(false)}
                                                    className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded text-xs tracking-wider transition"
                                                >
                                                    CANCEL
                                                </button>
                                            </div>
                                        </div>
                                    )
                                ) : (
                                    <button
                                        onClick={releaseLockdown}
                                        className="w-full py-4 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-lg tracking-wider text-sm transition"
                                    >
                                        RELEASE LOCKDOWN & RESTORE NETWORK BRIDGES
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Lockdown Sub-routine Status Checklist */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                            <div className="bg-slate-900 p-4 border border-slate-800 rounded">
                                <div className="text-slate-400">Ingress Ports (80/443)</div>
                                <div className={`font-bold mt-1 ${isLockdownActive ? 'text-red-400' : 'text-emerald-400'}`}>
                                    {isLockdownActive ? 'CLOSED (DROP ALL)' : 'OPEN / FILTERED'}
                                </div>
                            </div>
                            <div className="bg-slate-900 p-4 border border-slate-800 rounded">
                                <div className="text-slate-400">Database Writes</div>
                                <div className={`font-bold mt-1 ${isLockdownActive ? 'text-amber-400' : 'text-emerald-400'}`}>
                                    {isLockdownActive ? 'READ-ONLY LOCK' : 'READ / WRITE'}
                                </div>
                            </div>
                            <div className="bg-slate-900 p-4 border border-slate-800 rounded">
                                <div className="text-slate-400">Active User Sessions</div>
                                <div className={`font-bold mt-1 ${isLockdownActive ? 'text-red-400' : 'text-slate-200'}`}>
                                    {isLockdownActive ? 'TERMINATED' : '142 CONNECTED'}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}