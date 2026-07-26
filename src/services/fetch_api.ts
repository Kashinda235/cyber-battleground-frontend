import { API_BASE_URL } from "../utils/constants";
import {
    type Player,
    type Ability,
    type ChatLog,
    type GameState,
    type MoveLog,
    type PlayerAbility,
    type GetMovesQueryParams,
} from '../utils/types.ts';

// ==========================================
// Response Wrapper Interfaces
// ==========================================

export interface PlayerResponse {
    data: Player[];
}

export interface PlayerAbilitiesResponse {
    data: PlayerAbility[];
}

export interface AbilitiesResponse {
    data: Ability[];
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
 * GET /abilities
 * Retrieves all available abilities in the game.
 */
export async function fetchAbilities(): Promise<AbilitiesResponse> {
    return getRequest<Ability[]>('/abilities');
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

/**
 * GET /players/{id}/abilities
 * Retrieves assigned abilities for a specific player. (Requires bearer auth)
 */
export async function fetchPlayerAbilities(
    playerId: number,
    token?: string
): Promise<PlayerAbilitiesResponse> {
    return getRequest<PlayerAbility[]>(`/players/${playerId}/abilities`, token);
}
