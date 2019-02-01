import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import obstruction from 'obstruction';
import { interval } from 'thyming';

import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    position: 'absolute',
    left: 10,
    top: 48,
    height: 64,
    width: 64,
    borderRadius: 32,
    background: '#333333cc',
  },
  progress: {
    margin: -1,
  },
  text: {
    color: 'white',
    position: 'absolute',
    margin: -1,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    fontSize: '28px',
    lineHeight: '64px',
    textAlign: 'center',
  }
});

class TurnTimer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      currentTimeout: this.currentTimeout(props)
    };

    this.updateTime = this.updateTime.bind(this);
  }

  updateTime () {
    let value = this.currentTimeout(this.props);

    if (value !== this.state.currentTimeout) {
      this.setState({
        currentTimeout: value
      });
    }
  }

  currentTimeout (props) {
    if (props.turnTimeout === null) {
      return null;
    }
    return props.turnTimeout - Math.floor((Date.now() - props.timeoutStart) / 1000)
  }

  componentWillMount () {
    this.stopTimer = interval(this.updateTime, 1000);
  }

  componentWillUnmount () {
    if (this.stopTimer) {
      this.stopTimer = null;
      this.stopTimer();
    }
  }

  render () {
    if (this.state.currentTimeout === null) {
      return [];
    }
    let percent = (this.props.turnTimeout - this.state.currentTimeout) / this.props.turnTimeout * 100;
    return (
      <div className={ this.props.classes.root }>
        <CircularProgress
          classes={{
            root: this.props.classes.progress
          }}
          size={66}
          variant="static"
          value={ percent } />
        <span className={ this.props.classes.text }>
          { this.state.currentTimeout }
        </span>
      </div>
    );
  }
}

const mapToProps = obstruction({
  turnTimeout: 'game.turnTimeout',
  timeoutStart: 'game.timeoutStart',
});

export default withStyles(styles)(connect(mapToProps)(TurnTimer));
