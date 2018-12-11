import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import obstruction from 'obstruction';
import { partial } from 'ap';

import { If } from 'react-extras';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Card from './card';

import InfoBox from './info';
import DButton from './button';
import ActionModal from './modal';

import API from '../../api';

const styles = theme => ({
  root: {
  },
  skip: {
    color: 'white',
    fontSize: 24,
    marginLeft: 10,
    float: 'right'
  },
  cardHolder: {
    display: 'flex'
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
        if (action.mandatory) {
          return true;
        }
        switch (action.action) {
          case 'SkipMultiChoice':
          case 'SkipText':
          case 'SkipTurn':
          case 'UnmarkRooms':
          case 'AcceptSacrifice':
          case 'MarkRoom':
          case 'ChooseCard':
          case 'DiscardCard':
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
    let mandatoryAction = this.state.actions.filter((a) => a.mandatory)[0];
    if (mandatoryAction) {
      return this.renderMandatoryAction(mandatoryAction);
    }
    let multiChoice = this.state.actions.filter((a) => a.action === 'SkipMultiChoice')[0];
    if (multiChoice) {
      return this.renderMultiChoice(this.state.actions.filter((a) => a.mandatory !== undefined), multiChoice);
    }
    multiChoice = this.state.actions.filter((a) => a.action === 'SkipText')[0];
    if (multiChoice) {
      return this.renderMultiChoice(this.state.actions.filter((a) => a.action !== 'SkipText'), multiChoice);
    }
    if (this.props.currentDisaster) {
      return this.renderDisaster();
    }
    return (
      <div>
        { this.state.actions.map(this.renderAction) }
      </div>
    );
  }

  renderMandatoryAction (action) {
      return (
        <ActionModal
          onClose={ partial(this.sendAction, action) }
          >
          <Typography variant='h3'>
            A card has activated
          </Typography>
          <br />
          <Card
            large
            card={ action.card }
            />
        </ActionModal>
      );
  }

  renderMultiChoice (actions, dismiss) {
    console.log('multichoice:', actions);
    return (
      <ActionModal
        onClose={ partial(this.sendAction, dismiss) }
        >
        <If condition={ actions.length > 1} render={ () =>
          <Typography variant='h3'>
            Multi-choice action
          </Typography> } />
        <If condition={ actions.length === 1} render={ () =>
          <Typography variant='h3'>
            Optional action
          </Typography> } />
        <div className={ this.props.classes.cardHolder }>
          { actions.map((action, i) => {
            return (
              <Card
                key={ i }
                large={ actions.length < 2 }
                skinny
                card={ action.card }
                onClick={ partial(this.sendAction, action) }
                />
            );
          }) }
        </div>
        <br />
        <span className={ this.props.classes.skip }>Skip</span>
      </ActionModal>
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
      <InfoBox error>
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
      </InfoBox>
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
