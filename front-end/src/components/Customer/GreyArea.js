import React, { Component } from 'react';
import './GreyArea.css';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class GreyArea extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const defaultImage =
      'https://s3-media0.fl.yelpcdn.com/assets/srv0/yelp_styleguide/7e4e0dfd903f/assets/img/default_avatars/user_large_square.png';
    return (
      <div class="top-shelf top-shelf-grey">
        <div class="content-container">
          <div id="alert-container"></div>

          <div
            class="user-profile_container"
            style={{ padding: '9px 0 24px', position: 'relative' }}
          >
            <div class="user-profile_avatar">
              <div class="photo-slideshow photo-slideshow--full-width photo-slideshow--rounded js-photo-slideshow-user-details">
                <div
                  class="photo-slideshow_slide is-active"
                  style={{
                    backgroundImage: `url(${
                      this.props.customerInfo.ImageUrl !== null &&
                      this.props.customerInfo.ImageUrl.length > 0
                        ? this.props.customerInfo.ImageUrl
                        : defaultImage
                    })`,
                    //'url(https://s3-media0.fl.yelpcdn.com/assets/srv0/yelp_styleguide/7e4e0dfd903f/assets/img/default_avatars/user_large_square.png)',
                  }}
                >
                  <div class="photo-slideshow_image">
                    <a href="/user_photos?userid=Sbr_JFt86Dss0N-hb9StQg">
                      <img
                        class="photo-box-img"
                        height="250"
                        loading="lazy"
                        src={
                          this.props.customerInfo.ImageUrl !== null &&
                          this.props.customerInfo.ImageUrl.length > 0
                            ? this.props.customerInfo.ImageUrl
                            : defaultImage
                        }
                        // src="https://s3-media0.fl.yelpcdn.com/assets/srv0/yelp_styleguide/7e4e0dfd903f/assets/img/default_avatars/user_large_square.png"
                        width="250"
                      />
                    </a>
                  </div>

                  {/*<div class="photo-box_actions">
                    <a class="photo-box_action-link" href="/user_photos/add">
                      {/*<span
                        aria-hidden="true"
                        style={{ width: '18px', height: '18px' }}
                        class="icon icon--18-add-photo icon--size-18 icon--currentColor u-space-r-half"
                      >
                        <svg role="img" class="icon_svg">
                          {/*<use xlink:href="#18x18_add_photo"></use>*/}
                  {/*  </svg>
                      </span>*/}
                  {/*<input
                        type="file"
                        accept="image/*"
                        onChange={this.onChangeFileHandler}
                        name="fileName"
                        id="filename"
                        placeholder="Add image"
                      />

                      <span class="photo-box_action-text">{/*Add a photo*</span>
                    </a>
                    </div>*/}
                </div>
              </div>
            </div>
            <div class="user-profile_content-wrapper arrange arrange--bottom arrange--30">
              <div class="user-profile_avatar-dummy arrange_unit" aria-hidden="true"></div>
              <div class="user-profile_info arrange_unit">
                <h1>{this.props.customerInfo.Name}</h1>
                <h3 class="user-location alternate">{this.props.customerInfo.Address}</h3>
                <div class="clearfix">
                  <ul class="user-passport-stats">
                    <li class="review-count">
                      <span
                        aria-hidden="true"
                        style={{ fill: '#f15c00', width: '24px', height: '24px' }}
                        class="icon icon--24-review icon--size-24"
                      >
                        <svg role="img" class="icon_svg">
                          <svg id="24x24_review" height="24" viewBox="0 0 24 24" width="24">
                            <path d="M21 6a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V6zm-5.88 10.428l-3.16-1.938-3.05 2.01.59-3.457L7 10.596l3.457-.505L11.96 6.5l1.582 3.59 3.458.506-2.5 2.447.62 3.385z"></path>
                          </svg>
                          {/*<use xlink:href="#24x24_review"></use>*/}
                        </svg>
                      </span>
                      <strong>{this.props.customerInfo.ReviewCount}</strong> Reviews
                    </li>
                  </ul>
                </div>
              </div>
              <div class="user-profile_actions arrange_unit">
                <ul class="action-link-list">
                  <li>
                    <Link to="/UpdateProfile" class="arrange arrange--middle" href="#" rel="">
                      <div class="action-link_icon arrange_unit">
                        <span
                          aria-hidden="true"
                          style={{ width: '18px', height: '18px' }}
                          class="icon icon--18-feed icon--size-18 icon--currentColor"
                        >
                          <svg role="img" class="icon_svg">
                            <svg id="18x18_feed" height="18" viewBox="0 0 18 18" width="18">
                              <path d="M14 3H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM4 6.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-3zM14 12H4v-1h10v1zm0-5h-4V6h4v1zm0 2h-4V8h4v1z"></path>
                            </svg>
                            {/*<use xlink:href="#18x18_feed"></use>*/}
                          </svg>
                        </span>
                      </div>
                      <div class="action-link_label arrange_unit arrange_unit--fill">
                        Update Your Profile
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/UpdateContactInformation"
                      class="arrange arrange--middle"
                      href="#"
                      rel=""
                    >
                      <div class="action-link_icon arrange_unit">
                        <span
                          aria-hidden="true"
                          style={{ width: '18px', height: '18px' }}
                          class="icon icon--18-feed icon--size-18 icon--currentColor"
                        >
                          <svg role="img" class="icon_svg">
                            <svg id="18x18_feed" height="18" viewBox="0 0 18 18" width="18">
                              <path d="M14 3H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM4 6.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-3zM14 12H4v-1h10v1zm0-5h-4V6h4v1zm0 2h-4V8h4v1z"></path>
                            </svg>
                            {/*<use xlink:href="#18x18_feed"></use>*/}
                          </svg>
                        </span>
                      </div>
                      <div class="action-link_label arrange_unit arrange_unit--fill">
                        Update Contact Information
                      </div>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

//export default GreyArea;
const mapStateToProps = (state) => {
  const { customerInfo } = state.customerBasicInfoReducer;
  return {
    customerInfo: customerInfo,
  };
};

export default connect(mapStateToProps, null)(GreyArea);
