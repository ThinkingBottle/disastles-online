import {
  MOVE_CAMERA,
  SELECT_MINIMAP_PLAYER,
  SELECT_DISPLAY_PLAYER,
} from '../actions/minimap';
import {
  HELLO
} from '../actions/global';

const initialState = {
  x: 0,
  y: 0,
  displayPlayer: null,
  minimapPlayer: null,
};

export default function reduce (state = initialState, action) {

  switch (action.type) {
    case HELLO:
      state = {...state,
        displayPlayer: action.data.playerId,
        minimapPlayer: action.data.playerId,
      };
      break;

    case MOVE_CAMERA:
      state = {...state,
        x: action.x,
        y: action.y
      };
      break;

    case SELECT_MINIMAP_PLAYER:
      state = {...state,
        minimapPlayer: action.player
      };
      break;

    case SELECT_DISPLAY_PLAYER:
      state = {...state,
        displayPlayer: action.player,
        minimapPlayer: action.player
      };
      break;

    default:
      break;
  }

  return state;
}
