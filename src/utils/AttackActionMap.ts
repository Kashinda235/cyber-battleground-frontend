import {PASSWORDS_LIST, WORD_LIST} from "../constants/ActionTools.ts";
import type {GameContextServices} from "../context/GameContext.tsx";

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

export type LogType = "system" | "error" | "test" | "load" ;

// Represents the state of a target node in the game
export interface NodeState {
    id: number;
    name: string;
    ip: string;
    hostname: string;
    password: string;
    securityLevel: number; // e.g., 1 to 5
    defense: number;
    integrity: number;
    isCompromised: boolean;
    isFirewallActive?: boolean;
}

// Represents the result of a turn/action
export interface AttackResult {
    type: "system" | "error" | "action";
    content: string
}

export type LogCallback = (entry: {
    type: LogType ;
    content: string }) => void;

export type AttackHandler = (
    services: GameContextServices,
    onLog?: LogCallback
) => Promise<AttackResult>;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to format timestamps as [HH:MM:SS.mmm]
const getTimestamp = (): string => {
    const now = new Date();
    return now.toTimeString().split(' ')[0] + '.' + now.getMilliseconds().toString().padStart(3, '0');
};

// ============================================================================
// Simulated Game Attack Handlers
// ============================================================================

const simulateBruteForce: AttackHandler = async (services, onLog) => {
    const { target, performAction, stateConnection, updatePlayerStats} = services;
    const wordlistName = (typeof WORD_LIST !== "undefined" && WORD_LIST[0]) ? WORD_LIST[0] : "rockyou.txt";
    const passwordList = PASSWORDS_LIST || ["admin", "root", "123456", "admin_9021", "password"];
    const targetPort = 22;
    const targetUser = target.hostname || "root";
    const totalAttempts = passwordList.length;
    const action = {
        action_type: "Login Attempt",
        target_id: target.id,
        ability_id: 1.
    }
        // Target password to match against
    const actualTargetPassword = target.password || "admin_9021";

    // 1. Initial Handshake & Engine Initialization Logs
    onLog?.({
        type: "load",
        content: `[${getTimestamp()}] [+] Initializing Hydra v9.4 brute-force engine against ${target.ip}:${targetPort}...`
    });
    await delay(300);

    onLog?.({
        type: "load",
        content: `[${getTimestamp()}] [+] Loaded wordlist [${wordlistName}] (${totalAttempts.toLocaleString()} entries)...`
    });
    await delay(300);

    onLog?.({
        type: "test",
        content: `[${getTimestamp()}] [*] Establishing SSH-2.0-OpenSSH_8.2p1 handshake...`
    });
    await delay(400);

    let matchFound = false;
    let matchedPassword = "";

    // 2. Iterate through EVERY password attempt in the list
    for (let index = 0; index < passwordList.length; index++) {
        const attemptNum = index + 1;
        const currentPassword = passwordList[index];
        const timestamp = getTimestamp();
        performAction(action);
        updatePlayerStats({health: -2, xp: 21});

        // Check if current password matches target password
        const isMatch = currentPassword === actualTargetPassword;

        if (isMatch) {
            matchFound = true;
            matchedPassword = currentPassword;
            performAction({...action, action_type: "User Login Successful"});
            stateConnection({target_ip: target.ip, status: "bot"});
            updatePlayerStats({health: 95, xp: 1245});

            // Log successful attempt
            onLog?.({
                type: "system",
                content: `[${timestamp}] [ATTEMPT ${attemptNum}/${totalAttempts}] Testing "${currentPassword}" -> STATUS: 200 OK (MATCH FOUND)`
            });
            await delay(150); // Optional small pause on success highlight
            break; // Stop brute forcing once found
        } else {
            // Log failed attempt
            onLog?.({
                type: "test",
                content: `[${timestamp}] [ATTEMPT ${attemptNum}/${totalAttempts}] Testing "${currentPassword}" -> STATUS: 401 ACCESS DENIED`
            });
        }

        // Delay between each password attempt (adjust ms to speed up or slow down live logs)
        await delay(200);
    }

    // 3. Output Final Result
    if (matchFound) {
        onLog?.({
            type: "system",
            content: `[${getTimestamp()}] [+] SUCCESS: Valid credentials recovered!`
        });

        return {
            type: "action",
            content: `[+] SUCCESS: SSH credentials recovered for ${targetUser}@${target.ip}\n[+] Match found: "${targetUser}:${matchedPassword}"`
        };
    } else {
        onLog?.({
            type: "error",
            content: `[${getTimestamp()}] [-] FAIL: Wordlist exhausted without matching hash.`
        });

        return {
            type: "error",
            content: `[-] FAIL: Wordlist exhausted without matching hash against ${target.ip}.`
        };
    }
};

