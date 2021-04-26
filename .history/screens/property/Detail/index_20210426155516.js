import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  Alert,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Easing,ImageBackground,
  StyleSheet, Animated,
  Dimensions, Button, Modal,
  ActivityIndicator, StatusBar, Platform, FlatList,
} from 'react-native';



import TextTicker from 'react-native-text-ticker'

import Icon from 'react-native-vector-icons/MaterialIcons';

// import Modal from 'react-native-modal'
import Iconss from 'react-native-vector-icons/Entypo'

import Video from 'react-native-video';

// import convertToProxyURL from 'react-native-video-cache';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'

import NumberShortner from '../../../utils/NumberShortner'; 
import Lottie from 'lottie-react-native';
import musicFly from '../../../assets/lottie-animations/music-fly.json';

import { Root } from 'popup-ui'
// import MediaControls, {PLAYER_STATES} from 'react-native-media-controls'
// import convertToProxyURL from 'react-native-video-cache'

const propertyImage = require('../../../assets/image/property-placeholder.png');

const propertyPlaceholder = require('../../../assets/image/property.png')

const defaultAgentPic = require('../../../assets/image/default-profile-pic.png');


export default function PropertyDetail({ property, shouldPlay, navigation, video }) {
  const [state, setState] = useState({
    showLoadingIndicator: true,
  });
  console.log("Property", property)
  const data = [
    {
      imageUrl: "http://via.placeholder.com/160x160",
      title: "something"
    },
    {
      imageUrl: "http://via.placeholder.com/160x160",
      title: "something two"
    },
    {
      imageUrl: "http://via.placeholder.com/160x160",
      title: "something three"
    },
    {
      imageUrl: "http://via.placeholder.com/160x160",
      title: "something four"
    },
    {
      imageUrl: "http://via.placeholder.com/160x160",
      title: "something five"
    },
    {
      imageUrl: "http://via.placeholder.com/160x160",
      title: "something six"
    }
  ];

  // const rotate = useRotation()

  // const animatedStyle = {transform : [{rotate}]}



const [pauseVideo, setPauseVideo] =useState(false)
  const [likes, setLikes] = useState(property.total_likes);
  const [shares, setShares] = useState(property.total_shares);
  const [isLiked, setIsLiked] = useState(property.is_liked || false);
  const [musicModalVisible, setMusicModalVisible] = useState(false)
  // const [musicModalVisible, setm]
  const [iconColor, setIconColor] = useState(property.is_liked ? '#f00' : '#fff');
  // const { accessToken } = useSelector(store => store.account);
  const [isModalVisible, setModalVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false)
  const dispatch = useDispatch();

  const [videos, setVideo] = useState()
  const imageUrl = property.main_image_url ? { uri: property.main_image_url } : propertyImage;
  const placeholderImage = propertyImage;
  const videoPlayer = useRef(null)
  


  

  const getMainVideo = videos => {
    let video = null;

    if (videos && videos.length) {
      video = videos.find(vid => {
        return vid.video_type === 'main';
      });

      // console.log("Main Video", video)

      if (!video) {
        video = videos[0]; // assign random video instead
      }
    }

    return video;
  };

  const getCampaignType = campaignType => {
    let type = 'Rent';

    switch (campaignType) {
      case 'PRIVATE_SALE':
        type = 'Sale';
        break;
      case 'AUCTION':
        type = 'Sale (Auction)';
        break;
      default:
        type = 'Rent';
    }

    return type;
  };

  const onBuffer = () => {
    console.log("Video Time when Buffering", new Date().getTime())

    setState({
      ...state,
      showLoadingIndicator: false,
    });
  };

  const onLoad = () => {
    console.log("During Load of Video", new Date().getTime());
    setState({
      ...state,
      showLoadingIndicator: false,
    });
  };

  useEffect(() => {
    setVideo(getMainVideo(property.videos).video_url)

  }, [property])

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

  var minprice = (property.prices[0].min_price/1000)
  var maxprice = (property.prices[0].max_price/1000)

  return (
    <Root>
      <View style={styles.propertyContainer}>
        {video && getMainVideo(property.videos) ? (
          <>
            {state.showLoadingIndicator && (
         
              <Image source={{ uri: property.main_image_url }} resizeMode="cover" style={styles.propertyImage} loadingIndicatorSource={placeholderImage} />
            )}
            <Video
              repeat={true}
              source={{ uri: getMainVideo(property.videos).video_url }}
              poster={getMainVideo(property.videos).thumbnail_url}
              onBuffer={onBuffer}
              onLoadStart={() => { console.log("Video Time when start", new Date().getTime()) }}
              onLoad={onLoad}
              rate={1.0}
              posterResizeMode="cover"
              resizeMode={'cover'}
              ref={(ref) => (videoPlayer.current)}
              paused={!shouldPlay || pauseVideo}
              progressUpdateInterval={250.0}
              ignoreSilentSwitch="ignore"
              style={styles.backgroundVideo}
              playInBackground={false}
              bufferConfig={{
                minBufferMs: 1000,
                maxBufferMs: 1500,
                bufferForPlaybackMs: 0,
                bufferForPlaybackAfterRebufferMs: 500
              }}
            />
          </>
        ) : (
            <Image source={{ uri: property.main_image_url }} resizeMode="cover" style={styles.propertyImage} loadingIndicatorSource={placeholderImage} />
          )}
    
       
        </View>
    </Root>
  );
}




