import ModernTerminal from "../ActivityLog/Terminal.tsx";
import {useGame} from "../../context/GameContext.tsx";
import NetworkLogger from "../ActivityLog/NetworkLogger.tsx";
import GameCanvas from "../Canvas/GameCanvas.tsx";

const ActivityLog = () => {
  const {activeTab} = useGame();

    const canvasTabs = ["profile", "chat", "events", "alerts"];

    return (
        <>
            {canvasTabs.includes(activeTab) && <GameCanvas />}
            {activeTab === "defence" && <NetworkLogger />}
            {activeTab === "actions" && <ModernTerminal />}
        </>
    );
}

export default ActivityLog

// {activeTab === "profile" && <PlayersList />}

// {activeTab === "chat" && <PlayersList />}

// {activeTab === "events" && <ModernTerminal />}

// {activeTab === "alerts" && <ModernTerminal />}

