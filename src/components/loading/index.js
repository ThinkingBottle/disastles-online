import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import Modal from '@material-ui/core/Modal';

import Button from '../game/button';
import Box from '../box';
import HourGlass from './hourglass';

import bgTopLeftBox from '../lobby/images/settings-tl.png';
import bgTopRightBox from '../lobby/images/settings-tr.png';
import bgBottomLeftBox from '../lobby/images/settings-bl.png';
import bgBottomRightBox from '../lobby/images/settings-br.png';
import bgColorBox from '../lobby/images/settings-color.png';
import bgLeftBox from '../lobby/images/settings-left.png';
import bgRightBox from '../lobby/images/settings-right.png';
import bgTopBox from '../lobby/images/settings-top.png';
import bgBottomBox from '../lobby/images/settings-bottom.png';

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
  content: {
    position: 'relative',
    textAlign: 'center',
  },
  hourglass: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  message: {
    lineHeight: '64px',
  },
  button: {
    width: 192,
    height: 32,
    display: 'block',
    margin: '12px auto 0',
  },
});

class Loading extends Component {
  render () {
    return (
      <Modal
        open={ this.props.open }
        disableBackdropClick={false}
        BackdropProps={{
          className: this.props.classes.backdrop,
        }}
        hideBackdrop={ this.props.hideBackdrop }
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
            height={ this.props.buttonText ? 160 : 96 }
            style={{
              width: 360,
              transition: 'height 0.2s'
            }}
            >
            <div className={ this.props.classes.content }>
              <div className={ this.props.classes.message }>{ this.props.message }</div>
              <div className={ this.props.classes.hourglass }>
                {this.props.loading && (
                  <HourGlass />
                )}
              </div>
              {this.props.buttonText && (
                <Button
                  blue
                  className={ this.props.classes.button }
                  onClick={ () => {
                    if (this.props.buttonAction) {
                      this.props.buttonAction();
                    }
                  } }
                >
                  { this.props.buttonText }
                </Button>
              )}
            </div>
          </Box>
        </div>
      </Modal>
    );
  }
}

export default withStyles(styles)(Loading);
