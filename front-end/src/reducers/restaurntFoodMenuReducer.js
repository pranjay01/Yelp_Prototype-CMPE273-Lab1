import { updateFoodData } from '../constants/action-types';

const defaultState = {
  foodData: {
    FoodCount: 0,
    PageCount: 0,
    Cuisines: [],
    Appetizers: [],
    Salads: [],
    Beverages: [],
    Desserts: [],
    MainCourse: [],
  },
};

const restaurntFoodMenuReducer = (state = defaultState, action) => {
  switch (action.type) {
    case updateFoodData: {
      return {
        ...state,
        foodData: { ...state.foodData, ...action.payload },
        //   return Object.assign(state, action.payload);
      };
    }

    default: {
      return { ...state };
    }
  }
};

export default restaurntFoodMenuReducer;
