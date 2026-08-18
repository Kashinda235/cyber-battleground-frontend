import { motion } from "framer-motion";
import {
    ShieldAlert,
    Flame,
    Bug,
    Server,
    ToggleLeft,
    ToggleRight,
    SlidersHorizontal,
} from "lucide-react";

export interface DefenseState {
    firewall: {
        blockSSH: boolean;
        rateLimitICMP: boolean;
        geoBlock: boolean;
    };
    idsMode: "passive" | "active";
    honeypots: {
        sshTrap: boolean;
        dbDecoy: boolean;
        webTrap: boolean;
    };
}

interface SecurityControlsProps {
    defenses: DefenseState;
    onToggleDefense: (
        category: keyof DefenseState,
        key: string,
        val?: any
    ) => void;
}

const defaultDefense : DefenseState = {
    firewall: {
        blockSSH: true,
        rateLimitICMP: true,
        geoBlock: true,
    },
    idsMode: "passive",
    honeypots: {
        sshTrap: true,
        dbDecoy: true,
        webTrap: true,
    }
}


export const SecurityControls: React.FC<SecurityControlsProps> = ({
                                                                      defenses = defaultDefense,
                                                                      onToggleDefense,
                                                                  }) => {
    return (
        <div className="h-full w-full bg-slate-950 text-slate-100 p-5 rounded-xl border border-slate-800 shadow-2xl flex flex-col gap-6 font-mono overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-emerald-400" />
                    <h2 className="text-sm font-semibold tracking-wider uppercase text-slate-200">
                        Active Countermeasures
                    </h2>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          SYSTEM OPERATIONAL
        </span>
            </div>

            {/* Section 1: Firewall Rules */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <Flame className="w-4 h-4 text-orange-400" />
                    Firewall Policy
                </div>
                <div className="space-y-2">
                    {[
                        {
                            id: "blockSSH",
                            label: "Block Port 22 (SSH)",
                            desc: "Drop unauthorized SSH packets",
                        },
                        {
                            id: "rateLimitICMP",
                            label: "Rate-Limit ICMP Ping",
                            desc: "Mitigate Ping Flood / Discovery",
                        },
                        {
                            id: "geoBlock",
                            label: "Strict TCP SYN Filter",
                            desc: "Prevent SYN Flood Exhaustion",
                        },
                    ].map((rule) => {
                        const active =
                            defenses.firewall[rule.id as keyof typeof defenses.firewall];
                        return (
                            <div
                                key={rule.id}
                                onClick={() => onToggleDefense("firewall", rule.id)}
                                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                                    active
                                        ? "bg-slate-900/80 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.08)]"
                                        : "bg-slate-900/30 border-slate-800/80 hover:border-slate-700"
                                }`}
                            >
                                <div>
                                    <div className="text-xs font-medium text-slate-200">
                                        {rule.label}
                                    </div>
                                    <div className="text-[11px] text-slate-500">{rule.desc}</div>
                                </div>
                                <button type="button" className="text-slate-400 hover:text-slate-200">
                                    {active ? (
                                        <ToggleRight className="w-6 h-6 text-emerald-400" />
                                    ) : (
                                        <ToggleLeft className="w-6 h-6 text-slate-600" />
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Section 2: IDS / IPS Enforcement */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <Bug className="w-4 h-4 text-cyan-400" />
                    IDS / IPS Mode
                </div>
                <div className="grid grid-cols-2 gap-2 bg-slate-900/60 p-1 rounded-lg border border-slate-800">
                    {(["passive", "active"] as const).map((mode) => {
                        const isSelected = defenses.idsMode === mode;
                        return (
                            <button
                                key={mode}
                                onClick={() => onToggleDefense("idsMode", mode)}
                                className={`relative py-2 text-xs font-medium rounded-md capitalize transition-colors ${
                                    isSelected ? "text-cyan-300" : "text-slate-400 hover:text-slate-200"
                                }`}
                            >
                                {isSelected && (
                                    <motion.div
                                        layoutId="idsModeBg"
                                        className="absolute inset-0 bg-cyan-950/80 border border-cyan-500/40 rounded-md"
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10 flex items-center justify-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                                    {mode === "passive" ? "Passive Log" : "Active Block"}
                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Section 3: Honeypot Traps */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <Server className="w-4 h-4 text-purple-400" />
                    Deception Networks (Honeypots)
                </div>
                <div className="grid grid-cols-2 gap-2">
                    {[
                        { id: "sshTrap", label: "SSH Trap (:2222)" },
                        { id: "dbDecoy", label: "MySQL Decoy (:3306)" },
                        { id: "webTrap", label: "Fake Admin (:8080)" },
                    ].map((trap) => {
                        const active =
                            defenses.honeypots[trap.id as keyof typeof defenses.honeypots];
                        return (
                            <button
                                key={trap.id}
                                onClick={() => onToggleDefense("honeypots", trap.id)}
                                className={`p-2.5 text-left rounded-lg border text-xs font-medium transition-all ${
                                    active
                                        ? "bg-purple-950/30 border-purple-500/40 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.1)]"
                                        : "bg-slate-900/30 border-slate-800 text-slate-400 hover:border-slate-700"
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span>{trap.label}</span>
                                    <span
                                        className={`w-2 h-2 rounded-full ${
                                            active ? "bg-purple-400 animate-pulse" : "bg-slate-700"
                                        }`}
                                    />
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};