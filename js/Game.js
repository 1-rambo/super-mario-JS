import { GAME_CONFIG, PLATFORM_TYPES, ENEMY_TYPES } from './constants.js';
import { Player } from './entities/Player.js';
import { Platform } from './entities/Platform.js';
import { Enemy } from './entities/Enemy.js';
import { Coin } from './entities/Coin.js';
import { GameState } from './GameState.js';
import { InputManager } from './InputManager.js';
import { Renderer } from './Renderer.js';
import { checkCollision } from './utils.js';
import { Door } from './entities/Door.js';
import { getLevelConfig, levelExists } from './levels.js';
import { LevelSelect } from './LevelSelect.js';

export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.gameState = new GameState();
        this.inputManager = new InputManager();
        this.renderer = new Renderer(canvas);
        this.levelSelect = new LevelSelect();
        
        // initialize game objects: player, platforms, enemies, coins
        this.player = null;
        this.platforms = [];
        this.enemies = [];
        this.coins = [];
        this.door = null;
        
        // current level
        this.currentLevel = 1;
        
        this.init();
    }

    init() {
        // this.createGameObjects();
        this.showLevelSelect();
        // set listener for interactions
        this.setupEventListeners();
        console.log('game initialized');
    }

    createGameObjects() {
        // load data from level config
        const levelConfig = getLevelConfig(this.currentLevel);
        if (!levelConfig) {
            console.error(`level ${this.currentLevel} config not found`);
            return;
        }

        // player
        this.player = new Player(levelConfig.playerStart.x, levelConfig.playerStart.y);
        
        // platforms
        this.platforms = levelConfig.platforms.map(platformData => 
            new Platform(
                platformData.x, 
                platformData.y, 
                platformData.width, 
                platformData.height, 
                platformData.type,
                platformData.moveRange || 0,
                platformData.moveSpeed || 0,
            )
        );
        
        // enemies
        this.enemies = levelConfig.enemies.map(enemyData => 
            new Enemy(enemyData.x, enemyData.y, enemyData.type)
        );
        
        // coins
        this.coins = levelConfig.coins.map(coinData => 
            new Coin(coinData.x, coinData.y)
        );

        // door
        this.door = new Door(
            levelConfig.doorPosition.x,
            levelConfig.doorPosition.y,
            32,
            48
        );
    }

    setupEventListeners() {
        // start/restart button
        const startBtn = document.getElementById('startBtn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                if (this.gameState.state === 'menu') {
                    this.startGame();
                } else if (this.gameState.state === 'game_over' || this.gameState.state === 'game_victory') {
                    this.restartGame();
                }
            });
        }
        const pauseBtn = document.getElementById('pauseBtn');
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => this.pauseGame());
        }
        const levelSelectBtn = document.getElementById('levelSelectBtn');
        if (levelSelectBtn) {
            levelSelectBtn.addEventListener('click', () => this.showLevelSelect());
        }
        // listen to level select event
        document.addEventListener('levelSelected', (event) => {
            const levelNumber = event.detail.levelNumber;
            this.loadLevel(levelNumber);
        });
        // canvas点击事件
        this.canvas.addEventListener('click', (e) => {
            if (this.gameState.state === 'game_victory' && this._nextLevelNumber && this.renderer.nextLevelBtnRect) {
                const rect = this.canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const btn = this.renderer.nextLevelBtnRect;
                if (x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h) {
                    this.loadLevel(this._nextLevelNumber);
                }
            }
        });
    }

    showLevelSelect() {
        this.pauseGame();
        this.levelSelect.show();
    }

    loadLevel(levelNumber) {
        this.renderer.clearNextLevelBtnRect && this.renderer.clearNextLevelBtnRect();
        this.gameState.nextLevelName = null;
        this._nextLevelNumber = null;
        if (!levelExists(levelNumber)) {
            console.error(`level ${levelNumber} not found`);
            return;
        }
        this.currentLevel = levelNumber;
        this.gameState.reset();
        this.gameState.setLevel(levelNumber);
        this.createGameObjects();
        this.updateUI();
        console.log(`loading level ${levelNumber}`);
    }

    startGame() {
        this.gameState.start();
        this.updateUI();
    }

    pauseGame() {
        this.gameState.pause();
        this.updateUI();
    }

    restartGame() {
        this.renderer.clearNextLevelBtnRect && this.renderer.clearNextLevelBtnRect();
        this.gameState.nextLevelName = null;
        this._nextLevelNumber = null;
        this.gameState.reset();
        this.createGameObjects();
        this.updateUI();
        console.log('start a new game');
    }

    updateUI() {
        const scoreElement = document.getElementById('score');
        if (scoreElement) scoreElement.textContent = this.gameState.score;
        const livesElement = document.getElementById('lives');
        if (livesElement) livesElement.textContent = this.gameState.lives;
        const levelElement = document.getElementById('level');
        if (levelElement) levelElement.textContent = this.gameState.level;

        const startBtn = document.getElementById('startBtn');
        if (startBtn) {
            startBtn.disabled = false;
            startBtn.classList.remove('start-btn', 'restart-btn');
            if (this.gameState.state === 'menu') {
                startBtn.textContent = 'Start';
                startBtn.classList.add('start-btn');
            } else if (this.gameState.state === 'game_over' || this.gameState.state === 'game_victory') {
                startBtn.textContent = 'Restart';
                startBtn.classList.add('restart-btn');
            } else {
                startBtn.disabled = true;
            }
        }
        const pauseBtn = document.getElementById('pauseBtn');
        if (pauseBtn) {
            pauseBtn.disabled = !this.gameState.isRunning;
            pauseBtn.textContent = this.gameState.isPaused ? 'Continue' : 'Pause';
        }
    }

    handleInput() {
        if (!this.gameState.shouldUpdate()) return;

        const movement = this.inputManager.getMovementInput();

        // handle left/right
        if (movement.left) {
            this.player.moveLeft();
        } else if (movement.right) {
            this.player.moveRight();
        } else {
            this.player.stopMoving();
        }

        // handle jumping
        if (this.inputManager.isJumpJustPressed()) {
            this.player.jump();
            
            // jumping from breakable platform
            this.platforms.forEach(platform => {
                if (platform.type === PLATFORM_TYPES.BREAKABLE && 
                    platform.hasBeenTouched && 
                    !platform.broken) {
                    platform.takeDamage();
                    console.log('breakable platform broken!');
                }
            });
        }

        // handle pause
        if (this.inputManager.isPausePressed()) {
            this.pauseGame();
        }
    }

    update() {
        if (!this.gameState.shouldUpdate()) return;
        this.player.update();
        this.platforms.forEach(platform => platform.update());
        this.enemies.forEach(enemy => enemy.update());
        this.coins.forEach(coin => coin.update());

        // record platform in the last frame
        if (typeof this.player.lastPlatform !== 'undefined') {
            this.player.prevPlatform = this.player.lastPlatform;
        } else {
            this.player.prevPlatform = null;
        }

        // enemy ground detection correction
        this.enemies.forEach(enemy => {
            let onAnyPlatform = false;
            const enemyBounds = enemy.getBounds();
            let standPlatform = null;
            this.platforms.forEach(platform => {
                const platformBounds = platform.getBounds();
                const isStandingOn =
                    enemyBounds.y + enemyBounds.height <= platformBounds.y + 5 &&
                    enemyBounds.y + enemyBounds.height >= platformBounds.y - 5 &&
                    (enemyBounds.x + enemyBounds.width * 0.7 > platformBounds.x) &&
                    (enemyBounds.x + enemyBounds.width * 0.3 < platformBounds.x + platformBounds.width) &&
                    enemy.velocityY >= 0;
                if (isStandingOn) {
                    onAnyPlatform = true;
                    standPlatform = platform;
                    // make enemy stand on the platform
                    enemy.y = platform.y - enemy.height;
                    enemy.velocityY = 0;
                }
            });
            // turning logic for platform edge
            if (onAnyPlatform && standPlatform) {
                let frontX = enemy.direction === 1
                    ? enemy.x + enemy.width + 1
                    : enemy.x - 1;
                let frontY = enemy.y + enemy.height + 2;
                let hasPlatformAhead = false;
                this.platforms.forEach(platform => {
                    if (
                        frontX >= platform.x &&
                        frontX <= platform.x + platform.width &&
                        frontY >= platform.y &&
                        frontY <= platform.y + platform.height &&
                        !platform.broken
                    ) {
                        hasPlatformAhead = true;
                    }
                });
                if (!hasPlatformAhead) {
                    enemy.velocityX *= -1;
                    enemy.direction *= -1;
                }
            }
        });

        // clear enemies when out of the map
        this.enemies = this.enemies.filter(enemy => enemy.y <= GAME_CONFIG.CANVAS_HEIGHT);

        this.handleCollisions();
        this.cleanupDeadObjects();
        this.checkGameOver();

        // breakable platform elapses when player leaves it
        if (
            this.player.prevPlatform &&
            this.player.prevPlatform.type === PLATFORM_TYPES.BREAKABLE &&
            !this.player.lastPlatform
        ) {
            this.player.prevPlatform.takeDamage();
            this.player.prevPlatform = null;
        }
    }

    handleCollisions() {
        // check player-plarform collisions
        let onAnyPlatform = false;
        let currentPlatform = null;
        this.platforms.forEach(platform => {
            const playerBounds = this.player.getBounds();
            const platformBounds = platform.getBounds();
            const isStandingOn =
                playerBounds.y + playerBounds.height <= platformBounds.y + 5 && 
                playerBounds.y + playerBounds.height >= platformBounds.y - 5 && 
                playerBounds.x + playerBounds.width > platformBounds.x + 5 &&
                playerBounds.x < platformBounds.x + platformBounds.width - 5 &&
                this.player.velocityY >= 0; // must be falling down or standing still
            if (isStandingOn) {
                onAnyPlatform = true;
                currentPlatform = platform;
            }
            if (checkCollision(playerBounds, platformBounds)) {
                this.handlePlayerPlatformCollision(platform);
            }
        });
        this.player.lastPlatform = currentPlatform;

        // check player-door collision
        if (this.door && this.checkPlayerDoorCollision()) {
            this.handleVictory();
        }

        // only use onAnyPlatform to decide onGround
        this.player.onGround = onAnyPlatform;
        if (this.player.onGround) {
            this.player.isJumping = false;
        }

        // check player-enemy collision
        this.enemies.forEach(enemy => {
            if (enemy.alive && checkCollision(this.player.getBounds(), enemy.getBounds())) {
                const stomped = this.handlePlayerEnemyCollision(enemy);
                if (!stomped) {
                    if (this.player.takeDamage()) {
                        this.gameState.loseLife();
                    }
                }
            }
        });

        // check player-coin collision
        this.coins.forEach(coin => {
            if (!coin.collected && checkCollision(this.player.getBounds(), coin.getBounds())) {
                const points = coin.collect();
                this.gameState.addScore(points);
            }
        });
    }

    handlePlayerPlatformCollision(platform) {
        if (this.player.velocityY > 0 && this.player.y < platform.y) {
            // collision from above
            this.player.y = platform.y - this.player.height;
            this.player.velocityY = 0;
            this.player.onGround = true;
            this.player.isJumping = false;
            
            // check if it is a breakable platform, if so, mark as touched
            if (platform.type === PLATFORM_TYPES.BREAKABLE) {
                platform.hasBeenTouched = true;
            }
            // jump platform: player jumps automatically and glows
            if (platform.type === PLATFORM_TYPES.JUMP) {
                this.player.velocityY = -20; // JUMP_FORCE = 20
                if (typeof platform.triggerGlow === 'function') {
                    platform.triggerGlow();
                }
            }
        } else if (this.player.velocityY < 0 && this.player.y > platform.y) {
            // collision from below
            this.player.y = platform.y + platform.height;
            this.player.velocityY = 0;
            // not on ground
        } else if (this.player.velocityX > 0) {
            // collision from the left side
            this.player.x = platform.x - this.player.width;
        } else if (this.player.velocityX < 0) {
            // collision from the right side
            this.player.x = platform.x + platform.width;
        }
    }

    handlePlayerEnemyCollision(enemy) {
        const playerBottom = this.player.y + this.player.height;
        const enemyTop = enemy.y;
        if (
            this.player.velocityY > 0 &&
            playerBottom > enemyTop &&
            this.player.y < enemyTop 
        ) {
            // stomp head
            enemy.takeDamage();
            this.player.velocityY = GAME_CONFIG.JUMP_FORCE / 2;
            this.gameState.addScore(100);
            return true;
        }
        return false;
    }

    cleanupDeadObjects() {
        this.enemies = this.enemies.filter(enemy => !enemy.shouldRemove());
        this.coins = this.coins.filter(coin => !coin.shouldRemove());
        this.platforms = this.platforms.filter(platform => !platform.shouldRemove());
    }

    checkGameOver() {
        // check if player is out of bounds
        if (this.player.y > GAME_CONFIG.CANVAS_HEIGHT) {
            // lose a life
            this.gameState.loseLife();
            // back to the starting point and get invulnerable effect
            const levelConfig = getLevelConfig(this.currentLevel);
            if (levelConfig && levelConfig.playerStart) {
                this.player.x = levelConfig.playerStart.x;
                this.player.y = levelConfig.playerStart.y;
            } else {
                this.player.x = 50;
                this.player.y = GAME_CONFIG.CANVAS_HEIGHT - 100;
            }
            this.player.velocityX = 0;
            this.player.velocityY = 0;
            this.player.invulnerable = true;
            this.player.invulnerableTime = 120;
        }
    }

    checkPlayerDoorCollision() {
        const playerBounds = this.player.getBounds();
        const doorBounds = this.door.getBounds();
        return checkCollision(playerBounds, doorBounds);
    }

    handleVictory() {
        const levelConfig = getLevelConfig(this.currentLevel);
        this.gameState.victory();
        this.updateUI();
        const nextLevel = this.currentLevel + 1;
        if (levelExists(nextLevel)) {
            this.gameState.nextLevelName = getLevelConfig(nextLevel).name;
            this._nextLevelNumber = nextLevel;
        } else {
            this.gameState.nextLevelName = null;
            this._nextLevelNumber = null;
        }
    }

    // the main game loop
    // currentTime: the timestamp of the current frame
    gameLoop(currentTime) {
        this.gameState.updateFPS(currentTime);
        
        this.handleInput();
        this.update();
        this.updateUI();
        this.renderer.render(
            { ...this.gameState.getGameData(), nextLevelName: this.gameState.nextLevelName },
            this.platforms,
            this.coins,
            this.enemies,
            this.player,
            this.door
        );
        
        // next loop
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    start() {
        this.gameLoop(0);
    }
} 