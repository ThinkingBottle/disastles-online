export const SELECT_CARD = 'SELECT_CARD';

export function selectCard (card) {
  return {
    type: SELECT_CARD,
    card
  };
}
