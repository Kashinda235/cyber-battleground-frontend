export interface RealSecurityLog {
    id: string;
    timestamp: string;
    sourceTool: 'SPLUNK' | 'WIRESHARK' | 'EDR' | 'FIREWALL' | 'IAM';
    level: 'INFO' | 'WARN' | 'ALERT' | 'BLOCKED' | 'CRITICAL';
    message: string;
    rawPayload: string;
}

const ACTION_MAP: Record<string, (log: any) => Omit<RealSecurityLog, 'id' | 'timestamp'>> = {
    'User Login Successful': (log) => ({
        sourceTool: 'IAM',
        level: 'INFO',
        message: `[AUTH_SUCCESS] User session initialized for Player_${log.playerId} via node TLS_1.3.`,
        rawPayload: `POST /api/v1/auth/login HTTP/1.1 200 OK - src_id=${log.playerId} dest_id=${log.targetId}`
    }),

    'Login Attempt': (log) => ({
        sourceTool: 'FIREWALL',
        level: 'WARN',
        message: `[AUTH_FAILURE] Multiple failed authentication handshakes detected on AuthServer.`,
        rawPayload: `PAM_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.168.1.${log.playerId}`
    }),

    'DDoS': (log) => ({
        sourceTool: 'WIRESHARK',
        level: 'CRITICAL',
        message: `[NET_FLOOD] Volumetric TCP SYN packet anomaly detected targetting Node_${log.targetId}.`,
        rawPayload: `PACKET_EXCEEDED: 45000 pps bandwidth spike on port 80 [FLAGS: SYN, ACK] - src=${log.playerId}`
    }),

    'CredentialStuffing': (log) => ({
        sourceTool: 'SPLUNK',
        level: 'ALERT',
        message: `[THREAT_INTEL] Automated credential spray pattern identified against DB_Instance_${log.targetId}.`,
        rawPayload: `SEC_EVENT_4625: Unknown user account / Bad password. Rate: 120 req/min.`
    }),

    'Scan': (log) => ({
        sourceTool: 'EDR',
        level: 'WARN',
        message: `[RECON_DETECTED] Network port sweep (TCP/UDP) initiated from host Player_${log.playerId}.`,
        rawPayload: `NMAP_DISCOVERY: SYN Stealth Scan detected on ports 22,80,443,3306.`
    })
};

export function parseMoveLogToSecurityLog(moveLog: any): RealSecurityLog {
    const mapper = ACTION_MAP[moveLog.action] || ((log) => ({
        sourceTool: 'SPLUNK',
        level: 'INFO',
        message: `[EVENT_${log.action.toUpperCase()}] Action triggered by Subject_${log.playerId}.`,
        rawPayload: `RAW_EVENT_ID=${log.id} target=${log.targetId}`
    }));

    const mapped = mapper(moveLog);

    return {
        id: String(moveLog.id || crypto.randomUUID()),
        timestamp: new Date().toISOString().substring(11, 19),
        ...mapped
    };
}