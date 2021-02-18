import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, SafeAreaView, FlatList, ActivityIndicator, Text, StatusBar, StyleSheet } from 'react-native';
import AlertMessage from '../../../components/AlertMessage';
import AvatarListItem from '../../../components/List/AvatarListItem';
import { getFollowers } from '../../../actions/follow';

export default function Followers({ onPressed }) {
  const dispatch = useDispatch();
  const { followers, isFollowersLoading, allFollowersLoaded } = useSelector(state => state.follow);
  const viewabilityConfig = { itemVisiblePercentThreshold: 90, minimumViewTime: 300 };

  const onScroll = () => {
    if (!isFollowersLoading && !allFollowersLoaded) {
      // Infinite load more followers
      dispatch(getFollowers());
    }
  };

  useEffect(() => {
    dispatch(getFollowers());
  }, [dispatch]);

  if (isFollowersLoading && followers.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar translucent={true} backgroundColor="rgba(0, 0, 0, 0.1)" barStyle="dark-content" />

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#d81b60" />

          <Text style={styles.loadingText}>Getting your followers...</Text>
        </View>
      </View>
    );
  }

  if (!isFollowersLoading && followers.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar translucent={true} backgroundColor="rgba(0, 0, 0, 0.1)" barStyle="dark-content" />

        <AlertMessage color="#fff" name="account-multiple" bgColor="#ccc" textColor="#ccc" textSize={11} message="You do not have any followers" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar translucent={true} backgroundColor="rgba(0, 0, 0, 0.1)" barStyle="dark-content" />

      <SafeAreaView style={styles.container}>
        <FlatList
          data={followers}
          key={followers.length}
          keyExtractor={user => user.id}
          horizontal={false}
          viewabilityConfig={viewabilityConfig}
          onEndReachedThreshold={0.3}
          onEndReached={onScroll}
          renderItem={({ item, index }) => (
            <AvatarListItem key={index} avatar={item.profile_photo_url} text={`${item.first_name} ${item.last_name}`} onPress={() => onPressed(item)} />
          )}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 11,
    color: '#ccc',
  },
});
