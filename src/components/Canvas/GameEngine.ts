import { clamp } from './utils';
import { COLS, ROWS, TILE_W, TILE_H, MIN_ZOOM, MAX_ZOOM, DRAG_THRESHOLD } from './constants';
import { PlayerEntity } from './PlayerEntity';
import type { PlayerProfileData } from './constants'; // Adjust path

export class GameEngine {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  setProfile: (p: PlayerProfileData | null) => void;

  W = 0; H = 0; originX = 0; originY = 0;
  zoom = 1; panX = 0; panY = 0; frameCount = 0;
  animationFrameId = 0;

  heights: number[][] = [];
  entities: PlayerEntity[] = [];
  currentPlayer: any = null;
  selectedPlayer: PlayerEntity | null = null;

  // Interaction State
  mouseDown = false; mouseLastX = 0; mouseLastY = 0; mouseDragDist = 0;
  touchPanning = false; touchLastX = 0; touchLastY = 0; touchDragDist = 0;
  pinchStartDist: number | null = null; pinchStartZoom = 1;

  constructor(canvas: HTMLCanvasElement, setProfile: (p: PlayerProfileData | null) => void) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.setProfile = setProfile;

    // Init Grid Heights
    for (let r = 0; r < ROWS; r++) {
      this.heights[r] = [];
      for (let c = 0; c < COLS; c++) {
        this.heights[r][c] = Math.random() < 0.05 ? 1 : 0;
      }
    }

