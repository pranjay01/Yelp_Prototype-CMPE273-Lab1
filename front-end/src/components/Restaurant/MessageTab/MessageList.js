import React, { Component } from 'react';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import serverUrl from '../../../config';
import {
  updateMessageList,
  updateMessageStore,
  updatemessageBoxStore,
} from '../../../constants/action-types';
import { connect } from 'react-redux';
import MessageCard from './MessageCard';
import MessageBodyModal from '../../CommonComponents/MessageBodyModal';

class MessageList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  commonFetch(selectedPage = 0) {
    axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    axios
      .get(
        serverUrl + 'biz/getAllMessages',

        {
          params: { RestaurantId: localStorage.getItem('userId'), selectedPage },
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
        SentFrom: this.props.messageStore.Message.RestaurantName,
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
            SentFrom: this.props.messageStore.Message.RestaurantName,
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
      <div>
        {/*redirectVar*/}

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
        <div style={{ position: 'relative', left: '50%', bottom: '3%', right: '0' }}>
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
    );
  }
}

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
