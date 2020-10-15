import Review from './Review';
import React, { Component } from 'react';
import axios from 'axios';
import serverUrl from '../../../config';
import './Reviews.css';
import CustomerStaticProfile from '../CommonComponent/CustomerStaticProfile';
import { connect } from 'react-redux';
import { updateReviewList } from '../../../constants/action-types';
import ReactPaginate from 'react-paginate';

class ReviewList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      REVIEWS: [],
      staticProfileSeen: false,
      currentCustomerId: '',
      customerProfile: {
        Name: '',
        NickName: '',
        DOB: '',
        Address1: '',
        Address2: '',
        Headline: '',
        ILove: '',
        FMI: '',
        JoinDate: '',
        Website: '',
        ImageUrl: '',
      },
    };
  }

  componentDidMount() {
    this.fetchReviews(0);
    // axios
    //   .get(serverUrl + 'biz/fetchReviews', {
    //     params: {
    //       selectedPage: 0,
    //       RestaurantID: localStorage.getItem('userId'),
    //     },
    //     withCredentials: true,
    //   })
    //   .then((response) => {
    //     console.log('Review list Fetched', response.data);
    //     let Reviews = response.data.ReviewsList.map((Review) => {
    //       return {
    //         ...Review,
    //         ReviewDate: new Date(Review.ReviewDate),
    //       };
    //     });

    //     let payload = {
    //       Reviews,
    //       reviewCount: response.data.reviewCount,
    //       PageCount: Math.ceil(response.data.reviewCount / 4),
    //     };
    //     this.props.updateReviewList(payload);
    //   });
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

  openStaticProfile = (event, cusID) => {
    if (this.state.staticProfileSeen) {
      this.setState({
        staticProfileSeen: !this.state.staticProfileSeen,
        //orderDetails: [],
      });
    } else {
      event.preventDefault();
      axios
        .get(
          serverUrl + 'biz/getCustomerCompleteProfile',

          { params: { cusID }, withCredentials: true }
        )
        .then((response) => {
          console.log(response.data);
          let customerProfile = {
            Name: response.data[0][0].Name,
            NickName: response.data[0][0].NickName,
            DOB: response.data[0][0].DOB,
            Address1: response.data[0][0].Address1,
            Address2: response.data[0][0].Address2,
            Headline: response.data[0][0].Headline,
            ILove: response.data[0][0].ILove,
            FMI: response.data[0][0].FMI,
            JoinDate: response.data[0][0].JoinDate,
            Website: response.data[0][0].Website,
            ImageUrl: response.data[0][0].ImageURL,
          };
          this.setState({
            staticProfileSeen: !this.state.staticProfileSeen,
            customerProfile,
          });
        });
    }

    //console.log('fetching food details');
  };
  render() {
    return (
      <div>
        {this.state.staticProfileSeen ? (
          <CustomerStaticProfile
            customerProfile={this.state.customerProfile}
            //  modeTop={'10%'}
            //  orderDetails={this.state.orderDetails}
            openStaticProfile={(event) => this.openStaticProfile(event, '')}
          />
        ) : null}
        <ul className="lemon--ul__373c0__1_cxs undefined list__373c0__2G8oH">
          {this.props.reviewStore.Reviews.map((review) => (
            <Review
              key={review._id}
              openStaticProfile={(event) => this.openStaticProfile(event, review.CustomerId)}
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
  return {
    reviewStore,
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReviewList);

// export default ReviewList;
