class Tetris
{
  /*
  Each tetris object will represent a game of tetris.
  Will have a player and a board (empty board is just where the Tetris pieces
  fall).
  */
    constructor(element){
      this.element = element;
      this.canvas = element.querySelector('canvas');
      this.context = this.canvas.getContext('2d');
      this.context.scale(20,20);

      this.board = new Board(12,20);
      this.player = new Player(this);

      this.player.events.listen('score', score => {
        this.updateTheScore(score);
      });


      this.colors =[
        null,
        'red',
        'blue',
        'violet',
        'green',
        'purple',
        'orange',
        'pink',
      ];

      let lastTime = 0
      this._update = (time = 0 ) => {
        const timeDifference = time - lastTime;
        lastTime = time ;
        this.player.update(timeDifference);
        // Shows running time difference testing purposes console.log(timeDifference);
        this.draw();
        requestAnimationFrame(this._update);
      };
        this.updateTheScore(0);

    }
    /*
    Description: Draws the whole tetris game.
    Pre: None
    Post: Will draw on the canvas/context of the tetris object.
    Return: None
    */
    draw(){
      this.context.fillStyle = '#000';
      this.context.fillRect(0,0,this.canvas.width,this.canvas.height);
      this.drawPiece(this.board.matrix, {x:0, y:0});
      this.drawPiece(this.player.matrix, this.player.pos);
    }

    /*
    Description: Draws the piece falling
    Pre: Takes the piece we're drawing (reprsented by a matrix), and where the pieces is.
    Post: Will draw on the canvas
    Return: None
    */
    drawPiece(matrix, offset){
      matrix.forEach((row,y) => {
          row.forEach((value,x) => {
              if (value !== 0) {
                  this.context.fillStyle = this.colors[value];
                  this.context.fillRect(x + offset.x, y + offset.y, 1, 1);
              }
          });
      });
    }

    /*
    Description: Update the Board
    */
    run(){
      this._update();
    }

    /*
    Description: Update the score
    */
   updateTheScore(score) {
      this.element.querySelector('.score').innerText = score;
    }

    /*
    Description: Package the data of the tetris game up to send to server. (JSON)
    Pre: None
    Post: None
    Return: The board and player's information
    */
    serialize()
    {
      return {
        board: {
          matrix: this.board.matrix,
        },
        player: {
          matrix: this.player.matrix,
          pos: this.player.pos,
          score: this.player.score,
        },
      };
    }

    /*
    Description: Unpackage the information given and update the board accordingly.
    Pre: A JSON file containing information of a tetris game
    Post: Changes the board and player information of our tetris game
    Return: None
    */
    unserialize(state)
    {
      this.board = Object.assign(state.board);
      this.player = Object.assign(state.player);
      this.updateTheScore(this.player.score);
      this.draw();
    }
}
