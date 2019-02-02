import { Provider } from "react-redux";
import React from 'react';
import ReactDOM from 'react-dom';
import Grid from './';
import store from '../../../store';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
  <Provider store={store}>
    <Grid />
  </Provider>, div);
  ReactDOM.unmountComponentAtNode(div);
});