const simulatePhishingKit: AttackHandler = async (services, onLog) => {
    const { target, performAction, sendMail, playerXp, stateConnection, updatePlayerStats } = services;
    performAction({
        action_type: "Mail",
        target_id: target.id,
        ability_id: 2, // Cleaned up dangling trailing decimal
    });
    sendMail({
        receiverId: target.id,
        message: "Hello! What side are you on?",
        phishingPayload: true,
    });
    stateConnection({target_ip: target.ip, status: "friend"});
    const socialEngineeringSkill = playerXp / 10000 * 3;
    const targetPort = 443;
    const targetName = target.hostname || target.name;

    // Phishing campaign simulation stages
    const stages = [
        `[+] Initializing Social Engineering Toolkit (SET) v8.2...`,
        `[+] Cloning login portal interface for host domain: ${targetName}...`,
        `[*] Generating spoofed SSL certificate and temporary redirect payload...`,
        `[+] Crafting spear-phishing email vector targeting host administrator...`,
        `[*] Campaign launched. Monitoring target response on port ${targetPort}...`,
        `[...] Awaiting target interaction (victim authentication attempt)...`
    ];

    // Emit live terminal logs
    for (const stageMessage of stages) {
        let logType: LogType = 'system';
        if (stageMessage.startsWith('[+]')) logType = 'load';
        else if (stageMessage.startsWith('[*]')) logType = 'test';

        onLog?.({ type: logType, content: stageMessage });
        await delay(600);
        updatePlayerStats({health: -2, xp: 2});
    }

    // Success probability based on player skill vs target defense/integrity
    const baseSuccessChance = 0.60;
    const skillBonus = socialEngineeringSkill * 0.05;
    const totalChance = Math.min(Math.max(baseSuccessChance + skillBonus, 0.15), 0.90);
    const isSuccess = Math.random() < totalChance;

    await delay(800);
    updatePlayerStats({health: 94, xp: 2});

    if (isSuccess) {
        const fakeSessionToken = Math.random().toString(36).substring(2, 15);
        updatePlayerStats({health: 96, xp: 1324});
        stateConnection({target_ip: target.ip, status: "bot"});
        return {
            type: "action",
            content: `[+] SUCCESS: Victim authenticated via cloned portal.\n[+] Captured session token: auth_bearer_${fakeSessionToken}\n[+] Host ${target.id} security bypass complete.`
        };
    }

    return {
        type: "error",
        content: `[-] FAIL: Phishing email flagged by target email filter / MFA verification failed.\n[-] Target security awareness triggered on node ${target.id}.`
    };
};

const useExploitScript: AttackHandler = async (services, onLog) => {
    const { target, performAction, updatePlayerStats, playerXp } = services;
    const exploitSkill = playerXp / 10000 * 3;
    const targetDefense = 10;

    const action = {
        action_type: "Exploit", // Or "Hack" / "SystemAttack" depending on your enum/schema
        target_id: target.id,
        ability_id: 3,
    };
    performAction(action);

    // Simulated vulnerability database / CVE tags
    const cveList = [
        "CVE-2024-3094 (XZ Utils Backdoor)",
        "CVE-2023-4911 (Looney Tunables)",
        "CVE-2022-0847 (Dirty Pipe)",
        "CVE-2021-44228 (Log4Shell)"
    ];
    const selectedCVE = cveList[Math.floor(Math.random() * cveList.length)];

    const stages = [
        `[+] Loading custom exploit framework against target node [${target.name}]...`,
        `[*] Matching targeted defense profile against vulnerability database...`,
        `[+] Selected vector payload: ${selectedCVE}`,
        `[*] Constructing ROP chain & injecting memory payload into process stack...`,
        `[...] Sending binary buffer allocation request to target host...`
    ];

    // Emit live execution logs
    for (const stageMessage of stages) {
        let logType:  LogType = 'system';
        if (stageMessage.includes('[+] ')) logType = 'load';
        if (stageMessage.includes('[*] ')) logType = 'test';
        onLog?.({ type: logType, content: stageMessage });
        await delay(500);
    }

    // Success check: exploit rating vs target defense
    const successChance = Math.min(Math.max(0.5 + (exploitSkill - targetDefense) * 0.05, 0.15), 0.95);
    const isSuccess = Math.random() < successChance;

    await delay(700);

    if (isSuccess) {
        const injectedAddress = `0x${Math.floor(Math.random() * 0xFFFFFFFF).toString(16).padStart(8, '0')}`;
        updatePlayerStats({health: 94, xp: 1375});
        return {
            type: "action",
            content: `[+] SUCCESS: Exploit executed successfully.\n[+] Memory redirected at address [${injectedAddress}]\n[+] System privilege escalated on target node [${target.id}].`
        };
    } else {
        updatePlayerStats({health: -2, xp: 20});
        return {
            type: "error",
            content: `[-] FAIL: Buffer execution failed. Target system ASLR memory mitigation active.\n[-] Target node [${target.name}] firewall terminated remote thread.`
        };
    }
};

