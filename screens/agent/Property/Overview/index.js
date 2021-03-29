import React, { useEffect , useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, StatusBar, Image, Text, Modal, ScrollView,Dimensions, PermissionsAndroid,Alert, FlatList, ImageBackground, TouchableOpacity, ActivityIndicator, TouchableWithoutFeedback, } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import ActionSheet from 'react-native-action-sheet';
import styles from './styles';
import AgentInfo from './Info';
import VideoTile from './Video';
import { colors } from '../../../../theme/constants';
import { handleNewProperty, setCurrentCampaign, getPropertyById, setCurrentProperty, setLiveStatus, deleteProperty } from '../../../../actions/property';
import EditInspectionTime from '../NewProperty/Auction/EditInspectionTime';
import Hashtags from './Hashtags';
import {launchImageLibrary, launchCamera } from 'react-native-image-picker'
import { getPayload } from '../../../../utils/TokenService';
import {VESDK, Configuration, TintMode, Tool} from 'react-native-videoeditorsdk';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import {Checkmark} from 'react-checkmark'
import SearchBar from '../../../../components/ContactAcess/ContactSearch'
import GradientButton from '../../../../components/Button';
import request from '../../../../helper/functions/request';
const addIcon = require('../../../../assets/image/add.png');
const editIcon = require('../../../../assets/image/edit.png');
const defaultHeroImage = require('../../../../assets/image/property-placeholder2.jpg');
const defaultAgentPic = require('../../../../assets/image/default-profile-pic.png');
VESDK.unlockWithLicense(require('../../../../vesdk_license'))

