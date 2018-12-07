import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import obstruction from 'obstruction';

import Typography from '@material-ui/core/Typography';
import background from './images/minimap.png';
import emptyCard from './images/outline-empty.png';
import throneRoom from './images/outline-throne.png';

const styles = theme => ({
  root: {
    width: 546 / 1.5,
    height: 462 / 1.5,
    position: 'fixed',
    left: 20,
    bottom: 20,
    backgroundImage: 'url(' + background + ')',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 100%',
    backgroundPosition: 'center center'
  },
  minimapView: {
    position: 'relative',
    border: '1px solid white',
    height: 281,
    width: 281,
    margin: '13px 15px 15px 15px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: '0 0 auto'
  },
  card: {
    flex: '0 0 auto',
    width: 37,
    height: 57,
    margin: 2
  }
});

class Minimap extends Component {
  constructor () {
    super();

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
    this.renderCard = this.renderCard.bind(this);
  }

  componentWillReceiveProps (newProps) {
    console.log('Getting new castles', newProps);
    this.setState(newProps.castles[newProps.playerId || 'test']);
  }

  render () {
    return (
      <div className={ this.props.classes.root }>
        <div className={ this.props.classes.minimapView }>
          { this.state.rows.map(this.renderRow) }
        </div>
      </div>
    );
  }
  renderRow (row, i) {
    return (
      <div className={ this.props.classes.row } key={ this.state.minY + i }>
        { row.map(this.renderCard) }
      </div>
    );
  }
  renderCard (card, i) {
    let img = this.imageForCard(card);

    return (
      <div className={ this.props.classes.card } key={ this.state.minX + i }>
        { img }
      </div>
    );
  }

  imageForCard (card) {
    if (!card) {
      return [];
    }
    console.log(card, this.props.cards[card.card]);
    return (
      <img
        src={ emptyCard }
        />
    );
  }
}

const mapToProps = obstruction({
  playerId: 'global.playerId',
  castles: 'game.castles',
  cards: 'cards.knownCards'
});

export default withStyles(styles)(connect(mapToProps)(Minimap));
