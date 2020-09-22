import loginReducer from './loginReducer';
import restaurantHomePageReducer from './restaurantHomePageReducer';

import { combineReducers } from 'redux';

const finalReducers = combineReducers({
  loginReducer: loginReducer,
  restaurantHomePageReducer: restaurantHomePageReducer,
});

export default finalReducers;
