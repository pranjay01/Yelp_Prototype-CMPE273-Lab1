import React, { Component } from 'react';
import axios from 'axios';
import serverUrl from '../../../../config';
import Review from '../../../Restaurant/Reviews/Review';
import WriteAReview from './WriteAReview';
import { updateSnackbarData, updateSearchedRestaurant } from '../../../../constants/action-types';
import { connect } from 'react-redux';
import moment from 'moment';

class RestaurantLeftReviewPart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showReview: false,
    };
  }
  componentDidMount() {
    axios
      .get(serverUrl + 'static/fetchRestaurantProfileForCustomer', {
        params: { restroId: localStorage.getItem('restaurantPageID') },
        withCredentials: true,
      })
      .then((response) => {
        console.log('Review list Fetched', response.data);
        const payload = {
          ...response.data,
        };
        this.props.updateSearchedRestaurant(payload);
      });
  }

  openReviewForm = () => {
    this.setState({
      showReview: !this.state.showReview,
    });
  };
  submitReview = (event, review, rating) => {
    event.preventDefault();
    let ReviewDate = moment.utc();
    const data = {
      RestaurantID: localStorage.getItem('restaurantPageID'),
      ReviewCounts: Number(this.props.restaurantProfileStore.RestaurantProfile.ReviewCounts) + 1,
      TotalRating:
        Number(this.props.restaurantProfileStore.RestaurantProfile.TotalRating) + Number(rating),
      Description: review,
      Rating: rating,
      CustomerID: localStorage.getItem('userId'),
      CustomerName:
        this.props.customerInfo.customerProfile.FirstName +
        ' ' +
        this.props.customerInfo.customerProfile.LastName,
      CustomerAddr:
        this.props.customerInfo.customerProfile.City +
        ' - ' +
        this.props.customerInfo.customerProfile.Zip,
      ImageUrl: this.props.customerInfo.customerProfile.ImageURL
        ? this.props.customerInfo.customerProfile.ImageURL
        : '',
      ReviewDate: ReviewDate.format('YYYY-MM-DD'),
    };
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    axios.post(serverUrl + 'customer/submitReview', data).then(
      (response) => {
        console.log('Status Code : ', response.status);
        if (response.status === 201) {
          console.log(response.data);
          this.setState({
            showReview: false,
          });
          let payload = {
            success: true,
            message: 'Review Submitted Successfull!!!',
          };
          this.props.updateSnackbarData(payload);
        }
        const ReviewList = [...this.props.restaurantProfileStore.ReviewList, response.data];
        // const ReviewCount
        const payload = {
          ReviewList,
          RestaurantProfile: {
            ...this.props.restaurantProfileStore.RestaurantProfile,
            ReviewCounts: this.props.restaurantProfileStore.RestaurantProfile.ReviewCounts + 1,
            TotalRating:
              Number(this.props.restaurantProfileStore.RestaurantProfile.TotalRating) +
              Number(rating),
          },
        };
        this.props.updateSearchedRestaurant(payload);
      },
      (error) => {
        console.log(error);
      }
    );
  };
  render() {
    let OpeningTime = new Date(
      '1970-01-01T' + this.props.restaurantProfileStore.RestaurantProfile.OpeningTime + 'Z'
    );
    OpeningTime = OpeningTime.toLocaleString([], {
      timeZone: 'UTC',
      hour: '2-digit',
      minute: '2-digit',
    });
    let ClosingTime = new Date(
      '1970-01-01T' + this.props.restaurantProfileStore.RestaurantProfile.ClosingTime + 'Z'
    );
    ClosingTime = ClosingTime.toLocaleString([], {
      timeZone: 'UTC',
      hour: '2-digit',
      minute: '2-digit',
    });
    const rightPath = (
      <path d="M9.46 17.52a1 1 0 01-.71-.29l-4-4a1.004 1.004 0 111.42-1.42l3.25 3.26 8.33-8.34a1.004 1.004 0 011.42 1.42l-9 9a1 1 0 01-.71.37z"></path>
    );
    const wrongPath = (
      <path d="M13.41 12l5.3-5.29a1.004 1.004 0 10-1.42-1.42L12 10.59l-5.29-5.3a1.004 1.004 0 00-1.42 1.42l5.3 5.29-5.3 5.29a1 1 0 000 1.42 1 1 0 001.42 0l5.29-5.3 5.29 5.3a1 1 0 001.42 0 1 1 0 000-1.42L13.41 12z"></path>
    );
    let rating = { backgroundPosition: '0 0' };

    if (this.props.restaurantProfileStore.RestaurantProfile.ReviewCounts > 0) {
      const AvgRating = Math.round(
        this.props.restaurantProfileStore.RestaurantProfile.TotalRating /
          this.props.restaurantProfileStore.RestaurantProfile.ReviewCounts
      );
      switch (AvgRating) {
        case 1:
          rating = { backgroundPosition: '0 -64px' };
          break;
        case 2:
          rating = { backgroundPosition: '0 -128px' };
          break;
        case 3:
          rating = { backgroundPosition: '0 -192px' };
          break;
        case 4:
          rating = { backgroundPosition: '0 -256px' };

          break;
        case 5:
          rating = { backgroundPosition: '0 -288px' };
          break;
        default:
          break;
      }
    }
    return (
      <div className="lemon--div__373c0__1mboc arrange-unit__373c0__o3tjT arrange-unit-grid-column--8__373c0__2dUx_ padding-r6__373c0__2Qlev border-color--default__373c0__3-ifU">
        <div className="lemon--div__373c0__1mboc margin-b3__373c0__q1DuY border-color--default__373c0__3-ifU">
          <div className="lemon--div__373c0__1mboc arrange__373c0__2C9bH gutter-4__373c0__3s8bL border-color--default__373c0__3-ifU">
            <div className="lemon--div__373c0__1mboc arrange-unit__373c0__o3tjT arrange-unit-fill__373c0__3Sfw1 border-color--default__373c0__3-ifU">
              <div className="lemon--div__373c0__1mboc margin-b1__373c0__1khoT border-color--default__373c0__3-ifU">
                <h1
                  style={{}}
                  className="lemon--h1__373c0__2ZHSL heading--h1__373c0__dvYgw undefined heading--inline__373c0__10ozy"
                >
                  {this.props.restaurantProfileStore.RestaurantProfile.Name}
                </h1>
              </div>
              <div className="lemon--div__373c0__1mboc arrange__373c0__2C9bH gutter-1-5__373c0__2vL-3 vertical-align-middle__373c0__1SDTo margin-b1__373c0__1khoT border-color--default__373c0__3-ifU">
                <div className="lemon--div__373c0__1mboc arrange-unit__373c0__o3tjT border-color--default__373c0__3-ifU">
                  <span className="lemon--span__373c0__3997G display--inline__373c0__3JqBP border-color--default__373c0__3-ifU">
                    <div
                      className="lemon--div__373c0__1mboc i-stars__373c0__1T6rz i-stars--large-5__373c0__1GcGD border-color--default__373c0__3-ifU overflow--hidden__373c0__2y4YK"
                      aria-label="5 star rating"
                      role="img"
                      style={rating}
                    >
                      <img
                        className="lemon--img__373c0__3GQUb offscreen__373c0__1KofL"
                        src="https://s3-media0.fl.yelpcdn.com/assets/public/stars_v2.yji-52d3d7a328db670d4402843cbddeed89.png"
                        width="132"
                        height="560"
                        alt=""
                      />
                    </div>
                  </span>
                </div>
                <div className="lemon--div__373c0__1mboc arrange-unit__373c0__o3tjT border-color--default__373c0__3-ifU nowrap__373c0__35McF">
                  <p className="lemon--p__373c0__3Qnnj text__373c0__2Kxyz text-color--mid__373c0__jCeOG text-align--left__373c0__2XGa- text-size--large__373c0__3t60B">
                    {this.props.restaurantProfileStore.RestaurantProfile.ReviewCounts} reviews
                  </p>
                </div>
              </div>
              <div className="lemon--div__373c0__1mboc arrange__373c0__2C9bH margin-t0-5__373c0__1VMSL border-color--default__373c0__3-ifU">
                <div className="lemon--div__373c0__1mboc arrange-unit__373c0__o3tjT border-color--default__373c0__3-ifU">
                  <div className="lemon--div__373c0__1mboc border-color--default__373c0__3-ifU nowrap__373c0__35McF">
                    <div className="lemon--div__373c0__1mboc display--inline-block__373c0__1ZKqC margin-r1-5__373c0__1Vie3 border-color--default__373c0__3-ifU">
                      <span className="lemon--span__373c0__3997G text__373c0__2Kxyz text-color--red__373c0__n7iaa text-align--left__373c0__2XGa- text-weight--semibold__373c0__2l0fe text-size--large__373c0__3t60B">
                        Closed
                      </span>
                      <span className="lemon--span__373c0__3997G display--inline__373c0__3JqBP margin-l1__373c0__1khIQ border-color--default__373c0__3-ifU">
                        <span className="lemon--span__373c0__3997G text__373c0__2Kxyz text-color--black-extra-light__373c0__2OyzO text-align--left__373c0__2XGa- text-weight--semibold__373c0__2l0fe text-size--large__373c0__3t60B">
                          {OpeningTime} - {ClosingTime}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lemon--div__373c0__1mboc arrange__373c0__2C9bH gutter-1__373c0__2l5bx border-color--default__373c0__3-ifU">
          <div className="lemon--div__373c0__1mboc arrange-unit__373c0__o3tjT border-color--default__373c0__3-ifU nowrap__373c0__35McF">
            {this.state.showReview ? (
              <WriteAReview
                openReviewForm={() => this.openReviewForm()}
                submitReview={(event, review, rating) => this.submitReview(event, review, rating)}
              />
            ) : null}

            {localStorage.getItem('token') ? (
              <a
                onClick={this.openReviewForm}
                className="lemon--a__373c0__IEZFH button__373c0__3lYgT primary__373c0__2ZWOb"
                href="#"
              >
                <div className="lemon--div__373c0__1mboc button-content__373c0__1QNtB border-color--default__373c0__3-ifU">
                  <span className="lemon--span__373c0__3997G text__373c0__2Kxyz button-content-text__373c0__Z-7FO text-color--inherit__373c0__1lczC text-align--center__373c0__3VrfZ text-weight--semibold__373c0__2l0fe text-size--large__373c0__3t60B text--truncated__373c0__3sLaf">
                    <span aria-hidden="true" className="icon--18-star css-15osoi8"></span> Write a
                    Review
                  </span>
                </div>
              </a>
            ) : (
              <h2>Please Login to Write a Review!!!!! </h2>
            )}
          </div>
        </div>
        <section className="lemon--section__373c0__fNwDM margin-t4__373c0__1TRkQ padding-t4__373c0__3hVZ3 border--top__373c0__3gXLy border-color--default__373c0__3-ifU">
          <div className="lemon--div__373c0__1mboc margin-b2__373c0__abANL border-color--default__373c0__3-ifU">
            <div className="lemon--div__373c0__1mboc margin-b2__373c0__abANL border-color--default__373c0__3-ifU">
              <span className="lemon--span__373c0__3997G display--inline__373c0__3JqBP border-color--default__373c0__3-ifU">
                <h5 className="lemon--h5__373c0__3evKh heading--h5__373c0__1WgmC">
                  <span className="lemon--span__373c0__3997G display--inline__373c0__3JqBP border-color--default__373c0__3-ifU">
                    Updated Services
                  </span>
                </h5>
              </span>
              <div className="lemon--div__373c0__1mboc margin-t2__373c0__1CFWK border-color--default__373c0__3-ifU">
                <div className="lemon--div__373c0__1mboc display--inline-block__373c0__1ZKqC margin-r3__373c0__r37sx margin-b1__373c0__1khoT border-color--default__373c0__3-ifU">
                  <div className="lemon--div__373c0__1mboc display--inline-block__373c0__1ZKqC margin-r1__373c0__zyKmV border-color--default__373c0__3-ifU">
                    <span aria-hidden="true" className="icon--24-checkmark-v2 css-yyirv3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        className="icon_svg"
                      >
                        {this.props.restaurantProfileStore.RestaurantProfile.YelpDelivery
                          ? rightPath
                          : wrongPath}{' '}
                      </svg>
                    </span>
                  </div>
                  <span className="lemon--span__373c0__3997G text__373c0__2Kxyz text-color--normal__373c0__3xep9 text-align--left__373c0__2XGa- text-weight--semibold__373c0__2l0fe text-size--large__373c0__3t60B">
                    Yelp Delivery
                  </span>
                </div>
                <div className="lemon--div__373c0__1mboc display--inline-block__373c0__1ZKqC margin-r3__373c0__r37sx margin-b1__373c0__1khoT border-color--default__373c0__3-ifU">
                  <div className="lemon--div__373c0__1mboc display--inline-block__373c0__1ZKqC margin-r1__373c0__zyKmV border-color--default__373c0__3-ifU">
                    <span aria-hidden="true" className="icon--24-checkmark-v2 css-yyirv3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        className="icon_svg"
                      >
                        {this.props.restaurantProfileStore.RestaurantProfile.CurbsidePickup
                          ? rightPath
                          : wrongPath}{' '}
                      </svg>
                    </span>
                  </div>
                  <span className="lemon--span__373c0__3997G text__373c0__2Kxyz text-color--normal__373c0__3xep9 text-align--left__373c0__2XGa- text-weight--semibold__373c0__2l0fe text-size--large__373c0__3t60B">
                    Pick Up
                  </span>
                </div>
                <div className="lemon--div__373c0__1mboc display--inline-block__373c0__1ZKqC margin-r3__373c0__r37sx margin-b1__373c0__1khoT border-color--default__373c0__3-ifU">
                  <div className="lemon--div__373c0__1mboc display--inline-block__373c0__1ZKqC margin-r1__373c0__zyKmV border-color--default__373c0__3-ifU">
                    <span aria-hidden="true" className="icon--24-checkmark-v2 css-yyirv3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        className="icon_svg"
                      >
                        {this.props.restaurantProfileStore.RestaurantProfile.DineIn
                          ? rightPath
                          : wrongPath}{' '}
                      </svg>
                    </span>
                  </div>
                  <span className="lemon--span__373c0__3997G text__373c0__2Kxyz text-color--normal__373c0__3xep9 text-align--left__373c0__2XGa- text-weight--semibold__373c0__2l0fe text-size--large__373c0__3t60B">
                    DineIn
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="lemon--section__373c0__fNwDM margin-t4__373c0__1TRkQ padding-t4__373c0__3hVZ3 border--top__373c0__3gXLy border-color--default__373c0__3-ifU">
          <div className="lemon--div__373c0__1mboc arrange__373c0__2C9bH gutter-auto__373c0__1Ep_j vertical-align-middle__373c0__1SDTo margin-b3__373c0__q1DuY border-color--default__373c0__3-ifU">
            <div className="lemon--div__373c0__1mboc arrange-unit__373c0__o3tjT arrange-unit-fill__373c0__3Sfw1 border-color--default__373c0__3-ifU">
              <h4 className="lemon--h4__373c0__1yd__ heading--h4__373c0__27bDo heading--inline__373c0__10ozy">
                Location &amp; Hours
              </h4>
            </div>
          </div>
          <div className="lemon--div__373c0__1mboc arrange__373c0__2C9bH gutter-4__373c0__3s8bL border-color--default__373c0__3-ifU">
            <div className="lemon--div__373c0__1mboc arrange-unit__373c0__o3tjT border-color--default__373c0__3-ifU">
              <div
                className="lemon--div__373c0__1mboc pseudoIsland__373c0__Fak5q"
                style={{ width: '315px' }}
              >
                <a
                  className="lemon--a__373c0__IEZFH link__373c0__1G70M link-color--blue-dark__373c0__85-Nu link-size--default__373c0__7tls6"
                  href="/map/choc-cookies-santa-clara-2"
                  target=""
                  name=""
                  rel=""
                  role="link"
                >
                  <div
                    className="lemon--div__373c0__1mboc container__373c0__2bHp0 border-color--default__373c0__3-ifU overflow--hidden__373c0__2y4YK"
                    style={{ width: '315px', height: '150px' }}
                  >
                    <img
                      className="lemon--img__373c0__3GQUb"
                      src="https://maps.googleapis.com/maps/api/staticmap?scale=1&amp;center=37.352959%2C-121.987099&amp;language=en&amp;zoom=15&amp;markers=scale%3A1%7Cicon%3Ahttps%3A%2F%2Fyelp-images.s3.amazonaws.com%2Fassets%2Fmap-markers%2Fannotation_32x43.png%7C37.352959%2C-121.987099&amp;client=gme-yelp&amp;sensor=false&amp;size=315x150&amp;signature=NC8kbqXLioETMUInMXxL0RNfN80="
                      srcSet="https://maps.googleapis.com/maps/api/staticmap?scale=1&amp;center=37.352959%2C-121.987099&amp;language=en&amp;zoom=15&amp;markers=scale%3A1%7Cicon%3Ahttps%3A%2F%2Fyelp-images.s3.amazonaws.com%2Fassets%2Fmap-markers%2Fannotation_32x43.png%7C37.352959%2C-121.987099&amp;client=gme-yelp&amp;sensor=false&amp;size=315x150&amp;signature=NC8kbqXLioETMUInMXxL0RNfN80= 1x, https://maps.googleapis.com/maps/api/staticmap?scale=2&amp;center=37.352959%2C-121.987099&amp;language=en&amp;zoom=15&amp;markers=scale%3A2%7Cicon%3Ahttps%3A%2F%2Fyelp-images.s3.amazonaws.com%2Fassets%2Fmap-markers%2Fannotation_64x86.png%7C37.352959%2C-121.987099&amp;client=gme-yelp&amp;sensor=false&amp;size=315x150&amp;signature=neBWfrE1uB8uY_XLP3_3RW00muk= 2x"
                      width="315"
                      height="150"
                      alt="Map"
                    />
                  </div>
                </a>
                <div className="lemon--div__373c0__1mboc padding-t2__373c0__11Iek padding-r2__373c0__28zpp padding-b2__373c0__34gV1 padding-l2__373c0__1Dr82 border-color--default__373c0__3-ifU">
                  <div className="lemon--div__373c0__1mboc arrange__373c0__2C9bH vertical-align-middle__373c0__1SDTo border-color--default__373c0__3-ifU">
                    <div className="lemon--div__373c0__1mboc arrange-unit__373c0__o3tjT arrange-unit-fill__373c0__3Sfw1 border-color--default__373c0__3-ifU">
                      <address className="lemon--address__373c0__2sPac">
                        <p className="lemon--p__373c0__3Qnnj text__373c0__2Kxyz text-color--normal__373c0__3xep9 text-align--left__373c0__2XGa- text-weight--bold__373c0__1elNz">
                          <span className="lemon--span__373c0__3997G raw__373c0__3rcx7">
                            1614 Pomeroy Ave
                          </span>
                        </p>
                        <p className="lemon--p__373c0__3Qnnj text__373c0__2Kxyz text-color--normal__373c0__3xep9 text-align--left__373c0__2XGa- text-weight--bold__373c0__1elNz">
                          <span className="lemon--span__373c0__3997G raw__373c0__3rcx7">
                            Santa Clara, CA 95051
                          </span>
                        </p>
                      </address>
                    </div>
                    <div className="lemon--div__373c0__1mboc arrange-unit__373c0__o3tjT border-color--default__373c0__3-ifU nowrap__373c0__35McF">
                      <a
                        className="lemon--a__373c0__IEZFH button__373c0__3lYgT small__373c0__Wsszq secondary__373c0__1bsQo"
                        // style="--mousedown-x:0px;--mousedown-y:0px;--button-width:0px"
                        href="/map/choc-cookies-santa-clara-2"
                      >
                        <div className="lemon--div__373c0__1mboc button-content__373c0__1QNtB border-color--default__373c0__3-ifU">
                          <span className="lemon--span__373c0__3997G text__373c0__2Kxyz button-content-text__373c0__Z-7FO text-color--inherit__373c0__1lczC text-align--center__373c0__3VrfZ text-weight--semibold__373c0__2l0fe text-size--small__373c0__3NVWO text--truncated__373c0__3sLaf">
                            Get directions
                          </span>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div
          className="lemon--div__373c0__1mboc border-color--default__373c0__3-ifU"
          style={{ position: 'relative', minHeight: '0px' }}
        >
          <section className="lemon--section__373c0__fNwDM margin-t4__373c0__1TRkQ padding-t4__373c0__3hVZ3 border--top__373c0__3gXLy border-color--default__373c0__3-ifU">
            <div className="lemon--div__373c0__1mboc arrange__373c0__2C9bH gutter-auto__373c0__1Ep_j vertical-align-middle__373c0__1SDTo margin-b3__373c0__q1DuY border-color--default__373c0__3-ifU">
              <div className="lemon--div__373c0__1mboc arrange-unit__373c0__o3tjT arrange-unit-fill__373c0__3Sfw1 border-color--default__373c0__3-ifU">
                <h4 className="lemon--h4__373c0__1yd__ heading--h4__373c0__27bDo heading--inline__373c0__10ozy">
                  Recommended Reviews
                </h4>
              </div>
            </div>
            <div className="lemon--div__373c0__1mboc css-79elbk border-color--default__373c0__3-ifU">
              <div className="lemon--div__373c0__1mboc border-color--default__373c0__3-ifU">
                {/**Reviews */}
                <ul className="lemon--ul__373c0__1_cxs undefined list__373c0__2G8oH">
                  {this.props.restaurantProfileStore.ReviewList.map((review) => (
                    <Review
                      key={review._id}
                      review={{ ...review, ReviewDate: new Date(review.ReviewDate) }}

                      //   }
                    />
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { customerInfo } = state.customerBasicInfoReducer;
  const { restaurantProfileStore } = state.searchedRestaurantReducer;
  return {
    customerInfo,
    restaurantProfileStore,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateSnackbarData: (payload) => {
      dispatch({
        type: updateSnackbarData,
        payload,
      });
    },
    updateSearchedRestaurant: (payload) => {
      dispatch({
        type: updateSearchedRestaurant,
        payload,
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RestaurantLeftReviewPart);

// export default RestaurantLeftReviewPart;
