import Review from './Review';
import React, { Component } from 'react';
import axios from 'axios';
import serverUrl from '../../../config';
import './Reviews.css';
import CustomerStaticProfile from '../CommonComponent/CustomerStaticProfile';
import { connect } from 'react-redux';
import {
  updateReviewList,
  updateCustomerForRestaurant,
  updateMessageStore,
  updatemessageBoxStore,
} from '../../../constants/action-types';
import ReactPaginate from 'react-paginate';
import MessageBodyModal from '../../CommonComponents/MessageBodyModal';

class ReviewList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.fetchReviews(0);
  }

  fetchReviews(pageNumber) {
    axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    axios
      .get(serverUrl + 'biz/fetchReviews', {
        params: {
          selectedPage: pageNumber,
          RestaurantID: localStorage.getItem('userId'),
        },
        withCredentials: true,
      })
      .then((response) => {
        console.log('Review list Fetched', response.data);
        let Reviews = response.data.ReviewsList.map((Review) => {
          return {
            ...Review,
            ReviewDate: new Date(Review.ReviewDate),
          };
        });

        let payload = {
          Reviews,
          reviewCount: response.data.reviewCount,
          PageCount: Math.ceil(response.data.reviewCount / 4),
        };
        this.props.updateReviewList(payload);
      });
  }

  // on page click
  handlePageClick = (e) => {
    // const selectedPage = e.selected;
    this.fetchReviews(e.selected);
  };

  openStaticProfile = (event, CustomerID) => {
    if (this.props.customerInfo.staticProfileSeen) {
      let payload = {
        customerProfile: {},
        staticProfileSeen: false,
      };
      this.props.updateCustomerForRestaurant(payload);
    } else {
      event.preventDefault();
      axios
        .get(
          serverUrl + 'biz/getCustomerCompleteProfile',

          { params: { CustomerID }, withCredentials: true }
        )
        .then((response) => {
          console.log(response.data);

          let payload = {
            customerProfile: response.data.customer,
            staticProfileSeen: true,
          };
          this.props.updateCustomerForRestaurant(payload);
        });
    }
  };

  openMessageWindow = (event, customerID = null) => {
    event.preventDefault();
    let msgpayload = {
      message: '',
    };
    this.props.updatemessageBoxStore(msgpayload);
    if (this.props.messageStore.showMessageModal) {
      let payload = {
        Message: { MessageArray: [] },
        showMessageModal: false,
      };
      this.props.updateMessageStore(payload);
    } else {
      axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
      axios
        .get(
          serverUrl + 'biz/getMessages',

          {
            params: {
              CustomerId: this.props.customerInfo.customerProfile.CustomerID,
              RestaurantId: localStorage.getItem('userId'),
            },
            withCredentials: true,
          }
        )
        .then((response) => {
          console.log(response.data);
          let payload = {
            Message: response.data,
            showMessageModal: true,
          };
          this.props.updateMessageStore(payload);
        });
    }
  };

  sendMessage = (event, message) => {
    event.preventDefault();
    console.log('befor data:', this.props.customerInfo.customerProfile);
    const data = {
      message: {
        MessageInstance: message,
        SentFrom: this.props.restaurantHome.Name,
        SentTime: new Date(),
      },
      CustomerId: this.props.customerInfo.customerProfile.CustomerID,
      CustomerName:
        this.props.customerInfo.customerProfile.FirstName +
        ' ' +
        this.props.customerInfo.customerProfile.LastName,
      RestaurantId: this.props.restaurantHome.RestaurantID,
      RestaurantName: this.props.restaurantHome.Name,
    };
    axios.post(serverUrl + 'biz/sendMessage', data).then(
      (response) => {
        console.log('Status Code : ', response.status);
        if (response.status === 200) {
          console.log(response.data);
          const msgInstance = {
            MessageInstance: message,
            SentFrom: this.props.restaurantHome.Name,
            SentTime: new Date(),
          };
          let NewMessage = null;
          if (!this.props.messageStore.Message) {
            NewMessage = response.data;
          } else {
            NewMessage = this.props.messageStore.Message;

            NewMessage.MessageArray.unshift(msgInstance);
          }
          const payload = {
            Message: NewMessage,
          };
          this.props.updateMessageStore(payload);
          let msgpayload = {
            message: '',
          };
          this.props.updatemessageBoxStore(msgpayload);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };

  render() {
    return (
      <div>
        {this.props.messageStore.showMessageModal ? (
          <MessageBodyModal
            sendMessage={(event, message) => this.sendMessage(event, message)}
            openMessageWindow={(event) => this.openMessageWindow(event, '')}
          />
        ) : null}
        {this.props.customerInfo.staticProfileSeen ? (
          <CustomerStaticProfile
            openMessageWindow={(event, customerID) => this.openMessageWindow(event, customerID)}
            customerProfile={this.props.customerInfo.customerProfile}
            openStaticProfile={(event) => this.openStaticProfile(event, '')}
          />
        ) : null}
        <ul className="lemon--ul__373c0__1_cxs undefined list__373c0__2G8oH">
          {this.props.reviewStore.Reviews.map((review) => (
            <Review
              key={review._id}
              openStaticProfile={(event) => this.openStaticProfile(event, review.CustomerID)}
              review={review}

              //   }
            />
          ))}
        </ul>
        <div style={{ position: 'absolute', left: '50%', bottom: '3%', right: '0' }}>
          <ReactPaginate
            previousLabel={'prev'}
            nextLabel={'next'}
            breakLabel={'...'}
            breakClassName={'break-me'}
            pageCount={this.props.reviewStore.PageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={2}
            onPageChange={this.handlePageClick}
            containerClassName={'pagination'}
            subContainerClassName={'pages pagination'}
            activeClassName={'active'}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { reviewStore } = state.reviewStoreReducer;
  const { customerInfo } = state.customerForProfileReducer;
  const { messageStore } = state.messageStoreReducer;
  const { restaurantHome } = state.restaurantHomePageReducer;

  return {
    reviewStore,
    customerInfo,
    messageStore,
    restaurantHome,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateReviewList: (payload) => {
      dispatch({
        type: updateReviewList,
        payload,
      });
    },
    updateCustomerForRestaurant: (payload) => {
      dispatch({
        type: updateCustomerForRestaurant,
        payload,
      });
    },
    updateMessageStore: (payload) => {
      dispatch({
        type: updateMessageStore,
        payload,
      });
    },
    updatemessageBoxStore: (payload) => {
      dispatch({
        type: updatemessageBoxStore,
        payload,
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReviewList);

// export default ReviewList;
