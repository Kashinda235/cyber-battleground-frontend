import { useState } from 'react'
import Loader from "./components/Loader"
import Home from "./pages/Home.tsx"
import GameLobby from "./pages/GameLobby.tsx";
import "./styles/site.css"
import GameScreen from "./pages/GameScreen.tsx";
import { motion, AnimatePresence } from 'framer-motion';

const App = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [currentScreen, setCurrentScreen] = useState('game');

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
                        <GameLobby onJoinGame={() => setCurrentScreen('game')} />
                    </motion.div>
                )}

                {currentScreen === 'game' && (
                    <motion.div
                        key="game"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <GameScreen />
                    </motion.div>
                )}
            </AnimatePresence>
            </div>
        </div>
    );
};

export default App
