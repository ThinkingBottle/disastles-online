import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import obstruction from 'obstruction';
import { classNames } from 'react-extras';

import store from '../../store';
import { addLog } from '../../actions/logs';


export function addNewLog(logType, data) {
  // just a helper function
  store.dispatch(addLog(logType, data));
}


const styles = theme => ({
  root: {
    width: 360,
    fontSize: '9pt',
    fontWeight: 500,
    color: 'white',
    position: 'absolute',
    zIndex: 10,
    pointerEvents: 'none',

    '&.inlobby': {
      bottom: 340,
      right: 10,
      textAlign: 'right',
    },

    '&.ingame': {
      bottom: 335,
      left: 20,
    },
  },
  log: {
    transition: 'opacity ease-out 1000ms',
    opacity: 1,

    '&.fade': {
      opacity: 0,
    },

    margin: '0 0 5px',
    '&:last-child': {
      margin: '0 0 9px',
    },
  }
});

class Logs extends Component {
  constructor(props) {
    super(props);

    this.renderMessage = this.renderMessage.bind(this);
  }

  renderMessage(log) {
    let message;
    const { you } = this.props;

    switch (log.logType) {
      case 'PlayerJoined':
        if (you === log.data) {
          message = 'You joined the game.';
        } else {
          message = `${this.props.playerNames[log.data]} joined the game.`;
        }
        break;

      case 'PlayerDisconnectedFromGame':
        if (you === log.data) {
          message = 'You have disconnected from the game.';
        } else {
          message = `${this.props.playerNames[log.data]} has disconnected from the game.`;
        }
        break;

      case 'PlayerReconnectedToGame':
        if (you === log.data) {
          message = 'You have reconnected to the game.';
        } else {
          message = `${this.props.playerNames[log.data]} has reconnected to the game.`;
        }
        break;

      case 'TurnTimeoutNotification':
        message = `Your turn ends in ${log.data} seconds.`;
        break;

      case 'TurnTimeout':
        if (you === log.data) {
          message = 'You ran out of time!';
        } else {
          message = `${this.props.playerNames[log.data]} ran out of time!`;
        }
        break;

      case 'TurnSkipped':
        if (you === log.data) {
          message = 'You skipped a turn.';
        } else {
          message = `${this.props.playerNames[log.data]} skipped a turn.`;
        }
        break;

      case 'DisasterAddedToDeck':
        message = 'A Disaster has been added to the deck!';
        break;

      case 'PlayerConceded':
        if (you === log.data) {
          message = 'You have conceded the game.';
        } else {
          message = `${this.props.playerNames[log.data]} conceded.`;
        }
        break;

      default:
        message = `[${log.type}] ${log.data}`;
    }
    return message;
  }

  render() {
    return (
      <div className={ classNames( this.props.classes.root, { ingame: this.props.ingame }, { inlobby: this.props.inlobby } ) }>
        {this.props.logs.map(log => (
          <p key={log.counter} className={ classNames( this.props.classes.log, { fade: log.fade } ) }>
            {this.renderMessage(log)}
          </p>
        ))}
      </div>
    );
  }
}

const mapToProps = obstruction({
  logs: 'logs.logs',
  playerNames: 'global.playerNames',
  you: 'global.playerId',
});

export default withStyles(styles)(connect(mapToProps)(Logs));
