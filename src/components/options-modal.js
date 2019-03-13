import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import obstruction from 'obstruction';

import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import VolumeSlider from './volume-slider';

import {
  changeMusicVolume,
  changeAmbienceVolume,
  changeSfxVolume,
  changePlayerTurnVolume,
} from '../actions/music';

import bgTopLeft from './images/options_tl.png';
import bgTopRight from './images/options_tr.png';
import bgBottomLeft from './images/options_bl.png';
import bgBottomRight from './images/options_br.png';
import bgColor from './images/options_color.png';
import bgLeft from './images/options_left.png';
import bgRight from './images/options_right.png';
import bgTop from './images/options_top.png';
import bgBottom from './images/options_bottom.png';
import bgTopMiddle from './images/options_top_middle.png';
import bgTopMidLeft from './images/options_top_left.png';
import bgTopMidRight from './images/options_top_right.png';

import settings from './images/settings.png';
import settingsHover from './images/settings-hover.png';

const styles = theme => ({
  root: {
    position: 'absolute',
    minHeight: 130,
    minWidth: 130,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    margin: '0 auto',
    borderRadius: 16,
    padding: 16,
    '&:focus': {
      outline: 'none',
    },
  },
  bottomLeft: makeCorner(bgBottomLeft, 'bottom', 'left'),
  bottomRight: makeCorner(bgBottomRight, 'bottom', 'right'),
  topLeft: makeCorner(bgTopLeft, 'top', 'left'),
  topRight: makeCorner(bgTopRight, 'top', 'right'),
  left: makeEdge(bgLeft, 'left'),
  right: makeEdge(bgRight, 'right'),
  top: makeEdge(bgTop, 'top'),
  bottom: makeEdge(bgBottom, 'bottom'),
  headerMiddle: makeHeader(bgTopMiddle, {
    left: 38,
    width: 'calc(100% - 76px)',
  }),
  headerLeft: makeHeader(bgTopMidLeft, {
    left: 16,
    width: 22,
  }),
  headerRight: makeHeader(bgTopMidRight, {
    right: 16,
    width: 22,
  }),
  content: {
    background: `url(${bgColor})`,
    minHeight: 200,
    minWidth: 200,
    color: 'white',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  header: {
    margin: 0,
    position: 'absolute',
    top: -7,
    fontWeight: 500,
    textAlign: 'center',
    width: '100%',
    left: 0,
    fontSize: 13,
  },
  settings: {
    position: 'absolute',
    right: 8,
    top: 117,
    zIndex: 1,
    width: 32,
    height: 32,
    minWidth: 0,
    padding: 0,
    display: 'block',
    background: `url(${settings}) no-repeat`,
    backgroundSize: 32,

    '&:hover': {
      background: `url(${settingsHover}) no-repeat`,
      backgroundSize: 32,
    }
  }
});

function makeHeader (background, baseStyles) {
  return {
    ...baseStyles,
    zIndex: 1,
    top: -10,
    position: 'absolute',
    height: 26,
    backgroundSize: 'contain',
    background: `url(${background}) repeat-x`,
  }
}

function makeCorner (background, y, x) {
  return {
    position: 'absolute',
    zIndex: 1,
    height: 16,
    width: 16,
    background: `url(${background}) no-repeat`,
    backgroundSize: 'cover',
    [y]: 0,
    [x]: 0,
  };
}

function makeEdge (background, type) {
  const isVertical = (type === 'top' || type === 'bottom');
  return {
    position: 'absolute',
    zIndex: 1,
    height: isVertical ? 16 : 'calc(100% - 32px)',
    width: isVertical ? 'calc(100% - 32px)' : 16,
    background: `url(${background}) repeat-${isVertical ? 'x' : 'y'}`,
    backgroundSize: 'contain',
    [type]: 0,
  };
}

class OptionsModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal () {
    this.setState({ open: true });
  }

  closeModal () {
    this.setState({ open: false });
  }

  render () {
    return (
      <Fragment>
        <Button
          onClick={ this.openModal }
          className={ this.props.classes.settings }
        />
        <Modal
          open={ this.state.open }
          onClose={ this.closeModal }
          >
          <div className={ this.props.classes.root }>
            <div className={ this.props.classes.topLeft } />
            <div className={ this.props.classes.topRight } />
            <div className={ this.props.classes.bottomLeft } />
            <div className={ this.props.classes.bottomRight } />
            <div className={ this.props.classes.left } />
            <div className={ this.props.classes.right } />
            <div className={ this.props.classes.bottom } />
            <div className={ this.props.classes.headerLeft } />
            <div className={ this.props.classes.headerMiddle } />
            <div className={ this.props.classes.headerRight } />
            <div className={ this.props.classes.content }>
              <h2 className={ this.props.classes.header }>Options</h2>
              <div>
                <VolumeSlider
                  label="Music"
                  initialValue={ this.props.musicVolume }
                  action={ changeMusicVolume }
                />
                <VolumeSlider
                  label="Ambience"
                  initialValue={ this.props.ambienceVolume }
                  action={ changeAmbienceVolume }
                />
                <VolumeSlider
                  label="Sound effects"
                  initialValue={ this.props.sfxVolume }
                  action={ changeSfxVolume }
                />
                <VolumeSlider
                  label="&#34;It's your turn&#34; bell"
                  initialValue={ this.props.playerTurnVolume }
                  action={ changePlayerTurnVolume }
                />
              </div>
            </div>
          </div>
        </Modal>
      </Fragment>
    );
  }
}

const mapToProps = obstruction({
  musicVolume: 'music.musicVolume',
  ambienceVolume: 'music.ambienceVolume',
  sfxVolume: 'music.sfxVolume',
  playerTurnVolume: 'music.playerTurnVolume',
});

export default withStyles(styles)(connect(mapToProps)(OptionsModal));
