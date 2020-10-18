import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import axios from 'axios';
import serverUrl from '../../config';
import './Login.css';
import { updateLoginSuccess } from '../../constants/action-types';
import { connect } from 'react-redux';
import { updateSnackbarData } from '..//../constants/action-types';
import jwt_decode from 'jwt-decode';

//Define a Login Component
class CustomerLogin extends Component {
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
      fName: '',
      lName: '',
      email: '',
      signupPassword: '',
      sigupSuccessful: false,
      genders: [],
      gender: null,
    };
  }

  /**Signup Block */
  onChangeHandlerFname = (e) => {
    this.setState({
      fName: e.target.value,
    });
  };
  onChangeHandlerLname = (e) => {
    this.setState({
      lName: e.target.value,
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

  onChangeHandlerGender = (e) => {
    this.setState({
      gender: e.target.value,
    });
  };

  onSubmitSignUp = (e) => {
    //prevent page from refresh
    e.preventDefault();
    const data = {
      Email: this.state.email,
      Password: this.state.signupPassword,
      FirstName: this.state.fName,
      LastName: this.state.lName,
      Gender: this.state.gender,
    };
    //set the with credentials to true
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    axios.post(serverUrl + 'customer/signup', data).then(
      (response) => {
        console.log('Status Code : ', response.status);
        if (response.status === 201) {
          console.log(response.data);
          let payload = {
            success: true,
            message: 'Account Created Successfully!',
          };
          this.props.updateSnackbarData(payload);
          this.setState({
            authFlag: true,
            //sigupSuccessful: true,
          });
        } else {
          this.setState({
            authFlag: false,
          });
        }
      },
      (error) => {
        // console.log('Status Code : ', error.status);
        // console.log('Status Code : ', error.response);
        console.log(error.response.data);
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
    axios.post(serverUrl + 'customer/login', data).then(
      (response) => {
        console.log('Status Code : ', response.status);
        if (response.status === 200) {
          const decoded = jwt_decode(response.data.split(' ')[1]);
          localStorage.setItem('token', response.data);
          localStorage.setItem('userId', decoded._id);
          localStorage.setItem('userrole', decoded.userrole);
          localStorage.setItem('useremail', decoded.email);

          let payload = {
            userEmail: decoded.email,
            role: decoded.Role,
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
    // console.log('token: ', localStorage.getItem('token'));
    if (localStorage.getItem('token')) {
      if (localStorage.getItem('userrole') === 'Restaurant') {
        console.log('redirect to restaurant home page');
        redirectVar = <Redirect to="/restaurantHome" />;
      } else if (localStorage.getItem('userrole') === 'Customer') {
        console.log('redirect to custome home page');
        redirectVar = <Redirect to="/home" />;
      }
    } else if (this.state.authFlag === true) {
      redirectVar = <Redirect to="/customerLogin" />;
    }

    let signupOrLogin = null;
    // console.log(history.location);
    if (this.props.location.pathname === '/customerSignup') {
      // if (history.location.pathname === '/customerSignup') {
      signupOrLogin = (
        <div className="flow-start">
          <div className="signup-form-container">
            <div className="header">
              <h2>Sign Up for Yelp</h2>
              <p className="subheading">Connect with great local businesses</p>
              <p className="legal-copy">
                By continuing, you agree to Yelp’s{' '}
                <Link className="legal-link" href="#">
                  Terms of Service
                </Link>{' '}
                and acknowledge Yelp’s{' '}
                <Link className="legal-link" href="#">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
            <div>
              <p className="fb-start">
                <button
                  type="submit"
                  value="submit"
                  className="ybtn ybtn--social ybtn--facebook ybtn-full"
                >
                  <span>
                    <div className="u-text-centered">
                      <span
                        aria-hidden="true"
                        style={{ width: '24px', height: '24px' }}
                        className="icon icon--24-facebook icon--size-24 icon--currentColor"
                      >
                        <svg role="img" className="icon_svg"></svg>
                      </span>{' '}
                      Continue with Facebook
                    </div>
                  </span>
                </button>
              </p>
              <p className="google-start">
                <button
                  type="submit"
                  value="submit"
                  className="ybtn ybtn--social ybtn--google ybtn-full"
                >
                  <span>
                    <div className="u-text-centered">
                      <span className="icon--png">
                        <img
                          alt="Yelp"
                          height="24"
                          width="24"
                          src="https://s3-media0.fl.yelpcdn.com/assets/srv0/yelp_styleguide/cae242fd3929/assets/img/structural/24x24_google_rainbow.png"
                          srcset="https://s3-media0.fl.yelpcdn.com/assets/srv0/yelp_styleguide/c193df424e16/assets/img/structural/24x24_google_rainbow@2x.png 2x"
                        />
                      </span>{' '}
                      Continue with Google
                    </div>
                  </span>
                </button>
              </p>
              <p className="legal-copy">Don't worry, we never post without your permission.</p>
              <fieldset className="hr-line">
                <legend align="center">OR</legend>
              </fieldset>
            </div>
            <form
              onSubmit={this.onSubmitSignUp}
              className="yform signup-form  city-hidden"
              id="signup-form"
            >
              <div className="js-password-meter-container">
                <ul className="inline-layout clearfix">
                  <li>
                    <label className="placeholder-sub">First Name</label>
                    <input
                      id="first_name"
                      name="first_name"
                      placeholder="First Name"
                      required="required"
                      type="text"
                      onChange={this.onChangeHandlerFname}
                    />
                  </li>

                  <li>
                    <label className="placeholder-sub">Last Name</label>
                    <input
                      id="last_name"
                      name="last_name"
                      placeholder="Last Name"
                      required="required"
                      type="text"
                      onChange={this.onChangeHandlerLname}
                    />
                  </li>
                </ul>

                <div>
                  <label className="placeholder-sub">Email</label>
                  <input
                    id="email"
                    name="email"
                    placeholder="Email"
                    required="required"
                    type="email"
                    onChange={this.onChangeHandlerEmail}
                  />

                  <label className="placeholder-sub">Password</label>
                  <input
                    id="password"
                    name="password"
                    placeholder="Password"
                    required="required"
                    type="password"
                    onChange={this.onChangeHandlerPasswordSignup}
                  />

                  <div className="js-password-meter-wrapper password-meter-wrapper u-hidden">
                    <div className="progress-bar-container--minimal">
                      <h4 className="progress-bar-text"></h4>
                      <div className="progress-bar new js-progress-bar">
                        <div
                          className="progress-bar_fill js-progress-bar_fill new"
                          role="presentation"
                          style={{ width: '0%' }}
                        ></div>
                      </div>
                    </div>

                    <div className="js-password-meter-help-block help-block u-space-b2">
                      Password must be at least 6 characters in length
                    </div>
                    <input
                      type="hidden"
                      className="js-password-meter-strength-result"
                      name="result_password_strength_meter"
                    />
                  </div>

                  <input id="signup_source" name="signup_source" type="hidden" value="default" />
                </div>
              </div>
              <div className="js-more-fields more-fields">
                <label className="placeholder-sub">Gender</label>
                <select
                  placeholder="Gender"
                  className="form-control"
                  onChange={this.onChangeHandlerGender}
                >
                  <option className="Dropdown-menu" key="" value="">
                    Gender
                  </option>
                  {this.props.masterData.Genders.map((gender) => (
                    <option className="Dropdown-menu" key={gender.key} value={gender.value}>
                      {gender.value}
                    </option>
                  ))}
                </select>
              </div>

              <button
                id="signup-button"
                type="submit"
                className="ybtn ybtn--primary ybtn--big disable-on-submit submit signup-button"
              >
                <span>Sign Up</span>
              </button>
            </form>
          </div>
          <div className="sub-text-box">
            <small className="subtle-text" style={{ textAlign: 'left', paddingRight: '21px' }}>
              Restaurant Signup{' '}
              <Link className="login-link" to="/restaurantSignup">
                Sign Up
              </Link>
            </small>
            <small className="subtle-text">
              Already on Yelp?{' '}
              <Link className="login-link" to="/customerLogin">
                Log in
              </Link>
            </small>
          </div>
        </div>
      );
    } else if (this.props.location.pathname === '/customerLogin') {
      // } else if (history.location.pathname === '/customerLogin') {
      signupOrLogin = (
        <div className="login">
          <div className="signup-form-container">
            <div className="header">
              <h2>Sign in to Yelp</h2>
              <p className="subheading">
                New to Yelp?{' '}
                <Link className="signup-link " to="/customerSignup">
                  Sign up
                </Link>
              </p>
              <p className="legal-copy">
                By logging in, you agree to Yelp’s{' '}
                <Link className="legal-link" to="#">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link className="legal-link" to="#">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
            <ul className="ylist">
              <li className="js-apple-login">
                <div
                  id="appleid-signin"
                  role="button"
                  className="apple-login-button u-cursor-pointer"
                  data-color="black"
                  data-type="sign in"
                  data-border-radius="8%"
                ></div>
              </li>

              <li className="js-fb-login">
                <button
                  type="submit"
                  value="submit"
                  className="ybtn ybtn--social ybtn--facebook ybtn-full"
                >
                  <span>
                    <div className="u-text-centered">
                      <span
                        aria-hidden="true"
                        style={{ width: '24px', height: '24px' }}
                        className="icon icon--24-facebook icon--size-24 icon--currentColor"
                      >
                        <svg role="img" className="icon_svg"></svg>
                      </span>{' '}
                      Sign in with Facebook
                    </div>
                  </span>
                </button>
              </li>

              <li className="js-google-login" data-component-bound="true">
                <button
                  type="submit"
                  value="submit"
                  className="ybtn ybtn--social ybtn--google ybtn-full"
                >
                  <span>
                    <div className="u-text-centered">
                      <span className="icon--png">
                        <img
                          alt="Yelp"
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
            <fieldset className="login-separator hr-line">
              <legend align="center">OR</legend>
            </fieldset>
            <form className="yform" onSubmit={this.submitLogin}>
              <label className="placeholder-sub">Email</label>
              <input
                id="email"
                name="email"
                placeholder="Email"
                required="required"
                type="email"
                onChange={this.onChangeHandlerUsername}
                className={this.state.inputBlockHighlight}
              />
              <label className="placeholder-sub">Password</label>
              <input
                onChange={this.onChangeHandlerPassword}
                id="password"
                name="password"
                placeholder="Password"
                required="required"
                type="password"
                className={this.state.inputBlockHighlight}
              />
              <button type="submit" className="ybtn ybtn--primary ybtn--big submit ybtn-full">
                <span>Sign in</span>
              </button>
            </form>
          </div>
          <div className="sub-text-box">
            <small className="subtle-text">
              Restaurant Login{' '}
              <Link
                className="signup-link"
                to="/restaurantLogin"
                style={{ textAlign: 'left', paddingRight: '55px' }}
              >
                Log In
              </Link>
            </small>
            <small className="subtle-text">
              New to Yelp?{' '}
              <Link className="signup-link" to="/customerSignup">
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
        {/*this.props.snackbarData != null && <SnackBar />*/}

        <div>
          <div className="lemon--div__373c0__1mboc header__373c0__AlFmH border-color--default__373c0__2oFDT">
            <div className="lemon--div__373c0__1mboc container__373c0__13FCe transparent__373c0__3oxYH">
              <div className="lemon--div__373c0__1mboc content__373c0__Zrlv5">
                <div className="lemon--div__373c0__1mboc header-arrange__373c0__zC1DR arrange__373c0__UHqhV gutter-18__373c0__31Z0U vertical-align-middle__373c0__2TQsQ border-color--default__373c0__2oFDT">
                  <div className="lemon--div__373c0__1mboc arrange-unit__373c0__1piwO arrange-unit-fill__373c0__17z0h border-color--default__373c0__2oFDT">
                    <div className="lemon--div__373c0__1mboc border-color--default__373c0__2oFDT text-align--center__373c0__1l506">
                      <div className="lemon--div__373c0__1mboc display--inline-block__373c0__2de_K border-color--default__373c0__2oFDT">
                        <div
                          className="lemon--div__373c0__1mboc logo__373c0__oXueP border-color--default__373c0__2oFDT"
                          id="logo"
                          data-analytics-label="logo"
                        >
                          <Link
                            className="lemon--a__373c0__IEZFH link__373c0__29943 logo-link__373c0__16Y0F link-color--blue-dark__373c0__1mhJo link-size--default__373c0__1skgq"
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
                  <div className={errorClass}>
                    <a
                      onClick={this.removeError}
                      className="js-alert-dismiss dismiss-link"
                      href="#"
                    >
                      ×
                    </a>
                    <p className="alert-message">
                      <ul>{errorBlock}</ul>
                    </p>
                  </div>
                  <div className={successClass}>
                    <a
                      onClick={this.removeError}
                      className="js-alert-dismiss dismiss-link"
                      href="#"
                    >
                      ×
                    </a>
                    <p className="alert-message">
                      <ul>{successBlock}</ul>
                    </p>
                  </div>
                </div>

                <div className="clearfix layout-block layout-h row--responsive">
                  <div className="column column-alpha column--responsive">
                    <div className="signup-wrapper">
                      <div className="signup-flow on-flow-start">{signupOrLogin}</div>
                    </div>
                  </div>
                  <div className="column column-beta responsive-visible-large-block">
                    <div className="picture-container">
                      <img
                        alt="Yelp"
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

// export default CustomerLogin;
// const mapStateToProps = (state) => {
//   const snackbarData = state.snackBarReducer;
//   return {
//     snackbarData: snackbarData,
//   };
// };

const mapStateToProps = (state) => {
  const { masterData } = state.masterDataReducer;
  const snackbarData = state.snackBarReducer;
  return {
    masterData: masterData,
    snackbarData: snackbarData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateLoginSuccess: (payload) => {
      dispatch({
        type: updateLoginSuccess,
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

export default connect(mapStateToProps, mapDispatchToProps)(CustomerLogin);
