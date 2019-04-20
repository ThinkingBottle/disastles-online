import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { classNames } from 'react-extras';
import obstruction from 'obstruction';
import { interval } from 'thyming';

import Button from '../game/button';
import Loading from '../loading';

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
      isMatchmaking: false,
      matchmakingFailed: false,
    };

    this.updateTime = this.updateTime.bind(this);
    this.cancelMatchmaking = this.cancelMatchmaking.bind(this);
    this.startMatchmaking = this.startMatchmaking.bind(this);
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
    }
  }

  getDisplay () {
    if (this.props.matchmakingFailed) {
      return 'Matchmaking failed.';
    }

    const currentTimeout = this.state.currentTimeout;
    if (currentTimeout < 0) {
      return 'Connecting...';
    }

    let minutes = Math.floor(currentTimeout / 60);
    let seconds = Math.floor(currentTimeout % 60);
    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;
    return `Finding players... ${minutes}:${seconds}`;
  }

  cancelMatchmaking() {
    API.cancelMatchmaking();
    this.setState({ isMatchmaking: false });
  }

  startMatchmaking() {
    API.matchmaking();
    this.setState({ isMatchmaking: true });
  }

  render () {
    if (this.state.currentTimeout === null) {
      return [];
    }
    return (
      <div>
        <Button
          onClick={ this.startMatchmaking }
          blue
          className={ classNames(this.props.classes.button) }
          >
          Play Now
        </Button>
        <Loading
          message={ this.getDisplay() }
          open={ this.state.isMatchmaking }
          buttonAction={ this.cancelMatchmaking }
          buttonText={this.props.matchmakingFailed ? 'Close' : 'Cancel matchmaking' }
          loading={ !this.props.matchmakingFailed }
        />
      </div>
    );
  }
}

const mapToProps = obstruction({
  isSearching: 'lobby.isSearching',
  matchmakingFailed: 'lobby.matchmakingFailed',
  busStopNextTimestamp: 'lobby.busStopNextTimestamp',
});

export default withStyles(styles)(connect(mapToProps)(PlayNowButton));
