import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Monitor, Settings, Bell, ShieldAlert } from 'lucide-react';

const HoneyPotControlPanel = ({ onBack }) => {
    const [controls, setControls] = useState({
        honeypot: true,
        decoyFiles: false,
        alerts: true,
    });

    const handleToggle = (key) => {
        setControls((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="w-full mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl overflow-hidden flex flex-col h-[520px]">

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="p-1.5 -ml-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        aria-label="Go back"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">
                        Deception Controls
                    </h2>
                </div>
            </div>

            {/* Scrollable Content Region */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">

                {/* CONTROL 1: HONEYPOT (Staggered Wave Animation) */}
                <div className={`flex items-center justify-between p-4 rounded-xl border transition-colors duration-300 ${
                    controls.honeypot
                        ? 'bg-blue-50/50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-800/50'
                        : 'bg-white border-gray-100 dark:bg-gray-800/50 dark:border-gray-700/50'
                }`}>
                    <div className="pr-4">
                        <h3 className={`text-sm font-medium ${controls.honeypot ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'}`}>
                            Honeypot Service
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                            Deploy a decoy system environment to attract and monitor attackers.
                        </p>
                    </div>

                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleToggle('honeypot')}
                        className={`relative flex items-center justify-center p-3 h-[48px] w-[68px] rounded-lg flex-shrink-0 transition-colors duration-300 ${
                            controls.honeypot
                                ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'
                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
                        }`}
                    >
                        <Monitor className="w-6 h-6 z-10" />

                        {/* 1..2..3 Staggered Radio Waves */}
                        <div className="flex items-center ml-1 space-x-0.5 h-6 w-5 relative">
                            {[0, 1, 2].map((i) => (
                                <motion.svg
                                    key={i}
                                    className="w-2 h-4"
                                    viewBox="0 0 10 20"
                                    animate={controls.honeypot ? {
                                        opacity: [0.2, 1, 0.2],
                                        scale: [0.85, 1.1, 0.85]
                                    } : { opacity: 0.15, scale: 0.85 }}
                                    transition={controls.honeypot ? {
                                        repeat: Infinity,
                                        duration: 1.2,
                                        delay: i * 0.2,
                                        ease: "easeInOut"
                                    } : { duration: 0.3 }}
                                >
                                    <path d="M2 0 Q10 010 2 20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                                </motion.svg>
                            ))}
                        </div>
                    </motion.button>
                </div>

                {/* CONTROL 2: DECOY FILES (Counter-Rotating Gears) */}
                <div className={`flex items-center justify-between p-4 rounded-xl border transition-colors duration-300 ${
                    controls.decoyFiles
                        ? 'bg-blue-50/50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-800/50'
                        : 'bg-white border-gray-100 dark:bg-gray-800/50 dark:border-gray-700/50'
                }`}>
                    <div className="pr-4">
                        <h3 className={`text-sm font-medium ${controls.decoyFiles ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'}`}>
                            Decoy Files
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                            Automatically generate and plant fake sensitive files (honeytokens).
                        </p>
                    </div>

                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleToggle('decoyFiles')}
                        className={`relative flex items-center justify-center p-3 w-[68px] h-[48px] rounded-lg flex-shrink-0 transition-colors duration-300 ${
                            controls.decoyFiles
                                ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'
                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
                        }`}
                    >
                        {/* Top Left Gear (Clockwise) */}
                        <motion.div
                            className="absolute top-2 left-3"
                            animate={controls.decoyFiles ? { rotate: 360 } : { rotate: 0 }}
                            transition={controls.decoyFiles ? { repeat: Infinity, duration: 3, ease: "linear" } : { duration: 0.3 }}
                        >
                            <Settings className="w-[22px] h-[22px]" />
                        </motion.div>

                        {/* Bottom Right Gear (Counter-Clockwise) */}
                        <motion.div
                            className="absolute bottom-2 right-3"
                            animate={controls.decoyFiles ? { rotate: -360 } : { rotate: 0 }}
                            transition={controls.decoyFiles ? { repeat: Infinity, duration: 3, ease: "linear" } : { duration: 0.3 }}
                        >
                            <Settings className="w-[18px] h-[18px]" />
                        </motion.div>
                    </motion.button>
                </div>

                {/* CONTROL 3: ALERTS (Wiggling Bell with Pulse Ring) */}
                <div className={`flex items-center justify-between p-4 rounded-xl border transition-colors duration-300 ${
                    controls.alerts
                        ? 'bg-blue-50/50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-800/50'
                        : 'bg-white border-gray-100 dark:bg-gray-800/50 dark:border-gray-700/50'
                }`}>
                    <div className="pr-4">
                        <h3 className={`text-sm font-medium ${controls.alerts ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'}`}>
                            High-Fidelity Alerts
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                            Trigger immediate critical notifications upon any honeypot interaction.
                        </p>
                    </div>

                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleToggle('alerts')}
                        className={`relative flex items-center justify-center p-3 h-[48px] w-[68px] rounded-lg flex-shrink-0 transition-colors duration-300 ${
                            controls.alerts
                                ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'
                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
                        }`}
                    >
                        {/* Radiating Ping Aura */}
                        {controls.alerts && (
                            <motion.div
                                className="absolute inset-0 bg-blue-400/40 dark:bg-blue-500/30 rounded-lg"
                                initial={{ scale: 1, opacity: 0.6 }}
                                animate={{ scale: [1, 1.25], opacity: [0.6, 0] }}
                                // transition={{ repeat: Infinity, duration: 1.2, ease: "easeOut" }}
                            />
                        )}

                        {/* Wiggling Bell Icon */}
                        <motion.div
                            className="z-10"
                            animate={controls.alerts ? { rotate: [-12, 12, -12] } : { rotate: 0 }}
                            transition={controls.alerts ? { repeat: Infinity, duration: 0.4, ease: "easeInOut" } : { duration: 0.2 }}
                        >
                            <Bell className="w-6 h-6" />
                        </motion.div>
                    </motion.button>
                </div>

                {/* Notice Box */}
                <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                        <ShieldAlert className="w-4 h-4 text-blue-600 dark:text-blue-500" />
                        <h4 className="text-sm font-medium text-blue-800 dark:text-blue-500">
                            Zero False-Positive Zone
                        </h4>
                    </div>
                    <p className="text-xs text-blue-700 dark:text-blue-500/80 leading-relaxed pl-6">
                        Legitimate users have no reason to access honeypots. Any interaction logged by these systems is treated as a confirmed breach attempt.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default HoneyPotControlPanel;