import type {
    RegisterRequest,
    AuthResponse,
    ActionRequest,
    ActionResult,
    ChatRequest,
    ChatLog,
    StateUpdateRequest,
    GameState,
    LoginRequest,
    NetworkUpdateRequest,
    Network,
    Defense,
    Connection,
    Asset,
    Port, DefenseUpdateRequest, ConnectionRequest, ConnectionUpdateRequest, AssetUpdateRequest, AssetRequest,
} from '../utils/types';
import { API_BASE_URL } from '../utils/constants';

// ==========================================
// Response Wrapper Interfaces
// ==========================================
// Reusing the data wrapper pattern from your GET requests

export interface AuthDataResponse {
    data: AuthResponse;
}
export interface NetworkResponse {
    data: Port;
}
export interface DefenseResponse {
    data: Defense;
}
export interface ConnectionResponse {
    data: Connection;
}
export interface AssetResponse {
    data: Asset;
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
 * POST /auth/login
 * Logins an old player and returns authentication details.
 */
export async function postUser(data: LoginRequest): Promise<AuthDataResponse> {
    return mutateRequest<LoginRequest, AuthResponse>('/auth/login', data);
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
 * PATCH /system/network/:id
 * Updates the network PORT.
 * Note: The OpenAPI spec defines this as a PATCH request.
 * Requires bearer auth.
 */
export async function updateNetworkPort(
    id: number,
    data: NetworkUpdateRequest,
    token: string
): Promise<NetworkResponse> {
    // Using 'PATCH' here as defined in the OpenAPI documentation
    return mutateRequest<NetworkUpdateRequest, Port>(`/system/network/${id}`, data, token, 'PATCH');
}

/**
 * PATCH /system/defense
 * Updates the system defenses.
 * Note: The OpenAPI spec defines this as a PATCH request.
 * Requires bearer auth.
 */
export async function updateSystemDefense(
    data: DefenseUpdateRequest,
    token: string
): Promise<DefenseResponse> {
    // Using 'PATCH' here as defined in the OpenAPI documentation
    return mutateRequest<DefenseUpdateRequest, Defense>('/system/defense', data, token, 'PATCH');
}

/**
 * POST /player/connections
 * Posts a new chat message to the game session.
 * Requires bearer auth.
 */
export async function postConnection(
    data: ConnectionRequest,
    token: string
): Promise<ConnectionResponse> {
    return mutateRequest<ConnectionRequest, Connection>('/player/connections', data, token);
}

/**
 * PATCH /player/connections/:id
 * Updates the system defenses.
 * Note: The OpenAPI spec defines this as a PATCH request.
 * Requires bearer auth.
 */
export async function updateConnection(
    id: number,
    data: ConnectionUpdateRequest,
    token: string
): Promise<ConnectionResponse> {
    // Using 'PATCH' here as defined in the OpenAPI documentation
    return mutateRequest<ConnectionUpdateRequest, Connection>(`/player/connections/${id}`, data, token, 'PATCH');
}

/**
 * POST /system/assets
 * Posts a new chat message to the game session.
 * Requires bearer auth.
 */
export async function postAsset(
    data: AssetRequest,
    token: string
): Promise<AssetResponse> {
    return mutateRequest<AssetRequest, Asset>('/system/assets', data, token);
}
/**
 * PATCH /system/assets/:id
 * Updates the system defenses.
 * Note: The OpenAPI spec defines this as a PATCH request.
 * Requires bearer auth.
 */
export async function updateAsset(
    id: number,
    data: AssetUpdateRequest,
    token: string
): Promise<AssetResponse> {
    // Using 'PATCH' here as defined in the OpenAPI documentation
    return mutateRequest<AssetUpdateRequest, Asset>(`/system/assets/${id}`, data, token, 'PATCH');
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