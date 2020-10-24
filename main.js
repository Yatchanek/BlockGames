const TETRIS = 4;
const PENTRIS = 5;
const gameWindow = document.querySelector('.game-window');
const ctx = gameWindow.getContext('2d');
let mouseX;
let mouseY;
let resCount = 0;

const blocks = new Image();
const blocks2 = new Image();
const blocks3 = new Image();
const title = new Image();
const cursor = new Image();
const startButton = new Image();
const textSheet = new Image();

const game = new Game();

blocks.src = './res/blocks.png';
blocks.onload = assetLoader();
title.src = './res/title.png';
title.onload = assetLoader();
cursor.src = './res/cursor.png';
cursor.onload = assetLoader();
textSheet.src = './res/textsheet.png';
textSheet.onload = assetLoader();
const sWidth = window.screen.width;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function assetLoader() {
    resCount++;
    if (resCount === 4) {
     gameWindow.width = window.innerWidth;
     gameWindow.height = window.innerHeight;
     game.scale = Math.min(this.wWidth / 1920, this.wHeight / 937);

     requestAnimationFrame(game.loop);
    }
}

function random(range) {
    return Math.floor(Math.random() * range);
}

window.addEventListener('keydown', (e) => { 

    if(game.gameState === 'enteringName') {
        if(e.key === 'Backspace' && game.enteredName.length) {
            let g = game.enteredName.split('');
            g.pop();
            game.enteredName = g.join('');
            game.findLongestNameAndScore();
        } else if (e.keyCode >= 65 && e.keyCode <= 90 && game.enteredName.length < 20) {
            game.enteredName = game.enteredName.concat(e.key);
        } else if (e.key === ' ' && game.enteredName.length < 20) {
            game.enteredName = game.enteredName.concat(' ');
        }
        else if (e.key === 'Enter') {
            game.saveScores();
            game.nextState = 'hallOfFame'
        }
    } else {
        game.keys[e.key] = true;
    }
});

window.addEventListener('keyup', (e) => {
  game.keyHold = false
});

window.addEventListener('pointerup', () => game.handleClick());
window.addEventListener('resize', () => game.resize());
window.addEventListener('mousemove', (e) => { mouseX = e.pageX; mouseY = e.pageY});