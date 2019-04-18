import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import obstruction from 'obstruction';
import { classNames } from 'react-extras';

import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Tooltip from '@material-ui/core/Tooltip';
import OptionsSlider from './options-slider';

import API from '../api';

import { changeCardHoverDelay } from '../actions/options';
import {
  changeMusicVolume,
  changeAmbienceVolume,
  changeSfxVolume,
  changePlayerTurnVolume,
} from '../actions/music';

import Sound from '../sound';

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
import close from './images/close.png';
import closeHover from './images/close-hover.png';

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
    },
  },
  closeButton: {
    width: 24,
    height: 22.5,
    background: `url(${close}) no-repeat`,
    backgroundSize: '24px 22.5px',
    position: 'absolute',
    padding: 0,
    minWidth: 0,
    minHeight: 0,
    top: -15,
    right: -17,

    '&:hover': {
      background: `url(${closeHover}) no-repeat`,
      backgroundSize: '24px 22.5px',
    },
  },
  buttonLabel: {
    display: 'none'
  },
  // seed: {
  //   fontSize: '10pt',
  //   fontWeight: 500,
  //   marginTop: 30,
  // },
  button: {
    fontWeight: 500,
    fontSize: '10pt',
    display: 'inline-block',
    color: 'white',
    textDecoration: 'none',
    border: '2px solid white',
    padding: '2px 12px',
    borderRadius: 30,
    marginTop: 10,
    textAlign: 'center',
    width: '45%',
    minHeight: 0,

    '&:hover': {
      background: 'rgba(255, 255, 255, 0.2)',
    },
    '&:active': {
      background: 'rgba(255, 255, 255, 0.4)',
    },
    '&:first-child': {
      marginRight: '10%',
    },

    '&.warning': {
      borderColor: '#c1061c',
      backgroundColor: '#c1061c',
    },
    '&.disabled': {
      color: 'rgba(255, 255, 255, 0.8)',
      borderColor: '#a00417',
      backgroundColor: '#a00417',
    },
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
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
    this.concedeGame = this.concedeGame.bind(this);
  }

  openModal () {
    this.setState({ open: true });
    Sound.sfx.playSound('positive');
  }

  closeModal () {
    this.setState({ open: false });
    Sound.sfx.playSound('negative');
  }

  concedeGame () {
    API.send({ action: 'Concede' });
  }

  render () {
    return (
      <Fragment>
        <Button
          onClick={ this.openModal }
          classes={{
            root: this.props.classes.settings,
            label: this.props.classes.buttonLabel,
          }}
        >
          open options
        </Button>
        <Modal
          open={ this.state.open }
          disableBackdropClick={false}
          BackdropProps={{
            className: this.props.classes.backdrop,
          }}
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
                <OptionsSlider
                  label="Music"
                  initialValue={ this.props.musicVolume }
                  action={ changeMusicVolume }
                />
                <OptionsSlider
                  label="Ambience"
                  initialValue={ this.props.ambienceVolume }
                  action={ changeAmbienceVolume }
                />
                <OptionsSlider
                  label="Sound effects"
                  initialValue={ this.props.sfxVolume }
                  action={ changeSfxVolume }
                  testSound="positive"
                />
                <OptionsSlider
                  label="&#34;It's your turn&#34; bell"
                  initialValue={ this.props.playerTurnVolume }
                  action={ changePlayerTurnVolume }
                  testSound="turn"
                />
                <OptionsSlider
                  label="Card hover delay"
                  initialValue={ this.props.cardHoverDelay }
                  action={ changeCardHoverDelay }
                />
                {/*<div className={ this.props.classes.seed }>
                  {`Game seed: ${this.props.seed || '-'}`}
                </div>*/}
                <div style={{ marginTop: 30 }}>
                  <a
                    href='https://www.disastles.com/gallery'
                    target='_blank'
                    rel='noopener noreferrer'
                    className={ this.props.classes.button }
                    >
                    View gallery
                  </a>
                  <a
                    href='https://www.disastles.com/contact'
                    target='_blank'
                    rel='noopener noreferrer'
                    className={ this.props.classes.button }
                    >
                    Report a bug
                  </a>
                </div>
                {this.props.inGame && !this.props.gameEnded && (
                  <div>
                    <Tooltip title={this.props.you !== this.props.currentTurn ? 'You may only concede during your turn' : ''}>
                      <Button
                       onClick={ this.concedeGame }
                       className={ classNames( this.props.classes.button, 'warning', { disabled: this.props.you !== this.props.currentTurn } ) }
                       >
                        Concede
                      </Button>
                    </Tooltip>
                  </div>
                )}
              </div>
            </div>
            <Button
              onClick={ this.closeModal }
              classes={{
                root: this.props.classes.closeButton,
                label: this.props.classes.buttonLabel,
              }}
            >
              close
            </Button>
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
  cardHoverDelay: 'options.cardHoverDelay',
  // seed: 'game.seed',
  inGame: 'game.inGame',
  gameEnded: 'game.gameEnded',
  you: 'global.playerId',
  currentTurn: 'game.currentTurn',
});

export default withStyles(styles)(connect(mapToProps)(OptionsModal));
