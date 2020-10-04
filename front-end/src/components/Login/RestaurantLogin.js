import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import axios from 'axios';
import serverUrl from '../../config';
import './Login.css';
// import { history } from '../../App';
import { updateLoginSuccess, updateSignupStatus } from '../../constants/action-types';
import { connect } from 'react-redux';

//Define a Login Component
class RestaurantLogin extends Component {
  //call the constructor method
  constructor(props) {
    //Call the constrictor of Super className i.e The Component
    super(props);
    //maintain the state required for this component
    this.state = {
      username: null,
      password: null,
      authFlag: false,
      errorBlock: null,
      inputBlockHighlight: null,
      errorFlag: 1,
      Name: '',
      email: '',
      signupPassword: '',
      sigupSuccessful: false,
      countries: [],
      country: null,
      states: [],
      state: null,
      countryCodes: [],
      countryCode: null,
      city: null,
      zip: null,
      street: null,
      contactNo: null,
    };
    //Bind the handlers to this className
    // this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
    // this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
    // this.submitLogin = this.submitLogin.bind(this);
  }
  // Call the Will Mount to set the auth Flag to false
  componentDidMount() {
    console.log('inside Signup');
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
        countries: this.state.countries.concat(allCountries),
        states: this.state.states.concat(allStates),
        countryCodes: this.state.countryCodes.concat(allCountrieCodes),
      });
    });

    this.setState({
      authFlag: false,
    });
  }
  /**Signup Block */
  onChangeHandlerName = (e) => {
    this.setState({
      Name: e.target.value,
    });
  };

  onChangeHandlerEmail = (e) => {
    this.setState({
      email: e.target.value,
      errorBlock: null,
    });
  };

  onChangeHandlerPasswordSignup = (e) => {
    this.setState({
      signupPassword: e.target.value,
    });
  };

  onChangeHandlerCountryCode = (e) => {
    this.setState({
      countryCode: e.target.value,
    });
  };

  onChangeHandlerPhoneNo = (e) => {
    let ErrorStr = null;
    if (e.target.value && !/^\d+$/.test(e.target.value)) {
      ErrorStr = 'Validate Contact Number';
    }
    this.setState({
      contactNo: e.target.value,
      errorBlock: ErrorStr,
    });
  };

  onChangeHandlerCountry = (e) => {
    this.setState({
      country: e.target.value,
    });
  };

  onChangeHandlerState = (e) => {
    this.setState({
      state: e.target.value,
    });
  };

  onChangeHandlerZipCode = (e) => {
    let ErrorStr = null;
    if (e.target.value && !/^\d+$/.test(e.target.value)) {
      ErrorStr = 'Validate Zip Code';
    }
    this.setState({
      zip: e.target.value,
      errorBlock: ErrorStr,
    });
  };

  onChangeHandlerCity = (e) => {
    this.setState({
      city: e.target.value,
      errorBlock: null,
    });
  };
  onChangeHandlerStreet = (e) => {
    this.setState({
      street: e.target.value,
      errorBlock: null,
    });
  };

  ValiditySignup = () => {
    let ErrorStr = '';
    if (this.state.Name.length === 0) {
      ErrorStr = ErrorStr + 'Name cannot be Empty';
    }
    if (this.state.countryCode === '') {
      if (ErrorStr) {
        ErrorStr += ', ';
      }
      ErrorStr = ErrorStr + 'Select correct Phone Extention';
    }

    if (this.state.state === '') {
      if (ErrorStr) {
        ErrorStr += ', ';
      }
      ErrorStr = ErrorStr + 'Select correct State';
    }
    if (this.state.city.length === 0) {
      if (ErrorStr) {
        ErrorStr += ', ';
      }
      ErrorStr = ErrorStr + 'City cannot be empty';
    }

    if (this.state.country === '') {
      if (ErrorStr) {
        ErrorStr += ', ';
      }
      ErrorStr = ErrorStr + 'Select Country';
    }

    if (!/^\d+$/.test(this.state.zip)) {
      if (ErrorStr) {
        ErrorStr += ', ';
      }
      ErrorStr = ErrorStr + 'Validate Zip Code';
    }

    if (!/^\d+$/.test(this.state.contactNo)) {
      if (ErrorStr) {
        ErrorStr += ', ';
      }
      ErrorStr = ErrorStr + 'Validate Phone Number';
    }

    if (ErrorStr.length === 0) {
      ErrorStr = 'Correct';
    }
    return ErrorStr;
  };
  onSubmitSignUp = (e) => {
    //prevent page from refresh
    e.preventDefault();
    const data = {
      Email: this.state.email,
      Password: this.state.signupPassword,
      Name: this.state.Name,
      Country_ID: this.state.country,
      State_ID: this.state.state,
      City: this.state.city,
      Zip: this.state.zip,
      Street: this.state.street,
      Country_Code: this.state.countryCode,
      Phone_no: this.state.contactNo,
    };
    //set the with credentials to true
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    axios.post(serverUrl + 'biz/signup', data).then(
      (response) => {
        console.log('Status Code : ', response.status);
        if (response.status === 201) {
          let payload = {
            userEmail: this.state.email,

            signupStatus: 'SignedUp Successful',
          };
          this.props.updateSignupStatus(payload);

          console.log(response.data);
          this.setState({
            authFlag: true,
            sigupSuccessful: true,
            errorBlock: null,
            inputBlockHighlight: null,
            errorFlag: 1,
            email: '',
            signupPassword: '',
            country: null,
            state: null,
            countryCode: null,
            city: null,
            zip: null,
            street: null,
            contactNo: null,
          });
          setTimeout(window.location.reload(false), 10000);
        } else {
          this.setState({
            authFlag: false,
          });
        }
      },
      (error) => {
        console.log(error.response);
        this.setState({
          errorBlock: error.response.data,
          sigupSuccessful: false,
        });
      }
    );
  };
  /**Login Block */
  removeError = (e) => {
    this.setState({
      errorBlock: null,
      sigupSuccessful: false,
    });
  };
  //username change handler to update state variable with the text entered by the user
  onChangeHandlerUsername = (e) => {
    this.setState({
      username: e.target.value,
      errorBlock: null,
      inputBlockHighlight: null,
      // errorFlag: 1,
    });
  };
  //password change handler to update state variable with the text entered by the user
  onChangeHandlerPassword = (e) => {
    this.setState({
      password: e.target.value,
      errorBlock: null,
      inputBlockHighlight: null,
      // errorFlag: 1,
    });
  };
  //submit Login handler to send a request to the node backend
  submitLogin = (e) => {
    //prevent page from refresh
    e.preventDefault();
    const data = {
      Email: this.state.username,
      Password: this.state.password,
    };
    //set the with credentials to true
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    axios.post(serverUrl + 'biz/login', data).then(
      (response) => {
        console.log('Status Code : ', response.status);
        if (response.status === 200) {
          localStorage.setItem('orderSortBy', 'All');
          localStorage.setItem('tabName', 'Home');
          localStorage.setItem('token', cookie.load('cookie'));
          localStorage.setItem('userrole', cookie.load('userrole'));
          let payload = {
            userEmail: this.state.username,
            role: cookie.load('userrole'),
            loginStatus: true,
          };
          this.props.updateLoginSuccess(payload);
          this.setState({
            authFlag: true,
          });
        } else {
          this.setState({
            authFlag: false,
          });
        }
      },
      (error) => {
        this.setState({
          errorBlock: error.response.data,
          inputBlockHighlight: 'errorBlock',
        });
      }
    );
  };

  render() {
    let redirectVar = null;
    if (cookie.load('cookie')) {
      if (cookie.load('userrole') === 'Restaurant') {
        console.log('redirect to restaurant home page');
        redirectVar = <Redirect to="/restaurantHome" />;
      } else if (cookie.load('userrole') === 'Customer') {
        console.log('redirect to custome home page');
        redirectVar = <Redirect to="/home" />;
      }
    }

    let signupOrLogin = null;
    // console.log(history.location);
    if (this.props.location.pathname === '/restaurantSignup') {
      // if (history.location.pathname === '/restaurantSignup') {
      signupOrLogin = (
        <div class="flow-start">
          <div class="signup-form-container">
            <div class="header">
              <h2>Sign Up for Business</h2>
              <p class="subheading">Connect with great local businesses</p>
              <p class="legal-copy">
                By continuing, you agree to Yelp’s{' '}
                <Link class="legal-link" href="#">
                  Terms of Service
                </Link>{' '}
                and acknowledge Yelp’s{' '}
                <Link class="legal-link" href="#">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
            <div>
              <p class="fb-start">
                <button
                  type="submit"
                  value="submit"
                  class="ybtn ybtn--social ybtn--facebook ybtn-full"
                >
                  <span>
                    <div class="u-text-centered">
                      <span
                        aria-hidden="true"
                        style={{ width: '24px', height: '24px' }}
                        class="icon icon--24-facebook icon--size-24 icon--currentColor"
                      >
                        <svg role="img" class="icon_svg"></svg>
                      </span>{' '}
                      Continue with Facebook
                    </div>
                  </span>
                </button>
              </p>
              <p class="google-start">
                <button
                  type="submit"
                  value="submit"
                  class="ybtn ybtn--social ybtn--google ybtn-full"
                >
                  <span>
                    <div class="u-text-centered">
                      <span class="icon--png">
                        <img
                          height="24"
                          width="24"
                          alt="Yelp"
                          src="https://s3-media0.fl.yelpcdn.com/assets/srv0/yelp_styleguide/cae242fd3929/assets/img/structural/24x24_google_rainbow.png"
                          srcset="https://s3-media0.fl.yelpcdn.com/assets/srv0/yelp_styleguide/c193df424e16/assets/img/structural/24x24_google_rainbow@2x.png 2x"
                        />
                      </span>{' '}
                      Continue with Google
                    </div>
                  </span>
                </button>
              </p>
              <p class="legal-copy">Don't worry, we never post without your permission.</p>
              <fieldset class="hr-line">
                <legend align="center">OR</legend>
              </fieldset>
            </div>
            <form
              onSubmit={this.onSubmitSignUp}
              class="yform signup-form  city-hidden"
              id="signup-form"
            >
              <div class="js-password-meter-container">
                <label class="placeholder-sub"> Restaurant Name</label>
                <input
                  id="first_name"
                  name="first_name"
                  placeholder="Restaurant Name"
                  required="required"
                  type="text"
                  onChange={this.onChangeHandlerName}
                />

                <div>
                  <label class="placeholder-sub">Email</label>
                  <input
                    id="email"
                    name="email"
                    placeholder="Email"
                    required="required"
                    type="email"
                    onChange={this.onChangeHandlerEmail}
                  />

                  <label class="placeholder-sub">Password</label>
                  <input
                    minlength="6"
                    maxlength="18"
                    id="password"
                    name="password"
                    placeholder="Password"
                    required="required"
                    type="password"
                    onChange={this.onChangeHandlerPasswordSignup}
                  />

                  <div class="js-password-meter-wrapper password-meter-wrapper u-hidden">
                    <div class="progress-bar-container--minimal">
                      {/*<h4 class="progress-bar-text"></h4>*/}
                      <div class="progress-bar new js-progress-bar">
                        <div
                          class="progress-bar_fill js-progress-bar_fill new"
                          role="presentation"
                          style={{ width: '0%' }}
                        ></div>
                      </div>
                    </div>

                    <div class="js-password-meter-help-block help-block u-space-b2">
                      Password must be at least 6 characters in length
                    </div>
                    <input
                      type="hidden"
                      class="js-password-meter-strength-result"
                      name="result_password_strength_meter"
                    />
                  </div>

                  <input id="signup_source" name="signup_source" type="hidden" value="default" />
                </div>
              </div>
              <div class="js-more-fields more-fields">
                <ul class="inline-layout clearfix">
                  <li style={{ width: '20%' }}>
                    <label class="placeholder-sub">Country Code</label>
                    <select
                      placeholder="countryCode"
                      className="form-control"
                      onChange={this.onChangeHandlerCountryCode}
                      required
                    >
                      <option className="Dropdown-menu" key="" value=""></option>
                      {this.state.countryCodes.map((countryCode) => (
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
                  <li style={{ width: '80%' }}>
                    <label class="placeholder-sub">Phone-No</label>
                    <input
                      minlength="10"
                      maxlength="10"
                      id="phoneNo"
                      name="phoneNo"
                      placeholder="Phone-No"
                      required="required"
                      type="text"
                      onChange={this.onChangeHandlerPhoneNo}
                    />
                  </li>
                </ul>
                <ul class="inline-layout clearfix">
                  <li>
                    <label class="placeholder-sub">Country</label>
                    <select
                      placeholder="Gender"
                      className="form-control"
                      onChange={this.onChangeHandlerCountry}
                      required
                    >
                      <option className="Dropdown-menu" key="" value="">
                        Country
                      </option>
                      {this.state.countries.map((country) => (
                        <option className="Dropdown-menu" key={country.key} value={country.key}>
                          {country.value}
                        </option>
                      ))}
                    </select>
                  </li>
                  <li>
                    <label class="placeholder-sub">State</label>
                    <select
                      placeholder="State"
                      className="form-control"
                      onChange={this.onChangeHandlerState}
                      required
                    >
                      <option className="Dropdown-menu" key="" value="">
                        State
                      </option>
                      {this.state.states.map((state) => (
                        <option className="Dropdown-menu" key={state.key} value={state.key}>
                          {state.value}
                        </option>
                      ))}
                    </select>
                  </li>
                </ul>
                <ul class="inline-layout clearfix">
                  <li style={{ width: '35%' }}>
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
                    />
                  </li>
                  <li style={{ width: '65%' }}>
                    <label class="placeholder-sub">City</label>
                    <input
                      id="city"
                      name="city"
                      placeholder="City"
                      required="required"
                      type="text"
                      onChange={this.onChangeHandlerCity}
                    />
                  </li>
                  <li style={{ width: '100%' }}>
                    <label class="placeholder-sub">Street</label>
                    <input
                      id="street"
                      name="street"
                      placeholder="Street"
                      required="required"
                      type="text"
                      onChange={this.onChangeHandlerStreet}
                    />
                  </li>
                </ul>
              </div>

              <button
                disabled={!(this.state.errorBlock === null)}
                id="signup-button"
                type="submit"
                class="ybtn ybtn--primary ybtn--big disable-on-submit submit signup-button"
              >
                <span>Sign Up</span>
              </button>
            </form>
          </div>
          <div class="sub-text-box">
            <small class="subtle-text" style={{ textAlign: 'left', paddingRight: '21px' }}>
              Customer Signup?{' '}
              <Link class="login-link" to="/customerSignup">
                Sign Up
              </Link>
            </small>
            <small class="subtle-text">
              Already on Yelp?{' '}
              <Link class="login-link" to="/restaurantLogin">
                Log in
              </Link>
            </small>
          </div>
        </div>
      );
    } else if (this.props.location.pathname === '/restaurantLogin') {
      // } else if (history.location.pathname === '/restaurantLogin') {
      signupOrLogin = (
        <div class="login">
          <div class="signup-form-container">
            <div class="header">
              <h2>Sign in to Business</h2>
              <p class="subheading">
                New to Yelp?{' '}
                <Link class="signup-link " to="/restaurantSignup">
                  Sign up
                </Link>
              </p>
              <p class="legal-copy">
                By logging in, you agree to Yelp’s{' '}
                <Link class="legal-link" to="#">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link class="legal-link" to="#">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
            <ul class="ylist">
              <li class="js-apple-login">
                <div
                  id="appleid-signin"
                  role="button"
                  class="apple-login-button u-cursor-pointer"
                  data-color="black"
                  data-type="sign in"
                  data-border-radius="8%"
                ></div>
              </li>

              <li class="js-fb-login">
                <button
                  type="submit"
                  value="submit"
                  class="ybtn ybtn--social ybtn--facebook ybtn-full"
                >
                  <span>
                    <div class="u-text-centered">
                      <span
                        aria-hidden="true"
                        style={{ width: '24px', height: '24px' }}
                        class="icon icon--24-facebook icon--size-24 icon--currentColor"
                      >
                        <svg role="img" class="icon_svg"></svg>
                      </span>{' '}
                      Sign in with Facebook
                    </div>
                  </span>
                </button>
              </li>

              <li class="js-google-login" data-component-bound="true">
                <button
                  type="submit"
                  value="submit"
                  class="ybtn ybtn--social ybtn--google ybtn-full"
                >
                  <span>
                    <div class="u-text-centered">
                      <span class="icon--png">
                        <img
                          alt="YELP"
                          height="24"
                          width="24"
                          src="https://s3-media0.fl.yelpcdn.com/assets/srv0/yelp_styleguide/cae242fd3929/assets/img/structural/24x24_google_rainbow.png"
                          srcset="https://s3-media0.fl.yelpcdn.com/assets/srv0/yelp_styleguide/c193df424e16/assets/img/structural/24x24_google_rainbow@2x.png 2x"
                        />
                      </span>{' '}
                      Sign in with Google
                    </div>
                  </span>
                </button>
              </li>
            </ul>
            <fieldset class="login-separator hr-line">
              <legend align="center">OR</legend>
            </fieldset>
            <form class="yform" onSubmit={this.submitLogin}>
              <label class="placeholder-sub">Email</label>
              <input
                id="email"
                name="email"
                placeholder="Email"
                required="required"
                type="email"
                onChange={this.onChangeHandlerUsername}
                class={this.state.inputBlockHighlight}
              />
              <label class="placeholder-sub">Password</label>
              <input
                onChange={this.onChangeHandlerPassword}
                id="password"
                name="password"
                placeholder="Password"
                required="required"
                type="password"
                class={this.state.inputBlockHighlight}
              />
              <button type="submit" class="ybtn ybtn--primary ybtn--big submit ybtn-full">
                <span>Sign in</span>
              </button>
            </form>
          </div>
          <div class="sub-text-box">
            <small class="subtle-text">
              Customer Login{' '}
              <Link
                class="signup-link"
                to="/customerLogin"
                style={{ textAlign: 'left', paddingRight: '63px' }}
              >
                Log In
              </Link>
            </small>
            <small class="subtle-text">
              New to Yelp?{' '}
              <Link class="signup-link" to="/restaurantSignup">
                Sign up
              </Link>
            </small>
          </div>
        </div>
      );
    } else {
    }
    let errorBlock = this.state.errorBlock;
    // let signupErrorBlock = this.state.signupErrorBlock;
    let errorClass = 'alert alert-error ';
    if (!errorBlock) {
      errorClass += 'hidden';
    }
    let successClass = 'alert alert-error ';
    if (!this.state.sigupSuccessful) {
      successClass += 'hidden';
    }
    let successBlock = null;
    if (this.state.sigupSuccessful) {
      successBlock = 'Account Created!! Login to Continue.';
    }
    return (
      <div>
        {redirectVar}
        <div>
          <div class="lemon--div__373c0__1mboc header__373c0__AlFmH border-color--default__373c0__2oFDT">
            <div class="lemon--div__373c0__1mboc container__373c0__13FCe transparent__373c0__3oxYH">
              <div class="lemon--div__373c0__1mboc content__373c0__Zrlv5">
                <div class="lemon--div__373c0__1mboc header-arrange__373c0__zC1DR arrange__373c0__UHqhV gutter-18__373c0__31Z0U vertical-align-middle__373c0__2TQsQ border-color--default__373c0__2oFDT">
                  <div class="lemon--div__373c0__1mboc arrange-unit__373c0__1piwO arrange-unit-fill__373c0__17z0h border-color--default__373c0__2oFDT">
                    <div class="lemon--div__373c0__1mboc border-color--default__373c0__2oFDT text-align--center__373c0__1l506">
                      <div class="lemon--div__373c0__1mboc display--inline-block__373c0__2de_K border-color--default__373c0__2oFDT">
                        <div
                          class="lemon--div__373c0__1mboc logo__373c0__oXueP border-color--default__373c0__2oFDT"
                          id="logo"
                          data-analytics-label="logo"
                        >
                          <Link
                            class="lemon--a__373c0__IEZFH link__373c0__29943 logo-link__373c0__16Y0F link-color--blue-dark__373c0__1mhJo link-size--default__373c0__1skgq"
                            to="/"
                          >
                            Yelp
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div>
            <div className="main-content-wrap main-content-wrap--full">
              <div id="super-container" className="content-container">
                <div id="alert-container">
                  <div class={errorClass}>
                    <a onClick={this.removeError} class="js-alert-dismiss dismiss-link" href="#">
                      ×
                    </a>
                    <p class="alert-message">
                      <ul>{errorBlock}</ul>
                    </p>
                  </div>
                  <div class={successClass}>
                    <a onClick={this.removeError} class="js-alert-dismiss dismiss-link" href="#">
                      ×
                    </a>
                    <p class="alert-message">
                      <ul>{successBlock}</ul>
                    </p>
                  </div>
                </div>

                <div className="clearfix layout-block layout-h row--responsive">
                  <div className="column column-alpha column--responsive">
                    <div className="signup-wrapper">
                      <div class="signup-flow on-flow-start">{signupOrLogin}</div>
                    </div>
                  </div>
                  <div class="column column-beta responsive-visible-large-block">
                    <div class="picture-container">
                      <img
                        alt="YELP"
                        src="https://s3-media0.fl.yelpcdn.com/assets/2/www/img/7922e77f338d/signup/signup_illustration.png"
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
//export Login Component

// export default RestaurantLogin;

const mapDispatchToProps = (dispatch) => {
  return {
    updateLoginSuccess: (payload) => {
      dispatch({
        type: updateLoginSuccess,
        payload,
      });
    },
    updateSignupStatus: (payload) => {
      dispatch({
        type: updateSignupStatus,
        payload,
      });
    },
  };
};

export default connect(null, mapDispatchToProps)(RestaurantLogin);
