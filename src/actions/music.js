export const PAUSE = 'PAUSE';
export const PLAY = 'PLAY';
export const STOP = 'STOP';
export const SKIP = 'SKIP';
export const PREVIOUS = 'PREVIOUS';
export const CHANGE_VOLUME = 'CHANGE_VOLUME';
export const MUTE = 'MUTE';

export function pause () {
  return {
    type: PAUSE
  };
}

export function play (init) {
  return {
    type: PLAY,
    init: init === true
  };
}

export function stop () {
  return {
    type: STOP
  };
}

export function skip () {
  return {
    type: SKIP
  };
}

export function previous () {
  return {
    type: PREVIOUS
  };
}

export function changeVolume (volume) {
  return {
    type: CHANGE_VOLUME,
    volume
  };
}

export function muteMusic (mute) {
  return {
    type: MUTE,
    mute
  };
}
