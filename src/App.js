import React, { Component } from 'react';
import { Redirect, Switch } from 'react-router';
import { BrowserRouter, Route } from 'react-router-dom';
import LobbyMenu from './components/lobby';
import LobbyView from './components/lobby/lobby';
import GameView from './components/game';
import * as Sentry from '@sentry/browser';
import window from 'global/window';

import Typography from '@material-ui/core/Typography';

import './App.css';

if (process.env.NODE_ENV === 'production') {
  window._LTracker.push({
    'logglyKey': 'fd43235d-b27f-48a3-945b-dc7b2dfd76c2',
    'sendConsoleErrors' : false,
    'tag' : 'disastles-ui'
  });
}
if (process.env.NODE_ENV === 'production') {
  let url = 'https://80afa086ba9d42aab17007c344d4d6f9@sentry.io/1382576';
  let x = '//'; // this is to fix stupid highlighting in JSX

  Sentry.init({
    dsn: url
  });
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    Sentry.withScope(scope => {
      Object.keys(errorInfo).forEach(key => {
        scope.setExtra(key, errorInfo[key]);
      });
      Sentry.captureException(error);
    });
  }

  render() {
    if (this.state.hasError) {
      console.log(this.state);
      return (
        <React.Fragment>
          <Typography variant='error'>
            <img src='https://media.giphy.com/media/EuLnAYIZZjB3q/giphy.gif' />
            <br />
            Good news! The error you just enountered was reported to the developers to be fixed!
            <br />
            <br />
            Refresh the window to keep playing, and have a great day.
            <br />
          </Typography>
        </React.Fragment>
      );
    }

    return (
      <BrowserRouter>
        <Switch>
          <Route
            exact
            path='/'
            render={ ()=> <Redirect to='/lobby' /> } />
          <Route exact path='/lobby' component={ LobbyMenu } />
          <Route path='/lobby/:id' component={ LobbyView } />
          <Route path='/game/:id' component={ GameView } />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
