import { useState, useEffect, useCallback } from 'react';
import type {
    Player, Ability, ChatLog, GameState, MoveLog, ActionRequest,
    StateUpdateRequest, RegisterRequest, LoginRequest, PlayerProfile, Asset, Connection, System, Mail,
    MailRequest, PlayerStatsRequest, ConnectionRequest,
} from '../utils/types';
import {
    fetchPlayers, fetchChats, fetchGameState, fetchMoveLogs, fetchMyProfile, fetchMyConnections, fetchMyAsstes,
    fetchSystems, fetchInboxMails, fetchSentMails,
} from '../services/fetch_api.ts';
import {
    patchPlayerStats, postAction, postChat, postGameState, postMail, postPlayer, postUser,
    updateNetworkPort, updateSeenMail, updateSystemConfig, updateSystemDefense, postConnection, updateConnection
} from '../services/post_api.ts'
import { useWebSocket } from './useWebSocket';

export interface UseGameDataOptions {
    token?: string;
    player?: Player | null;
}

export function useGameData({ token, player }: UseGameDataOptions = {}) {
    // ==========================================
    // Local State Management
    // ==========================================
    const [players, setPlayers] = useState<Player[]>([]);
    const [systems, setSystems] = useState<System[]>([]);
    const [systemHealth, setSystemHealth] = useState<number>(0);
    const [playerXp, setPlayerXp] = useState<number>(0);
    const [abilities, setAbilities] = useState<Ability[]>([]);
    const [profile, setProfile] = useState<PlayerProfile>();
    const [chats, setChats] = useState<ChatLog[]>([]);
    const [inboxMails, setInboxMails] = useState<Mail[]>([]);
    const [sentMails, setSentMails] = useState<Mail[]>([]);
    const [assets, setAssets] = useState<Asset[]>([]);
    const [connections, setConnections] = useState<Connection[]>([]);
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [moveLogs, setMoveLogs] = useState<MoveLog[]>([]);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // ==========================================
    // Initial Data Fetching (REST API)
    // ==========================================
    const refreshData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Execute non-authenticated fetches concurrently
            const [chatsRes, stateRes, movesRes] = await Promise.all([
                fetchChats(),
                fetchGameState(),
                fetchMoveLogs(),
            ]);

            setChats(chatsRes.data.reverse());
            setGameState(stateRes.data);
            setMoveLogs(movesRes.data);

            // Fetch authenticated data if token exists[cite: 1]
            if (token) {
                const [profileRes, inboxRes, sentMailRes, playersRes, systemsRes, assetsRes, connectionsRes] = await Promise.all([
                    fetchMyProfile(token),
                    fetchInboxMails(token),
                    fetchSentMails(token),
                    fetchPlayers(token),
                    fetchSystems(token),
                    fetchMyAsstes(token),
                    fetchMyConnections(token),
                ]);

                setProfile(profileRes.data);
                setPlayerXp(profileRes.data.player.xp)
                setSystemHealth(profileRes.data.system.health);
                setInboxMails(inboxRes.data);
                setSentMails(sentMailRes.data);
                setPlayers(playersRes.data);
                setSystems(systemsRes.data);
                setAssets(assetsRes.data);
                setConnections(connectionsRes.data);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to load initial game data');
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    // Run on mount or when token changes
    useEffect(() => {
        refreshData();
    }, [refreshData]);

    // ==========================================
    // Real-Time Subscriptions (WebSocket)
    // ==========================================
    const { isConnected, connect, disconnect } = useWebSocket({
        playerId: player?.id,
        playerName: player?.username,

        // Server broadcasts a player joining the session
        onPlayerJoined: useCallback((newPlayer: Player) => {
            setPlayers((prev) => {
                // Prevent duplicates by filtering out any existing player with the same ID
                const filtered = prev.filter((p) => p.id !== newPlayer.id);
                return [newPlayer, ...filtered];
            });
        }, []),

        // Server broadcasts a player leaving/disconnecting
        onPlayerLeft: useCallback((departedPlayer: Player) => {
            setPlayers((prev) => {
                // Prevent duplicates by filtering out any existing player with the same ID
                const filtered = prev.filter((p) => p.id !== departedPlayer.id);
                return [...filtered, departedPlayer];
            });
        }, []),

        // Server broadcasts a game state update
        onGameStateUpdated: useCallback((newState: GameState) => {
            setGameState(newState);
        }, []),

        // Server broadcasts a new chat message
        onChatMessageReceived: useCallback((chatMsg: ChatLog) => {
            setChats((prev) => [...prev, chatMsg]);
        }, []),

        // Server broadcasts a combat/movement action
        onActionPerformed: useCallback((result: any) => {
            // Assuming the result payload is the moveLog generated by the server[cite: 1]
            setMoveLogs((prev) => [result, ...prev]);
        }, []),
    });

    const registerPlayer = async (data: RegisterRequest) => {
        const res = await postPlayer(data);
        return res.data;
    };

    const loginPlayer = async (data: LoginRequest) => {
        const res = await postUser(data);
        return res.data;
    };

    const updatePlayerProfile = async (data: PlayerProfile) => {
        if (!token) throw new Error('Authentication required for actions');
        const resSystem = await updateSystemConfig(data.system, token);
        const resDefense = await updateSystemDefense(data.defense, token);
        await Promise.all(
            data.network.map(port => updateNetworkPort(port.id, port, token))
        );
        return ({system: resSystem.data, defense: resDefense.data});
    }

    const performAction = async (data: ActionRequest) => {
        if (!token) throw new Error('Authentication required for actions');
        const res = await postAction(data, token);
        return res.data;
    };

    const sendChat = async (message: string) => {
        if (!token) throw new Error('Authentication required for chat');
        const res = await postChat({ message }, token);
        return res.data;
    };

    const sendMail = async (data: MailRequest) => {
        if (!token) throw new Error('Authentication required for chat');
        const res = await postMail(data, token);
        return res.data;
    }

    const stateConnection = async (data: ConnectionRequest) => {
        if (!token) throw new Error('Authentication required for chat');
        const connection = connections.find(connection => connection.targetIp === data.target_ip);
        if (!connection) {
            const res = await postConnection(data, token);
            setConnections(prevConnections => [...prevConnections, res.data]);
            return res.data;
        } else {
            const newData = {status: data.status};
            const res = await updateConnection(connection.id, newData, token);
            return res.data;
        }
    }
    const updateSeen = async (data: Mail) => {
        if (!token) throw new Error('Authentication required for chat');
        const res = await updateSeenMail({...data, isSeen: true}, token);
        setInboxMails(prevMails =>
            prevMails.map(mail =>
                mail.id === data.id ? { ...mail, isSeen: true } : mail
            )
        );
        return res.data;
    }

    const updatePlayerStats = async (data: PlayerStatsRequest) => {
        if (!token) throw new Error('Authentication required to update state');
        const incHealth = Math.min(100, Math.max(0, systemHealth + data.health));
        const incData = { health: incHealth, xp: playerXp + data.xp };
        const res = await patchPlayerStats(incData, token);
        setSystemHealth(res.data.health);
        setPlayerXp(res.data.xp);

        return res.data;
    }

    const updateGameState = async (data: StateUpdateRequest) => {
        if (!token) throw new Error('Authentication required to update state');
        const res = await postGameState(data, token);

        // Optimistically update the state locally
        setGameState(res.data);
        return res.data;
    };

    return {
        // State
        profile,
        systemHealth,
        playerXp,
        assets,
        inboxMails,
        sentMails,
        connections,
        players,
        systems,
        abilities,
        chats,
        gameState,
        moveLogs,
        isLoading,
        error,

        // Connection Info
        isWsConnected: isConnected,

        // API Actions
        refreshData,
        registerPlayer,
        loginPlayer,
        performAction,
        updatePlayerStats,
        sendChat,
        sendMail,
        stateConnection,
        updateSeen,
        updateGameState,
        updatePlayerProfile,

        // WS Manual Controls
        connectWs: connect,
        disconnectWs: disconnect,
    };
}