class Game {
    constructor() {
        this.wWidth = window.innerWidth;
        this.wHeight = window.innerHeight;
        this.scale = Math.min(this.wWidth / 1920, this.height / 937);       
        this.gameState = 'titleScreen';
        this.nextState = 'titleScreen';
        this.grid = [];
        this.fullLines = [];
        this.keys = {};
        this.discardedPieces = [];
        this.maxDiscard = 5;
        this.shapes = [
            '..X...X...X...X.',
            '..X..XX...X.....',
            '.....XX..XX.....',
            '..X..XX..X......',
            '.X...XX...X.....',
            '.X...X...XX.....',
            '..X...X..XX.....',
            '..X....X....X....X....X..',
            '......XXX...X....X.......',
            '......XXX..X.X...........',
            '.......X...XXX...X.......',
            '......X....XXX....X......',
            '........X..XXX..X........',
            '.......X...XX...XX.......',
            '.......X....XX...XX......',
            '..X....X....X...XX.......',
            '..X....X....X....XX......',
            '..X....XX...X....X.......',
            '..X...XX....X....X.......',
            '........X...XX..XX.......',
            '.......XX..XX....X.......',
            '......XX....XX...X.......',
            '..X....X...XX...X........',
            '..X....X....XX....X......',
            '......XXX..X....X........'
        ]
        
        this.statsTxt = ['Single', 'Double', 'Triple', 'Quadruple', 'Quintuple'];
        this.blocks = blocks;
        this.pieceCount;
        this.loop = this.gameLoop.bind(this);
        this.rows = 18;
        this.cols = 12;
        this.gameMode = TETRIS;
        this.currentPiece = null;
        this.statPiece = null;
        this.nextPiece = null;
        this.hardCoreMode = false;
        this.advanceLevel = false;
        this.keyHold = false;
        this.failedLoad = false;
        this.newRecord = false;
        this.pieceWasReleased = false;
        this.hints = true;
        this.hintsAllowed = true;
        this.showStats = true;
        this.tick = 0;
        this.lastTick = 0;
        this.lastClick = 0;
        this.linesCount = 0;
        this.elapsedTime = 0;
        this.lastTime = 0;
        this.tickElapsedTime = 0;
        this.delta = 0;
        this.score = 0;
        this.level = 1;
        this.bonus = 0;
        this.enteredName = '';
        this.enteredPlace = 0;
        this.highScores = {
            tetrisScore: [],
            pentrisScore: [],
        }
        this.skillLevel = 0;
        this.rotation = 0;
        this.speed = 1000;
        this.randomRowChance = 0.05;
        this.titlePos1 = (this.wWidth - title.width) / 2;
        this.titlePos2 = this.titlePos1 + this.wWidth;
        this.longestName1 = 0;
        this.longestName2 = 0;
        this.highestScore1 = 0;
        this.highestScore2 = 0;
        this.statistics = {
                            0: 0, //0 - 6: Tetris pieces
                            1: 0,
                            2: 0,
                            3: 0,
                            4: 0,
                            5: 0,
                            6: 0,
                            7: 0, //7 - 24: Pentris pieces
                            8: 0,
                            9: 0,
                            10: 0,
                            11: 0,
                            12: 0,
                            13: 0,
                            14: 0,
                            15: 0,
                            16: 0,
                            17: 0,
                            18: 0,
                            19: 0,
                            20: 0,
                            21: 0,
                            22: 0,
                            23: 0,
                            24: 0,
                            25: 0, //25 - 28 Tetris line clears
                            26: 0,
                            27: 0,
                            28: 0,
                            29: 0, //29 - 33 Pentris line clears
                            30: 0,
                            31: 0,
                            32: 0,
                            33: 0
        }

        if (localStorage.hasOwnProperty('BlockMayhemStats')) {
            this.allTimeStats = JSON.parse(localStorage.getItem('BlockMayhemStats'))
        } else {
            let d = new Date()
            d = `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`;
            this.allTimeStats = {
                    'Tetris Games Played': 0,
                    'Pentris Games Played': 0,
                    'Started on': d,
                    0: 0, //0 - 6: Tetris pieces
                    1: 0,
                    2: 0,
                    3: 0,
                    4: 0,
                    5: 0,
                    6: 0,
                    7: 0, //7 - 24: Pentris pieces
                    8: 0,
                    9: 0,
                    10: 0,
                    11: 0,
                    12: 0,
                    13: 0,
                    14: 0,
                    15: 0,
                    16: 0,
                    17: 0,
                    18: 0,
                    19: 0,
                    20: 0,
                    21: 0,
                    22: 0,
                    23: 0,
                    24: 0,
                    25: 0, //25 - 28 Tetris line clears
                    26: 0,
                    27: 0,
                    28: 0,
                    29: 0, //29 - 33 Pentris line clears
                    30: 0,
                    31: 0,
                    32: 0,
                    33: 0
            }
        }

        this.loadScores();
    }

    rotate(px, py, r, mode) {
        let pIndex = 0;
        switch(r % 4) {
            case 0:
            pIndex = py * mode + px;
            break;
            case 1:
            pIndex = mode * (mode - 1 ) + py - (px * mode);
            break;
            case 2:
            pIndex = mode**2 - 1 - (py * mode) - px;
            break;
            case 3:
            pIndex = mode - 1 - py + (px * mode);
            break;
        }
        return pIndex;
    }

    drawPiece(piece, x, y, scale, rotation) {
        if (piece != null) {
            let size = piece < 7 ? 4 : 5;
            for (let px = 0; px < size; px ++) {
                for (let py = 0; py < size; py ++) {
                    if (this.shapes[piece][this.rotate(px, py, rotation, size)] === 'X') {
                        ctx.drawImage(this.blocks, piece * 32, 0, 32, 32, x + px * this.cellSize * scale, y + py * this.cellSize * scale, this.cellSize * scale, this.cellSize * scale);
                    }
                }
            }
        }
    }

    drawShadow(piece) {
        if (piece != null && !this.dropped) {
            let size = piece < 7 ? 4 : 5;
            for (let px = 0; px < size; px ++) {
                for (let py = 0; py < size; py ++) {
                    if (this.shapes[piece][this.rotate(px, py, this.rotation, size)] === 'X') {
                        ctx.save();
                        ctx.strokeStyle = 'rgba(150, 150, 150, .5)';
                        ctx.lineWidth = 1;
                        ctx.strokeRect(this.originX + (this.currentX + px) * this.cellSize, this.originY + (this.shadowY + py)* this.cellSize, this.cellSize - 4, this.cellSize - 4);
                        ctx.restore();
                    }
                }

            }
        }
    }

