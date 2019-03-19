import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { If, classNames } from 'react-extras';
import { interval, timeout } from 'thyming';
import obstruction from 'obstruction';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Popover from '@material-ui/core/Popover';
import Slider from '@material-ui/lab/Slider';

import Marquee from './marquee';

import {
  previous,
  play,
  pause,
  stop,
  skip,
  changeMusicVolume,
  muteMusic,
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
import bgVolume from './images/music/volume.png';
import bgVolumeHover from './images/music/volume-active.png';
import bgVolumeMuted from './images/music/volume-muted.png';

const SCALE = 2;

const styles = theme => ({
  root: {
    position: 'absolute',
    top: 0,
    width: 200,
    padding: 20,
    right: 0,
    marginTop: 10,
    marginRight: 10,
    background: '#222222aa',
    justifyItems: 'right',
    color: 'white',

    '& hr': {
      borderColor: '#88888888',
    },
    '& button': {
      minHeight: 0,
      minWidth: 0,
      margin: '0 auto',
      fontSize: '0.1em',
      lineHeight: '1px',
    }
  },
  controls: {
    flex: '0 0',
    width: 90,
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
    width: 38 / SCALE,
    minWidth: 38 / SCALE,
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
  volume: {
    background: 'url(' + bgVolume + ') no-repeat',
    backgroundSize: '100% 100%',
    width: 42 / SCALE,
    minWidth: 42 / SCALE,
    height: 42 / SCALE,
    minHeight: 42 / SCALE,
    padding: 0,

    '&:hover': {
      background: 'url(' + bgVolumeHover + ') no-repeat',
      backgroundSize: '100% 100%',
    },
    '&.muted': {
      background: 'url(' + bgVolumeMuted + ') no-repeat',
      backgroundSize: '100% 100%',
    }
  },
  sliderWrapper: {
    padding: 10,
    height: 100,
    overflow: 'hidden',
  },
});

class MusicPlayer extends Component {
  constructor (props) {
    super();

    this.state = {
      time: Math.floor((currentOffset(props)) / 1000),
      popoverEl: null,
    };

    this.back = this.back.bind(this);
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.stop = this.stop.bind(this);
    this.skip = this.skip.bind(this);
    this.toggleVolume = this.toggleVolume.bind(this);
    this.closeVolume = this.closeVolume.bind(this);
    this.changeMusicVolume = this.changeMusicVolume.bind(this);
    this.showVolume = this.showVolume.bind(this);
    this.cancelShowVolume = this.cancelShowVolume.bind(this);
    this.toggleMute = this.toggleMute.bind(this);

    this.resetSongTimer(props);
  }
  componentWillReceiveProps (newProps) {
    if (this.songTimer) {
      this.songTimer();
    }
    this.resetSongTimer(newProps);
    let time = Math.floor((currentOffset(newProps)) / 1000);
    if (time !== this.state.time) {
      this.setState({
        time
      });
    }
  }

  resetSongTimer (props) {
    this.songTimer = timeout(this.skip, (1000 * songs[props.songNumber].length) - currentOffset(props) - 5000);
  }

  closeVolume () {
    this.setState({
      popoverEl: false
    });
  }
  toggleMute (event) {
    let newMute = !this.props.musicMuted;
    this.props.dispatch(muteMusic(newMute));
    if (!newMute) {
      this.showVolume(event);
    }
  }
  toggleVolume (event) {
    this.setState({
      popoverEl: this.state.popoverEl ? null : event.target
    });
  }
  showVolume (event) {
    if (this.volumeShowTimer) {
      return;
    }
    let target = event.target;
    this.volumeShowTimer = timeout(() => {
      this.volumeShowTimer = false;
      if (!this.props.musicMuted) {
        this.setState({
          popoverEl: target
        });
      }
    }, 350);
  }
  cancelShowVolume (event) {
    if (this.volumeShowTimer) {
      this.volumeShowTimer();
      this.volumeShowTimer = false;
      return;
    }
  }
  changeMusicVolume (event, value) {
    this.props.dispatch(changeMusicVolume(value));
  }
  back () {
    this.props.dispatch(previous());
  }
  play () {
    delete sessionStorage.disableAutoPlay;
    this.props.dispatch(play());
  }
  stop () {
    sessionStorage.disableAutoPlay = true;
    this.props.dispatch(stop());
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
          time: Math.floor((currentOffset(this.props)) / 1000)
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
        <Grid container>
          <Grid item xs={2}>
          <Popover
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={ !!this.state.popoverEl }
            anchorEl={ this.state.popoverEl }
            onClose={ this.closeVolume }
            >
              { this.renderSlider() }
          </Popover>
          <Button
            className={ classNames(this.props.classes.volume, {
              muted: this.props.musicMuted
            }) }
            onMouseOver={ this.showVolume }
            onMouseOut={ this.cancelShowVolume }
            onClick={ this.toggleMute }
            >
            &nbsp;
          </Button>
          </Grid>
          <Grid item xs={2}>
            <Button
              onClick={ this.back }
              classes={{ root: this.props.classes.back }}>&nbsp;</Button>
          </Grid>
          <Grid item xs={2}>
            <If condition={ !this.props.playing }
              render={ ()=> <Button
                onClick={ this.play }
                classes={{ root: this.props.classes.play }}>&nbsp;</Button> } />
            <If condition={ !!this.props.playing }
              render={ ()=> <Button
                onClick={ this.pause }
                classes={{ root: this.props.classes.pause }}>&nbsp;</Button> } />
          </Grid>
          <Grid item xs={2}>
            <Button
              onClick={ this.stop }
              classes={{ root: this.props.classes.stop }}>&nbsp;</Button>
          </Grid>
          <Grid item xs={2}>
            <Button
              onClick={ this.skip }
              classes={{ root: this.props.classes.forward }}>&nbsp;</Button>
          </Grid>
          <Grid item xs={1}>
            { this.formatTime(this.state.time) }
          </Grid>
          <Grid item xs={12}>
            <hr />
          </Grid>
          <Grid item xs={12}>
            <div className={ this.props.classes.label }>
              <Marquee
                hoverToStop={ this.props.songName !== 'Loading...' }
                loop
                double={ this.props.songName !== 'Loading...' }
                leading={500}
                text={ this.props.songName } />
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }

  renderSlider () {
    return (
      <div className={ this.props.classes.sliderWrapper }>
        <Slider
          value={ this.props.musicVolume }
          onChange={ this.changeMusicVolume }
          vertical />
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
  musicVolume: 'music.musicVolume',
  musicMuted: 'music.musicMuted',
});

export default withStyles(styles)(connect(mapToProps)(MusicPlayer));

