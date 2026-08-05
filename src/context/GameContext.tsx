import { createContext, useContext, useState, type ReactNode } from 'react';
import {executeAttack, type LogCallback} from "../utils/AttackActionMap.ts";

export interface LogEntry {
    id: string;
    type: 'system' | 'user' | 'error' | 'action' | 'load' | 'test' ;
    content: string;
    timestamp: string;
}

interface GameContextType {
    history: LogEntry[];
    executeAction: (command: string) => void;
    handleAction: (action: any) => void;
    clearHistory: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [history, setHistory] = useState<LogEntry[]>([
        {
            id: '1',
            type: 'system',
            content: 'Welcome to DevOS v1.0.0. Type "help" to see available commands.',
            timestamp: new Date().toLocaleTimeString(),
        }
    ]);

    // Single source of truth for executing any command/action
    const executeAction = (cmd: string) => {
        const trimmed = cmd.trim();
        if (!trimmed) return;

        const timestamp = new Date().toLocaleTimeString();
        const args = trimmed.split(' ');
        const command = args[0].toLowerCase();

        const userEntry: LogEntry = {
            id: Date.now().toString(),
            type: 'user',
            content: cmd,
            timestamp,
        };

        let resultEntries: LogEntry[] = [];

        switch (command) {
            case 'help':
                resultEntries.push({
                    id: (Date.now() + 1).toString(),
                    type: 'system',
                    content: `Available commands:\n  help       - Show available options\n  about      - Display system information\n  echo <msg> - Print a message\n  date       - Output timestamp\n  clear      - Clear history`,
                    timestamp,
                });
                break;

            case 'about':
                resultEntries.push({
                    id: (Date.now() + 1).toString(),
                    type: 'system',
                    content: 'DevOS Terminal — Integrated central command.',
                    timestamp,
                });
                break;

            case 'date':
                resultEntries.push({
                    id: (Date.now() + 1).toString(),
                    type: 'system',
                    content: new Date().toLocaleString(),
                    timestamp,
                });
                break;

            case 'echo':
                resultEntries.push({
                    id: (Date.now() + 1).toString(),
                    type: 'system',
                    content: args.slice(1).join(' ') || '',
                    timestamp,
                });
                break;

            case 'clear':
                setHistory([]);
                return;

            default:
                resultEntries.push({
                    id: (Date.now() + 1).toString(),
                    type: 'error',
                    content: `Command not found: ${command}`,
                    timestamp,
                });
        }

        setHistory((prev) => [...prev, userEntry, ...resultEntries]);
    };

    const handleAction = async (action: any) => {
        const targetNode = {
            id: "player-101",
            ip: '192.168.10.58',
            hostname: 'Hacker',
            securityLevel: 2, // e.g., 1 to 5
            defense: 6,
            integrity: 85,
            isCompromised: true,
            isFirewallActive: true,
        };

        const timestamp = new Date().toLocaleTimeString();

        // 1. Immediately append user's command input to history
        const userEntry: LogEntry = {
            id: Date.now().toString(),
            type: 'user',
            content: action.command,
            timestamp,
        };
        setHistory((prev) => [...prev, userEntry]);

        // 2. Callback to append real-time progress updates directly into state
        const handleLiveLog: LogCallback = (log) => {
            const liveEntry: LogEntry = {
                id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                timestamp: new Date().toLocaleTimeString(),
                ...log
            };
            setHistory((prev) => [...prev, liveEntry]);
        };

        // 3. Execute attack (will fire handleLiveLog periodically)
        const result = await executeAttack(action.name, targetNode, "ME", handleLiveLog);

        // 4. Append final summary result
        const resultEntry: LogEntry = {
            id: Date.now().toString(),
            timestamp: new Date().toLocaleTimeString(),
            ...result
        };
        setHistory((prev) => [...prev, resultEntry]);
    };

    const clearHistory = () => setHistory([]);

    return (
        <GameContext.Provider value={{ history, executeAction, handleAction, clearHistory }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) throw new Error('useGame must be used within a GameProvider');
    return context;
};