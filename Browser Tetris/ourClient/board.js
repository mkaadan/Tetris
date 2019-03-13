class Board {
  /*
  Each board object will represent an instance of a tetris game
  */
  constructor(w, h){
    const piece = [];
    while (h--){
      piece.push(new Array(w).fill(0));
    }
    this.matrix = piece;
    this.events = new Events;
  }

  /*
  Description: Remove a 'complete' row
  Pre: None
  Post: Will take things off the gameboard. Move other things down.
        Will send information to server regarding the game board.
  Return: The new score.
  */
  clearRow(){
    let rowCount = 1;
    let score = 0;
    outher: for(let y = this.matrix.length -1 ; y > 0; --y){
      for (let x = 0; x < this.matrix[y].length; ++x){
        if(this.matrix[y][x] === 0){
          continue outher;
        }
      }
  //to get an extra black row when player fills the bottom row
      const row = this.matrix.splice(y, 1)[0].fill(0) ;
      this.matrix.unshift(row);
      ++y ;
      score += rowCount * 10;
      rowCount *= 2;

    }
    this.events.emit('matrix', this.matrix) ;
    return score;
  }

  /*
  Description: Clear all pieces from the game board
  Pre: None
  Post: Gameboard will appear empty.
  return: None
  */
  clear(){
    this.matrix.forEach(row => row.fill(0));
    this.events.emit('matrix', this.matrix) ;
  }

  /*
  Description: When a falling piece falls onto a grounded piece, this function
               Will cause the falling piece to stop.
  Pre: The player playing the tetris instance.
  Post: Sends board information to server.
  Return: None
  */
  merge(player){
    player.matrix.forEach((row,y) => {
      row.forEach((value,x) => {
        if (value !== 0){
          this.matrix[y + player.pos.y][x + player.pos.x] = value ;
        }
      });
    });
    this.events.emit('matrix', this.matrix) ;
  }

  /*
  Description: Prevents pieces from moving out of the board.
  Pre: The player playing the tetris instance.
  Post: None
  Return: True if we have a collision, false otherwise. 
  */
  collide(player){
    const [m, o] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; ++y){
      for (let x = 0; x < m[y].length; ++x){
        if (m[y][x] !== 0 && (this.matrix[y+o.y] && this.matrix[y+o.y][x+o.x]) !== 0) {
          return true;
        }
      }
    }
    return false;
  }
}
