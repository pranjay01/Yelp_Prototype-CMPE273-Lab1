import React, { Component } from 'react';
import { connect } from 'react-redux';
import MessageCard from './MessageCard';
import { updatemessageBoxStore } from '../../constants/action-types';

class MessageBodyModal extends Component {
  constructor(props) {
    super(props);
    this.state = { message: '' };
  }
  onChangeHandler = (event) => {
    let payload = {
      message: event.target.value,
    };
    this.props.updatemessageBoxStore(payload);
  };
  render() {
    console.log('this.props.messageStore:', this.props.messageStore);
    return (
      <div
        className="modal"
        style={{ top: '0', left: '0%', width: '100%', height: '100%', zIndex: '1030' }}
      >
        <div
          className="modal_content"
          style={{ top: '10%', left: '20%', width: '60%', height: '70%' }}
        >
          <span className="close" onClick={this.props.openMessageWindow}>
            &times;{' '}
          </span>
          <div>
            <textarea
              value={this.props.messageBoxStore.message}
              onChange={this.onChangeHandler}
              type="text"
            ></textarea>
          </div>
          <div>
            <button
              onClick={(event) => this.props.sendMessage(event, this.props.messageBoxStore.message)}
            >
              Send
            </button>
          </div>
          <div style={{ width: '100%', height: '80%', overflowY: 'scroll' }}>
            <ul
              style={{ width: '97%' }}
              className="lemon--ul__373c0__1_cxs undefined list__373c0__2G8oH"
            >
              {this.props.messageStore.Message
                ? this.props.messageStore.Message.MessageArray.map((message) => (
                    <MessageCard message={message} />
                  ))
                : ''}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

// export default MessageBodyModal;
const mapStateToProps = (state) => {
  const { messageStore, messageBoxStore } = state.messageStoreReducer;

  return {
    messageStore,
    messageBoxStore,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updatemessageBoxStore: (payload) => {
      dispatch({
        type: updatemessageBoxStore,
        payload,
      });
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(MessageBodyModal);
