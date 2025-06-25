// game constants
export const GAME_CONFIG = {
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 600,
    GRAVITY: 0.8,
    JUMP_FORCE: -14,
    PLAYER_SPEED: 5,
    GOOMBA_SPEED: 2,
    KOOPA_SPEED: 1.5,
    GOOMBA_SIZE: 24,
    KOOPA_SIZE: 32,
    DOOR_WIDTH: 32,
    DOOR_HEIGHT: 48
};

// game states
export const GAME_STATES = {
    MENU: 'menu',
    PLAYING: 'playing',
    PAUSED: 'paused',
    GAME_OVER: 'game_over',
    GAME_VICTORY: 'game_victory'
};

// platform types
export const PLATFORM_TYPES = {
    NORMAL: 'normal',
    MOVING: 'moving',
    BREAKABLE: 'breakable',
    JUMP: 'jump'
};

// enemy types
export const ENEMY_TYPES = {
    GOOMBA: 'goomba',
    KOOPA: 'koopa'
};

// colors
export const COLORS = {
    PLAYER: 'rgba(231, 76, 60, 1)',
    PLAYER_HAT: 'rgba(230, 126, 34, 1)',
    PLAYER_EYES: 'rgba(255, 255, 255, 1)',
    PLATFORM_NORMAL: 'rgba(34, 139, 34, 1)',
    PLATFORM_MOVING: 'rgba(155, 89, 182, 1)',
    PLATFORM_BREAKABLE: 'rgba(139, 69, 19, 1)',
    ENEMY_GOOMBA: 'rgba(139, 69, 19, 1)',
    ENEMY_KOOPA: 'rgb(197, 224, 63)',
    ENEMY_EYES: 'rgba(255, 255, 255, 1)',
    COIN: 'rgba(255, 215, 0, 1)',
    COIN_HIGHLIGHT: 'rgba(255, 255, 255, 1)',
    BACKGROUND: 'rgba(135, 206, 235, 1)',
    CLOUDS: 'rgba(255, 255, 255, 0.7)',
    UI_TEXT: 'rgba(0, 0, 0, 1)',
    UI_OVERLAY: 'rgba(0, 0, 0, 0.7)',
    UI_OVERLAY_PAUSE: 'rgba(0, 0, 0, 0.5)',
    DOOR: 'rgba(139, 69, 19, 1)',
    PLATFORM_JUMP: 'rgba(255, 215, 0, 1)',
    PLATFORM_JUMP_GLOW: 'rgba(255, 215, 0, 0.5)'
}; 