import {
  JOINED_GAME,
  CARD_DRAWN_TO_SHOP,
  CARD_DISCARDED,
  ROOM_BUILT,
  TURN_CHANGED
} from '../actions/game';

import {
  ACTIONS_CHANGED
} from '../actions/global';

import {
  SELECT_CARD
} from '../actions/player';

const defaultState = {
  inGame: false,
  drawPileSize: 0,
  players: [],
  sacrifices: [],
  seed: 0,
  castles: {},

  shop: [],
  playerCards: [],
  disasters: [],
  discardPile: [],

  currentTurn: null,
  roundTurn: null,
  actions: [ ],
  selectedCard: null
};

export default function reduce (state, action) {
  if (!state) {
    state = defaultState;
  }

  switch (action.type) {
    case ACTIONS_CHANGED:
      state = {...state,
        actions: action.data.actions
      };
      break;
    case JOINED_GAME:
      console.log(action.data);
      state = {...state,
        inGame: true,
        drawPileSize: action.data.snapshot.drawPileSize,
        players: action.data.snapshot.players,
        sacrifices: action.data.snapshot.sacrifices,
        seed: action.data.snapshot.seed,
        castles: {},

        shop: action.data.snapshot.shop,
        playerCards: action.data.snapshot.playerCards,
        disasters: action.data.snapshot.disasters,
        discardPile: action.data.snapshot.discardPile,

        currentTurn: action.data.snapshot.currentTurn,
        roundTurn: action.data.snapshot.roundTurn,
      }
      action.data.snapshot.castles.forEach(function (castle) {
        state.castles[castle.player] = castle;
      });
      break;
    case CARD_DRAWN_TO_SHOP:
      console.log('Added to shop!');
      state = {...state,
        shop: [...state.shop],
        drawPileSize: action.data.drawPileSize
      };
      state.shop.push(action.data.card);
      break;
    case CARD_DISCARDED:
      console.log('card discarded', action);
      state = {...state,
        discardPile: [...state.discardPile],
        discardPileSize: action.data.discardPileSize,
        shop: [...state.shop]
      };
      state.discardPile.push({
        card: action.data.card
      });
      state.shop = state.shop.filter(function (card) {
        return card !== action.data.card;
      });
      break;
    case SELECT_CARD:
      state = {...state,
        selectedCard: action.card
      };
      break;
    case ROOM_BUILT:
      console.log(action.data);
      let player = action.data.castleOwner;
      let node = {...action.data};
      delete node.castleOwner;

      state = {...state,
        castles: {...state.castles,
          [player]: {...state.castles[player],
            nodes: [...state.castles[player].nodes, node]
          }
        },
        shop: [...state.shop]
      };
      state.shop = state.shop.filter(function (card) {
        return card !== node.card;
      });
      break;
    case TURN_CHANGED:
      console.log('turn change', action);
      break;
  }

  return state;
}
