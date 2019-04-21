import window from 'global/window';
import {
  LOBBY_SNAPSHOT,
  PLAYER_LEAVE
} from '../actions/lobby';
import {
  JOINED_GAME
} from '../actions/game';
import {
  HELLO,
  NAME_CHANGED,
  ACTIONS_CHANGED,
  RECONNECTION_FAILED
} from '../actions/global';

import name from 'american-sounding-names';

const defaultState = {
  playerId: 'test',
  name: localStorage.playerName || name(),
  playerNames: {},
  playerColors: {},
  actions: []
};

export default function reduce (state, action) {
  if (!state) {
    state = defaultState;
  }

  switch (action.type) {
    case ACTIONS_CHANGED:
      state = {...state,
        actions: action.data.actions
      };
      break;

    case HELLO:
      console.log('hello', action);
      sessionStorage.token = action.data.reconnectionToken;
      state = {...state,
        playerId: action.data.playerId,
        reconnectionToken: action.data.reconnectionToken,
        playerNames: {...state.playerNames,
          [action.data.playerId]: state.name
        }
      };
      break;

    case LOBBY_SNAPSHOT:
      state = {...state,
        playerNames: {...state.playerNames}
      };
      action.snapshot.players.forEach(function (player) {
        console.log(player);
        state.playerNames[player.id] = player.name;
      });
      break;

    case NAME_CHANGED:
      state = {...state,
        playerNames: {...state.playerNames,
          [action.data.player]: action.data.name
        }
      };
      break;

    case PLAYER_LEAVE:
      state = {...state,
        playerNames: {...state.playerNames}
      };
      delete state.playerNames[action.data.player];
      break;

    case JOINED_GAME:
      state = {...state,
        playerNames: {...state.playerNames},
        playerColors: {...state.playerColors}
      };
      action.data.snapshot.players.forEach(function (player) {
        state.playerNames[player.id] = player.name;
        state.playerColors[player.id] = player.color;
      });
      break;

    case RECONNECTION_FAILED:
      window.location.href = '/';
      break;

    default:
      break;
  }

  return state;
}
