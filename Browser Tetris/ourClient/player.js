class Player {
  /*
  A player object will have drop speeds, events that could occur, a game
  board, a tetris game, a piece, a position of the pieces and a score.
  */
  constructor(tetris){
    this.dropSlow = 1000;
    this.dropFast = 50;
    this.events = new Events() ;
    this.tetris = tetris;
    this.board = tetris.board;
    this.dropCounter = 0;
    this.dropInterval = this.dropSlow; // miliseconds aka 1 sec
    this.pos = {x:0, y:0};
    this.matrix = null;
    this.score = 0;
    this.reset();
  }

  /*
  Description: Move the dropping piece.
  Pre: The direction we're moving.
  Post: Will draw the piece in a new position on the board. Will send the
        data of the pieces new position out to server.
  Return: None
  */
  move(dir) {
    this.pos.x += dir;
    if(this.board.collide(this)){
      this.pos.x -= dir;
      return;
    }
    this.events.emit('pos', this.pos);
  }

  /*
  Description: To rotate the falling piece. stops piece from sliding through wall
  Pre: The direction we're rotating the piece.
  Post: Will rotate the piece. Sends the data of the piece's new
        position out to server.
  Return: None
  */
  rotate(dir){
    const pos = this.pos.x;
    let offset = 1;
    this.rotatePiece(this.matrix, dir);
    while (this.board.collide(this)){
      this.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > this.matrix[0].length) {
        this.rotatePiece(this.matrix, -dir);
        this.pos.x = pos;
        return;
      }
    }
    this.events.emit('matrix', this.matrix);
  }

  /*
  Description: To drop the piece based on interval or if we say to drop
  Pre: None
  Post: Will draw the piece in one lower position. Sends the data of the
        pieces new position out.
  Return: None
  */
  drop(){
      this.pos.y++;
      this.dropCounter = 0 ;
      if(this.board.collide(this)) {
        this.pos.y--;
        this.board.merge(this);
        this.reset();
        this.score += this.board.clearRow() ;
        this.events.emit('score', this.score);
        return;
      }
      this.events.emit('pos', this.pos);

  }

  /*
  Description: Increment time slowly
  Pre: The time that's passed
  Post: None
  Return: None
  */
  update(timeDifference){
    this.dropCounter += timeDifference;
    //If time passes by move piece down
    if(this.dropCounter > this.dropInterval){
      this.drop();
    }
  }

  /*
  Description: Creates a new tetris piece.
  Pre: None
  Post: Will create a new tetris piece. Reset score to 0. Send
        information about the score, board and piece position to server.
  Return: None
  */
 reset(){
    const pieces = 'ZTSOJLI';
    this.matrix = this.createPiece(pieces[pieces.length* Math.random() | 0]) ;
    this.pos.y = 0 ;
    this.pos.x = (this.board.matrix[0].length/2 |0) - (this.matrix[0].length / 2 | 0) ;

    if (this.board.collide(this)){
      this.board.clear();
      this.score = 0;
      this.events.emit('score', this.score);
    }
    this.events.emit('pos', this.pos);
    this.events.emit('matrix', this.matrix);
  }
  /*
  Description: Rotate the falling piece.
  Pre: The piece we're rotating (as a matrix), the direction we're rotating.
  Post: Will rotate the piece.
  Return: None
  */
  rotatePiece(matrix, dir){
    for (let y = 0; y < matrix.length; ++y) {
      for (let x = 0; x < y; ++x){
        [
            matrix[x][y], matrix[y][x],
        ] = [
            matrix[y][x], matrix[x][y],
            ]
      }
    }
    if (dir > 0) {
      matrix.forEach(row => row.reverse());
    } else {
      matrix.reverse();
    }
  }

/*
Below is how we represent each piece. The 0's represent 'empty' space, the
numbers represent solids. Each number represents a different color aswell. 
*/
 createPiece(type){
    if (type === 'T'){
      return [
        [0,0,0],
        [1,1,1],
        [0,1,0],
      ];
    }else if (type === 'O'){
      return [
        [2,2],
        [2,2],
      ];
    }else if (type === 'L'){
       return [
         [0,3,0],
         [0,3,0],
         [0,3,3],
       ];
    }else if (type === 'J'){
       return [
         [0,4,0],
         [0,4,0],
         [4,4,0],
       ];
    }else if (type === 'I'){
      return [
       [0,5,0,0],
       [0,5,0,0],
       [0,5,0,0],
       [0,5,0,0],
     ];
   }else if (type === 'S'){
      return [
        [0,6,6],
        [6,6,0],
        [0,0,0],
      ];
  }
  else if (type === 'Z'){
     return [
       [7,7,0],
       [0,7,7],
       [0,0,0],
     ];
   }
  }

}
