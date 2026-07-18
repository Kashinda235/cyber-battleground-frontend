import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST']
  }
});

export function createInitialState() {
  return {
    activePlayers: [],
    systemHealth: 100,
    globalLogs: [],
    blockedIPs: [],
    scores: { Red: 0, Blue: 0 },
    chatMessages: [],
    activeThreats: []
  };
}

const state = createInitialState();
const cooldowns = new Map();

function broadcastState() {
  io.emit('game_state', {
    ...state,
    activePlayers: [...state.activePlayers],
    globalLogs: [...state.globalLogs],
    blockedIPs: [...state.blockedIPs],
    chatMessages: [...state.chatMessages],
    activeThreats: [...state.activeThreats]
  });
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function addLog(log) {
  state.globalLogs.unshift(log);
  state.globalLogs = state.globalLogs.slice(0, 120);
}

function createLogEntry({ severity, source, event, details, action, vector, kind = 'system' }) {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
    severity,
    source,
    event,
    details,
    action,
    vector,
    kind
  };
}

function setHealth(delta) {
  state.systemHealth = clamp(state.systemHealth + delta, 0, 100);
}

export function applyAttack(payload, player) {
  const attackDefinitions = {
    port_scan: { cooldown: 5000, damage: 3, points: 8, label: 'Port Scan' },
    brute_force: { cooldown: 15000, damage: 8, points: 12, label: 'Brute Force' },
    sql_injection: { cooldown: 20000, damage: 10, points: 15, label: 'SQL Injection' },
    ransomware: { cooldown: 60000, damage: 24, points: 30, label: 'Ransomware' }
  };

  const definition = attackDefinitions[payload.attackType];
  if (!definition) {
    return { success: false, error: 'Unknown attack type' };
  }

  const now = Date.now();
  const playerCooldowns = cooldowns.get(player.id) || {};
  const existingCooldown = playerCooldowns[payload.attackType] || 0;
  if (existingCooldown > now) {
    return { success: false, error: 'Cooldown active' };
  }

  playerCooldowns[payload.attackType] = now + definition.cooldown;
  cooldowns.set(player.id, playerCooldowns);

  state.scores.Red += definition.points;
  setHealth(-definition.damage);

  const logs = [];
  if (payload.attackType === 'port_scan') {
    for (let index = 0; index < 4; index += 1) {
      const ip = `10.0.${Math.floor(Math.random() * 8)}.${Math.floor(Math.random() * 255)}`;
      logs.push(createLogEntry({
        severity: 'info',
        source: 'network-edge',
        event: 'Connection Attempt',
        details: `Inbound SYN from ${ip} targeting port ${21 + index}`,
        action: 'inspect',
        vector: 'port-scan',
        kind: 'attack'
      }));
    }
  }

  if (payload.attackType === 'brute_force') {
    for (let index = 0; index < 7; index += 1) {
      const username = ['admin', 'root', 'svc-ops', 'analyst'][index % 4];
      const ip = `172.16.${Math.floor(Math.random() * 9)}.${Math.floor(Math.random() * 255)}`;
      logs.push(createLogEntry({
        severity: 'warn',
        source: 'auth-service',
        event: 'Auth_Failed',
        details: `Failed login for ${username} from ${ip}`,
        action: 'investigate',
        vector: 'brute-force',
        kind: 'attack'
      }));
    }
    logs.push(createLogEntry({
      severity: 'critical',
      source: 'auth-service',
      event: 'Auth_Success',
      details: `Successful login as admin from ${player.username || 'unknown'}`,
      action: 'lockout',
      vector: 'brute-force',
      kind: 'attack'
    }));
  }

  if (payload.attackType === 'sql_injection') {
    const payloadText = "' OR 1=1--";
    logs.push(createLogEntry({
      severity: 'critical',
      source: 'web-proxy',
      event: 'SQLi Detected',
      details: `GET /search?user=${payloadText} triggered a malformed query`,
      action: 'review',
      vector: 'sql-injection',
      kind: 'attack'
    }));
  }

  if (payload.attackType === 'ransomware') {
    logs.push(createLogEntry({
      severity: 'critical',
      source: 'endpoint-agent',
      event: 'Ransomware Activity',
      details: 'Encryption routine detected on shared drives; backup chain interrupted',
      action: 'isolate',
      vector: 'ransomware',
      kind: 'attack'
    }));
    state.activeThreats.push({ id: `threat-${Date.now()}`, type: 'ransomware', vector: 'ransomware' });
  }

  logs.forEach((log) => addLog(log));

  return { success: true, logs };
}

