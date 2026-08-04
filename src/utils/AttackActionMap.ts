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
    ip: string;
    hostname: string;
    securityLevel: number; // e.g., 1 to 5
    defense: number;
    integrity: number;
    isCompromised: boolean;
    isFirewallActive?: boolean;
}

// Represents the result of a turn/action
export interface AttackResult {
    type: "system" | "error";
    content: string
}

export type LogCallback = (entry: { type: "system" | "error"; content: string }) => void;
export type AttackHandler = (target: NodeState, playerStats: any, onLog?: LogCallback) => Promise<AttackResult>;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ============================================================================
// Simulated Game Attack Handlers
// ============================================================================

const simulateBruteForce: AttackHandler = async (target, playerStats, onLog) => {
    const wordlists = ["rockyou_top1000.txt", "common_ssh_passwords.dic", "cisco_default_creds.lst"];
    const targetPort = 22;

    const stages = [
        `[+] Initializing Hydra v9.4 brute-force engine against target ${target.id}:${targetPort}...`,
        `[+] Loaded wordlist [${wordlists[0]}] (14,582 combinations)...`,
        `[*] Testing SSH-2.0-OpenSSH_8.2p1 handshake...`,
        `[*] Cracking in progress: 25% (3,645/14,582) | 480 req/s...`,
        `[*] Cracking in progress: 68% (9,915/14,582) | 512 req/s...`,
    ];

    // Emit live logs to the UI sequentially during the attack phase
    for (const stageMessage of stages) {
        onLog?.({ type: "system", content: stageMessage });
        await delay(500); // UI updates live during each delay!
    }

    // Determine final outcome
    const isSuccess = Math.random() > 0.3;

    if (isSuccess) {
        return {
            type: "system",
            content: `[+] SUCCESS: SSH credentials recovered for root@${target.id}\n[+] Match found: "root:admin_9021"`
        };
    } else {
        return {
            type: "error",
            content: `[-] FAIL: Wordlist exhausted without matching hash.`
        };
    }
};

const simulatePhishingKit: AttackHandler = async (target, playerStats, onLog) => {
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const socialEngineeringSkill = playerStats?.socialEngineering ?? 1;
    const targetPort = 443;

    // Phishing campaign simulation stages
    const stages = [
        `[+] Initializing Social Engineering Toolkit (SET) v8.2...`,
        `[+] Cloning login portal interface for host domain: ${target.hostname || target.id}...`,
        `[*] Generating spoofed SSL certificate and temporary redirect payload...`,
        `[+] Crafting spear-phishing email vector targeting host administrator...`,
        `[*] Campaign launched. Monitoring target response on port ${targetPort}...`,
        `[...] Awaiting target interaction (victim authentication attempt)...`
    ];

    // Emit live terminal logs
    for (const stageMessage of stages) {
        onLog?.({ type: "system", content: stageMessage });
        await delay(600);
    }

    // Success probability based on player skill vs target defense/integrity
    const baseSuccessChance = 0.60;
    const skillBonus = socialEngineeringSkill * 0.05;
    const isSuccess = Math.random() < Math.min(Math.max(baseSuccessChance + skillBonus, 0.15), 0.90);

    await delay(800);

    if (isSuccess) {
        const fakeSessionToken = Math.random().toString(36).substring(2, 15);
        return {
            type: "system",
            content: `[+] SUCCESS: Victim authenticated via cloned portal.\n[+] Captured session token: auth_bearer_${fakeSessionToken}\n[+] Host ${target.id} security bypass complete.`
        };
    } else {
        return {
            type: "error",
            content: `[-] FAIL: Phishing email flagged by target email filter / MFA verification failed.\n[-] Target security awareness triggered on node ${target.id}.`
        };
    }
};

