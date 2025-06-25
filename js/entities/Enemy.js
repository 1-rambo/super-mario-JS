import { GAME_CONFIG, ENEMY_TYPES, COLORS } from '../constants.js';

export class Enemy {
    constructor(x, y, type = ENEMY_TYPES.GOOMBA) {
        this.x = x;
        this.y = y;
        if (type === ENEMY_TYPES.GOOMBA) {
            this.width = GAME_CONFIG.GOOMBA_SIZE;
            this.height = GAME_CONFIG.GOOMBA_SIZE;
            this.velocityX = -GAME_CONFIG.GOOMBA_SPEED;
        } else if (type === ENEMY_TYPES.KOOPA) {
            this.width = GAME_CONFIG.KOOPA_SIZE;
            this.height = GAME_CONFIG.KOOPA_SIZE;
            this.velocityX = -GAME_CONFIG.KOOPA_SPEED;
        }
        this.velocityY = 0;
        this.type = type;
        this.alive = true;
        this.direction = -1;
        this.health = 1;
        this.deathAnimation = 0;
        this.deathAnimationDuration = 30;
    }

    // constantly update the enemy state
    update() {
        if (!this.alive) {
            this.deathAnimation++;
            return;
        }
        
        // apply gravity
        this.velocityY += GAME_CONFIG.GRAVITY;
        
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        // detecting boundary and turning while out-of-bounds
        if (this.x <= 0 || this.x + this.width >= GAME_CONFIG.CANVAS_WIDTH) {
            this.velocityX *= -1;
            this.direction *= -1;
        }
    }

    takeDamage() {
        this.health--;
        if (this.health <= 0) {
            this.alive = false;
            return true;
        }
        return false;
    }

    shouldRemove() {
        return !this.alive && this.deathAnimation >= this.deathAnimationDuration;
    }

    draw(ctx) {
        if (!this.alive) {
            // death animation
            const alpha = 1 - (this.deathAnimation / this.deathAnimationDuration);
            ctx.globalAlpha = alpha;
            if (this.type === ENEMY_TYPES.GOOMBA) {
                ctx.fillStyle = COLORS.ENEMY_GOOMBA;
            } else if (this.type === ENEMY_TYPES.KOOPA) {
                ctx.fillStyle = COLORS.ENEMY_KOOPA;
            }
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.globalAlpha = 1;
            return;
        }
        
        // select color
        let color;
        switch (this.type) {
            case ENEMY_TYPES.KOOPA:
                color = COLORS.ENEMY_KOOPA;
                break;
            default:
                color = COLORS.ENEMY_GOOMBA;
        }
        
        // draw the body
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // draw the eyes
        const eyeWidth = Math.max(3, this.width * 0.15);
        const eyeHeight = Math.max(3, this.height * 0.15);
        const eyeY = this.y + this.height * 0.18;
        const eyeSpacing = this.width * 0.18;
        const eyeX1 = this.x + this.width * 0.25 - eyeWidth / 2;
        const eyeX2 = this.x + this.width * 0.75 - eyeWidth / 2;
        ctx.fillStyle = COLORS.ENEMY_EYES;
        ctx.fillRect(eyeX1, eyeY, eyeWidth, eyeHeight);
        ctx.fillRect(eyeX2, eyeY, eyeWidth, eyeHeight);
        
        // add the shell texture for koopa
        if (this.type === ENEMY_TYPES.KOOPA) {
            ctx.fillStyle = 'rgba(0, 255, 4, 0.3)';
            const shellWidth = this.width * 0.7;
            const shellHeight = this.height * 0.45;
            const shellX = this.x + (this.width - shellWidth) / 2;
            const shellY = this.y + this.height * 0.5;
            ctx.fillRect(shellX, shellY, shellWidth, shellHeight);
        }
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