import { PLATFORM_TYPES, ENEMY_TYPES, GAME_CONFIG } from './constants.js';

// level config
export const LEVELS = {
    1: {
        name: "Level 1",
        description: "简单的平台跳跃，熟悉基本操作",
        platforms: [
            { x: 0, y: 550, width: 150, height: 50, type: PLATFORM_TYPES.NORMAL },
            { x: 250, y: 550, width: 300, height: 50, type: PLATFORM_TYPES.NORMAL },
            { x: 650, y: 550, width: 150, height: 50, type: PLATFORM_TYPES.NORMAL },
        ],
        enemies: [
            { x: 400 - GAME_CONFIG.GOOMBA_SIZE / 2, y: 500 - GAME_CONFIG.GOOMBA_SIZE / 2, type: ENEMY_TYPES.GOOMBA },
        ],
        coins: [
            { x: 120, y: 530 },
            { x: 280, y: 530 },
            { x: 520, y: 530 },
            { x: 680, y: 530 },
        ],
        playerStart: { x: 20, y: 500 },
        doorPosition: { x: 750, y: 550 - GAME_CONFIG.DOOR_HEIGHT }
    },
    2: {
        name: "Level 2",
        description: "更多敌人和移动平台",
        platforms: [
            { x: 0, y: 550, width: 800, height: 50, type: PLATFORM_TYPES.NORMAL },
            { x: 240, y: 450, width: 100, height: 20, type: PLATFORM_TYPES.NORMAL },
            { x: 370, y: 350, width: 100, height: 20, type: PLATFORM_TYPES.MOVING, moveRange: 50, moveSpeed: 1 },
            { x: 500, y: 250, width: 100, height: 20, type: PLATFORM_TYPES.JUMP },
            { x: 240, y: 50, width: 100, height: 20, type: PLATFORM_TYPES.BREAKABLE },
            { x: 80, y: 50, width: 100, height: 20, type: PLATFORM_TYPES.NORMAL },
        ],
        enemies: [
            { x: 300, y: 500, type: ENEMY_TYPES.GOOMBA },
            { x: 500, y: 500, type: ENEMY_TYPES.KOOPA },
            { x: 700, y: 500, type: ENEMY_TYPES.GOOMBA },
            { x: 290, y: 400, type: ENEMY_TYPES.GOOMBA },
        ],
        coins: [
            { x: 290, y: 430 },
            { x: 520, y: 330 },
            { x: 750, y: 50 },
            { x: 290, y: 30 },
        ],
        playerStart: { x: 20, y: 500 },
        doorPosition: { x: 130, y: 50 - GAME_CONFIG.DOOR_HEIGHT }
    },
    3: {
        name: "Level 3",
        description: "高难度关卡，需要准确规划路线",
        platforms: [
            { x: 0, y: 550, width: 150, height: 50, type: PLATFORM_TYPES.NORMAL },   //left ground
            { x: 310, y: 550, width: 490, height: 50, type: PLATFORM_TYPES.NORMAL }, //right ground
            { x: 560, y: 390, width: 80, height: 20, type: PLATFORM_TYPES.JUMP },
            { x: 180, y: 450, width: 100, height: 20, type: PLATFORM_TYPES.BREAKABLE },
            { x: 670, y: 470, width: 80, height: 20, type: PLATFORM_TYPES.NORMAL },
            { x: 375, y: 240, width: 50, height: 20, type: PLATFORM_TYPES.MOVING, moveRange: 375, moveSpeed: 2 },
            { x: 50, y: 160, width: 80, height: 20, type: PLATFORM_TYPES.BREAKABLE },
            { x: 480, y: 160, width: 80, height: 20, type: PLATFORM_TYPES.BREAKABLE },
            { x: 140, y: 80, width: 120, height: 20, type: PLATFORM_TYPES.NORMAL },
        ],
        enemies: [
            { x: 100, y: 500, type: ENEMY_TYPES.GOOMBA },
            { x: 230, y: 400, type: ENEMY_TYPES.KOOPA },
            { x: 350, y: 500, type: ENEMY_TYPES.GOOMBA },
            { x: 450, y: 500, type: ENEMY_TYPES.KOOPA },
            { x: 550, y: 500, type: ENEMY_TYPES.GOOMBA },
            { x: 650, y: 500, type: ENEMY_TYPES.KOOPA },
            { x: 750, y: 500, type: ENEMY_TYPES.GOOMBA }
        ],
        coins: [
            { x: 230, y: 420 },
            { x: 780, y: 520 },
            { x: 780, y: 120 },
            { x: 520, y: 130 },
            { x: 230, y: 50 },
        ],
        playerStart: { x: 20, y: 500 },
        doorPosition: { x: 200 - GAME_CONFIG.DOOR_WIDTH / 2, y: 80 - GAME_CONFIG.DOOR_HEIGHT }
    },
    4: {
        name: "Level 4",
        description: "高难度关卡，需要精确跳跃",
        platforms: [
            // { x: 0, y: 550, width: 800, height: 50, type: PLATFORM_TYPES.BREAKABLE },
            { x: 350, y: 470, width: 100, height: 20, type: PLATFORM_TYPES.JUMP },
            { x: 370, y: 350, width: 60, height: 20, type: PLATFORM_TYPES.NORMAL },
            // { x: 360, y: 310, width: 80, height: 20, type: PLATFORM_TYPES.JUMP },
            // { x: 360, y: 230, width: 80, height: 20, type: PLATFORM_TYPES.NORMAL },
            { x: 350, y: 230, width: 100, height: 20, type: PLATFORM_TYPES.JUMP },
            { x: 370, y: 70, width: 60, height: 20, type: PLATFORM_TYPES.NORMAL },
        ],
        enemies: [
            { x: 400, y: 300, type: ENEMY_TYPES.GOOMBA },
            // { x: 400, y: 180, type: ENEMY_TYPES.GOOMBA }
        ],
        coins: [
            { x: 260, y: 230 },
            { x: 540, y: 230 },
            { x: 392, y: 320 },
            { x: 392, y: 200 },
            { x: 240, y: 70 },
            { x: 560, y: 70 }
        ],
        playerStart: { x: 400, y: 420 },
        doorPosition: { x: 400 - GAME_CONFIG.DOOR_WIDTH / 2, y: 70 - GAME_CONFIG.DOOR_HEIGHT }
    },
};

export function getLevelCount() {
    return Object.keys(LEVELS).length;
}

export function getLevelConfig(levelNumber) {
    return LEVELS[levelNumber];
}

// Check if a level exists
export function levelExists(levelNumber) {
    return LEVELS.hasOwnProperty(levelNumber);
} 