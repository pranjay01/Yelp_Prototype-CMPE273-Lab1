import React, { Component } from 'react';
import CustomerNavBar from '../CommonArea/CustomerNavBar';
import './Restaurant.css';
import Restaurant from './Restaurant';
import axios from 'axios';
import serverUrl from '../../../config';
import { updateRestaurantArray } from '../../../constants/action-types';
import { history } from '../../../App';
// import { Map, GoogleApiWrapper } from 'google-maps-react';
import { connect } from 'react-redux';
import MapContainer from './MapContainer';

class RestaurantList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markers: [],
      //locations=[['Mac Donalds','37.323250','-121.913260'],['Applebee Grill + Bar','37.302750','-121.863210'],['Bibos Ny Pizza','37.306690','-121.890690'],],
      BackupRestaurantsList: [],
      filterMode: 'Both',
    };
  }
  // localStorage.setItem('SearchedString', '');
  // localStorage.setItem('SearchFilter', '');
  componentDidMount() {
    console.log('inside Signup');
    axios
      .get(serverUrl + 'static/fetchRestaurantResults', {
        params: {
          filter: localStorage.getItem('SearchFilter'),
          searchString: localStorage.getItem('SearchedString'),
        },
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
        let markers = response.data[0].map((restaurant) => {
          //markers.concat({ lat: restaurant.lat, lng: restaurant.lng });
          return {
            title: restaurant.Name,
            position: { lat: restaurant.lat, lng: restaurant.lng },
          };
        });
        let allRestaurants = response.data[0].map((restaurant) => {
          //markers.concat({ lat: restaurant.lat, lng: restaurant.lng });
          return {
            ID: restaurant.ID,
            Name: restaurant.Name,
            DineIn: restaurant.DineIn,
            YelpDelivery: restaurant.YelpDelivery,
            CurbsidePickup: restaurant.CurbsidePickup,
            AvgRating: restaurant.AvgRating,
            ReviewCounts: restaurant.ReviewCounts,
            ImageUrl: restaurant.ImageUrl,
            OpeningTime: restaurant.OpeningTime,
            ClosingTime: restaurant.ClosingTime,
          };
        });

        this.setState({
          markers,
          BackupRestaurantsList: allRestaurants,
        });
        const payload = { restaurantSearchResults: allRestaurants };
        this.props.updateRestaurantArray(payload);

        // let locations = [
        //   ['Los Angeles', 34.052235, -118.243683],
        //   ['Santa Monica', 34.024212, -118.496475],
        //   ['Redondo Beach', 33.849182, -118.388405],
        //   ['Newport Beach', 33.628342, -117.927933],
        //   ['Long Beach', 33.77005, -118.193739],
        // ];
        // let infowindow = new google.maps.InfoWindow({});
        // let marker, count;
        // for (count = 0; count < locations.length; count++) {
        //   marker = new google.maps.Marker({
        //     position: new google.maps.LatLng(locations[count][1], locations[count][2]),
        //     map: map,
        //     title: locations[count][0],
        //   });
        //   google.maps.event.addListener(
        //     marker,
        //     'click',
        //     (function (marker, count) {
        //       return function () {
        //         infowindow.setContent(locations[count][0]);
        //         infowindow.open(map, marker);
        //       };
        //     })(marker, count)
        //   );
        // }
      });

    this.setState({
      authFlag: false,
    });
  }
  filterDeliverMode = (filterMode) => {
    let filterResult = [];
    if (filterMode === 'Both') {
      const payload = { restaurantSearchResults: this.state.BackupRestaurantsList };
      this.props.updateRestaurantArray(payload);
    } else if (filterMode === 'CurbsidePickup') {
      filterResult = this.state.BackupRestaurantsList.filter(
        (restaurant) => restaurant.CurbsidePickup === 1
      );
      const payload = { restaurantSearchResults: filterResult };
      this.props.updateRestaurantArray(payload);
    } else {
      filterResult = this.state.BackupRestaurantsList.filter(
        (restaurant) => restaurant.YelpDelivery === 1
      );
      const payload = { restaurantSearchResults: filterResult };
      this.props.updateRestaurantArray(payload);
    }
    this.setState({ filterMode });
    return this.props.searchTabInfo.SearchStrings.filter((string) =>
      string.toLowerCase().includes(this.props.searchTabInfo.serchedString.toLowerCase())
    );
  };

  openRestaurantPage = (ID) => {
    localStorage.setItem('restaurantPageID', ID);
    history.push('/RestaurantPage');
    window.location.reload(false);
  };

  render() {
    let redirectVar = null;
    return (
      <div>
        {' '}
        {<CustomerNavBar />}
        <div className="lemon--div__09f24__1mboc spinnerContainer__09f24__2XcuX border-color--default__09f24__R1nRO background-color--white__09f24__2jFAt">
          <div className="lemon--div__09f24__1mboc mainContentContainer__09f24__1mGmV border-color--default__09f24__R1nRO">
            <div className="lemon--div__09f24__1mboc leftRailContainer__09f24__3fttY border-color--default__09f24__R1nRO">
              <div className="lemon--div__09f24__1mboc leftRailMainContent__09f24__1ncfZ padding-r5__09f24__hWLOF padding-b5__09f24__28TLK padding-l5__09f24__3g2Ty border-color--default__09f24__R1nRO">
                <div className="lemon--div__09f24__1mboc leftRailSearchResultsContainer__09f24__3vlwA border-color--default__09f24__R1nRO">
                  <div class="lemon--div__09f24__1mboc margin-b3__09f24__1DQ9x padding-t3__09f24__-R_5x border-color--default__09f24__R1nRO">
                    <div class="lemon--div__09f24__1mboc margin-t3__09f24__5bM2Z border-color--default__09f24__R1nRO">
                      <div class="lemon--div__09f24__1mboc suggestedFilterContainer__09f24__zCmtm border-color--default__09f24__R1nRO">
                        <span
                          class="lemon--span__09f24__3997G filterToggleBar__09f24__1srmg display--inline__09f24__3iACj border-color--default__09f24__R1nRO"
                          role="group"
                          aria-label="filters"
                        >
                          <button
                            onClick={() => {
                              this.filterDeliverMode('Both');
                            }}
                            class="filterToggle__09f24__40Unn leftRounded__09f24__2FatH rightRounded__09f24__2jT2w "
                            aria-disabled="false"
                            aria-pressed="false"
                            type="button"
                            style={{
                              cursor: 'pointer',
                              background: `${
                                this.state.filterMode === 'Both' ? '#00000040' : 'white'
                              }`,
                            }}
                          >
                            <span class="lemon--span__09f24__3997G text-wrapper__09f24__3oqzN display--inline__09f24__3iACj border-color--default__09f24__R1nRO">
                              <span class="lemon--span__09f24__3997G text__09f24__2tZKC text-color--normal__09f24__3oebo text-align--left__09f24__3Drs0 text-weight--semibold__09f24__MTlNc text-size--small__09f24__1Z_UI">
                                All
                              </span>
                            </span>
                          </button>
                          <div class="lemon--div__09f24__1mboc tooltipContainer__09f24__1eDCf display--inline-block__09f24__FsgS4 border-color--default__09f24__R1nRO">
                            <button
                              onClick={() => {
                                this.filterDeliverMode('CurbsidePickup');
                              }}
                              style={{
                                cursor: 'pointer',
                                background: `${
                                  this.state.filterMode === 'CurbsidePickup' ? '#00000040' : 'white'
                                }`,
                              }}
                              class="filterToggle__09f24__40Unn leftRounded__09f24__2FatH rightRounded__09f24__2jT2w"
                              aria-disabled="false"
                              aria-pressed="false"
                              type="button"
                            >
                              <span class="lemon--span__09f24__3997G text-wrapper__09f24__3oqzN display--inline__09f24__3iACj border-color--default__09f24__R1nRO">
                                <span class="lemon--span__09f24__3997G text__09f24__2tZKC text-color--normal__09f24__3oebo text-align--left__09f24__3Drs0 text-weight--semibold__09f24__MTlNc text-size--small__09f24__1Z_UI">
                                  Curbside Pickup
                                </span>
                              </span>
                            </button>
                          </div>
                          <div
                            style={{ cursor: 'pointer' }}
                            class="lemon--div__09f24__1mboc tooltipContainer__09f24__1eDCf display--inline-block__09f24__FsgS4 border-color--default__09f24__R1nRO"
                          >
                            <button
                              style={{
                                cursor: 'pointer',
                                background: `${
                                  this.state.filterMode === 'yelpDelivery' ? '#00000040' : 'white'
                                }`,
                              }}
                              onClick={() => {
                                this.filterDeliverMode('yelpDelivery');
                              }}
                              class="filterToggle__09f24__40Unn leftRounded__09f24__2FatH rightRounded__09f24__2jT2w"
                              aria-disabled="false"
                              aria-pressed="false"
                              type="button"
                            >
                              <span class="lemon--span__09f24__3997G text-wrapper__09f24__3oqzN display--inline__09f24__3iACj border-color--default__09f24__R1nRO">
                                <span class="lemon--span__09f24__3997G text__09f24__2tZKC text-color--normal__09f24__3oebo text-align--left__09f24__3Drs0 text-weight--semibold__09f24__MTlNc text-size--small__09f24__1Z_UI">
                                  Yelp Delivery
                                </span>
                              </span>
                            </button>
                          </div>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="lemon--div__09f24__1mboc border-color--default__09f24__R1nRO">
                    <ul className="lemon--ul__09f24__1_cxs undefined list__09f24__17TsU">
                      {/**From CHild COmponent */}
                      {this.props.restaurantArray.restaurantSearchResults.map((restaurant) => (
                        <Restaurant
                          restaurant={restaurant}
                          openRestaurantPage={() => {
                            this.openRestaurantPage(restaurant.ID);
                          }}

                          //   }
                        />
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/**Google Maps */}
            <div className="lemon--div__09f24__1mboc rightRailContainer__09f24__3VshM border-color--default__09f24__R1nRO">
              <div className="lemon--div__09f24__1mboc rightRailInnerContainer__09f24__1eXhz border-color--default__09f24__R1nRO">
                <div
                  style={{ top: '133px', height: 'calc(100vh - 133px)', marginTop: '36px' }}
                  className="lemon--div__09f24__1mboc stickyContainer__09f24__1IR-t border-color--default__09f24__R1nRO"
                >
                  <div className="lemon--div__09f24__1mboc container__09f24__11Ola border-color--default__09f24__R1nRO">
                    <div className="lemon--div__09f24__1mboc outer__09f24__2nI2R border-color--default__09f24__R1nRO">
                      <MapContainer markers={this.state.markers}></MapContainer>
                    </div>
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

// export default RestaurantList;

const mapStateToProps = (state) => {
  const { searchTabInfo } = state.searchTabReducer;
  const { restaurantArray } = state.restaurantSearchResultReducer;
  return {
    searchTabInfo: searchTabInfo,
    restaurantArray: restaurantArray,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateRestaurantArray: (payload) => {
      dispatch({
        type: updateRestaurantArray,
        payload,
      });
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(RestaurantList);
