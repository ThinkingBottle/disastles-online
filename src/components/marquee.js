import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { If } from 'react-extras';

const FPS = 20;
const STEP = 1;
const TIMEOUT = 1 / FPS * 1000;

class Marquee extends Component {
  constructor(props) {
    super(props)
    this.state = {
      animatedWidth: 0,
      overflowWidth: 0
    }

    this.rootEl = React.createRef();
    this.textEl = React.createRef();

    this.handleMouseEnter = this.handleMouseEnter.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
  }

  componentDidMount() {
    this._measureText();

    if (this.props.hoverToStop) {
      this._startAnimation();
    }
  }

  componentDidUpdate() {
    this._measureText();

    if (this.props.hoverToStop) {
      this._startAnimation();
    }
  }

  componentWillUnmount() {
    clearTimeout(this._marqueeTimer);
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.text.length != nextProps.text.length) {
      this.setState({
        animatedWidth: 0
      });
    }
  }

  handleMouseEnter() {
    if (this.props.hoverToStop) {
      clearTimeout(this._marqueeTimer);
    } else if (this.state.overflowWidth > 0) {
      this._startAnimation();
    }
  }

  handleMouseLeave() {
    if (this.props.hoverToStop && this.state.overflowWidth > 0) {
      this._startAnimation();
    } else {
      clearTimeout(this._marqueeTimer);
      this.setState({
        animatedWidth: 0
      });
    }
  }

  render() {
    const style = {
      'position': 'relative',
      'right': this.state.animatedWidth,
      'whiteSpace': 'nowrap',
      marginRight: 10
    };

    if (this.state.overflowWidth < 0) {
      return (
        <div className={`ui-marquee ${this.props.className}`} ref={ this.rootEl } style={{overflow: 'hidden'}}>
          <span ref={ this.textEl } style={style} title={this.props.text}>{this.props.text}</span>
          <If
            condition={ !!this.props.double }
            render={ () =>
              <span ref={ this.textEl } style={style} title={this.props.text}>
                { this.props.text }
              </span> } />
        </div>
      );
    }
    else {
      return (
        <div className={`ui-marquee ${this.props.className}`} ref={ this.rootEl } style={{overflow: 'hidden'}}
             onMouseEnter={this.handleMouseEnter}
             onMouseLeave={this.handleMouseLeave}>
          <span ref={ this.textEl } style={style} title={this.props.text}>{this.props.text}</span>
          <If
            condition={ !!this.props.double }
            render={ () =>
              <span ref={ this.textEl } style={style} title={this.props.text}>
                { this.props.text }
              </span> } />
        </div>
      );
    }
  }

  _startAnimation() {
    clearTimeout(this._marqueeTimer);
    const isLeading = this.state.animatedWidth === 0;
    const timeout = isLeading ? this.props.leading : TIMEOUT;

    const animate = () => {
      const { overflowWidth, containerWidth, textWidth } = this.state;
      let animatedWidth = this.state.animatedWidth + STEP;
      const isRoundOver = animatedWidth > (textWidth + 10);

      if (isRoundOver) {
        if (this.props.loop) {
          animatedWidth = 0
        } else {
          return;
        }
      }

      if (isRoundOver && this.props.trailing) {
        this.setTimeout(() => {
          this.setState({
            animatedWidth
          });

          this.setTimeout(animate, TIMEOUT);
        }, this.props.trailing);
      }
      else {
        this.setState({
          animatedWidth
        });

        this.setTimeout(animate, TIMEOUT);
      }
    };

    this.setTimeout(animate, timeout);
  }

  _measureText() {
    const container = this.rootEl.current;
    const node = this.textEl.current;

    if (container && node) {
      const containerWidth = container.offsetWidth;
      const textWidth = node.offsetWidth;
      const overflowWidth = textWidth - containerWidth;

      if (overflowWidth !== this.state.overflowWidth) {
        this.setState({
          overflowWidth,
          textWidth,
          containerWidth
        });
      }
    }
  }
  setTimeout (fn, time) {
    if (this._marqueeTimer) {
      clearTimeout(this._marqueeTimer);
      this._marqueeTimer = false;
    }
    this._marqueeTimer = setTimeout(fn, time);
  }
}

Marquee.defaultProps = {
  text: '',
  hoverToStop: false,
  loop: false,
  leading: 0,
  trailing: 0
}

Marquee.propTypes = {
  text: PropTypes.string,
  hoverToStop: PropTypes.bool,
  loop: PropTypes.bool,
  leading: PropTypes.number,
  trailing: PropTypes.number,
  className: PropTypes.string
}

export default Marquee;
