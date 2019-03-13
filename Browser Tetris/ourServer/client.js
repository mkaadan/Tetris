
class Client
{
  /*
  A client object will have a connection, an id, a session in which it belongs to,
  and a state that will represent the board and the piece the player has control over.
  */
  constructor(connection,id)
  {
    this.connection = connection;
    this.id = id;
    this.session = null;
    this.state = {
      board:{
          matrix: [],
      },
      player: {
        matrix: [],
        pos: {x:0, y:0}, //was position. watch this
        score: 0,
      },
    };
  }

  /*
  Description: Sends the client's board and piece information to server and other
  clients in session.
  Pre: The data that is being sent from the client.
  Post: Sends data to others in session
  Return: None
  */
  broadcast(data)
  {
    if (!this.session) {
      throw new Error('Can not broadcast without a session to broadcast to!');
    }

    data.clientId = this.id;

    this.session.clients.forEach(client => {
      if (this === client) {
        return;
      }
      client.send(data);
    });
  }

  /*
  Description: Sends a string of information to others in the session.
  Pre: The data we wish to send
  Post: Sends data across connection
  return: None
  */
  send(data){
    const message = JSON.stringify(data);
    console.log(`Sending message ${message}`);
    this.connection.send(message, function ack(err){
      if (err){
        console.error('Message failed', err, message);
      }
    });
  }
}
module.exports= Client ;
