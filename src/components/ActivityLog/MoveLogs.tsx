import type {MoveLog} from "../../utils/types.ts";

interface LogProps {
    moveLogs: MoveLog[],
}

const MoveLogs = ( {moveLogs}: LogProps) => {
    return (
        <div className="mx-auto h-full flex w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-gray-700 bg-gray-900 font-sans text-gray-200 shadow-2xl">
            {/* Dynamic Header */}
            <div className="bg-gray-800/40 px-5 py-4">
                <h2 className="text-lg font-bold tracking-wide text-gray-100">
                    System Action Logs
                </h2>
            </div>

            {/* Scrollable List Content */}
            <div className="flex-1 box-scroll">
                {
                    moveLogs.map((log) => (
                        <div
                            key={log.id}
                            className="flex flex-col rounded-lg border border-transparent bg-gray-800/40 p-3 font-mono text-sm transition-colors hover:border-gray-700 hover:bg-gray-800"
                        >
                            <span className="mb-1 text-emerald-400">[{log.timestamp}]</span>
                            <span className="text-gray-300">{log.action}</span>
                        </div>
                    ))}
            </div>

            {/* Dynamic Footer */}
            <div className="flex items-center justify-between border-t border-gray-800 bg-gray-950 px-5 py-3 text-xs text-gray-400">
                {
                    <>
                        <span>Log retention: 24h</span>
                        <span>Total entries: {moveLogs.length}</span>
                    </>
                }
            </div>
        </div>
    )
}
export default MoveLogs
