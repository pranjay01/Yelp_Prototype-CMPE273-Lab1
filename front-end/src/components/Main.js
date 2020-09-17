import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Login from './Login/Login';

import Navbar from './LandingPage/Navbar';
import Home from './Home/Home';
// Create a Main Component
class Main extends Component {
  render() {
    return (
      <div>
        {/* Render Different Component based on Route */}
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/" component={Home} />
        </Switch>
      </div>
    );
  }
}
// Export The Main Component
export default Main;
