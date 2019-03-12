import {
  PAUSE,
  PLAY,
  STOP,
  SKIP,
  PREVIOUS,
  CHANGE_MUSIC_VOLUME,
  CHANGE_AMBIENCE_VOLUME,
  CHANGE_SFX_VOLUME,
  MUTE,
} from '../actions/music';
import songs from '../songs';
import Sound, { INITIAL_AMBIENCE_VOLUME, INITIAL_SFX_VOLUME } from '../sound';

const defaultState = {
  startTime: Date.now(),
  offset: 0,
  playing: false,
  init: false,
  songNumber: Math.floor(Math.random() * songs.length),
  songName: 'Loading...',

  musicVolume: localStorage.musicVolume ? Number(localStorage.musicVolume) : 80,
  musicMuted: localStorage.musicMuted === 'true',
  ambienceVolume: localStorage.ambienceVolume ? Number(localStorage.ambienceVolume) : INITIAL_AMBIENCE_VOLUME,
  sfxVolume: localStorage.sfxVolume ? Number(localStorage.sfxVolume) : INITIAL_SFX_VOLUME,
};

export default function reduce (state, action) {
  if (!state) {
    state = defaultState;
  }

  switch (action.type) {
    case PLAY:
      state = {...state,
        startTime: Date.now(),
        playing: action.init ? !sessionStorage.disableAutoPlay : true,
        init: state.init || action.init
      };
      actuallyPlaySong(state);
      break;
    case PAUSE:
      state = {...state,
        offset: currentOffset(state),
        startTime: Date.now(),
        playing: false,
      };
      stopMusic(true);
      break;
    case STOP:
      state = {...state,
        offset: 0,
        startTime: Date.now(),
        playing: false,
      };
      stopMusic(true);
      break;
    case SKIP:
      state = {...state,
        songNumber: (state.songNumber + 1) % songs.length,
        offset: 0,
        startTime: Date.now(),
      };
      actuallyPlaySong(state);
      break;
    case PREVIOUS:
      state = {...state,
        songNumber: state.songNumber === 0 ? songs.length - 1 : state.songNumber - 1,
        offset: 0,
        startTime: Date.now(),
      };
      actuallyPlaySong(state);
      break;
    case CHANGE_MUSIC_VOLUME:
      state = {...state,
        musicVolume: action.volume
      };
      localStorage.musicVolume = action.volume;
      Sound.music.setVolume(action.volume / 100);
      break;
    case CHANGE_AMBIENCE_VOLUME:
      state = {...state,
        ambienceVolume: action.volume,
      };
      localStorage.ambienceVolume = action.volume;
      Sound.ambience.setVolume(action.volume / 100);
      break;
    case CHANGE_SFX_VOLUME:
      state = {...state,
        sfxVolume: action.volume,
      };
      localStorage.sfxVolume = action.volume;
      Sound.sfx.setVolume(action.volume / 100);
      break;
    case MUTE:
      state = {...state,
        musicMuted: action.mute
      };
      localStorage.musicMuted = action.mute;
      if (action.mute) {
        Sound.stopAmbience();
        Sound.music.setVolume(0);
      } else {
        Sound.music.setVolume(state.musicVolume / 100);
        Sound.startAmbience();
      }
      break;
    default:
      return state;
  }

  return state;
}

function actuallyPlaySong (state) {
  if (!state.init) {
    state.offset = currentOffset(state);
    state.playing = false;
    return;
  }
  if (!state.playing) {
    return;
  }
  state.songName = songs[state.songNumber].author + ' - ' + songs[state.songNumber].title;
  Sound.music.playSong(state.songNumber, state.offset);
}

function stopMusic (skipFade) {
  Sound.music.stopMusic(skipFade);
}

export function currentOffset (state) {
  if (state.playing) {
    return Date.now() - state.startTime + state.offset;
  }
  return state.offset;
}
