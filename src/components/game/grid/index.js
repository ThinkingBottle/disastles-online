import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import obstruction from 'obstruction';
import { partial } from 'ap';
import windowSize from 'react-window-size';
import { classNames } from 'react-extras';

import { If } from 'react-extras';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import Card from '../card';

import { selectCard } from '../../../actions/player';
import API from '../../../api';

export const CARD_ZOOM = 1.2;

const styles = theme => ({
  root: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  },
  castle: {
    position: 'absolute',
    top: 0,
    minWidth: '100%',
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  row: {
    position: 'relative',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    flexDirection: 'row',
  },
  node: {
    width: 85 * CARD_ZOOM,
    height: 128 * CARD_ZOOM,
    margin: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    '&.wide': {
      width: 128 * CARD_ZOOM
    },
    '&.short': {
      height: 85 * CARD_ZOOM
    },

    '&.rotation1 > *': {
      transform: 'rotate(90deg) translate3d(0, 0, 0)'
    },
    '&.rotation2 > *': {
      transform: 'rotate(180deg) translate3d(0, 0, 0)'
    },
    '&.rotation3 > *': {
      transform: 'rotate(270deg) translate3d(0, 0, 0)'
    }
  }
});

class GridController extends Component {
  constructor (props) {
    super(props);

    this.rootEl = React.createRef();

    this.state = {
      nodes: [],
      actions: [],
      rows: [],
      grid: {},
      minX: 0,
      maxX: 0,
      minY: 0,
      maxY: 0,
      widthBuffer: 0,
      heightBuffer: 0,
      rotationCard: false,
      rotations: false,
      rotationActions: false,
      rotationCoords: false,
      currentRotation: false,
    };

    this.renderRow = this.renderRow.bind(this);
    this.renderCell = this.renderCell.bind(this);
    this.sendAction = this.sendAction.bind(this);
    this.unselectCard = this.unselectCard.bind(this);
    this.nextRotation = this.nextRotation.bind(this);
  }

  componentWillReceiveProps (newProps) {
    let castle = newProps.castles[newProps.playerId || 'test'];
    let castleHeight = 0;
    let castleWidth = 0;
    let heightBuffer = 0;
    let widthBuffer = 0;
    if (castle) {
      for (let i = castle.minX, l = castle.maxX; i <= l; ++i) {
        if (castle.columnSizes[i] && castle.columnSizes[i] === 'wide') {
          castleWidth += 128 * CARD_ZOOM;
        } else {
          castleWidth += 85 * CARD_ZOOM;
        }
        castleWidth += 10;
      }
      for (let i = castle.minY, l = castle.maxY; i <= l; ++i) {
        if (castle.rowSizes[i] && castle.rowSizes[i] === 'short') {
          castleHeight += 85 * CARD_ZOOM;
        } else {
          castleHeight += 128 * CARD_ZOOM;
        }
        castleHeight += 10;
      }
      heightBuffer = newProps.windowHeight - castleHeight;
      widthBuffer = newProps.windowWidth - castleWidth;
    }

    heightBuffer = Math.min(0, heightBuffer);
    widthBuffer = Math.min(0, widthBuffer);

    this.setState({...castle,
      actions: newProps.actions.filter((action) => {
        if (newProps.selectedCard || action.action === 'BuildRoom') {
          return (this.cardsForAction(action).indexOf(newProps.selectedCard) !== -1);
        }
        return true;
      }),
      heightBuffer, widthBuffer
    });
  }

  nextRotation () {
    let rotation = (this.state.currentRotation + 1) % this.state.rotations.length;
    console.log('Changing to rotation', (this.state.currentRotation + 1) % this.state.rotations.length);
    this.setState({
      currentRotation: rotation
    });
  }

  async sendAction (card, actions, rotations, x, y) {
    let action = actions[0];

    let actionCards = this.cardsForAction(action);

    // select the card if it isn't already selected for this action
    if (actionCards.indexOf(this.props.selectedCard) === -1) {
      return this.props.dispatch(selectCard(card));
    }
    // check if there are multiple rotations
    if (rotations.length > 1) {
      console.log('Rotating', {
        rotationCard: this.props.selectedCard,
        rotations: rotations,
        rotationActions: actions,
        rotationCoords: [x, y],
        currentRotation: 0
      });
      return this.setState({
        rotationCard: this.props.selectedCard,
        rotations: rotations,
        rotationActions: actions,
        rotationCoords: [x, y],
        currentRotation: 0
      });
    } else if (this.state.rotationCoords) {
      this.setState({
        rotationCard: false,
        rotations: false,
        rotationActions: false,
        rotationCoords: false,
        currentRotation: false,
      });
    }

    // effects is an optional param
    // clean it to save some bandwidth, might as well
    if (actions.effects) {
      action = {...action,
        effects: []
      };
    }

    console.log('Sending action', action.action, action);
    API.send(action);
    this.props.dispatch(selectCard(null));
  }

  unselectCard (event) {
    if (event.target.nodeName === 'DIV') {
      this.props.dispatch(selectCard(null));
    }
  }

  cardsForAction (action) {
    if (action.card) {
      return [action.card];
    }
    if (action.room) {
      return [action.room];
    }
    if (action.rooms) {
      return action.rooms.map((r) => r.room);
    }
    return [];
  }

