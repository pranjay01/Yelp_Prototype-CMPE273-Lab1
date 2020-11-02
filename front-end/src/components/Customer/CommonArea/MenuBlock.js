import React, { Component } from 'react';
import Menu from './Menu';
import axios from 'axios';
import serverUrl from '../../../config';
import { getCustomerBasicInfo } from '../../../constants/action-types';
import { connect } from 'react-redux';
import moment from 'moment';

class menuBlock extends Component {
  constructor(props) {
    super(props);
    this.state = { menuDisabled: true };
  }
  componentDidMount() {
    axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    axios
      .get(serverUrl + 'customer/getCustomerInfo', {
        params: { _id: localStorage.getItem('userId') },
        withCredentials: true,
      })
      .then((response) => {
        // console.log(response.data);
        let JoinDate = moment.utc(response.data.customer.JoinDate);
        let DOB = moment.utc(response.data.customer.DOB);
        // console.log('DOB:', DOB.format('LL'));
        // DOB = DOB.getUTCDate();
        // console.log('DOB:', DOB);
        // DOB = new Intl.DateTimeFormat('en-GB', {
        //   year: 'numeric',
        //   month: 'long',
        //   day: '2-digit',
        // }).format(DOB);

        // let DOB = moment(response.data.customer.DOB);
        // console.log('DOB: ', DOB);
        let customerProfile = {
          ...response.data.customer,
          JoinDate: JoinDate.format('LL'),
          DOB: DOB.format('YYYY-MM-DD'),
          NewEmail: response.data.customer.Email,
          // DOB: new Date(response.data.customer.DOB),
        };
        let payload = {
          reviewCount: response.data.reviewCount,
          customerProfile,
        };
        this.props.getCustomerBasicInfo(payload);
      });
  }
  showMenu = () => {
    this.setState({
      menuDisabled: !this.state.menuDisabled,
    });
  };
  render() {
    const defaultImage =
      'https://s3-media0.fl.yelpcdn.com/assets/public/user_medium_square.yji-bf5ff8a79310030f79328ae60713730f.png';
    return (
      <div className="arrange_unit nowrap">
        <div className="main-header_account">
          <div className="user-account clearfix drop-menu-origin" onClick={this.showMenu}>
            <a className="ybtn ybtn--primary drop-menu-link user-account_button">
              <span className="user-account_avatar responsive-visible-large-block">
                <img
                  alt="Pranjay S."
                  className="photo-box-img"
                  height="90"
                  loading="lazy"
                  src={
                    this.props.customerInfo.customerProfile.ImageURL !== null &&
                    this.props.customerInfo.customerProfile.ImageURL.length > 0
                      ? this.props.customerInfo.customerProfile.ImageURL
                      : defaultImage
                  }
                  // src="https://s3-media0.fl.yelpcdn.com/assets/public/user_medium_square.yji-bf5ff8a79310030f79328ae60713730f.png"
                  width="90"
                />
              </span>
              <span
                style={{ width: '14px', height: '14px' }}
                className="icon icon--14-triangle-down icon--size-14 icon--inverse icon--fallback-inverted u-triangle-direction-down user-account_button-arrow responsive-visible-large-inline-block"
              >
                <svg role="img" className="icon_svg"></svg>
              </span>
              <span
                style={{ width: '24px', height: '24px' }}
                className="icon icon--24-hamburger icon--size-24 icon--inverse icon--fallback-inverted drop-menu-link_open"
              >
                <svg role="img" className="icon_svg"></svg>
              </span>
              <span
                aria-hidden="true"
                style={{ width: '24px', height: '24px' }}
                className="icon icon--24-close icon--size-24 icon--inverse icon--fallback-inverted drop-menu-link_close"
              >
                <svg role="img" className="icon_svg"></svg>
              </span>
            </a>
            {!this.state.menuDisabled && <Menu />}
          </div>
        </div>
      </div>
    );
  }
}

//export default menuBlock;
const mapStateToProps = (state) => {
  const { customerInfo } = state.customerBasicInfoReducer;
  return {
    customerInfo: customerInfo,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getCustomerBasicInfo: (payload) => {
      dispatch({
        type: getCustomerBasicInfo,
        payload,
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(menuBlock);
