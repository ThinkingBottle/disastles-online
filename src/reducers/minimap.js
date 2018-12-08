import {
  MOVE_CAMERA,
  SELECT_MINIMAP_PLAYER,
  SELECT_DISPLAY_PLAYER,
} from '../actions/minimap';

const initialState = {
  x: 0,
  y: 0
};

export default function reduce (state = initialState, action) {

  switch (action.type) {
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
        displayPlayer: action.player
      };
      break;
  }

  return state;
}
