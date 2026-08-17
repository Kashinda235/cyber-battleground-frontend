import {
    Activity,
    AtSign,
    Cpu, Eye, FileCode,
    Gift, Key,
    type LucideProps,
    Mail,
    MessageSquare, Search,
    Shield, Skull,
    Star,
    Swords,
    Terminal,
    Trophy, Zap
} from "lucide-react";

export interface EventType {
    id: string;
    title: string;
    description: string;
    progress: number;
    total: number;
    timeLeft: string;
    isCompleted: boolean;
    rewards: {
            id: string;
            name: string;
            icon:  React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
            claimed: boolean
        }[]
}

// --- EVENTS DATA ---
export const GAME_EVENTS: EventType[] = [
    {
        id: 'evt_1',
        title: 'OpSec Essentials',
        description: 'Hardened your operational security by updating your primary credentials and changing your node hostname.',
        progress: 2,
        total: 2,
        timeLeft: 'Ends in 12h',
        isCompleted: true,
        rewards: [
            { id: 'r1', name: 'Encryption Cipher v1', icon: Shield, claimed: true },
            { id: 'r2', name: '500 XP', icon: Star, claimed: true }
        ]
    },
    {
        id: 'evt_2',
        title: 'Sub-Net Signal',
        description: 'Establish a connection by transmitting a encrypted broadcast in the public chat terminal.',
        progress: 1,
        total: 1,
        timeLeft: 'Ends in 1d',
        isCompleted: true,
        rewards: [
            { id: 'r3', name: 'Chat Alias Upgrade', icon: MessageSquare, claimed: true },
            { id: 'r4', name: '250 XP', icon: Star, claimed: true }
        ]
    },
    {
        id: 'evt_3',
        title: 'Darkweb Alliance',
        description: 'Initiate a secure mail exchange to build your underground netrunner network.',
        progress: 1,
        total: 1,
        timeLeft: 'Ends in 1d',
        isCompleted: false,
        rewards: [
            { id: 'r5', name: 'Encrypted Contact List', icon: Mail, claimed: false },
            { id: 'r6', name: '300 XP', icon: Star, claimed: false }
        ]
    },
    {
        id: 'evt_4',
        title: 'Cracking the Vault',
        description: 'Execute a dictionary-based brute force attack to breach a high-security authentication gateway.',
        progress: 1,
        total: 1,
        timeLeft: 'Ends in 3h',
        isCompleted: false,
        rewards: [
            { id: 'r7', name: 'Wordlist Injector Pro', icon: Terminal, claimed: false },
            { id: 'r8', name: '1,200 XP', icon: Star, claimed: false }
        ]
    },
    {
        id: 'evt_5',
        title: 'Rise of the Botnet',
        description: 'Infiltrate and enslave 3 remote user systems to expand your distributed bot network.',
        progress: 1,
        total: 3,
        timeLeft: 'Ends in 2d',
        isCompleted: false,
        rewards: [
            { id: 'r9', name: 'Zombienet Controller Core', icon: Cpu, claimed: false },
            { id: 'r10', name: '2,500 XP', icon: Star, claimed: false }
        ]
    },
    {
        id: 'evt_6',
        title: 'Social Engineering',
        description: 'Draft and dispatch a social engineering phishing campaign targeting high-value corporate targets.',
        progress: 1,
        total: 1,
        timeLeft: 'Ends in 5h',
        isCompleted: true,
        rewards: [
            { id: 'r11', name: 'Spoofed Header Module', icon: AtSign, claimed: false },
            { id: 'r12', name: '800 XP', icon: Star, claimed: false }
        ]
    },
    {
        id: 'evt_7',
        title: 'Trojan Transmission',
        description: 'Send a targeted email weaponized with a custom zero-day phishing payload.',
        progress: 0,
        total: 1,
        timeLeft: 'Ends in 1d',
        isCompleted: false,
        rewards: [
            { id: 'r13', name: 'Custom Dropper Builder', icon: FileCode, claimed: false },
            { id: 'r14', name: '1,500 XP', icon: Star, claimed: false }
        ]
    },
    {
        id: 'evt_8',
        title: 'Zero-Day Injection',
        description: 'Deploy an automated exploit script to trigger remote code execution on a vulnerable target.',
        progress: 1,
        total: 1,
        timeLeft: 'Ends in 8h',
        isCompleted: true,
        rewards: [
            { id: 'r15', name: 'Exploit Payload Framework', icon: Zap, claimed: true },
            { id: 'r16', name: '2,000 XP', icon: Star, claimed: true }
        ]
    },
    {
        id: 'evt_9',
        title: 'Perimeter Recon',
        description: 'Run a SYN port scan across a target subnet to map out open vectors and active services.',
        progress: 1,
        total: 1,
        timeLeft: 'Ends in 4h',
        isCompleted: true,
        rewards: [
            { id: 'r17', name: 'Fast Mapper Suite', icon: Search, claimed: true },
            { id: 'r18', name: '600 XP', icon: Star, claimed: true }
        ]
    },
    {
        id: 'evt_10',
        title: 'Deep System Audit',
        description: 'Execute a thorough deep packet inspection and vulnerability scan on target infrastructure.',
        progress: 0,
        total: 1,
        timeLeft: 'Ends in 18h',
        isCompleted: false,
        rewards: [
            { id: 'r19', name: 'Kernel Vulnerability DB', icon: Eye, claimed: false },
            { id: 'r20', name: '1,800 XP', icon: Star, claimed: false }
        ]
    },
    {
        id: 'evt_11',
        title: 'Identity Theft',
        description: 'Intercept valid authentication tokens to hijack an active administrator session undetected.',
        progress: 0,
        total: 1,
        timeLeft: 'Ends in 6h',
        isCompleted: false,
        rewards: [
            { id: 'r21', name: 'Cookie Spoofer v2', icon: Key, claimed: false },
            { id: 'r22', name: '2,200 XP', icon: Star, claimed: false }
        ]
    },
    {
        id: 'evt_12',
        title: 'Payload Delivery',
        description: 'Bypass local antivirus defenses and successfully drop a stealth ransomware payload.',
        progress: 0,
        total: 1,
        timeLeft: 'Ends in 1d',
        isCompleted: false,
        rewards: [
            { id: 'r23', name: 'Polymorphic Encoder', icon: Skull, claimed: false },
            { id: 'r24', name: '3,000 XP', icon: Star, claimed: false }
        ]
    },
    {
        id: 'evt_13',
        title: 'Overload Protocol',
        description: 'Unleash a high-volume DDoS traffic burst to swamp and disable a enemy node cluster.',
        progress: 0,
        total: 1,
        timeLeft: 'Ends in 2h',
        isCompleted: false,
        rewards: [
            { id: 'r25', name: 'Amplification Vector', icon: Activity, claimed: false },
            { id: 'r26', name: '3,500 XP', icon: Star, claimed: false }
        ]
    }
];

