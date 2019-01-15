import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import obstruction from 'obstruction';

import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';

import API from '../../api';
import logoImage from './images/logo_large.png';
import backgroundImage from '../backgrounds/MenuBG.png';
import buttonImage from './images/button.png';
import buttonHoverImage from './images/button_hover.png';
import buttonActiveImage from './images/button_active.png';

import boxImage from './images/box.png';
import boxActiveImage from './images/box_active.png';

const styles = theme => ({
  root: {
    height: '100%',
    minHeight: '100%',
    paddingBottom: '10%',
    background: 'url(' + backgroundImage + ') no-repeat',
    backgroundSize: 'cover',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  textBox: {
    width: 192,
    height: 64,
    background: 'url(' + boxImage + ') no-repeat',
    padding: 20,
    marginBottom: 5
  },
  input: {
    color: 'white',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: 24
  },
  focused: {
    background: 'url(' + boxActiveImage + ') no-repeat',
  },
  button: {
    background: 'url(' + buttonImage + ') no-repeat',
    width: 192,
    height: 64,
    border: 0,
    borderRadius: 32,
    color: 'white',
    fontSize: '1.2em',

    '&:hover': {
      background: 'url(' + buttonHoverImage + ') no-repeat',
    },
    '&:active': {
      background: 'url(' + buttonActiveImage + ') no-repeat',
    }
  }
});

class LobbyMenu extends Component {
  constructor () {
    super();

    this.onNewGame = this.onNewGame.bind(this);
    this.onJoinGame = this.onJoinGame.bind(this);

    this.state = {
      lobbyId: ''
    };
  }
  async onNewGame () {
    console.log('Start new game or something...');

    var id = await API.createLobby();
    await API.joinLobby(id);

    this.props.history.push('/lobby/' + id);
  }
  async onJoinGame () {
    this.props.history.push('/lobby/' + this.state.lobbyId);
  }
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };
  render () {
    return (
      <div className={ this.props.classes.root }>
        <img src={ logoImage } />
        <br />
        <br />
        <Button
          onClick={ this.onNewGame }
          variant='outlined'
          classes={{
            root: this.props.classes.button
          }}
          >
          Create Lobby
        </Button>
        <br />
        <Input
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
        <Button
          onClick={ this.onJoinGame }
          variant='outlined'
          classes={{
            root: this.props.classes.button
          }}
          >
          Join Game
        </Button>
      </div>
    );
  }
}

const mapToProps = obstruction({
});

export default withStyles(styles)(connect(mapToProps)(LobbyMenu));
