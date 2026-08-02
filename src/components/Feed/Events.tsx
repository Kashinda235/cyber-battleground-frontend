import React from 'react';
import { motion } from 'framer-motion';
import {
    Trophy,
    Clock,
    CheckCircle2,
    Lock,
    Swords,
    Shield,
    Gift,
    Star
} from 'lucide-react';

// --- MOCK DATA ---
const GAME_EVENTS = [
    {
        id: 'evt_1',
        title: 'Operation: Shadow Strike',
        description: 'Eliminate 50 enemies using silenced weapons in Ranked matches.',
        progress: 50,
        total: 50,
        timeLeft: 'Ends in 2h',
        isCompleted: true,
        rewards: [
            { id: 'r1', name: 'Shadow Sniper Camo', icon: Swords, claimed: true },
            { id: 'r2', name: '5,000 XP', icon: Star, claimed: true }
        ]
    },
    {
        id: 'evt_2',
        title: 'Weekend Warrior',
        description: 'Play 10 matches with friends in any game mode.',
        progress: 7,
        total: 10,
        timeLeft: '2 days left',
        isCompleted: false,
        rewards: [
            { id: 'r3', name: 'Golden Emblem', icon: Shield, claimed: false },
            { id: 'r4', name: 'Loot Box', icon: Gift, claimed: false }
        ]
    },
    {
        id: 'evt_3',
        title: 'Pacifist Run',
        description: 'Survive to the top 10 without dealing any damage.',
        progress: 0,
        total: 1,
        timeLeft: '5 days left',
        isCompleted: false,
        rewards: [
            { id: 'r5', name: '"The Ghost" Title', icon: Trophy, claimed: false }
        ]
    }
];

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
        <div className="min-h-screen bg-slate-950 p-6 md:p-12 font-sans text-slate-200">
            <div className="max-w-4xl max-h-[500px] overflow-y-auto flex flex-col gap-8">

                {/* Header */}
                <header className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-white uppercase italic">
                            Active Events
                        </h1>
                        <p className="text-slate-400 mt-1">Complete challenges to unlock exclusive rewards.</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 bg-indigo-500/10 text-indigo-400 px-4 py-2 rounded-full font-semibold text-sm border border-indigo-500/20">
                        <Star size={16} />
                        <span>Season 4 is Live</span>
                    </div>
                </header>


                <div className='box-scroll'>
                {/* Event List */}
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
                  relative overflow-hidden rounded-xl border p-6
                  ${evt.isCompleted
                                    ? 'bg-emerald-950/20 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.05)]'
                                    : 'bg-slate-900 border-slate-800'}
                `}
                            >
                                {/* Completion Glow Effect */}
                                {evt.isCompleted && (
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                                )}

                                <div className="relative z-10 flex flex-col md:flex-row gap-6 justify-between">

                                    {/* Left Side: Info & Progress */}
                                    <div className="flex-1 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                                    {evt.title}
                                                    {evt.isCompleted && <CheckCircle2 className="text-emerald-500" size={20} />}
                                                </h2>
                                                <p className="text-sm text-slate-400 mt-1">{evt.description}</p>
                                            </div>

                                            {/* Mobile Time Left (hidden on desktop) */}
                                            <div className="md:hidden flex items-center gap-1.5 text-xs text-slate-500 bg-slate-950 px-2.5 py-1 rounded-md">
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

                                            {/* The Bar */}
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
                                    <div className="flex flex-col gap-3 min-w-[240px] border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">

                                        {/* Desktop Time Left */}
                                        <div className="hidden md:flex justify-end items-center gap-1.5 text-xs text-slate-400 mb-2">
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
                              p-2 rounded-md mr-3
                              ${isUnlocked ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-500'}
                            `}>
                                                            {isUnlocked ? <RewardIcon size={16} /> : <Lock size={16} />}
                                                        </div>

                                                        <div className="flex-1">
                                                            <p className={`text-sm font-medium ${isUnlocked ? 'text-slate-200' : 'text-slate-500'}`}>
                                                                {reward.name}
                                                            </p>
                                                            {reward.claimed && (
                                                                <p className="text-[10px] text-emerald-500 font-bold uppercase">Claimed</p>
                                                            )}
                                                        </div>

                                                        {/* Claim Button (only shows if unlocked but not claimed) */}
                                                        {isUnlocked && !reward.claimed && (
                                                            <motion.button
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded shadow-lg shadow-indigo-900/20"
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
        </div>
    );
}