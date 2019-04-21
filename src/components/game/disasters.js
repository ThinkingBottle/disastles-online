import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import obstruction from 'obstruction';
import { classNames } from 'react-extras';

import Card from './card';

import background from './images/disaster-tray.png';
import bgSlot from './images/disaster-background.png';
import bgConnecter from './images/disaster-connection.png';

const styles = theme => ({
  root: {
    position: 'absolute',
    height: 128,
    width: 576,
    bottom: 10,
    background: 'url(' + background + ') no-repeat',
    display: 'flex',
    paddingTop: 16,
    paddingLeft: 20
  },
  card: {
    height: 99,
    width: 81,
    background: 'url(' + bgSlot + ') left no-repeat',
    display: 'flex',
    alignItems: 'center',

    '& > .border': {
      height: 8,
      width: '100%'
    },
    '& > .border.visible': {
      background: 'url(' + bgConnecter + ') right no-repeat',
    }
  }
});

class Disasters extends Component {
  constructor () {
    super();

    this.renderDisaster = this.renderDisaster.bind(this);
  }
  render () {
    let styles = {
      right: (Math.min(5, this.props.disasters.length) * 81) - 500
    };

    return (
      <div className={ this.props.classes.root } style={styles} >
       { this.props.disasters.map(this.renderDisaster) }
      </div>
    );
  }

  renderDisaster (disaster, i) {
    return (
      <div key={ disaster } className={ this.props.classes.card }>
        <Card
          card={ disaster }
          height={ 99 }
          />
        <div
          className={ classNames('border', {
            visible: i + 1 < this.props.disasters.length
          }) } />
      </div>
    );
  }
}

const mapToProps = obstruction({
  disasters: 'game.disasters'
});

export default withStyles(styles)(connect(mapToProps)(Disasters));
