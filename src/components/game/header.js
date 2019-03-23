import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import obstruction from 'obstruction';
import { classNames } from 'react-extras';

import Tooltip from '@material-ui/core/Tooltip';
import Shop from './shop';
import Card from './card';

import background from './images/header.png';
import backgroundDeck from './images/header-deck.png';
import cardSlot from './images/header-card-slot.png';
import deckSize1 from './images/deck-1.png';
import deckSize2 from './images/deck-2.png';
import deckSize3 from './images/deck-3.png';
import deckSize4 from './images/deck-4.png';
import deckSize5 from './images/deck-5.png';
import deckSize6 from './images/deck-6.png';

const deckSizes = [
  deckSize1,
  deckSize2,
  deckSize3,
  deckSize4,
  deckSize5,
  deckSize6,
];

const styles = theme => ({
  root: {
    position: 'fixed',
    top: 0,
    width: '100%',
    height: 182,

    display: 'flex',
    flexDirection: 'rows'
  },
  left: {
    background: 'url(' + background + ') repeat-x',
    height: 37,
    minWidth: 50,
    flex: '1 0 auto'
  },
  right: {
    background: 'url(' + background + ') repeat-x',
    height: 37,
    minWidth: 50,
    flex: '1 0 auto'
  },
  deck: {
    width: 320,
    height: 182,
    background: 'url(' + backgroundDeck + ') repeat-x',
    flex: '0 0 auto',

    display: 'flex',
    flexDirection: 'rows'
  },
  discardPile: {
    width: 84,
    height: 133,
    marginTop: 20,
    marginLeft: 60 + 15,
    background: 'url(' + cardSlot + ') repeat-x',
    flex: '0 0 auto'
  },
  drawPile: {
    width: 84,
    height: 133,
    marginTop: 20,
    marginLeft: 13,
    background: 'url(' + cardSlot + ') repeat-x',
    flex: '0 0 auto'
  },
  deckSize1: deckSize(1, 131),
  deckSize2: deckSize(2, 134),
  deckSize3: deckSize(3, 137),
  deckSize4: deckSize(4, 141),
  deckSize5: deckSize(5, 145),
  deckSize6: deckSize(6, 149),
});

function deckSize (num, height) {
  return {
    background: 'url(' + deckSizes[num - 1] + ') no-repeat',
    marginTop: 20 - (height - 131),
    height
  };
}

class GameHeader extends Component {
  render () {
    const { drawPileSize, discardPileSize } = this.props;
    const deckSize = Math.ceil(6 * drawPileSize / 120);
    const discardSize = Math.ceil(6 * discardPileSize / 120);
    const discardPile = this.props.discardPile.map(o => o.card || o);
    const topmostDiscardedCard = discardPile.length ? discardPile[discardPile.length - 1] : null;

    return (
      <div className={ this.props.classes.root }>
        <div className={ this.props.classes.left }>
        </div>
        <div className={ this.props.classes.deck }>
          <Tooltip title={ 'Discard pile (' + this.props.discardPileSize + ')' }>
            {topmostDiscardedCard ? (
              <div className={ classNames(
                  this.props.classes.discardPile,
                  this.props.classes['deckSize' + discardSize],
                )}>
                <Card card={ topmostDiscardedCard } skinny />
              </div>
            ) : (
              <div className={ classNames(
                  this.props.classes.discardPile,
                  this.props.classes['deckSize' + discardSize],
                )}>
              </div>
            )}
          </Tooltip>
          <Tooltip title={ 'Draw pile (' + this.props.drawPileSize + ')' }>
            <div className={ classNames(
                this.props.classes.drawPile,
                this.props.classes['deckSize' + deckSize],
              )}>
            </div>
          </Tooltip>
        </div>
        <Shop />
        <div className={ this.props.classes.right }>
        </div>
      </div>
    );
  }
}

const mapToProps = obstruction({
  drawPileSize: 'game.drawPileSize',
  discardPileSize: 'game.discardPileSize',
  discardPile: 'game.discardPile',
});

export default withStyles(styles)(connect(mapToProps)(GameHeader));

