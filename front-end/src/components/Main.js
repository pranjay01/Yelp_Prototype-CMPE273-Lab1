import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import axios from 'axios';
import serverUrl from '../config';
import CustomerLogin from './Login/CustomerLogin';
import RestaurantLogin from './Login/RestaurantLogin';
import RestaurantHome from './Restaurant/RestaurantHome';
import Home from './Customer/Home/Home';
import CustomerNavBar from './Customer/CommonArea/CustomerNavBar';
import AboutMe from './Customer/AboutMe/AboutMe';
import UpdateProfile from './Customer/UpdateInformation/UpdateProfile';
import UpdateContactInformation from './Customer/UpdateInformation/UpdateContactInformation';
import RestaurantList from './Customer/RestaurantResults/RestaurantList';
import RestaurantPage from './Customer/RestaurantResults/RestaurantPage/RestaurantPage';
import FoodOrderCart from './Customer/RestaurantResults/RestaurantPage/FoodOrderCart';
import Events from './Customer/Events/Events';
import OrdersList from './Customer/OrdersTab/OrdersList';
import CustomerStaticProfile from './Restaurant/CommonComponent/CustomerStaticProfile';
import SnackBar from './CommonComponents/SnackBar';
import { connect } from 'react-redux';
import { updateMasterData } from '../constants/action-types';

// Create a Main Component
class Main extends Component {
  componentDidMount() {
    axios.get(serverUrl + 'static/signupMasterData').then((response) => {
      console.log('data:', response.data);
      let Countries = response.data[0].map((country) => {
        return { key: country._id, value: country.Name };
      });
      let States = response.data[1].map((state) => {
        return { key: state._id, value: state.Name };
      });
      let CountryCodes = response.data[0].map((countryCode) => {
        return { key: countryCode._id, value: countryCode.CountryCode };
      });
      let Genders = response.data[2].map((gender) => {
        return { key: gender._id, value: gender.GenderType };
      });

      let payload = {
        Countries,
        States,
        CountryCodes,
        Genders,
      };
      this.props.updateMasterData(payload);
      // this.setState({
      //   countries: this.state.countries.concat(allCountries),
      //   states: this.state.states.concat(allStates),
      //   countryCodes: this.state.countryCodes.concat(allCountrieCodes),
      // });
    });

    this.setState({
      authFlag: false,
    });
  }
  render() {
    return (
      <div>
        {this.props.snackbarData != null && <SnackBar />}
        {/* Render Different Component based on Route */}
        <Switch>
          <Route path="/customerLogin" component={CustomerLogin} />
          <Route path="/customerSignup" component={CustomerLogin} />
          <Route path="/restaurantSignup" component={RestaurantLogin} />
          <Route path="/restaurantLogin" component={RestaurantLogin} />
          <Route path="/home" component={Home} />
          <Route path="/restaurantHome" component={RestaurantHome} />
          <Route path="/cus" component={CustomerNavBar} />
          <Route path="/AboutMe" component={AboutMe} />
          <Route path="/UpdateProfile" component={UpdateProfile} />
          <Route path="/UpdateContactInformation" component={UpdateContactInformation} />
          <Route path="/RestaurantList" component={RestaurantList} />
          <Route path="/RestaurantPage" component={RestaurantPage} />
          <Route path="/FoodOrderCart" component={FoodOrderCart} />
          <Route path="/Events" component={Events} />
          <Route path="/OrdersList" component={OrdersList} />
          <Route path="/CustomerStaticProfile" component={CustomerStaticProfile} />
          <Route exact path="/" component={Home} />
        </Switch>
      </div>
    );
  }
}
// Export The Main Component
// export default Main;
// export default EventList;

const mapStateToProps = (state) => {
  const snackbarData = state.snackBarReducer.snackbarData;
  return {
    snackbarData: snackbarData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateMasterData: (payload) => {
      dispatch({
        type: updateMasterData,
        payload,
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