const simulatePortScanner: AttackHandler = async (services, onLog) => {
    const { target, performAction, updatePlayerStats } = services;

    // 1. Dispatch the scan action to game services
    performAction({
        action_type: "Scan",
        target_id: target.id,
        ability_id: 1,
    });

    const scanSpeed = 1;

    // Standard port definitions for target scanning
    const targetPorts = [
        { port: 21, service: "FTP (vsftpd 3.0.3)", state: "CLOSED" },
        { port: 22, service: "SSH (OpenSSH 8.2p1)", state: "OPEN" },
        { port: 80, service: "HTTP (nginx/1.18.0)", state: "OPEN" },
        { port: 443, service: "HTTPS (nginx/1.18.0)", state: "OPEN" },
        { port: 3306, service: "MySQL (5.7.33)", state: "FILTERED" },
    ];

    const stages = [
        `[+] Launching Nmap-style TCP SYN stealth scan on target node [${target.name}]...`,
        `[*] Probing top 1000 standard ports...`,
    ];

    for (const stageMessage of stages) {
        let logType: LogType = 'system';
        if (stageMessage.startsWith('[+]')) logType = 'load';
        else if (stageMessage.startsWith('[*]')) logType = 'test';

        onLog?.({ type: logType, content: stageMessage });
        await delay(400 / scanSpeed);
    }

    // Stream individual port discovery results
    onLog?.({ type: "system", content: "PORT     STATE    SERVICE" });
    for (const p of targetPorts) {
        await delay(250 / scanSpeed);
        const formattedPort = `${p.port}/tcp`.padEnd(9, " ");
        const formattedState = p.state.padEnd(8, " ");
        const content = `${formattedPort}${formattedState}${p.service}`;

        let logType: LogType = 'system';
        if (p.state === 'OPEN') logType = 'load';
        else if (p.state === 'FILTERED') logType = 'test';

        onLog?.({ type: logType, content });
    }

    await delay(500);

    // Calculate revealed stats
    const revealedDefense = 10;
    const revealedIntegrity = 100;
    const estimatedLevel = 1;

    // 2. Award reconnaissance XP upon successful completion
    const xpGained = 150;
    updatePlayerStats({ health: 0, xp: xpGained});

    return {
        type: "system",
        content: `[+] RECON COMPLETE: Target node profile compiled.\n` +
            `    ├─ Node ID: ${target.id}\n` +
            `    ├─ Defense Rating: ${revealedDefense}\n` +
            `    ├─ System Integrity: ${revealedIntegrity} HP\n` +
            `    └─ Security Level: Tier ${estimatedLevel}`
    };
};

