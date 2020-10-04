import Review from './Review';
import React, { Component } from 'react';
import axios from 'axios';
import serverUrl from '../../../config';
import './Reviews.css';
import CustomerStaticProfile from '../CommonComponent/CustomerStaticProfile';

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
    console.log('inside Reviews');
    axios.get(serverUrl + 'biz/fetchReviews').then((response) => {
      console.log('Review ist Fetched', response.data);
      let allReviews = response.data[0].map((Review) => {
        return {
          ID: Review.ID,
          Rating: Review.Rating,
          Date: new Date(Review.Date),
          Description: Review.Description,
          CustomerId: Review.CustomerId,
          CustomerName: Review.CustomerName,
          CustomerAddr: Review.CustomerAddr,
          ImageUrl: Review.ImageUrl,
        };
      });

      this.setState({
        REVIEWS: this.state.REVIEWS.concat(allReviews),
      });
    });
  }
  // openStaticProfile(cusId) {
  //   event.preventDefault();
  //   this.setState({
  //     currentCustomerId: cusId,
  //     popSeen: !this.state.popSeen,
  //   });
  // }

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
          {this.state.REVIEWS.map((review) => (
            <Review
              openStaticProfile={(event) => this.openStaticProfile(event, review.CustomerId)}
              review={review}

              //   }
            />
          ))}
        </ul>
      </div>
    );
  }
}

export default ReviewList;
