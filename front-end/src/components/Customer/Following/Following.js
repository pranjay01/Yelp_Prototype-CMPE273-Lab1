import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import CustomerNavBar from '../CommonArea/CustomerNavBar';
import { Redirect } from 'react-router';
import LeftPannel from '../LeftPannel/LeftPannel';
import GreyArea from '../CommonArea/GreyArea';
import EventForCustomer from '../Events/EventForCustomer';
import axios from 'axios';
import serverUrl from '../../../config';
import {
  updateSnackbarData,
  updateLeftPannelHighlight,
  updateCustomerListStore,
  updateCustomerForRestaurant,
  getCustomerBasicInfo,
} from '../../../constants/action-types';
import { connect } from 'react-redux';
import ReactPaginate from 'react-paginate';
import UserCard from './UserCard';
import CustomerStaticProfile from '../../Restaurant/CommonComponent/CustomerStaticProfile';

class Following extends Component {
  constructor(props) {
    super(props);
    this.state = { name: '', zip: '' };
  }

  commonFetch(location, filterCriterea = 'all', selectedPage = 0) {
    axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    axios
      .get(
        serverUrl + 'customer/getCustomers',

        {
          params: {
            filterCriterea,
            selectedPage,
            location,
            CustomerID: localStorage.getItem('userId'),
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log(response.data);
        let allCustomers = response.data.CustomerList.map((customer) => {
          // let EventDate = moment.utc(event.EventDate);
          return {
            ...customer,
            // EventDate: EventDate.format('LL'),
          };
        });

        const payload = {
          CustomerList: allCustomers,
          customerCount: response.data.customerCount,
          PageCount: Math.ceil(response.data.customerCount / 5),
          selectedPage,
          filterCriterea,
          location,
        };
        this.props.updateCustomerListStore(payload);
        // this.setState({
        //   EVENTS: allEvents,
        // });
      });
  }

  handlePageClick = (e) => {
    this.commonFetch(
      this.props.customerListSTore.location,
      this.props.customerListSTore.filterCriterea,
      e.selected
    );
  };
  alreadyFollowed = (customerID) => {
    return this.props.customerProfile.Following.includes(customerID);
  };

  componentDidMount() {
    let payload = {
      profileIsActive: false,
      eventsTabIsActive: false,
      ordersTabIsActive: false,
      followingTabIsActive: true,
      messageTabIsActive: false,
    };
    this.props.updateLeftPannelHighlight(payload);
    this.commonFetch(
      this.props.customerListSTore.location,
      this.props.customerListSTore.filterCriterea,
      0
    );
  }

  openProfile = (event, CustomerID) => {
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

  FOllowUser = (event, CustomerID) => {
    event.preventDefault();
    axios.defaults.withCredentials = true;

    axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    const data = { ID: CustomerID, CustomerID: localStorage.getItem('userId') };
    axios.post(serverUrl + 'customer/followUser', data).then(
      (response) => {
        if (response.status === 200) {
          let payload = {
            success: true,
            message: 'Successfully Followed!',
          };
          this.props.updateSnackbarData(payload);
          // let customerProfile = this.props.customerProfile;
          // let Following = customerProfile.Following;
          // Following.push(CustomerID);
          console.log(
            ' this.props.customerProfile.Following',
            this.props.customerProfile.Following
          );

          const customerProfile = this.props.customerProfile;
          customerProfile.Following.push(CustomerID);
          console.log(
            ' this.props.customerProfile.Following.push(CustomerID)',
            customerProfile.Following
          );
          let payload2 = {
            customerProfile,
          };
          this.props.getCustomerBasicInfo(payload2);
        }
      },
      (error) => {
        console.log(error);
        if (error.response.status === 500) {
          console.log(error);
        }
      }
    );
  };

  getUserList = (event, filterCriterea) => {
    event.preventDefault();
    this.commonFetch(this.state.zip, filterCriterea, 0);
  };
  // getUserListForLocation = (event, location) => {
  //   event.preventDefault();
  //   this.commonFetch( location,this.props.customerListSTore.filterCriterea,0)
  // }

  onCHangeNameHandler = (event) => {
    event.preventDefault();

    this.setState({
      name: event.target.value,
    });
  };

  onChangeZipHandler = (event) => {
    event.preventDefault();
    if (!/^\d+$/.test(event.target.value) && event.target.value.length > 0) {
    } else {
      this.setState({
        zip: event.target.value,
      });
    }
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

    let activeSTyle = { width: '136px' };
    if (
      this.props.customerListSTore.filterCriterea !== 'all' &&
      this.props.customerListSTore.filterCriterea !== 'following'
    ) {
      activeSTyle = { width: '136px', backgroundColor: '#080808', color: '#fff' };
    }
    return (
      <div style={{ background: 'white' }}>
        {this.props.customerInfo.staticProfileSeen ? (
          <CustomerStaticProfile
            alreadyFollowed={this.alreadyFollowed(
              this.props.customerInfo.customerProfile.CustomerID
            )}
            FOllowUser={(event) =>
              this.FOllowUser(
                event,
                this.props.customerInfo.customerProfile.CustomerID,
                this.props.customerInfo.customerProfile
              )
            }
            customerProfile={this.props.customerInfo.customerProfile}
            openStaticProfile={(event) => this.openProfile(event, '')}
          />
        ) : null}
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
                        <a className="navbar-brand">Users</a>
                      </div>
                      <ul className="nav navbar-nav">
                        <li
                          className={
                            this.props.customerListSTore.filterCriterea === 'all' ? 'active' : ''
                          }
                        >
                          <Link to="#" onClick={(event) => this.getUserList(event, 'all')}>
                            All Users
                          </Link>
                        </li>
                        <li
                          className={
                            this.props.customerListSTore.filterCriterea === 'following'
                              ? 'active'
                              : ''
                          }
                        >
                          <Link to="#" onClick={(event) => this.getUserList(event, 'following')}>
                            Following
                          </Link>
                        </li>
                        <li
                          style={activeSTyle}
                          className={
                            this.props.customerListSTore.filterCriterea !== 'all' &&
                            this.props.customerListSTore.filterCriterea !== 'following' &&
                            'active'
                          }
                        >
                          <input
                            style={{ marginTop: '14px', width: '130px' }}
                            type="text"
                            value={this.state.name}
                            name="name"
                            onChange={this.onCHangeNameHandler}
                          ></input>
                        </li>
                        <li
                          className={
                            this.props.customerListSTore.filterCriterea !== 'all' &&
                            this.props.customerListSTore.filterCriterea !== 'following' &&
                            'active'
                          }
                        >
                          <button
                            style={{ marginTop: '14px' }}
                            onClick={(event) => this.getUserList(event, this.state.name)}
                          >
                            Name
                          </button>
                        </li>
                        <li style={{ width: '136px', marginLeft: '10px' }} className="">
                          <input
                            style={{ marginTop: '14px', width: '130px' }}
                            type="text"
                            name="Zip"
                            placeholder="Zip-Filter"
                            maxLength="5"
                            value={this.state.zip}
                            onChange={this.onChangeZipHandler}
                          ></input>
                        </li>
                        {/*<li className="">
                          <button
                            style={{ marginTop: '14px' }}
                            onClick={(event) => this.getUserListForLocation(event, this.state.zip)}
                          >
                            Location
                          </button>
                        </li>*/}
                      </ul>

                      {/*navLogin*/}
                    </div>
                  </nav>
                  <div>
                    <ul className="lemon--ul__373c0__1_cxs undefined list__373c0__2G8oH">
                      {this.props.customerListSTore.CustomerList.map((customer) => (
                        <UserCard
                          key={customer.CustomerID}
                          customer={customer}
                          // registeredEventIds={this.state.registeredEventIds}
                          openProfile={(event) => {
                            this.openProfile(event, customer.CustomerID);
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
                        pageCount={this.props.customerListSTore.PageCount}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={2}
                        onPageChange={this.handlePageClick}
                        containerClassName={'pagination'}
                        subContainerClassName={'pages pagination'}
                        activeClassName={'active'}
                        forcePage={this.props.customerListSTore.selectedPage}
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

// export default Following;
const mapStateToProps = (state) => {
  const { customerListSTore } = state.customerListStoreReducer;
  const { customerInfo } = state.customerForProfileReducer;
  const { customerProfile } = state.customerBasicInfoReducer.customerInfo;
  return {
    customerListSTore,
    customerInfo,
    customerProfile,
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
    updateLeftPannelHighlight: (payload) => {
      dispatch({
        type: updateLeftPannelHighlight,
        payload,
      });
    },
    updateCustomerListStore: (payload) => {
      dispatch({
        type: updateCustomerListStore,
        payload,
      });
    },
    updateCustomerForRestaurant: (payload) => {
      dispatch({
        type: updateCustomerForRestaurant,
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

export default connect(mapStateToProps, mapDispatchToProps)(Following);
