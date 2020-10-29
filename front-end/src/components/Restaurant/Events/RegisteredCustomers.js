import React, { Component } from 'react';
import axios from 'axios';
import serverUrl from '../../../config';
import CustomerStaticProfile from '../CommonComponent/CustomerStaticProfile';
import { connect } from 'react-redux';
import { updateCustomerForRestaurant } from '../../../constants/action-types';
import ReactPaginate from 'react-paginate';

import './RegisteredCustomers.css';

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
              {this.props.customerInfo.staticProfileSeen ? (
                <CustomerStaticProfile
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
  return {
    snackbarData: snackbarData,
    eventStore,
    registrationStore,
    customerInfo,
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisteredCustomers);

// export default RegisteredCustomers;