export function applyDefense(payload, player) {
  if (player.team !== 'Blue') {
    return { success: false, error: 'Blue team only' };
  }

  if (payload.action === 'block_ip' && payload.target) {
    if (!state.blockedIPs.includes(payload.target)) {
      state.blockedIPs.push(payload.target);
    }
    state.scores.Blue += 12;
    setHealth(8);
    addLog(createLogEntry({
      severity: 'info',
      source: 'SOC-Console',
      event: 'Blocked IP',
      details: `Blocked ${payload.target} and isolated the source`,
      action: 'none',
      vector: payload.target,
      kind: 'defense'
    }));
    return { success: true };
  }

  if (payload.action === 'patch_vulnerability' && payload.target) {
    state.scores.Blue += 18;
    setHealth(10);
    addLog(createLogEntry({
      severity: 'info',
      source: 'SOC-Console',
      event: 'Patched Vulnerability',
      details: `Applied containment for ${payload.target}`,
      action: 'none',
      vector: payload.target,
      kind: 'defense'
    }));
    state.activeThreats = state.activeThreats.filter((threat) => threat.vector !== payload.target);
    return { success: true };
  }

  return { success: false, error: 'Unsupported defense' };
}

io.on('connection', (socket) => {
  socket.on('join_game', ({ username, team }) => {
    const normalizedTeam = team === 'Red' ? 'Red' : 'Blue';
    const player = {
      id: socket.id,
      username: username || `Player-${socket.id.slice(0, 4)}`,
      team: normalizedTeam,
      connectedAt: new Date().toISOString()
    };

    const existingIndex = state.activePlayers.findIndex((entry) => entry.id === socket.id);
    if (existingIndex >= 0) {
      state.activePlayers[existingIndex] = player;
    } else {
      state.activePlayers.push(player);
    }

    socket.emit('joined_game', { player, state: { ...state, activePlayers: [...state.activePlayers] } });
    broadcastState();
  });

  socket.on('execute_attack', (payload) => {
    const player = state.activePlayers.find((entry) => entry.id === socket.id);
    if (!player) {
      socket.emit('error', { message: 'Join the game first' });
      return;
    }

    if (player.team !== 'Red') {
      socket.emit('error', { message: 'Only Red team can execute attacks' });
      return;
    }

    const result = applyAttack(payload, player);
    if (!result.success) {
      socket.emit('error', { message: result.error });
      return;
    }

    broadcastState();
  });

  socket.on('execute_defense', (payload) => {
    const player = state.activePlayers.find((entry) => entry.id === socket.id);
    if (!player) {
      socket.emit('error', { message: 'Join the game first' });
      return;
    }

    if (player.team !== 'Blue') {
      socket.emit('error', { message: 'Only Blue team can execute defenses' });
      return;
    }

    const result = applyDefense(payload, player);
    if (!result.success) {
      socket.emit('error', { message: result.error });
      return;
    }

    broadcastState();
  });

  socket.on('send_chat', (payload) => {
    const player = state.activePlayers.find((entry) => entry.id === socket.id);
    if (!player) {
      socket.emit('error', { message: 'Join the game first' });
      return;
    }

    const message = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
      username: player.username,
      team: player.team,
      text: payload.text,
      timestamp: new Date().toISOString()
    };

    state.chatMessages.unshift(message);
    state.chatMessages = state.chatMessages.slice(0, 50);
    broadcastState();
  });

  socket.on('disconnect', () => {
    state.activePlayers = state.activePlayers.filter((entry) => entry.id !== socket.id);
    broadcastState();
  });
});

app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 4000;

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  httpServer.listen(PORT, () => {
    console.log(`SOC simulator server listening on http://localhost:${PORT}`);
  });
}
