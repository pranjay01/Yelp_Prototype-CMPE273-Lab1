import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import axios from 'axios';
import serverUrl from '../../config';

class RestaurantHome extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    console.log('inside restaurant home');
    let redirectVar = null;
    if (!cookie.load('cookie')) {
      redirectVar = <Redirect to="/restaurantLogin" />;
    } else {
      console.log('cookie found');
      console.log('inside RestaurantHome', cookie.load('userrole'));
      if (cookie.load('userrole') === 'Customer') {
        console.log('inside if block');
        redirectVar = <Redirect to="/home" />;
      } else if (cookie.load('userrole') === 'Restaurant') {
        console.log('redirect to restaurant home page');
        redirectVar = <Redirect to="/restaurantHome" />;
      } else {
        redirectVar = <Redirect to="/restaurantLogin" />;
      }
    }
    return (
      <div>
        {redirectVar}
        <div class="lemon--div__06b83__1mboc component__06b83__mFK-M border-color--default__06b83__3-ifU">
          <div class="lemon--div__06b83__1mboc header-container__06b83__bjkGB border-color--default__06b83__3-ifU">
            <div class="lemon--div__06b83__1mboc logo-container__06b83__2cPop border-color--default__06b83__3-ifU">
              <div class="lemon--div__06b83__1mboc display--inline-block__06b83__1ZKqC margin-b1__06b83__1khoT border-color--default__06b83__3-ifU">
                <div
                  class="lemon--div__06b83__1mboc logo__06b83__1Q_kj border-color--default__06b83__3-ifU"
                  id="logo"
                  data-analytics-label="logo"
                >
                  <a
                    class="lemon--a__06b83__IEZFH link__06b83__1G70M logo-link__06b83__gXkkh link-color--blue-dark__06b83__85-Nu link-size--default__06b83__7tls6"
                    href="/"
                    target=""
                    name=""
                    rel=""
                    role="link"
                  >
                    Yelp
                  </a>
                </div>
                <div class="lemon--div__06b83__1mboc logo-title__06b83__V5ePy display--inline-block__06b83__1ZKqC margin-t0-5__06b83__1VMSL border-color--default__06b83__3-ifU nowrap__06b83__35McF">
                  <h4 class="lemon--h4__06b83__1yd__ heading--h4__06b83__27bDo alternate__06b83__2Mge5">
                    for business
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RestaurantHome;
