import React, { Component } from 'react';
import { Redirect, Switch } from 'react-router';
import { BrowserRouter, Route } from 'react-router-dom';
import LobbyMenu from './components/lobby';
import LobbyView from './components/lobby/lobby';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route
            exact
            path='/'
            render={ ()=> <Redirect to='/lobby' /> } />
          <Route exact path='/lobby' component={ LobbyMenu } />
          <Route path='/lobby/:id' component={ LobbyView } />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
