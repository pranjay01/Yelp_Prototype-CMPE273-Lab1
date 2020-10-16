/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import axios from 'axios';
import serverUrl from '../../../config';
import './FoodMenu.css';
import Food from './Food';
import NewFoodForm from './NewFoodForm';
import { connect } from 'react-redux';
import {
  updateFoodData,
  updateSnackbarData,
  SALADS,
  APPETIZERS,
  MAIN_COURSE,
  BEVERAGES,
  DESSERTS,
} from '../../../constants/action-types';
// import { updateSnackbarData } from '../../constants/action-types';

import ReactPaginate from 'react-paginate';

class FoodMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showFoodCategory: localStorage.getItem('showFoodCategory'),
      addFoodItemForm: false,
      newFood: {
        RestaurantID: localStorage.getItem('userId'),
        FoodName: '',

        MainIngredients: '',
        Cuisine: '',
        Description: '',
        ImageUrl: '',
        Price: '',
      },
      tmpFood: {
        RestaurantID: localStorage.getItem('userId'),
        FoodName: '',
        MainIngredients: '',
        Cuisine: '',
        Description: '',
        ImageUrl: '',
        Price: '',
      },
      editableId: null,
      editableCategory: '',
      selectedPage: 0,
    };
  }

  // Call On render
  componentDidMount() {
    if (localStorage.getItem('showFoodCategory')) {
      this.showMenuCategory(localStorage.getItem('showFoodCategory'));
    }
    // console.log('inside Signup');
    axios.get(serverUrl + 'static/getCusinesForMenu').then((response) => {
      // console.log(response.data);
      let Cuisines = response.data.map((cuisine) => {
        return { key: cuisine._id, value: cuisine.CuisineName };
      });

      let payload = {
        Cuisines,
      };
      this.props.updateFoodData(payload);
    });
  }

  //Open or close Food Addition FOrm
  openFoodForm = () => {
    if (this.state.addFoodItemForm) {
      let tmp = {
        RestaurantID: localStorage.getItem('userId'),
        FoodName: '',
        MainIngredients: '',
        Cuisine: '',
        Description: '',
        ImageUrl: '',
        Price: '',
      };
      this.setState({
        newFood: { ...this.state.newFood, ...tmp },
      });
    } else {
      this.setState({ editableId: null });
    }
    this.setState({
      addFoodItemForm: !this.state.addFoodItemForm,
    });
  };

  // onChange Handeler for new food item form
  onNameChangeHandler = (value) => {
    let tmp = { FoodName: value };
    this.setState({
      newFood: { ...this.state.newFood, ...tmp },
    });
  };
  onPriceChangeHandler = (value) => {
    let tmp = { Price: value };
    this.setState({
      newFood: { ...this.state.newFood, ...tmp },
    });
  };
  onCusineChangeHandler = (value) => {
    let tmp = { Cuisine: value };
    this.setState({
      newFood: { ...this.state.newFood, ...tmp },
    });
  };
  onIngredentsChangeHandler = (value) => {
    let tmp = { MainIngredients: value };
    this.setState({
      newFood: { ...this.state.newFood, ...tmp },
    });
  };
  onDescriptionChangeHandler = (value) => {
    let tmp = { Description: value };
    this.setState({
      newFood: { ...this.state.newFood, ...tmp },
    });
  };

  onChangeFileHandler = (event) => {
    if (event.target.files.length === 1) {
      event.preventDefault();
      let formData = new FormData();
      formData.append('file', event.target.files[0], event.target.files[0].name);
      axios({
        method: 'post',
        url: serverUrl + 'biz/uploadFoodImage',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      })
        .then((response) => {
          // console.log('Status Code : ', response.status);
          if (parseInt(response.status) === 200) {
            // console.log('Product Saved');
            let tmp = { ImageUrl: response.data };
            this.setState({
              newFood: { ...this.state.newFood, ...tmp },
            });
            //Router.push('/vendor/' + localStorage.getItem('user_id'));
          } else if (parseInt(response.status) === 400) {
            // console.log(response.data);
          }
        })
        .catch((error) => {
          this.setState({
            errorMsg: error.message,
            authFlag: false,
          });
        });
      // this.setState({
      //   uploadedPic: event.target.files,
      // });
    }
  };

  onSaveCreateNew = () => {
    const data = {
      ...this.state.newFood,
      category: this.state.showFoodCategory,
    };
    //set the with credentials to true
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    axios.post(serverUrl + 'biz/insertFood', data).then(
      (response) => {
        // console.log('Status Code : ', response.status);
        if (response.status === 200) {
          // console.log(response.data);
          let payload = {
            success: true,
            message: response.data,
          };
          this.props.updateSnackbarData(payload);
          this.fetchFoodMenu(this.state.selectedPage, this.state.showFoodCategory);
        }
      },
      (error) => {
        // console.log(error);
      }
    );
    let newFood = {
      RestaurantID: localStorage.getItem('userId'),
      FoodName: '',
      MainIngredients: '',
      Cuisine: '',
      Description: '',
      ImageUrl: '',
      Price: '',
    };
    this.setState({
      newFood: { ...this.setState.newFood, ...newFood },
      addFoodItemForm: false,
    });
  };

  // Common method to fetch data
  fetchFoodMenu(pageNumber, menuCategory) {
    switch (menuCategory) {
      case APPETIZERS:
        axios
          .get(
            serverUrl + 'biz/menuFetch',

            {
              params: {
                selectedPage: pageNumber,
                category: menuCategory,
                RestaurantID: localStorage.getItem('userId'),
              },
              withCredentials: true,
            }
          )
          .then((response) => {
            // console.log(response.data);
            let Appetizers = response.data.allFoods.map((Appetizer) => {
              return {
                ...Appetizer,
              };
            });

            let payload = {
              PageCount: Math.ceil(response.data.foodCount / 2),
              Appetizers,
              FoodCount: response.data.foodCount,
            };
            this.props.updateFoodData(payload);
            // this.setState({
            //   APPETIZERS: this.props.foodData.Appetizers.concat(allAppetizers),
            // });
          });
        break;
      case SALADS:
        axios
          .get(
            serverUrl + 'biz/menuFetch',

            {
              params: {
                selectedPage: pageNumber,
                category: menuCategory,
                RestaurantID: localStorage.getItem('userId'),
              },
              withCredentials: true,
            }
          )
          .then((response) => {
            // console.log(response.data);
            let Salads = response.data.allFoods.map((Salad) => {
              return {
                ...Salad,
              };
            });

            let payload = {
              PageCount: Math.ceil(response.data.foodCount / 2),
              Salads,
            };
            this.props.updateFoodData(payload);
          });
        break;
      case MAIN_COURSE:
        axios
          .get(
            serverUrl + 'biz/menuFetch',

            {
              params: {
                selectedPage: pageNumber,
                category: menuCategory,
                RestaurantID: localStorage.getItem('userId'),
              },
              withCredentials: true,
            }
          )
          .then((response) => {
            // console.log(response.data);
            let MainCourse = response.data.allFoods.map((MainCours) => {
              return {
                ...MainCours,
              };
            });

            let payload = {
              PageCount: Math.ceil(response.data.foodCount / 2),
              MainCourse,
            };
            this.props.updateFoodData(payload);
          });
        break;
      case BEVERAGES:
        axios
          .get(
            serverUrl + 'biz/menuFetch',

            {
              params: {
                selectedPage: pageNumber,
                category: menuCategory,
                RestaurantID: localStorage.getItem('userId'),
              },
              withCredentials: true,
            }
          )
          .then((response) => {
            // console.log(response.data);
            let Beverages = response.data.allFoods.map((Beverage) => {
              return {
                ...Beverage,
              };
            });

            let payload = {
              PageCount: Math.ceil(response.data.foodCount / 2),
              Beverages,
            };
            this.props.updateFoodData(payload);
          });
        break;
      case DESSERTS:
        axios
          .get(serverUrl + 'biz/menuFetch', {
            params: {
              selectedPage: pageNumber,
              category: menuCategory,
              RestaurantID: localStorage.getItem('userId'),
            },
            withCredentials: true,
          })
          .then((response) => {
            // console.log(response.data);
            let Desserts = response.data.allFoods.map((Dessert) => {
              return {
                ...Dessert,
              };
            });

            let payload = {
              PageCount: Math.ceil(response.data.foodCount / 2),
              Desserts,
            };
            this.props.updateFoodData(payload);
          });
        break;
      default:
        // console.log('wrong Input');
        break;
    }
  }

  // open or hide on select menu and fetch data if not in state
  showMenuCategory = (menuCategory) => {
    let tmp = {
      RestaurantID: localStorage.getItem('userId'),
      FoodName: '',
      MainIngredients: '',
      Cuisine: '',
      Description: '',
      ImageUrl: '',
      Price: '',
    };
    if (this.state.showFoodCategory === menuCategory) {
      localStorage.setItem('showFoodCategory', '');
      this.setState({
        editableCategory: '',
        showFoodCategory: '',
        addFoodItemForm: false,
        tmpFood: { ...this.state.tmpFood, ...tmp },
      });
    } else {
      localStorage.setItem('showFoodCategory', menuCategory);
      this.setState({
        showFoodCategory: menuCategory,
        editableCategory: menuCategory,
        addFoodItemForm: false,
        selectedPage: 0,
      });
    }
    this.fetchFoodMenu(0, menuCategory);
  };

  // on page click
  handlePageClick = (e) => {
    // const selectedPage = e.selected;
    this.fetchFoodMenu(e.selected, this.state.showFoodCategory);
    this.setState({
      selectedPage: e.selected,
    });
  };

  //on successfull delete remove from state also
  deleteFoodItem = (event, foodId) => {
    event.preventDefault();
    const data = {
      category: this.state.showFoodCategory,
      _id: foodId,
    };
    // console.log('Delete Appetizer Food:', foodId, 'catefory: ', category);
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    axios.post(serverUrl + 'biz/deleteFoodItem', data).then(
      (response) => {
        // console.log('Status Code : ', response.status);
        if (response.status === 200) {
          // console.log(response.data);
          const payload = {
            success: true,
            message: response.data,
          };
          this.props.updateSnackbarData(payload);
          let pageNo = this.state.selectedPage;
          if (
            this.props.foodData.FoodCount % 2 !== 0 &&
            this.state.selectedPage + 1 === this.props.foodData.PageCount
          ) {
            pageNo -= 1;
          }
          this.fetchFoodMenu(pageNo, this.state.showFoodCategory);
        }
      },
      (error) => {
        // console.log(error);
      }
    );
  };

  // change editable food state
  makeEditable = (FoodId) => {
    let index = null;
    let foodItem = null;
    switch (this.state.showFoodCategory) {
      case APPETIZERS:
        index = this.props.foodData.Appetizers.findIndex((x) => x._id === FoodId);
        foodItem = {
          ...this.props.foodData.Appetizers[index],
          category: this.state.showFoodCategory,
        };

        break;
      case SALADS:
        index = this.props.foodData.Salads.findIndex((x) => x._id === FoodId);
        foodItem = { ...this.props.foodData.Salads[index], category: this.state.showFoodCategory };

        break;
      case MAIN_COURSE:
        index = this.props.foodData.MainCourse.findIndex((x) => x._id === FoodId);
        foodItem = {
          ...this.props.foodData.MainCourse[index],
          category: this.state.showFoodCategory,
        };

        break;
      case BEVERAGES:
        index = this.props.foodData.Beverages.findIndex((x) => x._id === FoodId);
        foodItem = {
          ...this.props.foodData.Beverages[index],
          category: this.state.showFoodCategory,
        };

        break;
      case DESSERTS:
        index = this.props.foodData.Desserts.findIndex((x) => x._id === FoodId);
        foodItem = {
          ...this.props.foodData.Desserts[index],
          category: this.state.showFoodCategory,
        };

        break;
      default:
        // console.log('wrong Input');
        break;
    }

    let newFood = {
      RestaurantID: localStorage.getItem('userId'),
      FoodName: '',
      MainIngredients: '',
      Cuisine: '',
      Description: '',
      ImageUrl: '',
      Price: '',
    };
    this.setState({
      editableId: FoodId,
      tmpFood: { ...foodItem },
      addFoodItemForm: false,
      newFood,
    });
    // console.log('tmp food store for editable: ', this.state.tmpFood);
    // console.log('editable ID: ', this.state.editableId);
  };

  // onCHange handlers for old food items
  onNameChangeHandlerUpdate = (value, id) => {
    let index = null;
    let food = null;
    let payload = null;
    switch (this.state.showFoodCategory) {
      case APPETIZERS:
        index = this.props.foodData.Appetizers.findIndex((x) => x._id === id);
        // 1. Make a shallow copy of the items
        let Appetizers = [...this.props.foodData.Appetizers];
        // 2. Make a shallow copy of the item you want to mutate
        food = { ...Appetizers[index] };
        // 3. Replace the property you're intested in
        food.FoodName = value;
        // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
        Appetizers[index] = food;
        // 5. Set the state to our new copy
        payload = {
          Appetizers,
        };

        break;
      case SALADS:
        index = this.props.foodData.Salads.findIndex((x) => x._id === id);
        let Salads = [...this.props.foodData.Salads];
        food = { ...Salads[index] };
        food.FoodName = value;
        Salads[index] = food;
        payload = {
          Salads,
        };

        break;
      case MAIN_COURSE:
        index = this.props.foodData.MainCourse.findIndex((x) => x._id === id);
        let MainCourse = [...this.props.foodData.MainCourse];
        food = { ...MainCourse[index] };
        food.FoodName = value;
        MainCourse[index] = food;
        payload = {
          MainCourse,
        };
        break;
      case BEVERAGES:
        index = this.props.foodData.Beverages.findIndex((x) => x._id === id);
        let Beverages = [...this.props.foodData.Beverages];
        food = { ...Beverages[index] };
        food.FoodName = value;
        Beverages[index] = food;
        payload = {
          Beverages,
        };
        break;
      case DESSERTS:
        index = this.props.foodData.Desserts.findIndex((x) => x._id === id);
        let Desserts = [...this.props.foodData.Desserts];
        food = { ...Desserts[index] };
        food.FoodName = value;
        Desserts[index] = food;
        payload = {
          Desserts,
        };
        break;
      default:
        // console.log('wrong Input');
        break;
    }
    this.props.updateFoodData(payload);
  };
  onPriceChangeHandlerUpdate = (value, id) => {
    let index = null;
    let food = null;
    let payload = null;
    switch (this.state.showFoodCategory) {
      case APPETIZERS:
        index = this.props.foodData.Appetizers.findIndex((x) => x._id === id);
        let Appetizers = [...this.props.foodData.Appetizers];
        food = { ...Appetizers[index] };
        food.Price = value;
        Appetizers[index] = food;
        payload = {
          Appetizers,
        };
        break;
      case SALADS:
        index = this.props.foodData.Salads.findIndex((x) => x._id === id);
        let Salads = [...this.props.foodData.Salads];
        food = { ...Salads[index] };
        food.Price = value;
        Salads[index] = food;
        payload = {
          Salads,
        };
        break;
      case MAIN_COURSE:
        index = this.props.foodData.MainCourse.findIndex((x) => x._id === id);
        let MainCourse = [...this.props.foodData.MainCourse];
        food = { ...MainCourse[index] };
        food.Price = value;
        MainCourse[index] = food;
        payload = {
          MainCourse,
        };
        break;
      case BEVERAGES:
        index = this.props.foodData.Beverages.findIndex((x) => x._id === id);
        let Beverages = [...this.props.foodData.Beverages];
        food = { ...Beverages[index] };
        food.Price = value;
        Beverages[index] = food;
        payload = {
          Beverages,
        };
        break;
      case DESSERTS:
        index = this.props.foodData.Desserts.findIndex((x) => x._id === id);
        let Desserts = [...this.props.foodData.Desserts];
        food = { ...Desserts[index] };
        food.Price = value;
        Desserts[index] = food;
        payload = {
          Desserts,
        };
        break;
      default:
        // console.log('wrong Input');
        break;
    }
    this.props.updateFoodData(payload);
  };
  onCusineChangeHandlerUpdate = (value, id) => {
    let index = null;
    let food = null;
    let payload = null;
    switch (this.state.showFoodCategory) {
      case APPETIZERS:
        index = this.props.foodData.Appetizers.findIndex((x) => x._id === id);
        let Appetizers = [...this.props.foodData.Appetizers];
        food = { ...Appetizers[index] };
        food.Cuisine = value;
        Appetizers[index] = food;
        payload = {
          Appetizers,
        };
        break;
      case SALADS:
        index = this.props.foodData.Salads.findIndex((x) => x._id === id);
        let Salads = [...this.props.foodData.Salads];
        food = { ...Salads[index] };
        food.Cuisine = value;
        Salads[index] = food;
        payload = {
          Salads,
        };
        break;
      case MAIN_COURSE:
        index = this.props.foodData.MainCourse.findIndex((x) => x._id === id);
        let MainCourse = [...this.props.foodData.MainCourse];
        food = { ...MainCourse[index] };
        food.Cuisine = value;
        MainCourse[index] = food;
        payload = {
          MainCourse,
        };
        break;
      case BEVERAGES:
        index = this.props.foodData.Beverages.findIndex((x) => x._id === id);
        let Beverages = [...this.props.foodData.Beverages];
        food = { ...Beverages[index] };
        food.Cuisine = value;
        Beverages[index] = food;
        payload = {
          Beverages,
        };
        break;
      case DESSERTS:
        index = this.props.foodData.Desserts.findIndex((x) => x._id === id);
        let Desserts = [...this.props.foodData.Desserts];
        food = { ...Desserts[index] };
        food.Cuisine = value;
        Desserts[index] = food;
        payload = {
          Desserts,
        };
        break;
      default:
        // console.log('wrong Input');
        break;
    }
    this.props.updateFoodData(payload);
  };
  onIngredentsChangeHandlerUpdate = (value, id, menuCategory) => {
    let index = null;
    let food = null;
    let payload = null;
    switch (this.state.showFoodCategory) {
      case APPETIZERS:
        index = this.props.foodData.Appetizers.findIndex((x) => x._id === id);
        let Appetizers = [...this.props.foodData.Appetizers];
        food = { ...Appetizers[index] };
        food.MainIngredients = value;
        Appetizers[index] = food;
        payload = {
          Appetizers,
        };
        break;
      case SALADS:
        index = this.props.foodData.Salads.findIndex((x) => x._id === id);
        let Salads = [...this.props.foodData.Salads];
        food = { ...Salads[index] };
        food.MainIngredients = value;
        Salads[index] = food;
        payload = {
          Salads,
        };
        break;
      case MAIN_COURSE:
        index = this.props.foodData.MainCourse.findIndex((x) => x._id === id);
        let MainCourse = [...this.props.foodData.MainCourse];
        food = { ...MainCourse[index] };
        food.MainIngredients = value;
        MainCourse[index] = food;
        payload = {
          MainCourse,
        };
        break;
      case BEVERAGES:
        index = this.props.foodData.Beverages.findIndex((x) => x._id === id);
        let Beverages = [...this.props.foodData.Beverages];
        food = { ...Beverages[index] };
        food.MainIngredients = value;
        Beverages[index] = food;
        payload = {
          Beverages,
        };
        break;
      case DESSERTS:
        index = this.props.foodData.Desserts.findIndex((x) => x._id === id);
        let Desserts = [...this.props.foodData.Desserts];
        food = { ...Desserts[index] };
        food.MainIngredients = value;
        Desserts[index] = food;
        payload = {
          Desserts,
        };
        break;
      default:
        // console.log('wrong Input');
        break;
    }
    this.props.updateFoodData(payload);
  };
  onDescriptionChangeHandlerUpdate = (value, id, menuCategory) => {
    let index = null;
    let food = null;
    let payload = null;
    switch (this.state.showFoodCategory) {
      case APPETIZERS:
        index = this.props.foodData.Appetizers.findIndex((x) => x._id === id);
        let Appetizers = [...this.props.foodData.Appetizers];
        food = { ...Appetizers[index] };
        food.Description = value;
        Appetizers[index] = food;
        payload = {
          Appetizers,
        };
        break;
      case SALADS:
        index = this.props.foodData.Salads.findIndex((x) => x._id === id);
        let Salads = [...this.props.foodData.Salads];
        food = { ...Salads[index] };
        food.Description = value;
        Salads[index] = food;
        payload = {
          Salads,
        };
        break;
      case MAIN_COURSE:
        index = this.props.foodData.MainCourse.findIndex((x) => x._id === id);
        let MainCourse = [...this.props.foodData.MainCourse];
        food = { ...MainCourse[index] };
        food.Description = value;
        MainCourse[index] = food;
        payload = {
          MainCourse,
        };
        break;
      case BEVERAGES:
        index = this.props.foodData.Beverages.findIndex((x) => x._id === id);
        let Beverages = [...this.props.foodData.Beverages];
        food = { ...Beverages[index] };
        food.Description = value;
        Beverages[index] = food;
        payload = {
          Beverages,
        };
        break;
      case DESSERTS:
        index = this.props.foodData.Desserts.findIndex((x) => x._id === id);
        let Desserts = [...this.props.foodData.Desserts];
        food = { ...Desserts[index] };
        food.Description = value;
        Desserts[index] = food;
        payload = {
          Desserts,
        };
        break;
      default:
        // console.log('wrong Input');
        break;
    }
    this.props.updateFoodData(payload);
  };
  updateImageUrl = (value, id) => {
    let index = null;
    let food = null;
    let payload = null;
    switch (this.state.showFoodCategory) {
      case APPETIZERS:
        index = this.props.foodData.Appetizers.findIndex((x) => x._id === id);
        let Appetizers = [...this.props.foodData.Appetizers];
        food = { ...Appetizers[index] };
        food.ImageUrl = value;
        Appetizers[index] = food;
        payload = {
          Appetizers,
        };
        break;
      case SALADS:
        index = this.props.foodData.Salads.findIndex((x) => x._id === id);
        let Salads = [...this.props.foodData.Salads];
        food = { ...Salads[index] };
        food.ImageUrl = value;
        Salads[index] = food;
        payload = {
          Salads,
        };
        break;
      case MAIN_COURSE:
        index = this.props.foodData.MainCourse.findIndex((x) => x._id === id);
        let MainCourse = [...this.props.foodData.MainCourse];
        food = { ...MainCourse[index] };
        food.ImageUrl = value;
        MainCourse[index] = food;
        payload = {
          MainCourse,
        };
        break;
      case BEVERAGES:
        index = this.props.foodData.Beverages.findIndex((x) => x._id === id);
        let Beverages = [...this.props.foodData.Beverages];
        food = { ...Beverages[index] };
        food.ImageUrl = value;
        Beverages[index] = food;
        payload = {
          Beverages,
        };
        break;
      case DESSERTS:
        index = this.props.foodData.Desserts.findIndex((x) => x._id === id);
        let Desserts = [...this.props.foodData.Desserts];
        food = { ...Desserts[index] };
        food.ImageUrl = value;
        Desserts[index] = food;
        payload = {
          Desserts,
        };
        break;
      default:
        // console.log('wrong Input');
        break;
    }
    this.props.updateFoodData(payload);
  };

  //update old food item
  updateFoodItem = (FoodId, event) => {
    let index = null;
    let foodItem = null;
    switch (this.state.showFoodCategory) {
      case APPETIZERS:
        index = this.props.foodData.Appetizers.findIndex((x) => x._id === FoodId);
        foodItem = { ...this.props.foodData.Appetizers[index] };
        // console.log('Update food item', foodItem);
        break;
      case SALADS:
        index = this.props.foodData.Salads.findIndex((x) => x._id === FoodId);
        foodItem = { ...this.props.foodData.Salads[index] };
        // console.log('Update food item', foodItem);
        break;
      case MAIN_COURSE:
        index = this.props.foodData.MainCourse.findIndex((x) => x._id === FoodId);
        foodItem = { ...this.props.foodData.MainCourse[index] };
        // console.log('Update food item', foodItem);
        break;
      case BEVERAGES:
        index = this.props.foodData.Beverages.findIndex((x) => x._id === FoodId);
        foodItem = { ...this.props.foodData.Beverages[index] };
        // console.log('Update food item', foodItem);
        break;
      case DESSERTS:
        index = this.props.foodData.Desserts.findIndex((x) => x._id === FoodId);
        foodItem = { ...this.props.foodData.Desserts[index] };
        // console.log('Update food item', foodItem);
        break;
      default:
        // console.log('wrong Input');
        break;
    }

    foodItem = { ...foodItem, category: this.state.showFoodCategory };
    event.preventDefault();
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    axios.post(serverUrl + 'biz/updateFoodItem', foodItem).then(
      (response) => {
        // console.log('Status Code : ', response.status);
        if (response.status === 200) {
          // console.log(response.data);
          const payload = {
            success: true,
            message: response.data,
          };
          this.props.updateSnackbarData(payload);
          let tmpFood = {
            RestaurantID: localStorage.getItem('userId'),
            FoodName: '',
            MainIngredients: '',
            Cuisine: '',
            Description: '',
            ImageUrl: '',
            Price: '',
          };
          this.setState({ tmpFood, editableId: null });
          // newFoodId = { ...newFoodId, ...this.state.newFood };
        }
      },
      (error) => {
        // console.log(error);
      }
    );
  };

  //cancel Updating food, and revert back to orignal
  cancelFoodUpdate = (FoodId) => {
    let index = null;
    let foodItem = null;
    let tmpFood = {
      RestaurantID: localStorage.getItem('userId'),
      FoodName: '',
      MainIngredients: '',
      Cuisine: '',
      Description: '',
      ImageUrl: '',
      Price: '',
    };
    let payload = null;
    switch (this.state.showFoodCategory) {
      case APPETIZERS:
        index = this.props.foodData.Appetizers.findIndex((x) => x._id === FoodId);
        let Appetizers = [...this.props.foodData.Appetizers];
        foodItem = { ...Appetizers[index] };
        foodItem = { ...foodItem, ...this.state.tmpFood };
        Appetizers[index] = foodItem;
        payload = {
          Appetizers,
        };
        // this.props.updateFoodData(payload);
        break;
      case SALADS:
        index = this.props.foodData.Salads.findIndex((x) => x._id === FoodId);
        let Salads = [...this.props.foodData.Salads];
        foodItem = { ...Salads[index] };
        foodItem = { ...foodItem, ...this.state.tmpFood };
        Salads[index] = foodItem;
        payload = {
          Salads,
        };
        // this.props.updateFoodData(payload);
        break;
      case MAIN_COURSE:
        index = this.props.foodData.MainCourse.findIndex((x) => x._id === FoodId);
        let MainCourse = [...this.props.foodData.MainCourse];
        foodItem = { ...MainCourse[index] };
        foodItem = { ...foodItem, ...this.state.tmpFood };
        MainCourse[index] = foodItem;
        payload = {
          MainCourse,
        };
        // this.props.updateFoodData(payload);
        break;
      case BEVERAGES:
        index = this.props.foodData.Beverages.findIndex((x) => x._id === FoodId);
        let Beverages = [...this.props.foodData.Beverages];
        foodItem = { ...Beverages[index] };
        foodItem = { ...foodItem, ...this.state.tmpFood };
        Beverages[index] = foodItem;
        payload = {
          Beverages,
        };
        // this.props.updateFoodData(payload);
        break;
      case DESSERTS:
        index = this.props.foodData.Desserts.findIndex((x) => x._id === FoodId);
        let Desserts = [...this.props.foodData.Desserts];
        foodItem = { ...Desserts[index] };
        foodItem = { ...foodItem, ...this.state.tmpFood };
        Desserts[index] = foodItem;
        payload = {
          Desserts,
        };

        break;
      default:
        // console.log('wrong Input');
        break;
    }
    this.props.updateFoodData(payload);
    this.setState({ tmpFood, editableId: null });
  };

  onChangeFileHandlerOld = (event, id) => {
    if (event.target.files.length === 1) {
      event.preventDefault();
      let formData = new FormData();
      formData.append('file', event.target.files[0], event.target.files[0].name);
      axios({
        method: 'post',
        url: serverUrl + 'biz/uploadFoodImage',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      })
        .then((response) => {
          // console.log('Status Code : ', response.status);
          if (parseInt(response.status) === 200) {
            // console.log('Product Saved');

            this.updateImageUrl(response.data, id);
          } else if (parseInt(response.status) === 400) {
            // console.log(response.data);
          }
        })
        .catch((error) => {
          this.setState({
            errorMsg: error.message,
            authFlag: false,
          });
        });
      // this.setState({
      //   uploadedPic: event.target.files,
      // });
    }
  };

  render() {
    return (
      <div>
        <div className="job-form-section-group-styles__group--ArVfo" data-ui="education">
          <div className="job-form-section-group-styles__header--2Z5fi">
            <p id="education_label">Food Menu</p>
          </div>
          {/**Main div */}
          <div>
            {/**Foood category div */}

            <div>
              {/**Headin Div */}

              <div
                className=".job-form-section-group-styles__header--2Z5fi"
                style={{
                  padding: '5px',
                  justifyContent: 'space-between',
                  display: 'flex',
                  backgroundColor: '#0000004a',
                  boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.08)',
                  marginBottom: '4px',
                }}
              >
                <a
                  onClick={() => {
                    this.showMenuCategory(APPETIZERS);
                  }}
                >
                  <p style={{ color: '#000', cursor: 'pointer' }}>
                    <strong>APPETIZERS</strong>
                  </p>
                </a>
                {this.state.showFoodCategory === APPETIZERS && !this.state.addFoodItemForm && (
                  <button
                    onClick={this.openFoodForm}
                    data-ui="add-section"
                    aria-describedby="education_label"
                    className="_-_-shared-ui-atoms-button-base-___button__button _-_-shared-ui-atoms-button-base-___button__small _-_-shared-ui-atoms-button-secondary-___secondary__default "
                  >
                    + Add
                  </button>
                )}
                {this.state.showFoodCategory === APPETIZERS && this.state.addFoodItemForm && (
                  <button
                    onClick={this.openFoodForm}
                    data-ui="add-section"
                    aria-describedby="education_label"
                    className="_-_-shared-ui-atoms-button-base-___button__button _-_-shared-ui-atoms-button-base-___button__small _-_-shared-ui-atoms-button-secondary-___secondary__default "
                  >
                    - Cancel
                  </button>
                )}
              </div>

              {this.state.showFoodCategory === APPETIZERS && this.state.addFoodItemForm && (
                <div>
                  <NewFoodForm
                    // CUISINES={this.state.CUISINES}
                    // onNameChangeHandler={this.onNameChangeHandler}
                    onPriceChangeHandler={(evt) => this.onPriceChangeHandler(evt)}
                    onCusineChangeHandler={(evt) => this.onCusineChangeHandler(evt)}
                    onIngredentsChangeHandler={(evt) => this.onIngredentsChangeHandler(evt)}
                    onDescriptionChangeHandler={(evt) => this.onDescriptionChangeHandler(evt)}
                    onNameChangeHandler={(evt) => this.onNameChangeHandler(evt)}
                    food={this.state.newFood}
                    onChangeFileHandler={(event) => this.onChangeFileHandler(event)}
                    onSaveCreateNew={() => this.onSaveCreateNew()}
                  ></NewFoodForm>
                </div>
              )}
              {this.state.showFoodCategory === APPETIZERS && (
                <div>
                  <ul>
                    {this.props.foodData.Appetizers.map((food) => (
                      <Food
                        key={food._id}
                        food={food}
                        CUISINES={this.state.CUISINES}
                        editableId={this.state.editableId}
                        makeEditable={(ID) => this.makeEditable(ID)}
                        onDelete={(event) => this.deleteFoodItem(event, food._id)}
                        onCancelUpdate={() => this.cancelFoodUpdate(food._id)}
                        onSave={(event) => this.updateFoodItem(food._id, event)}
                        onNameChangeHandler={(evt, id) => this.onNameChangeHandlerUpdate(evt, id)}
                        onPriceChangeHandler={(evt, id) => this.onPriceChangeHandlerUpdate(evt, id)}
                        onCusineChangeHandler={(evt, id) =>
                          this.onCusineChangeHandlerUpdate(evt, id)
                        }
                        onIngredentsChangeHandler={(evt, id) =>
                          this.onIngredentsChangeHandlerUpdate(evt, id)
                        }
                        onDescriptionChangeHandler={(evt, id) =>
                          this.onDescriptionChangeHandlerUpdate(evt, id)
                        }
                        onChangeFileHandlerOld={(event) =>
                          this.onChangeFileHandlerOld(event, food._id)
                        }
                      />
                    ))}
                  </ul>
                  <ReactPaginate
                    previousLabel={'prev'}
                    nextLabel={'next'}
                    breakLabel={'...'}
                    breakClassName={'break-me'}
                    pageCount={this.props.foodData.PageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={2}
                    onPageChange={this.handlePageClick}
                    containerClassName={'pagination'}
                    subContainerClassName={'pages pagination'}
                    activeClassName={'active'}
                  />
                </div>
              )}
            </div>

            <div>
              {/**Headin Div */}
              <div
                className=".job-form-section-group-styles__header--2Z5fi"
                style={{
                  padding: '5px',
                  justifyContent: 'space-between',
                  display: 'flex',
                  backgroundColor: '#0000004a',
                  boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.08)',
                  marginBottom: '4px',
                }}
              >
                <a
                  onClick={() => {
                    this.showMenuCategory(SALADS);
                  }}
                >
                  <p style={{ color: '#000', cursor: 'pointer' }}>
                    <strong>SALADS</strong>
                  </p>
                </a>
                {this.state.showFoodCategory === SALADS && !this.state.addFoodItemForm && (
                  <button
                    onClick={this.openFoodForm}
                    data-ui="add-section"
                    aria-describedby="education_label"
                    className="_-_-shared-ui-atoms-button-base-___button__button _-_-shared-ui-atoms-button-base-___button__small _-_-shared-ui-atoms-button-secondary-___secondary__default "
                  >
                    + Add
                  </button>
                )}
                {this.state.showFoodCategory === SALADS && this.state.addFoodItemForm && (
                  <button
                    onClick={this.openFoodForm}
                    data-ui="add-section"
                    aria-describedby="education_label"
                    className="_-_-shared-ui-atoms-button-base-___button__button _-_-shared-ui-atoms-button-base-___button__small _-_-shared-ui-atoms-button-secondary-___secondary__default "
                  >
                    - Cancel
                  </button>
                )}
              </div>
              {/**New Form Div */}
              {this.state.showFoodCategory === SALADS && this.state.addFoodItemForm && (
                <div>
                  <NewFoodForm
                    // CUISINES={this.state.CUISINES}
                    // onNameChangeHandler={this.onNameChangeHandler}
                    onPriceChangeHandler={(evt) => this.onPriceChangeHandler(evt)}
                    onCusineChangeHandler={(evt) => this.onCusineChangeHandler(evt)}
                    onIngredentsChangeHandler={(evt) => this.onIngredentsChangeHandler(evt)}
                    onDescriptionChangeHandler={(evt) => this.onDescriptionChangeHandler(evt)}
                    onNameChangeHandler={(evt) => this.onNameChangeHandler(evt)}
                    onChangeFileHandler={(event) => this.onChangeFileHandler(event)}
                    food={this.state.newFood}
                    onSaveCreateNew={() => this.onSaveCreateNew()}
                  ></NewFoodForm>
                </div>
              )}
              {this.state.showFoodCategory === SALADS && (
                <div>
                  <ul>
                    {this.props.foodData.Salads.map((food) => (
                      <Food
                        food={food}
                        // CUISINES={this.state.CUISINES}
                        editableId={this.state.editableId}
                        makeEditable={(ID) => this.makeEditable(ID)}
                        onDelete={(event) => this.deleteFoodItem(event, food._id)}
                        onSave={(event) => this.updateFoodItem(food._id, event)}
                        onCancelUpdate={() => this.cancelFoodUpdate(food._id)}
                        onNameChangeHandler={(evt, id) => this.onNameChangeHandlerUpdate(evt, id)}
                        onPriceChangeHandler={(evt, id) => this.onPriceChangeHandlerUpdate(evt, id)}
                        onCusineChangeHandler={(evt, id) =>
                          this.onCusineChangeHandlerUpdate(evt, id)
                        }
                        onIngredentsChangeHandler={(evt, id) =>
                          this.onIngredentsChangeHandlerUpdate(evt, id)
                        }
                        onDescriptionChangeHandler={(evt, id) =>
                          this.onDescriptionChangeHandlerUpdate(evt, id)
                        }
                        onChangeFileHandlerOld={(event) =>
                          this.onChangeFileHandlerOld(event, food._id)
                        }
                      />
                    ))}
                  </ul>
                  <ReactPaginate
                    previousLabel={'prev'}
                    nextLabel={'next'}
                    breakLabel={'...'}
                    breakClassName={'break-me'}
                    pageCount={this.props.foodData.PageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={2}
                    onPageChange={this.handlePageClick}
                    containerClassName={'pagination'}
                    subContainerClassName={'pages pagination'}
                    activeClassName={'active'}
                  />
                </div>
              )}
            </div>
            <div>
              {/**Headin Div */}
              <div
                className=".job-form-section-group-styles__header--2Z5fi"
                style={{
                  padding: '5px',
                  justifyContent: 'space-between',
                  display: 'flex',
                  backgroundColor: '#0000004a',
                  boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.08)',
                  marginBottom: '4px',
                }}
              >
                <a
                  onClick={() => {
                    this.showMenuCategory(MAIN_COURSE);
                  }}
                >
                  <p style={{ color: '#000', cursor: 'pointer' }}>
                    <strong>MAIN COURSE</strong>
                  </p>
                </a>
                {this.state.showFoodCategory === MAIN_COURSE && !this.state.addFoodItemForm && (
                  <button
                    onClick={this.openFoodForm}
                    data-ui="add-section"
                    aria-describedby="education_label"
                    className="_-_-shared-ui-atoms-button-base-___button__button _-_-shared-ui-atoms-button-base-___button__small _-_-shared-ui-atoms-button-secondary-___secondary__default "
                  >
                    + Add
                  </button>
                )}

                {this.state.showFoodCategory === MAIN_COURSE && this.state.addFoodItemForm && (
                  <button
                    onClick={this.openFoodForm}
                    data-ui="add-section"
                    aria-describedby="education_label"
                    className="_-_-shared-ui-atoms-button-base-___button__button _-_-shared-ui-atoms-button-base-___button__small _-_-shared-ui-atoms-button-secondary-___secondary__default "
                  >
                    - Cancel
                  </button>
                )}
              </div>
              {/**New Form Div */}
              {this.state.showFoodCategory === MAIN_COURSE && this.state.addFoodItemForm && (
                <div>
                  <NewFoodForm
                    // CUISINES={this.state.CUISINES}
                    // onNameChangeHandler={this.onNameChangeHandler}
                    onPriceChangeHandler={(evt) => this.onPriceChangeHandler(evt)}
                    onCusineChangeHandler={(evt) => this.onCusineChangeHandler(evt)}
                    onIngredentsChangeHandler={(evt) => this.onIngredentsChangeHandler(evt)}
                    onDescriptionChangeHandler={(evt) => this.onDescriptionChangeHandler(evt)}
                    onNameChangeHandler={(evt) => this.onNameChangeHandler(evt)}
                    onChangeFileHandler={(event) => this.onChangeFileHandler(event)}
                    food={this.state.newFood}
                    onSaveCreateNew={() => this.onSaveCreateNew()}
                  ></NewFoodForm>
                </div>
              )}
              {this.state.showFoodCategory === MAIN_COURSE && (
                <div>
                  <ul>
                    {this.props.foodData.MainCourse.map((food) => (
                      <Food
                        food={food}
                        // CUISINES={this.state.CUISINES}
                        editableId={this.state.editableId}
                        makeEditable={(ID) => this.makeEditable(ID)}
                        onDelete={(event) => this.deleteFoodItem(event, food._id)}
                        onSave={(event) => this.updateFoodItem(food._id, event)}
                        onCancelUpdate={() => this.cancelFoodUpdate(food._id)}
                        onNameChangeHandler={(evt, id) => this.onNameChangeHandlerUpdate(evt, id)}
                        onPriceChangeHandler={(evt, id) => this.onPriceChangeHandlerUpdate(evt, id)}
                        onCusineChangeHandler={(evt, id) =>
                          this.onCusineChangeHandlerUpdate(evt, id)
                        }
                        onIngredentsChangeHandler={(evt, id) =>
                          this.onIngredentsChangeHandlerUpdate(evt, id)
                        }
                        onDescriptionChangeHandler={(evt, id) =>
                          this.onDescriptionChangeHandlerUpdate(evt, id)
                        }
                        onChangeFileHandlerOld={(event) =>
                          this.onChangeFileHandlerOld(event, food._id)
                        }
                      />
                    ))}
                  </ul>
                  <ReactPaginate
                    previousLabel={'prev'}
                    nextLabel={'next'}
                    breakLabel={'...'}
                    breakClassName={'break-me'}
                    pageCount={this.props.foodData.PageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={2}
                    onPageChange={this.handlePageClick}
                    containerClassName={'pagination'}
                    subContainerClassName={'pages pagination'}
                    activeClassName={'active'}
                  />
                </div>
              )}
            </div>
            <div>
              {/**Headin Div */}
              <div
                className=".job-form-section-group-styles__header--2Z5fi"
                style={{
                  padding: '5px',
                  justifyContent: 'space-between',
                  display: 'flex',
                  backgroundColor: '#0000004a',
                  boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.08)',
                  marginBottom: '4px',
                }}
              >
                <a
                  onClick={() => {
                    this.showMenuCategory(BEVERAGES);
                  }}
                >
                  <p style={{ color: '#000', cursor: 'pointer' }}>
                    <strong>BEVERAGES</strong>
                  </p>
                </a>
                {this.state.showFoodCategory === BEVERAGES && !this.state.addFoodItemForm && (
                  <button
                    onClick={this.openFoodForm}
                    data-ui="add-section"
                    aria-describedby="education_label"
                    className="_-_-shared-ui-atoms-button-base-___button__button _-_-shared-ui-atoms-button-base-___button__small _-_-shared-ui-atoms-button-secondary-___secondary__default "
                  >
                    + Add
                  </button>
                )}

                {this.state.showFoodCategory === BEVERAGES && this.state.addFoodItemForm && (
                  <button
                    onClick={this.openFoodForm}
                    data-ui="add-section"
                    aria-describedby="education_label"
                    className="_-_-shared-ui-atoms-button-base-___button__button _-_-shared-ui-atoms-button-base-___button__small _-_-shared-ui-atoms-button-secondary-___secondary__default "
                  >
                    - Cancel
                  </button>
                )}
              </div>
              {/**New Form Div */}
              {this.state.showFoodCategory === BEVERAGES && this.state.addFoodItemForm && (
                <div>
                  <NewFoodForm
                    // CUISINES={this.state.CUISINES}
                    // onNameChangeHandler={this.onNameChangeHandler}
                    onPriceChangeHandler={(evt) => this.onPriceChangeHandler(evt)}
                    onCusineChangeHandler={(evt) => this.onCusineChangeHandler(evt)}
                    onIngredentsChangeHandler={(evt) => this.onIngredentsChangeHandler(evt)}
                    onDescriptionChangeHandler={(evt) => this.onDescriptionChangeHandler(evt)}
                    onNameChangeHandler={(evt) => this.onNameChangeHandler(evt)}
                    onChangeFileHandler={(event) => this.onChangeFileHandler(event)}
                    food={this.state.newFood}
                    onSaveCreateNew={() => this.onSaveCreateNew()}
                  ></NewFoodForm>
                </div>
              )}
              {this.state.showFoodCategory === BEVERAGES && (
                <div>
                  <ul>
                    {this.props.foodData.Beverages.map((food) => (
                      <Food
                        food={food}
                        // CUISINES={this.state.CUISINES}
                        editableId={this.state.editableId}
                        makeEditable={(ID) => this.makeEditable(ID)}
                        onDelete={(event) => this.deleteFoodItem(event, food._id)}
                        onSave={(event) => this.updateFoodItem(food._id, event)}
                        onCancelUpdate={() => this.cancelFoodUpdate(food._id)}
                        onNameChangeHandler={(evt, id) => this.onNameChangeHandlerUpdate(evt, id)}
                        onPriceChangeHandler={(evt, id) => this.onPriceChangeHandlerUpdate(evt, id)}
                        onCusineChangeHandler={(evt, id) =>
                          this.onCusineChangeHandlerUpdate(evt, id)
                        }
                        onIngredentsChangeHandler={(evt, id) =>
                          this.onIngredentsChangeHandlerUpdate(evt, id)
                        }
                        onDescriptionChangeHandler={(evt, id) =>
                          this.onDescriptionChangeHandlerUpdate(evt, id)
                        }
                        onChangeFileHandlerOld={(event) =>
                          this.onChangeFileHandlerOld(event, food._id)
                        }
                      />
                    ))}
                  </ul>
                  <ReactPaginate
                    previousLabel={'prev'}
                    nextLabel={'next'}
                    breakLabel={'...'}
                    breakClassName={'break-me'}
                    pageCount={this.props.foodData.PageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={2}
                    onPageChange={this.handlePageClick}
                    containerClassName={'pagination'}
                    subContainerClassName={'pages pagination'}
                    activeClassName={'active'}
                  />
                </div>
              )}
            </div>
            <div>
              {/**Headin Div */}
              <div
                className=".job-form-section-group-styles__header--2Z5fi"
                style={{
                  padding: '5px',
                  justifyContent: 'space-between',
                  display: 'flex',
                  backgroundColor: '#0000004a',
                  boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.08)',
                  marginBottom: '4px',
                }}
              >
                <a
                  onClick={() => {
                    this.showMenuCategory(DESSERTS);
                  }}
                >
                  <p style={{ color: '#000', cursor: 'pointer' }}>
                    <strong>DESSERTS</strong>
                  </p>
                </a>
                {this.state.showFoodCategory === DESSERTS && !this.state.addFoodItemForm && (
                  <button
                    onClick={this.openFoodForm}
                    data-ui="add-section"
                    aria-describedby="education_label"
                    className="_-_-shared-ui-atoms-button-base-___button__button _-_-shared-ui-atoms-button-base-___button__small _-_-shared-ui-atoms-button-secondary-___secondary__default "
                  >
                    + Add
                  </button>
                )}

                {this.state.showFoodCategory === DESSERTS && this.state.addFoodItemForm && (
                  <button
                    onClick={this.openFoodForm}
                    data-ui="add-section"
                    aria-describedby="education_label"
                    className="_-_-shared-ui-atoms-button-base-___button__button _-_-shared-ui-atoms-button-base-___button__small _-_-shared-ui-atoms-button-secondary-___secondary__default "
                  >
                    - Cancel
                  </button>
                )}
              </div>
              {/**New Form Div */}
              {this.state.showFoodCategory === DESSERTS && this.state.addFoodItemForm && (
                <div>
                  <NewFoodForm
                    // CUISINES={this.state.CUISINES}
                    // onNameChangeHandler={this.onNameChangeHandler}
                    onPriceChangeHandler={(evt) => this.onPriceChangeHandler(evt)}
                    onCusineChangeHandler={(evt) => this.onCusineChangeHandler(evt)}
                    onIngredentsChangeHandler={(evt) => this.onIngredentsChangeHandler(evt)}
                    onDescriptionChangeHandler={(evt) => this.onDescriptionChangeHandler(evt)}
                    onNameChangeHandler={(evt) => this.onNameChangeHandler(evt)}
                    onChangeFileHandler={(event) => this.onChangeFileHandler(event)}
                    food={this.state.newFood}
                    onSaveCreateNew={() => this.onSaveCreateNew()}
                  ></NewFoodForm>
                </div>
              )}
              {this.state.showFoodCategory === DESSERTS && (
                <div>
                  <ul>
                    {this.props.foodData.Desserts.map((food) => (
                      <Food
                        food={food}
                        // CUISINES={this.state.CUISINES}
                        onDelete={(event) => this.deleteFoodItem(event, food._id)}
                        editableId={this.state.editableId}
                        makeEditable={(ID) => this.makeEditable(ID)}
                        onSave={(event) => this.updateFoodItem(food._id, event)}
                        onCancelUpdate={() => this.cancelFoodUpdate(food._id)}
                        onNameChangeHandler={(evt, id) => this.onNameChangeHandlerUpdate(evt, id)}
                        onPriceChangeHandler={(evt, id) => this.onPriceChangeHandlerUpdate(evt, id)}
                        onCusineChangeHandler={(evt, id) =>
                          this.onCusineChangeHandlerUpdate(evt, id)
                        }
                        onIngredentsChangeHandler={(evt, id) =>
                          this.onIngredentsChangeHandlerUpdate(evt, id)
                        }
                        onDescriptionChangeHandler={(evt, id) =>
                          this.onDescriptionChangeHandlerUpdate(evt, id)
                        }
                        onChangeFileHandlerOld={(event) =>
                          this.onChangeFileHandlerOld(event, food._id)
                        }
                      />
                    ))}
                  </ul>
                  <ReactPaginate
                    previousLabel={'prev'}
                    nextLabel={'next'}
                    breakLabel={'...'}
                    breakClassName={'break-me'}
                    pageCount={this.props.foodData.PageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={2}
                    onPageChange={this.handlePageClick}
                    containerClassName={'pagination'}
                    subContainerClassName={'pages pagination'}
                    activeClassName={'active'}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { foodData } = state.restaurntFoodMenuReducer;
  return {
    foodData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateFoodData: (payload) => {
      dispatch({
        type: updateFoodData,
        payload,
      });
    },
    updateSnackbarData: (payload) => {
      dispatch({
        type: updateSnackbarData,
        payload,
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FoodMenu);
