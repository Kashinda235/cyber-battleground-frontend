import { useState } from 'react'
import Loader from "./components/Loader"
import Home from "./pages/Home.tsx"
import GameLobby from "./pages/GameLobby.tsx";
import "./styles/site.css"
import GameScreen from "./pages/GameScreen.tsx";

const App = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('home');

  const handleJoinGame = () => {
      setIsLoaded(false);
      setCurrentScreen('lobby');
  }

  return (
    <div className="app-container">
      {/* 1. Show the loader if it hasn't completed yet */}
      <Loader onComplete={() => setIsLoaded(true)} />

      {/* 2. Your actual main site layout */}
      {/* You can use the `isLoaded` state to trigger CSS transitions like your original `.in` class */}
      <div id="main-site" className={isLoaded ? 'in' : ''}>
          {currentScreen === 'home' && (
              <Home onStart={handleJoinGame} />
          )}

          {currentScreen === 'lobby' && (
              <GameLobby onJoinGame={() => setCurrentScreen('game')} />
          )}

          {currentScreen === 'game' && (
              <GameScreen />
          )}
      </div>
    </div>
  )
}

export default App
