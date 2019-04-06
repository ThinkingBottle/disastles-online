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
    bottom: 340,
    right: 10,
    zIndex: 10,
    pointerEvents: 'none',
    textAlign: 'right',
  },
  log: {
    transition: 'opacity ease-out 1000ms',
    opacity: 1,

    '&.fade': {
      opacity: 0,
    }
  }
});

class Logs extends Component {
  constructor(props) {
    super(props);

    this.renderMessage = this.renderMessage.bind(this);
  }

  renderMessage(log) {
    let message;
    switch (log.type) {
      case 'PlayerJoined':
        message = `${this.props.playerNames[log.data]} joined the game.`;
        break;
      default:
        message = `[${log.type}] ${log.data}`;
    }
    return message;
  }

  render() {
    return (
      <div className={ classNames( this.props.classes.root ) }>
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
