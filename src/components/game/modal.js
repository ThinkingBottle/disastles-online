import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { classNames } from 'react-extras';

import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';

import bgTopLeft from './images/modal-info-tl.png';
import bgTopRight from './images/modal-info-tr.png';
import bgBottomLeft from './images/modal-info-bl.png';
import bgBottomRight from './images/modal-info-br.png';
import bgColor from './images/modal-info-color.png';
import bgLeft from './images/modal-info-left.png';
import bgRight from './images/modal-info-right.png';
import bgTop from './images/modal-info-top.png';
import bgBottom from './images/modal-info-bottom.png';
import bgTopLeftInfo from './images/modal-info-tl.png';
import bgTopRightInfo from './images/modal-info-tr.png';
import bgBottomLeftInfo from './images/modal-info-bl.png';
import bgBottomRightInfo from './images/modal-info-br.png';
import bgColorInfo from './images/modal-info-color.png';
import bgLeftInfo from './images/modal-info-left.png';
import bgRightInfo from './images/modal-info-right.png';
import bgTopInfo from './images/modal-info-top.png';
import bgBottomInfo from './images/modal-info-bottom.png';
import bgClose from './images/close.png';

const styles = theme => ({
  root: {
    position: 'absolute',
    minHeight: 130,
    minWidth: 130,
    background: 'url(' + bgColor + ')',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    margin: '0 auto',
    borderRadius: 64,
    padding: 64,
    '&.info': {
      background: 'url(' + bgColorInfo + ')',
    },
    '&:focus': {
      outline: 'none'
    }
  },
  bottomLeft: makeCorner(bgBottomLeft, bgBottomLeftInfo, 'bottom', 'left'),
  bottomRight: makeCorner(bgBottomRight, bgBottomRightInfo, 'bottom', 'right'),
  topLeft: makeCorner(bgTopLeft, bgTopLeftInfo, 'top', 'left'),
  topRight: makeCorner(bgTopRight, bgTopRightInfo, 'top', 'right'),
  left: makeEdge(bgLeft, bgLeftInfo, 'left'),
  right: makeEdge(bgRight, bgRightInfo, 'right'),
  top: makeEdge(bgTop, bgTopInfo, 'top'),
  bottom: makeEdge(bgBottom, bgBottomInfo, 'bottom'),

  button: {
    minWidth: 41,
    width: 41,
    minHeight: 41,
    height: 41,
    float: 'right',
    background: 'url(' + bgClose + ') no-repeat',
    padding: 0,
    margin: 0,
  }
});

function makeCorner (background, backgroundInfo, y, x) {
  return {
    position: 'absolute',
    zIndex: 1,
    height: 64,
    width: 64,
    background: 'url(' + background + ') no-repeat',
    [y]: 0,
    [x]: 0,
    '&.info': {
      background: 'url(' + backgroundInfo + ') no-repeat',
    }
  };
}

function makeEdge (background, backgroundInfo, type) {
  let isVertical = (type === 'top' || type === 'bottom');
  return {
    position: 'absolute',
    zIndex: 1,
    height: isVertical ? 64 : 'calc(100% - 128px)',
    width: isVertical ? 'calc(100% - 128px)' : 64,
    background: 'url(' + background + ') repeat-' + (isVertical ? 'x' : 'y'),
    [type]: 0,
    '&.info': {
      background: 'url(' + backgroundInfo + ') repeat-' + (isVertical ? 'x' : 'y'),
    }
  };
}

class CardModal extends Component {
  render () {
    return (
      <Modal
        open={ this.props.open }
        onClose={ this.props.onClose }
        container={ this.props.container }
        >
        <div className={ classNames(this.props.classes.root, {
          info: !this.props.error
        }) }>
          <div className={ classNames(this.props.classes.topLeft, {
            info: !this.props.error
          }) }>
          </div>
          <div className={ classNames(this.props.classes.topRight, {
            info: !this.props.error
          }) }>
          </div>
          <div className={ classNames(this.props.classes.bottomLeft, {
            info: !this.props.error
          }) }>
          </div>
          <div className={ classNames(this.props.classes.bottomRight, {
            info: !this.props.error
          }) }>
          </div>
          <div className={ classNames(this.props.classes.left, {
            info: !this.props.error
          }) }>
          </div>
          <div className={ classNames(this.props.classes.right, {
            info: !this.props.error
          }) }>
          </div>
          <div className={ classNames(this.props.classes.top, {
            info: !this.props.error
          }) }>
          </div>
          <div className={ classNames(this.props.classes.bottom, {
            info: !this.props.error
          }) }>
          </div>
          <div className={ classNames(this.props.classes.content, {
            info: !this.props.error
          }) }>
            { this.props.children }
            { this.props.noclose ? [] :
              <Button
                onClick={ this.props.onClose }
                classes={ {
                  root: this.props.classes.button
                } }
                >&nbsp;
                </Button>
              }
          </div>
        </div>
      </Modal>
    );
  }
}

export default withStyles(styles)(CardModal);
