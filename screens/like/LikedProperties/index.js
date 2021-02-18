import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, SafeAreaView, FlatList, ActivityIndicator, Text, StatusBar, StyleSheet } from 'react-native';
import AlertMessage from '../../../components/AlertMessage';
import ResultTile from '../../user/Search/ResultTile';
import { getLikedProperties } from '../../../actions/like';

export default function LikedProperties({ navigation }) {
  const dispatch = useDispatch();
  const { likedProperties, isLikedLoading } = useSelector(state => state.like);
  const viewabilityConfig = { itemVisiblePercentThreshold: 90, minimumViewTime: 300 };

  const onScroll = () => {
    if (!isLikedLoading) {
      // Infinite load more followers
      dispatch(getLikedProperties(likedProperties.length));
    }
  };

  const onPropertyPressed = property => {
    navigation.navigate('PropertyAddress', { propertyId: property.id, title: property.title });
  };

  useEffect(() => {
    dispatch(getLikedProperties());
  }, [dispatch]);

  if (isLikedLoading && likedProperties.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar translucent={true} backgroundColor="rgba(0, 0, 0, 0.1)" barStyle="dark-content" />

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#d81b60" />

          <Text style={styles.loadingText}>Getting your liked properties...</Text>
        </View>
      </View>
    );
  }

  if (!isLikedLoading && likedProperties.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar translucent={true} backgroundColor="rgba(0, 0, 0, 0.1)" barStyle="dark-content" />

        <AlertMessage color="#fff" name="home-heart" bgColor="#ccc" textColor="#ccc" textSize={11} message="You have not liked any properties" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar translucent={true} backgroundColor="rgba(0, 0, 0, 0.1)" barStyle="dark-content" />

      <SafeAreaView style={styles.container}>
        <FlatList
          data={likedProperties}
          numColumns={3}
          viewabilityConfig={viewabilityConfig}
          onEndReachedThreshold={0.3}
          onEndReached={onScroll}
          key={likedProperties.length}
          keyExtractor={property => property.id}
          renderItem={({ item }) => <ResultTile property={item} handlePress={() => onPropertyPressed(item)} />}
        />
      </SafeAreaView>
    </View>
  );
}

LikedProperties.navigationOptions = {
  title: 'Liked Properties',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingTop: 0,
    flex: 1,
    flexDirection: 'row',
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
