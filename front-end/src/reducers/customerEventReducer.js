import { updateEventStoreForCustomer } from '../constants/action-types';

const defaultState = {
  eventStore: {
    EventList: [],
    eventCount: 0,
    PageCount: 0,
    sortValue: 'upcoming',
    selectedPage: 0,
    sortOrder: 1,
  },
};

const customerEventReducer = (state = defaultState, action) => {
  switch (action.type) {
    case updateEventStoreForCustomer: {
      return {
        ...state,
        eventStore: { ...state.eventStore, ...action.payload },
        //   return Object.assign(state, action.payload);
      };
    }

    default: {
      return { ...state };
    }
  }
};

export default customerEventReducer;