const simulateDeepScanner: AttackHandler = async (services, onLog) => {
    const { target, performAction, updatePlayerStats } = services;
    performAction({
        action_type: "DeepScan",
        target_id: target.id,
        ability_id: 4, // Higher ability ID for advanced scanner
    });

    const targetIp = target.ip || "192.168.1.105";
    const scanSpeed = 1;

    await delay(400);

    const stages = [
        `[+] Initializing Deep Vulnerability Engine v4.1 against ${targetIp}...`,
        `[*] Running 142 NSE vulnerability scripts (Categories: vuln, exploit, auth)...`,
        `[*] Fingerprinting kernel version & active RPC protocols...`,
        `[*] Cross-referencing running daemon hashes with NVD database...`
    ];

    for (const stageMessage of stages) {
        let logType: LogType = 'system';
        if (stageMessage.startsWith('[+]')) logType = 'load';
        else if (stageMessage.startsWith('[*]')) logType = 'test';

        onLog?.({ type: logType, content: stageMessage });
        await delay(500 / scanSpeed);
    }

    // Discovered vulnerability profile
    const vulnerabilities = [
        { cve: "CVE-2023-38606", service: "Kernel Memory", severity: "CRITICAL (9.8)", vector: "Privilege Escalation" },
        { cve: "CVE-2021-44228", service: "Log4j v2.14", severity: "HIGH (8.1)", vector: "Remote Code Execution" },
        { cve: "CVE-2017-0144", service: "SMBv1 Service", severity: "MEDIUM (6.5)", vector: "EternalBlue Buffer Leak" }
    ];

    onLog?.({ type: "system", content: "\n[VULNERABILITY AUDIT REPORT]" });
    onLog?.({ type: "system", content: "CVE ID         SERVICE           SEVERITY         VECTOR" });
    onLog?.({ type: "system", content: "-----------------------------------------------------------------" });

    for (const vuln of vulnerabilities) {
        await delay(350 / scanSpeed);
        const formattedCve = vuln.cve.padEnd(15, " ");
        const formattedService = vuln.service.padEnd(18, " ");
        const formattedSeverity = vuln.severity.padEnd(17, " ");

        let logType: LogType = 'system';
        if (vuln.severity.startsWith('CRITICAL')) logType = 'load';
        else if (vuln.severity.startsWith('HIGH')) logType = 'test';

        onLog?.({
            type: logType,
            content: `${formattedCve}${formattedService}${formattedSeverity}${vuln.vector}`
        });
    }

    await delay(600);

    // Dynamic stats breakdown based on target node attributes
    const defense = target.defense ?? 10;
    const integrity = target.integrity ?? 100;
    const isCompromised = target.isCompromised ? "YES" : "NO";

    // 2. Award deep vulnerability audit XP upon completion
    const xpGained = 300;
    updatePlayerStats({health: 0, xp: xpGained,});

    return {
        type: "system",
        content: `\n[+] DEEP AUDIT COMPLETE for ${targetIp}\n` +
            `    ├─ Discovered Vectors: ${vulnerabilities.length} active vulnerabilities\n` +
            `    ├─ Base Defense Rating: ${defense} (Exploit Threshold: Level ${Math.max(1, Math.floor(defense / 2))})\n` +
            `    ├─ Core Integrity: ${integrity} HP\n` +
            `    └─ Root Compromised: ${isCompromised}`
    };
};

const simulatePacketSniffer: AttackHandler = async (services, onLog) => {
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    const { target } = services;
    const targetIp = target.ip || "192.168.1.105";
    const captureSpeed = 1;

    await delay(300);

    const stages = [
        `tcpdump: verbose output suppressed, use -v or -vv for full protocol decode`,
        `listening on eth0, link-type EN10MB (Ethernet), capture size 262144 bytes`,
        `[*] Sniffing unencrypted traffic to/from target ${targetIp}...`
    ];

    for (const stageMessage of stages) {
        let logType:  LogType = 'system';
        if (stageMessage.includes('[+] ')) logType = 'load';
        if (stageMessage.includes('[*] ')) logType = 'test';
        onLog?.({ type: logType, content: stageMessage });
        await delay(350 / captureSpeed);
    }

    // Simulated packet capture payloads
    const packets = [
        `21:04:12.102381 IP 10.0.0.42.49201 > ${targetIp}.21: Flags [P.], seq 1:28, ack 1`,
        `E..5..@.@..x...*...i..U.\nUSER admin_sys`,
        `21:04:12.185291 IP ${targetIp}.21 > 10.0.0.42.49201: Flags [P.], seq 1:34, ack 28`,
        `E..8..@.@..w...i...*..U.\n331 Please specify the password.`,
        `21:04:13.011409 IP 10.0.0.42.49201 > ${targetIp}.21: Flags [P.], seq 28:56, ack 34`,
        `E..8..@.@..v...*...i..U.\nPASS SuperSecret2026!`,
        `21:04:14.221084 IP 10.0.0.42.50112 > ${targetIp}.80: Flags [P.], seq 1:120, ack 1`,
        `POST /api/v1/auth HTTP/1.1\nHost: ${target.hostname || targetIp}\nAuthorization: Bearer sess_99a8f2c1401e`
    ];

    onLog?.({ type: "system", content: "\n[+] INTERCEPTED TRAFFIC STREAM:" });

    for (const packet of packets) {
        await delay(400 / captureSpeed);
        // Highlight packet payload vs header
        const isPayload = packet.includes("USER") || packet.includes("PASS") || packet.includes("Authorization");
        onLog?.({
            type: isPayload ? "load" : "system",
            content: packet
        });
    }

    await delay(600);

    return {
        type: "system",
        content: `\n[+] CAPTURE COMPLETE: 8 packets captured, 8 packets received by filter.\n` +
            `    ├─ Intercepted Plaintext FTP Credentials: [ admin_sys : SuperSecret2026! ]\n` +
            `    ├─ Discovered Auth Token: sess_99a8f2c1401e\n` +
            `    └─ Security Assessment: High risk - unencrypted protocols active on node [${target.id}].`
    };
};

