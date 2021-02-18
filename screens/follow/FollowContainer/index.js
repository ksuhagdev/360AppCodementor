import React from 'react';
import Following from '../Following';
import Followers from '../Followers';

export default function FollowContainer({ navigation }) {
  const displayType = navigation.getParam('displayType', 'following');

  const onUserPressed = user => {
    if (user.id) {
      // or user.follower_id
      // go to user profile
    } else if (user.agent_id) {
      navigation.navigate('AgentProfile', { agentId: user.agent_id });
    }
  };

  if (displayType === 'following') {
    return <Following onPressed={onUserPressed} />;
  }

  return <Followers onPressed={onUserPressed} />;
}

FollowContainer.navigationOptions = ({ navigation }) => {
  return {
    title: navigation.getParam('displayType') === 'following' ? 'Users Following' : 'Your Followers',
  };
};
