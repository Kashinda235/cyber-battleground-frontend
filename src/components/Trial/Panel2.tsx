import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Terminal,
    AlertTriangle,
    Activity,
    ShieldCheck,
    Filter,
    Trash2,
} from "lucide-react";

export interface LogEntry {
    id: string;
    timestamp: string;
    type: "INFO" | "WARN" | "ALERT" | "BLOCKED";
    sourceIp: string;
    targetPort: number;
    message: string;
    vector?: string;
}

interface TelemetryFeedProps {
    logs: LogEntry[];
    onClearLogs?: () => void;
}

export const TelemetryFeed: React.FC<TelemetryFeedProps> = ({
                                                                logs,
                                                                onClearLogs,
                                                            }) => {
    const [activeTab, setActiveTab] = useState<"all" | "alerts" | "metrics">(
        "all"
    );
    const [filterVector, setFilterVector] = useState<string>("ALL");

    const filteredLogs = logs.filter((log) => {
        if (activeTab === "alerts" && log.type !== "ALERT" && log.type !== "BLOCKED") {
            return false;
        }
        if (filterVector !== "ALL" && log.vector !== filterVector) {
            return false;
        }
        return true;
    });

    const getTypeStyle = (type: LogEntry["type"]) => {
        switch (type) {
            case "ALERT":
                return "text-red-400 bg-red-950/60 border-red-500/30";
            case "BLOCKED":
                return "text-emerald-400 bg-emerald-950/60 border-emerald-500/30";
            case "WARN":
                return "text-amber-400 bg-amber-950/60 border-amber-500/30";
            default:
                return "text-blue-400 bg-blue-950/60 border-blue-500/30";
        }
    };

    return (
        <div className="h-full w-full bg-slate-950 text-slate-100 p-5 rounded-xl border border-slate-800 shadow-2xl flex flex-col font-mono overflow-hidden">
            {/* Top Bar Navigation */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                    {[
                        { id: "all", label: "Live Telemetry", icon: Terminal },
                        { id: "alerts", label: "IDS Alerts", icon: AlertTriangle },
                        { id: "metrics", label: "Traffic Status", icon: Activity },
                    ].map((tab) => {
                        const Icon = tab.icon;
                        const isSelected = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`relative px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-2 ${
                                    isSelected ? "text-slate-100" : "text-slate-400 hover:text-slate-200"
                                }`}
                            >
                                {isSelected && (
                                    <motion.div
                                        layoutId="telemetryTab"
                                        className="absolute inset-0 bg-slate-800 rounded-md"
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10 flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5" />
                                    {tab.label}
                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Clear & Filter Controls */}
                <div className="flex items-center gap-2">
                    {activeTab !== "metrics" && (
                        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 px-2 py-1 rounded-md text-xs text-slate-400">
                            <Filter className="w-3 h-3" />
                            <select
                                value={filterVector}
                                onChange={(e) => setFilterVector(e.target.value)}
                                className="bg-transparent text-slate-300 focus:outline-none cursor-pointer"
                            >
                                <option value="ALL">All Vectors</option>
                                <option value="BRUTE_FORCE">Brute Force</option>
                                <option value="SESSION_HIJACK">Session Hijack</option>
                                <option value="SYN_FLOOD">SYN Flood</option>
                            </select>
                        </div>
                    )}
                    {onClearLogs && (
                        <button
                            onClick={onClearLogs}
                            className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-red-400 rounded-md transition-colors"
                            title="Clear Logs"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Main View Area */}
            {activeTab === "metrics" ? (
                <div className="grid grid-cols-3 gap-4 my-auto">
                    <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl text-center">
                        <div className="text-xs text-slate-500 mb-1">Inbound Traffic</div>
                        <div className="text-2xl font-bold text-cyan-400">1.4 MB/s</div>
                        <div className="text-[10px] text-emerald-400 mt-1">Normal Rate</div>
                    </div>
                    <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl text-center">
                        <div className="text-xs text-slate-500 mb-1">Threat Mitigation</div>
                        <div className="text-2xl font-bold text-emerald-400">98.2%</div>
                        <div className="text-[10px] text-slate-400 mt-1">Active Blocking</div>
                    </div>
                    <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl text-center">
                        <div className="text-xs text-slate-500 mb-1">Dropped Packets</div>
                        <div className="text-2xl font-bold text-amber-400">4,120</div>
                        <div className="text-[10px] text-amber-400/80 mt-1">SYN + Port Scan</div>
                    </div>
                </div>
            ) : (
                /* Stream/Log Area */
                <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                    {filteredLogs.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-2">
                            <ShieldCheck className="w-8 h-8 stroke-1" />
                            <span className="text-xs">No activity logged in this channel</span>
                        </div>
                    ) : (
                        <AnimatePresence initial={false}>
                            {filteredLogs.map((log) => (
                                <motion.div
                                    key={log.id}
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.15 }}
                                    className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/80 text-xs flex items-start gap-3 hover:border-slate-700 transition-colors"
                                >
                  <span className="text-slate-500 text-[11px] pt-0.5 whitespace-nowrap">
                    {log.timestamp}
                  </span>
                                    <span
                                        className={`px-1.5 py-0.5 text-[10px] rounded border font-semibold tracking-wide ${getTypeStyle(
                                            log.type
                                        )}`}
                                    >
                    {log.type}
                  </span>
                                    <div className="flex-1 min-w-0">
                                        <span className="text-slate-300 font-medium">{log.message}</span>
                                        <div className="text-[10px] text-slate-500 mt-0.5 flex gap-3">
                                            <span>SRC: {log.sourceIp}</span>
                                            <span>PORT: {log.targetPort}</span>
                                            {log.vector && (
                                                <span className="text-cyan-400/80">
                          VECTOR: {log.vector}
                        </span>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>
            )}
        </div>
    );
};