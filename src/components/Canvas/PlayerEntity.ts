import { COLS, ROWS, TILE_H, ROLES, NEON, FLAVORS } from './constants';
import { rand } from './utils';
import { GameEngine } from './GameEngine';

export class PlayerEntity {
    player: any; // Type with your Player interface
    idIndex: number;
    status: string;
    col: number; row: number;
    fromCol: number; fromRow: number;
    toCol: number; toRow: number;
    progress: number; moveSpeed: number;
    color: string; pauseTimer: number;
    size: number; label: string;
    bob: number; role: string;
    flavor: string; integrity: number;
    birthFrame: number;
    worldX: number; worldY: number;

    constructor(player: any, index: number) {
        this.player = player;
        this.idIndex = index;
        this.status = player.status;
        this.col = Math.floor(rand(1, COLS - 1));
        this.row = Math.floor(rand(1, ROWS - 1));
        this.fromCol = this.col; this.fromRow = this.row;
        this.toCol = this.col; this.toRow = this.row;
        this.progress = 1;
        this.moveSpeed = rand(0.015, 0.03);
        this.pauseTimer = rand(20, 80);
        this.size = 13;
        this.label = player.username || player.id || "PLAYER_" + String(index + 1).padStart(2, "0");
        this.bob = rand(0, Math.PI * 2);
        this.role = this.status === "online" ? (player.role?.toUpperCase() || "SPECTATOR") : "OFFLINE";
        this.color = NEON[ROLES.indexOf(this.role) >= 0 ? ROLES.indexOf(this.role) : 0];
        this.flavor = FLAVORS[Math.floor(rand(0, FLAVORS.length))];
        this.integrity = Math.floor(rand(82, 100));
        this.birthFrame = 0;
        this.worldX = 0; this.worldY = 0;
    }

    isCurrent(engine: GameEngine) {
        if (!engine.currentPlayer) return false;
        return this.player.id === engine.currentPlayer.id || this.player === engine.currentPlayer;
    }

    currentHeight(engine: GameEngine) {
        const h1 = engine.heights[this.fromRow] ? engine.heights[this.fromRow][this.fromCol] : 0;
        const h2 = engine.heights[this.toRow] ? engine.heights[this.toRow][this.toCol] : 0;
        return h1 + (h2 - h1) * this.progress;
    }

    pickNextTile() {
        const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
        for (let i = dirs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [dirs[i], dirs[j]] = [dirs[j], dirs[i]];
        }
        for (const [dc, dr] of dirs) {
            const nc = this.col + dc;
            const nr = this.row + dr;
            if (nc >= 1 && nc < COLS - 1 && nr >= 1 && nr < ROWS - 1) return { nc, nr };
        }
        return null;
    }

    update() {
        this.bob += 0.1;
        if (this.progress < 1) {
            this.progress += this.moveSpeed;
            if (this.progress >= 1) {
                this.progress = 1;
                this.col = this.toCol;
                this.row = this.toRow;
                this.pauseTimer = rand(15, 70);
            }
        } else {
            this.pauseTimer--;
            if (this.pauseTimer <= 0) {
                if (this.role === "OFFLINE") return;
                const next = this.pickNextTile();
                if (next) {
                    this.fromCol = this.col; this.fromRow = this.row;
                    this.toCol = next.nc; this.toRow = next.nr;
                    this.progress = 0;
                } else {
                    this.pauseTimer = 20;
                }
            }
        }
    }

    updatePlayerData(player: any) {
        this.player = player;
        this.status = player.status;
        this.label = player.username || player.id || this.label;

        // Recalculate role and color dynamically
        const newRole = this.status === "online"
            ? (player.role?.toUpperCase() || "SPECTATOR")
            : "OFFLINE";

        this.role = newRole;
        const roleIndex = ROLES.indexOf(this.role);
        this.color = NEON[roleIndex >= 0 ? roleIndex : ROLES.indexOf("OFFLINE")];
    }

