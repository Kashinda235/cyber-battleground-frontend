import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Wrench,
    ShieldCheck,
    HardDrive,
    Cpu,
    Activity,
    RefreshCw,
    Download,
    CheckCircle2,
    AlertTriangle,
    Clock,
    Database,
    Terminal,
    ArrowLeft,
    Check,
    Zap,
    Thermometer,
    Play,
    RotateCcw,
    FileCheck,
    Server,
    CloudUpload,
    Lock
} from 'lucide-react';

export default function MaintenancePanel({ onBack }: { onBack?: () => void }) {
    // ---------------------------------------------------------------------------
    // STATE MANAGEMENT
    // ---------------------------------------------------------------------------

    // 1. System Health Metrics
    const [healthScore] = useState(98);
    const [metrics, setMetrics] = useState({
        cpu: 24,
        ram: 42,
        disk: 61,
        temp: 45,
    });

    // Simulated live metric fluctuations
    useEffect(() => {
        const interval = setInterval(() => {
            setMetrics({
                cpu: Math.floor(18 + Math.random() * 15),
                ram: Math.floor(40 + Math.random() * 5),
                disk: 61,
                temp: Math.floor(43 + Math.random() * 4),
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // 2. System-Scan State
    const [scanType, setScanType] = useState<'quick' | 'deep' | 'integrity'>('quick');
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [scanStatus, setScanStatus] = useState('Idle');
    const [lastScan, setLastScan] = useState('Today, 08:30 UTC');

    const startScan = () => {
        setIsScanning(true);
        setScanProgress(0);
        setScanStatus('Initializing system integrity scan...');

        const interval = setInterval(() => {
            setScanProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsScanning(false);
                    setScanStatus('Scan complete. 0 threats detected.');
                    setLastScan('Just now');
                    return 100;
                }
                if (prev === 20) setScanStatus('Checking core system binaries...');
                if (prev === 50) setScanStatus('Verifying root filesystem integrity...');
                if (prev === 80) setScanStatus('Auditing open ports & active daemons...');
                return prev + 10;
            });
        }, 400);
    };

    // 3. Backup State
    const [isBackingUp, setIsBackingUp] = useState(false);
    const [backupProgress, setBackupProgress] = useState(0);
    const [autoBackup, setAutoBackup] = useState(true);
    const [backups, setBackups] = useState([
        { id: 'BK-9042', date: '2026-04-01 03:00', size: '42.8 GB', target: 'Remote S3 Vault', status: 'Verified' },
        { id: 'BK-9041', date: '2026-03-25 03:00', size: '42.1 GB', target: 'Local Encrypted NVMe', status: 'Verified' },
    ]);

    const triggerBackup = () => {
        setIsBackingUp(true);
        setBackupProgress(0);

        const interval = setInterval(() => {
            setBackupProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsBackingUp(false);
                    setBackups((prevList) => [
                        {
                            id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
                            date: new Date().toISOString().replace('T', ' ').substring(0, 16),
                            size: '43.2 GB',
                            target: 'Remote S3 Vault',
                            status: 'Verified',
                        },
                        ...prevList,
                    ]);
                    return 100;
                }
                return prev + 20;
            });
        }, 500);
    };

    // 4. Auto-Patch State
    const [autoPatchEnabled, setAutoPatchEnabled] = useState(true);
    const [patchWindow, setPatchWindow] = useState('02:00 UTC - Daily');
    const [patches, setPatches] = useState([
        { id: 'KB-9022', name: 'OpenSSL Security Patch (CVE-2026-1182)', severity: 'CRITICAL', size: '14.2 MB', installed: false },
        { id: 'KB-9023', name: 'Linux Kernel Zero-Day Mitigation 6.8.0', severity: 'HIGH', size: '128.5 MB', installed: false },
        { id: 'KB-9019', name: 'Systemd Security Update', severity: 'MEDIUM', size: '4.1 MB', installed: true },
    ]);

    const applyPatch = (id: string) => {
        setPatches((prev) =>
            prev.map((patch) => (patch.id === id ? { ...patch, installed: true } : patch))
        );
    };

    const applyAllPatches = () => {
        setPatches((prev) => prev.map((patch) => ({ ...patch, installed: true })));
    };

    // ---------------------------------------------------------------------------
    // RENDER
    // ---------------------------------------------------------------------------
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans antialiased selection:bg-indigo-500/30">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* HEADER & BACK NAV */}
                <header className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-slate-900/80 border border-slate-800 rounded-xl backdrop-blur-md gap-4">
                    <div className="flex items-center space-x-4">
                        {onBack && (
                            <button
                                onClick={onBack}
                                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors"
                                title="Return to Main Panel"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                        )}
                        <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
                            <Wrench className="w-7 h-7" />
                        </div>
                        <div>
                            <div className="flex items-center space-x-2">
                                <h1 className="text-xl font-bold tracking-wide text-white">SYSTEM MAINTENANCE SUBSYSTEM</h1>
                                <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-mono px-2 py-0.5 rounded font-semibold">
                  v2.4-CORE
                </span>
                            </div>
                            <p className="text-xs text-slate-400">Automated Diagnostics, Recovery Vault, & Security Patch Management</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 bg-slate-950/60 px-4 py-2 rounded-lg border border-slate-800">
                            <ShieldCheck className="w-5 h-5 text-emerald-400" />
                            <div>
                                <p className="text-[10px] uppercase tracking-wider text-slate-400">Overall Health</p>
                                <p className="font-mono font-bold text-emerald-400 text-sm">{healthScore}% OPTIMAL</p>
                            </div>
                        </div>
                        <button
                            onClick={startScan}
                            disabled={isScanning}
                            className="py-2 px-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-semibold text-xs rounded-lg transition-colors flex items-center space-x-2 shadow-lg shadow-amber-500/10"
                        >
                            <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
                            <span>{isScanning ? 'Scanning...' : 'Run Quick Diagnostic'}</span>
                        </button>
                    </div>
                </header>

                {/* TOP STATUS BAR: REAL-TIME HEALTH METRICS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                    {/* CPU Metric */}
                    <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
                        <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center space-x-1.5">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Processor Load</span>
              </span>
                            <span className="font-mono text-slate-200">{metrics.cpu}%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                            <motion.div
                                className="bg-cyan-500 h-full rounded-full"
                                animate={{ width: `${metrics.cpu}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>

                    {/* RAM Metric */}
                    <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
                        <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center space-x-1.5">
                <Activity className="w-4 h-4 text-indigo-400" />
                <span>Memory Usage</span>
              </span>
                            <span className="font-mono text-slate-200">{metrics.ram}%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                            <motion.div
                                className="bg-indigo-500 h-full rounded-full"
                                animate={{ width: `${metrics.ram}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>

                    {/* Disk Storage Metric */}
                    <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
                        <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center space-x-1.5">
                <HardDrive className="w-4 h-4 text-emerald-400" />
                <span>Root Partition</span>
              </span>
                            <span className="font-mono text-slate-200">{metrics.disk}%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${metrics.disk}%` }} />
                        </div>
                    </div>

                    {/* Thermal Metric */}
                    <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
                        <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center space-x-1.5">
                <Thermometer className="w-4 h-4 text-rose-400" />
                <span>Core Temperature</span>
              </span>
                            <span className="font-mono text-slate-200">{metrics.temp}°C</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                            <motion.div
                                className="bg-rose-500 h-full rounded-full"
                                animate={{ width: `${(metrics.temp / 90) * 100}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>

                </div>

                {/* 2x2 MAIN CONTROL GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* ================================================================= */}
                    {/* FEATURE 1: SYSTEM SCANNER */}
                    {/* ================================================================= */}
                    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
                        <div>
                            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                                <div className="flex items-center space-x-2.5">
                                    <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400">
                                        <FileCheck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h2 className="font-semibold text-slate-100 text-sm">System Diagnostics & Scanner</h2>
                                        <p className="text-[11px] text-slate-400">Deep file integrity & kernel audit</p>
                                    </div>
                                </div>
                                <span className="text-xs font-mono text-slate-500">Last: {lastScan}</span>
                            </div>

                            {/* Scan Mode Selection */}
                            <div className="grid grid-cols-3 gap-2 mb-4">
                                {[
                                    { id: 'quick', label: 'Quick Scan', desc: 'Core System' },
                                    { id: 'deep', label: 'Deep Scan', desc: 'Full Partition' },
                                    { id: 'integrity', label: 'Integrity', desc: 'Kernel Check' },
                                ].map((mode) => (
                                    <button
                                        key={mode.id}
                                        onClick={() => setScanType(mode.id as any)}
                                        className={`p-2.5 rounded-lg border text-left transition-all ${
                                            scanType === mode.id
                                                ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300'
                                                : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                                        }`}
                                    >
                                        <p className="text-xs font-semibold">{mode.label}</p>
                                        <p className="text-[10px] text-slate-500">{mode.desc}</p>
                                    </button>
                                ))}
                            </div>

                            {/* Scan Console Output */}
                            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 font-mono text-xs space-y-2">
                                <div className="flex items-center justify-between text-slate-400 text-[11px] border-b border-slate-800/80 pb-1.5">
                  <span className="flex items-center gap-1.5 text-cyan-400">
                    <Terminal className="w-3.5 h-3.5" /> Engine Status
                  </span>
                                    <span>{isScanning ? 'RUNNING' : 'READY'}</span>
                                </div>
                                <p className="text-slate-300 min-h-[36px] flex items-center">
                                    {isScanning ? (
                                        <span className="text-cyan-400 animate-pulse">&gt; {scanStatus}</span>
                                    ) : (
                                        <span className="text-slate-500">&gt; Engine operational. Select mode and initiate scan.</span>
                                    )}
                                </p>

                                {/* Progress Bar */}
                                {isScanning && (
                                    <div className="space-y-1 pt-1">
                                        <div className="flex justify-between text-[10px] text-slate-400">
                                            <span>Progress</span>
                                            <span>{scanProgress}%</span>
                                        </div>
                                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                            <motion.div
                                                className="bg-cyan-400 h-full"
                                                initial={{ width: '0%' }}
                                                animate={{ width: `${scanProgress}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={startScan}
                            disabled={isScanning}
                            className="w-full py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-lg shadow-cyan-600/20"
                        >
                            <Play className="w-4 h-4 fill-current" />
                            <span>{isScanning ? 'Scanning System...' : `Execute ${scanType.toUpperCase()} Scan`}</span>
                        </button>
                    </div>

                    {/* ================================================================= */}
                    {/* FEATURE 2: BACK-UP & RECOVERY */}
                    {/* ================================================================= */}
                    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
                        <div>
                            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                                <div className="flex items-center space-x-2.5">
                                    <div className="p-2 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-indigo-400">
                                        <Database className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h2 className="font-semibold text-slate-100 text-sm">Backup & Recovery Vault</h2>
                                        <p className="text-[11px] text-slate-400">Automated snapshot & recovery points</p>
                                    </div>
                                </div>

                                {/* Auto Backup Toggle */}
                                <div className="flex items-center space-x-2">
                                    <span className="text-xs text-slate-400">Auto-Schedule</span>
                                    <button
                                        onClick={() => setAutoBackup(!autoBackup)}
                                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                            autoBackup ? 'bg-indigo-500' : 'bg-slate-800'
                                        }`}
                                    >
                    <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        autoBackup ? 'translate-x-5' : 'translate-x-1'
                    }`} />
                                    </button>
                                </div>
                            </div>

                            {/* Progress Bar during Backup */}
                            {isBackingUp && (
                                <div className="bg-indigo-950/30 border border-indigo-500/30 p-3 rounded-lg mb-4 space-y-1.5">
                                    <div className="flex justify-between text-xs text-indigo-300 font-mono">
                    <span className="flex items-center gap-1.5">
                      <CloudUpload className="w-3.5 h-3.5 animate-bounce" /> Creating System Snapshot...
                    </span>
                                        <span>{backupProgress}%</span>
                                    </div>
                                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                        <motion.div
                                            className="bg-indigo-500 h-full"
                                            animate={{ width: `${backupProgress}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Restore Points History */}
                            <div className="space-y-2">
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Available Restore Points</p>
                                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                                    {backups.map((bk) => (
                                        <div key={bk.id} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs font-mono">
                                            <div className="flex items-center space-x-2.5">
                                                <Server className="w-4 h-4 text-slate-500" />
                                                <div>
                                                    <p className="text-slate-200 font-bold">{bk.id}</p>
                                                    <p className="text-[10px] text-slate-500">{bk.date} • {bk.size}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {bk.status}
                        </span>
                                                <button
                                                    onClick={() => alert(`Initiating restore sequence for ${bk.id}`)}
                                                    className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-indigo-400 transition-colors"
                                                    title="Restore to this snapshot"
                                                >
                                                    <RotateCcw className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={triggerBackup}
                            disabled={isBackingUp}
                            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/20"
                        >
                            <CloudUpload className="w-4 h-4" />
                            <span>{isBackingUp ? 'Generating Backup Snapshot...' : 'Create Snapshot Now'}</span>
                        </button>
                    </div>

                    {/* ================================================================= */}
                    {/* FEATURE 3: SYSTEM HEALTH & INTEGRITY */}
                    {/* ================================================================= */}
                    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
                        <div>
                            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                                <div className="flex items-center space-x-2.5">
                                    <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400">
                                        <Activity className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h2 className="font-semibold text-slate-100 text-sm">System Health & Integrity</h2>
                                        <p className="text-[11px] text-slate-400">Subsystem hardware & service diagnostics</p>
                                    </div>
                                </div>
                                <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  ALL PASS
                </span>
                            </div>

                            {/* Diagnostic Checklist */}
                            <div className="space-y-2 text-xs font-mono">
                                {[
                                    { name: 'Secure Boot & TPM 2.0 Module', status: 'Active & Verified', ok: true },
                                    { name: 'Root File System Permissions', status: 'Read-Only Hardened', ok: true },
                                    { name: 'Kernel Memory Isolation (KPTI)', status: 'Protection Active', ok: true },
                                    { name: 'Swap Space & Page File Encryption', status: 'AES-256 Enabled', ok: true },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/60">
                    <span className="text-slate-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        {item.name}
                    </span>
                                        <span className="text-[10px] text-slate-400">{item.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-indigo-400" /> Integrity Monitoring Mode
              </span>
                            <span className="text-emerald-400 font-mono font-semibold">STRICT / ACTIVE</span>
                        </div>
                    </div>

                    {/* ================================================================= */}
                    {/* FEATURE 4: AUTO-PATCH & VULNERABILITIES */}
                    {/* ================================================================= */}
                    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
                        <div>
                            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                                <div className="flex items-center space-x-2.5">
                                    <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
                                        <Zap className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h2 className="font-semibold text-slate-100 text-sm">Auto-Patch & Vulnerabilities</h2>
                                        <p className="text-[11px] text-slate-400">Automated security hotfix deployment</p>
                                    </div>
                                </div>

                                {/* Auto Patch Switch */}
                                <div className="flex items-center space-x-2">
                                    <span className="text-xs text-slate-400">Auto-Apply</span>
                                    <button
                                        onClick={() => setAutoPatchEnabled(!autoPatchEnabled)}
                                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                            autoPatchEnabled ? 'bg-amber-500' : 'bg-slate-800'
                                        }`}
                                    >
                    <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        autoPatchEnabled ? 'translate-x-5' : 'translate-x-1'
                    }`} />
                                    </button>
                                </div>
                            </div>

                            {/* Patches List */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-xs text-slate-400">
                                    <span>Pending Hotfixes</span>
                                    <span className="text-[10px] font-mono text-slate-500">Window: {patchWindow}</span>
                                </div>

                                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                                    {patches.map((patch) => (
                                        <div
                                            key={patch.id}
                                            className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs"
                                        >
                                            <div className="space-y-0.5">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono font-bold text-slate-200">{patch.id}</span>
                                                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                                                        patch.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                                                            patch.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                                                                'bg-slate-800 text-slate-300'
                                                    }`}>
                            {patch.severity}
                          </span>
                                                </div>
                                                <p className="text-[11px] text-slate-400 truncate max-w-[220px]">{patch.name}</p>
                                            </div>

                                            {patch.installed ? (
                                                <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                          <Check className="w-3.5 h-3.5" /> Installed
                        </span>
                                            ) : (
                                                <button
                                                    onClick={() => applyPatch(patch.id)}
                                                    className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded text-[11px] font-mono transition-colors"
                                                >
                                                    Install
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={applyAllPatches}
                            className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/10"
                        >
                            <Download className="w-4 h-4" />
                            <span>Apply All Available Patches</span>
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
}