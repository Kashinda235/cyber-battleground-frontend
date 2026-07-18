import { useMemo, useState } from 'react';

const attackButtons = [
  { id: 'port_scan', label: 'Port Scan', cooldown: 5000, description: 'Low severity recon' },
  { id: 'brute_force', label: 'Brute Force', cooldown: 15000, description: 'Credential spray' },
  { id: 'sql_injection', label: 'SQL Injection', cooldown: 20000, description: 'Exploit web query' },
  { id: 'ransomware', label: 'Ransomware', cooldown: 60000, description: 'Critical threat' }
];

function Dashboard({ player, gameState, onAttack, onDefense, onChat, scoreSummary, error }) {
  const [chatInput, setChatInput] = useState('');
  const logs = gameState?.globalLogs || [];
  const activePlayers = gameState?.activePlayers || [];

  const healthColor = useMemo(() => {
    if ((gameState?.systemHealth || 0) < 40) return '#ff4d4d';
    if ((gameState?.systemHealth || 0) < 70) return '#ffb84d';
    return '#33d17a';
  }, [gameState?.systemHealth]);

  const isRed = player?.team === 'Red';

  const sendChat = (event) => {
    event.preventDefault();
    if (!chatInput.trim()) return;
    onChat(chatInput.trim());
    setChatInput('');
  };

  return (
    <div className="dashboard">
      <header className="header-bar">
        <div>
          <p className="eyebrow">LIVE OPERATIONS</p>
          <h1>SOC Command Center</h1>
        </div>
        <div className="header-metrics">
          <div>
            <span className="metric-label">Red</span>
            <strong>{scoreSummary?.Red ?? 0}</strong>
          </div>
          <div>
            <span className="metric-label">Blue</span>
            <strong>{scoreSummary?.Blue ?? 0}</strong>
          </div>
          <div>
            <span className="metric-label">System Health</span>
            <strong style={{ color: healthColor }}>{Math.round(gameState?.systemHealth || 0)}%</strong>
          </div>
        </div>
      </header>

      <div className="grid-layout">
        <aside className="panel sidebar-panel">
          <h2>Active Players</h2>
          {activePlayers.map((entry) => (
            <div key={entry.id} className="player-chip">
              <span>{entry.username}</span>
              <span className={`team-pill ${entry.team.toLowerCase()}`}>{entry.team}</span>
            </div>
          ))}
        </aside>

        <main className="panel main-panel">
          {isRed ? (
            <div className="attack-panel">
              <h2>Red Team Operations</h2>
              <div className="attack-grid">
                {attackButtons.map((action) => (
                  <button key={action.id} className="action-btn" onClick={() => onAttack(action.id)}>
                    <strong>{action.label}</strong>
                    <span>{action.description}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="attack-panel">
              <h2>Blue Team SIEM</h2>
              <div className="log-list">
                {logs.map((log) => (
                  <div key={log.id} className={`log-row ${log.severity === 'critical' ? 'critical' : ''}`}>
                    <div className="log-meta">
                      <span className={`severity ${log.severity}`}>{log.severity}</span>
                      <span>{log.event}</span>
                    </div>
                    <div className="log-details">{log.details}</div>
                    <div className="log-actions">
                      <button onClick={() => onDefense('block_ip', log.vector)}>Block IP</button>
                      <button onClick={() => onDefense('patch_vulnerability', log.vector)}>Patch</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      <section className="panel terminal-panel">
        <div className="terminal-header">
          <h2>Shared Feed</h2>
          {error ? <span className="error">{error}</span> : null}
        </div>
        <div className="chat-feed">
          {(gameState?.chatMessages || []).map((message) => (
            <div key={message.id} className="chat-line">
              <strong>{message.username}</strong>
              <span>[{message.team}]</span>
              <span>{message.text}</span>
            </div>
          ))}
        </div>
        <form className="chat-form" onSubmit={sendChat}>
          <input value={chatInput} onChange={(event) => setChatInput(event.target.value)} placeholder="Transmit comms..." />
          <button type="submit">Send</button>
        </form>
      </section>
    </div>
  );
}

export default Dashboard;
