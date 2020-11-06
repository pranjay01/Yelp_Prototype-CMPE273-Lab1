/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Order from './Order';
import OrderDetails from './OrderDetails';
import './Orders.css';
import axios from 'axios';
import serverUrl from '../../../config';
import CustomerStaticProfile from '../CommonComponent/CustomerStaticProfile';
import { connect } from 'react-redux';
import {
  updateOrderStore,
  updateSnackbarData,
  updateCustomerForRestaurant,
  updateMessageStore,
  updatemessageBoxStore,
} from '../../../constants/action-types';
import ReactPaginate from 'react-paginate';
import MessageBodyModal from '../../CommonComponents/MessageBodyModal';
import restaurantHomePageReducer from '../../../reducers/restaurantHomePageReducer';

class ordersList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      DeliveryStatuses: [
        { key: 1, value: 'Order Received' },
        { key: 2, value: 'Preparing' },
        { key: 3, value: 'On the way' },
        { key: 4, value: 'Pick up Ready' },
        { key: 5, value: 'Delivered' },
        { key: 6, value: 'Picked up' },
        { key: 7, value: 'Canceled' },
      ],
    };
  }

  commonFetch(sortValue = 'All', selectedPage = 0) {
    axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    axios
      .get(
        serverUrl + 'biz/getOrderDetails',

        {
          params: { sortValue, RestaurantID: localStorage.getItem('userId'), selectedPage },
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log(response.data);
        let OrderList = response.data.OrderList.map((order) => {
          return {
            ...order,
            OrderedDate: new Date(order.OrderedDate),
            tmpStatusValue: order.DeliveryStatus,
            tmpStatusID: order.DeliverStatusID,
          };
        });

        let payload = {
          OrderList,
          orderCount: response.data.orderCount,
          PageCount: Math.ceil(response.data.orderCount / 3),
          sortValue,
          selectedPage,
        };
        this.props.updateOrderStore(payload);
      });
  }

  handlePageClick = (e) => {
    this.commonFetch(this.props.orderStore.sortValue, e.selected);
  };
  fetchOrders(event, sortValue) {
    // let newOrdersList = [];
    event.preventDefault();
    this.commonFetch(sortValue);
  }

  componentDidMount() {
    this.commonFetch();
  }

  onStatusChangeHandler = (value, orderID) => {
    const index = this.props.orderStore.OrderList.findIndex((x) => x._id === orderID);
    const tmpStatusValue = this.state.DeliveryStatuses.findIndex((x) => x.key === Number(value));
    let OrderList = [...this.props.orderStore.OrderList];
    let order = { ...OrderList[index] };
    order.tmpStatusValue = this.state.DeliveryStatuses[tmpStatusValue].value;
    order.tmpStatusID = value;
    OrderList[index] = order;
    let payload = {
      OrderList,
    };
    this.props.updateOrderStore(payload);
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
          totalPrice: Item.Quantity * Item.Price,
        };
      });
      let payload = {
        orderDetails,
        popSeen: !this.props.orderStore.popSeen,
      };
      this.props.updateOrderStore(payload);
    }
  };

  updateStatus = (orderID) => {
    const index = this.props.orderStore.OrderList.findIndex((x) => x._id === orderID);

    let orderItem = { ...this.props.orderStore.OrderList[index] };
    orderItem = {
      ...orderItem,
      DeliveryStatus: orderItem.tmpStatusValue,
      DeliverStatusID: orderItem.tmpStatusID,
    };

    axios.post(serverUrl + 'biz/updateDeliveryStatus', orderItem).then(
      (response) => {
        console.log('Status Code : ', response.status);
        if (response.status === 200) {
          console.log(response.data);
          const payload = {
            success: true,
            message: response.data,
          };
          this.props.updateSnackbarData(payload);
          let pageNo = this.props.orderStore.selectedPage;
          if (
            this.props.orderStore.orderCount % 3 === 1 &&
            pageNo + 1 === this.props.orderStore.PageCount
          ) {
            pageNo -= 1;
          }
          this.commonFetch(this.props.orderStore.sortValue, pageNo);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };

  openStaticProfile = (event, CustomerID) => {
    if (this.props.customerInfo.staticProfileSeen) {
      let payload = {
        customerProfile: {},
        staticProfileSeen: false,
      };
      this.props.updateCustomerForRestaurant(payload);
    } else {
      event.preventDefault();
      axios
        .get(
          serverUrl + 'biz/getCustomerCompleteProfile',

          { params: { CustomerID }, withCredentials: true }
        )
        .then((response) => {
          console.log(response.data);

          let payload = {
            customerProfile: response.data.customer,
            staticProfileSeen: true,
          };
          this.props.updateCustomerForRestaurant(payload);
        });
    }
  };

  openMessageWindow = (event, customerID = null) => {
    event.preventDefault();
    let msgpayload = {
      message: '',
    };
    this.props.updatemessageBoxStore(msgpayload);
    if (this.props.messageStore.showMessageModal) {
      let payload = {
        Message: { MessageArray: [] },
        showMessageModal: false,
      };
      this.props.updateMessageStore(payload);
    } else {
      axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
      axios
        .get(
          serverUrl + 'biz/getMessages',

          {
            params: {
              CustomerId: this.props.customerInfo.customerProfile.CustomerID,
              RestaurantId: localStorage.getItem('userId'),
            },
            withCredentials: true,
          }
        )
        .then((response) => {
          console.log(response.data);
          // let OrderList = response.data.OrderList.map((order) => {
          //   return {
          //     ...order,
          //     OrderedDate: new Date(order.OrderedDate),
          //     tmpStatusValue: order.DeliveryStatus,
          //     tmpStatusID: order.DeliverStatusID,
          //   };
          // });

          let payload = {
            Message: response.data,
            showMessageModal: true,
          };
          this.props.updateMessageStore(payload);
        });
    }
  };

  sendMessage = (event, message) => {
    event.preventDefault();
    console.log('befor data:', this.props.customerInfo.customerProfile);
    const data = {
      message: {
        MessageInstance: message,
        SentFrom: this.props.restaurantHome.Name,
        SentTime: new Date(),
      },
      CustomerId: this.props.customerInfo.customerProfile.CustomerID,
      CustomerName:
        this.props.customerInfo.customerProfile.FirstName +
        ' ' +
        this.props.customerInfo.customerProfile.LastName,
      RestaurantId: this.props.restaurantHome.RestaurantID,
      RestaurantName: this.props.restaurantHome.Name,
    };
    axios.post(serverUrl + 'biz/sendMessage', data).then(
      (response) => {
        console.log('Status Code : ', response.status);
        if (response.status === 200) {
          console.log(response.data);
          const msgInstance = {
            MessageInstance: message,
            SentFrom: this.props.restaurantHome.Name,
            SentTime: new Date(),
          };
          let NewMessage = null;
          if (!this.props.messageStore.Message) {
            NewMessage = response.data;
          } else {
            NewMessage = this.props.messageStore.Message;

            NewMessage.MessageArray.unshift(msgInstance);
          }

          const payload = {
            Message: NewMessage,
          };
          this.props.updateMessageStore(payload);

          let msgpayload = {
            message: '',
          };
          this.props.updatemessageBoxStore(msgpayload);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };

  render() {
    return (
      <div>
        {/*redirectVar*/}
        <nav className="navbar navbar-inverse">
          <div className="container-fluid">
            <div className="navbar-header">
              <a className="navbar-brand">Filter By</a>
            </div>
            <ul className="nav navbar-nav">
              <li className={this.props.orderStore.sortValue === 'All' ? 'active' : undefined}>
                <Link to="/#" onClick={(event) => this.fetchOrders(event, 'All')}>
                  All Orders
                </Link>
              </li>
              <li className={this.props.orderStore.sortValue === 'New' ? 'active' : undefined}>
                <Link to="/#" onClick={(event) => this.fetchOrders(event, 'New')}>
                  New Orders
                </Link>
              </li>
              <li
                className={this.props.orderStore.sortValue === 'Delivered' ? 'active' : undefined}
              >
                <Link to="/#" onClick={(event) => this.fetchOrders(event, 'Delivered')}>
                  Delevered Orders
                </Link>
              </li>
              <li className={this.props.orderStore.sortValue === 'Canceled' ? 'active' : undefined}>
                <Link to="/#" onClick={(event) => this.fetchOrders(event, 'Canceled')}>
                  Canceled Orders
                </Link>
              </li>
            </ul>
            {/*navLogin*/}
          </div>
        </nav>

        {this.props.messageStore.showMessageModal ? (
          <MessageBodyModal
            sendMessage={(event, message) => this.sendMessage(event, message)}
            openMessageWindow={(event) => this.openMessageWindow(event, '')}
            // messageBody={this.props.messageStore.Message}
            // openStaticProfile={(event) => this.openStaticProfile(event, '')}
          />
        ) : null}
        {this.props.customerInfo.staticProfileSeen ? (
          <CustomerStaticProfile
            openMessageWindow={(event, customerID) => this.openMessageWindow(event, customerID)}
            customerProfile={this.props.customerInfo.customerProfile}
            openStaticProfile={(event) => this.openStaticProfile(event, '')}
          />
        ) : null}
        {this.props.orderStore.popSeen ? (
          <OrderDetails modeTop={'10%'} toggle={this.openOrderDetails} />
        ) : null}
        <div>
          <ul className="lemon--ul__373c0__1_cxs undefined list__373c0__2G8oH">
            {this.props.orderStore.OrderList.map((order) => (
              <Order
                key={order._id}
                order={order}
                openOrderDetails={() => this.openOrderDetails(order._id)}
                onSave={() => this.updateStatus(order._id)}
                onStatusChangeHandler={(value) => this.onStatusChangeHandler(value, order._id)}
                openStaticProfile={(event) => this.openStaticProfile(event, order.CustomerID)}

                //   }
              />
            ))}
          </ul>
          <div style={{ position: 'relative', left: '50%', bottom: '3%', right: '0' }}>
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
    );
  }
}

const mapStateToProps = (state) => {
  const { orderStore } = state.orderStoreReducer;
  const { customerInfo } = state.customerForProfileReducer;
  const { messageStore } = state.messageStoreReducer;
  const { restaurantHome } = state.restaurantHomePageReducer;

  return {
    orderStore,
    customerInfo,
    messageStore,
    restaurantHome,
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
    updateSnackbarData: (payload) => {
      dispatch({
        type: updateSnackbarData,
        payload,
      });
    },
    updateCustomerForRestaurant: (payload) => {
      dispatch({
        type: updateCustomerForRestaurant,
        payload,
      });
    },
    updateMessageStore: (payload) => {
      dispatch({
        type: updateMessageStore,
        payload,
      });
    },
    updatemessageBoxStore: (payload) => {
      dispatch({
        type: updatemessageBoxStore,
        payload,
      });
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ordersList);

// export default ordersList;
