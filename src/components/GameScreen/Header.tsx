import {
    HatGlasses, ShieldCheck, HeartPulse, Trophy, Activity, Swords, Award, ShieldAlert,
} from "lucide-react"
import {useGame} from "../../context/GameContext.tsx";
import {useEffect, useState} from "react";

interface PlayerDetailsProps {
  name: string
  ip: string
  role: string
}

interface GameStateProps {
  systemHealth: number
  score: number
}

const theme = {
    red: 'rose',
    blue: 'blue',
    spectator: 'emerald',
} as const;

const IconSymbol = {
    red: <Swords size={50}/>,
    blue: <ShieldCheck size={50}/>,
    spectator: <HatGlasses size={50}/>,
} as const;

const PlayerDetailsCard: React.FC<PlayerDetailsProps> = ({name, ip, role}) => {
    const color = theme[role as keyof typeof theme];
    const icon = IconSymbol[role as keyof typeof IconSymbol];
    return (
        <div className="flex items-center gap-3.5 py-4">
            {/* Role Icon */}
            <div className={`relative flex h-15 w-15 items-center justify-center rounded-xl border border-slate-700/80 bg-slate-900 text-${color}-400 shadow-inner`}>
                {icon}
                <span className={`absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full bg-${color}-500 ring-2 ring-slate-950`} />
            </div>

            {/* Player Metadata */}
            <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          {name}
        </h1>
                    <span className={`rounded-md border border-${color}-500/30 bg-${color}-950/80 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-${color}-300 uppercase`}>
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

// Custom hook to smoothly animate values when props update
const useAnimatedCounter = (targetValue: number, duration: number = 600): number => {
    const [currentValue, setCurrentValue] = useState(targetValue);

    useEffect(() => {
        let startTimestamp: number | null = null;
        const initialValue = currentValue;

        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);

            setCurrentValue(Math.floor(initialValue + (targetValue - initialValue) * easeOut));

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };

        requestAnimationFrame(step);
    }, [targetValue, duration]);

    return currentValue;
};

export const GameStatesCard: React.FC<GameStateProps> = ({ systemHealth, score }) => {
    const clampedHealth = Math.min(100, Math.max(0, systemHealth));

    // Animated values
    const animatedHealth = useAnimatedCounter(clampedHealth);
    const animatedScore = useAnimatedCounter(score);

    // Level & XP math
    const level = Math.floor(score / 1000) + 1;
    const currentLevelProgress = score % 1000;
    const animatedLevelProgress = animatedScore % 1000;
    const isHealthLow = clampedHealth <= 40;

    return (
        <div className="flex w-full justify-center lg:justify-end">
            <div className="flex items-center gap-3">

                {/* System Health Card */}
                <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/90 p-3 shadow-lg backdrop-blur-md min-w-[190px]">
                    {/* Main Content Area */}
                    <div className="flex items-center gap-3 pb-2">
                        <div className={`rounded-lg border p-1.5 transition-colors ${
                            isHealthLow
                                ? 'border-rose-500/40 bg-rose-950/80 text-rose-400 animate-pulse'
                                : 'border-rose-500/20 bg-rose-950/60 text-rose-400'
                        }`}>
                            {isHealthLow ? <ShieldAlert className="h-5 w-5" /> : <HeartPulse className="h-5 w-5" />}
                        </div>

                        <div className="flex flex-col flex-1">
                            <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                  Sys Health
                </span>
                                <Activity className={`h-3 w-3 ${
                                    isHealthLow ? 'animate-ping text-rose-500' : 'animate-pulse text-emerald-500'
                                }`} />
                            </div>

                            {/* Number Display with Counter Ratio */}
                            <div className="flex items-baseline gap-1 font-mono">
                <span className={`text-base font-extrabold ${isHealthLow ? 'text-rose-400' : 'text-slate-100'}`}>
                  {animatedHealth}
                </span>
                                <span className="text-[11px] font-medium text-slate-500">
                  / 100
                </span>
                            </div>
                        </div>
                    </div>

                    {/* Full-width Continuous Progress Bar at Bottom */}
                    <div className="bottom-0 left-0 right-0 h-1 w-full bg-slate-800/80">
                        <div
                            className={`h-full transition-all duration-500 ease-out bg-gradient-to-r ${
                                isHealthLow
                                    ? 'from-rose-800 to-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]'
                                    : 'from-emerald-800 to-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]'
                            }`}
                            style={{ width: `${clampedHealth}%` }}
                        />
                    </div>
                </div>

                {/* Score & Level Progression Card */}
                <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/90 p-3 shadow-lg backdrop-blur-md min-w-[210px]">
                    {/* Main Content Area */}
                    <div className="flex items-center gap-3 pb-2">
                        <div className="rounded-lg border border-yellow-500/20 bg-yellow-950/60 p-1.5 text-yellow-400">
                            <Trophy className="h-5 w-5" />
                        </div>

                        <div className="flex flex-col flex-1">
                            <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                  Score
                </span>

                                {/* Level Badge */}
                                <span className="inline-flex items-center gap-0.5 rounded-md bg-yellow-400/10 px-1.5 py-0.5 text-[9px] font-bold text-yellow-400 border border-yellow-500/20">
                  <Award className="h-2.5 w-2.5" /> LVL {level}
                </span>
                            </div>

                            {/* Number Display with Current Level / 1000 Ratio */}
                            <div className="flex items-baseline justify-between gap-1 font-mono">
                <span className="text-base font-extrabold text-slate-100">
                  {animatedScore.toLocaleString()}
                </span>
                                <span className="text-[11px] font-medium text-slate-400">
                  ({animatedLevelProgress}/100)
                </span>
                            </div>
                        </div>
                    </div>

                    {/* Full-width Continuous Progress Bar at Bottom */}
                    <div className=" bottom-0 left-0 right-0 h-1 w-full bg-slate-800/80">
                        <div
                            className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 shadow-[0_0_8px_rgba(251,191,36,0.7)] transition-all duration-500 ease-out"
                            style={{ width: `${(currentLevelProgress / 1000) * 100}%` }}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};

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

export const Header = () => {

    const { currentPlayer, systemHealth, playerXp } = useGame();
    const playerData: PlayerDetailsProps = { name: currentPlayer?.username ?? "Guest", ip: `192.168.1.${currentPlayer?.id}`, role: String(currentPlayer?.role) }
    // const playerData = { name:  "Guest", ip: `192.168.1.${10}`, role: 'red' }

    const gameStateData = { systemHealth: systemHealth, score: playerXp }

    let isUnderAttack = true;
    let defenseState = {
        emergencyLockdown: { active: true }
    };

    function toggleDefense() {
        defenseState.emergencyLockdown.active = !defenseState.emergencyLockdown.active
    }

    return (
        <header className="flex flex-col md:flex-row items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-xl shadow-lg gap-4">
            {/*<div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">*/}
                {/* Left: Player Info */}
                <PlayerDetailsCard {...playerData} />

                {/* Center: Live Beacon */}
                {/*<LiveBeacon />*/}

                {/* Right: Game Telemetry */}
                <GameStatesCard {...gameStateData} />

            {/*</div>*/}
        </header>
    )
}

export default Header
