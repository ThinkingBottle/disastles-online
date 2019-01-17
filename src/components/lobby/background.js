import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { classNames } from 'react-extras';
import obstruction from 'obstruction';
import raf from 'raf';
import { interval, timeout } from 'thyming';

import Typography from '@material-ui/core/Typography';
import bgBottom from '../backgrounds/MenuBG_bott.png';
import bgTop from '../backgrounds/MenuBG_top.png';
import bgMiddle from '../backgrounds/MenuBG_mid.png';

const styles = theme => ({
  root: {
    height: '100%',
    minHeight: '100%',
    background: 'url(' + bgBottom + ') no-repeat',
    backgroundSize: 'cover',
  },
  mid: {
    position: 'absolute',
    height: '110%',
    width: '110%',
    top: '-5%',
    left: '-5%',
    background: 'url(' + bgMiddle + ') no-repeat',
    backgroundSize: 'cover',
    transition: 'all 40s',
  },
  top: {
    position: 'absolute',
    height: '110%',
    width: '110%',
    background: 'url(' + bgTop + ') no-repeat',
    backgroundSize: 'cover',
    transition: 'all 40s',
  },
  content: {
    position: 'relative',
    zIndex: 1,
    pointerEvents: 'none',
    '& > *': {
      pointerEvents: 'initial'
    }
  }
});

class FloatingBackground extends Component {
  constructor () {
    super();

    this.state = {
      x: -5,
      y: -5
    };
  }
  componentDidMount () {
    this.cancel = interval(()=> {
      this.cancel = null;
      this.randomLocations();
    }, 20000);
    timeout(()=> this.randomLocations(), 200);
  }
  componentWillUnmount () {
    if (this.cancel) {
      this.cancel();
    }
  }
  randomLocations () {
    this.setState({
      x: round(Math.random() * (-10)),
      y: round(Math.random() * (-10))
    });
  }
  render () {
    return (
      <div className={ this.props.classes.root }
        >
        <div
          className={ this.props.classes.mid }
          style={{
            transform: 'translate3d(' + this.state.x/3 + '%, ' + this.state.y/3 + '%, 0)'
          }} />
        <div
          className={ this.props.classes.top }
          style={{
            transform: 'translate3d(' + this.state.x + '%, ' + this.state.y + '%, 0)'
          }}
          />
        <div className={ classNames(this.props.classes.content, this.props.rootClass) }>
          {this.props.children}
        </div>
      </div>
    );
  }
}

const mapToProps = obstruction({
});

function round (v) {
  return Math.round(v * 100) / 100;
}

export default withStyles(styles)(connect(mapToProps)(FloatingBackground));