export default function PropertyAddress({ navigation }) {
  const [hasAccess, setHasAccess] = React.useState(false);
  const [scrollRef, setScrollRef] = React.useState(null);
  const [preview, setPreview] = React.useState(false);
  const [isInspectionsOpen, setIsInspectionsOpen] = React.useState(false);
  const [addAdgentModal, setAddAdgentModal] = React.useState(false)
  const [isHashtagsOpen, setIsHashtagsOpen] = React.useState(false);
  const [selectedUsers, setSelectedUsers] = React.useState([]);
  const [selectedUsersID, setSelectedUsersID] = useState([])
  const [agents, setAgents] = useState([]);
  const dispatch = useDispatch();
  // const data = [1,2,3,4,5,6,7,78,89,5,3,3,2,2,4,5,6,7]
  let tool: Configuration = {
    tools: [Tool.TRIM, Tool.TRANSFORM]
  }
  // let configuration = Configuration = {

  // }
  const { currentProperty } = useSelector(state => state.property);
  const [libraryVideoPath, setlibraryVideoPath ] = React.useState(null);
  // if(currentProperty){
  //   console.log("Current Property", currentProperty.property.videos)
  // }
  // console.log("Current Property", currentProperty)
  const propertyId = navigation.getParam('propertyId', null);
  const heroImage =
    currentProperty && currentProperty.property && currentProperty.property.main_image_url
      ? { uri: currentProperty.property.main_image_url }
      : defaultHeroImage;


  const displayActionSheet = () => {
    const options = [
      'Add another agent',
      // currentProperty.property.is_live ? 'Go Offline' : 'Go Live',
      // 'Invite others to edit this page',
    
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
            setAddAdgentModal(!addAdgentModal)
            break;
          // case 1:
          //   togglePropertyStatus();
          //   break;
          // case 1:
          //   navigation.navigate('InviteOthers', {
          //     propertyId: currentProperty.property.id,
          //     agencyId: currentProperty.property.agency.id,
          //   });
          //   break;
          
          case 1:
            dispatch(handleNewProperty(currentProperty.property));
            dispatch(setCurrentCampaign(currentProperty.campaign));
            navigation.navigate('NewProperty_Screen1', { editing: true });
            break;
          case 2:
            Alert.alert(
              'Delete property',
              'Deleting a property profile will remove all data related to it, and cannot be undone. Are you sure you want to proceed?',
              [{ text: 'Yes, Delete', onPress: () => _deleteProperty() }, { text: 'Cancel', style: 'cancel' }],
            );
            break;
          case 3:
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

  const DoneSearch = async() => {
    if(selectedUsersID.length > 0){
      console.log("Add", selectedUsersID)
      try{ await request({
        url: `/properties/${currentProperty.property.id}/agents`,
        config: {
          method: 'POST',
          body: { userIds: selectedUsersID },
        },
      });

    setSelectedUsers([])
    setSelectedUsersID([])
    
    setAgents([])
    Alert.alert("New Agents Added")
    setAddAdgentModal(!addAdgentModal)
    }catch(error){
        Alert.alert("Please try after some time")
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
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
          },
        );
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else return true;
  };

  const requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission',
          },
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert('Write permission err', err);
      }
      return false;
    } else return true;
  };


  const displayVideoAddingOptions = (type) => {
    const options = [
      'Upload Video',
      'Shoot Video',
      'Cancel',
    ];

    const menuOptions = {
      title: 'Source',
      mediaType: 'video', 
    //   storageOptions:{
    //     skipBackup:true,
    //     path:'images',
    //     cameraRoll: true,
    // waitUntilSaved: true,
    //   }
    }

    ActionSheet.showActionSheetWithOptions(
      {
        options,
        title: 'Options',
        cancelButtonIndex: 2,
      },
     async buttonIndex =>  {
        switch (buttonIndex) {
          case 0:
            // ImagePicker.showImagePicker({mediaType: 'video',title:'Source'},(response) => {
            //   if(response.didCancel){
            //     console.log('User Cancelled')
            //   }else if(response.error){
            //     console.log('ERROR'+response.error)
            //   }else if (response.customButton){
            //     console.log('user tapped '+response.customButton)
            //   }else{
            //     const data = response.uri;

            //     // console.log("Image Address", data);
            //     // navigation.navigate('TrimVideo', {
            //     //   videoUri: data,
            //     //   videoPath: response.path,
            //     //   videoType: type,
            //     // });

            //   }
            // });
            let options = {
              mediaType: 'video',
              maxWidth: 300,
              maxHeight: 550,
              quality: 1,
            };
            launchImageLibrary(options, (response) => {
              console.log('Response = ', response);
        
              if (response.didCancel) {
                // alert('User cancelled camera picker');
                return;
              } else if (response.errorCode == 'camera_unavailable') {
                // alert('Camera not available on device');
                return;
              } else if (response.errorCode == 'permission') {
                // alert('Permission not satisfied');
                return;
              } else if (response.errorCode == 'others') {
                // alert(response.errorMessage);
                return;
              }

              console.log('base64 -> ', response.base64);
              console.log('uri -> ', response.uri);
              console.log('width -> ', response.width);
              console.log('height -> ', response.height);
              console.log('fileSize -> ', response.fileSize);
              console.log('type -> ', response.type);
              console.log('Path -> ', response.path);
              console.log('fileName -> ', response.fileName);
              setlibraryVideoPath(response)
              if(response){
                VESDK.openEditor(response.uri, tool).then(result => {
                  // console.log("Result", result)
                  navigation.navigate('EditVideo', {
                    videoUri: result.video,
                    videoType:type,
                    Trim:false,
                    propertyId: propertyId, 
                    title: navigation.getParam('title')
                  });
                })
              }
              
            });
            break;
          case 1:
            
            if (hasAccess) {
              navigation.navigate('CameraSession', {
                videoType: type,
                propertyId: propertyId,
                title: navigation.getParam('title')
              });
            }
            break;
        }
      },
    );
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

  const onSearch =async (text) => {
    if(text.length>0){
      const {data} = await request({
      url: `/agents/autoCompleteAndGetAgents?username=${text}%`,
      config: {
        method: 'GET',
      },
    });
  
    setAgents(data)
  }else{
    setAgents([])
  }
    
  }

  checkAccess();

  return (
    <View style={styles.equalFlex}>
      <StatusBar translucent={true} backgroundColor={'rgba(0, 0, 0, 0.1)'} barStyle="dark-content" />

      <View style={styles.equalFlex}>
        <View style={styles.name}>
          <Text style={styles.agencyName}>360Test</Text>
          {/* <Text style={styles.agencyName}>{currentProperty.property.agency.name}</Text> */}

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
                        <Text style={[styles.text, styles.textShadow]}>Update Main Video </Text>
                        <Text style={[styles.text, styles.textShadow]}>60 Seconds </Text>

                      </>
                    )}

                    {getMainVideo() === undefined && (
                      <>
                        <Image style={styles.addIcon} source={addIcon} />
                        <Text style={[styles.text, styles.textShadow]}>Shoot Main Video (60 Seconds)</Text>
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
      <Modal
          animationType={"slide"}
          transparent={true}
          presentationStyle="overFullScreen"
          visible={addAdgentModal}
          onRequestClose={() => {
            Alert.alert('Modal has now been closed.');
          }}>
          <TouchableOpacity
            // style={styles.container} 
            activeOpacity={1}
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'flex-end',
              alignItems: 'center',
              // opacity: 0.8,
              // backgroundColor:'gray',
              padding: 20, 
              borderRadius: 50,
               marginBottom: 40
            }}
            onPressOut={() => setAddAdgentModal(!addAdgentModal)}
          >

            {/* <View > */}


            <TouchableWithoutFeedback>

              <View style={{
                width: '100%',
                height: Dimensions.get('window').height / 1.4,
                backgroundColor: '#fff',
                borderRadius: 20,
                padding: 20
              }}>
                
                <SearchBar onChangeText={(text) => {onSearch(text)}}/>
                {selectedUsers.length > 0 && <View style={{height:'20%'}}>
                <FlatList
            data={selectedUsers}
            styles={{width:'100%', height:'20%', alignItems: 'center'}}
           horizontal={true}

            renderItem={({item}) => {
              console.log("Item in flatlist", item)
              return <View style={{ paddingVertical:10,alignItems: 'center',paddingHorizontal:20}}>
                <TouchableOpacity style={{alignItems: 'center'}} onPress={() => {
                  console.log("Before Data", selectedUsersID)

                  const dataRemoved = selectedUsers.filter((el) => {
                    return el.id !== item.id;
                  });
                  setSelectedUsers(dataRemoved)

                  const dataRemoved2 = selectedUsersID.filter((el) => {
                    return el !== item.id;
                  });
                  setSelectedUsersID(dataRemoved2)
                  console.log("After Data", selectedUsersID)
                  // setSelectedUsersID.push(item.id)
                  // // setselectedUsers(item)
                  // setSelectedUsers(item)
                }}>
                    <Image style={{width: 70, height: 70, borderRadius: 50}} source={{ uri: item.profile_photo_url}}></Image>
                    {/* <Checkmark/> */}
                     <View style={{position: 'absolute', top:2, right: 0 }}>
                    <Ionicons name="checkmark-circle" size={20} color= 'green'/>

                    </View> 
                    <Text style={{ textAlign: 'center'}}>{item.username}</Text>
                  </TouchableOpacity>
                
                {/* <Text style={{ color: '#424949'}}>{item.co}</Text> */}
              </View>
            }}
          />
                </View>}
             
                
                <Text style={{textAlign:'center', color:'gray'}}>Searched Result</Text>
                
               
                <FlatList
            data={agents}
            styles={{width:'100%', alignItems: 'center'}}
            numColumns={3}
            showsHorizontalScrollIndicator={false}
            renderItem={({item}) => {
              console.log("Item in flatlist", item)
              return <View style={{ paddingVertical:10, width: '33%',alignItems: 'center'}}>
                <TouchableOpacity style={{alignItems: 'center'}} onPress={() => {
                  // setSelectedUsersID.push(item.id)
                  setSelectedUsers([...selectedUsers, item])
                  setSelectedUsersID([...selectedUsersID, item.id])
                  setAgents([])
                  // // setselectedUsers(item)
                  // setSelectedUsers(item)
                }}>
                    <Image style={{width: 70, height: 70, borderRadius: 50}} source={{ uri: item.profile_photo_url}}></Image>
                    {/* <Checkmark/> */}
                     <View style={{position: 'absolute', top:0, right: 0 }}>
                   

                    </View> 
                    <Text style={{ textAlign: 'center'}}>{item.username}</Text>
                  </TouchableOpacity>
                
                {/* <Text style={{ color: '#424949'}}>{item.co}</Text> */}
              </View>
            }}
          />



        {selectedUsersID.length > 0 &&<GradientButton style={{ paddingVertical: 10 }} onPress={() => DoneSearch()}>Add</GradientButton>}
                </View>
              
             


            </TouchableWithoutFeedback>
            <View style={{
                width: '100%',
                height: 50,
                backgroundColor: '#fff',
                borderRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
                // padding: 20,
                marginTop: 20
              }}>

                  <Text style={{fontSize: 20}}>Cancel</Text>

            
              </View>
            {/* </View> */}
            {/* </TouchableWithoutFeedback> */}
          </TouchableOpacity>
        </Modal>
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
