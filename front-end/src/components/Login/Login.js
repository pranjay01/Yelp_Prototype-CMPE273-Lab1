import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import axios from 'axios';
import serverUrl from '../../config';
import './Login.css';
import { history } from '../../App';

//Define a Login Component
class Login extends Component {
  //call the constructor method
  constructor(props) {
    //Call the constrictor of Super className i.e The Component
    super(props);
    //maintain the state required for this component
    this.state = {
      username: '',
      password: '',
      authFlag: false,
      errorFlag: 1,
      genders: [
        {
          key: '1',
          value: 'Female',
        },
        { key: '2', value: 'Male' },
        { key: '3', value: 'Others' },
      ],
      gender: null,
    };
    //Bind the handlers to this className
    this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
    this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
    this.submitLogin = this.submitLogin.bind(this);
  }
  //Call the Will Mount to set the auth Flag to false
  componentWillMount() {
    this.setState({
      authFlag: false,
    });
  }
  //username change handler to update state variable with the text entered by the user
  usernameChangeHandler = (e) => {
    this.setState({
      username: e.target.value,
      errorFlag: 1,
    });
  };
  //password change handler to update state variable with the text entered by the user
  passwordChangeHandler = (e) => {
    this.setState({
      password: e.target.value,
      errorFlag: 1,
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
          console.log('cookie: ', cookie.load('cookie'));
          console.log('role: ', cookie.load('userrole'));
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
        console.log('Status Code : ', error.status);
        this.setState({
          errorFlag: 2,
        });
      }
    );
  };

  render() {
    //redirect based on successful login
    console.log('Inside login render upupup in the air');
    let redirectVar = null;
    if (cookie.load('cookie')) {
      redirectVar = <Redirect to="/home" />;
    }
    let signupOrLogin = null;
    if (this.props.location.pathname === '/login') {
      signupOrLogin = (
        <div class="flow-start">
          <div class="signup-form-container">
            <div class="header">
              <h2>Sign Up for Yelp</h2>
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
              <p class="fb-start" data-component-bound="true">
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
              <p class="google-start" data-component-bound="true">
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
            <form onSubmit="" class="yform signup-form  city-hidden" id="signup-form">
              <div class="js-password-meter-container" data-component-bound="true">
                <ul class="inline-layout clearfix">
                  <li>
                    <label class="placeholder-sub">First Name</label>
                    <input
                      id="first_name"
                      name="first_name"
                      placeholder="First Name"
                      required="required"
                      type="text"
                      value=""
                    />
                  </li>

                  <li>
                    <label class="placeholder-sub">Last Name</label>
                    <input
                      id="last_name"
                      name="last_name"
                      placeholder="Last Name"
                      required="required"
                      type="text"
                      value=""
                    />
                  </li>
                </ul>

                <div>
                  <label class="placeholder-sub">Email</label>
                  <input
                    id="email"
                    name="email"
                    placeholder="Email"
                    required="required"
                    type="email"
                    value=""
                  />

                  <label class="placeholder-sub">Password</label>
                  <input
                    id="password"
                    name="password"
                    placeholder="Password"
                    required="required"
                    type="password"
                    value=""
                  />

                  <div class="js-password-meter-wrapper password-meter-wrapper u-hidden">
                    <div class="progress-bar-container--minimal">
                      <h4 class="progress-bar-text"></h4>
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
                <label class="placeholder-sub">Gender</label>
                <select className="form-control" value={this.state.gender}>
                  {this.state.genders.map((gender) => (
                    <option className="Dropdown-menu" key={gender.key} value={gender.key}>
                      {gender.value}
                    </option>
                  ))}
                </select>
              </div>
            </form>
          </div>
        </div>
      );
    } else if (this.props.location.pathname === '/signup') {
    } else {
    }

    return (
      <div className="main-content-wrap main-content-wrap--full">
        <div id="super-container" className="content-container">
          <div className="clearfix layout-block layout-h row--responsive">
            <div className="column column-alpha column--responsive">
              <div className="signup-wrapper">
                <div class="signup-flow on-flow-start">{signupOrLogin}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
//export Login Component

export default Login;
