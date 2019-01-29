import { bindToEvent } from './util';

export const HELLO = 'HELLO';
export const NAME_CHANGED = 'NAME_CHANGED';
export const ACTIONS_CHANGED = 'ACTIONS_CHANGED';
export const RECONNECTION_FAILED = 'RECONNECTION_FAILED';

bindToEvent(HELLO, 'Hello');
bindToEvent(ACTIONS_CHANGED, 'ActionsChanged');
bindToEvent(RECONNECTION_FAILED, 'ReconnectionFailed');

export function nameChanged (data) {
  return {
    type: NAME_CHANGED,
    data
  };
}
