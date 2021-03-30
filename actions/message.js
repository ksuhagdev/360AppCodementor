import { handleLoading } from './app';
import request from '../helper/functions/request';
import parseError from '../utils/parse-api-error';
import { handleSnackbar } from '../helper/functions/snackbar';
import {
  ALL_CONVERSATIONS,
  CONVERSATIONS_LOADING,
  MESSAGES_IN_CONVERSATION,
  CLEAR_MESSAGES,
  CURRENT_CONVERSATION,
  MESSAGES_IS_LOADING,
  MESSAGE_IS_SENDING,SET_CURRENCY
} from '../store/types';

export const SetCurrency = (type) => async (dispatch) => {
  dispatch(
    { 
      type: SET_CURRENCY,
      payload: type
    }
  )
}

export const getConversations = () => async (dispatch, getState) => {
  dispatch({ type: CONVERSATIONS_LOADING, payload: true });

  const { allConversations } = getState().message;
  const start = allConversations.length;
  const limit = 50;

  try {
    const { data } = await request({
      url: `/conversations`,
      config: {
        method: 'GET',
      },
    })

 

    if (data && data.length) {
      dispatch({
        type: ALL_CONVERSATIONS,
        payload: allConversations.concat(data),
      });
    }
    // if (data && data.length) {
    //   dispatch({
    //     type: ALL_CONVERSATIONS,
    //     payload: data,
    //   });
    // }
  } catch (error) {
    console.log(error);
    handleSnackbar({ message: parseError(error.response.data) });
  } finally {
    dispatch({ type: CONVERSATIONS_LOADING, payload: false });
  }
};

export const createConversation = (toUser, subject) => async dispatch => {
  dispatch(handleLoading(true));

  try {
    const { data } = await request({
      url: '/conversations',
      config: {
        method: 'POST',
        body: {
          user_to: toUser,
          subject,
        },
      },
    });

    dispatch({
      type: MESSAGES_IN_CONVERSATION,
      payload: data.recent_messages || [],
    });

    setTimeout(() => {
      dispatch({
        type: CURRENT_CONVERSATION,
        payload: data,
      });

      dispatch(handleLoading(false));
    }, 200);
  } catch (error) {
    handleSnackbar({ message: parseError(error.response.data) });
    dispatch(handleLoading(false));
  }
};

export const setCurrentConversation = conversation => async dispatch => {
  dispatch({
    type: CURRENT_CONVERSATION,
    payload: conversation,
  });

  dispatch({
    type: MESSAGES_IN_CONVERSATION,
    payload: conversation.recent_messages,
  });
};

export const deleteConversation = conversationId => async () => {
  try {
    await request({
      url: `/conversations/${conversationId}`,
      config: {
        method: 'DELETE',
      },
    });

    handleSnackbar({ message: 'Conversation deleted', type: 'success' });
  } catch (error) {
    console.log(error);
    handleSnackbar({ message: parseError(error.response.data) });
  }
};

export const getMessagesInConversation = conversationId => async (dispatch, getState) => {
  dispatch({ type: MESSAGES_IS_LOADING, payload: true });

  const { messagesInConversation } = getState().message;
  // const { currentConversationId } = getState().currentConversationId;
  const start = messagesInConversation.length;
  const limit = 50;
  // console.log("What is Current Conversation ID", conversationId)
  try {
    const { data } = await request({
      url: `/messages?convId=${conversationId}?start=${start}&limit=${limit}`,
      config: {
        method: 'GET',
      },
    });
    console.log("Data is Message", data.length)
    if (data && data.length) {
      dispatch({
        type: MESSAGES_IN_CONVERSATION,
        // payload: data.concat(messagesInConversation),
        payload: data
      });
    }
  } catch (error) {
    handleSnackbar({ message: parseError(error.response.data) });
  } finally {
    dispatch({ type: MESSAGES_IS_LOADING, payload: false });
  }
};

export const clearMessages = () => dispatch => {
  dispatch({
    type: CLEAR_MESSAGES,
    payload: [],
  });

  dispatch({
    type: CURRENT_CONVERSATION,
    payload: null,
  });
};

export const sendMessage = message => async (dispatch, getState) => {
  dispatch({ type: MESSAGE_IS_SENDING, payload: true });

  const { currentConversation, messagesInConversation } = getState().message;

  try {
    const { data } = await request({
      url: `/messages/${currentConversation.id}`,
      config: {
        method: 'POST',
        body: { reply: message },
      },
    });

    dispatch({
      type: MESSAGES_IN_CONVERSATION,
      payload: [data].concat(messagesInConversation),
    });
  } catch (error) {
    console.log(error);
    handleSnackbar({ message: parseError(error.response.data) });
  } finally {
    dispatch({ type: MESSAGE_IS_SENDING, payload: false });
  }
};

export const markAsRead = messageId => async () => {
  try {
    await request({
      url: `/messages/${messageId}`,
      config: {
        method: 'POST',
      },
    });
  } catch (error) {
    console.log(error);
  }
};
