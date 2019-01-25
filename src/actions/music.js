export const PAUSE = 'PAUSE';
export const PLAY = 'PLAY';
export const STOP = 'STOP';
export const SKIP = 'SKIP';
export const PREVIOUS = 'PREVIOUS';

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
