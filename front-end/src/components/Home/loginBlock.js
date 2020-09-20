import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class loginBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    console.log('inside login block');
    return (
      <div className="arrange_unit nowrap">
        <ul className="header-nav hero-header_nav main-header_account">
          <li
            // onClick={() => {
            //   history.push('/login');
            // }}
            className="header-nav_item u-space-r2"
          >
            <Link
              className="header-nav_link header-nav_link--log-in js-analytics-click"
              to="/customerLogin"
            >
              Login
            </Link>
          </li>
          <li className="header-nav_item u-space-r0 js-analytics-click">
            <Link className="ybtn ybtn--primary header-nav_button nowrap" to="/customerSignup">
              Signup
            </Link>
          </li>
        </ul>
      </div>
    );
  }
}

export default loginBlock;
