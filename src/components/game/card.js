import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import obstruction from 'obstruction';
import { classNames } from 'react-extras';

import Typography from '@material-ui/core/Typography';

import cardImages from './cards';
import cardOutline from './images/card-outline.png';

const styles = theme => ({
  root: {
    display: 'flex',
    width: 128,
    height: 128,
    justifyContent: 'center',
  },
  skinny: {
    width: 84
  },
  image: {
    display: 'inline-block',
    width: 85,
    height: 'auto'
  },
  clickable: {
    cursor: 'pointer'
  }
});

class Card extends Component {
  constructor () {
    super();
  }

  render () {
    let { card, cards } = this.props;
    if (card === 'empty') {
      return this.renderEmptyCard(card, cards);
    }
    if (!cards[card]) {
      console.error('Trying to display unrevealed card', card);
    }
    let cardName = cards[card];
    if (!cardImages[cardName]) {
      console.error('Trying to display a card with no image', card, cardName);
    }
    return this.renderCard(card, cards, cardName);
  }

  renderEmptyCard (card, cards, cardName) {
    return (
      <div
        className={ classNames(this.props.className, this.props.classes.root, {
          [this.props.classes.clickable]: !!this.props.onClick
        }) }
        key={ card }
        >
        <img
          className={ this.props.classes.image }
          src={ cardOutline }
          alt="Empty slot"
          onClick={ this.props.onClick }
          />
      </div>
    );
  }

  renderCard (card, cards, cardName) {
    return (
      <div
        className={ classNames(this.props.className, this.props.classes.root, {
          [this.props.classes.clickable]: !!this.props.onClick,
          [this.props.classes.skinny]: !!this.props.skinny
        }) }
        key={ card }
        >
        <img
          className={ this.props.classes.image }
          src={ cardImages[cardName] }
          alt={ cardName }
          onClick={ this.props.onClick }
          />
      </div>
    );
  }
}

const mapToProps = obstruction({
  cards: 'cards.knownCards'
});

export default withStyles(styles)(connect(mapToProps)(Card));
