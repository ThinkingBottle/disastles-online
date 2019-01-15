import {
  LOBBY_SNAPSHOT,
  PLAYER_JOINED,
  PLAYER_LEAVE,
  PLAYER_SLOT_CHANGED,
  STATUS_CHANGED,
  ALL_READY
} from '../actions/lobby';
import {
  HELLO
} from '../actions/global';

const defaultState = {
  id: null,
  isReady: false,
  allReady: false,
  playerStatus: {},
  players: []
};

export default function reduce (state, action) {
  if (!state) {
    state = defaultState;
  }

  switch (action.type) {
    case HELLO:
      state = {...state,
        playerId: action.data.playerId,
        playerStatus: {...state.playerStatus,
          [action.data.playerId]: {
            status: 'Loading'
          }
        }
      };
      break;
    case PLAYER_JOINED:
      state = {...state,
        playerStatus: {...state.playerStatus,
          [action.player]: {
            status: action.status
          }
        },
        players: [...state.players, action.player],
      };
      break;
    case PLAYER_LEAVE:
      state = {...state,
        playerStatus: {...state.playerStatus},
        players: [...state.players],
        slots: [...state.slots]
      };
      state.slots[action.data.slot] = null;
      state.players.splice(state.players.indexOf(action.data.player), 1);
      delete state.playerStatus[action.data.player];
      break;
    case LOBBY_SNAPSHOT:
      console.log('snapshot', action);
      state = {...state,
        players: action.snapshot.players,
        id: action.snapshot.id,
        settings: action.snapshot.settings,
        slots: [],
        playerStatus: {}
      };
      state.players.forEach(function (playerId) {
        state.playerStatus[playerId] = {
          ready: false
        };
      });
      break;
    case PLAYER_SLOT_CHANGED:
      state = {...state,
        slots: [...state.slots]
      };
      state.slots[action.data.from] = null;
      state.slots[action.data.to] = action.data.player;
      break;
    case STATUS_CHANGED:
      state = {...state,
        playerStatus: {...state.playerStatus,
          [action.player]: {
            ready: action.status === 'Ready',
            state: action.status
          }
        }
      };
      if (action.player === state.playerId) {
        state.isReady = action.status === 'Ready';
      }
      break;
    case ALL_READY:
      state = {...state,
        allReady: action.allReady
      };
      break;
  }

  return state;
}
