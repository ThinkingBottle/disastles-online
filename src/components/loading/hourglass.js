import React, { Component } from 'react';
import ReactAnimationFrame from 'react-animation-frame';
import { withStyles } from '@material-ui/core/styles';
import { classNames } from 'react-extras';

import spritesheet from '../images/Anim_Spritesheet.png';

const POSITIONS = 16;

const styles = theme => ({
  root: {
    height: 64,
    width: 64,
    background: 'url(' + spritesheet + ') no-repeat',
    backgroundSize: '512px 512px',
    backgroundPosition: '-0px -384px',

    '&.position0': { backgroundPosition: '-0px -384px' },
    '&.position1': { backgroundPosition: '-64px -384px' },
    '&.position2': { backgroundPosition: '-128px -384px' },
    '&.position3': { backgroundPosition: '-192px -384px' },
    '&.position4': { backgroundPosition: '-256px -384px' },
    '&.position5': { backgroundPosition: '-320px -384px' },
    '&.position6': { backgroundPosition: '-384px -384px' },
    '&.position7': { backgroundPosition: '-448px -384px' },
    '&.position8': { backgroundPosition: '-0px -448px' },
    '&.position9': { backgroundPosition: '-64px -448px' },
    '&.position10': { backgroundPosition: '-128px -448px' },
    '&.position11': { backgroundPosition: '-192px -448px' },
    '&.position12': { backgroundPosition: '-256px -448px' },
    '&.position13': { backgroundPosition: '-320px -448px' },
    '&.position14': { backgroundPosition: '-384px -448px' },
    '&.position15': { backgroundPosition: '-448px -448px' },
  },
});

class HourGlass extends Component {
  constructor(props) {
    super(props);

    this.state = {
      position: 0,
    };
  }

  onAnimationFrame() {
    if (this.state.position < POSITIONS) {
      this.setState({ position: this.state.position + 1 });
    } else {
      this.setState({ position: 0 });
    }
    console.log('UPDATING POSITION');
  }

  componentWillUnmount() {
    this.props.endAnimation();
  }

  render () {
    return (
      <div
        className={ classNames(
          this.props.classes.root,
          `position${this.state.position}`,
        ) }
      />
    );
  }
}

export default withStyles(styles)(ReactAnimationFrame(HourGlass, 90));
