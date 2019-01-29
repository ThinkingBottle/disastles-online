import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { partial } from 'ap';
import obstruction from 'obstruction';

import { clearDisasterModal } from '../../actions/game';

import Card from './card';
import Modal from '@material-ui/core/Modal';
import bgBottom from './images/disaster/bottom.png';
import bgMiddle from './images/disaster/middle.png';
import bgTop from './images/disaster/top.png';

import bgD from './images/disaster/d.png';
import bgI from './images/disaster/i.png';
import bgS1 from './images/disaster/s1.png';
import bgA from './images/disaster/a.png';
import bgS2 from './images/disaster/s2.png';
import bgT from './images/disaster/t.png';
import bgE from './images/disaster/e.png';
import bgR from './images/disaster/r.png';
import bgFrame from './images/disaster/dframe.png';

const SCALE = 2;

const styles = theme => ({
  root: {
    width: 1964/SCALE,
    height: 456/SCALE,
    margin: '0 auto',
    marginTop: '10%',

    '&:focus': {
      outline: 'none'
    },
  },
  bottom: {
    position: 'absolute',
    background: 'url(' + bgBottom + ') no-repeat',
    backgroundSize: '100% 100%',
    transition: 'all 4s ease-out',
    width: 1964/SCALE,
    height: 456/SCALE,
  },
  middle: {
    position: 'absolute',
    background: 'url(' + bgMiddle + ') no-repeat',
    backgroundSize: '100% 100%',
    transition: 'all 4s ease-out',
    width: 1964/SCALE,
    height: 456/SCALE
  },
  top: {
    position: 'absolute',
    background: 'url(' + bgTop + ') no-repeat',
    backgroundSize: '100% 100%',
    transition: 'all 4s ease-out',
    width: 1964/SCALE,
    height: 456/SCALE
  },
  content: {
    position: 'relative',
    display: 'flex',
    width: 1964/SCALE,
    height: 456/SCALE,

    '& > *': {
      position: 'absolute',
      transition: 'all 4s ease-out',
    },
    '& .d': {
      top: 100/SCALE,
      left: 240/SCALE,
      background: 'url(' + bgD + ') no-repeat',
      backgroundSize: '100% 100%',
      width: 219/SCALE,
      height: 217/SCALE,
    },
    '& .i': {
      top: 130/SCALE,
      left: 464/SCALE,
      background: 'url(' + bgI + ') no-repeat',
      backgroundSize: '100% 100%',
      width: 54/SCALE,
      height: 182/SCALE,
    },
    '& .s1': {
      top: 100/SCALE,
      left: 520/SCALE,
      background: 'url(' + bgS1 + ') no-repeat',
      backgroundSize: '100% 100%',
      width: 113/SCALE,
      height: 191/SCALE,
    },
    '& .a': {
      top: 106/SCALE,
      left: 600/SCALE,
      background: 'url(' + bgA + ') no-repeat',
      backgroundSize: '100% 100%',
      width: 166/SCALE,
      height: 177/SCALE,
    },
    '& .s2': {
      top: 100/SCALE,
      left: 740/SCALE,
      background: 'url(' + bgS2 + ') no-repeat',
      backgroundSize: '100% 100%',
      width: 147/SCALE,
      height: 218/SCALE,
    },
    '& .t': {
      top: 90/SCALE,
      left: 860/SCALE,
      background: 'url(' + bgT + ') no-repeat',
      backgroundSize: '100% 100%',
      width: 132/SCALE,
      height: 248/SCALE,
    },
    '& .e': {
      top: 90/SCALE,
      left: 950/SCALE,
      background: 'url(' + bgE + ') no-repeat',
      backgroundSize: '100% 100%',
      width: 128/SCALE,
      height: 208/SCALE,
    },
    '& .r': {
      top: 60/SCALE,
      left: 1080/SCALE,
      background: 'url(' + bgR + ') no-repeat',
      backgroundSize: '100% 100%',
      width: 185/SCALE,
      height: 286/SCALE,
    },
    '& .frame': {
      top: 0/SCALE,
      left: 1200/SCALE,
      width: 477/SCALE,
      height: 490/SCALE,
      transform: 'rotate(10deg)',

      '& .cover': {
        position: 'absolute',
        top: 0,
        left: 0,
        background: 'url(' + bgFrame + ') no-repeat',
        backgroundSize: '100% 100%',
        width: 477/SCALE,
        height: 490/SCALE,
      },
      '& .catastrophe': {
      },
      '& .damageStats': {
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        color: 'white',
        width: 80,
        textAlign: 'center',
        top: 276/SCALE,
        left: 234/SCALE,
        lineHeight: 52/SCALE + 'px',
      }
    },
  },
});

