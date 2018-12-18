export const SELECT_CARD = 'SELECT_CARD';
export const SELECT_ACTIONS = 'SELECT_ACTIONS';

export function selectCard (card) {
  return {
    type: SELECT_CARD,
    card
  };
}

export function selectActions (actions) {
  return {
    type: SELECT_ACTIONS,
    actions
  };
}
