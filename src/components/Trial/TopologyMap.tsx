import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Shield, Server, Database, Zap, Lock } from 'lucide-react';
import type { AttackEvent, DefenseState } from '../../hooks/useCyberSecurityCenter.ts';

interface TopologyProps {
    activeAlert: AttackEvent | null;
    defenseState: DefenseState;
}

// Define the network nodes and their responsive positions
const NODES = {
    internet: { id: 'internet', label: 'External Origin', x: 10, y: 50, icon: Globe, color: 'text-slate-400' },
    firewall: { id: 'firewall', label: 'Perimeter FW', x: 40, y: 50, icon: Shield, color: 'text-blue-400' },
    web: { id: 'web', label: 'Web Server', x: 80, y: 25, icon: Server, color: 'text-emerald-400' },
    db: { id: 'db', label: 'SQL Database', x: 80, y: 75, icon: Database, color: 'text-purple-400' },
};

export const NetworkTopologyMap: React.FC<TopologyProps> = ({ activeAlert, defenseState }) => {
    const [activePackets, setActivePackets] = useState<
        { id: string; targetNode: 'web' | 'db'; isBlocked: boolean; severity: string }[]
    >([]);

    // Listen for active alerts and generate an animated packet
    useEffect(() => {
        if (activeAlert) {
            const isSqlInjection = activeAlert.attackType === 'SQL_INJECTION';
            const targetNode = isSqlInjection ? 'db' : 'web';

            // Determine if the attack is mitigated by active defenses
            const isBlockedByFirewall = defenseState.firewallUpgrade.level === 'ZERO_TRUST';
            const isIpBlocked = defenseState.ipBlock.blacklistedIps.includes(activeAlert.sourceIp);
            const isLockedDown = defenseState.emergencyLockdown.active;

            const isBlocked = isBlockedByFirewall || isIpBlocked || isLockedDown;

            const packetId = crypto.randomUUID();
            setActivePackets((prev) => [...prev, { id: packetId, targetNode, isBlocked, severity: activeAlert.severity }]);

            // Cleanup packet after animation completes (approx 2 seconds)
            setTimeout(() => {
                setActivePackets((prev) => prev.filter((p) => p.id !== packetId));
            }, 2500);
        }
    }, [activeAlert, defenseState]);

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col relative overflow-hidden h-72 shadow-lg">
            <div className="flex items-center justify-between z-10 mb-2">
        <span className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400" /> Live Network Topology
        </span>
                <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          NETWORK ACTIVE
        </span>
            </div>

            {/* SVG Container for static network links */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                <line x1="10%" y1="50%" x2="40%" y2="50%" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="40%" y1="50%" x2="80%" y2="25%" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="40%" y1="50%" x2="80%" y2="75%" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
            </svg>

            {/* Render Static Nodes */}
            {Object.values(NODES).map((node) => {
                const Icon = node.icon;
                return (
                    <div
                        key={node.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10"
                        style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    >
                        <div className={`p-3 bg-slate-950 border border-slate-800 rounded-lg shadow-md ${node.color}`}>
                            <Icon className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 mt-2 bg-slate-950/80 px-1.5 py-0.5 rounded">
              {node.label}
            </span>
                    </div>
                );
            })}

            {/* Render Animated Attack Packets */}
            <AnimatePresence>
                {activePackets.map((packet) => (
                    <motion.div
                        key={packet.id}
                        initial={{ left: `${NODES.internet.x}%`, top: `${NODES.internet.y}%`, opacity: 1, scale: 1 }}
                        animate={
                            packet.isBlocked
                                ? {
                                    left: `${NODES.firewall.x}%`,
                                    top: `${NODES.firewall.y}%`,
                                    scale: [1, 1.5, 0],
                                    opacity: [1, 1, 0]
                                } // Attack stops and explodes at the Firewall
                                : {
                                    left: `${NODES[packet.targetNode].x}%`,
                                    top: `${NODES[packet.targetNode].y}%`,
                                    scale: [1, 1, 1.5, 0],
                                    opacity: [1, 1, 1, 0]
                                } // Attack bypasses firewall and hits the target node
                        }
                        transition={{ duration: packet.isBlocked ? 0.8 : 1.5, ease: "linear" }}
                        className={`absolute w-3 h-3 rounded-full z-20 shadow-[0_0_10px_rgba(255,0,0,0.8)] transform -translate-x-1/2 -translate-y-1/2 ${
                            packet.severity === 'CRITICAL' ? 'bg-red-500' : 'bg-amber-500'
                        }`}
                    >
                        {packet.isBlocked && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="absolute -top-6 -left-2 text-red-500"
                            >
                                <Lock className="w-4 h-4" />
                            </motion.div>
                        )}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};