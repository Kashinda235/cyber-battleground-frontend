import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Crosshair,
    Zap,
    Bookmark,
    Share2,
    Check,
    Flame,
    Info
} from 'lucide-react';

interface GameItemProps {
    onBack?: () => void;
    onUseItem?: () => void;
}

export const CardDescription: React.FC<GameItemProps> = ({
                                                             onBack = () => console.log('Back clicked'),
                                                             onUseItem = () => console.log('Item used')
                                                         }) => {
    const COOLDOWN_TIME = 8; // seconds

    // States
    const [cooldown, setCooldown] = useState<number>(0);
    const [isTargeting, setIsTargeting] = useState<boolean>(false);
    const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
    const [copied, setCopied] = useState<boolean>(false);
    const [showLore, setShowLore] = useState<boolean>(false);

    // Active cooldown interval loop
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (cooldown > 0) {
            interval = setInterval(() => {
                setCooldown((prev) => Math.max(0, prev - 0.1));
            }, 100);
        }
        return () => clearInterval(interval);
    }, [cooldown]);

    const handleUse = () => {
        if (cooldown > 0) return;
        setCooldown(COOLDOWN_TIME);
        setIsTargeting(false);
        onUseItem();
    };

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (e) {
            console.error(e);
        }
    };

    const isOnCooldown = cooldown > 0;
    // Calculate SVG stroke offset for smooth radial progress (Circumference ~ 100)
    const strokeDashoffset = 100 - (cooldown / COOLDOWN_TIME) * 100;

    return (
        <div className="max-w-md w-full mx-auto bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden p-6 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-200">

            {/* Navigation Header */}
            <div className="flex items-center justify-between mb-6">
                <motion.button
                    whileTap={{ scale: 0.92 }}
                    onClick={onBack}
                    className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors py-1.5 px-3 rounded-full bg-slate-100 dark:bg-slate-800/60"
                >
                    <ArrowLeft size={14} />
                    Back
                </motion.button>

                {/* Top Utility Icons */}
                <div className="flex items-center gap-1">
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsBookmarked(!isBookmarked)}
                        className={`p-2 rounded-full transition-colors ${
                            isBookmarked
                                ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 dark:text-indigo-400'
                                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                        }`}
                        title="Bookmark"
                    >
                        <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
                    </motion.button>

                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={handleShare}
                        className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        title="Share Link"
                    >
                        {copied ? <Check size={16} className="text-emerald-500" /> : <Share2 size={16} />}
                    </motion.button>
                </div>
            </div>

            {/* Main Item Card Header with SVG Radial Cooldown */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 mb-5">

                {/* Radial Cooldown & Icon Ring */}
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-200/50 dark:bg-slate-800">
                    {/* SVG Background Circle */}
                    <svg className="absolute inset-0 h-full w-full text-slate-300 dark:text-slate-700" viewBox="0 0 36 36">
                        <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.8"
                        />
                    </svg>

                    {/* SVG Active Cooldown Radial Overlay */}
                    {isOnCooldown && (
                        <svg className="absolute inset-0 z-0 h-full w-full -rotate-90 text-indigo-600 dark:text-indigo-400 transition-all duration-100" viewBox="0 0 36 36">
                            <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.8"
                                strokeDasharray="100, 100"
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                            />
                        </svg>
                    )}

                    {/* Center Item Icon */}
                    <div className={`relative z-10 transition-transform ${!isOnCooldown ? "hover:scale-110 text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500"}`}>
                        <Flame size={22} />
                    </div>
                </div>

                {/* Item Information & Cooldown Status */}
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <h3 className={`font-bold text-base transition-colors ${isOnCooldown ? "text-slate-400 dark:text-slate-500" : "text-slate-900 dark:text-white"}`}>
                            Phoenix Essence
                        </h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200/60 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
              LVL 50
            </span>
                    </div>

                    {/* Status Indicator Dot */}
                    <div className="mt-1.5 flex items-center gap-1.5">
                        <div className={`h-2 w-2 rounded-full ${isOnCooldown ? "animate-pulse bg-rose-500" : "bg-emerald-500"}`} />
                        <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400 font-mono">
              {isOnCooldown ? `On Cooldown (${cooldown.toFixed(1)}s)` : `Ready (${COOLDOWN_TIME}s CD)`}
            </span>
                    </div>
                </div>
            </div>

            {/* Description Text */}
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                Unleashes a surge of elemental flame that restores health to the selected target and clears negative status effects.
            </p>

            {/* Collapsible Details */}
            <div className="mb-6">
                <button
                    onClick={() => setShowLore(!showLore)}
                    className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                    <Info size={13} />
                    {showLore ? 'Hide Details' : 'Show Details'}
                </button>

                <AnimatePresence>
                    {showLore && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/20 p-3 rounded-xl border border-slate-100 dark:border-slate-800/50"
                        >
                            Distilled from ancient embers. Grants immunity to burn effects for 5 seconds after application.
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom Actions */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                {/* Target Button */}
                <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setIsTargeting(!isTargeting)}
                    disabled={isOnCooldown}
                    className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all border ${
                        isTargeting
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                            : isOnCooldown
                                ? 'border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-60'
                                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                    }`}
                >
                    <Crosshair size={15} />
                    {isTargeting ? 'Targeting' : 'Choose Target'}
                </motion.button>

                {/* Use Item Button */}
                <motion.button
                    whileTap={!isOnCooldown ? { scale: 0.97 } : {}}
                    onClick={handleUse}
                    disabled={isOnCooldown}
                    className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all ${
                        isOnCooldown
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-70'
                            : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                    }`}
                >
                    <Zap size={15} />
                    {isOnCooldown ? 'Recharging...' : 'Use Item'}
                </motion.button>
            </div>

        </div>
    );
};

export default CardDescription;