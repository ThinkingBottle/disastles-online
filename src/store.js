import { createStore, applyMiddleware, compose } from 'redux'
import reducers from './reducers';
import thunk from 'redux-thunk';
import { onStart } from './sound';
import { play } from './actions/music';

const enhancers = [];
if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line no-underscore-dangle
  const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension());
  }
}

const composedEnhancers = compose(
  applyMiddleware(thunk),
  ...enhancers,
);

const store = createStore(reducers, composedEnhancers);

onStart(function () {
  store.dispatch(play(true));
});

export default store;
