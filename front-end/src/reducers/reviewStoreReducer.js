import { updateReviewList } from '../constants/action-types';

const defaultState = {
  reviewStore: {
    Reviews: [],
    reviewCount: 0,
    PageCount: 0,
  },
};

const reviewStoreReducer = (state = defaultState, action) => {
  switch (action.type) {
    case updateReviewList: {
      return {
        ...state,
        reviewStore: { ...state.reviewStore, ...action.payload },
        //   return Object.assign(state, action.payload);
      };
    }

    default: {
      return { ...state };
    }
  }
};

export default reviewStoreReducer;
