# Block Mayhem

A combination of my two earlier projects - tetris and pentris into one single game.

The beginning was a video by Javidx9 about programming tetris. I converted the code to Javascript. Later I decided to make a pentris version and add some graphics. Then I gradually expanded the game adding some other new features.

Now added cloud save functionality. I included a sample of my very very simple backend server code, which only can save and load one file.
If failed to load save from cloud, the game uses local storage of the browser.
You can play the game at: https://blockmayhem.glitch.me

Controls:
Left Arrow & Right Arrow - move left & right
Up Arrow - rotate
Down Arrow - move down
Space - drop piece (no sliding after drop)
H - toggle aim assist (not avaiable in hardcore mode)
P - pause
D - Discard unwanted piece before it falls halfway (max 5 pieces at any given time
R: Release discarded piece as next piece (only if different than next piece and if last released piece has entered the board)
S: Toggle display of statistics during game

Skill level - you start with 3, 6 or 9 lines randomly filled with blocks
Hardcore mode - no aim assist, once in a while a random line will become scrambled
