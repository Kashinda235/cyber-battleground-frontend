export interface ArcjetLog {
    decision?: string;
    rule?: string;
    shieldTriggered?: boolean;
    reason?: string;
    botScore?: number;
    rateLimit?: { key: string; remaining: number; window: string }
}

export interface LogItem {
    id: string;
    timestamp: string;
    method: string;
    path: string;
    protocol: string;
    status: number;
    latency: number;
    sourceIp: string;
    destIp: string;
    threatLevel: string;
    size: string;
    geo: string;
    userAgent?: string;
    arcjet: ArcjetLog;
    // Allow flexible headers instead of hardcoded strict keys:
    headers: Record<string, string | undefined>;
    payload?: string;
    responseBody?: string;
}

// --- MOCK INITIAL DATA ---
export const INITIAL_LOGS: LogItem[] = [
    {
        id: 'log-101',
        timestamp: new Date(Date.now() - 1000 * 2).toISOString(),
        method: 'POST',
        path: '/api/v1/auth/login',
        protocol: 'HTTP/2',
        status: 429,
        latency: 18,
        sourceIp: '192.168.1.104',
        destIp: '10.0.4.12',
        threatLevel: 'BLOCKED',
        size: '1.2 KB',
        geo: 'US / Ashburn',
        userAgent: 'Mozilla/5.0 (X11; Linux x86_64)',
        arcjet: {
            decision: 'DENY',
            rule: 'RATE_LIMIT',
            rateLimit: { key: 'ip:192.168.1.104', remaining: 0, window: '60s' },
            botScore: 12,
            shieldTriggered: false
        },
        headers: {
            'content-type': 'application/json',
            'x-arcjet-decision': 'DENY',
            'user-agent': 'Mozilla/5.0 (X11; Linux x86_64)'
        },
        payload: JSON.stringify({ username: 'admin', auth_attempt: 14 }, null, 2),
        responseBody: JSON.stringify({ error: 'Too Many Requests', code: 429 }, null, 2)
    },
    {
        id: 'log-102',
        timestamp: new Date(Date.now() - 1000 * 8).toISOString(),
        method: 'GET',
        path: '/api/v1/products?cat=\' OR 1=1--',
        protocol: 'HTTP/2',
        status: 403,
        latency: 12,
        sourceIp: '45.142.120.9',
        destIp: '10.0.4.12',
        threatLevel: 'BLOCKED',
        size: '480 B',
        geo: 'RU / Moscow',
        userAgent: 'python-requests/2.28.1',
        arcjet: {
            decision: 'DENY',
            rule: 'SHIELD',
            shieldTriggered: true,
            reason: 'SQL Injection signature detected in query string',
            botScore: 98
        },
        headers: {
            'accept': '*/*',
            'x-arcjet-rule': 'SHIELD_SQLI'
        },
        payload: undefined,
        responseBody: JSON.stringify({ message: 'Blocked by Arcjet Shield', rule: 'SQL_INJECTION' }, null, 2)
    },
    {
        id: 'log-103',
        timestamp: new Date(Date.now() - 1000 * 15).toISOString(),
        method: 'POST',
        path: '/grpc.UserService/GetUserProfile',
        protocol: 'gRPC',
        status: 200,
        latency: 45,
        sourceIp: '10.0.2.15',
        destIp: '10.0.4.18',
        threatLevel: 'CLEAN',
        size: '3.4 KB',
        geo: 'Internal VPC',
        userAgent: 'grpc-go/1.48.0',
        arcjet: {
            decision: 'ALLOW',
            rule: 'PASSTHROUGH',
            botScore: 0,
            shieldTriggered: false
        },
        headers: {
            'content-type': 'application/grpc',
            'te': 'trailers'
        },
        payload: JSON.stringify({ user_id: 'usr_8921a', include_metadata: true }, null, 2),
        responseBody: JSON.stringify({ user_id: 'usr_8921a', name: 'Alex Rivera' }, null, 2)
    },
    {
        id: 'log-104',
        timestamp: new Date(Date.now() - 1000 * 25).toISOString(),
        method: 'GET',
        path: '/ws/v1/telemetry',
        protocol: 'WS',
        status: 101,
        latency: 5,
        sourceIp: '172.56.21.88',
        destIp: '10.0.4.12',
        threatLevel: 'CLEAN',
        size: '8.1 KB',
        geo: 'US / Chicago',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        arcjet: {
            decision: 'ALLOW',
            rule: 'PASSTHROUGH',
            botScore: 5,
            shieldTriggered: false
        },
        headers: {
            'upgrade': 'websocket',
            'connection': 'Upgrade'
        },
        payload: '[WebSocket Handshake Established]',
        responseBody: '[101 Switching Protocols]'
    }
];