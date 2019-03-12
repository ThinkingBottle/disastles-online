import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';

import Slider from '@material-ui/lab/Slider';

const styles = theme => ({
  root: {

  },
});

class VolumeSlider extends Component {
  constructor(props) {
    super(props);

    this.changeVolume = this.changeVolume.bind(this);
  }

  changeVolume (event, value) {
    this.props.dispatch(this.props.action(value));
  }

  render () {
    return (
      <div>
        <div>{ this.props.label }</div>
        <Slider
          value={ this.props.initialValue }
          onChange={ this.changeVolume }
        />
      </div>
    );
  }
}

export default withStyles(styles)(connect()(VolumeSlider));
