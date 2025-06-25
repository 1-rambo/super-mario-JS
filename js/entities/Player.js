import { GAME_CONFIG, COLORS } from '../constants.js';

export class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        this.velocityX = 0;
        this.velocityY = 0;
        this.onGround = false;
        this.direction = 1; // 1 for right, -1 for left
        this.isJumping = false;
        this.maxHealth = 3;
        this.health = this.maxHealth;
        this.invulnerable = false;
        this.invulnerableTime = 0;
    }

    // constantly update the player state
    update() {
        // apply gravity
        this.velocityY += GAME_CONFIG.GRAVITY;
        
        // apply friction
        if (this.onGround) {
            this.velocityX *= 0.8;
        }

        // update position
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        // detecting boundary
        this.x = Math.max(0, Math.min(this.x, GAME_CONFIG.CANVAS_WIDTH - this.width));
        
        // no longer detect ground here
        // if (this.y + this.height > GAME_CONFIG.CANVAS_HEIGHT - 50) {
        //     this.y = GAME_CONFIG.CANVAS_HEIGHT - 50 - this.height;
        //     this.velocityY = 0;
        // }
        
        // update invulnerable time
        if (this.invulnerable) {
            this.invulnerableTime--;
            if (this.invulnerableTime <= 0) {
                this.invulnerable = false;
            }
        }
    }

    jump() {
        if (this.onGround && !this.isJumping) {
            this.velocityY = GAME_CONFIG.JUMP_FORCE;
            this.onGround = false;
            this.isJumping = true;
            console.log('jump success, pos:', this.x, this.y, 'onground:', this.onGround, 'jumping:', this.isJumping);
        } else {
            console.log('jump failes, onground', this.onGround, 'jumping', this.isJumping);
        }
    }

    moveLeft() {
        this.velocityX = -GAME_CONFIG.PLAYER_SPEED;
        this.direction = -1;
    }

    moveRight() {
        this.velocityX = GAME_CONFIG.PLAYER_SPEED;
        this.direction = 1;
    }

    stopMoving() {
        this.velocityX = 0;
    }

    takeDamage() {
        if (!this.invulnerable) {
            this.health--;
            this.invulnerable = true;
            this.invulnerableTime = 60; // 60 frames invulnerable time
            return true;
        }
        return false;
    }

    resetPosition() {
        this.x = 50;
        this.y = GAME_CONFIG.CANVAS_HEIGHT - 100;
        this.velocityX = 0;
        this.velocityY = 0;
    }

    // draw the player
    draw(ctx) {
        // flashing effect while invulnerable
        if (this.invulnerable && Math.floor(this.invulnerableTime / 10) % 2 === 0) {
            return;
        }
        
        // draw the body
        ctx.fillStyle = COLORS.PLAYER;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // draw the eyes
        ctx.fillStyle = COLORS.PLAYER_EYES;
        ctx.fillRect(this.x + 8, this.y + 8, 4, 4);
        ctx.fillRect(this.x + 20, this.y + 8, 4, 4);
        
        // draw the hat
        ctx.fillStyle = COLORS.PLAYER_HAT;
        ctx.fillRect(this.x, this.y - 8, this.width, 8);
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