let scl = 20;
let cols;
let rows;
let board;	// matrix
let Score = 0;

function initialSetup() {
	cols = floor(width/scl);
  rows = floor(height/scl);
	board = [];
	for (let i = 0; i < rows; i++) {
		board[i] = [];
		for (let j = 0; j < cols; j++) {
			board[i][j] = 0;
		}
	}
}

function setup() {
	createCanvas(200, 400);
	background(0);
	frameRate(5); // old game style
	initialSetup();
	p = new Piece(); // create a piece object
}

function draw() {
	if(p.endGame == false){
		background(0);
		if (p.finish){
			p = new Piece();
		}
  	p.down();
		p.show();
		p.point();
	}
}

function keyPressed() {
  if (keyCode === UP_ARROW){
    p.rotate();
  } else if (keyCode === DOWN_ARROW) {
    p.down();
  } else if (keyCode === RIGHT_ARROW) {
    p.rightleft(1);
  } else if (keyCode === LEFT_ARROW) {
		p.rightleft(-1);
  }
}

function reloadGame() {
	for (let i = 0; i < rows; i++) {
		board[i] = [];
		for (let j = 0; j < cols; j++) {
			board[i][j] = 0;
		}
	}
	p = new Piece();
	Score = 0;
}

class Piece {
	constructor() {
		this.x = width/2 - 2*scl;
		this.y = -40;
		this.pos = floor(random(3)); /* piece appear inially with a random rotation */
	  //this.type = this.chooseShape();
		let vector = [ I, J, L, O, S, T, Z ];
		this.type = vector[floor(random(6))];
		this.shape = this.type[this.pos];
		this.finish = false;
		this.endGame = false;
	}

  down() {
    if(this.collide(0, 1, this.shape) == 0) {
      this.y = this.y + scl;
    } else {
      this.lock(); /* the piece can't go down anymore! */
    }
  }

  rotate() {
    let pos;
    if (this.pos == 3) {
      pos = 0;
    } else {
      pos = this.pos + 1;
    }
    /* I provide to the collide func the next shape in the array: it is a temporary shape */
    if (this.collide(0, 0, this.type[pos]) == 0){
      this.pos = pos;
      this.shape = this.type[this.pos];
    }
  }

  rightleft(num) {
    if(this.collide(num, 0, this.shape) == 0){
      this.x = this.x + num*scl;
    }
  }

  collide(dx, dy, shape) {
    /* dx and dy define the particular move */
    for(let i = 0; i < shape[1].length; i++){
  		for(let j = 0; j < shape[1].length; j++){
        if (shape[i][j] == 0){
          continue; /* go to the next item defined by for loop */
        }

				let x = this.x/scl + i + dx;
				let y = this.y/scl + j + dy;

				if (y < 0) {
					continue; /* Ignore negative rows */
				}

        if (x < 0 || x > cols -1) {
          return 1; /* WALL reached */
        }

				if(y > rows-1){
					return 2; /* Bottom reahed */
				}

				if (board[y][x] != 0){
					return 3; /* Piece collision */
				}
  		}
  	}
    return 0; /* move allowed */
  }

  lock() {
    for(let i = 0; i < this.shape[1].length; i++){
  		for(let j = 0; j < this.shape[1].length; j++){

				if (this.shape[i][j] == 0){
          continue;
        }

        let x = this.x/scl + i;
        let y = this.y/scl + j;

				if (y < 0) {
					this.endGame = true;
					return;
				}
        board[y][x] += this.shape[i][j];
      }
  	}
    this.finish = true;
  }

  show() {
			/* shows the current Piece obj AND the board */
      fill(255);
      /* SHOW PIECE */
      for (let i = 0; i < this.shape[1].length; i++) {
        for (let j = 0; j < this.shape[1].length; j++) {

          if (this.shape[i][j] == 0){
            continue;
          }

          let x = this.x/scl + i;
          let y = this.y/scl + j;

          if (y < 0) {
            continue; /* Ignore negative rows */
          }
          rect(x*scl, y*scl, scl, scl);
        }
      }
			/* SHOW BOARD */
 		 for (let i = 0; i < rows; i++) {
 			 for (let j = 0; j < cols; j++) {
 				 if (board[i][j] != 0){
 						 rect(j*scl, i*scl, scl, scl);
 				 }
 			 }
 		 }
   }

 point() {
		 let flag = true;
		 for(let i = rows -1; i >= 0; i--){
			 for (let j = 0; j < cols; j++){
				 if (board[i][j] == 0) {
					 flag = false;
				 }
			 }
			 if (flag == true){
				 /* an entire row is full of ones! Should be elminated */
				 for (let k = i-1; k >= 0; k --){
					 for (let l = 0; l < cols; l++){
						 board[k+1][l] = board[k][l];
					 }
				 }
				 for (let l = 0; l < cols; l++){
					 board[0][l] = 0;
				 }
				 Score += 1;
			 }
			 let lblScore = document.getElementById('lblScore');
			 lblScore.innerHTML=Score;
			 flag = true;
		 }
	 }
}
