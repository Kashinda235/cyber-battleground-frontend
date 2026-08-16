import { motion } from 'framer-motion';
import {
    Clock, CheckCircle2, Lock, Star, Tickets
} from 'lucide-react';
import {GAME_EVENTS} from "../../utils/EventsUtils.ts";

export default function EventHub() {
    // Animation variants for staggered list loading
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
    };

    return (
        /* Top wrapper fills grid slot (w-full h-full flex flex-col) without page-level screen constraints */
        <div className="w-full h-full flex flex-col p-4 bg-slate-950 font-sans text-slate-200 overflow-hidden box-scroll">

            {/* Header (Pinned to Top) */}
            <header className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4 shrink-0">
                <div>

                <div className='flex items-center gap-3'>
                    <span className="font-bold text-emerald-400">
                                <Tickets size={35}/>
                            </span>
                    <h1 className="text-2xl font-black tracking-tight text-white italic">
                        Active Events
                    </h1>
                </div>
                    <p className="text-xs text-slate-400 mt-1">
                        Complete challenges to unlock exclusive rewards.
                    </p>
                </div>
                <div className="hidden sm:flex items-center gap-2 bg-indigo-500/10 text-indigo-400 px-4 py-2 rounded-full font-semibold text-sm border border-indigo-500/20 shrink-0">
                    <Star size={16} />
                    <span>Season 4 is Live</span>
                </div>
            </header>

            {/* Scrollable Event List Container */}
            <div className="flex-1 min-h-0 overflow-y-auto pr-1">
                <motion.div
                    className="flex flex-col gap-5"
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                >
                    {GAME_EVENTS.map((evt) => {
                        const progressPercent = Math.min((evt.progress / evt.total) * 100, 100);

                        return (
                            <motion.div
                                key={evt.id}
                                variants={itemVariants}
                                className={`
                                relative overflow-hidden rounded-xl border p-5
                                ${evt.isCompleted
                                    ? 'bg-emerald-950/20 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.05)]'
                                    : 'bg-slate-900 border-slate-800'}
                            `}
                            >
                                {/* Completion Glow Effect */}
                                {evt.isCompleted && (
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                                )}

                                <div className="relative z-10 flex flex-col gap-6 justify-between">

                                    {/* Left Side: Info & Progress */}
                                    <div className="flex-1 space-y-4 min-w-0">
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="min-w-0">
                                                <h2 className="text-lg font-bold text-white flex items-center gap-2 truncate">
                                                    <span className="truncate">{evt.title}</span>
                                                    {evt.isCompleted && <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />}
                                                </h2>
                                                <p className="text-sm text-slate-400 mt-1">{evt.description}</p>
                                            </div>

                                            {/* Mobile Time Left */}
                                            <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-950 px-2.5 py-1 rounded-md shrink-0">
                                                <Clock size={12} /> {evt.timeLeft}
                                            </div>
                                        </div>

                                        {/* Progress Bar Area */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm font-medium">
                                            <span className={evt.isCompleted ? 'text-emerald-400' : 'text-indigo-400'}>
                                                {evt.progress} / {evt.total}
                                            </span>
                                                <span className="text-slate-500">
                                                {Math.floor(progressPercent)}%
                                            </span>
                                            </div>

                                            {/* Progress Bar Track */}
                                            <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/50 relative">
                                                <motion.div
                                                    className={`absolute top-0 left-0 h-full rounded-full ${
                                                        evt.isCompleted
                                                            ? 'bg-gradient-to-r from-emerald-600 to-emerald-400'
                                                            : 'bg-gradient-to-r from-indigo-600 to-cyan-400'
                                                    }`}
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${progressPercent}%` }}
                                                    transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Side: Rewards */}
                                    <div className="flex flex-col gap-3 shrink-0 border-t border-slate-800 pt-4">

                                        {/* Desktop Time Left */}
                                        <div className="hidden justify-end items-center gap-1.5 text-xs text-slate-400 mb-1">
                                            <Clock size={14} /> <span>{evt.timeLeft}</span>
                                        </div>

                                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                            Rewards
                                        </h3>

                                        <div className="flex flex-col gap-2">
                                            {evt.rewards.map((reward) => {
                                                const RewardIcon = reward.icon;
                                                const isUnlocked = evt.isCompleted;

                                                return (
                                                    <div
                                                        key={reward.id}
                                                        className={`
                                                        flex items-center p-2 rounded-lg border transition-colors
                                                        ${isUnlocked
                                                            ? 'bg-slate-800/50 border-slate-700'
                                                            : 'bg-slate-950/50 border-slate-800/50 opacity-70'}
                                                    `}
                                                    >
                                                        <div className={`
                                                        p-2 rounded-md mr-3 shrink-0
                                                        ${isUnlocked ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-500'}
                                                    `}>
                                                            {isUnlocked ? <RewardIcon size={16} /> : <Lock size={16} />}
                                                        </div>

                                                        <div className="flex-1 min-w-0 pr-1">
                                                            <p className={`text-xs font-medium truncate ${isUnlocked ? 'text-slate-200' : 'text-slate-500'}`}>
                                                                {reward.name}
                                                            </p>
                                                            {reward.claimed && (
                                                                <p className="text-[10px] text-emerald-500 font-bold uppercase">Claimed</p>
                                                            )}
                                                        </div>

                                                        {/* Claim Button */}
                                                        {isUnlocked && !reward.claimed && (
                                                            <motion.button
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded shadow-lg shadow-indigo-900/20 shrink-0"
                                                            >
                                                                Claim
                                                            </motion.button>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </div>
    );
}