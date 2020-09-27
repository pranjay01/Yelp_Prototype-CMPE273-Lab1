import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import axios from 'axios';
import serverUrl from '../../../config';
import '../RestaurantHome.css';
import { connect } from 'react-redux';

class LeftPannel extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  // const changePageViewTo = (viewComponent) => {

  // }
  // changePageViewTo(tabOpened) {
  //   let payload = {
  //     tabOpened,
  //   };
  //   this.props.updateLeftPannelTab(payload);
  // }
  // componentDidMount() {}
  render() {
    return (
      <div className="lemon--div__06b83__1mboc biz-site-left-nav__06b83__3BebN responsive-ui-enabled__06b83__1t7ON border-color--default__06b83__3-ifU">
        <div className="lemon--div__06b83__1mboc left-nav__06b83__3Ullg responsive-ui-enabled__06b83__1t7ON border-color--default__06b83__3-ifU">
          <div className="lemon--div__06b83__1mboc left-nav-container__06b83__-stDd responsive-ui-enabled__06b83__1t7ON border-color--default__06b83__3-ifU">
            <div style={{ display: 'block' }}>
              <div class="lemon--div__06b83__1mboc information-container__06b83__27xlJ responsive-ui-enabled__06b83__4OFWm border--bottom__06b83__3qNtD border-color--default__06b83__3-ifU">
                <div class="lemon--div__06b83__1mboc info__06b83__38cdn responsive-ui-enabled__06b83__4OFWm border-color--default__06b83__3-ifU">
                  <div class="lemon--div__06b83__1mboc arrange__06b83__2C9bH gutter-1__06b83__2l5bx border-color--default__06b83__3-ifU">
                    <div class="lemon--div__06b83__1mboc arrange-unit__06b83__o3tjT arrange-unit-fill__06b83__3Sfw1 border-color--default__06b83__3-ifU">
                      <div class="lemon--div__06b83__1mboc fs-block border-color--default__06b83__3-ifU">
                        <h4 class="lemon--h4__06b83__1yd__ heading--h4__06b83__27bDo">
                          {this.props.restaurantProfile.restaurantName}
                        </h4>
                        <div class="lemon--div__06b83__1mboc padding-t1__06b83__2aTOb border-color--default__06b83__3-ifU">
                          <p class="lemon--p__06b83__3Qnnj text__06b83__2Kxyz text-color--subtle__06b83__3DZpi text-align--left__06b83__2XGa- text-size--small__06b83__3NVWO">
                            {this.props.restaurantProfile.restaurantAddress}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/**<div class="lemon--div__06b83__1mboc padding-t1__06b83__2aTOb border-color--default__06b83__3-ifU">
                    <p class="lemon--p__06b83__3Qnnj text__06b83__2Kxyz text-color--blue-dark__06b83__1jX7S text-align--left__06b83__2XGa- text-weight--bold__06b83__1elNz">
                      <a
                        class="lemon--a__06b83__IEZFH link__06b83__1G70M link-color--blue-dark__06b83__85-Nu link-size--default__06b83__7tls6"
                        href="/?claim=True&amp;utm_campaign=claim_business&amp;utm_content=claim_another_business&amp;utm_medium=biz_yelp&amp;utm_source=nav_recent_businesses"
                        target=""
                        name=""
                        rel=""
                        role="link"
                      >
                        <span aria-hidden="true" class="icon--16-add-v2 css-ovx9y9">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ width: '16', height: '16' }}
                            class="icon_svg"
                          >
                            <path d="M12.5 7H9V3.5a1 1 0 10-2 0V7H3.5a1 1 0 000 2H7v3.5a1 1 0 102 0V9h3.5a1 1 0 100-2z"></path>
                          </svg>
                        </span>
                        Add a Location
                      </a>
                    </p>
    </div>*/}
                </div>
              </div>
            </div>
            {/**Home */}
            <a
              class="lemon--a__06b83__IEZFH link__06b83__1G70M nav-link__06b83__2noz4 responsive-ui-enabled__06b83__2kOzB link-color--blue-dark__06b83__85-Nu link-size--default__06b83__7tls6"
              href="#"
              target=""
              name=""
              rel=""
              role="link"
              onClick={() => {
                this.props.onTabChangeHandler('Home');
              }}
              // onClick={() => this.changePageViewTo('Home')}
            >
              <div
                class={`lemon--div__06b83__1mboc nav-item-v2__06b83__vmJJv inactive__06b83__2ZtYV responsive-ui-enabled__06b83__2kOzB padding-t1__06b83__2aTOb padding-r1__06b83__1xqrz padding-b1__06b83__3erWW padding-l1__06b83__1UBqt border-color--default__06b83__3-ifU ${
                  this.props.profileInfo.tabName === 'Home' ? 'active__06b83__cBu5j' : ''
                }`}
              >
                <div class="lemon--div__06b83__1mboc icon--active__06b83__lWtOD icon-v2__06b83__2Y6sR border-color--default__06b83__3-ifU text-align--center__06b83__2n2yQ">
                  <span aria-hidden="true" class="icon--24-home-v2 css-1mpk29p">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="icon_svg">
                      <path d="M22.65 10L22 9.47V3a1 1 0 00-1-1h-4a1 1 0 00-1 1v1.33l-3.35-2.87a1 1 0 00-1.3 0L1.35 10A1 1 0 002 11.78V22a1 1 0 001 1h18a1 1 0 001-1V11.79a1 1 0 00.65-1.79zM18 6V4h2v3.76L18 6zm-4 15h-4v-6h4v6zm2 0v-7a1 1 0 00-1-1H9a1 1 0 00-1 1v7H4V10.39l8-6.86 8 6.86V21h-4z"></path>
                    </svg>
                  </span>
                </div>
                <div class="lemon--div__06b83__1mboc text-container__06b83__2z-fK collapsed-view__06b83__3VinO margin-l1-5__06b83__2lUKU border-color--default__06b83__3-ifU">
                  <p class="lemon--p__06b83__3Qnnj text__06b83__2Kxyz text-color--normal__06b83__3xep9 text-align--left__06b83__2XGa- text-weight--semibold__06b83__2l0fe">
                    Home
                  </p>
                </div>
              </div>
            </a>
            {/**Restaurant Profile */}
            <a
              class="lemon--a__06b83__IEZFH link__06b83__1G70M nav-link__06b83__2noz4 responsive-ui-enabled__06b83__2kOzB link-color--blue-dark__06b83__85-Nu link-size--default__06b83__7tls6"
              href="#"
              target=""
              name=""
              rel=""
              role="link"
              onClick={() => {
                this.props.onTabChangeHandler('Profile');
              }}
              // onClick={() => this.changePageViewTo('Profile')}
            >
              <div
                class={`lemon--div__06b83__1mboc nav-item-v2__06b83__vmJJv inactive__06b83__2ZtYV responsive-ui-enabled__06b83__2kOzB padding-t1__06b83__2aTOb padding-r1__06b83__1xqrz padding-b1__06b83__3erWW padding-l1__06b83__1UBqt border-color--default__06b83__3-ifU ${
                  this.props.profileInfo.tabName === 'Profile' ? 'active__06b83__cBu5j' : ''
                }`}
              >
                <div class="lemon--div__06b83__1mboc icon-v2__06b83__2Y6sR border-color--default__06b83__3-ifU text-align--center__06b83__2n2yQ">
                  <span aria-hidden="true" class="icon--24-bizhouse-v2 css-1mpk29p">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="icon_svg">
                      <path d="M22.93 11.63L21 6.81V3a1 1 0 00-1-1H4a1 1 0 00-1 1v3.81l-1.93 4.82A1 1 0 002 13h1v9a1 1 0 001 1h16a1 1 0 001-1v-9h1a1 1 0 00.93-1.37zM3.48 11l1.2-3h14.64l1.2 3H3.48zM19 4v2H5V4h14zm-5 17h-4v-4h4v4zm5 0h-3v-5a1 1 0 00-1-1H9a1 1 0 00-1 1v5H5v-8h14v8z"></path>
                    </svg>
                  </span>
                </div>
                <div class="lemon--div__06b83__1mboc text-container__06b83__2z-fK collapsed-view__06b83__3VinO margin-l1-5__06b83__2lUKU border-color--default__06b83__3-ifU">
                  <p class="lemon--p__06b83__3Qnnj text__06b83__2Kxyz text-color--normal__06b83__3xep9 text-align--left__06b83__2XGa- text-weight--semibold__06b83__2l0fe">
                    Restaurant Profile
                  </p>
                </div>
              </div>
            </a>
            {/**Food Menu */}
            <a
              class="lemon--a__06b83__IEZFH link__06b83__1G70M nav-link__06b83__2noz4 responsive-ui-enabled__06b83__2kOzB link-color--blue-dark__06b83__85-Nu link-size--default__06b83__7tls6"
              href="#"
              target=""
              name=""
              rel=""
              role="link"
              onClick={() => {
                this.props.onTabChangeHandler('FoodMenu');
              }}
              // onClick={() => this.changePageViewTo('FoodMenu')}
            >
              <div
                class={`lemon--div__06b83__1mboc nav-item-v2__06b83__vmJJv inactive__06b83__2ZtYV responsive-ui-enabled__06b83__2kOzB padding-t1__06b83__2aTOb padding-r1__06b83__1xqrz padding-b1__06b83__3erWW padding-l1__06b83__1UBqt border-color--default__06b83__3-ifU ${
                  this.props.profileInfo.tabName === 'FoodMenu' ? 'active__06b83__cBu5j' : ''
                }`}
              >
                <div class="lemon--div__06b83__1mboc icon-v2__06b83__2Y6sR border-color--default__06b83__3-ifU text-align--center__06b83__2n2yQ">
                  <span aria-hidden="true" class="icon--24-photos-v2 css-1mpk29p">
                    <img
                      width="24"
                      height="24"
                      class="icon_svg"
                      //style={{}}
                      src="https://img.icons8.com/pastel-glyph/64/000000/restaurant-menu.png"
                    />
                  </span>
                </div>
                <div class="lemon--div__06b83__1mboc text-container__06b83__2z-fK collapsed-view__06b83__3VinO margin-l1-5__06b83__2lUKU border-color--default__06b83__3-ifU">
                  <p class="lemon--p__06b83__3Qnnj text__06b83__2Kxyz text-color--normal__06b83__3xep9 text-align--left__06b83__2XGa- text-weight--semibold__06b83__2l0fe">
                    Food Menu
                  </p>
                </div>
              </div>
            </a>
            {/**Orders */}
            <a
              class="lemon--a__06b83__IEZFH link__06b83__1G70M nav-link__06b83__2noz4 responsive-ui-enabled__06b83__2kOzB link-color--blue-dark__06b83__85-Nu link-size--default__06b83__7tls6"
              href="#"
              target=""
              name=""
              rel=""
              role="link"
              onClick={() => {
                this.props.onTabChangeHandler('Orders');
              }}
              // onClick={() => this.changePageViewTo('Orders')}
            >
              <div
                class={`lemon--div__06b83__1mboc nav-item-v2__06b83__vmJJv inactive__06b83__2ZtYV responsive-ui-enabled__06b83__2kOzB padding-t1__06b83__2aTOb padding-r1__06b83__1xqrz padding-b1__06b83__3erWW padding-l1__06b83__1UBqt border-color--default__06b83__3-ifU ${
                  this.props.profileInfo.tabName === 'Orders' ? 'active__06b83__cBu5j' : ''
                }`}
              >
                <div class="lemon--div__06b83__1mboc icon-v2__06b83__2Y6sR border-color--default__06b83__3-ifU text-align--center__06b83__2n2yQ">
                  <span aria-hidden="true" class="icon--24-deal-v2 css-1mpk29p">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="icon_svg">
                      <path d="M17 9a2 2 0 110-4 2 2 0 010 4zm-5.82 13.94a2 2 0 01-1.38-.57l-8.14-8.14a2 2 0 010-2.77l9.61-9.61A2.92 2.92 0 0113.32 1h6.75A2.92 2.92 0 0123 3.88v6.81a3 3 0 01-.86 2.08l-9.6 9.6a2 2 0 01-1.36.57zM20.08 3h-6.75a.91.91 0 00-.64.27l-9.61 9.61 8.1 8 9.58-9.58a.93.93 0 00.24-.6V3.89a.92.92 0 00-.92-.89z"></path>
                    </svg>
                  </span>
                </div>
                <div class="lemon--div__06b83__1mboc text-container__06b83__2z-fK collapsed-view__06b83__3VinO margin-l1-5__06b83__2lUKU border-color--default__06b83__3-ifU">
                  <p class="lemon--p__06b83__3Qnnj text__06b83__2Kxyz text-color--normal__06b83__3xep9 text-align--left__06b83__2XGa- text-weight--semibold__06b83__2l0fe">
                    Orders
                  </p>
                </div>
              </div>
            </a>

            {/**Reviews */}
            <a
              class="lemon--a__06b83__IEZFH link__06b83__1G70M nav-link__06b83__2noz4 responsive-ui-enabled__06b83__2kOzB link-color--blue-dark__06b83__85-Nu link-size--default__06b83__7tls6"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                this.props.onTabChangeHandler('Reviews');
              }}
              // onClick={() => this.changePageViewTo('Reviews')}
            >
              <div
                class={`lemon--div__06b83__1mboc nav-item-v2__06b83__vmJJv inactive__06b83__2ZtYV responsive-ui-enabled__06b83__2kOzB padding-t1__06b83__2aTOb padding-r1__06b83__1xqrz padding-b1__06b83__3erWW padding-l1__06b83__1UBqt border-color--default__06b83__3-ifU ${
                  this.props.profileInfo.tabName === 'Reviews' ? 'active__06b83__cBu5j' : ''
                }`}
              >
                <div class="lemon--div__06b83__1mboc icon-v2__06b83__2Y6sR border-color--default__06b83__3-ifU text-align--center__06b83__2n2yQ">
                  <span aria-hidden="true" class="icon--24-review-v2 css-1mpk29p">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" class="icon_svg">
                      <path d="M17 22H5a5 5 0 01-5-5V5a5 5 0 015-5h12a5 5 0 015 5v12a5 5 0 01-5 5zM5 2a3 3 0 00-3 3v12a3 3 0 003 3h12a3 3 0 003-3V5a3 3 0 00-3-3H5zm11.23 7.56a.51.51 0 01-.13.56l-2.19 2.13.52 3a.51.51 0 01-.2.49.49.49 0 01-.53 0L11 14.32l-2.7 1.41a.5.5 0 01-.73-.53l.52-3-2.17-2.13a.51.51 0 01-.13-.51.51.51 0 01.41-.34l3-.44L10.55 6a.52.52 0 01.9 0l1.37 2.78 3 .44a.51.51 0 01.41.34z"></path>
                    </svg>
                  </span>
                </div>
                <div class="lemon--div__06b83__1mboc text-container__06b83__2z-fK collapsed-view__06b83__3VinO margin-l1-5__06b83__2lUKU border-color--default__06b83__3-ifU">
                  <p class="lemon--p__06b83__3Qnnj text__06b83__2Kxyz text-color--normal__06b83__3xep9 text-align--left__06b83__2XGa- text-weight--semibold__06b83__2l0fe">
                    Reviews
                  </p>
                </div>
              </div>
            </a>
            {/**Events */}
            <a
              class="lemon--a__06b83__IEZFH link__06b83__1G70M nav-link__06b83__2noz4 responsive-ui-enabled__06b83__2kOzB link-color--blue-dark__06b83__85-Nu link-size--default__06b83__7tls6"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                this.props.onTabChangeHandler('Events');
              }}
              // onClick={() => this.changePageViewTo('Reviews')}
            >
              <div
                class={`lemon--div__06b83__1mboc nav-item-v2__06b83__vmJJv inactive__06b83__2ZtYV responsive-ui-enabled__06b83__2kOzB padding-t1__06b83__2aTOb padding-r1__06b83__1xqrz padding-b1__06b83__3erWW padding-l1__06b83__1UBqt border-color--default__06b83__3-ifU ${
                  this.props.profileInfo.tabName === 'Events' ? 'active__06b83__cBu5j' : ''
                }`}
              >
                <div class="lemon--div__06b83__1mboc icon-v2__06b83__2Y6sR border-color--default__06b83__3-ifU text-align--center__06b83__2n2yQ">
                  <span aria-hidden="true" class="icon--24-review-v2 css-1mpk29p">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" class="icon_svg">
                      <path d="M18 21H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3 1 1 0 0 1 2 0h8a1 1 0 0 1 2 0 3 3 0 0 1 3 3v12a3 3 0 0 1-3 3zm1-13H5v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V8zm-5.634 7.723L12 18l-1.366-2.277a3.5 3.5 0 1 1 2.732 0zM12 11.25a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5z"></path>
                    </svg>
                  </span>
                </div>
                <div class="lemon--div__06b83__1mboc text-container__06b83__2z-fK collapsed-view__06b83__3VinO margin-l1-5__06b83__2lUKU border-color--default__06b83__3-ifU">
                  <p class="lemon--p__06b83__3Qnnj text__06b83__2Kxyz text-color--normal__06b83__3xep9 text-align--left__06b83__2XGa- text-weight--semibold__06b83__2l0fe">
                    Events
                  </p>
                </div>
              </div>
            </a>

            {/**Photos */}
            <a
              class="lemon--a__06b83__IEZFH link__06b83__1G70M nav-link__06b83__2noz4 responsive-ui-enabled__06b83__2kOzB link-color--blue-dark__06b83__85-Nu link-size--default__06b83__7tls6"
              href="#"
              target=""
              name=""
              rel=""
              role="link"
              onClick={() => {
                this.props.onTabChangeHandler('Photos');
              }}
              // onClick={() => this.changePageViewTo('Photos')}
            >
              <div
                class={`lemon--div__06b83__1mboc nav-item-v2__06b83__vmJJv inactive__06b83__2ZtYV responsive-ui-enabled__06b83__2kOzB padding-t1__06b83__2aTOb padding-r1__06b83__1xqrz padding-b1__06b83__3erWW padding-l1__06b83__1UBqt border-color--default__06b83__3-ifU ${
                  this.props.profileInfo.tabName === 'Photos' ? 'active__06b83__cBu5j' : ''
                }`}
              >
                <div class="lemon--div__06b83__1mboc icon-v2__06b83__2Y6sR border-color--default__06b83__3-ifU text-align--center__06b83__2n2yQ">
                  <span aria-hidden="true" class="icon--24-photos-v2 css-1mpk29p">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" class="icon_svg">
                      <path d="M17 0a5 5 0 015 5v12a5 5 0 01-5 5H5a5 5 0 01-5-5V5a5 5 0 015-5h12zM2 5v12c.007.258.051.514.13.76l10.58-10a1 1 0 011.38 0L20 13.37V5a3 3 0 00-3-3H5a3 3 0 00-3 3zm15 15a3 3 0 003-3v-.87l-6.6-6.27-10.11 9.6A3 3 0 005 20h12zM6.07 9.4a2 2 0 110-4 2 2 0 010 4z"></path>
                    </svg>
                  </span>
                </div>
                <div class="lemon--div__06b83__1mboc text-container__06b83__2z-fK collapsed-view__06b83__3VinO margin-l1-5__06b83__2lUKU border-color--default__06b83__3-ifU">
                  <p class="lemon--p__06b83__3Qnnj text__06b83__2Kxyz text-color--normal__06b83__3xep9 text-align--left__06b83__2XGa- text-weight--semibold__06b83__2l0fe">
                    Photos and Videos
                  </p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

// export default LeftPannel;
const mapStateToProps = (state) => {
  const { restaurantHome } = state.restaurantHomePageReducer;
  return {
    restaurantProfile: restaurantHome,
  };
};
// const mapDispatchToProps = (dispatch) => {
//   return {
//     updateLeftPannelTab: (payload) => {
//       dispatch({
//         type: updateLeftPannelTab,
//         payload,
//       });
//     },
//   };
// };

export default connect(mapStateToProps, null)(LeftPannel);
