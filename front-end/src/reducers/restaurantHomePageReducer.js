import { updatProfileInformation, updateHomeProfile } from '../constants/action-types';

const defaultState = {
  restaurantHome: {
    restaurantName: '',
    restaurantAddress: '',
    CountryName: '',
    StateName: '',
    City: '',
    Zip: '',
    Street: '',
    PhoneNo: '',
    CountryCode: '',
    OpeningTime: '',
    ClosingTime: '',
    ImageURL: '',
    CurbsidePickup: '',
    DineIn: '',
    YelpDelivery: '',
    reviewCount: 0,
    Following: '',
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
    case updateHomeProfile: {
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
