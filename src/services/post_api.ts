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
    Defense,
    Connection,
    Asset,
    Port, DefenseUpdateRequest, ConnectionRequest, ConnectionUpdateRequest, AssetUpdateRequest, AssetRequest, System,
    SystemUpdateRequest, MailRequest, Mail, PlayerStatsRequest,
} from '../utils/types';
import { API_BASE_URL } from '../utils/constants';

// Response Wrapper Interfaces

export interface AuthDataResponse {
    data: AuthResponse;
}
export interface MailResponse {
    data: Mail;
}
export interface Stats {
    id: number
    xp: number
    health: number
    lastSeen: Date
}
export interface StatsResponse {
    data: Stats
}
export interface NetworkResponse {
    data: Port;
}
export interface SystemResponse {
    data: System;
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

// API Configuration & Base Helper
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

// API Mutation Service Methods

export async function postPlayer(data: RegisterRequest): Promise<AuthDataResponse> {
    return mutateRequest<RegisterRequest, AuthResponse>('/auth/register', data);
}

export async function postUser(data: LoginRequest): Promise<AuthDataResponse> {
    return mutateRequest<LoginRequest, AuthResponse>('/auth/login', data);
}

export async function patchPlayerStats(
    data: PlayerStatsRequest,
    token: string
): Promise<StatsResponse> {
    return mutateRequest<PlayerStatsRequest, Stats>('/players/stats', data, token, 'PATCH');
}

export async function postAction(
    data: ActionRequest,
    token: string
): Promise<ActionResultResponse> {
    return mutateRequest<ActionRequest, ActionResult>('/actions', data, token);
}

export async function postChat(
    data: ChatRequest,
    token: string
): Promise<ChatLogResponse> {
    return mutateRequest<ChatRequest, ChatLog>('/chat', data, token);
}

export async function postMail(
    data: MailRequest,
    token: string
): Promise<MailResponse> {
    return mutateRequest<MailRequest, Mail>('/mail', data, token);
}

export async function updateSeenMail(
    data: Mail,
    token: string
): Promise<MailResponse> {
    return mutateRequest<MailRequest, Mail>(`/mail/${data.id}`, data, token, 'PATCH');
}

export async function updateSystemConfig(
    data: SystemUpdateRequest,
    token: string
): Promise<SystemResponse> {
    return mutateRequest<SystemUpdateRequest, System>('/system', data, token, 'PATCH');
}

export async function updateNetworkPort(
    id: number,
    data: NetworkUpdateRequest,
    token: string
): Promise<NetworkResponse> {
    // Using 'PATCH' here as defined in the OpenAPI documentation
    return mutateRequest<NetworkUpdateRequest, Port>(`/system/network/${id}`, data, token, 'PATCH');
}

export async function updateSystemDefense(
    data: Defense,
    token: string
): Promise<DefenseResponse> {
    // Using 'PATCH' here as defined in the OpenAPI documentation
    const updatePayload: DefenseUpdateRequest = {
        firewall_level: data.firewallLevel,
        ids_status: data.idsStatus,
        honeypot_active: data.honeypotActive,
        lockdown_active: data.lockdownActive,
        autopay_threshold: data.autoPayThreshold,
    };
    return mutateRequest<DefenseUpdateRequest, Defense>('/system/defense', updatePayload, token, 'PATCH');
}

export async function postConnection(
    data: ConnectionRequest,
    token: string
): Promise<ConnectionResponse> {
    return mutateRequest<ConnectionRequest, Connection>('/player/connections', data, token);
}

export async function updateConnection(
    id: number,
    data: ConnectionUpdateRequest,
    token: string
): Promise<ConnectionResponse> {
    // Using 'PATCH' here as defined in the OpenAPI documentation
    return mutateRequest<ConnectionUpdateRequest, Connection>(`/player/connections/${id}`, data, token, 'PATCH');
}

export async function postAsset(
    data: AssetRequest,
    token: string
): Promise<AssetResponse> {
    return mutateRequest<AssetRequest, Asset>('/system/assets', data, token);
}

export async function updateAsset(
    id: number,
    data: AssetUpdateRequest,
    token: string
): Promise<AssetResponse> {
    // Using 'PATCH' here as defined in the OpenAPI documentation
    return mutateRequest<AssetUpdateRequest, Asset>(`/system/assets/${id}`, data, token, 'PATCH');
}

export async function postGameState(
    data: StateUpdateRequest,
    token: string
): Promise<GameStateResponse> {
    // Using 'PATCH' here as defined in the OpenAPI documentation
    return mutateRequest<StateUpdateRequest, GameState>('/state', data, token, 'PATCH');
}