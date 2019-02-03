import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import obstruction from 'obstruction';
import { If } from 'react-extras';
import { partial } from 'ap';
import Collector from 'collect-methods';
import { timeout } from 'thyming';
import copy from 'clipboard-copy';
import window from 'global/window';

import Box from '../box';
import MusicPlayer from '../music-player';
import DisastlesInput from '../input';
import SellStuff from '../shill';
import Background from './background';
import Counter from './counter';
import PlayerList from './player-list';
import ThroneRoomSelector from './throne-room-selector';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';

import API from '../../api';
import Sound from '../../sound';
import bgLaunchGame from './images/launch-game.png';
import bgLaunchGameActive from './images/launch-game-active.png';
import bgLaunchGameHover from './images/launch-game-hover.png';
import bgLaunchGameDisabled from './images/launch-game-disabled.png';
import bgButton from './images/button.png';
import bgButtonHover from './images/button-hover.png';
import bgButtonActive from './images/button-active.png';
import bgLogo from './images/logo-small.png';
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
    minHeight: 800,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    padding: 20,
    lineHeight: '32px',
    '&.nopadding': {
      padding: 0
    }
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    width: '33%',
    marginRight: 20,
  },
  launchGame: {
    background: 'url(' + bgLaunchGame + ') no-repeat',
    backgroundSize: '100% 100%',
    width: 272,
    height: 80,

    '&:hover': {
      bgLaunchGameHover,
      bgLaunchGameActive
    }
  },
  disabled: {
    background: 'url(' + bgLaunchGameDisabled + ') no-repeat',
    backgroundSize: '100% 100%',
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
  },
  keyField: {
    textAlign: 'right',
    color: 'white'
  },
  checkbox: {
    padding: 0,
  }
});

class LobbyView extends Component {
  constructor (props) {
    super();

    this.state = {
      name: props.name,
      disasterCount: this.getSettings('DisastersCount', props.settings),
      catastropheCount: this.getSettings('CatastrophesCount', props.settings),
      seed: this.getSettings('Seed', props.settings) || '',
      turnTimers: this.getSettings('EnableTurnTimer', props.settings),
    };
    this.unlisten = Collector();

    this.renderPlayerSlot = this.renderPlayerSlot.bind(this);
    this.takeSlot = this.takeSlot.bind(this);
    this.toggleReady = this.toggleReady.bind(this);
    this.startGame = this.startGame.bind(this);
    this.updateDisasterCount = this.updateDisasterCount.bind(this);
    this.updateCatastropheCount = this.updateCatastropheCount.bind(this);
    this.toggleTurnTimers = this.toggleTurnTimers.bind(this);
    this.updateSeed = this.updateSeed.bind(this);
    this.leaveLobby = this.leaveLobby.bind(this);
    this.updateName = this.updateName.bind(this);
    this.showHowToPlay = this.showHowToPlay.bind(this);
  }

  async componentWillReceiveProps (newProps) {
    console.log('props', newProps);
    var newState = {};
    if (newProps.name !== this.props.name) {
      newState.name = newProps.name;
    }

    let disasterCount = this.getSettings('DisastersCount', newProps.settings);
    if (disasterCount !== this.state.disasterCount) {
      newState.disasterCount = disasterCount;
    }
    let catastropheCount = this.getSettings('CatastrophesCount', newProps.settings);
    if (catastropheCount !== this.state.catastropheCount) {
      newState.catastropheCount = catastropheCount;
    }
    let turnTimers = this.getSettings('EnableTurnTimer', newProps.settings);
    if (turnTimers !== this.state.turnTimers) {
      newState.turnTimers = turnTimers;
    }
    let seed = this.getSettings('Seed', newProps.settings);
    if (seed !== this.state.seed) {
      newState.seed = seed;
    }

    if (Object.keys(newState).length) {
      this.setState(newState);
    }

    if (this.props.lobbyId !== newProps.lobbyId) {
      this.hasLoaded = false;
      if (!newProps.lobbyId) {
        this.props.history.push('/lobby');
      }
    }

    if (this.props.playerData[this.props.playerId] && this.props.playerData[this.props.playerId].status === 'Loading' && !this.hasLoaded) {
      this.hasLoaded = true;
      await Sound.init();
      API.finishedLoading();
    }
  }

