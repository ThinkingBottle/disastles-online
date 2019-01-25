import {
  PAUSE,
  PLAY,
  STOP,
  SKIP,
  PREVIOUS
} from '../actions/music';
import songs from '../songs';
import Sound from '../sound';

const defaultState = {
  startTime: Date.now(),
  offset: 0,
  playing: false,
  init: false,
  songNumber: Math.floor(Math.random() * songs.length),
  songName: 'N/A',
};

export default function reduce (state, action) {
  if (!state) {
    state = defaultState;
  }

  switch (action.type) {
    case PLAY:
      console.log('Play!');
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