    screenPos(engine: GameEngine) {
        const col = this.fromCol + (this.toCol - this.fromCol) * this.progress;
        const row = this.fromRow + (this.toRow - this.fromRow) * this.progress;
        const p = engine.toScreen(col, row);
        const elevate = this.currentHeight(engine) * 18;
        return { x: p.x, y: p.y + TILE_H / 2 - elevate };
    }

    draw(engine: GameEngine, isSelected: boolean) {
        const { ctx } = engine;
        const pos = this.screenPos(engine);
        const bobOffset = Math.sin(this.bob) * 1.5;
        const s = this.size;
        const x = pos.x;
        const y = pos.y - s - bobOffset;
        this.worldX = x;
        this.worldY = y - s * 0.25;

        // Pulse selection
        if (isSelected) {
            ctx.save();
            const pulse = 6 + Math.sin(Date.now() / 200) * 2;
            ctx.beginPath();
            ctx.ellipse(x, pos.y + TILE_H / 2, 16 + pulse, 6 + pulse * 0.4, 0, 0, Math.PI * 2);
            ctx.strokeStyle = this.color;
            ctx.globalAlpha = 0.6;
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.restore();
        }

        // Current player arrow
        const isCur = this.isCurrent(engine);
        if (isCur) {
            ctx.save();
            const arrowBounce = Math.sin(Date.now() / 150) * 4;
            const arrowY = y - s * 2.8 + arrowBounce;
            ctx.beginPath();
            ctx.moveTo(x, arrowY);
            ctx.lineTo(x - 5, arrowY - 8);
            ctx.lineTo(x + 5, arrowY - 8);
            ctx.closePath();
            ctx.fillStyle = "#ffd24d";
            ctx.shadowBlur = 10;
            ctx.shadowColor = "#ffd24d";
            ctx.fill();
            ctx.restore();
        }

        // Draw Isometric Cube
        ctx.save();
        ctx.shadowBlur = isSelected ? 20 : 12;
        ctx.shadowColor = this.color;

        // Top
        ctx.beginPath(); ctx.moveTo(x, y - s * 0.5); ctx.lineTo(x + s * 0.87, y); ctx.lineTo(x, y + s * 0.5); ctx.lineTo(x - s * 0.87, y); ctx.closePath();
        ctx.fillStyle = this.color; ctx.globalAlpha = 0.9; ctx.fill();
        // Left
        ctx.beginPath(); ctx.moveTo(x - s * 0.87, y); ctx.lineTo(x, y + s * 0.5); ctx.lineTo(x, y + s * 1.5); ctx.lineTo(x - s * 0.87, y + s); ctx.closePath();
        ctx.globalAlpha = 0.55; ctx.fill();
        // Right
        ctx.beginPath(); ctx.moveTo(x + s * 0.87, y); ctx.lineTo(x, y + s * 0.5); ctx.lineTo(x, y + s * 1.5); ctx.lineTo(x + s * 0.87, y + s); ctx.closePath();
        ctx.globalAlpha = 0.35; ctx.fill();

        ctx.globalAlpha = 1; ctx.strokeStyle = this.color; ctx.lineWidth = isSelected ? 2 : 1; ctx.stroke();
        ctx.restore();

        // Ground Shadow
        ctx.save();
        const groundP = engine.toScreen(
            this.fromCol + (this.toCol - this.fromCol) * this.progress,
            this.fromRow + (this.toRow - this.fromRow) * this.progress
        );
        ctx.beginPath(); ctx.ellipse(groundP.x, groundP.y + TILE_H / 2, 10, 4, 0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,0,0,0.4)"; ctx.fill();
        ctx.restore();

        // Label
        ctx.save();
        ctx.font = isCur ? "bold 10px Courier New" : "9px Courier New";
        ctx.fillStyle = isCur ? "#ffd24d" : this.color;
        ctx.globalAlpha = isCur ? 1 : 0.75;
        ctx.textAlign = "center";
        ctx.shadowBlur = 4;
        ctx.shadowColor = isCur ? "#ffd24d" : this.color;
        ctx.fillText(this.label, x, y - s * 1.9);
        ctx.restore();
    }
}