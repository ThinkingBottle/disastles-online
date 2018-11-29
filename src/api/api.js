import ws from './ws';
import * as Events from './events';

export const events = Events;

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

export async function setReady (ready) {
  await ws.init();
  ws.send({
    action: 'SetStatus',
    status: '',
    ready
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

function once (listen, handler) {
  var stop = listen(function () {
    stop();
    handler.apply(this, arguments);
  });

  return stop;
}
