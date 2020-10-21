import { updateSearchedRestaurant, updateRestaurantFoodStore } from '../constants/action-types';

const defaultState = {
  restaurantProfileStore: {
    RestaurantProfile: {},
    ReviewList: [],
  },
  RestaurantFoodMenuStore: {
    FoodMenu: [],
    PageCount: 0,
    FoodCount: 0,
  },
};

const searchedRestaurantReducer = (state = defaultState, action) => {
  switch (action.type) {
    case updateSearchedRestaurant: {
      return {
        ...state,
        restaurantProfileStore: { ...state.restaurantProfileStore, ...action.payload },
        //   return Object.assign(state, action.payload);
      };
    }
    case updateRestaurantFoodStore: {
      return {
        ...state,
        RestaurantFoodMenuStore: { ...state.RestaurantFoodMenuStore, ...action.payload },
        //   return Object.assign(state, action.payload);
      };
    }

    default: {
      return { ...state };
    }
  }
};

export default searchedRestaurantReducer;
