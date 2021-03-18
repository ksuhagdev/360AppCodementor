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
  Share, Easing,
  StyleSheet, Animated,
  Dimensions, Button,Modal,
  ActivityIndicator, StatusBar, Platform
} from 'react-native';
import MarqueeText from 'react-native-marquee';
import TextTicker from 'react-native-text-ticker'

import { GradientButton } from '../../../components/Button'
import Icon from 'react-native-vector-icons/MaterialIcons';
// import Modal from 'react-native-modal'
import Iconss from 'react-native-vector-icons/Entypo'
import Video from 'react-native-video';
import { Viewport } from '@skele/components'
// import convertToProxyURL from 'react-native-video-cache';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import request from '../../../helper/functions/request';
import { shareProperty } from '../../../actions/property';
import { handleSnackbar } from '../../../helper/functions/snackbar';
import NumberShortner from '../../../utils/NumberShortner'; import Lottie from 'lottie-react-native';
import musicFly from '../../../assets/lottie-animations/music-fly.json';
import { Root, Popup } from 'popup-ui'
// import MediaControls, {PLAYER_STATES} from 'react-native-media-controls'
// import convertToProxyURL from 'react-native-video-cache'

const propertyImage = require('../../../assets/image/property-placeholder.png');
const bedImg = require('../../../assets/image/bed.png');
const propertyPlaceholder = require('../../../assets/image/property.png')
const bathImg = require('../../../assets/image/bathroom.png');
const garageImg = require('../../../assets/image/car.png');
const defaultAgentPic = require('../../../assets/image/default-profile-pic.png');

