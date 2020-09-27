import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import CustomerLogin from './Login/CustomerLogin';
import RestaurantLogin from './Login/RestaurantLogin';
import RestaurantHome from './Restaurant/RestaurantHome';
import Home from './Home/Home';
import CustomerNavBar from './Customer/CustomerNavBar';
import AboutMe from './Customer/AboutMe';
import UpdateProfile from './Customer/UpdateInformation/UpdateProfile';

// Create a Main Component
class Main extends Component {
  render() {
    return (
      <div>
        {/* Render Different Component based on Route */}
        {/*<Switch>*/}
        <Route path="/customerLogin" component={CustomerLogin} />
        <Route path="/customerSignup" component={CustomerLogin} />
        <Route path="/restaurantSignup" component={RestaurantLogin} />
        <Route path="/restaurantLogin" component={RestaurantLogin} />
        <Route path="/home" component={Home} />
        <Route path="/restaurantHome" component={RestaurantHome} />
        <Route path="/cus" component={CustomerNavBar} />
        <Route path="/AboutMe" component={AboutMe} />
        <Route path="/UpdateProfile" component={UpdateProfile} />

        <Route exact path="/" component={Home} />
        {/*</Switch>*/}
      </div>
    );
  }
}
// Export The Main Component
export default Main;
