import { User } from "lucide-react";
import { useGame } from "../../context/GameContext.tsx";

const PlayersList = () => {
    const { players, setTarget } = useGame();
    const onlineCount = players.filter((p) => p.status === "online").length;

    // Sort online players first
    const sortedPlayers = [...players].sort((a, b) => {
        if (a.status === "online" && b.status !== "online") return -1;
        if (a.status !== "online" && b.status === "online") return 1;
        return 0;
    });

    return (
        <div className="mx-auto h-full flex w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-gray-700 bg-gray-900 font-sans text-gray-200 shadow-2xl">
            {/* Dynamic Header */}
            <div className="bg-gray-800/40 px-5 py-6">
                <h2 className="text-lg font-bold tracking-wide text-gray-100">
                    Players Active
                </h2>
            </div>

            {/* Scrollable List Content */}
            <div className="flex-1 pop-up box-scroll space-y-2 p-2">
                {sortedPlayers.map((player) => (
                    <div
                        key={player.id}
                        onClick={() => setTarget(player)}
                        className="flex items-center justify-between rounded-lg border border-transparent bg-gray-800/40 p-3 transition-colors hover:border-gray-700 hover:bg-gray-800 cursor-pointer"
                    >
                        <div className="flex items-center space-x-3">
                            <User
                                size={18}
                                strokeWidth={2.5}
                                className={
                                    player.status === "online"
                                        ? "text-emerald-500"
                                        : "text-amber-500"
                                }
                            />
                            <div className="flex flex-col">
                <span className="font-medium text-gray-200">
                  {player.username}
                </span>
                                <span className="text-xs text-gray-400 font-mono">
                  192.168.2.{player.id}
                </span>
                            </div>
                        </div>
                        <span className="text-xs tracking-wider text-gray-500 uppercase">
              {player.status}
            </span>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-gray-800 bg-gray-950 px-5 py-3 text-xs text-gray-400">
                <span>Total Registered: {players.length}</span>
                <span className="flex items-center space-x-1">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></span>
          <span className="font-medium text-emerald-400">
            {onlineCount} users online
          </span>
        </span>
            </div>
        </div>
    );
};

export default PlayersList;