import useRotation from '../../../components/Animations/useRotation';
export default function PropertyDetail({ property, shouldPlay, navigation, video }) {
  const [state, setState] = useState({
    showLoadingIndicator: true,
  });


  // const rotate = useRotation()

  // const animatedStyle = {transform : [{rotate}]}




  const [likes, setLikes] = useState(property.total_likes);
  const [shares, setShares] = useState(property.total_shares);
  const [isLiked, setIsLiked] = useState(property.is_liked || false);
  const [iconColor, setIconColor] = useState(property.is_liked ? '#f00' : '#fff');
  const { accessToken } = useSelector(store => store.account);
  const [isModalVisible, setModalVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false)
  const dispatch = useDispatch();

  const [videos, setVideo] = useState()
  const imageUrl = property.main_image_url ? { uri: property.main_image_url } : propertyImage;
  const placeholderImage = propertyImage;
  const videoPlayer = useRef(null)
  const formatter = new Intl.NumberFormat('en-US',{ style:'currency', currency:'AUD'})
  const onShare = async item => {
    const type = item.campaign_type === 'RENTAL' ? 'rent' : 'sale';

    try {
      const result = await Share.share(
        {
          title: `${item.title}`,
          message: `Hey, you should totally check out this ${item.property_type} for ${type} on 360app! Get the app on the Apple Store and Google Play!`,
        },
        {
          dialogTitle: `Share ${item.title}`,
          subject: `${item.title}`,
        },
      );

      if (result.action === Share.sharedAction) {
        setShares(shares + 1);
        dispatch(shareProperty({ shareType: 'external', propertyId: item.id }));
        handleSnackbar({ message: 'Property shared successfully', type: 'success' });
      }
    } catch (error) {
      Alert.alert('', error.message, [{ text: 'OK' }]);
    }
  };

console.log("Property data", property)


  const onPropertyPressed = (id, title) => {
    navigation.navigate('PropertyAddress', { propertyId: id, title });
  };
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const toggleLike = async propertyId => {
    if (!accessToken) {
      return Alert.alert('Login required', 'You must be logged in to like properties. Do you want to login/sign up?', [
        { text: 'Maybe later', style: 'cancel' },
        {
          text: 'Login',
          onPress: () => {
            navigation.navigate('Login');
          },
        },
      ]);
    }

    try {
      if (!isLiked) {
        setIsLiked(true);
        setLikes(likes + 1);
        setIconColor('#f00');

        await request({
          url: `/likes/like/${propertyId}`,
          config: {
            method: 'POST',
          },
        });
      } else {
        setIsLiked(false);
        setLikes(likes - 1);
        setIconColor('#fff');

        await request({
          url: `/likes/like/${propertyId}`,
          config: {
            method: 'DELETE',
          },
        });
      }
    } catch (error) {
      // undo like
      if (!isLiked) {
        setIsLiked(true);
        setLikes(likes + 1);
        setIconColor('#f00');

        handleSnackbar({ message: 'Unexpected error unliking property' });
      } else {
        setIsLiked(false);
        setLikes(likes - 1);
        setIconColor('#fff');

        handleSnackbar({ message: 'Unexpected error liking property' });
      }
    }
  };

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


  console.log("Checking Mathe Shit44y3333t", 999999 > Math.abs(property.prices[0].max_price)   )

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
    console.log("VIdoe url", videos)

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

  return (
    <Root>
      <View style={styles.propertyContainer}>
        {video && getMainVideo(property.videos) ? (
          <>
            {state.showLoadingIndicator && (
              <View style={styles.loading}>
                <ActivityIndicator size="large" color="#d81b60" />
              </View>
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
              paused={!shouldPlay}
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
        <View style={styles.overlay} />
        <SafeAreaView style={styles.container}>
          <View style={{ justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 5 }}>
            {/* Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num) */}
            <Text style={[styles.text, styles.textShadow, {}]}> A${999<Math.abs(property.prices[0].min_price)<999999 ? ((Math.abs(property.prices[0].min_price)/1000).toFixed(0)) + 'K': 999999<Math.abs(property.prices[0].min_price) ? ((Math.abs(property.prices[0].min_price)/1000000).toFixed(0)) + 'M':Math.abs(property.prices[0].min_price)} - A${999< Math.abs(property.prices[0].max_price)> 999999 ? ((Math.abs(property.prices[0].max_price)/1000).toFixed(1)) + 'k':  Math.abs(property.prices[0].max_price) > 999999 ? ((Math.abs(property.prices[0].max_price)/1000000).toFixed(0)) + 'M':Math.abs(property.prices[0].max_price)}</Text>
            <Text style={[styles.text, styles.textShadow]}>{property.agency} {property.agencies[0].name} - {property.agencies[0].address}</Text>

          </View>

          <View style={styles.summary}>
            {property.street && (

              <Text style={[styles.text, styles.textShadow, { padding: 5 }]}>
                {property.street}, {property.suburb}
              </Text>

            )}


            <View style={styles.propertyDetails}>

              {/* <View style={[styles.detail, styles.primaryBg]}>
              <Text style={styles.text}>{property.suburb}</Text>
            </View> */}

              <View style={[styles.detail, styles.primaryBg]}>
                <Text style={[styles.text, styles.uppercase]}>{getCampaignType(property.campaign_type)}</Text>
              </View>
            </View>
          </View>



          <TouchableWithoutFeedback
            onPress={() => {
              onPropertyPressed(property.id, property.title);
            }}>
            <View style={styles.clickableArea} />
          </TouchableWithoutFeedback>

          <View style={[styles.flexRow, styles.propertyInfoContainer]}>
            <View style={styles.flex}>
              <View style={[styles.propertyInfo, styles.flexRow]}>
                <View style={styles.bubble2}>
                  <TouchableOpacity>
                    <Image style={styles.agentImg} source={imageUrl} defaultSource={propertyPlaceholder} />

                  </TouchableOpacity>

                  <Text style={styles.text}>Property</Text>
                </View>

                {property.agents.map(agent => (
                  <>
                    <View style={styles.bubble} key={agent.agent_id}>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('AgentProfile', { agentId: agent.agent_id });
                        }}>
                        <Image style={styles.agentImg} source={agent.photo ? { uri: agent.photo } : defaultAgentPic} defaultSource={defaultAgentPic} />

                      </TouchableOpacity>

                      <Text style={styles.text}>{agent.name}</Text>
                    </View>
                    <View style={styles.bubble} key={agent.agent_id}>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('AgentProfile', { agentId: agent.agent_id });
                        }}>
                        <Image style={styles.agentImg} source={require('../../../assets/image/profileimage.png')} defaultSource={defaultAgentPic} />

                      </TouchableOpacity>

                      <Text style={styles.text}>LS</Text>
                    </View>
                  </>
                ))}
              </View>
              {/* <View style={[styles.propertyInfo, styles.flexRow]}>
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
            </View> */}

              <View style={styles.hashtagsContainer}>
                {property.hashtags.map(hashtag => (
                  <Text style={[styles.text, styles.hashTags, styles.textShadow]} key={hashtag.id}>
                    {hashtag.name}
                  </Text>
                ))}
              </View>
              <View style={[styles.propertyInfo, styles.flexRow]}>
                <View style={{ marginRight: 5 }}>
                  <FontAwesomeIcon style={styles.alignCenter} name="music" size={15} color="#fff" />
                </View>
                  <View style={{width:'65%'}}>
                  <TextTicker
          style={{ fontSize: 13, color:'white' }}
          duration={5000}
          loop
          bounce={false}
          repeatSpacer={50}
          marqueeDelay={100}
          shouldAnimateTreshold={40}
        >
                  Dojo Cat - Say So "Why don't you say so?"  
        </TextTicker>
                  </View>
                
              </View>
            </View>

            <View style={styles.actions}>
              <View style={styles.btnsContainer}>
                {/* {property.agents.map(agent => (
                <View style={styles.bubble} key={agent.agent_id}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('AgentProfile', { agentId: agent.agent_id });
                    }}>
                    <Image style={styles.agentImg} source={agent.photo ? { uri: agent.photo } : defaultAgentPic} defaultSource={defaultAgentPic} />
                  </TouchableOpacity>

                  <Text style={styles.text}>{agent.name}</Text>
                </View>
              ))} */}
                <View style={{ marginBottom: 5 }}>
                  <View style={styles.btns}>
                    <TouchableOpacity onPress={() => toggleLike(property.id)}>
                      <Icon style={[styles.alignCenter]} name="favorite" size={36} color={iconColor} />
                    </TouchableOpacity>

                    <Text style={styles.text}>{NumberShortner.abbrNumber(likes)}</Text>
                  </View>
                  <TouchableOpacity onPress={toggleModal}>
                    <View style={styles.btns}>
                      <FontAwesomeIcon style={styles.alignCenter} name="commenting" size={36} color="#fff" />
                      <Text style={styles.text}>{NumberShortner.abbrNumber(shares)}</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {setShareModalVisible(true)}}>
                    <View style={styles.btns}>
                      <Iconss style={styles.alignCenter} name="forward" size={36} color="#fff" />
                      <Text style={styles.text}>{NumberShortner.abbrNumber(shares)}</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                {/* <TouchableOpacity opacity={0}> */}
                {/* <Animated.View style={{...styles.btns,transform: [{rotate: spin}]}}> */}
                <Animated.View style={{
                  borderRadius: 50,
                  borderWidth: 12,
                  borderColor: '#292929',
                  marginTop: 60,
                  transform: [{
                    rotate: rotateProp
                  }]
                }}>

                  <Icons style={styles.alignCenter} name="music-circle" size={38} color="#fff" />
                  {/* <Text style={styles.text}>{NumberShortner.abbrNumber(shares)}</Text> */}
                </Animated.View>
                <Lottie
                  source={musicFly}
                  progress={shouldPlay ? spinValue : 0}
                  style={{ width: 150, position: 'absolute', bottom: 0, right: 0 }}
                />
                {/* </TouchableOpacity> */}

              </View>

            </View>

          </View>
          {/* <Modal style={{ borderRadius: 10 }} isVisible={isModalVisible}>
            <View style={{ backgroundColor: '#fff', padding: 100, borderRadius: 30 }}>
              <Text style={{ bottom: 20, fontSize: 20 }}>Coming Soon </Text>

              <Button title='OK' onPress={toggleModal}></Button>

              {/* <TouchableOpacity style={{backgroundColor:'#FF3257', justifyContent:'center'}} onPress={toggleModal}><Text style={{alignContent: 'center'}}>Hide Modal</Text></TouchableOpacity> */}
            {/* </View>
          </Modal> */}
        </SafeAreaView>
        <Modal
            animationType = {"slide"}
            transparent={false}
            visible={shareModalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has now been closed.');
            }}>

            
              <Text style = { styles.text }>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                  Maecenas eget tempus augue, a convallis velit.</Text>

              <Text 
                style={styles.closeText}
                onPress={() => {
                  setShareModalVisible(!shareModalVisible)}}>Close Modal</Text>
          </Modal>
      </View>
    </Root>
  );
}


