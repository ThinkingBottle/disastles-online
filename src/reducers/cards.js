import {
  CARD_REVEALED,
  JOINED_GAME
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
      break;
    case JOINED_GAME:
      console.log(action.data);
      state = {...state,
        knownCards: {...state.knownCards}
      };

      Object.keys(action.data.snapshot.deck).forEach(function (name) {
        let card = action.data.snapshot.deck[name];
        if (card.asset) {
          state.knownCards[name] = card.asset;
        }
      });
      break;
  }

  return state;
}
