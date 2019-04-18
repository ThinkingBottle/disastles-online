import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import obstruction from 'obstruction';
import { classNames } from 'react-extras';

import API from '../../api';

const styles = theme => ({
  input: {
    background: 'none',
    border: 'none',
    color: 'white',
    textAlign: 'inherit',
    fontSize: 12,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: 500,
    margin: '0 0 6px',
    padding: 0,
    outline: 'none',
    width: '100%',

    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});

class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
    };

    this.handleGlobalKeyUp = this.handleGlobalKeyUp.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.setVisible = this.setVisible.bind(this);

    this.inputRef = React.createRef();
  }

  componentWillMount() {
    document.addEventListener('keyup', this.handleGlobalKeyUp);
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.handleGlobalKeyUp);
  }

  handleGlobalKeyUp (e) {
    const source = e.target || e.srcElement;
    if (source === document.body) {
      if (e.key === 'Enter') {
        this.setVisible(true);
        this.inputRef.current.focus();
      } else if (e.key === 'Escape') {
        this.setVisible(false);
        this.inputRef.current.blur();
      }
    }
  }

  handleKeyUp (e) {
    if (e.key === 'Escape') {
      this.setVisible(false);
      this.inputRef.current.blur();
    } else if (e.key === 'Enter') {
      const s = this.inputRef.current.value.trim();
      if (s) {
        API.send({ action: 'SendChatMessage', text: s });
      }
      this.inputRef.current.value = '';
    }
  }

  setVisible(visible) {
    this.setState({ visible });
    this.props.isVisibleHandler(visible);
  }

  render() {
    return (
      <input
        className={ classNames( this.props.classes.input, { visible: this.state.visible } ) }
        type="text"
        onKeyUp={ this.handleKeyUp }
        ref={ this.inputRef }
      />
    );
  }
}

const mapToProps = obstruction({
  playerNames: 'global.playerNames',
  you: 'global.playerId',
});

export default withStyles(styles)(connect(mapToProps)(Chat));
