import React, { Component } from 'react';
import axios from 'axios';
import serverUrl from '../../../config';
import { updateLogoutSuccess, getCustomerBasicInfo } from '../../../constants/action-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = { logout: false };
  }

  componentDidMount() {}
  logout = (e) => {
    e.preventDefault();
    console.log('logouting customer');

    localStorage.clear();
    axios.post(serverUrl + 'customer/logout').then((response) => {
      if (response.status === 200) {
        let payload = {
          userEmail: '',
          role: '',
          loginStatus: false,
        };
        this.props.updateLogoutSuccess(payload);
        this.setState({
          logout: true,
        });
        window.location.reload(false);
      }
    });
  };
  render() {
    let redirectVar = null;
    if (this.state.logout) {
      redirectVar = <Redirect to="/customerLogin" />;
    }
    const defaultImage =
      'https://s3-media0.fl.yelpcdn.com/assets/public/user_60_square.yji-514f6997a3184af475d5adc800b6d0b1.png';
    return (
      <div
        id="topbar-account-wrap"
        className="drop-menu drop-menu-has-arrow"
        style={{ display: 'block' }}
      >
        {redirectVar}
        <div className="drop-menu-arrow responsive-hidden-small"></div>
        <div className="drop-menu-group responsive-visible-large-block">
          <div className="ypassport ypassport-notext media-block">
            <div
              className="media-avatar responsive-photo-box js-analytics-click"
              data-analytics-label="about_me"
            >
              <div className="photo-box pb-60s" data-hovercard-id="GkI5Ur8X1IZVOq75Iizx9Q">
                <a href="#" className="js-analytics-click" data-analytics-label="user-photo">
                  <img
                    alt="Pranjay S."
                    className="photo-box-img"
                    height="60"
                    loading="lazy"
                    src={
                      this.props.customerInfo.customerProfile.ImageURL !== null &&
                      this.props.customerInfo.customerProfile.ImageURL.length > 0
                        ? this.props.customerInfo.customerProfile.ImageURL
                        : defaultImage
                    }
                    width="60"
                  />
                </a>
              </div>
            </div>
            <div className="media-story">
              <ul className="user-passport-info">
                <li className="user-name">
                  <Link
                    to="/AboutMe"
                    className="user-display-name js-analytics-click"
                    href="/user_details?userid=Sbr_JFt86Dss0N-hb9StQg"
                    data-hovercard-id="GkI5Ur8X1IZVOq75Iizx9Q"
                    data-analytics-label="about_me"
                    id="dropdown_user-name"
                  >
                    {this.props.customerInfo.customerProfile.FirstName +
                      ' ' +
                      this.props.customerInfo.customerProfile.LastName.charAt(0)}
                  </Link>
                </li>
                <li className="user-location responsive-hidden-small">
                  {this.props.customerInfo.customerProfile.City !== undefined &&
                  this.props.customerInfo.customerProfile.City !== undefined ? (
                    <b>
                      {this.props.customerInfo.customerProfile.City +
                        ', ' +
                        this.props.customerInfo.customerProfile.StateName}
                    </b>
                  ) : (
                    ''
                  )}
                </li>
              </ul>

              <ul className="user-passport-stats">
                <li className="review-count">
                  <span
                    aria-hidden="true"
                    style={{ fill: '#f15c00', width: '18px', height: '18px' }}
                    className="icon icon--18-review icon--size-18"
                  >
                    <svg role="img" className="icon_svg">
                      <svg id="18x18_review" height="18" viewBox="0 0 18 18" width="18">
                        <path d="M13 3H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1.505 9.643l-2.526-1.55L6.526 12.7 7 9.934 5 7.977l2.766-.404L8.97 4.7l1.264 2.873L13 7.977l-2 1.957.495 2.71z"></path>
                      </svg>
                    </svg>
                  </span>
                  <b>{this.props.customerInfo.reviewCount}</b>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <ul className="drop-menu-group--nav drop-menu-group">
          <li className="drop-down-menu-link" role="none">
            <Link
              to="/AboutMe"
              className="js-analytics-click arrange arrange--middle arrange--6"
              href="#"
              data-analytics-label="dropdown_about-me"
              role="menuitem"
              tabIndex="0"
            >
              <strong className="arrange_unit">
                <span
                  aria-hidden="true"
                  style={{ width: '24px', height: '24px' }}
                  className="icon icon--24-profile icon--size-24 u-space-r1"
                >
                  <svg role="img" className="icon_svg">
                    <svg id="24x24_profile" height="24" viewBox="0 0 24 24" width="24">
                      <path d="M4.37 22c.278-4.762 3.587-8 7.63-8 4.043 0 7.352 3.238 7.63 8H4.37zM12 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"></path>
                    </svg>
                  </svg>
                </span>
                About Me
              </strong>
              <span className="arrange_unit arrange_unit--fill u-text-right">
                <span
                  aria-hidden="true"
                  style={{ width: '24px', height: '24px' }}
                  className="icon icon--24-chevron-right icon--size-24 hidden-non-responsive-inline-block responsive-visible-medium-inline-block"
                >
                  <svg role="img" className="icon_svg"></svg>
                </span>
              </span>
            </Link>
          </li>
        </ul>

        <ul className="drop-menu-group">
          <li className="drop-down-menu-link drop-down-menu-link--logout">
            <button
              type="submit"
              className="u-pseudo-link js-analytics-click"
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
