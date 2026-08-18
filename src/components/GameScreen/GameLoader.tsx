import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, TerminalSquare } from 'lucide-react';

const loadingMessages = [
    "DECRYPTING_CORE",
    "BYPASSING_FIREWALL",
    "ROUTING_MAINFRAME",
    "INJECTING_PAYLOAD"
];

const CyberpunkLoader: React.FC = () => {
    const [messageIndex, setMessageIndex] = useState(0);

    // Cycle through messages every 2.5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center font-mono selection:bg-cyan-500/30">

            {/* Main UI Container */}
            <div className="relative flex flex-col items-center justify-center p-12 border border-zinc-800/50 bg-zinc-900/20 backdrop-blur-sm rounded-sm overflow-hidden">

                {/* Background Scanline Overlay */}
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />

                {/* Top left decorative marker */}
                <div className="absolute top-2 left-2 flex items-center gap-2">
                    <TerminalSquare className="w-4 h-4 text-fuchsia-500 opacity-70" />
                    <span className="text-[10px] text-zinc-500">SYS.INIT_v2.4</span>
                </div>

                {/* Central Animation Cluster */}
                <div className="relative flex items-center justify-center w-40 h-40 mt-4">

                    {/* Outer Cyan Ring */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                        className="absolute inset-0 rounded-full border border-cyan-500/30 border-t-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                    />

                    {/* Inner Fuchsia Ring */}
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
                        className="absolute inset-4 rounded-full border border-dashed border-fuchsia-500/30 border-b-fuchsia-500 drop-shadow-[0_0_8px_rgba(217,70,239,0.5)]"
                    />

                    {/* Core Glitching Icon */}
                    <motion.div
                        animate={{
                            opacity: [1, 0.8, 1, 1, 0, 1],
                            scale: [1, 1.05, 1, 1, 0.95, 1],
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 3,
                            times: [0, 0.1, 0.2, 0.8, 0.9, 1]
                        }}
                        className="relative"
                    >
                        <Cpu className="w-12 h-12 text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.8)]" />

                        <motion.div
                            animate={{ x: [-2, 2, -1, 0] }}
                            transition={{ repeat: Infinity, duration: 0.2, repeatDelay: 2 }}
                            className="absolute inset-0 text-fuchsia-500 opacity-50 mix-blend-screen"
                        >
                            <Cpu className="w-12 h-12" />
                        </motion.div>
                    </motion.div>
                </div>

                {/* Status Text & Progress Section */}
                <div className="mt-8 flex flex-col items-center gap-4 z-10 w-full">

                    {/* Animated Text Label */}
                    <div className="flex items-center gap-2 text-cyan-400 font-bold tracking-[0.2em] text-sm h-6">
                        <span className="text-fuchsia-500 opacity-70">{"["}</span>
                        <div className="relative w-48 text-center overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={messageIndex}
                                    initial={{ y: 20, opacity: 0, filter: "blur(4px)" }}
                                    animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                                    exit={{ y: -20, opacity: 0, filter: "blur(4px)" }}
                                    transition={{ duration: 0.2 }}
                                    className="block w-full"
                                >
                                    {loadingMessages[messageIndex]}
                                </motion.span>
                            </AnimatePresence>
                        </div>
                        <span className="text-fuchsia-500 opacity-70">{"]"}</span>
                    </div>

                    {/* Indeterminate Looping Progress Bar */}
                    <div className="w-56 h-1 bg-zinc-900 border border-zinc-800 relative overflow-hidden">
                        {/* The sweeping block */}
                        <motion.div
                            initial={{ left: "-40%" }}
                            animate={{ left: "100%" }}
                            transition={{
                                repeat: Infinity,
                                duration: 1.2,
                                ease: "linear"
                            }}
                            className="absolute top-0 bottom-0 w-[40%] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                        />
                    </div>

                    {/* Technical subtext */}
                    <motion.div
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="text-[10px] text-zinc-500 tracking-wider mt-1"
                    >
                        OVERRIDE_PROTO: ACTIVE // 0x8F9A
                    </motion.div>
                </div>

                {/* Decorative Corner Borders */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-500/50" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-500/50" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-500/50" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-500/50" />
            </div>
        </div>
    );
};

export default CyberpunkLoader;