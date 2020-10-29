import React, { Component } from 'react';
import axios from 'axios';
import serverUrl from '../../../../config';
import { updateSnackbarData, updateRestaurantFoodStore } from '../../../../constants/action-types';
import { connect } from 'react-redux';
import ReactPaginate from 'react-paginate';

// import FoodInfo from './FoodInfo';
class FoodOrderCart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalPrice: 0,
      openedCategory: '',
      foodCart: [],
      selectedPage: 0,
    };
  }

  fromFoodCart(FoodID, MenuCategory) {
    let index = this.state.foodCart.findIndex(
      (x) => x.FoodID === FoodID && x.MenuCategory === MenuCategory
    );
    if (index >= 0) {
      return this.state.foodCart[index].Quantity;
    }
    return 0;
  }
  commonFetch(category, selectedPage = 0) {
    axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    axios
      .get(
        serverUrl + 'static/menuFetch',

        {
          params: {
            selectedPage,
            category,
            RestaurantID: localStorage.getItem('restaurantPageID'),
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        let FoodMenu = response.data.allFoods.map((food) => {
          return {
            ...food,
            Quantity: this.fromFoodCart(food._id, category),
          };
        });
        // });
        const payload = {
          FoodMenu,
          PageCount: Math.ceil(response.data.foodCount / 2),
          FoodCount: response.data.foodCount,
        };
        this.props.updateRestaurantFoodStore(payload);
      });
  }

  handlePageClick = (e) => {
    this.commonFetch(this.state.openedCategory, e.selected);
    this.setState({
      selectedPage: e.selected,
    });
  };

  showMenuCategory = (category) => {
    if (category === this.state.openedCategory) {
      const payload = {
        FoodMenu: [],
      };
      this.props.updateRestaurantFoodStore(payload);
      this.setState({
        openedCategory: '',
      });
    } else {
      this.commonFetch(category, 0);
      this.setState({
        openedCategory: category,
      });
    }
  };

  onchangeUpdateCartHandler = (event, FoodID, Price, FoodName) => {
    // console.log('Food cart befor any changes', this.state.foodCart);
    /**Check if input value is 0 or empty */
    if (event.target.value === '' || event.target.value === 0) {
      // Check if that item was present in food cart
      let index = this.state.foodCart.findIndex(
        (x) => x.FoodID === FoodID && x.MenuCategory === this.state.openedCategory
      );
      // get item details from food cart, and remove it from the food cart
      if (index >= 0) {
        let item = this.state.foodCart[index];
        let reducedPrice = item.Quantity * Price;
        let foodCart = [...this.state.foodCart];
        foodCart.splice(index, 1);
        let total_Price = (this.state.totalPrice - reducedPrice).toFixed(2);
        const totalPrice = +total_Price;
        this.setState({
          foodCart,
          totalPrice,
        });
      }
    } else {
      let index = this.state.foodCart.findIndex(
        (x) => x.FoodID === FoodID && x.MenuCategory === this.state.openedCategory
      );
      // check if item already present in food cart
      if (index >= 0) {
        let foodCart = [...this.state.foodCart];
        let item = { ...foodCart[index] };
        let oldCount = item.Quantity;
        let changeInPrice = (event.target.value - oldCount) * Price;
        item.Quantity = event.target.value;
        foodCart[index] = item;
        let total_Price = (this.state.totalPrice + changeInPrice).toFixed(2);
        const totalPrice = +total_Price;
        this.setState({ foodCart, totalPrice });
        //fetch old item, and udate the count
      } else {
        let item = {
          FoodID,
          FoodName,
          MenuCategory: this.state.openedCategory,
          Price: Price,
          Quantity: event.target.value,
        };
        let newItemPrice = event.target.value * Price;
        let total_Price = (this.state.totalPrice + newItemPrice).toFixed(2);
        const totalPrice = +total_Price;
        this.setState({
          foodCart: this.state.foodCart.concat(item),
          totalPrice,
        });
      }
    }

    const index = this.props.RestaurantFoodMenuStore.FoodMenu.findIndex((x) => x._id === FoodID);
    let FoodMenu = [...this.props.RestaurantFoodMenuStore.FoodMenu];
    const foodItem = { ...FoodMenu[index] };
    foodItem.Quantity = event.target.value;
    FoodMenu[index] = foodItem;
    const payload = {
      FoodMenu,
    };
    this.props.updateRestaurantFoodStore(payload);
  };

  render() {
    return (
      <div style={{ top: '60px', left: '0', width: '100%', height: '100%' }}>
        <div
          className="modal"
          style={{ top: '60px', left: '0', width: '100%', height: '100%', position: 'fixed' }}
        >
          <div
            className="modal_content"
            style={{ top: '10%', left: '20%', width: '60%', height: '70%', overflowY: 'scroll' }}
          >
            <span className="close" onClick={this.props.openFoodMenu}>
              &times;{' '}
            </span>
            <br />
            <div
              className=".job-form-section-group-styles__header--2Z5fi"
              style={{
                padding: '5px',
                justifyContent: 'space-between',
                display: 'flex',
                //   backgroundColor: '#0000004a',
                boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.08)',
                marginBottom: '4px',
              }}
            >
              <p style={{ color: '#000', cursor: 'pointer' }}>
                <strong>Total Amount</strong>
              </p>

              <h3 style={{ color: 'black' }}>{this.state.totalPrice}$</h3>
            </div>
            <button
              onClick={() => this.props.orderFood(this.state.foodCart, this.state.totalPrice)}
              className="button__373c0__3lYgT primary__373c0__2ZWOb full__373c0__1AgIz"
              // style="--mousedown-x:0px;--mousedown-y:0px;--button-width:0px"
              // type="submit"
              // value="submit"
              style={{ width: '20%', cursor: 'pointer' }}
            >
              <div className="lemon--div__373c0__1mboc button-content__373c0__1QNtB border-color--default__373c0__3-ifU">
                <span className="lemon--span__373c0__3997G text__373c0__2Kxyz button-content-text__373c0__Z-7FO text-color--inherit__373c0__1lczC text-align--center__373c0__3VrfZ text-weight--semibold__373c0__2l0fe text-size--large__373c0__3t60B text--truncated__373c0__3sLaf">
                  Submit Order
                </span>
              </div>
            </button>
            <br />
            <div
              className=".job-form-section-group-styles__header--2Z5fi"
              style={{
                padding: '5px',
                justifyContent: 'space-between',
                display: 'flex',
                backgroundColor: 'black',
                boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 1.0)',
                marginBottom: '4px',
              }}
            >
              <a
                onClick={() => {
                  this.showMenuCategory('APPETIZERS');
                }}
              >
                <p style={{ color: 'white', cursor: 'pointer' }}>
                  <strong>Appetizers</strong>
                </p>
              </a>
            </div>

            {/**Appetizers */}
            {this.state.openedCategory === 'APPETIZERS' && (
              <div>
                <table id="customers">
                  <tbody>
                    <tr>
                      <th>Image</th>
                      <th>Food Item</th>
                      <th>cuisine</th>
                      <th>Description</th>
                      <th>Ingredients</th>
                      <th>Price</th>
                      <th>Select Quantity</th>
                    </tr>
                    {this.props.RestaurantFoodMenuStore.FoodMenu.map((food) => (
                      <tr key={food._id}>
                        <td>
                          <img
                            style={{ height: '100px', width: '100px' }}
                            src={food.ImageUrl}
                          ></img>
                        </td>
                        <td>{food.FoodName}</td>
                        <td>{food.Cuisine}</td>
                        <td>{food.Description}</td>
                        <td>{food.MainIngredients}</td>
                        <td>{food.Price}$</td>
                        <td>
                          <input
                            value={food.Quantity}
                            min="0"
                            max="50"
                            onChange={(event) => {
                              this.onchangeUpdateCartHandler(
                                event,
                                food._id,
                                food.Price,
                                food.FoodName
                              );
                            }}
                            type="number"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <ReactPaginate
                  previousLabel={'prev'}
                  nextLabel={'next'}
                  breakLabel={'...'}
                  breakClassName={'break-me'}
                  pageCount={this.props.RestaurantFoodMenuStore.PageCount}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={2}
                  onPageChange={this.handlePageClick}
                  containerClassName={'pagination'}
                  subContainerClassName={'pages pagination'}
                  activeClassName={'active'}
                />
              </div>
            )}

            <div
              className=".job-form-section-group-styles__header--2Z5fi"
              style={{
                padding: '5px',
                justifyContent: 'space-between',
                display: 'flex',
                backgroundColor: 'black',
                boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 1.0)',
                marginBottom: '4px',
              }}
            >
              <a
                onClick={() => {
                  this.showMenuCategory('MAIN_COURSE');
                }}
              >
                <p style={{ color: 'white', cursor: 'pointer' }}>
                  <strong>Main Course</strong>
                </p>
              </a>
            </div>

            {/**MAIN_COURSE */}
            {this.state.openedCategory === 'MAIN_COURSE' && (
              <div>
                <table id="customers">
                  <tbody>
                    <tr>
                      <th>Image</th>
                      <th>Food Item</th>
                      <th>cuisine</th>
                      <th>Description</th>
                      <th>Ingredients</th>
                      <th>Price</th>
                      <th>Select Quantity</th>
                    </tr>
                    {this.props.RestaurantFoodMenuStore.FoodMenu.map((food) => (
                      <tr key={food._id}>
                        <td>
                          <img
                            style={{ height: '100px', width: '100px' }}
                            src={food.ImageUrl}
                          ></img>
                        </td>
                        <td>{food.FoodName}</td>
                        <td>{food.Cuisine}</td>
                        <td>{food.Description}</td>
                        <td>{food.MainIngredients}</td>
                        <td>{food.Price}$</td>
                        <td>
                          <input
                            max="50"
                            value={food.Quantity}
                            min="0"
                            onChange={(event) => {
                              this.onchangeUpdateCartHandler(
                                event,
                                food._id,
                                food.Price,
                                food.FoodName
                              );
                            }}
                            type="number"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <ReactPaginate
                  previousLabel={'prev'}
                  nextLabel={'next'}
                  breakLabel={'...'}
                  breakClassName={'break-me'}
                  pageCount={this.props.RestaurantFoodMenuStore.PageCount}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={2}
                  onPageChange={this.handlePageClick}
                  containerClassName={'pagination'}
                  subContainerClassName={'pages pagination'}
                  activeClassName={'active'}
                />
              </div>
            )}

            <div
              className=".job-form-section-group-styles__header--2Z5fi"
              style={{
                padding: '5px',
                justifyContent: 'space-between',
                display: 'flex',
                backgroundColor: 'black',
                boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 1.0)',
                marginBottom: '4px',
              }}
            >
              <a
                onClick={() => {
                  this.showMenuCategory('SALADS');
                }}
              >
                <p style={{ color: 'white', cursor: 'pointer' }}>
                  <strong>Salad</strong>
                </p>
              </a>
            </div>

            {/**SALADS */}
            {this.state.openedCategory === 'SALADS' && (
              <div>
                <table id="customers">
                  <tbody>
                    <tr>
                      <th>Image</th>
                      <th>Food Item</th>
                      <th>cuisine</th>
                      <th>Description</th>
                      <th>Ingredients</th>
                      <th>Price</th>
                      <th>Select Quantity</th>
                    </tr>
                    {this.props.RestaurantFoodMenuStore.FoodMenu.map((food) => (
                      <tr key={food._id}>
                        <td>
                          <img
                            style={{ height: '100px', width: '100px' }}
                            src={food.ImageUrl}
                          ></img>
                        </td>
                        <td>{food.FoodName}</td>
                        <td>{food.Cuisine}</td>
                        <td>{food.Description}</td>
                        <td>{food.MainIngredients}</td>
                        <td>{food.Price}$</td>
                        <td>
                          <input
                            value={food.Quantity}
                            min="0"
                            max="50"
                            onChange={(event) => {
                              this.onchangeUpdateCartHandler(
                                event,
                                food._id,
                                food.Price,
                                food.FoodName
                              );
                            }}
                            type="number"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <ReactPaginate
                  previousLabel={'prev'}
                  nextLabel={'next'}
                  breakLabel={'...'}
                  breakClassName={'break-me'}
                  pageCount={this.props.RestaurantFoodMenuStore.PageCount}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={2}
                  onPageChange={this.handlePageClick}
                  containerClassName={'pagination'}
                  subContainerClassName={'pages pagination'}
                  activeClassName={'active'}
                />
              </div>
            )}

            <div
              className=".job-form-section-group-styles__header--2Z5fi"
              style={{
                padding: '5px',
                justifyContent: 'space-between',
                display: 'flex',
                backgroundColor: 'black',
                boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 1.0)',
                marginBottom: '4px',
              }}
            >
              <a
                onClick={() => {
                  this.showMenuCategory('BEVERAGES');
                }}
              >
                <p style={{ color: 'white', cursor: 'pointer' }}>
                  <strong>Beverage</strong>
                </p>
              </a>
            </div>

            {/**BEVERAGES */}
            {this.state.openedCategory === 'BEVERAGES' && (
              <div>
                <table id="customers">
                  <tbody>
                    <tr>
                      <th>Image</th>
                      <th>Food Item</th>
                      <th>cuisine</th>
                      <th>Description</th>
                      <th>Ingredients</th>
                      <th>Price</th>
                      <th>Select Quantity</th>
                    </tr>
                    {this.props.RestaurantFoodMenuStore.FoodMenu.map((food) => (
                      <tr key={food._id}>
                        <td>
                          <img
                            style={{ height: '100px', width: '100px' }}
                            src={food.ImageUrl}
                          ></img>
                        </td>
                        <td>{food.FoodName}</td>
                        <td>{food.Cuisine}</td>
                        <td>{food.Description}</td>
                        <td>{food.MainIngredients}</td>
                        <td>{food.Price}$</td>
                        <td>
                          <input
                            value={food.Quantity}
                            min="0"
                            max="50"
                            onChange={(event) => {
                              this.onchangeUpdateCartHandler(
                                event,
                                food._id,
                                food.Price,
                                food.FoodName
                              );
                            }}
                            type="number"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <ReactPaginate
                  previousLabel={'prev'}
                  nextLabel={'next'}
                  breakLabel={'...'}
                  breakClassName={'break-me'}
                  pageCount={this.props.RestaurantFoodMenuStore.PageCount}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={2}
                  onPageChange={this.handlePageClick}
                  containerClassName={'pagination'}
                  subContainerClassName={'pages pagination'}
                  activeClassName={'active'}
                />
              </div>
            )}
            <div
              className=".job-form-section-group-styles__header--2Z5fi"
              style={{
                padding: '5px',
                justifyContent: 'space-between',
                display: 'flex',
                backgroundColor: 'black',
                boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 1.0)',
                marginBottom: '4px',
              }}
            >
              <a
                onClick={() => {
                  this.showMenuCategory('DESSERTS');
                }}
              >
                <p style={{ color: 'white', cursor: 'pointer' }}>
                  <strong>Dessert</strong>
                </p>
              </a>
            </div>
            {/**DESSERTS */}
            {this.state.openedCategory === 'DESSERTS' && (
              <div>
                <table id="customers">
                  <tbody>
                    <tr>
                      <th>Image</th>
                      <th>Food Item</th>
                      <th>cuisine</th>
                      <th>Description</th>
                      <th>Ingredients</th>
                      <th>Price</th>
                      <th>Select Quantity</th>
                    </tr>
                    {this.props.RestaurantFoodMenuStore.FoodMenu.map((food) => (
                      <tr key={food._id}>
                        <td>
                          <img
                            style={{ height: '100px', width: '100px' }}
                            src={food.ImageUrl}
                          ></img>
                        </td>
                        <td>{food.FoodName}</td>
                        <td>{food.Cuisine}</td>
                        <td>{food.Description}</td>
                        <td>{food.MainIngredients}</td>
                        <td>{food.Price}$</td>
                        <td>
                          <input
                            value={food.Quantity}
                            min="0"
                            max="50"
                            onChange={(event) => {
                              this.onchangeUpdateCartHandler(
                                event,
                                food._id,
                                food.Price,
                                food.FoodName
                              );
                            }}
                            type="number"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <ReactPaginate
                  previousLabel={'prev'}
                  nextLabel={'next'}
                  breakLabel={'...'}
                  breakClassName={'break-me'}
                  pageCount={this.props.RestaurantFoodMenuStore.PageCount}
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
    );
  }
}

const mapStateToProps = (state) => {
  const snackbarData = state.snackBarReducer;
  const { RestaurantFoodMenuStore } = state.searchedRestaurantReducer;
  return {
    snackbarData: snackbarData,
    RestaurantFoodMenuStore,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateSnackbarData: (payload) => {
      dispatch({
        type: updateSnackbarData,
        payload,
      });
    },
    updateRestaurantFoodStore: (payload) => {
      dispatch({
        type: updateRestaurantFoodStore,
        payload,
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FoodOrderCart);

// export default FoodOrderCart;