class DisasterAlert extends Component {
  constructor () {
    super();

    this.startAnimation = this.startAnimation.bind(this);
    this.startBackgroundAnimation = this.startBackgroundAnimation.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  closeModal () {
    console.log('dismiss disaster modal');
    this.props.dispatch(clearDisasterModal());
  }

  startBackgroundAnimation (layer, ref) {
    if (!ref) {
      return;
    }
    ref.style.transform = 'scale(' + layer + ')';
  }
  startAnimation (angle, ref) {
    if (!ref) {
      return;
    }
    let parent = ref.parentElement;
    let centerX = parent.offsetWidth / 2;
    let centerY = parent.offsetHeight / 2;
    let refCenterY = ref.offsetTop + (ref.offsetHeight / 2);
    let refCenterX = ref.offsetLeft + (ref.offsetWidth / 2);
    ref.style.top = (ref.offsetTop + (refCenterY - centerY) / 5) + 'px';
    ref.style.left = (ref.offsetLeft + (refCenterX - centerX) / 5) + 'px';
    ref.style.transform = 'rotate3d(0, 0, 1, ' + (Math.random() * 10 - 5 + angle) + 'deg) scale(1.2)';
  }

  render () {
    if (!this.props.data) {
      return [];
    }
    console.log(this.props.data);
    return (
      <Modal
        open
        onClose={ this.closeModal }
        >
        <div className={ this.props.classes.root }>
          <div ref={ partial(this.startBackgroundAnimation, 1) } className={ this.props.classes.bottom }>
          </div>
          <div ref={ partial(this.startBackgroundAnimation, 2) } className={ this.props.classes.middle }>
          </div>
          <div ref={ partial(this.startBackgroundAnimation, 3) } className={ this.props.classes.top }>
          </div>
          <div className={ this.props.classes.content }>
            <div ref={ partial(this.startAnimation, 0) } className='d'>
            </div>
            <div ref={ partial(this.startAnimation, 0) } className='i'>
            </div>
            <div ref={ partial(this.startAnimation, 0) } className='s1'>
            </div>
            <div ref={ partial(this.startAnimation, 0) } className='a'>
            </div>
            <div ref={ partial(this.startAnimation, 0) } className='s2'>
            </div>
            <div ref={ partial(this.startAnimation, 0) } className='t'>
            </div>
            <div ref={ partial(this.startAnimation, 0) } className='e'>
            </div>
            <div ref={ partial(this.startAnimation, 0) } className='r'>
            </div>
            <div ref={ partial(this.startAnimation, 10) } className='frame'>
              <Card
                skinny
                height={ 400/SCALE }
                style={{
                  position: 'relative',
                  top: 48/SCALE,
                  left: 106/SCALE,
                }}
                card={ this.props.data.card } />
              <div className='cover' />
              <div className='damageStats'>
                <div className='square'>{ this.props.data.damage.square }</div>
                <div className='cross'>{ this.props.data.damage.cross }</div>
                <div className='moon'>{ this.props.data.damage.moon }</div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

const mapToProps = obstruction({
  data: 'game.disasterModal',
});

export default withStyles(styles)(connect(mapToProps)(DisasterAlert));
