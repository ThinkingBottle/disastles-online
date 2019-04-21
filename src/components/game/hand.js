import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { If } from 'react-extras';
import { partial } from 'ap';
import obstruction from 'obstruction';

import { selectCard, selectActions } from '../../actions/player';
import API from '../../api';

import Button from './button';

import Card from './card';
import InfoBox from './info';

const styles = theme => ({
  root: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: 300,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    pointerEvents: 'none',
  },
  hand: {
    pointerEvents: 'initial',
    display: 'flex',
    flexDirection: 'row',
    '& > div': {
      marginRight: 20
    }
  },
  button: {
  }
});

class PlayerHand extends Component {
  constructor (props) {
    super();

    this.state = {
      hand: props.playerCards[props.playerId] ? props.playerCards[props.playerId].revealed : []
    };

    this.renderCard = this.renderCard.bind(this);
    this.sendAction = this.sendAction.bind(this);
    this.sendSkip = this.sendSkip.bind(this);
  }
  componentWillReceiveProps (newProps) {
    this.setState({
      hand: newProps.playerCards[newProps.playerId] ? newProps.playerCards[newProps.playerId].revealed : []
    });
  }

  sendSkip () {
    API.send({
      action: 'SkipText'
    });
  }

  sendAction (action, card) {
    if (card === this.props.selectedCard && action.length === 1 && action[0].x === undefined) {
      action = action[0];
      API.send(action);
      this.props.dispatch(selectCard(null));
      return;
    }
    this.props.dispatch(selectCard(card));
    this.props.dispatch(selectActions([]));
  }
  render () {
    if (!this.state.hand.length) {
      return [];
    }

    // eslint-disable-next-line array-callback-return
    var hasSkip = this.props.actions.reduce((memo, action) => {
      if (memo) {
        return memo;
      }
      if (action.action === 'SkipText') {
        return true;
      }
    }, false);

    return (
      <InfoBox>
        <div className={ this.props.classes.hand } >
          { this.state.hand.map(this.renderCard) }
          <If condition={ hasSkip }
            render={ () => this.renderSkip() } />
        </div>
      </InfoBox>
    );
  }

  renderSkip () {
    return (
      <Button
        variant='outlined'
        onClick={ this.sendSkip }>
        Finished / Skip
      </Button>
    );
  }

  renderCard (card, i) {
    // eslint-disable-next-line array-callback-return
    let isClickable = this.props.actions.filter(function (action) {
      if (action.card === card) {
        return true;
      }
    });
    return (
      <Card
        card={ card }
        onClick={ isClickable.length ? partial(this.sendAction, isClickable, card) : null }
        confirm={ this.props.selectedCard === card }
        key={ card }
        skinny />
    );
  }
}

const mapToProps = obstruction({
  selectedCard: 'game.selectedCard',
  playerCards: 'game.playerCards',
  playerId: 'global.playerId',
  actions: 'game.actions',
});

export default withStyles(styles)(connect(mapToProps)(PlayerHand));
