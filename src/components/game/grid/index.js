import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import obstruction from 'obstruction';
import { partial } from 'ap';
import windowSize from 'react-window-size';

import Tile from './tile';

import { selectCard, selectActions } from '../../../actions/player';
import { moveCamera } from '../../../actions/minimap';
import API from '../../../api';
import Sound from '../../../sound';

import { CARD_ZOOM } from './tile';
export { CARD_ZOOM } from './tile';

const styles = theme => ({
  root: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    userSelect: 'none',
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
    pointerEvents: 'none',
    userSelect: 'none',

    flexDirection: 'row',
  },
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
    this.dragStart = this.dragStart.bind(this);
    this.dragEnd = this.dragEnd.bind(this);
    this.drag = this.drag.bind(this);
  }

  drag (event) {
    if (!this.dragging || !event.buttons || !this.dragX || !this.dragY) {
      return;
    }
    var bounds = event.target.getBoundingClientRect();
    var x = (this.dragX - (event.clientX - bounds.left));
    var y = (this.dragY - (event.clientY - bounds.top));
    console.log(x - this.dragX, y - this.dragY);
    this.props.dispatch(moveCamera(this.props.x + x, this.props.y + y));
    this.dragX += x;
    this.dragY += y;
  }
  dragStart (event) {
    var bounds = event.target.getBoundingClientRect();
    var x = event.clientX - bounds.left;
    var y = event.clientY - bounds.top;
    this.dragging = true;
    this.dragX = x;
    this.dragY = y;
  }
  dragEnd (event) {
    this.dragging = false;
  }

  componentWillReceiveProps (newProps) {
    let castle = newProps.castles[newProps.playerId || 'test'];
    let castleHeight = 0;
    let castleWidth = 0;
    let heightBuffer = 0;
    let widthBuffer = 0;

    if (this.dragX && this.dragY) {
      this.dragX += this.props.x - newProps.x;
      this.dragY += this.props.y - newProps.y;
    }
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
          return (Tile.cardsForAction(action).indexOf(newProps.selectedCard) !== -1);
        }
        return true;
      }),
      heightBuffer, widthBuffer
    });
  }

  nextRotation () {
    let rotation = (this.state.currentRotation + 1) % this.state.rotations.length;
    if (rotation !== this.state.currentRotation) {
      Sound.sfx.playSound('rotate');
      this.setState({
        currentRotation: rotation
      });
    }
  }

  async sendAction (card, actions, rotations, x, y) {
    card = card || this.props.selectedCard;

    let actionCards = actions.reduce(function (actionCards, action) {
      Tile.cardsForAction(action).forEach(function (card) {
        if (actionCards.indexOf(card === -1)) {
          actionCards.push(card);
        }
      });
      return actionCards
    }, []);
    let action = actions.reduce((memo, a) => {
      if (Tile.cardsForAction(a).indexOf(this.props.selectedCard) !== -1) {
        return a;
      }
      return memo;
    }, actions[0]);

    // check if there are multiple rotations
    if (rotations.length > 1) {
      return this.setState({
        rotationCard: card,
        rotations: rotations,
        rotationActions: actions,
        rotationCoords: [x, y],
        currentRotation: 0
      });
    }
    // select the card if it isn't already selected for this action
    if (card !== this.state.rotationCard && actionCards.indexOf(this.props.selectedCard) === -1) {
      return this.props.dispatch(selectCard(card));
    }

    // effects is an optional param
    // clean it to save some bandwidth, might as well
    if (actions.effects) {
      action = {...action,
        effects: []
      };
    }

    API.send(action);
    this.props.dispatch(selectCard(null));
    this.props.dispatch(selectActions([]));
    this.setState({
      rotationCard: false,
      rotations: false,
      rotationActions: false,
      rotationCoords: false,
      currentRotation: false,
    });
  }

  unselectCard (event) {
    if (event.target.nodeName === 'DIV') {
      this.props.dispatch(selectCard(null));
    }
  }

  render () {
    return (
      <div
        ref={ this.rootEl }
        onClick={ this.unselectCard }
        onMouseDown={ this.dragStart }
        onMouseUp={ this.dragEnd }
        onMouseMove={ this.drag }
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
    return (
      <Tile
        actions={ this.props.actions }
        minX={minX}
        y={y}
        x={i}
        node={node}
        rotationCoords={ this.state.rotationCoords }
        columnSizes={ this.state.columnSizes }
        rowSizes={ this.state.rowSizes }
        rotations={ this.state.rotations }
        currentRotation={ this.state.currentRotation }
        rotationActions={ this.state.rotationActions }
        rotationCard={ this.state.rotationCard }
        selectedCard={ this.props.selectedCard }
        selectedActions={ this.props.selectedActions }
        nextRotation={ this.nextRotation }
        onAction={ ({ card, actions, rotations, x, y }) => this.sendAction(card, actions, rotations, x, y)}
        />
    );
  }
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
