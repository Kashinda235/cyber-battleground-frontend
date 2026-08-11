import React, { useState, useCallback, useReducer } from 'react';

// --- Types & Tool Interfaces ---
export type DefenseToolId =
    | 'wireshark' | 'splunk' | 'yara' | 'firewallUpgrade' | 'idsIps'
    | 'autoPatch' | 'honeypot' | 'ipBlock' | 'traceback' | 'systemScan'
    | 'mfa' | 'trafficFilter' | 'decoyFiles' | 'emergencyLockdown' | 'backupRestore';

export interface AttackEvent {
    eventId: string;
    timestamp: string;
    attackType: 'BRUTE_FORCE' | 'SESSION_HIJACK' | 'SQL_INJECTION' | 'MALWARE_DROP' | 'SYN_FLOOD';
    sourceIp: string;
    targetPort: number;
    payloadSignature: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface LogEntry {
    id: string;
    timestamp: string;
    sourceTool: DefenseToolId | 'ATTACK_VECTOR';
    level: 'INFO' | 'WARN' | 'ALERT' | 'BLOCKED';
    message: string;
}

export interface DefenseState {
    // 1. Perimeter & Network
    firewallUpgrade: { level: 'STANDARD' | 'STRICT' | 'ZERO_TRUST' };
    trafficFilter: { enabled: boolean; rateLimitMbps: number };
    ipBlock: { blacklistedIps: string[] };

    // 2. Detection & Analysis
    wireshark: { capturing: boolean; packetCount: number };
    splunk: { indexing: boolean; totalEvents: number };
    yara: { scanning: boolean; loadedRules: string[] };
    idsIps: { mode: 'PASSIVE_IDS' | 'ACTIVE_IPS' };

    // 3. Deception & Hardening
    honeypot: { activeTraps: number; caughtCredentials: string[] };
    decoyFiles: { trapFilesDeployed: number; compromisedDecoys: string[] };
    systemScan: { inProgress: boolean; progressPercent: number };
    autoPatch: { enabled: boolean; pendingUpdates: number };
    mfa: { enforced: boolean };

    // 4. Incident Response & Recovery
    traceback: { tracing: boolean; resolvedHops: string[] };
    emergencyLockdown: { active: boolean };
    backupRestore: { availableSnapshots: string[]; lastRestoreTime: string | null };
}

// Initial State Blueprint
const initialDefenseState: DefenseState = {
    firewallUpgrade: { level: 'STANDARD' },
    trafficFilter: { enabled: true, rateLimitMbps: 100 },
    ipBlock: { blacklistedIps: ['10.0.0.99'] },
    wireshark: { capturing: true, packetCount: 1420 },
    splunk: { indexing: true, totalEvents: 8590 },
    yara: { scanning: true, loadedRules: ['webshell.yar', 'ransomware_v1.yar'] },
    idsIps: { mode: 'PASSIVE_IDS' },
    honeypot: { activeTraps: 3, caughtCredentials: [] },
    decoyFiles: { trapFilesDeployed: 5, compromisedDecoys: [] },
    systemScan: { inProgress: false, progressPercent: 0 },
    autoPatch: { enabled: true, pendingUpdates: 0 },
    mfa: { enforced: true },
    traceback: { tracing: false, resolvedHops: [] },
    emergencyLockdown: { active: false },
    backupRestore: { availableSnapshots: ['snap_2026_08_05', 'snap_2026_08_06'], lastRestoreTime: null },
};

// --- Security Center Reducer ---
type Action =
    | { type: 'TOGGLE_TOOL'; tool: DefenseToolId; payload?: any }
    | { type: 'TRIGGER_ATTACK'; attack: AttackEvent }
    | { type: 'MITIGATE_ATTACK'; ip: string };

function defenseReducer(state: DefenseState, action: Action): DefenseState {
    switch (action.type) {
        case 'TOGGLE_TOOL':
            if (action.tool === 'emergencyLockdown') {
                return { ...state, emergencyLockdown: { active: !state.emergencyLockdown.active } };
            }
            if (action.tool === 'ipBlock' && action.payload?.ip) {
                return {
                    ...state,
                    ipBlock: { blacklistedIps: [...state.ipBlock.blacklistedIps, action.payload.ip] }
                };
            }
            return state;

        case 'TRIGGER_ATTACK':
            // Real-time evaluation against active defenses
            const isIpBlocked = state.ipBlock.blacklistedIps.includes(action.attack.sourceIp);
            const isLockdownActive = state.emergencyLockdown.active;
            const isIpsActive = state.idsIps.mode === 'ACTIVE_IPS';

            if (isIpBlocked || isLockdownActive || isIpsActive) {
                return {
                    ...state,
                    splunk: { ...state.splunk, totalEvents: state.splunk.totalEvents + 1 },
                    wireshark: { ...state.wireshark, packetCount: state.wireshark.packetCount + 1 }
                };
            }

            // If undefended, attack impacts honeypot or decoy traps
            if (action.attack.targetPort === 22 && state.honeypot.activeTraps > 0) {
                return {
                    ...state,
                    honeypot: {
                        ...state.honeypot,
                        caughtCredentials: [...state.honeypot.caughtCredentials, `root:admin@${action.attack.sourceIp}`]
                    }
                };
            }
            return state;

        default:
            return state;
    }
}

// --- Main Custom Hook ---
export function useCyberSecurityCenter() {
    const [defenseState, dispatch] = useReducer(defenseReducer, initialDefenseState);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [activeAlert, setActiveAlert] = useState<AttackEvent | null>(null);

    // Central Event Router connecting Attacks to Defense Tools
    const dispatchAttackEvent = useCallback((attack: AttackEvent) => {
        setActiveAlert(attack);

        // 1. Telemetry Log Update (Wireshark & Splunk Ingestion)
        const newLog: LogEntry = {
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString().substring(11, 19),
            sourceTool: 'splunk',
            level: attack.severity === 'CRITICAL' ? 'ALERT' : 'WARN',
            message: `[${attack.attackType}] Inbound traffic from ${attack.sourceIp}:${attack.targetPort}`
        };

        setLogs((prev) => [newLog, ...prev.slice(0, 99)]);
        dispatch({ type: 'TRIGGER_ATTACK', attack });

        // 2. Automated Defense Triggers
        if (defenseState.autoPatch.enabled && attack.attackType === 'MALWARE_DROP') {
            setLogs((prev) => [
                {
                    id: crypto.randomUUID(),
                    timestamp: new Date().toISOString().substring(11, 19),
                    sourceTool: 'autoPatch',
                    level: 'BLOCKED',
                    message: `[Auto Patch] Signature matched for ${attack.payloadSignature}. Vulnerability patched.`
                },
                ...prev
            ]);
        }
    }, [defenseState]);

    const toggleDefense = (tool: DefenseToolId, payload?: any) => {
        dispatch({ type: 'TOGGLE_TOOL', tool, payload });
    };

    return {
        defenseState,
        logs,
        activeAlert,
        dispatchAttackEvent,
        toggleDefense
    };
}