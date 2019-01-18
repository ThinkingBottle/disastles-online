import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import Input from '@material-ui/core/Input';

import boxImage from './lobby/images/box.png';
import boxActiveImage from './lobby/images/box-active.png';

const styles = theme => ({
  root: {
    position: 'absolute',
    width: 192,
    height: 32,
    background: 'url(' + boxImage + ') no-repeat',
    backgroundSize: '100% 100%',
    padding: 1,
    margin: 0,
    '& input': {
      height: 30,
      padding: 0,
      paddingLeft: 9,
      color: 'white',
    }
  },
  focused: {
    background: 'url(' + boxActiveImage + ') no-repeat',
    backgroundSize: '100% 100%',
  },
});

class DisastlesInput extends Component {
  constructor () {
    super();
  }
  render () {
    return (
      <Input
        {...this.props}
        disableUnderline
        />
    );
  }
}

export default withStyles(styles)(DisastlesInput);
