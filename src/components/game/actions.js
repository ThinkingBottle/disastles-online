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
import { clearActiveCard } from '../../actions/game';

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
    this.clearActiveCard = this.clearActiveCard.bind(this);
    this.renderRoomMarkWarning = this.renderRoomMarkWarning.bind(this);
  }

  componentWillReceiveProps (newProps) {
    let state = {
      actions: newProps.actions.filter((action) => {
        if (action.mandatory) {
          return true;
        }
        /* eslint-disable no-fallthrough */
        switch (action.action) {
          // not shown
          case 'UnmarkRooms':
          case 'AcceptSacrifice':
          case 'MarkRoom':
          // shown
          case 'SkipMultiChoice':
          case 'SkipText':
          case 'ChooseCard':
          case 'ConfirmMultistepEffect':
            return true;
          default:
            return false;
        }
        /* eslint-enable no-fallthrough */
      })
    };

    this.setState(state);
  }

  sendAction (action) {
    API.send(action);
  }

  clearActiveCard () {
    this.props.dispatch(clearActiveCard());
  }

  render () {
    if (this.props.activeCard) {
      return this.renderActiveCard();
    }
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
      let options = this.state.actions.filter((a) => a.action !== 'SkipText');
      if (options.text) {
        return this.renderMultiChoice(options, multiChoice);
      }
    }
    multiChoice = this.state.actions.filter((a) => a.action === 'ConfirmMultistepEffect')[0];
    if (multiChoice) {
      return this.renderConfirmDialog(multiChoice);
    }
    if (this.props.currentDisaster) {
      return this.renderDisaster();
    }
    return (
      <div className={ this.props.classes.root }>
        { this.state.actions.map(this.renderAction) }
      </div>
    );
  }

  renderActiveCard () {
    return (
      <ActionModal
        onClose={ this.clearActiveCard }
        >
        <Typography variant='h3'>
          Another player has activated a card
        </Typography>
          <br />
          <Card
            large
            card={ this.props.activeCard }
            />
      </ActionModal>
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

  renderConfirmDialog (actions) {
    return (
      <InfoBox>
        <Typography color="primary">
          When you are finished with this action, click this button.
        </Typography>
        <br />
        <DButton
          onClick={ partial(this.sendAction, actions) }
          >
          Action Complete
        </DButton>
      </InfoBox>
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
          default:
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
    var roomCount = 0;
    this.props.sacrifices.forEach((sac) => {
      if (sac.player === this.props.playerId) {
        roomCount = sac.damageDetails.taken;
      }
    });
    return (
      <Typography color="secondary">You must mark { roomCount } rooms for destruction!</Typography>
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
  playerId: 'global.playerId',
  actions: 'game.actions',
  currentDisaster: 'game.currentDisaster',
  activeCard: 'game.activeCard',
  sacrifices: 'game.sacrifices',
});

export default withStyles(styles)(connect(mapToProps)(ActionBar));
