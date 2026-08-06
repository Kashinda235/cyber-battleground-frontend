import React, { useState } from 'react';

/**
 * Honeypot Control Panel Component
 * Features: Active Trap Emulators, Decoy File Tripwires, and Real-time Incident Alerts.
 */
export default function HoneypotPanel() {
    const [activeTab, setActiveTab] = useState('traps');

    // Emulated Honeypot Services State
    const [traps, setTraps] = useState([
        { id: 'TRAP-01', name: 'Fake OpenSSH Server', port: '2222', type: 'SSH Interaction', status: 'ACTIVE', sessions: 14, vulnerability: 'CVE-2023-38408 (Emulated)' },
        { id: 'TRAP-02', name: 'Deceptive MySQL DB', port: '3306', type: 'Database Trap', status: 'ACTIVE', sessions: 6, vulnerability: 'Weak Admin Creds' },
        { id: 'TRAP-03', name: 'High-Interaction Web App', port: '8080', type: 'HTTP / Admin Portal', status: 'ACTIVE', sessions: 32, vulnerability: 'Exposed /admin/config' },
        { id: 'TRAP-04', name: 'Fake FTP Storage', port: '21', type: 'File Transfer', status: 'PAUSED', sessions: 0, vulnerability: 'Anonymous Access' },
    ]);

    // Decoy Files / Canary Tokens State
    const [decoys, setDecoys] = useState([
        { id: 'DEC-101', filename: 'db_passwords_2026.xlsx', location: '/var/www/backup/', type: 'Excel Spreadsheet', triggers: 8, status: 'ARMED', sensor: 'File Access Hook' },
        { id: 'DEC-102', filename: 'id_rsa_root_backup.pem', location: '/home/ubuntu/.ssh/', type: 'RSA Private Key', triggers: 3, status: 'ARMED', sensor: 'Canary Token API' },
        { id: 'DEC-103', filename: 'aws_access_keys.json', location: '/etc/config/cloud/', type: 'JSON Credentials', triggers: 12, status: 'TRIGGERED', sensor: 'AWS AuditLog Watch' },
        { id: 'DEC-104', filename: 'employee_payroll.pdf', location: '/shared/finance/', type: 'PDF Document', triggers: 0, status: 'ARMED', sensor: 'Web Beacon' },
    ]);

    // Honeypot Interaction Alerts Stream
    const [alerts, setAlerts] = useState([
        { id: 'ALT-801', target: 'db_passwords_2026.xlsx', attackerIp: '185.220.101.9', action: 'File Opened & Scraped', severity: 'CRITICAL', timestamp: '14:10:02' },
        { id: 'ALT-802', target: 'Fake OpenSSH Server', attackerIp: '45.33.32.112', action: 'Brute-force Attempt (root:123456)', severity: 'HIGH', timestamp: '14:12:45' },
        { id: 'ALT-803', target: 'aws_access_keys.json', attackerIp: '103.21.244.55', action: 'API Key Usage Detected in US-East', severity: 'CRITICAL', timestamp: '14:15:18' },
        { id: 'ALT-804', target: 'Deceptive MySQL DB', attackerIp: '192.168.1.140', action: 'SQL Dump Executed', severity: 'MEDIUM', timestamp: '14:18:03' },
    ]);

    // Form State for Deploying Decoy
    const [newFileName, setNewFileName] = useState('');
    const [newFilePath, setNewFilePath] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);

    const toggleTrapStatus = (id) => {
        setTraps(traps.map(trap =>
            trap.id === id
                ? { ...trap, status: trap.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' }
                : trap
        ));
    };

    const handleAddDecoy = (e) => {
        e.preventDefault();
        if (!newFileName || !newFilePath) return;

        const newEntry = {
            id: `DEC-${100 + decoys.length + 1}`,
            filename: newFileName,
            location: newFilePath,
            type: 'Custom Honeytoken',
            triggers: 0,
            status: 'ARMED',
            sensor: 'Inotify Kernel Watch'
        };

        setDecoys([newEntry, ...decoys]);
        setNewFileName('');
        setNewFilePath('');
        setShowAddModal(false);
    };

    return (
        <div className="w-full max-w-6xl mx-auto bg-slate-950 text-slate-100 rounded-xl border border-slate-800 shadow-2xl overflow-hidden font-mono">
            {/* Header Banner */}
            <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
                    <h1 className="text-lg font-bold tracking-wider uppercase text-slate-100">
                        Deception & Honeypot Operations <span className="text-xs text-amber-400 font-normal">v1.8</span>
                    </h1>
                </div>
                <div className="flex items-center gap-3 text-xs">
          <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded text-slate-300">
            ACTIVE TRAPS: <strong className="text-amber-400">{traps.filter(t => t.status === 'ACTIVE').length}/{traps.length}</strong>
          </span>
                    <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded text-slate-300">
            HONEYTOKENS: <strong className="text-cyan-400">{decoys.length} DEPLOYED</strong>
          </span>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-900/50">
                <button
                    onClick={() => setActiveTab('traps')}
                    className={`flex-1 py-3 px-4 text-sm font-semibold tracking-wide transition-all border-b-2 ${
                        activeTab === 'traps'
                            ? 'border-amber-500 bg-slate-800/60 text-amber-400'
                            : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                    }`}
                >
                    [ 01. HONEYPOT SERVICES ]
                </button>
                <button
                    onClick={() => setActiveTab('decoys')}
                    className={`flex-1 py-3 px-4 text-sm font-semibold tracking-wide transition-all border-b-2 ${
                        activeTab === 'decoys'
                            ? 'border-cyan-500 bg-slate-800/60 text-cyan-400'
                            : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                    }`}
                >
                    [ 02. DECOY FILES ]
                </button>
                <button
                    onClick={() => setActiveTab('alerts')}
                    className={`flex-1 py-3 px-4 text-sm font-semibold tracking-wide transition-all border-b-2 ${
                        activeTab === 'alerts'
                            ? 'border-red-500 bg-red-950/40 text-red-400'
                            : 'border-transparent text-slate-400 hover:text-red-400 hover:bg-red-950/20'
                    }`}
                >
                    [ 03. TRIPWIRE ALERTS ]
                </button>
            </div>

            {/* Main Content Area */}
            <div className="p-6">
                {/* TAB 1: HONEYPOT SERVICES */}
                {activeTab === 'traps' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
                                <div className="text-xs text-slate-400 uppercase">Interactive Sessions</div>
                                <div className="text-2xl font-bold text-amber-400 mt-1">52</div>
                            </div>
                            <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
                                <div className="text-xs text-slate-400 uppercase">Captured Payloads</div>
                                <div className="text-2xl font-bold text-cyan-400 mt-1">118</div>
                            </div>
                            <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
                                <div className="text-xs text-slate-400 uppercase">Avg Attacker Dwell Time</div>
                                <div className="text-2xl font-bold text-slate-200 mt-1">4m 12s</div>
                            </div>
                            <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
                                <div className="text-xs text-slate-400 uppercase">Telemetry Engine</div>
                                <div className="text-2xl font-bold text-emerald-400 mt-1">LOGGING</div>
                            </div>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
                            <div className="px-4 py-3 bg-slate-900/80 border-b border-slate-800 text-xs font-bold text-slate-400 tracking-wider">
                                EMULATED SERVICE TRAPS
                            </div>
                            <div className="divide-y divide-slate-800/60">
                                {traps.map((trap) => (
                                    <div key={trap.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-bold text-slate-200">{trap.name}</span>
                                                <span className="text-xs px-2 py-0.5 bg-slate-800 text-cyan-400 border border-slate-700 rounded">
                          Port {trap.port}
                        </span>
                                                <span className="text-xs text-slate-400">({trap.type})</span>
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                Vector: <span className="text-slate-400">{trap.vulnerability}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6 text-xs">
                                            <div className="text-slate-400">
                                                Captured Sessions: <strong className="text-slate-200">{trap.sessions}</strong>
                                            </div>
                                            <button
                                                onClick={() => toggleTrapStatus(trap.id)}
                                                className={`px-3 py-1.5 rounded font-bold border transition ${
                                                    trap.status === 'ACTIVE'
                                                        ? 'bg-emerald-950/60 border-emerald-800 text-emerald-400 hover:bg-emerald-900/50'
                                                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                                                }`}
                                            >
                                                {trap.status === 'ACTIVE' ? 'ONLINE' : 'OFFLINE'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 2: DECOY FILES */}
                {activeTab === 'decoys' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div className="text-xs text-slate-400">
                                Honeytokens emit alerts immediately upon file open, copy, or API invocation.
                            </div>
                            <button
                                onClick={() => setShowAddModal(!showAddModal)}
                                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded text-xs transition"
                            >
                                + Plant New Honeytoken
                            </button>
                        </div>

                        {/* Modal / Deploy Form */}
                        {showAddModal && (
                            <form onSubmit={handleAddDecoy} className="p-4 bg-slate-900 border border-cyan-800/60 rounded-lg space-y-4">
                                <div className="text-xs font-bold text-cyan-400 tracking-wider">DEPLOY NEW CANARY FILE</div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Filename (e.g. backup_keys.env)"
                                        value={newFileName}
                                        onChange={(e) => setNewFileName(e.target.value)}
                                        className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Path (e.g. /var/backup/)"
                                        value={newFilePath}
                                        onChange={(e) => setNewFilePath(e.target.value)}
                                        className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                                    />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded text-xs"
                                    >
                                        Deploy Canary
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Decoy File Table */}
                        <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-bold">
                                <tr>
                                    <th className="p-3">DECOY FILE</th>
                                    <th className="p-3">DEPLOY PATH</th>
                                    <th className="p-3">SENSOR METHOD</th>
                                    <th className="p-3">TRIGGERS</th>
                                    <th className="p-3">STATE</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60">
                                {decoys.map((decoy) => (
                                    <tr key={decoy.id} className="hover:bg-slate-800/40 transition-colors">
                                        <td className="p-3">
                                            <div className="font-bold text-slate-200">{decoy.filename}</div>
                                            <div className="text-[10px] text-slate-500">{decoy.type}</div>
                                        </td>
                                        <td className="p-3 text-cyan-400 font-mono">{decoy.location}</td>
                                        <td className="p-3 text-slate-400">{decoy.sensor}</td>
                                        <td className="p-3">
                        <span className={`font-bold ${decoy.triggers > 0 ? 'text-amber-400' : 'text-slate-500'}`}>
                          {decoy.triggers} Times
                        </span>
                                        </td>
                                        <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            decoy.status === 'TRIGGERED'
                                ? 'bg-red-950 text-red-400 border-red-800 animate-pulse'
                                : 'bg-emerald-950 text-emerald-400 border-emerald-800'
                        }`}>
                          {decoy.status}
                        </span>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* TAB 3: TRIPWIRE ALERTS */}
                {activeTab === 'alerts' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                            <span>CANARY & HONEYPOT EVENT LOGS</span>
                            <button
                                onClick={() => setAlerts([])}
                                className="hover:text-red-400 transition"
                            >
                                Clear Log View
                            </button>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden divide-y divide-slate-800/60">
                            {alerts.length === 0 ? (
                                <div className="p-8 text-center text-xs text-slate-500">
                                    No tripwire events currently logged.
                                </div>
                            ) : (
                                alerts.map((alert) => (
                                    <div key={alert.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-800/40 transition-colors">
                                        <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                          alert.severity === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-800' :
                              alert.severity === 'HIGH' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                                  'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}>
                        {alert.severity}
                      </span>
                                            <div>
                                                <div className="text-sm font-semibold text-slate-200">{alert.action}</div>
                                                <div className="text-xs text-slate-400">Target Asset: <span className="text-cyan-400">{alert.target}</span></div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6 text-xs text-slate-400">
                                            <div>SRC IP: <span className="text-amber-400 font-mono">{alert.attackerIp}</span></div>
                                            <div>{alert.timestamp}</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}