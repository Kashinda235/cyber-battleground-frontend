import {useEffect, useState} from 'react'
import Loader from "./components/Loader"
import Home from "./pages/Home.tsx"
import GameLobby from "./pages/GameLobby.tsx";
import "./styles/site.css"
import GameScreen from "./pages/GameScreen.tsx";
import { motion, AnimatePresence } from 'framer-motion';
import type {Player} from "./utils/types.ts";

// Define keys to prevent typo bugs
const TOKEN_KEY = 'auth_token';
const PLAYER_KEY = 'player_data';

const App = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [currentScreen, setCurrentScreen] = useState('home');

    const [token, setToken] = useState<string>('');
    const [player, setPlayer] = useState<Player | undefined>(undefined);

    // 1. Auto-login check on initial render (optional, but recommended)
    useEffect(() => {
        const savedToken = localStorage.getItem(TOKEN_KEY);
        const savedPlayer = localStorage.getItem(PLAYER_KEY);

        if (savedToken && savedPlayer) {
            try {
                setToken(savedToken);
                setPlayer(JSON.parse(savedPlayer));
                setCurrentScreen('game');
            } catch (error) {
                console.error('Failed to parse saved player data:', error);
                // Clear corrupted data
                localStorage.removeItem(TOKEN_KEY);
                localStorage.removeItem(PLAYER_KEY);
            }
        }
        setIsLoaded(true);
    }, []);

    const saveSession = (token: string, player: Player) => {
        // if (!player.username) {
        //     console.error('Cannot save session: player username is undefined');
        //     return;
        // }
        // Update the last Join
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(PLAYER_KEY, JSON.stringify(player));

        // // Storing players in the same device for future access
        // const NEW_PLAYER = player.username;
        // if (!localStorage.getItem(NEW_PLAYER))
        //     localStorage.setItem(NEW_PLAYER, JSON.stringify({ token, player }));

        setToken(token);
        setPlayer(player);
        setCurrentScreen('game');
    };

    const handleJoinGame = (receivedToken: string, receivedPlayer: Player) => {
        saveSession(receivedToken, receivedPlayer);
    };

    // 3. Handle Manual Login
    const handleLogin = ( username: string) => {
        const savedData = localStorage.getItem(username);
        if (savedData) {
            try {
                const {token, player} = JSON.parse(savedData);
                // Note: 'player' is ALREADY an object here because the whole payload was parsed!
                saveSession(token, player);
            } catch (error) {
                console.error('Error logging in:', error);
            }
        }
    }

    return (
        <div className="app-container">

            {/*<Loader onComplete={() => setIsLoaded(true)} />*/}
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
                        <GameLobby onJoinGame={handleJoinGame} />
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
