import { GAME_CONFIG, COLORS, GAME_STATES } from './constants.js';

export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.setupCanvas();
    }

    setupCanvas() {
        this.canvas.width = GAME_CONFIG.CANVAS_WIDTH;
        this.canvas.height = GAME_CONFIG.CANVAS_HEIGHT;
    }

    clear() {
        this.ctx.fillStyle = COLORS.BACKGROUND;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawBackground() {
        // sky
        this.ctx.fillStyle = COLORS.BACKGROUND;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawClouds();
    }

    drawClouds() {
        this.ctx.fillStyle = COLORS.CLOUDS;

        // use arcs to depict clouds
        this.ctx.beginPath();
        this.ctx.arc(100, 80, 30, 0, Math.PI * 2);
        this.ctx.arc(130, 80, 40, 0, Math.PI * 2);
        this.ctx.arc(160, 80, 30, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.arc(600, 120, 25, 0, Math.PI * 2);
        this.ctx.arc(625, 120, 35, 0, Math.PI * 2);
        this.ctx.arc(650, 120, 25, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawGameObjects(platforms, coins, enemies, player, door) {
        // check before drawing
        if (platforms && platforms.length > 0) {
            platforms.forEach(platform => platform.draw(this.ctx));
        }
        if (coins && coins.length > 0) {
            coins.forEach(coin => coin.draw(this.ctx));
        }
        if (enemies && enemies.length > 0) {
            enemies.forEach(enemy => enemy.draw(this.ctx));
        }
        if (door) {
            door.draw(this.ctx);
        }
        if (player) {
            player.draw(this.ctx);
        }
    }

    drawDebugInfo(gameData, player) {
        if (!gameData.isRunning) return;
        
        this.ctx.fillStyle = COLORS.UI_TEXT;
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'left';
        
        const debugInfo = [
            `FPS: ${gameData.fps}`,
            `Position: (${Math.round(player.x)}, ${Math.round(player.y)})`,
            `OnGround: ${player.onGround}`,
            `Jumping: ${player.isJumping}`,
            `Lives: ${player.health}`,
            `Invulnerable: ${player.invulnerable}`
        ];
        
        debugInfo.forEach((info, index) => {
            this.ctx.fillText(info, 10, 20 + index * 15);
        });
    }

    // drawUI(gameData) {
        // // Text UI
        // this.ctx.fillStyle = COLORS.UI_TEXT;
        // this.ctx.font = '16px Arial';
        // this.ctx.textAlign = 'right';

        // this.ctx.fillText(`Score: ${gameData.score}`, this.canvas.width - 10, 25);
        // this.ctx.fillText(`Lives: ${gameData.lives}`, this.canvas.width - 10, 45);
        // this.ctx.fillText(`Level: ${gameData.level}`, this.canvas.width - 10, 65);
    // }

    drawGameOver(gameData) {
        // translucent overlay
        this.ctx.fillStyle = COLORS.UI_OVERLAY;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // GameOver text
        this.ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Gameover!', this.canvas.width / 2, this.canvas.height / 2 - 50);

        this.ctx.font = '24px Arial';
        this.ctx.fillText(`Final Score: ${gameData.score}`, this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.fillText('Press restart to play again', this.canvas.width / 2, this.canvas.height / 2 + 50);
    }

    drawPause() {
        // translucent overlay
        this.ctx.fillStyle = COLORS.UI_OVERLAY_PAUSE;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Pause text
        this.ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        this.ctx.font = '36px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Paused', this.canvas.width / 2, this.canvas.height / 2);
    }

    drawGameVictory(gameData, nextLevelName) {
        // translucent overlay
        this.ctx.fillStyle = COLORS.UI_OVERLAY_PAUSE;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        // GameVictory text
        this.ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        this.ctx.font = '36px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Victory!', this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.font = '24px Arial';
        this.ctx.fillText(`Final Score: ${gameData.score}`, this.canvas.width / 2, this.canvas.height / 2 + 50);

        const tipText = nextLevelName ? `Congratulations! Next Level：${nextLevelName}` : 'Congratulations! You completed the game!';
        this.ctx.font = '20px Arial';
        this.ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        this.ctx.fillText(tipText, this.canvas.width / 2, this.canvas.height / 2 + 100);
        // button for next level
        if (nextLevelName) {
            const btnW = 200, btnH = 48;
            const btnX = this.canvas.width / 2 - btnW / 2;
            const btnY = this.canvas.height / 2 + 130;
            
            this.ctx.fillStyle = 'rgba(76, 175, 80, 1)';
            this.ctx.fillRect(btnX, btnY, btnW, btnH);
            
            this.ctx.font = '22px Arial';
            this.ctx.fillStyle = 'rgba(255, 255, 255, 1)';
            this.ctx.fillText('Next level', this.canvas.width / 2, btnY + btnH / 2 + 8);
            
            this.nextLevelBtnRect = { x: btnX, y: btnY, w: btnW, h: btnH };
        } else {
            this.clearNextLevelBtnRect();
        }
    }

    clearNextLevelBtnRect() {
        this.nextLevelBtnRect = null;
    }

    drawMainMenu() {
        // translucent overlay
        this.ctx.fillStyle = COLORS.UI_OVERLAY;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // main menu text
        this.ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        this.ctx.font = '36px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Super mario', this.canvas.width / 2, this.canvas.height / 2 - 50);
        
        this.ctx.font = '18px Arial';
        this.ctx.fillText('Press start to play!', this.canvas.width / 2, this.canvas.height / 2);
    }

    // main render loop
    render(gameData, platforms, coins, enemies, player, door) {
        this.clear();
        this.drawBackground();
        this.drawGameObjects(platforms, coins, enemies, player, door);
        // this.drawUI(gameData);
        // this.drawDebugInfo(gameData, player);
        
        // draw according to game state
        switch (gameData.state) {
            case GAME_STATES.MENU:
                this.drawMainMenu();
                break;
            case GAME_STATES.PAUSED:
                this.drawPause();
                break;
            case GAME_STATES.GAME_OVER:
                this.drawGameOver(gameData);
                break;
            case GAME_STATES.GAME_VICTORY:
                this.drawGameVictory(gameData, gameData.nextLevelName);
                break;
        }
    }
} 