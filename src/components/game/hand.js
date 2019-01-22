import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { partial } from 'ap';
import obstruction from 'obstruction';

import { selectCard, selectActions } from '../../actions/player';
import API from '../../api';

import Typography from '@material-ui/core/Typography';

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
  }
  componentWillReceiveProps (newProps) {
    this.setState({
      hand: newProps.playerCards[newProps.playerId] ? newProps.playerCards[newProps.playerId].revealed : []
    });
  }

  sendAction (action, card) {
    console.log('Sending action', action, card);
    if (card === this.props.selectedCard && action.length === 1 && action[0].x === undefined) {
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

    return (
      <InfoBox>
        <div className={ this.props.classes.hand } >
          { this.state.hand.map(this.renderCard) }
        </div>
      </InfoBox>
    );

    // return (
    //   <div className={ this.props.classes.root } >
    //     <div className={ this.props.classes.hand } >
    //       { this.state.hand.map(this.renderCard) }
    //     </div>
    //   </div>
    // );
  }

  renderCard (card, i) {
    let isClickable = this.props.actions.filter(function (action) {
      if (action.card === card) {
        return true;
      }
    });
    return (
      <Card
        card={ card }
        onClick={ isClickable.length ? partial(this.sendAction, isClickable, card) : null }
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
