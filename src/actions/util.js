import Event from 'geval/event';
import { partial } from 'ap';
import store from '../store';

const autoboundEvents = {};

export function bindToEvent (constName, eventName) {
  bindEvent(eventName, partial(handleEvent, constName, eventName));
}

export function dispatchEvent (event) {
  if (autoboundEvents[event.event]) {
    autoboundEvents[event.event].broadcast(event);
    return true;
  }
  return false;
}

function handleEvent (constName, eventName, event) {
  return {
    type: constName,
    data: event
  };
}

function bindEvent (eventName, handler) {
  if (!autoboundEvents[eventName]) {
    autoboundEvents[eventName] = Event();
  }
  autoboundEvents[eventName].listen((event) => {
    event = {...event};
    delete event.event;
    store.dispatch(handler(event));
  });
}
