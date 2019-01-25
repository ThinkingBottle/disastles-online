import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { If } from 'react-extras';
import { interval, timeout } from 'thyming';
import obstruction from 'obstruction';

import Button from '@material-ui/core/Button';

import {
  previous,
  play,
  pause,
  stop,
  skip,
} from '../actions/music';
import { currentOffset } from '../reducers/music';
import songs from '../songs';

import bgPause from './images/music/pause.png';
import bgPauseHover from './images/music/pause-hover.png';
import bgPauseActive from './images/music/pause-active.png';
import bgStop from './images/music/stop.png';
import bgStopHover from './images/music/stop-hover.png';
import bgStopActive from './images/music/stop-active.png';
import bgPlay from './images/music/play.png';
import bgPlayHover from './images/music/play-hover.png';
import bgPlayActive from './images/music/play-active.png';
import bgForward from './images/music/forward.png';
import bgForwardHover from './images/music/forward-hover.png';
import bgForwardActive from './images/music/forward-active.png';
import bgBackward from './images/music/backward.png';
import bgBackwardHover from './images/music/backward-hover.png';
import bgBackwardActive from './images/music/backward-active.png';

const SCALE = 2;

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    right: 0,
    marginTop: 10,
    marginRight: 10,
    '& > button': {
      minHeight: 0,
      minWidth: 0,
      marginLeft: 5,
      fontSize: '0.1em',
      lineHeight: '1px',
    }
  },
  back: {
    background: 'url(' + bgBackward + ') no-repeat',
    backgroundSize: '100% 100%',
    width: 37 / SCALE,
    minWidth: 37 / SCALE,
    height: 46 / SCALE,
    minHeight: 46 / SCALE,
    padding: 0,

    '&:hover': {
      background: 'url(' + bgBackwardHover + ') no-repeat',
      backgroundSize: '100% 100%',
    }
  },
  play: {
    background: 'url(' + bgPlay + ') no-repeat',
    backgroundSize: '100% 100%',
    width: 32 / SCALE / 1.3,
    minWidth: 32 / SCALE / 1.3,
    height: 62 / SCALE / 1.3,
    minHeight: 62 / SCALE / 1.3,
    padding: 0,

    '&:hover': {
      background: 'url(' + bgPlayHover + ') no-repeat',
      backgroundSize: '100% 100%',
    }
  },
  pause: {
    background: 'url(' + bgPause + ') no-repeat',
    backgroundSize: '100% 100%',
    width: 41 / SCALE,
    minWidth: 41 / SCALE,
    height: 46 / SCALE,
    minHeight: 46 / SCALE,
    padding: 0,

    '&:hover': {
      background: 'url(' + bgPauseHover + ') no-repeat',
      backgroundSize: '100% 100%',
    }
  },
  forward: {
    background: 'url(' + bgForward + ') no-repeat',
    backgroundSize: '100% 100%',
    width: 37 / SCALE,
    minWidth: 37 / SCALE,
    height: 46 / SCALE,
    minHeight: 46 / SCALE,
    padding: 0,

    '&:hover': {
      background: 'url(' + bgForwardHover + ') no-repeat',
      backgroundSize: '100% 100%',
    }
  },
  stop: {
    background: 'url(' + bgStop + ') no-repeat',
    backgroundSize: '100% 100%',
    width: 41 / SCALE,
    minWidth: 41 / SCALE,
    height: 42 / SCALE,
    minHeight: 42 / SCALE,
    padding: 0,

    '&:hover': {
      background: 'url(' + bgStopHover + ') no-repeat',
      backgroundSize: '100% 100%',
    }
  },
});

class MusicPlayer extends Component {
  constructor (props) {
    super();

    this.state = {
      time: Math.floor((Date.now() - props.startTime + props.offset) / 1000)
    };

    this.back = this.back.bind(this);
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.stop = this.stop.bind(this);
    this.skip = this.skip.bind(this);
  }
  componentWillReceiveProps (newProps) {
    if (this.songTimer) {
      this.songTimer();
    }
    this.songTimer = timeout(this.skip, (1000 * songs[newProps.songNumber].length) - currentOffset(newProps) - 5000);
  }
  back () {
    this.props.dispatch(previous());
  }
  play () {
    this.props.dispatch(play());
    delete sessionStorage.disableAutoPlay;
  }
  stop () {
    this.props.dispatch(stop());
    sessionStorage.disableAutoPlay = true;
  }
  skip () {
    this.props.dispatch(skip());
  }
  pause () {
    this.props.dispatch(pause());
  }
  componentWillMount () {
    this.stopTimer = interval(() => {
      if (this.props.playing) {
        this.setState({
          time: Math.floor((Date.now() - this.props.startTime + this.props.offset) / 1000)
        });
      }
    }, 1000);
  }
  componentWillUnmount () {
    this.stopTimer();
    if (this.songTimer) {
      this.songTimer();
    }
  }

  formatTime (time) {
    var str = Math.floor(time / 60) + ':';
    time = time % 60;
    if (time < 10) {
      str += 0;
    }
    str += time;
    return str;
  }
  render () {
    return (
      <div className={ this.props.classes.root }>
        <div className={ this.props.classes.label }>
          { this.props.songName } - { this.formatTime(this.state.time) }
        </div>
        <Button
          onClick={ this.back }
          classes={{ root: this.props.classes.back }}>&nbsp;</Button>
        <If condition={ !this.props.playing }
          render={ ()=> <Button
            onClick={ this.play }
            classes={{ root: this.props.classes.play }}>&nbsp;</Button> } />
        <If condition={ !!this.props.playing }
          render={ ()=> <Button
            onClick={ this.pause }
            classes={{ root: this.props.classes.pause }}>&nbsp;</Button> } />
        <Button
          onClick={ this.stop }
          classes={{ root: this.props.classes.stop }}>&nbsp;</Button>
        <Button
          onClick={ this.skip }
          classes={{ root: this.props.classes.forward }}>&nbsp;</Button>
      </div>
    );
  }
}

const mapToProps = obstruction({
  songName: 'music.songName',
  startTime: 'music.startTime',
  offset: 'music.offset',
  playing: 'music.playing',
  songNumber: 'music.songNumber',
});

export default withStyles(styles)(connect(mapToProps)(MusicPlayer));

