import React, { Component } from 'react';
import Video from 'react-native-video';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { StyleSheet, View, Text, ActivityIndicator, Alert, Modal, Platform } from 'react-native';
import { RNFFmpeg, RNFFmpegConfig } from 'react-native-ffmpeg';
import RNFS from 'react-native-fs';
import { TitleTextField } from '../../../components/TextField/index';
import GradientButton from '../../../components/Button';
import { uploadPropertyVideo } from '../../../actions/property/index';
import { RecordComplete } from './sessions';
import request from '../../../helper/functions/request'
import axios from 'axios';
class EditVideo extends Component {
  static navigationOptions = {
    title: 'Edit video',
    headerMode: 'none',
    headerShown: false,
  };

  state = {
    isVideoPaused: false,
    selectedAudio: null,
    outputUri: null,
    isBeingInterlaced: false,
    isModalVisible: false,
    videoText: '',
    fontDir: Platform.OS === 'ios' ? '/System/Library/Fonts/CoreUI/SFUI.ttf' : '/system/fonts/Roboto-Medium.ttf',
    isNextEnabled: true,
    recentFile: null,
  };

  unsubscribe = null;

  componentDidMount(newProps) {
    // if (process.env.NODE_ENV === 'production') {
    //   RNFFmpegConfig.disableLogs();
    // }
    console.log("Video Recording in EDIT")
    RNFFmpegConfig.disableLogs();
    this.deleteVideoCache();
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    const selectedAudio = newProps.navigation.getParam('selectedAudio');
    console.log("Selected Audio", selectedAudio)
    if (selectedAudio) {
      this.setState({ selectedAudio });
      this.onAudioSelected(selectedAudio);
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  onAudioSelected = async selectedAudio => {
    let outFile;
    
    if (this.state.videoText) {
      outFile = `${RNFS.CachesDirectoryPath}/music.mp4`;

      const outFileExists = await RNFS.exists(outFile);

      if (outFileExists) {
        try {
          await RNFS.unlink(outFile);
        } catch (e) {
          console.error('Could not delete file music.mp4');
        }
      }
      // Take pristine file, apply text overlay and output to music.mp4
      await this.overlayText(null, outFile);
    }

    // Take music.mp4 with text overlay, apply overlay music and write to output.mp4
   await this.interlaceMusic(selectedAudio, outFile);
  };

  onTextSelected = async () => {
    let outFile;

    if (this.state.selectedAudio) {
      outFile = `${RNFS.CachesDirectoryPath}/text.mp4`;

      const outFileExists = await RNFS.exists(outFile);

      if (outFileExists) {
        try {
          await RNFS.unlink(outFile);
        } catch (e) {
          console.error('Could not delete file text.mp4');
        }
      }

      // Take pristine file, apply music overlay and output to text.mp4
      await this.interlaceMusic(this.state.selectedAudio, null, outFile);
    }

    // Take text.mp4 with music overlay, apply text overlay and write to output.mp4
    await this.overlayText(outFile);
  };

  interlaceMusic = async (selectedAudio, inputFile, outputFile) => {
    
    const { navigation } = this.props;
    const videoUri = inputFile ? `file://${inputFile}` : navigation.getParam('videoUri', null);
    
    const bundlePath = Platform.OS === 'ios' ? RNFS.MainBundlePath : RNFS.CachesDirectoryPath;
    const outputUri = outputFile || `${RNFS.CachesDirectoryPath}/output.mp4`;
    const audioFilter = '[0:a]aformat=fltp:44100:stereo,apad[0a];[1]aformat=fltp:44100:stereo,volume=0.30[1a];[0a][1a]amerge[a]';

      const outFileExists = await RNFS.exists(outputUri);

     if (outFileExists) {
       try {
         await RNFS.unlink(outputUri);
       } catch (e) {
         console.error('Could not delete file text.mp4');
       }
     }
 
     this.setState({
      outputUri: null,
      isBeingInterlaced: true,
      selectedAudio: selectedAudio.song_url,
    });
    
    console.log("Video Url", videoUri)
    // if (Platform.OS === 'android') {
    //   // Copy audio file to cache dir from res/raw
    //   try {
    //     await RNFS.copyFileRes(selectedAudio, `${RNFS.CachesDirectoryPath}/${selectedAudio}`);
    //   } catch (e) {
    //     Alert.alert('Interlacing error', 'Something went wrong while adding music to your video.');
    //     this.setState({ isBeingInterlaced: false });
    //     console.error('Interlacing error:');
    //     console.error(e);
    //   }
    // }
    console.log("Music Locat", selectedAudio)
    const ffCommand = [
      '-y',
      '-i',
      videoUri,
      '-i',
      `${selectedAudio.song_url}`,
      '-c:v',
      'copy',
      // '-shortest',
      // '-filter_complex',
      // `${audioFilter}`,
      // '-map',
      // '0:v',
      // '-map',
      // '[a]',
      // '-ac',
      // '2',
      // '-preset',
      // 'ultrafast',
      '-shortest',
      '-c:a' ,'aac',
      '-map' ,'0:v:0', '-map','1:a:0',
      // 
      outputUri,
    ];

    // const ffCommand = [
    //   '-y','-i', videoUri, '-i', `${selectedAudio}`
    // ]

    // if(navigation.getParam('Trim')){
    //   var time = navigation.getParam('values')
    //   ffCommand = [
    //     '-y',
    //     '-ss', `${time.startTime}`,
    //     '-i',
    //     videoUri,
    //     '-to', `${time.toTime}`,
    //     '-i',
    //     `${bundlePath}/${selectedAudio}`,
    //     '-c:v',
    //     'copy',
    //     '-shortest',
    //     '-filter_complex',
    //     `${audioFilter}`,
    //     '-map',
    //     '0:v',
    //     '-map',
    //     '[a]',
    //     '-ac',
    //     '2',
    //     '-preset',
    //     'ultrafast',
    //     outputUri,
    //   ];
  
    // }

    
    try {
      const result = await RNFFmpeg.executeWithArguments(ffCommand);
      console.log('FFmpeg process exited with rc: ', result);
      this.setState({
        outputUri,
      });
    } catch (e) {
      console.error('Interlacing error: ', e);
    } finally {
      this.setState({
        isBeingInterlaced: false,
      });

      // if (Platform.OS === 'android') {
      //   // cleanup caches dir
      //   try {
      //     await RNFS.unlink(`${RNFS.CachesDirectoryPath}/${selectedAudio}`);
      //   } catch (e) {
      //     console.error('Could not delete cached audio overlay file from Android cache directory: ', e);
      //   }
      // }
    }
  };

  overlayText = async (inputFile, outputFile) => {
    const { navigation } = this.props;
    const videoUri = inputFile ? `file://${inputFile}` : navigation.getParam('videoUri', null);
    const outputUri = outputFile || `${RNFS.CachesDirectoryPath}/output.mp4`;
    const fontSize = Platform.OS === 'ios' ? 32 : 64;
    const boxHeight = Platform.OS === 'ios' ? 88 : 176;
    const drawBoxFilter = `drawbox=y=ih/PHI:color=black@0.4:width=iw:height=${boxHeight}:t=fill, drawtext=text='${this.state.videoText}':fontfile=${
      this.state.fontDir
    }:fontsize=${fontSize}:fontcolor=yellow@0.9:x=(w-tw)/2:y=(h/PHI)+th`;

    this.setState({
      outputUri: null,
      isBeingInterlaced: true,
    });

    let res;

    try {
      res = await RNFS.exists(`${RNFS.CachesDirectoryPath}/output.mp4`);
    } catch (err) {
      console.error('Video file not found');
    }

    const ffCommand = ['-y', '-i', videoUri, '-shortest', '-filter_complex', `${drawBoxFilter}`, '-preset', 'ultrafast', outputUri];

    try {
      const result = await RNFFmpeg.executeWithArguments(ffCommand);

      this.setState({
        outputUri,
        isBeingInterlaced: false,
        isModalVisible: false,
      });

      console.log('FFmpeg process exited with rc: ', result);
    } catch (e) {
      console.error('Interlacing error: ', e);

      this.setState({
        isBeingInterlaced: false,
        isModalVisible: false,
      });
    }
  };

  handleChange = (value, key) => {
    this.setState({ [key]: value });
  };

  openTextModal = () => {
    this.setState({
      isModalVisible: true,
    });
  };

  saveVideoToServer = async() => {
    const { navigation } = this.props;
    const videoUri = navigation.getParam('videoUri', null);
    const videoType = navigation.getParam('videoType', null);
    const propertyId =  navigation.getParam('propertyId');
    const outputUri = `${RNFS.CachesDirectoryPath}/output.jpg`;
    const ffCommand = `-y -ss 00:00:03 -i ${videoUri}  -frames:v 1 -q:v 4 ${outputUri}`;
    const finalVideoMain = `${RNFS.CachesDirectoryPath}/output6.mp4`;
   const rotateVideo = `-i ${this.state.outputUri || videoUri} -c copy -metadata:s:v:0 rotate=90 ${finalVideoMain}`;
await RNFFmpeg.execute(rotateVideo)
    // const finalvideourl = Platform.OS === 'android' && finalVideoMain ? `file://${}` : this.state.outputUri
    await RNFFmpeg.execute(ffCommand)
    let url = `http://13.211.132.117:3600/property-videos/vod/${propertyId}/1`;
    console.log("URL", url)
    const createFormData = () => {
      // console.log("Payload", payload)
      const data = new FormData();
  
      data.append('files[]', { uri: finalVideoMain, type: 'video/mp4', name: 'video_file.mp4' });
      data.append('files[]', { uri: `file://${outputUri}`, type: 'image/jpeg', name: 'video_file.jpg' });
      data.append('title', videoType);
      data.append('video_type', videoType);
      
      return data;
    };
console.log("Payload", createFormData())
// await request({
//   url: `/users/profile/${user.id}`,
//   config: {
//     method: 'GET',
//   },
// });

    try{
      await request( {
      url:url,
      config:{
        method: 'POST',
        body: createFormData(),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      }
     
    });

    navigation.pop(2);
  }
    catch(e){
      console.log("ERror",e)
    }
    // RNFFmpeg.execute(ffCommand)
    //   .then(result => {
    //     this.props
    //       .uploadPropertyVideo({
    //         video_type: videoType,
    //         files: [finalvideourl || videoUri, `file://${outputUri}`],
    //       })
    //       .then(
    //         ({ propertyId, propertyTitle }
    //         ) => {
           
    //         if (propertyId) {
    //           navigation.navigate('PropertyAddress', { propertyId, title: propertyTitle });
    //           this.deleteVideoCache();
    //         } else {
    //           Alert.alert('', 'No property ID set for uploading property video', [{ text: 'OK' }]);
    //         }
    //       })
    //       .catch(error => {
    //         console.error(error);
    //       });

    //     console.log('FFmpeg process exited with rc ', result);
    //   })
    //   .catch(err => {
    //     console.error('screenshot error', err);
    //   });
  };

  // Sometimes, shooting a second video and running ffmpeg causes
  // the previous video output to be used. This ensures that old
  // files are deleted from temp cache
  deleteVideoCache = async () => {
    const textVideoPath = `${RNFS.CachesDirectoryPath}/text.mp4`;
    const audioVideoPath = `${RNFS.CachesDirectoryPath}/music.mp4`;
    const outputVideoPath = `${RNFS.CachesDirectoryPath}/output.mp4`;
    const imagePath = `${RNFS.CachesDirectoryPath}/output.jpg`;

    try {
      const textVideoExists = await RNFS.exists(textVideoPath);
      const audioVideoExists = await RNFS.exists(audioVideoPath);
      const outputVideoExists = await RNFS.exists(outputVideoPath);
      const imageExists = await RNFS.exists(imagePath);

      if (textVideoExists) {
        await RNFS.unlink(textVideoPath);
      }

      if (audioVideoExists) {
        await RNFS.unlink(audioVideoPath);
      }

      if (outputVideoExists) {
        await RNFS.unlink(outputVideoPath);
      }

      if (imageExists) {
        await RNFS.unlink(imagePath);
      }
    } catch (error) {
      console.error('RNFS file deletion error: ', error);
    }
  };

  render() {
    const { navigation } = this.props;
    const { isVideoPaused, outputUri, isBeingInterlaced } = this.state;
    const videoUri = navigation.getParam('videoUri', null);
    return (
      <View style={styles.loadingContainer}>
        <Video
          repeat
          source={{ uri: outputUri || videoUri }}
          ref={videoRef => {
            this.player = videoRef;
          }}
          paused={isVideoPaused}
          onBuffer={this.onBuffer}
          onError={this.videoError}
          resizeMode={'cover'}
          style={styles.backgroundVideo}
        />
        <View style={styles.cameraContents}>
          <RecordComplete
            navigation={navigation}
            outputUri={outputUri}
            saveVideoToServer={this.saveVideoToServer}
            openTextModal={this.openTextModal}
            videoUri={videoUri}
            isNextEnabled={this.state.isNextEnabled}
          />
        </View>
        {isBeingInterlaced && (
          <View style={styles.loader}>
            <ActivityIndicator size="large" />
            <Text style={styles.loadingText}>Processing video...</Text>
          </View>
        )}

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.isModalVisible}
          hardwareAccelerated={true}
          onRequestClose={() => this.setState({ isModalVisible: false })}
          presentationStyle={'formSheet'}>
          <View style={styles.modalContainer}>
            <TitleTextField
              title="Video Text"
              value={this.state.videoText}
              editable={!isBeingInterlaced}
              autoCapitalize="none"
              autoCorrect={false}
              handleChange={text => this.handleChange(text, 'videoText')}
            />
            <GradientButton
              isActive={this.state.isBeingInterlaced}
              style={styles.modalBtn}
              onPress={() => {
                this.onTextSelected();
              }}>
              Save
            </GradientButton>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cameraContents: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    padding: 20,
    paddingTop: 30,
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    display: 'flex',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  loader: {
    zIndex: 10,
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  loadingText: {
    padding: 6,
    marginTop: 20,
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    fontSize: 12,
  },
  modalBtn: {
    marginTop: 30,
  },
  modalContainer: {
    marginHorizontal: 30,
    marginTop: 30,
  },
  processingView: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  playPause: {
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
  },
});

const mapDispatchToProps = dispatch => bindActionCreators({ uploadPropertyVideo }, dispatch);

export default connect(
  null,
  mapDispatchToProps,
)(EditVideo);
