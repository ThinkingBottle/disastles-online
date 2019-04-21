import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import obstruction from 'obstruction';
import { partial } from 'ap';
import { classNames } from 'react-extras';

import Card from '../card';

export const CARD_ZOOM = 1.3;

const styles = theme => ({
  node: {
    position: 'relative',
    width: 85 * CARD_ZOOM,
    height: 128 * CARD_ZOOM,
    margin: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
    userSelect: 'none',

    '& > *': {
      pointerEvents: 'initial',
    },

    '&.wide': {
      width: 128 * CARD_ZOOM
    },
    '&.short': {
      height: 85 * CARD_ZOOM
    },

    '&.rotation1 > *': {
      transform: 'rotate(90deg) translate3d(0, 0, 0)',
      '& .unrotate': {
        transform: 'rotate(-90deg) translate3d(0, 0, 0)',
      }
    },
    '&.rotation2 > *': {
      transform: 'rotate(180deg) translate3d(0, 0, 0)',
      '& .unrotate': {
        transform: 'rotate(-180deg) translate3d(0, 0, 0)',
      }
    },
    '&.rotation3 > *': {
      transform: 'rotate(270deg) translate3d(0, 0, 0)',
      '& .unrotate': {
        transform: 'rotate(-270deg) translate3d(0, 0, 0)',
      }
    }
  }
});

class GridTile extends Component {
  constructor () {
    super();

    this.sendAction = this.sendAction.bind(this);
  }

  static cardsForAction (action) {
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

  sendAction (card, actions, rotations, x, y) {
    if (this.props.onAction) {
      this.props.onAction({
        card, actions, rotations, x, y
      });
    }
  }

  render () {
    return this.renderCell(this.props.y, this.props.minX, this.props.node, this.props.x);
  }

  renderCell (y, minX, node, i) {
    let x = i + minX;
    if (this.props.rotationCoords && this.props.rotationCoords[0] === x && this.props.rotationCoords[1] === y) {
      return this.renderRotationCard();
    }
    let key = x + ':' + y;
    let actions = [];
    let actionsTypes = [];
    this.props.actions.forEach((val) => {
      let actionCards = GridTile.cardsForAction(val);
      if (node && node.card === this.props.selectedCard) {
        if (actionCards.length > 1) {
          // when there's 2 action cards it implies it's some sort of swap or something
          // if this card is the selected card, then make them choose the other card
          return false;
        }
        // if this card is selected and this action takes place somewhere else, don't show it
        // instead it'll be shown in the other location
        if (val.x !== undefined && (val.x !== x || val.y !== y)) {
          return false;
        }
      }
      // if this action isn't in this castle then don't show it (for x,y actions)
      if (val.castleOwner && val.castleOwner !== this.props.playerId) {
        return;
      }
      // if there are selected actions, or if this is ISN'T build, mark, or rotate
      // and also the current action isn't selected
      // then don't show this action
      if ((this.props.selectedActions.length
          || ['BuildRoom', 'MarkRoom', 'RotateRoom'].indexOf(val.action) === -1)
        && this.props.selectedActions.indexOf(val.action) === -1) {
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
    let isActionable = isClickable && actions.filter((a) => GridTile.cardsForAction(a).indexOf(this.props.selectedCard) !== -1).length > 0;

    let rotations = [];
    actions.forEach(function (action) {
      if (action.rotation !== undefined && rotations.indexOf(action.rotation) === -1) {
        if (action.x === undefined || (action.x === x && action.y === y)) {
          rotations.push(action.rotation)
        }
      }
    });

    rotations = rotations.sort();

    if (!node && !isClickable) {
      return (
        <div
          className={ classNames(
            this.props.classes.node,
            node && ('rotation' + node.rotation),
            this.props.columnSizes[x],
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
          this.props.columnSizes[x],
          ) }
        data-rotations={ rotations }
        data-actions={ actions }
        data-action={ isActionable }
        data-clickable={ isClickable }
        key={ key } >
        <Card
          marked= { node && node.marked }
          tooltip={ isActionable ? splitWords(actions[0].action) : null }
          confirm={ isActionable }
          skinny={ this.props.columnSizes[x] !== 'wide' }
          height={ 128 * CARD_ZOOM }
          card={ node ? node.card : 'empty' }
          onClick={ isClickable ? partial(this.sendAction, node && node.card, actions, rotations, x, y) : null }
          actions={ actionsTypes }
          />
      </div>
    );
  }

  renderRotationCard () {
    let [x, y] = this.props.rotationCoords;
    let key = x + ':' + y;
    let rotation = this.props.rotations[this.props.currentRotation];
    let action = this.props.rotationActions.filter((a) => a.rotation === rotation)[0];

    return (
      <div
        className={ classNames(
          this.props.classes.node,
          'rotation' + rotation,
          this.props.columnSizes[x]
        ) }
        key={ key }
        >
        <Card
          tooltip={ splitWords(action.action) }
          skinny={ this.props.columnSizes[x] !== 'wide' }
          card={ this.props.rotationCard }
          onClick={ partial(this.sendAction, this.props.rotationCard, [action], [], x, y) }
          onRotation={ this.props.nextRotation }
          confirm
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
  playerId: 'minimap.displayPlayer',
});

export default withStyles(styles)(connect(mapToProps)(GridTile));
