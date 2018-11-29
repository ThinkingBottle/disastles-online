import React, { Component } from 'react';
import { Redirect, Switch } from 'react-router';
import { HashRouter, Route } from 'react-router-dom';
import LobbyMenu from './components/lobby';
import LobbyView from './components/lobby/lobby';
import GameView from './components/game';

class App extends Component {
  render() {
    return (
      <HashRouter>
        <Switch>
          <Route
            exact
            path='/'
            render={ ()=> <Redirect to='/lobby' /> } />
          <Route exact path='/lobby' component={ LobbyMenu } />
          <Route path='/lobby/:id' component={ LobbyView } />
          <Route path='/game/:id' component={ GameView } />
        </Switch>
      </HashRouter>
    );
  }
}

export default App;
