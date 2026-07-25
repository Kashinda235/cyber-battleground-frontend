import Header from '../components/Header';
import ActivityFeed from '../components/ActivityFeed.tsx';
import ActivityLog from '../components/ActivityLog.tsx';
import GameCanvas from '../components/GameCanvas.tsx';
import NetBackground from "../components/NetBackground.tsx";
import Footer from "../components/Footer.tsx";
import {useGameData} from "../hooks/useGameData.ts";
import type {Player} from "../utils/types.ts";

interface GameProps {
    token: string
    player: Player
}

const GameScreen = ({ token, player }: GameProps) => {
    const {
        gameState, // Header
        chats, // Feed
        sendChat, // Feed
        abilities, // Feed
        moveLogs, // Log
        players, // Log, Canvas
        performAction, // Log
        isLoading
    } = useGameData({ token, player });

    const headerData = { player: player, gameState:gameState }
    const feedData = {
        players: players, currentPlayer: player,
        chats: chats, sendChat: sendChat,
        abilities: abilities, performAction: performAction
    }
    const logData = { players: players, moveLogs: moveLogs }

    if (isLoading) return <div>Loading battlefield...</div>;

    return (
        <div>
            <NetBackground />
            <div className="app-content flex flex-col overflow-hidden">
                <Header {...headerData}/>

                {/* The row expands to remaining space and forces children to fill height */}
                <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">

                    {/* ActivityFeed */}
                    <div className="h-[600px] w-full overflow-y-auto lg:w-[30%]">
                        <ActivityFeed {...feedData}/>
                    </div>

                    {/* ActivityLog */}
                    <div className="h-[600px] w-full overflow-y-auto lg:w-[24%]">
                        <ActivityLog {...logData}/>
                    </div>

                    {/* GameCanvas */}
                    <div className="h-[600px] w-full overflow-hidden lg:w-[46%]">
                        <GameCanvas players={players} />
                    </div>

                </div>

                <Footer />
            </div>
        </div>
    )
}
export default GameScreen
