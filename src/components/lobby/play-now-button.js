import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { classNames } from 'react-extras';
import obstruction from 'obstruction';
import { interval } from 'thyming';

import Button from '../game/button';

import API from '../../api';

const styles = theme => ({
  button: {
    width: 192,
    height: 32,
    marginBottom: 10,
  },
});

class PlayNowButton extends Component {
  constructor (props) {
    super(props);

    this.state = {
      currentTimeout: this.currentTimeout(props),
      hover: false,
    };

    this.updateTime = this.updateTime.bind(this);
  }

  updateTime () {
    let value = this.currentTimeout(this.props);

    if (value !== this.state.currentTimeout) {
      this.setState({
        currentTimeout: value
      });
    }
  }

  currentTimeout (props) {
    if (props.turnTimeout === null) {
      return null;
    }
    return (props.busStopNextTimestamp - Date.now()) / 1000;
  }

  componentWillMount () {
    this.stopTimer = interval(this.updateTime, 100);
  }

  componentWillUnmount () {
    if (this.stopTimer) {
      this.stopTimer();
      this.stopTimer = null;
      console.log('STOP TIMER STOPPED');
    }
  }

  getDisplay () {
    if (!this.props.isSearching) {
      return 'Play Now';
    }

    if (this.state.hover) {
      return 'Cancel matchmaking';
    }

    const currentTimeout = this.state.currentTimeout;
    if (currentTimeout < 0) {
      return 'Game is ready!';
    }

    let minutes = Math.floor(currentTimeout / 60);
    let seconds = Math.floor(currentTimeout % 60);
    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;
    return `Finding players... ${minutes}:${seconds}`;
  }

  render () {
    if (this.state.currentTimeout === null) {
      return [];
    }
    return (
      <div
        onMouseEnter={ () => this.setState({ hover: true }) }
        onMouseLeave={ () => this.setState({ hover: false }) }
      >
        <Button
          onClick={ () => {
            if (this.props.isSearching) {
              API.cancelMatchmaking();
            } else {
              API.matchmaking();
            }
          }}
          blue
          className={ classNames(this.props.classes.button) }
          >
          { this.getDisplay() }
        </Button>
      </div>
    );
  }
}

const mapToProps = obstruction({
  isSearching: 'lobby.isSearching',
  busStopNextTimestamp: 'lobby.busStopNextTimestamp',
});

export default withStyles(styles)(connect(mapToProps)(PlayNowButton));
