import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Order from './Order';
import OrderDetails from './OrderDetails';
import './Orders.css';
import axios from 'axios';
import serverUrl from '../../../config';
import CustomerStaticProfile from '../CommonComponent/CustomerStaticProfile';

class ordersList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      staticProfileSeen: false,
      orderSortBy: localStorage.getItem('orderSortBy'),
      popSeen: false,
      ORDERS: [],
      orderDetails: [],
      OrdersOrignalCopy: [],
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

  fetchOrders(event, sortValue) {
    let newOrdersList = [];
    event.preventDefault();
    if (sortValue === 'New') {
      newOrdersList = this.state.OrdersOrignalCopy.filter(
        (order) => Number(order.DeliverStatusID) < 5
      );
    } else if (sortValue === 'Delivered') {
      newOrdersList = this.state.OrdersOrignalCopy.filter(
        (order) => Number(order.DeliverStatusID) === 5 || Number(order.DeliverStatusID) === 6
      );
    } else if (sortValue === 'Canceled') {
      newOrdersList = this.state.OrdersOrignalCopy.filter(
        (order) => Number(order.DeliverStatusID) === 7
      );
    } else {
      newOrdersList = this.state.OrdersOrignalCopy;
    }
    this.setState({
      ORDERS: newOrdersList,
    });
    localStorage.setItem('orderSortBy', sortValue);
    // axios
    //   .get(
    //     serverUrl + 'biz/getOrderDetailsNew',

    //     { params: { sortValue }, withCredentials: true }
    //   )
    //   .then((response) => {
    //     console.log(response.data);
    //     let allOrders = response.data[0].map((order) => {
    //       return {
    //         ID: order.ID,
    //         CustomerId: order.CustomerID,
    //         CustomerName: order.CustomerName,
    //         OrderedTime: order.OrderedTime,
    //         OrderType: order.Order_Type,
    //         DeliverStatusID: order.DeliverStatusID,
    //         DeliverStatusValue: order.DeliverStatusValue,
    //         Bill: order.Bill,
    //         tmpStatus: order.DeliverStatusID,
    //         ImageUrl: order.ImageUrl,
    //       };
    //     });

    //     this.setState({
    //       ORDERS: this.state.ORDERS.concat(allOrders),
    //       orderSortBy: sortValue,
    //     });
    //   });
  }

  componentDidMount() {
    //this.fetchOrders(localStorage.getItem('orderSortBy'));
    const sortValue = 'All';
    axios
      .get(
        serverUrl + 'biz/getOrderDetailsNew',

        { params: { sortValue }, withCredentials: true }
      )
      .then((response) => {
        console.log(response.data);
        let allOrders = response.data[0].map((order) => {
          return {
            ID: order.ID,
            CustomerId: order.CustomerID,
            CustomerName: order.CustomerName,
            OrderedTime: order.OrderedTime,
            OrderType: order.Order_Type,
            DeliverStatusID: order.DeliverStatusID,
            DeliverStatusValue: order.DeliverStatusValue,
            Bill: order.Bill,
            tmpStatus: order.DeliverStatusID,
            ImageUrl: order.ImageUrl,
          };
        });

        this.setState({
          OrdersOrignalCopy: allOrders,
          ORDERS: allOrders,
          orderSortBy: sortValue,
        });
      });
    localStorage.setItem('orderSortBy', sortValue);
  }

  onStatusChangeHandler = (value, orderID) => {
    const index = this.state.ORDERS.findIndex((x) => x.ID === Number(orderID));
    let ORDERS = [...this.state.ORDERS];
    let order = { ...ORDERS[index] };
    order.tmpStatus = value;
    ORDERS[index] = order;
    this.setState({ ORDERS });
  };

  openOrderDetails = (orderID) => {
    if (this.state.popSeen) {
      this.setState({
        popSeen: !this.state.popSeen,
        orderDetails: [],
      });
    } else {
      axios
        .get(
          serverUrl + 'biz/orderFetch',

          { params: { orderID }, withCredentials: true }
        )
        .then((response) => {
          console.log(response.data);
          let allItems = response.data.map((Item) => {
            return {
              first: Item.Name,
              count: Item.Count,
              price: Item.PPrice,
              totalPrice: Item.TPrice,
            };
          });

          this.setState({
            orderDetails: this.state.orderDetails.concat(allItems),
            popSeen: !this.state.popSeen,
          });
        });
    }

    console.log('fetching food details');
  };

  updateStatus = (orderID) => {
    const index = this.state.ORDERS.findIndex((x) => x.ID === orderID);
    const index2 = this.state.OrdersOrignalCopy.findIndex((x) => x.ID === orderID);
    let foodItem = { ...this.state.ORDERS[index] };
    const newStatus = foodItem.tmpStatus;
    let data = {
      deliveryStatus: newStatus,
      orderID,
      token: localStorage.getItem('token'),
      userrole: localStorage.getItem('userrole'),
    };
    axios.post(serverUrl + 'biz/updateDeliveryStatus', data).then(
      (response) => {
        console.log('Status Code : ', response.status);
        if (response.status === 200) {
          console.log(response.data);
          foodItem = { ...foodItem, DeliverStatusID: foodItem.tmpStatus };
          let ORDERS = [...this.state.ORDERS];
          ORDERS.splice(index, 1);
          let OrdersOrignalCopy = [...this.state.OrdersOrignalCopy];
          OrdersOrignalCopy.splice(index2, 1);
          // ORDERS.push(foodItem);
          OrdersOrignalCopy.splice(index2, 0, foodItem);
          if (Number(foodItem.tmpStatus) < 5) {
            ORDERS.splice(index, 0, foodItem);
          }
          this.setState({
            ORDERS,
            OrdersOrignalCopy,
          });
          // newFoodId = { ...newFoodId, ...this.state.newFood };
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
        //orderDetails: [],
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
        <nav class="navbar navbar-inverse">
          <div class="container-fluid">
            <div class="navbar-header">
              <a class="navbar-brand">Filter By</a>
            </div>
            <ul class="nav navbar-nav">
              <li className={localStorage.getItem('orderSortBy') === 'All' && 'active'}>
                <Link to="/#" onClick={(event) => this.fetchOrders(event, 'All')}>
                  All Orders
                </Link>
              </li>
              <li className={localStorage.getItem('orderSortBy') === 'New' && 'active'}>
                <Link to="/#" onClick={(event) => this.fetchOrders(event, 'New')}>
                  New Orders
                </Link>
              </li>
              <li className={localStorage.getItem('orderSortBy') === 'Delivered' && 'active'}>
                <Link to="/#" onClick={(event) => this.fetchOrders(event, 'Delivered')}>
                  Delevered Orders
                </Link>
              </li>
              <li className={localStorage.getItem('orderSortBy') === 'Canceled' && 'active'}>
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
        {this.state.popSeen ? (
          <OrderDetails
            modeTop={'10%'}
            orderDetails={this.state.orderDetails}
            toggle={this.openOrderDetails}
          />
        ) : null}
        <div>
          <ul className="lemon--ul__373c0__1_cxs undefined list__373c0__2G8oH">
            {this.state.ORDERS.map((order) => (
              <Order
                order={order}
                openOrderDetails={() => this.openOrderDetails(order.ID)}
                onSave={() => this.updateStatus(order.ID)}
                onStatusChangeHandler={(evt, id) => this.onStatusChangeHandler(evt, id)}
                openStaticProfile={(event) => this.openStaticProfile(event, order.CustomerId)}

                //   }
              />
            ))}
          </ul>
          {/*<Pagination
            activePage={this.state.activePage}
            itemsCountPerPage={5}
            //totalItemsCount={450}
            pageRangeDisplayed={5}
            onChange={this.handlePageChange.bind(this)}
         />*/}
        </div>
      </div>
    );
  }
}

export default ordersList;
