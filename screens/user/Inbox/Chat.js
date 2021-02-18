import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { sendMessage, getMessagesInConversation, clearMessages } from '../../../actions/message';

const defaultImage = require('../../../assets/image/default-profile-pic.png');

export default function Chat({ navigation }) {
  const dispatch = useDispatch();
  const { currentConversation, messagesInConversation, isMessagesLoading } = useSelector(state => state.message);
  const { data } = useSelector(state => state.account);
  const loggedInUserId = data.user.id;

  const getUserName = userId => {
    if (userId === currentConversation.user_from) {
      return currentConversation.from_first_name;
    } else {
      return currentConversation.to_first_name;
    }
  };

  const getUserAvatar = userId => {
    if (userId === currentConversation.user_from) {
      return currentConversation.from_avatar || defaultImage;
    } else {
      return currentConversation.to_avatar || defaultImage;
    }
  };

  // useEffect(() => {
  //  setInterval(()=> {
  //   dispatch(getMessagesInConversation(currentConversation.id))
  //  },10000)
  //  console.log("Inside Chat", messagesInConversation.length)
  // })

 

  const [state, setState] = useState({
    messages: [],
    showLoadEarlier: false,
  });

  const onSend = (message = []) => {
    dispatch(sendMessage(message[0].text));

    currentConversation.recent_messages.unshift({
      id: message[0]._id,
      reply: message[0].text,
      created_at: message[0].createdAt,
      user_id: loggedInUserId,
    });

    setState({
      messages: GiftedChat.append(state.messages, message),
    });
  };

  dayjs.extend(utc);
 
  useEffect(() => {
    const messages = messagesInConversation.map(message => {
      return {
        _id: message.id,
        text: message.reply,
        createdAt: dayjs(dayjs.utc(message.created_at).toDate()).format('YYYY-MM-DD HH:mm:ss'),
        user: {
          _id: message.user_id,
          name: getUserName(message.user_id),
          avatar: getUserAvatar(message.user_id),
        },
      };
    });
      console.log("Current Messages", messages.length)
    setState({
      messages,
      showLoadEarlier: messages.length > 50,
    });
  }, [currentConversation, messagesInConversation]);

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={state.messages}
        onSend={message => onSend(message)}
        showAvatarForEveryMessage={true}
        user={{
          _id: loggedInUserId,
        }}
        maxInputLength={2048}
        renderAvatarOnTop={true}
        loadEarlier={state.showLoadEarlier}
        isLoadingEarlier={isMessagesLoading}
        onLoadEarlier={() => getMessagesInConversation(currentConversation.id)}
      />
    </View>
  );
}

Chat.navigationOptions = ({ navigation }) => {
  return {
    title: navigation.getParam('from', 'Chat'),
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
