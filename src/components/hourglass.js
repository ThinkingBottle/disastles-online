import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import obstruction from 'obstruction';
import { classNames } from 'react-extras';

import Modal from '@material-ui/core/Modal';

import Box from './box';

import bgTopLeftBox from './lobby/images/settings-tl.png';
import bgTopRightBox from './lobby/images/settings-tr.png';
import bgBottomLeftBox from './lobby/images/settings-bl.png';
import bgBottomRightBox from './lobby/images/settings-br.png';
import bgColorBox from './lobby/images/settings-color.png';
import bgLeftBox from './lobby/images/settings-left.png';
import bgRightBox from './lobby/images/settings-right.png';
import bgTopBox from './lobby/images/settings-top.png';
import bgBottomBox from './lobby/images/settings-bottom.png';

const styles = theme => ({
  root: {
    position: 'absolute',
    minHeight: 130,
    minWidth: 130,
    top: '35%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    margin: '0 auto',
    borderRadius: 16,
    padding: 16,
    color: 'white',
    '&:focus': {
      outline: 'none',
    },
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
});

class HourGlass extends Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <Modal
        open
        disableBackdropClick={false}
        BackdropProps={{
          className: this.props.classes.backdrop,
        }}
        >
        <div className={ this.props.classes.root }>
          <Box
            fourth
            topLeft={ bgTopLeftBox }
            topRight={ bgTopRightBox }
            bottomLeft={ bgBottomLeftBox }
            bottomRight={ bgBottomRightBox }
            color={ bgColorBox }
            left={ bgLeftBox }
            right={ bgRightBox }
            top={ bgTopBox }
            bottom={ bgBottomBox }
            height={ 90 }
            style={{
              width: 192,
              transition: 'height 0.2s'
            }}
            >
            <div>{ this.props.message }</div>
          </Box>
        </div>
      </Modal>
    );
  }
}

const mapToProps = obstruction({
});

export default withStyles(styles)(connect(mapToProps)(HourGlass));
