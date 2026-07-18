import { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import Lobby from './Lobby';
import Dashboard from './Dashboard';

const socket = io('http://localhost:4000', { transports: ['websocket'] });

function App() {
  const [gameState, setGameState] = useState(null);
  const [player, setPlayer] = useState(null);
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to SOC server');
    });

    socket.on('joined_game', ({ player: connectedPlayer, state }) => {
      setPlayer(connectedPlayer);
      setGameState(state);
      setJoined(true);
      setError('');
    });

    socket.on('game_state', (state) => {
      setGameState(state);
    });

    socket.on('error', ({ message }) => {
      setError(message);
    });

    return () => {
      socket.off('connect');
      socket.off('joined_game');
      socket.off('game_state');
      socket.off('error');
    };
  }, []);

  const handleJoin = (username, team) => {
    socket.emit('join_game', { username, team });
  };

  const handleAttack = (attackType) => {
    socket.emit('execute_attack', { attackType });
  };

  const handleDefense = (action, target) => {
    socket.emit('execute_defense', { action, target });
  };

  const handleChat = (text) => {
    socket.emit('send_chat', { text });
  };

  const scoreSummary = useMemo(() => {
    if (!gameState) return { Red: 0, Blue: 0 };
    return gameState.scores;
  }, [gameState]);

  return (
    <div className="app-shell">
      {!joined ? (
        <Lobby onJoin={handleJoin} error={error} />
      ) : (
        <Dashboard
          player={player}
          gameState={gameState}
          onAttack={handleAttack}
          onDefense={handleDefense}
          onChat={handleChat}
          scoreSummary={scoreSummary}
          error={error}
        />
      )}
    </div>
  );
}

export default App;
