import Event from 'geval/event';

const MessageEvent = Event();
const url = 'wss://www.ocwalk.com/api/ws';

var ws = null;
var initPromise = null;
var currentID = 0;

reconnect();

export default {
  init: init,
  send: send,
  reconnect: reconnect,
  onEvent: MessageEvent.listen
};

function init () {
  return initPromise;
}

function send (data) {
  if (!data.action) {
    console.error('No action specified in', data);
  }
  ws.send(JSON.stringify(data));
}

function reconnect () {
  ws = new WebSocket(url);

  initPromise = new Promise((resolve, reject) => {
    ws.onopen = resolve;
  });

  ws.onmessage = handleMessage;
}

function handleMessage (message) {
  try {
    var data = JSON.parse(message.data);
  } catch (e) {
    console.error(e.message || e);
    console.error('Failed to parse server message: ' + message.data);
    console.error(message);
  }
  MessageEvent.broadcast(data);
}
