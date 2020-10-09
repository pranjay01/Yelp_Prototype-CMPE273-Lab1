import LoginReducer from './loginReducer';
import finalReducers from './combinedReducers';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import logger from 'redux-logger';

let middleWare = [thunk];
if (process.env.NODE_ENV !== 'production') {
  middleWare = [...middleWare, logger];
}

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose;

const enhancer = composeEnhancers(
  applyMiddleware(...middleWare)
  // other store enhancers if any
);
const store = createStore(finalReducers, enhancer);

// const store = createStore(
//   finalReducers,
//   compose(
//     applyMiddleware(...middleWare),
//     window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
//   )
// );
export default store;
