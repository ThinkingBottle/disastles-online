import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import obstruction from 'obstruction';
import { classNames } from 'react-extras';
import windowSize from 'react-window-size';

import Typography from '@material-ui/core/Typography';

import background from './images/minimap.png';
import emptyCard from './images/outline-empty.png';
import throneRoom from './images/outline-throne.png';
import effectRoom from './images/outline-bolt-inactive.png';
import vaultRoom from './images/outline-circle-inactive.png';
import effectRoomActive from './images/outline-bolt-active.png';
import vaultRoomActive from './images/outline-circle-active.png';
import btnExpanded from './images/minimap-collapse.png';
import btnExpandedHover from './images/minimap-collapse-highlight.png';
import btnExpandedActive from './images/minimap-collapse-active.png';
import btnCollapsed from './images/minimap-expand.png';
import btnCollapsedHover from './images/minimap-expand-highlight.png';
import btnCollapsedActive from './images/minimap-expand-active.png';

import { moveCamera } from '../../actions/minimap';

const MINIMAP_SCALE = 1.5;
const HEADER_MARGIN = 180;
const PREVIEW_MARGIN = 200;
const PREVIEW_SCALE = 128 / ( 57 / MINIMAP_SCALE);
const MINIMAP_SIZE = 410 / MINIMAP_SCALE;

const styles = theme => ({
  root: {
    width: 546 / MINIMAP_SCALE,
    height: 462 / MINIMAP_SCALE,
    position: 'fixed',
    left: (0 - 546 + 100) / MINIMAP_SCALE,
    bottom: 20,
    backgroundImage: 'url(' + background + ')',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 100%',
    backgroundPosition: 'center center',
    transition: '0.5s left',
    cursor: 'grab',

    '& *': {
      userSelect: 'none'
    },

    '&.expanded': {
      left: 20,
    }
  },
  minimapView: {
    position: 'relative',
    height: MINIMAP_SIZE,
    width: MINIMAP_SIZE,
    top: 25 / MINIMAP_SCALE,
    left: 28 / MINIMAP_SCALE,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    // border: '1px solid white',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: '0 0 auto',
    pointerEvents: 'none',

    '&.short': {
      height: 37 / MINIMAP_SCALE,
    },
    '&.short.scaled': {
      height: 37 / MINIMAP_SCALE / 1.5,
    },
    '&.short.superScaled': {
      height: 37 / MINIMAP_SCALE / 2,
    },
  },
  card: {
    flex: '0 0 auto',
    width: 37 / MINIMAP_SCALE,
    height: 57 / MINIMAP_SCALE,
    margin: 2 / MINIMAP_SCALE,
    pointerEvents: 'none',

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    '& img': {
      width: 37 / MINIMAP_SCALE,
      height: 57 / MINIMAP_SCALE,
      pointerEvents: 'none',
    },

    '&.wide': {
      width: 57 / MINIMAP_SCALE,
    },

    '&.scaled': {
      width: 37 / MINIMAP_SCALE / 1.5,
      height: 57 / MINIMAP_SCALE / 1.5,
      margin: 2 / MINIMAP_SCALE / 1.5,
    },
    '&.wide.scaled': {
      width: 57 / MINIMAP_SCALE / 1.5,
    },
    '&.scaled img': {
      width: 37 / MINIMAP_SCALE / 1.5,
      height: 57 / MINIMAP_SCALE / 1.5,
    },
    '&.superScaled': {
      width: 37 / MINIMAP_SCALE / 2,
      height: 57 / MINIMAP_SCALE / 2,
      margin: 2 / MINIMAP_SCALE / 2,
    },
    '&.wide.superScaled': {
      width: 57 / MINIMAP_SCALE / 2,
    },
    '&.superScaled img': {
      width: 37 / MINIMAP_SCALE / 2,
      height: 57 / MINIMAP_SCALE / 2,
    },

    '&.rotation1': {
      transform: 'rotate(90deg)'
    },
    '&.rotation2': {
      transform: 'rotate(180deg)'
    },
    '&.rotation3': {
      transform: 'rotate(270deg)'
    }
  },

  previewBox: {
    border: '2px solid white',
    position: 'absolute',
    pointerEvents: 'none',
  },

  button: {
    position: 'absolute',
    width: 36 / MINIMAP_SCALE,
    height: 36 / MINIMAP_SCALE,
    top: 0,
    right: 34 / MINIMAP_SCALE,
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 100%',
    backgroundImage: 'url(' + btnCollapsed + ')',
    cursor: 'pointer',

    '&:hover': {
      backgroundImage: 'url(' + btnCollapsedHover + ')',
    },
    '&:active': {
      backgroundImage: 'url(' + btnCollapsedActive + ')',
    },
    '&.expanded': {
      backgroundImage: 'url(' + btnExpanded + ')',
      '&:hover': {
        backgroundImage: 'url(' + btnExpandedHover + ')',
      },
      '&:active': {
        backgroundImage: 'url(' + btnExpandedActive + ')',
      },
    }
  }
});

class Minimap extends Component {
  constructor () {
    super();

    this.state = {
      nodes: [],
      actions: [],
      rows: [],
      grid: {},
      minX: 0,
      maxX: 0,
      minY: 0,
      maxY: 0,
      expanded: true,
    };

    this.renderRow = this.renderRow.bind(this);
    this.renderCard = this.renderCard.bind(this);
    this.toggleExpanded = this.toggleExpanded.bind(this);
    this.mouseMove = this.mouseMove.bind(this);
    this.mouseClick = this.mouseClick.bind(this);
  }

