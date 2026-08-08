import { API_BASE_URL } from "../utils/constants";
import type {
    Player, ChatLog, GameState, MoveLog, GetMovesQueryParams, System, Defense, Network, PlayerProfile, Asset,
    Connection,
} from '../utils/types.ts';

// ==========================================
// Response Wrapper Interfaces
// ==========================================

export interface PlayerResponse {
    data: Player[];
}
export interface AssetResponse {
    data: Asset[];
}

export interface ConnectionsResponse {
    data: Connection[];
}

export interface PlayerProfileResponse {
    data: PlayerProfile;
}

export interface MoveLogResponse {
    data: MoveLog[];
}

export interface ChatsResponse {
    data: ChatLog[];
}

export interface GameStateResponse {
    data: GameState;
}

// ==========================================
// API Configuration & Base Helper
// ==========================================

/**
 * Generic fetch wrapper for GET requests.
 */
async function getRequest<T>(endpoint: string, token?: string): Promise<{ data: T }> {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
    }

    const rawData: T = await response.json();
    return { data: rawData };
}

// ==========================================
// API Service Methods
// ==========================================

/**
 * GET /players
 * Retrieves all registered players. (Requires bearer auth)
 */
export async function fetchPlayers(token?: string): Promise<PlayerResponse> {
    return getRequest<Player[]>('/players', token);
}

/**
 * GET /players/me
 * Retrieves my profile. (Requires bearer auth)
 */
export async function fetchMyProfile(token?: string): Promise<PlayerProfileResponse> {
    return getRequest<PlayerProfile>('/players/me', token);
}

/**
 * GET /system/assets
 * Retrieves my assets. (Requires bearer auth)
 */
export async function fetchMyAsstes(token?: string): Promise<AssetResponse> {
    return getRequest<Asset[]>('/system/assets', token);
}

/**
 * GET /player/connections
 * Retrieves my connections. (Requires bearer auth)
 */
export async function fetchMyConnections(token?: string): Promise<ConnectionsResponse> {
    return getRequest<Connection[]>('/player/connections', token);
}

/**
 * GET /chat
 * Retrieves recent chat logs with an optional limit parameter.
 */
export async function fetchChats(limit?: number): Promise<ChatsResponse> {
    const query = limit ? `?limit=${limit}` : '';
    return getRequest<ChatLog[]>(`/chat${query}`);
}

/**
 * GET /state
 * Retrieves the current game state.
 */
export async function fetchGameState(): Promise<GameStateResponse> {
    return getRequest<GameState>('/state');
}

/**
 * GET /actions
 * Retrieves move logs with optional filtering by player ID and limit.
 */
export async function fetchMoveLogs(params?: GetMovesQueryParams): Promise<MoveLogResponse> {
    const queryParams = new URLSearchParams();
    if (params?.player_id) queryParams.append('player_id', params.player_id.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return getRequest<MoveLog[]>(`/actions${queryString}`);
}

