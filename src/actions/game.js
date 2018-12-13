import { bindToEvent } from './util';

export const CARD_REVEALED = 'CARD_REVEALED';
export const JOINED_GAME = 'JOINED_GAME';
export const CARD_DRAWN_TO_SHOP = 'CARD_DRAWN_TO_SHOP';
export const CARD_DISCARDED = 'CARD_DISCARDED';
export const TURN_CHANGED = 'TURN_CHANGED';
export const ROOM_BUILT = 'ROOM_BUILT';
export const ROOM_MOVED = 'ROOM_MOVED';
export const DISASTER_STARTED = 'DISASTER_STARTED';
export const DISASTER_FINISHED = 'DISASTER_FINISHED';
export const ASSETS = 'ASSETS';
export const CARD_RETURNED_TO_DRAW_PILE = 'CARD_RETURNED_TO_DRAW_PILE';
export const ROOM_ROTATED = 'ROOM_ROTATED';
export const ROOMS_SWAPPED = 'ROOMS_SWAPPED';
export const GAME_ENDED = 'GAME_ENDED';
export const LINK_CREATED = 'LINK_CREATED';
export const ROOM_ACTIVATED = 'ROOM_ACTIVATED';
export const ROOM_DEACTIVATED = 'ROOM_DEACTIVATED';
export const CASTLE_STATS_CHANGED = 'CASTLE_STATS_CHANGED';
export const CARD_PLAYED = 'CARD_PLAYED';

bindToEvent(JOINED_GAME, 'JoinedGame');
bindToEvent(CARD_DRAWN_TO_SHOP, 'CardDrawnToShop');
bindToEvent(CARD_DISCARDED, 'CardDiscarded');
bindToEvent(TURN_CHANGED, 'TurnChanged');
bindToEvent(CARD_REVEALED, 'CardRevealed');
bindToEvent(ROOM_BUILT, 'RoomBuilt');
bindToEvent(ROOM_MOVED, 'RoomMoved');
bindToEvent(DISASTER_STARTED, 'DisasterStarted');
bindToEvent(DISASTER_FINISHED, 'DisasterFinished');
bindToEvent(ASSETS, 'Assets');
bindToEvent(CARD_RETURNED_TO_DRAW_PILE, 'CardReturnedToDrawPile');
bindToEvent(ROOM_ROTATED, 'RoomRotated');
bindToEvent(GAME_ENDED, 'GameEnded');
bindToEvent(ROOMS_SWAPPED, 'RoomsSwapped');
bindToEvent(LINK_CREATED, 'LinkCreated');
bindToEvent(ROOM_ACTIVATED, 'RoomActivated');
bindToEvent(ROOM_DEACTIVATED, 'RoomDeactivated');
bindToEvent(CASTLE_STATS_CHANGED, 'CastleStatsChanged');
bindToEvent(CARD_PLAYED, 'CardPlayed');

export function joinedGame (data) {
  return {
    type: JOINED_GAME,
    data
  };
}