  async componentDidMount () {
    this.unlisten(API.events.onLobbyFailed(() => this.props.history.push('/lobby')));
    this.unlisten(API.events.onGameJoined(() => this.props.history.push('/game/' + this.props.reconnectionToken)));
    this.unlisten(timeout(() => API.setName(this.state.name), 1000));
    if (!this.props.lobbyId) {
      let paramId = this.props.match.params.id;
      console.log('We\'re not in a lobby yet!', paramId, this.state.name);
      await API.joinLobby(paramId);
    }
    if (this.props.playerData[this.props.playerId] && this.props.playerData[this.props.playerId].status === 'Loading' && !this.hasLoaded) {
      this.hasLoaded = true;
      await Sound.init();
      API.finishedLoading();
    }
    document.documentElement.className = '';
  }
  componentWillUnmount () {
    this.unlisten();
  }

  showHowToPlay () {
    window.open('http://disastles.com/about', '_blank');
  }

  async takeSlot (slot) {
    await API.takeSlot(slot)
  }

  toggleReady () {
    API.setReady(!this.props.isReady);
  }

  leaveLobby () {
    this.props.history.push('/');
    API.ws.reconnect();
  }

  startGame () {
    API.startGame();
  }

  getSettings (name, settings = this.props.settings) {
    return settings.reduce(function (memo, val) {
      if (memo) {
        return memo;
      }
      if (val.key === name) {
        return memo = val.value;
      }
      return null;
    }, null);
  }

  getBounds (name) {
    return this.props.actions.reduce(function (memo, val) {
      if (val.key === name) {
        return memo = val.allowed;
      }
      return memo;
    }, {});
  }

  isHost () {
    return this.props.playerId === this.props.host;
  }

  updateDisasterCount (newCount) {
    console.log('Setting new diaster count!', newCount);
    if (!this.isHost()) {
      console.log('not host');
      return;
    }
    this.setState({
      disasterCount: newCount
    });
    API.changeSetting('DisastersCount', newCount);
  }

  updateCatastropheCount (newCount) {
    console.log('Setting new diaster count!', newCount);
    if (!this.isHost()) {
      console.log('not host');
      return;
    }
    this.setState({
      catastropheCount: newCount
    });
    API.changeSetting('CatastrophesCount', newCount);
  }
  toggleTurnTimers (event, value) {
    this.setState({
      turnTimers: value
    });
    API.changeSetting('EnableTurnTimer', value);
  }
  updateSeed (event) {
    let value = event.target.value;
    let bounds = this.getBounds('Seed');
    if (value.length > bounds.maxLength) {
      value = value.substr(0, bounds.maxLength);
    }
    this.setState({
      seed: value
    });
    if (this.seedTimer) {
      this.seedTimer();
    }
    this.seedTimer = timeout(() => {
      API.changeSetting('Seed', this.state.seed);
    }, 200);

    this.unlisten(this.seedTimer);
  }

  updateName (event) {
    var name = event.target.value;
    console.log(name);
    this.setState({
      name
    });
    if (this.cancelName) {
      this.cancelName();
    }
    this.cancelName = timeout(function () {
      API.setName(name);
      this.cancelName = null;
    });
  }

