import { GAME_STATES } from './constants.js';

export class GameState {
    constructor() {
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.state = GAME_STATES.MENU;
        this.isRunning = false;
        this.isPaused = false;
        this.gameOver = false;
        
        // FPS related
        this.lastTime = 0;
        this.frameCount = 0;
        this.fps = 0;
    }

    reset() {
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.state = GAME_STATES.MENU;
        this.isRunning = false;
        this.isPaused = false;
        this.gameOver = false;
    }

    setLevel(levelNumber) {
        this.level = levelNumber;
    }

    start() {
        this.isRunning = true;
        this.isPaused = false;
        this.gameOver = false;
        this.state = GAME_STATES.PLAYING;
        console.log('Game Start!');
    }

    pause() {
        if (this.isRunning && !this.gameOver) {
            this.isPaused = !this.isPaused;
            this.state = this.isPaused ? GAME_STATES.PAUSED : GAME_STATES.PLAYING;
            console.log('Paused state:', this.isPaused);
        }
    }

    victory() {
        this.isRunning = false;
        this.gameOver = true;
        this.state = GAME_STATES.GAME_VICTORY;
        console.log('Game Victory!');
    }

    gameOverHandler() {
        this.isRunning = false;
        this.gameOver = true;
        this.state = GAME_STATES.GAME_OVER;
    }

    addScore(points) {
        this.score += points;
    }

    loseLife() {
        this.lives--;
        if (this.lives <= 0) {
            this.gameOverHandler();
            return false;
        }
        return true;
    }

    // every frame update
    updateFPS(currentTime) {
        this.frameCount++;
        if (currentTime - this.lastTime >= 1000) {
            // 1s update once
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastTime = currentTime;
        }
    }

    // check available to update
    shouldUpdate() {
        return this.isRunning && !this.isPaused && !this.gameOver;
    }

    getGameData() {
        return {
            score: this.score,
            lives: this.lives,
            level: this.level,
            fps: this.fps,
            state: this.state
        };
    }
} 