import Header from '../components/Header';
import ActivityFeed from '../components/ActivityFeed.tsx';
import ActivityLog from '../components/ActivityLog.tsx';
import GameCanvas from '../components/GameCanvas.tsx';
import NetBackground from "../components/NetBackground.tsx";
import Footer from "../components/Footer.tsx";

const GameScreen = () => {
    return (
        <div>
            <NetBackground />
            <div className="app-content flex h-screen flex-col overflow-hidden">
                <Header />

                {/* The row expands to remaining space and forces children to fill height */}
                <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">

                    {/* ActivityFeed */}
                    <div className="h-full w-full overflow-y-auto lg:w-[30%]">
                        <ActivityFeed />
                    </div>

                    {/* ActivityLog */}
                    <div className="h-full w-full overflow-y-auto lg:w-[24%]">
                        <ActivityLog />
                    </div>

                    {/* GameCanvas */}
                    <div className="h-full w-full overflow-hidden lg:w-[46%]">
                        <GameCanvas />
                    </div>

                </div>

                <Footer />
            </div>
        </div>
    )
}
export default GameScreen
