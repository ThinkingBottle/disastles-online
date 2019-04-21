import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { classNames } from 'react-extras';
import { interval } from 'thyming';

import bgBottom from '../backgrounds/MenuBG_bott.png';
import bgTop from '../backgrounds/MenuBG_top.png';
import bgMiddle from '../backgrounds/MenuBG_mid.png';

import {
  MenuBgBottom_Blur,
  MenuBgTop_Blur,
  MenuBgMiddle_Blur,
} from '../backgrounds';

const PARRALAX_TIME = 60;

const styles = theme => ({
  '@supports (background-image: filter(url(i.jpg), blur(1px)))': {
    '@keyframes sharpen-bottom': {
      from: { backgroundImage: `filter(url(${bgBottom}), blur(20px))` },
      to: { backgroundImage: `filter(url(${bgBottom}), blur(0px))` },
    },
    '@keyframes sharpen-mid': {
      from: { backgroundImage: `filter(url(${bgMiddle}), blur(20px))`, opacity: '0.4' },
      to: { backgroundImage: `filter(url(${bgMiddle}), blur(0px))`, opacity: '1' },
    },
    '@keyframes sharpen-top': {
      from: { backgroundImage: `filter(url(${bgTop}), blur(20px))`, opacity: '0.4' },
      to: { backgroundImage: `filter(url(${bgTop}), blur(0px))`, opacity: '1' },
    },
  },
  root: {
    position: 'relative',
    minHeight: '100%',
    height: '100%',
  },
  bottom: {
    position: 'fixed',
    height: '110%',
    width: '110%',
    top: '-5%',
    left: '-5%',
    backgroundImage: `url("data:image/svg+xml;charset=utf-8,${MenuBgBottom_Blur}")`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    transition: 'opacity 0.5s, transform ' + PARRALAX_TIME + 's',
    transform: 'translateZ(0)',

    '&.loaded': {
      backgroundImage: 'url(' + bgBottom + ')',
      animation: 'sharpen-bottom .5s both',
    },
  },
  mid: {
    position: 'fixed',
    height: '110%',
    width: '110%',
    top: '-5%',
    left: '-5%',
    backgroundImage: `url("data:image/svg+xml;charset=utf-8,${MenuBgMiddle_Blur}")`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    transition: 'opacity 0.5s, transform ' + PARRALAX_TIME + 's',
    opacity: '0.4',
    transform: 'translateZ(0)',

    '&.loaded': {
      backgroundImage: 'url(' + bgMiddle + ')',
      animation: 'sharpen-mid .5s both',
      opacity: '1',
    },
  },
  top: {
    position: 'fixed',
    height: '110%',
    width: '110%',
    backgroundImage: `url("data:image/svg+xml;charset=utf-8,${MenuBgTop_Blur}")`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    transition: 'opacity 0.5s, transform ' + PARRALAX_TIME + 's',
    opacity: '0.4',
    transform: 'translateZ(0)',

    '&.loaded': {
      backgroundImage: 'url(' + bgTop + ')',
      animation: 'sharpen-top .5s both',
      opacity: '1',
    },
  },
  content: {
    position: 'relative',
    zIndex: 1,
    pointerEvents: 'none',
    '& > *': {
      pointerEvents: 'initial'
    }
  },
  preloader: {
    display: 'none',
  },
});

class FloatingBackground extends Component {
  constructor(props) {
    super(props);

    this.state = {
      x: -5,
      y: -5,
      loadedImages: [],
    };

    this.onImageLoad = this.onImageLoad.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.loadedImages.length === 3 && prevState.loadedImages.length === 2) {
      this.randomLocations();
      this.cancel = interval(() => {
        this.randomLocations();
      }, PARRALAX_TIME * 400);
    }
  }

  componentWillUnmount() {
    if (this.cancel) {
      this.cancel();
    }
  }

  randomLocations() {
    this.setState({
      x: round(Math.random() * (-10)),
      y: round(Math.random() * (-10))
    });
  }

  onImageLoad(image) {
    this.setState({ loadedImages: [...this.state.loadedImages, image] });
  }

  render() {
    return (
      <div className={ this.props.classes.root }>
        <div
          className={ classNames(
            this.props.classes.bottom,
            { loaded: this.state.loadedImages.indexOf('bottom') > -1 },
          ) }
          style={{ transform: 'translate3d(' + this.state.x/4 + '%, ' + this.state.y/4 + '%, 0) translateZ(0)' }}
        />
        <div
          className={ classNames(
            this.props.classes.mid,
            { loaded: this.state.loadedImages.indexOf('mid') > -1 },
          ) }
          style={{ transform: 'translate3d(' + this.state.x/2 + '%, ' + this.state.y/2 + '%, 0) translateZ(0)' }}
        />
        <div
          className={ classNames(
            this.props.classes.top,
            { loaded: this.state.loadedImages.indexOf('top') > -1 },
          ) }
          style={{ transform: 'translate3d(' + this.state.x + '%, ' + this.state.y + '%, 0) translateZ(0)' }}
        />
        <div className={ classNames(this.props.classes.content, this.props.rootClass) }>
          {this.props.children}
        </div>
        <img src={ bgTop } alt="" className={ this.props.classes.preloader } onLoad={ () => this.onImageLoad('top') } />
        <img src={ bgBottom } alt="" className={ this.props.classes.preloader } onLoad={ () => this.onImageLoad('bottom') } />
        <img src={ bgMiddle } alt="" className={ this.props.classes.preloader } onLoad={ () => this.onImageLoad('mid') } />
      </div>
    );
  }
}

function round(v) {
  return Math.round(v * 100) / 100;
}

export default withStyles(styles)(FloatingBackground);
