import * as Icons from 'lucide-react';

interface AbilityIconProps {
    name: keyof typeof Icons; // Ensures 'name' must be a valid Lucide icon name
    color?: string;
    size?: number;
}

interface ActionCardProps {
    ability: any,
    whenClicked: (actionId: any, icon: any) => void,
    color: string,
    isOnCooldown: boolean
}
export function AbilityIcon({ name, color = "currentColor", size = 20 }: AbilityIconProps) {
    // Grab the icon component dynamically from Lucide using the string key
    const IconComponent = Icons[name];

    // Fallback to a default icon (like HelpCircle) if the name is mistyped
    if (!IconComponent) {
        const Fallback = Icons.HelpCircle;
        return <Fallback size={size} color="gray" />;
    }

    return <IconComponent size={size} color={color} />;
}

export function ActionCard({ ability, whenClicked, color, isOnCooldown}: ActionCardProps) {
    const action = {
        id: ability.id,
        effect: ability.effect,
        title: ability.name,
        color: color,
        cooldown: ability.cooldown,
        icon: ability.icon,
    }

    return (
        <button
            onClick={() => whenClicked(action.id, action.icon)}
            disabled={isOnCooldown}
            className={`group flex pop-up items-center gap-4 rounded-xl border border-gray-800 bg-gray-900 p-4 text-left transition-all ${isOnCooldown ? "cursor-not-allowed opacity-70" : "hover:border-gray-600 hover:bg-gray-800/80 active:scale-95"}`}
        >
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center">
                <svg
                    className="absolute inset-0 h-full w-full text-gray-800"
                    viewBox="0 0 36 36"
                >
                    <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                    />
                </svg>
                {isOnCooldown && (
                    <svg
                        className="absolute inset-0 z-0 h-full w-full -rotate-90 text-white/50"
                        viewBox="0 0 36 36"
                    >
                        <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeDasharray="100, 100"
                            style={{
                                animation: `cooldown-spin ${action.cooldown}s linear forwards`,
                            }}
                        />
                    </svg>
                )}
                <div
                    className={`relative z-10 transition-transform ${!isOnCooldown && "group-hover:scale-110"} ${action.color}`}
                >
                    <AbilityIcon name={action.icon} size={24} />
                </div>
            </div>
            <div className="flex-1">
                <h3
                    className={`font-bold transition-colors ${isOnCooldown ? "text-gray-500" : "text-gray-200 group-hover:text-white"}`}
                >
                    {action.title}
                </h3>
                <div className="mt-1 flex items-center gap-1.5">
                    <div
                        className={`h-1.5 w-1.5 rounded-full ${isOnCooldown ? "animate-pulse bg-rose-500" : "bg-emerald-500"}`}
                    ></div>
                    <span className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
                              {isOnCooldown
                                  ? "On Cooldown"
                                  : `Ready (${action.cooldown})`}
                            </span>
                </div>
            </div>
        </button>
    );
}

