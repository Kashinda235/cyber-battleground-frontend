import ActivityFeed from "./ActivityFeed.tsx";
import ActivityLog from "./ActivityLog.tsx";
import NetworkLogger from "../ActivityLog/NetworkLogger.tsx";
import {useGame} from "../../context/GameContext.tsx";
import GameCanvas from "./GameCanvas.tsx";

const GameLayout = () => {
    const { activeTab } = useGame();
    return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">

        {/* Grid Layout Container */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 w-full">

            {/* Top/First Row on Large Screens: 3:2 Ratio (3/5ths vs 2/5ths) */}
            {/* ActivityFeed (3 parts of 5 -> 60%) */}
            <div className="h-[600px] w-full overflow-y-auto lg:col-span-3">
                <ActivityFeed />
            </div>

            {/* ActivityLog (2 parts of 5 -> 40%) */}
            <div className="h-[600px] w-full overflow-y-auto lg:col-span-3">
                <ActivityLog />
            </div>

            {/* Bottom Row on Large Screens: Full Width (5/5ths) */}
            {/* GameCanvas */}
            <div className="h-[600px] w-full overflow-hidden lg:col-span-4">
                {activeTab === 'defence' && <NetworkLogger/>}
                {activeTab !== 'defence' && <GameCanvas />}
            </div>

        </div>

    </div>
    )
}
export default GameLayout
