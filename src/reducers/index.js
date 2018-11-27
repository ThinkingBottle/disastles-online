import { combineReducers } from 'redux';
import game from './game';
import lobby from './lobby';

export default combineReducers({
  game: game,
  lobby: lobby
});
