import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView , Animated, Easing} from 'react-native';
import { colors } from '../../../theme/constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Lottie from 'lottie-react-native';
import cameraRecord from '../../../assets/lottie-animations/CameraRecord.json'
export function RecordComplete({ navigation, videoUri, isNextEnabled, saveVideoToServer, openTextModal }) {
  const videoType = navigation.getParam('videoType', null);
  return (
    <SafeAreaView style={styles.loadingContainer}>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image style={{ width: 16, height: 16 }} source={require('../../../assets/image/close.png')} />
        </TouchableOpacity>
        {/* <Text style={{color:'w'}}> Add Music </Text> */}
      </View>

      <View style={[styles.row, { marginTop: 'auto' }]}>
        {/* <TouchableOpacity style={{ alignItems: 'center' }}>
          <Image style={{ width: 28, height: 29 }} source={require('../../../assets/image/camera/effects.png')} />
          <Text style={styles.text}>Effects</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center' }}>
          <Image style={{ width: 30, height: 30 }} source={require('../../../assets/image/camera/filter.png')} />
          <Text style={styles.text}>Filters</Text>
        </TouchableOpacity> */}
        <TouchableOpacity style={{ alignItems: 'center', marginRight: 52 }} onPress={() => navigation.navigate('TrackList', { videoUri, videoType })}>
          <Image style={{ width: 28, height: 28 }} source={require('../../../assets/image/camera/music.png')} />
          <Text style={styles.text}>Music</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={saveVideoToServer} disabled={!isNextEnabled}>
          <Image style={{ width: 40, height: 40 }} source={require('../../../assets/image/next.png')} />
        </TouchableOpacity>
        <TouchableOpacity onPress={openTextModal} style={{ alignItems: 'center' }}>
          <Image style={{ width: 44, height: 28 }} source={require('../../../assets/image/camera/text.png')} />
          <Text style={styles.text}>Text</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={{ alignItems: 'center' }}>
          <Image style={{ width: 24, height: 28 }} source={require('../../../assets/image/camera/trim.png')} />
          <Text style={styles.text}>Trim</Text>
        </TouchableOpacity> */}
      </View>
    </SafeAreaView>
  );
}

export function Recording({ handlePress, navigation, videoLength, setVideoLength, isRecording, toggleCameraDirection, toggleFlash, stopVideo }) {
  const spinValue = new Animated.Value(0);

  Animated.loop(
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 5000,
      easing: Easing.linear,
      useNativeDriver: true,
    }),
  ).start();

  const rotateProp = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <SafeAreaView style={styles.loadingContainer}>
      {!isRecording && <View style={styles.row}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image style={{ width: 16, height: 16 }} source={require('../../../assets/image/close.png')} />
        </TouchableOpacity>
        
        
        {/* <TouchableOpacity>
          <Image style={{ width: 30, height: 30 }} source={require('../../../assets/image/done.png')} />
        </TouchableOpacity> */}
      </View>}
      {!isRecording && <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row',}} onPress={() => navigation.navigate('Music')}>
        <Ionicons name='musical-notes-outline' size={17} color='white'/>
        <Text style={{color: '#fff',}}>Add Music</Text>
        </TouchableOpacity>}

      <View style={[styles.recordRow, { display: 'flex', height: '100%', alignItems: 'flex-end' }]}>
        <TouchableOpacity onPress={toggleCameraDirection} style={{ alignItems: 'center' }}>
          <Image style={styles.actionImage} source={require('../../../assets/image/camera/flip.png')} />
          <Text style={styles.text}>Flip</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={{ alignItems: 'center' }}>
          <Image style={styles.actionImage} source={require('../../../assets/image/camera/speed.png')} />
          <Text style={styles.text}>Speed</Text>
        </TouchableOpacity> */}
        {!isRecording && (
          <View style={{ alignItems: 'center' , marginBottom: 30}}>
            <View>
            <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setVideoLength(15);
                  }}>
                  <Text style={{...styles.text, color: videoLength === 15 ? '#fff':'gray'}}>
                    15s&nbsp;
                    {videoLength === 15 ? <>&bull;</> : <>&nbsp;&nbsp;</>}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setVideoLength(60);
                  }}>
                  <Text style={{...styles.text, color: videoLength === 60 ? '#fff':'gray'}}>
                    60s&nbsp;
                    {videoLength === 60 ? <>&bull;</> : <>&nbsp;&nbsp;</>}
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={handlePress}>
                <RecordBtn />
              </TouchableOpacity>
              
            </View>
          </View>
        )}

{isRecording && (
          <View style={{ alignItems: 'center' , marginBottom: 30}}>
            <View>
            <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
              </View>
              <TouchableOpacity onPress={stopVideo}>
              <Lottie
                    source={cameraRecord}
                    progress={spinValue}
                    style={{ width: 100,}}
                  />
              </TouchableOpacity>
              
            </View>
          </View>
        )}

       
        <TouchableOpacity onPress={toggleFlash} style={{ alignItems: 'center' }}>
          <Image style={{ width: 23, height: 30 }} source={require('../../../assets/image/camera/flash.png')} />
          <Text style={styles.text}>Flash</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const RecordBtn = () => {
  return (
    <View
      style={{
        width: 68,
        height: 68,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        borderColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View
        style={{
          width: 28,
          height: 28,
          borderRadius: 50,
          backgroundColor: colors.primary,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  loadingContainer: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    height: '100%',
    width: '100%',
    // backgroundColor: 'red',
  },
  recordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionImage: {
    width: 34,
    height: 34,
  },
  text: {
    fontSize: 13,
    lineHeight: 16,
    fontFamily: 'font-regular',
    // color: 'gray',
    marginTop: 15,
  },
});
