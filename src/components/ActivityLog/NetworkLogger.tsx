import { useState, useEffect, useMemo } from 'react';
import {
    Play, Pause, Trash2, Search, Shield,
    ShieldAlert, ShieldCheck, Activity, Copy, Check,
    AlertTriangle, ArrowLeft, ChevronRight
} from 'lucide-react';
import {INITIAL_LOGS, type LogItem} from "../../utils/logs.ts";


export default function NetworkLogger() {
    const [logs, setLogs] = useState<LogItem[]>(INITIAL_LOGS);
    const [isStreaming, setIsStreaming] = useState(true);
    const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [threatFilter, setThreatFilter] = useState('ALL');
    const [activeTab, setActiveTab] = useState('overview');
    const [copied, setCopied] = useState(false);

    // Simulated live traffic generation
    useEffect(() => {
        if (!isStreaming) return;

        const interval = setInterval(() => {
            const isThreat = Math.random() < 0.25;
            const protocols = ['HTTP/2', 'gRPC', 'TCP', 'WS'];
            const methods = ['GET', 'POST', 'PUT', 'DELETE'];
            const paths = ['/api/v1/user', '/api/v1/checkout', '/graphql', '/api/v1/auth', '/healthz'];
            const selectedProtocol = protocols[Math.floor(Math.random() * protocols.length)];
            const selectedMethod = methods[Math.floor(Math.random() * methods.length)];
            const selectedPath = paths[Math.floor(Math.random() * paths.length)];

            const newLog = {
                id: `log-${Date.now()}`,
                timestamp: new Date().toISOString(),
                method: selectedMethod,
                path: selectedPath,
                protocol: selectedProtocol,
                status: isThreat ? (Math.random() > 0.5 ? 429 : 403) : 200,
                latency: Math.floor(Math.random() * 80) + 5,
                sourceIp: `${Math.floor(Math.random() * 200) + 10}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
                destIp: '10.0.4.12',
                threatLevel: isThreat ? 'BLOCKED' : 'CLEAN',
                size: `${(Math.random() * 4 + 0.2).toFixed(1)} KB`,
                geo: isThreat ? 'RU / Moscow' : 'US / Ashburn',
                userAgent: isThreat ? 'Go-http-client/1.1' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
                arcjet: {
                    decision: isThreat ? 'DENY' : 'ALLOW',
                    rule: isThreat ? (Math.random() > 0.5 ? 'BOT_DETECTION' : 'RATE_LIMIT') : 'PASSTHROUGH',
                    botScore: isThreat ? 89 : 2,
                    shieldTriggered: isThreat
                },
                headers: {
                    'content-type': 'application/json',
                    'host': 'api.internal.service'
                },
                payload: JSON.stringify({ timestamp: Date.now(), stream: true }, null, 2),
                responseBody: isThreat
                    ? JSON.stringify({ error: 'Request blocked by security rules' }, null, 2)
                    : JSON.stringify({ status: 'ok', timestamp: Date.now() }, null, 2)
            };

            setLogs((prev) => [newLog, ...prev.slice(0, 49)]);
        }, 3000);

        return () => clearInterval(interval);
    }, [isStreaming]);

    const filteredLogs = useMemo(() => {
        return logs.filter((log) => {
            const matchesSearch =
                log.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
                log.sourceIp.includes(searchQuery) ||
                log.method.toLowerCase().includes(searchQuery.toLowerCase()) ||
                log.status.toString().includes(searchQuery);

            const matchesThreat = threatFilter === 'ALL' || log.threatLevel === threatFilter;

            return matchesSearch && matchesThreat;
        });
    }, [logs, searchQuery, threatFilter]);

    const selectedLog = useMemo(() => {
        return logs.find((l) => l.id === selectedLogId);
    }, [logs, selectedLogId]);

    const copyPayload = (text: string | undefined) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatTime = (isoString: string) => {
        const d = new Date(isoString);
        return d.toTimeString().split(' ')[0]; // Returns HH:MM:SS
    };

    return (
        <div className="flex flex-col h-full w-full bg-slate-950 text-slate-200 font-mono select-none overflow-hidden text-xs rounded-lg border border-slate-800">
            {/* --- HEADER --- */}
            <header className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800 shrink-0">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                    <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <span>NETWORK TRAFFIC</span>
                </div>

                <div className="flex items-center gap-1.5">
                    <button
                        onClick={() => setIsStreaming(!isStreaming)}
                        className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
                            isStreaming
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}
                    >
                        {isStreaming ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                        <span>{isStreaming ? 'LIVE' : 'PAUSED'}</span>
                    </button>
                    <button
                        onClick={() => setLogs([])}
                        className="p-1 rounded bg-slate-800 text-slate-400 hover:text-slate-200"
                        title="Clear Logs"
                    >
                        <Trash2 className="w-3 h-3" />
                    </button>
                </div>
            </header>

            {/* --- SEARCH & QUICK FILTERS --- */}
            {!selectedLog && (
                <div className="flex items-center justify-between gap-2 px-2.5 py-1.5 bg-slate-900/60 border-b border-slate-800 shrink-0">
                    <div className="relative flex-1">
                        <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search IP, method, path, status..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded pl-7 pr-2 py-0.5 text-slate-200 text-[11px] placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
                        />
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                        {['ALL', 'BLOCKED'].map((threat) => (
                            <button
                                key={threat}
                                onClick={() => setThreatFilter(threat)}
                                className={`px-1.5 py-0.5 rounded text-[10px] transition ${
                                    threatFilter === threat
                                        ? threat === 'BLOCKED'
                                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                            : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                                        : 'bg-slate-800/50 text-slate-400'
                                }`}
                            >
                                {threat}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* --- MAIN CONTENT AREA --- */}
            <div className="flex-1 overflow-hidden relative bg-slate-950">
                {selectedLog ? (
                    /* INSPECTOR VIEW */
                    <div className="absolute inset-0 flex flex-col bg-slate-900 z-10 overflow-hidden">
                        {/* Inspector Header */}
                        <div className="p-2 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
                            <button
                                onClick={() => setSelectedLogId(null)}
                                className="flex items-center gap-1 text-slate-400 hover:text-slate-100 font-semibold text-[11px]"
                            >
                                <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
                                <span>Back to Stream</span>
                            </button>
                            <span
                                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                    selectedLog.threatLevel === 'BLOCKED'
                                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                }`}
                            >
                {selectedLog.threatLevel}
              </span>
                        </div>

                        {/* Inspector Tabs */}
                        <div className="flex border-b border-slate-800 bg-slate-950/50 shrink-0">
                            {[
                                { id: 'overview', label: 'Overview' },
                                { id: 'arcjet', label: 'Arcjet' },
                                { id: 'headers', label: 'Headers' },
                                { id: 'payload', label: 'Body' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 py-1.5 text-center text-[10px] font-medium border-b-2 transition ${
                                        activeTab === tab.id
                                            ? 'border-cyan-400 text-cyan-300 bg-slate-900'
                                            : 'border-transparent text-slate-500 hover:text-slate-300'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Inspector Details */}
                        <div className="flex-1 overflow-y-auto p-3 space-y-3 text-slate-300 text-[11px]">
                            {activeTab === 'overview' && (
                                <div className="space-y-2">
                                    <div className="bg-slate-950 p-2.5 rounded border border-slate-800 space-y-1.5">
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Timestamp:</span>
                                            <span className="text-slate-200">{formatTime(selectedLog.timestamp)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Method:</span>
                                            <span className="font-bold text-cyan-400">{selectedLog.method}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Path:</span>
                                            <span className="text-slate-200 font-semibold truncate max-w-[180px]">
                        {selectedLog.path}
                      </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Status Code:</span>
                                            <span className={selectedLog.status >= 400 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                        {selectedLog.status}
                      </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Source IP:</span>
                                            <span className="text-cyan-400">{selectedLog.sourceIp}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Latency:</span>
                                            <span className="text-slate-200">{selectedLog.latency}ms</span>
                                        </div>
                                    </div>

                                    <div className="bg-slate-950 p-2.5 rounded border border-slate-800 space-y-1">
                                        <span className="text-slate-500 block text-[10px]">User-Agent</span>
                                        <p className="text-slate-400 break-all text-[10px] bg-slate-900 p-1 rounded">
                                            {selectedLog.userAgent}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'arcjet' && (
                                <div className="bg-slate-950 p-2.5 rounded border border-slate-800 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5">
                                            <Shield className="w-3.5 h-3.5 text-cyan-400" />
                                            <span className="font-bold text-slate-200">Decision</span>
                                        </div>
                                        <span
                                            className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                                                selectedLog.arcjet.decision === 'DENY'
                                                    ? 'bg-rose-500/20 text-rose-400'
                                                    : 'bg-emerald-500/20 text-emerald-400'
                                            }`}
                                        >
                      {selectedLog.arcjet.decision}
                    </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
                                        <div>
                                            <span className="text-slate-500 block text-[10px]">Rule</span>
                                            <span className="font-semibold text-slate-200">{selectedLog.arcjet.rule}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-500 block text-[10px]">Bot Score</span>
                                            <span className="font-semibold text-slate-200">{selectedLog.arcjet.botScore}/100</span>
                                        </div>
                                    </div>

                                    {selectedLog.arcjet.shieldTriggered && (
                                        <div className="p-2 bg-rose-950/30 border border-rose-500/30 rounded text-rose-300 text-[10px] mt-2">
                                            <div className="flex items-center gap-1 font-bold mb-0.5">
                                                <AlertTriangle className="w-3 h-3 text-rose-400" />
                                                <span>Shield Block</span>
                                            </div>
                                            <p className="text-slate-400">{selectedLog.arcjet.reason}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'headers' && (
                                <div className="bg-slate-950 p-2 rounded border border-slate-800 space-y-1">
                                    {Object.entries(selectedLog.headers).map(([k, v]) => (
                                        <div key={k} className="flex text-[10px] border-b border-slate-900/60 pb-0.5">
                                            <span className="text-cyan-400 w-1/3 truncate">{k}:</span>
                                            <span className="text-slate-300 w-2/3 truncate">{v}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'payload' && (
                                <div className="space-y-2">
                                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-slate-500 text-[10px]">Request Body</span>
                                            <button
                                                onClick={() => copyPayload(selectedLog.payload)}
                                                className="text-slate-400 hover:text-slate-200 flex items-center gap-1"
                                            >
                                                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                            </button>
                                        </div>
                                        <pre className="bg-slate-900 p-1.5 rounded text-emerald-400 text-[10px] overflow-x-auto">
                      {selectedLog.payload || '// Empty Body'}
                    </pre>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    /* LOG TABLE VIEW */
                    <div className="h-full overflow-y-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-900 text-slate-400 sticky top-0 z-10 border-b border-slate-800 text-[10px] uppercase">
                            <tr>
                                <th className="py-1.5 px-1.5 w-5"></th>
                                <th className="py-1.5 px-1.5 w-14">Time</th>
                                <th className="py-1.5 px-1 w-12">Method</th>
                                <th className="py-1.5 px-1 w-10">Status</th>
                                <th className="py-1.5 px-2 w-30">Path</th>
                                <th className="py-1.5 px-1 w-4"></th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-900/60">
                            {filteredLogs.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-slate-600">
                                        No matching logs
                                    </td>
                                </tr>
                            ) : (
                                filteredLogs.map((log) => (
                                    <tr
                                        key={log.id}
                                        onClick={() => setSelectedLogId(log.id)}
                                        className="cursor-pointer hover:bg-slate-900/60 transition-colors group"
                                    >
                                        <td className="py-1.5 px-1.5">
                                            {log.threatLevel === 'BLOCKED' ? (
                                                <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                                            ) : (
                                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/60" />
                                            )}
                                        </td>

                                        {/* Timestamp Column */}
                                        <td className="py-1.5 px-1.5 whitespace-nowrap text-slate-500 text-[10px]">
                                            {formatTime(log.timestamp)}
                                        </td>

                                        {/* HTTP Method Column */}
                                        <td className="py-1.5 px-1 whitespace-nowrap">
                        <span
                            className={`px-1 py-0.5 rounded text-[9px] font-bold ${
                                log.method === 'GET'
                                    ? 'bg-blue-500/10 text-blue-400'
                                    : log.method === 'POST'
                                        ? 'bg-purple-500/10 text-purple-400'
                                        : log.method === 'PUT'
                                            ? 'bg-amber-500/10 text-amber-400'
                                            : 'bg-rose-500/10 text-rose-400'
                            }`}
                        >
                          {log.method}
                        </span>
                                        </td>

                                        {/* Status Code Column */}
                                        <td className="py-1.5 px-1 whitespace-nowrap">
                        <span
                            className={`font-semibold ${
                                log.status >= 400 ? 'text-amber-400' : 'text-emerald-400'
                            }`}
                        >
                          {log.status}
                        </span>
                                        </td>

                                        {/* Path Column */}
                                        <td className="py-1.5 px-2 truncate max-w-[100px] text-slate-300 font-sans">
                                            {log.path}
                                        </td>

                                        <td className="py-1.5 px-1 text-slate-600 group-hover:text-slate-300">
                                            <ChevronRight className="w-3.5 h-3.5" />
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}