import React, { Component } from 'react';
import { SafeAreaView, View, StyleSheet, ScrollView, Text, Image, TouchableOpacity, Platform } from 'react-native';
import Sound from 'react-native-sound';
import RNFS from 'react-native-fs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import GradientButton from '../../../components/Button';
import arrowIcon from '../../../assets/image/arrow-right.png';
import data from './data';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getMusicList} from '../../../actions/property';
import {getMusicFiles} from '../../../reducers/agent'

let soundRef = null;
 class TrackList extends Component {
  state = {
    selectedAudio: null,
    selectedIndex: null,
    songs: [],
  };

  togglePlayPause = () => {
    const { isVideoPaused } = this.state;
    this.setState({
      isVideoPaused: !isVideoPaused,
    });
  };

  async componentWillMount() {
    await this.props.getMusicList()
   // console.log("In side Tracks", this.props.musicFiles)
    const files = this.props.musicFiles
    // const files = Platform.OS === 'ios' ? await RNFS.readDir(RNFS.MainBundlePath) : data; // On Android, use custom data structure because it's a PITA :(

    this.setState({
      songs: files
        // .map(file => {
        //   return {
        //     title: file.title,
        //   };
        // }),
    });
  }

  componentWillUnmount() {
    this.destroySoundRef();
  }

  destroySoundRef = () => {
    if (soundRef) {
      soundRef.stop();
      soundRef.release();
      soundRef = null;
    }
  };

  selectAndPlayMusic = (song, index) => {
    // const musicFileName = Platform.OS === 'ios' ? song.title : song.title.toLowerCase();
    // const musicFileName = Platform.OS === 'ios' ? '1111.mp3' : 'aaa.mp3';
    const musicFileName = song
    this.destroySoundRef();
    // console.log(musicFileName);
    //console.log("Playing song", song)
    soundRef = new Sound(musicFileName.song_url, '', error => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
      // loaded successfully
      // console.log(`duration in seconds: ${soundRef.getDuration()}number of channels: ${soundRef.getNumberOfChannels()}`);

      this.setState({
        selectedAudio: musicFileName,
        selectedIndex: index,
      });
      // Play the sound with an onEnd callback
      soundRef.play(success => {
        if (success) {
          console.log('successfully finished playing');
        } else {
          console.log('playback failed due to audio decoding errors');
        }
      });
    });
  };

  goBackToInterlacing = () => {
    const { navigation } = this.props;
    const { selectedAudio } = this.state;
    const videoType = navigation.getParam('videoType', null);
    navigation.navigate('EditVideo', {
      videoUri: navigation.getParam('videoUri', null),
      videoType,
      selectedAudio,
    });
  };

  render() {
    const { selectedAudio, songs } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={[styles.songListContainer, styles.container]}>
            {songs.map((song, index) => (
              <SongList playSong={this.selectAndPlayMusic} item={song} key={index} index={index} selectedIndex={this.state.selectedIndex} />
            ))}
          </View>
        </ScrollView>

        {selectedAudio && (
          <View style={styles.p20}>
            <GradientButton onPress={this.goBackToInterlacing}>Select this Song</GradientButton>
          </View>
        )}
      </SafeAreaView>
    );
  }
}

TrackList.navigationOptions = {
  title: 'Instrumental',
};

function SongList({ item, index, selectedIndex, playSong }) {
  console.log('Song List', item)
  return (
    <TouchableOpacity onPress={() => playSong(item, index)}>
      <View style={styles.songContainer}>
        {/* <Image source={item.albumArt} style={{ width: 60, height: 60 }} /> */}
        <View style={styles.textContainer}>
          <Text style={styles.textMain}>{item.title.split('_').join(' ')}</Text>
          {/* <Text style={styles.textSub}>{item.artist}</Text>
          <Text style={styles.textSub}>{item.length}</Text> */}
          {index === selectedIndex && <Icon name="check" color="#000" size={20} style={styles.selectedIcon} />}
        </View>

        <View>
          <Image source={arrowIcon} style={styles.arrowIcon} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  arrowIcon: {
    width: 12,
    height: 12,
  },
  container: {
    flex: 1,
  },
  p20: {
    padding: 20,
  },
  selectedIcon: {
    position: 'absolute',
    alignSelf: 'center',
    right: 20,
  },
  songContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    borderBottomWidth: 0.5,
  },
  songListContainer: {
    paddingHorizontal: 20,
    paddingTop: 0,
  },
  textContainer: {
    marginLeft: 0,
    flex: 1,
  },
  textMain: {
    fontSize: 15,
    fontFamily: 'font-regular',
    lineHeight: 18,
  },
  textSub: {
    fontSize: 13,
    lineHeight: 16,
    fontFamily: 'font-light',
    color: 'rgba(0,0,0,0.5)',
  },
});

const mapDispatchToProps = dispatch => bindActionCreators({getMusicList}, dispatch);
const mapStateToProps = state => {
  
  return {musicFiles: state.agent.musicFiles}
}
export default connect(mapStateToProps, mapDispatchToProps)(TrackList)