import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import obstruction from 'obstruction';
import { classNames } from 'react-extras';
import { selectDisplayPlayer } from '../../actions/minimap';

import Typography from '@material-ui/core/Typography';

import background1 from './images/player-1.png';
import background2 from './images/player-2.png';
import background3 from './images/player-3.png';
import background4 from './images/player-4.png';
import background5 from './images/player-5.png';
import background6 from './images/player-6.png';
import background7 from './images/player-7.png';
import background8 from './images/player-8.png';
import background9 from './images/player-9.png';
import background10 from './images/player-10.png';
import bgCurrentTurn from './images/current-player.png';

const styles = theme => ({
  root: {
    position: 'absolute',
    top: 200,
    right: 0,
    display: 'flex',
    flexDirection: 'column'
  },

  currentTurn: {
  },

  player: {
    position: 'relative',
    left: 550,
    height: 91,
    width: 654,
    marginBottom: 20,
    display: 'flex',
    alignItems: 'center',
    transition: 'left 0.6s',
    backgroundPosition: 'right',
    paddingLeft: 130,
    paddingRight: 654 - 436,
    fontSize: 28,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    userSelect: 'none',

    '&:hover': {
      left: 208
    },

    '& .currentTurn': {
      position: 'absolute',
      background: 'url(' + bgCurrentTurn + ') no-repeat',
      height: 116,
      width: 654,
      left: -208,
      pointerEvents: 'none',
    },
    '&.player1': {
      background: 'url(' + background1 + ') no-repeat'
    },
    '&.player2': {
      background: 'url(' + background2 + ') no-repeat'
    },
    '&.player3': {
      background: 'url(' + background3 + ') no-repeat'
    },
    '&.player4': {
      background: 'url(' + background4 + ') no-repeat'
    },
    '&.player5': {
      background: 'url(' + background5 + ') no-repeat'
    },
    '&.player6': {
      background: 'url(' + background6 + ') no-repeat'
    },
    '&.player7': {
      background: 'url(' + background7 + ') no-repeat'
    },
    '&.player8': {
      background: 'url(' + background8 + ') no-repeat'
    },
    '&.player9': {
      background: 'url(' + background9 + ') no-repeat'
    },
    '&.player10': {
      background: 'url(' + background10 + ') no-repeat'
    },
  }
});

class PlayerPicker extends Component {
  constructor () {
    super();

    this.renderPlayer = this.renderPlayer.bind(this);
  }

  selectPlayer (player) {
    return () => {
      this.props.dispatch(selectDisplayPlayer(player));
    }
  }
  render () {
    return (
      <div className={ this.props.classes.root } >
        { Object.keys(this.props.players).map(this.renderPlayer) }
      </div>
    );
  }

  renderPlayer (player) {
    return (
      <div
        className={ classNames(this.props.classes.player, 'player', 'player' + (this.props.players[player] + 1)) }
        key={ player }
        onClick={ this.selectPlayer(player) }
        >
        <div className={ classNames({
            currentTurn: this.props.currentTurn === player
          }) }>
        </div>
        { this.props.playerNames[player] }
      </div>
    );
  }
}

const mapToProps = obstruction({
  players: 'global.playerColors',
  playerNames: 'global.playerNames',
  currentTurn: 'game.currentTurn',
});

export default withStyles(styles)(connect(mapToProps)(PlayerPicker));
