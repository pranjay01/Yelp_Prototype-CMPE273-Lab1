import React, { Component } from 'react';
import axios from 'axios';
import serverUrl from '../../../config';
import cookie from 'react-cookies';
import { updateHomeProfile } from '../../../constants/action-types';
import { connect } from 'react-redux';
import { updateSnackbarData } from '../../../constants/action-types';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFormDisable: true,
      submitError: false,
      submitErrorBlock: '',

      ImageUrl: '',
      tmpEditProfile: null,
    };
  }

  componentDidMount() {}

  editProfile = () => {
    if (this.state.isFormDisable) {
      let tmpEditProfile = {
        ...this.props.restaurantProfile,
      };
      this.setState({
        isFormDisable: !this.state.isFormDisable,
        tmpEditProfile,
        submitError: false,
      });
    } else {
      let orignalData = this.state.tmpEditProfile;

      let payload = {
        ...orignalData,
      };
      this.props.updateHomeProfile(payload);

      this.setState({
        tmpEditProfile: null,
        isFormDisable: !this.state.isFormDisable,

        submitError: false,
      });
    }
  };

  onChangeHandlerName = (e) => {
    let payload = {
      Name: e.target.value,
    };
    this.props.updateHomeProfile(payload);
    this.setState({
      submitError: false,
    });
  };

  onChangeHandlerEmail = (e) => {
    let payload = {
      Email: e.target.value,
    };
    this.props.updateHomeProfile(payload);
    this.setState({
      submitError: false,
    });
  };

  onChangeHandlerCountryCode = (e) => {
    let payload = {
      CountryCode: e.target.value,
    };
    this.props.updateHomeProfile(payload);
    this.setState({
      submitError: false,
    });
  };

  onChangeHandlerPhoneNo = (e) => {
    let payload = {
      PhoneNo: e.target.value,
    };
    this.props.updateHomeProfile(payload);
    this.setState({
      submitError: false,
    });
  };

  onChangeHandlerCountry = (e) => {
    let payload = {
      CountryName: e.target.value,
    };
    this.props.updateHomeProfile(payload);
    this.setState({
      submitError: false,
    });
  };

  onChangeHandlerState = (e) => {
    // let index = this.state.States.findIndex((x) => x.key === Number(e.target.value));
    let payload = {
      restaurantAddress:
        this.props.restaurantProfile.Street +
        ' ' +
        this.props.restaurantProfile.City +
        ' ' +
        e.target.value +
        ' ' +
        this.props.restaurantProfile.Zip,
      StateName: e.target.value,
    };
    this.props.updateHomeProfile(payload);
    this.setState({
      submitError: false,
    });
  };

  onChangeHandlerZipCode = (e) => {
    let payload = {
      restaurantAddress:
        this.props.restaurantProfile.Street +
        ' ' +
        this.props.restaurantProfile.City +
        ' ' +
        this.props.restaurantProfile.StateName +
        ' ' +
        e.target.value,
      Zip: e.target.value,
    };
    this.props.updateHomeProfile(payload);
    this.setState({
      submitError: false,
    });
  };

  onChangeHandlerCity = (e) => {
    let payload = {
      restaurantAddress:
        this.props.restaurantProfile.Street +
        ' ' +
        e.target.value +
        ' ' +
        this.props.restaurantProfile.StateName +
        ' ' +
        this.props.restaurantProfile.Zip,
      City: e.target.value,
    };
    this.props.updateHomeProfile(payload);
    this.setState({
      submitError: false,
    });
  };

  onChangeHandlerStreet = (e) => {
    let payload = {
      restaurantAddress:
        e.target.value +
        ' ' +
        this.props.restaurantProfile.City +
        ' ' +
        this.props.restaurantProfile.StateName +
        ' ' +
        this.props.restaurantProfile.Zip,
      Street: e.target.value,
    };
    this.props.updateHomeProfile(payload);
    this.setState({
      submitError: false,
    });
  };

  onChangeHandlerOpeningTime = (e) => {
    let payload = {
      OpeningTime: e.target.value,
    };
    this.props.updateHomeProfile(payload);
    this.setState({
      submitError: false,
    });
  };

  onChangeHandlerClosingTime = (e) => {
    let payload = {
      ClosingTime: e.target.value,
    };
    this.props.updateHomeProfile(payload);
    this.setState({
      submitError: false,
    });
  };

  onChangeHandlerYelpDelivery = () => {
    let payload = {
      YelpDelivery: !this.props.restaurantProfile.YelpDelivery,
    };
    this.props.updateHomeProfile(payload);
    this.setState({
      submitError: false,
    });
  };
  onChangeHandlerCurbsidePickup = () => {
    let payload = {
      CurbsidePickup: !this.props.restaurantProfile.CurbsidePickup,
    };
    this.props.updateHomeProfile(payload);
    this.setState({
      submitError: false,
    });
  };
  onChangeHandlerDineIn = () => {
    let payload = {
      DineIn: !this.props.restaurantProfile.DineIn,
    };
    this.props.updateHomeProfile(payload);
    this.setState({
      submitError: false,
    });
  };

  ValidityUpdateProfile = () => {
    let ErrorStr = '';
    if (this.props.restaurantProfile.Name.length == 0) {
      ErrorStr = ErrorStr + 'Name cannot be Empty';
    }
    if (this.props.restaurantProfile.CountryCode === '') {
      if (ErrorStr) {
        ErrorStr += ', ';
      }
      ErrorStr = ErrorStr + 'Select correct Phone Extention';
    }

    if (this.props.restaurantProfile.StateName === '') {
      if (ErrorStr) {
        ErrorStr += ', ';
      }
      ErrorStr = ErrorStr + 'Select correct State';
    }
    if (this.props.restaurantProfile.City.length === 0) {
      if (ErrorStr) {
        ErrorStr += ', ';
      }
      ErrorStr = ErrorStr + 'City cannot be empty';
    }

    if (this.props.restaurantProfile.CountryName === '') {
      if (ErrorStr) {
        ErrorStr += ', ';
      }
      ErrorStr = ErrorStr + 'Select Country';
    }

    if (!/^\d+$/.test(this.props.restaurantProfile.Zip)) {
      if (ErrorStr) {
        ErrorStr += ', ';
      }
      ErrorStr = ErrorStr + 'Validate Zip Code';
    }

    if (!/^\d+$/.test(this.props.restaurantProfile.PhoneNo)) {
      if (ErrorStr) {
        ErrorStr += ', ';
      }
      ErrorStr = ErrorStr + 'Validate Phone Number';
    }

    if (ErrorStr.length == 0) {
      ErrorStr = 'Correct';
    }
    return ErrorStr;
  };

  onSubmitUpdateProfile = (e) => {
    const validateCheck = this.ValidityUpdateProfile();
    if (validateCheck === 'Correct') {
      //prevent page from refresh
      e.preventDefault();
      const data = {
        ...this.props.restaurantProfile,
        RestaurantID: localStorage.getItem('userId'),
      };
      //set the with credentials to true
      axios.defaults.withCredentials = true;
      //make a post request with the user data
      axios.post(serverUrl + 'biz/updateRestaurantProfile', data).then(
        (response) => {
          console.log('Status Code : ', response.status);
          if (response.status === 200) {
            console.log('Profile Updated');
            const payload = {
              success: true,
              message: response.data,
            };
            this.props.updateSnackbarData(payload);
            this.setState({
              isFormDisable: true,
              submitError: false,
              tmpEditProfile: null,
            });
          }
        },
        (error) => {
          this.setState({
            submitErrorBlock: error.response.data,
            submitError: false,
          });
        }
      );
    } else {
      this.setState({
        submitErrorBlock: validateCheck,
        submitError: true,
      });
    }
  };

  onChangeFileHandler = (event) => {
    if (event.target.files.length === 1) {
      axios.defaults.withCredentials = true;
      event.preventDefault();
      let formData = new FormData();
      formData.append('_id', localStorage.getItem('userId'));
      formData.append('file', event.target.files[0], event.target.files[0].name);
      axios({
        method: 'post',
        url: serverUrl + 'biz/uploadPicToMulter',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      })
        .then((response) => {
          console.log('Status Code : ', response.status);
          if (parseInt(response.status) === 200) {
            console.log('Product Saved');
            const payload = {
              ImageURL: response.data,
            };
            this.props.updateHomeProfile(payload);
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

  render(/**<fieldset disabled> */) {
    const defaultImage =
      'https://s3-media0.fl.yelpcdn.com/assets/srv0/yelp_styleguide/bf5ff8a79310/assets/img/default_avatars/user_medium_square.png';

    let errorClass = 'alert alert-error ';
    if (!this.state.submitError) {
      errorClass += 'hidden';
    }
    return (
      <div style={{ marginTop: '3%' }}>
        <div class={errorClass}>
          <p class="alert-message">
            <ul>{this.state.submitErrorBlock}</ul>
          </p>
        </div>
        <form
          onSubmit={this.onSubmitUpdateProfile}
          class="yform signup-form  city-hidden"
          id="signup-form"
        >
          <h4>
            Your Profile Photo
            <strong>
              <a href="/#">
                <input
                  disabled={this.state.isFormDisable && 'disabled'}
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

          <div class="photo-box pb-m">
            <a
              class="js-analytics-click"
              data-analytics-label="user-photo"
              href="/user_photos?return_url=%2Fprofile%3Freturn_url%3D%252Fuser_details%253Fuserid%253DSbr_JFt86Dss0N-hb9StQg"
            >
              <img
                style={{ width: '150px', height: '120px' }}
                alt=""
                class="photo-box-img"
                src={
                  this.props.restaurantProfile.ImageURL !== null &&
                  this.props.restaurantProfile.ImageURL.length > 0
                    ? this.props.restaurantProfile.ImageURL
                    : defaultImage
                }
                // src="https://s3-media0.fl.yelpcdn.com/assets/srv0/yelp_styleguide/bf5ff8a79310/assets/img/default_avatars/user_medium_square.png"
              />
            </a>
          </div>
          <br />
          <fieldset disabled={this.state.isFormDisable && 'disabled'}>
            <div class="js-password-meter-container">
              <ul>
                <li style={{ width: '40%' }}>
                  <label class="placeholder-sub">Restaurant Name</label>
                  <input
                    id="first_name"
                    name="first_name"
                    placeholder="Name"
                    required="required"
                    type="text"
                    onChange={this.onChangeHandlerName}
                    value={this.props.restaurantProfile.Name}
                  />
                </li>
              </ul>
              <fieldset class="login-separator hr-line">
                <legend align="left">Contact Information</legend>
              </fieldset>
              <ul class="inline-layout clearfix">
                <li style={{ width: '40%' }}>
                  <label class="placeholder-sub">Email</label>
                  <input
                    id="email"
                    name="email"
                    placeholder="Email"
                    required="required"
                    type="email"
                    // onChange={this.onChangeHandlerEmail}
                    value={this.props.restaurantProfile.Email}
                    disabled="disabled"
                  />
                </li>
                <li style={{ width: '10%' }}></li>
                <li style={{ width: '10%' }}>
                  <label class="placeholder-sub">Country Code</label>
                  <select
                    placeholder="countryCode"
                    className="form-control"
                    onChange={this.onChangeHandlerCountryCode}
                    value={this.props.restaurantProfile.CountryCode}
                    required
                  >
                    <option className="Dropdown-menu" key="" value=""></option>
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
                </li>
                <li style={{ width: '40%' }}>
                  <label class="placeholder-sub">Phone-No</label>
                  <input
                    id="phoneNo"
                    name="phoneNo"
                    placeholder="Phone-No"
                    required="required"
                    type="text"
                    onChange={this.onChangeHandlerPhoneNo}
                    value={this.props.restaurantProfile.PhoneNo}
                    minlength="10"
                    maxlength="10"
                  />
                </li>
              </ul>
            </div>
            <fieldset class="login-separator hr-line">
              <legend align="left">Address</legend>
            </fieldset>
            <div class="js-more-fields more-fields">
              <ul class="inline-layout clearfix">
                <li style={{ width: '30%' }}>
                  <label class="placeholder-sub">Country</label>
                  <select
                    placeholder="Gender"
                    className="form-control"
                    onChange={this.onChangeHandlerCountry}
                    value={this.props.restaurantProfile.CountryName}
                    required
                  >
                    <option className="Dropdown-menu" key="" value="">
                      Country
                    </option>
                    {this.props.masterData.Countries.map((country) => (
                      <option className="Dropdown-menu" key={country.key} value={country.value}>
                        {country.value}
                      </option>
                    ))}
                  </select>
                </li>
                <li style={{ width: '5%' }}></li>
                <li style={{ width: '30%' }}>
                  <label class="placeholder-sub">State</label>
                  <select
                    placeholder="State"
                    className="form-control"
                    onChange={this.onChangeHandlerState}
                    value={this.props.restaurantProfile.StateName}
                    required
                  >
                    <option className="Dropdown-menu" key="" value="">
                      State
                    </option>
                    {this.props.masterData.States.map((state) => (
                      <option className="Dropdown-menu" key={state.key} value={state.value}>
                        {state.value}
                      </option>
                    ))}
                  </select>
                </li>
                <li style={{ width: '5%' }}></li>
                <li style={{ width: '30%' }}>
                  <label class="placeholder-sub">Zip Code</label>
                  <input
                    minlength="5"
                    maxlength="5"
                    id="zipCode"
                    name="zipCode"
                    placeholder="zipCode"
                    required="required"
                    type="text"
                    onChange={this.onChangeHandlerZipCode}
                    value={this.props.restaurantProfile.Zip}
                  />
                </li>
                <li style={{ width: '30%' }}>
                  <label class="placeholder-sub">City</label>
                  <input
                    id="city"
                    name="city"
                    placeholder="City"
                    required="required"
                    type="text"
                    onChange={this.onChangeHandlerCity}
                    value={this.props.restaurantProfile.City}
                  />
                </li>
                <li style={{ width: '70%' }}>
                  <label class="placeholder-sub">Street</label>
                  <input
                    id="street"
                    name="street"
                    placeholder="Street"
                    required="required"
                    type="text"
                    onChange={this.onChangeHandlerStreet}
                    value={this.props.restaurantProfile.Street}
                  />
                </li>
              </ul>
              <fieldset class="login-separator hr-line">
                <legend align="left">Business Information</legend>
              </fieldset>
              <ul class="inline-layout clearfix">
                <li style={{ width: '30%' }}>
                  <label class="">Curbside Pickup</label>
                  <input
                    style={{ width: '20px', height: '20px' }}
                    name="isGoing"
                    type="checkbox"
                    checked={this.props.restaurantProfile.CurbsidePickup}
                    onChange={this.onChangeHandlerCurbsidePickup}
                  />
                </li>
                <li style={{ width: '30%' }}>
                  <label class="">Dine In</label>
                  <input
                    style={{ width: '20px', height: '20px' }}
                    name="isGoing"
                    type="checkbox"
                    checked={this.props.restaurantProfile.DineIn}
                    onChange={this.onChangeHandlerDineIn}
                  />
                </li>
                <li style={{ width: '30%' }}>
                  <label class="">Yelp Delivery</label>
                  <input
                    style={{ width: '20px', height: '20px' }}
                    name="isGoing"
                    type="checkbox"
                    checked={this.props.restaurantProfile.YelpDelivery}
                    onChange={this.onChangeHandlerYelpDelivery}
                  />
                </li>
              </ul>
              <ul class="inline-layout clearfix">
                <li style={{ width: '40%' }}>
                  <label class="">Opening Time</label>
                  <input
                    type="time"
                    step="1"
                    //value={this.state.time}
                    className="form-control"
                    placeholder="Time"
                    onChange={this.onChangeHandlerOpeningTime}
                    value={this.props.restaurantProfile.OpeningTime}
                  />
                </li>
                <li style={{ width: '40%' }}>
                  <label class="">Closing Time</label>
                  <input
                    type="time"
                    step="1"
                    // value={this.state.time}
                    className="form-control"
                    placeholder="Time"
                    onChange={this.onChangeHandlerClosingTime}
                    value={this.props.restaurantProfile.ClosingTime}
                  />
                </li>
              </ul>
            </div>
            {!this.state.isFormDisable && (
              <div>
                <button
                  id="signup-button"
                  type="submit"
                  class="ybtn ybtn--primary ybtn--big disable-on-submit submit signup-button"
                  style={{
                    marginTop: '2%',
                    marginLeft: '40%',
                  }}
                >
                  <span>Save</span>
                </button>

                <button
                  class="ybtn ybtn--primary ybtn--big disable-on-submit submit signup-button"
                  style={{
                    marginTop: '2%',
                    marginLeft: '2%',
                  }}
                  onClick={this.editProfile}
                >
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </fieldset>
        </form>
        {this.state.isFormDisable && (
          <button
            class="ybtn ybtn--primary ybtn--big disable-on-submit submit signup-button"
            style={{
              marginTop: '2%',
              marginLeft: '45%',
            }}
            onClick={this.editProfile}
          >
            <span>Edit</span>
          </button>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { restaurantHome } = state.restaurantHomePageReducer;
  const { masterData } = state.masterDataReducer;
  return {
    restaurantProfile: restaurantHome,
    masterData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateHomeProfile: (payload) => {
      dispatch({
        type: updateHomeProfile,
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

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

// export default Profile;
