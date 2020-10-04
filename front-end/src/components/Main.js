import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
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

// Create a Main Component
class Main extends Component {
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

export default connect(mapStateToProps, null)(Main);
