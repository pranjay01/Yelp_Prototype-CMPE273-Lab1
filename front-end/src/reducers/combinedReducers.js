import loginReducer from './loginReducer';
import restaurantHomePageReducer from './restaurantHomePageReducer';
import signupReducer from './signupReducer';
import snackBarReducer from './snackBarReducer';
import customerBasicInfoReducer from './customerBasicInfoReducer';

import { combineReducers } from 'redux';

const finalReducers = combineReducers({
  loginReducer: loginReducer,
  restaurantHomePageReducer: restaurantHomePageReducer,
  signupReducer: signupReducer,
  snackBarReducer: snackBarReducer,
  customerBasicInfoReducer: customerBasicInfoReducer,
});

export default finalReducers;
