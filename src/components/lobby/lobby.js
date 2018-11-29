import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import obstruction from 'obstruction';
import { If } from 'react-extras';
import { partial } from 'ap';
import Collector from 'collect-methods';
import { timeout } from 'thyming';

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
  constructor (props) {
    super();

    this.state = {
      name: props.name
    };

    this.renderPlayerSlot = this.renderPlayerSlot.bind(this);
    this.takeSlot = this.takeSlot.bind(this);
    this.toggleReady = this.toggleReady.bind(this);
    this.startGame = this.startGame.bind(this);
  }

  componentWillReceiveProps (newProps) {
    console.log('props', newProps);
    if (newProps.name !== this.props.name) {
      this.setState({
        name: newProps.name
      });
    }
  }

  componentDidMount () {
    this.unlisten = Collector();
    this.unlisten(API.events.onLobbyFailed(() => this.props.history.push('/lobby')));
    this.unlisten(API.events.onGameStarting(() => this.props.history.push('/game/' + this.props.lobbyId)));
    this.unlisten(timeout(() => API.setName(this.state.name), 1000));
    if (!this.props.lobbyId) {
      let paramId = this.props.match.params.id;
      console.log('We\'re not in a lobby yet!', paramId, this.state.name);
      API.joinLobby(paramId);
    }
  }

  componentWillUnmount () {
    this.unlisten();
  }

  async takeSlot (slot) {
    await API.takeSlot(slot)
  }

  toggleReady () {
    API.setReady(!this.props.isReady);
  }

  startGame () {
    API.startGame();
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
              <Button variant="contained" onClick={ this.toggleReady }>
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
              <If condition={ !!this.props.allReady } render={() =>
                <Button variant="contained" onClick={ this.startGame }>
                  Start Game!
                </Button>
              } />
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
      var name = this.props.playerNames[player] || player;
      return (
        <div key={ slot }>
          Player { slot + 1 }: { name }
        </div>
      );
    }
  }
}

const mapToProps = obstruction({
  lobbyId: 'lobby.id',
  players: 'lobby.slots',
  isReady: 'lobby.isReady',
  allReady: 'lobby.allReady',
  name: 'global.name',
  playerNames: 'global.playerNames'
});

export default withStyles(styles)(connect(mapToProps)(LobbyView));
