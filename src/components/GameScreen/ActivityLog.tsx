import ModernTerminal from "../ActivityLog/Terminal.tsx";
import PlayersList from "../ActivityLog/PlayersList.tsx";
import MoveLogs from "../ActivityLog/MoveLogs.tsx";
import {useGame} from "../../context/GameContext.tsx";

const ActivityLog = () => {
  const {activeTab} = useGame();

  return (
      <>
      {activeTab === "profile" && <PlayersList />}
      {activeTab === "chat" && <PlayersList />}
      {activeTab === "defence" && <MoveLogs />}
      {activeTab === "actions" && <ModernTerminal />}
      {activeTab === "events" && <ModernTerminal />}
      {activeTab === "alerts" && <ModernTerminal />}
      </>
  )
}

export default ActivityLog
