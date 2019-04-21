import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import obstruction from 'obstruction';
import { partial } from 'ap';

import { If } from 'react-extras';
import Button from './button';
import Card from './card';

import { selectCard, selectActions } from '../../actions/player';
import API from '../../api';
import Sound from '../../sound';

import backgroundLeft from './images/header-shop-left.png';
import backgroundRight from './images/header-shop-right.png';
import backgroundCenter from './images/header-shop-center.png';
import cardSlot from './images/header-card-slot.png';

const styles = theme => ({
  root: {
    position: 'relative',
    flex: '0 0 auto',
    height: 182,
    display: 'flex',
    flexDirection: 'rows',
  },
  left: {
    background: 'url(' + backgroundLeft + ') no-repeat',
    width: 68,
    height: 182,
    flex: '0 0 auto'
  },
  right: {
    background: 'url(' + backgroundRight + ') no-repeat',
    width: 70,
    height: 182,
    flex: '0 0 auto'
  },
  wrapper: {
    background: 'url(' + backgroundCenter + ') repeat-x',
    height: 182,
    width: (39 + 15 + (84 + 15) * 5 + 147 + 15 + 45 - 68 - 70),
    flex: '1 0 auto',
    paddingTop: 20,
    display: 'flex'
  },
  card: {
    background: 'url(' + cardSlot + ') no-repeat',
    position: 'relative',
    left: -68 + 39 + 15,
    marginRight: 15,
  },
  actions: {
    width: 147,
    height: '100%',
    position: 'absolute',
    right: 45 + 15,
    paddingTop: 20,
    '& > *': {
      marginBottom: 10
    }
  }
});

class Shop extends Component {
  constructor () {
    super();

    this.state = {
      canSkipTurn: false,
      canMove: false,
      canSwap: false,
      canActionCard: false
    };

    this.renderCard = this.renderCard.bind(this);
    this.selectCard = this.selectCard.bind(this);
    this.sendAction = this.sendAction.bind(this);
    this.moveCards = this.moveCards.bind(this);
    this.swapCards = this.swapCards.bind(this);
    this.actionCards = this.actionCards.bind(this);
  }

  componentWillReceiveProps (newProps) {
    var canSkipTurn = false;
    var canMove = false;
    var canSwap = false;
    var canActionCard = false;
    var allMoves = newProps.actions.length > 0;
    var allSwaps = newProps.actions.length > 0;
    newProps.actions.forEach(function (a) {
      if (a.action !== 'SwapRooms' && a.action !== 'SkipText') {
        allSwaps = false;
      }
      if (a.action !== 'MoveRoom' && a.action !== 'SkipText') {
        allMoves = false;
      }
      switch (a.action) {
        case 'SkipTurn':
          canSkipTurn = true;
          break;
        case 'MoveRoom':
          canMove = true;
          break;
        case 'SwapRooms':
          canSwap = true;
          break;
        case 'PlayActionCard':
          canActionCard = true;
          break;
        default:
          break;
      }
    });

    if (canSwap && allSwaps && newProps.selectedActions.indexOf('SwapRooms') === -1) {
      this.props.dispatch(selectActions(['SwapRooms']));
    }
    if (canMove && allMoves && newProps.selectedActions.indexOf('MoveRoom') === -1) {
      this.props.dispatch(selectActions(['MoveRoom']));
    }
    if (!canSwap && newProps.selectActions && newProps.selectActions.indexOf('SwapRooms') !== -1) {
      this.props.dispatch(selectActions(newProps.selectActions.filter((action) => action !== 'SwapRooms')));
    }
    if (!canMove && newProps.selectActions && newProps.selectActions.indexOf('MoveRoom') !== -1) {
      this.props.dispatch(selectActions(newProps.selectActions.filter((action) => action !== 'MoveRoom')));
    }

    this.setState({
      canSkipTurn,
      canMove,
      canSwap,
      canActionCard
    });
  }

  selectCard (card) {
    this.props.dispatch(selectCard(card));
    this.props.dispatch(selectActions([]));
  }

  moveCards () {
    this.props.dispatch(selectCard(null));
    this.props.dispatch(selectActions(['MoveRoom']));
  }

  swapCards () {
    this.props.dispatch(selectCard(null));
    this.props.dispatch(selectActions(['SwapRooms']));
  }

  actionCards () {
    this.props.dispatch(selectCard(null));
    this.props.dispatch(selectActions(['PlayActionCard']));
  }

  sendAction (action, card) {
    if (action === true) {
      return this.selectCard(card);
    }
    API.send(action);
    this.props.dispatch(selectActions([]));
  }

  skipTurn () {
    Sound.sfx.playSound('skip');
    API.send({
      action: 'SkipTurn'
    });
  }

  render () {
    let shop = this.props.shop || [];

    return (
      <div className={ this.props.classes.root }>
        <div className={ this.props.classes.left }>
        </div>
        <div className={ this.props.classes.wrapper }>
          { shop.map(this.renderCard) }
        </div>
        <div className={ this.props.classes.right }>
        </div>
        <div className={ this.props.classes.actions }>
          { this.renderActions() }
        </div>
      </div>
    );
  }

  renderActions () {
    return (
      <React.Fragment>
        <If
          condition={ true }
          render={ ()=>
            <Button
              disabled={ !this.state.canSkipTurn }
              blue
              narrow
              onClick={ this.skipTurn } >
              Skip Turn
            </Button> } />

        <If
          condition={ true }
          render={ ()=>
            <Button
              disabled={ !this.state.canMove }
              blue
              narrow
              dark={ this.props.selectedActions.indexOf('MoveRoom') > -1 }
              onClick={ this.moveCards } >
              Move Cards
            </Button> } />

        <If
          condition={ true }
          render={ ()=>
            <Button
              disabled={ !this.state.canSwap }
              blue
              narrow
              dark={ this.props.selectedActions.indexOf('SwapRooms') > -1 }
              onClick={ this.swapCards } >
              Swap Cards
            </Button> } />

        <If
          condition={ true }
          render={ ()=>
            <Button
              disabled={ !this.state.canActionCard }
              blue
              narrow
              onClick={ this.actionCards } >
              Card Action
            </Button> } />
      </React.Fragment>
    );
  }

  renderCard (card, i) {
    var isClickable = false;
    var key = card || i;
    this.props.actions.forEach(function (action) {
      if (action.card !== card) {
        return;
      }
      if (action.action === 'BuildRoom' || action.action === 'BuildAndSwapRoom') {
        isClickable = true;
      } else {
        isClickable = action;
      }
    });
    if (isClickable && card) {
      return (
        <Card
          className= { this.props.classes.card }
          onClick={ partial(this.sendAction, isClickable, card) }
          card={ card }
          key={ key }
          skinny
          />
      );
    }
    return (
      <Card
        className= { this.props.classes.card }
        card={ card || 'empty' }
        key={ key }
        skinny
        />
    );
  }
}

const mapToProps = obstruction({
  cards: 'cards.knownCards',
  actions: 'game.actions',
  shop: 'game.shop',
  selectedActions: 'game.selectedActions',
});

export default withStyles(styles)(connect(mapToProps)(Shop));
