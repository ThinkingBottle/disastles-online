import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import obstruction from 'obstruction';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import API from '../../api';

const styles = theme => ({
  root: {
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
      <div>
        <Typography>This is a lobby view!</Typography>
        <Button onClick={ this.onNewGame } variant='outlined'>
          New Game
        </Button>
        <TextField
          id="lobby-id"
          label="Lobby ID"
          value={ this.state.lobbyId }
          onChange={this.handleChange('lobbyId')}
        />
        <Button onClick={ this.onJoinGame } variant='outlined'>
          Join Game
        </Button>
      </div>
    );
  }
}

const mapToProps = obstruction({
});

export default withStyles(styles)(connect(mapToProps)(LobbyMenu));
