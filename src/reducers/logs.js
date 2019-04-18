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
  counter: 0,
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
      // setTimeout(() => store.dispatch(deleteLog(action.counter)), 1000);
      break;

    case DELETE_LOG:
      state = {...state,
        logs: state.logs.filter(log => log.counter !== action.counter),
      };
      break;

    default:
      return state;
  }

  return state;
}
