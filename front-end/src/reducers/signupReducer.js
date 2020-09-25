import { updateSignupStatus } from '../constants/action-types';

const defaultState = {
  signupStatus: {
    userEmail: '',
    signupStatus: 'Not Signedup',
  },
};

const signupReducer = (state = defaultState, action) => {
  switch (action.type) {
    case updateSignupStatus: {
      return {
        ...state,
        signupStatus: { ...state.signupStatus, ...action.payload },
        //   return Object.assign(state, action.payload);
      };
    }

    default: {
      return { ...state };
    }
  }
};

export default signupReducer;
