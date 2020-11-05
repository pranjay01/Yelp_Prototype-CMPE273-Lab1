import React, { Component } from 'react';
import './LeftPannel.css';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

class LeftPannel extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    let redirectVar = null;
    if (!localStorage.getItem('token')) {
      // console.log('cookie not found');
      redirectVar = <Redirect to="/customerLogin" />;
    } else {
      if (localStorage.getItem('userrole') === 'Customer') {
        redirectVar = null;
      } else if (localStorage.getItem('userrole') === 'Restaurant') {
        redirectVar = <Redirect to="/restaurantHome" />;
      } else {
        redirectVar = <Redirect to="/customerLogin" />;
      }
    }
    // }
    return (
      <div className="column column-alpha user-details_sidebar">
        {redirectVar}
        <div className="ysection">
          <div className="titled-nav js-titled-nav">
            <input
              style={{ margin: '0' }}
              id="titled-nav-da5fd015-9d39-4323-9fdf-fe3230881672"
              className="titled-nav-dropdown_handler"
              type="checkbox"
              role="presentation"
            />

            <div className="titled-nav-dropdown hidden-non-responsive-block responsive-hidden-large">
              <label
                htmlFor="titled-nav-da5fd015-9d39-4323-9fdf-fe3230881672"
                className="titled-nav-dropdown_trigger"
              >
                <span className="arrange arrange--middle titled-nav-dropdown_content">
                  <span className="arrange_unit arrange_unit--fill titled-nav-dropdown_shadow">
                    <span className="titled-nav-dropdown_faded-title">
                      <strong>{this.props.customerInfo.Name} Profile</strong>
                      Profile Overview
                    </span>
                  </span>

                  <span className="arrange_unit titled-nav-dropdown_icon">
                    <span
                      aria-hidden="true"
                      style={{ width: '24px', height: '24px' }}
                      className="icon icon--24-chevron-down icon--size-24 titled-nav-dropdown_expand"
                    >
                      <svg role="img" className="icon_svg"></svg>
                    </span>
                    <span
                      aria-hidden="true"
                      style={{ width: '24px', height: '24px' }}
                      className="icon icon--24-chevron-up icon--size-24 titled-nav-dropdown_collapse"
                    >
                      <svg role="img" className="icon_svg"></svg>
                    </span>
                  </span>
                </span>
              </label>
            </div>

            <div className="titled-nav_menus">
              <div className="titled-nav_menu">
                <div className="titled-nav-header">
                  <div className="arrange arrange--top">
                    <div className="arrange_unit arrange_unit--fill">
                      <div className="titled-nav-header_content">
                        <h3>{this.props.customerInfo.Name} Profile</h3>
                      </div>
                    </div>

                    <div className="arrange_unit"></div>
                  </div>
                </div>

                <ul className="titled-nav_items">
                  <li className="titled-nav_item">
                    <Link
                      to="/AboutMe"
                      className={`titled-nav_link ${
                        this.props.LeftPannelStore.profileIsActive && 'is-active'
                      }`}
                      href="#"
                    >
                      <div className="titled-nav_link-content arrange arrange--middle arrange--6">
                        <div className="arrange_unit">
                          <span
                            aria-hidden="true"
                            style={{ width: '24px', height: '24px' }}
                            className="icon icon--24-profile icon--size-24 titled-nav_icon"
                          >
                            <svg role="img" className="icon_svg">
                              <svg id="24x24_profile" height="24" viewBox="0 0 24 24" width="24">
                                <path d="M4.37 22c.278-4.762 3.587-8 7.63-8 4.043 0 7.352 3.238 7.63 8H4.37zM12 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"></path>
                              </svg>
                            </svg>
                          </span>
                        </div>

                        <div className="arrange_unit arrange_unit--fill">
                          <span className="titled-nav_link-label">Profile Overview</span>
                        </div>
                      </div>
                    </Link>
                  </li>

                  <li className="titled-nav_item">
                    <Link
                      to="/Events"
                      className={`titled-nav_link ${
                        this.props.LeftPannelStore.eventsTabIsActive && 'is-active'
                      }`}
                      href="#"
                    >
                      <div className="titled-nav_link-content arrange arrange--middle arrange--6">
                        <div className="arrange_unit">
                          <span
                            aria-hidden="true"
                            style={{ width: '24px', height: '24px' }}
                            className="icon icon--24-event icon--size-24 titled-nav_icon"
                          >
                            <svg role="img" className="icon_svg">
                              <svg id="24x24_event" height="24" viewBox="0 0 24 24" width="24">
                                <path d="M18 21H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3 1 1 0 0 1 2 0h8a1 1 0 0 1 2 0 3 3 0 0 1 3 3v12a3 3 0 0 1-3 3zm1-13H5v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V8zm-5.634 7.723L12 18l-1.366-2.277a3.5 3.5 0 1 1 2.732 0zM12 11.25a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5z"></path>
                              </svg>
                            </svg>
                          </span>
                        </div>

                        <div className="arrange_unit arrange_unit--fill">
                          <span className="titled-nav_link-label">Events</span>
                        </div>
                      </div>
                    </Link>
                  </li>

                  <li className="titled-nav_item">
                    <Link
                      to="/OrdersList"
                      className={`titled-nav_link ${
                        this.props.LeftPannelStore.ordersTabIsActive && 'is-active'
                      }`}
                      // className="titled-nav_link"
                      href="#"
                    >
                      <div className="titled-nav_link-content arrange arrange--middle arrange--6">
                        <div className="arrange_unit">
                          <span
                            aria-hidden="true"
                            style={{ width: '24px', height: '24px' }}
                            className="icon icon--24-deal icon--size-24 titled-nav_icon"
                          >
                            <svg role="img" className="icon_svg">
                              <svg id="24x24_deal" height="24" viewBox="0 0 24 24" width="24">
                                <path d="M22 5.004a3 3 0 0 0-3.004-3l-5.426.008a2.17 2.17 0 0 0-1.544.634l-9.39 9.375a2.185 2.185 0 0 0 .013 3.096l6.223 6.214c.86.858 2.247.863 3.1.013l9.39-9.375c.41-.408.638-.963.636-1.54V5.003zM18.22 8.52a1.997 1.997 0 0 1-3.44 0 1.993 1.993 0 0 1 0-2.04 1.997 1.997 0 0 1 3.44 0 1.99 1.99 0 0 1 0 2.04z"></path>
                              </svg>
                            </svg>
                          </span>
                        </div>

                        <div className="arrange_unit arrange_unit--fill">
                          <span className="titled-nav_link-label">Order History</span>
                        </div>
                      </div>
                    </Link>
                  </li>

                  <li className="titled-nav_item">
                    <Link
                      to="/Following"
                      className={`titled-nav_link ${
                        this.props.LeftPannelStore.followingTabIsActive && 'is-active'
                      }`}
                      href="#"
                    >
                      <div className="titled-nav_link-content arrange arrange--middle arrange--6">
                        <div className="arrange_unit">
                          <span
                            aria-hidden="true"
                            style={{ width: '24px', height: '24px' }}
                            className="icon icon--24-review icon--size-24 titled-nav_icon"
                          >
                            <svg role="img" className="icon_svg">
                              <svg id="24x24_review" height="24" viewBox="0 0 24 24" width="24">
                                <path d="M21 6a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V6zm-5.88 10.428l-3.16-1.938-3.05 2.01.59-3.457L7 10.596l3.457-.505L11.96 6.5l1.582 3.59 3.458.506-2.5 2.447.62 3.385z"></path>
                              </svg>
                            </svg>
                          </span>
                        </div>

                        <div className="arrange_unit arrange_unit--fill">
                          <span className="titled-nav_link-label">Following</span>
                        </div>
                      </div>
                    </Link>
                  </li>

                  <li className="titled-nav_item">
                    <Link
                      to="/Messages"
                      className={`titled-nav_link ${
                        this.props.LeftPannelStore.messageTabIsActive && 'is-active'
                      }`}
                      href="#"
                    >
                      <div className="titled-nav_link-content arrange arrange--middle arrange--6">
                        <div className="arrange_unit">
                          <span
                            aria-hidden="true"
                            style={{ width: '24px', height: '24px' }}
                            className="icon icon--24-review icon--size-24 titled-nav_icon"
                          >
                            <svg role="img" className="icon_svg">
                              <svg id="24x24_review" height="24" viewBox="0 0 24 24" width="24">
                                <path d="M17.388,4.751H2.613c-0.213,0-0.389,0.175-0.389,0.389v9.72c0,0.216,0.175,0.389,0.389,0.389h14.775c0.214,0,0.389-0.173,0.389-0.389v-9.72C17.776,4.926,17.602,4.751,17.388,4.751 M16.448,5.53L10,11.984L3.552,5.53H16.448zM3.002,6.081l3.921,3.925l-3.921,3.925V6.081z M3.56,14.471l3.914-3.916l2.253,2.253c0.153,0.153,0.395,0.153,0.548,0l2.253-2.253l3.913,3.916H3.56z M16.999,13.931l-3.921-3.925l3.921-3.925V13.931z"></path>
                              </svg>
                            </svg>
                          </span>
                        </div>

                        <div className="arrange_unit arrange_unit--fill">
                          <span className="titled-nav_link-label">Messages</span>
                        </div>
                      </div>
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="titled-nav-header responsive-hidden-large" role="presentation"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { customerInfo } = state.customerBasicInfoReducer;
  const { LeftPannelStore } = state.leftPannelReducer;
  return {
    customerInfo,
    LeftPannelStore,
  };
};

export default connect(mapStateToProps, null)(LeftPannel);

// export default LeftPannel;
