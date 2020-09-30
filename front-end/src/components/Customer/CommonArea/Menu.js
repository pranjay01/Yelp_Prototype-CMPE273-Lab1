import React, { Component } from 'react';
import cookie from 'react-cookies';
import axios from 'axios';
import serverUrl from '../../../config';
import { updateLogoutSuccess, getCustomerBasicInfo } from '../../../constants/action-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = { Name: '', Address: '', ReviewCount: 0 };
  }

  componentDidMount() {}
  logout = (e) => {
    // e.preventDefault();
    console.log('logouting customer');
    var data = {
      token: cookie.load('cookie'),
      role: cookie.load('userrole'),
    };
    cookie.remove('cookie', { path: '/' });
    cookie.remove('userrole', { path: '/' });
    localStorage.clear();
    axios.post(serverUrl + 'customer/logout', data).then((response) => {
      if (response.status === 200) {
        let payload = {
          userEmail: '',
          role: '',
          loginStatus: false,
        };
        this.props.updateLogoutSuccess(payload);
        window.location.reload(false);
      }
    });
  };
  render() {
    const defaultImage =
      'https://s3-media0.fl.yelpcdn.com/assets/public/user_60_square.yji-514f6997a3184af475d5adc800b6d0b1.png';
    return (
      <div
        id="topbar-account-wrap"
        class="drop-menu drop-menu-has-arrow"
        style={{ display: 'block' }}
      >
        <div class="drop-menu-arrow responsive-hidden-small"></div>
        <div class="drop-menu-group responsive-visible-large-block">
          <div class="ypassport ypassport-notext media-block">
            <div
              class="media-avatar responsive-photo-box js-analytics-click"
              data-analytics-label="about_me"
            >
              <div class="photo-box pb-60s" data-hovercard-id="GkI5Ur8X1IZVOq75Iizx9Q">
                <a
                  href="/user_details?userid=Sbr_JFt86Dss0N-hb9StQg"
                  class="js-analytics-click"
                  data-analytics-label="user-photo"
                >
                  <img
                    alt="Pranjay S."
                    class="photo-box-img"
                    height="60"
                    loading="lazy"
                    src={
                      this.props.customerInfo.ImageUrl !== null &&
                      this.props.customerInfo.ImageUrl.length > 0
                        ? this.props.customerInfo.ImageUrl
                        : defaultImage
                    }
                    // src="https://s3-media0.fl.yelpcdn.com/assets/public/user_60_square.yji-514f6997a3184af475d5adc800b6d0b1.png"
                    width="60"
                  />
                </a>
              </div>
            </div>
            <div class="media-story">
              <ul class="user-passport-info">
                <li class="user-name">
                  <Link
                    to="/AboutMe"
                    class="user-display-name js-analytics-click"
                    href="/user_details?userid=Sbr_JFt86Dss0N-hb9StQg"
                    data-hovercard-id="GkI5Ur8X1IZVOq75Iizx9Q"
                    data-analytics-label="about_me"
                    id="dropdown_user-name"
                  >
                    {this.props.customerInfo.Name}
                  </Link>
                </li>
                <li class="user-location responsive-hidden-small">
                  <b>{this.props.customerInfo.Address}</b>
                </li>
              </ul>

              <ul class="user-passport-stats">
                <li class="review-count">
                  <span
                    aria-hidden="true"
                    style={{ fill: '#f15c00', width: '18px', height: '18px' }}
                    class="icon icon--18-review icon--size-18"
                  >
                    <svg role="img" class="icon_svg">
                      <svg id="18x18_review" height="18" viewBox="0 0 18 18" width="18">
                        <path d="M13 3H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1.505 9.643l-2.526-1.55L6.526 12.7 7 9.934 5 7.977l2.766-.404L8.97 4.7l1.264 2.873L13 7.977l-2 1.957.495 2.71z"></path>
                      </svg>
                    </svg>
                  </span>
                  <b>{this.props.customerInfo.ReviewCount}</b>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <ul class="drop-menu-group--nav drop-menu-group">
          <li class="drop-down-menu-link" role="none">
            <Link
              to="/AboutMe"
              class="js-analytics-click arrange arrange--middle arrange--6"
              href="#"
              data-analytics-label="dropdown_about-me"
              role="menuitem"
              tabindex="0"
            >
              <strong class="arrange_unit">
                <span
                  aria-hidden="true"
                  style={{ width: '24px', height: '24px' }}
                  class="icon icon--24-profile icon--size-24 u-space-r1"
                >
                  <svg role="img" class="icon_svg">
                    <svg id="24x24_profile" height="24" viewBox="0 0 24 24" width="24">
                      <path d="M4.37 22c.278-4.762 3.587-8 7.63-8 4.043 0 7.352 3.238 7.63 8H4.37zM12 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"></path>
                    </svg>
                  </svg>
                </span>
                About Me
              </strong>
              <span class="arrange_unit arrange_unit--fill u-text-right">
                <span
                  aria-hidden="true"
                  style={{ width: '24px', height: '24px' }}
                  class="icon icon--24-chevron-right icon--size-24 hidden-non-responsive-inline-block responsive-visible-medium-inline-block"
                >
                  <svg role="img" class="icon_svg"></svg>
                </span>
              </span>
            </Link>
          </li>
        </ul>

        <ul class="drop-menu-group">
          <li class="drop-down-menu-link drop-down-menu-link--logout">
            <button
              type="submit"
              class="u-pseudo-link js-analytics-click"
              id="header-log-out"
              data-analytics-label="logout"
              onClick={this.logout}
            >
              Log Out
            </button>
          </li>
        </ul>
      </div>
    );
  }
}

// export default Menu;
const mapStateToProps = (state) => {
  const { customerInfo } = state.customerBasicInfoReducer;
  return {
    customerInfo: customerInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateLogoutSuccess: (payload) => {
      dispatch({
        type: updateLogoutSuccess,
        payload,
      });
    },
    getCustomerBasicInfo: (payload) => {
      dispatch({
        type: getCustomerBasicInfo,
        payload,
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
