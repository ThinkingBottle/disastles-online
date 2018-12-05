import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import obstruction from 'obstruction';
import { partial } from 'ap';

import { If } from 'react-extras';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import API from '../../../api';

const styles = theme => ({
  root: {
  },
  node: {
    display: 'inline-block',
    width: 200,
    height: 200,
  }
});

class GridController extends Component {
  constructor (props) {
    super(props);

    this.state = {
      nodes: [],
      actions: []
    };

    this.renderRow = this.renderRow.bind(this);
    this.renderCell = this.renderCell.bind(this);
    this.sendAction = this.sendAction.bind(this);
  }

  componentWillReceiveProps (newProps) {
    console.log('Getting new castles', newProps);
    this.setState({...newProps.castles[newProps.playerId || 'test'],
      actions: newProps.actions.filter((action) => {
        if (action.action === 'BuildRoom') {
          return action.card === newProps.selectedCard;
        }
        return true;
      })
    });
  }

  async sendAction (action) {
    action = {...action,
      effects: []
    };
    API.send(action);
  }

  render () {
    console.log(this.state.actions);
    let minX = 0;
    let maxX = 0;
    let minY = 0;
    let maxY = 0;
    let grid = {};
    this.state.nodes.forEach(function (node) {
      minX = Math.min(minX, node.x);
      maxX = Math.max(maxX, node.x);
      minY = Math.min(minY, node.y);
      maxY = Math.max(maxY, node.y);

      if (!grid[node.x]) {
        grid[node.x] = {};
      }
      grid[node.x][node.y] = node;
    });

    minX--;
    maxX++;
    minY--;
    maxY++;

    let width = maxX - minX + 1;
    let height = maxY - minY + 1;
    let rows = [];

    for (let y = 0; y < height; ++y) {
      let row = [];
      for (let x = 0; x < width; ++x) {
        if (grid[x + minX]) {
          row.push(grid[x + minX][y + minY]);
        } else {
          row.push(null);
        }
      }
      rows.push(row);
    }

    console.log(grid, width, height, rows);

    return (
      <div>
        { rows.map(partial(this.renderRow, minX, minY)) }
      </div>
    );
  }

  renderRow (minX, minY, row, i) {
    let y = i + minY;
    return (
      <div key={ y }>
        { row.map(partial(this.renderCell, y, minX)) }
      </div>
    );
  }

  renderCell (y, minX, node, i) {
    let x = i + minX;
    let key = x + ':' + y;
    let isActionable = this.state.actions.reduce((memo, val) => {
      if (val.x === x && val.y === y) {
        return val;
      }
      if (node && val.room === node.card) {
        return val;
      }
      return memo;
    }, false);

    if (!isActionable && node) {
      isActionable = this.props.actions.reduce((memo, val) => {
        if (val.card === node.card) {
          return val;
        }
        return memo;
      }, null);
    }

    return (
      <div key={ key } className={ this.props.classes.node }>
        <If
          condition={ !node }
          render={ ()=>
            <React.Fragment>
              Empty room!
            </React.Fragment> }
          />
        <If
          condition={ !!node }
          render={ ()=>
            <React.Fragment>
              { this.props.cards[node.card] }
            </React.Fragment> }
          />

        <If
          condition={ !!isActionable }
          render={ ()=>
            <Button onClick={ partial(this.sendAction, isActionable) }>
              { isActionable.action }
            </Button> }
          />
      </div>
    );
  }
}

const mapToProps = obstruction({
  selectedCard: 'game.selectedCard',
  actions: 'game.actions',
  playerId: 'global.playerId',
  castles: 'game.castles',
  cards: 'cards.knownCards',
});

export default withStyles(styles)(connect(mapToProps)(GridController));
