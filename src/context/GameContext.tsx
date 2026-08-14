import { createContext, useContext, useState, type ReactNode } from 'react';
import {executeAttack, type LogCallback, type NodeState} from "../utils/AttackActionMap.ts";
import type {Player, GameState, ChatLog, MoveLog, PlayerProfile, System, Mail, MailRequest} from '../utils/types';
import {useGameData} from "../hooks/useGameData.ts";
import {type TerminalEntry, terminalCommand} from "../utils/terminalCommands.ts";

export type TabType = 'profile' | 'chat' | 'actions' | 'defence' | 'events' | 'alerts';

interface GameContextType {
    // Props / Auth Data
    token: string;
    currentPlayer: Player | undefined;

    // Core Game Data (from useGameData)
    profile: PlayerProfile | undefined;
    gameState: GameState | null;
    players: Player[];
    systems: System[];
    chats: ChatLog[];
    inboxMails: Mail[]
    sentMails: Mail[]
    moveLogs: MoveLog[];
    isLoading: boolean;

    // Actions (from useGameData)
    sendChat: (msg: string) => void;
    updateSeen: (data: Mail) => Promise<Mail>
    performAction: (actionData: any) => void;
    updatePlayerProfile:  (data: PlayerProfile) => void;

    // Local UI State
    target: Player | undefined;
    sendMail: (data: MailRequest) => Promise<Mail>
    setTarget: (target: Player) => void;
    activeTab: TabType;
    setActiveTab: (tab: TabType) => void;

    // Shared Terminal/Command System
    terminalHistory: TerminalEntry[];
    executeCommand: (cmd: string) => void;
    clearTerminal: () => void;
    handleCommand: (action: any, target: string | null) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

interface GameProviderProps {
    token: string;
    player: Player | undefined;
    children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ token, player, children }) => {
    const {
        profile, gameState, chats, sendChat, moveLogs, inboxMails, sentMails,
        players, systems, performAction, updatePlayerProfile, sendMail,
        updateSeen, isLoading,
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
        terminalCommand(cmd, setTerminalHistory);
    }

    const handleCommand = async (action: any, target: string | null, targetId: number | null) => {
        const targetPlayer = players.find( player => player.id === targetId);
        const targetSystem = systems.find( system => system.playerId === targetId);

        if (!targetPlayer || !targetSystem) {
            console.log("target not found");
            return;
        }

        const targetNode: NodeState = {
            id: `player-0${targetPlayer.id}`,
            ip: targetSystem.ip,
            hostname: targetSystem.hostname,
            password: targetSystem.password,
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
            content: action.command.replace("<TARGET>", target),
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
        systems,
        chats,
        inboxMails,
        sentMails,
        moveLogs,
        isLoading,
        sendChat,
        sendMail,
        updateSeen,
        performAction,
        updatePlayerProfile,
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