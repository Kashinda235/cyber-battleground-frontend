import {
    type RegisterRequest, type AuthResponse, type ActionRequest,
    type ActionResult, type ChatRequest, type ChatLog,
    type StateUpdateRequest, type GameState,
} from '../utils/types';
import { API_BASE_URL } from '../utils/constants';

// ==========================================
// Response Wrapper Interfaces
// ==========================================
// Reusing the data wrapper pattern from your GET requests

export interface AuthDataResponse {
    data: AuthResponse;
}

export interface ActionResultResponse {
    data: ActionResult;
}

export interface ChatLogResponse {
    data: ChatLog;
}

export interface GameStateResponse {
    data: GameState;
}

// ==========================================
// API Configuration & Base Helper
// ==========================================

/**
 * Generic fetch wrapper for POST/PATCH requests.
 */
async function mutateRequest<T, R>(
    endpoint: string,
    payload: T,
    token?: string,
    method: 'POST' | 'PATCH' = 'POST'
): Promise<{ data: R }> {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers,
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
    }

    const rawData: R = await response.json();
    return { data: rawData };
}

// ==========================================
// API Mutation Service Methods
// ==========================================

/**
 * POST /auth/register
 * Registers a new player and returns authentication details.
 */
export async function postPlayer(data: RegisterRequest): Promise<AuthDataResponse> {
    return mutateRequest<RegisterRequest, AuthResponse>('/auth/register', data);
}

/**
 * POST /actions
 * Performs a player action (e.g., attacking a target).
 * Requires bearer auth.
 */
export async function postAction(
    data: ActionRequest,
    token: string
): Promise<ActionResultResponse> {
    return mutateRequest<ActionRequest, ActionResult>('/actions', data, token);
}

/**
 * POST /chat
 * Posts a new chat message to the game session.
 * Requires bearer auth.
 */
export async function postChat(
    data: ChatRequest,
    token: string
): Promise<ChatLogResponse> {
    return mutateRequest<ChatRequest, ChatLog>('/chat', data, token);
}

/**
 * PATCH /state
 * Updates the current game state.
 * Note: The OpenAPI spec defines this as a PATCH request.
 * Requires bearer auth.
 */
export async function postGameState(
    data: StateUpdateRequest,
    token: string
): Promise<GameStateResponse> {
    // Using 'PATCH' here as defined in the OpenAPI documentation
    return mutateRequest<StateUpdateRequest, GameState>('/state', data, token, 'PATCH');
}