class Events
{
  /*
  Each event object will be able to detect events occuring on the server.
  */
  constructor(){
    this.listeners = new Set;
  }
  listen(name,callback){
    this.listeners.add({
      name,callback,
    });
  }

  /*
  Description: Send events out to server.
  Pre: The name of the event, the data from the events
  post: Sends data to server
  return: None
  */
  emit(name, ...data){
    this.listeners.forEach( listener => {
      if(listener.name === name){
        listener.callback(...data);
      }
    });
  }
}
