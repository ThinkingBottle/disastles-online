import AudioContext from 'audio-context';
import { partial } from 'ap';
import { interval, timeout } from 'thyming';
import Collector from 'collect-methods';
import Event from 'geval';
import songs from './songs';

const loadedSongs ={};
const soundBuffers = {};
const audio = {};
const sounds = {
  ambience: '/mp3/sfx_ambience_space_loop.mp3',
  shuffle: '/mp3/sfx_cards_shuffle.mp3',
  connection: '/mp3/sfx_connection_positive.mp3',
  discard: '/mp3/sfx_discard_card.mp3',
  draw: '/mp3/sfx_draw_card.mp3',
  turn: '/mp3/sfx_player_turn.mp3',
  rotate: '/mp3/sfx_rotation.mp3',
  skip: '/mp3/sfx_skip_turn.mp3',
  startGame: '/mp3/sfx_start_disastles.mp3',
  action: '/mp3/sfx_take_action.mp3',
  negative: '/mp3/sfx_uisound_negative.mp3',
  positive: '/mp3/sfx_uisound_positive.mp3',

  disaster: '/mp3/stinger_disaster.mp3',
  gameover: '/mp3/stinger_endscreen.mp3',
};

export const INITIAL_MUSIC_VOLUME = 0.8;
export const INITIAL_AMBIENCE_VOLUME = 0.1;
export const INITIAL_SFX_VOLUME = 0.4;
export const INITIAL_PLAYER_TURN_VOLUME = 0.9;

export default audio;

const context = AudioContext();


document.body.addEventListener('focus', resumeAudioContext);
document.body.addEventListener('click', resumeAudioContext);
document.body.addEventListener('mousedown', resumeAudioContext);
document.body.addEventListener('touchstart', resumeAudioContext);
window.addEventListener('scroll', resumeAudioContext);
window.addEventListener('load', resumeAudioContext);

function resumeAudioContext () {
  if (context.state !== 'running') {
    context.resume();
  }
}

audio.loadPromise = loadAll();
audio.init = function () { return audio.loadPromise; };
audio.startAmbience = startAmbience;
audio.stopAmbience = Collector();

const SoundStartEvent = Event(async function (broadcast) {
  let hasStarted = false;
  if (!context) {
    hasStarted = true;
    await audio.init();
    broadcast();
    return;
  }
  context.onstatechange = async function () {
    if (!hasStarted && context.state === 'running') {
      hasStarted = true;
      await audio.init();
      broadcast();
    }
  }
});
export const onStart = SoundStartEvent;

async function loadAll () {
  audio.sfx = createVolumeChannel();
  audio.ambience = createVolumeChannel();
  audio.music = createVolumeChannel();
  audio.playerTurn = createVolumeChannel();
  audio.optionsMenu = createVolumeChannel();
  audio.sfx.setVolume(localStorage.sfxVolume ? Number(localStorage.sfxVolume) / 100 : INITIAL_SFX_VOLUME);
  audio.ambience.setVolume(localStorage.ambienceVolume ? Number(localStorage.ambienceVolume) / 100 : INITIAL_AMBIENCE_VOLUME);
  audio.playerTurn.setVolume(localStorage.playerTurnVolume ? Number(localStorage.playerTurnVolume) / 100 : INITIAL_PLAYER_TURN_VOLUME);

  await Promise.all(Object.keys(sounds).map(async function (name) {
    return loadSound(name, sounds[name]);
  }));

  resumeAudioContext();

  if (localStorage.musicMuted === 'true') {
    audio.music.setVolume(0);
  } else {
    startAmbience();
    audio.music.setVolume(localStorage.musicVolume ? Number(localStorage.musicVolume) / 100 : INITIAL_MUSIC_VOLUME);
  }
}

function startAmbience () {
  audio.stopAmbience();
  console.log('Starting ambience');
  audio.stopAmbience(audio.ambience.playSound('ambience'));
  audio.stopAmbience(interval(function () {
    audio.stopAmbience(audio.ambience.playSound('ambience'));
  }, (60 + 33) * 1000));
}

function createVolumeChannel () {
  var gainNode = null;
  if (context) {
    gainNode = context.createGain();
    gainNode.gain.setValueAtTime(1, context.currentTime);
  }

  gainNode.connect(context.destination);

  return {
    playSound: partial(playSound, gainNode),
    playSong: partial(playSong, gainNode),
    setVolume: partial(setVolume, gainNode),
    stopMusic
  };
}

function setVolume (node, volume) {
  node.gain.setValueAtTime(volume, context.currentTime);
}

var currentSong = false;
function stopMusic (skipFade) {
  if (currentSong) {
    currentSong(skipFade);
    currentSong = false;
  }
}
async function playSong (node, index, offset) {
  if (currentSong) {
    currentSong();
    currentSong = false;
  }
  currentSong = stop;

  var gainNode = context.createGain();
  let currentVolume = 1;
  gainNode.gain.setValueAtTime(1, context.currentTime);

  if (!loadedSongs[index]) {
    songs[index].buffer = await loadSong(songs[index], index)
  }
  if (!loadedSongs[index].buffer) {
    loadedSongs[index].buffer = await decodeAudioData(songs[index].buffer);
  }
  let source = context.createBufferSource();
  source.buffer = loadedSongs[index].buffer;
  source.connect(gainNode);
  gainNode.connect(node);

  console.log('Starting at offset?', index, offset);

  source.start(0, offset/1000 || 0);

  return stop;

  function stop (skipFade) {
    if (!skipFade && currentVolume > 0) {
      currentVolume -= 0.01;
      gainNode.gain.setValueAtTime(currentVolume, context.currentTime);
      return timeout(stop, 1000/60);
    }
    if (source) {
      source.stop();
    }
  }
}

async function decodeAudioData (data) {
  return new Promise(function (resolve, reject) {
    context.decodeAudioData(data, resolve, reject);
  });
}

function playSound (node, name) {
  let source = context.createBufferSource();
  source.buffer = soundBuffers[name];
  source.connect(node);

  source.start(0);

  return function () {
    source.stop();
  }
}

async function loadSound (name, url) {
  soundBuffers[name] = await decodeAudioData(await loadSoundData(url));
}

async function loadSong (data, index) {
  data.response = await loadSoundData('/mp3/songs/' + data.file);
  loadedSongs[index] = {};
  return data.response;
}

async function loadSoundData (url) {
  return new Promise(function (resolve, reject) {
    console.log('Requesting this track:', url);
    var request = new XMLHttpRequest();

    request.open('GET', url);
    request.responseType = 'arraybuffer';
    request.onload = function () {
      resolve(request.response);
    };
    request.send();
  });
}
