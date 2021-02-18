import React from 'react';
import { View, SafeAreaView, TouchableOpacity, StatusBar, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Video from 'react-native-video';

export default function PropertyRoomVideo({ navigation }) {
  const currentVideo = navigation.getParam('video');
  console.log("Current Video", currentVideo)
  const onBackPressed = () => {
    navigation.pop();
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent={true} backgroundColor="rgba(0, 0, 0, 0.1)" barStyle="light-content" />

      <Video
        source={{ uri: currentVideo.video_url }}
        style={styles.backgroundVideo}
        repeat={true}
        resizeMode="cover"
        poster={currentVideo.thumbnail_url}
        posterResizeMode="cover"
      />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.backBtnContainer}>
          <TouchableOpacity onPress={() => onBackPressed()} style={styles.btn}>
            <Icon name="arrow-back" color="#fff" size={32} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

PropertyRoomVideo.navigationOptions = ({ navigation }) => {
  return {
    headerShown: false,
  };
};

const styles = StyleSheet.create({
  backBtnContainer: {
    position: 'absolute',
    top: 40,
    left: 10,
    zIndex: 3,
  },
  backgroundVideo: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  btn: {
    zIndex: 3,
  },
  container: {
    flex: 1,
  },
  safeArea: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 3,
  },
});
