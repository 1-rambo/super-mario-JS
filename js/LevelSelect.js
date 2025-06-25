import { getLevelCount, getLevelConfig } from './levels.js';

export class LevelSelect {
    constructor() {
        this.currentLevel = 1;
        this.levelCount = getLevelCount();
        this.isVisible = false;
        this.container = null;
        this.createLevelSelectUI();
    }

    createLevelSelectUI() {
        // container for level select
        this.container = document.createElement('div');
        this.container.id = 'levelSelectContainer';
        this.container.className = 'level-select-container';
        this.container.style.display = 'none';

        const title = document.createElement('h2');
        title.textContent = 'Level select';
        title.className = 'level-select-title';

        const levelGrid = document.createElement('div');
        levelGrid.className = 'level-grid';

        // level buttons
        for (let i = 1; i <= this.levelCount; i++) {
            const levelConfig = getLevelConfig(i);
            const levelButton = this.createLevelButton(i, levelConfig);
            levelGrid.appendChild(levelButton);
        }

        this.container.appendChild(title);
        this.container.appendChild(levelGrid);
        //this.container.appendChild(backButton);

        document.body.appendChild(this.container);
    }

    createLevelButton(levelNumber, levelConfig) {
        const button = document.createElement('div');
        button.className = 'level-button';
        button.dataset.level = levelNumber;

        const levelNumberDiv = document.createElement('div');
        levelNumberDiv.className = 'level-number';
        levelNumberDiv.textContent = levelNumber;

        const levelNameDiv = document.createElement('div');
        levelNameDiv.className = 'level-name';
        levelNameDiv.textContent = levelConfig.name;

        const levelDescDiv = document.createElement('div');
        levelDescDiv.className = 'level-description';
        levelDescDiv.textContent = levelConfig.description;

        button.appendChild(levelNumberDiv);
        button.appendChild(levelNameDiv);
        button.appendChild(levelDescDiv);

        // click event for button
        button.addEventListener('click', () => {
            this.selectLevel(levelNumber);
        });

        return button;
    }

    selectLevel(levelNumber) {
        // handle level selection
        this.currentLevel = levelNumber;
        this.hide();
        
        const event = new CustomEvent('levelSelected', {
            detail: { levelNumber: levelNumber }
        });
        document.dispatchEvent(event);
    }

    show() {
        this.isVisible = true;
        this.container.style.display = 'flex';
    }

    hide() {
        this.isVisible = false;
        this.container.style.display = 'none';
    }

    getCurrentLevel() {
        return this.currentLevel;
    }

    isLevelSelectVisible() {
        return this.isVisible;
    }
} 