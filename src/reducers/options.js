import {
  CHANGE_CARD_HOVER_DELAY,
} from '../actions/options';

const defaultState = {
  cardHoverDelay: localStorage.cardHoverDelay ? Number(localStorage.cardHoverDelay) : 50,
};

export default function reduce (state, action) {
  if (!state) {
    state = defaultState;
  }

  switch (action.type) {
    case CHANGE_CARD_HOVER_DELAY:
      state = {...state,
        cardHoverDelay: action.cardHoverDelay
      };
      localStorage.cardHoverDelay = action.cardHoverDelay;
      break;
    default:
      return state;
  }

  return state;
}
