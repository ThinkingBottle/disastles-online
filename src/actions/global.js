import { bindToEvent } from './util';

export const HELLO = 'HELLO';
export const NAME_CHANGED = 'NAME_CHANGED';
export const ACTIONS_CHANGED = 'ACTIONS_CHANGED';

bindToEvent(HELLO, 'Hello');
bindToEvent(ACTIONS_CHANGED, 'ActionsChanged');

export function nameChanged (data) {
  return {
    type: NAME_CHANGED,
    data
  };
}
