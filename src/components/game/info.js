import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import obstruction from 'obstruction';
import { classNames } from 'react-extras';

import Typography from '@material-ui/core/Typography';

import bgTopLeft from './images/error-tl.png';
import bgTopRight from './images/error-tr.png';
import bgBottomLeft from './images/error-bl.png';
import bgBottomRight from './images/error-br.png';
import bgColor from './images/error-color.png';
import bgLeft from './images/error-left.png';
import bgRight from './images/error-right.png';
import bgTop from './images/error-top.png';
import bgBottom from './images/error-bottom.png';
import bgTopLeftInfo from './images/info-tl.png';
import bgTopRightInfo from './images/info-tr.png';
import bgBottomLeftInfo from './images/info-bl.png';
import bgBottomRightInfo from './images/info-br.png';
import bgColorInfo from './images/info-color.png';
import bgLeftInfo from './images/info-left.png';
import bgRightInfo from './images/info-right.png';
import bgTopInfo from './images/info-top.png';
import bgBottomInfo from './images/info-bottom.png';

const styles = theme => ({
  root: {
    position: 'absolute',
    minHeight: 130,
    minWidth: 130,
    background: 'url(' + bgColor + ')',
    bottom: 20,
    left: '50%',
    transform: 'translateX(-50%)',
    margin: '0 auto',
    borderRadius: 64,
    padding: 64,
    ['&.info']: {
      background: 'url(' + bgColorInfo + ')',
    }
  },
  bottomLeft: makeCorner(bgBottomLeft, bgBottomLeftInfo, 'bottom', 'left'),
  bottomRight: makeCorner(bgBottomRight, bgBottomRightInfo, 'bottom', 'right'),
  topLeft: makeCorner(bgTopLeft, bgTopLeftInfo, 'top', 'left'),
  topRight: makeCorner(bgTopRight, bgTopRightInfo, 'top', 'right'),
  left: makeEdge(bgLeft, bgLeftInfo, 'left'),
  right: makeEdge(bgRight, bgRightInfo, 'right'),
  top: makeEdge(bgTop, bgTopInfo, 'top'),
  bottom: makeEdge(bgBottom, bgBottomInfo, 'bottom'),
  content: {
    position: 'relative',
    zIndex: 9,
    textAlign: 'center',
    margin: '-20px 100px',
  }
});

function makeCorner (background, backgroundInfo, y, x) {
  return {
    position: 'absolute',
    zIndex: 1,
    height: 64,
    width: 64,
    background: 'url(' + background + ') no-repeat',
    [y]: 0,
    [x]: 0,
    ['&.info']: {
      background: 'url(' + backgroundInfo + ') no-repeat',
    }
  };
}

function makeEdge (background, backgroundInfo, type) {
  let isVertical = (type === 'top' || type === 'bottom');
  return {
    position: 'absolute',
    zIndex: 1,
    height: isVertical ? 64 : 'calc(100% - 128px)',
    width: isVertical ? 'calc(100% - 128px)' : 64,
    // margin: isVertical ? '0 64px 0 64px' : '64px 0 64px 0',
    background: 'url(' + background + ') repeat-' + (isVertical ? 'x' : 'y'),
    [type]: 0,
    ['&.info']: {
      background: 'url(' + backgroundInfo + ') repeat-' + (isVertical ? 'x' : 'y'),
    }
  };
}

class ErrorBox extends Component {
  constructor () {
    super();
  }
  render () {
    return (
      <div className={ classNames(this.props.classes.root, {
        info: !this.props.error
      }) }>
        <div className={ classNames(this.props.classes.topLeft, {
          info: !this.props.error
        }) }>
        </div>
        <div className={ classNames(this.props.classes.topRight, {
          info: !this.props.error
        }) }>
        </div>
        <div className={ classNames(this.props.classes.bottomLeft, {
          info: !this.props.error
        }) }>
        </div>
        <div className={ classNames(this.props.classes.bottomRight, {
          info: !this.props.error
        }) }>
        </div>
        <div className={ classNames(this.props.classes.left, {
          info: !this.props.error
        }) }>
        </div>
        <div className={ classNames(this.props.classes.right, {
          info: !this.props.error
        }) }>
        </div>
        <div className={ classNames(this.props.classes.top, {
          info: !this.props.error
        }) }>
        </div>
        <div className={ classNames(this.props.classes.bottom, {
          info: !this.props.error
        }) }>
        </div>
        <div className={ classNames(this.props.classes.content, {
          info: !this.props.error
        }) }>
          { this.props.children }
        </div>
      </div>
    );
  }
}

const mapToProps = obstruction({
});

export default withStyles(styles)(connect(mapToProps)(ErrorBox));
