import { combineReducers } from 'redux';
import game from './game';
import lobby from './lobby';
import cards from './cards';
import music from './music';
import globalReducer from './global';
import minimap from './minimap';
import options from './options';
import logs from './logs';
import { LEAVE_GAME } from '../actions/game';

const appReducer = combineReducers({
  game, lobby, cards, minimap, music, options, logs,
  global: globalReducer
});

export default (state, action) => {
  if (action.type === LEAVE_GAME) {
    state = undefined;
  }

  return appReducer(state, action);
};
