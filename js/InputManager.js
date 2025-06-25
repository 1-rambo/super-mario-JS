export class InputManager {
    constructor() {
        // keys to save key states
        this.keys = {};
        this.justPressed = {};
        
        this.setupEventListeners();
    }

    // check keyboard events
    setupEventListeners() {
        // keyboard down
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault(); // prevent space to move
            }
            if (!this.keys[e.code]) {
                this.justPressed[e.code] = true;
            }
            this.keys[e.code] = true;
        });

        // keyboard up
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
            this.justPressed[e.code] = false;
        });
    }

    isKeyPressed(keyCode) {
        return this.keys[keyCode] || false;
    }

    // check the key changed from "released" to "pressed"
    isKeyJustPressed(keyCode) {
        if (this.justPressed[keyCode]) {
            this.justPressed[keyCode] = false;
            return true;
        }
        return false;
    }


    getMovementInput() {
        return {
            left: this.isKeyPressed('ArrowLeft') || this.isKeyPressed('KeyA'),
            right: this.isKeyPressed('ArrowRight') || this.isKeyPressed('KeyD'),
            // up: this.isKeyPressed('ArrowUp') || this.isKeyPressed('KeyW'),
            // down: this.isKeyPressed('ArrowDown') || this.isKeyPressed('KeyS')
        };
    }

    // check the exact press time
    isJumpJustPressed() {
        const result = this.isKeyJustPressed('Space');
        // console.log('Jump just pressed:', result);
        return result;
    }

    isPausePressed() {
        return this.isKeyJustPressed('KeyP');
    }

    reset() {
        this.keys = {};
        this.justPressed = {};
        this.mousePressed = false;
    }
} 