import { updateEventStore, updateRegistrationStore } from '../constants/action-types';

const defaultState = {
  registrationStore: {
    RegisteredCustomers: [],
    registeredCustomerCount: 0,
    RegistrationPageCount: 0,
    popSeen: false,
    EventId: null,
  },
  eventStore: {
    EventList: [],
    eventCount: 0,
    PageCount: 0,
    sortValue: 'upcoming',
    selectedPage: 0,
  },
};

const eventStoreReducer = (state = defaultState, action) => {
  switch (action.type) {
    case updateEventStore: {
      return {
        ...state,
        eventStore: { ...state.eventStore, ...action.payload },
        //   return Object.assign(state, action.payload);
      };
    }
    case updateRegistrationStore: {
      return {
        ...state,
        registrationStore: { ...state.registrationStore, ...action.payload },
        //   return Object.assign(state, action.payload);
      };
    }

    default: {
      return { ...state };
    }
  }
};

export default eventStoreReducer;
