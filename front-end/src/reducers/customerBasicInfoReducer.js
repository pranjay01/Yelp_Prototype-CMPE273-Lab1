import { getCustomerBasicInfo } from '../constants/action-types';

const defaultState = {
  customerInfo: {
    customerProfile: { ImageURL: '', LastName: '' },
    reviewCount: 0,
  },
};

const customerBasicInfoReducer = (state = defaultState, action) => {
  switch (action.type) {
    case getCustomerBasicInfo: {
      return {
        ...state,
        customerInfo: { ...state.customerInfo, ...action.payload },
        //   return Object.assign(state, action.payload);
      };
    }

    default: {
      return { ...state };
    }
  }
};

export default customerBasicInfoReducer;
