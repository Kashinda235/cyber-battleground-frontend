import React from "react"
import { motion } from "framer-motion"
import {Sword, HatGlasses, ShieldCheck, HeartPulse, Trophy, Activity, Shield} from "lucide-react"
import type {GameState, Player} from "../../utils/types.ts";

interface PlayerDetailsProps {
  name: string
  ip: string
  role: string
}

interface GameStateProps {
  systemHealth: number
  score: number
}

interface HeaderProps {
  player: Player,
  gameState: GameState | null
}

const theme = {
    red: 'rose',
    blue: 'blue',
    spectator: 'emerald',
} as const;

const IconSymbol = {
    red: <Sword className="h-10 w-10"/>,
    blue: <Shield className="h-10 w-10"/>,
    spectator: <HatGlasses className="h-10 w-10"/>,
} as const;

const PlayerDetailsCard: React.FC<PlayerDetailsProps> = ({name, ip, role}) => {
    const color = theme[role as keyof typeof theme];
    const icon = IconSymbol[role as keyof typeof IconSymbol];
    return (
        <div className="flex items-center gap-3.5">
            {/* Role Icon */}
            <div className={`relative flex h-40 w-11 items-center justify-center rounded-xl border border-slate-700/80 bg-slate-900 text-${color}-400 shadow-inner`}>
                {icon}
                <span className={`absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full bg-${color}-500 ring-2 ring-slate-950`} />
            </div>

            {/* Player Metadata */}
            <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
        <span className="text-sm font-bold tracking-tight text-slate-100">
          {name}
        </span>
                    <span className={`rounded-md border border-emerald-500/30 bg-emerald-950/80 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-${color}-400 uppercase`}>
          {role}
        </span>
                </div>
                <span className="font-mono text-xs font-medium tracking-wide text-slate-400">
        {ip}
      </span>
            </div>
        </div>
    )
}

const GameStatesCard: React.FC<GameStateProps> = ({ systemHealth, score }) => {

    return (
        <div className="flex items-center gap-4">
            {/* System Health */}
            <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/90 px-3.5 py-2">
                <div className="rounded-lg border border-emerald-500/20 bg-emerald-950/60 p-1.5 text-rose-400">
                    <HeartPulse className="h-6 w-6" />
                </div>
                <div className="flex flex-col">
        <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
          Sys Health
        </span>
                    <div className="flex items-baseline gap-1">
          <span className="font-mono text-base font-extrabold text-slate-100">
            {systemHealth}%
          </span>
                        <Activity className="h-3 w-3 animate-pulse text-emerald-500" />
                    </div>
                </div>
            </div>

            {/* Score */}
            <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/90 px-3.5 py-2">
                <div className="rounded-lg border border-emerald-500/20 bg-emerald-950/60 p-1.5 text-yellow-400">
                    <Trophy className="h-6 w-6" />
                </div>
                <div className="flex flex-col">
        <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
          Score
        </span>
                    <span className="font-mono text-base font-extrabold text-slate-100">
          {score.toLocaleString()}
        </span>
                </div>
            </div>
        </div>
    )
}

// const LiveBeacon: React.FC = () => (
//   <div className="flex items-center gap-2.5 rounded-full border border-emerald-500/40 bg-emerald-950/40 px-3.5 py-1.5 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
//     <div className="relative flex h-2.5 w-2.5 items-center justify-center">
//       <motion.span
//         animate={{ scale: [1, 2.2, 1], opacity: [0.8, 0, 0.8] }}
//         transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
//         className="absolute inline-flex h-full w-full rounded-full bg-red-400"
//       />
//       <span className="relative inline-flex h-2 w-2 rounded-full bg-red-400" />
//     </div>
//     <span className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-emerald-300 uppercase">
//        Live
//     </span>
//   </div>
// )

export const Header: React.FC<HeaderProps> = ({ player, gameState }: HeaderProps) => {

    const playerData = { name: player?.username ?? "Guest", ip: `192.168.1.${player.id}`, role: player.role }
    // const playerData = { name:  "Guest", ip: `192.168.1.${10}`, role: 'red' }

    const gameStateData = { systemHealth: 98, score: 24850 }

  return (
    <header className="w-full border-b border-slate-800 bg-slate-950/95 text-slate-100 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        {/* Left: Player Info */}
        <PlayerDetailsCard {...playerData} />

        {/* Center: Live Beacon */}
        {/*<LiveBeacon />*/}

        {/* Right: Game Telemetry */}
        <GameStatesCard {...gameStateData} />
      </div>
    </header>
  )
}

export default Header
