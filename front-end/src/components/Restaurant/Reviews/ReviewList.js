import Review from './Review';
import React, { Component } from 'react';
import axios from 'axios';
import serverUrl from '../../../config';
import './Reviews.css';
import CustomerStaticProfile from '../CommonComponent/CustomerStaticProfile';
import { connect } from 'react-redux';
import { updateReviewList, updateCustomerForRestaurant } from '../../../constants/action-types';
import ReactPaginate from 'react-paginate';

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
  render() {
    return (
      <div>
        {this.props.customerInfo.staticProfileSeen ? (
          <CustomerStaticProfile
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

  return {
    reviewStore,
    customerInfo,
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReviewList);

// export default ReviewList;
