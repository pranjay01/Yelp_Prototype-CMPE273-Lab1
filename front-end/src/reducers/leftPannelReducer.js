import { updateLeftPannelHighlight } from '../constants/action-types';

const defaultState = {
  LeftPannelStore: {
    profileIsActive: true,
    eventsTabIsActive: false,
    ordersTabIsActive: false,
  },
};
const leftPannelReducer = (state = defaultState, action) => {
  switch (action.type) {
    case updateLeftPannelHighlight: {
      return {
        ...state,
        LeftPannelStore: { ...state.LeftPannelStore, ...action.payload },
        //   return Object.assign(state, action.payload);
      };
    }

    default: {
      return { ...state };
    }
  }
};

export default leftPannelReducer;
