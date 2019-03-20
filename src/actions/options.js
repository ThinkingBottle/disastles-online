export const CHANGE_CARD_HOVER_DELAY = 'CHANGE_CARD_HOVER_DELAY';

export function changeCardHoverDelay (cardHoverDelay) {
  return {
    type: CHANGE_CARD_HOVER_DELAY,
    cardHoverDelay
  };
}
