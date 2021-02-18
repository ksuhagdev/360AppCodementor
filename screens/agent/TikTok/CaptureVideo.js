import React, { Component } from 'react';

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import VideoRecorder from 'react-native-beautiful-video-recorder'
import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
let timerRef = null;
const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};
export default class CaptureVideo extends Component {
  static navigationOptions = {
    title: 'Home',
    headerMode: 'none',
    headerShown: false,
  };

  state = {
    videoLength: 15,
    isRecording: false,
    countdown: 0,
  };

  setVideoLength = videoLength => {
    this.setState(
      {
        videoLength,
      },
      () => {
        ReactNativeHapticFeedback.trigger('selection', options);
      },
    );
  };

  cancelVideo = () => {
    // add confirm prompt here
    this.camera.stopRecording();
    clearInterval(timerRef);
    this.setState({
      isRecording: false,
    });
  };
  startRecorder = () => {
    if (this.camera && this.camera.current) {
      this.camera.current.open({ maxLength: 30 }, (data) => {
        console.log('captured data', data);
      })
    }
  }

  render() {
    const { countdown, isRecording, videoLength } = this.state;
    return(
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={stylestest.scrollView}>
          <View style={stylestest.body}>
            <View style={stylestest.sectionContainer}>
              <TouchableOpacity onPress={startRecorder} style={stylestest.btnCapture}>
                <Text style={stylestest.sectionTitle}>Capture video</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      <VideoRecorder ref={ref => {
            this.camera = ref;
          }} compressQuality={'medium'} />
    </>);
    // return (
    //   <View style={styles.container}>
    //     <RNCamera
    //       ref={ref => {
    //         this.camera = ref;
    //       }}
    //       useNativeZoom={true}
    //       autoFocus
    //       captureAudio={false}
    //       style={styles.preview}
    //       type={RNCamera.Constants.Type.back}
    //       flashMode={RNCamera.Constants.FlashMode.off}
    //     />
    //     {isRecording && (
    //       <View style={styles.timerSection}>
    //         <Text style={styles.countdown}>{countdown}s</Text>
    //       </View>
    //     )}
    //     <View style={styles.controlPanel}>
    //       <View style={styles.durationSelectors}>
    //         {!isRecording && (
    //           <>
    //             <TouchableOpacity
    //               onPress={() => {
    //                 this.setVideoLength(15);
    //               }}>
    //               <Text style={styles.lengthText}>
    //                 15s&nbsp;
    //                 {videoLength === 15 ? <>&bull;</> : <>&nbsp;&nbsp;</>}
    //               </Text>
    //             </TouchableOpacity>
    //             <TouchableOpacity
    //               onPress={() => {
    //                 this.setVideoLength(60);
    //               }}>
    //               <Text style={styles.lengthText}>
    //                 60s&nbsp;
    //                 {videoLength === 60 ? <>&bull;</> : <>&nbsp;&nbsp;</>}
    //               </Text>
    //             </TouchableOpacity>
    //           </>
    //         )}
    //       </View>
    //       <TouchableOpacity disabled={isRecording} onPress={this.startVideoCapture} style={styles.capture}>
    //         <Text style={{ fontSize: 14 }}>{isRecording ? 'Recording' : 'Record'}</Text>
    //       </TouchableOpacity>
    //       <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    //         <TouchableOpacity onPress={this.cancelVideo}>
    //           <Text>Cancel</Text>
    //         </TouchableOpacity>
    //       </View>
    //     </View>
    //   </View>
    // );
  }

  startVideoCapture = async () => {
    console.log(111);
    const { videoLength, isCancelled } = this.state;
    const { navigate } = this.props.navigation;
    this.setState(
      {
        countdown: videoLength,
        isRecording: true,
      },
      () => {
        timerRef = setInterval(() => {
          const { countdown } = this.state;
          let isRecording = true;
          if (countdown === 1) {
            isRecording = false;
            this.camera.stopRecording();
            clearInterval(timerRef);
          }
          this.setState({
            isRecording,
            countdown: countdown - 1,
          });
        }, 1000);
      },
    );
    if (this.camera) {
      const options = { mute: true };
      const data = await this.camera.recordAsync(options);
      console.log("Video Recorded",data.uri);
      navigate('EditVideo', { videoUri: data.uri });
    }
  };
}

const stylestest = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
    alignItems: 'center'
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.white,
  },
  btnCapture: {
    width: 200,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'blue',
    borderRadius: 25
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
    fontSize: 14,
  },
  timerSection: {
    alignItems: 'center',
    position: 'absolute',
    top: 10,
    width: '100%',
  },
  countdown: {
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: 'gold',
    borderRadius: 3,
    overflow: 'hidden',
    fontWeight: 'bold',
    width: 40,
    textAlign: 'center',
  },
  durationSelectors: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  controlPanel: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  lengthText: {
    padding: 5,
    fontSize: 14,
    fontWeight: 'bold',
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: 'cyan',
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: 10,
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderColor: 'red',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
    width: 100,
    alignItems: 'center',
  },
});
