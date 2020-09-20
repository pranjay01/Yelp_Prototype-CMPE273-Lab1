import React, { Component } from 'react';
import cookie from 'react-cookies';
import axios from 'axios';
import serverUrl from '../../config';
class menu extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  logout = (e) => {
    e.preventDefault();
    console.log('logouting customer');
    var data = {
      token: cookie.load('cookie'),
      role: cookie.load('userrole'),
    };
    axios.post(serverUrl + 'customer/logout', data).then((response) => {
      if (response.status === 200) {
        window.location.reload(false);
      }
    });
    cookie.remove('cookie', { path: '/' });
    cookie.remove('userrole', { path: '/' });
  };
  render() {
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
                    src="https://s3-media0.fl.yelpcdn.com/assets/public/user_60_square.yji-514f6997a3184af475d5adc800b6d0b1.png"
                    width="60"
                  />
                </a>
              </div>
            </div>
            <div class="media-story">
              <ul class="user-passport-info">
                <li class="user-name">
                  <a
                    class="user-display-name js-analytics-click"
                    href="/user_details?userid=Sbr_JFt86Dss0N-hb9StQg"
                    data-hovercard-id="GkI5Ur8X1IZVOq75Iizx9Q"
                    data-analytics-label="about_me"
                    id="dropdown_user-name"
                  >
                    Pranjay S.
                  </a>
                </li>
                <li class="user-location responsive-hidden-small">
                  <b>San Francisco, CA</b>
                </li>
              </ul>

              <ul class="user-passport-stats">
                <li class="friend-count">
                  <span
                    aria-hidden="true"
                    style={{ fill: '#f15c00', width: '18px', height: '18px' }}
                    class="icon icon--18-friends icon--size-18"
                  >
                    <svg role="img" class="icon_svg"></svg>
                  </span>
                  <b>0</b>
                </li>
                <li class="review-count">
                  <span
                    aria-hidden="true"
                    style={{ fill: '#f15c00', width: '18px', height: '18px' }}
                    class="icon icon--18-review icon--size-18"
                  >
                    <svg role="img" class="icon_svg"></svg>
                  </span>
                  <b>0</b>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <ul class="drop-menu-group--nav drop-menu-group">
          <li class="drop-down-menu-link" role="none">
            <a
              class="js-analytics-click arrange arrange--middle arrange--6"
              href="/user_details?userid=Sbr_JFt86Dss0N-hb9StQg"
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
                  <svg role="img" class="icon_svg"></svg>
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
            </a>
          </li>

          <li class="drop-down-menu-link" role="none">
            <a
              class="js-analytics-click arrange arrange--middle arrange--6"
              href="/profile"
              data-analytics-label="Zprofile"
              role="menuitem"
              tabindex="0"
            >
              <strong class="arrange_unit">
                <span
                  aria-hidden="true"
                  style={{ width: '24px', height: '24px' }}
                  class="icon icon--24-settings icon--size-24 u-space-r1"
                >
                  <svg role="img" class="icon_svg"></svg>
                </span>
                Account Settings
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
            </a>
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

export default menu;
