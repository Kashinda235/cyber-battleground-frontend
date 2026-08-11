import {AnimatePresence, motion} from "framer-motion";
import {AlertTriangle, Server} from "lucide-react";
import {type AttackEvent, useCyberSecurityCenter} from "../../hooks/useCyberSecurityCenter.ts";
import {useEffect} from "react";


const Monitoring = () => {
    const { defenseState, logs, activeAlert, dispatchAttackEvent} =
        useCyberSecurityCenter();

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
    useEffect(() => {
    triggerSimulatedAttack('BRUTE_FORCE', 'MEDIUM', 22);
    triggerSimulatedAttack('MALWARE_DROP', 'CRITICAL', 443);
    triggerSimulatedAttack('SYN_FLOOD', 'HIGH', 80);
    }, [])

    return (
        <div className="h-full mx-auto space-y-4 overflow-hidden">

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
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 shadow-lg space-y-3">

                {/* LOG STREAM DISPLAY */}
                <div className="bg-slate-950 border border-slate-800/80 rounded-lg p-3 overflow-y-auto font-mono text-[11px] space-y-2">
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
    )
}
export default Monitoring
