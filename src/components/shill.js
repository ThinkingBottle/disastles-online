import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import obstruction from 'obstruction';
import { classNames } from 'react-extras';

import Button from '@material-ui/core/Button';

import bgBackground from './images/buygame.png';
import bgBackgroundActive from './images/buygame-active.png';
import bgX from './images/buygame-x.png';
import bgXActive from './images/buygame-x-active.png';
import bgXHover from './images/buygame-x-hover.png';

const styles = theme => ({
  root: {
    position: 'absolute',
    right: -500,
    bottom: 20,
    transition: 'right 0.5s',

    '&.expanded': {
      right: 0,
    }
  },
  background: {
    background: 'url(' + bgBackground + ') no-repeat',
    backgroundSize: '100% 100%',
    display: 'block',
    width: 384,
    height: 320,
    cursor: 'pointer',
    '&:hover': {
      background: 'url(' + bgBackgroundActive + ') no-repeat',
      backgroundSize: '100% 100%',
    }
  },
  close: {
    background: 'url(' + bgX + ') no-repeat',
    backgroundSize: '100% 100%',
    minHeight: 35,
    height: 35,
    minWidth: 29,
    width: 29,
    fontSize: 5,
    position: 'absolute',
    top: 10,
    right: 10,
    borderRadius: 16,

    '&:hover': {
      background: 'url(' + bgXHover + ') no-repeat',
      backgroundSize: '100% 100%',
    },
    '&:active': {
      background: 'url(' + bgXActive + ') no-repeat',
      backgroundSize: '100% 100%',
    },
  }
});

class SellThugAim extends Component {
  constructor () {
    super();

    this.state = {
      expanded: true
    };

    this.closeDialog = this.closeDialog.bind(this);
  }
  closeDialog (event) {
    this.setState({
      expanded: false
    });

    return event.preventDefault();
  }
  render () {
    return (
      <div className={ classNames(this.props.classes.root, this.state) } >
        <a
          href='https://www.disastles.com/buy-the-game/disastles'
          target='_target'
          className={ this.props.classes.background }>
          <Button
            classes={{
              root: this.props.classes.close
            }}
            onClick={ this.closeDialog }
            >
            &nbsp;
          </Button>
        </a>
      </div>
    );
  }
}

const mapToProps = obstruction({
});

export default withStyles(styles)(connect(mapToProps)(SellThugAim));
