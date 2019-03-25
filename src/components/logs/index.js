import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import obstruction from 'obstruction';
import { classNames } from 'react-extras';

const styles = theme => ({
  root: {
    width: 360,
    fontSize: '9pt',
    fontWeight: 500,
    color: 'white',
    position: 'absolute',
    bottom: 340,
    right: 10,
    zIndex: 10,
    pointerEvents: 'none',
    textAlign: 'right',
  },
  log: {
    transition: 'opacity ease-out 1000ms',
    opacity: 1,

    '&.fade': {
      opacity: 0,
    }
  }
});

const Logs = (props) => (
  <div className={ classNames( props.classes.root ) }>
    {props.logs.map(log => (
      <p key={log.timestamp} className={ classNames( props.classes.log, { fade: log.fade } ) }>
        {log.message}
      </p>
    ))}
  </div>
);

const mapToProps = obstruction({
  logs: 'logs.logs',
});

export default withStyles(styles)(connect(mapToProps)(Logs));
