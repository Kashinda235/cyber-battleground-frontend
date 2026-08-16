export const TILE_W = 64; // Adjust to your actual values
export const TILE_H = 32;
export const ROWS = 20;
export const COLS = 20;
export const MIN_ZOOM = 0.5;
export const MAX_ZOOM = 3;
export const DRAG_THRESHOLD = 5;

export const ROLES = ["BLUE", "RED", "SPECTATOR", "ADMIN", "MODERATOR", "OFFLINE"];
export const NEON = [
    "#4de1ff", "#fb1e3f", "#a1f55d",
    "#ffd24d", "#a24dff", "#958e8e"
]
export const FLAVORS = [
    "Patrolling assigned sector without incident.",
    "Signal chatter nominal. No anomalies detected.",
    "Running background data sync.",
    "Awaiting next directive from mesh network.",
    "Cache warm. Latency within tolerance.",
    "Idle cycles routed to grid mapping.",
]

export interface PlayerProfileData {
    label: string
    color: string
    role: string
    state: string
    pos: string
    uptime: string
    integrity: number
    flavor: string
}