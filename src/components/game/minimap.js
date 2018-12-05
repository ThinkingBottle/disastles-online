import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import obstruction from 'obstruction';

import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
  }
});

class Minimap extends Component {
  constructor () {
    super();
  }
  render () {
    return (
      <div>
      this is a minimap!
      </div>
    );
  }
}

const mapToProps = obstruction({
});

export default withStyles(styles)(connect(mapToProps)(Minimap));
