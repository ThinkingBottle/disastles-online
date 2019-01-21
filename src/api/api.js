import ws from './ws';
import * as Events from './events';

export const events = Events;
export { ws };

export async function send (action) {
  await ws.init();
  ws.send(action);
}

export async function createLobby () {
  await ws.init();
  return new Promise((resolve, reject) => {
    once(Events.onLobbyCreated, resolve);
    ws.send({
      action: 'CreateLobby'
    });
  });
}

export async function joinLobby (id) {
  await ws.init();
  return new Promise((resolve, reject) => {
    once(Events.onLobbyJoined, resolve);
    ws.send({
      action: 'JoinLobby',
      id
    });
  });
}

export async function takeSlot (slot) {
  await ws.init();
  return new Promise((resolve, reject) => {
    once(Events.onLobbyJoined, resolve);
    ws.send({
      action: 'TakeSlot',
      slot: slot
    });
  });
}

export async function finishedLoading () {
  await ws.init();
  ws.send({
    action: 'SetStatus',
    status: 'Loaded',
  });
}

export async function setReady (ready) {
  await ws.init();
  ws.send({
    action: 'SetStatus',
    status: ready ? 'Ready' : 'Unready'
  });
}

export async function startGame (ready) {
  await ws.init();
  ws.send({
    action: 'StartGame'
  });
}

export async function setName (name) {
  await ws.init();
  ws.send({
    action: 'SetName',
    name
  });
}

export async function setColor (color) {
  await ws.init();
  ws.send({
    action: 'SetColor',
    color
  });
}

export async function reconnect (token) {
  await ws.init();
  ws.send({
    action: 'Reconnect',
    token
  });
}

function once (listen, handler) {
  var stop = listen(function () {
    stop();
    handler.apply(this, arguments);
  });

  return stop;
}
