import React, { useEffect } from 'react';
import { View, SafeAreaView, ScrollView, StatusBar, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import AlertMessage from '../../../components/AlertMessage';
import { getConversations,getMessagesInConversation, setCurrentConversation } from '../../../actions/message';
import AvatarListItem from '../../../components/List/AvatarListItem';

export default function Inbox({ navigation }) {
  const dispatch = useDispatch();
  const { allConversations } = useSelector(state => state.message);
  const { data } = useSelector(state => state.account);
  const loggedInUserId = data.user.id || 0;



  useEffect(() => {
    dispatch(getConversations());
  }, []);

  const handleClick = async item => {
    const from = loggedInUserId === item.user_from ? item.to_first_name : item.from_first_name;
    
   await dispatch(setCurrentConversation({ ...item }));
   await dispatch(getMessagesInConversation(item.id))
    navigation.navigate('Chat', { chatUserId: item.id, from });
  };

  const getMessageSnippet = conversation => {
    let snippet = ' ';

    if (conversation.recent_messages && conversation.recent_messages.length) {
      const message = conversation.recent_messages[0];

      snippet = message ? message.reply.substring(0, 37).trim() : ' ';

      if (message && message.reply.length > 37) {
        snippet += '...';
      }
    }

    return snippet;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent={true} backgroundColor="rgba(0, 0, 0, 0.1)" barStyle="dark-content" />

      {allConversations.length === 0 && (
        <View style={[styles.container, styles.alignCenter]}>
          <AlertMessage color="#fff" name="message" bgColor="#ccc" textColor="#ccc" textSize={11} message="Your inbox is empty" />
        </View>
      )}

      {allConversations.length > 0 && (
        <ScrollView>
          <View style={styles.messageList}>
            {allConversations.map((item, index) => {
              const user = {};
              if (item.user_from !== loggedInUserId) {
                user.id = item.user_from;
                user.first_name = item.from_first_name;
                user.last_name = item.from_last_name;
                user.avatar = item.from_avatar;
              } else {
                user.id = item.user_to;
                user.first_name = item.to_first_name;
                user.last_name = item.to_last_name;
                user.avatar = item.to_avatar;
              }
              return (
                <AvatarListItem
                  key={index}
                  avatar={user.avatar}
                  text={`${user.first_name}${user.last_name ? ` ${user.last_name}` : ''}`}
                  secondaryText={getMessageSnippet(item)}
                  onPress={() => handleClick(item)}
                />
              );
            })}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  alignCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageList: {
    padding: 20,
    paddingTop: 10,
    flex: 1,
  },
});
