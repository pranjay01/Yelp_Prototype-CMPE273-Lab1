import React, { Component } from 'react';
import axios from 'axios';
import serverUrl from '../../../config';
import cookie from 'react-cookies';
import { updateHomeProfile } from '../../../constants/action-types';
import { connect } from 'react-redux';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Name: '',
      Email: '',
      Country_ID: '',
      State_ID: '',
      City: '',
      Zip: '',
      Street: '',
      Phone_no: '',
      Country_Code: '',
      Opening_Time: '',
      Closing_Time: '',
      Countries: [],
      States: [],
      CountryCodes: [],
      isFormDisable: true,
      submitError: false,
      submitErrorBlock: '',
      CurbsidePickup: false,
      DineIn: false,
      YelpDelivery: false,
      tmpEditProfile: {
        Name: '',
        Email: '',
        Country_ID: '',
        State_ID: '',
        City: '',
        Zip: '',
        Street: '',
        Phone_no: '',
        Country_Code: '',
        Opening_Time: '',
        Closing_Time: '',
        CurbsidePickup: false,
        DineIn: false,
        YelpDelivery: false,
      },
    };
  }

  componentDidMount() {
    axios.get(serverUrl + 'biz/restaurantCompleteProfile', { withCredentials: true }).then(
      (response) => {
        if (response.status === 200) {
          let CurbsidePickup = false;
          let DineIn = false;
          let YelpDelivery = false;
          let DeliveryOptions = response.data[1];
          DeliveryOptions.forEach(function (option) {
            if (option.ID === 1) {
              CurbsidePickup = true;
            }
            if (option.ID === 2) {
              DineIn = true;
            }
            if (option.ID === 3) {
              YelpDelivery = true;
            }
          });
          this.setState({
            Name: response.data[0][0].Name,
            Email: response.data[0][0].Email,
            Country_ID: response.data[0][0].Country_ID,
            State_ID: response.data[0][0].State_ID,
            City: response.data[0][0].City,
            Street: response.data[0][0].Street,
            Zip: response.data[0][0].Zip,
            Phone_no: response.data[0][0].Phone_no,
            Country_Code: response.data[0][0].Country_Code,
            Opening_Time: response.data[0][0].Opening_Time,
            Closing_Time: response.data[0][0].Closing_Time,
            CurbsidePickup,
            DineIn,
            YelpDelivery,
            isFormDisable: true,
          });
          console.log(this.state);
          console.log(response.data);
        }
      },

      (error) => {
        console.log(error.response.data);
      }
    );

    axios.get(serverUrl + 'static/signupMasterData').then((response) => {
      console.log(response.data);
      let allCountries = response.data[0].map((country) => {
        return { key: country.ID, value: country.Name };
      });
      let allStates = response.data[1].map((state) => {
        return { key: state.ID, value: state.Name };
      });
      let allCountrieCodes = response.data[0].map((countryCode) => {
        return { key: countryCode.ID, value: countryCode.Country_Code };
      });
      this.setState({
        Countries: this.state.Countries.concat(allCountries),
        States: this.state.States.concat(allStates),
        CountryCodes: this.state.CountryCodes.concat(allCountrieCodes),
      });
    });
  }

  editProfile = () => {
    if (this.state.isFormDisable) {
      let tmpEditProfile = {
        Name: this.state.Name,
        Email: this.state.Email,
        Country_ID: this.state.Country_ID,
        State_ID: Number(this.state.State_ID),
        City: this.state.City,
        Zip: this.state.Zip,
        Street: this.state.Street,
        Phone_no: this.state.Phone_no,
        Country_Code: this.state.Country_Code,
        Opening_Time: this.state.Opening_Time,
        Closing_Time: this.state.Closing_Time,
        CurbsidePickup: this.state.CurbsidePickup,
        DineIn: this.state.DineIn,
        YelpDelivery: this.state.YelpDelivery,
      };
      this.setState({
        isFormDisable: !this.state.isFormDisable,
        tmpEditProfile,
        submitError: false,
      });
    } else {
      let orignalData = this.state.tmpEditProfile;
      let tmpEditProfile = {
        Name: '',
        Email: '',
        Country_ID: '',
        State_ID: '',
        City: '',
        Zip: '',
        Street: '',
        Phone_no: '',
        Country_Code: '',
        Opening_Time: '',
        Closing_Time: '',
        CurbsidePickup: false,
        DineIn: false,
        YelpDelivery: false,
      };
      this.setState({
        Name: orignalData.Name,
        Email: orignalData.Email,
        Country_ID: orignalData.Country_ID,
        State_ID: orignalData.State_ID,
        City: orignalData.City,
        Zip: orignalData.Zip,
        Street: orignalData.Street,
        Phone_no: orignalData.Phone_no,
        Country_Code: orignalData.Country_Code,
        Opening_Time: orignalData.Opening_Time,
        Closing_Time: orignalData.Closing_Time,
        CurbsidePickup: orignalData.CurbsidePickup,
        DineIn: orignalData.DineIn,
        YelpDelivery: orignalData.YelpDelivery,
        tmpEditProfile,
        isFormDisable: !this.state.isFormDisable,

        submitError: false,
      });
      let index = this.state.States.findIndex((x) => x.key === orignalData.State_ID);
      let payload = {
        restaurantAddress:
          orignalData.Street +
          ' ' +
          orignalData.City +
          ' ' +
          this.state.States[index].value +
          ' ' +
          orignalData.Zip,
        restaurantName: orignalData.Name,
      };
      this.props.updateHomeProfile(payload);
    }
  };

  onChangeHandlerName = (e) => {
    let payload = {
      restaurantName: e.target.value,
    };
    this.props.updateHomeProfile(payload);
    this.setState({
      Name: e.target.value,
      submitError: false,
    });
  };

  onChangeHandlerEmail = (e) => {
    this.setState({
      Email: e.target.value,
      submitError: false,
    });
  };

  onChangeHandlerCountryCode = (e) => {
    this.setState({
      Country_Code: e.target.value,
      submitError: false,
    });
  };

  onChangeHandlerPhoneNo = (e) => {
    this.setState({
      Phone_no: e.target.value,
      submitError: false,
    });
  };

  onChangeHandlerCountry = (e) => {
    this.setState({
      Country_ID: e.target.value,
      submitError: false,
    });
  };

  onChangeHandlerState = (e) => {
    let index = this.state.States.findIndex((x) => x.key === Number(e.target.value));
    let payload = {
      restaurantAddress:
        this.state.Street +
        ' ' +
        this.state.City +
        ' ' +
        this.state.States[index].value +
        ' ' +
        this.state.Zip,
    };
    this.props.updateHomeProfile(payload);
    this.setState({
      State_ID: e.target.value,
      submitError: false,
    });
  };

  onChangeHandlerZipCode = (e) => {
    let index = this.state.States.findIndex((x) => x.key === Number(this.state.State_ID));
    let payload = {
      restaurantAddress:
        this.state.Street +
        ' ' +
        this.state.City +
        ' ' +
        this.state.States[index].value +
        ' ' +
        e.target.value,
    };
    this.props.updateHomeProfile(payload);
    this.setState({
      Zip: e.target.value,
      submitError: false,
    });
  };

  onChangeHandlerCity = (e) => {
    let index = this.state.States.findIndex((x) => x.key === Number(this.state.State_ID));
    let payload = {
      restaurantAddress:
        this.state.Street +
        ' ' +
        e.target.value +
        ' ' +
        this.state.States[index].value +
        ' ' +
        this.state.Zip,
    };
    this.props.updateHomeProfile(payload);
    this.setState({
      City: e.target.value,
      submitError: false,
    });
  };

  onChangeHandlerStreet = (e) => {
    let index = this.state.States.findIndex((x) => x.key === Number(this.state.State_ID));
    let payload = {
      restaurantAddress:
        e.target.value +
        ' ' +
        this.state.City +
        ' ' +
        this.state.States[index].value +
        ' ' +
        this.state.Zip,
    };
    this.props.updateHomeProfile(payload);
    this.setState({
      Street: e.target.value,
      submitError: false,
    });
  };

  onChangeHandlerOpeningTime = (e) => {
    this.setState({
      Opening_Time: e.target.value,
      submitError: false,
    });
  };

  onChangeHandlerClosingTime = (e) => {
    this.setState({
      Closing_Time: e.target.value,
      submitError: false,
    });
  };

  onChangeHandlerYelpDelivery = () => {
    this.setState({
      YelpDelivery: !this.state.YelpDelivery,
      submitError: false,
    });
  };
  onChangeHandlerCurbsidePickup = () => {
    this.setState({
      CurbsidePickup: !this.state.CurbsidePickup,
    });
  };
  onChangeHandlerDineIn = () => {
    this.setState({
      DineIn: !this.state.DineIn,
    });
  };

  ValidityUpdateProfile = () => {
    let ErrorStr = '';
    if (this.state.Name.length == 0) {
      ErrorStr = ErrorStr + 'Name cannot be Empty';
    }
    if (this.state.Country_Code === '') {
      if (ErrorStr) {
        ErrorStr += ', ';
      }
      ErrorStr = ErrorStr + 'Select correct Phone Extention';
    }

    if (this.state.State_ID === '') {
      if (ErrorStr) {
        ErrorStr += ', ';
      }
      ErrorStr = ErrorStr + 'Select correct State';
    }
    if (this.state.City.length === 0) {
      if (ErrorStr) {
        ErrorStr += ', ';
      }
      ErrorStr = ErrorStr + 'City cannot be empty';
    }

    if (this.state.Country_ID === '') {
      if (ErrorStr) {
        ErrorStr += ', ';
      }
      ErrorStr = ErrorStr + 'Select Country';
    }

    if (!/^\d+$/.test(this.state.Zip)) {
      if (ErrorStr) {
        ErrorStr += ', ';
      }
      ErrorStr = ErrorStr + 'Validate Zip Code';
    }

    if (!/^\d+$/.test(this.state.Phone_no)) {
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
        Name: this.state.Name,
        Country_ID: this.state.Country_ID,
        State_ID: this.state.State_ID,
        City: this.state.City,
        Zip: this.state.Zip,
        Street: this.state.Street,
        Country_Code: this.state.Country_Code,
        Phone_no: this.state.Phone_no,
        Opening_Time: this.state.Opening_Time,
        Closing_Time: this.state.Closing_Time,
        CurbsidePickup: this.state.CurbsidePickup,
        DineIn: this.state.DineIn,
        YelpDelivery: this.state.YelpDelivery,
        token: cookie.load('cookie'),
        userrole: cookie.load('userrole'),
      };
      //set the with credentials to true
      axios.defaults.withCredentials = true;
      //make a post request with the user data
      axios.post(serverUrl + 'biz/updateRestaurantProfile', data).then(
        (response) => {
          console.log('Status Code : ', response.status);
          if (response.status === 200) {
            console.log('Profile Updated');
            this.setState({
              isFormDisable: true,
              submitError: false,
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

  render(/**<fieldset disabled> */) {
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
                    value={this.state.Name}
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
                    value={this.state.Email}
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
                    value={this.state.Country_Code}
                    required
                  >
                    <option className="Dropdown-menu" key="" value=""></option>
                    {this.state.CountryCodes.map((countryCode) => (
                      <option
                        className="Dropdown-menu"
                        key={countryCode.key}
                        value={countryCode.key}
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
                    value={this.state.Phone_no}
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
                    value={this.state.Country_ID}
                    required
                  >
                    <option className="Dropdown-menu" key="" value="">
                      Country
                    </option>
                    {this.state.Countries.map((country) => (
                      <option className="Dropdown-menu" key={country.key} value={country.key}>
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
                    value={this.state.State_ID}
                    required
                  >
                    <option className="Dropdown-menu" key="" value="">
                      State
                    </option>
                    {this.state.States.map((state) => (
                      <option className="Dropdown-menu" key={state.key} value={state.key}>
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
                    value={this.state.Zip}
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
                    value={this.state.City}
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
                    value={this.state.Street}
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
                    checked={this.state.CurbsidePickup}
                    onChange={this.onChangeHandlerCurbsidePickup}
                  />
                </li>
                <li style={{ width: '30%' }}>
                  <label class="">Dine In</label>
                  <input
                    style={{ width: '20px', height: '20px' }}
                    name="isGoing"
                    type="checkbox"
                    checked={this.state.DineIn}
                    onChange={this.onChangeHandlerDineIn}
                  />
                </li>
                <li style={{ width: '30%' }}>
                  <label class="">Yelp Delivery</label>
                  <input
                    style={{ width: '20px', height: '20px' }}
                    name="isGoing"
                    type="checkbox"
                    checked={this.state.YelpDelivery}
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
                    value={this.state.time}
                    className="form-control"
                    placeholder="Time"
                    onChange={this.onChangeHandlerOpeningTime}
                    value={this.state.Opening_Time}
                  />
                </li>
                <li style={{ width: '40%' }}>
                  <label class="">Closing Time</label>
                  <input
                    type="time"
                    step="1"
                    value={this.state.time}
                    className="form-control"
                    placeholder="Time"
                    onChange={this.onChangeHandlerClosingTime}
                    value={this.state.Closing_Time}
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

        {/*<Form>
          <Form.Row>
            <Form.Group as={Col} controlId="formGridEmail">
              <Form.Label>Name</Form.Label>
              <Form.Control type="email" placeholder="Enter email" value={this.state.Name} />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>
          </Form.Row>

          <Form.Group controlId="formGridAddress1">
            <Form.Label>Address</Form.Label>
            <Form.Control placeholder="1234 Main St" />
          </Form.Group>

          <Form.Group controlId="formGridAddress2">
            <Form.Label>Address 2</Form.Label>
            <Form.Control placeholder="Apartment, studio, or floor" />
          </Form.Group>

          <Form.Row>
            <Form.Group as={Col} controlId="formGridCity">
              <Form.Label>City</Form.Label>
              <Form.Control />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridState">
              <Form.Label>State</Form.Label>
              <Form.Control as="select" defaultValue="Choose...">
                <option>Choose...</option>
                <option>...</option>
              </Form.Control>
            </Form.Group>

            <Form.Group as={Col} controlId="formGridZip">
              <Form.Label>Zip</Form.Label>
              <Form.Control />
            </Form.Group>
          </Form.Row>

          <Form.Group id="formGridCheckbox">
            <Form.Check type="checkbox" label="Check me out" />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>*/}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateHomeProfile: (payload) => {
      dispatch({
        type: updateHomeProfile,
        payload,
      });
    },
  };
};

export default connect(null, mapDispatchToProps)(Profile);

// export default Profile;
