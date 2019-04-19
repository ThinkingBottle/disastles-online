import { bindToEvent } from './util';

export const ADD_LOG = 'ADD_LOG';
export const FADE_OUT_LOG = 'FADE_OUT_LOG';

export const PLAYER_MUTED = 'PLAYER_MUTED';

bindToEvent(PLAYER_MUTED, 'PlayerMuted');

export function addLog (logType, data) {
  return {
    type: ADD_LOG,
    log: {
      timestamp: new Date(),
      logType,
      data,
    },
  };
}

export function fadeOutLog (counter) {
  return {
    type: FADE_OUT_LOG,
    counter,
  };
}
