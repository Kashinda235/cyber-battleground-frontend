import blueAbility from '@/data/blue_team_abilities.json';
import redAbility from '@/data/red_team_abilities.json';
import {useState} from "react";
import {ActionCard} from "./AbilityCard.tsx";
import type {ActionRequest, ActionResult, Player} from "../../utils/types.ts";
import CardDescription from "./CardDescription.tsx";
import {Zap, Shield, ShieldCog, Tickets, Star} from "lucide-react";
import * as Icons from "lucide-react";
import {useGame} from "../../context/GameContext.tsx";

interface ActionProps {
    mode : "attack" | "defend",
}

const ATTACKS = redAbility.tools;
const DEFENCES = blueAbility.tools;

const ActionMode = ( {mode}: ActionProps) => {
    const { target, performAction } = useGame();
    const [activeCooldowns, setActiveCooldowns] = useState<Record<string, boolean>>({});
    const [viewMode, setViewMode] = useState<"list" | "details">("list");
    const [currAction, setCurrAction] = useState<number | null>( null );
    const [icon, setIcon] = useState<keyof typeof Icons>();

    const handleSelectAction = (actionId, icon) => {
        setCurrAction(actionId);
        setIcon(icon)
        setViewMode("details");
    }

    const triggerAction = async (actionId: number, effect: string, cooldown: number) => {
        if (activeCooldowns[actionId]) return

        setActiveCooldowns((prev) => ({ ...prev, [actionId]: true }))

        const ms = cooldown * 1000;
        setTimeout(() => {
            setActiveCooldowns((prev) => ({ ...prev, [actionId]: false }))
        }, ms)

        const log = `${effect} on ${target.username}`;
        const data = { action_type: log, target_id: target.id, ability_id: actionId }
        const res = await performAction(data);
    }

    if (viewMode === "details") return (
        <>
        <CardDescription
            onBack={() => {
                setViewMode("list");
                setCurrAction(null);
            }}
            currentAction={currAction}
            icon={icon}
            color={(mode === 'attack') ? 'red' : 'blue'}
        />
        </>
    )
    return (
        <div className="flex h-full animate-in flex-col duration-300 fade-in">
            <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-800 bg-gray-900/50 px-6">
                <div className="flex items-center gap-3">

                    { (mode === 'attack')
                        ? (
                            <div>
                                <div className='flex items-center gap-3'>
                                <span className="font-bold text-red-400">
                                    <Zap size={35}/>
                                </span>
                                    <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                                        Action
                                    </h1>
                                </div>
                                <p className="text-xs md:text-sm text-slate-400 mt-1">
                                    Gain control overthe network and shor skills.
                                </p>
                            </div>
                        ) : (
                            <div>
                                <div className='flex items-center gap-3'>
                                <span className="font-bold text-sky-400">
                                    <ShieldCog size={35}/>
                                </span>
                                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                                    Security
                                </h1>
                                </div>
                                <p className="text-xs md:text-sm text-slate-400 mt-1">
                                    Secure your system to pervent attackers.
                                </p>
                            </div>
                        )}


                </div>
            </header>

            <div className="flex-1 box-scroll">
                <div className="grid grid-cols-2 gap-4">
                { (mode === 'attack')
                    ? ATTACKS.map((action: any) => {
                        const isOnCooldown = activeCooldowns[action.id]
                        return (
                            <ActionCard key={'red' + action.id}
                                        ability={action}
                                        triggerAction={handleSelectAction}
                                        color={'text-red-400'}
                                        isOnCooldown={isOnCooldown}
                            />
                        )
                    })
                    : DEFENCES.map((action: any) => {
                            const isOnCooldown = activeCooldowns[action.id]
                            return (
                                <ActionCard key={action.id}
                                            ability={action}
                                            triggerAction={handleSelectAction}
                                            color={'text-sky-500'}
                                            isOnCooldown={isOnCooldown}
                                />
                            )
                        })
                }
                </div>

            </div>
        </div>
    )
}
export default ActionMode
