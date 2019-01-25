import { createStore, applyMiddleware } from 'redux'
import reducers from './reducers';
import thunk from 'redux-thunk';
import { onStart } from './sound';
import { play } from './actions/music';

const store = createStore(reducers, applyMiddleware(thunk));

onStart(function () {
  store.dispatch(play(true));
});

export default store;
