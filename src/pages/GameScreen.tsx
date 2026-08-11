import Header from '../components/GameScreen/Header.tsx';
import NetBackground from "../components/Home/NetBackground.tsx";
import Footer from "../components/Home/Footer.tsx";
import {useGameData} from "../hooks/useGameData.ts";
import type {Player} from "../utils/types.ts";
import GameLoader from "../components/GameScreen/GameLoader.tsx";
import { GameProvider } from "../context/GameContext";
import GameLayout from "../components/GameScreen/GameLayout.tsx";

interface GameProps {
    token: string
    player: Player | undefined
}

const GameScreen = ({ token, player }: GameProps) => {
    const { isLoading } = useGameData({ token, player });

    if (isLoading) return <GameLoader />;

    return (
        <div>
            <NetBackground />
            <div className="app-content flex flex-col overflow-hidden">
                <GameProvider token={token} player={player}>
                    <Header />
                    <GameLayout />
                </GameProvider>

                <Footer />
            </div>
        </div>
    )
}
export default GameScreen
