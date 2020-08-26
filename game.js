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
        this.gameMode = 0;
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
        this.pentrisNormalScore = 0;
        this.pentrisHardScore = 0;
        this.hints = true;
        this.hintsAllowed = true;
        this.rotation = 0;
        this.speed = 1000;
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

                        ctx.drawImage(blocks, this.currentPiece * 32, 0, 32, 32, this.originX + (this.currentX + px) * this.cellSize,
                                      this.originY + (this.currentY + py)* this.cellSize, this.cellSize, this.cellSize);

                    }
                }
            }
        }

        for (let px = 0; px < this.gameMode; px ++) {
            for (let py = 0; py < this.gameMode; py ++) {

                if (this.pieces[this.nextPiece][this.rotate(px, py, 0)] === 'X') {
                    ctx.drawImage(blocks, this.nextPiece * 32, 0, 32, 32, this.wWidth - 7 * this.cellSize * this.scale +  px * this.cellSize * this.scale,
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
        

        this.shadowX = this.currentX = this.cols / 2 - 1;
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

    handleClick() {

        if (this.gameState === 'gameOver') {
            this.restartGame();
        }

        if (this.gameState === 'titleScreen') {
            if (this.isClicked( this.wWidth / 2 - startButton.width / 2, this.wWidth / 2 + startButton.width / 2,
                           this.wHeight * 0.7, this.wHeight * 0.7 + startButton.height)) {

                    this.nextState = 'modeSelect';
            }
        }

        if (this.gameState === 'modeSelect') {
            if (this.isClicked(this.wWidth / 2 - 285 * this.scale - this.wWidth / 8, this.wWidth / 2 - this.wWidth / 8,
                          this.wHeight * 0.75, this.wHeight * 0.75 + 55 * this.scale)) {

                    this.gameMode = 4;
                    this.rows = 18;
                    this.cols = 12;
                    this.cellSize = Math.floor(this.wHeight * 0.95 / this.rows);
                    this.gWidth = this.cellSize * this.cols;
                    this.gHeight = this.cellSize * this.rows;
                    this.originX = Math.floor((this.wWidth - this.gWidth) / 2);
                    this.originY = Math.floor((this.wHeight - this.gHeight) / 2);
                    // this.hardCoreMode = false;
                    this.hintsAllowed = true;
                    this.hints = true;
                    this.pieces = this.tetrominos;
                    this.createGrid();
                    this.selectNewPiece();
                    this.ongoingPlay = true;
                    this.ongoingPlay = true;
                    this.nextState = 'playing';
            }

            else if (this.isClicked(this.wWidth / 2 + this.wWidth / 8, this.wWidth / 2 + this.wWidth / 8 + 366 * this.scale,
                               this.wHeight * 0.75, this.wHeight * 0.75 + 55 * this.scale)) {
                                this.gameMode = 5;
                                this.rows = 24;
                                this.cols = 14;
                                this.cellSize = Math.floor(this.wHeight * 0.95 / this.rows);
                                this.gWidth = this.cellSize * this.cols;
                                this.gHeight = this.cellSize * this.rows;
                                this.originX = Math.floor((this.wWidth - this.gWidth) / 2);
                                this.originY = Math.floor((this.wHeight - this.gHeight) / 2);
                    
                    // this.hardCoreMode = true;
                     this.pieces = this.pentominos;
                     this.hints = true;
                     this.hintsAllowed = true;
                     this.createGrid();
                     this.selectNewPiece();
                     this.ongoingPlay = true;
                     this.nextState = 'playing';
            }
        }
    }


cls() {
    ctx.save();
    switch (this.gameState) {
        case 'titleScreen':
        case 'modeSelect':
            ctx.fillStyle = `rgba(${80 + 20 * Math.sin(this.elapsedTime / 600)}, 0, 0)`;
        break;
        default:
            ctx.fillStyle = `rgba(16, 25, 41, 1)`;
    }

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
}

drawGrid() {
    for (let x = 0; x < this.cols; x++) { 
         for (let y = 0; y < this.rows; y++) { 
            if ((this.grid[y * this.cols + x]) != null) {
                ctx.drawImage(blocks, this.grid[y * this.cols + x] * 32, 0, 32, 32, 
                              this.originX + x * this.cellSize, this.originY + y * this.cellSize, this.cellSize, this.cellSize);
            }
           
        }
        
    }
}

drawInfo() {
    // ctx.drawImage(textSheet, 675, 400, 233, 35, 30 * this.scale, 20 * this.scale, 233 * this., 35 * this.scale);
    // let s = this.gameMode === TETRIS ? this.tetrisScore.toString() : this.hardCoreMode ? 
    //                           this.pentrisHardScore.toString() : this.pentrisNormalScore.toString();
    // let count = 0;
    // for (char of s) {
    //     ctx.drawImage(textSheet, +char * 32, 122, 31, 28, 275 * this.scale + count * 32 * this., 22 * this.scale, 32 * this., 27 * this.scale);
    //     count++;
    // }


    ctx.drawImage(textSheet, 0, 0, 127, 27, 30 * this.scale, 70 * this.scale, 127 * this.scale, 27 * this.scale);
        // let s = this.gameMode === TETRIS ? this.tetrisScore.toString() : this.hardCoreMode ? 
        // this.pentrisHardScore.toString() : 
        let s = this.pentrisNormalScore.toString();
        let count = 0;
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
    this.currentPiece = null;
    this.nextPiece = null;
    this.ongoingPlay = false;
    this.nextState = 'titleScreen';   
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
        this.ongoingPlay = false;
        let w = title.width;
        let h = title.height;

        //Title
        ctx.save();
        ctx.transform(1, 0, 0, 1, (this.wWidth - w * this.scale) / 6 * Math.sin(this.elapsedTime / 3000) , this.wHeight * 0.02 * Math.cos(this.elapsedTime/750));
        ctx.drawImage(title, 0, 322 * (Math.floor(this.tick / 60) % 3), w, 322, (this.wWidth - w * this.scale) / 2, this.wHeight / 10 * this.scale,
                       w * this.scale, 322 * this.scale);
        ctx.restore();

        //Start Game Button Animation
        if (this.isClicked((this.wWidth - 476 * this.scale) / 2, (this.wWidth + 476 * this.scale) / 2,
                       this.wHeight * 0.7, this.wHeight * 0.7 + 90 * this.scale)) {
                this.scale += 0.05 * Math.sin(this.elapsedTime/150)
        }

        ctx.drawImage(textSheet, 300, 0, 476, 95, (this.wWidth - 476 * this.scale) / 2, this.wHeight * 0.7, 476 * this.scale, 90 * this.scale);

        ctx.drawImage(cursor, mouseX - 32, mouseY - 32);
    }

    if (this.gameState === 'modeSelect') {
        let w = title.width;
        let h = title.height;
        let normalHover;
        let hardCoreHover;

        ctx.save();
        //Title
        ctx.transform(1, 0, 0, 1, (this.wWidth - w * this.scale) / 6 * Math.sin(this.elapsedTime / 3000) , this.wHeight * 0.02 * Math.cos(this.elapsedTime/750));
        ctx.drawImage(title, 0, 322 * (Math.floor(this.tick / 60) % 3), w, 322, (this.wWidth - w * this.scale) / 2, this.wHeight / 10 * this.scale,
                       w * this.scale, 322 * this.scale);
        ctx.restore();

        //Select game mode
        ctx.drawImage(textSheet, 0, 300, 935, 100, (this.wWidth - 935 * this.scale) / 2, this.wHeight * 0.55, 935 * this.scale, 100 * this.scale);

        //Hover animations
        if (this.isClicked(this.wWidth / 2 - 285 * this.scale - this.wWidth / 8, this.wWidth / 2 - this.wWidth / 8,
                      this.wHeight * 0.75, this.wHeight * 0.75 + 55 * this.scale)) {
            this.scale += 0.05 * Math.sin(this.elapsedTime/150);
            normalHover = true;
        }

        ctx.drawImage(textSheet, 0, 420, 285, 55, this.wWidth / 2 - 285 * this.scale - this.wWidth / 8,
                      this.wHeight * 0.75, 285 * this.scale, 55 * this.scale);

        this.scale = this.wWidth / sWidth;

        if (this.isClicked(this.wWidth / 2 + this.wWidth / 8, this.wWidth / 2 + this.wWidth / 8 + 366 * this.scale,
                      this.wHeight * 0.75, this.wHeight * 0.75 + 55 * this.scale)) {
            this.scale += 0.05 * Math.sin(this.elapsedTime/150);
            hardCoreHover = true;
        }

           ctx.drawImage(textSheet, 300, 420, 366, 55, this.wWidth / 2 + this.wWidth / 8,
                         this.wHeight * 0.75, 366 * this.scale, 55 * this.scale);

           this.scale = this.wWidth / sWidth;

        //Mode explanation
        if (normalHover) {
            ctx.drawImage(textSheet, 350, 100, 225, 55, this.wWidth / 2 - 285 * this.scale - this.wWidth / 8,
                          this.wHeight * 0.75 + 80 * this.scale, 225 * this.scale, 55 * this.scale);
        }
        if (hardCoreHover) {
            ctx.drawImage(textSheet, 600, 100, 285, 55, this.wWidth / 2 + this.wWidth / 8,
                          this.wHeight * 0.75 + 80 * this.scale, 285 * this.scale, 55 * this.scale);
        }

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
        ctx.drawImage(textSheet, 0, 160, 875, 105, this.wWidth / 2 - 437 * this.scale,
                      this.wHeight / 2 - 52 * this.scale, 875 * this.scale, 105 * this.scale);
        // if (hardCoreMode && score > hHighScore) {
        //     hHighScore = score;
        // }

        // if(!hardCoreMode && score > nHighScore) {
        //     nHighScore = score;
        // }

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

        for (let px = 1; px < this.cols -1; px ++) {
                this.grid[this.highestRow * this.cols + px] = Math.random() < 0.33 ? null : Math.floor(Math.random() * 18);
        }

        if (tick - lastTick > 10) {
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
                    this.level++;
                    this.advanceLevel = false;
                }

                if (this.nextState != 'removing') {
                    this.bonus = 0;
                    this.selectNewPiece();

                    // if (hardCoreMode && Math.random() < 0.05) {
                    //     this.highestRow = this.calculatehighestRow();
                    //  this.highestRow += Math.floor(Math.random() * (this.rows - this.highestRow - 2));
                    //      if (this.highestRow < this.rows - 2 && this.highestRow === this.calculatehighestRow()) {
                    //          this.highestRow++;
                    //      }

                    //      lastTick = tick;
                    //      gameTick = false;
                    //      this.nextState = 'randomRow'
                    //  }
                }

                }
        }
        this.shadowY = this.currentY;
    }

    this.gameState = this.nextState;
    requestAnimationFrame(() => this.gameLoop());
}


}