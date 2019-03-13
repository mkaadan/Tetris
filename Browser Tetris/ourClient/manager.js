class Manager {
  /*
  Each manager object has access to the index.
  */
  constructor(document){
    this.document = document;

    this.instances = new Set;

    this.template = document.getElementById('player-template');

    const playerElements = document.querySelectorAll('.player');
    [...playerElements].forEach(element => {
      const tetris = new Tetris(element);
      this.instances.push(tetris);
    });
  }

  /*
  Description: Creates a new tetris game in a new instance.
  Pre: None
  Post: Manipulates DOM tree, creating a new tetris game.
  Return: The tetris game we've made.
  */
  createPlayer(){
    const element = this.document.importNode(this.template.content, true).children[0];
    const tetris = new Tetris(element);
    this.instances.add(tetris);

    this.document.body.appendChild(tetris.element);

    return tetris;
  }

  /*
  Description: Removes a player from the instance.
  Pre: The tetris game we're removing
  Post: Manipulates the dom tree, removing the tetris instance from it.
  Return: None
  */
  deletePlayer(tetris){
    this.instances.delete(tetris);
    this.document.body.removeChild(tetris.element);
  }
}
