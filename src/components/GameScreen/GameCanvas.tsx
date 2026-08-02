import { useEffect, useRef, useState } from "react"
import type {Player, PlayerStatus} from "../../utils/types.ts"

// --- Constants ---
const COLS = 30
const ROWS = 30
const TILE_W = 56
const TILE_H = 28
const MIN_ZOOM = 0.5
const MAX_ZOOM = 3
const DRAG_THRESHOLD = 6

const NEON = ["#4de1ff", "#fb1e3f", "#a1f55d",
                    "#ffd24d", "#a24dff", "#958e8e"]
const ROLES = ["BLUE", "RED", "SPECTATOR", "ADMIN", "MODERATOR", "OFFLINE"]
const FLAVORS = [
  "Patrolling assigned sector without incident.",
  "Signal chatter nominal. No anomalies detected.",
  "Running background data sync.",
  "Awaiting next directive from mesh network.",
  "Cache warm. Latency within tolerance.",
  "Idle cycles routed to grid mapping.",
]

// --- Helper Functions ---
const rand = (a: number, b: number) => a + Math.random() * (b - a)
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))

interface PlayerProfileData {
  label: string
  color: string
  role: string
  state: string
  pos: string
  uptime: string
  integrity: number
  flavor: string
}

interface GameCanvasProps {
  players: Player[]
  currentPlayer: Player
}

