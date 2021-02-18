import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, StatusBar, Image, Text, Modal, ScrollView, Alert, FlatList, ImageBackground, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import ActionSheet from 'react-native-action-sheet';
import styles from './styles';
import AgentInfo from './Info';
import VideoTile from './Video';
import { colors } from '../../../../theme/constants';
import { handleNewProperty, setCurrentCampaign, getPropertyById, setCurrentProperty, setLiveStatus, deleteProperty } from '../../../../actions/property';
import EditInspectionTime from '../NewProperty/Auction/EditInspectionTime';
import Hashtags from './Hashtags';
import ImagePicker from 'react-native-image-picker'
import { getPayload } from '../../../../utils/TokenService';

const addIcon = require('../../../../assets/image/add.png');
const editIcon = require('../../../../assets/image/edit.png');
const defaultHeroImage = require('../../../../assets/image/property-placeholder.png');
const defaultAgentPic = require('../../../../assets/image/default-profile-pic.png');

export default function PropertyAddress({ navigation }) {
  const [hasAccess, setHasAccess] = React.useState(false);
  const [scrollRef, setScrollRef] = React.useState(null);
  const [preview, setPreview] = React.useState(false);
  const [isInspectionsOpen, setIsInspectionsOpen] = React.useState(false);
  const [isHashtagsOpen, setIsHashtagsOpen] = React.useState(false);
  const dispatch = useDispatch();
  const { currentProperty } = useSelector(state => state.property);
  // if(currentProperty){
  //   console.log("Current Property", currentProperty.property.videos)
  // }
  
  const propertyId = navigation.getParam('propertyId', null);
  const heroImage =
    currentProperty && currentProperty.property && currentProperty.property.main_image_url
      ? { uri: currentProperty.property.main_image_url }
      : defaultHeroImage;


  const displayActionSheet = () => {
    const options = [
      'Add another agent',
      // currentProperty.property.is_live ? 'Go Offline' : 'Go Live',
      'Invite others to edit this page',
    
      'Edit property details',
      'Delete property profile',
      'Edit Hashtags',
      'Cancel',
    ];

    ActionSheet.showActionSheetWithOptions(
      {
        options,
        destructiveButtonIndex:5,
        title: 'Edit campaign',
        cancelButtonIndex: 7,
      },
      buttonIndex => {
        switch (buttonIndex) {
          case 0:
            // navigation.navigate('OpenContacts', {
            //   userType: 'AGENT',
            //   propertyId: currentProperty.property.id,
            //   agencyId: currentProperty.property.agency.id,
            // });
            break;
          // case 1:
          //   togglePropertyStatus();
          //   break;
          case 1:
            navigation.navigate('InviteOthers', {
              propertyId: currentProperty.property.id,
              agencyId: currentProperty.property.agency.id,
            });
            break;
          
          case 2:
            dispatch(handleNewProperty(currentProperty.property));
            dispatch(setCurrentCampaign(currentProperty.campaign));
            navigation.navigate('NewProperty_Screen1', { editing: true });
            break;
          case 3:
            Alert.alert(
              'Delete property',
              'Deleting a property profile will remove all data related to it, and cannot be undone. Are you sure you want to proceed?',
              [{ text: 'Yes, Delete', onPress: () => _deleteProperty() }, { text: 'Cancel', style: 'cancel' }],
            );
            break;
          case 4:
            setIsHashtagsOpen(true);
            break;
        }
      },
    );
  };

  const getVideos = () => {
    if (hasAccess && !preview) {
      return [
        findVideo('entrance') || { title: 'Entrance', video_type: 'entrance' },
        findVideo('bedroom') || { title: 'Bedroom', video_type: 'bedroom' },
        findVideo('bathroom') || { title: 'Bathroom', video_type: 'bathroom' },
        findVideo('kitchen') || { title: 'Kitchen', video_type: 'kitchen' },
        findVideo('lounge') || { title: 'Lounge', video_type: 'lounge' },
        findVideo('dining') || { title: 'Dining Area', video_type: 'dining' },
      ];
    }

    return currentProperty.property.videos.filter(video => {
      return video.video_type !== 'main';
    });
  };

  const getMainVideo = () => {
    return findVideo('main');
  };

  const findVideo = type => {
    return currentProperty.property.videos.find(video => {
      return video.video_type === type;
    });
  };

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('didFocus', () => {
      if (!currentProperty || !currentProperty.property) {
        dispatch(getPropertyById(propertyId));
      }
    });

    return () => {
      dispatch(setCurrentProperty(null, null));
      unsubscribeFocus.remove();
    };
  }, []);

  const handleActionsPress = () => {
    displayActionSheet();
  };

  const _deleteProperty = async () => {
    await dispatch(deleteProperty(currentProperty.property.id));

    navigation.pop(1);
  };

  const checkAccess = async () => {
    if (currentProperty && currentProperty.property && currentProperty.property.agents) {
      const token = await AsyncStorage.getItem('accessToken');
      const user = getPayload(token);
      console.log("Check Acess", token)
      if (user) {
        const currentUser = currentProperty.property.agents.filter(agent => {
          return agent.agent_id === user.sub;
        });

        if (currentUser.length === 1) {
          setHasAccess(true);
        }
      }
    }
  };

  const togglePreview = () => {
    const isPreview = !preview;
    setHasAccess(!hasAccess)
    setPreview(isPreview);

    if (isPreview) {
      scrollRef.scrollTo({ x: 0, y: 0, animated: true });
    }
  };

  const togglePropertyStatus = () => {
    if (currentProperty.property.is_live) {
      confirmStopCampaign();
    } else {
      const { property } = currentProperty;
      if (property.videos.find(x => x.video_type === 'main')) {
        setPropertyLive(true);
      } else {
        Alert.alert(
          'Main video required',
          'Do you want to record the main video right now?',
          [{ text: 'Yes', onPress: () => onAddVideo('main') }, { text: 'Cancel', style: 'cancel' }],
          { cancelable: false },
        );
      }
    }
  };

  const setPropertyLive = async status => {
    await dispatch(setLiveStatus(status));
  };

  const confirmStopCampaign = () => {
    Alert.alert(
      'Stop campaign',
      "Stopping a campaign will prevent it from appearing on user's feeds and in search results. Are you sure you want to proceed?",
      [{ text: 'Yes', onPress: () => setPropertyLive(false) }, { text: 'Cancel', style: 'cancel' }],
      { cancelable: false },
    );
  };

  const onMainVideoPressed = () => {
    if (currentProperty.property.videos && currentProperty.property.videos.length) {
      const mainVideo = getMainVideo();

      if (mainVideo) {
        navigation.navigate('RoomVideo', { video: mainVideo });
      }
    }
  };

  const playVideoTile = (type) => {
    if(currentProperty.property.videos && currentProperty.property.videos.length){
      const videoTile = getVideoTile(type);

      if(videoTile){
        navigation.navigate('RoomVideo',{video: videoTile})
      }
    }
  }
  const getVideoTile = (type) => {
    return currentProperty.property.videos.find(video => {
      return video.video_type === type;
    });
  }
  const onAddVideo = type => {
    
    if (!type) throw new Error('No type defined for video');
    displayVideoAddingOptions(type)
  };

  const displayVideoAddingOptions = (type) => {
    // const options = [
    //   'Gallery',
    //   'Record',
    //   'Cancel',
    // ];

    // const menuOptions = {
    //   title: 'Source',
    //   mediaType: 'video', 
    // //   storageOptions:{
    // //     skipBackup:true,
    // //     path:'images',
    // //     cameraRoll: true,
    // // waitUntilSaved: true,
    // //   }
    // }

    // ActionSheet.showActionSheetWithOptions(
    //   {
    //     options,
    //     title: 'Options',
    //     cancelButtonIndex: 2,
    //   },
    //   buttonIndex => {
    //     switch (buttonIndex) {
    //       case 0:
    //         ImagePicker.showImagePicker({mediaType: 'video',title:'Source'},(response) => {
    //           if(response.didCancel){
    //             console.log('User Cancelled')
    //           }else if(response.error){
    //             console.log('ERROR'+response.error)
    //           }else if (response.customButton){
    //             console.log('user tapped '+response.customButton)
    //           }else{
    //             const data = response.uri;
    //             console.log("Image Address", data);
    //             navigation.navigate('TrimVideo', {
    //               videoUri: data,
    //               videoPath: response.path,
    //               videoType: type,
    //             });
    //           }
    //         });
    //         break;
    //       case 1:
            if (hasAccess) {
              navigation.navigate('CameraSession', {
                videoType: type,
              });
            }
    //         break;
    //     }
    //   },
    // );
  };


  const onUpdateVideo = type => {
    if (!type) throw new Error('No type defined for video');
    if (hasAccess) {
      navigation.navigate('CameraSession', {
        videoType: type,
      });
    }
  };

  const onVideoPressed = video => {
    console.log("On Video Pressed", video)
    if (video && video.video_url) {
      navigation.navigate('RoomVideo', { video });
    }
  };

  if (!currentProperty || !currentProperty.property) {
    return (
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="large" color="#d81b60" />
      </View>
    );
  }

  checkAccess();

  return (
    <View style={styles.equalFlex}>
      <StatusBar translucent={true} backgroundColor={'rgba(0, 0, 0, 0.1)'} barStyle="dark-content" />

      <View style={styles.equalFlex}>
        <View style={styles.name}>
          <Text style={styles.agencyName}>{currentProperty.property.agency.name}</Text>
        </View>

        <ScrollView
          ref={r => {
            setScrollRef(r);
          }}
          minimumZoomScale={0.5}
          maximumZoomScale={1}
          bounceZoom={true}>
          <View>
            <ImageBackground
              style={styles.hero}
              source={getMainVideo() && getMainVideo().thumbnail_url ? { uri: getMainVideo().thumbnail_url } : heroImage}
              defaultSource={defaultHeroImage}
              progressiveRenderingEnabled={true}>
              {hasAccess && !preview && (
                <View style={styles.overlayContainer}>
                  <TouchableOpacity style={styles.overlayContainer} onPress={() => onMainVideoPressed()}>
                    <View style={styles.overlay} />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.cta} onPress={() => (getMainVideo() === undefined ? onAddVideo('main') : onUpdateVideo('main'))}>
                    {getMainVideo() !== undefined && (
                      <>
                        <Image style={styles.addIcon} source={editIcon} />
                        <Text style={[styles.text, styles.textShadow]}>Update Main Video</Text>
                      </>
                    )}

                    {getMainVideo() === undefined && (
                      <>
                        <Image style={styles.addIcon} source={addIcon} />
                        <Text style={[styles.text, styles.textShadow]}>Shoot Main Video</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              )}

              {!hasAccess && (
                <View style={styles.heroCTA}>
                  <TouchableOpacity style={styles.mainVideoCTA} onPress={() => onMainVideoPressed()}>
                    <View />
                  </TouchableOpacity>

                  <View style={styles.agentsContainer}>
                    {currentProperty.property.agents.map(agent => (
                      <TouchableOpacity onPress={() => navigation.navigate('AgentProfile', { agentId: agent.agent_id })} key={agent.agent_id}>
                        <View style={styles.bubble}>
                          <Image style={styles.agentImg} source={agent.photo ? { uri: agent.photo } : defaultAgentPic} defaultSource={defaultAgentPic} />

                          <Text style={styles.agentName}>{agent.name}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </ImageBackground>

            <AgentInfo navigation={navigation} currentProperty={currentProperty} hasAccess={hasAccess} isPreview={preview} />

            <View>
              <FlatList
                numColumns={3}
                data={getVideos()}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => onVideoPressed(item)}>
                    <VideoTile item={item} hasAccess={hasAccess} onAddPressed={onAddVideo} onUpdatePressed={onUpdateVideo} />
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index}
              />

              {!hasAccess && getVideos().length === 0 && (
                <View style={styles.noVideosContainer}>
                  <Text style={styles.noVideosMsg}>No videos uploaded for this property</Text>
                </View>
              )}

              {hasAccess && preview && getVideos().length === 0 && (
                <View style={styles.noVideosContainer}>
                  <Text style={styles.noVideosMsg}>No videos uploaded for this property</Text>
                </View>
              )}
            </View>

            {hasAccess && !preview && (
              <View style={styles.actionBtns}>
                <View style={styles.ctaContainer}>
                  <TouchableOpacity onPress={handleActionsPress}>
                    <View style={styles.btnBox}>
                      <Text style={styles.boxText}>Edit Campaign</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => togglePreview()}>
                    <View style={styles.btnBox}>
                      <Text style={styles.boxText}>Preview</Text>
                    </View>
                  </TouchableOpacity>
                  {!currentProperty.property.is_live && (
                    <TouchableOpacity onPress={togglePropertyStatus}>
                      <View style={[styles.btnBox, { backgroundColor: colors.primary }]}>
                        <Text style={[styles.boxText, styles.textWhite]}>Go Live</Text>
                      </View>
                    </TouchableOpacity>
                  )}

                  {currentProperty.property.is_live && (
                    <TouchableOpacity onPress={() => confirmStopCampaign()}>
                      <View style={[styles.btnBox, { backgroundColor: colors.primary }]}>
                        <Text style={[styles.boxText, styles.textWhite]}>Go Offline</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}

            {preview && (
              <View style={styles.actionBtns}>
                <View style={styles.ctaContainer}>
                  <TouchableOpacity onPress={() => togglePreview()}>
                    <View style={styles.btnBox}>
                      <Text style={styles.boxText}>Hide Preview</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </View>

      <View>
        <Modal visible={isInspectionsOpen} animationType="slide" onRequestClose={() => setIsInspectionsOpen(false)}>
          <EditInspectionTime navigation={navigation} onClose={setIsInspectionsOpen} />
        </Modal>
      </View>

      <View>
        <Modal visible={isHashtagsOpen} animationType="slide" onRequestClose={() => setIsHashtagsOpen(false)}>
          <Hashtags hashtags={currentProperty.property.hashtags} setIsOpen={setIsHashtagsOpen} />
        </Modal>
      </View>
    </View>
  );
}

PropertyAddress.navigationOptions = ({ navigation }) => {
  return {
    title: navigation.getParam('title'),
  };
};
