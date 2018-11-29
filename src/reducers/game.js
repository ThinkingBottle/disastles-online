import {
  JOINED_GAME,
  CARD_DRAWN_TO_SHOP,
  CARD_DISCARDED,
  ROOM_BUILT
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
  castles: {
    test: {
      nodes: [{
        x: 0,
        y: 0,
        type: 'throne'
      }, {
        x: 1,
        y: 0,
        type: 'some room'
      }, {
        x: 0,
        y: -1,
        type: 'other room'
      }]
    }
  },

  shop: [{
    card: '100'
  }, {
    card: '101'
  }],
  playerCards: [],
  disasters: [],
  discardPile: [],

  currentTurn: null,
  roundTurn: null,
  actions: [
  {
    "x": 0,
    "effects": [
      {
        "castleOwner": "ebb13e78-a408-4125-8ed5-9be1c495454a",
        "stats": {
          "links": {
            "square": 1,
            "cross": 0,
            "moon": 0
          },
          "treasure": 0,
          "rooms": 2,
          "connections": 1
        },
        "effectType": "Stats"
      },
      {
        "castleCard": "dc19ee7a-0b87-40b0-827b-5d2612ed9e02",
        "manipulatedCard": "101",
        "matching": true,
        "effectType": "Link",
        "golden": true
      }
    ],
    "y": 1,
    "rotation": 0,
    "castleOwner": "ebb13e78-a408-4125-8ed5-9be1c495454a",
    "card": "101",
    "action": "BuildRoom"
  },
  {
    "x": 1,
    "effects": [
      {
        "castleOwner": "ebb13e78-a408-4125-8ed5-9be1c495454a",
        "stats": {
          "links": {
            "square": 1,
            "cross": 0,
            "moon": 0
          },
          "treasure": 0,
          "rooms": 2,
          "connections": 1
        },
        "effectType": "Stats"
      },
      {
        "castleCard": "dc19ee7a-0b87-40b0-827b-5d2612ed9e02",
        "manipulatedCard": "6e4",
        "matching": true,
        "effectType": "Link",
        "golden": true
      }
    ],
    "y": 0,
    "rotation": 0,
    "castleOwner": "ebb13e78-a408-4125-8ed5-9be1c495454a",
    "card": "6e4",
    "action": "BuildRoom"
  },
  {
    "x": 0,
    "effects": [
      {
        "castleOwner": "ebb13e78-a408-4125-8ed5-9be1c495454a",
        "stats": {
          "links": {
            "square": 1,
            "cross": 0,
            "moon": 0
          },
          "treasure": 0,
          "rooms": 2,
          "connections": 1
        },
        "effectType": "Stats"
      },
      {
        "castleCard": "dc19ee7a-0b87-40b0-827b-5d2612ed9e02",
        "manipulatedCard": "eaf",
        "matching": true,
        "effectType": "Link",
        "golden": true
      }
    ],
    "y": -1,
    "rotation": 0,
    "castleOwner": "ebb13e78-a408-4125-8ed5-9be1c495454a",
    "card": "eaf",
    "action": "BuildRoom"
  },
  {
    "x": 1,
    "effects": [
      {
        "castleOwner": "ebb13e78-a408-4125-8ed5-9be1c495454a",
        "stats": {
          "links": {
            "square": 0,
            "cross": 1,
            "moon": 0
          },
          "treasure": 0,
          "rooms": 2,
          "connections": 1
        },
        "effectType": "Stats"
      },
      {
        "castleCard": "dc19ee7a-0b87-40b0-827b-5d2612ed9e02",
        "manipulatedCard": "e9e",
        "matching": true,
        "effectType": "Link",
        "golden": false
      }
    ],
    "y": 0,
    "rotation": 0,
    "castleOwner": "ebb13e78-a408-4125-8ed5-9be1c495454a",
    "card": "e9e",
    "action": "BuildRoom"
  },
  {
    "x": -1,
    "effects": [
      {
        "castleOwner": "ebb13e78-a408-4125-8ed5-9be1c495454a",
        "stats": {
          "links": {
            "square": 0,
            "cross": 1,
            "moon": 0
          },
          "treasure": 0,
          "rooms": 2,
          "connections": 1
        },
        "effectType": "Stats"
      },
      {
        "castleCard": "dc19ee7a-0b87-40b0-827b-5d2612ed9e02",
        "manipulatedCard": "6e4",
        "matching": true,
        "effectType": "Link",
        "golden": true
      }
    ],
    "y": 0,
    "rotation": 0,
    "castleOwner": "ebb13e78-a408-4125-8ed5-9be1c495454a",
    "card": "6e4",
    "action": "BuildRoom"
  },
  {
    "x": 0,
    "effects": [
      {
        "castleOwner": "ebb13e78-a408-4125-8ed5-9be1c495454a",
        "stats": {
          "links": {
            "square": 1,
            "cross": 0,
            "moon": 0
          },
          "treasure": 0,
          "rooms": 2,
          "connections": 1
        },
        "effectType": "Stats"
      },
      {
        "castleCard": "dc19ee7a-0b87-40b0-827b-5d2612ed9e02",
        "manipulatedCard": "101",
        "matching": true,
        "effectType": "Link",
        "golden": true
      }
    ],
    "y": -1,
    "rotation": 0,
    "castleOwner": "ebb13e78-a408-4125-8ed5-9be1c495454a",
    "card": "101",
    "action": "BuildRoom"
  },
  {
    "x": -1,
    "effects": [
      {
        "castleOwner": "ebb13e78-a408-4125-8ed5-9be1c495454a",
        "stats": {
          "links": {
            "square": 0,
            "cross": 1,
            "moon": 0
          },
          "treasure": 0,
          "rooms": 2,
          "connections": 1
        },
        "effectType": "Stats"
      },
      {
        "castleCard": "dc19ee7a-0b87-40b0-827b-5d2612ed9e02",
        "manipulatedCard": "eaf",
        "matching": true,
        "effectType": "Link",
        "golden": false
      }
    ],
    "y": 0,
    "rotation": 0,
    "castleOwner": "ebb13e78-a408-4125-8ed5-9be1c495454a",
    "card": "eaf",
    "action": "BuildRoom"
  },
  {
    "x": 1,
    "effects": [
      {
        "castleOwner": "ebb13e78-a408-4125-8ed5-9be1c495454a",
        "stats": {
          "links": {
            "square": 0,
            "cross": 1,
            "moon": 0
          },
          "treasure": 0,
          "rooms": 2,
          "connections": 1
        },
        "effectType": "Stats"
      },
      {
        "castleCard": "dc19ee7a-0b87-40b0-827b-5d2612ed9e02",
        "manipulatedCard": "101",
        "matching": true,
        "effectType": "Link",
        "golden": true
      }
    ],
    "y": 0,
    "rotation": 0,
    "castleOwner": "ebb13e78-a408-4125-8ed5-9be1c495454a",
    "card": "101",
    "action": "BuildRoom"
  },
  {
    "x": 0,
    "effects": [
      {
        "castleOwner": "ebb13e78-a408-4125-8ed5-9be1c495454a",
        "stats": {
          "links": {
            "square": 0,
            "cross": 0,
            "moon": 1
          },
          "treasure": 0,
          "rooms": 2,
          "connections": 1
        },
        "effectType": "Stats"
      },
      {
        "castleCard": "dc19ee7a-0b87-40b0-827b-5d2612ed9e02",
        "manipulatedCard": "e9e",
        "matching": true,
        "effectType": "Link",
        "golden": true
      }
    ],
    "y": 1,
    "rotation": 0,
    "castleOwner": "ebb13e78-a408-4125-8ed5-9be1c495454a",
    "card": "e9e",
    "action": "BuildRoom"
  },
  {
    "action": "SkipTurn"
  },
  {
    "x": 0,
    "effects": [
      {
        "castleOwner": "ebb13e78-a408-4125-8ed5-9be1c495454a",
        "stats": {
          "links": {
            "square": 0,
            "cross": 0,
            "moon": 1
          },
          "treasure": 0,
          "rooms": 2,
          "connections": 1
        },
        "effectType": "Stats"
      },
      {
        "castleCard": "dc19ee7a-0b87-40b0-827b-5d2612ed9e02",
        "manipulatedCard": "eaf",
        "matching": true,
        "effectType": "Link",
        "golden": false
      }
    ],
    "y": 1,
    "rotation": 0,
    "castleOwner": "ebb13e78-a408-4125-8ed5-9be1c495454a",
    "card": "eaf",
    "action": "BuildRoom"
  },
  {
    "x": 1,
    "effects": [
      {
        "castleOwner": "ebb13e78-a408-4125-8ed5-9be1c495454a",
        "stats": {
          "links": {
            "square": 1,
            "cross": 0,
            "moon": 0
          },
          "treasure": 0,
          "rooms": 2,
          "connections": 1
        },
        "effectType": "Stats"
      },
      {
        "castleCard": "dc19ee7a-0b87-40b0-827b-5d2612ed9e02",
        "manipulatedCard": "d74",
        "matching": true,
        "effectType": "Link",
        "golden": false
      }
    ],
    "y": 0,
    "rotation": 0,
    "castleOwner": "ebb13e78-a408-4125-8ed5-9be1c495454a",
    "card": "d74",
    "action": "BuildRoom"
  },
  {
    "x": 1,
    "effects": [
      {
        "castleOwner": "ebb13e78-a408-4125-8ed5-9be1c495454a",
        "stats": {
          "links": {
            "square": 0,
            "cross": 1,
            "moon": 0
          },
          "treasure": 0,
          "rooms": 2,
          "connections": 1
        },
        "effectType": "Stats"
      },
      {
        "castleCard": "dc19ee7a-0b87-40b0-827b-5d2612ed9e02",
        "manipulatedCard": "eaf",
        "matching": true,
        "effectType": "Link",
        "golden": true
      }
    ],
    "y": 0,
    "rotation": 0,
    "castleOwner": "ebb13e78-a408-4125-8ed5-9be1c495454a",
    "card": "eaf",
    "action": "BuildRoom"
  },
  {
    "x": 0,
    "effects": [
      {
        "castleOwner": "ebb13e78-a408-4125-8ed5-9be1c495454a",
        "stats": {
          "links": {
            "square": 0,
            "cross": 1,
            "moon": 0
          },
          "treasure": 0,
          "rooms": 2,
          "connections": 1
        },
        "effectType": "Stats"
      },
      {
        "castleCard": "dc19ee7a-0b87-40b0-827b-5d2612ed9e02",
        "manipulatedCard": "d74",
        "matching": true,
        "effectType": "Link",
        "golden": false
      }
    ],
    "y": 1,
    "rotation": 0,
    "castleOwner": "ebb13e78-a408-4125-8ed5-9be1c495454a",
    "card": "d74",
    "action": "BuildRoom"
  }
],
  selectedCard: '101'
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
      state.shop.push({
        card: action.data.card
      });
      break;
    case CARD_DISCARDED:
      state = {...state,
        discardPile: [...state.discardPile],
        discardPileSize: action.data.discardPileSize
      };
      state.discardPile.push({
        card: action.data.card
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
        }
      };
      break;
  }

  return state;
}
