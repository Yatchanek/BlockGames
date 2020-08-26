class Game {
    constructor() {
        this.wWidth = window.innerWidth;
        this.wHeight = window.innerHeight;
        this.scale = this.wWidth / window.screen.width;       
        this.lastTime = 0;
        this.gameState = 'titleScreen';
        this.nextState = 'titleScreen';
        this.grid = [];
        this.fullLines = [];
        this.keys = [];
        this.pieces = [];
        this.tetrominos = [
            '..X...X...X...X.',
            '..X..XX...X.....',
            '.....XX..XX.....',
            '..X..XX..X......',
            '.X...XX...X.....',
            '.X...X...XX.....',
            '..X...X..XX.....',
        ];
        this.pentominos = [
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
        ];
        this.blocks;
        this.rows = 18;
        this.cols = 12;
        this.gameMode = TETRIS;
        this.currentPiece = null;
        this.nextPiece = null;
        this.hardCoreMode = false;
        this.advanceLevel = false;
        this.keyHold = false;
        this.tick = 0;
        this.lastTick = 0;
        this.linesCount = 0;
        this.elapsedTime = 0;
        this.tickElapsedTime = 0;
        this.lastTime = 0;
        this.delta = 0;
        this.score = 0;
        this.level = 1;
        this.bonus = 0;
        this.tetrisScore = 0;
        this.tetrisHardScore = 0;
        this.pentrisScore = 0;
        this.pentrisHardScore = 0;
        this.skillLevel = 0;
        this.hints = true;
        this.hintsAllowed = true;
        this.rotation = 0;
        this.speed = 1000;
        this.randomRowChance = 0.05;
    }

    rotate(px, py, r) {
        let pIndex = 0;
        switch(r % 4) {
            case 0:
            pIndex = py * this.gameMode + px;
            break;
            case 1:
            pIndex = this.gameMode * (this.gameMode - 1 ) + py - (px * this.gameMode);
            break;
            case 2:
            pIndex = this.gameMode**2 - 1 - (py * this.gameMode) - px;
            break;
            case 3:
            pIndex = this.gameMode - 1 - py + (px * this.gameMode);
            break;
        }
        return pIndex;
    }

    drawPiece() {
        if (this.currentPiece != null) {
            for (let px = 0; px < this.gameMode; px ++) {
                for (let py = 0; py < this.gameMode; py ++) {
                    if (this.pieces[this.currentPiece][this.rotate(px, py, this.rotation)] === 'X') {

                        ctx.drawImage(this.blocks, this.currentPiece * 32, 0, 32, 32, this.originX + (this.currentX + px) * this.cellSize,
                                      this.originY + (this.currentY + py)* this.cellSize, this.cellSize, this.cellSize);
                    }
                }
            }
        }

        for (let px = 0; px < this.gameMode; px ++) {
            for (let py = 0; py < this.gameMode; py ++) {

                if (this.pieces[this.nextPiece][this.rotate(px, py, 0)] === 'X') {
                    ctx.drawImage(this.blocks, this.nextPiece * 32, 0, 32, 32, this.wWidth - 7 * this.cellSize * this.scale +  px * this.cellSize * this.scale,
                                   this.cellSize * this.scale * 2 + py * this.cellSize * this.scale, this.cellSize * this.scale, this.cellSize * this.scale)
                }
            }
        }
    }

    drawShadow() {
        if (this.currentPiece != null && !this.dropped) {
            for (let px = 0; px < this.gameMode; px ++) {
                for (let py = 0; py < this.gameMode; py ++) {
                    if (this.pieces[this.currentPiece][this.rotate(px, py, this.rotation)] === 'X') {
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


    fits(x, y, r) {
        if (this.currentPiece !=null) {
            for (let px = 0; px < this.gameMode; px ++) {
                for (let py = 0; py < this.gameMode; py ++) {
                    let pIndex = this.rotate(px, py, r);
                    let gIndex = (y + py) * this.cols + (x + px);

                    if (x + px >= 0 && x + px < this.cols) {
                        if (y + py >=0 && y + py < this.rows) {

                            if (this.pieces[this.currentPiece][pIndex] === 'X' && this.grid[gIndex] != null) {
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
        let pieceCount = this.gameMode === TETRIS ? 7 : 18;
        if (this.nextPiece === null) {
            this.nextPiece = Math.floor(Math.random() * pieceCount );
        }
        

    
        this.currentPiece = this.nextPiece;
        this.nextPiece = Math.floor(Math.random() * pieceCount);
        
        let off = pieceCount = this.gameMode === TETRIS ? 1 : 2;
        this.shadowX = this.currentX = this.cols / 2 - off;
        this.shadowY = this.currentY = 0;
        this.rotation = 0;
        this.dropped = false;
        
    }

    dropSelf() {
        while(this.fits(this.currentX, this.currentY + 1, this.rotation)) {
            this.currentY++;
            this.bonus += 0.05;
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
           this.blocks = blocks2;
           this.pieces = this.tetrominos;
        }
        else {
            this.rows = 24;
            this.cols = 14;
            this.blocks = blocks;
            this.pieces = this.pentominos;
        }

        if (this.hardCoreMode) {
            this.hints = false;
            this.hintsAllowed = false;
        }
        
        this.cellSize = Math.floor(this.wHeight * 0.95 / this.rows);
        this.gWidth = this.cellSize * this.cols;
        this.gHeight = this.cellSize * this.rows;
        this.originX = Math.floor((this.wWidth - this.gWidth) / 2);
        this.originY = Math.floor((this.wHeight - this.gHeight) / 2);

        this.ongoingPlay = true;
        this.createGrid();
        this.selectNewPiece();
        this.nextState = 'playing'
    }

    handleClick() {

        if (this.gameState === 'gameOver') {
            this.restartGame();
        }

        if (this.gameState === 'titleScreen') {
            if (this.isClicked((this.wWidth - 476 * this.scale) / 2, (this.wWidth + 476 * this.scale) / 2,
                       this.wHeight - (120 * this.scale), this.wHeight - 30 * this.scale))  {
                    this.configure();
            }
        

        //Game Mode
            if(this.isClicked(450 * this.scale,  620 * this.scale, 
                          this.wHeight * 0.5, this.wHeight * 0.5 + 37 * this.scale)) {
                           
                this.gameMode = TETRIS;
            }

            if(this.isClicked(720 * this.scale, 922 * this.scale, 
                          this.wHeight * 0.5, this.wHeight * 0.5 + 37 * this.scale)) {
                            
                this.gameMode = PENTRIS;
        }

        //Skill Level
        if(this.isClicked(430 * this.scale,  474 * this.scale, 
            this.wHeight * 0.6, this.wHeight * 0.6 + 37 * this.scale)) {
             
                this.skillLevel = 0;
        }

        if(this.isClicked(500 * this.scale,  544 * this.scale, 
            this.wHeight * 0.6, this.wHeight * 0.6 + 37 * this.scale)) {
             
                this.skillLevel = 3;
        }

        if(this.isClicked(570 * this.scale,  614 * this.scale, 
            this.wHeight * 0.6, this.wHeight * 0.6 + 37 * this.scale)) {
             
                this.skillLevel = 6;
        }

        if(this.isClicked(640 * this.scale,  688 * this.scale, 
            this.wHeight * 0.6, this.wHeight * 0.6 + 37 * this.scale)) {
             
                this.skillLevel = 9;
        }

        //Hardcore Mode
        if(this.isClicked(552 * this.scale, 643 * this.scale, this.wHeight * 0.7, this.wHeight * 0.7 + 37 * this.scale)) {
            this.hardCoreMode = true;
        }

        if(this.isClicked(684 * this.scale, 794 * this.scale, this.wHeight * 0.7, this.wHeight * 0.7 + 37 * this.scale)) {
            this.hardCoreMode = false;
        }
    }


    ctx.drawImage(textSheet, 0, 122, 31, 30, 430 * this.scale, this.wHeight * 0.6, 44 * this.scale, 37 * this.scale)
    ctx.drawImage(textSheet, 94, 122, 31, 30, 500 * this.scale, this.wHeight * 0.6, 44 * this.scale, 37 * this.scale)
    ctx.drawImage(textSheet, 191, 122, 31, 30, 570 * this.scale, this.wHeight * 0.6, 44 * this.scale, 37 * this.scale)
    ctx.drawImage(textSheet, 287, 122, 31, 30, 640 * this.scale, this.wHeight * 0.6, 44 * this.scale, 37 * this.scale)



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
            this.grid[y * this.cols + x] = (x === 0 || x === this.cols - 1 || y === this.rows - 1) ? 20 : null;      
        }
    }

    if (this.skillLevel > 0) {
        let top = this.rows - this.skillLevel - 2;
        let c = this.gameMode === TETRIS ? 7 : 18;
        let gapCount;
        do {
            gapCount = 0;
            for (let y = this.rows - 2; y > top; y--) {
                for (let x = 1; x < this.cols - 1; x++) {
                    this.grid[y*this.cols + x] = Math.random() < 0.3 ? random(c) : null;
                    if(this.grid[y*this.cols + x] === null) gapCount++;
                }
            } 
        } while (gapCount <=3 && gapCout >= this.cols - 6);
    }
}

drawGrid() {
    for (let x = 0; x < this.cols; x++) { 
         for (let y = 0; y < this.rows; y++) { 
            if ((this.grid[y * this.cols + x]) != null) {
                ctx.drawImage(this.blocks, this.grid[y * this.cols + x] * 32, 0, 32, 32, 
                              this.originX + x * this.cellSize, this.originY + y * this.cellSize, this.cellSize, this.cellSize);
            }
           
        }
        
    }
}

drawInfo() {
     ctx.drawImage(textSheet, 130, 0, 235, 35, 30 * this.scale, 20 * this.scale, 235 * this.scale, 35 * this.scale);
     let s;
     if (this.hardCoreMode) {
        this.gameMode === TETRIS ? s = this.tetrisHardScore.toString() : s = this.pentrisHardScore.toString();
    }
    else {
       this.gameMode === TETRIS ? s = this.tetrisScore.toString() : s = this.pentrisScore.toString();
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


isClicked(x1, x2, y1, y2) {
    return (mouseX > x1 && mouseX < x2 && mouseY > y1 && mouseY < y2);
}

run() {
    requestAnimationFrame(() => this.gameLoop());
}

resize() {
    this.wWidth = gameWindow.width = window.innerWidth;
    this.wHeight = gameWindow.height = window.innerHeight;
    this.cellSize = Math.floor(this.wHeight * 0.95 / this.rows);
    this.gameHeight = this.cellSize * this.rows;
    this.gameWidth = this.cellSize * this.cols;
    this.originX = Math.floor((this.wWidth - this.gWidth) / 2); 
    this.originY = Math.floor((this.wHeight - this.gHeight) / 2);
    this.scale = this.wWidth / sWidth;
}

restartGame() {
    this.score = 0;
    this.linesCount = 0;
    this.level = 1;
    this.bonus = 0;
    this.speed = 1000;
    this.keys = [];
    this.ongoingPlay = false;
    this.nextState = this.gameState = 'titleScreen';   
}

checkKeyInput() {

    if (this.gameState != 'paused' && this.gameState != 'titleScreen') {
        //Left Arrow
        if (this.keys[37] && !this.dropped && this.fits(this.currentX-1, this.currentY, this.rotation)) {
            this.currentX--;
    }

    //Right Arrow
    if (this.keys[39] && !this.dropped && this.fits(this.currentX+1, this.currentY, this.rotation)) {
        this.currentX++;
        }
     //Up Arrow
        if (this.keys[38] && !this.dropped && !this.keyHold && this.fits(this.currentX, this.currentY, this.rotation+1)) {
        this.rotation++;
        this.keyHold = true;
        }
    //Down Arrow
        if (this.keys[40] && this.fits(this.currentX, this.currentY+1, this.rotation)) {
        this.currentY++;
        }
    //P
    if(this.keys[80]) {
        if (this.gameState === 'playing') {
            this.nextState = 'paused';
        } else if (this.gameState === 'paused')
        {
           this.nextState = 'playing'

        }
    }

    //H
    if (this.keys[72] && this.hintsAllowed) this.hints = !this.hints;

   //SPACE
    if (this.keys[32]) {
        this.dropSelf();
        this.dropped = true;
    }


    }

    if(this.keys[80]) {
        if (this.gameState === 'playing') {
            this.nextState = 'paused';
        } else if (this.gameState === 'paused')
        {
           this.nextState = 'playing'

        }
    }

    if (this.gameState === 'gameOver' && this.keys.length && this.tick - this.lastTick > 10) {
        this.restartGame();
    }

    this.keys = [];
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
    this.scale = this.wWidth / sWidth;
    this.delta = timestamp - this.lastTime;
    this.elapsedTime += this.delta;
    this.tickElapsedTime += this.delta;
    this.lastTime = timestamp;

    if (this.tickElapsedTime > 50) {
        this.tickElapsedTime = 0;
        this.tick++;
        this.gameTick = true;
    }

    this.cls();

    if (this.gameState === 'titleScreen') {
        let w = title.width;
        let h = title.height;

        //Title
        ctx.save();
        ctx.transform(1, 0, 0, 1, (this.wWidth - w * this.scale) / 6 * Math.sin(this.elapsedTime / 3000) , this.wHeight * 0.02 * Math.cos(this.elapsedTime/750));
        ctx.drawImage(title, 0, 322 * (Math.floor(this.tick / 60) % 3), w, 322, (this.wWidth - w * this.scale) / 2, this.scale,
                       w * this.scale, 322 * this.scale);
        ctx.restore();

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
        if (this.isClicked((this.wWidth - 476 * this.scale) / 2, (this.wWidth + 476 * this.scale) / 2,
                       this.wHeight - (120 * this.scale), this.wHeight - 30 * this.scale)) {
                this.scale += 0.05 * Math.sin(this.elapsedTime/150)
        }

        ctx.drawImage(textSheet, 370, 80, 420, 50, (this.wWidth - 420 * this.scale) / 2, this.wHeight - (120 * this.scale), 476 * this.scale, 50 * this.scale);

        ctx.drawImage(cursor, mouseX - 32, mouseY - 32);
    }

     if (this.ongoingPlay) {
        this.drawGrid();
        this.drawInfo();
        this.checkKeyInput()
        this.drawPiece();

        if(this.hints) {
            this.dropShadow();
            this.drawShadow();
        }
    }




    if (this.gameState === 'paused') {
        ctx.save();
        ctx.fillStyle = `rgba(16, 25, 41, 1)`;
        ctx.fillRect(this.originX + this.cellSize, this.originY, this.cellSize * (this.cols - 2), this.cellSize * (this.rows - 1));
        ctx.font = 'bold 100px "Arial Bold"';
        ctx.fillStyle = 'rgba(0, 0, 0, .5)'
        ctx.fillRect(this.wWidth / 2 - this.wWidth / 6, this.wHeight / 2 - this.wHeight / 6, this.wWidth / 3, this.wHeight / 3)
        let w = ctx.measureText('PAUSED').width;
        ctx.fillStyle = 'rgb(255, 255, 255)';
        ctx.fillText('PAUSED', this.wWidth / 2 - w / 2, this.wHeight / 2 + 25);
        ctx.restore();
    }


    if (this.gameState === 'gameOver') {
        ctx.drawImage(textSheet, 0, 160, 880, 100, this.wWidth / 2 - 440 * this.scale,
                      this.wHeight / 2 - 50 * this.scale, 880 * this.scale, 100 * this.scale);

        if (this.gameMode === TETRIS) {
            if (this.hardCoreMode && this.score > this.tetrisHardScore) {
                this.tetrisHardScore = this.score;
            } 
            else if (this.score > this.tetrisScore) {
                this.tetrisScore = this.score
            }       
        }  else {
            if (this.hardCoreMode && this.score > this.pentrisHardScore) {
                this.pentrisHardScore = this.score;
            } 
            else if (this.score > this.pentrisScore) {
                this.pentrisScore = this.score
            }    
        }            
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
        } while (gapCount >Math.floor(this.rows / 3))


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
            this.nextState = 'gameOver';
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
                        if (this.pieces[this.currentPiece][this.rotate(px, py, this.rotation)] === 'X') {
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
                         if (this.fullLines.length === 5) this.bonus *= 1.5;
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

                    if (this.hardCoreMode && Math.random() < 0.05) {
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
    requestAnimationFrame(() => this.gameLoop());
}
}