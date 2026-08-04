export type GameAttackAction =
    | 'Brute Force'
    | 'Phishing Kit'
    | 'Exploit Script'
    | 'Port Scanner'
    | 'Deep Scanner'
    | 'Packet Sniffer'
    | 'Credential Stuffing'
    | 'Session Hijack'
    | 'Malware Drop'
    | 'DDoS Burst'
    | 'Zero-Day Attack'
    | 'Log Wiper';

// Represents the state of a target node in the game
export interface NodeState {
    id: string;
    defense: number;
    integrity: number; // Think of this as "HP"
    isCompromised: boolean;
}

// Represents the result of a turn/action
export interface AttackResult {
    success: boolean;
    damageDealt: number;
    narrativeLog: string;
    statusEffect?: string;
}

export type AttackHandler = (target: NodeState, playerStats: any) => Promise<AttackResult>;

// ============================================================================
// Simulated Game Attack Handlers
// ============================================================================

const simulateBruteForce: AttackHandler = async (target) => {
    // Game logic: low success rate, minimal damage, generates high "alert" level
    const roll = Math.random();
    const success = roll > 0.7;
    return {
        success,
        damageDealt: success ? 10 : 0,
        narrativeLog: success ? 'Brute force successful: Password cracked.' : 'Brute force failed: Connection dropped.',
    };
};

const simulatePhishingKit: AttackHandler = async (target) => {
    return {
        success: true,
        damageDealt: 0,
        narrativeLog: 'Phishing campaign launched. Waiting for NPC interaction...',
        statusEffect: 'Pending_Credentials'
    };
};

const useExploitScript: AttackHandler = async (target) => {
    const success = target.defense < 50; // Game logic check against node defense
    return {
        success,
        damageDealt: success ? 25 : 0,
        narrativeLog: success ? 'Exploit executed successfully. Payload delivered.' : 'Exploit blocked by node firewall.',
    };
};

const simulatePortScanner: AttackHandler = async (target) => {
    // Recon move: deals no damage, reveals stats
    return {
        success: true,
        damageDealt: 0,
        narrativeLog: `Scan complete. Target Defense is ${target.defense}.`,
        statusEffect: 'Revealed'
    };
};

const simulateDeepScanner: AttackHandler = async (target) => {
    return {
        success: true,
        damageDealt: 0,
        narrativeLog: 'Deep scan finished. Hidden vulnerabilities exposed to the player map.',
        statusEffect: 'Vulnerability_Exposed'
    };
};

const simulatePacketSniffer: AttackHandler = async (target) => {
    return {
        success: true,
        damageDealt: 0,
        narrativeLog: 'Sniffer active. Passive data accumulation increased by 10/turn.',
        statusEffect: 'Sniffing_Traffic'
    };
};

const simulateCredentialStuffing: AttackHandler = async (target) => {
    const success = Math.random() > 0.5;
    return {
        success,
        damageDealt: success ? 15 : 0,
        narrativeLog: success ? 'Valid credential pair found. Initial access granted.' : 'All credential pairs rejected.',
    };
};

const simulateSessionHijack: AttackHandler = async (target) => {
    return {
        success: true,
        damageDealt: 20,
        narrativeLog: 'Active admin session hijacked. Bypassed login mechanics.',
        statusEffect: 'Admin_Privileges'
    };
};

const simulateMalwareDrop: AttackHandler = async (target) => {
    return {
        success: true,
        damageDealt: 5,
        narrativeLog: 'Malware seeded. Target will take 5 integrity damage per turn.',
        statusEffect: 'Infected_DoT' // Damage over Time
    };
};

const simulateDDoSBurst: AttackHandler = async (target) => {
    // High damage, high noise game move
    return {
        success: true,
        damageDealt: 40,
        narrativeLog: 'DDoS burst triggered. Target node temporarily offline.',
        statusEffect: 'Stunned'
    };
};

const simulateZeroDay: AttackHandler = async (target) => {
    // Ultimate move: ignores defense
    return {
        success: true,
        damageDealt: 100,
        narrativeLog: 'Zero-Day deployed. Critical hit! Node defenses entirely bypassed.',
        statusEffect: 'Root_Compromised'
    };
};

const simulateLogWiper: AttackHandler = async (target) => {
    return {
        success: true,
        damageDealt: 0,
        narrativeLog: 'Server logs wiped. Player threat level reduced to 0.',
        statusEffect: 'Stealth_Restored'
    };
};

// ============================================================================
// Game Action Registry Map
// ============================================================================

export const AttackActionMap: Record<GameAttackAction, AttackHandler> = {
    'Brute Force': simulateBruteForce,
    'Phishing Kit': simulatePhishingKit,
    'Exploit Script': useExploitScript,
    'Port Scanner': simulatePortScanner,
    'Deep Scanner': simulateDeepScanner,
    'Packet Sniffer': simulatePacketSniffer,
    'Credential Stuffing': simulateCredentialStuffing,
    'Session Hijack': simulateSessionHijack,
    'Malware Drop': simulateMalwareDrop,
    'DDoS Burst': simulateDDoSBurst,
    'Zero-Day Attack': simulateZeroDay,
    'Log Wiper': simulateLogWiper
};

// ============================================================================
// Game Loop Dispatcher
// ============================================================================

/**
 * Dispatches an attack action during a game turn.
 */
export const executeAttack = async (
    action: GameAttackAction,
    targetNode: NodeState,
    playerStats: any
): Promise<AttackResult> => {
    const handler = AttackActionMap[action];

    if (!handler) {
        throw new Error(`Game Error: Unknown ability "${action}" cast.`);
    }

    try {
        const result = await handler(targetNode, playerStats);

        // Apply simulated damage to the game node
        if (result.success && result.damageDealt > 0) {
            targetNode.integrity -= result.damageDealt;
            if (targetNode.integrity <= 0) {
                targetNode.isCompromised = true;
            }
        }

        return result;
    } catch (error) {
        return {
            success: false,
            damageDealt: 0,
            narrativeLog: `Turn failed due to a game engine error.`,
        };
    }
};