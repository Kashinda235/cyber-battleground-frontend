import ModernTerminal from "../ActivityLog/Terminal.tsx";
import PlayersList from "../ActivityLog/PlayersList.tsx";
import {useGame} from "../../context/GameContext.tsx";
import Monitoring from "../ActivityLog/Monitoring.tsx";

const ActivityLog = () => {
  const {activeTab} = useGame();

  return (
      <>
      {activeTab === "profile" && <PlayersList />}
      {activeTab === "chat" && <PlayersList />}
      {activeTab === "defence" && <Monitoring />}
      {activeTab === "actions" && <ModernTerminal />}
      {activeTab === "events" && <ModernTerminal />}
      {activeTab === "alerts" && <ModernTerminal />}
      </>
  )
}

export default ActivityLog