// export default function PropertyDetail({ currentIndex, index, property, shouldPlay, navigation }) {
//   const [state, setState] = useState({
//     showLoadingIndicator: true,
//   });

//   const [likes, setLikes] = useState(property.total_likes);
//   const [shares, setShares] = useState(property.total_shares);
//   const [isLiked, setIsLiked] = useState(property.is_liked || false);
//   const [iconColor, setIconColor] = useState(property.is_liked ? '#f00' : '#fff');
//   const { accessToken } = useSelector(store => store.account);
//   const dispatch = useDispatch();

//   const imageUrl = property.main_image_url ? { uri: property.main_image_url } : propertyImage;
//   const placeholderImage = propertyImage;

//   const onShare = async item => {
//     const type = item.campaign_type === 'RENTAL' ? 'rent' : 'sale';

//     try {
//       const result = await Share.share(
//         {
//           title: `${item.title}`,
//           message: `Hey, you should totally check out this ${item.property_type} for ${type} on 360app! Get the app on the Apple Store and Google Play!`,
//         },
//         {
//           dialogTitle: `Share ${item.title}`,
//           subject: `${item.title}`,
//         },
//       );

//       if (result.action === Share.sharedAction) {
//         setShares(shares + 1);
//         dispatch(shareProperty({ shareType: 'external', propertyId: item.id }));
//         handleSnackbar({ message: 'Property shared successfully', type: 'success' });
//       }
//     } catch (error) {
//       Alert.alert('', error.message, [{ text: 'OK' }]);
//     }
//   };


