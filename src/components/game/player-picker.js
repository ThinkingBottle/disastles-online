import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import obstruction from 'obstruction';
import { classNames } from 'react-extras';
import { timeout } from 'thyming';

import { selectDisplayPlayer } from '../../actions/minimap';
import Sound from '../../sound';

import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

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
import bgCheckbox from './images/checkbox.png';
import bgCheckboxActive from './images/checkbox-active.png';
import bgCheckboxChecked from './images/checkbox-checked.png';

const styles = theme => ({
  root: {
    position: 'absolute',
    top: 150,
    right: 0,
    display: 'flex',
    flexDirection: 'column',
    pointerEvents: 'none',
    alignItems: 'flex-end',
  },

  currentTurn: {
  },
  checkbox: {
    background: 'url(' + bgCheckbox + ') no-repeat',
    backgroundSize: '100% 100%',
    width: 41,
    height: 41,
    minWidth: 41,
    minHeight: 41,
    '&:hover': {
      background: 'url(' + bgCheckboxActive + ') no-repeat',
      backgroundSize: '100% 100%',
    }
  },

  autoFollow: {
    width: 213,
    flex: '0 0',
    pointerEvents: 'all',

    '& label': {
      marginRight: 0,
    },
    '& label span': {
      fontSize: '0.8em',
      color: '#b8fdff',
      textShadow: '1px 1px 1px #222222aa',
    }
  },

  player: {
    position: 'relative',
    left: 550,
    height: 91,
    width: 654,
    marginTop: 8,
    marginBottom: 12,
    display: 'flex',
    alignItems: 'center',
    transition: 'left 0.6s',
    backgroundPosition: 'right',
    paddingLeft: 130,
    paddingRight: 654 - 436,
    fontSize: 28,
    textAlign: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    userSelect: 'none',
    pointerEvents: 'all',

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
  constructor (props) {
    super();

    this.state = {
      followTurn: !sessionStorage.dontFollowTurn,
      displayPlayer: props.displayPlayer
    };

    this.renderPlayer = this.renderPlayer.bind(this);
    this.toggleFollowTurn = this.toggleFollowTurn.bind(this);
  }

  componentWillReceiveProps (props) {
    console.log('player turn thing!');
    if (props.playerId === props.currentTurn && this.props.playerId !== this.props.currentTurn) {
      Sound.playerTurn.playSound('turn');
    }
    if (this.state.followTurn && props.currentTurn && props.displayPlayer !== props.currentTurn) {
      if (this.state.displayPlayer !== props.currentTurn) {
        this.setState({
          displayPlayer: props.currentTurn
        });
        if (this.cancelFollow) {
          this.cancelFollow();
        }
        this.cancelFollow = timeout(() => this.props.dispatch(selectDisplayPlayer(props.currentTurn)), 1000);
      }
    }
  }

  componentWillUnmount () {
    if (this.cancelFollow) {
      this.cancelFollow();
    }
  }

  toggleFollowTurn () {
    if (!this.state.followTurn) {
      this.props.dispatch(selectDisplayPlayer(this.props.currentTurn));
    } else if (this.cancelFollow) {
      this.cancelFollow();
    }
    this.setState({
      followTurn: !this.state.followTurn,
      displayPlayer: this.props.currentTurn,
    });
  }

  selectPlayer (player) {
    return () => {
      if (this.state.followTurn) {
        this.setState({
          followTurn: false
        });
        if (this.cancelFollow) {
          this.cancelFollow();
        }
      }
      this.props.dispatch(selectDisplayPlayer(player));
    }
  }
  render () {
    return (
      <div className={ this.props.classes.root } >
        <div className={ this.props.classes.autoFollow }>
          <FormControlLabel
            label="Follow Current Turn"
            control={
              <Checkbox
                checked={ this.state.followTurn }
                onChange={ this.toggleFollowTurn }
                value="followTurn" /> } />
        </div>
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
  playerId: 'global.playerId',
  players: 'global.playerColors',
  playerNames: 'global.playerNames',
  currentTurn: 'game.currentTurn',
  displayPlayer: 'minimap.displayPlayer',
});

export default withStyles(styles)(connect(mapToProps)(PlayerPicker));
