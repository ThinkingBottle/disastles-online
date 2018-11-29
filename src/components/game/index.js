import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import obstruction from 'obstruction';

import Typography from '@material-ui/core/Typography';

import GridController from './grid';
import Shop from './shop';

const styles = theme => ({
  root: {
  }
});

class GameComponent extends Component {
  constructor () {
    super();
  }
  render () {
    return (
      <div>
        <Shop />
        This is a game!
        <GridController />
      </div>
    );
  }
}

const mapToProps = obstruction({
});

export default withStyles(styles)(connect(mapToProps)(GameComponent));
