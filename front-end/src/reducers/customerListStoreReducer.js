import { updateCustomerListStore } from '../constants/action-types';

const defaultState = {
  //   registrationStore: {
  //     RegisteredCustomers: [],
  //     registeredCustomerCount: 0,
  //     RegistrationPageCount: 0,
  //     popSeen: false,
  //     EventId: null,
  //   },
  customerListSTore: {
    CustomerList: [],
    customerCount: 0,
    PageCount: 0,
    filterCriterea: 'all',
    selectedPage: 0,
    location: '',
  },
};

const customerListStoreReducer = (state = defaultState, action) => {
  switch (action.type) {
    case updateCustomerListStore: {
      return {
        ...state,
        customerListSTore: { ...state.customerListSTore, ...action.payload },
        //   return Object.assign(state, action.payload);
      };
    }
    // case updateRegistrationStore: {
    //   return {
    //     ...state,
    //     registrationStore: { ...state.registrationStore, ...action.payload },
    //     //   return Object.assign(state, action.payload);
    //   };
    // }

    default: {
      return { ...state };
    }
  }
};

export default customerListStoreReducer;
