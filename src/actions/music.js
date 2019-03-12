export const PAUSE = 'PAUSE';
export const PLAY = 'PLAY';
export const STOP = 'STOP';
export const SKIP = 'SKIP';
export const PREVIOUS = 'PREVIOUS';
export const CHANGE_MUSIC_VOLUME = 'CHANGE_MUSIC_VOLUME';
export const CHANGE_AMBIENCE_VOLUME = 'CHANGE_AMBIENCE_VOLUME';
export const CHANGE_SFX_VOLUME = 'CHANGE_SFX_VOLUME';
export const CHANGE_PLAYER_TURN_VOLUME = 'CHANGE_PLAYER_TURN_VOLUME';
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

export function changeMusicVolume (volume) {
  return {
    type: CHANGE_MUSIC_VOLUME,
    volume
  };
}

export function changeAmbienceVolume (volume) {
  return {
    type: CHANGE_AMBIENCE_VOLUME,
    volume
  };
}

export function changeSfxVolume (volume) {
  return {
    type: CHANGE_SFX_VOLUME,
    volume
  };
}

export function changePlayerTurnVolume (volume) {
  return {
    type: CHANGE_PLAYER_TURN_VOLUME,
    volume
  };
}

export function muteMusic (mute) {
  return {
    type: MUTE,
    mute
  };
}
