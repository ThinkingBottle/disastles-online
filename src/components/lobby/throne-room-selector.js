import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import obstruction from 'obstruction';
import { If } from 'react-extras';

import API from '../../api';

import ThroneRoom from './throne';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Popover from '@material-ui/core/Popover';

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
import bgDropdown from './images/dropdown.png';
import bgDropdownActive from './images/dropdown-active.png';

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
  },
  downArrow: {
    position: 'relative',
    top: -10,
    background: 'url(' + bgDropdown + ') no-repeat',
    backgroundSize: '100% 100%',
    width: 32,
    height: 32,
    minWidth: 32,
    minHeight: 32,

    '&:hover': {
      background: 'url(' + bgDropdownActive + ') no-repeat',
      backgroundSize: '100% 100%',
    }
  },
  paper: {
    width: 210,
    background: 'black',
    padding: 10,
  }
});

class ThroneRoomSelector extends Component {
  constructor (props) {
    super();

    this.state = {
      selection: props.playerData[props.playerId] ? props.playerData[props.playerId].color : null,
      expanded: false,
    };

    this.rootEl = React.createRef();

    this.toggleMenu = this.toggleMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.renderThroneOption = this.renderThroneOption.bind(this);
  }
  componentWillReceiveProps (props) {
    if (props.playerData[props.playerId] && props.playerData[props.playerId].color !== this.state.selection) {
      this.setState({
        selection: props.playerData[props.playerId].color
      });
    }
  }

  toggleMenu () {
    this.setState({
      expanded: !this.state.expanded
    });
  }

  closeMenu () {
    this.setState({
      expanded: false
    });
  }

  selectThrone = (throne) => () => {
    API.setColor(throne);
    this.closeMenu();
  }

  render () {
    console.log('The selection is', this.state.selection);
    return (
      <div ref={ this.rootEl } >
        <ThroneRoom
          onClick={ this.toggleMenu }
          throne={ this.state.selection }
          spectator={ this.state.selection === null }
          />
          <Button
            onClick={ this.toggleMenu }
            classes={{
              root: this.props.classes.downArrow
            }}>
            &nbsp;
          </Button>
        <Popover
          open={ this.state.expanded }
          onClose={ this.closeMenu }
          anchorEl={ this.rootEl.current }
          classes={{ paper: this.props.classes.paper }}
          >
          { this.renderThrones() }
        </Popover>
      </div>
    );
  }

  renderThrones () {
    return (
      <Grid container>
        { thrones.map(this.renderThroneOption)}
      </Grid>
    );
  }
  renderThroneOption (throne, i) {
    var isClickable = false;
    this.props.actions.forEach(function (action) {
      if (action.action === 'SetColor' && action.color === i) {
        isClickable = true;
      }
    });
    return (
      <Grid key={ i } item xs={6}>
        <ThroneRoom
          throne={ i }
          onClick={ isClickable ? this.selectThrone(i) : null }
          />
      </Grid>
    );
  }
}

const mapToProps = obstruction({
  playerId: 'global.playerId',
  playerData: 'lobby.playerData',
  actions: 'global.actions',
});

export default withStyles(styles)(connect(mapToProps)(ThroneRoomSelector));