//   const onPropertyPressed = (id, title) => {
//     navigation.navigate('PropertyAddress', { propertyId: id, title });
//   };

//   const toggleLike = async propertyId => {
//     if (!accessToken) {
//       return Alert.alert('Login required', 'You must be logged in to like properties. Do you want to login/sign up?', [
//         { text: 'Maybe later', style: 'cancel' },
//         {
//           text: 'Login',
//           onPress: () => {
//             navigation.navigate('Login');
//           },
//         },
//       ]);
//     }

//     try {
//       if (!isLiked) {
//         setIsLiked(true);
//         setLikes(likes + 1);
//         setIconColor('#f00');

//         await request({
//           url: `/likes/like/${propertyId}`,
//           config: {
//             method: 'POST',
//           },
//         });
//       } else {
//         setIsLiked(false);
//         setLikes(likes - 1);
//         setIconColor('#fff');

//         await request({
//           url: `/likes/like/${propertyId}`,
//           config: {
//             method: 'DELETE',
//           },
//         });
//       }
//     } catch (error) {
//       // undo like
//       if (!isLiked) {
//         setIsLiked(true);
//         setLikes(likes + 1);
//         setIconColor('#f00');

//         handleSnackbar({ message: 'Unexpected error unliking property' });
//       } else {
//         setIsLiked(false);
//         setLikes(likes - 1);
//         setIconColor('#fff');

//         handleSnackbar({ message: 'Unexpected error liking property' });
//       }
//     }
//   };

//   const getMainVideo = videos => {
//     let video = null;

//     if (videos && videos.length) {
//       video = videos.find(vid => {
//         return vid.video_type === 'main';
//       });

//       // console.log("Main Video", video)

//       if (!video) {
//         video = videos[0]; // assign random video instead
//       }
//     }

//     return video;
//   };

//   const getCampaignType = campaignType => {
//     let type = 'Rent';

//     switch (campaignType) {
//       case 'PRIVATE_SALE':
//         type = 'Sale';
//         break;
//       case 'AUCTION':
//         type = 'Sale (Auction)';
//         break;
//       default:
//         type = 'Rent';
//     }

//     return type;
//   };

//   const onBuffer = () => {
//     setState({
//       ...state,
//       showLoadingIndicator: false,
//     });
//   };

//   const onLoad = () => {
//     setState({
//       ...state,
//       showLoadingIndicator: false,
//     });
//   };
//   console.log("VIdoe url", getMainVideo(property.videos).video_url)
//   return (
//     <View style={styles.propertyContainer}>
//       {getMainVideo(property.videos) ? (
//         <>
//           {state.showLoadingIndicator && (
//             <View style={styles.loading}>
//               <ActivityIndicator size="large" color="#d81b60" />
//             </View>
//           )}

//            <Video
//             repeat={true}
//             source={{ uri: getMainVideo(property.videos).video_url }}
//             poster={getMainVideo(property.videos).thumbnail_url}
//             onBuffer={onBuffer}
//             onLoad={onLoad}
//             posterResizeMode="cover"
//             resizeMode={'cover'}
//             paused={currentIndex !== index || !shouldPlay}
//             volume={1}
//             ignoreSilentSwitch="ignore"
//             style={styles.backgroundVideo}
//             playInBackground={false}
//           />
//         </>
//       ) : (
//         <Image source={imageUrl} resizeMode="cover" style={styles.propertyImage} loadingIndicatorSource={placeholderImage} />
//       )}
//       <View style={styles.overlay} />
//       <SafeAreaView style={styles.container}>
//         <View style={styles.summary}>
//           <Text style={[styles.text, styles.textShadow]}>{property.agency}</Text>