const useExploitScript: AttackHandler = async (target, playerStats, onLog) => {
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const exploitSkill = playerStats?.exploitRating ?? playerStats?.hacking ?? 1;
    const targetDefense = 10;

    // Simulated vulnerability database / CVE tags
    const cveList = [
        "CVE-2024-3094 (XZ Utils Backdoor)",
        "CVE-2023-4911 (Looney Tunables)",
        "CVE-2022-0847 (Dirty Pipe)",
        "CVE-2021-44228 (Log4Shell)"
    ];
    const selectedCVE = cveList[Math.floor(Math.random() * cveList.length)];

    const stages = [
        `[+] Loading custom exploit framework against target node [${target.id}]...`,
        `[*] Matching targeted defense profile against vulnerability database...`,
        `[+] Selected vector payload: ${selectedCVE}`,
        `[*] Constructing ROP chain & injecting memory payload into process stack...`,
        `[...] Sending binary buffer allocation request to target host...`
    ];

    // Emit live execution logs
    for (const stageMessage of stages) {
        onLog?.({ type: "system", content: stageMessage });
        await delay(500);
    }

    // Success check: exploit rating vs target defense
    const successChance = Math.min(Math.max(0.5 + (exploitSkill - targetDefense) * 0.05, 0.15), 0.95);
    const isSuccess = Math.random() < successChance;

    await delay(700);

    if (isSuccess) {
        const injectedAddress = `0x${Math.floor(Math.random() * 0xFFFFFFFF).toString(16).padStart(8, '0')}`;
        return {
            type: "system",
            content: `[+] SUCCESS: Exploit executed successfully.\n[+] Memory redirected at address [${injectedAddress}]\n[+] System privilege escalated on target node [${target.id}].`
        };
    } else {
        return {
            type: "error",
            content: `[-] FAIL: Buffer execution failed. Target system ASLR memory mitigation active.\n[-] Target node [${target.id}] firewall terminated remote thread.`
        };
    }
};

const simulatePortScanner: AttackHandler = async (target, playerStats, onLog) => {
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const scanSpeed = playerStats?.scanSpeed ?? 1;

    // Standard port definitions for target scanning
    const targetPorts = [
        { port: 21, service: "FTP (vsftpd 3.0.3)", state: "CLOSED" },
        { port: 22, service: "SSH (OpenSSH 8.2p1)", state: "OPEN" },
        { port: 80, service: "HTTP (nginx/1.18.0)", state: "OPEN" },
        { port: 443, service: "HTTPS (nginx/1.18.0)", state: "OPEN" },
        { port: 3306, service: "MySQL (5.7.33)", state: "FILTERED" },
    ];

    const stages = [
        `[+] Launching Nmap-style TCP SYN stealth scan on target node [${target.id}]...`,
        `[*] Probing top 1000 standard ports...`,
    ];

    for (const stageMessage of stages) {
        onLog?.({ type: "system", content: stageMessage });
        await delay(400 / scanSpeed);
    }

    // Stream individual port discovery results
    onLog?.({ type: "system", content: "PORT     STATE    SERVICE" });
    for (const p of targetPorts) {
        await delay(250 / scanSpeed);
        const formattedPort = `${p.port}/tcp`.padEnd(9, " ");
        const formattedState = p.state.padEnd(8, " ");
        onLog?.({
            type: "system",
            content: `${formattedPort}${formattedState}${p.service}`
        });
    }

    await delay(500);

    // Calculate revealed stats
    const revealedDefense = 10;
    const revealedIntegrity =  100;
    const estimatedLevel = target.securityLevel ?? Math.ceil(revealedDefense / 2);

    return {
        type: "system",
        content: `[+] RECON COMPLETE: Target node profile compiled.\n` +
            `    ├─ Node ID: ${target.id}\n` +
            `    ├─ Defense Rating: ${revealedDefense}\n` +
            `    ├─ System Integrity: ${revealedIntegrity} HP\n` +
            `    └─ Security Level: Tier ${estimatedLevel}`
    };
};

const simulateDeepScanner: AttackHandler = async (target, playerStats, onLog) => {
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const targetIp = target.ip || "192.168.1.105";
    const scanSpeed = playerStats?.scanSpeed ?? 1;

    await delay(400);

    const stages = [
        `[+] Initializing Deep Vulnerability Engine v4.1 against ${targetIp}...`,
        `[*] Running 142 NSE vulnerability scripts (Categories: vuln, exploit, auth)...`,
        `[*] Fingerprinting kernel version & active RPC protocols...`,
        `[*] Cross-referencing running daemon hashes with NVD database...`
    ];

    for (const stageMessage of stages) {
        onLog?.({ type: "system", content: stageMessage });
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

        onLog?.({
            type: "system",
            content: `${formattedCve}${formattedService}${formattedSeverity}${vuln.vector}`
        });
    }

    await delay(600);

    // Dynamic stats breakdown based on target node attributes
    const defense = target.defense ?? 10;
    const integrity = target.integrity ?? 100;
    const isCompromised = target.isCompromised ? "YES" : "NO";

    return {
        type: "system",
        content: `\n[+] DEEP AUDIT COMPLETE for ${targetIp}\n` +
            `    ├─ Discovered Vectors: ${vulnerabilities.length} active vulnerabilities\n` +
            `    ├─ Base Defense Rating: ${defense} (Exploit Threshold: Level ${Math.max(1, Math.floor(defense / 2))})\n` +
            `    ├─ Core Integrity: ${integrity} HP\n` +
            `    └─ Root Compromised: ${isCompromised}`
    };
};

