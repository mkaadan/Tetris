
const tetrisManager = new Manager(document);
const ourTetris = tetrisManager.createPlayer();
ourTetris.element.classList.add('local');
ourTetris.run();
const serverManager = new ServeManager(tetrisManager);
serverManager.connect('ws://localhost:9000');

/*
Listen for key presses (a, s, d, q, e. Move left for a, down for s,
                                          right for d, rotate counterclockwise for q,
                                          rotate clockwise for e.)
*/
const keyListener = (event) =>{
  [
    [65, 68, 81, 69, 83],
  ].forEach((key, index) => {
    const player = ourTetris.player;
    if (event.type === 'keydown'){
    //Left key pressed go left on x axis
      if(event.keyCode === key[0]){
        player.move(-1);
      }else if(event.keyCode === key[1]){
        player.move(1);
      } else if(event.keyCode == key[2]){
        player.rotate(-1);
      } else if (event.keyCode == key[3]){
        player.rotate(1);
      }
    }

      if(event.keyCode === key[4]){
          if (event.type === 'keydown'){
            if (player.dropInteveral !== player.dropFast){
              player.drop();
              player.dropInterval = player.dropFast;
            }
            } else {
              player.dropInterval = player.dropSlow;
            }
      }
  });
};

document.addEventListener('keydown', keyListener);
document.addEventListener('keyup', keyListener);
