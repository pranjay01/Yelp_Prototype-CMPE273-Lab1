import LoginReducer from './loginReducer';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import logger from 'redux-logger';

let middleWare = [thunk];
if (process.env.NODE_ENV !== 'production') {
  middleWare = [...middleWare, logger];
}

const store = createStore(
  LoginReducer,
  compose(
    applyMiddleware(...middleWare),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);
export default store;
