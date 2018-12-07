import { bindToEvent } from './util';

export const CARD_REVEALED = 'CARD_REVEALED';
export const JOINED_GAME = 'JOINED_GAME';
export const CARD_DRAWN_TO_SHOP = 'CARD_DRAWN_TO_SHOP';
export const CARD_DISCARDED = 'CARD_DISCARDED';
export const TURN_CHANGED = 'TURN_CHANGED';
export const ROOM_BUILT = 'ROOM_BUILT';
export const ROOM_MOVED = 'ROOM_MOVED';

bindToEvent(JOINED_GAME, 'JoinedGame');
bindToEvent(CARD_DRAWN_TO_SHOP, 'CardDrawnToShop');
bindToEvent(CARD_DISCARDED, 'CardDiscarded');
bindToEvent(TURN_CHANGED, 'TurnChanged');
bindToEvent(CARD_REVEALED, 'CardRevealed');
bindToEvent(ROOM_BUILT, 'RoomBuilt');
bindToEvent(ROOM_MOVED, 'RoomMoved');

export function joinedGame (data) {
  return {
    type: JOINED_GAME,
    data
  };
}