  render () {
    return (
      <div
        ref={ this.rootEl }
        onClick={ this.unselectCard }
        className={ this.props.classes.root }
        >
        <div
          className={ this.props.classes.castle }
          style={{
            left: this.state.widthBuffer / 2 + (0 - this.props.x),
            top: this.state.heightBuffer / 2 + 90 + (0 - this.props.y),
          }}
          >
        { this.state.rows.map(partial(this.renderRow, this.state.minX, this.state.minY)) }
        </div>
      </div>
    );
  }

  renderRow (minX, minY, row, i) {
    let y = this.state.maxY - i;
    return (
      <div key={ y } className={ this.props.classes.row } >
        { row.map(partial(this.renderCell, y, minX)) }
      </div>
    );
  }

  renderCell (y, minX, node, i) {
    let x = i + minX;
    if (this.state.rotationCoords && this.state.rotationCoords[0] === x && this.state.rotationCoords[1] === y) {
      return this.renderRotationCard();
    }
    let key = x + ':' + y;
    let actions = [];
    let actionsTypes = [];
    this.state.actions.forEach((val) => {
      let actionCards = this.cardsForAction(val);
      if (node && node.card === this.props.selectedCard) {
        if (actionCards.length > 1) {
          return false;
        }
        if (val.x !== undefined && (val.x !== x || val.y !== y)) {
          return false;
        }
      }
      if (val.castleOwner && val.castleOwner !== this.props.playerId) {
        return;
      }
      if ((this.props.selectedActions.length || ['BuildRoom', 'MarkRoom', 'RotateRoom'].indexOf(val.action) === -1) && this.props.selectedActions.indexOf(val.action) === -1) {
        return false;
      }
      if (node && actionCards.indexOf(node.card) !== -1) {
        if (actionsTypes.indexOf(val.action) === -1) {
          actionsTypes.push(val.action);
        }
        actions.push(val);
        return val;
      }
      if (actionCards.indexOf(this.props.selectedCard) !== -1 && val.x === x && val.y === y) {
        if (actionsTypes.indexOf(val.action) === -1) {
          actionsTypes.push(val.action);
        }
        actions.push(val);
        return val;
      }
      return;
    });

    let isClickable = actions.length > 0;
    let isActionable = isClickable && actions.filter((a) => this.cardsForAction(a).indexOf(this.props.selectedCard) !== -1).length > 0;

    let rotations = [];
    actions.forEach(function (action) {
      if (action.rotation !== undefined && rotations.indexOf(action.rotation) === -1) {
        rotations.push(action.rotation)
      }
    });

    rotations = rotations.sort();

    if (actions.length) {
      console.log(node ? node.card : x + ',' + y, actionsTypes, rotations, this.props.selectedActions);
    }

    if (!node && !isClickable) {
      return (
        <div
          className={ classNames(
            this.props.classes.node,
            node && ('rotation' + node.rotation),
            this.state.columnSizes[x],
            // this.state.rowSizes[y],
            ) }
          key={ key } >
        </div>
      );
    }

    return (
      <div
        className={ classNames(
          this.props.classes.node,
          node && ('rotation' + node.rotation),
          this.state.columnSizes[x],
          // this.state.rowSizes[y],
          ) }
        data-action={ isActionable }
        key={ key } >
        <Card
          tooltip={ isActionable ? splitWords(actions[0].action) : null }
          skinny={ this.state.columnSizes[x] !== 'wide' }
          height={ 128 * CARD_ZOOM }
          card={ node ? node.card : 'empty' }
          onClick={ isClickable ? partial(this.sendAction, node && node.card, actions, rotations, x, y) : null }
          actions={ actionsTypes }
          />
      </div>
    );
  }

  renderRotationCard () {
    let [x, y] = this.state.rotationCoords;
    let key = x + ':' + y;
    let rotation = this.state.rotations[this.state.currentRotation];
    let action = this.state.rotationActions.filter((a) => a.rotation === rotation)[0];

    console.log('Rendering at rotation', rotation);

    return (
      <div
        className={ classNames(
          this.props.classes.node,
          'rotation' + rotation,
          this.state.columnSizes[x]
          // this.state.rowSizes[y],
        ) }
        key={ key }
        >
        <Card
          tooltip={ splitWords(action.action) }
          skinny={ this.state.columnSizes[x] !== 'wide' }
          card={ this.state.rotationCard }
          onClick={ partial(this.sendAction, this.state.rotationCard, [action], [], x, y) }
          onRotation={ this.nextRotation }
          />
      </div>
    );
  }
}

function splitWords (word) {
  var result = '';
  word.split('').forEach(function (t) {
    if (result.length && t.toUpperCase() === t) {
      result += ' ';
    }
    result += t;
  });

  return result;
}

const mapToProps = obstruction({
  selectedCard: 'game.selectedCard',
  selectedActions: 'game.selectedActions',
  actions: 'game.actions',
  playerId: 'minimap.displayPlayer',
  castles: 'game.castles',
  cards: 'cards.knownCards',
  x: 'minimap.x',
  y: 'minimap.y',
});

export default withStyles(styles)(connect(mapToProps)(windowSize(GridController)));
