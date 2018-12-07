import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import obstruction from 'obstruction';

import Typography from '@material-ui/core/Typography';

import bgTopLeft from './images/error-tl.png';
import bgTopRight from './images/error-tr.png';
import bgBottomLeft from './images/error-bl.png';
import bgBottomRight from './images/error-br.png';
import background from './images/error-color.png';
import bgLeft from './images/error-left.png';
import bgRight from './images/error-right.png';
import bgTop from './images/error-top.png';
import bgBottom from './images/error-bottom.png';

const styles = theme => ({
  root: {
    position: 'absolute',
    minHeight: 128,
    minWidth: 128,
    background: 'url(' + background + ')',
    bottom: 20,
    left: '50%',
    transform: 'translateX(-50%)',
    margin: '0 auto',
    borderRadius: 64,
    padding: 64
  },
  bottomLeft: makeCorner(bgBottomLeft, 'bottom', 'left'),
  bottomRight: makeCorner(bgBottomRight, 'bottom', 'right'),
  topLeft: makeCorner(bgTopLeft, 'top', 'left'),
  topRight: makeCorner(bgTopRight, 'top', 'right'),
  left: makeEdge(bgLeft, 'left'),
  right: makeEdge(bgRight, 'right'),
  top: makeEdge(bgTop, 'top'),
  bottom: makeEdge(bgBottom, 'bottom'),
  content: {
    position: 'relative',
    zIndex: 9,
    textAlign: 'center',
    margin: '-20px 100px',
  }
});

function makeCorner (background, y, x) {
  return {
    position: 'absolute',
    zIndex: 1,
    height: 64,
    width: 64,
    background: 'url(' + background + ') no-repeat',
    [y]: 0,
    [x]: 0
  };
}

function makeEdge (background, type) {
  let isVertical = (type === 'top' || type === 'bottom');
  return {
    position: 'absolute',
    zIndex: 1,
    height: isVertical ? 64 : 'calc(100% - 128px)',
    width: isVertical ? 'calc(100% - 128px)' : 64,
    // margin: isVertical ? '0 64px 0 64px' : '64px 0 64px 0',
    background: 'url(' + background + ') repeat-' + (isVertical ? 'x' : 'y'),
    [type]: 0
  };
}

class ErrorBox extends Component {
  constructor () {
    super();
  }
  render () {
    return (
      <div className={ this.props.classes.root }>
        <div className={ this.props.classes.topLeft }>
        </div>
        <div className={ this.props.classes.topRight }>
        </div>
        <div className={ this.props.classes.bottomLeft }>
        </div>
        <div className={ this.props.classes.bottomRight }>
        </div>
        <div className={ this.props.classes.left }>
        </div>
        <div className={ this.props.classes.right }>
        </div>
        <div className={ this.props.classes.top }>
        </div>
        <div className={ this.props.classes.bottom }>
        </div>
        <div className={ this.props.classes.content }>
          { this.props.children }
        </div>
      </div>
    );
  }
}

const mapToProps = obstruction({
});

export default withStyles(styles)(connect(mapToProps)(ErrorBox));
