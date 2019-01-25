import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import obstruction from 'obstruction';
import { classNames, If } from 'react-extras';

import ThroneRoom from './throne';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import bgSeperator from './images/seperator.png';
import bgBoot from './images/boot.png';
import bgBootActive from './images/boot-active.png';
import bgBootDisabled from './images/boot-disabled.png';
import bgLoading from './images/state-loading.png';
import bgNotReady from './images/state-notready.png';
import bgReady from './images/state-ready.png';

const styles = theme => ({
  root: {
  },
  row: {
    display: 'flex',
    height: 61,
    lineHeight: '61px',
    textAlign: 'center',
    background: 'url(' + bgSeperator + ') no-repeat',
    backgroundPosition: 'center bottom',
  },
  boot: {
    background: 'url(' + bgBoot + ') no-repeat',
    backgroundSize: '100% 100%',
    width: 32,
    minWidth: 32,
    height: 32,
    minHeight: 32,

    '&:hover': {
      background: 'url(' + bgBootActive + ') no-repeat',
      backgroundSize: '100% 100%',
    }
  },
  disabled: {
    background: 'url(' + bgBootDisabled + ') no-repeat',
    backgroundSize: '100% 100%',
    width: 32,
    minWidth: 32,
    height: 32,
    minHeight: 32,
  },
  item: {
    flex: '0 0',
    textAlign: 'center',

    '&.status': {
      width: 190,
      minWidth: 190,
      marginRight: 50
    },

    '&.shrink': {
      flex: '0 1',
    },
    '&.grow': {
      flex: '1 0',
    },

    '&.empty': {
      color: 'grey',
    },
    '&.empty:after': {
      content: '[empty slot]',
    },

    '&.color0': {
      color: 'white'
    },
    '&.color1': {
      color: 'white'
    },
    '&.color2': {
      color: 'white'
    },
    '&.color3': {
      color: 'white'
    },
    '&.color4': {
      color: 'white'
    },
    '&.color5': {
      color: 'white'
    },
    '&.color6': {
      color: 'white'
    },
    '&.color7': {
      color: 'white'
    },
    '&.color8': {
      color: 'white'
    },
    '&.color9': {
      color: 'white'
    },
  },
  status: {
    width: 95,
    height: 32,
    marginTop: 16,

    '&.Loading': {
      background: 'url(' + bgLoading + ') no-repeat',
      backgroundSize: '100% 100%',
    },
    '&.Unready': {
      background: 'url(' + bgNotReady + ') no-repeat',
      backgroundSize: '100% 100%',
    },
    '&.Ready': {
      background: 'url(' + bgReady + ') no-repeat',
      backgroundSize: '100% 100%',
    },
  }
});

class PlayerList extends Component {
  constructor () {
    super();

    this.renderPlayer = this.renderPlayer.bind(this);
  }
  render () {
    var playerList = Object.keys(this.props.playerData)
      .filter((player) => this.props.playerData[player].spectator === !!this.props.spectator);
    while (playerList.length < 5) {
      playerList.push(null);
    }
    return (
      <div className={ this.props.classes.root }>
        { playerList.map(this.renderPlayer) }
      </div>
    );
  }
  renderPlayer (player, i) {
    if (player) {
      console.log(player);
    }

    let playerData = this.props.playerData[player];

    if (!playerData) {
      return this.renderEmptyPlayer();
    }

    return (
      <div key={ i } className={ this.props.classes.row }>
        <div className={ this.props.classes.item }>
          <Button
            classes={{
              root: this.props.classes.boot,
              disabled: this.props.classes.disabled,
            }}>
            &nbsp;
          </Button>
        </div>
        <div className={ this.props.classes.item }>
          <ThroneRoom
            throne={ playerData.color }
            />
        </div>
        <div className={ classNames(this.props.classes.item, 'grow', 'color' + playerData.color) }>
          { this.props.playerNames[player] }
        </div>
        <div className={ classNames(this.props.classes.item, 'status') }>
          <div className={ classNames(this.props.classes.status, playerData.status)}>
          </div>
        </div>
      </div>
    );
  }

  renderEmptyPlayer (i) {
    return (
      <div key={ i } className={ this.props.classes.row }>
        <div className={ this.props.classes.item }>
          <Button
            disabled
            classes={{
              root: this.props.classes.boot,
              disabled: this.props.classes.disabled,
            }}>
            &nbsp;
          </Button>
        </div>
        <If
          condition={ !this.props.spectator }
          render={ ()=>
            <div className={ this.props.classes.item }>
              <ThroneRoom
                empty
                />
            </div> } />
        <div className={ classNames(this.props.classes.item, 'grow', 'empty') }>
          [empty slot]
        </div>
        <div className={ classNames(this.props.classes.item, 'status') }>
          <div className={ classNames(this.props.classes.status, 'none')}>
          </div>
        </div>
      </div>
    );
  }
}

const mapToProps = obstruction({
  playerData: 'lobby.playerData',
  playerNames: 'global.playerNames',
  host: 'lobby.host',
  playerId: 'global.playerId',
});

export default withStyles(styles)(connect(mapToProps)(PlayerList));
