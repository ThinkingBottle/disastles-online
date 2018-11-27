import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import obstruction from 'obstruction';
import { If } from 'react-extras';
import { partial } from 'ap';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';

import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';

import API from '../../api';

const styles = theme => ({
  root: {
  }
});

class LobbyView extends Component {
  constructor () {
    super();

    this.renderPlayerSlot = this.renderPlayerSlot.bind(this);
    this.takeSlot = this.takeSlot.bind(this);
  }

  componentWillReceiveProps (newProps) {
    console.log('props', newProps);
  }

  componentDidMount () {
    this.unlisten = API.events.onLobbyFailed(() => this.props.history.push('/lobby'));
    if (!this.props.lobbyId) {
      let paramId = this.props.match.params.id;
      console.log('We\'re not in a lobby yet!', paramId);
      API.joinLobby(paramId);
    }
  }

  componentWillUnmount () {
    this.unlisten();
  }

  async takeSlot (slot) {
    await API.takeSlot(slot)
  }

  render () {
    return (
      <div>
        <If condition={ !!this.props.lobbyId }
          render={ () =>
            <React.Fragment>
              <Typography variant="h3">{ this.props.lobbyId }</Typography>
              <Typography>You're in a lobby!</Typography>
              { this.props.players.map(this.renderPlayerSlot) }
              <br />
              <Button variant="contained">
                <If condition={ !this.props.isReady } render={ () =>
                  <React.Fragment>
                    <CloseIcon /> Not Ready
                  </React.Fragment>
                } />
                <If condition={ !!this.props.isReady } render={() =>
                  <React.Fragment>
                    <CheckIcon /> Ready!
                  </React.Fragment>
                } />
              </Button>
            </React.Fragment>
          } />
        <If condition={ !this.props.lobbyId }
          render={ () =>
            <React.Fragment>
              <br />
              <br />
              <center>
                <CircularProgress size={ 128 }/>
                <Typography variant="subheading">
                  Joining lobby...
                </Typography>
              </center>
            </React.Fragment>
          } />
      </div>
    );
  }

  renderPlayerSlot (player, slot) {
    if (!player) {
      return (
        <div key={ slot }>
          Player { slot + 1 }:
          <Button onClick={ partial(this.takeSlot, slot) }>Take slot</Button>
        </div>
      );
    } else {
      return (
        <div key={ slot }>
          Player { slot + 1 }: { player }
        </div>
      );
    }
  }
}

const mapToProps = obstruction({
  lobbyId: 'lobby.id',
  players: 'lobby.slots',
  isReady: 'lobby.isReady'
});

export default withStyles(styles)(connect(mapToProps)(LobbyView));
