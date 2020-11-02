import React, { Component } from 'react';
import { connect } from 'react-redux';
import MessageCard from './MessageCard';

class MessageBodyModal extends Component {
    constructor(props) {
        super(props);
        this.state = { message:'' };
    }
    onChangeHandler = (event) => {
        this.setState({
message:event.target.value
        })
    }
    render() {
        console.log('this.props.messageStore:', this.props.messageStore);
        return (
    <div className="modal" style={{ top: '0', left: '0%', width: '100%', height: '100%', zIndex:'1030' }}>
        <div
          className="modal_content"
          style={{ top: '10%', left: '20%', width: '60%', height: '70%' }}
        >
            <span className="close" onClick={this.props.openMessageWindow}>
                    &times;{' '}
                    </span>
                    <div><textarea value={this.state.message} onChange={this.onChangeHandler} type='text'></textarea></div>
                    <div><button onClick={(event)=>this.props.sendMessage(event,this.state.message)}>Send</button></div>
                   <div style={{width:'100%',height:'80%',overflowY:'scroll'}}>
                        <ul style={{ width: '97%' }} className="lemon--ul__373c0__1_cxs undefined list__373c0__2G8oH">
                            {this.props.messageStore.Message.MessageArray.map((message) => (<MessageCard message={message}/>))}
                            
                        </ul>
                    </div>
              

        </div>
    </div>
        );
    }
}

// export default MessageBodyModal;
const mapStateToProps = (state) => {
  const { messageStore } = state.messageStoreReducer;

  return {
    messageStore,
  };
};
export default connect(mapStateToProps, null)(MessageBodyModal);
