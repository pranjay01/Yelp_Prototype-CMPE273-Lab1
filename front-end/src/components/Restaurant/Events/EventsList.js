import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Event from './Event';
import '../Orders/Orders.css';
import axios from 'axios';
import serverUrl from '../../../config';
import NewEventForm from './NewEventForm';
import RegisteredCustomers from './RegisteredCustomers';
import {
  updateSnackbarData,
  updateEventStore,
  updateRegistrationStore,
} from '../../../constants/action-types';
import { connect } from 'react-redux';
import ReactPaginate from 'react-paginate';

class EventList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      formOpen: false,
    };
  }

  commonFetch(sortValue = 'upcoming', selectedPage = 0) {
    axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    axios
      .get(
        serverUrl + 'biz/getEventList',

        {
          params: {
            sortValue,
            RestaurantID: localStorage.getItem('userId'),
            selectedPage,
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log(response.data);
        let EventList = response.data.EventList.map((event) => {
          return {
            ...event,
          };
        });

        let payload = {
          EventList,
          eventCount: response.data.eventCount,
          PageCount: Math.ceil(response.data.eventCount / 3),
          sortValue,
          selectedPage,
        };
        this.props.updateEventStore(payload);
      });
  }

  commonRegisteredUserFetch(EventId, RegistrationPage = 0) {
    axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    axios
      .get(
        serverUrl + 'biz/getCustomerList',

        {
          params: {
            _id: EventId,
            RestaurantID: localStorage.getItem('userId'),
            RegistrationPage,
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log(response.data);
        let RegisteredCustomers = response.data.RegisteredCustomers;

        let payload = {
          RegisteredCustomers,
          registeredCustomerCount: response.data.registeredCustomerCount,
          RegistrationPageCount: Math.ceil(response.data.registeredCustomerCount / 8),
          popSeen: true,
          EventId,
        };
        this.props.updateRegistrationStore(payload);
      });
  }

  // get events based on the filter
  getEventList(e, sortValue = 'upcoming') {
    e.preventDefault();
    this.commonFetch(sortValue, 0);
  }

  componentDidMount() {
    this.commonFetch();
  }

  handlePageClick = (e) => {
    this.commonFetch(this.props.eventStore.sortValue, e.selected);
  };

  handlePageClickRegisteredCustomers = (e) => {
    this.commonRegisteredUserFetch(this.props.registrationStore.EventId, e.selected);
  };
  // open form to create new event
  openNewForm = () => {
    this.setState({
      formOpen: !this.state.formOpen,
    });
  };

  openRegisteredCustomers = (eventID) => {
    if (this.props.registrationStore.popSeen) {
      let payload = {
        RegisteredCustomers: [],
        popSeen: !this.props.registrationStore.popSeen,
      };
      this.props.updateRegistrationStore(payload);
    } else {
      this.commonRegisteredUserFetch(eventID);
    }
  };

  createNewEvent = (e, eventInfo) => {
    e.preventDefault();

    axios.defaults.withCredentials = true;
    //make a post request with the user data
    axios.post(serverUrl + 'biz/createNewEvent', eventInfo).then(
      (response) => {
        console.log('Status Code : ', response.status);
        if (response.status === 201) {
          console.log(response.data);
          let payload = {
            success: true,
            message: 'Event Created Successfully!',
          };
          this.props.updateSnackbarData(payload);
          this.commonFetch(this.props.eventStore.sortValue, this.props.eventStore.selectedPage);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };

  fetchCustomerProfile = (e, CustomerID) => {
    console.log('getting customer id', CustomerID);
  };

  render() {
    return (
      <div>
        {/*redirectVar*/}

        <nav className="navbar navbar-inverse">
          <div className="container-fluid">
            <div className="navbar-header">
              <a className="navbar-brand">Events</a>
            </div>
            <ul className="nav navbar-nav">
              <li className={this.props.eventStore.sortValue === 'upcoming' ? 'active' : undefined}>
                <Link to="/#" onClick={(event) => this.getEventList(event, 'upcoming')}>
                  Upcoming Events
                </Link>
              </li>
              <li className={this.props.eventStore.sortValue === 'past' ? 'active' : undefined}>
                <Link to="/#" onClick={(event) => this.getEventList(event, 'past')}>
                  Expired Events
                </Link>
              </li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li>
                <Link to="#" onClick={this.openNewForm}>
                  Create Event
                </Link>
              </li>
            </ul>
            {/*navLogin*/}
          </div>
        </nav>
        {this.props.registrationStore.popSeen ? (
          <RegisteredCustomers
            // RegisteredCustomerList={this.state.RegisteredCustomerList}
            handlePageClickRegisteredCustomers={this.handlePageClickRegisteredCustomers}
            toggle={this.openRegisteredCustomers}
            fetchCustomerProfile={(event, id) => this.fetchCustomerProfile(event, id)}
          />
        ) : null}
        {this.state.formOpen && (
          <div>
            <NewEventForm
              CUISINES={this.state.CUISINES}
              toggle={this.openNewForm}
              createNewEvent={(e, eventInfo) => this.createNewEvent(e, eventInfo)}
            ></NewEventForm>
          </div>
        )}
        <div>
          <ul className="lemon--ul__373c0__1_cxs undefined list__373c0__2G8oH">
            {this.props.eventStore.EventList.map((event) => (
              <Event
                key={event._id}
                event={event}
                openRegisteredCustomers={() => this.openRegisteredCustomers(event._id)}
              />
            ))}
          </ul>
          <div style={{ position: 'relative', left: '50%', bottom: '3%', right: '0' }}>
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
    );
  }
}

// export default EventList;
const mapStateToProps = (state) => {
  const snackbarData = state.snackBarReducer;
  const { eventStore, registrationStore } = state.eventStoreReducer;
  return {
    snackbarData: snackbarData,
    eventStore,
    registrationStore,
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
    updateEventStore: (payload) => {
      dispatch({
        type: updateEventStore,
        payload,
      });
    },
    updateRegistrationStore: (payload) => {
      dispatch({
        type: updateRegistrationStore,
        payload,
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EventList);
