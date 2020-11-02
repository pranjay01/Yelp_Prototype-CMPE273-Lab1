import React, { Component } from 'react';

class CustomerStaticProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const defaultImage =
      'https://s3-media0.fl.yelpcdn.com/assets/srv0/yelp_styleguide/bf5ff8a79310/assets/img/default_avatars/user_medium_square.png';

    return (
      <div
        className="modal"
        style={{ top: '0', left: '0', width: '100%', height: '100%', zIndex: '1020' }}
      >
        <div
          className="modal_content"
          style={{ top: '5%', left: '20%', width: '40%', height: '90%' }}
        >
          <span className="close" onClick={this.props.openStaticProfile}>
            &times;{' '}
          </span>
          <div
            style={{ marginTop: '40px' }}
            className="clearfix layout-block layout-n user-details_container"
          >
            <div className="column column-beta ">
              <div className="user-details-overview">
                <div className="user-details-overview_sidebar">
                  <div className="photo-box pb-m">
                    <a
                      className="js-analytics-click"
                      data-analytics-label="user-photo"
                      href="/user_photos?return_url=%2Fprofile%3Freturn_url%3D%252Fuser_details%253Fuserid%253DSbr_JFt86Dss0N-hb9StQg"
                    >
                      <img
                        style={{ width: '150px', height: '120px' }}
                        alt=""
                        className="photo-box-img"
                        src={
                          this.props.customerProfile.ImageURL !== null &&
                          this.props.customerProfile.ImageURL.length > 0
                            ? this.props.customerProfile.ImageURL
                            : defaultImage
                        }
                        // src="https://s3-media0.fl.yelpcdn.com/assets/srv0/yelp_styleguide/bf5ff8a79310/assets/img/default_avatars/user_medium_square.png"
                      />
                    </a>
                  </div>
                  {this.props.customerProfile.NickName != null &&
                  this.props.customerProfile.NickName.length > 0 ? (
                    <h3>About {this.props.customerProfile.NickName}</h3>
                  ) : (
                    <h3>
                      About{' '}
                      {this.props.customerProfile.FirstName +
                        ' ' +
                        this.props.customerProfile.LastName}
                    </h3>
                  )}
                  {this.props.customerProfile.Headline != null &&
                  this.props.customerProfile.Headline.length > 0 ? (
                    <h3 style={{ color: 'black' }}> {this.props.customerProfile.Headline}</h3>
                  ) : null}
                  <br />

                  <div className="ysection">
                    <ul className="ylist">
                      {this.props.customerProfile.City != null &&
                      this.props.customerProfile.City.length > 0 &&
                      this.props.customerProfile.StateName != null &&
                      this.props.customerProfile.StateName.length > 0 ? (
                        <div>
                          {' '}
                          <p>
                            {this.props.customerProfile.City +
                              ', ' +
                              this.props.customerProfile.StateName}
                          </p>
                          <p>{this.props.customerProfile.Street}</p>
                        </div>
                      ) : null}
                      {(this.props.customerProfile.DOB != null &&
                        this.props.customerProfile.DOB.length) > 0 ? (
                        <li>
                          <h4>Date Of Birth</h4>
                          <p>{this.props.customerProfile.DOB}</p>
                        </li>
                      ) : null}

                      {this.props.customerProfile.ILove != null &&
                      this.props.customerProfile.ILove.length > 0 ? (
                        <li>
                          <h4>Things Love </h4>
                          <p>{this.props.customerProfile.ILove}</p>
                        </li>
                      ) : null}
                      {this.props.customerProfile.Website != null &&
                      this.props.customerProfile.Website.length > 0 ? (
                        <li>
                          <h4>Follow the Website/Blog</h4>

                          <p>{this.props.customerProfile.Website}</p>
                        </li>
                      ) : null}
                      {localStorage.getItem('userrole') === 'Customer' ? (
                        <li> {this.props.alreadyFollowed?'Following!':
                          <button
                            onClick={(event) => this.props.FOllowUser(event)}
                            data-ui="add-section"
                            aria-describedby="education_label"
                            class="_-_-shared-ui-atoms-button-base-___button__button _-_-shared-ui-atoms-button-base-___button__small _-_-shared-ui-atoms-button-secondary-___secondary__default "
                          >
                            Follow
                          </button>}
                        </li>
                      ) : (
                        <li>
                            <button
                              onClick={(event)=>this.props.openMessageWindow(event,this.props.customerProfile.CustomerID)}
                            data-ui="add-section"
                            aria-describedby="education_label"
                            class="_-_-shared-ui-atoms-button-base-___button__button _-_-shared-ui-atoms-button-base-___button__small _-_-shared-ui-atoms-button-secondary-___secondary__default "
                          >
                            Message
                          </button>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CustomerStaticProfile;
