import {
  CARD_REVEALED
} from '../actions/game';

const defaultState = {
  knownCards: {
    100: 'asdf',
    101: 'fdsa'
  }
};

export default function reduce (state, action) {
  if (!state) {
    state = defaultState;
  }

  switch (action.type) {
    case CARD_REVEALED:
      state = {...state,
        knownCards: {...state.knownCards,
          [action.data.card]: action.data.asset
        }
      };
  }

  return state;
}
