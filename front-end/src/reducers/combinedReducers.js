import loginReducer from './loginReducer';
import restaurantHomePageReducer from './restaurantHomePageReducer';
import signupReducer from './signupReducer';

import { combineReducers } from 'redux';

const finalReducers = combineReducers({
  loginReducer: loginReducer,
  restaurantHomePageReducer: restaurantHomePageReducer,
  signupReducer: signupReducer,
});

export default finalReducers;
