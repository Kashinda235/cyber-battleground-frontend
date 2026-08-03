import { useState } from "react"
import { User } from "lucide-react"
import type {MoveLog, Player} from "../../utils/types.ts";
import ModernTerminal from "../ActivityLog/Terminal.tsx";
import PlayersList from "../ActivityLog/PlayersList.tsx";
import MoveLogs from "../ActivityLog/MoveLogs.tsx";

interface LogProps {
    players: Player[],
    moveLogs: MoveLog[],
    setTarget:  (targetId: Player) => void
    activeTab:  "chat" | "actions" | "defence" | "events" | "alerts"
}
// --- Component ---
const ActivityLog = ( {players, moveLogs, setTarget, activeTab}: LogProps) => {
  // const [activeTab, setActiveTab] = useState<"users" | "logs">("users")

  const onlineCount = players.filter((p) => p.status === "online").length

  return (
      <>
      {activeTab === "chat" && <PlayersList players={players} setTarget={setTarget}/>}
      {activeTab === "defence" && <MoveLogs moveLogs={moveLogs} />}
      {activeTab === "actions" && <ModernTerminal />}
      {activeTab === "events" && <ModernTerminal />}
      {activeTab === "alerts" && <ModernTerminal />}
      </>
  )
}

export default ActivityLog
