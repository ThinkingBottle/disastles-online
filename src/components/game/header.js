import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import obstruction from 'obstruction';
import { classNames } from 'react-extras';

import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Shop from './shop';
import ActionBar from './actions';

import backgroundLeft from './images/header-left.png';
import backgroundRight from './images/header-right.png';
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
  deckSize6
];

const styles = theme => ({
  root: {
    position: 'fixed',
    top: 0,
    width: '100%',
    height: 184,

    display: 'flex',
    flexDirection: 'rows'
  },
  left: {
    background: 'url(' + backgroundLeft + ') repeat-x',
    height: 38,
    minWidth: 50,
    flex: '1 0 auto'
  },
  right: {
    background: 'url(' + backgroundRight + ') repeat-x',
    height: 38,
    minWidth: 50,
    flex: '1 0 auto'
  },
  deck: {
    width: 384,
    height: 184,
    background: 'url(' + backgroundDeck + ') repeat-x',
    flex: '0 0 auto',

    display: 'flex',
    flexDirection: 'rows'
  },
  discardPile: {
    width: 84,
    height: 133,
    marginTop: 20,
    marginLeft: 75,
    background: 'url(' + cardSlot + ') repeat-x',
    flex: '0 0 auto'
  },
  drawPile: {
    width: 84,
    height: 133,
    marginTop: 20,
    marginLeft: 54,
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
    background: 'url(' + deckSizes[num - 1] + ') repeat-x',
    marginTop: 20 - (height - 131),
    height
  };
}

class GameHeader extends Component {
  constructor () {
    super();
  }
  render () {
    let deckSize = Math.ceil(6 * this.props.drawPileSize / 100);
    let discardSize = Math.ceil(6 * this.props.discardPileSize / 100);

    return (
      <div className={ this.props.classes.root }>
        <div className={ this.props.classes.left }>
        </div>
        <div className={ this.props.classes.deck }>
          <Tooltip title={ 'Discard pile (' + this.props.discardPileSize + ')' }>
            <div className={ classNames(
                this.props.classes.discardPile,
                this.props.classes['deckSize' + discardSize],
              )}>
            </div>
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
  discardPileSize: 'game.discardPileSize'
});

export default withStyles(styles)(connect(mapToProps)(GameHeader));

