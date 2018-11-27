import Event from 'geval/event';
import ws from './ws';
import store from '../store';
import {
  joinLobby,
  playerJoined,
  playerSlotChange
} from '../actions/lobby';

const LobbyCreatedEvent = Event();
export const onLobbyCreated = LobbyCreatedEvent.listen;
const LobbyJoinedEvent = Event();
export const onLobbyJoined = LobbyJoinedEvent.listen;
const LobbyFailedEvent = Event();
export const onLobbyFailed = LobbyFailedEvent.listen;

ws.onEvent(function handleEvent (event) {
  if (Array.isArray(event)) {
    return event.map(handleEvent);
  }
  switch (event.event) {
    case 'Disconnect':
      handleDisconnect(event);
      ws.reconnect();
      break;
    case 'Ping':
      // pong?
      break;
    case 'LobbyCreated':
      LobbyCreatedEvent.broadcast(event.id);
      break;
    case 'JoinedLobby':
      store.dispatch(joinLobby(event.snapshot));
      LobbyJoinedEvent.broadcast(event.snapshot);
      break;
    case 'PlayerJoined':
      delete event.event;
      store.dispatch(playerJoined(event));
      break;
    case 'SlotSwitched':
      delete event.event;
      store.dispatch(playerSlotChange(event));
      break;
    default:
      console.log('Unknown event type:', event.event);
      break;
  }
});

function handleDisconnect (event) {
  if (event.reason.startsWith('lobby does not exist')) {
    LobbyFailedEvent.broadcast(404);
    return;
  }
  console.log('Unknown disconnect reason:', event.reason);
}
