import React, { Component } from 'react';
import CustomerNavBar from '../../Customer/CommonArea/CustomerNavBar';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import './UpdateProfile.css';
import axios from 'axios';
import serverUrl from '../../../config';
import { updateSnackbarData, getCustomerBasicInfo } from '../../../constants/action-types';
// import {  } from '../../../constants/action-types';

import { connect } from 'react-redux';

class UpdateProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: { zipError: '', dateError: '' },
    };
  }

  onChangeCommonHandler = (e) => {
    let payload = {
      customerProfile: {
        ...this.props.customerInfo.customerProfile,
        [e.target.name]: e.target.value,
      },
    };
    this.props.getCustomerBasicInfo(payload);
  };

  onChangeHandlerZipCode = (e) => {
    if (!/^\d+$/.test(e.target.value) && e.target.value.length > 0) {
      this.setState({
        errors: { ...this.state.errors, ...{ zipError: '  Invalid Value!' } },
      });
    } else {
      let payload = {
        customerProfile: {
          ...this.props.customerInfo.customerProfile,
          Zip: e.target.value,
        },
      };
      this.props.getCustomerBasicInfo(payload);
      this.setState({
        errors: { ...this.state.errors, ...{ zipError: '' } },
      });
    }
  };

  onChangeDate = (e) => {
    const today = new Date();
    const inputDate = new Date(e.target.value);
    if (today <= inputDate) {
      this.setState({
        errors: { ...this.state.errors, ...{ dateError: '  Cannot select future Date!' } },
      });
    } else {
      let payload = {
        customerProfile: {
          ...this.props.customerInfo.customerProfile,
          DOB: e.target.value,
        },
      };
      this.props.getCustomerBasicInfo(payload);
      this.setState({
        errors: { ...this.state.errors, ...{ dateError: '' } },
      });
    }
  };

  onChangeFileHandler = (event) => {
    if (event.target.files.length === 1) {
      axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
      event.preventDefault();
      let formData = new FormData();
      formData.append('file', event.target.files[0], event.target.files[0].name);
      axios({
        method: 'post',
        url: serverUrl + 'customer/uploadCustomerProfilePic',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      })
        .then((response) => {
          // console.log('Status Code : ', response.status);
          if (parseInt(response.status) === 200) {
            // console.log('Product Saved');
            let customerProfile = {
              ...this.props.customerInfo.customerProfile,
              ImageURL: response.data,
            };
            let payload = {
              customerProfile,
            };
            this.props.getCustomerBasicInfo(payload);
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
    }
  };

  updateProfile = (e) => {
    e.preventDefault();
    const data = {
      ...this.props.customerInfo.customerProfile,
      CustomerID: localStorage.getItem('userId'),
    };
    axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    axios.put(serverUrl + 'customer/updateProfile', data).then(
      (response) => {
        // console.log('Status Code : ', response.status);
        if (response.status === 204) {
          // console.log(response.data);
          let payload = {
            success: true,
            message: 'Profile Updated Successfully!',
          };
          this.props.updateSnackbarData(payload);
        }
      },
      (error) => {
        // console.log(error);
      }
    );
  };

  render() {
    const defaultImage =
      'https://s3-media0.fl.yelpcdn.com/assets/srv0/yelp_styleguide/bf5ff8a79310/assets/img/default_avatars/user_medium_square.png';
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
      <div>
        {redirectVar}
        {<CustomerNavBar />}

        <span id="page-content" className="offscreen">
          &nbsp;
        </span>
        <div className="main-content-wrap main-content-wrap--full">
          <div className="content-container" id="super-container">
            <div className=" clearfix layout-block layout-n column--responsive account-settings_container">
              <div className="column column-beta column--responsive">
                <div className="account-settings_content">
                  <div className="section-header clearfix">
                    <h2>Profile</h2>
                  </div>
                  <form
                    onSubmit={this.updateProfile}
                    className="profile-bio yform yform-vertical-spacing"
                  >
                    <div className="ysection">
                      <h4>
                        Your Profile Photo
                        <strong>
                          <a href="/#">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={this.onChangeFileHandler}
                              name="fileName"
                              id="filename"
                              multiple
                            />
                          </a>
                        </strong>
                      </h4>

                      <div className="photo-box pb-m">
                        <a
                          className="js-analytics-click"
                          data-analytics-label="user-photo"
                          href="/user_photos?return_url=%2Fprofile%3Freturn_url%3D%252Fuser_details%253Fuserid%253DSbr_JFt86Dss0N-hb9StQg"
                        >
                          <img
                            style={{ width: '150px', height: '120px' }}
                            alt=""
                            className="photo-box-img"
                            src={
                              this.props.customerInfo.customerProfile.ImageURL !== null &&
                              this.props.customerInfo.customerProfile.ImageURL.length > 0
                                ? this.props.customerInfo.customerProfile.ImageURL
                                : defaultImage
                            }
                            // src="https://s3-media0.fl.yelpcdn.com/assets/srv0/yelp_styleguide/bf5ff8a79310/assets/img/default_avatars/user_medium_square.png"
                          />
                        </a>
                      </div>
                    </div>
                    <label htmlFor="first_name">First Name</label>
                    <span className="help-block">This field is required.</span>
                    <input
                      maxLength="50"
                      id="first_name"
                      name="FirstName"
                      placeholder=""
                      size="30"
                      type="text"
                      value={this.props.customerInfo.customerProfile.FirstName}
                      onChange={this.onChangeCommonHandler}
                      required
                    ></input>
                    <label htmlFor="last_name">Last Name</label>
                    <span className="help-block">
                      This field is required. Only your last initial will show on your profile.
                    </span>
                    <input
                      id="last_name"
                      maxLength="32"
                      name="LastName"
                      placeholder=""
                      size="30"
                      type="text"
                      value={this.props.customerInfo.customerProfile.LastName}
                      onChange={this.onChangeCommonHandler}
                      required
                    />
                    <label htmlFor="nickname">Nickname</label>
                    <span className="help-block">
                      The Boss, Calamity Jane, The Prolific Reviewer
                    </span>
                    <input
                      id="nickname"
                      maxLength="50"
                      name="NickName"
                      placeholder=""
                      size="30"
                      type="text"
                      value={this.props.customerInfo.customerProfile.NickName}
                      onChange={this.onChangeCommonHandler}
                    />
                    <label htmlFor="gender">Gender</label>
                    <select
                      name="Gender"
                      placeholder="Gender"
                      className="form-control"
                      onChange={this.onChangeCommonHandler}
                      value={this.props.customerInfo.customerProfile.Gender}
                      required
                    >
                      <option className="Dropdown-menu" key="" value="">
                        -Select-
                      </option>
                      {this.props.masterData.Genders.map((gender) => (
                        <option className="Dropdown-menu" key={gender.key} value={gender.value}>
                          {gender.value}
                        </option>
                      ))}
                    </select>
                    <label htmlFor="Headline">Your Headline</label>
                    <span className="help-block">
                      Taco Tuesday Aficionado, The Globetrotting Reviewer
                    </span>
                    <input
                      id="Headline"
                      maxLength="100"
                      name="Headline"
                      placeholder=""
                      size="30"
                      type="text"
                      value={this.props.customerInfo.customerProfile.Headline}
                      onChange={this.onChangeCommonHandler}
                    />
                    <label htmlFor="love_name">I Love...</label>
                    <span className="help-block">
                      Comma separated phrases (e.g. sushi, Radiohead, puppies)
                    </span>
                    <textarea
                      id="love_name"
                      maxLength="1024"
                      name="ILove"
                      size="30"
                      type="text"
                      value={this.props.customerInfo.customerProfile.ILove}
                      onChange={this.onChangeCommonHandler}
                    ></textarea>
                    <label htmlFor="find_me_in">Find Me In</label>
                    <span className="help-block">
                      Nob Hill, the newest brunch spot, a turtleneck
                    </span>
                    <input
                      id="find_me_in"
                      maxLength="80"
                      name="FindMeIn"
                      placeholder=""
                      size="30"
                      type="text"
                      value={this.props.customerInfo.customerProfile.FindMeIn}
                      onChange={this.onChangeCommonHandler}
                    />
                    <label htmlFor="blog">My Blog Or Website</label>
                    <span className="help-block">www.example.com/myawesomeblog</span>
                    <input
                      id="blog"
                      maxLength="80"
                      name="Website"
                      placeholder=""
                      size="30"
                      type="text"
                      value={this.props.customerInfo.customerProfile.Website}
                      onChange={this.onChangeCommonHandler}
                    />
                    <label htmlFor="Cpuntry">Country</label>
                    <select
                      name="CountryName"
                      placeholder="Country"
                      className="form-control"
                      onChange={this.onChangeCommonHandler}
                      value={this.props.customerInfo.customerProfile.CountryName}
                    >
                      <option className="Dropdown-menu" key="" value="">
                        -Select-
                      </option>
                      {this.props.masterData.Countries.map((country) => (
                        <option className="Dropdown-menu" key={country.key} value={country.value}>
                          {country.value}
                        </option>
                      ))}
                    </select>
                    <label htmlFor="State">State</label>
                    <select
                      name="StateName"
                      placeholder="State"
                      className="form-control"
                      onChange={this.onChangeCommonHandler}
                      value={this.props.customerInfo.customerProfile.StateName}
                    >
                      <option className="Dropdown-menu" key="" value="">
                        -Select-
                      </option>
                      {this.props.masterData.States.map((state) => (
                        <option className="Dropdown-menu" key={state.key} value={state.value}>
                          {state.value}
                        </option>
                      ))}
                    </select>
                    <label htmlFor="Zip Code">
                      Zip Code<span style={{ color: 'red' }}>{this.state.errors['zipError']}</span>
                    </label>
                    <input
                      minLength="5"
                      maxLength="5"
                      id="zipCode"
                      name="zipCode"
                      placeholder="zipCode"
                      type="text"
                      onChange={this.onChangeHandlerZipCode}
                      value={this.props.customerInfo.customerProfile.Zip}
                    />
                    <label htmlFor="City">City</label>
                    <input
                      id="city"
                      name="City"
                      placeholder="City"
                      type="text"
                      onChange={this.onChangeCommonHandler}
                      value={this.props.customerInfo.customerProfile.City}
                    />
                    <label htmlFor="Street">Street</label>
                    <input
                      id="street"
                      name="Street"
                      placeholder="Street"
                      type="text"
                      onChange={this.onChangeCommonHandler}
                      value={this.props.customerInfo.customerProfile.Street}
                    />
                    <label htmlFor="DOB">
                      Date Of Birth
                      <span style={{ color: 'red' }}>{this.state.errors['dateError']}</span>
                    </label>
                    <input
                      id="DOB"
                      name="DOB"
                      type="date"
                      //step="1"
                      value={this.state.time}
                      placeholder="Date"
                      onChange={this.onChangeDate}
                      value={this.props.customerInfo.customerProfile.DOB}
                    />
                    <button
                      disabled={
                        this.state.errors.zipError.length !== 0 ||
                        this.state.errors.dateError.length !== 0
                      }
                      type="submit"
                      className="ybtn ybtn--primary ybtn-full-responsive-small"
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

export default connect(mapStateToProps, mapDispatchToProps)(UpdateProfile);
