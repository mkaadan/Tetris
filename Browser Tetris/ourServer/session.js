/*
Class that will represent a session of tetris
*/
class Sessions
{
  /*
  A session object will have a unique id and a set of clients.
  */
  constructor(id)
  {
    this.id = id;
    this.clients = new Set;
  }

  /*
  Description: To have a client join a session.
  Pre: A client object that will be the client who is joining the Session
  Post: This.clients will hav ea new client in it.
  Return: None
  */
  join(client)
  {
    if (client.session)
    {
      throw new Error ('Client already in session!');
    }
    this.clients.add(client);
    client.session = this;
  }

  /*
  Description: Removes a client from a Session
  Pre: The client who is leaving the Session
  Post: this.session will have one less client in it
  Return: None
  */
  leave(client)
  {
    if (client.session !== this){
      throw new Error('Client not in the session currently.');
    }
    this.clients.delete(client);
    client.session = null;
  }
}

//Exports this session
module.exports = Sessions ;
