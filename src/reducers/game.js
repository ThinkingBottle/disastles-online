import Obstruction from 'obstruction';
import Sound from '../sound';

import {
  JOINED_GAME,
  CARD_DRAWN_TO_SHOP,
  CARD_DISCARDED,
  TURN_CHANGED,
  DISASTER_STARTED,
  DISASTER_FINISHED,
  DISASTER_SACRIFICES_REQUIRED,
  ROOM_MARKED,
  ROOMS_UNMARKED,
  CARD_RETURNED_TO_DRAW_PILE,
  CARDS_RETURNED_FROM_PLAYER,
  CARDS_DRAWN_TO_PLAYER,
  CARD_PLAYED,

  ROOM_BUILT,
  ROOM_BUILT_AND_SWAPPED,
  ROOM_MOVED,
  ROOM_ROTATED,
  ROOMS_SWAPPED,
  LINK_CREATED,
  ROOM_ACTIVATED,
  ROOM_DEACTIVATED,
  CASTLE_STATS_CHANGED,
  CLEAR_DISASTER_MODAL,

  GAME_ENDED,

} from '../actions/game';

import {
  ACTIONS_CHANGED
} from '../actions/global';

import {
  SELECT_CARD,
  SELECT_ACTIONS
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
  playerCards: {},
  disasters: [],
  discardPile: [],

  currentTurn: null,
  roundTurn: null,
  actions: [ ],
  selectedCard: null,
  selectedActions: [],
  currentDisaster: false,
  disasterModal: null,

  activeCard: null
};

