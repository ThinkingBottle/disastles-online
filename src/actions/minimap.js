export const MOVE_CAMERA = 'MOVE_CAMERA';
export const SELECT_MINIMAP_PLAYER = 'SELECT_MINIMAP_PLAYER';
export const SELECT_DISPLAY_PLAYER = 'SELECT_DISPLAY_PLAYER';

export function moveCamera (x, y) {
  return {
    type: MOVE_CAMERA,
    x, y
  };
}

export function selectMinimapPlayer (player) {
  return {
    type: SELECT_MINIMAP_PLAYER,
    player
  };
}

export function selectDisplayPlayer (player) {
  return {
    type: SELECT_DISPLAY_PLAYER,
    player
  };
}
