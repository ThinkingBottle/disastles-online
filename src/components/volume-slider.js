import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';

import Button from '@material-ui/core/Button';
import Slider from '@material-ui/lab/Slider';

import minus from './images/minus.png';
import minusHover from './images/minus-hover.png';
import minusActive from './images/minus-active.png';
import plus from './images/plus.png';
import plusHover from './images/plus-hover.png';
import plusActive from './images/plus-active.png';

const styles = theme => ({
  root: {
    width: 240,
    fontSize: '10pt',
    display: 'flex',
    paddingTop: 12,
    fontWeight: 500,
  },
  left: {
    width: '50%',
  },
  right: {
    display: 'flex',
    width: '50%',
  },
  slider: {
    top: '50%',
  },
  sliderWrapper: {
    width: 83,
  },
  trackBefore: {
    backgroundColor: 'transparent',
    backgroundImage: 'linear-gradient(to right, #ffffff4d, #FFFFFF)',
    height: 3,
    left: -2,
  },
  trackAfter: {
    backgroundColor: 'white',
    height: 3,
    right: -2,
  },
  thumb: {
    borderRadius: 0,
    height: 22,
    width: 7,
    border: '2px solid white',
    background: '#FFFFFF9D',

    '&:hover': {
      boxShadow: '0px 0px 0px 9px rgba(81, 81, 81, 0.16)',
    },
  },
  activated: {
    'button&': {
      boxShadow: '0px 0px 0px 18px rgba(81, 81, 81, 0.16) !important',
    },
  },
  jumped: {
    'button&': {
      boxShadow: '0px 0px 0px 18px rgba(81, 81, 81, 0.16) !important',
    },
  },
  minusButton: makeButton(minus, minusHover, minusActive, 'Left'),
  plusButton: makeButton(plus, plusHover, plusActive, 'Right'),
});

function makeButton(image, hover, active, type) {
  return {
    minWidth: 0,
    minHeight: 0,
    width: 18.5,
    height: 22,
    padding: 0,
    backgroundImage: `url(${image})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: '18.5px 22px',
    borderRadius: 0,
    [`borderTop${type}Radius`]: 10,
    [`borderBottom${type}Radius`]: 10,
    '&:hover': {
      backgroundImage: `url(${hover})`,
    },
    '&:active': {
      backgroundImage: `url(${active})`,
    },
  }
};

class VolumeSlider extends Component {
  constructor(props) {
    super(props);

    this.changeVolume = this.changeVolume.bind(this);
    this.decreaseVolume = this.decreaseVolume.bind(this);
    this.increaseVolume = this.increaseVolume.bind(this);
  }

  changeVolume (event, value) {
    this.props.dispatch(this.props.action(value));
  }

  decreaseVolume () {
    const value = Math.max(this.props.initialValue - 10, 0);
    this.props.dispatch(this.props.action(value))
  }

  increaseVolume () {
    const value = Math.min(this.props.initialValue + 10, 100);
    this.props.dispatch(this.props.action(value))
  }

  render () {
    return (
      <div className={ this.props.classes.root }>
        <div className={ this.props.classes.left }>
          { this.props.label }
        </div>
        <div className={ this.props.classes.right }>
          <Button
            className={ this.props.classes.minusButton }
            onClick={ this.decreaseVolume }
          />
          <div className={ this.props.classes.sliderWrapper }>
            <Slider
              className={ this.props.classes.slider }
              value={ this.props.initialValue }
              onChange={ this.changeVolume }
              classes={ {
                trackBefore: this.props.classes.trackBefore,
                trackAfter: this.props.classes.trackAfter,
                thumb: this.props.classes.thumb,
                activated: this.props.classes.activated,
                jumped: this.props.classes.jumped,
              } }
            />
          </div>
          <Button
            className={ this.props.classes.plusButton }
            onClick={ this.increaseVolume }
          />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(connect()(VolumeSlider));
