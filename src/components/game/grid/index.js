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

const styles = theme => ({
  root: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  castle: {
    position: 'absolute',
    top: 0,
    minWidth: '100%',
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
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
    width: 85,
    height: 128,
    margin: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    '&.wide': {
      width: 128
    },
    '&.short': {
      height: 85
    },

    '&.rotation1 > *': {
      transform: 'rotate(90deg)'
    },
    '&.rotation2 > *': {
      transform: 'rotate(180deg)'
    },
    '&.rotation3 > *': {
      transform: 'rotate(270deg)'
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
    };

    this.renderRow = this.renderRow.bind(this);
    this.renderCell = this.renderCell.bind(this);
    this.sendAction = this.sendAction.bind(this);
    this.unselectCard = this.unselectCard.bind(this);
  }

  componentWillReceiveProps (newProps) {
    this.setState({...newProps.castles[newProps.playerId || 'test'],
      actions: newProps.actions.filter((action) => {
        if (newProps.selectedCard || action.action === 'BuildRoom') {
          return (this.cardsForAction(action).indexOf(newProps.selectedCard) !== -1);
        }
        return true;
      })
    });
  }

  async sendAction (action, card) {
    let actionCards = this.cardsForAction(action);

    if (actionCards.indexOf(this.props.selectedCard) === -1) {
      return this.props.dispatch(selectCard(card));
    }

    action = {...action,
      effects: []
    };
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
      return Object.keys(action.rooms);
    }
    return [];
  }

  render () {
    console.log(this.state.actions);

    return (
      <div
        ref={ this.rootEl }
        onClick={ this.unselectCard }
        className={ this.props.classes.root }
        >
        <div
          className={ this.props.classes.castle }
          style={{
            left: (0 - this.props.x),
            top: 90 + (0 - this.props.y),
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
    let key = x + ':' + y;
    let isActionable = this.state.actions.reduce((memo, val) => {
      let actionCards = this.cardsForAction(val);
      if (node && node.card === this.props.selectedCard) {
        if (actionCards.length > 1) {
          return false;
        }
        if (val.x !== undefined && (val.x !== x || val.y !== y)) {
          return false;
        }
      }
      if (memo && memo.action === 'BuildRoom') {
        return memo;
      }
      if (node && actionCards.indexOf(node.card) !== -1) {
        return val;
      }
      if (actionCards.indexOf(this.props.selectedCard) !== -1 && val.x === x && val.y === y) {
        return val;
      }
      return memo;
    }, false);

    if (!node && !isActionable) {
      return (
        <div
          className={ classNames(
            this.props.classes.node,
            node && ('rotation' + node.rotation),
            this.state.columnSizes[x],
            // this.state.rowSizes[y],
            ) }
          key={ key }
          >
        </div>
      );
    }

    return (
      <div
        data-action={ isActionable }
        className={ classNames(
          this.props.classes.node,
          node && ('rotation' + node.rotation),
          this.state.columnSizes[x],
          // this.state.rowSizes[y],
          ) }
        key={ key }
        >
        <Card
          tooltip={ isActionable ? splitWords(isActionable.action) : null }
          skinny={ this.state.columnSizes[x] !== 'wide' }
          card={ node ? node.card : 'empty' }
          onClick={ isActionable ? partial(this.sendAction, isActionable, node && node.card) : null }
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
  actions: 'game.actions',
  playerId: 'global.playerId',
  castles: 'game.castles',
  cards: 'cards.knownCards',
  x: 'minimap.x',
  y: 'minimap.y',
});

export default withStyles(styles)(connect(mapToProps)(windowSize(GridController)));
