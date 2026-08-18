import type { PlayerProfileData } from './constants'; // Adjust path

interface ProfileCardProps {
    profile: PlayerProfileData;
    onClose: () => void;
}

export function ProfileCard({ profile, onClose }: ProfileCardProps) {
    return (
        <div
            style={{
                position: "absolute",
                bottom: 20,
                right: 20,
                width: "300px",
                maxWidth: "calc(100vw - 40px)",
                background: "rgba(5, 11, 17, 0.85)",
                border: `1px solid ${profile.color}`,
                borderRadius: "4px",
                color: "#fff",
                fontFamily: "Courier New, monospace",
                padding: "16px",
                boxShadow: `0 0 15px ${profile.color}40`,
                backdropFilter: "blur(4px)",
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "12px",
                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                    paddingBottom: "8px",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: profile.color, fontWeight: "bold", fontSize: "18px" }}>
                    <span style={{ display: "inline-block", width: "12px", height: "12px", backgroundColor: profile.color }} />
                    {profile.label}
                </div>
                <button
                    onClick={onClose}
                    style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: "16px" }}
                >
                    ✕
                </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px" }}>
                <div><span style={{ opacity: 0.6 }}>ROLE:</span> {profile.role}</div>
                <div><span style={{ opacity: 0.6 }}>STATE:</span> {profile.state}</div>
                <div><span style={{ opacity: 0.6 }}>POS:</span> {profile.pos}</div>
                <div><span style={{ opacity: 0.6 }}>UPTIME:</span> {profile.uptime}</div>
                <div><span style={{ opacity: 0.6 }}>INTEGRITY:</span> {profile.integrity}%</div>
                <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: "1px solid rgba(255,255,255,0.1)", fontStyle: "italic", opacity: 0.8 }}>
                    "{profile.flavor}"
                </div>
            </div>
        </div>
    );
}