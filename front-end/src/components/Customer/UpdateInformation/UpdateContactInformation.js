import React, { Component } from 'react';
import CustomerNavBar from '../../Customer/CommonArea/CustomerNavBar';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import './UpdateProfile.css';
import axios from 'axios';
import serverUrl from '../../../config';
import { updateSnackbarData, getCustomerBasicInfo } from '../../../constants/action-types';
import { connect } from 'react-redux';
import jwt_decode from 'jwt-decode';

class UpdateContactInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: { contactError: '', passwordMisMatchError: '', submitError: '' },
      Password: '',
      RetypePassword: '',
    };
  }

  onEmailChangeHandler = (e) => {
    let payload = {
      customerProfile: {
        ...this.props.customerInfo.customerProfile,
        NewEmail: e.target.value,
      },
    };
    this.props.getCustomerBasicInfo(payload);
    this.setState({
      errors: { ...this.state.errors, ...{ submitError: '' } },
    });
  };
  onContactNoCHangeHandler = (e) => {
    if (!/^\d+$/.test(e.target.value) && e.target.value.length > 0) {
      this.setState({
        errors: { ...this.state.errors, ...{ contactError: '  Invalid Value!', submitError: '' } },
      });
    } else {
      let payload = {
        customerProfile: {
          ...this.props.customerInfo.customerProfile,
          PhoneNo: e.target.value,
        },
      };
      this.props.getCustomerBasicInfo(payload);
      this.setState({
        errors: { ...this.state.errors, ...{ contactError: '' } },
      });
    }
  };

  onPasswordChangeHandler = (e) => {
    this.setState({
      Password: e.target.value,
      errors: { ...this.state.errors, ...{ submitError: '' } },
    });
  };
  onRePasswordChangeHandler = (e) => {
    let errors = { ...this.state.errors, ...{ passwordMisMatchError: '' } };
    if (e.target.value !== this.state.Password) {
      errors = {
        ...this.state.errors,
        ...{
          passwordMisMatchError: '  Both Passwords Are Different!',
          submitError: '',
        },
      };
    }
    this.setState({
      RetypePassword: e.target.value,
      errors,
    });
  };
  onChangeHandlerCountryCode = (e) => {
    let payload = {
      customerProfile: {
        ...this.props.customerInfo.customerProfile,
        CountryCode: e.target.value,
      },
    };
    this.props.getCustomerBasicInfo(payload);
    this.setState({
      errors: { ...this.state.errors, ...{ submitError: '' } },
    });
  };

  updateContactInformation = (e) => {
    e.preventDefault();
    const data = {
      Password: this.state.Password,
      customerInfo: {
        CustomerID: this.props.customerInfo.customerProfile.CustomerID,
        CountryCode: this.props.customerInfo.customerProfile.CountryCode,
        Email: this.props.customerInfo.customerProfile.Email,
        NewEmail: this.props.customerInfo.customerProfile.NewEmail,
        PhoneNo: this.props.customerInfo.customerProfile.PhoneNo,
      },
    };
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    axios.post(serverUrl + 'customer/updateContactInfo', data).then(
      (response) => {
        if (response.status === 200) {
          if (
            this.props.customerInfo.customerProfile.NewEmail !==
            this.props.customerInfo.customerProfile.Email
          ) {
            const decoded = jwt_decode(response.data.split(' ')[1]);
            localStorage.setItem('token', response.data);
            localStorage.setItem('userId', decoded._id);
            localStorage.setItem('userrole', decoded.userrole);
            localStorage.setItem('useremail', decoded.email);
          }

          let payload = {
            success: true,
            message: 'Contact Information Updated Successfully!',
          };
          this.props.updateSnackbarData(payload);
        }
      },
      (error) => {
        console.log(error);
        if (error.response.status === 401) {
          this.setState({
            errors: { ...this.state.errors, ...{ submitError: error.response.data } },
          });
        }
      }
    );
  };

  render() {
    let redirectVar = null;
    if (!localStorage.getItem('token')) {
      console.log('cookie not found');
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
      <div>
        {redirectVar}
        {<CustomerNavBar />}
        {/*this.props.snackbarData != null && <SnackBar />*/}
        <span id="page-content" class="offscreen">
          &nbsp;
        </span>
        <div className="main-content-wrap main-content-wrap--full">
          <div className="content-container" id="super-container">
            <div className=" clearfix layout-block layout-n column--responsive account-settings_container">
              <div className="column column-beta column--responsive">
                <div className="account-settings_content">
                  <div class="section-header clearfix">
                    <h2>Contact Information</h2>
                  </div>
                  <form
                    onSubmit={this.updateContactInformation}
                    className="profile-bio yform yform-vertical-spacing"
                  >
                    <label for="Email">Email</label>

                    <input
                      maxLength="50"
                      id="Email"
                      name="Email"
                      placeholder=""
                      size="30"
                      type="email"
                      value={this.props.customerInfo.customerProfile.NewEmail}
                      onChange={this.onEmailChangeHandler}
                      required
                    ></input>

                    <label for="last_name" style={{ width: '100%' }}>
                      Contact No:{' '}
                      <span style={{ color: 'red' }}>
                        {this.state.errors['passwordMisMatchError']}
                      </span>
                    </label>
                    <select
                      style={{ display: 'inline', width: '10%' }}
                      placeholder="Contact No"
                      className="form-control"
                      onChange={this.onChangeHandlerCountryCode}
                      value={this.props.customerInfo.customerProfile.CountryCode}
                      required
                    >
                      <option className="Dropdown-menu" key="" value="">
                        -Select-
                      </option>
                      {this.props.masterData.CountryCodes.map((countryCode) => (
                        <option
                          className="Dropdown-menu"
                          key={countryCode.key}
                          value={countryCode.value}
                        >
                          {countryCode.value}
                        </option>
                      ))}
                    </select>
                    <input
                      style={{ display: 'inline', width: '90%' }}
                      id="ContactNo"
                      maxlength="10"
                      minLength="10"
                      name="ContactNo"
                      placeholder=""
                      size="30"
                      type="text"
                      value={this.props.customerInfo.customerProfile.PhoneNo}
                      onChange={this.onContactNoCHangeHandler}
                      required
                    />
                    <label for="nickname">Password</label>
                    <input
                      id="password"
                      maxlength="50"
                      name="password"
                      placeholder=""
                      size="30"
                      type="password"
                      value={this.state.Password}
                      onChange={this.onPasswordChangeHandler}
                      required
                    />

                    <label for="nickname">
                      ReType Password
                      <span style={{ color: 'red' }}>
                        {this.state.errors['passwordMisMatchError']}
                      </span>
                    </label>
                    <input
                      id="repassword"
                      maxlength="50"
                      name="repassword"
                      placeholder=""
                      size="30"
                      type="password"
                      value={this.state.RetypePassword}
                      onChange={this.onRePasswordChangeHandler}
                      required
                    />
                    <span style={{ color: 'red' }}>{this.state.errors['submitError']}</span>
                    <br />
                    <button
                      disabled={this.state.errors.passwordMisMatchError.length !== 0}
                      type="submit"
                      value="submit"
                      class="ybtn ybtn--primary ybtn-full-responsive-small"
                    >
                      <span>Save Changes</span>
                    </button>
                    <Link to="/AboutMe"> Cancel</Link>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// export default UpdateProfile;

const mapStateToProps = (state) => {
  const { customerInfo } = state.customerBasicInfoReducer;
  const { masterData } = state.masterDataReducer;

  return {
    customerInfo,
    masterData,
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
    getCustomerBasicInfo: (payload) => {
      dispatch({
        type: getCustomerBasicInfo,
        payload,
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateContactInformation);
