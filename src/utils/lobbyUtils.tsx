import {Eye, ShieldCogCorner, Zap} from "lucide-react";

// --- SVGs & Design Assets ---
export const Icons = {
    User: () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="h-5 w-5"
    >
    <path
        strokeLinecap="round"
    strokeLinejoin="round"
    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
        />
        </svg>
),
    Attack: () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="h-12 w-12"
    >
    <path
        strokeLinecap="round"
    strokeLinejoin="round"
    d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
        />
        </svg>
    ),
    Defend: () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="h-12 w-12"
    >
    <path
        strokeLinecap="round"
    strokeLinejoin="round"
    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751A11.956 11.956 0 0112 2.714Z"
        />
        </svg>
    ),
    Spectate: () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="h-12 w-12"
    >
    <path
        strokeLinecap="round"
    strokeLinejoin="round"
    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
    />
    <path
        strokeLinecap="round"
    strokeLinejoin="round"
    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
        </svg>
    ),
}

// --- Static Role Configurations ---
export const ROLES = [
    {
        id: "attack",
        role: 'red',
        title: "Attack",
        badge: <Zap className={'text-red-400'} />,
    description: "Vanguard damage dealer. Decimate enemy lines.",
    color: "rgb(239, 68, 68)", // Red
    glowClass:
"shadow-[0_0_30px_rgba(239,68,68,0.25)] border-red-500/50 text-red-400",
    bgGradient: "from-red-950/40 to-slate-900/90",
    icon: Icons.Attack,
},
{
    id: "defend",
        role: 'blue',
    title: "Defend",
    badge: <ShieldCogCorner className={'text-blue-400'}/>,
    description: "Frontline protector. Absorb impact and hold objectives.",
        color: "rgb(6, 182, 212)", // Cyan
    glowClass:
    "shadow-[0_0_30px_rgba(6,182,212,0.25)] border-cyan-500/50 text-cyan-400",
        bgGradient: "from-cyan-950/40 to-slate-900/90",
    icon: Icons.Defend,
},
{
    id: "spectate",
        role: 'spectator',
    title: "Spectate",
    badge: <Eye className={'text-purple-400'} />,
    description: "Tactical observer. Analyze strategies from above.",
        color: "rgb(168, 85, 247)", // Purple
    glowClass:
    "shadow-[0_0_30px_rgba(168,85,247,0.25)] border-purple-500/50 text-purple-400",
        bgGradient: "from-purple-950/40 to-slate-900/90",
    icon: Icons.Spectate,
},
]