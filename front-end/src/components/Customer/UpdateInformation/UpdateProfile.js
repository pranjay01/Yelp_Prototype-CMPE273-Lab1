import React, { Component } from 'react';
import CustomerNavBar from '../CustomerNavBar';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import './UpdateProfile.css';
import axios from 'axios';
import serverUrl from '../../../config';
import { updateSnackbarData } from '../../../constants/action-types';
import { connect } from 'react-redux';
import SnackBar from '../../CommonComponents/SnackBar';

class UpdateProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      genders: [],
      Countries: [],
      States: [],
      Profile: {
        First_Name: '',
        Last_Name: '',
        Nick_Name: '',
        Gender: '',
        Date_Of_Birth: '',
        Country_ID: '',
        State_ID: '',
        City: '',
        Zip: '',
        Street: '',
        Headline: '',
        I_Love: '',
        Find_Me_In: '',
        Website: '',
      },
    };
  }
  componentWillMount() {
    console.log('inside Signup');
    axios
      .get(serverUrl + 'customer/getDataForCustomerUpdateProfile', {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
        const Profile = {
          First_Name: response.data[0][0].First_Name,
          Last_Name: response.data[0][0].Last_Name,
          Nick_Name: response.data[0][0].Nick_Name,
          Gender: response.data[0][0].Gender,
          Date_Of_Birth: response.data[0][0].Date_Of_Birth,
          Country_ID: response.data[0][0].Country_ID,
          State_ID: response.data[0][0].State_ID,
          City: response.data[0][0].City,
          Zip: response.data[0][0].Zip,
          Street: response.data[0][0].Street,
          Headline: response.data[0][0].Headline,
          I_Love: response.data[0][0].I_Love,
          Find_Me_In: response.data[0][0].Find_Me_In,
          Website: response.data[0][0].Website,
        };
        let allCountries = response.data[1].map((country) => {
          return { key: country.ID, value: country.Name };
        });
        let allStates = response.data[2].map((state) => {
          return { key: state.ID, value: state.Name };
        });
        let allGenders = response.data[3].map((gender) => {
          return { key: gender.ID, value: gender.Gender };
        });

        this.setState({
          genders: this.state.genders.concat(allGenders),
          Countries: this.state.Countries.concat(allCountries),
          States: this.state.States.concat(allStates),
          Profile,
        });
      });
  }

  onFNameChangeHandler = (e) => {
    this.setState({
      First_Name: this.state.Profile.First_Name,
    });
  };
  onLNameChangeHandler = (e) => {
    this.setState({
      Last_Name: this.state.Profile.Last_Name,
    });
  };
  onNickNameChangeHandler = (e) => {
    this.setState({
      Nick_Name: this.state.Profile.Nick_Name,
    });
  };
  onChangeHandlerGender = (e) => {
    this.setState({
      Gender: this.state.Profile.Gender,
    });
  };
  onHeadlineChangeHandler = (e) => {
    this.setState({
      Headline: this.state.Profile.Headline,
    });
  };
  onLoveChangeHandler = (e) => {
    this.setState({
      I_Love: this.state.Profile.I_Love,
    });
  };
  onFMIChangeHandler = (e) => {
    this.setState({
      Find_Me_In: this.state.Profile.Find_Me_In,
    });
  };
  onWebsiteChangeHandler = (e) => {
    this.setState({
      Website: this.state.Profile.Website,
    });
  };
  onChangeHandlerCountry = (e) => {
    this.setState({
      Country_ID: this.state.Profile.Country_ID,
    });
  };
  onChangeHandlerState = (e) => {
    this.setState({
      State_ID: this.state.Profile.State_ID,
    });
  };
  onChangeHandlerZipCode = (e) => {
    let errors = {};
    if (!/^\d+$/.test(e.target.value)) {
      errors['zipError'] = 'Invalid value!';
      this.setState({
        errors,
      });
      let payload = {
        success: false,
        message: 'Invalid Zip Value!',
      };
      this.props.updateSnackbarData(payload);
    } else {
      this.setState({
        Zip: this.state.Profile.Zip,
        errors,
      });
    }
  };
  onChangeHandlerCity = (e) => {
    this.setState({
      City: this.state.Profile.City,
    });
  };
  onChangeHandlerStreet = (e) => {
    this.setState({
      Street: this.state.Profile.Street,
    });
  };
  onChangeDate = (e) => {
    let errors = {};
    const today = new Date();
    const inputDate = new Date(e.target.value);
    if (today <= inputDate) {
      errors['dateError'] = 'Select future Date!';
      this.setState({
        errors,
      });
      let payload = {
        success: false,
        message: 'Date Of Birth Van not be of Future!',
      };
      this.props.updateSnackbarData(payload);
    } else {
      this.setState({
        Date_Of_Birth: this.state.Profile.Date_Of_Birth,
        errors,
      });
    }
  };

  render() {
    let redirectVar = null;
    if (!cookie.load('cookie')) {
      console.log('cookie not found');
      redirectVar = <Redirect to="/customerLogin" />;
    } else {
      if (cookie.load('userrole') === 'Customer') {
        redirectVar = null;
      } else if (cookie.load('userrole') === 'Restaurant') {
        redirectVar = <Redirect to="/restaurantHome" />;
      } else {
        redirectVar = <Redirect to="/customerLogin" />;
      }
    }
    return (
      <div>
        {redirectVar}
        {<CustomerNavBar />}
        {this.props.snackbarData != null && <SnackBar />}
        <span id="page-content" class="offscreen">
          &nbsp;
        </span>
        <div className="main-content-wrap main-content-wrap--full">
          <div className="content-container" id="super-container">
            <div className=" clearfix layout-block layout-n column--responsive account-settings_container">
              <div className="column column-beta column--responsive">
                <div className="account-settings_content">
                  <div class="section-header clearfix">
                    <h2>Profile</h2>
                  </div>
                  <form className="profile-bio yform yform-vertical-spacing">
                    <label for="first_name">First Name</label>
                    <span class="help-block">This field is required.</span>
                    <input
                      maxLength="50"
                      id="first_name"
                      name="first_name"
                      placeholder=""
                      size="30"
                      type="text"
                      value={this.state.Profile.First_Name}
                      onChange={this.onFNameChangeHandler}
                      required
                    ></input>
                    <label for="last_name">Last Name</label>
                    <span class="help-block">
                      This field is required. Only your last initial will show on your profile.
                    </span>
                    <input
                      id="last_name"
                      maxlength="32"
                      name="last_name"
                      placeholder=""
                      size="30"
                      type="text"
                      value={this.state.Profile.Last_Name}
                      onChange={this.onLNameChangeHandler}
                      required
                    />
                    <label for="nickname">Nickname</label>
                    <span class="help-block">The Boss, Calamity Jane, The Prolific Reviewer</span>
                    <input
                      id="nickname"
                      maxlength="50"
                      name="nickname"
                      placeholder=""
                      size="30"
                      type="text"
                      value={this.state.Profile.Nick_Name}
                      onChange={this.onNickNameChangeHandler}
                    />
                    <label for="gender">Gender</label>
                    <select
                      placeholder="Gender"
                      className="form-control"
                      onChange={this.onChangeHandlerGender}
                      value={this.state.Profile.Gender}
                    >
                      <option className="Dropdown-menu" key="" value="">
                        -Select-
                      </option>
                      {this.state.genders.map((gender) => (
                        <option className="Dropdown-menu" key={gender.key} value={gender.key}>
                          {gender.value}
                        </option>
                      ))}
                    </select>
                    <label for="tagline">Your Headline</label>
                    <span class="help-block">
                      Taco Tuesday Aficionado, The Globetrotting Reviewer
                    </span>
                    <input
                      id="tagline"
                      maxlength="100"
                      name="tagline"
                      placeholder=""
                      size="30"
                      type="text"
                      value={this.state.Profile.Headline}
                      onChange={this.onHeadlineChangeHandler}
                    />
                    <label for="love_name">I Love...</label>
                    <span class="help-block">
                      Comma separated phrases (e.g. sushi, Radiohead, puppies)
                    </span>
                    <textarea
                      id="love_name"
                      maxlength="1024"
                      name="love_name"
                      size="30"
                      type="text"
                      value={this.state.Profile.I_Love}
                      onChange={this.onLoveChangeHandler}
                    ></textarea>
                    <label for="find_me_in">Find Me In</label>
                    <span class="help-block">Nob Hill, the newest brunch spot, a turtleneck</span>
                    <input
                      id="find_me_in"
                      maxlength="80"
                      name="find_me_in"
                      placeholder=""
                      size="30"
                      type="text"
                      value={this.state.Profile.Find_Me_In}
                      onChange={this.onFMIChangeHandler}
                    />
                    <label for="blog">My Blog Or Website</label>
                    <span class="help-block">www.example.com/myawesomeblog</span>
                    <input
                      id="blog"
                      maxlength="80"
                      name="blog"
                      placeholder=""
                      size="30"
                      type="text"
                      value={this.state.Profile.Website}
                      onChange={this.onWebsiteChangeHandler}
                    />
                    <label for="Cpuntry">Country</label>
                    <select
                      placeholder="Country"
                      className="form-control"
                      onChange={this.onChangeHandlerCountry}
                      value={this.state.Profile.Country_ID}
                    >
                      <option className="Dropdown-menu" key="" value="">
                        -Select-
                      </option>
                      {this.state.Countries.map((country) => (
                        <option className="Dropdown-menu" key={country.key} value={country.key}>
                          {country.value}
                        </option>
                      ))}
                    </select>
                    <label for="State">State</label>
                    <select
                      placeholder="State"
                      className="form-control"
                      onChange={this.onChangeHandlerState}
                      value={this.state.Profile.State_ID}
                      required
                    >
                      <option className="Dropdown-menu" key="" value="">
                        -Select-
                      </option>
                      {this.state.States.map((state) => (
                        <option className="Dropdown-menu" key={state.key} value={state.key}>
                          {state.value}
                        </option>
                      ))}
                    </select>
                    <label for="Zip Code">Zip Code</label>
                    <input
                      minlength="5"
                      maxlength="5"
                      id="zipCode"
                      name="zipCode"
                      placeholder="zipCode"
                      required="required"
                      type="text"
                      onChange={this.onChangeHandlerZipCode}
                      value={this.state.Profile.Zip}
                    />
                    <label for="City">City</label>
                    <input
                      id="city"
                      name="city"
                      placeholder="City"
                      required="required"
                      type="text"
                      onChange={this.onChangeHandlerCity}
                      value={this.state.Profile.City}
                    />
                    <label for="Street">Street</label>
                    <input
                      id="street"
                      name="street"
                      placeholder="Street"
                      required="required"
                      type="text"
                      onChange={this.onChangeHandlerStreet}
                      value={this.state.Profile.Street}
                    />
                    <label for="DOB">Date Of Birth</label>
                    <input
                      id="DOB"
                      name="DOB"
                      type="date"
                      //step="1"
                      value={this.state.time}
                      placeholder="Date"
                      onChange={this.onChangeDate}
                      value={this.state.Profile.Date_Of_Birth}
                    />
                    <button
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
  const snackbarData = state.snackBarReducer;
  return {
    snackbarData: snackbarData,
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateProfile);
