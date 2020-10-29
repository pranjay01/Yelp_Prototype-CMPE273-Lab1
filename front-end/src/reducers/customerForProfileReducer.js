import { updateCustomerForRestaurant } from '../constants/action-types';

const defaultState = {
  customerInfo: {
    customerProfile: { ImageURL: '', LastName: '' },
    staticProfileSeen: false,
  },
};

const customerForProfileReducer = (state = defaultState, action) => {
  switch (action.type) {
    case updateCustomerForRestaurant: {
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

export default customerForProfileReducer;