export default function reduce (state, action) {
  if (!state) {
    state = defaultState;
  }

  switch (action.type) {
    case ACTIONS_CHANGED:
      console.log('Actions changed', action.data.actions);
      state = {...state,
        actions: action.data.actions,
        actionable: !!action.data.actions.length
      };
      break;
    case JOINED_GAME:
      console.log('joined game', action.data.snapshot);
      Sound.sfx.playSound('startGame');
      state = {...state,
        inGame: true,
        drawPileSize: action.data.snapshot.drawPileSize,
        players: action.data.snapshot.players,
        sacrifices: action.data.snapshot.sacrifices,
        seed: action.data.snapshot.seed,
        castles: {},

        shop: action.data.snapshot.shop,
        playerCards: {},
        disasters: action.data.snapshot.disasters,
        discardPile: action.data.snapshot.discardPile,
        discardPileSize: action.data.snapshot.discardPileSize || action.data.snapshot.discardPile.length,

        currentTurn: action.data.snapshot.currentTurn,
        roundTurn: action.data.snapshot.roundTurn,
        currentDisaster: action.data.snapshot.currentDisaster
      }
      action.data.snapshot.castles.forEach(function (castle) {
        castle.nodes = castle.nodes.map(function (node) {
          node.marked = action.data.snapshot.sacrifices.reduce(function (memo, player) {
            return memo || (player.markedRooms.indexOf(node.card) !== -1);
          }, false);
          return node;
        });
        state.castles[castle.player] = updateCastle(castle);
      });
      action.data.snapshot.playerCards.forEach(function (playerCards) {
        state.playerCards[playerCards.player] = playerCards;
      });
      while (state.shop.length < 5) {
        state.shop.push(null);
      }
      break;
    case CARDS_RETURNED_FROM_PLAYER:
      console.log('Emptying players hand');
      state = {...state,
        playerCards: {...state.playerCards},
        drawPileSize: action.data.drawPileSize
      };
      delete state.playerCards[action.data.player];
      break;
    case CARDS_DRAWN_TO_PLAYER:
      console.log('Player drew some cards?', action);
      Sound.sfx.playSound('draw');
      state = {...state,
        playerCards: {...state.playerCards,
          [action.data.player]: action.data
        },
        drawPileSize: action.data.drawPileSize
      };
      break;
    case CARD_DRAWN_TO_SHOP:
      Sound.sfx.playSound('draw');
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
      Sound.sfx.playSound('discard');
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
    case SELECT_ACTIONS:
      state = {...state,
        selectedActions: action.actions
      };
      break;
    case CARD_PLAYED:
      console.log('Card played', action.data);
      if (action.data.card) {
        Sound.sfx.playSound('action');
      }
      state = {...state,
        activeCard: action.data.card
      };
      break;
    case ROOM_BUILT_AND_SWAPPED:
      console.log('Moving room for build & swap', action);
      var roomX = null;
      var roomY = null;

      var player = action.data.castleOwner;
      state = {...state,
        castles: {...state.castles,
          [player]: {...state.castles[player]}
        }
      };

      state.castles[player].nodes = state.castles[player].nodes.map(function (node) {
        if (action.data.swap === node.card) {
          roomX = node.x;
          roomY = node.y;
          return {...node,
            rotation: action.data.swapRotation,
            x: action.data.x,
            y: action.data.y,
          };
        }
        return node;
      });

      state.castles[player] = updateCastle(state.castles[player]);
      // pass on action to room built
      action = {
        data: {
          castleOwner: action.data.castleOwner,
          rotation: action.data.swapRotation,
          x: action.data.x,
          y: action.data.y,
          card: action.data.card
        }
      };
      // intentionally no break
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
        shop: [...state.shop],
        playerCards: {...state.playerCards}
      };
      state.shop = state.shop.map(function (card) {
        if (card === node.card) {
          return null;
        }
        return card;
      });
      Object.keys(state.playerCards).forEach(function (handPlayer) {
        state.playerCards[handPlayer].revealed
           = state.playerCards[handPlayer].revealed.filter(function (card) {
          if (card === node.card) {
            state.playerCards[handPlayer].count--;
            return false;
          }
          return true;
        });
      });
      state.castles[player] = updateCastle(state.castles[player]);
      break;
    case ROOM_ROTATED:
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
            rotation: action.data.rotation !== undefined ? action.data.rotation : node.rotation,
            x: action.data.x !== undefined ? action.data.x : node.x,
            y: action.data.y !== undefined ? action.data.y : node.y,
          };
        }
        return node;
      });
      state.castles[player] = updateCastle(state.castles[player]);
      break;

    case ROOMS_SWAPPED:
      console.log('Swapping rooms >.>', action);
      state = {...state,
        castles: {...state.castles}
      };

      let firstPlayer = action.data.rooms[0].castleOwner;
      let firstCard = state.castles[firstPlayer].nodes.filter((c) => c.card === action.data.rooms[0].room)[0];

      let secondPlayer = action.data.rooms[1].castleOwner;
      let secondCard = state.castles[secondPlayer].nodes.filter((c) => c.card === action.data.rooms[1].room)[0];

      if (!firstPlayer || !secondPlayer) {
        console.error('Could not swap rooms, couldn\'t find', action.data.rooms.map((r) => r.room), 'but did find', firstCard, secondCard);
        break;
      }

      state.castles[firstPlayer].nodes = state.castles[firstPlayer].nodes.map(function (node) {
        if (node.x === firstCard.x && node.y === firstCard.y) {
          node = {...node,
            rotation: secondCard.rotation,
            card: secondCard.card
          };
        }
        return node;
      });
      state.castles[secondPlayer].nodes = state.castles[secondPlayer].nodes.map(function (node) {
        if (node.x === secondCard.x && node.y === secondCard.y) {
          node = {...node,
            rotation: firstCard.rotation,
            card: firstCard.card
          };
        }
        return node;
      });

      state.castles[firstPlayer] = updateCastle(state.castles[firstPlayer]);
      state.castles[secondPlayer] = updateCastle(state.castles[secondPlayer]);
      break;
    case LINK_CREATED:
      console.log('Link created', action);
      Sound.sfx.playSound('connection');
      var player = action.data.castleOwner;
      state = {...state,
        castles: {...state.castles,
          [player]: {...state.castles[player],
            links: [...state.castles[player].links, action.data]
          }
        }
      };
      state.castles[player] = updateCastle(state.castles[player]);
      break;
    case ROOM_ACTIVATED:
      console.log('Room activated!', action);
      var player = castleOwner(state, action.data.room);
      console.log('player owner', player);
      state = {...state,
        castles: {...state.castles,
          [player]: {...state.castles[player],
            nodes: state.castles[player].nodes.map(function (node) {
              if (node.card === action.data.room) {
                node.active = true;
              }
              return node;
            })
          }
        }
      };
      break;
    case ROOM_DEACTIVATED:
      console.log('Room deactivated!', action);
      var player = castleOwner(state, action.data.room);
      state = {...state,
        castles: {...state.castles,
          [player]: {...state.castles[player],
            nodes: state.castles[player].nodes.map(function (node) {
              if (node.card === action.data.room) {
                node.active = false;
              }
              return node;
            })
          }
        }
      };
      break;
    case CASTLE_STATS_CHANGED:
      var player = action.data.castleOwner;
      state = {...state,
        castles: {...state.castles,
          [player]: {...state.castles[player],
            stats: action.data.stats
          }
        }
      };
      break;
    case ROOM_MARKED:
      console.log('room marked for destruction', action);
      var player = action.data.castleOwner;
      state = {...state,
        castles: {...state.castles,
          [player]: {...state.castles[player],
            nodes: state.castles[player].nodes.map(function (node) {
              if (node.card === action.data.room) {
                node.marked = true;
              }
              return node;
            })
          }
        }
      };
      break;
    case ROOMS_UNMARKED:
      console.log('rooms unmarked!', action);
      var player = action.data.castleOwner;
      state = {...state,
        castles: {...state.castles,
          [player]: {...state.castles[player],
            nodes: state.castles[player].nodes.map(function (node) {
              node.marked = false;
              return node;
            })
          }
        }
      };
      break;
      // 280

      // end castle stuff

    case DISASTER_STARTED:
      console.log('Disaster started', action);
      // Sound.sfx.playSound('disaster');
      state = {...state,
        currentDisaster: action.data.card,
        disasterModal: {...action.data,
          damage: {
            square: 0,
            cross: 0,
            moon: 0,
          }
        }
      };
      break;
    case DISASTER_SACRIFICES_REQUIRED:
      console.log('Disaster sacrifices', action);
      Sound.sfx.playSound('disaster');
      state = {...state,
        disasterModal: {...state.disasterModal,
          damage: action.data.sacrifices[0].damageDetails.incoming
        },
      };
      break;
    case CLEAR_DISASTER_MODAL:
      state = {...state,
        disasterModal: null,
      };
      break;
    case DISASTER_FINISHED:
      console.log('Disaster finished');
      state = {...state,
        currentDisaster: null,
        shop: state.shop.filter((card) => card !== state.currentDisaster),
        disasters: [...state.disasters, state.currentDisaster]
      };
      break;
    case TURN_CHANGED:
      console.log('turn change', action);
      state = {...state,
        currentTurn: action.data.currentTurn,
        selectedCard: null,
        selectedActions: []
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
      Sound.sfx.playSound('gameover');
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

    castle.links.forEach(function (link) {
      if (link.from === node.card || link.to === node.card) {
        node.links++;
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

function castleOwner (state, room) {
  let result = null;
  Object.keys(state.castles).forEach(function (player) {
    if (result) {
      return;
    }
    let castle = state.castles[player];
    castle.nodes.forEach(function (node) {
      if (result || !node) {
        return;
      }
      if (node.card === room) {
        result = player;
      }
    });
  });

  return result;
}
