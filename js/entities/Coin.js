import { COLORS } from '../constants.js';

export class Coin {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 16;
        this.height = 16;
        this.collected = false;
        this.animationFrame = 0;
        this.value = 50;
        this.collectAnimation = 0;
        this.collectAnimationDuration = 20;
    }

    // constantly update the coin state
    update() {
        if (!this.collected) {
            this.animationFrame += 0.1;
        } else {
            this.collectAnimation++;
        }
    }

    collect() {
        if (!this.collected) {
            this.collected = true;
            return this.value;
        }
        return 0;
    }

    shouldRemove() {
        return this.collected && this.collectAnimation >= this.collectAnimationDuration;
    }

    draw(ctx) {
        if (this.collected) {
            // collecting animation
            const scale = 1 + (this.collectAnimation / this.collectAnimationDuration) * 0.5;
            const alpha = 1 - (this.collectAnimation / this.collectAnimationDuration);
            
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.translate(this.x + this.width/2, this.y + this.height/2);
            ctx.scale(scale, scale);
            
            ctx.fillStyle = COLORS.COIN;
            ctx.beginPath();
            ctx.arc(0, 0, this.width/2, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
            return;
        }
        
        // draw the coin body
        ctx.fillStyle = COLORS.COIN;
        ctx.beginPath();
        ctx.arc(this.x + this.width/2, this.y + this.height/2, this.width/2, 0, Math.PI * 2);
        ctx.fill();
        
        // draw the highlight effect
        ctx.fillStyle = COLORS.COIN_HIGHLIGHT;
        ctx.beginPath();
        ctx.arc(
            this.x + this.width/2 + Math.sin(this.animationFrame) * 2, 
            this.y + this.height/2, 
            3, 
            0, 
            Math.PI * 2
        );
        ctx.fill();

        // draw the "$" symbol
        ctx.fillStyle = 'rgb(184, 134, 11)';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('$', this.x + this.width/2, this.y + this.height/2);
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