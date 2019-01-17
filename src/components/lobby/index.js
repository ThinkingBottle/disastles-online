import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { classNames } from 'react-extras';
import obstruction from 'obstruction';

import Button from '../game/button';
import Box from '../box';
import Background from './background';
import Input from '@material-ui/core/Input';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import API from '../../api';

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
  }
});

class LobbyMenu extends Component {
  constructor () {
    super();

    this.onNewGame = this.onNewGame.bind(this);
    this.onJoinGame = this.onJoinGame.bind(this);

    this.state = {
      lobbyId: '',
      expanded: false
    };
  }
  async onNewGame () {
    console.log('Start new game or something...');

    var id = await API.createLobby();
    await API.joinLobby(id);

    this.props.history.push('/lobby/' + id);
  }
  async onJoinGame () {
    if (this.state.expanded) {
      this.props.history.push('/lobby/' + this.state.lobbyId);
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
        <img src={ logoImage } />
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
          <Tooltip
            title='Coming soon'
            >
            <Button
              onClick={ ()=> {
                this.setState({
                  matchmaking: true
                });
              }}
              disabled={ this.state.matchmaking }
              blue
              className={ classNames(this.props.classes.button, this.props.classes.matchmaking) }
              >
              { this.state.matchmaking ? 'Coming Soon!' : 'Matchmaking' }
            </Button>
          </Tooltip>
        </Box>
      </Background>
    );
  }
}

const mapToProps = obstruction({
});

export default withStyles(styles)(connect(mapToProps)(LobbyMenu));
