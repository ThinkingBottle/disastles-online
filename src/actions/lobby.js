
export const LOBBY_SNAPSHOT = 'LOBBY_SNAPSHOT';
export const PLAYER_JOINED = 'PLAYER_JOINED';
export const PLAYER_LEAVE = 'PLAYER_LEAVE';
export const PLAYER_SLOT_CHANGED = 'PLAYER_SLOT_CHANGED';
export const STATUS_CHANGED = 'STATUS_CHANGED';
export const ALL_READY = 'ALL_READY';

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

export function playerLeave (data) {
  return {
    type: PLAYER_LEAVE,
    data
  };
}

export function playerSlotChange (slotData) {
  return {
    type: PLAYER_SLOT_CHANGED,
    data: slotData
  };
}

export function statusChanged (status) {
  return {
    type: STATUS_CHANGED,
    ...status
  };
}

export function allReady (allReady) {
  return {
    type: ALL_READY,
    allReady
  };
}