  render () {
    // var difficulty = 'Difficult';

    var disasterBounds = this.getBounds('DisastersCount');
    var catastropheBounds = this.getBounds('CatastrophesCount');

    return (
      <Background rootClass={ this.props.classes.root }>
        <MusicPlayer />
        <SellStuff />
        <Grid container>
          <Grid item xs={4}>
            <a href="/">
              <img src={ bgLogo } alt='background' />
            </a>
          </Grid>
          <Grid item xs={6}>
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
              width={555}
              margin={ -12 }
              >
              <Button
                disabled={ !this.props.allReady }
                onClick={ this.startGame }
                classes={{
                  root: this.props.classes.launchGame,
                  disabled: this.props.classes.disabled,
                }}>
                &nbsp;
              </Button>
              <Button
                onClick={ this.showHowToPlay }
                classes={{
                  root: this.props.classes.button
                }} >
                How To Play
              </Button>
            </Box>
          </Grid>
          <Grid item xs={2}>
          </Grid>
        </Grid>
        <br />
        <br />
        <If condition={ !!this.props.lobbyId }
          render={ () =>
            <Grid container spacing={32}>
              <Grid item xs={12} md={6} lg={4}>
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
                    style={{
                      paddingTop: 20
                    }}
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
                      header={ 'Difficulty' }
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
                        margin={ -12 }
                        style={{
                          color: 'white'
                        }}
                        >
                        <Grid container zeroMinWidth spacing={16}>
                          <Grid item xs={ 8 } className={ this.props.classes.keyField } >
                            Disaster count:
                          </Grid>
                          <Grid item xs={ 4 }>
                            <Counter
                              disabled={ !this.isHost() }
                              onChange={ this.updateDisasterCount }
                              min={ disasterBounds.min }
                              max={ disasterBounds.max }
                              value={ this.state.disasterCount }
                              />
                          </Grid>
                          <Grid item xs={ 8 } className={ this.props.classes.keyField }>
                            Catastrophe count:
                          </Grid>
                          <Grid item xs={ 4 }>
                            <Counter
                              disabled={ !this.isHost() }
                              onChange={ this.updateCatastropheCount }
                              min={ catastropheBounds.min }
                              max={ catastropheBounds.max }
                              value={ this.state.catastropheCount }
                              />
                          </Grid>
                        </Grid>
                      </Box>
                    </Box>
                    <br />
                    <Grid container zeroMinWidth spacing={16}>
                      <Grid item xs={ 6 } className={ this.props.classes.keyField }>
                        Turn timers:
                      </Grid>
                      <Grid item xs={ 6 }>
                        <Checkbox
                          classes={{
                            root: this.props.classes.checkbox
                          }}
                          disabled={ !this.isHost() }
                          checked={ this.state.turnTimers }
                          onChange={ this.toggleTurnTimers } />
                      </Grid>
                      <Grid item xs={ 6 } className={ this.props.classes.keyField }>
                        Game seed:
                      </Grid>
                      <Grid item xs={ 6 }>
                        <DisastlesInput
                          disabled={ !this.isHost() }
                          value={ this.state.seed || '' }
                          onChange={ this.updateSeed }
                          />
                      </Grid>
                      <Grid item xs={ 6 } className={ this.props.classes.keyField }>
                        Lobby link:
                      </Grid>
                      <Grid item xs={ 6 }>
                        <DisastlesInput
                          onFocus={ ()=> copy('https://game.disastles.com/lobby/' + this.props.lobbyId) }
                          value={ 'https://game.disastles.com/lobby/' + this.props.lobbyId } />
                      </Grid>
                    </Grid>
                  </Box>
                  <br />
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
                    header='Player Settings'
                    style={{
                      paddingTop: 20
                    }}
                    >
                    <Grid container zeroMinWidth spacing={16}>
                      <Grid item xs={ 6 } className={ this.props.classes.keyField }>
                        Player name:
                      </Grid>
                      <Grid item xs={ 6 }>
                        <DisastlesInput
                          onChange={ this.updateName }
                          value={this.state.name} />
                      </Grid>
                      <Grid item xs={ 6 } className={ this.props.classes.keyField }>
                        Throne room (color):
                      </Grid>
                      <Grid item xs={ 6 }>
                        <ThroneRoomSelector />
                      </Grid>
                      <Grid item xs={ 1 }>
                      </Grid>
                      <Grid item xs={ 5 }>
                        <Button
                          onClick={ this.toggleReady }
                          classes={{
                            root: this.props.classes.button
                          }} >
                          <If condition={ !this.props.isReady } render={ () =>
                            <React.Fragment>
                              <CheckIcon /> Ready Up!
                            </React.Fragment>
                          } />
                          <If condition={ !!this.props.isReady } render={() =>
                            <React.Fragment>
                              <CloseIcon /> Unready
                            </React.Fragment>
                          } />
                        </Button>
                      </Grid>
                      <Grid item xs={ 5 }>
                        <Button
                          onClick={ this.leaveLobby }
                          classes={{
                            root: this.props.classes.button
                          }} >
                          Leave lobby
                        </Button>
                      </Grid>
                      <Grid item xs={ 1 }>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
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
                      header='Players'
                      style={{
                        paddingTop: 20
                      }}
                      >
                  <PlayerList toggleReady={this.toggleReady} />
                  </Box>
                </Grid>
                </Grid> } />
        <If condition={ !this.props.lobbyId }
          render={ () =>
            <React.Fragment>
              <br />
              <br />
              <center>
                <CircularProgress size={ 128 }/>
                <Typography variant="subtitle1">
                  Joining lobby......
                </Typography>
              </center>
            </React.Fragment> } />
      </Background>
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
  playerData: 'lobby.playerData',
  isReady: 'lobby.isReady',
  allReady: 'lobby.allReady',
  playerId: 'global.playerId',
  actions: 'global.actions',
  name: 'global.name',
  playerNames: 'global.playerNames',
  settings: 'lobby.settings',
  host: 'lobby.host',
});

export default withStyles(styles)(connect(mapToProps)(LobbyView));
/*

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
                      header='Spectators'
                      style={{
                        paddingTop: 20
                      }}
                      >
                      <PlayerList spectator />
                  </Box>
*/