const simulateCredentialStuffing: AttackHandler = async (services, onLog) => {
    const { target, performAction, updatePlayerStats } = services;

    performAction({
        action_type: "CredentialStuffing",
        target_id: target.id,
        ability_id: 5,
    });

    const targetIp = target.ip || "192.168.1.105";
    const targetHost = target.hostname || targetIp;
    const attackSpeed = 1;

    await delay(300);

    const stages = [
        `[+] Initializing multi-threaded auth stuffing engine v2.8...`,
        `[+] Loaded combo list [breach_dump.txt] (45,200 unique identity pairs)...`,
        `[*] Rotating proxy pool (128 active SOCKS5 exit nodes)...`,
        `[*] Testing credential pairs against endpoint: https://${targetHost}/api/login...`
    ];

    for (const stageMessage of stages) {
        let logType: LogType = 'system';
        if (stageMessage.startsWith('[+]')) logType = 'load';
        else if (stageMessage.startsWith('[*]')) logType = 'test';

        onLog?.({ type: logType, content: stageMessage });
        await delay(450 / attackSpeed);
    }

    // Simulated progress updates showing no matches
    const progressLogs = [
        `[*] Progress: 25% (11,300/45,200) | 120 req/s | Rate-limit: NOMINAL`,
        `[*] Progress: 50% (22,600/45,200) | 118 req/s | WAF status: NOMINAL`,
        `[*] Progress: 75% (33,900/45,200) | 110 req/s | Validations: 0 MATCHES`,
        `[*] Progress: 100% (45,200/45,200) | 105 req/s | Process Completed`
    ];

    for (const logMsg of progressLogs) {
        await delay(400 / attackSpeed);
        let logType: LogType = 'system';
        if (logMsg.startsWith('[*]')) logType = 'test';
        onLog?.({ type: logType, content: logMsg });
    }

    await delay(600);

    updatePlayerStats({health: 0, xp: 50,});

    // Output: No credentials found
    return {
        type: "error",
        content: `\n[-] STUFFING EXHAUSTED for ${targetHost}\n` +
            `    ├─ Total Tested: 45,200 combos\n` +
            `    ├─ Matches Found: 0 valid accounts\n` +
            `    └─ Result: Target credentials not present in provided list.`
    };
};

