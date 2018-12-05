import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import obstruction from 'obstruction';
import { partial } from 'ap';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import API from '../../api';

const styles = theme => ({
  root: {
  }
});

class ActionBar extends Component {
  constructor () {
    super();

    this.state = {
      actions: []
    };

    this.sendAction = this.sendAction.bind(this);
    this.renderAction = this.renderAction.bind(this);
  }

  componentWillReceiveProps (newProps) {
    console.log('actions for actions', newProps.actions);
    this.setState({
      actions: newProps.actions.filter((action) => {
        switch (action.action) {
          case 'SkipText':
          case 'SkipTurn':
          case 'SkipMultiChoice':
          case 'UnmarkRooms':
          case 'AcceptSacrifice':
            return true;
          default:
            return false;
        }
      })
    });
  }

  sendAction (action) {
    API.send(action);
  }

  render () {
    return (
      <div>
        { this.state.actions.map(this.renderAction) }
      </div>
    );
  }

  renderAction (action) {
    return (
      <Button key={ action.action } variant="contained" onClick={ partial(this.sendAction, action)}>
        { action.action }
      </Button>
    );
  }
}

const mapToProps = obstruction({
  actions: 'game.actions',
});

export default withStyles(styles)(connect(mapToProps)(ActionBar));