export default function GameCanvas({ players, currentPlayer }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [profile, setProfile] = useState<PlayerProfileData | null>(null)

  // Use refs so the animation loop can access the latest props without re-triggering the effect
  const playersRef = useRef(players)
  const currentPlayerRef = useRef(currentPlayer)

  useEffect(() => {
    playersRef.current = players
    currentPlayerRef.current = currentPlayer
  }, [players, currentPlayer])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // --- Simulation State ---
    let W = 0,
        H = 0,
        originX = 0,
        originY = 0
    let zoom = 1
    let panX = 0
    let panY = 0
    let frameCount = 0
    let animationFrameId: number

    const toScreen = (col: number, row: number) => {
      const x = originX + (col - row) * (TILE_W / 2)
      const y = originY + (col + row) * (TILE_H / 2)
      return { x, y }
    }

    const screenToWorld = (sx: number, sy: number) => {
      return {
        x: (sx - W / 2 - panX) / zoom + W / 2,
        y: (sy - H / 2 - panY) / zoom + H / 2,
      }
    }

    // --- Initialize Grid Heights ---
    const heights: number[][] = []
    for (let r = 0; r < ROWS; r++) {
      heights.push([])
      for (let c = 0; c < COLS; c++) {
        heights[r].push(Math.random() < 0.05 ? 1 : 0)
      }
    }

    // --- PlayerEntity Class ---
    class PlayerEntity {
      player: Player
      idIndex: number
      status: PlayerStatus | undefined
      col: number
      row: number
      fromCol: number
      fromRow: number
      toCol: number
      toRow: number
      progress: number
      moveSpeed: number
      color: string
      pauseTimer: number
      size: number
      label: string
      bob: number
      role: string
      flavor: string
      integrity: number
      birthFrame: number
      worldX: number
      worldY: number

      constructor(player: Player, index: number) {
        this.player = player
        this.idIndex = index
        this.status = player.status
        this.col = Math.floor(rand(1, COLS - 1))
        this.row = Math.floor(rand(1, ROWS - 1))
        this.fromCol = this.col
        this.fromRow = this.row
        this.toCol = this.col
        this.toRow = this.row
        this.progress = 1
        this.moveSpeed = rand(0.015, 0.03)
        this.pauseTimer = rand(20, 80)
        this.size = 13

        // Safely extract a display name/id from your Player object type
        this.label = (player as any).username || (player as any).id || "PLAYER_" + String(index + 1).padStart(2, "0")

        this.bob = rand(0, Math.PI * 2)
        this.role = this.status === "online"
            ? (player as any).role.toUpperCase() || "SPECTATOR"
            : "OFFLINE"
        this.color = NEON[ROLES.indexOf(this.role)]
        this.flavor = FLAVORS[Math.floor(rand(0, FLAVORS.length))]
        this.integrity = Math.floor(rand(82, 100))
        this.birthFrame = 0
        this.worldX = 0
        this.worldY = 0
      }

      get isCurrent() {
        // Compares the entity's player object against the latest currentPlayer prop
        const current = currentPlayerRef.current
        if (!current) return false
        // Replace '.id' with whatever unique identifier your Player type uses if needed
        return (this.player as any).id === (current as any).id || this.player === current
      }

      currentHeight() {
        const h1 = heights[this.fromRow] ? heights[this.fromRow][this.fromCol] : 0
        const h2 = heights[this.toRow] ? heights[this.toRow][this.toCol] : 0
        return h1 + (h2 - h1) * this.progress
      }

      pickNextTile() {
        const dirs = [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ]
        for (let i = dirs.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[dirs[i], dirs[j]] = [dirs[j], dirs[i]]
        }
        for (const [dc, dr] of dirs) {
          const nc = this.col + dc
          const nr = this.row + dr
          if (nc >= 1 && nc < COLS - 1 && nr >= 1 && nr < ROWS - 1) {
            return { nc, nr }
          }
        }
        return null
      }

      update() {
        this.bob += 0.1
        if (this.progress < 1) {
          this.progress += this.moveSpeed
          if (this.progress >= 1) {
            this.progress = 1
            this.col = this.toCol
            this.row = this.toRow
            this.pauseTimer = rand(15, 70)
          }
        } else {
          this.pauseTimer--
          if (this.pauseTimer <= 0) {
            if (this.role === "OFFLINE") return;
            const next = this.pickNextTile()
            if (next) {
              this.fromCol = this.col
              this.fromRow = this.row
              this.toCol = next.nc
              this.toRow = next.nr
              this.progress = 0
            } else {
              this.pauseTimer = 20
            }
          }
        }
      }

      screenPos() {
        const col = this.fromCol + (this.toCol - this.fromCol) * this.progress
        const row = this.fromRow + (this.toRow - this.fromRow) * this.progress
        const p = toScreen(col, row)
        const elevate = this.currentHeight() * 18
        return { x: p.x, y: p.y + TILE_H / 2 - elevate }
      }

      draw(isSelected: boolean) {
        if (!ctx) return
        const pos = this.screenPos()
        const bobOffset = Math.sin(this.bob) * 1.5
        const s = this.size
        const x = pos.x
        const y = pos.y - s - bobOffset
        this.worldX = x
        this.worldY = y - s * 0.25

        if (isSelected) {
          ctx.save()
          const pulse = 6 + Math.sin(Date.now() / 200) * 2
          ctx.beginPath()
          ctx.ellipse(x, pos.y + TILE_H / 2, 16 + pulse, 6 + pulse * 0.4, 0, 0, Math.PI * 2)
          ctx.strokeStyle = this.color
          ctx.globalAlpha = 0.6
          ctx.lineWidth = 1.5
          ctx.stroke()
          ctx.restore()
        }

        // --- Current Player Indicator (Arrow) ---
        if (this.isCurrent) {
          ctx.save()
          const arrowBounce = Math.sin(Date.now() / 150) * 4
          const arrowY = y - s * 2.8 + arrowBounce

          ctx.beginPath()
          ctx.moveTo(x, arrowY) // bottom tip
          ctx.lineTo(x - 5, arrowY - 8) // top left
          ctx.lineTo(x + 5, arrowY - 8) // top right
          ctx.closePath()

          ctx.fillStyle = "#ffd24d" // Golden indicator
          ctx.shadowBlur = 10
          ctx.shadowColor = "#ffd24d"
          ctx.fill()
          ctx.restore()
        }

        ctx.save()
        ctx.shadowBlur = isSelected ? 20 : 12
        ctx.shadowColor = this.color

        // Top face
        ctx.beginPath()
        ctx.moveTo(x, y - s * 0.5)
        ctx.lineTo(x + s * 0.87, y - s * 0.5 + s * 0.5)
        ctx.lineTo(x, y - s * 0.5 + s)
        ctx.lineTo(x - s * 0.87, y - s * 0.5 + s * 0.5)
        ctx.closePath()
        ctx.fillStyle = this.color
        ctx.globalAlpha = 0.9
        ctx.fill()

        // Left face
        ctx.beginPath()
        ctx.moveTo(x - s * 0.87, y - s * 0.5 + s * 0.5)
        ctx.lineTo(x, y - s * 0.5 + s)
        ctx.lineTo(x, y - s * 0.5 + s + s)
        ctx.lineTo(x - s * 0.87, y - s * 0.5 + s * 0.5 + s)
        ctx.closePath()
        ctx.globalAlpha = 0.55
        ctx.fill()

        // Right face
        ctx.beginPath()
        ctx.moveTo(x + s * 0.87, y - s * 0.5 + s * 0.5)
        ctx.lineTo(x, y - s * 0.5 + s)
        ctx.lineTo(x, y - s * 0.5 + s + s)
        ctx.lineTo(x + s * 0.87, y - s * 0.5 + s * 0.5 + s)
        ctx.closePath()
        ctx.globalAlpha = 0.35
        ctx.fill()

        ctx.globalAlpha = 1
        ctx.strokeStyle = this.color
        ctx.lineWidth = isSelected ? 2 : 1
        ctx.stroke()
        ctx.restore()

        // Ground shadow
        ctx.save()
        const groundP = toScreen(
            this.fromCol + (this.toCol - this.fromCol) * this.progress,
            this.fromRow + (this.toRow - this.fromRow) * this.progress
        )
        ctx.beginPath()
        ctx.ellipse(groundP.x, groundP.y + TILE_H / 2, 10, 4, 0, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(0,0,0,0.4)"
        ctx.fill()
        ctx.restore()

        // Label
        ctx.save()
        ctx.font = this.isCurrent ? "bold 10px Courier New" : "9px Courier New"
        ctx.fillStyle = this.isCurrent ? "#ffd24d" : this.color
        ctx.globalAlpha = this.isCurrent ? 1 : 0.75
        ctx.textAlign = "center"
        ctx.shadowBlur = 4
        ctx.shadowColor = this.isCurrent ? "#ffd24d" : this.color
        ctx.fillText(this.label, x, y - s * 1.9)
        ctx.restore()
      }
    }

    // Initialize players from refs
    const canvasPlayers = playersRef.current.map((p, i) => new PlayerEntity(p, i))
    let selectedPlayer: PlayerEntity | null = null

    // --- Drawing Functions ---
    const tileColor = (c: number, r: number) =>
        (c + r) % 2 === 0 ? "#0d1a26" : "#0a141d"

    const drawTile = (col: number, row: number, elevated: boolean) => {
      const p = toScreen(col, row)
      const liftY = elevated ? -18 : 0
      const top = p.y + liftY

      ctx.beginPath()
      ctx.moveTo(p.x, top)
      ctx.lineTo(p.x + TILE_W / 2, top + TILE_H / 2)
      ctx.lineTo(p.x, top + TILE_H)
      ctx.lineTo(p.x - TILE_W / 2, top + TILE_H / 2)
      ctx.closePath()
      ctx.fillStyle = tileColor(col, row)
      ctx.fill()
      ctx.strokeStyle = "rgba(80,150,180,0.28)"
      ctx.lineWidth = 1
      ctx.stroke()

      if (elevated) {
        // Left wall
        ctx.beginPath()
        ctx.moveTo(p.x - TILE_W / 2, top + TILE_H / 2)
        ctx.lineTo(p.x, top + TILE_H)
        ctx.lineTo(p.x, top + TILE_H + 18)
        ctx.lineTo(p.x - TILE_W / 2, top + TILE_H / 2 + 18)
        ctx.closePath()
        ctx.fillStyle = "#081119"
        ctx.fill()
        ctx.stroke()

        // Right wall
        ctx.beginPath()
        ctx.moveTo(p.x + TILE_W / 2, top + TILE_H / 2)
        ctx.lineTo(p.x, top + TILE_H)
        ctx.lineTo(p.x, top + TILE_H + 18)
        ctx.lineTo(p.x + TILE_W / 2, top + TILE_H / 2 + 18)
        ctx.closePath()
        ctx.fillStyle = "#050b11"
        ctx.fill()
        ctx.stroke()
      }
    }

    const drawGridFloor = () => {
      for (let sum = 0; sum <= COLS - 1 + (ROWS - 1); sum++) {
        for (let r = 0; r < ROWS; r++) {
          const c = sum - r
          if (c < 0 || c >= COLS) continue
          drawTile(c, r, heights[r][c] === 1)
        }
      }
    }

    const drawScene = () => {
      ctx.fillStyle = "#05070d"
      ctx.fillRect(0, 0, W, H)

      ctx.save()
      ctx.translate(W / 2 + panX, H / 2 + panY)
      ctx.scale(zoom, zoom)
      ctx.translate(-W / 2, -H / 2)

      drawGridFloor()

      const sorted = [...canvasPlayers].sort((a, b) => {
        const da = (a.fromRow + a.toRow) / 2 + (a.fromCol + a.toCol) / 2
        const db = (b.fromRow + b.toRow) / 2 + (b.fromCol + b.toCol) / 2
        return da - db
      })
      sorted.forEach((p) => p.draw(p === selectedPlayer))

      ctx.restore()
    }

    // --- Interaction Logic ---
    const handleTap = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect()
      const sx = clientX - rect.left
      const sy = clientY - rect.top
      const world = screenToWorld(sx, sy)

      let closest: PlayerEntity | null = null
      let closestDist = 26

      for (const p of canvasPlayers) {
        const dx = p.worldX - world.x
        const dy = p.worldY - world.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < closestDist) {
          closestDist = dist
          closest = p
        }
      }

      selectedPlayer = closest

      if (closest) {
        const uptimeFrames = frameCount - closest.birthFrame
        const seconds = Math.floor(uptimeFrames / 60)
        const mm = String(Math.floor(seconds / 60)).padStart(2, "0")
        const ss = String(seconds % 60).padStart(2, "0")

        setProfile({
          label: closest.label,
          color: closest.color,
          role: closest.role,
          state: closest.progress < 1 ? "MOVING" : "IDLE",
          pos: `(${closest.col}, ${closest.row})`,
          uptime: `${mm}:${ss}`,
          integrity: closest.integrity,
          flavor: closest.flavor,
        })
      } else {
        setProfile(null)
      }
    }

    // --- Event Listeners ---
    let mouseDown = false
    let mouseLastX = 0,
        mouseLastY = 0,
        mouseDragDist = 0

    const onMouseDown = (e: MouseEvent) => {
      mouseDown = true
      mouseLastX = e.clientX
      mouseLastY = e.clientY
      mouseDragDist = 0
      canvas.style.cursor = "grabbing"
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!mouseDown) return
      const dx = e.clientX - mouseLastX
      const dy = e.clientY - mouseLastY
      panX += dx
      panY += dy
      mouseDragDist += Math.abs(dx) + Math.abs(dy)
      mouseLastX = e.clientX
      mouseLastY = e.clientY
    }

    const onMouseUp = (e: MouseEvent) => {
      if (!mouseDown) return
      mouseDown = false
      canvas.style.cursor = "grab"
      if (mouseDragDist < DRAG_THRESHOLD) {
        handleTap(e.clientX, e.clientY)
      }
    }

    let pinchStartDist: number | null = null
    let pinchStartZoom = 1
    let touchPanning = false
    let touchLastX = 0,
        touchLastY = 0,
        touchDragDist = 0

    const touchDist = (t0: Touch, t1: Touch) => {
      const dx = t0.clientX - t1.clientX
      const dy = t0.clientY - t1.clientY
      return Math.sqrt(dx * dx + dy * dy)
    }

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        touchPanning = false
        pinchStartDist = touchDist(e.touches[0], e.touches[1])
        pinchStartZoom = zoom
      } else if (e.touches.length === 1) {
        touchPanning = true
        touchLastX = e.touches[0].clientX
        touchLastY = e.touches[0].clientY
        touchDragDist = 0
      }
    }

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && pinchStartDist) {
        e.preventDefault()
        const d = touchDist(e.touches[0], e.touches[1])
        zoom = clamp(pinchStartZoom * (d / pinchStartDist), MIN_ZOOM, MAX_ZOOM)
      } else if (e.touches.length === 1 && touchPanning) {
        e.preventDefault()
        const t = e.touches[0]
        const dx = t.clientX - touchLastX
        const dy = t.clientY - touchLastY
        panX += dx
        panY += dy
        touchDragDist += Math.abs(dx) + Math.abs(dy)
        touchLastX = t.clientX
        touchLastY = t.clientY
      }
    }

    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) pinchStartDist = null
      if (e.touches.length === 0) {
        if (touchPanning && touchDragDist < DRAG_THRESHOLD && e.changedTouches.length === 1) {
          const t = e.changedTouches[0]
          handleTap(t.clientX, t.clientY)
        }
        touchPanning = false
      }
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const delta = -e.deltaY * 0.0015
      zoom = clamp(zoom * (1 + delta), MIN_ZOOM, MAX_ZOOM)
    }

    const onResize = () => {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
      originX = W / 2
      originY = H / 2 - (ROWS * TILE_H) / 4
    }

    // Attach Listeners
    window.addEventListener("resize", onResize)
    canvas.addEventListener("mousedown", onMouseDown)
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
    canvas.addEventListener("touchstart", onTouchStart, { passive: false })
    canvas.addEventListener("touchmove", onTouchMove, { passive: false })
    canvas.addEventListener("touchend", onTouchEnd, { passive: false })
    canvas.addEventListener("wheel", onWheel, { passive: false })

    onResize()

    // --- Main Loop ---
    const loop = () => {
      frameCount++
      canvasPlayers.forEach((p) => p.update())
      drawScene()

      // Scanline effect
      ctx.save()
      ctx.globalAlpha = 0.03
      ctx.fillStyle = "#4df3ff"
      const scanY = (frameCount * 1.5) % H
      ctx.fillRect(0, scanY, W, 2)
      ctx.restore()

      animationFrameId = requestAnimationFrame(loop)
    }
    loop()

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", onResize)
      canvas.removeEventListener("mousedown", onMouseDown)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
      canvas.removeEventListener("touchstart", onTouchStart)
      canvas.removeEventListener("touchmove", onTouchMove)
      canvas.removeEventListener("touchend", onTouchEnd)
      canvas.removeEventListener("wheel", onWheel)
    }
  }, [])

  return (
      <div className="relative flex w-full overflow-hidden border border-gray-800/50 bg-transparent font-sans text-gray-100 shadow-2xl">
        <canvas ref={canvasRef} style={{ display: "block", touchAction: "none" }} />

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
            <div
                style={{
                  position: "fixed",
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
                <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      color: profile.color,
                      fontWeight: "bold",
                      fontSize: "18px",
                    }}
                >
              <span
                  style={{
                    display: "inline-block",
                    width: "12px",
                    height: "12px",
                    backgroundColor: profile.color,
                  }}
              />
                  {profile.label}
                </div>
                <button
                    onClick={() => setProfile(null)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#fff",
                      cursor: "pointer",
                      fontSize: "16px",
                    }}
                >
                  ✕
                </button>
              </div>

              <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    fontSize: "13px",
                  }}
              >
                <div>
                  <span style={{ opacity: 0.6 }}>ROLE:</span> {profile.role}
                </div>
                <div>
                  <span style={{ opacity: 0.6 }}>STATE:</span> {profile.state}
                </div>
                <div>
                  <span style={{ opacity: 0.6 }}>POS:</span> {profile.pos}
                </div>
                <div>
                  <span style={{ opacity: 0.6 }}>UPTIME:</span> {profile.uptime}
                </div>
                <div>
                  <span style={{ opacity: 0.6 }}>INTEGRITY:</span> {profile.integrity}%
                </div>

                <div
                    style={{
                      marginTop: "10px",
                      paddingTop: "10px",
                      borderTop: "1px solid rgba(255,255,255,0.1)",
                      fontStyle: "italic",
                      opacity: 0.8,
                    }}
                >
                  "{profile.flavor}"
                </div>
              </div>
            </div>
        )}
      </div>
  )
}