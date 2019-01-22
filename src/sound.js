import AudioContext from 'audio-context';
import { partial } from 'ap';
import { interval } from 'thyming';
import Collector from 'collect-methods';

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
  disaster: '/mp3/sfx_start_disastles.mp3',
  action: '/mp3/sfx_take_action.mp3',
  negative: '/mp3/sfx_uisound_negative.mp3',
  positive: '/mp3/sfx_uisound_positive.mp3',
};

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

async function loadAll () {
  audio.sfx = createVolumeChannel();
  audio.ambience = createVolumeChannel();
  audio.sfx.setVolume(0.4);
  audio.ambience.setVolume(0.1);

  await Promise.all(Object.keys(sounds).map(async function (name) {
    return loadSound(name, sounds[name]);
  }));
  audio.startAmbience = startAmbience;
  audio.stopAmbience = Collector();
  startAmbience();
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
  var gainNode = context.createGain();
  gainNode.gain.setValueAtTime(1, context.currentTime);

  gainNode.connect(context.destination);

  return {
    playSound: partial(playSound, gainNode),
    setVolume: partial(setVolume, gainNode)
  };
}

function setVolume (node, volume) {
  node.gain.setValueAtTime(volume, context.currentTime);
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
  soundBuffers[name] = await loadSoundData(url);
}

async function loadSoundData (url) {
  return new Promise(function (resolve, reject) {
    console.log('Requesting this track:', url);
    var request = new XMLHttpRequest();

    request.open('GET', url);
    request.responseType = 'arraybuffer';
    request.onload = function () {
      context.decodeAudioData(request.response, resolve, reject);
    };
    request.send();
  });
}
