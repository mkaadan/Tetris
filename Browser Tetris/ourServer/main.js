/*
Make sure user has ws installed on their PC
*/
const WebSocketServer = require('ws').Server;

/*
Create a websocket on port 9000
*/
const server = new WebSocketServer({port: 9000});

/*
Have a Map of sessions going on.
Also require that people have the javascript files session and client in their
current working directory.
*/
const sessions = new Map;
const Session = require('./session');
const Client = require('./client') ;


/*
Description: Create a new client.
Pre: A connection, an id for the client (will be a randomId if nothing is given.)
Post: None
Return: A new client object with the connection and id.
*/
function createClient(connection, id = randomId()){
  return new Client (connection,id);
}

/*
Description: To create a random identifier.
Pre: None
Post: None
Return: A string of 7 characters that be chosen at random.
*/
function randomId(length=7, chars='123456789abcdefghjkmnopqrst0whyz'){
  let theId = '';
  while (length--){
    theId += chars[Math.random() * chars.length | 0];
  }

  return theId;
}

/*
Description: Create a new session if one with the current id does not exist.
Pre: An id (will be random if nothing is given).
Post: The new session will be added to the map of sessions.
      The console log will also show that a session was created.
Return: The new session that is created.
        Will throw an error if a session with the given id exists already.
*/
function createSession (id = randomId()){
  if (sessions.has(id)){
    throw new Error(`Session ${id} exists`);
  }
  const session = new Session(id);
  console.log('Creating session' , session);
  sessions.set(id, session);
  return session;
}

/*
Description: To get a session from our list of sessions if it exists.
Pre: The of the session we want to get.
Post: None
Return: A session object that is in our map of sessions.
*/
function getSession(id){
  return sessions.get(id);
}

/*
Description:  function broadcast takes a session and tells the information
              of each client to each client.
Pre:          a session that we wish to reveal all information
Post:         Clients will receive information from the session.
Return:       None
*/
function broadcast(session){
  const clients = [...session.clients];
  clients.forEach(client => {
    client.send({
      type: 'session-broadcast',
      players: {
          you: client.id,
          clients: clients.map(client => {
            return {
              id: client.id,
              state: client.state,
            }
      }),
    },
  });
  })
}

/*
The below code does the following:
  Turns the server on, connects users to the server, creates Sessions
  allows clients to join the session. Communicates with clients.
*/
server.on('connection', connection => {
  console.log("connection established");
  const client = createClient(connection);

  connection.on('message', message => {
    console.log('Message received!', message);
    const data = JSON.parse(message);

    if (data.type === 'create-session'){
      const newSession = createSession();
      newSession.join(client);

      client.state = data.state;
      client.send({
        type: 'session-created',
        id: newSession.id,
      });
    }else if (data.type === 'join-session'){
      const session = getSession(data.id) || createSession(data.id); //look for the message that sends joinSession, find data.id
      session.join(client);
      client.state = data.state;
      broadcast(session);
    } else if (data.type === 'state-update') {
      const [property, value] = data.state;
      client.state[data.fragment][property] = value;
      client.broadcast(data);
    }
  //  console.log('Sessions', sessions);
  });
  connection.on('close', () => {
    console.log("Connection closed!");
    const session = client.session;
    if (session) {
      session.leave(client);
      if (session.clients.size === 0){
        sessions.delete(session.id);
      }
    }
    broadcast(session);
  });
});
