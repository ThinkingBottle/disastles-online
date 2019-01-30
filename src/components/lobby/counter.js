import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import obstruction from 'obstruction';

import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';

import bgLesser from './images/lesser1.png';
import bgLesserActive from './images/lesser1-active.png';
import bgGreater from './images/greater1.png';
import bgGreaterActive from './images/greater1-active.png';
import bgCenter from './images/smallbox.png';
import bgCenterActive from './images/smallbox-active.png';

const styles = theme => ({
  root: {
    position: 'relative',
    margin: 5,
    lineHeight: '32px',
    display: 'flex',
    flexDirection: 'row',
  },
  lesser: {
    width: 32,
    minWidth: 32,
    height: 32,
    minHeight: 32,
    padding: 0,
    backgroundImage: 'url(' + bgLesser + ')',
    backgroundSize: '100% 100%',
    '&:hover': {
      backgroundImage: 'url(' + bgLesserActive + ')',
    }
  },
  greater: {
    width: 32,
    minWidth: 32,
    height: 32,
    minHeight: 32,
    padding: 0,
    backgroundImage: 'url(' + bgGreater + ')',
    backgroundSize: '100% 100%',
    '&:hover': {
      backgroundImage: 'url(' + bgGreaterActive + ')',
    }
  },
  center: {
    width: 32,
    minWidth: 32,
    height: 32,
    padding: 0,
    backgroundImage: 'url(' + bgCenter + ')',
    backgroundSize: '100% 100%',

    '&:focus': {
      backgroundImage: 'url(' + bgCenterActive + ')',
    }
  },
  input: {
    color: 'white',
    textAlign: 'center',
    padding: 0,
  }
});

class Counter extends Component {
  constructor (props) {
    super(props);

    this.state = {
      count: props.value ? props.value : (props.default ? props.default : (props.min ? props.min : 0))
    };
  }
  updateValue (value) {
    if (this.props.min !== undefined) {
      value = Math.max(value, this.props.min);
    }
    if (this.props.max !== undefined) {
      value = Math.min(value, this.props.max);
    }
    if (value === this.getValue()) {
      return;
    }
    this.setState({
      count: value
    });
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  }
  getValue () {
    return this.props.value || this.state.count;
  }
  render () {
    var count = this.getValue();
    return (
      <div className={ this.props.classes.root }>
        <Button
          onClick={()=> this.updateValue(count - 1)}
          classes={{
            root: this.props.classes.lesser
          }}>
          &nbsp;
        </Button>
        <Input
          disableUnderline
          value={ count }
          classes={{
            root: this.props.classes.center,
            input: this.props.classes.input
          }}>
        </Input>
        <Button
          onClick={()=> this.updateValue(count + 1)}
          classes={{
            root: this.props.classes.greater
          }}>
          &nbsp;
        </Button>
      </div>
    );
  }
}

const mapToProps = obstruction({
});

export default withStyles(styles)(connect(mapToProps)(Counter));
