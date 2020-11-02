import loginReducer from './loginReducer';
import restaurantHomePageReducer from './restaurantHomePageReducer';
import signupReducer from './signupReducer';
import snackBarReducer from './snackBarReducer';
import customerBasicInfoReducer from './customerBasicInfoReducer';
import searchTabReducer from './searchTabReducer';
import restaurantSearchResultReducer from './restaurantSearchResultReducer';
import masterDataReducer from './masterDataReducer';
import restaurntFoodMenuReducer from './restaurntFoodMenuReducer';
import reviewStoreReducer from './reviewStoreReducer';
import orderStoreReducer from './orderStoreReducer';
import eventStoreReducer from './eventStoreReducer';
import searchedRestaurantReducer from './searchedRestaurantReducer';
import customerEventReducer from './customerEventReducer';
import leftPannelReducer from './leftPannelReducer';
import customerForProfileReducer from './customerForProfileReducer';
import customerListStoreReducer from './customerListStoreReducer';
import messageStoreReducer from './messageStoreReducer';
import { combineReducers } from 'redux';

const finalReducers = combineReducers({
  loginReducer: loginReducer,
  restaurantHomePageReducer: restaurantHomePageReducer,
  signupReducer: signupReducer,
  snackBarReducer: snackBarReducer,
  customerBasicInfoReducer: customerBasicInfoReducer,
  searchTabReducer: searchTabReducer,
  restaurantSearchResultReducer: restaurantSearchResultReducer,
  masterDataReducer: masterDataReducer,
  restaurntFoodMenuReducer: restaurntFoodMenuReducer,
  reviewStoreReducer: reviewStoreReducer,
  orderStoreReducer: orderStoreReducer,
  eventStoreReducer: eventStoreReducer,
  searchedRestaurantReducer: searchedRestaurantReducer,
  customerEventReducer: customerEventReducer,
  leftPannelReducer: leftPannelReducer,
  customerForProfileReducer: customerForProfileReducer,
  customerListStoreReducer: customerListStoreReducer,messageStoreReducer:messageStoreReducer,
});

export default finalReducers;
