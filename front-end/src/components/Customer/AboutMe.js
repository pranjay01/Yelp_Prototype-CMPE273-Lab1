import React, { Component } from 'react';
import CustomerNavBar from './CustomerNavBar';
import GreyArea from './GreyArea';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';

class AboutMe extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
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
        <span id="page-content" class="offscreen">
          &nbsp;
        </span>
        <div className="main-content-wrap main-content-wrap--full">{<GreyArea />}</div>
      </div>
    );
  }
}

export default AboutMe;
