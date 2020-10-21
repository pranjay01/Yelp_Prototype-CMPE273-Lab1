import React, { Component } from 'react';
import './CustomerNavBar.css';
import MenuBlock from './MenuBlock';
import '../Home/Home.css';
import LoginBlock from '../Home/LoginBlock';
import axios from 'axios';
import serverUrl from '../../../config';
import {
  updateSeprateStrings,
  updateSelectedFilter,
  updateSearchedString,
  updateSearchStrings,
} from '../../../constants/action-types';
import { connect } from 'react-redux';
import { history } from '../../../App';
import { Redirect } from 'react-router';
import SuggestedNames from '../Home/SuggestedNames';

class CustomerNavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurantSearched: false,
      SearchFilters: [
        { ID: 1, Value: 'Restaurant Name' },
        { ID: 2, Value: 'Food Items' },
        { ID: 3, Value: 'Cuisines' },
        { ID: 4, Value: 'Location' },
      ],
    };
  }
  componentDidMount() {
    const payload = { serchedString: '' };
    this.props.updateSearchedString(payload);
    axios
      .get(
        serverUrl + 'static/getSearchStrings',

        { withCredentials: true }
      )
      .then((response) => {
        let RestaurantNameStrings = response.data.NameLocation.map((restro) => {
          return restro.Name;
        });
        let LocationStrings = response.data.NameLocation.map((restro) => {
          return restro.location;
        });

        let FoodItemsStrings = response.data.FoodItemsStrings.map((food) => {
          return food.FoodName;
        });
        let CuisinesStrings = response.data.FoodItemsStrings.map((food) => {
          return food.Cuisine;
        });
        let payload = {
          RestaurantNameStrings: Array.from(new Set(RestaurantNameStrings)),
          FoodItemsStrings: Array.from(new Set(FoodItemsStrings)),
          CuisinesStrings: Array.from(new Set(CuisinesStrings)),
          LocationStrings: Array.from(new Set(LocationStrings)),
        };
        this.props.updateSeprateStrings(payload);
      });
  }

  onChangeselectedFilter = (event) => {
    localStorage.setItem('SearchFilter', event.target.value);
    let SearchStrings = [];
    switch (event.target.value) {
      case '1':
        SearchStrings = this.props.searchTabInfo.RestaurantNameStrings;
        break;
      case '2':
        SearchStrings = this.props.searchTabInfo.FoodItemsStrings;
        break;
      case '3':
        SearchStrings = this.props.searchTabInfo.CuisinesStrings;
        break;
      case '4':
        SearchStrings = this.props.searchTabInfo.LocationStrings;
        break;
    }

    const payload = { selectedFilter: event.target.value, SearchStrings };
    this.props.updateSelectedFilter(payload);
    // this.setState({
    //   selectedFilter: event.target.value,
    // });
  };

  onChangeStringSearchHanler = (event) => {
    localStorage.setItem('SearchedString', event.target.value);
    const payload = { serchedString: event.target.value };
    this.props.updateSearchedString(payload);
  };

  filterStrings = () => {
    return this.props.searchTabInfo.SearchStrings.filter((string) =>
      string.toLowerCase().includes(this.props.searchTabInfo.serchedString.toLowerCase())
    );
  };

  openRestroListPage = (string) => {
    localStorage.setItem('SearchedString', string);
    const payload = { serchedString: string };
    this.props.updateSearchedString(payload);
    history.push('/RestaurantList');
    this.setState({ restaurantSearched: true });
    // this.setState({
    //   openRestaurantList: true,
    // });
    //window.location.reload(false);
  };

  getRestaurants = (event) => {
    this.openRestroListPage(this.props.searchTabInfo.serchedString);
  };

  render() {
    // let redirectVar = null;
    // if (this.state.openRestaurantList) {
    //   redirectVar = <Redirect to="/RestaurantList" />;
    // }
    return (
      <div className="lemon--div__09f24__1mboc sticky-wrapper__09f24__3Aajw pageHeader__09f24__Ey1v7 border-color--default__09f24__R1nRO">
        {this.state.restaurantSearched ? <Redirect to="/RestaurantList" /> : null}
        <div className="lemon--div__09f24__1mboc consumer-header-container__09f24__2iDVS border--bottom__09f24__2FjZW border-color--default__09f24__R1nRO background-color--white__09f24__2jFAt">
          <div className="lemon--div__09f24__1mboc consumer-header__09f24__5vTsM border-color--default__09f24__R1nRO">
            <div className="lemon--div__09f24__1mboc arrange__09f24__AiSIM vertical-align-middle__09f24__zNCcM border-color--default__09f24__R1nRO">
              <div
                style={{ verticalAlign: 'middle' }}
                className="lemon--div__09f24__1mboc logo-arrange-unit__09f24__1sgq4 arrange-unit__09f24__1gZC1 border-color--default__09f24__R1nRO"
              >
                <div className="lemon--div__09f24__1mboc margin-r4__09f24__1VfYY margin-sm-r0__09f24__tjYlH border-color--default__09f24__R1nRO">
                  <div
                    className="lemon--div__09f24__1mboc logo__09f24__2iPWz logo-container__09f24__3Qmzx border-color--default__09f24__R1nRO"
                    id="logo"
                    data-analytics-label="logo"
                  >
                    <a
                      className="lemon--a__09f24__IEZFH link__09f24__1kwXV logo-link__09f24__270y- link-color--blue-dark__09f24__2DRa0 link-size--default__09f24__3xWLF"
                      href="/"
                      target=""
                      name=""
                      rel=""
                      role="link"
                    >
                      Yelp
                    </a>
                  </div>
                </div>
              </div>
              <div
                style={{
                  verticalAlign: 'middle',
                }}
                className="lemon--div__09f24__1mboc search-suggest-arrange-unit__09f24__3vLVY arrange-unit__09f24__1gZC1 arrange-unit-fill__09f24__O6JFU border-color--default__09f24__R1nRO"
              >
                <div className="lemon--div__09f24__1mboc search-suggest-container-outer__09f24__rSgmm border-color--default__09f24__R1nRO">
                  <div className="lemon--div__09f24__1mboc search-suggest-container-inner__09f24__2C9vZ border-color--default__09f24__R1nRO">
                    <div className="lemon--div__09f24__1mboc arrange__09f24__AiSIM gutter-2__09f24__UKBse border-color--default__09f24__R1nRO">
                      <div className="lemon--div__09f24__1mboc arrange-unit__09f24__1gZC1 arrange-unit-fill__09f24__O6JFU border-color--default__09f24__R1nRO">
                        <div className="lemon--div__09f24__1mboc search-suggest__09f24__1meTU">
                          <div className="lemon--div__09f24__1mboc">
                            <form
                              className="lemon--form__09f24__2fChY find-near-form__09f24__2y8Yy"
                              id="header_find_form"
                              role="search"
                            >
                              <div className="lemon--div__09f24__1mboc undefined arrange__09f24__AiSIM border-color--default__09f24__R1nRO">
                                <div className="lemon--div__09f24__1mboc arrange-unit__09f24__1gZC1 arrange-unit-fill__09f24__O6JFU border-color--default__09f24__R1nRO">
                                  <div
                                    style={{ display: 'flex' }}
                                    className="lemon--div__09f24__1mboc find-near-arrange__09f24__10iE- arrange__09f24__AiSIM layout-equal__09f24__iAZL_ border-color--default__09f24__R1nRO"
                                  >
                                    <div className="lemon--div__09f24__1mboc find-near-arrange-unit__09f24__2nUgJ arrange-unit__09f24__1gZC1 border-color--default__09f24__R1nRO">
                                      <label
                                        className="lemon--label__09f24__2BjWI label__09f24__23EB0 pseudo-input__09f24__3Kshf pseudo-input__09f24__14BtC pseudo-input--find-near__09f24__1gi9G pseudo-input--find__09f24__2RFJW"
                                        htmlFor="search_description"
                                      >
                                        <span className="lemon--span__09f24__3997G pseudo-input-text__09f24__34BOi display--inline__09f24__3iACj border-color--default__09f24__R1nRO">
                                          <div className="lemon--div__09f24__1mboc pseudo-input-icon-container__09f24__31kP9 margin-r1-5__09f24__3fQB8 border-color--default__09f24__R1nRO">
                                            <span
                                              aria-hidden="false"
                                              aria-label="Find"
                                              className="icon--24-search-v2 pseudo-input-icon__09f24__3Pmw2 css-1mpk29p"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                className="icon_svg"
                                              >
                                                <path d="M21.853 20.355l-3.444-3.443a9.428 9.428 0 10-16.761-6.171 9.428 9.428 0 0015.348 7.586l3.443 3.442a1 1 0 101.414-1.414zM5.82 16.245a7.429 7.429 0 115.253 2.175 7.38 7.38 0 01-5.253-2.176z"></path>
                                              </svg>
                                            </span>
                                          </div>
                                        </span>
                                        <div className="lemon--div__09f24__1mboc border-color--default__09f24__R1nRO overflow--hidden__09f24__3u-sw">
                                          <div className="lemon--div__09f24__1mboc typeahead__09f24__2mlJD border-color--default__09f24__R1nRO">
                                            <input
                                              style={{
                                                backgroundColor: '#fff',
                                                position: 'absolute',
                                                top: '0',
                                                right: '0',
                                                color: '#cfced5',
                                                fontSize: '16px',
                                                height: '22px',
                                                border: 'none',
                                                boxShadow: 'none',
                                                margin: '0',
                                                padding: '0',
                                              }}
                                              type="text"
                                              autoComplete="off"
                                              spellCheck="false"
                                              tabIndex="-1"
                                              // value=""
                                              aria-hidden="true"
                                              disabled=""
                                              className="input__09f24__30UUZ input__09f24__1XNzA hidden-input__09f24__3e1WX"
                                              placeholder=" "
                                            />
                                            <input
                                              disabled={
                                                this.props.searchTabInfo.selectedFilter ===
                                                '-Select-'
                                              }
                                              onChange={this.onChangeStringSearchHanler}
                                              type="text"
                                              value={this.props.searchTabInfo.serchedString}
                                              autoComplete="off"
                                              aria-autocomplete="list"
                                              tabIndex="0"
                                              name="find_desc"
                                              data-testid="suggest-desc-input"
                                              id="search_description"
                                              className="input__09f24__30UUZ input__09f24__1XNzA original-input__09f24__fFh2n"
                                              placeholder="tacos, cheap dinner, Max’s"
                                            />
                                          </div>
                                        </div>
                                      </label>
                                    </div>
                                    <div
                                      style={{ display: 'block' }}
                                      className="lemon--div__09f24__1mboc responsive-gutter__09f24__giwcv location-arrange-unit__09f24__3JbAh find-near-arrange-unit__09f24__2nUgJ arrange-unit__09f24__1gZC1 layout-stack-gutter-1-5__09f24__q24D3 margin-sm-t1-5__09f24__23UyF border-color--default__09f24__R1nRO"
                                    >
                                      <label
                                        className="lemon--label__09f24__2BjWI label__09f24__23EB0 pseudo-input__09f24__3Kshf pseudo-input__09f24__14BtC pseudo-input--find-near__09f24__1gi9G pseudo-input--near__09f24__1SB0F"
                                        htmlFor="search_location"
                                      >
                                        <span className="lemon--span__09f24__3997G pseudo-input-text__09f24__34BOi display--inline__09f24__3iACj border-color--default__09f24__R1nRO">
                                          <div className="lemon--div__09f24__1mboc pseudo-input-icon-container__09f24__31kP9 margin-r1-5__09f24__3fQB8 border-color--default__09f24__R1nRO">
                                            <span
                                              aria-hidden="false"
                                              aria-label="Near"
                                              className="icon--24-marker-v2 pseudo-input-icon__09f24__3Pmw2 css-1mpk29p"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                className="icon_svg"
                                              >
                                                <path d="M12 1.039a9.25 9.25 0 016.54 15.791l-5.83 5.84A1 1 0 0112 23a1 1 0 01-.71-.29l-5.83-5.88A9.25 9.25 0 0112 1.039zm0 2.011a7.25 7.25 0 00-5.13 12.37L12 20.54l5.13-5.12A7.25 7.25 0 0012 3.05zm0 3.2a4 4 0 110 8 4 4 0 010-8zm0 2a2 2 0 100 4 2 2 0 000-4z"></path>
                                              </svg>
                                            </span>
                                          </div>
                                        </span>
                                        <div className="lemon--div__09f24__1mboc border-color--default__09f24__R1nRO overflow--hidden__09f24__3u-sw">
                                          <div className="lemon--div__09f24__1mboc typeahead__09f24__2mlJD border-color--default__09f24__R1nRO">
                                            <input
                                              style={{
                                                backgroundColor: '#fff',
                                                position: 'absolute',
                                                top: '0',
                                                right: '0',
                                                color: '#cfced5',
                                                fontSize: '16px',
                                                height: '22px',
                                                border: 'none',
                                                boxShadow: 'none',
                                                margin: '0',
                                                padding: '0',
                                              }}
                                              type="text"
                                              autoComplete="off"
                                              spellCheck="false"
                                              tabIndex="-1"
                                              // value=""
                                              aria-hidden="true"
                                              disabled=""
                                              className="input__09f24__30UUZ input__09f24__1XNzA hidden-input__09f24__3e1WX"
                                              placeholder=" "
                                            />
                                            <select
                                              style={{
                                                width: '104%',
                                                position: 'inherit',
                                                fontWeight: '700',
                                                color: '#666',
                                              }}
                                              placeholder="searchFilter"
                                              className="form-control"
                                              onChange={this.onChangeselectedFilter}
                                              value={this.props.searchTabInfo.selectedFilter}
                                              required
                                            >
                                              <option
                                                className="Dropdown-menu"
                                                key=""
                                                value={null}
                                                style={{
                                                  fontWeight: '700',
                                                  color: '#666',
                                                }}
                                              >
                                                -Select-
                                              </option>
                                              {this.state.SearchFilters.map((searchFilter) => (
                                                <option
                                                  style={{
                                                    fontWeight: '700',
                                                    color: '#666',
                                                  }}
                                                  className="Dropdown-menu"
                                                  key={searchFilter.ID}
                                                  value={searchFilter.ID}
                                                >
                                                  {searchFilter.Value}
                                                </option>
                                              ))}
                                            </select>
                                          </div>
                                          <input
                                            type="hidden"
                                            name="find_loc"
                                            value="San Jose, CA"
                                          />
                                        </div>
                                      </label>
                                    </div>
                                  </div>
                                </div>
                                <div className="lemon--div__09f24__1mboc buttons-arrange-unit__09f24__zksuB arrange-unit__09f24__1gZC1 border-color--default__09f24__R1nRO">
                                  <div
                                    style={{ display: 'flex' }}
                                    className="lemon--div__09f24__1mboc arrange__09f24__AiSIM gutter-6__09f24__fMli3 layout-equal__09f24__iAZL_ border-color--default__09f24__R1nRO"
                                  >
                                    <div className="lemon--div__09f24__1mboc hidden-non-responsive-inline-block responsive-visible-small-inline-block arrange-unit__09f24__1gZC1 border-color--default__09f24__R1nRO">
                                      <a
                                        className="lemon--a__09f24__IEZFH button__09f24__1hAjX secondary__09f24__3mm8J find-near-button__09f24__UO8nW"
                                        data-testid="responsive-suggest-submit"
                                        style={{
                                          mousedownX: '0px',
                                          mousedownY: '0px',
                                          buttonWidth: '0px',
                                          borderRadius: '0 4px 4px 0',
                                          padding: '12px 16px',
                                          textAlign: 'center',
                                          userSelect: 'none',
                                        }}
                                        href="#"
                                      >
                                        <div className="lemon--div__09f24__1mboc button-content__09f24__2SF6G border-color--default__09f24__R1nRO">
                                          <span
                                            style={{
                                              fontWeight: '600',
                                              fontSize: '16px',
                                              lineHeight: '22px',
                                            }}
                                            className="lemon--span__09f24__3997G text__09f24__2tZKC button-content-text__09f24__3OonI text-color--inherit__09f24__1jgBv text-align--center__09f24__3NO89 text-weight--semibold__09f24__MTlNc text-size--large__09f24__3-9KJ text--truncated__09f24__2NCmr"
                                          >
                                            Cancel
                                          </span>
                                        </div>
                                      </a>
                                    </div>
                                    <div
                                      style={{
                                        display: 'block',
                                        boxSizing: ' border-box',
                                        verticalAlign: 'top',
                                      }}
                                      className="lemon--div__09f24__1mboc arrange-unit__09f24__1gZC1 border-color--default__09f24__R1nRO"
                                    >
                                      <button
                                        className="button__09f24__1hAjX primary__09f24__LBFK2 find-near-button__09f24__UO8nW"
                                        data-testid="suggest-submit"
                                        style={{
                                          borderRadius: '0 4px 4px 0',
                                          display: 'block',
                                          padding: '12px 16px',
                                          height: '48px',
                                          border: 'none',
                                          userSelect: 'none',
                                          mousedownX: '0px',
                                          mousedownY: '0px',
                                          buttonWidth: '0px',
                                        }}
                                        type="submit"
                                        value="submit"
                                      >
                                        <div className="lemon--div__09f24__1mboc button-content__09f24__2SF6G border-color--default__09f24__R1nRO">
                                          <span className="lemon--span__09f24__3997G text__09f24__2tZKC button-content-text__09f24__3OonI text-color--inherit__09f24__1jgBv text-align--center__09f24__3NO89 text-weight--semibold__09f24__MTlNc text-size--large__09f24__3-9KJ text--truncated__09f24__2NCmr">
                                            <span
                                              aria-hidden="false"
                                              aria-label="Search"
                                              className="icon--24-search-v2 css-12anxc3"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                className="icon_svg"
                                              >
                                                <path d="M21.853 20.355l-3.444-3.443a9.428 9.428 0 10-16.761-6.171 9.428 9.428 0 0015.348 7.586l3.443 3.442a1 1 0 101.414-1.414zM5.82 16.245a7.429 7.429 0 115.253 2.175 7.38 7.38 0 01-5.253-2.176z"></path>
                                              </svg>
                                            </span>
                                          </span>
                                        </div>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </form>
                          </div>
                          <div
                            className={`main-search_suggestions suggestions-list-container search-suggestions-list-container ${
                              this.props.searchTabInfo.serchedString.length === 0 ? 'hidden' : ''
                            }`}
                          >
                            <SuggestedNames
                              openRestroListPage={(string) => this.openRestroListPage(string)}
                              searchStrings={this.filterStrings()}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                style={{ verticalAlign: 'middle' }}
                className="lemon--div__09f24__1mboc hide-below-a__09f24__ndhoV arrange-unit__09f24__1gZC1 border-color--default__09f24__R1nRO nowrap__09f24__26e9i"
              >
                <span className="lemon--span__09f24__3997G display--inline__09f24__3iACj margin-r1__09f24__BCulR padding-r1__09f24__23Vay border-color--default__09f24__R1nRO">
                  <a
                    className="lemon--a__09f24__IEZFH header-link__09f24__3OkYO"
                    href="/writeareview"
                  >
                    <div className="lemon--div__09f24__1mboc padding-t1__09f24__2GVpG padding-r1__09f24__23Vay padding-b1__09f24__1d8yO padding-l1__09f24__aqYTU border-color--default__09f24__R1nRO">
                      <div className="lemon--div__09f24__1mboc notification-wrapper__09f24__3YKGg display--inline-block__09f24__FsgS4 border-color--default__09f24__R1nRO">
                        <p
                          style={{ fontWeight: '600' }}
                          className="lemon--p__09f24__3Qnnj text__09f24__2tZKC text-color--normal__09f24__3oebo text-align--left__09f24__3Drs0 text-weight--semibold__09f24__MTlNc"
                        >
                          Write a Review
                        </p>
                      </div>
                    </div>
                  </a>
                </span>
              </div>
              {/*<MenuBlock />*/}
              {localStorage.getItem('token') && localStorage.getItem('userrole') === 'Customer' ? (
                <MenuBlock />
              ) : (
                <LoginBlock />
              )}
              <div className="lemon--div__09f24__1mboc auth-arrange-unit__09f24__1ndPl arrange-unit__09f24__1gZC1 border-color--default__09f24__R1nRO nowrap__09f24__26e9i"></div>
            </div>
            <div className="lemon--div__09f24__1mboc header-nav-container__09f24__1M4qU header-nav-mobile-form-closed__09f24__2ItVv border-color--default__09f24__R1nRO nowrap__09f24__26e9i">
              <div className="lemon--div__09f24__1mboc header-nav__09f24__1Lxpg border-color--default__09f24__R1nRO">
                <div className="lemon--div__09f24__1mboc header-nav_unit header-nav_unit__09f24__1cIH8 undefined display--inline-block__09f24__FsgS4 border-color--default__09f24__R1nRO">
                  <div
                    className="lemon--div__09f24__1mboc header-link__09f24__2PuTL border-color--default__09f24__R1nRO"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <a
                      className="lemon--a__09f24__IEZFH header-link_anchor__09f24__2I27Q"
                      href="/search?cflt=restaurants&amp;find_loc=San%20Jose%2C%20CA"
                      tabIndex="0"
                    >
                      <span className="lemon--span__09f24__3997G text__09f24__2tZKC text-color--normal__09f24__3oebo text-align--left__09f24__3Drs0">
                        Restaurants
                      </span>
                      <span className="lemon--span__09f24__3997G display--inline__09f24__3iACj padding-l1__09f24__aqYTU border-color--default__09f24__R1nRO">
                        <span aria-hidden="true" className="icon--24-chevron-down-v2 css-1mpk29p">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            className="icon_svg"
                          >
                            <path d="M12 15.25a1 1 0 01-.7-.29l-4.58-4.5A1.011 1.011 0 018.12 9L12 12.85 15.88 9a1 1 0 111.4 1.42L12.7 15a1 1 0 01-.7.25z"></path>
                          </svg>
                        </span>
                      </span>
                    </a>
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

// export default CustomerNavBar;

const mapStateToProps = (state) => {
  const { searchTabInfo } = state.searchTabReducer;
  return {
    searchTabInfo: searchTabInfo,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateSeprateStrings: (payload) => {
      dispatch({
        type: updateSeprateStrings,
        payload,
      });
    },
    updateSelectedFilter: (payload) => {
      dispatch({
        type: updateSelectedFilter,
        payload,
      });
    },
    updateSearchedString: (payload) => {
      dispatch({
        type: updateSearchedString,
        payload,
      });
    },
    updateSearchStrings: (payload) => {
      dispatch({
        type: updateSearchStrings,
        payload,
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomerNavBar);