const styles = StyleSheet.create({
  actions: {
    position: 'absolute',
    right: 10,
  },
  agentImg: {
    borderColor: '#fff',
    borderRadius: 50,
    borderWidth: 1,
    height: 48,
    width: 48,
  },
  alignCenter: {
    alignSelf: 'center',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  btns: {
    alignItems: 'center',
    marginHorizontal: 2,
    marginVertical: 8,
    position: 'relative',
    // marginBottom: 10,
  }, buttonWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  btnsContainer: {
    alignItems: 'flex-end',
    flexDirection: 'column',
  },
  bubble: {
    alignItems: 'center',
    elevation: 4,
    marginHorizontal: 5,
    marginVertical: 8,
    position: 'relative',
    shadowColor: '#111',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 15.19,
  },
  bubble2: {
    alignItems: 'center',
    elevation: 4,
    // marginHorizontal: 0,
    marginRight: 30,
    marginVertical: 8,
    position: 'relative',
    shadowColor: '#111',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 15.19,
  },
  container: {
    height: '100%',

  },
  clickableArea: {
    position: 'absolute',
    width: '100%',
    height: '80%',
    top: '10%',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  detail: {
    borderRadius: 4,
    marginHorizontal: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  flex: {
    flex: 1,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  hashtagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 2
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
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  primaryBg: {
    backgroundColor: '#d81b60',
  },
  propertyAddress: {
    position: 'absolute',
    right: 20,
    top: 15,
  },
  propertyContainer: {
    height: Dimensions.get('window').height,
    //  height: Dimensions.get('window').height,
    //height:'100%',
    // width: '100%',
    paddingTop: 40,
    backgroundColor: '#000',
    flex: 1,
  },
  propertyDetails: {
    flexDirection: 'row',
  },
  propertyImage: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: -1,
    width: '100%',
  },
  propertyInfoContainer: {
    position: 'absolute',
    width: '100%',
    left: 0,
    bottom: '12%',
    paddingHorizontal: 20,
  },
  propertyInfo: {
    marginBottom: 0,
  },
  propertyInfoIcon: {
    width: 19,
    height: 18,
  },
  propertyInfoText: {
    fontSize: 13,
    marginLeft: 10,
  },
  summary: {
    alignItems: 'flex-end',
    // flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 1,
    paddingTop: 0,
    width: '100%',
  },
  text: {
    color: '#ffffff',
    fontFamily: 'font-regular',
    fontSize: 12,
    marginTop: 3,
  },
  textShadow: {
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 4,
  },
  uppercase: {
    textTransform: 'uppercase',
  },
});
