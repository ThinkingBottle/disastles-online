import {
  LOBBY_SNAPSHOT,
  PLAYER_JOINED,
  PLAYER_SLOT_CHANGED
} from '../actions/lobby';

const defaultState = {
  id: null,
  players: []
};

export default function reduce (state, action) {
  if (!state) {
    state = defaultState;
  }

  switch (action.type) {
    case PLAYER_JOINED:
      state = {...state,
        players: [...state.players, action.player.player],
        slots: [...state.slots]
      };
      state.slots[action.player.slot] = action.player.player;
      break;
    case LOBBY_SNAPSHOT:
      state = {...state,
        players: action.snapshot.players,
        id: action.snapshot.id,
        settings: action.snapshot.settings,
        slots: action.snapshot.slots
      };
      break;
    case PLAYER_SLOT_CHANGED:
      state = {...state,
        slots: [...state.slots]
      };
      state.slots[action.data.from] = null;
      state.slots[action.data.to] = action.data.player;
      console.log(state);
  }

  return state;
}
