import React, { Component } from 'react';
import { StyleSheet, Text, View, Linking, AppState, SafeAreaView,ScrollView, TouchableOpacity } from 'react-native';
import { RESULTS } from 'react-native-permissions';
import { RNCamera } from 'react-native-camera';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { Recording } from './sessions';
import { NoCameraPermission } from '../../../components/helper/NoPermission';
import { requestCamera } from '../../../helper/functions/permission';
import * as Progress from 'react-native-progress'
import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

let timerRef = null;
const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

export default class CameraSession extends Component {
  static navigationOptions = {
    title: 'Home',
    headerMode: 'none',
    headerShown: false,
  };

  state = {
    videoLength: 15,
    isRecording: false,
    countdown: 0,
    isFrontCamera: false,
    isFlashEnabled: false,
    hasPermission: false,
    isBlocked: false,
  };

  componentDidMount() {
    this.requestPermission();
  }

  requestPermission = async () => {
    const status = await requestCamera();

    switch (status) {
      case RESULTS.GRANTED:
        this.setState({ hasPermission: true, isBlocked: false });
        break;
      case RESULTS.DENIED:
        this.setState({ hasPermission: false, isBlocked: false });
        break;
      case RESULTS.BLOCKED:
        this.setState({ hasPermission: false, isBlocked: true });
        break;
    }
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

  handleAppState = appState => {
    if (appState === 'active') {
      if (!this.state.hasPermission) {
        this.requestPermission();
        AppState.removeEventListener('change', this.handleAppState);
      }
    }
  };

  handlePermission = () => {
    if (this.state.isBlocked) {
      AppState.addEventListener('change', this.handleAppState);
      Linking.openSettings();
    } else {
      this.requestPermission();
    }
  };

  startRecorder = () => {
    if (this.camera && this.camera.current) {
      this.camera.current.open({ maxLength: 30 }, (data) => {
        console.log('captured data', data);
      })
    }
  }


  render() {
    const { countdown, isRecording, videoLength, isFrontCamera, isFlashEnabled } = this.state;
    const { navigation } = this.props;

    if (!this.state.hasPermission) {
      return <NoCameraPermission requestCamera={this.handlePermission} />;
    }
    // return(
    //   <>
    //     {/* <StatusBar barStyle="dark-content" /> */}
    //     <SafeAreaView>
    //       <ScrollView
    //         contentInsetAdjustmentBehavior="automatic"
    //         style={stylestest.scrollView}>
    //         <View style={stylestest.body}>
    //           <View style={stylestest.sectionContainer}>
    //             <TouchableOpacity onPress={this.startRecorder()} style={stylestest.btnCapture}>
    //               <Text style={stylestest.sectionTitle}>Capture video</Text>
    //             </TouchableOpacity>
    //           </View>
    //         </View>
    //       </ScrollView>
    //     </SafeAreaView>
    //     <VideoRecorder ref={ref => {
    //           this.camera = ref;
    //         }} compressQuality={'medium'} />
    //   </>);
    return (
      <View style={styles.container}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          autoFocus={RNCamera.Constants.AutoFocus.on}
          captureAudio={true}
          videoStabilizationMode={'cinematic'}
          defaultVideoQuality={RNCamera.Constants.VideoQuality['720p']}
          style={styles.preview}
          type={isFrontCamera ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back}
          flashMode={isFlashEnabled ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
        />
        {isRecording && (
          <>
          <View style={{marginTop: Platform.OS === 'ios' ? 50: 0}}>
          <Progress.Bar progress={countdown/videoLength} width={null}/>
          </View>
          {/* <View>
            <Text style={styles.countdown}>{countdown}s</Text>
          </View> */}
          </>
        )}

        <View style={styles.cameraContents}>
          <Recording
            isRecording={isRecording}
            toggleFlash={this.toggleFlash}
            toggleCameraDirection={this.toggleCameraDirection}
            videoLength={videoLength}
            setVideoLength={this.setVideoLength}
            handlePress={this.startVideoCapture}
            stopVideo={this.stopVideo}
            navigation={navigation}
          />
        </View>
      </View>
    );
  }

  toggleFlash = () => {
    this.setState({
      isFlashEnabled: !this.state.isFlashEnabled,
    });
  };

  toggleCameraDirection = () => {
    this.setState({
      isFrontCamera: !this.state.isFrontCamera,
    });
  };
  stopVideo = async () => {
    const { navigate } = this.props.navigation;

    console.log("Stop Video")
    this.camera.stopRecording()
    this.setState({isRecording: false})
    clearInterval(timerRef);
    if (this.camera) {
      
      const { navigation } = this.props;
      const videoType = navigation.getParam('videoType', null);
      const data = await this.camera.recordAsync({ mute: false , orientation:'portrait',videoBitrate: 15*1000*1000 , forceUpOrientation: true, fixOrientation: true});
      console.log("Navigation", data.uri)
      navigate('EditVideo', {
        videoUri: data.uri,
        videoType,
        Trim:false,
      });
    }
  };
  startVideoCapture = async () => {
    const { videoLength } = this.state;
    const { navigate } = this.props.navigation;

    this.setState(
      {
        countdown: 0,
        isRecording: true,
      },
      () => {
        timerRef = setInterval(() => {
          const { countdown } = this.state;
          let isRecording = true;
          if (countdown === videoLength) {
            isRecording = false;
            this.camera.stopRecording();
            clearInterval(timerRef);
          }
          // console.log("Countdown", videoLength/countdown)
          this.setState({
            isRecording,
            countdown: countdown + 1,
          });
        }, 1000);
      },
    );

    if (this.camera) {
      
      const { navigation } = this.props;
      const videoType = navigation.getParam('videoType', null);
      const data = await this.camera.recordAsync({ mute: false , orientation:'portrait',videoBitrate: 15*1000*1000 , forceUpOrientation: true, fixOrientation: true});
      console.log("Navigation", data.uri)
      navigate('EditVideo', {
        videoUri: data.uri,
        videoType,
        Trim:false,
      });
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
    justifyContent: 'space-between',
    fontSize: 14,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  cameraContents: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    padding: 20,
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 30,
  },
  timerSection: {
    alignItems: 'center',
    position: 'absolute',
    top: 10,
    width: '100%',
  },
  countdown: {
    marginTop: 20,
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
    position: 'absolute',
    height: '100%',
    width: '100%',
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