//. Define the registry map with initial states set to false
export const ACHIEVEMENTS = {
    OPSEC_ESSENTIALS: {
        title: 'OpSec Essentials',
        description: 'Updated your security settings and node hostname.',
        isCompleted: false
    },
    CHAT_MSG: {
        title: 'Social Fun',
        description: 'Transmitted an message in the chat room.',
        isCompleted: false
    },
    BRUTE_FORCE: {
        title: 'Cracking the Vault',
        description: 'Cracked an authentication gateway using brute force.',
        isCompleted: false
    },
    BOTNET_CREATOR: {
        title: 'Rise of the Botnet',
        description: 'Enslaved 3 remote systems into your network.',
        isCompleted: false
    },
    PHISHING_CAMPAIGN: {
        title: 'Social Engineering',
        description: 'Dispatched a social engineering phishing email.',
        isCompleted: false
    },
    PHISHING_PAYLOAD: {
        title: 'Trojan Transmission',
        description: 'Sent a targeted email with a weaponized phishing payload.',
        isCompleted: false
    },
    EXPLOIT_DEPLOYMENT: {
        title: 'Zero-Day Injection',
        description: 'Executed an automated exploit script on a target system.',
        isCompleted: false
    },
    PORT_SCANNER: {
        title: 'Perimeter Recon',
        description: 'Ran a port scan to map active services and open vectors.',
        isCompleted: false
    },
    DEEP_SCAN: {
        title: 'Deep System Audit',
        description: 'Executed a deep scan for underlying kernel vulnerabilities.',
        isCompleted: false
    },
    SESSION_HIJACK: {
        title: 'Identity Theft',
        description: 'Intercepted authentication tokens to hijack an active session.',
        isCompleted: false
    },
    MALWARE_DROP: {
        title: 'Payload Delivery',
        description: 'Bypassed local antivirus and dropped a stealth malware payload.',
        isCompleted: false
    },
    DDOS_BURST: {
        title: 'Overload Protocol',
        description: 'Unleashed a high-volume DDoS burst to swamp an enemy node.',
        isCompleted: false
    }
} as const;

type AchievementKey = keyof typeof ACHIEVEMENTS;

export function checkAchievement(key: AchievementKey, showToast) {
    const achievement = ACHIEVEMENTS[key];

    // If achievement exists and hasn't been completed yet
    if (achievement && !achievement.isCompleted) {
        // Mark completed directly
        (achievement as { isCompleted: boolean }).isCompleted = true;

        showToast({
            title: achievement.title,
            description: achievement.description,
            type: "achievement"
        });
    }
}