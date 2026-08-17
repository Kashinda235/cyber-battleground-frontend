import { createContext, useContext, useState, type ReactNode } from 'react';
import {executeAttack, type LogCallback, type NodeState} from "../utils/AttackActionMap.ts";
import type {
    Player,
    GameState,
    ChatLog,
    MoveLog,
    PlayerProfile,
    System,
    Mail,
    MailRequest,
    ActionResult, ActionRequest, PlayerStatsRequest, Connection, ConnectionRequest
} from '../utils/types';
import {useGameData} from "../hooks/useGameData.ts";
import {type TerminalEntry, terminalCommand} from "../utils/terminalCommands.ts";
import {type ToastMessage, useToast} from "./ToastContext.tsx";

export type TabType = 'profile' | 'chat' | 'actions' | 'defence' | 'events' | 'alerts';

interface GameContextType {
    // Props / Auth Data
    token: string;
    currentPlayer: Player | undefined;

    // Core Game Data (from useGameData)
    profile: PlayerProfile | undefined;
    systemHealth: number;
    playerXp: number;
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
    performAction: (data: ActionRequest) => Promise<ActionResult>;
    updatePlayerProfile:  (data: PlayerProfile) => void;
    claimReward: (reward: number) => void;

    // Local UI State
    target: Player | undefined;
    sendMail: (data: MailRequest) => Promise<Mail>;
    stateConnection:  (data: ConnectionRequest) => Promise<Connection>;
    setTarget: (target: Player) => void;
    activeTab: TabType;
    setActiveTab: (tab: TabType) => void;

    // Shared Terminal/Command System
    terminalHistory: TerminalEntry[];
    executeCommand: (cmd: string) => void;
    clearTerminal: () => void;
    handleCommand: (action: any, target: string | null, targetId: number | null) => void;
}

export interface GameContextServices {
    target: NodeState;
    performAction: (data: ActionRequest) => Promise<ActionResult>;
    sendMail: (data: MailRequest) => Promise<Mail>;
    stateConnection:  (data: ConnectionRequest) => Promise<Connection>;
    updatePlayerStats: (data: PlayerStatsRequest) => any;
    playerXp: number;
    systemHealth: number;
    connections: Connection[];
    showToast: (toast: Omit<ToastMessage, "id">) => void;
    // ..more required functions
}

const GameContext = createContext<GameContextType | undefined>(undefined);

interface GameProviderProps {
    token: string;
    player: Player | undefined;
    children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ token, player, children }) => {
    const {
        profile, gameState, systemHealth, playerXp, updatePlayerStats, chats, sendChat, moveLogs,
        inboxMails, sentMails, players, systems, performAction, stateConnection, connections,
        updatePlayerProfile, sendMail, updateSeen, isLoading,
    } = useGameData({ token, player });
    const { showToast } = useToast();
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

    const handleCommand = async (action: any, targetName: string | null, targetId: number | null) => {
        const targetPlayer = players.find( player => player.id === targetId);
        const targetSystem = systems.find( system => system.playerId === targetId);

        const timestamp = new Date().toLocaleTimeString();

        // 1. Immediately append user's command input to history
        const userEntry: TerminalEntry = {
            id: Date.now().toString(),
            type: 'user',
            content: action.command.replace("<TARGET>", targetName),
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

        if (!targetPlayer || !targetSystem) {
            handleLiveLog({type: "error", content: "No target selected"});
            return;
        }
        const target: NodeState = {
            id: targetId ?? 1,
            name: `player-0${targetPlayer.id}`,
            ip: targetSystem.ip,
            hostname: targetSystem.hostname,
            password: targetSystem.password,
            securityLevel: 2, // e.g., 1 to 5
            defense: 6,
            integrity: 85,
            isCompromised: true,
            isFirewallActive: true,
        };

        const gameServices: GameContextServices = {
            target, performAction, sendMail, updatePlayerStats, playerXp, systemHealth, stateConnection,
            connections, showToast
        };

        // 3. Execute attack (will fire handleLiveLog periodically)
        const result = await executeAttack(action.name, gameServices, handleLiveLog);

        // 4. Append final summary result
        const resultEntry: TerminalEntry = {
            id: Date.now().toString(),
            timestamp: new Date().toLocaleTimeString(),
            ...result
        };
        setTerminalHistory((prev) => [...prev, resultEntry]);
    };

    const clearTerminal = () => setTerminalHistory([]);

    const claimReward = (reward: number) => {
        updatePlayerStats({health: 0, xp: reward} );
        showToast({
            type: "reward",
            title: "Reward claimed",
            description: `XP ${reward} earned`,
        })
    };

    const value: GameContextType = {
        token,
        currentPlayer: player,
        profile,
        systemHealth,
        playerXp,
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
        stateConnection,
        updateSeen,
        performAction,
        updatePlayerProfile,
        claimReward,
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