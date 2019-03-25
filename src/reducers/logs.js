import {
  ADD_LOG,
  FADE_OUT_LOG,
  DELETE_LOG,
  fadeOutLog,
  deleteLog,
} from '../actions/logs';
import store from '../store';

const defaultState = {
  logs: [],
};

export default function reduce (state, action) {
  if (!state) {
    state = defaultState;
  }

  switch (action.type) {
    case ADD_LOG:
      state = {...state,
        logs: [...state.logs, action.log]
      };
      setTimeout(() => store.dispatch(fadeOutLog(action.log)), 7000);
      break;

    case FADE_OUT_LOG:
      const logs = state.logs.map(log => {
        if (log.timestamp === action.log.timestamp) {
          return {...log, fade: true};
        }
        return log;
      });
      state = {...state,
        logs,
      };
      setTimeout(() => store.dispatch(deleteLog(action.log)), 1000);
      break;

    case DELETE_LOG:
      state = {...state,
        logs: state.logs.filter(log => log.timestamp !== action.log.timestamp),
      };
      break;

    default:
      return state;
  }

  return state;
}
