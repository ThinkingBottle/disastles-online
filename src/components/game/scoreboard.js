import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import obstruction from 'obstruction';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Modal from './modal';

const styles = theme => ({
  root: {
    minWidth: 600
  }
});

class MyComponent extends Component {
  constructor () {
    super();

    this.renderRow = this.renderRow.bind(this);
  }
  render () {
    if (!this.props.gameEnded) {
      return [];
    }
    var players = this.props.gameStats.stats.sort(function (player1, player2) {
      // if player 1 is better than player 2, return -1
      // if player 2 is better than player 1, return 1

      if (!player2.alive) {
        return -1;
      } else if (!player1.alive) {
        return 1;
      }
      if (player1.treasure > player2.treasure) {
        return -1;
      } else if (player1.treasure < player2.treasure) {
        return 1;
      }

      if (player1.connections > player2.connections) {
        return -1;
      } else if (player1.connections < player2.connections) {
        return 1;
      }

      if (player1.rooms > player2.rooms) {
        return -1;
      } else if (player1.rooms < player2.rooms) {
        return 1;
      }
      return 0;
    });
    console.log('sorted', players);
    return (
      <Modal noclose>
        <div className={ this.props.classes.root }>
          { this.renderHeader() }
          { players.map(this.renderRow) }
        </div>
      </Modal>
    );
  }
  renderHeader () {
    return (
      <Grid
        container
        justify="center">
        <Grid item xs={4}>
          <b>Name</b>
        </Grid>
        <Grid item xs={2}>
          <b>Alive</b>
        </Grid>
        <Grid item xs={2}>
          <b>Treasure</b>
        </Grid>
        <Grid item xs={2}>
          <b>Rooms</b>
        </Grid>
        <Grid item xs={2}>
          <b>Connections</b>
        </Grid>
      </Grid>
    );
  }
  renderRow (row) {
    return (
      <Grid
        container
        key={ row.player }
        justify="center">
        <Grid item xs={4}>
          { this.props.playerNames[row.player] || row.player }
        </Grid>
        <Grid item xs={2}>
          { row.alive ? 'Yes' : 'Dead' }
        </Grid>
        <Grid item xs={2}>
          { row.treasure }
        </Grid>
        <Grid item xs={2}>
          { row.rooms }
        </Grid>
        <Grid item xs={2}>
          { row.connections }
        </Grid>
      </Grid>
    );
  }
}

const mapToProps = obstruction({
  gameEnded: 'game.gameEnded',
  gameStats: 'game.gameStats',
  playerNames: 'global.playerNames',
});

export default withStyles(styles)(connect(mapToProps)(MyComponent));
