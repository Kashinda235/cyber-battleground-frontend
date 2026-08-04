import Header from '../components/GameScreen/Header.tsx';
import ActivityFeed from '../components/GameScreen/ActivityFeed.tsx';
import ActivityLog from '../components/GameScreen/ActivityLog.tsx';
import GameCanvas from '../components/GameScreen/GameCanvas.tsx';
import NetBackground from "../components/Home/NetBackground.tsx";
import Footer from "../components/Home/Footer.tsx";
import {useGameData} from "../hooks/useGameData.ts";
import type {Player} from "../utils/types.ts";
import {useState} from "react";
import GameLoader from "../components/GameScreen/GameLoader.tsx";
import { GameProvider } from "../context/GameContext";

interface GameProps {
    token: string
    player: Player | undefined
}

const GameScreen = ({ token, player }: GameProps) => {
    const [activeTab, setActiveTab] = useState<"chat" | "actions" | "defence" | "events" | "alerts" >('chat');
    const {
        gameState, // Header
        chats, // Feed
        sendChat, // Feed
        moveLogs, // Log
        players, // Log, Canvas
        performAction, // Log
        isLoading
    } = useGameData({ token, player });
    const [target, setTarget] = useState(player);

    const handleSetTarget = (target: Player) => {
        setTarget(target);
    }

    const headerData = { player: player, gameState:gameState }
    const feedData = {
        players: players, currentPlayer: player, target: target,
        chats: chats, sendChat: sendChat, performAction: performAction,
        setActiveTab: setActiveTab
    }
    const logData = { players: players, moveLogs: moveLogs, setTarget: handleSetTarget, activeTab: activeTab }

    if (isLoading) return <GameLoader />;

    return (
        <div>
            <NetBackground />
            <div className="app-content flex flex-col overflow-hidden">
                <Header {...headerData}/>

                {/* The row expands to remaining space and forces children to fill height */}
                <GameProvider>
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Grid Layout Container */}
                    <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 w-full">

                        {/* Top/First Row on Large Screens: 3:2 Ratio (3/5ths vs 2/5ths) */}
                        {/* ActivityFeed (3 parts of 5 -> 60%) */}
                        <div className="h-[600px] w-full overflow-y-auto lg:col-span-3">
                            <ActivityFeed {...feedData} />
                        </div>

                        {/* ActivityLog (2 parts of 5 -> 40%) */}
                        <div className="h-[600px] w-full overflow-y-auto lg:col-span-3">
                            <ActivityLog {...logData} />
                        </div>

                        {/* Bottom Row on Large Screens: Full Width (5/5ths) */}
                        {/* GameCanvas */}
                        <div className="h-[600px] w-full overflow-hidden lg:col-span-6">
                            <GameCanvas players={players} currentPlayer={player} />
                        </div>

                    </div>

                </div>
                </GameProvider>

                <Footer />
            </div>
        </div>
    )
}
export default GameScreen
