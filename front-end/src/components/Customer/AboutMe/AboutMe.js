import React, { Component } from 'react';
import CustomerNavBar from '../CommonArea/CustomerNavBar';
import GreyArea from '../../Customer/CommonArea/GreyArea';
import { Redirect } from 'react-router';
import LeftPannel from '../LeftPannel/LeftPannel';
import { updateLeftPannelHighlight } from '../../../constants/action-types';

import './AboutMe.css';
import { connect } from 'react-redux';

class AboutMe extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    let payload = {
      profileIsActive: true,
      eventsTabIsActive: false,
      ordersTabIsActive: false,
      followingTabIsActive: false,
      messageTabIsActive: false,
    };
    this.props.updateLeftPannelHighlight(payload);
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
    return (
      <div style={{ background: 'white' }}>
        {redirectVar}
        {<CustomerNavBar />}
        <span id="page-content" className="offscreen">
          &nbsp;
        </span>
        <div className="main-content-wrap main-content-wrap--full">{<GreyArea />}</div>
        <div
          className="super-container"
          style={{
            paddingTop: '15px',
            paddingBottom: '36px',
            width: '960px',
            margin: '0 auto',
            padding: '0 15px',
          }}
        >
          <div
            style={{ marginTop: '40px' }}
            className="clearfix layout-block layout-n user-details_container"
          >
            {<LeftPannel />}
            <div className="column column-beta ">
              <div className="user-details-overview">
                <div className="user-details-overview_sidebar">
                  {this.props.customerInfo.customerProfile.NickName != null &&
                  this.props.customerInfo.customerProfile.NickName.length > 0 ? (
                    <h3>About {this.props.customerInfo.customerProfile.NickName}</h3>
                  ) : (
                    <h3>
                      About{' '}
                      {this.props.customerInfo.customerProfile.FirstName +
                        ' ' +
                        this.props.customerInfo.customerProfile.LastName.charAt(0)}
                    </h3>
                  )}
                  {this.props.customerInfo.customerProfile.Headline != null &&
                  this.props.customerInfo.customerProfile.Headline.length > 0 ? (
                    <h3 style={{ color: 'black' }}>
                      {' '}
                      {this.props.customerInfo.customerProfile.Headline}
                    </h3>
                  ) : (
                    <h3>Please Update Heading!!!</h3>
                  )}
                  <br />

                  <div className="ysection">
                    <ul className="ylist">
                      <li>
                        <h4>Location</h4>
                        {this.props.customerInfo.customerProfile.City != null &&
                        this.props.customerInfo.customerProfile.City.length > 0 &&
                        this.props.customerInfo.customerProfile.StateName != null &&
                        this.props.customerInfo.customerProfile.StateName.length > 0 ? (
                          <p>
                            {this.props.customerInfo.customerProfile.City +
                              ', ' +
                              this.props.customerInfo.customerProfile.StateName}
                          </p>
                        ) : (
                          <p>You haven't told us yet ... do tell!</p>
                        )}
                      </li>
                      <li>{this.props.customerInfo.customerProfile.Street}</li>

                      <li>
                        <h4>Date Of Birth</h4>
                        {(this.props.customerInfo.customerProfile.DOB != null &&
                          this.props.customerInfo.customerProfile.DOB.length) > 0 ? (
                          <p>{this.props.customerInfo.customerProfile.DOB}</p>
                        ) : (
                          <p>You haven't told us yet ... do tell!</p>
                        )}
                      </li>

                      <li>
                        <h4>Yelping Since</h4>
                        <p>{this.props.customerInfo.customerProfile.JoinDate}</p>
                      </li>

                      <li>
                        <h4>Things I Love</h4>
                        {this.props.customerInfo.customerProfile.ILove != null &&
                        this.props.customerInfo.customerProfile.ILove.length > 0 ? (
                          <p>{this.props.customerInfo.customerProfile.ILove}</p>
                        ) : (
                          <p>You haven't told us yet ... do tell!</p>
                        )}
                      </li>

                      <li>
                        <h4>Find Me IN</h4>
                        {this.props.customerInfo.customerProfile.FindMeIn != null &&
                        this.props.customerInfo.customerProfile.FindMeIn.length > 0 ? (
                          <p>{this.props.customerInfo.customerProfile.FindMeIn}</p>
                        ) : (
                          <p>You haven't told us yet ... do tell!</p>
                        )}
                      </li>
                      <li>
                        <h4>Follow My Website/Blog</h4>
                        {this.props.customerInfo.customerProfile.Website != null &&
                        this.props.customerInfo.customerProfile.Website.length > 0 ? (
                          <p>{this.props.customerInfo.customerProfile.Website}</p>
                        ) : (
                          <p>You haven't told us yet ... do tell!</p>
                        )}
                      </li>
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

const mapDispatchToProps = (dispatch) => {
  return {
    updateLeftPannelHighlight: (payload) => {
      dispatch({
        type: updateLeftPannelHighlight,
        payload,
      });
    },
  };
};

// export default AboutMe;
const mapStateToProps = (state) => {
  const { customerInfo } = state.customerBasicInfoReducer;
  return {
    customerInfo: customerInfo,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AboutMe);
