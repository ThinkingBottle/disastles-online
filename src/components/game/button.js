import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import obstruction from 'obstruction';
import { classNames } from 'react-extras';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import bgBase from './images/button.png';
import bgDark from './images/button-dark.png';
import bgActive from './images/button-active.png';

import bgBlueBase from './images/button-blue.png';
import bgBlueDark from './images/button-blue-dark.png';
import bgBlueActive from './images/button-blue-active.png';

const styles = theme => ({
  root: {
    height: 35,
    width: 192,
    background: 'url(' + bgBase + ') no-repeat',

    '&:hover': {
      background: 'url(' + bgActive + ') no-repeat'
    },
    '&:active': {
      background: 'url(' + bgDark + ') no-repeat',
      color: 'white'
    },
  },
  'blue': {
    height: 26,
    minHeight: 26,
    width: 26 * 192 / 34,
    fontSize: '10pt',

    background: 'url(' + bgBlueBase + ') no-repeat',
    backgroundSize: '100% 100%',

    '&:hover': {
      background: 'url(' + bgBlueActive + ') no-repeat',
      backgroundSize: '100% 100%',
    },
    '&:active, &.dark, &.dark:hover': {
      background: 'url(' + bgBlueDark + ') no-repeat',
      backgroundSize: '100% 100%',
      color: 'white'
    },
  }
});

class DisastlesButton extends Component {
  constructor () {
    super();
  }
  render () {
    let props = obstruction({
      onClick: true,
      disabled: true,
    })(this.props)
    return (
      <Button {...props} classes={ {
          root: classNames({
            [this.props.classes.blue]: this.props.blue,
            [this.props.classes.root]: !this.props.blue,
            dark: this.props.dark
          })
        } }>
        { this.props.children }
      </Button>
    );
  }
}

const mapToProps = obstruction({
});

export default withStyles(styles)(connect(mapToProps)(DisastlesButton));
