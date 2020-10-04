import { updateSnackbarData } from '../constants/action-types';

const defaultState = {
  snackbarData: null,
};

const snackBarReducer = (state = defaultState, action) => {
  switch (action.type) {
    case updateSnackbarData: {
      return {
        ...state,
        snackbarData: action.payload,
        //   return Object.assign(state, action.payload);
      };
    }

    default: {
      return { ...state };
    }
  }
};

export default snackBarReducer;
