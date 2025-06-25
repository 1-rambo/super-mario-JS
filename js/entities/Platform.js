import { GAME_CONFIG, PLATFORM_TYPES, COLORS } from '../constants.js';

export class Platform {
    constructor(x, y, width, height, type = PLATFORM_TYPES.NORMAL, moveRange = 0, moveSpeed = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
        this.originalX = x;
        this.moveSpeed = moveSpeed;
        console.log(this.moveSpeed);
        this.moveDirection = 1;
        this.moveRange = moveRange;
        console.log(this.moveRange);    
        this.health = type === PLATFORM_TYPES.BREAKABLE ? 1 : Infinity;
        this.broken = false;
        this.hasBeenTouched = false;
        this.breakAnimation = 0;
        this.breakAnimationDuration = 30;
        this.glowTimer = 0;
    }

    // constantly update the platform state
    update() {
        if (this.broken) {
            this.breakAnimation++;
            return;
        }
        if (this.type === PLATFORM_TYPES.JUMP && this.glowTimer > 0) {
            this.glowTimer--;
        }
        if (this.type === PLATFORM_TYPES.MOVING) {
            this.x += this.moveSpeed * this.moveDirection;
            if (this.x <= this.originalX - this.moveRange || this.x >= this.originalX + this.moveRange) {
                this.moveDirection *= -1;
            }
        }
    }

    // the jump platform glows when triggered
    triggerGlow(frames = 30) {
        if (this.type === PLATFORM_TYPES.JUMP) {
            this.glowTimer = frames;
        }
    }

    // take damage for breakable platform
    takeDamage() {
        if (this.type === PLATFORM_TYPES.BREAKABLE && !this.broken) {
            this.health--;
            if (this.health <= 0) {
                this.broken = true;
                this.breakAnimation = 0;
                return true;
            }
        }
        return false;
    }

    // draw the platform
    draw(ctx) {
        if (this.broken) {
            this.drawBreakAnimation(ctx);
            return;
        }
        
        // select color
        let color;
        switch (this.type) {
            case PLATFORM_TYPES.BREAKABLE:
                color = COLORS.PLATFORM_BREAKABLE;
                break;
            case PLATFORM_TYPES.MOVING:
                color = COLORS.PLATFORM_MOVING;
                break;
            case PLATFORM_TYPES.JUMP:
                color = COLORS.PLATFORM_JUMP;
                break;
            default:
                color = COLORS.PLATFORM_NORMAL;
        }
        
        ctx.save();
        if (this.type === PLATFORM_TYPES.JUMP && this.glowTimer > 0) {
            // glow only when glowTimer>0
            ctx.shadowColor = COLORS.PLATFORM_JUMP_GLOW;
            ctx.shadowBlur = 40;
        }
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.restore();
        
        // add the texture effect
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(this.x + 5, this.y + 5, this.width - 10, 3);
        
        // add the indicator for moving platform
        if (this.type === PLATFORM_TYPES.MOVING) {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
            ctx.fillRect(this.x, this.y - 5, 5, 5);
            ctx.fillRect(this.x + this.width - 5, this.y - 5, 5, 5);
        }
        
        if (this.type === PLATFORM_TYPES.BREAKABLE) {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
            ctx.fillRect(this.x + 2, this.y + 2, this.width - 4, 2);
            ctx.fillRect(this.x + 2, this.y + this.height - 4, this.width - 4, 2);
        }
    }

    drawBreakAnimation(ctx) {
        if (this.breakAnimation >= this.breakAnimationDuration) {
            return;
        }
        
        const progress = this.breakAnimation / this.breakAnimationDuration;
        const alpha = 1 - progress;
        const scale = 1 + progress * 0.2;
        
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.scale(scale, scale);
        
        ctx.fillStyle = COLORS.PLATFORM_BREAKABLE;
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(-this.width / 2 + 5, -this.height / 2 + 5, this.width - 10, 3);
        
        ctx.restore();
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

    shouldRemove() {
        return this.broken && this.breakAnimation >= this.breakAnimationDuration;
    }

    isJumpingPlatform() {
        return this.type === PLATFORM_TYPES.JUMP;
    }
} 