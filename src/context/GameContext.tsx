import { createContext, useContext, useState, type ReactNode } from 'react';
import {executeAttack, type LogCallback} from "../utils/AttackActionMap.ts";
import type {Player, GameState, ChatLog, MoveLog, PlayerProfile} from '../utils/types';
import {useGameData} from "../hooks/useGameData.ts";

export interface TerminalEntry {
    id: string;
    type: 'system' | 'user' | 'error' | 'action' | 'load' | 'test' ;
    content: string;
    timestamp: string;
}

export type TabType = 'profile' | 'chat' | 'actions' | 'defence' | 'events' | 'alerts';

interface GameContextType {
    // Props / Auth Data
    token: string;
    currentPlayer: Player | undefined;

    // Core Game Data (from useGameData)
    profile: PlayerProfile | undefined;
    gameState: GameState | null;
    players: Player[];
    chats: ChatLog[];
    moveLogs: MoveLog[];
    isLoading: boolean;

    // Actions (from useGameData)
    sendChat: (msg: string) => void;
    performAction: (actionData: any) => void;

    // Local UI State
    target: Player | undefined;
    setTarget: (target: Player) => void;
    activeTab: TabType;
    setActiveTab: (tab: TabType) => void;

    // Shared Terminal/Command System
    terminalHistory: TerminalEntry[];
    executeCommand: (cmd: string) => void;
    clearTerminal: () => void;
    handleCommand: (action: any) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

interface GameProviderProps {
    token: string;
    player: Player | undefined;
    children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ token, player, children }) => {
    const {
        profile, gameState, chats, sendChat, moveLogs,
        players, performAction, isLoading
    } = useGameData({ token, player });
    const [target, setTarget] = useState<Player | undefined>(undefined);
    const [activeTab, setActiveTab] = useState<TabType>('profile');

    const [terminalHistory, setTerminalHistory] = useState<TerminalEntry[]>([
        {
            id: '1',
            type: 'system',
            content: 'Welcome to DevOS v1.0.0. Type "help" to see available commands.',
            timestamp: new Date().toLocaleTimeString(),
        }
    ]);

    // Single source of truth for executing any command/action
    const executeCommand = (cmd: string) => {
        const trimmed = cmd.trim();
        if (!trimmed) return;

        const timestamp = new Date().toLocaleTimeString();
        const args = trimmed.split(' ');
        const command = args[0].toLowerCase();

        const userEntry: TerminalEntry = {
            id: Date.now().toString(),
            type: 'user',
            content: cmd,
            timestamp,
        };

        const resultEntries: TerminalEntry[] = [];

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
                setTerminalHistory([]);
                return;

            default:
                resultEntries.push({
                    id: (Date.now() + 1).toString(),
                    type: 'error',
                    content: `Command not found: ${command}`,
                    timestamp,
                });
        }

        setTerminalHistory((prev) => [...prev, userEntry, ...resultEntries]);
    };

    const handleCommand = async (action: any) => {
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
        const userEntry: TerminalEntry = {
            id: Date.now().toString(),
            type: 'user',
            content: action.command,
            timestamp,
        };
        setTerminalHistory((prev) => [...prev, userEntry]);

        // 2. Callback to append real-time progress updates directly into state
        const handleLiveLog: LogCallback = (log) => {
            const liveEntry: TerminalEntry = {
                id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                timestamp: new Date().toLocaleTimeString(),
                ...log
            };
            setTerminalHistory((prev) => [...prev, liveEntry]);
        };

        // 3. Execute attack (will fire handleLiveLog periodically)
        const result = await executeAttack(action.name, targetNode, "ME", handleLiveLog);

        // 4. Append final summary result
        const resultEntry: TerminalEntry = {
            id: Date.now().toString(),
            timestamp: new Date().toLocaleTimeString(),
            ...result
        };
        setTerminalHistory((prev) => [...prev, resultEntry]);
    };

    const clearTerminal = () => setTerminalHistory([]);

    const value: GameContextType = {
        token,
        currentPlayer: player,
        profile,
        gameState,
        players,
        chats,
        moveLogs,
        isLoading,
        sendChat,
        performAction,
        target,
        setTarget,
        activeTab,
        setActiveTab,
        terminalHistory,
        executeCommand,
        clearTerminal,
        handleCommand
    };

    return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) throw new Error('useGame must be used within a GameProvider');
    return context;
};