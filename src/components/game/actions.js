import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import obstruction from 'obstruction';
import { partial } from 'ap';

import { If } from 'react-extras';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import Error from './error';
import DButton from './button';

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
    let state = {
      actions: newProps.actions.filter((action) => {
        switch (action.action) {
          case 'SkipText':
          case 'SkipTurn':
          case 'SkipMultiChoice':
          case 'UnmarkRooms':
          case 'AcceptSacrifice':
          case 'MarkRoom':
            return true;
          default:
            return false;
        }
      })
    };

    this.setState(state);
  }

  sendAction (action) {
    API.send(action);
  }

  render () {
    if (this.props.currentDisaster) {
      return this.renderDisaster();
    }
    return (
      <div>
        { this.state.actions.map(this.renderAction) }
      </div>
    );
  }

  renderDisaster () {
    let needsToMark = false;
    let canSubmit = false;
    let canReset = false;

    this.state.actions.forEach((action) => {
      switch (action.action) {
          case 'UnmarkRooms':
            canReset = action;
            break;
          case 'AcceptSacrifice':
            canSubmit = action;
            break;
          case 'MarkRoom':
            needsToMark = true;
            break;
      }
    });
    return (
      <Error>
        <If
          condition={ !!needsToMark }
          render={ this.renderRoomMarkWarning } />
        <Typography color="secondary">There's a disaster happening!</Typography>
        <If
          condition={ !!canReset }
          render={ () =>
              <React.Fragment>
                <br />
                <DButton
                  onClick={ partial(this.sendAction, canReset) }
                  >
                  Unmark Rooms
                </DButton>
              </React.Fragment> }
          />
        <If
          condition={ !!canSubmit }
          render={ () =>
              <React.Fragment>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <DButton
                  onClick={ partial(this.sendAction, canSubmit) }
                  dark>
                  Accept Sacrifices
                </DButton>
              </React.Fragment> }
          />
      </Error>
    );
  }

  renderRoomMarkWarning () {
    return (
      <Typography color="secondary">You must mark rooms for destruction!</Typography>
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
  currentDisaster: 'game.currentDisaster'
});

export default withStyles(styles)(connect(mapToProps)(ActionBar));
