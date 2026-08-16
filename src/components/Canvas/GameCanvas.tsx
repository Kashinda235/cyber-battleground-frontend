import { useEffect, useRef, useState } from 'react';
import { ProfileCard } from './ProfileCard';
import {useGame} from "../../context/GameContext.tsx";
import type {PlayerProfileData} from "./constants.ts";
import {GameEngine} from "./GameEngine.ts";

export default function GameCanvas() {
    const { players, currentPlayer } = useGame();
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const engineRef = useRef<GameEngine | null>(null);
    const [profile, setProfile] = useState<PlayerProfileData | null>(null);

    // Initialize Canvas Engine once
    useEffect(() => {
        if (!canvasRef.current) return;

        // Pass canvas ref and the React state setter to the engine
        engineRef.current = new GameEngine(canvasRef.current, setProfile);

        return () => {
            engineRef.current?.cleanup();
            engineRef.current = null;
        };
    }, []);

    // Sync React State -> Canvas Engine without unmounting
    useEffect(() => {
        if (engineRef.current) {
            engineRef.current.updateData(players, currentPlayer);
        }
    }, [players, currentPlayer]);

    return (
        <div className="relative w-full h-full overflow-hidden border border-gray-800/50 bg-transparent font-sans text-gray-100 ">
            <canvas
                ref={canvasRef}
                style={{ display: "block", touchAction: "none", cursor: "grab" }}
            />

            {/* Global Status */}
            <div
                style={{
                    position: "absolute",
                    top: 20,
                    left: 20,
                    color: "#4df3ff",
                    fontFamily: "Courier New, monospace",
                    fontSize: "14px",
                }}
            >
                UNITS ACTIVE: {players.length}
            </div>

            {/* Profile Card UI */}
            {profile && (
                <ProfileCard
                    profile={profile}
                    onClose={() => setProfile(null)}
                />
            )}
        </div>
    );
}