const simulateSessionHijack: AttackHandler = async (services, onLog) => {
    const { target, connections } = services;

    const targetIp = target.ip || "192.168.1.105";
    const targetHost = target.hostname || targetIp;
    const hackingSkill = 1;

    // Guard Clause: Validate active bot for target IP
    const matchingBot = connections.find(
        (connection) => connection.status === "bot" && connection.targetIp === targetIp
    );

    if (!matchingBot) {
        return {
            type: "error",
            content: `\n[-] SESSION HIJACK ABORTED on ${targetHost}\n` +
                `    ├─ Reason: No active bot connection found targeting IP ${targetIp}.\n` +
                `    └─ Security Action: Attack initialization failed.`
        };
    }

    // Realistic token generators
    const generateSessionId = () => Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const generateCsrfToken = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    const stolenSessionId = `PHPSESSID=${generateSessionId()}`;
    const csrfToken = generateCsrfToken();
    const epochExpiry = Math.floor(Date.now() / 1000) + 86400; // 24h into the future

    await delay(300);

    const stages = [
        `[+] Injecting stolen cookie header [Cookie: ${stolenSessionId}; path=/; Secure; HttpOnly] into HTTP proxy stack`,
        `[*] Target session endpoint: https://${targetHost}/admin/dashboard`,
        `[*] Verifying cookie validity and expiration epoch [Expires: ${epochExpiry}]`,
        `[+] Token status: ACTIVE | Validated context: user="admin" (UID: 1001)`,
        `[*] Overriding client headers: X-CSRF-Token="${csrfToken}"`
    ];

    for (const stageMessage of stages) {
        let logType: LogType = 'system';
        if (stageMessage.startsWith('[+] ')) logType = 'load';
        if (stageMessage.startsWith('[*] ')) logType = 'test';
        onLog?.({ type: logType, content: stageMessage });
        await delay(400);
    }

    await delay(500);

    // Success check based on security parameters
    const targetDefense = target.defense ?? 10;
    const isSecurityStrict = target.securityLevel ? target.securityLevel > 3 : false;

    const baseChance = isSecurityStrict ? 0.45 : 0.75;
    const successChance = Math.min(Math.max(baseChance + (hackingSkill - targetDefense) * 0.05, 0.15), 0.95);
    const isSuccess = Math.random() < successChance;

    if (isSuccess) {
        const adminBearer = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({ uid: 1001, role: "admin", exp: epochExpiry })).replace(/=/g, '')}`;

        return {
            type: "system",
            content: `\n[+] SESSION HIJACK SUCCESSFUL on ${targetHost}\n` +
                `    ├─ Active Session Claimed: user="admin" (UID: 1001)\n` +
                `    ├─ High-Privilege Bearer Token: Bearer ${adminBearer}\n` +
                `    ├─ Access Level: Full Administrative Access (Scope: root)\n` +
                `    └─ Root Node Status: [COMPROMISED]`
        };
    }

    return {
        type: "error",
        content: `\n[-] SESSION HIJACK FAILED on ${targetHost}\n` +
            `    ├─ Reason: Session binding mismatch (TLS fingerprinting mismatch on ${targetIp}).\n` +
            `    └─ Security Action: Session invalidated by target Intrusion Prevention System.`
    };
};

const simulateMalwareDrop: AttackHandler = async (services, onLog) => {
    const { target, connections, updatePlayerStats } = services;

    const targetIp = target.ip || "192.168.1.105";
    const targetHost = target.hostname || targetIp;
    const stealthRating = 1;

    // Guard Clause: Ensure target is an active compromised bot connection
    const targetBot = connections.find(
        (connection) => connection.status === "bot" && connection.targetIp === targetIp
    );

    if (!targetBot) {
        return {
            type: "error",
            content: `\n[-] MALWARE DROP ABORTED on ${targetHost}\n` +
                `    ├─ Reason: Target is not registered as an active compromised bot node.\n` +
                `    └─ Security Action: Payload execution prohibited on unverified target.`
        };
    }

    // Dynamic generation of realistic artifact identifiers
    const generateHex = (len: number) => Array.from({ length: len }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const payloadHash = generateHex(12);
    const pid = Math.floor(Math.random() * (9000 - 1000) + 1000);
    const c2Domain = `sysupdate-telemetry-${generateHex(4)}.internal-cdn.net`;

    await delay(300);

    // Believable execution stages using real Linux internal mechanisms
    const stages = [
        `[+] Fetching obfuscated payload stage via https://${c2Domain}:443/api/v2/update_${payloadHash}.bin`,
        `[*] Invoking memfd_create("elf_exec", MFD_CLOEXEC) to allocate anonymous RAM file descriptor`,
        `[+] Staging payload payload directly to memory (FD: /proc/self/fd/3) - Bypassing disk write`,
        `[*] Executing elf_exec via fexecve (PID: ${pid}) under spoofed process identifier [kworker/0:2]`,
        `[*] Initiating mbedTLS handshake to ${c2Domain}:443 (eSNI & domain fronting enabled)`,
        `[*] Installing persistence timer unit [/etc/systemd/system/systemd-networkd-sync.timer]`
    ];

    for (const stageMessage of stages) {
        let logType: LogType = 'system';
        if (stageMessage.startsWith('[+] ')) logType = 'load';
        if (stageMessage.startsWith('[*] ')) logType = 'test';
        onLog?.({ type: logType, content: stageMessage });
        await delay(450);
    }

    await delay(500);

    // Success check vs target defense
    const targetDefense = target.defense ?? 10;
    const baseChance = 0.70;
    const successChance = Math.min(Math.max(baseChance + (stealthRating - targetDefense) * 0.05, 0.20), 0.95);
    const isSuccess = Math.random() < successChance;

    if (isSuccess) {
        const beaconId = generateHex(8);
        updatePlayerStats({health: -12, xp: 1123});
        return {
            type: "system",
            content: `\n[+] MALWARE DROP SUCCESSFUL on ${targetHost}\n` +
                `    ├─ C2 Beacon Established: ID [bcn_${beaconId}]\n` +
                `    ├─ Execution Vector: In-Memory Fileless (memfd_create / fexecve)\n` +
                `    ├─ Process Masquerade: [kworker/0:2] (PID ${pid})\n` +
                `    ├─ Persistence: systemd timer [systemd-networkd-sync.timer]\n` +
                `    └─ Node Status: [PERMANENTLY BACKDOORED]`
        };
    }

    return {
        type: "error",
        content: `\n[-] MALWARE DROP BLOCKED on ${targetHost}\n` +
            `    ├─ Reason: Host-based EDR (eBPF process probe) flagged anomalous memfd execution.\n` +
            `    └─ Security Action: PID ${pid} terminated & memory pages wiped by kernel agent.`
    };
};

