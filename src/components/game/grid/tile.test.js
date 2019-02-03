import { Provider } from "react-redux";
import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import Tile from './tile';
import store from '../../../store';
import { JOINED_GAME } from '../../../actions/game';

store.dispatch({
  type: JOINED_GAME,
  data: {
    snapshot: {
      deck: {
        123: {
          asset: 'card-15-reinforced-walls'
        },
        foo: {
          asset: 'card-15-reinforced-walls'
        }
      },
      discardPile: [],
      castles: [],
      playerCards: [],
      shop: [],
      players: [],
    }
  }
});

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Provider store={store}>
      <Tile
        actions={ [] }
        minX={0}
        y={0}
        node={ null }
        x={ 0 }
        rotationCoords={ null }
        columnSizes={ ['normal'] }
        rowSizes={ ['normal'] }
        rotations={ [] }
        currentRotation={ null }
        rotationActions={ [] }
        rotationCard={ null }
        selectedCard={ null }
        selectedActions={ [] }
        />
    </Provider>
  , div);
  ReactDOM.unmountComponentAtNode(div);
});

it('is selectable when it has actions', () => {
  var tile = shallow(
    <Tile
      store={ store }
      actions={ [{
        action: 'MoveRoom',
        x: 1,
        y: 1,
        card: '123'
      }] }
      minX={0}
      y={0}
      node={ {
        card: '123',
        rotation: 0,
      } }
      x={ 0 }
      rotationCoords={ null }
      columnSizes={ ['normal'] }
      rowSizes={ ['normal'] }
      rotations={ [] }
      currentRotation={ null }
      rotationActions={ [] }
      rotationCard={ null }
      selectedCard={ null }
      selectedActions={ ['MoveRoom'] }
    />
    ).dive().dive();

  expect(tile.props()['data-clickable']).toBe(true);
});

it('has confirm box on multi-card-actions', () => {
  var tile = shallow(
    <Tile
      store={ store }
      actions={ [{
        action: 'SwapRooms',
        rooms: [{
          room: '123',
        }, {
          room: 'foo',
        }]
      }] }
      minX={0}
      y={0}
      node={ {
        card: '123',
        rotation: 0,
      } }
      x={ 0 }
      rotationCoords={ null }
      columnSizes={ ['normal'] }
      rowSizes={ ['normal'] }
      rotations={ [] }
      currentRotation={ null }
      rotationActions={ [] }
      rotationCard={ null }
      selectedCard={ 'foo' }
      selectedActions={ ['SwapRooms'] }
    />
    ).dive().dive();

  expect(tile.props()['data-action']).toBe(true);
  expect(tile.props()['data-clickable']).toBe(true);
});

it('shows slot for building', () => {
  var tile = shallow(
    <Tile
      store={ store }
      actions={ [{
        action: 'BuildRoom',
        card: '123',
        x: 0,
        y: 0,
        rotation: 0,
      }] }
      minX={0}
      x={ 0 }
      y={ 0 }
      node={ null }
      rotationCoords={ null }
      columnSizes={ ['normal'] }
      rowSizes={ ['normal'] }
      rotations={ [] }
      currentRotation={ null }
      rotationActions={ [] }
      rotationCard={ null }
      selectedCard={ '123' }
      selectedActions={ [] }
    />
    ).dive().dive();

  expect(tile.props()['data-action']).toBe(true);
  expect(tile.props()['data-clickable']).toBe(true);
});

it('shows slot for building with rotation', () => {
  var tile = shallow(
    <Tile
      store={ store }
      actions={ [{
        action: 'BuildRoom',
        card: '123',
        x: 0,
        y: 0,
        rotation: 0,
      }, {
        action: 'BuildRoom',
        card: '123',
        x: 0,
        y: 0,
        rotation: 1,
      }, {
        action: 'BuildRoom',
        card: '123',
        x: 0,
        y: 0,
        rotation: 2,
      }] }
      minX={0}
      x={ 0 }
      y={ 0 }
      node={ null }
      rotationCoords={ null }
      columnSizes={ ['normal'] }
      rowSizes={ ['normal'] }
      rotations={ [] }
      currentRotation={ null }
      rotationActions={ [] }
      rotationCard={ null }
      selectedCard={ '123' }
      selectedActions={ [] }
    />
    ).dive().dive();

  expect(tile.props()['data-rotations']).toEqual([0, 1, 2]);
  expect(tile.props()['data-action']).toBe(true);
  expect(tile.props()['data-clickable']).toBe(true);
});

it('building slot waits for rotation', () => {
  var tile = shallow(
    <Tile
      store={ store }
      actions={ [{
        action: 'MoveRoom',
        card: '123',
        x: 0,
        y: 0,
        rotation: 0,
      }, {
        action: 'MoveRoom',
        card: '123',
        x: 0,
        y: 0,
        rotation: 1,
      }] }
      minX={0}
      x={ 0 }
      y={ 0 }
      node={ null }
      rotationCoords={ null }
      columnSizes={ ['normal'] }
      rowSizes={ ['normal'] }
      rotations={ [] }
      currentRotation={ null }
      rotationActions={ [] }
      rotationCard={ null }
      selectedCard={ '123' }
      selectedActions={ ['MoveRoom'] }
    />
    ).dive().dive();

  expect(tile.props()['data-rotations']).toEqual([0, 1]);
  expect(tile.props()['data-action']).toBe(true);
  expect(tile.props()['data-clickable']).toBe(true);
});

it('move and rotates', () => {
  var tile = shallow(
    <Tile
      store={ store }
      actions={ [{
        action: 'MoveRoom',
        card: '123',
        x: 0,
        y: 0,
        rotation: 0,
      }, {
        action: 'MoveRoom',
        card: '123',
        x: 0,
        y: 0,
        rotation: 1,
      }] }
      minX={0}
      x={ 2 }
      y={ 0 }
      node={ { card: '123' } }
      rotationCoords={ null }
      columnSizes={ ['normal'] }
      rowSizes={ ['normal'] }
      rotations={ [] }
      currentRotation={ null }
      rotationActions={ [] }
      rotationCard={ null }
      selectedCard={ null }
      selectedActions={ ['MoveRoom'] }
    />
    ).dive().dive();

  expect(tile.props()['data-rotations']).toEqual([]);
  expect(tile.props()['data-action']).toBe(false);
  expect(tile.props()['data-clickable']).toBe(true);
});

it('rotation in place', () => {
  var tile = shallow(
    <Tile
      store={ store }
      actions={ [{
        action: 'RotateRoom',
        room: '123',
        rotation: 0,
      }, {
        action: 'RotateRoom',
        room: '123',
        rotation: 1,
      }] }
      minX={0}
      x={ 2 }
      y={ 0 }
      node={ { card: '123' } }
      rotationCoords={ null }
      columnSizes={ ['normal'] }
      rowSizes={ ['normal'] }
      rotations={ [] }
      currentRotation={ null }
      rotationActions={ [] }
      rotationCard={ null }
      selectedCard={ '123' }
      selectedActions={ ['RotateRoom'] }
    />
    ).dive().dive();

  expect(tile.props()['data-rotations']).toEqual([0, 1]);
  expect(tile.props()['data-action']).toBe(true);
  expect(tile.props()['data-clickable']).toBe(true);
});
