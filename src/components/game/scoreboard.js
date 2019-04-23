import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import obstruction from 'obstruction';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Modal from './modal';

import API from '../../api';
import { leaveGame } from '../../actions/game';

import bgButton from '../lobby/images/button.png';
import bgButtonHover from '../lobby/images/button-hover.png';
import bgButtonActive from '../lobby/images/button-active.png';

const styles = theme => ({
  root: {
    minWidth: 600
  },
  button: {
    background: 'url(' + bgButtonActive + ') no-repeat',
    width: 192,
    height: 64,
    border: 0,
    borderRadius: 32,
    color: 'white',
    fontSize: '1.2em',
    position: 'absolute',
    zIndex: '1350',
    left: '50%',
    marginLeft: '-96px',
    bottom: '53px',

    '&:hover': {
      background: 'url(' + bgButtonHover + ') no-repeat',
    },
    '&:active': {
      background: 'url(' + bgButton + ') no-repeat',
    },
  },
});

class Scoreboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dismissed: false
    };

    this.renderRow = this.renderRow.bind(this);
    this.leaveGame = this.leaveGame.bind(this);
  }

  leaveGame() {
    this.props.history.push('/');
    this.props.dispatch(leaveGame());
    API.ws.reconnect();
  }

  render() {
    if (!this.props.gameEnded) {
      return [];
    }
    const players = this.props.gameStats.stats.sort(function (player1, player2) {
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

    return (
      <div id="scoreboard">
        <Modal
          container={ () => document.getElementById('scoreboard') }
          onClose={ () => this.setState({ dismissed: true }) }
          open={ !this.state.dismissed }
          >
          <div className={ this.props.classes.root }>
            { this.renderHeader() }
            { players.map(this.renderRow) }
          </div>
        </Modal>
        {this.props.gameEnded && (
          <Button
            onClick={ this.leaveGame }
            classes={{
              root: this.props.classes.button
            }} >
            Main Menu
          </Button>
        )}
      </div>
    );
  }

  renderHeader() {
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

  renderRow(row) {
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

export default withStyles(styles)(connect(mapToProps)(withRouter(Scoreboard)));