  componentWillReceiveProps (newProps) {
    console.log('Getting new castles', newProps);
    let newCastle = newProps.castles[newProps.playerId || 'test'];
    this.setState({...newCastle,
      scaled: newCastle && ((newCastle.maxX - newCastle.minX) > 6 || (newCastle.maxY - newCastle.minY) > 6),
      superScaled: newCastle && ((newCastle.maxX - newCastle.minX) > 10 || (newCastle.maxY - newCastle.minY) > 10),
    });
  }

  mouseMove (event) {
    if  (!event.buttons) {
      return;
    }
    var bounds = event.target.getBoundingClientRect();
    var x = event.clientX - bounds.left;
    var y = event.clientY - bounds.top;
    this.moveMinimap(x, y);
  }

  mouseClick (event) {
    var bounds = event.target.getBoundingClientRect();
    var x = event.clientX - bounds.left;
    var y = event.clientY - bounds.top;
    this.moveMinimap(x, y);
  }

  moveMinimap (x, y) {
    let scale = this.getScale();

    let previewWidth = (this.props.windowWidth - PREVIEW_MARGIN) / scale;
    let previewHeight = (this.props.windowHeight - PREVIEW_MARGIN - HEADER_MARGIN) / scale;

    previewWidth = Math.min(previewWidth, MINIMAP_SIZE);
    previewHeight = Math.min(previewHeight, MINIMAP_SIZE);

    x -= MINIMAP_SIZE / 2;
    y -= MINIMAP_SIZE / 2;

    let xMargin = MINIMAP_SIZE - previewWidth;
    let yMargin = MINIMAP_SIZE - previewHeight;

    x = Math.max(0 - xMargin / 2, x);
    x = Math.min(xMargin / 2, x);

    y = Math.max(0 - yMargin / 2, y);
    y = Math.min(yMargin / 2, y);

    x *= scale;
    y *= scale;

    x = Math.round(x * 100) / 100;
    y = Math.round(y * 100) / 100;

    if (this.props.x !== x || this.props.y !== y) {
      this.props.dispatch(moveCamera(x, y));
    }
  }

  toggleExpanded () {
    this.setState({
      expanded: !this.state.expanded
    });
  }

  getScale () {
    if (this.state.superScaled) {
      return PREVIEW_SCALE * 2;
    }
    if (this.state.scaled) {
      return PREVIEW_SCALE * 1.5;
    }
    return PREVIEW_SCALE
  }

  render () {
    return (
      <div className={ classNames(this.props.classes.root, {
          expanded: this.state.expanded
        }) } >
        <div
          onClick={ this.mouseClick }
          onMouseMove={ this.mouseMove }
          className={ this.props.classes.minimapView }
          >
          { this.state.rows.map(this.renderRow) }
          <div
            className={ this.props.classes.previewBox }
            style={ this.previewStyles() } >
          </div>
        </div>
        <div
          onClick={ this.toggleExpanded }
          className={ classNames(this.props.classes.button, {
            expanded: this.state.expanded
          }) }>
        </div>
      </div>
    );
  }
  previewStyles () {
    let width = this.props.windowWidth;
    let height = this.props.windowHeight;
    let scale = this.getScale();

    height -= HEADER_MARGIN;

    width -= PREVIEW_MARGIN;
    height -= PREVIEW_MARGIN;

    width /= scale;
    height /= scale;

    width = Math.min(MINIMAP_SIZE, width);
    height = Math.min(MINIMAP_SIZE, height);

    // centered square calculation
    let centerX = (MINIMAP_SIZE - width) / 2;
    let centerY = (MINIMAP_SIZE - height) / 2;

    return {
      left: (this.props.x / scale) + centerX,
      top: (this.props.y / scale) + centerY,
      width, height
    }
  }
  renderRow (row, i) {
    let y = this.state.maxY - i;
    return (
      <div
        className={ classNames(
          this.props.classes.row,
          this.state.rowSizes[y],
          {
            scaled: this.state.scaled,
            superScaled: this.state.superScaled,
          }) }
        key={ y }>
        { row.map(this.renderCard) }
      </div>
    );
  }
  renderCard (card, i) {
    let img = this.imageForCard(card);
    let x = this.state.minX + i;

    return (
      <div
        className={ classNames(
          this.props.classes.card,
          card && ('rotation' + card.rotation),
          this.state.columnSizes[x],
          {
            scaled: this.state.scaled,
            superScaled: this.state.superScaled,
          }) }
        key={ x }
        >
        { img }
      </div>
    );
  }

  imageForCard (card) {
    if (!card) {
      return [];
    }
    let metadata = this.props.metadata[this.props.cards[card.card]];

    let isThrone = false;
    let isVault = false;
    let isEffect = false;

    let backgroundName = emptyCard;

    metadata.categories.forEach(function (category) {
      switch (category) {
        case 'Throne':
          isThrone = true;
          break;
        case 'Treasure':
          isVault = true;
          break;
        case 'Empty':
          break;
        default:
          isEffect = true;
          break;
      }
    });

    let active = card.matchingLinks > 0;

    if (isThrone) {
      backgroundName = throneRoom;
    } else if (isVault) {
      if (active) {
        backgroundName = vaultRoomActive;
      } else {
        backgroundName = vaultRoom;
      }
    } else if (isEffect) {
      if (active) {
        backgroundName = effectRoomActive;
      } else {
        backgroundName = effectRoom;
      }
    }
    return (
      <img
        className={ this.props.classes.cardImage }
        src={ backgroundName }
        />
    );
  }
}

const mapToProps = obstruction({
  playerId: 'global.playerId',
  castles: 'game.castles',
  cards: 'cards.knownCards',
  metadata: 'cards.metadata',
  x: 'minimap.x',
  y: 'minimap.y',
});

export default withStyles(styles)(connect(mapToProps)(windowSize(Minimap)));
