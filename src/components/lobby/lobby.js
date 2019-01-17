import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import obstruction from 'obstruction';
import { If } from 'react-extras';
import { partial } from 'ap';
import Collector from 'collect-methods';
import { timeout } from 'thyming';

import Box from '../box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';

import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';

import API from '../../api';
import bgBackground from '../backgrounds/MenuBG.png';
import bgLaunchGame from './images/launch-game.png';
import bgLaunchGameActive from './images/launch-game-active.png';
import bgLaunchGameHover from './images/launch-game-hover.png';
import bgButton from './images/button.png';
import bgButtonHover from './images/button-hover.png';
import bgButtonActive from './images/button-active.png';
import bgLogo from './images/logo-small.png';
import bgBox from './images/box.png';
import bgBoxActive from './images/box-active.png';
import bgTopLeftBox from './images/settings-tl.png';
import bgTopRightBox from './images/settings-tr.png';
import bgBottomLeftBox from './images/settings-bl.png';
import bgBottomRightBox from './images/settings-br.png';
import bgColorBox from './images/settings-color.png';
import bgLeftBox from './images/settings-left.png';
import bgRightBox from './images/settings-right.png';
import bgHeaderLeftBox from './images/settings-top-left.png';
import bgHeaderRightBox from './images/settings-top-right.png';
import bgHeaderMiddleBox from './images/settings-top-middle.png';
import bgTopBox from './images/settings-top.png';
import bgBottomBox from './images/settings-bottom.png';

import bgTopLeftBox2 from './images/settings2-tl.png';
import bgTopRightBox2 from './images/settings2-tr.png';
import bgBottomLeftBox2 from './images/settings2-bl.png';
import bgBottomRightBox2 from './images/settings2-br.png';
import bgColorBox2 from './images/settings2-color.png';
import bgLeftBox2 from './images/settings2-left.png';
import bgRightBox2 from './images/settings2-right.png';
import bgHeaderLeftBox2 from './images/settings2-top-left.png';
import bgHeaderRightBox2 from './images/settings2-top-right.png';
import bgHeaderMiddleBox2 from './images/settings2-top-middle.png';
import bgTopBox2 from './images/settings2-top.png';
import bgBottomBox2 from './images/settings2-bottom.png';

import bgTopLeftBox3 from './images/settings3-tl.png';
import bgTopRightBox3 from './images/settings3-tr.png';
import bgBottomLeftBox3 from './images/settings3-bl.png';
import bgBottomRightBox3 from './images/settings3-br.png';
import bgColorBox3 from './images/settings3-color.png';
import bgLeftBox3 from './images/settings3-left.png';
import bgRightBox3 from './images/settings3-right.png';
import bgTopBox3 from './images/settings3-top.png';
import bgBottomBox3 from './images/settings3-bottom.png';

const styles = theme => ({
  root: {
    height: '100%',
    minHeight: '100%',
    background: 'url(' + bgBackground + ') no-repeat',
    backgroundSize: 'cover',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    padding: 20,
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
  launchGame: {
    background: 'url(' + bgLaunchGame + ') no-repeat',
    backgroundSize: '100% 100%',
    width: 272,
    height: 80,

    '&:hover': {
      bgLaunchGameHover
    },
    '&:hover': {
      bgLaunchGameActive
    }
  },
  button: {
    background: 'url(' + bgButtonActive + ') no-repeat',
    width: 192,
    height: 64,
    border: 0,
    borderRadius: 32,
    marginLeft: 30,
    marginRight: 20,
    color: 'white',
    fontSize: '1.2em',

    '&:hover': {
      background: 'url(' + bgButtonHover + ') no-repeat',
    },
    '&:active': {
      background: 'url(' + bgButton + ') no-repeat',
    }
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

  async componentDidMount () {
    this.unlisten = Collector();
    this.unlisten(API.events.onLobbyFailed(() => this.props.history.push('/lobby')));
    this.unlisten(API.events.onGameJoined(() => this.props.history.push('/game/' + this.props.reconnectionToken)));
    this.unlisten(timeout(() => API.setName(this.state.name), 1000));
    if (!this.props.lobbyId) {
      let paramId = this.props.match.params.id;
      console.log('We\'re not in a lobby yet!', paramId, this.state.name);
      await API.joinLobby(paramId);
      API.finishedLoading();
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
    var difficulty = 'Difficult';

    return (
      <div className={ this.props.classes.root }>
        <div className={ this.props.classes.row }>
          <a href="/">
            <img src={ bgLogo } />
          </a>
          <Box
            half
            topLeft={ bgTopLeftBox }
            topRight={ bgTopRightBox }
            bottomLeft={ bgBottomLeftBox }
            bottomRight={ bgBottomRightBox }
            color={ bgColorBox }
            left={ bgLeftBox }
            right={ bgRightBox }
            top={ bgTopBox }
            bottom={ bgBottomBox }
            height={120}
            margin={ -12 }
            >
            <Button
              disabled={ !this.props.allReady }
              onClick={ this.startGame }
              classes={{
                root: this.props.classes.launchGame
              }}>
              &nbsp;
            </Button>
            <Button
              onClick={ null }
              classes={{
                root: this.props.classes.button
              }} >
              How To Play
            </Button>
          </Box>
        </div>
        <If condition={ !!this.props.lobbyId }
          render={ () =>
            <React.Fragment>
              <div className={ this.props.classes.row }>
                <Box
                  half
                  topLeft={ bgTopLeftBox }
                  topRight={ bgTopRightBox }
                  bottomLeft={ bgBottomLeftBox }
                  bottomRight={ bgBottomRightBox }
                  color={ bgColorBox }
                  left={ bgLeftBox }
                  right={ bgRightBox }
                  top={ bgTopBox }
                  bottom={ bgBottomBox }
                  headerLeft={ bgHeaderLeftBox }
                  headerRight={ bgHeaderRightBox }
                  headerMiddle={ bgHeaderMiddleBox }
                  header='Game Settings'
                  >

                  <Box
                    half
                    topLeft={ bgTopLeftBox2 }
                    topRight={ bgTopRightBox2 }
                    bottomLeft={ bgBottomLeftBox2 }
                    bottomRight={ bgBottomRightBox2 }
                    color={ bgColorBox2 }
                    left={ bgLeftBox2 }
                    right={ bgRightBox2 }
                    top={ bgTopBox2 }
                    bottom={ bgBottomBox2 }
                    headerLeft={ bgHeaderLeftBox2 }
                    headerRight={ bgHeaderRightBox2 }
                    headerMiddle={ bgHeaderMiddleBox2 }
                    header={ 'Difficulty: ' + difficulty }
                    >
                    <Box
                      half
                      topLeft={ bgTopLeftBox3 }
                      topRight={ bgTopRightBox3 }
                      bottomLeft={ bgBottomLeftBox3 }
                      bottomRight={ bgBottomRightBox3 }
                      color={ bgColorBox3 }
                      left={ bgLeftBox3 }
                      right={ bgRightBox3 }
                      top={ bgTopBox3 }
                      bottom={ bgBottomBox3 }
                      >
                      Disaster settings!
                    </Box>
                  </Box>
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
                </Box>
              </div>
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
                  Joining lobby......
                </Typography>
              </center>
            </React.Fragment> } />
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
  reconnectionToken: 'global.reconnectionToken',
  lobbyId: 'lobby.id',
  players: 'lobby.slots',
  isReady: 'lobby.isReady',
  allReady: 'lobby.allReady',
  name: 'global.name',
  playerNames: 'global.playerNames'
});

export default withStyles(styles)(connect(mapToProps)(LobbyView));
