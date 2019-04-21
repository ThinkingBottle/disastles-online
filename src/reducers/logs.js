import {
  ADD_LOG,
  FADE_OUT_LOG,
  PLAYER_MUTED,
  fadeOutLog,
} from '../actions/logs';
import store from '../store';

const defaultState = {
  logs: [],
  counter: 0,
  mutedPlayers: [],
};

export default function reduce (state, action) {
  if (!state) {
    state = defaultState;
  }

  switch (action.type) {
    case ADD_LOG:
      const counter = state.counter;
      state = {...state,
        logs: [...state.logs, {...action.log, counter: state.counter}],
        counter: state.counter + 1,
      };
      setTimeout(() => store.dispatch(fadeOutLog(counter)), 7000);
      break;

    case FADE_OUT_LOG:
      const logs = state.logs.map(log => {
        if (log.counter === action.counter) {
          return {...log, fade: true};
        }
        return log;
      });
      state = {...state,
        logs,
      };
      break;

    case PLAYER_MUTED:
      if (action.data.muted) {
        state = {...state,
          mutedPlayers: [...state.mutedPlayers, action.data.player],
        };
      } else {
        state = {...state,
          mutedPlayers: state.mutedPlayers.filter(player => player !== action.data.player),
        };
      }
      break;

    default:
      return state;
  }

  return state;
}
