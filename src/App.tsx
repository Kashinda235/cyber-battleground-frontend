import {useEffect, useState} from 'react'
import Loader from "./components/Loader"
import Home from "./pages/Home.tsx"
import GameLobby from "./pages/GameLobby.tsx";
import "./styles/site.css"
import GameScreen from "./pages/GameScreen.tsx";
import { motion, AnimatePresence } from 'framer-motion';
import type {Player} from "./utils/types.ts";

const App = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [currentScreen, setCurrentScreen] = useState('home');

    const [token, setToken] = useState<string>('');
    const [player, setPlayer] = useState<Player | undefined>(undefined);

    const [savedUsernames, setSavedUsernames] = useState<string[]>([]);

    // Load saved usernames from localStorage on mount
    useEffect(() => {
        const history = localStorage.getItem('cyber_battleground_users');
        if (history) {
            try {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setSavedUsernames(JSON.parse(history));
            } catch (e) {
                console.error("Failed to parse username history", e);
            }
        }
    }, []);

    // Helper function to call when authentication succeeds
    const saveUser = (newUsername: string) => {
        if (!newUsername.trim()) return;

        // Prevent duplicates and keep the most recent names (limit to top 5)
        const updatedHistory = [
            newUsername,
            ...savedUsernames.filter((name) => name !== newUsername)
        ].slice(0, 5);

        setSavedUsernames(updatedHistory);
        localStorage.setItem('cyber_battleground_users', JSON.stringify(updatedHistory));
    };

    const handleJoinGame = (receivedToken: string, receivedPlayer: Player) => {
        setToken(receivedToken);
        setPlayer(receivedPlayer);
        setCurrentScreen('game');
    };

    return (
        <div className="app-container">

            <Loader onComplete={() => setIsLoaded(true)} />
            {/* AnimatePresence handles animating components as they unmount */}
            <div id="main-site" className={isLoaded ? 'in' : ''}>
                <AnimatePresence mode="wait">
                {currentScreen === 'home' && (
                    <motion.div
                        key="home"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Home onStart={() => setCurrentScreen('lobby')} />
                    </motion.div>
                )}

                {currentScreen === 'lobby' && (
                    <motion.div
                        key="lobby"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <GameLobby onJoinGame={handleJoinGame} users={savedUsernames} saveUser={saveUser}/>
                    </motion.div>
                )}

                {currentScreen === 'game' && (
                    <motion.div
                        key="game"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <GameScreen token={token} player={player} />
                    </motion.div>
                )}
            </AnimatePresence>
            </div>
        </div>
    );
};

export default App;