const simulateDDoSBurst: AttackHandler = async (services, onLog) => {
    const { target, connections, performAction, updatePlayerStats } = services;

    const targetIp = target.ip || "192.168.1.105";
    const targetHost = target.hostname || targetIp;

    // 1. Guard Clause: Calculate active botnet size from connections
    const activeBots = connections.filter((connection) => connection.status === "bot");
    const botnetSize = activeBots.length;

    if (botnetSize === 0) {
        return {
            type: "error",
            content: `\n[-] DDOS BURST ABORTED on ${targetHost}\n` +
                `    ├─ Reason: Zero active compromised bot nodes available in C2 inventory.\n` +
                `    └─ Security Action: Volumetric flood payload failed to initiate.`
        };
    }

    // 2. Dynamic Metric Calculations based on Botnet Scale
    const attackPower = 1;
    const gbps = (botnetSize * 0.085 + Math.random() * 2).toFixed(1); // Scales bandwidth with bot count
    const mpps = (botnetSize * 0.12 + Math.random()).toFixed(1);     // Mega Packets Per Second
    const reflectionVector = botnetSize > 50 ? "DNS/NTP Reflection & TCP SYN-ACK" : "UDP Volumetric Flood";

    // 3. Execution Stage: Believable Attack Logs
    await delay(300);

    const stages = [
        `[!] WARNING: HIGH NOISE VOLUMETRIC ATTACK INITIATED`,
        `[+] Dispatching payload payload manifest to ${botnetSize} zombie nodes across C2 subnets`,
        `[+] Initializing spoofed raw sockets for ${reflectionVector} attack vector`,
        `[*] Synchronizing UDP/TCP packet bursts against target endpoint ${targetIp}:443`,
        `[*] VOLUMETRIC FLOOD ACTIVE: Saturation pipeline broadcasting at ~${gbps} Gbps peak output`
    ];

    updatePlayerStats({ health: -54, xp: 1561 })
    for (const stageMessage of stages) {
        let logType: LogType = 'system';
        if (stageMessage.startsWith('[+] ')) logType = 'load';
        if (stageMessage.startsWith('[*] ')) logType = 'test';
        onLog?.({ type: logType, content: stageMessage });
        await delay(350);
    }

    // Dynamic Traffic & Impact Updates
    const burstLogs = [
        `[>>>] Ingress Rate: ${mpps} Mpps | Target Pipeline Bandwidth Saturation: 98.4%`,
        `[!] TCP Connection backlog queue full (ACK-FLOOD socket exhaustion | HTTP 503)`,
        `[!] Upstream Tier-1 Transit Provider trigger: Anycast BGP Route Scrubbing activated!`
    ];

    for (const logMsg of burstLogs) {
        await delay(400);
        onLog?.({ type: "system", content: logMsg });
    }

    await delay(500);

    // 4. Perform Game Action
    if (target.id) {
        await performAction?.({
            action_type: "DDoS",
            target_id: target.id,
            ability_id: 5,
        });
    }

    // 5. Calculate Structural Damage
    const baseDamage = 40;
    const damageDealt = Math.min(
        target.integrity ?? 100,
        baseDamage + Math.floor(attackPower * 5) + Math.floor(botnetSize * 1.5)
    );
    const newIntegrity = Math.max(0, (target.integrity ?? 100) - damageDealt);

    return {
        type: "system",
        content: `\n[+] DDOS BURST CONCLUDED on ${targetHost}\n` +
            `    ├─ Participating Bots: ${botnetSize} active nodes\n` +
            `    ├─ Traffic Rate: ${gbps} Gbps / ${mpps} Mpps (${reflectionVector})\n` +
            `    ├─ Node Integrity Impact: -${damageDealt} HP (Remaining: ${newIntegrity} HP)\n` +
            `    ├─ Defense Rating Degraded: -5 Defense\n` +
            `    └─ Trace Alert Level: CRITICAL (+40% Exposure)`
    };
};

