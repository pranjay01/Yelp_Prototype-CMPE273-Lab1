import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import axios from 'axios';
import serverUrl from '../../config';
import './RestaurantHome.css';
import { updateLogoutSuccess, updateHomeProfile } from '../../constants/action-types';
import { connect } from 'react-redux';
import LeftPannel from './LeftPannel/LeftPannel';
import DefaultHome from './DefaultHome';
import Profile from './Profile/Profile';
import FoodMenu from './Menu/FoodMenu';
import ReviewList from './Reviews/ReviewList';
import OrdersList from './Orders/OrdersList';
import EventList from './Events/EventsList';
// import '../Login/Login.css';

class RestaurantHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: true,
      menuDisable: true,
      restroName: '',
      address: '',
      reviewCOunt: '',
      tabName: localStorage.getItem('tabName'),
    };
  }
  onTabChangeHandler = (tabName) => {
    axios.get(serverUrl + 'biz/homeProfile', { withCredentials: true }).then(
      (response) => {
        if (response.status === 200) {
          this.setState({
            restroName: response.data[0][0].Name,
            address:
              response.data[0][0].Street +
              ' ' +
              response.data[0][0].City +
              ' ' +
              response.data[0][0].State +
              ' ' +
              response.data[0][0].Zip,
            reviewCOunt: response.data[1][0].ReviewCount,
          });
          let payload = {
            restaurantName: response.data[0][0].Name,
            ImageUrl: response.data[0][0].ImageURL,
            restaurantAddress:
              response.data[0][0].Street +
              ' ' +
              response.data[0][0].City +
              ' ' +
              response.data[0][0].State +
              ' ' +
              response.data[0][0].Zip,
          };
          this.props.updateHomeProfile(payload);
          console.log(this.state);
          console.log(response.data);
        }
      },
      (error) => {
        console.log(error.response.data);
      }
    );
    this.setState({
      tabName,
    });
    localStorage.setItem('tabName', tabName);
    localStorage.setItem('showFoodCategory', '');
  };
  componentDidMount() {
    axios.get(serverUrl + 'biz/homeProfile', { withCredentials: true }).then(
      (response) => {
        if (response.status === 200) {
          this.setState({
            restroName: response.data[0][0].Name,
            address:
              response.data[0][0].Street +
              ' ' +
              response.data[0][0].City +
              ' ' +
              response.data[0][0].State +
              ' ' +
              response.data[0][0].Zip,
            reviewCOunt: response.data[1][0].ReviewCount,
          });
          let payload = {
            restaurantName: response.data[0][0].Name,
            ImageUrl: response.data[0][0].ImageURL,
            restaurantAddress:
              response.data[0][0].Street +
              ' ' +
              response.data[0][0].City +
              ' ' +
              response.data[0][0].State +
              ' ' +
              response.data[0][0].Zip,
          };
          this.props.updateHomeProfile(payload);
          console.log(this.state);
          console.log(response.data);
        }
      },
      (error) => {
        console.log(error.response.data);
      }
    );
  }

  showMenu = () => {
    this.setState({
      menuDisable: !this.state.menuDisable,
    });
  };
  logout = (e) => {
    var data = {
      token: cookie.load('cookie'),
      role: cookie.load('userrole'),
    };
    e.preventDefault();
    axios.post(serverUrl + 'biz/logout', data).then(
      (response) => {
        if (response.status === 200) {
          localStorage.clear();
          let payload = {
            userEmail: '',
            role: '',
            loginStatus: false,
          };
          this.props.updateLogoutSuccess(payload);
          payload = {
            restaurantName: '',
            restaurantAddress: '',
          };
          this.props.updateHomeProfile(payload);
          this.setState({
            loggedIn: false,
          });
          // window.location.reload(false);
        }
      },
      (error) => {
        console.log(error.response.data);
        window.location.reload(false);
      }
    );
    cookie.remove('cookie', { path: '/' });
    cookie.remove('userrole', { path: '/' });
  };
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
        redirectVar = null;
      } else {
        redirectVar = <Redirect to="/restaurantLogin" />;
      }
    }
    let menu = null;
    if (!this.state.menuDisable) {
      menu = (
        <menu className="lemon--menu__06b83__3fJQ8 menu__06b83__35yNN menu__06b83__D_v-T padding-t2__06b83__11Iek padding-r2__06b83__28zpp padding-b2__06b83__34gV1 padding-l2__06b83__1Dr82 border-color--default__06b83__3-ifU">
          <div
            class="lemon--div__06b83__1mboc menu-section__06b83__11HSz border-color--default__06b83__3-ifU"
            role="presentation"
          >
            <a
              class="lemon--a__06b83__IEZFH menu-item__06b83__3Vezz menu-item--highlight-auto__06b83__2vEUJ"
              href="/settings"
              aria-disabled="false"
              tabindex="0"
            >
              <div class="lemon--div__06b83__1mboc padding-t1__06b83__2aTOb padding-r1__06b83__1xqrz padding-b1__06b83__3erWW padding-l1__06b83__1UBqt border-color--default__06b83__3-ifU">
                <div class="lemon--div__06b83__1mboc menu-item-inner__06b83__gv1Ar border-color--default__06b83__3-ifU">
                  <div class="lemon--div__06b83__1mboc menu-item-content-container__06b83__17dmW display--table-cell__06b83__3otg8 padding-r1-5__06b83__1s-Oo border-color--default__06b83__3-ifU">
                    <span
                      aria-hidden="true"
                      class="icon--24-settings-v2 menu-item-icon__06b83__FIApg css-12anxc3"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        class="icon_svg"
                      >
                        <path d="M12 16.5a4.5 4.5 0 114.5-4.5 4.51 4.51 0 01-4.5 4.5zm0-7a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM13.18 23h-2.36a2 2 0 01-2-1.61l-.1-.49a.49.49 0 00-.3-.36.49.49 0 00-.47.05l-.41.27a2 2 0 01-2.52-.25l-1.63-1.67a2 2 0 01-.25-2.52l.27-.42a.49.49 0 000-.47.49.49 0 00-.37-.3l-.48-.1a2 2 0 01-1.61-2v-2.31a2 2 0 011.61-2l.49-.1a.49.49 0 00.36-.3.49.49 0 000-.47l-.27-.41a2 2 0 01.25-2.52l1.67-1.63a2 2 0 012.52-.25l.42.27a.49.49 0 00.47 0 .49.49 0 00.3-.37l.1-.48a2 2 0 012-1.61h2.36a2 2 0 012 1.61l.1.49a.49.49 0 00.3.36.49.49 0 00.47 0l.41-.27a2 2 0 012.52.25l1.67 1.67a2 2 0 01.25 2.52l-.36.42a.49.49 0 00-.05.47.49.49 0 00.37.3l.48.1a2 2 0 011.61 2v2.36a2 2 0 01-1.61 2l-.49.1a.49.49 0 00-.36.3.49.49 0 00.05.47l.27.41a2 2 0 01-.25 2.52l-1.67 1.67a2 2 0 01-2.52.25l-.42-.36a.49.49 0 00-.47-.05.49.49 0 00-.3.37l-.1.48A2 2 0 0113.18 23zm-4.91-4.5c.342 0 .682.064 1 .19a2.49 2.49 0 011.49 1.82l.1.49h2.36l.1-.49c.16-.818.72-1.5 1.49-1.82a2.52 2.52 0 012.35.23l.41.28 1.67-1.67-.28-.41a2.52 2.52 0 01-.23-2.35 2.49 2.49 0 011.82-1.49l.49-.1v-2.36l-.49-.1a2.49 2.49 0 01-1.82-1.49 2.52 2.52 0 01.23-2.35l.28-.41-1.71-1.67-.41.28a2.52 2.52 0 01-2.35.23 2.49 2.49 0 01-1.49-1.82l-.1-.49h-2.36l-.1.49a2.49 2.49 0 01-1.49 1.82 2.52 2.52 0 01-2.35-.23l-.41-.28L4.8 6.47l.28.41a2.52 2.52 0 01.23 2.35 2.49 2.49 0 01-1.82 1.49l-.49.1v2.36l.49.1c.818.16 1.5.72 1.82 1.49a2.52 2.52 0 01-.23 2.35l-.28.41 1.67 1.67.41-.28a2.49 2.49 0 011.39-.42z"></path>
                      </svg>
                    </span>
                  </div>
                  <div class="lemon--div__06b83__1mboc menu-item-content-container__06b83__17dmW display--table-cell__06b83__3otg8 border-color--default__06b83__3-ifU">
                    <span class="lemon--span__06b83__3997G text__06b83__2Kxyz text__06b83__3UkLB text-color--inherit__06b83__1lczC text-align--left__06b83__2XGa-">
                      Account Settings
                    </span>
                  </div>
                </div>
              </div>
            </a>
          </div>
          <div
            class="lemon--div__06b83__1mboc menu-section__06b83__11HSz border-color--default__06b83__3-ifU"
            role="presentation"
          >
            <form
              class="lemon--form__06b83__2fChY"
              id="logout-form"
              name="logout-form"
              onSubmit={this.logout}
            >
              <button
                class="menu-item__06b83__3Vezz menu-item--highlight-auto__06b83__2vEUJ"
                type="submit"
              >
                <div class="lemon--div__06b83__1mboc padding-t1__06b83__2aTOb padding-r1__06b83__1xqrz padding-b1__06b83__3erWW padding-l1__06b83__1UBqt border-color--default__06b83__3-ifU">
                  <div class="lemon--div__06b83__1mboc menu-item-inner__06b83__gv1Ar border-color--default__06b83__3-ifU">
                    <div class="lemon--div__06b83__1mboc menu-item-content-container__06b83__17dmW display--table-cell__06b83__3otg8 padding-r1-5__06b83__1s-Oo border-color--default__06b83__3-ifU">
                      <span
                        aria-hidden="true"
                        class="icon--24-log-out-v2 menu-item-icon__06b83__FIApg css-12anxc3"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          class="icon_svg"
                        >
                          <path d="M15 2a1 1 0 110 2H4v16h11a1 1 0 110 2H3a1 1 0 01-1-1V3a1 1 0 011-1h12zm1.09 4.72a1 1 0 011.41 0L22 11.3a1 1 0 010 1.4l-4.59 4.58a1 1 0 01-1.41.02 1 1 0 010-1.42L18.87 13H7a1 1 0 110-2h11.87l-2.78-2.86a1 1 0 010-1.42z"></path>
                        </svg>
                      </span>
                    </div>
                    <div class="lemon--div__06b83__1mboc menu-item-content-container__06b83__17dmW display--table-cell__06b83__3otg8 border-color--default__06b83__3-ifU">
                      <span class="lemon--span__06b83__3997G text__06b83__2Kxyz text__06b83__3UkLB text-color--inherit__06b83__1lczC text-align--left__06b83__2XGa-">
                        Log Out
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            </form>
          </div>
        </menu>
      );
    }

    let tabName = this.state.tabName;
    let basicProfile = this.state;
    const defaultImage =
      'https://s3-media0.fl.yelpcdn.com/assets/public/default_user_avatar_40x40_v2.yji-925e5d7fcbd2b314d1a618150d57d7f6.png';
    const defaultImageSrcSet =
      'https://s3-media0.fl.yelpcdn.com/assets/public/default_user_avatar_40x40_v2@2x.yji-e91480537628f15542f0f07cc8d278c5.png';
    return (
      <div className="lemon--div__06b83__1mboc responsive responsive-biz border-color--default__06b83__3-ifU">
        {redirectVar}
        <div class="lemon--div__06b83__1mboc component__06b83__mFK-M border-color--default__06b83__3-ifU">
          <div class="lemon--div__06b83__1mboc header-container__06b83__bjkGB border-color--default__06b83__3-ifU">
            <div class="lemon--div__06b83__1mboc logo__06b83__2dyL8 border-color--default__06b83__3-ifU">
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
                </div>
                <div class="lemon--div__06b83__1mboc logo-title__06b83__V5ePy display--inline-block__06b83__1ZKqC margin-t0-5__06b83__1VMSL border-color--default__06b83__3-ifU nowrap__06b83__35McF">
                  <h4 class="lemon--h4__06b83__1yd__ heading--h4__06b83__27bDo alternate__06b83__2Mge5">
                    for business
                  </h4>
                </div>
              </div>
            </div>
            <div class="lemon--div__06b83__1mboc header-nav-container__06b83__euina border-color--default__06b83__3-ifU">
              <div class="lemon--div__06b83__1mboc fs-block border-color--default__06b83__3-ifU">
                <div class="lemon--div__06b83__1mboc border-color--default__06b83__3-ifU">
                  <div class="lemon--div__06b83__1mboc tooltipContainer__06b83__2PjJt auth-tooltip-container__06b83__e-34S display--inline-block__06b83__1ZKqC border-color--default__06b83__3-ifU">
                    <div class="lemon--div__06b83__1mboc notification-wrapper__06b83__RCXT7 display--inline-block__06b83__1ZKqC border-color--default__06b83__3-ifU">
                      <div class="lemon--div__06b83__1mboc inline__06b83__2fx1q">
                        <div
                          class="lemon--div__06b83__1mboc dropdown__06b83__2flBr"
                          role="presentation"
                        >
                          <button
                            class="link__06b83__343sR"
                            aria-label="Toggle Menu"
                            aria-haspopup="menu"
                            aria-controls="header-dropdown-menu"
                            aria-expanded="false"
                            type="submit"
                            onClick={this.showMenu}
                          >
                            <div class="lemon--div__06b83__1mboc button-content__06b83__1QNtB border-color--default__06b83mousedown-x__3-ifU">
                              <span class="lemon--span__06b83__3997G text__06b83__2Kxyz button-content-text__06b83__Z-7FO text-color--blue-dark__06b83__1jX7S text-align--center__06b83__3VrfZ text-size--large__06b83__3t60B text--truncated__06b83__3sLaf">
                                <span class="lemon--span__06b83__3997G display--inline__06b83__3JqBP border-color--default__06b83__3-ifU">
                                  <img
                                    class="lemon--img__06b83__3GQUb photo__06b83__3O0Op"
                                    src={
                                      this.props.restaurantProfile.ImageUrl !== null &&
                                      this.props.restaurantProfile.ImageUrl.length > 0
                                        ? this.props.restaurantProfile.ImageUrl
                                        : defaultImage
                                    }
                                    srcSet={
                                      this.props.restaurantProfile.ImageUrl !== null &&
                                      this.props.restaurantProfile.ImageUrl.length > 0
                                        ? this.props.restaurantProfile.ImageUrl
                                        : defaultImageSrcSet
                                    }
                                    // src="https://s3-media0.fl.yelpcdn.com/assets/public/default_user_avatar_40x40_v2.yji-925e5d7fcbd2b314d1a618150d57d7f6.png"
                                    //srcSet="https://s3-media0.fl.yelpcdn.com/assets/public/default_user_avatar_40x40_v2@2x.yji-e91480537628f15542f0f07cc8d278c5.png"
                                    alt="Pranjay S."
                                    height="36"
                                    width="36"
                                  />
                                </span>
                              </span>
                            </div>
                          </button>
                          {menu}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lemon--div__06b83__1mboc biz-container__06b83__3snKt border-color--default__06b83__3-ifU">
          {<LeftPannel profileInfo={this.state} onTabChangeHandler={this.onTabChangeHandler} />}
          <div className="lemon--div__06b83__1mboc container-default__06b83__1Sj3L content-container__06b83__2gSeg border-color--default__06b83__3-ifU">
            <div className="lemon--div__06b83__1mboc grid__06b83__15mIv border-color--default__06b83__3-ifU">
              <div
                className="lemon--div__06b83__1mboc grid-column__06b83__3ZRhU border-color--default__06b83__3-ifU"
                style={{ width: '66.66666666666666%' }}
              >
                {(function () {
                  //switch (tabName) {
                  switch (tabName) {
                    case 'Home':
                      return <DefaultHome profileInfo={basicProfile} />;
                    case 'Profile':
                      return <Profile />;
                    case 'FoodMenu':
                      return <FoodMenu />;
                    case 'Reviews':
                      return <ReviewList />;
                    case 'Orders':
                      return <OrdersList />;
                    case 'Events':
                      return <EventList />;
                    // default:
                    //   return <DefaultHome />;
                  }
                })()}
                {/*<DefaultHome profileInfo={this.state} />*/}
                {/*<Profile />*/}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// export default RestaurantHome;
// const mapStateToProps = (state) => {
//   const { restaurantHome } = state.restaurantHomePageReducer;
//   return {
//     tabOpened: restaurantHome.tabOpened,
//   };
// };

const mapStateToProps = (state) => {
  const { restaurantHome } = state.restaurantHomePageReducer;
  return {
    restaurantProfile: restaurantHome,
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
    updateHomeProfile: (payload) => {
      dispatch({
        type: updateHomeProfile,
        payload,
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RestaurantHome);
