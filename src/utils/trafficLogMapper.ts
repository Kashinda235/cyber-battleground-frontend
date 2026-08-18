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
    threatLevel: 'BLOCKED' | 'CLEAN' | 'CHALLENGE';
    size: string;
    geo: string;
    userAgent: string;
    arcjet: {
        decision: 'ALLOW' | 'DENY' | 'CHALLENGE';
        rule: string;
        botScore: number;
        shieldTriggered: boolean;
    };
    headers: Record<string, string>;
    payload: string;
    responseBody: string;
}

// Maps moveLog actions to realistic network profiles
const ACTION_TRAFFIC_PROFILES: Record<string, (move: any) => Partial<LogItem>> = {
    'User Login Successful': (move) => ({
        method: 'POST',
        path: '/api/v1/auth/login',
        protocol: 'HTTP/2',
        status: 200,
        threatLevel: 'CLEAN',
        geo: 'US / Ashburn',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        arcjet: { decision: 'ALLOW', rule: 'PASSTHROUGH', botScore: 5, shieldTriggered: false },
        payload: JSON.stringify({ playerId: move.playerId, action: 'AUTH_SUCCESS', targetId: move.targetId }, null, 2),
        responseBody: JSON.stringify({ status: 200, token: 'eyJhbGciOiJIUzI1Ni...' }, null, 2)
    }),

    'Login Attempt': (move) => ({
        method: 'POST',
        path: '/api/v1/auth/login',
        protocol: 'HTTP/2',
        status: 401,
        threatLevel: 'BLOCKED',
        geo: 'CN / Hangzhou',
        userAgent: 'Python-urllib/3.9',
        arcjet: { decision: 'DENY', rule: 'FAILED_AUTH_LIMIT', botScore: 78, shieldTriggered: true },
        payload: JSON.stringify({ playerId: move.playerId, attempt: 'password_guess' }, null, 2),
        responseBody: JSON.stringify({ error: 'Unauthorized', code: 'INVALID_CREDENTIALS' }, null, 2)
    }),

    'DDoS': (move) => ({
        method: 'GET',
        path: '/graphql',
        protocol: 'TCP',
        status: 429,
        threatLevel: 'BLOCKED',
        geo: 'RU / Moscow',
        userAgent: 'Go-http-client/1.1',
        arcjet: { decision: 'DENY', rule: 'RATE_LIMIT', botScore: 99, shieldTriggered: true },
        payload: JSON.stringify({ query: '{ systemStatus { nodes } }', stress: true }, null, 2),
        responseBody: JSON.stringify({ error: 'Too Many Requests', retryAfter: 60 }, null, 2)
    }),

    'CredentialStuffing': (move) => ({
        method: 'POST',
        path: '/api/v1/auth/batch',
        protocol: 'gRPC',
        status: 403,
        threatLevel: 'BLOCKED',
        geo: 'BR / Sao Paulo',
        userAgent: 'Hydra/v9.2',
        arcjet: { decision: 'DENY', rule: 'BOT_DETECTION', botScore: 94, shieldTriggered: true },
        payload: JSON.stringify({ attackVector: 'CREDS_SPRAY', targetId: move.targetId }, null, 2),
        responseBody: JSON.stringify({ error: 'Forbidden by WAF Rules' }, null, 2)
    }),

    'Scan': (move) => ({
        method: 'GET',
        path: '/.env',
        protocol: 'HTTP/2',
        status: 404,
        threatLevel: 'BLOCKED',
        geo: 'NL / Amsterdam',
        userAgent: 'Nmap Scripting Engine',
        arcjet: { decision: 'DENY', rule: 'SHIELD_RECON_BLOCK', botScore: 88, shieldTriggered: true },
        payload: JSON.stringify({ probe: 'RECON_SWEEP', port: 443 }, null, 2),
        responseBody: JSON.stringify({ error: 'Not Found' }, null, 2)
    })
};

// Generates a random clean traffic item
export function generateSyntheticLog(): LogItem {
    const isThreat = Math.random() < 0.15; // 15% random background threat
    const protocols = ['HTTP/2', 'gRPC', 'TCP', 'WS'];
    const methods = ['GET', 'POST', 'PUT', 'DELETE'];
    const paths = ['/api/v1/user', '/api/v1/checkout', '/graphql', '/api/v1/auth', '/healthz'];

    const method = methods[Math.floor(Math.random() * methods.length)];
    const path = paths[Math.floor(Math.random() * paths.length)];
    const protocol = protocols[Math.floor(Math.random() * protocols.length)];

    return {
        id: `syn-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toISOString(),
        method,
        path,
        protocol,
        status: isThreat ? (Math.random() > 0.5 ? 429 : 403) : 200,
        latency: Math.floor(Math.random() * 80) + 5,
        sourceIp: `192.168.${Math.floor(Math.random() * 10) + 1}.${Math.floor(Math.random() * 250) + 1}`,
        destIp: '10.0.4.12',
        threatLevel: isThreat ? 'BLOCKED' : 'CLEAN',
        size: `${(Math.random() * 4 + 0.2).toFixed(1)} KB`,
        geo: isThreat ? 'RU / Moscow' : 'US / Ashburn',
        userAgent: isThreat ? 'Go-http-client/1.1' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        arcjet: {
            decision: isThreat ? 'DENY' : 'ALLOW',
            rule: isThreat ? (Math.random() > 0.5 ? 'BOT_DETECTION' : 'RATE_LIMIT') : 'PASSTHROUGH',
            botScore: isThreat ? 89 : 2,
            shieldTriggered: isThreat
        },
        headers: {
            'content-type': 'application/json',
            'host': 'api.internal.service'
        },
        payload: JSON.stringify({ timestamp: Date.now(), stream: true }, null, 2),
        responseBody: isThreat
            ? JSON.stringify({ error: 'Request blocked by security rules' }, null, 2)
            : JSON.stringify({ status: 'ok', timestamp: Date.now() }, null, 2)
    };
}

// Converts moveLogs item into a full LogItem
export function moveLogToTrafficLog(move: any): LogItem {
    const profileFn = ACTION_TRAFFIC_PROFILES[move.action];
    const profile = profileFn
        ? profileFn(move)
        : {
            method: 'POST',
            path: `/api/v1/action/${move.action.toLowerCase()}`,
            protocol: 'HTTP/2',
            status: 200,
            threatLevel: 'CLEAN',
            geo: 'US / Ashburn',
            userAgent: 'GameClient/1.0',
            arcjet: { decision: 'ALLOW', rule: 'PASSTHROUGH', botScore: 0, shieldTriggered: false },
            payload: JSON.stringify(move, null, 2),
            responseBody: JSON.stringify({ status: 'PROCESSED' }, null, 2)
        };

    return {
        id: `move-${move.id || Date.now()}`,
        timestamp: new Date().toISOString(),
        latency: Math.floor(Math.random() * 40) + 10,
        sourceIp: `10.200.${move.playerId || 1}.${Math.floor(Math.random() * 200) + 1}`,
        destIp: `10.0.4.${move.targetId || 12}`,
        size: `${(Math.random() * 2 + 0.5).toFixed(1)} KB`,
        headers: {
            'content-type': 'application/json',
            'x-player-id': String(move.playerId || 'unknown')
        },
        ...profile
    } as LogItem;
}