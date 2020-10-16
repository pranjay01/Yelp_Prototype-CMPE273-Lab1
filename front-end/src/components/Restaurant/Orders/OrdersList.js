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
import { updateOrderStore, updateSnackbarData } from '../../../constants/action-types';
import ReactPaginate from 'react-paginate';

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
      staticProfileSeen: false,
      customerProfile: {
        Name: '',
        NickName: '',
        DOB: '',
        Address1: '',
        Address2: '',
        Headline: '',
        ILove: '',
        FMI: '',
        JoinDate: '',
        Website: '',
        ImageUrl: '',
      },
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
    // let payload = {
    //   selectedPage: 0,
    // };
    // this.props.updateOrderStore(payload);
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
          this.commonFetch(this.props.orderStore.sortValue, this.props.orderStore.selectedPage);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };

  openStaticProfile = (event, cusID) => {
    if (this.state.staticProfileSeen) {
      this.setState({
        staticProfileSeen: !this.state.staticProfileSeen,
      });
    } else {
      event.preventDefault();
      axios
        .get(
          serverUrl + 'biz/getCustomerCompleteProfile',

          { params: { cusID }, withCredentials: true }
        )
        .then((response) => {
          console.log(response.data);
          let customerProfile = {
            Name: response.data[0][0].Name,
            NickName: response.data[0][0].NickName,
            DOB: response.data[0][0].DOB,
            Address1: response.data[0][0].Address1,
            Address2: response.data[0][0].Address2,
            Headline: response.data[0][0].Headline,
            ILove: response.data[0][0].ILove,
            FMI: response.data[0][0].FMI,
            JoinDate: response.data[0][0].JoinDate,
            Website: response.data[0][0].Website,
            ImageUrl: response.data[0][0].ImageURL,
          };
          this.setState({
            staticProfileSeen: !this.state.staticProfileSeen,
            customerProfile,
          });
        });
    }

    //console.log('fetching food details');
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
        {this.state.staticProfileSeen ? (
          <CustomerStaticProfile
            customerProfile={this.state.customerProfile}
            //  modeTop={'10%'}
            //  orderDetails={this.state.orderDetails}
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
                openStaticProfile={(event) => this.openStaticProfile(event, order.CustomerId)}

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
  return {
    orderStore,
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ordersList);

// export default ordersList;
