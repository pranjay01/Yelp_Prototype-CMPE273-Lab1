import React, { Component } from 'react';
import axios from 'axios';
import serverUrl from '../../../config';
import CustomerStaticProfile from '../CommonComponent/CustomerStaticProfile';
import { connect } from 'react-redux';
import {
  updateCustomerForRestaurant,
  updateMessageStore,
  updatemessageBoxStore,
} from '../../../constants/action-types';
import ReactPaginate from 'react-paginate';

import './RegisteredCustomers.css';
import MessageBodyModal from '../../CommonComponents/MessageBodyModal';

class RegisteredCustomers extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
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
  handleClick = () => {
    this.props.toggle();
  };
  handlePageClick = (e) => {
    this.props.handlePageClickRegisteredCustomers(e);
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
      <div className="modal" style={{ top: '0', left: '0', width: '100%', height: '100%' }}>
        <div
          className="modal_content"
          style={{ top: '10%', left: '20%', width: '60%', height: '70%' }}
        >
          <span className="close" onClick={this.handleClick}>
            &times;{' '}
          </span>
          <table id="customers">
            <tbody>
              <tr>
                <th>Customer Name</th>
                <th>Email</th>
              </tr>
              {this.props.messageStore.showMessageModal ? (
                <MessageBodyModal
                  sendMessage={(event, message) => this.sendMessage(event, message)}
                  openMessageWindow={(event) => this.openMessageWindow(event, '')}
                />
              ) : null}
              {this.props.customerInfo.staticProfileSeen ? (
                <CustomerStaticProfile
                  openMessageWindow={(event, customerID) =>
                    this.openMessageWindow(event, customerID)
                  }
                  customerProfile={this.props.customerInfo.customerProfile}
                  openStaticProfile={(event) => this.openStaticProfile(event, '')}
                />
              ) : null}
              {this.props.registrationStore.RegisteredCustomers.map((customer) => (
                <tr key={customer.CustomerID}>
                  <td>
                    <a
                      href="#"
                      onClick={(event) => this.openStaticProfile(event, customer.CustomerID)}
                    >
                      {customer.CustomerName}
                    </a>
                  </td>
                  <td>{customer.Email}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ position: 'absolute', left: '4%', bottom: '0%', right: '0' }}>
            <ReactPaginate
              previousLabel={'prev'}
              nextLabel={'next'}
              breakLabel={'...'}
              breakClassName={'break-me'}
              pageCount={this.props.registrationStore.RegistrationPageCount}
              // pageCount={3}
              marginPagesDisplayed={2}
              pageRangeDisplayed={2}
              onPageChange={this.handlePageClick}
              containerClassName={'pagination'}
              subContainerClassName={'pages pagination'}
              activeClassName={'active'}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const snackbarData = state.snackBarReducer;
  const { eventStore, registrationStore } = state.eventStoreReducer;
  const { customerInfo } = state.customerForProfileReducer;
  const { messageStore } = state.messageStoreReducer;
  const { restaurantHome } = state.restaurantHomePageReducer;

  return {
    snackbarData: snackbarData,
    eventStore,
    registrationStore,
    customerInfo,
    messageStore,
    restaurantHome,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
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

export default connect(mapStateToProps, mapDispatchToProps)(RegisteredCustomers);

// export default RegisteredCustomers;