//           <View style={styles.propertyDetails}>
//             <View style={[styles.detail, styles.primaryBg]}>
//               <Text style={styles.text}>{property.suburb}</Text>
//             </View>

//             <View style={[styles.detail, styles.primaryBg]}>
//               <Text style={[styles.text, styles.uppercase]}>{getCampaignType(property.campaign_type)}</Text>
//             </View>
//           </View>
//         </View>

//         {property.street && (
//           <View style={styles.summary}>
//             <View style={[styles.propertyDetails, styles.propertyAddress]}>
//               <Text style={[styles.text, styles.textShadow]}>
//                 {property.street}, {property.suburb}
//               </Text>
//             </View>
//           </View>
//         )}

//         <TouchableWithoutFeedback
//           onPress={() => {
//             onPropertyPressed(property.id, property.title);
//           }}>
//           <View style={styles.clickableArea} />
//         </TouchableWithoutFeedback>

//         <View style={[styles.flexRow, styles.propertyInfoContainer]}>
//           <View style={styles.flex}>
//           <View style={[styles.propertyInfo, styles.flexRow]}>
//           {property.agents.map(agent => (
//                 <View style={styles.bubble} key={agent.agent_id}>
//                   <TouchableOpacity
//                     onPress={() => {
//                       navigation.navigate('AgentProfile', { agentId: agent.agent_id });
//                     }}>
//                     <Image style={styles.agentImg} source={agent.photo ? { uri: agent.photo } : defaultAgentPic} defaultSource={defaultAgentPic} />

//                   </TouchableOpacity>

//                   <Text style={styles.text}>{agent.name}</Text>
//                 </View>
//               ))}
//               </View>
//             <View style={[styles.propertyInfo, styles.flexRow]}>
//               <View style={styles.infoIcon}>
//                 <Image source={bedImg} style={styles.propertyInfoIcon} />
//                 <Text style={[styles.text, styles.propertyInfoText, styles.textShadow]}>{property.num_bedrooms}</Text>
//               </View>

//               <View style={styles.infoIcon}>
//                 <Image source={bathImg} style={styles.propertyInfoIcon} />
//                 <Text style={[styles.text, styles.propertyInfoText, styles.textShadow]}>{property.num_bathrooms}</Text>
//               </View>

//               <View style={styles.infoIcon}>
//                 <Image source={garageImg} style={styles.propertyInfoIcon} />
//                 <Text style={[styles.text, styles.propertyInfoText, styles.textShadow]}>{property.num_garages}</Text>
//               </View>
//             </View>

//             <View style={styles.hashtagsContainer}>
//               {property.hashtags.map(hashtag => (
//                 <Text style={[styles.text, styles.hashTags, styles.textShadow]} key={hashtag.id}>
//                   {hashtag.name}
//                 </Text>
//               ))}
//             </View>
//           </View>

//           <View style={styles.actions}>
//             <View style={styles.btnsContainer}>
//               {/* {property.agents.map(agent => (
//                 <View style={styles.bubble} key={agent.agent_id}>
//                   <TouchableOpacity
//                     onPress={() => {
//                       navigation.navigate('AgentProfile', { agentId: agent.agent_id });
//                     }}>
//                     <Image style={styles.agentImg} source={agent.photo ? { uri: agent.photo } : defaultAgentPic} defaultSource={defaultAgentPic} />
//                   </TouchableOpacity>

//                   <Text style={styles.text}>{agent.name}</Text>
//                 </View>
//               ))} */}

//               <View style={styles.btns}>
//                 <TouchableOpacity onPress={() => toggleLike(property.id)}>
//                   <Icon style={[styles.alignCenter]} name="favorite" size={35} color={iconColor} />
//                 </TouchableOpacity>

//                 <Text style={styles.text}>{NumberShortner.abbrNumber(likes)}</Text>
//               </View>

//               <TouchableOpacity onPress={() => onShare(property)}>
//                 <View style={styles.btns}>
//                   <Icon style={styles.alignCenter} name="share" size={35} color="#fff" />
//                   <Text style={styles.text}>{NumberShortner.abbrNumber(shares)}</Text>
//                 </View>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </SafeAreaView>
//     </View>
//   );
// }

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
