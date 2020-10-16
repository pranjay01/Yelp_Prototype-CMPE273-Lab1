import { updateOrderStore } from '../constants/action-types';

const defaultState = {
  orderStore: {
    OrderList: [],
    orderCount: 0,
    PageCount: 0,
    sortValue: 'All',
    selectedPage: 0,
    orderDetails: [],
    popSeen: false,
  },
};

const orderStoreReducer = (state = defaultState, action) => {
  switch (action.type) {
    case updateOrderStore: {
      return {
        ...state,
        orderStore: { ...state.orderStore, ...action.payload },
        //   return Object.assign(state, action.payload);
      };
    }

    default: {
      return { ...state };
    }
  }
};

export default orderStoreReducer;
