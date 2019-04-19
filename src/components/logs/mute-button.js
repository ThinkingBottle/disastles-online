import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import obstruction from 'obstruction';
import { classNames } from 'react-extras';

import API from '../../api';

import bgChat from '../images/chat.png';
import bgChatMuted from '../images/chat-muted.png';

const styles = theme => ({
  chat: {
    width: 24,
    height: 20,
    marginTop: 22,
    background: 'url(' + bgChat + ') no-repeat',
    backgroundSize: '100% 100%',
    cursor: 'pointer',

    '&.muted': {
      background: 'url(' + bgChatMuted + ') no-repeat',
      backgroundSize: '100% 100%',
    },

    '&.ingame': {
      marginTop: 4,
      marginLeft: 4,
      filter: 'invert(1)',
    },
  },
  whitespace: {
    width: 24,
    height: 20,
    marginTop: 22,

    '&.ingame': {
      marginTop: 4,
      marginLeft: 4,
    },
  },
});

class MuteButton extends Component {
  constructor (props) {
    super(props);

    this.toggleMute = this.toggleMute.bind(this);
  }

  toggleMute (player) {
    if (this.props.mutedPlayers.indexOf(player) > -1) {
      API.unmutePlayer(player);
    } else {
      API.mutePlayer(player);
    }
  }

  render () {
    const { player, you } = this.props;

    if (player === you || !player) {
      return (
        <div className={ classNames(
          this.props.classes.whitespace,
          { ingame: this.props.ingame },
        ) } />
      );
    }

    return (
      <div
        className={ classNames(
          this.props.classes.chat,
          { muted: this.props.mutedPlayers.indexOf(player) > -1 },
          { ingame: this.props.ingame },
        ) }
        onClick={ () => this.toggleMute(player) }
      />
    );
  }
}

const mapToProps = obstruction({
  you: 'global.playerId',
  mutedPlayers: 'logs.mutedPlayers',
});

export default withStyles(styles)(connect(mapToProps)(MuteButton));
