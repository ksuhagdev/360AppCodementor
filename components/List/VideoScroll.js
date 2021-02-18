
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  TouchableOpacity, Platform, SafeAreaView,StatusBar,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
// import Video from 'react-native-video';

import  Video  from 'react-native-video';
import { Swipeable } from 'react-native-gesture-handler';
import NumberShortner from '../../utils/NumberShortner'
const { height, width } = Dimensions.get('window');

const cellHeight = height * 0.6;
const cellWidth = width;

const viewabilityConfig = {
  itemVisiblePercentThreshold: 95,
};

const propertyImage = require('../../assets/image/property-placeholder.png');
const bedImg = require('../../assets/image/bed.png');
const bathImg = require('../../assets/image/bathroom.png');
const garageImg = require('../../assets/image/car.png');
const defaultAgentPic = require('../../assets/image/default-profile-pic.png');


class Item extends React.PureComponent {
  componentWillUnmount() {
    if (this.video) {
      this.video.unloadAsync();
    }

    state={
      likes: this.props.total_likes,
      shares: this.props.total_shares,
      isliked: this.props.is_liked,
      iconColor: this.props.is_liked ? '#f00' : '#fff'
    }
  }

  async play() {
    const status = await this.video.getStatusAsync();
    if (status.isPlaying) {
      return;
    }
    return this.video.playAsync();
  }

  pause() {
    if (this.video) {
      this.video.stopAsync();
    }
  }

   getMainVideo (videos) {
    let video = null;
    console.log("Videos inside getMainVideo", videos)
    if (videos && videos.length) {
      video = videos.find(vid => {
        return vid.video_type === 'kitchen';
      });

      // console.log("Main Video", video)

      if (!video) {
        video = videos[0]; // assign random video instead
      }
    }

    return video;
  };

  render() {
    const { id, main_image_url,video_url, videos,hashtags, agents, suburb, campaign_type, street } = this.props;
    const property = this.props
    const uri = this.getMainVideo(videos).video_url + '?bust=' + id;
    


    console.log("ID POSTER url", uri)
    return (
      <>
      <StatusBar translucent={false} backgroundColor="rgba(0, 0, 0, 0.1)" barStyle="light-content" />

      <SafeAreaView style={styles.cell}>
        <Image
          source={{
            uri: main_image_url,
            cache: 'force-cache',
          }}
          style={[styles.full, styles.poster]}
        />
        <Video
          ref={(ref) => {
            this.video = ref;
          }}
          source={{ uri }}
          shouldPlay={true}
          isLooping
          
          resizeMode="cover"
          
          style={styles.full}
        />

        <View style={styles.overlay} />
        <View style={styles.safeareaContainer}>
          <View style={styles.summary}>
            {street && (

              <View style={[styles.propertyDetails, styles.propertyAddress]}>
                <Text style={[styles.text, styles.textShadow]}>
                  {street}, {suburb}
                </Text>
              </View>

            )}

            <View style={styles.propertyDetails}>
              <View style={[styles.detail, styles.primaryBg]}>
                <Text style={styles.text}>{suburb}</Text>
              </View>

              <View style={[styles.detail, styles.primaryBg]}>
                <Text style={[styles.text, styles.uppercase]}>SALE</Text>
              </View>
            </View>
          </View>
          <View style={[styles.flexRow, styles.propertyInfoContainer]}>
          <View style={styles.flex}>
            <View style={[styles.propertyInfo, styles.flexRow]}>
              <View style={styles.infoIcon}>
                <Image source={bedImg} style={styles.propertyInfoIcon} />
                <Text style={[styles.text, styles.propertyInfoText, styles.textShadow]}>{property.num_bedrooms}</Text>
              </View>

              <View style={styles.infoIcon}>
                <Image source={bathImg} style={styles.propertyInfoIcon} />
                <Text style={[styles.text, styles.propertyInfoText, styles.textShadow]}>{property.num_bathrooms}</Text>
              </View>

              <View style={styles.infoIcon}>
                <Image source={garageImg} style={styles.propertyInfoIcon} />
                <Text style={[styles.text, styles.propertyInfoText, styles.textShadow]}>{property.num_garages}</Text>
              </View>
            </View>

    
          </View>

          <View style={styles.actions}>
            <View style={styles.btnsContainer}>
        
              <View style={styles.btns}>
                <TouchableOpacity>
                  <Icon style={[styles.alignCenter]} name="favorite" size={35} color={'#f00'} />
                </TouchableOpacity>

                {/* <Text style={styles.text}>{NumberShortner.abbrNumber(this.state.likes)}</Text> */}
              </View>

              <TouchableOpacity>
                <View style={styles.btns}>
                  <Icon style={styles.alignCenter} name="share" size={35} color="#fff" />
                  {/* <Text style={styles.text}>{NumberShortner.abbrNumber(this.state.shares)}</Text> */}
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        </View>
      </SafeAreaView>
      </>
    );
  }
}



