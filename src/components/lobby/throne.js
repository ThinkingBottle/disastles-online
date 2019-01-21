import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import obstruction from 'obstruction';
import { If, classNames } from 'react-extras';

import Typography from '@material-ui/core/Typography';

import bgThrone1 from './images/throne-1.png';
import bgThrone2 from './images/throne-2.png';
import bgThrone3 from './images/throne-3.png';
import bgThrone4 from './images/throne-4.png';
import bgThrone5 from './images/throne-5.png';
import bgThrone6 from './images/throne-6.png';
import bgThrone7 from './images/throne-7.png';
import bgThrone8 from './images/throne-8.png';
import bgThrone9 from './images/throne-9.png';
import bgThrone10 from './images/throne-10.png';
import bgNoSelection from './images/spectator.png';
import bgThroneBorder from './images/throneborder.png';
import bgThroneBorderActive from './images/throneborder-active.png';

const thrones = [
  bgThrone1,
  bgThrone2,
  bgThrone3,
  bgThrone4,
  bgThrone5,
  bgThrone6,
  bgThrone7,
  bgThrone8,
  bgThrone9,
  bgThrone10,
];

const styles = theme => ({
  root: {
    display: 'inline-block',
    width: 90,
    height: 61,
    background: 'url(' + bgThroneBorder + ') no-repeat',
    backgroundSize: '100% 100%',
    padding: 8,

    '&.clickable:hover': {
      background: 'url(' + bgThroneBorderActive + ') no-repeat',
      backgroundSize: '100% 100%',
    },
    '& img': {
      width: '100%',
      height: '100%',
    },
    '&.big': {
      width: 180,
      height: 121,
      padding: 16,
    }
  },
});

class ThroneRoom extends Component {
  render () {
    return (
      <div
        onClick={ this.props.onClick }
        className={ classNames(this.props.classes.root, {
          big: this.props.big,
          clickable: !!this.props.onClick
        }) } >
        <If
          condition={ !this.props.empty && !this.props.spectator }
          render={ ()=>
            <img src={ thrones[this.props.throne] } /> }
          />
        <If
          condition={ !!this.props.spectator }
          render={ ()=>
            <img src={ bgNoSelection } /> }
          />
      </div>
    );
  }
}

const mapToProps = obstruction({
  playerId: 'global.playerId',
  playerData: 'lobby.playerData',
});

export default withStyles(styles)(connect(mapToProps)(ThroneRoom));
