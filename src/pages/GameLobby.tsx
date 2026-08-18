import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import {useGameData} from "../hooks/useGameData.ts";
import {useToast} from "../context/ToastContext.tsx";
import type {Player} from "../utils/types.ts";
import {Icons, ROLES} from "../utils/lobbyUtils.tsx";

interface LobbyProps {
  onJoinGame: (receivedToken: string, receivedPlayer: Player) => void;
  users: string[];
  saveUser: (newUsername: string) => void;
}

export default function GameLobby( { onJoinGame, users, saveUser }: LobbyProps) {
  const [username, setUsername] = useState("")
  const [isTouched, setIsTouched] = useState(false)
  const { showToast } = useToast();

  // Initialize role from localStorage if available, otherwise default to center card ('defend')
  const [selectedIndex, setSelectedIndex] = useState(() => {
    const saved = localStorage.getItem("moba_preferred_role")
    const foundIdx = ROLES.findIndex((r) => r.id === saved)
    return foundIdx !== -1 ? foundIdx : 1
  })
  const {registerPlayer, loginPlayer} = useGameData();

  const activeRole = ROLES[selectedIndex]
  const isUsernameValid = username.trim().length >= 3
  const isFormValid = isUsernameValid && activeRole

  // Track selection mutations to local storage
  useEffect(() => {
    localStorage.setItem("moba_preferred_role", ROLES[selectedIndex].id)
  }, [selectedIndex])

  // Keyboard navigation listener (Left / Right Arrows)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.activeElement.tagName === "INPUT") return // Ignore when typing
      if (e.key === "ArrowLeft") {
        setSelectedIndex((prev) => (prev === 0 ? ROLES.length - 1 : prev - 1))
      } else if (e.key === "ArrowRight") {
        setSelectedIndex((prev) => (prev === ROLES.length - 1 ? 0 : prev + 1))
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Compute dynamic avatar color based on character hash code
  const avatarHue = useMemo(() => {
    if (!username) return 180
    let hash = 0
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash)
    }
    return Math.abs(hash % 360)
  }, [username])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isFormValid) return

    const data = { username: username.trim(), role: activeRole.role.toLowerCase() }
    try {
      let playerData;
      try {
        playerData = await registerPlayer(data);
      } catch (error: any) {
        if (error?.message?.includes("Player already exists")) {
          playerData = await loginPlayer( {username: username} );
        } else {
          throw error;
        }
      }
      if (!playerData) {
        throw new Error("Failed to retrieve player authentication data.");
      }
      // Handle successful login/registration in ONE place
      const { token, player } = playerData;
      onJoinGame(token, player);

      if (!users.includes(username)) saveUser(username);
      console.log(users);
      showToast({ type: 'join',
        title: 'PlayerJoined',
        description: `Deploying ${username} as ${player?.role.toUpperCase()} to the arena!`})
    } catch (error: any) {
      alert(error?.message || "An unexpected error occurred while deploying to the arena.");
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 p-4 font-sans text-slate-100 select-none">
      {/* Animated Ambient Background Glare */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute h-[500px] w-[500px] rounded-full blur-[160px] transition-colors duration-1000"
        style={{
          backgroundColor: activeRole.color,
          top: "35%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Cyberpunk Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] bg-[size:4rem_4rem] opacity-30" />

      {/* Main Lobby Window Container */}
      <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-slate-800/80 bg-slate-900/70 p-6 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-xl md:p-8">
        {/* Neon Border Accent Edge */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-slate-500 to-transparent opacity-40" />

        {/* Hero */}
        <div className="mb-8 text-center">
          <h1 className="bg-gradient-to-r from-slate-100 via-slate-300 to-slate-400 bg-clip-text text-2xl font-black tracking-[0.2em] text-transparent uppercase md:text-3xl">
            Match Lobby
          </h1>
          <p className="mt-1 text-xs tracking-widest text-slate-500 uppercase">
            Ready Up for Deployment
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Username / Callsign Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 pl-1 text-xs font-bold tracking-widest text-slate-400 uppercase">
              <span>Callsign Signature</span>
              <span className="text-rose-500">*</span>
            </label>

            <div className="flex items-start gap-3">
              {/* Dynamic Game Profile Pic Component */}
              <div
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-slate-700/60 font-black shadow-inner transition-all duration-500"
                style={{
                  backgroundColor: `hsl(${avatarHue}, 65%, 15%)`,
                  color: `hsl(${avatarHue}, 90%, 60%)`,
                }}
              >
                {username ? (
                  username.trim().substring(0, 2).toUpperCase()
                ) : (
                  <Icons.User />
                )}
              </div>

              <div className="flex-1">
                <div className="relative">
                  <span className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-500">
                    <Icons.User />
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onBlur={() => setIsTouched(true)}
                    placeholder="Enter operator tag..."
                    list="username-suggestions"
                    className={`w-full rounded-xl border bg-slate-950/80 py-3.5 pr-4 pl-12 text-sm text-slate-200 placeholder-slate-600 transition-all duration-300 outline-none ${
                      isTouched && !isUsernameValid
                        ? "border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.15)] focus:border-rose-500"
                        : "border-slate-800 focus:border-slate-600 focus:shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                    }`}
                  />
                  {/* Suggestion list */}
                  <datalist id="username-suggestions">
                    {users.map((name, index) => (
                        <option key={index} value={name} />
                    ))}
                  </datalist>
                </div>
                {isTouched && !isUsernameValid && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1.5 ml-1 flex items-center gap-1 text-[11px] font-medium text-rose-400"
                  >
                    ⚠️ Connection rejected: Operator tag requires minimum of 3
                    characters.
                  </motion.p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Interactive 3D Card Deck Selector */}
          <div className="space-y-4">
            <div className="flex items-baseline justify-between px-1">
              <label className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                Select Manifest Role <span className="text-rose-500">*</span>
              </label>
              <span className="hidden font-mono text-[10px] text-slate-600 sm:inline">
                NAV: [←] [→] ARROWS
              </span>
            </div>

            {/* Deck Arena Frame */}
            <div
              className="relative mt-8 flex h-72 items-center justify-center overflow-visible"
              style={{ perspective: 1000 }}
            >
              {/* Floating Dynamic Selected Indicator Badge */}
              <div className="pointer-events-none absolute top-[-30px] z-50 flex flex-col items-center">
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut",
                  }}
                  className="text-3xl drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] filter"
                >
                  {activeRole.badge}
                </motion.div>
                <motion.div
                  className="mt-1 h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: activeRole.color }}
                  animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />
              </div>

              {/* Dynamic Rendering & Card Placement Logic */}
              {ROLES.map((role, idx) => {
                const IconComponent = role.icon

                // Layout positional differences mapping (Wrap 3 items around center position)
                let positionOffset = idx - selectedIndex
                if (positionOffset === -2) positionOffset = 1
                if (positionOffset === 2) positionOffset = -1

                const isActive = positionOffset === 0

                // Motion parameters configuration dictionary
                const layoutVariants = {
                  center: {
                    x: 0,
                    scale: 1.05,
                    rotateY: 0,
                    zIndex: 30,
                    opacity: 1,
                  },
                  left: {
                    x: -140,
                    scale: 0.82,
                    rotateY: 30,
                    zIndex: 10,
                    opacity: 0.35,
                  },
                  right: {
                    x: 140,
                    scale: 0.82,
                    rotateY: -30,
                    zIndex: 10,
                    opacity: 0.35,
                  },
                }

                const currentPosition =
                  positionOffset === 0
                    ? "center"
                    : positionOffset === -1
                      ? "left"
                      : "right"

                return (
                  <motion.div
                    key={role.id}
                    initial={false}
                    animate={layoutVariants[currentPosition]}
                    transition={{ type: "spring", stiffness: 260, damping: 24 }}
                    onClick={() => setSelectedIndex(idx)}
                    className={`absolute h-64 w-48 rounded-xl border bg-gradient-to-b p-4 ${role.bgGradient} flex cursor-pointer flex-col items-center justify-between text-center transition-shadow duration-300 select-none ${
                      isActive
                        ? role.glowClass
                        : "border-slate-800/90 text-slate-500 hover:border-slate-700 hover:text-slate-400"
                    }`}
                  >
                    {/* Corner Aesthetic Framing Trim */}
                    <div className="absolute top-2 left-2 h-2 w-2 border-t border-l border-current opacity-30" />
                    <div className="absolute top-2 right-2 h-2 w-2 border-t border-r border-current opacity-30" />

                    {/* Top Content (Title) */}
                    <div className="mt-2">
                      <h3
                        className={`text-sm font-black tracking-wider uppercase transition-colors ${isActive ? "text-white" : "text-slate-400"}`}
                      >
                        {role.title}
                      </h3>
                    </div>

                    {/* Central Core Icon Wrapper */}
                    <motion.div
                      whileHover={
                        isActive ? { scale: 1.1, rotate: [0, -5, 5, 0] } : {}
                      }
                      className="my-3 text-current"
                    >
                      <IconComponent />
                    </motion.div>

                    {/* Meta Info Description */}
                    <div className="mb-2 px-1">
                      <p
                        className={`text-[10px] leading-relaxed transition-opacity duration-300 ${isActive ? "text-slate-300" : "h-0 overflow-hidden opacity-0"}`}
                      >
                        {role.description}
                      </p>
                    </div>

                    {/* Bottom Status Layout Indicator */}
                    <div
                      className={`rounded-md px-2 py-0.5 font-mono text-[9px] tracking-widest uppercase ${isActive ? "border border-slate-800 bg-slate-950/80 text-white" : "text-slate-600"}`}
                    >
                      {isActive ? "Selected" : "Deploy"}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Section 3: Primary Action Interface Control */}
          <div className="flex items-center justify-center border-t border-slate-800/60 pt-4">
            <motion.button
              type="submit"
              disabled={!isFormValid}
              whileHover={isFormValid ? { scale: 1.02 } : {}}
              whileTap={isFormValid ? { scale: 0.98 } : {}}
              className={`relative w-full overflow-hidden rounded-xl px-6 py-3.5 text-xs font-black tracking-[0.2em] uppercase transition-all duration-300 sm:w-48 ${
                isFormValid
                  ? "cursor-pointer bg-white text-slate-950 shadow-[0_0_25px_rgba(255,255,255,0.25)] hover:shadow-[0_0_35px_rgba(255,255,255,0.4)]"
                  : "cursor-not-allowed border border-slate-800/80 bg-slate-950 text-slate-600"
              }`}
            >
              {isFormValid && (
                <motion.div
                  className="absolute inset-0 h-full w-full skew-x-12 bg-gradient-to-r from-transparent via-slate-200/40 to-transparent"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{
                    repeat: Infinity,
                    duration: 2.2,
                    ease: "linear",
                  }}
                />
              )}
              <span className="relative z-10">
                {isFormValid ? "Enter Battle" : "Lobby Locked"}
              </span>
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  )
}