    discardPiece() {
        if(this.currentY < this.rows / 2 && this.discardedPieces.length < this.maxDiscard) {
            this.discardedPieces.push(this.currentPiece);
            this.selectNewPiece();
        }
    }

    releasePiece() {
        if(this.discardedPieces.length > 0 && this.nextPiece != this.discardedPieces[0] && !this.pieceWasReleased) {
            this.nextPiece = this.discardedPieces.shift()
            this.pieceWasReleased = true;
        }
    }

    fits(x, y, r) {
        if (this.currentPiece !=null) {
            for (let px = 0; px < this.gameMode; px ++) {
                for (let py = 0; py < this.gameMode; py ++) {
                    let pIndex = this.rotate(px, py, r, this.gameMode);
                    let gIndex = (y + py) * this.cols + (x + px);

                    if (x + px >= 0 && x + px < this.cols) {
                        if (y + py >=0 && y + py < this.rows) {

                            if (this.shapes[this.currentPiece][pIndex] === 'X' && this.grid[gIndex] != null) {
                                return false;
                            }
                        }
                    }
                }
            }
            return true;
        }
    }

    selectNewPiece() {
        if (this.nextPiece === null) {
            this.nextPiece = this.countOrigin + Math.floor(Math.random() * this.pieceCount);
        }
        
 
        this.currentPiece = this.nextPiece;
        this.nextPiece = this.countOrigin + Math.floor(Math.random() * this.pieceCount);
        
        let off = this.gameMode === TETRIS ? 1 : 2;
        this.shadowX = this.currentX = this.cols / 2 - off;
        this.shadowY = this.currentY = 0;
        this.rotation = 0;
        this.dropped = false;
        this.statistics[this.currentPiece] += 1
        if (this.pieceWasReleased) {
            this.pieceWasReleased = false;
        }
    }

    dropSelf() {
        while(this.fits(this.currentX, this.currentY + 1, this.rotation)) {
            this.currentY++;
            this.bonus += 0.025;
        }
        this.droped = true;
    }

    dropShadow() {
        while(this.currentPiece !=null &&! this.dropped && this.fits(this.currentX, this.shadowY + 1, this.rotation)) {
            this.shadowY++;
        }
    }

