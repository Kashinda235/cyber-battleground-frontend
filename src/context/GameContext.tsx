import { createContext, useContext, useState, type ReactNode } from 'react';

export interface LogEntry {
    id: string;
    type: 'system' | 'user' | 'error' | 'action';
    content: string;
    timestamp: string;
}

interface GameContextType {
    history: LogEntry[];
    executeAction: (command: string) => void;
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

    const clearHistory = () => setHistory([]);

    return (
        <GameContext.Provider value={{ history, executeAction, clearHistory }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) throw new Error('useGame must be used within a GameProvider');
    return context;
};