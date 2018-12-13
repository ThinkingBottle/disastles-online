import Obstruction from 'obstruction';

import {
  JOINED_GAME,
  CARD_DRAWN_TO_SHOP,
  CARD_DISCARDED,
  ROOM_BUILT,
  ROOM_MOVED,
  TURN_CHANGED,
  DISASTER_STARTED,
  DISASTER_FINISHED,
  CARD_RETURNED_TO_DRAW_PILE,
  ROOM_ROTATED,
  GAME_ENDED
} from '../actions/game';

import {
  ACTIONS_CHANGED
} from '../actions/global';

import {
  SELECT_CARD
} from '../actions/player';

const defaultState = {
  inGame: false,
  actionable: false,
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
  selectedCard: null,
  currentDisaster: false
};

export default function reduce (state, action) {
  if (!state) {
    state = defaultState;
  }

  switch (action.type) {
    case ACTIONS_CHANGED:
      state = {...state,
        actions: action.data.actions,
        actionable: !!action.data.actions.length
      };
      break;
    case JOINED_GAME:
      console.log('joined game', action.data.snapshot);
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
        discardPileSize: action.data.snapshot.discardPileSize || action.data.snapshot.discardPile.length,

        currentTurn: action.data.snapshot.currentTurn,
        roundTurn: action.data.snapshot.roundTurn,
        currentDisaster: action.data.snapshot.currentDisaster
      }
      action.data.snapshot.castles.forEach(function (castle) {
        state.castles[castle.player] = updateCastle(castle);
      });
      break;
    case CARD_DRAWN_TO_SHOP:
      state = {...state,
        shop: [...state.shop],
        drawPileSize: action.data.drawPileSize
      };
      state.shop.push(action.data.card);
      state.shop = state.shop.filter((a) => !!a);
      console.log('card Added to shop!', [...state.shop]);
      break;
    case CARD_DISCARDED:
      console.log('card discarded', action);
      state = {...state,
        discardPile: [...state.discardPile],
        discardPileSize: action.data.discardPileSize,
        shop: [...state.shop],
        castles: {...state.castles},
      };
      state.discardPile.push({
        card: action.data.card
      });
      state.shop = state.shop.filter(function (card) {
        return card && card !== action.data.card;
      });
      let changedPlayerCastle = false;
      Object.keys(state.castles).forEach(function (player) {
        let castle = state.castles[player];
        castle.nodes = castle.nodes.filter(function (node) {
          if (node.card === action.data.card) {
            changedPlayerCastle = player;
            return false;
          }
          return true;
        });
      });
      if (changedPlayerCastle) {
        state.castles[changedPlayerCastle] = updateCastle(state.castles[changedPlayerCastle]);
      }
      break;
    case SELECT_CARD:
      state = {...state,
        selectedCard: action.card
      };
      break;
    case ROOM_BUILT:
      console.log(action.data);
      var player = action.data.castleOwner;
      var node = {...action.data};
      delete node.castleOwner;

      state = {...state,
        castles: {...state.castles,
          [player]: {...state.castles[player],
            nodes: [...state.castles[player].nodes, node]
          }
        },
        shop: [...state.shop]
      };
      state.shop = state.shop.map(function (card) {
        if (card === node.card) {
          return null;
        }
        return card;
      });
      state.castles[player] = updateCastle(state.castles[player]);
      break;
    case ROOM_ROTATED:
      console.log('Rotating room', action);
    case ROOM_MOVED:
      console.log('Moving room', action);
      var player = action.data.castleOwner;
      state = {...state,
        castles: {...state.castles,
          [player]: {...state.castles[player]}
        }
      };

      state.castles[player].nodes = state.castles[player].nodes.map(function (node) {
        if (action.data.room === node.card) {
          return {...node,
            ...Obstruction({
              rotation: true,
              x: true,
              y: true,
            })(action.data)
          }
        }
        return node;
      });
      state.castles[player] = updateCastle(state.castles[player]);
      break;

    case DISASTER_STARTED:
      console.log('Disaster started');
      state = {...state,
        currentDisaster: action.data.card
      };
      break;
    case DISASTER_FINISHED:
      console.log('Disaster finished');
      state = {...state,
        currentDisaster: null,
        shop: state.shop.filter((card) => card !== state.currentDisaster)
      };
      break;
    case TURN_CHANGED:
      console.log('turn change', action);
      state = {...state,
        currentTurn: action.data.currentTurn
      };
      break;
    case CARD_RETURNED_TO_DRAW_PILE:
      state = {...state,
        currentDisaster: state.currentDisaster === action.data.card ? null : state.currentDisaster,
        shop: state.shop.filter((card) => card !== action.data.card)
      };
      break;
    case GAME_ENDED:
      console.log('The game has ended', action.data);
      state = {...state,
        gameEnded: true,
        gameStats: action.data
      };
      break;
  }

  return state;
}

function updateCastle (castle) {
  let minX = 0;
  let maxX = 0;
  let minY = 0;
  let maxY = 0;
  let grid = {};

  let rowSizes = {};
  let columnSizes = {};

  castle.rowSizes = rowSizes;
  castle.columnSizes = columnSizes;

  castle.nodes.forEach(function (node) {
    minX = Math.min(minX, node.x);
    maxX = Math.max(maxX, node.x);
    minY = Math.min(minY, node.y);
    maxY = Math.max(maxY, node.y);

    if (!grid[node.x]) {
      grid[node.x] = {};
    }
    grid[node.x][node.y] = node;

    if (node.rotation % 2 === 1) {
      node.sideways = true;
      columnSizes[node.x] = 'wide';
      if (!rowSizes[node.y]) {
        rowSizes[node.y] = 'short';
      }
    } else {
      node.sideways = false;
      if (!columnSizes[node.x]) {
        columnSizes[node.x] = 'normal';
      }
      rowSizes[node.y] = 'normal';
    }

    node.links = 0;
    node.matchingLinks = 0;
    node.goldenLinks = 0;
    node.goldenMatchingLinks = 0;
    node.active = false;
    castle.links.forEach(function (link) {
      if (link.from === node.card || link.to === node.card) {
        node.linkCount++;
        if (link.golden) {
          node.goldenLinks++;
          if (link.matching) {
            node.goldenMatchingLinks++;
            node.matchingLinks++;
          }
        } else if (link.matching) {
          // matching, not golden
          node.matchingLinks++;
        }
      }
    });
  });

  minX--;
  maxX++;
  minY--;
  maxY++;

  maxX = Math.max(maxX, 3);
  minX = Math.min(minX, -3);
  maxY = Math.max(maxY, 3);
  minY = Math.min(minY, -3);

  console.log(minX, maxX, minY, maxY);

  let width = maxX - minX + 1;
  let height = maxY - minY + 1;
  let rows = [];

  for (let y = 0; y < height; ++y) {
    let row = [];
    for (let x = 0; x < width; ++x) {
      if (grid[x + minX]) {
        row.push(grid[x + minX][maxY - y]);
      } else {
        row.push(null);
      }
    }
    rows.push(row);
  }

  castle.minX = minX;
  castle.minY = minY;
  castle.maxX = maxX;
  castle.maxY = maxY;
  castle.grid = grid;
  castle.rows = rows;
  castle.height = height;
  castle.width = width;

  return castle;
}
