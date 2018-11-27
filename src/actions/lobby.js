
export const LOBBY_SNAPSHOT = 'LOBBY_SNAPSHOT';
export const PLAYER_JOINED = 'PLAYER_JOINED';
export const PLAYER_SLOT_CHANGED = 'PLAYER_SLOT_CHANGED';

export function joinLobby (snapshot) {
  return {
    type: LOBBY_SNAPSHOT,
    snapshot
  };
}

export function playerJoined (player) {
  return {
    type: PLAYER_JOINED,
    player
  };
}

export function playerSlotChange (slotData) {
  return {
    type: PLAYER_SLOT_CHANGED,
    data: slotData
  };
}
