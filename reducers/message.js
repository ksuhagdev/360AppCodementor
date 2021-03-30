import {
  ALL_CONVERSATIONS,
  CONVERSATIONS_LOADING,
  MESSAGES_IN_CONVERSATION,
  CLEAR_MESSAGES,
  CURRENT_CONVERSATION,
  MESSAGES_IS_LOADING,
  MESSAGE_IS_SENDING,SET_CURRENCY
} from '../store/types';

const initialState = {
  allConversations: [],
  isConversationsLoading: false,
  messagesInConversation: [],
  isMessagesLoading: false,
  currentConversation: {},
  isMessageSending: false,
  currency: 'AUD'
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ALL_CONVERSATIONS:
      return {
        ...state,
        allConversations: action.payload,
      };
    case SET_CURRENCY:
      console.log("Action Payload", action.payload)
      return {
        ...state,
        currency:action.payload
      }
    case CONVERSATIONS_LOADING:
      return {
        ...state,
        isConversationsLoading: action.payload,
      };

    case MESSAGES_IN_CONVERSATION:
    case CLEAR_MESSAGES:
      return {
        ...state,
        messagesInConversation: action.payload,
      };

    case CURRENT_CONVERSATION:
      return {
        ...state,
        currentConversation: action.payload,
      };

    case MESSAGES_IS_LOADING:
      return {
        ...state,
        isMessagesLoading: action.payload,
      };

    case MESSAGE_IS_SENDING:
      return {
        ...state,
        isMessageSending: action.payload,
      };

    default:
      return state;
  }
}
