import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, SafeAreaView, FlatList, ActivityIndicator, Text, StatusBar, StyleSheet } from 'react-native';
import AlertMessage from '../../../components/AlertMessage';
import AvatarListItem from '../../../components/List/AvatarListItem';
import { getFollowing } from '../../../actions/follow';

export default function Following({ onPressed }) {
  const dispatch = useDispatch();
  const { following, isFollowingLoading, allFollowingLoaded } = useSelector(state => state.follow);
  const viewabilityConfig = { itemVisiblePercentThreshold: 90, minimumViewTime: 300 };

  const onScroll = () => {
    if (!isFollowingLoading && !allFollowingLoaded) {
      // Infinite load more followers
      dispatch(getFollowing(following.length));
    }
  };

  useEffect(() => {
    dispatch(getFollowing());
  }, [dispatch]);

  if (isFollowingLoading && following.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar translucent={true} backgroundColor="rgba(0, 0, 0, 0.1)" barStyle="dark-content" />

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#d81b60" />

          <Text style={styles.loadingText}>Getting people you're following...</Text>
        </View>
      </View>
    );
  }

  if (!isFollowingLoading && following.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar translucent={true} backgroundColor="rgba(0, 0, 0, 0.1)" barStyle="dark-content" />

        <AlertMessage color="#fff" name="account-multiple" bgColor="#ccc" textColor="#ccc" textSize={11} message="You are not following anyone" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar translucent={true} backgroundColor="rgba(0, 0, 0, 0.1)" barStyle="dark-content" />

      <SafeAreaView style={styles.container}>
        <View style={styles.listContainer}>
          <FlatList
            data={following}
            key={following.length}
            keyExtractor={user => user.id}
            horizontal={false}
            viewabilityConfig={viewabilityConfig}
            onEndReachedThreshold={0.4}
            onEndReached={onScroll}
            renderItem={({ item, index }) => (
              <AvatarListItem
                key={index}
                avatar={item.profile_photo_url}
                text={`${item.first_name} ${item.last_name}`}
                secondaryText={item.agency}
                onPress={() => onPressed(item)}
              />
            )}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 20,
    paddingTop: 0,
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
