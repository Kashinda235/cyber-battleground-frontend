import { useState } from 'react';

function Lobby({ onJoin, error }) {
  const [username, setUsername] = useState('');
  const [team, setTeam] = useState('Red');

  const submit = (event) => {
    event.preventDefault();
    if (!username.trim()) return;
    onJoin(username.trim(), team);
  };

  return (
    <div className="lobby-card">
      <div className="lobby-header">
        <p className="eyebrow">REAL-TIME MULTIPLAYER</p>
        <h1>SOC Simulator</h1>
        <p className="subtle">Red team launches attacks. Blue team defends the network in real time.</p>
      </div>
      <form onSubmit={submit} className="lobby-form">
        <label>
          Username
          <input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Enter callsign" />
        </label>
        <label>
          Team
          <select value={team} onChange={(event) => setTeam(event.target.value)}>
            <option value="Red">Red</option>
            <option value="Blue">Blue</option>
          </select>
        </label>
        <button type="submit">Enter the Mission</button>
      </form>
      {error ? <p className="error">{error}</p> : null}
    </div>
  );
}

export default Lobby;
