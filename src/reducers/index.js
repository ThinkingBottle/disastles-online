import { combineReducers } from 'redux';
import game from './game';
import lobby from './lobby';
import cards from './cards';
import globalReducer from './global';

export default combineReducers({
  game, lobby, cards,
  global: globalReducer
});
