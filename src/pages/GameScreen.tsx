import Header from '../components/Header';
import ActivityFeed from '../components/ActivityFeed.tsx';
import ActivityLog from '../components/ActivityLog.tsx';
import GameCanvas from '../components/GameCanvas.tsx';
import NetBackground from "../components/NetBackground.tsx";
import Footer from "../components/Footer.tsx";
import {useGameData} from "../hooks/useGameData.ts";
import type {Player} from "../utils/types.ts";
import {useState} from "react";

interface GameProps {
    token: string
    player: Player | undefined
}

const GameScreen = ({ token, player }: GameProps) => {
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
        chats: chats, sendChat: sendChat, performAction: performAction
    }
    const logData = { players: players, moveLogs: moveLogs, setTarget: handleSetTarget }

    if (isLoading) return <div>Loading battlefield...</div>;

    return (
        <div>
            <NetBackground />
            <div className="app-content flex flex-col overflow-hidden">
                <Header {...headerData}/>

                {/* The row expands to remaining space and forces children to fill height */}
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Grid Layout Container */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 w-full">

                        {/* Top/First Row on Large Screens: 3:2 Ratio (3/5ths vs 2/5ths) */}
                        {/* ActivityFeed (3 parts of 5 -> 60%) */}
                        <div className="h-[600px] w-full overflow-y-auto lg:col-span-3">
                            <ActivityFeed {...feedData} />
                        </div>

                        {/* ActivityLog (2 parts of 5 -> 40%) */}
                        <div className="h-[600px] w-full overflow-y-auto lg:col-span-2">
                            <ActivityLog {...logData} />
                        </div>

                        {/* Bottom Row on Large Screens: Full Width (5/5ths) */}
                        {/* GameCanvas */}
                        <div className="h-[600px] w-full overflow-hidden lg:col-span-5">
                            <GameCanvas players={players} currentPlayer={player} />
                        </div>

                    </div>

                </div>

                <Footer />
            </div>
        </div>
    )
}
export default GameScreen
