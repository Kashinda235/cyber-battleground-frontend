import Header from '../components/Header';
import ActivityFeed from '../components/ActivityFeed.tsx';
import ActivityLog from '../components/ActivityLog.tsx';
import GameCanvas from '../components/GameCanvas.tsx';

const GameScreen = () => {
    return (
        <div>
            <Header />
            <div className="flex min-h-screen w-full flex-col lg:flex-row">
                {/* Panel Component (36%) */}
                <div className="w-full lg:h-screen lg:w-[30%]">
                    <ActivityFeed />
                </div>

                {/* SubList Component (24%) */}
                <div className="w-full lg:h-screen lg:w-[24%]">
                    <ActivityLog />
                </div>

                {/* GameCanvas Component (40%) */}
                <div className="w-full lg:h-screen lg:w-[46%]">
                    <GameCanvas />
                </div>
            </div>
        </div>
    )
}
export default GameScreen
