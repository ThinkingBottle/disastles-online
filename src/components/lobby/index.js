import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { classNames, If } from 'react-extras';
import obstruction from 'obstruction';

import Button from '../game/button';
import Box from '../box';
import MusicPlayer from '../music-player';
import SellStuff from '../shill';
import Background from './background';
import PlayNowButton from './play-now-button';
import Input from '@material-ui/core/Input';
import Tooltip from '@material-ui/core/Tooltip';

import API from '../../api';
import Sound from '../../sound';

import logoImage from './images/logo-large.png';
import boxImage from './images/box.png';
import boxActiveImage from './images/box-active.png';
import bgTopLeftBox from './images/settings-tl.png';
import bgTopRightBox from './images/settings-tr.png';
import bgBottomLeftBox from './images/settings-bl.png';
import bgBottomRightBox from './images/settings-br.png';
import bgColorBox from './images/settings-color.png';
import bgLeftBox from './images/settings-left.png';
import bgRightBox from './images/settings-right.png';
import bgTopBox from './images/settings-top.png';
import bgBottomBox from './images/settings-bottom.png';
import bgDiscord from '../images/discord-white.png';

const styles = theme => ({
  root: {
    height: '100%',
    minHeight: '100%',
    paddingBottom: '10%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  textBox: {
    position: 'absolute',
    width: 192,
    height: 32,
    background: 'url(' + boxImage + ') no-repeat',
    backgroundSize: '100% 100%',
    padding: 1,
    margin: 0,
    '& input': {
      height: 30,
      padding: 0,
      paddingLeft: 9,
      letterSpacing: 3
    }
  },
  input: {
    color: 'white',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: 16
  },
  focused: {
    background: 'url(' + boxActiveImage + ') no-repeat',
    backgroundSize: '100% 100%',
  },
  button: {
    width: 192,
    height: 32,
    marginBottom: 10,
  },
  matchmaking: {
    position: 'absolute',
    marginBottom: 0,
    bottom: 0
  },
  discord: {
    height: '100%',
    position: 'absolute',
    left: 20,
    top: 20,
  },
  discordButton: {
    background: 'url(' + bgDiscord + ') no-repeat',
    backgroundSize: (800 / 4) + 'px ' + (272 / 4) + 'px',
    backgroundPosition: 'center center',
    width: 800 / 4,
    height: 272 / 4,
    cursor: 'pointer',
    '&:hover': {
      boxShadow: '0px 0px 5px 0px #ffffff99',
    }
  }
});

class LobbyMenu extends Component {
  constructor () {
    super();

    this.onNewGame = this.onNewGame.bind(this);
    this.onJoinGame = this.onJoinGame.bind(this);

    this.state = {
      lobbyId: '',
      expanded: false,
      showDiscord: false,
    };
  }
  componentWillMount () {
    document.documentElement.className = 'noscroll';
  }
  componentWillReceiveProps (newProps) {
    if (newProps.lobbyId) {
      this.props.history.push('/lobby/' + newProps.lobbyId);
    }
  }
  async onNewGame () {
    console.log('Start new game or something...');
    Sound.sfx.playSound('positive');

    var id = await API.createLobby();
    await API.joinLobby(id);

    this.props.history.push('/lobby/' + id);
  }
  async onJoinGame () {
    if (this.state.expanded) {
      this.props.history.push('/lobby/' + this.state.lobbyId);
      Sound.sfx.playSound('positive');
    } else {
      this.setState({
        expanded: true
      });
    }
  }
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };
  render () {
    return (
      <Background rootClass={ this.props.classes.root }>
        <MusicPlayer />
        <SellStuff />
        <img src={ logoImage } alt="logo" />
        <br />
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
          height={ 180 + (this.state.expanded ? 42 : 0) }
          style={{
            width: 192,
            transition: 'height 0.2s'
          }}
          >

          <PlayNowButton />
          <Button
            onClick={ this.onNewGame }
            blue
            className={ this.props.classes.button }
            >
            Create Lobby
          </Button>
          <br />
          <Button
            onClick={ this.onJoinGame }
            blue
            className={ this.props.classes.button }
            >
            Join Game
          </Button>
          <div style={{
            opacity: this.state.expanded ? 1 : 0,
            transition: 'opacity 0.5s'
          }}>
            <Input
              disabled={ !this.state.expanded }
              placeholder='Enter Code'
              disableUnderline
              id="lobby-id"
              label="Lobby ID"
              classes={{
                root: this.props.classes.textBox,
                focused: this.props.classes.focused,
                input: this.props.classes.input,
              }}
              value={ this.state.lobbyId }
              onChange={this.handleChange('lobbyId')}
            />
          </div>
        </Box>
        <div className={ this.props.classes.discord }>
          <If condition={ this.state.showDiscord }
            render={ () => <iframe title="discord" src="https://discordapp.com/widget?id=466201397252325376&theme=dark" width="350" height="90%" allowtransparency="true" frameBorder="0"></iframe> } />
          <If condition={ !this.state.showDiscord }
            render={ () =>
              <div
              onClick={() => this.setState({ showDiscord: true }) }
              className={ this.props.classes.discordButton } /> } />
        </div>
      </Background>
    );
  }
}

const mapToProps = obstruction({
  lobbyId: 'lobby.id',
  busStopNextTimestamp: 'lobby.busStopNextTimestamp',
});

export default withStyles(styles)(connect(mapToProps)(LobbyMenu));
