import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import obstruction from 'obstruction';
import { classNames } from 'react-extras';

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
    switch (log.logType) {
      case 'PlayerJoined':
        message = `${this.props.playerNames[log.data]} joined the game.`;
        break;
      case 'PlayerDisconnectedFromGame':
        message = `${this.props.playerNames[log.data]} has disconnected from the game.`;
        break;
      case 'PlayerReconnectedToGame':
        message = `${this.props.playerNames[log.data]} has reconnected to the game.`;
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
          <p key={log.timestamp} className={ classNames( this.props.classes.log, { fade: log.fade } ) }>
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
});

export default withStyles(styles)(connect(mapToProps)(Logs));
