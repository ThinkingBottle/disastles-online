import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import obstruction from 'obstruction';

import Typography from '@material-ui/core/Typography';

import API from '../../api';

import GridController from './grid';
import Shop from './shop';
import ActionBar from './actions';
import Minimap from './minimap';

import backgroundImage1 from '../backgrounds/BG1.png';
import backgroundImage2 from '../backgrounds/BG2.png';
import backgroundImage3 from '../backgrounds/BG3.png';
import backgroundImage4 from '../backgrounds/BG4.png';
import backgroundImage5 from '../backgrounds/BG5.png';

const backgroundImage = [
  backgroundImage1,
  backgroundImage2,
  backgroundImage3,
  backgroundImage4,
  backgroundImage5
][~~(Math.random() * 5)];

const styles = theme => ({
  root: {
    width: '100%',
    minHeight: '100%',
    backgroundImage: 'url(' + backgroundImage + ')',
    backgroundSize: 'cover'
  }
});

class GameComponent extends Component {
  constructor () {
    super();
  }

  componentWillMount () {
    if (!this.props.inGame) {
      API.reconnect(this.props.match.params.id);
    }
  }

  render () {
    return (
      <div className={ this.props.classes.root }>
        <Shop />
        <ActionBar />
        This is a game!
        <GridController />
        <Minimap />
      </div>
    );
  }
}

const mapToProps = obstruction({
  inGame: 'game.inGame',
});

export default withStyles(styles)(connect(mapToProps)(GameComponent));
