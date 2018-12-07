import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import obstruction from 'obstruction';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import bgBase from './images/button.png';
import bgDark from './images/button-dark.png';
import bgActive from './images/button-active.png';

const styles = theme => ({
  root: {
    height: 35,
    width: 192,
    background: 'url(' + bgBase + ') no-repeat',

    ['&:active']: {
      background: 'url(' + bgActive + ') no-repeat'
    },
  },
  active: {
    background: 'url(' + bgActive + ') no-repeat'
  },
  dark: {
    background: 'url(' + bgDark + ') no-repeat'
  }
});

class DisastlesButton extends Component {
  constructor () {
    super();
  }
  render () {
    let props = obstruction({
      onClick: true,
    })(this.props)
    return (
      <Button {...props} classes={ {
          root: this.props.classes.root,
        } }>
        { this.props.children }
      </Button>
    );
  }
}

const mapToProps = obstruction({
});

export default withStyles(styles)(connect(mapToProps)(DisastlesButton));
