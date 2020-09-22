import { updatProfileInformation, updateLeftPannelTab } from '../constants/action-types';

const defaultState = {
  restaurantHome: {
    restaurantName: '',
    restaurantAddress: '',
    tabOpened: 'Home',
  },
};

const restaurantHomePageReducer = (state = defaultState, action) => {
  switch (action.type) {
    case updatProfileInformation: {
      return {
        ...state,
        restaurantHome: { ...state.restaurantHome, ...action.payload },
        //   return Object.assign(state, action.payload);
      };
    }
    case updateLeftPannelTab: {
      return {
        ...state,
        restaurantHome: { ...state.restaurantHome, ...action.payload },
        //   return Object.assign(state, action.payload);
      };
    }
    default: {
      return { ...state };
    }
  }
};

export default restaurantHomePageReducer;
