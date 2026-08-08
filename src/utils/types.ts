/**
 * Cyber Battleground API Type Definitions
 * Source: OpenAPI 3.0 Specification
 */

// ==========================================
// Enums & Union Types
// ==========================================

export type PlayerRole = 'admin' | 'moderator' | 'red' | 'blue' | 'spectator' | 'bot';
export type ConnectionStatus = 'blocked' | 'friend' | 'bot';
export type PlayerStatus = 'online' | 'offline' | 'banned';

// ==========================================
// Domain Models
// ==========================================

export interface Player {
    id?: number;
    username?: string;
    role?: PlayerRole;
    status?: PlayerStatus;
    /** ISO Date-Time string */
    joinedAt?: string;
    /** ISO Date-Time string */
    lastSeen?: string;
}

export interface Ability {
    id?: number;
    name?: string;
    description?: string;
    type?: string;
    stats?: Record<string, unknown>;
}

export interface PlayerAbility {
    playerId?: number;
    abilityId?: number;
    /** ISO Date-Time string */
    cooldownUntil?: string;
}

export interface MoveLog {
    id?: number;
    playerId?: number;
    targetId?: number;
    action?: string;
    metadata?: Record<string, unknown>;
    /** ISO Date-Time string */
    timestamp?: string;
}

export interface ChatLog {
    id?: number;
    senderId?: number;
    message?: string;
    /** ISO Date-Time string */
    timestamp?: string;
    metadata?: Record<string, unknown>;
    tags?: string[];
    /** ISO Date-Time string */
    createdAt?: string;
}

export interface System {
    id: number;
    playerId: number;
    ip: string;
    hostname: string;
    password: string;
    mail: string;
    createdAt: Date;
}

export interface Port {
    id: number;
    systemId: number;
    port: number;
    status: string;
    metadata: Record<string, unknown>;
}

export interface Network {
    network: Port[]
}

export interface Connection {
    id: number;
    systemId: number;
    targetIp: string;
    status: ConnectionStatus;
}

export interface Defense {
    id: number;
    systemId: number;
    firewallLevel: number;
    idsStatus: boolean;
    honeypotActive: boolean;
    lockdownActive: boolean;
    autoPayThreshold: number;
}

export interface Asset {
    id: number,
    systemId: number;
    name: string;
    value: number;
    size: number;
    isDecoy: boolean;
    isTrap: boolean;
}

export interface PlayerProfile {
    player: Player;
    system: System;
    defense: Defense;
    network: Network;
}

export interface GameState {
    gameStatus?: string;
    turn?: number;
    [key: string]: unknown;
}

// ==========================================
// Request Payload Interfaces
// ==========================================

export interface RegisterRequest {
    username: string;
    role?: PlayerRole | string;
}

export interface LoginRequest {
    username: string;
}

export interface StatusUpdateRequest {
    status: PlayerStatus;
}

export interface NetworkUpdateRequest {
    port: number
    status?: string
    metadata?: Record<string, unknown>
}

export interface DefenseUpdateRequest {
    firewallLevel?: number
    idsStatus?: boolean
    honeypotActive?: boolean
    lockdownActive?: boolean
    autoPayThreshold?: number
}

export interface ConnectionRequest {
    target_ip: string
    status: ConnectionStatus
}
export interface ConnectionUpdateRequest  {
    status: ConnectionStatus
}

export interface AssetRequest {
    name: string
    is_decoy: boolean
    is_trap: boolean
    value?: number | undefined
    size?: number | undefined
}

export interface AssetUpdateRequest  {
    name?: string | undefined
    value?: number | undefined
    size?: number | undefined
    is_decoy?: boolean | undefined
    is_trap?: boolean | undefined
}

export interface ActionRequest {
    action_type: string;
    target_id: number;
    ability_id: number;
}

export interface ChatRequest {
    message: string;
}

export interface StateUpdateRequest {
    gameStatus?: string;
    turn?: number;
    [key: string]: unknown;
}

// ==========================================
// Response Payload Interfaces
// ==========================================

export interface PlayerResponse {
    data: Player[]
}

export interface PlayerAbilitiesResponse {
    data: PlayerAbility[]
}

export interface AbilitiesResponse {
    data: Ability[]
}

export interface MoveLogResponse {
    data: MoveLog[]
}

export interface ChatsResponse {
    data: ChatLog[]
}

export interface GameStateResponse {
    data: GameState
}

export interface HealthCheckResponse {
    status?: string;
}

export interface AuthResponse {
    token?: string;
    player?: Player;
}

export interface ActionResult {
    success?: boolean;
    action?: string;
    damage?: number;
    cooldownRemaining?: number;
    moveLog?: MoveLog;
}

export interface DeleteResult {
    success?: boolean;
    message?: string;
}

export interface SessionResponse {
    id?: string;
    hostId?: number;
    players?: number[];
}

export interface SessionJoinResponse {
    id?: string;
    joined?: boolean;
    playerId?: number;
}

export interface ErrorResponse {
    error?: string;
}

// ==========================================
// API Query Parameter Types
// ==========================================

export interface GetMovesQueryParams {
    player_id?: number;
    limit?: number;
}

export interface GetChatQueryParams {
    limit?: number;
}

// ==========================================
// WebSocket
// ==========================================

export interface WSMessage {
    type : "player_joined" | "player_left" | 'action' | 'game_state' |'chat';
    player : any;
}