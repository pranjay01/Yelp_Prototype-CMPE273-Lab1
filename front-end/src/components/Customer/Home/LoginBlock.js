import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class loginBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="arrange_unit nowrap">
        <ul className="header-nav hero-header_nav main-header_account">
          <li className="header-nav_item u-space-r2 ">
            <Link
              className="header-nav_link header-nav_link--log-in js-analytics-click restaurant-search-result-page"
              to="/customerLogin"
            >
              Login
            </Link>
          </li>
          <li className="header-nav_item u-space-r0 js-analytics-click restaurant-search-result-page">
            <Link
              className="ybtn ybtn--primary header-nav_button nowrap restaurant-search-result-page"
              to="/customerSignup"
            >
              Signup
            </Link>
          </li>
        </ul>
      </div>
    );
  }
}

export default loginBlock;
