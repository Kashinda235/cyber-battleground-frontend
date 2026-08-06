import { useState } from "react";
import { SecurityControls, type DefenseState } from "./Panel1";
import { TelemetryFeed, type LogEntry } from "./Panel2";

export const DefenseDashboard = () => {
    const [defenses, setDefenses] = useState<DefenseState>({
        firewall: { blockSSH: true, rateLimitICMP: false, geoBlock: false },
        idsMode: "active",
        honeypots: { sshTrap: true, dbDecoy: false, webTrap: true },
    });

    const [logs, setLogs] = useState<LogEntry[]>([
        {
            id: "1",
            timestamp: "10:42:01",
            type: "ALERT",
            sourceIp: "192.168.1.105",
            targetPort: 22,
            message: "Brute-force SSH attack pattern detected (50 attempts/s)",
            vector: "BRUTE_FORCE",
        },
        {
            id: "2",
            timestamp: "10:42:02",
            type: "BLOCKED",
            sourceIp: "192.168.1.105",
            targetPort: 22,
            message: "Firewall dropped connection based on Port 22 block rule",
            vector: "BRUTE_FORCE",
        },
    ]);

    const handleToggleDefense = (category: keyof DefenseState, key: string, val?: any) => {
        setDefenses((prev) => {
            if (category === "idsMode") {
                return { ...prev, idsMode: key as "passive" | "active" };
            }
            return {
                ...prev,
                [category]: {
                    ...(prev[category] as object),
                    [key]: !((prev[category] as any)[key]),
                },
            };
        });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[600px] w-full max-w-7xl mx-auto p-4 bg-slate-900 rounded-2xl border border-slate-800">
            <div className="lg:col-span-5 h-full">
                <SecurityControls defenses={defenses} onToggleDefense={handleToggleDefense} />
            </div>
            <div className="lg:col-span-7 h-full">
                <TelemetryFeed logs={logs} onClearLogs={() => setLogs([])} />
            </div>
        </div>
    );
};