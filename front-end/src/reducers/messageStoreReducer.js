import {
  updateMessageStore,
  updateMessageList,
  updatemessageBoxStore,
} from '../constants/action-types';

const defaultState = {
  messageStore: {
    Message: {
      MessageArray: [
        {
          MessageInstance: 'somethin something',
          SentFrom: 'Pranjay',
          SentTime: '2020-12-12',
        },
      ],
      CustomerId: '41254125415',
      CustomerName: 'Pranjay',
      RestaurantId: '456456465456',
      RestaurantName: 'cafe',
    },
    showMessageModal: false,
  },
  messageListStore: {
    MessageList: [],
    messageCount: 0,
    PageCount: 0,
    selectedPage: 0,
  },
  messageBoxStore: {
    message: '',
  },
};

const messageStoreReducer = (state = defaultState, action) => {
  switch (action.type) {
    case updateMessageStore: {
      return {
        ...state,
        messageStore: { ...state.messageStore, ...action.payload },
        //   return Object.assign(state, action.payload);
      };
    }
    case updateMessageList: {
      return {
        ...state,
        messageListStore: { ...state.messageListStore, ...action.payload },
        //   return Object.assign(state, action.payload);
      };
    }
    case updatemessageBoxStore: {
      return {
        ...state,
        messageBoxStore: { ...state.messageBoxStore, ...action.payload },
        //   return Object.assign(state, action.payload);
      };
    }

    default: {
      return { ...state };
    }
  }
};

export default messageStoreReducer;
