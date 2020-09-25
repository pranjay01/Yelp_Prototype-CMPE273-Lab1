import { updateLoginSuccess, updateLogoutSuccess } from '../constants/action-types';

const defaultState = {
  loginLogout: {
    userEmail: '',
    role: '',
    loginStatus: false,
  },
};

const LoginReducer = (state = defaultState, action) => {
  switch (action.type) {
    case updateLoginSuccess: {
      return {
        ...state,
        loginLogout: { ...state.loginLogout, ...action.payload },
        //   return Object.assign(state, action.payload);
      };
    }
    case updateLogoutSuccess: {
      return {
        ...state,
        loginLogout: { ...state.loginLogout, ...action.payload },
        //   return Object.assign(state, action.payload);
      };
    }
    default: {
      return { ...state };
    }
  }
};

export default LoginReducer;
