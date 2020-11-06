import React, { Component } from 'react';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import serverUrl from '../../../config';
import {
  updateMessageList,
  updateMessageStore,
  updateLeftPannelHighlight,
  updatemessageBoxStore,
} from '../../../constants/action-types';
import { connect } from 'react-redux';
import CustomerNavBar from '../CommonArea/CustomerNavBar';
import GreyArea from '../CommonArea/GreyArea';
import LeftPannel from '../LeftPannel/LeftPannel';
import MessageBodyModal from '../../CommonComponents/MessageBodyModal';
import MessageCard from '../../Restaurant/MessageTab/MessageCard';

class MessageList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  commonFetch(selectedPage = 0) {
    axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    axios
      .get(
        serverUrl + 'customer/getAllMessages',

        {
          params: { CustomerId: localStorage.getItem('userId'), selectedPage },
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log(response.data);
        let MessageList = response.data.MessageList;

        let payload = {
          MessageList,
          messageCount: response.data.messageCount,
          PageCount: Math.ceil(response.data.messageCount / 5),
          selectedPage,
        };
        this.props.updateMessageList(payload);
      });
  }

  componentDidMount() {
    let payload = {
      profileIsActive: false,
      eventsTabIsActive: false,
      ordersTabIsActive: false,
      followingTabIsActive: false,
      messageTabIsActive: true,
    };
    this.props.updateLeftPannelHighlight(payload);
    this.commonFetch();
  }

  handlePageClick = (e) => {
    this.commonFetch(e.selected);
  };

  openMessages = (event, CustomerId = null, RestaurantId = null) => {
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
              CustomerId,
              RestaurantId,
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
    const data = {
      message: {
        MessageInstance: message,
        SentFrom: this.props.messageStore.Message.CustomerName,
        SentTime: new Date(),
      },
      CustomerId: this.props.messageStore.Message.CustomerId,
      CustomerName: this.props.messageStore.Message.CustomerName,
      RestaurantId: this.props.messageStore.Message.RestaurantId,
      RestaurantName: this.props.messageStore.Message.RestaurantName,
    };
    axios.post(serverUrl + 'biz/sendMessage', data).then(
      (response) => {
        console.log('Status Code : ', response.status);
        if (response.status === 200) {
          console.log(response.data);
          const msgInstance = {
            MessageInstance: message,
            SentFrom: this.props.messageStore.Message.CustomerName,
            SentTime: new Date(),
          };
          const NewMessage = this.props.messageStore.Message;
          NewMessage.MessageArray.unshift(msgInstance);
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
      <div style={{ background: 'white' }}>
        {/*this.props.snackbarData != null && <SnackBar />*/}
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
                        <a className="navbar-brand">Messages</a>
                      </div>
                    </div>
                  </nav>
                  {this.props.messageStore.showMessageModal ? (
                    <MessageBodyModal
                      sendMessage={(event, message) => this.sendMessage(event, message)}
                      openMessageWindow={(event) => this.openMessages(event, '', '')}
                      // messageBody={this.props.messageStore.Message}
                      // openStaticProfile={(event) => this.openStaticProfile(event, '')}
                    />
                  ) : null}
                  <div>
                    <ul className="lemon--ul__373c0__1_cxs undefined list__373c0__2G8oH">
                      {this.props.messageListStore.MessageList.map((message) => (
                        <MessageCard
                          key={message._id}
                          message={message}
                          openMessages={(event) =>
                            this.openMessages(event, message.CustomerId, message.RestaurantId)
                          }
                        />
                      ))}
                    </ul>
                    <div style={{ position: 'relative', left: '25%', bottom: '3%', right: '0' }}>
                      <ReactPaginate
                        previousLabel={'prev'}
                        nextLabel={'next'}
                        breakLabel={'...'}
                        breakClassName={'break-me'}
                        pageCount={this.props.messageListStore.PageCount}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={2}
                        onPageChange={this.handlePageClick}
                        containerClassName={'pagination'}
                        subContainerClassName={'pages pagination'}
                        activeClassName={'active'}
                        forcePage={this.props.messageListStore.selectedPage}
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

// export default MessageList;

const mapStateToProps = (state) => {
  const { messageListStore, messageStore } = state.messageStoreReducer;
  return {
    messageListStore,
    messageStore,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateMessageList: (payload) => {
      dispatch({
        type: updateMessageList,
        payload,
      });
    },
    updateMessageStore: (payload) => {
      dispatch({
        type: updateMessageStore,
        payload,
      });
    },
    updateLeftPannelHighlight: (payload) => {
      dispatch({
        type: updateLeftPannelHighlight,
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

export default connect(mapStateToProps, mapDispatchToProps)(MessageList);

// export default MessageList;
