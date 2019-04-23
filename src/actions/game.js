import { bindToEvent } from './util';

export const CARD_REVEALED = 'CARD_REVEALED';
export const JOINED_GAME = 'JOINED_GAME';
export const CARD_DRAWN_TO_SHOP = 'CARD_DRAWN_TO_SHOP';
export const CARD_DISCARDED = 'CARD_DISCARDED';
export const TURN_CHANGED = 'TURN_CHANGED';
export const ROOM_BUILT = 'ROOM_BUILT';
export const ROOM_BUILT_AND_SWAPPED = 'ROOM_BUILT_AND_SWAPPED';
export const ROOM_MOVED = 'ROOM_MOVED';
export const DISASTER_STARTED = 'DISASTER_STARTED';
export const DISASTER_FINISHED = 'DISASTER_FINISHED';
export const ASSETS = 'ASSETS';
export const CARD_RETURNED_TO_DRAW_PILE = 'CARD_RETURNED_TO_DRAW_PILE';
export const CARDS_DRAWN_TO_PLAYER = 'CARDS_DRAWN_TO_PLAYER';
export const ROOM_ROTATED = 'ROOM_ROTATED';
export const ROOMS_SWAPPED = 'ROOMS_SWAPPED';
export const GAME_ENDED = 'GAME_ENDED';
export const LINK_CREATED = 'LINK_CREATED';
export const ROOM_ACTIVATED = 'ROOM_ACTIVATED';
export const ROOM_DEACTIVATED = 'ROOM_DEACTIVATED';
export const CASTLE_STATS_CHANGED = 'CASTLE_STATS_CHANGED';
export const CARD_PLAYED = 'CARD_PLAYED';
export const CARDS_RETURNED_FROM_PLAYER = 'CARDS_RETURNED_FROM_PLAYER';
export const CLEAR_DISASTER_MODAL = 'CLEAR_DISASTER_MODAL';
export const DISASTER_SACRIFICES_REQUIRED = 'DISASTER_SACRIFICES_REQUIRED';
export const ROOM_MARKED = 'ROOM_MARKED';
export const ROOMS_UNMARKED = 'ROOMS_UNMARKED';
export const TURN_TIMEOUT_NOTIFICATION = 'TURN_TIMEOUT_NOTIFICATION';
export const LEAVE_GAME = 'LEAVE_GAME';

bindToEvent(JOINED_GAME, 'JoinedGame');
bindToEvent(CARD_DRAWN_TO_SHOP, 'CardDrawnToShop');
bindToEvent(CARD_DISCARDED, 'CardDiscarded');
bindToEvent(TURN_CHANGED, 'TurnChanged');
bindToEvent(CARD_REVEALED, 'CardRevealed');
bindToEvent(ROOM_BUILT, 'RoomBuilt');
bindToEvent(ROOM_BUILT_AND_SWAPPED, 'RoomBuiltAndSwapped');
bindToEvent(ROOM_MOVED, 'RoomMoved');
bindToEvent(DISASTER_STARTED, 'DisasterStarted');
bindToEvent(DISASTER_FINISHED, 'DisasterFinished');
bindToEvent(ASSETS, 'Assets');
bindToEvent(CARD_RETURNED_TO_DRAW_PILE, 'CardReturnedToDrawPile');
bindToEvent(CARDS_DRAWN_TO_PLAYER, 'CardsDrawnToPlayer');
bindToEvent(ROOM_ROTATED, 'RoomRotated');
bindToEvent(GAME_ENDED, 'GameEnded');
bindToEvent(ROOMS_SWAPPED, 'RoomsSwapped');
bindToEvent(LINK_CREATED, 'LinkCreated');
bindToEvent(ROOM_ACTIVATED, 'RoomActivated');
bindToEvent(ROOM_DEACTIVATED, 'RoomDeactivated');
bindToEvent(CASTLE_STATS_CHANGED, 'CastleStatsChanged');
bindToEvent(CARD_PLAYED, 'CardPlayed');
bindToEvent(CARDS_RETURNED_FROM_PLAYER, 'CardsReturnedFromPlayer');
bindToEvent(DISASTER_SACRIFICES_REQUIRED, 'DisasterSacrificesRequired');
bindToEvent(ROOM_MARKED, 'RoomMarked');
bindToEvent(ROOMS_UNMARKED, 'RoomsUnmarked');
bindToEvent(TURN_TIMEOUT_NOTIFICATION, 'TurnTimeoutNotification');

export function joinedGame (data) {
  return {
    type: JOINED_GAME,
    data
  };
}

export function clearActiveCard () {
  return {
    type: CARD_PLAYED,
    data: {
      card: false
    }
  };
}

export function clearDisasterModal () {
  return {
    type: CLEAR_DISASTER_MODAL
  };
}

export function leaveGame() {
  return {
    type: LEAVE_GAME,
  };
}