    configure() {
        if (this.gameMode === TETRIS) {
           this.rows = 18;
           this.cols = 12;
           this.countOrigin = 0;
           this.pieceCount = 7;
        }
        else {
            this.rows = 24;
            this.cols = 14;
            this.countOrigin = 7;
            this.pieceCount = 18;
        }

        if (this.hardCoreMode) {
            this.hints = false;
            this.hintsAllowed = false;
        }
        else {
            this.hints = true;
            this.hintsAllowed = true;
        }
        
        this.cellSize = Math.floor(this.wHeight * 0.95 / this.rows);
        this.gWidth = this.cellSize * this.cols;
        this.gHeight = this.cellSize * this.rows;
        this.originX = Math.floor((this.wWidth - this.gWidth) / 2);
        this.originY = Math.floor((this.wHeight - this.gHeight) / 2);

        this.ongoingPlay = true;
        this.findLongestNameAndScore();        
        this.createGrid();
        this.currentPiece = this.nextPiece = null;
        this.selectNewPiece();
        this.nextState = 'playing';     
    }

saveStats() {
    if (this.gameMode === TETRIS) {
        this.allTimeStats['Tetris Games Played'] += 1
    } else {
        this.allTimeStats['Pentris Games Played'] += 1
    }

    for (let i = 0; i < 34; i++) {
        this.allTimeStats[i] += this.statistics[i] 
     }

    window.localStorage.setItem('BlockMayhemStats', JSON.stringify(this.allTimeStats))
}
    
saveScores() {
    if(!this.failedLoad) {
      fetch('https://blockmayhem.glitch.me', {
      method: 'POST',
      body: JSON.stringify(this.highScores),
      headers: {
        'content-type': 'application/json; charset=UTF-8'
        }
      })
    }

    else {
        window.localStorage.setItem('BlockMayhemScoresLoadFail', JSON.stringify(this.highScores));
    }
}

async loadScores() {
    try {
        const response = await fetch('https://blockmayhem.glitch.me/score', {
            headers: {
              "Access-Control-Allow-Origin": "*"
            }
          })
        const data = await response.json();
        this.highScores = JSON.parse(data);
    }
    catch {
        this.failedLoad = true;
        this.emergencyLoadScores();
    }
  }

async updateHighScores() {
    try {
        const response = await fetch('https://blockmayhem.glitch.me/score', {
            headers: {
              "Access-Control-Allow-Origin": "*"
            }
          })
        const data = await response.json();
        this.highScores = JSON.parse(data);
    }
    catch {
        this.failedLoad = true;      
    }
    if (this.gameMode ===  TETRIS && this.score > 
        this.highScores.tetrisScore[this.highScores.tetrisScore.length-1].score) {
        this.highScores.tetrisScore.push({name: '', score: this.score});
        this.newRecord = true;
        this.sortScores(this.highScores.tetrisScore)
        this.findLongestNameAndScore();            
    }
    
    else if(this.gameMode === PENTRIS && this.score > 
        this.highScores.pentrisScore[this.highScores.pentrisScore.length - 1].score) {
        this.highScores.pentrisScore.push({name: '', score: this.score});
        this.newRecord = true;
        this.sortScores(this.highScores.pentrisScore);
        this.findLongestNameAndScore();            
    } 
}  

emergencyLoadScores(){
          if (window.localStorage.hasOwnProperty('BlockMayhemScoresLoadFail')) {
            this.highScores = JSON.parse(localStorage.getItem('BlockMayhemScoresLoadFail'));
        } else {
            for (let i = 0; i < 7; i++) {
                this.highScores.tetrisScore.push({name: 'Tetris', score: 100});
                this.highScores.pentrisScore.push({name: 'Pentris', score: 100});
            }
        }   
}
  
  
cls() {
    ctx.save();
    ctx.fillStyle = `rgba(16, 25, 41, 1)`;
    ctx.fillRect(0,0, this.wWidth, this.wHeight);
    ctx.restore();
}

createGrid() { 
    this.grid = [];
    for (let x = 0; x < this.cols; x++) {
        for (let y = 0; y < this.rows; y++) {
            this.grid[y * this.cols + x] = (x === 0 || x === this.cols - 1 || y === this.rows - 1) ? 25 : null;      
        }
    }

    if (this.skillLevel > 0) {
        let top = this.rows - this.skillLevel - 2;
        let c = this.gameMode === TETRIS ? 7 : 18;
        let gapCount = 0;
        
            for (let y = this.rows - 2; y > top; y--) {
              do {
              gapCount = 0;
                for (let x = 1; x < this.cols - 1; x++) {
                    this.grid[y*this.cols + x] = Math.random() < 0.3 ? random(c) : null;
                    if(this.grid[y*this.cols + x] === null) gapCount++;
                }
            } while (gapCount <=3 || gapCount >= this.cols - 6);
         } 
    }
}

drawGrid() {
    for (let x = 0; x < this.cols; x++) { 
         for (let y = 0; y < this.rows; y++) { 
            if ((this.grid[y * this.cols + x]) != null) {
                ctx.drawImage(this.blocks, this.grid[y * this.cols + x] * 32, 0, 32, 32, 
                              this.originX + x * this.cellSize, this.originY + y * this.cellSize, this.cellSize , this.cellSize);
            }
           
        }
        
    }
}

drawInfo() {
     ctx.drawImage(textSheet, 130, 0, 235, 35, 30 * this.scale, 20 * this.scale, 235 * this.scale, 35 * this.scale);
     let s;
     if (this.gameMode === TETRIS) {
        s = this.highScores.tetrisScore[0].score.toString();
    }
    else {
       s = this.highScores.pentrisScore[0].score.toString();
    }
     
     let count = 0;
     for (let char of s) {
     ctx.drawImage(textSheet, +char * 32, 122, 31, 28, 275 * this.scale + count * 32 * this.scale, 22 * this.scale, 32 * this.scale, 27 * this.scale);
         count++;
     }


    ctx.drawImage(textSheet, 0, 0, 127, 27, 30 * this.scale, 70 * this.scale, 127 * this.scale, 27 * this.scale);
   
        s = this.score.toString();
        count = 0;
        for (let char of s) {
            ctx.drawImage(textSheet, +char * 32, 122, 31, 28, 175 * this.scale + count * 32 * this.scale, 70 * this.scale, 32 * this.scale, 27 * this.scale);
            count++;
        }

        s = this.linesCount.toString();
        count = 0;
        ctx.drawImage(textSheet, 0, 30, 122, 27, 30 * this.scale, 120 * this.scale, 122 * this.scale, 27 * this.scale);
        for (let char of s) {
            ctx.drawImage(textSheet, +char * 32, 122, 31, 28, 165 * this.scale + count * 32 * this.scale, 120 * this.scale, 32 * this.scale, 27 * this.scale);
            count++;
        }

        s = this.level.toString();
        count = 0;
        ctx.drawImage(textSheet, 0, 60, 127, 27, 30 * this.scale, 170 * this.scale, 127 * this.scale, 27 * this.scale);
        for (let char of s) {
            ctx.drawImage(textSheet, +char * 32, 122, 31, 28, 175 * this.scale + count * 32 * this.scale, 170 * this.scale, 32 * this.scale, 27 * this.scale);
            count++;
        }

        ctx.drawImage(textSheet, 0, 90, 122, 27, this.wWidth - 6 * this.cellSize * this.scale, 10 * this.scale, 122 * this.scale, 27 * this.scale)
  
}

drawStatsPage() {
    ctx.font = `${Math.floor(this.wWidth * 0.045)}px "Comic Sans MS"`;
    ctx.fillStyle = `rgb(206, 206, 12)`;
    let w = ctx.measureText('Statistics since ' + this.allTimeStats['Started on']).width;
    ctx.baseline = 'middle'
    ctx.fillText('Statistics since ' + this.allTimeStats['Started on'], (this.wWidth - w) / 2, this.wWidth * 0.05);

    let col = 0;
    let row = 0;
    let gm = 0;
    if (!this.cellSize) {
        this.cellSize = Math.floor(this.wHeight * 0.95 / 18);
    }

    for (let i = 0; i < 25; i++) {
        this.drawPiece(i, this.wWidth* 0.05 * this.scale + col * 200 * this.scale, (this.wHeight * 0.24 + row * this.wHeight * 0.2) * this.scale, this.scale / 2.5, 0)

        gm = i < 7 ? TETRIS : PENTRIS

        ctx.font = `${Math.floor(this.wWidth * 0.015)}px "Comic Sans MS"`;
        ctx.fillText(this.allTimeStats[i].toString(), this.wWidth* 0.05 * this.scale + col * 200 * this.scale + Math.floor(gm / 2) * this.cellSize * this.scale / 2.5, (this.wHeight * 0.24 + row * this.wHeight * 0.2) * this.scale + (gm + 2) * this.cellSize * this.scale / 2.5)
        col++;
        if (i === 6) {
            row += 1.75;
            col = 0;
        }
        if (this.wWidth* 0.05 * this.scale + 5 * this.cellSize * this.scale / 2.5 + col * 200 * this.scale > sWidth - this.wWidth* 0.05 * this.scale) {
            col = 0;
            row++;    
        }
      }

      ctx.font = `${Math.floor(this.wWidth * 0.012)}px "Comic Sans MS"`;
      ctx.fillText(`Tetris games played: ${this.allTimeStats['Tetris Games Played']}`, this.wWidth* 0.05 * this.scale, this.wHeight * 0.17)
      ctx.fillText(`Single line clears: ${this.allTimeStats[25]},   Double line clears: ${this.allTimeStats[26]},   Triple line clears: ${this.allTimeStats[27]},   Quadruple line clears: ${this.allTimeStats[28]}`, this.wWidth* 0.05 * this.scale, this.wHeight * 0.17 + Math.floor(this.wWidth * 0.017))
      ctx.fillText(`Pentris games played: ${this.allTimeStats['Pentris Games Played']}`, this.wWidth* 0.05 * this.scale, this.wHeight * 0.5)
      ctx.fillText(`Single line clears: ${this.allTimeStats[29]},   Double line clears: ${this.allTimeStats[30]},   Triple line clears: ${this.allTimeStats[31]},   Quadruple line clears: ${this.allTimeStats[32]},   Quintuple line clears: ${this.allTimeStats[33]}`, this.wWidth* 0.05 * this.scale, this.wHeight *0.5 + Math.floor(this.wWidth * 0.017))
}

drawStats() {
      ctx.font = `${Math.floor(this.wWidth * 0.015)}px "Comic Sans MS"`;
      ctx.fillStyle = `rgb(206, 206, 12)`;
      let statSpot = this.gameMode === TETRIS ? 25 : 29
      for (let i = 0; i < this.gameMode; i++) {
          ctx.fillText(`${this.statsTxt[i]} line clears: ${this.statistics[i + statSpot]}`, this.wWidth / 2 + this.cols / 2 * this.cellSize + 10, this.wHeight * 0.5 + i * this.wWidth * 0.025 * this.scale)
      }
          
      let col = 0
      let row = 0
      let sc = this.gameMode === TETRIS ? 2.5 : 3
      let gap = this.gameMode === TETRIS ? 100 : 75
      
      for (let i = this.countOrigin; i < this.countOrigin + this.pieceCount; i++) {
            this.drawPiece(i, this.wWidth * 0.01 + col * 275 * this.scale, (250 + row * gap) * this.scale, this.scale / sc, 0)

            let count = 0;
            let s = this.statistics[i].toString()
            for (let char of s) {
            ctx.drawImage(textSheet, +char * 32, 122, 31, 28, (this.wWidth * 0.01 + 100 + count * 32 + col * 275) * this.scale, (275 + row * gap) * this.scale, 32 * this.scale * 0.8, 27 * this.scale * 0.8);
            count++;
        }

        row++
        if (row === 9) {
          row = 0
          col++
        }     
      } 
}


mouseInBounds(x1, x2, y1, y2) {
    return (mouseX > x1 && mouseX < x2 && mouseY > y1 && mouseY < y2);
}

sortScores(scores) {
    scores.sort((a, b) => b.score - a.score);
    scores.pop();
    for (let i = 0; i < 7; i++) {
        if (scores[i].name === '' && scores[i].score === this.score) {
            this.enteredPlace = i;
            return;
        }
    }
}

resize() {
    this.sWidth = window.screen.width;
    this.wWidth = gameWindow.width = window.innerWidth;
    this.wHeight = gameWindow.height = window.innerHeight;
    this.cellSize = Math.floor(this.wHeight * 0.95 / this.rows);
    this.gameHeight = this.cellSize * this.rows;
    this.gameWidth = this.cellSize * this.cols;
    this.originX = Math.floor((this.wWidth - this.gWidth) / 2); 
    this.originY = Math.floor((this.wHeight - this.gHeight) / 2);
}

restartGame() {
    this.failedLoad = false;
    this.loadScores();
    this.score = 0;
    this.linesCount = 0;
    this.level = 1;
    this.bonus = 0;
    this.speed = 1000;
    this.enteredName = '';
    this.enteredPlace = 0;
    this.newRecord = false;
    this.keys = {};
    this.discardedPieces = [];
    this.pieceWasReleased = false;
    this.lastClick = performance.now();
    this.nextState = this.gameState = 'titleScreen';
    for (let key in this.statistics) {
        this.statistics[key] = 0;
    }
}

findLongestNameAndScore() {
    ctx.save();
    ctx.font = '40px "Comic Sans MS"';
    for (let i = 0; i < 7; i++) {
        if (ctx.measureText(this.highScores.tetrisScore[i].name).width > this.longestName1) {
            this.longestName1 = ctx.measureText(this.highScores.tetrisScore[i].name).width;
        }
        if (ctx.measureText(this.highScores.pentrisScore[i].name).width > this.longestName2) {
            this.longestName2 = ctx.measureText(this.highScores.pentrisScore[i].name).width;
        }
        if (ctx.measureText(this.highScores.tetrisScore[i].score).width > this.highestScore1) {
            this.highestScore1 = ctx.measureText(this.highScores.tetrisScore[i].score).width;
        }
        if (ctx.measureText(this.highScores.pentrisScore[i].score).width > this.highestScore2) {
            this.highestScore2 = ctx.measureText(this.highScores.pentrisScore[i].score).width;
        }
    }
    ctx.restore();
}

handleClick() {
       
      if (this.gameState === 'gameOver') {
        this.ongoingPlay = false;
        this.lastTick = this.tick;

        if(this.newRecord) {
            this.nextState = 'enteringName';
        }
        else {
            this.nextState = 'hallOfFame';
        }
    }

    if (this.gameState === 'hallOfFame') {
        this.restartGame();
    }

    if (this.gameState === 'infoScreen' || this.gameState === 'statsScreen') {
        this.nextState = 'titleScreen';
    }

    if (this.gameState === 'titleScreen' && performance.now() - this.lastClick > 100) {
        if (this.mouseInBounds((this.wWidth - 476 * this.scale) / 2, (this.wWidth + 476 * this.scale) / 2,
                   this.wHeight - (120 * this.scale), this.wHeight - 30 * this.scale))  {
                this.configure();
        }
    

    //Game Mode
        if(this.mouseInBounds(450 * this.scale,  620 * this.scale, 
                      this.wHeight * 0.5, this.wHeight * 0.5 + 37 * this.scale)) {
                       
            this.gameMode = TETRIS;
        }

        if(this.mouseInBounds(720 * this.scale, 922 * this.scale, 
                      this.wHeight * 0.5, this.wHeight * 0.5 + 37 * this.scale)) {
                        
            this.gameMode = PENTRIS;
    }

    //Skill Level
    if(this.mouseInBounds(430 * this.scale,  474 * this.scale, 
        this.wHeight * 0.6, this.wHeight * 0.6 + 37 * this.scale)) {
         
            this.skillLevel = 0;
    }

    if(this.mouseInBounds(500 * this.scale,  544 * this.scale, 
        this.wHeight * 0.6, this.wHeight * 0.6 + 37 * this.scale)) {
         
            this.skillLevel = 3;
    }

    if(this.mouseInBounds(570 * this.scale,  614 * this.scale, 
        this.wHeight * 0.6, this.wHeight * 0.6 + 37 * this.scale)) {
         
            this.skillLevel = 6;
    }

    if(this.mouseInBounds(640 * this.scale,  688 * this.scale, 
        this.wHeight * 0.6, this.wHeight * 0.6 + 37 * this.scale)) {
         
            this.skillLevel = 9;
    }

    //Hardcore Mode
    if(this.mouseInBounds(552 * this.scale, 643 * this.scale, this.wHeight * 0.7, this.wHeight * 0.7 + 37 * this.scale)) {
        this.hardCoreMode = true;
    }

    if(this.mouseInBounds(684 * this.scale, 794 * this.scale, this.wHeight * 0.7, this.wHeight * 0.7 + 37 * this.scale)) {
        this.hardCoreMode = false;
    }

    //View Info & View Stats
    ctx.save();
    ctx.font = `${Math.floor(this.wWidth * 0.015)}px "Snap ITC"`;
    if (this.mouseInBounds(10, ctx.measureText('View Info').width, this.wHeight - this.wWidth * 0.015, this.wHeight)) {
        this.nextState = 'infoScreen';
    }
    else if (this.mouseInBounds(50 + ctx.measureText('View Info').width, 50 + ctx.measureText('View Info').width + ctx.measureText('View Stats').width, this.wHeight - this.wWidth * 0.015, this.wHeight)) {
        this.nextState = 'statsScreen';
    }
    ctx.restore();
 }
      
    
    
}


checkKeyInput() {

    if (this.gameState != 'paused' && this.gameState != 'titleScreen') {
        //Left Arrow
        if (this.keys['ArrowLeft'] && !this.dropped && this.fits(this.currentX-1, this.currentY, this.rotation)) {
            this.currentX--;
    }

    //Right Arrow
    if (this.keys['ArrowRight'] && !this.dropped && this.fits(this.currentX+1, this.currentY, this.rotation)) {
        this.currentX++;
        }

     //Up Arrow
        if (this.keys['ArrowUp'] && !this.dropped && !this.keyHold && this.fits(this.currentX, this.currentY, this.rotation+1)) {
        this.rotation++;
        this.keyHold = true;
        }

    //Down Arrow
        if (this.keys['ArrowDown'] && this.fits(this.currentX, this.currentY+1, this.rotation)) {
        this.currentY++;
        }

    //Pause
    if(this.keys['p']) {
            this.nextState = 'paused';
    }

    //Hints
    if (this.keys['h'] && this.hintsAllowed) this.hints = !this.hints;

    //Discard Piece
    if(this.keys['d'] && !this.keyHold) {
        this.discardPiece();
    }

    //Releace piece
    if(this.keys['r'] && !this.keyHold) {
        this.releasePiece();
    }

   //SPACE
    if (this.keys[' ']) {
        this.dropSelf();
        this.dropped = true;
    }
    
    if (this.keys['s']) {
      if (this.showStats) {
        this.showStats = false;
      } else {
        this.showStats = true;
      }
    }

    }

    if(this.keys['p']) {
        if (this.gameState === 'playing') {
            this.nextState = 'paused';
        } else if (this.gameState === 'paused')
        {
           this.nextState = 'playing'

        }
    }

    let sum = 0
    for (let key in this.keys) {
      sum += this.keys[key]
    }
  
    if (this.gameState === 'gameOver' && sum && this.tick - this.lastTick > 10) {
        this.ongoingPlay = false;
        this.newRecord ? this.nextState = 'enteringName' : this.nextState = 'hallOfFame';
        this.lastTick = this.tick
    }

    if ((this.gameState === 'infoScreen' || this.gameState === 'statsScreen') && sum) {
        this.nextState = 'titleScreen'
    }

    if (this.gameState === 'hallOfFame' && sum && this.tick - this.lastTick > 10) {
        this.restartGame();
    }

    this.keys = {}
}

calculateHighestRow() {
    let check = 0;
    for (let py = this.rows - 2; py >=0; py--) {       
        for (let px = 1; px < this.cols - 1; px++) {
            check |= this.grid[py * this.cols + px];
        }
        if (check === 0) return py + 1;
        check = 0;
    }
    return 0;
}


gameLoop() {
    let timestamp = performance.now();
    this.delta = timestamp - this.lastTime;
    this.elapsedTime += this.delta;
    this.tickElapsedTime += this.delta;
    this.lastTime = timestamp;
    this.scale = Math.min(this.wWidth / 1920, this.wHeight / 937);

    this.checkKeyInput();

    if (this.tickElapsedTime > 50) {
        this.tickElapsedTime = 0;
        this.tick++;
        this.gameTick = true;
    }

    this.cls();
    if (this.gameState === 'infoScreen') {
        ctx.save();
        ctx.font = `${Math.floor(this.wWidth * 0.025)}px "Comic Sans MS"`;
        ctx.fillStyle = `rgb(206, 206, 12)`;
        ctx.fillText('Controls:', 25, this.wHeight * 0.1);
        ctx.font = `${Math.floor(this.wWidth * 0.015)}px "Comic Sans MS"`;
        ctx.fillText('Left & Right Arrow: Move left/right', 25, this.wHeight * 0.2);
        ctx.fillText('Up Arrow: Rotate', 25, this.wHeight * 0.25);
        ctx.fillText('Down Arrow: Move down', 25, this.wHeight * 0.3);
        ctx.fillText('Space: Drop piece', 25, this.wHeight * 0.35);
        ctx.fillText('H: Toggle aim assist', 25, this.wHeight * 0.4);
        ctx.fillText('P: Pause', 25, this.wHeight * 0.45);
        ctx.fillText('D: Discard unwanted piece before it falls halfway (max 5 pieces at any given time)', 25, this.wHeight * 0.5);
        ctx.fillText('R: Release discarded piece as next piece (only if different than next piece and if last released piece has entered the board)', 25, this.wHeight * 0.55)
        ctx.fillText('   You get penalty points for finishing the game with unreleased pieces!', 25, this.wHeight * 0.6)
        ctx.fillText('S: Toggle display of statistics during game', 25, this.wHeight * 0.65)
        ctx.fillText('Skill Level: You start with a given number of randomly filled lines', 25, this.wHeight * 0.75);
        ctx.fillText('Hardcore Mode: Aim assist disabled. A random line will get scrambled once in a while', 25, this.wHeight * 0.8);
        ctx.fillText('Core game mechanics (piece drawing & rotation) based on C++ code by Javidx9', 25, this.wHeight * 0.9)
        ctx.fillText('Blocks art based on work by Leozlk. Cursor art by para. Downloaded from opengameart.org', 25, this.wHeight *0.95);
    }

    if (this.gameState === 'statsScreen') {
        this.drawStatsPage()
    }

    if (this.gameState === 'titleScreen') {
        let w = title.width;
        let h = title.height;
        //Title
        ctx.save();
        ctx.globalAlpha = 0.7 + 0.3 * Math.sin(this.tick / 10)
        ctx.drawImage(title, 0, 648, w, 127, this.titlePos1, 100 * this.scale + 20 * Math.sin(this.elapsedTime / 400),
                    w * this.scale * 1.005, 125 * this.scale * 1.005);
        ctx.drawImage(title, 0, 648, w, 127, this.titlePos2, 100 * this.scale + 20 * Math.sin(this.elapsedTime / 400) ,
                        w * this.scale * 1.005, 127 * this.scale * 1.005);
        ctx.globalAlpha = 1;
        ctx.drawImage(title, 0, 127 * Math.floor((this.tick / 100) % 5), w, 127, this.titlePos1, 100 * this.scale + 20 * Math.sin(this.elapsedTime / 400),
                       w * this.scale, 127 * this.scale);
        ctx.drawImage(title, 0, 127 * Math.floor((this.tick / 100) % 5), w, 127, this.titlePos2, 100 * this.scale + 20 * Math.sin(this.elapsedTime / 400) ,
                        w * this.scale, 127 * this.scale);

        this.titlePos1 -= 4;
        this.titlePos2 -= 4;

        ctx.restore();
        this.moveOffset+=10;
        if(this.titlePos1 < - w * this.scale) {
            this.titlePos1 = this.titlePos2 + this.wWidth;
        }

        if (this.titlePos2 < - w * this.scale) {
            this.titlePos2 = this.titlePos1 + this.wWidth;
        }
        //Game Mode
        ctx.drawImage(textSheet, 370, 0, 300, 37, 50 * this.scale, this.wHeight * 0.5, 300 * this.scale, 37 * this.scale);
        ctx.drawImage(textSheet, 680, 0, 170, 37, 450 * this.scale, this.wHeight * 0.5, 170 * this.scale, 37 * this.scale);
        ctx.drawImage(textSheet, 850, 0, 202, 37, 720 * this.scale, this.wHeight * 0.5, 202 * this.scale, 37 * this.scale);

        //Skill Level
        ctx.drawImage(textSheet, 775, 40, 280, 37, 50 * this.scale, this.wHeight * 0.6, 280 * this.scale, 37 * this.scale)
        ctx.drawImage(textSheet, 0, 122, 31, 30, 430 * this.scale, this.wHeight * 0.6, 44 * this.scale, 37 * this.scale)
        ctx.drawImage(textSheet, 94, 122, 31, 30, 500 * this.scale, this.wHeight * 0.6, 44 * this.scale, 37 * this.scale)
        ctx.drawImage(textSheet, 191, 122, 31, 30, 570 * this.scale, this.wHeight * 0.6, 44 * this.scale, 37 * this.scale)
        ctx.drawImage(textSheet, 287, 122, 31, 30, 640 * this.scale, this.wHeight * 0.6, 44 * this.scale, 37 * this.scale)  

        //Hardcore Mode
        ctx.drawImage(textSheet, 370, 40, 402, 37, 50 * this.scale, this.wHeight * 0.7, 402 * this.scale, 37 * this.scale)
        ctx.drawImage(textSheet, 1060, 0, 82, 37, 552 * this.scale, this.wHeight * 0.7, 82 * this.scale, 37 * this.scale)
        ctx.drawImage(textSheet, 1060, 40, 110, 37, 684 * this.scale, this.wHeight * 0.7, 110 * this.scale, 37 * this.scale)

        //Selected Items Rectangle
        //Game Mode
        ctx.strokeStyle = `rgb(13, ${190 + 60 * Math.sin(this.tick / 5)}, ${195 + 60 * Math.sin(this.tick / 5)})`;
        ctx.lineWidth = 5;
        if (this.gameMode === TETRIS) {
            ctx.strokeRect(434 * this.scale, this.wHeight * 0.5 - 16 * this.scale, 202 * this.scale , 69 * this.scale );
        }
        else {
            ctx.strokeRect(704 * this.scale, this.wHeight * 0.5 - 16 * this.scale, 232 * this.scale , 69 * this.scale );
        }

        //Skill level
        switch (this.skillLevel) {
            case 0:
                ctx.strokeRect(420 * this.scale, this.wHeight * 0.6 - 10 * this.scale, 60 * this.scale, 55 * this.scale);
            break;
            case 3:
                ctx.strokeRect(490 * this.scale, this.wHeight * 0.6 - 10 * this.scale, 60 * this.scale, 55 * this.scale);
            break;
                
            case 6:
                ctx.strokeRect(560 * this.scale, this.wHeight * 0.6 - 10 * this.scale, 60 * this.scale, 55 * this.scale);
            break;

            case 9:
                ctx.strokeRect(630 * this.scale, this.wHeight * 0.6 - 10 * this.scale, 60 * this.scale, 55 * this.scale);
            break;

        }
     
        //Hardcore Mode select
        if (this.hardCoreMode) {
            ctx.strokeRect(540 * this.scale, this.wHeight * 0.7 - 12 * this.scale, 106 * this.scale, 61 * this.scale);
        } else {
            ctx.strokeRect(672 * this.scale, this.wHeight * 0.7 - 12 * this.scale, 132 * this.scale, 61 * this.scale);
        }


        //Start Game Button Animation
        if (this.mouseInBounds((this.wWidth - 476 * this.scale) / 2, (this.wWidth + 476 * this.scale) / 2,
                       this.wHeight - (120 * this.scale), this.wHeight - 30 * this.scale)) {
                this.scale += 0.05 * Math.sin(this.elapsedTime/150)
        }

        ctx.drawImage(textSheet, 370, 80, 420, 50, (this.wWidth - 420 * this.scale) / 2, this.wHeight - (120 * this.scale), 476 * this.scale, 50 * this.scale);

        //Info
        ctx.save();
        ctx.font = `${Math.floor(this.wWidth * 0.015)}px "Snap ITC"`;
        ctx.fillStyle = `rgb(206, 206, 12)`;
        let txt = 'Ver. 1.2.2'
        let w1 = ctx.measureText(txt).width;
        ctx.fillText(txt, this.wWidth - (w1 + 10), this.wHeight - 10);
        ctx.restore();

        ctx.save();
        ctx.font = `${Math.floor(this.wWidth * 0.015)}px "Snap ITC"`;
        ctx.fillStyle = `rgb(206, 206, 12)`;
        if (this.mouseInBounds(50 + ctx.measureText('View Info').width, 50 + ctx.measureText('View Info').width + ctx.measureText('View Stats').width, this.wHeight - this.wWidth * 0.015, this.wHeight)) {
            ctx.fillStyle = `rgb(206, 106, 12)`;
        }
        ctx.fillText('View Stats', 50 + ctx.measureText('View Info').width , this.wHeight - 10)
        ctx.fillStyle = `rgb(206, 206, 12)`;
        if (this.mouseInBounds(10, ctx.measureText('View Info').width, this.wHeight - this.wWidth * 0.015, this.wHeight)) {
            ctx.fillStyle = `rgb(206, 106, 12)`;
        }
 
        ctx.fillText('View Info', 10, this.wHeight - 10);

        ctx.restore();

        ctx.drawImage(cursor, mouseX - 32, mouseY - 32);
    }

     if (this.ongoingPlay) {
        this.drawGrid();
        this.drawInfo();
        if (this.showStats) {
          this.drawStats()
        }
        this.drawPiece(this.currentPiece, this.originX + this.currentX * this.cellSize, this.originY + this.currentY * this.cellSize, this.scale, this.rotation);
        this.drawPiece(this.nextPiece, this.wWidth - 6 * this.cellSize, 1.2 * this.cellSize, this.scale * 0.8, 0)

        ctx.save();
        ctx.fillStyle = `rgb(206, 206, 12)`;
        ctx.font = `${Math.floor(sWidth * 0.015)}px "Comic Sans MS"`;
        ctx.fillText('Discarded Pieces: ', this.wWidth / 2 + this.cols / 2 * this.cellSize + 10, this.wHeight * 0.79)
        for (let i = 0; i < this.discardedPieces.length; i++) {
            this.drawPiece(this.discardedPieces[i], this.wWidth / 2 + this.cols / 2 * this.cellSize + 10 + i * this.cellSize * this.gameMode * this.scale * 0.7, this.wHeight - (this.gameMode + 1) * this.cellSize * this.scale * 0.7, this.scale * 0.7, 0);
        }

        if(this.hints) {
            this.dropShadow();
            this.drawShadow(this.currentPiece);
        }
    }

    if (this.gameState === 'paused') {
        ctx.save();
        ctx.fillStyle = `rgba(16, 25, 41, 1)`;
        ctx.fillRect(this.originX + this.cellSize * this.scale, this.originY, this.cellSize * this.scale * (this.cols - 2), this.cellSize * this.scale * (this.rows - 1) )
        ctx.drawImage(textSheet, 0, 265, 590, 95, (this.wWidth - 590 * this.scale) / 2, (this.wHeight - 95 * this.scale) / 2, 590 * this.scale, 95 * this.scale)
    }


    if (this.gameState === 'gameOver') {
        ctx.drawImage(textSheet, 0, 160, 880, 100, this.wWidth / 2 - 440 * this.scale,
                      this.wHeight / 2 - 50 * this.scale, 880 * this.scale, 100 * this.scale);
        if(!this.newRecord && (this.gameMode ===  TETRIS && this.score > 
             this.highScores.tetrisScore[this.highScores.tetrisScore.length-1].score || this.gameMode === PENTRIS && this.score > 
                this.highScores.pentrisScore[this.highScores.pentrisScore.length - 1].score)) {
          this.newRecord = true;
          this.updateHighScores();
        }
    }

    if (this.gameState === 'hallOfFame' || this.gameState === 'enteringName') {

        //Hall of Fame
        ctx.drawImage(textSheet, 0, 375, 1200, 125, (this.wWidth - 1200 * this.scale) / 2, 50 * this.scale, 1200 * this.scale, 125 * this.scale);
        ctx.save();
        ctx.globalAlpha = 0.6 + 0.4 * Math.sin(this.elapsedTime / 500)
        ctx.drawImage(textSheet, 0, 520, 1200, 125, (this.wWidth - 1200 * this.scale) / 2, 50 * this.scale, 1200 * this.scale, 125 * this.scale);
        ctx.restore();

        ctx.drawImage(textSheet, 0, 670, 295, 62, 100 * this.scale, this.wHeight * 0.3, 295 * this.scale, 62 * this.scale)
        ctx.drawImage(textSheet, 300, 670, 353, 62, this.wWidth - 
                (100 + Math.max((this.longestName2 + 20 + this.highestScore2), 295 * this.scale)) * this.scale, this.wHeight * 0.3, 353 * this.scale, 62 * this.scale)    
        
    
        
        ctx.save();
        ctx.fillStyle = `rgb(206, 206, 12)`;
        ctx.font = `${Math.floor(sWidth * 0.02)}px "Comic Sans MS"`;

        for (let i = 0; i < 7; i++) {
            if (this.gameState === 'enteringName' && this.gameMode === TETRIS && i === this.enteredPlace) {
              ctx.save();
              ctx.fillStyle = `rgb(${206 + 50 * Math.sin(this.elapsedTime / 250)}, ${206 + 50 * Math.cos(this.elapsedTime / 250)}, 12)`;
              ctx.globalAlpha = 0.6 + 0.4 * Math.sin(this.elapsedTime / 250);
            }

            ctx.fillText(this.highScores.tetrisScore[i].name, 100 * this.scale, this.wHeight * 0.5 + i * 60 * this.scale);
            ctx.fillText(this.highScores.tetrisScore[i].score, 100 * this.scale + this.longestName1 + 20 * this.scale, this.wHeight * 0.5 + i * 60 * this.scale);
            
            if (this.gameState === 'enteringName' && this.gameMode === TETRIS && i === this.enteredPlace) {
            ctx.restore();
            }

            if (this.gameState === 'enteringName' && this.gameMode === PENTRIS && i === this.enteredPlace) {
                ctx.save();
                ctx.fillStyle = `rgb(${206 + 50 * Math.sin(this.elapsedTime / 250)}, ${206 + 50 * Math.cos(this.elapsedTime / 250)}, 12)`;
                ctx.globalAlpha = 0.6 + 0.4 * Math.sin(this.elapsedTime / 250);
            }

            ctx.fillText(this.highScores.pentrisScore[i].name, this.wWidth - 
                        (100 + this.longestName2 + 20 + this.highestScore2) * this.scale, 
                         this.wHeight * 0.5 + i * 60 * this.scale);
            ctx.fillText(this.highScores.pentrisScore[i].score, this.wWidth - 
                        (100 + this.highestScore2) * this.scale, this.wHeight * 0.5 + i * 60 * this.scale);
           
            if (this.gameState === 'enteringName' && this.gameMode === PENTRIS && i === this.enteredPlace) {
                ctx.restore();
            }
        }
    }
    
    if (this.gameState === 'enteringName') {
        ctx.save();
        ctx.strokeStyle = '#cece0c';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(this.wWidth / 2 - 200, this.wHeight * 0.8);
        ctx.lineTo(this.wWidth / 2 + 200, this.wHeight * 0.8);
        ctx.stroke();
        ctx.fillStyle = '#cece0c';
        ctx.font = `${Math.floor(this.wWidth * 0.02)}px "Snap ITC"`;
        let txt = 'Enter your name'
        let w = ctx.measureText(txt).width;
        ctx.fillText(txt, (this.wWidth - w)/2, this.wHeight * 0.8 + 50 * this.scale);
        ctx.font = `${Math.floor(this.wWidth * 0.02)}px "Comic Sans MS"`;
        ctx.fillText(this.enteredName, this.wWidth / 2 - 200, this.wHeight * 0.8 - 15);
        ctx.restore();

        if (this.gameMode === TETRIS) {
            this.highScores.tetrisScore[this.enteredPlace].name = this.enteredName;
             if(ctx.measureText(this.highScores.tetrisScore[this.enteredPlace].name).width > this.longestName1) {

                    this.longestName1 = ctx.measureText(this.highScores.tetrisScore[this.enteredPlace].name).width;
             }
        }
        else {
            this.highScores.pentrisScore[this.enteredPlace].name = this.enteredName;
            if(ctx.measureText(this.highScores.pentrisScore[this.enteredPlace].name).width > this.longestName2) {
                this.longestName2 = ctx.measureText(this.highScores.pentrisScore[this.enteredPlace].name).width;
            }
        }
        

        ctx.save();
        ctx.beginPath();
        ctx.globalAlpha = 0.6 + 0.4 * Math.sin(this.elapsedTime / 100);
        ctx.strokeStyle = '#cece0c';
        ctx.lineWidth = 3;
        
        ctx.font = `${Math.floor(sWidth * 0.02)}px "Comic Sans MS`;
        w = ctx.measureText(this.enteredName).width + 5;
        ctx.moveTo(this.wWidth / 2 - 200 + w, this.wHeight * 0.8 - 55)
        ctx.lineTo(this.wWidth / 2 - 200 + w, this.wHeight * 0.8 - 10)
        ctx.stroke();
        ctx.restore();

    }

    if (this.gameState === 'removing') {
        this.fullLines.forEach(line => {
            for (let px = 1; px < this.cols - 1; px++) {
                this.grid[line * this.cols + px] = this.tick % 10;
            }
        });


        if(this.tick - this.lastTick === 10) {
            this.fullLines.forEach(line => {
                for (let px = 1; px < this.cols -1; px ++) {
                    for (let py = line; py > 0; py--) {
                        this.grid[py * this.cols + px] = this.grid[(py - 1) * this.cols + px];
                        this.grid[px] = null;
                    }

                }
            });
            
            let statSpot = this.gameMode === TETRIS ? 24 : 28;
            this.statistics[statSpot + this.fullLines.length] += 1;
            this.fullLines = [];
            this.selectNewPiece();
            this.bonus = 0;
            this.nextState = 'playing';
        }

    }

    if (this.gameState === 'randomRow') {
        let c = this.gameMode === TETRIS ? 7 : 18;
        let gapCount = 0;
        do {
            gapCount = 0;
            for (let px = 1; px < this.cols -1; px ++) {
                this.grid[this.highestRow * this.cols + px] = Math.random() < 0.33 ? null : random(c);
                if (this.grid[this.highestRow * this.cols + px] === null) gapCount++;
            }   
        } while (gapCount > Math.floor(this.rows / 3))


        if (this.tick - this.lastTick > 10) {
            this.nextState = 'playing';
        }

    }


    if (this.gameState === 'playing') {
        if (this.currentPiece === null) {
            this.selectNewPiece();
        }

        if (!this.fits(this.currentX, this.currentY, this.rotation)) {
            this.lastTick = this.tick;
            this.dropped = true;
            this.nextState = 'gameOver';
            this.score -= 250 * this.discardedPieces.length;
            if(this.score < 0) {
                this.score = 0;
            }
            this.saveStats();
        }

        if (this.elapsedTime > this.speed) {
            this.elapsedTime = 0;
            if (this.fits(this.currentX, this.currentY + 1, this.rotation)) {
               this.currentY++;
            }

            else {
                this.score +=10 * (1+this.bonus);
                this.score = Math.floor(this.score);
                this.dropped = true;
                for (let px = 0; px < 5; px ++) {
                    for (let py = 0; py < 5; py ++) {
                        if (this.shapes[this.currentPiece][this.rotate(px, py, this.rotation, this.gameMode)] === 'X') {
                            this.grid[(this.currentY + py) * this.cols + (this.currentX + px)] = this.currentPiece;
                        }
                    }
                }

                for (let py = 0; py < 5; py++) {
                        if (this.currentY + py < this.rows - 1) {
                            let isLine = true;
                            for (let px = 1; px < this.cols - 1; px++) {

                                    isLine &= this.grid[(this.currentY + py) * this.cols + px] !=null;
                                }
                            if(isLine) {
                                this.fullLines.push(this.currentY + py);
                                this.linesCount++;
                                if (this.linesCount % 10 === 0) this.advanceLevel = true;
                            }
                        }

                    }

                    if (this.fullLines.length) {
                         this.bonus += this.fullLines.length * 0.25;
                         this.bonus *= (1+0.07 * this.skillLevel);
                         if(this.hardCoreMode) {
                             this.bonus *=1.2;
                         }
                         if ((this.gameMode === TETRIS && this.fullLines.length === 4) || (this.gameMode === PENTRIS && this.fullLines.length === 5)) this.bonus *= 2;
                         this.score += this.fullLines.length * 50 * (1+this.bonus);
                         this.score = Math.floor(this.score);
                         this.nextState = 'removing';
                         this.currentPiece = null;
                         this.lastTick = this.tick;
                    }

                if (this.advanceLevel) {
                    this.speed -= 100;
                    if (this.speed < 100) this.speed = 50;
                    this.level++;
                    this.randomRowChance += 0.005;
                    this.advanceLevel = false;
                }

                if (this.nextState != 'removing') {
                    this.bonus = 0;
                    this.selectNewPiece();

                    if (this.hardCoreMode && Math.random() < 0.07) {
                        this.highestRow = this.calculateHighestRow();
                     this.highestRow += Math.floor(Math.random() * (this.rows - this.highestRow - 2));
                         if (this.highestRow < this.rows - 2 && this.highestRow === this.calculateHighestRow()) {
                             this.highestRow++;
                         }

                         this.lastTick = this.tick;
                         this.gameTick = false;
                         this.nextState = 'randomRow'
                     }

                }

                }
        }
        this.shadowY = this.currentY;
    }

    this.gameState = this.nextState;
    requestAnimationFrame(this.loop);
}
}