    this.bindEvents();
    this.onResize();
    this.loop();
  }

  updateData(players: any[], currentPlayer: any) {
    this.currentPlayer = currentPlayer;
    // Map fresh data to entities
    this.entities = players.map((p, i) => new PlayerEntity(p, i));
  }

  toScreen(col: number, row: number) {
    const x = this.originX + (col - row) * (TILE_W / 2);
    const y = this.originY + (col + row) * (TILE_H / 2);
    return { x, y };
  }

  screenToWorld(sx: number, sy: number) {
    return {
      x: (sx - this.W / 2 - this.panX) / this.zoom + this.W / 2,
      y: (sy - this.H / 2 - this.panY) / this.zoom + this.H / 2,
    };
  }

  // Draw Methods
  drawTile(col: number, row: number, elevated: boolean) {
    const p = this.toScreen(col, row);
    const top = p.y + (elevated ? -18 : 0);
    const { ctx } = this;

    ctx.beginPath();
    ctx.moveTo(p.x, top); ctx.lineTo(p.x + TILE_W / 2, top + TILE_H / 2);
    ctx.lineTo(p.x, top + TILE_H); ctx.lineTo(p.x - TILE_W / 2, top + TILE_H / 2);
    ctx.closePath();
    ctx.fillStyle = (col + row) % 2 === 0 ? "#0d1a26" : "#0a141d";
    ctx.fill();
    ctx.strokeStyle = "rgba(80,150,180,0.28)"; ctx.lineWidth = 1; ctx.stroke();

    if (elevated) {
      // Left Wall
      ctx.beginPath(); ctx.moveTo(p.x - TILE_W / 2, top + TILE_H / 2); ctx.lineTo(p.x, top + TILE_H);
      ctx.lineTo(p.x, top + TILE_H + 18); ctx.lineTo(p.x - TILE_W / 2, top + TILE_H / 2 + 18);
      ctx.closePath(); ctx.fillStyle = "#081119"; ctx.fill(); ctx.stroke();
      // Right Wall
      ctx.beginPath(); ctx.moveTo(p.x + TILE_W / 2, top + TILE_H / 2); ctx.lineTo(p.x, top + TILE_H);
      ctx.lineTo(p.x, top + TILE_H + 18); ctx.lineTo(p.x + TILE_W / 2, top + TILE_H / 2 + 18);
      ctx.closePath(); ctx.fillStyle = "#050b11"; ctx.fill(); ctx.stroke();
    }
  }

  drawGridFloor() {
    for (let sum = 0; sum <= COLS - 1 + (ROWS - 1); sum++) {
      for (let r = 0; r < ROWS; r++) {
        const c = sum - r;
        if (c >= 0 && c < COLS) this.drawTile(c, r, this.heights[r][c] === 1);
      }
    }
  }

  drawScene() {
    this.ctx.fillStyle = "#05070d";
    this.ctx.fillRect(0, 0, this.W, this.H);

    this.ctx.save();
    this.ctx.translate(this.W / 2 + this.panX, this.H / 2 + this.panY);
    this.ctx.scale(this.zoom, this.zoom);
    this.ctx.translate(-this.W / 2, -this.H / 2);

    this.drawGridFloor();

    const sorted = [...this.entities].sort((a, b) => {
      const da = (a.fromRow + a.toRow) / 2 + (a.fromCol + a.toCol) / 2;
      const db = (b.fromRow + b.toRow) / 2 + (b.fromCol + b.toCol) / 2;
      return da - db;
    });
    sorted.forEach((p) => p.draw(this, p === this.selectedPlayer));

    this.ctx.restore();
  }

  loop = () => {
    this.frameCount++;
    this.entities.forEach(p => p.update());
    this.drawScene();

    // Scanline effect
    this.ctx.save();
    this.ctx.globalAlpha = 0.03;
    this.ctx.fillStyle = "#4df3ff";
    const scanY = (this.frameCount * 1.5) % this.H;
    this.ctx.fillRect(0, scanY, this.W, 2);
    this.ctx.restore();

    this.animationFrameId = requestAnimationFrame(this.loop);
  }

  handleTap(clientX: number, clientY: number) {
    const rect = this.canvas.getBoundingClientRect();
    const sx = clientX - rect.left;
    const sy = clientY - rect.top;
    const world = this.screenToWorld(sx, sy);

    let closest: PlayerEntity | null = null;
    let closestDist = 26;

    for (const p of this.entities) {
      const dist = Math.hypot(p.worldX - world.x, p.worldY - world.y);
      if (dist < closestDist) {
        closestDist = dist;
        closest = p;
      }
    }

    this.selectedPlayer = closest;

    if (closest) {
      const seconds = Math.floor((this.frameCount - closest.birthFrame) / 60);
      const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
      const ss = String(seconds % 60).padStart(2, "0");

      this.setProfile({
        label: closest.label,
        color: closest.color,
        role: closest.role,
        state: closest.progress < 1 ? "MOVING" : "IDLE",
        pos: `(${closest.col}, ${closest.row})`,
        uptime: `${mm}:${ss}`,
        integrity: closest.integrity,
        flavor: closest.flavor,
      });
    } else {
      this.setProfile(null);
    }
  }

  // --- Events ---
  onResize = () => {
    // 1. Read dimensions from the parent container instead of the window
    const parent = this.canvas.parentElement;
    this.W = this.canvas.width = parent ? parent.clientWidth : window.innerWidth;
    this.H = this.canvas.height = parent ? parent.clientHeight : 600;

    // 2. Calculate true map dimensions
    // In an isometric grid, total width and height are determined by the sum of columns and rows
    const mapPixelWidth = (ROWS + COLS) * (TILE_W / 2);
    const mapPixelHeight = (ROWS + COLS) * (TILE_H / 2);

    // 3. Center the origin point (the top-most tile at 0,0)
    // We place originX in the middle of the screen
    this.originX = this.W / 2;

    // We place originY such that the middle of the grid's height lands at the middle of the screen (this.H / 2)
    this.originY = (this.H / 2) - (mapPixelHeight / 2) + (TILE_H / 2);

    // 4. (Optional) Auto-zoom to fit the map exactly within the screen
    // If your map is larger than 600px, this ensures it zooms out enough to fit
    // with a 10% padding margin (the 0.9 multiplier).
    // You can remove these 2 lines if you want to keep the default zoom=1
    const targetZoom = Math.min(this.W / mapPixelWidth, this.H / mapPixelHeight) * 0.9;
    this.zoom = Math.max(MIN_ZOOM, Math.min(targetZoom, MAX_ZOOM));
  }

  onMouseDown = (e: MouseEvent) => { this.mouseDown = true; this.mouseLastX = e.clientX; this.mouseLastY = e.clientY; this.mouseDragDist = 0; this.canvas.style.cursor = "grabbing"; }
  onMouseMove = (e: MouseEvent) => {
    if (!this.mouseDown) return;
    this.panX += e.clientX - this.mouseLastX;
    this.panY += e.clientY - this.mouseLastY;
    this.mouseDragDist += Math.abs(e.clientX - this.mouseLastX) + Math.abs(e.clientY - this.mouseLastY);
    this.mouseLastX = e.clientX; this.mouseLastY = e.clientY;
  }
  onMouseUp = (e: MouseEvent) => {
    if (!this.mouseDown) return;
    this.mouseDown = false; this.canvas.style.cursor = "grab";
    if (this.mouseDragDist < DRAG_THRESHOLD) this.handleTap(e.clientX, e.clientY);
  }
  onWheel = (e: WheelEvent) => {
    e.preventDefault();
    this.zoom = clamp(this.zoom * (1 + (-e.deltaY * 0.0015)), MIN_ZOOM, MAX_ZOOM);
  }

  // Include Touch Events similarly to original code adapting `this.x` etc.
  // ... omitting touch math for brevity, but map directly from your original code

  bindEvents() {
    window.addEventListener("resize", this.onResize);
    this.canvas.addEventListener("mousedown", this.onMouseDown);
    window.addEventListener("mousemove", this.onMouseMove);
    window.addEventListener("mouseup", this.onMouseUp);
    this.canvas.addEventListener("wheel", this.onWheel, { passive: false });
    // Bind touch events here
  }

  cleanup() {
    cancelAnimationFrame(this.animationFrameId);
    window.removeEventListener("resize", this.onResize);
    this.canvas.removeEventListener("mousedown", this.onMouseDown);
    window.removeEventListener("mousemove", this.onMouseMove);
    window.removeEventListener("mouseup", this.onMouseUp);
    this.canvas.removeEventListener("wheel", this.onWheel);
  }
}