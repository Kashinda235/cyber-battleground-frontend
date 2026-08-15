import ModernTerminal from "../ActivityLog/Terminal.tsx";
import PlayersList from "../ActivityLog/PlayersList.tsx";
import {useGame} from "../../context/GameContext.tsx";
import Monitoring from "../ActivityLog/Monitoring.tsx";
import NetworkLogger from "../ActivityLog/NetworkLogger.tsx";
import GameCanvas from "./GameCanvas.tsx";

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

