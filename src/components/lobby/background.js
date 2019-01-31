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

const PARRALAX_TIME = 60

const styles = theme => ({
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
    background: 'url(' + bgBottom + ') no-repeat',
    backgroundSize: 'cover',
    transition: 'all ' + PARRALAX_TIME + 's',
  },
  mid: {
    position: 'fixed',
    height: '110%',
    width: '110%',
    top: '-5%',
    left: '-5%',
    background: 'url(' + bgMiddle + ') no-repeat',
    backgroundSize: 'cover',
    transition: 'all ' + PARRALAX_TIME + 's',
  },
  top: {
    position: 'fixed',
    height: '110%',
    width: '110%',
    background: 'url(' + bgTop + ') no-repeat',
    backgroundSize: 'cover',
    transition: 'all ' + PARRALAX_TIME + 's',
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
    this.cancel = timeout(()=> {
      this.randomLocations();
      this.cancel = interval(()=> {
        this.cancel = null;
        this.randomLocations();
      }, PARRALAX_TIME * 400);
    }, 200);
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
      <div className={ this.props.classes.root }>
        <div
          className={ this.props.classes.bottom }
          style={{
            transform: 'translate3d(' + this.state.x/4 + '%, ' + this.state.y/4 + '%, 0)'
          }} />
        <div
          className={ this.props.classes.mid }
          style={{
            transform: 'translate3d(' + this.state.x/2 + '%, ' + this.state.y/2 + '%, 0)'
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
