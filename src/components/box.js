import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import obstruction from 'obstruction';
import { classNames, If } from 'react-extras';

import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    position: 'relative',
    borderRadius: 64,
    padding: 64,
    transition: 'all 0.5s',

    '&.thirtytwo': {
      borderRadius: 32,
      padding: 32,
    },
    '&:focus': {
      outline: 'none'
    }
  },
  bottomLeft: makeCorner('bottom', 'left'),
  bottomRight: makeCorner('bottom', 'right'),
  topLeft: makeCorner('top', 'left'),
  topRight: makeCorner('top', 'right'),
  left: makeEdge('left'),
  right: makeEdge('right'),
  top: makeEdge('top'),
  bottom: makeEdge('bottom'),
  headerSide: {
    backgroundRepeat: 'no-repeat',
    height: 64,
    width: 44,
  },
  header: {
    position: 'absolute',
    top: -20,
    display: 'flex',
    flexDirection: 'row',
    zIndex: 1,
    left: '50%',
    transform: 'translate(-50%, 0)',
  },
  headerMiddle: {
    backgroundRepeat: 'repeat-x',
    height: 64,
    whiteSpace: 'nowrap',
    paddingTop: 10,
    color: 'white'
  },
  content: {
    position: 'relative',
    zIndex: 1,
  }
});

function makeCorner (y, x) {
  return {
    position: 'absolute',
    zIndex: 1,
    height: 64,
    width: 64,
    backgroundRepeat: 'no-repeat',
    [y]: 0,
    [x]: 0,
    '&.thirtytwo': {
      height: 32,
      width: 32,
    }
  };
}

function makeEdge (type) {
  let isVertical = (type === 'top' || type === 'bottom');
  return {
    position: 'absolute',
    zIndex: 1,
    height: isVertical ? 64 : 'calc(100% - 128px)',
    width: isVertical ? 'calc(100% - 128px)' : 64,
    // margin: isVertical ? '0 64px 0 64px' : '64px 0 64px 0',
    backgroundRepeat: 'repeat-' + (isVertical ? 'x' : 'y'),
    [type]: 0,
    '&.thirtytwo': {
      height: isVertical ? 32 : 'calc(100% - 64px)',
      width: isVertical ? 'calc(100% - 64px)' : 32,
    }
  };
}


class BoxComponent extends Component {
  constructor () {
    super();
  }
  render () {
    var props = obstruction({
      style: true
    })(this.props);
    return (
      <div
        className={ classNames(this.props.classes.root, {
          thirtytwo: this.props.half
        }) }
        style={{
          height: this.props.height
        }}
        >
        <div
          className={ classNames(this.props.classes.topLeft, {
            thirtytwo: this.props.half
          }) }
          style={{
            backgroundImage: 'url(' + this.props.topLeft + ')'
          }}
        >
        </div>
        <div
          className={ classNames(this.props.classes.topRight, {
            thirtytwo: this.props.half
          }) }
          style={{
            backgroundImage: 'url(' + this.props.topRight + ')'
          }}
        >
        </div>
        <div
          className={ classNames(this.props.classes.bottomLeft, {
            thirtytwo: this.props.half
          }) }
          style={{
            backgroundImage: 'url(' + this.props.bottomLeft + ')'
          }}
        >
        </div>
        <div
          className={ classNames(this.props.classes.bottomRight, {
            thirtytwo: this.props.half
          }) }
          style={{
            backgroundImage: 'url(' + this.props.bottomRight + ')'
          }}
        >
        </div>
        <div
          className={ classNames(this.props.classes.left, {
            thirtytwo: this.props.half
          }) }
          style={{
            backgroundImage: 'url(' + this.props.left + ')'
          }}
        >
        </div>
        <div
          className={ classNames(this.props.classes.right, {
            thirtytwo: this.props.half
          }) }
          style={{
            backgroundImage: 'url(' + this.props.right + ')'
          }}
        >
        </div>
        <div
          className={ classNames(this.props.classes.top, {
            thirtytwo: this.props.half
          }) }
          style={{
            backgroundImage: 'url(' + this.props.top + ')'
          }}
        >
        </div>
        <div
          className={ classNames(this.props.classes.bottom, {
            thirtytwo: this.props.half
          }) }
          style={{
            backgroundImage: 'url(' + this.props.bottom + ')'
          }}
        >
        </div>
        <If
          condition={ !!this.props.header }
          render={ ()=>
            <div className={ this.props.classes.header }>
              <div
                className={ this.props.classes.headerSide }
                style={{
                  backgroundImage: 'url(' + this.props.headerLeft + ')'
                }} />
              <div
                className={ this.props.classes.headerMiddle }
                style={{
                  backgroundImage: 'url(' + this.props.headerMiddle + ')'
                }}>
                { this.props.header }
              </div>
              <div
                className={ this.props.classes.headerSide }
                style={{
                  backgroundImage: 'url(' + this.props.headerRight + ')'
                }} />
            </div> } />
        <div
          className={ classNames(this.props.classes.content, {
            thirtytwo: this.props.half
          }) }
          {...props}
          style={{...(props.style ? props.style : {}),
            backgroundImage: 'url(' + this.props.color + ')',
            minHeight: '100%',
            height: this.props.height
              ? this.props.height - (this.props.half ? 64 : 128) + (this.props.margin ? (0 - this.props.margin) * 2 : 0)
              : null,
            margin: this.props.margin
          }}>
          { this.props.children }
        </div>
      </div>
    );
  }
}

const mapToProps = obstruction({
});

export default withStyles(styles)(connect(mapToProps)(BoxComponent));
