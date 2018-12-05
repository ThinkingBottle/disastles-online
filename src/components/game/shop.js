import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import obstruction from 'obstruction';
import { partial } from 'ap';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { selectCard } from '../../actions/player';

const styles = theme => ({
  root: {
  },
  card: {
    display: 'inline-block'
  }
});

class Shop extends Component {
  constructor () {
    super();

    this.renderCard = this.renderCard.bind(this);
    this.selectCard = this.selectCard.bind(this);
  }

  selectCard (card) {
    this.props.dispatch(selectCard(card));
  }

  render () {
    let shop = this.props.shop || [];

    return (
      <div>
        { shop.map(this.renderCard) }
      </div>
    );
  }

  renderCard (card) {
    var isClickable = false;
    this.props.actions.forEach(function (action) {
      if (action.action == 'BuildRoom' && action.card === card) {
        isClickable = true;
      }
    })
    console.log(card);
    if (isClickable) {
      return (
        <Button
          onClick={ partial(this.selectCard, card) }
          key={ card }>
          { this.props.cards[card] }
        </Button>
      );
    }
    return (
      <Button disabled key={ card }>
        { this.props.cards[card] }
      </Button>
    );
  }
}

const mapToProps = obstruction({
  cards: 'cards.knownCards',
  actions: 'game.actions',
  shop: 'game.shop'
});

export default withStyles(styles)(connect(mapToProps)(Shop));