class VideoScroll extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: this.props.navigation.getParam('data'),

    }
    this.cellRefs = {};
    // console.log("Data to Show", this.props.navigation.getParam('data'))
  }
  componentDidMount() {
    this.loadItems();
    setTimeout(this.loadItems, 1000);
    setTimeout(this.loadItems, 1100);
    setTimeout(this.loadItems, 1200);
    setTimeout(this.loadItems, 1300);
  }

  onBackPressed() {
    this.props.navigation.pop(1)
  }
  _onViewableItemsChanged = (props) => {
    const changed = props.changed;
    changed.forEach((item) => {
      const cell = this.cellRefs[item.key];
      if (cell) {
        console.log("IS item visible", item)
        if (item.isViewable) {
          cell.play();
        } else {
          cell.pause();
        }
      }
    });
  };
  _renderItem = ({ item }) => {
    // console.log("IEM TOBE DISPLAYED", item)
    return (
      <Swipeable>
        <Item
          ref={(ref) => {
            this.cellRefs[item.id] = ref;
          }}
          // onBackPressed={this.onBackPressed()}
          {...item}
        />
      </Swipeable>
    );
  };

  loadItems = () => {
    const start = this.state.data.length;
    const newItems = this.state.data.map((item, i) => ({
      ...item,
      id: start + i,
    }));
    const items = [...this.state.data, ...newItems];
    this.setState({ items });
  };

  render() {
    const { data } = this.state;
    return (
      <View style={styles.container}>


        <FlatList
          style={{ width: '100%' }}
          data={data}
          renderItem={this._renderItem}
          keyExtractor={(item) => item.id}
          onViewableItemsChanged={this._onViewableItemsChanged}
          initialNumToRender={3}
          maxToRenderPerBatch={3}
          pagingEnabled={true}
          initialScrollIndex={this.props.navigation.getParam('CurrentIndex')}
          // windowSize={5}
          scrollEventThrottle={15}
          getItemLayout={(_data, index) => ({
            length: Dimensions.get('screen').height,
            offset: Dimensions.get('screen').height * index,
            index,
          })}
          viewabilityConfig={viewabilityConfig}
          removeClippedSubviews={true}

        />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  safeareaContainer: {

    height: '100%',

  },propertyInfoText: {
    fontSize: 13,
    marginLeft: 10,
  },propertyInfoIcon: {
    width: 19,
    height: 18,
  },
  cell: {
    height: Platform.OS === 'android' ? Dimensions.get('window').height -70 : Dimensions.get('window').height,
    //  height: Dimensions.get('window').height,
    // height:'100%',
    width: '100%',
    paddingTop: 40,
    backgroundColor: '#000',
    flex: 1,
  },propertyInfoContainer: {
    position: 'absolute',
    width: '100%',
    left: 0,
    bottom: '15%',
    paddingHorizontal: 20,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 40,
  },
  full: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  poster: {
    resizeMode: 'cover',
  },
  overlayText: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  }, primaryBg: {
    backgroundColor: '#d81b60',
  },
  summary: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 12,
    width: '100%',
  }, uppercase: {
    textTransform: 'uppercase',
  }, propertyInfoContainer: {
    position: 'absolute',
    width: '100%',
    left: 0,
    bottom: '15%',
    paddingHorizontal: 20,
  },
  text: {
    color: '#ffffff',
    fontFamily: 'font-regular',
    fontSize: 11,
    marginTop: 3,
  },infoIcon: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginRight: 15,
  },
  textShadow: {
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 4,
  }, backBtnContainer: {
    position: 'absolute',
    top: 40,
    left: 10,
  }, detail: {
    borderRadius: 4,
    marginHorizontal: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  propertyDetails: {
    flexDirection: 'row',
  },
  propertyAddress: {
    position: 'absolute',
    right: 20,
    top: 15,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  hashtagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  hashTags: {
    fontSize: 12,
    lineHeight: 20,
    flexWrap: 'wrap',
    paddingRight: 8,
  },
  infoIcon: {
    alignItems: 'center',
    flexDirection: 'row', 
    flexWrap: 'wrap',
    marginRight: 15,
  },
  flex: {
    flex: 1,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
});
export default VideoScroll