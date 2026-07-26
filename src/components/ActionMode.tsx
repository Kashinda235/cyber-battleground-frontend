import blueAbility from '@/data/blue_team_abilities.json';
import redAbility from '@/data/red_team_abilities.json';
import {useState} from "react";
import {ActionCard} from "./AbilityCard.tsx";
import type {ActionRequest, ActionResult} from "../utils/types.ts";

const ATTACKS = redAbility.tools;
const DEFENCES = blueAbility.tools;

interface Action {
    id: number,
    name: string,
    effect: string,
    cooldown: number
}
interface ActionProps {
    mode : "attack" | "defend",
    performAction:  (data: ActionRequest) => Promise<ActionResult>
}
const ActionMode = ( {mode, performAction}: ActionProps) => {
    const [activeCooldowns, setActiveCooldowns] = useState<Record<string, boolean>>({});

    const TARGET = 3;
    const triggerAction = async (actionId: number, effect: string, cooldown: number) => {
        if (activeCooldowns[actionId]) return

        setActiveCooldowns((prev) => ({ ...prev, [actionId]: true }))

        const ms = cooldown * 1000;
        setTimeout(() => {
            setActiveCooldowns((prev) => ({ ...prev, [actionId]: false }))
        }, ms)

        const data = { action_type: effect, target_id: TARGET, ability_id: actionId }
        const res = await performAction(data);
    }
// console.log(ATTACKS);
    return (
        <div className="flex h-full animate-in flex-col duration-300 fade-in">
            <header className="flex h-16 shrink-0 items-center border-b border-gray-800 bg-red-950/20 px-6">
                <div className="flex w-full items-center gap-3">
                    <div className="h-8 w-2 rounded-full bg-rose-600"></div>
                    <div>
                        <p className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                            Current Target
                        </p>
                        <h2 className="text-lg leading-tight font-bold text-rose-100 drop-shadow-md">
                            Void Dragon Sovereign
                        </h2>
                    </div>
                    <div className="ml-auto text-right">
                        <p className="mb-1 font-mono text-xs text-gray-400">
                            75.0% HP
                        </p>
                        <div className="h-1.5 w-32 overflow-hidden rounded-full bg-gray-800">
                            <div className="h-full w-[75%] bg-rose-600 shadow-[0_0_10px_rgba(225,29,72,0.5)]"></div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-6">
                { (mode === 'attack') ?
                (<div className="grid grid-cols-2 gap-4">
                    {ATTACKS.map((action) => {
                        const isOnCooldown = activeCooldowns[action.id]
                        return (
                            <ActionCard key={'red' + action.id}
                                        ability={action}
                                        triggerAction={triggerAction}
                                        color={'text-red-400'}
                                        isOnCooldown={isOnCooldown}
                            />
                        )
                    })}
                </div>) : (<div className="grid grid-cols-2 gap-4">
                        {DEFENCES.map((action) => {
                            const isOnCooldown = activeCooldowns[action.id]
                            console.log('blue' + action.id);
                            return (
                                <ActionCard key={action.id}
                                            ability={action}
                                            triggerAction={triggerAction}
                                            color={'text-blue-400'}
                                            isOnCooldown={isOnCooldown}
                                />
                            )
                        })}
                    </div>)}
            </div>
        </div>
    )
}
export default ActionMode
