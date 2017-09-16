import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import reducers from '../reducers/index';

export const initStore = function (initState) {
  return createStore(reducers, initState, composeWithDevTools(applyMiddleware(thunkMiddleware)));
};
