import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import obstruction from 'obstruction';
import { classNames } from 'react-extras';

import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';

import cardImages from './cards';
import cardOutline from './images/card-outline.png';

const styles = theme => ({
  root: {
    display: 'flex',
    borderRadius: 3,
    width: 128,
    height: 128,
    justifyContent: 'center',
    transition: 'transform,box-shadow 0.2s',
    '&.large': {
      width: 512,
      height: 512,
    }
  },
  skinny: {
    width: 84,
    '&.large': {
      width: 329
    }
  },
  image: {
    display: 'inline-block',
    height: '100%',
    width: 'auto',
    '&.card': {
      border: '1px solid black',
      borderRadius: 3,
      backgroundColor: 'white',
    },
    '&.empty': {
    },
    '&.selected img': {
      borderRadius: 3,
      boxShadow: '1px 1px 20px #ffffff55'
    },
  },
  clickable: {
    cursor: 'pointer',
    '& img': {
      boxShadow: '0px 0px 10px white',
      borderRadius: 10,
    },
    '&:hover': {
      transform: 'translateY(-3px)',
      '& img': {
        boxShadow: '1px 4px 10px #000000aa'
      }
    }
  },
  tooltip: {
    border: '3px solid #b8fdff',
    borderRadius: 32
  },
  removeTooltipStyles: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    opacity: 1
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
          [this.props.classes.clickable]: !!this.props.onClick,
          [this.props.classes.skinny]: !!this.props.skinny,
          large: this.props.large
        }) }
        key={ card }
        >
        <img
          className={ classNames(this.props.classes.image, 'empty') }
          src={ cardOutline }
          alt="Empty slot"
          onClick={ this.props.onClick }
          />
      </div>
    );
  }

  renderCard (card, cards, cardName) {
    let tooltipTitle = '';
    let removeTooltipStyles = true;

    if (!this.props.large) {
      tooltipTitle = (
        <img
          className={ this.props.classes.tooltip }
          src={ cardImages[cardName] }
          alt={ cardName }
          />
      );
    }
    if (this.props.tooltip) {
      tooltipTitle = this.props.tooltip;
    }
    if (typeof tooltipTitle === 'string') {
      removeTooltipStyles = false;
    }
    return (
      <div
        className={ classNames(this.props.className, this.props.classes.root, {
          [this.props.classes.clickable]: !!this.props.onClick,
          [this.props.classes.skinny]: !!this.props.skinny,
          large: this.props.large
        }) }
        key={ card }
        >
        <Tooltip
          classes={ removeTooltipStyles ? {
            tooltip: this.props.classes.removeTooltipStyles,
            popper: this.props.classes.removeTooltipStyles
          } : {} }
          enterDelay={1000}
          leaveDelay={200}
          interactive={true}
          title={ tooltipTitle }
            >
          <img
            className={ classNames(this.props.classes.image, 'card', {
              selected: this.props.selectedCard === card
            }) }
            src={ cardImages[cardName] }
            alt={ cardName }
            onClick={ this.props.onClick }
            />
        </Tooltip>
      </div>
    );
  }
}

const mapToProps = obstruction({
  cards: 'cards.knownCards',
  selectedCard: 'game.selectedCard',
});

export default withStyles(styles)(connect(mapToProps)(Card));
