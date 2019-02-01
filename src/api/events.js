import window from 'global/window';
import Event from 'geval/event';
import ws from './ws';
import store from '../store';
import {
  joinLobby,
  playerJoined,
  playerLeave,
  playerSlotChange,
  statusChanged,
  allReady
} from '../actions/lobby';
import {
  nameChanged
} from '../actions/global';
import { dispatchEvent } from '../actions/util';

const LobbyCreatedEvent = Event();
export const onLobbyCreated = LobbyCreatedEvent.listen;
const LobbyJoinedEvent = Event();
export const onLobbyJoined = LobbyJoinedEvent.listen;
const LobbyFailedEvent = Event();
export const onLobbyFailed = LobbyFailedEvent.listen;
const GameStartingEvent = Event();
export const onGameStarting = GameStartingEvent.listen;
const GameJoinedEvent = Event();
export const onGameJoined = GameJoinedEvent.listen;
const KickedEvent = Event();
export const onKicked = KickedEvent.listen;

onKicked(function () {
  window.location.href = '/';
});

var wasAllReady = false;

ws.onEvent(function handleEvent (event) {
  if (Array.isArray(event)) {
    return event.map(handleEvent);
  }
  let wasAutoDispatched = dispatchEvent(event);

  switch (event.event) {
    // global
    case 'NameChanged':
      store.dispatch(nameChanged(event));
      break;
    case 'Disconnect':
      handleDisconnect(event);
      ws.reconnect();
      break;
    case 'Ping':
      break;
    // lobby
    case 'LobbyCreated':
      LobbyCreatedEvent.broadcast(event.id);
      break;
    case 'JoinedLobby':
      store.dispatch(joinLobby(event.snapshot));
      LobbyJoinedEvent.broadcast(event.snapshot);
      break;
    case 'PlayerDisconnected':
      delete event.event;
      store.dispatch(playerLeave(event));
      break;
    case 'PlayerJoined':
      delete event.event;
      store.dispatch(playerJoined(event));
      break;
    case 'SlotSwitched':
      delete event.event;
      store.dispatch(playerSlotChange(event));
      break;
    case 'ActionsChanged':
      handleActions(event);
      break;
    case 'StatusChanged':
      delete event.event;
      store.dispatch(statusChanged(event));
      break;
    // game
    case 'GameStarting':
      GameStartingEvent.broadcast({});
      break;
    case 'JoinedGame':
      GameJoinedEvent.broadcast({});
      break;
    //   delete event.event;
    //   store.dispatch(joinedGame(event));
    //   break;
    // default for debugging
    default:
      if (wasAutoDispatched) {
        break;
      }
      console.log('Unknown event type:', event.event);
      console.log(event);
      break;
  }
});

function handleDisconnect (event) {
  if (event.reason.startsWith('lobby does not exist')) {
    LobbyFailedEvent.broadcast(404);
    return;
  }
  if (event.reason.startsWith('kicked from lobby')) {
    KickedEvent.broadcast();
    return;
  }
  console.log('Unknown disconnect reason:', event.reason);
  window.location.href = '/';
}

function handleActions (event) {
  var isAllReady = false;

  event.actions.map(function (action) {
    switch (action.action) {
      case 'StartGame':
        isAllReady = true;
        break;
    }
  });

  console.log(event.actions);

  if (wasAllReady !== isAllReady) {
    wasAllReady = isAllReady;
    store.dispatch(allReady(isAllReady));
  }
}
