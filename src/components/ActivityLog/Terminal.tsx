import React, { useState, useRef, useEffect } from 'react';

export default function ModernTerminal() {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState([
        {
            type: 'system',
            content: 'Welcome to DevOS v1.0.0. Type "help" to see available commands.'
        }
    ]);

    const bottomRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLDivElement | null>(null);

    // Auto-scroll to the bottom whenever output updates
    useEffect(() => {
        const container = inputRef.current;
        if (container) {
            // Scroll ONLY this container to the bottom
            container.scrollTo({
                top: container.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [input]);

    // Command parser logic
    const handleCommand = (cmd) => {
        const trimmed = cmd.trim();
        const args = trimmed.split(' ');
        const command = args[0].toLowerCase();

        const newHistory = [...history, { type: 'user', content: cmd }];

        switch (command) {
            case 'help':
                newHistory.push({
                    type: 'system',
                    content:
                        `Available commands:
  help       - Show available options
  about      - Display system information
  echo <msg> - Print a message to the terminal
  date       - Output the current timestamp
  clear      - Clear the terminal screen`
                });
                break;

            case 'about':
                newHistory.push({
                    type: 'system',
                    content: 'DevOS Terminal — A sleek, modern React & Tailwind component.'
                });
                break;

            case 'date':
                newHistory.push({
                    type: 'system',
                    content: new Date().toLocaleString()
                });
                break;

            case 'echo':
                newHistory.push({
                    type: 'system',
                    content: args.slice(1).join(' ') || ''
                });
                break;

            case 'clear':
                setHistory([]);
                return;

            case '':
                break;

            default:
                newHistory.push({
                    type: 'error',
                    content: `Command not found: ${command}. Type "help" for a list of commands.`
                });
        }

        setHistory(newHistory);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleCommand(input);
        setInput('');
    };

    return (
        <div
            className="w-full h-full flex flex-col max-w-3xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950 text-slate-200 font-mono text-sm"
            onClick={() => inputRef.current?.focus()}
        >
            {/* Top Bar / Window Header */}
            <div className="bg-slate-900/90 px-4 py-3 flex items-center justify-between border-b border-slate-800/80 backdrop-blur select-none shrink-0">
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80 hover:bg-rose-500 transition-colors" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80 hover:bg-amber-500 transition-colors" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-500 transition-colors" />
                </div>
                <span className="text-xs text-slate-400 font-medium tracking-wide">bash — 80x24</span>
                <div className="w-12" /> {/* Layout balancer */}
            </div>

            {/* Terminal Viewport */}
            <div className="p-4 flex-1 box-scroll min-h-0 overflow-y-auto space-y-2 cursor-text">
                {history.map((item, idx) => (
                    <div key={idx} className="whitespace-pre-wrap leading-relaxed">
                        {item.type === 'user' ? (
                            <div className="flex items-start space-x-2">
                                <span className="text-emerald-400 font-semibold select-none">user@dev:~$</span>
                                <span className="text-slate-100">{item.content}</span>
                            </div>
                        ) : item.type === 'error' ? (
                            <div className="text-rose-400">{item.content}</div>
                        ) : (
                            <div className="text-slate-300">{item.content}</div>
                        )}
                    </div>
                ))}

                {/* Input Prompt Line */}
                <form onSubmit={handleSubmit} className="flex items-center space-x-2 pt-1">
                    <span className="text-emerald-400 font-semibold select-none">user@dev:~$</span>
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
                <div ref={bottomRef} />
            </div>
        </div>
    );
}