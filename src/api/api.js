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

function once (listen, handler) {
  var stop = listen(function () {
    stop();
    handler.apply(this, arguments);
  });

  return stop;
}
