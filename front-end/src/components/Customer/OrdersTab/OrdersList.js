import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import CustomerNavBar from '../CommonArea/CustomerNavBar';
import { Redirect } from 'react-router';
import GreyArea from '../CommonArea/GreyArea';
import LeftPannel from '../LeftPannel/LeftPannel';
import OrderForCustomer from './OrderForCustomer';
import axios from 'axios';
import serverUrl from '../../../config';
import OrderDetails from '../../Restaurant/Orders/OrderDetails';
import { updateOrderStore, updateLeftPannelHighlight } from '../../../constants/action-types';
import { connect } from 'react-redux';
import ReactPaginate from 'react-paginate';

class OrdersList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  commonFetch(selectedPage = 0, sortOrder, filter1, filter2) {
    axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    axios
      .get(serverUrl + 'customer/getAllOrders', {
        params: {
          CustomerID: localStorage.getItem('userId'),
          selectedPage,
          sortOrder,
          filter1,
          filter2,
        },
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
        let OrderList = response.data.OrderList.map((order) => {
          return {
            ...order,
            OrderedDate: new Date(order.OrderedDate),
          };
        });

        let payload = {
          OrderList,
          orderCount: response.data.orderCount,
          PageCount: Math.ceil(response.data.orderCount / 3),
          sortOrder,
          selectedPage,
          filter1,
          filter2,
        };
        this.props.updateOrderStore(payload);
      });
  }

  handlePageClick = (e) => {
    this.commonFetch(
      e.selected,
      this.props.orderStore.sortOrder,
      this.props.orderStore.filter1,
      this.props.orderStore.filter2
    );
  };

  componentDidMount() {
    let payload = {
      profileIsActive: false,
      eventsTabIsActive: false,
      ordersTabIsActive: true,
      followingTabIsActive: false,
      messageTabIsActive: false,
    };
    this.props.updateLeftPannelHighlight(payload);
    this.commonFetch(0, -1, 'All', '');
  }

  sortOrder(event, sortOrder) {
    event.preventDefault();
    this.commonFetch(
      this.props.orderStore.selected,
      sortOrder,
      this.props.orderStore.filter1,
      this.props.orderStore.filter2
    );
  }

  fetchOrdersFilter1 = (event, filter1) => {
    // let newOrdersList = [];
    event.preventDefault();
    if (this.props.orderStore.filter1 !== filter1) {
      this.commonFetch(
        this.props.orderStore.selected,
        this.props.orderStore.sortOrder,
        filter1,
        'Order Received'
      );
    }
  };

  fetchOrdersFilter2 = (event, filter2) => {
    event.preventDefault();
    if (this.props.orderStore.filter2 !== filter2) {
      this.commonFetch(
        this.props.orderStore.selected,
        this.props.orderStore.sortOrder,
        this.props.orderStore.filter1,
        filter2
      );
    }
  };

  openOrderDetails = (orderID) => {
    if (this.props.orderStore.popSeen) {
      let payload = {
        orderDetails: [],
        popSeen: !this.props.orderStore.popSeen,
      };
      this.props.updateOrderStore(payload);
    } else {
      const index = this.props.orderStore.OrderList.findIndex((x) => x._id === orderID);
      let orderItem = { ...this.props.orderStore.OrderList[index] };
      let orderDetails = orderItem.OrderCart.map((Item) => {
        return {
          first: Item.FoodName,
          count: Item.Quantity,
          price: Item.Price,
          totalPrice: (Item.Quantity * Item.Price).toFixed(2),
        };
      });
      let payload = {
        orderDetails,
        popSeen: !this.props.orderStore.popSeen,
      };
      this.props.updateOrderStore(payload);
    }
  };

  render() {
    let redirectVar = null;
    if (!localStorage.getItem('token')) {
      // console.log('cookie not found');
      redirectVar = <Redirect to="/customerLogin" />;
    } else {
      if (localStorage.getItem('userrole') === 'Customer') {
        redirectVar = null;
      } else if (localStorage.getItem('userrole') === 'Restaurant') {
        redirectVar = <Redirect to="/restaurantHome" />;
      } else {
        redirectVar = <Redirect to="/customerLogin" />;
      }
    }
    return (
      <div style={{ background: 'white' }}>
        {' '}
        {/*this.props.snackbarData != null && <SnackBar />*/}
        {redirectVar}
        {<CustomerNavBar />}
        <span id="page-content" className="offscreen">
          &nbsp;
        </span>
        <div className="main-content-wrap main-content-wrap--full">{<GreyArea />}</div>
        <div
          className="super-container"
          style={{
            paddingTop: '15px',
            paddingBottom: '36px',
            width: '960px',
            margin: '0 auto',
            padding: '0 15px',
          }}
        >
          <div
            style={{ marginTop: '40px' }}
            className="clearfix layout-block layout-n user-details_container"
          >
            {<LeftPannel />}
            <div className="column column-beta ">
              <div className="user-details-overview">
                <div className="user-details-overview_sidebar">
                  <nav className="navbar navbar-inverse">
                    <div className="container-fluid">
                      {/*<div className="navbar-header">
                        <a className="navbar-brand">Filter By</a>
        </div>*/}
                      <ul className="nav navbar-nav">
                        <li className={this.props.orderStore.filter1 === 'All' ? 'active' : ''}>
                          <Link to="/#" onClick={(event) => this.fetchOrdersFilter1(event, 'All')}>
                            All Orders
                          </Link>
                        </li>
                        <li
                          className={this.props.orderStore.filter1 === 'Delivery' ? 'active' : ''}
                        >
                          <Link
                            to="/#"
                            onClick={(event) => this.fetchOrdersFilter1(event, 'Delivery')}
                          >
                            Delivery Type
                          </Link>
                        </li>
                        <li className={this.props.orderStore.filter1 === 'Pick_up' ? 'active' : ''}>
                          <Link
                            to="/#"
                            onClick={(event) => this.fetchOrdersFilter1(event, 'Pick_up')}
                          >
                            Pickup Type
                          </Link>
                        </li>
                        <li
                          style={{ marginLeft: '200px' }}
                          className={this.props.orderStore.sortOrder === -1 ? 'active' : ''}
                        >
                          <Link to="/#" onClick={(event) => this.sortOrder(event, -1)}>
                            Recent
                          </Link>
                        </li>
                        <li className={this.props.orderStore.sortOrder === 1 ? 'active' : ''}>
                          <Link to="/#" onClick={(event) => this.sortOrder(event, 1)}>
                            Oldest
                          </Link>
                        </li>
                      </ul>

                      <ul className="nav navbar-nav">
                        {(this.props.orderStore.filter1 === 'Pick_up' ||
                          this.props.orderStore.filter1 === 'Delivery') && (
                          <li
                            className={
                              this.props.orderStore.filter2 === 'Order Received' ? 'active' : ''
                            }
                          >
                            <Link
                              to="/#"
                              onClick={(event) => this.fetchOrdersFilter2(event, 'Order Received')}
                            >
                              Recieved
                            </Link>
                          </li>
                        )}
                        {(this.props.orderStore.filter1 === 'Pick_up' ||
                          this.props.orderStore.filter1 === 'Delivery') && (
                          <li
                            className={
                              this.props.orderStore.filter2 === 'Preparing' ? 'active' : ''
                            }
                          >
                            <Link
                              to="/#"
                              onClick={(event) => this.fetchOrdersFilter2(event, 'Preparing')}
                            >
                              Preparing
                            </Link>
                          </li>
                        )}
                        {this.props.orderStore.filter1 === 'Delivery' && (
                          <li
                            className={
                              this.props.orderStore.filter2 === 'On the way' ? 'active' : ''
                            }
                          >
                            <Link
                              to="/#"
                              onClick={(event) => this.fetchOrdersFilter2(event, 'On the way')}
                            >
                              On The Way
                            </Link>
                          </li>
                        )}
                        {this.props.orderStore.filter1 === 'Delivery' && (
                          <li
                            className={
                              this.props.orderStore.filter2 === 'Delivered' ? 'active' : ''
                            }
                          >
                            <Link
                              to="/#"
                              onClick={(event) => this.fetchOrdersFilter2(event, 'Delivered')}
                            >
                              Delivered
                            </Link>
                          </li>
                        )}
                        {this.props.orderStore.filter1 === 'Pick_up' && (
                          <li
                            className={
                              this.props.orderStore.filter2 === 'Pick up Ready' ? 'active' : ''
                            }
                          >
                            <Link
                              to="/#"
                              onClick={(event) => this.fetchOrdersFilter2(event, 'Pick up Ready')}
                            >
                              Pickup Ready
                            </Link>
                          </li>
                        )}
                        {this.props.orderStore.filter1 === 'Pick_up' && (
                          <li
                            className={
                              this.props.orderStore.filter2 === 'Picked up' ? 'active' : ''
                            }
                          >
                            <Link
                              to="/#"
                              onClick={(event) => this.fetchOrdersFilter2(event, 'Picked up')}
                            >
                              Picked up
                            </Link>
                          </li>
                        )}
                      </ul>

                      {/*navLogin*/}
                    </div>
                  </nav>
                  {this.props.orderStore.popSeen ? (
                    <OrderDetails
                      modeTop={'20%'}
                      orderDetails={this.props.orderStore.orderDetails}
                      toggle={this.openOrderDetails}
                    />
                  ) : null}
                  <div>
                    <ul className="lemon--ul__373c0__1_cxs undefined list__373c0__2G8oH">
                      {this.props.orderStore.OrderList.map((order) => (
                        <OrderForCustomer
                          key={order._id}
                          order={order}
                          openOrderDetails={() => this.openOrderDetails(order._id)}
                        />
                      ))}
                    </ul>
                    <div
                      style={{
                        position: 'relative',
                        left: '25%',
                        bottom: '0%',
                        right: '0',
                        top: '120%',
                      }}
                    >
                      <ReactPaginate
                        previousLabel={'prev'}
                        nextLabel={'next'}
                        breakLabel={'...'}
                        breakClassName={'break-me'}
                        pageCount={this.props.orderStore.PageCount}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={2}
                        onPageChange={this.handlePageClick}
                        containerClassName={'pagination'}
                        subContainerClassName={'pages pagination'}
                        activeClassName={'active'}
                        forcePage={this.props.orderStore.selectedPage}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { orderStore } = state.orderStoreReducer;
  return {
    orderStore: orderStore,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateOrderStore: (payload) => {
      dispatch({
        type: updateOrderStore,
        payload,
      });
    },
    updateLeftPannelHighlight: (payload) => {
      dispatch({
        type: updateLeftPannelHighlight,
        payload,
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrdersList);
// export default OrdersList;
