import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import CustomerNavBar from '../CommonArea/CustomerNavBar';
import { Redirect } from 'react-router';
import LeftPannel from '../LeftPannel/LeftPannel';
import GreyArea from '../CommonArea/GreyArea';
import EventForCustomer from './EventForCustomer';
import axios from 'axios';
import serverUrl from '../../../config';
import {
  updateSnackbarData,
  updateEventStoreForCustomer,
  updateLeftPannelHighlight,
  getCustomerBasicInfo,
} from '../../../constants/action-types';
import { connect } from 'react-redux';
import moment from 'moment';
import ReactPaginate from 'react-paginate';

class Events extends Component {
  constructor(props) {
    super(props);
    this.state = { searchString: '' };
  }

  commonFetch(sortValue = 'upcoming', selectedPage = 0, sortOrder = 1) {
    axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    axios
      .get(
        serverUrl + 'customer/getEventList',

        {
          params: {
            sortValue,
            selectedPage,
            sortOrder,
            CustomerID: localStorage.getItem('userId'),
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log(response.data);
        let allEvents = response.data.EventList.map((event) => {
          let EventDate = moment.utc(event.EventDate);
          return {
            ...event,
            EventDate: EventDate.format('LL'),
          };
        });

        const payload = {
          EventList: allEvents,
          eventCount: response.data.eventCount,
          PageCount: Math.ceil(response.data.eventCount / 3),
          sortValue,
          selectedPage,
          sortOrder,
        };
        this.props.updateEventStoreForCustomer(payload);
        // this.setState({
        //   EVENTS: allEvents,
        // });
      });
  }

  handlePageClick = (e) => {
    this.commonFetch(this.props.eventStore.sortValue, e.selected, this.props.eventStore.sortOrder);
  };

  componentDidMount() {
    let payload = {
      profileIsActive: false,
      eventsTabIsActive: true,
      ordersTabIsActive: false,
      followingTabIsActive: false,
      messageTabIsActive: false,
    };
    this.props.updateLeftPannelHighlight(payload);
    this.commonFetch();
  }

  setOrder(e, sortOrder) {
    e.preventDefault();
    this.commonFetch(this.props.eventStore.sortValue, 0, sortOrder);
  }

  getEventList(e, sortValue) {
    e.preventDefault();
    this.commonFetch(sortValue, 0, this.props.eventStore.sortOrder);
  }
  registerForEvent = (eventId) => {
    const data = {
      eventId,
      RegisteredCustomer: {
        CustomerName:
          this.props.customerInfo.customerProfile.FirstName +
          ' ' +
          this.props.customerInfo.customerProfile.LastName,
        CustomerID: this.props.customerInfo.customerProfile.CustomerID,
        Email: this.props.customerInfo.customerProfile.Email,
      },
    };
    axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    axios.post(serverUrl + 'customer/registerForEvent', data).then(
      (response) => {
        console.log('Status Code : ', response.status);
        if (response.status === 200) {
          let payload = {
            success: true,
            message: 'Registeration Successfull!',
          };
          this.props.updateSnackbarData(payload);
          let customerProfile = this.props.customerInfo.customerProfile;
          let RegisteredEvents = customerProfile.RegisteredEvents;
          customerProfile.RegisteredEvents = RegisteredEvents;
          RegisteredEvents.push(eventId);
          let payload2 = { customerProfile };
          this.props.getCustomerBasicInfo(payload2);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };

  onChangeSearchStringHandler = (event) => {
    this.setState({
      searchString: event.target.value,
    });
  };

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
        {/*this.props.snackbarData != null && <SnackBar />*/}
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
                  <nav className="navbar navbar-inverse">
                    <div className="container-fluid">
                      <div className="navbar-header">
                        <a className="navbar-brand">Events</a>
                      </div>
                      <ul className="nav navbar-nav">
                        <li
                          className={this.props.eventStore.sortValue === 'upcoming' ? 'active' : ''}
                        >
                          <Link to="/#" onClick={(event) => this.getEventList(event, 'upcoming')}>
                            Upcoming Events
                          </Link>
                        </li>
                        <li
                          className={
                            this.props.eventStore.sortValue === 'registered' ? 'active' : ''
                          }
                        >
                          <Link to="/#" onClick={(event) => this.getEventList(event, 'registered')}>
                            Registered Events
                          </Link>
                        </li>
                        <li
                          style={{ width: '136px' }}
                          className={
                            this.props.eventStore.sortValue !== 'registered' &&
                            this.props.eventStore.sortValue !== 'upcoming' &&
                            'active'
                          }
                        >
                          <input
                            style={{ marginTop: '14px', width: '130px' }}
                            type="text"
                            value={this.state.searchString}
                            onChange={this.onChangeSearchStringHandler}
                          ></input>
                        </li>
                        <li
                          className={
                            this.props.eventStore.sortValue === 'registered' ? 'active' : ''
                          }
                        >
                          <button
                            style={{ marginTop: '14px' }}
                            onClick={(event) => this.getEventList(event, this.state.searchString)}
                          >
                            Search
                          </button>
                        </li>
                        <li className={this.props.eventStore.sortOrder === 1 ? 'active' : ''}>
                          <Link to="/#" onClick={(event) => this.setOrder(event, 1)}>
                            Asc
                          </Link>
                        </li>
                        <li className={this.props.eventStore.sortOrder === -1 ? 'active' : ''}>
                          <Link to="/#" onClick={(event) => this.setOrder(event, -1)}>
                            Dsc
                          </Link>
                        </li>
                      </ul>

                      {/*navLogin*/}
                    </div>
                  </nav>
                  <div>
                    <ul className="lemon--ul__373c0__1_cxs undefined list__373c0__2G8oH">
                      {this.props.eventStore.EventList.map((event) => (
                        <EventForCustomer
                          key={event._id}
                          event={event}
                          // registeredEventIds={this.state.registeredEventIds}
                          registerForEvent={() => {
                            this.registerForEvent(event._id);
                          }}
                          //openRegisteredCustomers={() => this.openRegisteredCustomers(event.ID)}
                          //onSave={() => this.updateStatus(event.ID)}

                          //   }
                        />
                      ))}
                    </ul>
                    <div style={{ position: 'relative', left: '25%', bottom: '3%', right: '0' }}>
                      <ReactPaginate
                        previousLabel={'prev'}
                        nextLabel={'next'}
                        breakLabel={'...'}
                        breakClassName={'break-me'}
                        pageCount={this.props.eventStore.PageCount}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={2}
                        onPageChange={this.handlePageClick}
                        containerClassName={'pagination'}
                        subContainerClassName={'pages pagination'}
                        activeClassName={'active'}
                        forcePage={this.props.eventStore.selectedPage}
                      />
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

// export default Events;
// export default EventList;
const mapStateToProps = (state) => {
  const { eventStore } = state.customerEventReducer;
  const { customerInfo } = state.customerBasicInfoReducer;

  return {
    eventStore,
    customerInfo,
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
    updateEventStoreForCustomer: (payload) => {
      dispatch({
        type: updateEventStoreForCustomer,
        payload,
      });
    },
    updateLeftPannelHighlight: (payload) => {
      dispatch({
        type: updateLeftPannelHighlight,
        payload,
      });
    },
    getCustomerBasicInfo: (payload) => {
      dispatch({
        type: getCustomerBasicInfo,
        payload,
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Events);