const simulatePacketSniffer: AttackHandler = async (target, playerStats, onLog) => {
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const targetIp = target.ip || "192.168.1.105";
    const captureSpeed = playerStats?.scanSpeed ?? 1;

    await delay(300);

    const stages = [
        `tcpdump: verbose output suppressed, use -v or -vv for full protocol decode`,
        `listening on eth0, link-type EN10MB (Ethernet), capture size 262144 bytes`,
        `[*] Sniffing unencrypted traffic to/from target ${targetIp}...`
    ];

    for (const stageMessage of stages) {
        onLog?.({ type: "system", content: stageMessage });
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
            type: isPayload ? "system" : "system",
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

const simulateCredentialStuffing: AttackHandler = async (target, playerStats, onLog) => {
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const targetIp = target.ip || "192.168.1.105";
    const targetHost = target.hostname || targetIp;
    const attackSpeed = playerStats?.scanSpeed ?? 1;
    const hackingSkill = playerStats?.hacking ?? 1;

    await delay(300);

    const stages = [
        `[+] Initializing multi-threaded auth stuffing engine v2.8...`,
        `[+] Loaded combo list [breach_dump.txt] (45,200 unique identity pairs)...`,
        `[*] Rotating proxy pool (128 active SOCKS5 exit nodes)...`,
        `[*] Testing credential pairs against endpoint: https://${targetHost}/api/login...`
    ];

    for (const stageMessage of stages) {
        onLog?.({ type: "system", content: stageMessage });
        await delay(450 / attackSpeed);
    }

    // Simulated progress updates
    const progressLogs = [
        `[*] Progress: 15% (6,780/45,200) | 120 req/s | Rate-limit: NOMINAL`,
        `[*] Progress: 42% (18,984/45,200) | 115 req/s | WAF status: BYPASSED`,
        `[!] Match detected: row #22,401 [usr: dev_lead@corp.internal]`,
        `[*] Progress: 78% (35,256/45,200) | 98 req/s | Captcha trigger: NEUTRALIZED`
    ];

    for (const logMsg of progressLogs) {
        await delay(400 / attackSpeed);
        onLog?.({ type: "system", content: logMsg });
    }

    await delay(600);

    // Success probability based on hacking skill vs target defense
    const targetDefense = target.defense ?? 10;
    const successChance = Math.min(Math.max(0.65 + (hackingSkill - targetDefense) * 0.04, 0.20), 0.90);
    const isSuccess = Math.random() < successChance;

    if (isSuccess) {
        const generatedPass = `P@ss_${Math.floor(1000 + Math.random() * 9000)}`;
        return {
            type: "system",
            content: `\n[+] CREDENTIAL STUFFING COMPLETE for ${targetHost}\n` +
                `    ├─ Total Tested: 45,200 combos\n` +
                `    ├─ Matches Found: 1 valid account\n` +
                `    ├─ Credential Pair: [ dev_lead@corp.internal : ${generatedPass} ]\n` +
                `    └─ Privilege Level: Developer / Internal API Access`
        };
    } else {
        return {
            type: "error",
            content: `\n[-] ATTACK HALTED: Target host ${targetHost} enforced IP lockout / Cloudflare Bot Management.\n` +
                `    └─ Error 429: Too Many Requests. Combo list exhausted without valid access.`
        };
    }
};

const simulateSessionHijack: AttackHandler = async (target, playerStats, onLog) => {
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const targetIp = target.ip || "192.168.1.105";
    const targetHost = target.hostname || targetIp;
    const hackingSkill = playerStats?.hacking ?? 1;

    await delay(300);

    const stages = [
        `[+] Injecting stolen cookie header [SESSIONID=x9f8a2...] into HTTP proxy stack...`,
        `[*] Target session endpoint: https://${targetHost}/admin/dashboard`,
        `[*] Verifying cookie validity and expiration epoch...`,
        `[+] Token status: ACTIVE | Valid for target user: "admin"`,
        `[*] Overriding current user context and injecting CSRF token...`
    ];

    for (const stageMessage of stages) {
        onLog?.({ type: "system", content: stageMessage });
        await delay(400);
    }

    await delay(500);

    // Success check based on target defense and security level vs hacking skill
    const targetDefense = target.defense ?? 10;
    const isSecurityStrict = target.securityLevel ? target.securityLevel > 3 : false;

    const baseChance = isSecurityStrict ? 0.45 : 0.75;
    const successChance = Math.min(Math.max(baseChance + (hackingSkill - targetDefense) * 0.05, 0.15), 0.95);
    const isSuccess = Math.random() < successChance;

    if (isSuccess) {
        const adminToken = Math.random().toString(36).substring(2, 12);
        return {
            type: "system",
            content: `\n[+] SESSION HIJACK SUCCESSFUL on ${targetHost}\n` +
                `    ├─ Active Session Claimed: user="admin"\n` +
                `    ├─ High-Privilege Bearer Token: auth_admin_${adminToken}\n` +
                `    ├─ Access Level: Full Administrative Access\n` +
                `    └─ Root Node Status: [COMPROMISED]`
        };
    } else {
        return {
            type: "error",
            content: `\n[-] SESSION HIJACK FAILED on ${targetHost}\n` +
                `    ├─ Reason: Token revoked or IP binding mismatch detected by server.\n` +
                `    └─ Security Action: Session invalidated by target Intrusion Prevention System.`
        };
    }
};

const simulateMalwareDrop: AttackHandler = async (target, playerStats, onLog) => {
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const targetIp = target.ip || "192.168.1.105";
    const targetHost = target.hostname || targetIp;
    const stealthRating = playerStats?.stealth ?? playerStats?.hacking ?? 1;

    await delay(300);

    const stages = [
        `[+] Fetching remote payload stage2.sh from http://c2.server...`,
        `[*] Pipe executing script directly in memory via bash process...`,
        `[+] Unpacking stage 2 payload: implant.elf (architecture: x86_64)`,
        `[*] Establishing persistent reverse shell to C2 server on port 4444...`,
        `[*] Writing systemd service entry [/etc/systemd/system/net-mon.service]...`
    ];

    for (const stageMessage of stages) {
        onLog?.({ type: "system", content: stageMessage });
        await delay(450);
    }

    await delay(500);

    // Success check: stealth/hacking vs target defense
    const targetDefense = target.defense ?? 10;
    const baseChance = 0.70;
    const successChance = Math.min(Math.max(baseChance + (stealthRating - targetDefense) * 0.05, 0.20), 0.95);
    const isSuccess = Math.random() < successChance;

    if (isSuccess) {
        const beaconId = Math.random().toString(36).substring(2, 10);
        return {
            type: "system",
            content: `\n[+] MALWARE DROP SUCCESSFUL on ${targetHost}\n` +
                `    ├─ C2 Beacon Established: ID [bcn_${beaconId}]\n` +
                `    ├─ Persistence Method: systemd background service\n` +
                `    ├─ Privileges: root / SYSTEM\n` +
                `    └─ Node Status: [PERMANENTLY BACKDOORED]`
        };
    } else {
        return {
            type: "error",
            content: `\n[-] MALWARE DROP BLOCKED on ${targetHost}\n` +
                `    ├─ Reason: Host-based Endpoint Detection (EDR) flagged memory execution.\n` +
                `    └─ Security Action: Suspicious bash process killed & payload deleted.`
        };
    }
};

const simulateDDoSBurst: AttackHandler = async (target, playerStats, onLog) => {
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const targetIp = target.ip || "192.168.1.105";
    const targetHost = target.hostname || targetIp;
    const botnetSize = playerStats?.botnetSize ?? 1000;
    const attackPower = playerStats?.hacking ?? 1;

    await delay(300);

    const stages = [
        `[!] WARNING: HIGH NOISE MOVE INITIATED`,
        `[+] Connecting to Command & Control network (${botnetSize} active nodes)...`,
        `[+] Synchronizing TCP SYN packet vectors against target ${targetIp}:80/443...`,
        `[*] FLOOD STARTED: Transmitting 10 Gbps peak packet burst...`
    ];

    for (const stageMessage of stages) {
        onLog?.({ type: "system", content: stageMessage });
        await delay(350);
    }

    // Volumetric flood updates
    const burstLogs = [
        `[>>>] Packet Rate: 14.2 Mpps | Bandwidth Saturation: 94%`,
        `[!] Target server socket queue exhausted (HTTP 503 Service Unavailable)...`,
        `[!] ISP Scrubbing Center alert triggered on network segment!`
    ];

    for (const logMsg of burstLogs) {
        await delay(400);
        onLog?.({ type: "system", content: logMsg });
    }

    await delay(500);

    // Calculate massive structural damage to node integrity/defense
    const baseDamage = 80;
    const damageDealt = Math.min(
        target.integrity ?? 100,
        baseDamage + Math.floor(attackPower * 5) + Math.floor(botnetSize / 200)
    );
    const newIntegrity = Math.max(0, (target.integrity ?? 100) - damageDealt);

    return {
        type: "system",
        content: `\n[+] DDOS BURST CONCLUDED on ${targetHost}\n` +
            `    ├─ Traffic Rate: 10.2 Gbps (SYN Flood)\n` +
            `    ├─ Node Integrity Impact: -${damageDealt} HP (Remaining: ${newIntegrity} HP)\n` +
            `    ├─ Defense Rating Degraded: -5 Defense\n` +
            `    └─ Trace Alert Level: CRITICAL (+40% Detection Exposure)`
    };
};

const simulateZeroDay: AttackHandler = async (target, playerStats, onLog) => {
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const targetIp = target.ip || "192.168.1.105";
    const targetHost = target.hostname || targetIp;

    await delay(300);

    const stages = [
        `[!] INITIATING UNPUBLISHED ZERO-DAY VECTOR (CVE-PENDING)...`,
        `[*] Target Kernel Family: Linux 6.x (x86_64)`,
        `[+] Triggering kmalloc heap corruption primitive in networking subsystem...`,
        `[*] Bypassing KASLR memory randomize placement...`,
        `[*] Arbitrary kernel write achieved: overwriting task_struct credentials...`,
        `[+] Injecting shellcode into privilege namespace PID 1...`
    ];

    for (const stageMessage of stages) {
        onLog?.({ type: "system", content: stageMessage });
        await delay(450);
    }

    await delay(600);

    // Ultimate Move: Ignores defense and integrity calculations completely
    const previousIntegrity = target.integrity ?? 100;
    const damageDealt = previousIntegrity; // Instantly depletes target integrity or forces compromise

    return {
        type: "system",
        content: `\n[***] ZERO-DAY EXECUTION SUCCESSFUL [***]\n` +
            `    ├─ Target Host: ${targetHost} (${targetIp})\n` +
            `    ├─ Defense Mitigation: IGNORED (100% Penetration)\n` +
            `    ├─ Root Shell: Granted (uid=0[root] gid=0[root])\n` +
            `    ├─ System Integrity Impact: -${damageDealt} HP (CRITICAL FAILURE)\n` +
            `    └─ Node Status: [FULLY SUBJUGATED]`
    };
};

const simulateLogWiper: AttackHandler = async (target, playerStats, onLog) => {
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const targetIp = target.ip || "192.168.1.105";
    const targetHost = target.hostname || targetIp;
    const stealthSkill = playerStats?.stealth ?? playerStats?.hacking ?? 1;

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
        onLog?.({ type: "system", content: stageMessage });
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
    targetNode: NodeState,
    playerStats: any,
    onLog?: LogCallback
): Promise<AttackResult> => {
    const handler = AttackActionMap[action];

    if (!handler) {
        throw new Error(`Game Error: Unknown ability "${action}" cast.`);
    }

    try {
        return await handler(targetNode, playerStats, onLog);
    } catch (error) {
        return {
            type: 'error',
            content: 'SYSTEM ERROR'
        };
    }
};