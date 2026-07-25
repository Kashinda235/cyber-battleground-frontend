import { useEffect, useRef, useState, useCallback } from 'react';
import type { Player, GameState, ChatLog, ActionResult } from '../utils/types';
import { WS_BASE_URL } from '../utils/constants'
// ==========================================
// WebSocket Types
// ==========================================

export type WebSocketMessageType =
    | 'welcome' | 'player_joined' | 'player_left' | 'action' | 'game_state' | 'chat';

export interface WebSocketMessage<T = unknown> {
    type: WebSocketMessageType;
    data?: T;
}

export interface UseWebSocketProps {
    playerId?: number | string;
    playerName?: string;
    autoReconnect?: boolean;
    reconnectDelay?: number;

    // Event Callbacks
    onWelcome?: () => void;
    onPlayerJoined?: (player: Player) => void;
    onPlayerLeft?: (player: Player) => void;
    onActionPerformed?: (action: ActionResult) => void;
    onGameStateUpdated?: (state: GameState) => void;
    onChatMessageReceived?: (message: ChatLog) => void;
}

export interface UseWebSocketReturn {
    isConnected: boolean;
    error: Event | null;
    disconnect: () => void;
    connect: () => void;
}

// ==========================================
// Hook Implementation
// ==========================================

export function useWebSocket({
                                 playerId,
                                 playerName,
                                 autoReconnect = true,
                                 reconnectDelay = 3000,
                                 onWelcome,
                                 onPlayerJoined,
                                 onPlayerLeft,
                                 onActionPerformed,
                                 onGameStateUpdated,
                                 onChatMessageReceived,
                             }: UseWebSocketProps): UseWebSocketReturn {
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [error, setError] = useState<Event | null>(null);

    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isIntentionalDisconnectRef = useRef<boolean>(false);

    // Keep callbacks fresh without re-triggering the effect
    const callbacksRef = useRef({
        onWelcome,
        onPlayerJoined,
        onPlayerLeft,
        onActionPerformed,
        onGameStateUpdated,
        onChatMessageReceived
    });

    useEffect(() => {
        callbacksRef.current = {
            onWelcome,
            onPlayerJoined,
            onPlayerLeft,
            onActionPerformed,
            onGameStateUpdated,
            onChatMessageReceived
        };
    }, [onWelcome, onPlayerJoined, onPlayerLeft, onActionPerformed, onGameStateUpdated, onChatMessageReceived]);

    const connect = useCallback(() => {
        // Prevent duplicate connections if already connected or connecting
        if (
            wsRef.current?.readyState === WebSocket.OPEN ||
            wsRef.current?.readyState === WebSocket.CONNECTING
        ) {
            return;
        }

        isIntentionalDisconnectRef.current = false;

        // Construct URL with query parameters if player info is provided
        const url = new URL(WS_BASE_URL);
        if (playerId && playerName) {
            url.searchParams.append('playerId', playerId.toString());
            url.searchParams.append('name', playerName);
        }

        const ws = new WebSocket(url.toString());
        wsRef.current = ws;

        ws.onopen = () => {
            setIsConnected(true);
            setError(null);
            console.log('[WS] Connected to server');
        };

        ws.onmessage = (event: MessageEvent) => {
            try {
                const parsed: WebSocketMessage = JSON.parse(event.data);
                const { current: callbacks } = callbacksRef;

                switch (parsed.type) {
                    case 'welcome':
                        callbacks.onWelcome?.();
                        break;
                    case 'player_joined':
                        callbacks.onPlayerJoined?.(parsed.data as Player);
                        break;
                    case 'player_left':
                        callbacks.onPlayerLeft?.(parsed.data as Player);
                        break;
                    case 'action':
                        callbacks.onActionPerformed?.(parsed.data as ActionResult);
                        break;
                    case 'game_state':
                        callbacks.onGameStateUpdated?.(parsed.data as GameState);
                        break;
                    case 'chat':
                        callbacks.onChatMessageReceived?.(parsed.data as ChatLog);
                        break;
                    default:
                        console.warn('[WS] Unknown message type:', parsed.type);
                }
            } catch (err) {
                console.error('[WS] Error parsing message:', err);
            }
        };

        ws.onerror = (event: Event) => {
            // Ignore error logs if we intentionally disconnected mid-connection
            if (!isIntentionalDisconnectRef.current) {
                setError(event);
                console.error('[WS] Error:', event);
            }
        };

        ws.onclose = () => {
            setIsConnected(false);
            wsRef.current = null;
            console.log('[WS] Disconnected from server');

            // Attempt reconnection if it wasn't a deliberate disconnect
            if (autoReconnect && !isIntentionalDisconnectRef.current) {
                reconnectTimeoutRef.current = setTimeout(() => {
                    console.log('[WS] Attempting to reconnect...');
                    connect();
                }, reconnectDelay);
            }
        };
    }, [playerId, playerName, autoReconnect, reconnectDelay]);

    const disconnect = useCallback(() => {
        isIntentionalDisconnectRef.current = true;

        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }

        if (wsRef.current) {
            const ws = wsRef.current;
            // Nullify event handlers first so unmount cleanup doesn't fire stale errors
            ws.onopen = null;
            ws.onmessage = null;
            ws.onerror = null;
            ws.onclose = null;

            if (
                ws.readyState === WebSocket.OPEN
            ) {
                ws.close();
            } else if (ws.readyState === WebSocket.CONNECTING) {
                // If it's still connecting, wait until it opens to close it cleanly,
                // or let onopen handle the abort to suppress console noise.
                ws.onopen = () => {
                    ws.close();
                };
            }
            wsRef.current = null;
        }
        setIsConnected(false);
    }, []);

    // Manage lifecycle
    useEffect(() => {
        connect();
        return () => {
            disconnect();
        };
    }, [connect, disconnect, playerId, playerName]);

    return {
        isConnected,
        error,
        connect,
        disconnect
    };
}
