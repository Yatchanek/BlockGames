const config = {}
const TETRIS = 4;
const PENTRIS = 5;
const gameWindow = document.querySelector('.game-window');
const ctx = gameWindow.getContext('2d');
let mouseX;
let mouseY;


let resCount = 0;
const blocks = new Image();
const title = new Image();
const cursor = new Image();
const startButton = new Image();
const textSheet = new Image();

blocks.src = './res/blocks.png';
blocks.onload = assetLoader();
title.src = './res/title.png';
title.onload = assetLoader();
cursor.src = './res/cursor.png';
cursor.onload = assetLoader();
startButton.src = './res/startbutton.png';
startButton.onload = assetLoader();
textSheet.src = './res/text.png';
textSheet.onload = assetLoader();
const sWidth = window.screen.width;

const game = new Game();

function assetLoader() {
    resCount++;
    if (resCount === 5) {
     gameWindow.width = window.innerWidth;
     gameWindow.height = window.innerHeight;
    }
}

game.run();

window.addEventListener('keydown', (e) => game.keys[e.keyCode] = true);
window.addEventListener('keyup', () => game.keyHold = false);
window.addEventListener('click', () => game.handleClick());
window.addEventListener('resize', () => game.resize());
window.addEventListener('mousemove', (e) => { mouseX = e.pageX; mouseY = e.pageY});