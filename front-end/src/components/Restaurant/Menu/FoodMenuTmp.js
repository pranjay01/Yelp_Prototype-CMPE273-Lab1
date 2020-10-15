import React, { Component } from 'react';
import axios from 'axios';
import serverUrl from '../../../config';
import './FoodMenu.css';
import Food from './Food';
import NewFoodForm from './NewFoodForm';
import { connect } from 'react-redux';
import { updateFoodData } from '../../../constants/action-types';
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
        MenuCategoryName: '',
        MainIngredients: '',
        Cuisine: '',
        Description: '',
        ImageUrl: '',
        Price: '',
      },
      tmpFood: {
        RestaurantID: localStorage.getItem('userId'),
        FoodName: '',
        MenuCategoryName: '',
        MainIngredients: '',
        Cuisine: '',
        Description: '',
        ImageUrl: '',
        Price: '',
      },
      editableId: null,
      editableCategory: '',
    };
  }
  // Call On render
  componentDidMount() {
    // if (localStorage.getItem('showFoodCategory')) {
    //   this.showMenuCategory(localStorage.getItem('showFoodCategory'));
    // }
    axios
      .get(serverUrl + 'biz/getFoodData', {
        params: { RestaurantID: localStorage.getItem('userId') },
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
        let Cuisines = response.data[0].map((cuisine) => {
          return { key: cuisine._id, value: cuisine.CuisineName };
        });
        let FoodItems = response.data[1].map((food) => {
          return { ...food };
        });
        let payload = {
          Cuisines,
          FoodItems,
        };
        this.props.updateFoodData(payload);
      });
  }

  // open or hide on select menu and fetch data if not in state
  showMenuCategory = (menuCategory) => {
    let tmp = {
      RestaurantID: '',
      FoodName: '',
      MenuCategoryName: '',
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
      });
    }
  };

  //on successfull delete remove from state also
  deleteFoodItem = (event, foodId) => {
    event.preventDefault();
    // let category = this.state.showFoodCategory;
    const data = {
      _id: foodId,
    };
    // console.log('Delete Appetizer Food:', foodId, 'catefory: ', category);
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    axios.post(serverUrl + 'biz/deleteFoodItem', data).then(
      (response) => {
        console.log('Status Code : ', response.status);
        if (response.status === 200) {
          console.log(response.data);
          let tmpFoodItems = [...this.props.foodData.FoodItems];
          const index = tmpFoodItems.findIndex((x) => x._id === foodId);
          tmpFoodItems.splice(index, 1);
          let payload = {
            FoodItems: tmpFoodItems,
          };
          this.props.updateFoodData(payload);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };

  //Open or close Food Addition FOrm
  openFoodForm = () => {
    if (this.state.addFoodItemForm) {
      let tmp = {
        RestaurantID: localStorage.getItem('userId'),
        FoodName: '',
        MenuCategoryName: '',
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

  // change editable food state
  makeEditable = (FoodId) => {
    const index = this.props.foodData.FoodItems.findIndex((x) => x._id === FoodId);
    const foodItem = { ...this.props.foodData.FoodItems[index] };

    let newFood = {
      RestaurantID: localStorage.getItem('userId'),
      FoodName: '',
      MenuCategoryName: '',
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
  };

  // onCHange handlers for old food items
  onNameChangeHandlerUpdate = (value, id) => {
    const index = this.props.foodData.FoodItems.findIndex((x) => x._id === id);
    // 1. Make a shallow copy of the items
    let FoodItems = [...this.props.foodData.FoodItems];
    // 2. Make a shallow copy of the item you want to mutate
    let food = { ...FoodItems[index] };
    // 3. Replace the property you're intested in
    food.FoodName = value;
    // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
    FoodItems[index] = food;
    // 5. Set the state to our new copy
    let payload = {
      FoodItems,
    };
    this.props.updateFoodData(payload);
  };
  onPriceChangeHandlerUpdate = (value, id) => {
    const index = this.props.foodData.FoodItems.findIndex((x) => x._id === id);
    let FoodItems = [...this.props.foodData.FoodItems];
    let food = { ...FoodItems[index] };
    food.Price = value;
    FoodItems[index] = food;
    let payload = {
      FoodItems,
    };
    this.props.updateFoodData(payload);
  };
  onCusineChangeHandlerUpdate = (value, id) => {
    const index = this.props.foodData.FoodItems.findIndex((x) => x._id === id);
    let FoodItems = [...this.props.foodData.FoodItems];
    let food = { ...FoodItems[index] };
    food.Cuisine = value;
    FoodItems[index] = food;
    let payload = {
      FoodItems,
    };
    this.props.updateFoodData(payload);
  };
  onIngredentsChangeHandlerUpdate = (value, id) => {
    const index = this.props.foodData.FoodItems.findIndex((x) => x._id === id);
    let FoodItems = [...this.props.foodData.FoodItems];
    let food = { ...FoodItems[index] };
    food.MainIngredients = value;
    FoodItems[index] = food;
    let payload = {
      FoodItems,
    };
    this.props.updateFoodData(payload);
  };
  onDescriptionChangeHandlerUpdate = (value, id) => {
    const index = this.props.foodData.FoodItems.findIndex((x) => x._id === id);
    let FoodItems = [...this.props.foodData.FoodItems];
    let food = { ...FoodItems[index] };
    food.Description = value;
    FoodItems[index] = food;
    let payload = {
      FoodItems,
    };
    this.props.updateFoodData(payload);
  };

  updateImageUrl = (value, id) => {
    const index = this.props.foodData.FoodItems.findIndex((x) => x._id === id);
    let FoodItems = [...this.props.foodData.FoodItems];
    let food = { ...FoodItems[index] };
    food.ImageUrl = value;
    FoodItems[index] = food;
    let payload = {
      FoodItems,
    };
    this.props.updateFoodData(payload);
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
          console.log('Status Code : ', response.status);
          if (parseInt(response.status) === 200) {
            console.log('Product Saved');
            let tmp = { ImageUrl: response.data };
            this.updateImageUrl(response.data, id);
          } else if (parseInt(response.status) === 400) {
            console.log(response.data);
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

  //update old food item
  updateFoodItem = (FoodId, event) => {
    const index = this.props.foodData.FoodItems.findIndex((x) => x._id === FoodId);
    const foodItem = { ...this.props.foodData.FoodItems[index] };

    event.preventDefault();
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    axios.post(serverUrl + 'biz/updateFoodItem', foodItem).then(
      (response) => {
        console.log('Status Code : ', response.status);
        if (response.status === 200) {
          console.log(response.data);
          let tmpFood = {
            _id: '',
            RestaurantID: '',
            FoodName: '',
            MenuCategoryName: '',
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
        console.log(error);
      }
    );
  };

  //cancel Updating food, and revert back to orignal
  cancelFoodUpdate = (FoodId) => {
    const index = this.props.foodData.FoodItems.findIndex((x) => x._id === FoodId);
    let FoodItems = [...this.props.foodData.FoodItems];
    const foodItem = { ...this.state.tmpFood };
    FoodItems[index] = foodItem;
    let payload = {
      FoodItems,
    };
    this.props.updateFoodData(payload);
    let tmpFood = {
      ID: null,
      category: '',
      Name: '',
      MainIngredients: '',
      CuisineID: null,
      Description: '',
      Price: null,
    };
    this.setState({ tmpFood, editableId: null });
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
          console.log('Status Code : ', response.status);
          if (parseInt(response.status) === 200) {
            let tmp = { ImageUrl: response.data };
            this.setState({
              newFood: { ...this.state.newFood, ...tmp },
            });
            //Router.push('/vendor/' + localStorage.getItem('user_id'));
          } else if (parseInt(response.status) === 400) {
            console.log(response.data);
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

  onSaveCreateNew = (event) => {
    event.preventDefault();
    const data = {
      ...this.state.newFood,
      MenuCategoryName: localStorage.getItem('showFoodCategory'),
    };
    //set the with credentials to true
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    axios.post(serverUrl + 'biz/insertFood', data).then(
      (response) => {
        console.log('Status Code : ', response.status);
        if (response.status === 200) {
          console.log(response.data);
          let FoodItems = this.props.foodData.FoodItems;
          FoodItems.push(response.data);

          let payload = {
            FoodItems,
          };
          this.props.updateFoodData(payload);
        }
      },
      (error) => {
        console.log(error);
      }
    );
    let newFood = {
      RestaurantID: localStorage.getItem('userId'),
      FoodName: '',
      MenuCategoryName: '',
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
  render() {
    return (
      <div>
        <div class="job-form-section-group-styles__group--ArVfo" data-ui="education">
          <div class="job-form-section-group-styles__header--2Z5fi">
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
                    this.showMenuCategory('APPETIZERS');
                  }}
                >
                  <p style={{ color: '#000', cursor: 'pointer' }}>
                    <strong>APPETIZERS</strong>
                  </p>
                </a>
                {this.state.showFoodCategory === 'APPETIZERS' && !this.state.addFoodItemForm && (
                  <button
                    onClick={this.openFoodForm}
                    data-ui="add-section"
                    aria-describedby="education_label"
                    class="_-_-shared-ui-atoms-button-base-___button__button _-_-shared-ui-atoms-button-base-___button__small _-_-shared-ui-atoms-button-secondary-___secondary__default "
                  >
                    + Add
                  </button>
                )}
                {this.state.showFoodCategory === 'APPETIZERS' && this.state.addFoodItemForm && (
                  <button
                    onClick={this.openFoodForm}
                    data-ui="add-section"
                    aria-describedby="education_label"
                    class="_-_-shared-ui-atoms-button-base-___button__button _-_-shared-ui-atoms-button-base-___button__small _-_-shared-ui-atoms-button-secondary-___secondary__default "
                  >
                    - Cancel
                  </button>
                )}
              </div>

              {this.state.showFoodCategory === 'APPETIZERS' && this.state.addFoodItemForm && (
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
                    onSaveCreateNew={(event) => this.onSaveCreateNew(event)}
                  ></NewFoodForm>
                </div>
              )}
              {this.state.showFoodCategory === 'APPETIZERS' && (
                <div>
                  <ul>
                    {this.props.foodData.FoodItems.map(
                      (food) =>
                        food.MenuCategoryName === 'APPETIZERS' && (
                          <Food
                            food={food}
                            CUISINES={this.state.CUISINES}
                            editableId={this.state.editableId}
                            makeEditable={(ID) => this.makeEditable(ID)}
                            onDelete={(event) => this.deleteFoodItem(event, food._id)}
                            onCancelUpdate={() => this.cancelFoodUpdate(food._id)}
                            onSave={(event) => this.updateFoodItem(food._id, event)}
                            onNameChangeHandler={(evt, id) =>
                              this.onNameChangeHandlerUpdate(evt, id)
                            }
                            onPriceChangeHandler={(evt, id) =>
                              this.onPriceChangeHandlerUpdate(evt, id)
                            }
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
                        )
                    )}
                  </ul>
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
                temp
                datatemp
                datatemp
                data
              >
                <a
                  onClick={() => {
                    this.showMenuCategory('SALADS');
                  }}
                >
                  <p style={{ color: '#000', cursor: 'pointer' }}>
                    <strong>SALADS</strong>
                  </p>
                </a>
                {this.state.showFoodCategory === 'SALADS' && !this.state.addFoodItemForm && (
                  <button
                    onClick={this.openFoodForm}
                    data-ui="add-section"
                    aria-describedby="education_label"
                    class="_-_-shared-ui-atoms-button-base-___button__button _-_-shared-ui-atoms-button-base-___button__small _-_-shared-ui-atoms-button-secondary-___secondary__default "
                  >
                    + Add
                  </button>
                )}
                {this.state.showFoodCategory === 'SALADS' && this.state.addFoodItemForm && (
                  <button
                    onClick={this.openFoodForm}
                    data-ui="add-section"
                    aria-describedby="education_label"
                    class="_-_-shared-ui-atoms-button-base-___button__button _-_-shared-ui-atoms-button-base-___button__small _-_-shared-ui-atoms-button-secondary-___secondary__default "
                  >
                    - Cancel
                  </button>
                )}
              </div>
              {/**New Form Div */}
              {this.state.showFoodCategory === 'SALADS' && this.state.addFoodItemForm && (
                <div>
                  <NewFoodForm
                    CUISINES={this.state.CUISINES}
                    // onNameChangeHandler={this.onNameChangeHandler}
                    onPriceChangeHandler={(evt) => this.onPriceChangeHandler(evt)}
                    onCusineChangeHandler={(evt) => this.onCusineChangeHandler(evt)}
                    onIngredentsChangeHandler={(evt) => this.onIngredentsChangeHandler(evt)}
                    onDescriptionChangeHandler={(evt) => this.onDescriptionChangeHandler(evt)}
                    onNameChangeHandler={(evt) => this.onNameChangeHandler(evt)}
                    onChangeFileHandler={(event) => this.onChangeFileHandler(event)}
                    food={this.state.newFood}
                    onSaveCreateNew={(event) => this.onSaveCreateNew(event)}
                  ></NewFoodForm>
                </div>
              )}
              {this.state.showFoodCategory === 'SALADS' && (
                <div>
                  <ul>
                    {this.props.foodData.FoodItems.map(
                      (food) =>
                        food.MenuCategoryName === 'SALADS' && (
                          <Food
                            food={food}
                            CUISINES={this.state.CUISINES}
                            editableId={this.state.editableId}
                            makeEditable={(ID) => this.makeEditable(ID)}
                            onDelete={(event, id) => this.deleteFoodItem(event, food._id)}
                            onSave={(event) => this.updateFoodItem(food._id, event)}
                            onCancelUpdate={() => this.cancelFoodUpdate(food._id)}
                            onNameChangeHandler={(evt, id) =>
                              this.onNameChangeHandlerUpdate(evt, id)
                            }
                            onPriceChangeHandler={(evt, id) =>
                              this.onPriceChangeHandlerUpdate(evt, id)
                            }
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
                        )
                    )}
                  </ul>
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
                    this.showMenuCategory('MAIN_COURSE');
                  }}
                >
                  <p style={{ color: '#000', cursor: 'pointer' }}>
                    <strong>MAIN COURSE</strong>
                  </p>
                </a>
                {this.state.showFoodCategory === 'MAIN_COURSE' && !this.state.addFoodItemForm && (
                  <button
                    onClick={this.openFoodForm}
                    data-ui="add-section"
                    aria-describedby="education_label"
                    class="_-_-shared-ui-atoms-button-base-___button__button _-_-shared-ui-atoms-button-base-___button__small _-_-shared-ui-atoms-button-secondary-___secondary__default "
                  >
                    + Add
                  </button>
                )}

                {this.state.showFoodCategory === 'MAIN_COURSE' && this.state.addFoodItemForm && (
                  <button
                    onClick={this.openFoodForm}
                    data-ui="add-section"
                    aria-describedby="education_label"
                    class="_-_-shared-ui-atoms-button-base-___button__button _-_-shared-ui-atoms-button-base-___button__small _-_-shared-ui-atoms-button-secondary-___secondary__default "
                  >
                    - Cancel
                  </button>
                )}
              </div>
              {/**New Form Div */}
              {this.state.showFoodCategory === 'MAIN_COURSE' && this.state.addFoodItemForm && (
                <div>
                  <NewFoodForm
                    CUISINES={this.state.CUISINES}
                    // onNameChangeHandler={this.onNameChangeHandler}
                    onPriceChangeHandler={(evt) => this.onPriceChangeHandler(evt)}
                    onCusineChangeHandler={(evt) => this.onCusineChangeHandler(evt)}
                    onIngredentsChangeHandler={(evt) => this.onIngredentsChangeHandler(evt)}
                    onDescriptionChangeHandler={(evt) => this.onDescriptionChangeHandler(evt)}
                    onNameChangeHandler={(evt) => this.onNameChangeHandler(evt)}
                    onChangeFileHandler={(event) => this.onChangeFileHandler(event)}
                    food={this.state.newFood}
                    onSaveCreateNew={(event) => this.onSaveCreateNew(event)}
                  ></NewFoodForm>
                </div>
              )}
              {this.state.showFoodCategory === 'MAIN_COURSE' && (
                <div>
                  <ul>
                    {this.props.foodData.FoodItems.map(
                      (food) =>
                        food.MenuCategoryName === 'MAIN_COURSE' && (
                          <Food
                            food={food}
                            CUISINES={this.state.CUISINES}
                            editableId={this.state.editableId}
                            makeEditable={(ID) => this.makeEditable(ID)}
                            onDelete={(event, id) => this.deleteFoodItem(event, food._id)}
                            onSave={(event) => this.updateFoodItem(food._id, event)}
                            onCancelUpdate={() => this.cancelFoodUpdate(food._id)}
                            onNameChangeHandler={(evt, id) =>
                              this.onNameChangeHandlerUpdate(evt, id)
                            }
                            onPriceChangeHandler={(evt, id) =>
                              this.onPriceChangeHandlerUpdate(evt, id)
                            }
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
                        )
                    )}
                  </ul>
                  <ReactPaginate
                    previousLabel={'prev'}
                    nextLabel={'next'}
                    breakLabel={'...'}
                    breakClassName={'break-me'}
                    pageCount={6}
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
                    this.showMenuCategory('BEVERAGES');
                  }}
                >
                  <p style={{ color: '#000', cursor: 'pointer' }}>
                    <strong>BEVERAGES</strong>
                  </p>
                </a>
                {this.state.showFoodCategory === 'BEVERAGES' && !this.state.addFoodItemForm && (
                  <button
                    onClick={this.openFoodForm}
                    data-ui="add-section"
                    aria-describedby="education_label"
                    class="_-_-shared-ui-atoms-button-base-___button__button _-_-shared-ui-atoms-button-base-___button__small _-_-shared-ui-atoms-button-secondary-___secondary__default "
                  >
                    + Add
                  </button>
                )}

                {this.state.showFoodCategory === 'BEVERAGES' && this.state.addFoodItemForm && (
                  <button
                    onClick={this.openFoodForm}
                    data-ui="add-section"
                    aria-describedby="education_label"
                    class="_-_-shared-ui-atoms-button-base-___button__button _-_-shared-ui-atoms-button-base-___button__small _-_-shared-ui-atoms-button-secondary-___secondary__default "
                  >
                    - Cancel
                  </button>
                )}
              </div>
              {/**New Form Div */}
              {this.state.showFoodCategory === 'BEVERAGES' && this.state.addFoodItemForm && (
                <div>
                  <NewFoodForm
                    CUISINES={this.state.CUISINES}
                    // onNameChangeHandler={this.onNameChangeHandler}
                    onPriceChangeHandler={(evt) => this.onPriceChangeHandler(evt)}
                    onCusineChangeHandler={(evt) => this.onCusineChangeHandler(evt)}
                    onIngredentsChangeHandler={(evt) => this.onIngredentsChangeHandler(evt)}
                    onDescriptionChangeHandler={(evt) => this.onDescriptionChangeHandler(evt)}
                    onNameChangeHandler={(evt) => this.onNameChangeHandler(evt)}
                    onChangeFileHandler={(event) => this.onChangeFileHandler(event)}
                    food={this.state.newFood}
                    onSaveCreateNew={(event) => this.onSaveCreateNew(event)}
                  ></NewFoodForm>
                </div>
              )}
              {this.state.showFoodCategory === 'BEVERAGES' && (
                <div>
                  <ul>
                    {this.props.foodData.FoodItems.map(
                      (food) =>
                        food.MenuCategoryName === 'BEVERAGES' && (
                          <Food
                            food={food}
                            CUISINES={this.state.CUISINES}
                            editableId={this.state.editableId}
                            makeEditable={(ID) => this.makeEditable(ID)}
                            onDelete={(event, id) => this.deleteFoodItem(event, food._id)}
                            onSave={(event) => this.updateFoodItem(food._id, event)}
                            onCancelUpdate={() => this.cancelFoodUpdate(food._id)}
                            onNameChangeHandler={(evt, id) =>
                              this.onNameChangeHandlerUpdate(evt, id)
                            }
                            onPriceChangeHandler={(evt, id) =>
                              this.onPriceChangeHandlerUpdate(evt, id)
                            }
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
                        )
                    )}
                  </ul>
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
                    this.showMenuCategory('DESSERTS');
                  }}
                >
                  <p style={{ color: '#000', cursor: 'pointer' }}>
                    <strong>DESSERTS</strong>
                  </p>
                </a>
                {this.state.showFoodCategory === 'DESSERTS' && !this.state.addFoodItemForm && (
                  <button
                    onClick={this.openFoodForm}
                    data-ui="add-section"
                    aria-describedby="education_label"
                    class="_-_-shared-ui-atoms-button-base-___button__button _-_-shared-ui-atoms-button-base-___button__small _-_-shared-ui-atoms-button-secondary-___secondary__default "
                  >
                    + Add
                  </button>
                )}

                {this.state.showFoodCategory === 'DESSERTS' && this.state.addFoodItemForm && (
                  <button
                    onClick={this.openFoodForm}
                    data-ui="add-section"
                    aria-describedby="education_label"
                    class="_-_-shared-ui-atoms-button-base-___button__button _-_-shared-ui-atoms-button-base-___button__small _-_-shared-ui-atoms-button-secondary-___secondary__default "
                  >
                    - Cancel
                  </button>
                )}
              </div>
              {/**New Form Div */}
              {this.state.showFoodCategory === 'DESSERTS' && this.state.addFoodItemForm && (
                <div>
                  <NewFoodForm
                    CUISINES={this.state.CUISINES}
                    // onNameChangeHandler={this.onNameChangeHandler}
                    onPriceChangeHandler={(evt) => this.onPriceChangeHandler(evt)}
                    onCusineChangeHandler={(evt) => this.onCusineChangeHandler(evt)}
                    onIngredentsChangeHandler={(evt) => this.onIngredentsChangeHandler(evt)}
                    onDescriptionChangeHandler={(evt) => this.onDescriptionChangeHandler(evt)}
                    onNameChangeHandler={(evt) => this.onNameChangeHandler(evt)}
                    onChangeFileHandler={(event) => this.onChangeFileHandler(event)}
                    food={this.state.newFood}
                    onSaveCreateNew={(event) => this.onSaveCreateNew(event)}
                  ></NewFoodForm>
                </div>
              )}
              {this.state.showFoodCategory === 'DESSERTS' && (
                <div>
                  <ul>
                    {this.props.foodData.FoodItems.map(
                      (food) =>
                        food.MenuCategoryName === 'DESSERTS' && (
                          <Food
                            food={food}
                            CUISINES={this.state.CUISINES}
                            onDelete={(event, id) => this.deleteFoodItem(event, food._id)}
                            editableId={this.state.editableId}
                            makeEditable={(ID) => this.makeEditable(ID)}
                            onSave={(event) => this.updateFoodItem(food._id, event)}
                            onCancelUpdate={() => this.cancelFoodUpdate(food._id)}
                            onNameChangeHandler={(evt, id) =>
                              this.onNameChangeHandlerUpdate(evt, id)
                            }
                            onPriceChangeHandler={(evt, id) =>
                              this.onPriceChangeHandlerUpdate(evt, id)
                            }
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
                        )
                    )}
                  </ul>
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
  const snackbarData = state.snackBarReducer.snackbarData;
  const { foodData } = state.restaurntFoodMenuReducer;
  return {
    snackbarData: snackbarData,
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FoodMenu);

// export default FoodMenu;
