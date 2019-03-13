class ServeManager {
  /*
  A ServeManager object will have a connection, a list of players, a manager and
  a local player.
  */
  constructor(manager){
    this.connection = null;
    this.players = new Map ;
    this.manager = manager;
    this.localPlayer = [...manager.instances][0];
  }

  /*
  Description: Create a connection to communicate to a server
  Pre: The address we want to connect to.
  Post: Creates a connection
  Return: None
  */
  connect(address){
    this.connection = new WebSocket(address);
    this.connection.addEventListener('open', () => {
      console.log("connection established!");
      this.initiate();
      this.watchEvents();
    });

    this.connection.addEventListener('message', event => {
      console.log('Received message', event.data);
      this.receive(event.data);
    });
  }

  /*
  Description: Watches for events to occur. Sends info when they do.
  Pre: None
  Post: Sends information to server
  Return: None
  */
  watchEvents(){

    const local = this.localPlayer;
    const player = local.player;
    ['pos','score','matrix'].forEach(property =>{
      player.events.listen(property, () => {
        this.send({
          type: 'state-update',
          fragment: 'player',
          state: [property, player[property]],
        });
      });
    });

    const board = local.board;
    ['matrix'].forEach(property =>{
      board.events.listen(property, () => {
        this.send({
          type: 'state-update',
          fragment: 'board',
          state: [property, board[property]],
        });
      });
    });
}

  /*
  Description: Connect and remove players.
  Pre: A Set of players
  Post: Could add or remove players, depending on how the set of players changes.
  Return: None
  */
  updateManager(players){
    const me = players.you;
    const clients = players.clients.filter(client => me !== client.id);
    clients.forEach(client => {
      if (!this.players.has(client.id)){
        const tetris = this.manager.createPlayer();
        tetris.unserialize(client.state);
        this.players.set(client.id,tetris);
      }
    });

    [...this.players.entries()].forEach(([id,tetris]) => {
      if(!clients.some(client => client.id === id)){
        this.manager.deletePlayer(tetris);
        this.players.delete(id);
      }
    });
  }

  receive(message){
    const data = JSON.parse(message);
    if(data.type === 'session-created'){
      window.location.hash = data.id;
    }else if (data.type === 'session-broadcast'){
      this.updateManager(data.players);
    } else if (data.type === 'state-update'){
      this.updatePlayer(data.clientId, data.fragment, data.state);
    }
  }

  /*
  Description: To initiate and allow people to join sessions
  Pre: None
  Post: Sends information to server
  Return: None
  */
 initiate(){
   const sessionId = window.location.hash.split('#')[1];
   const state = this.localPlayer.serialize();
   if(sessionId){
     this.send({
       type: 'join-session',
       id: sessionId,
       state,
     });
   }else {
     this.send({
      type: 'create-session',
      state,
     });
   }
 }

 /*
 Description: Sends data from clients
 Pre: The data we want to Send
 Post: Sends data to clients
 Return: None
 */
  send(data){
    const message = JSON.stringify(data);
    console.log(`Sending message ${message}`);
    this.connection.send(message);
  }

  /*
  Description: Updates a client's tetris game
  Pre: The clients id, the fragment and property that we wish to update, and the new value
  Post: Changes the tetris game
  Return: None
  */
  updatePlayer(id, fragment, [property, value]){
    if (!this.players.has(id)){
      console.error('This client does not exist', id);
    }

    const tetris = this.players.get(id);
    tetris[fragment][property] = value;

    if (property === 'score') {
      tetris.updateTheScore(value);
    } else {
      tetris.draw();
    }
  }

}
