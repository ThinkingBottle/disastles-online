import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import obstruction from 'obstruction';

import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
  }
});

class MyComponent extends Component {
  constructor () {
    super();
  }
  render () {
    return (
      <div>
      </div>
    );
  }
}

const mapToProps = obstruction({
});

export default withStyles(styles)(connect(mapToProps)(MyComponent));
