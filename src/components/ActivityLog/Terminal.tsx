import { useState, useRef, useEffect } from 'react';
import type { Player } from "../../utils/types";
import { useGame } from "../../context/GameContext";

interface TerminalProps {
    currentUser: Player;
}

const defaultUser: Player = {
    id: 121,
    username: "hacker",
    role: "red",
    status: "online",
    joinedAt: "now",
    lastSeen: "now"
};

export default function ModernTerminal({ currentUser = defaultUser }: TerminalProps) {
    const { history, executeAction } = useGame(); // Shared state
    const [input, setInput] = useState('');

    const viewportRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    // Scroll to bottom when history updates
    useEffect(() => {
        if (viewportRef.current) {
            viewportRef.current.scrollTo({
                top: viewportRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [history]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        executeAction(input);
        setInput('');
    };

    return (
        <div
            className="w-full h-full flex flex-col max-w-3xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950 text-slate-200 font-mono text-sm"
            onClick={() => inputRef.current?.focus()}
        >
            <div className="bg-slate-900/90 px-4 py-3 flex items-center justify-between border-b border-slate-800/80 backdrop-blur select-none shrink-0">
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs text-slate-400 font-medium">bash — 80x24</span>
                <div className="w-12" />
            </div>

            <div ref={viewportRef} className="p-4 flex-1 overflow-y-auto space-y-2 cursor-text">
                {history.map((item) => (
                    <div key={item.id} className="whitespace-pre-wrap leading-relaxed">
                        {item.type === 'user' ? (
                            <div className="flex items-start space-x-2">
                                <span className="text-emerald-400 font-semibold select-none">
                                    {currentUser.username}@{currentUser.role}:~$
                                </span>
                                <span className="text-slate-100">{item.content}</span>
                            </div>
                        ) : item.type === 'error' ? (
                            <div className="text-rose-400">{item.content}</div>
                        ) : item.type === 'load' ? (
                            <div className="text-yellow-400">{item.content}</div>
                        ) : item.type === 'test' ? (
                            <div className="text-blue-400">{item.content}</div>
                        ) : item.type === 'action' ? (
                            <div className="text-green-500">{item.content}</div>
                        ) : (
                            <div className="text-slate-300">{item.content}</div>
                        )}
                    </div>
                ))}

                <form onSubmit={handleSubmit} className="flex items-center space-x-2 pt-1">
                    <span className="text-emerald-400 font-semibold select-none">
                        {currentUser.username}@{currentUser.role}:~$
                    </span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-slate-100 caret-emerald-400 font-mono focus:ring-0 p-0"
                        autoFocus
                        spellCheck={false}
                    />
                </form>
            </div>
        </div>
    );
}