const simulateZeroDay: AttackHandler = async (services, onLog) => {
    const { target, updatePlayerStats } = services;
    const targetIp = target.ip || "192.168.1.105";
    const targetHost = target.hostname || targetIp;

    await delay(300);

    // Educational telemetry logs instead of fake exploitation
    const stages = [
        `[!] ZERO-DAY (0-DAY) RESEARCH ANALYSIS INITIATED for ${targetHost}`,
        `[*] Definition: A Zero-Day is a software vulnerability unknown to the software vendor with zero days available to patch it.`,
        `[+] Discovery Reality: Zero-days require months of static code auditing, reverse engineering, and fuzzing.`,
        `[*] Market Dynamics: Weaponized zero-days sell for $100K to $2M+ on public/private exploit markets (e.g., Zerodium).`,
        `[*] Defense Vector: Modern systems rely on memory safeguards (ASLR, DEP, CFI) that make reliable zero-day execution exceptionally rare.`
    ];

    for (const stageMessage of stages) {
        let logType: LogType = 'system';
        if (stageMessage.startsWith('[+] ')) logType = 'load';
        if (stageMessage.startsWith('[*] ')) logType = 'test';
        onLog?.({ type: logType, content: stageMessage });
        await delay(500);
    }

    await delay(600);

    updatePlayerStats({ health: 95, xp: 1564 });
    return {
        type: "system",
        content: `\n[***] ZERO-DAY ANALYSIS COMPLETE [***]\n` +
            `    ├─ Target Host: ${targetHost} (${targetIp})\n` +
            `    ├─ Concept: Unknown security flaw with no existing vendor patch or signature.\n` +
            `    ├─ Rarity & Cost: High complexity; typically deployed by nation-state Threat Actors or Advanced Persistent Threats (APTs).\n` +
            `    ├─ Mitigation: Defense-in-depth, strict sandboxing, dynamic monitoring (EDR), and Bug Bounty programs.\n` +
            `    └─ Result: Informational Briefing Delivered (No exploit executed).`
    };
};

const simulateLogWiper: AttackHandler = async (services, onLog) => {
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    const { target } = services;
    const targetIp = target.ip || "192.168.1.105";
    const targetHost = target.hostname || targetIp;
    const stealthSkill = 1;

    await delay(300);

    const stages = [
        `[+] Locating active log daemons on target [${targetHost}]...`,
        `[*] Terminating auditd, rsyslog, and systemd-journald threads...`,
        `[+] Overwriting /var/log/auth.log with random zero-patterns (3 passes)...`,
        `[*] Unlinking and shredding security logs...`,
        `[+] Executing clear-eventlog against Windows/Linux unified log buffers...`,
        `[*] Flushing bash history and memory ring buffers ($HISTFILE cleared)...`
    ];

    for (const stageMessage of stages) {
        let logType:  LogType = 'system';
        if (stageMessage.includes('[+] ')) logType = 'load';
        if (stageMessage.includes('[*] ')) logType = 'test';
        onLog?.({ type: logType, content: stageMessage });
        await delay(400);
    }

    await delay(500);

    // Calculate trace reduction based on stealth skill
    const traceReduction = Math.min(100, 25 + stealthSkill * 5);

    return {
        type: "system",
        content: `\n[+] LOG WIPER CONCLUDED on ${targetHost}\n` +
            `    ├─ Audit Trails Cleared: /var/log/auth.log, sys.log, journald\n` +
            `    ├─ Event Logs Purged: ALL\n` +
            `    ├─ Trace Level Reduction: -${traceReduction}%\n` +
            `    └─ Intrusion Footprint: NEUTRALIZED`
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
    services: GameContextServices,
    onLog?: LogCallback
): Promise<AttackResult> => {
    const handler = AttackActionMap[action];

    if (!handler) {
        throw new Error(`Game Error: Unknown ability "${action}" cast.`);
    }

    try {
        return await handler(services, onLog);
    } catch (error) {
        return {
            type: 'error',
            content: 'SYSTEM ERROR'
        };
    }
};