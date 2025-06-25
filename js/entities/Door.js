import { COLORS, GAME_CONFIG } from '../constants.js';

export class Door {
    constructor(x, y, width = GAME_CONFIG.DOOR_WIDTH, height = GAME_CONFIG.DOOR_HEIGHT) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw(ctx) {
        // door body
        ctx.fillStyle = COLORS.DOOR || 'rgba(139, 69, 19, 1)';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        // door knob
        ctx.fillStyle = 'rgba(255, 215, 0, 1)';
        ctx.beginPath();
        ctx.arc(this.x + this.width - 8, this.y + this.height / 2, 4, 0, Math.PI * 2);
        ctx.fill();
    }

    // getting collision bounds
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
} 