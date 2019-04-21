import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { classNames } from 'react-extras';
import obstruction from 'obstruction';
import document from 'global/document';

import API from '../../api';

import MusicPlayer from '../music-player';
import OptionsModal from '../options-modal';
import Logs from '../logs';
import GridController from './grid';
import Minimap from './minimap';
import Header from './header';
import Actions from './actions';
import Scoreboard from './scoreboard';
import PlayerPicker from './player-picker';
import Disasters from './disasters';
import PlayerHand from './hand';
import DisasterAlert from './disaster-alert';
import TurnTimer from './turn-timer';

import backgroundImage1 from '../backgrounds/BG1.png';
import backgroundImage2 from '../backgrounds/BG2.png';
import backgroundImage3 from '../backgrounds/BG3.png';
import backgroundImage4 from '../backgrounds/BG4.png';
import backgroundImage5 from '../backgrounds/BG5.png';

import { BG_Blur } from '../backgrounds';

const BG_INDEX = ~~(Math.random() * 5);

const backgroundImage = [
  backgroundImage1,
  backgroundImage2,
  backgroundImage3,
  backgroundImage4,
  backgroundImage5
][BG_INDEX];

const styles = theme => ({
  '@supports (background-image: filter(url(i.jpg), blur(1px)))': {
    '@keyframes sharpen': {
      from: { backgroundImage: `filter(url(${backgroundImage}), blur(20px))` },
      to: { backgroundImage: `filter(url(${backgroundImage}), blur(0px))` },
    },
  },
  root: {
    width: '100%',
    minHeight: '100%',
    backgroundImage: `url("data:image/svg+xml;charset=utf-8,${BG_Blur[BG_INDEX]}")`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    transform: 'translateZ(0)',

    '&.loaded': {
      backgroundImage: 'url(' + backgroundImage + ')',
      animation: 'sharpen .5s both',
    },
  },
  header: {
    width: '100%',
    height: '100px',
  },
  music: {
    position: 'absolute',
    top: 38,
    right: 0
  },
  preloader: {
    display: 'none',
  },
});

class GameComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      backgroundLoaded: false,
    };

    this.onImageLoad = this.onImageLoad.bind(this);
  }

  componentWillMount() {
    if (!this.props.inGame) {
      API.reconnect(this.props.match.params.id);
    }
    document.documentElement.className = 'noscroll';
  }

  onImageLoad() {
    this.setState({ backgroundLoaded: true });
  }

  render () {
    return (
      <div className={ classNames(
          this.props.classes.root,
          { loaded: this.state.backgroundLoaded },
        ) }>
        {/* index order, not meaning order */}
        <GridController />
        {/* grid goes first because it's fullscreen covering the background */}
        {/* everything else is "hovering" over it */}
        <Header />
        <TurnTimer />
        <div className={ this.props.classes.music }>
          <MusicPlayer />
          <OptionsModal />
        </div>
        <Logs ingame />
        <PlayerPicker />
        <DisasterAlert />

        <Minimap />
        <Actions />
        <Scoreboard />
        <Disasters />
        <PlayerHand />
        <img src={ backgroundImage } alt="" className={ this.props.classes.preloader } onLoad={ this.onImageLoad } />
      </div>
    );
  }
}

const mapToProps = obstruction({
  inGame: 'game.inGame',
});

export default withStyles(styles)(connect(mapToProps)(GameComponent));
