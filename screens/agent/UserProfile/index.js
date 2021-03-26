import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  Linking,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-community/async-storage';
import Axios from '../../../utils/axios-plugin';
import CameraActions from '../AgentHome/Actions';
import { handleSnackbar } from '../../../helper/functions/snackbar';
import { colors } from '../../../theme/constants';
import ListSection from '../../../components/List/ListSection';
import ListItem from '../../../components/List/ListItem';
import { logout } from '../../../actions/account-actions';
import { getFollowingCount } from '../../../actions/follow';
import { getLikedCount } from '../../../actions/like';
import { getPayload } from '../../../utils/TokenService';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
const defaultProfileImage = require('../../../assets/image/default-profile-pic.png');

export default function UserProfile({ navigation }) {
  const [profileImage, setProfileImage] = React.useState(defaultProfileImage);
  const [user, setUser] = React.useState({});
  const [role, setRole] = React.useState('');
  const dispatch = useDispatch();
  const { accessToken,data } = useSelector(state => state.account);
  const { followingCount } = useSelector(state => state.follow);
  const { likedCount } = useSelector(state => state.like);
  const pickerOptions = {
    title: 'Edit profile photo',
    cancelButtonTitle: 'Cancel',
    takePhotoButtonTitle: 'Take Photo',
    chooseFromLibraryButtonTitle: 'Upload from Photo Gallery',
    cameraType: 'front',
    mediaType: 'photo',
    maxWidth: 400,
    maxHeight: 400,
    quality: 0.75,
    allowsEditing: true,
    permissionDenied: {
      text: '360 needs permission to access to your Gallery to let you select a photo to upload, and permission to acess your camera to take a photo',
      reTryTitle: 'Retry',
      okTitle: 'Cancel',
    },
  };

  const editUserProfile = () => {
    if(role === 'AGENT'){
      navigation.navigate('EditPersonalInfo', { userId: user.id });

    }
    if(role === 'USER'){
      navigation.navigate('EditProfileInfo',{ userId: user.id })
    }
  };

  const editAgentProfile = () => {
    navigation.navigate('EditAgentProfile', { agentId: user.id });
  };

  const handleActionsPress = () => {
    ImagePicker.showImagePicker(pickerOptions, response => {
      if (response.didCancel) {
      } else if (response.error) {
        Alert.alert(
          '',
          '360 needs permission to access your Gallery to let you select a photo to upload, and permission to access your camera to take a photo',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Open settings',
              onPress: () => {
                Linking.openSettings();
              },
            },
          ],
        );
      } else {
        setProfileImage({ uri: response.uri });
        updateProfilePhoto(response.uri);
      }
    });
  };
  const agentRequest = () => {
  
    if(data){
      console.log("User Data", data)
      const state = {
        email: data.user.email,
      }
      navigation.navigate('SignupAgentInfo',{
        state: state, changeRequest: true
      })
    }
  }
  const updateProfilePhoto = async uri => {
    const formData = new FormData();
    const name = 'profile_pic.png';

    formData.append('photo', { uri, type: 'image/png', name });

    try {
      const { data } = await Axios({
        url: '/users/profile-photo',
        method: 'POST',
        data: formData,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });

      const currentUser = { ...user };

      currentUser.profile_photo_url = data.profile_photo_url;

      setUser(currentUser);
      setProfileImage({ uri: data.profile_photo_url });

      AsyncStorage.setItem('user', JSON.stringify(currentUser));
    } catch (error) {
      console.log(error);
      handleSnackbar({ message: 'Profile picture could not be uploaded at this time. Please retry in a bit.' });
    }
  };

  const onLogoutPressed = () => {
    dispatch(logout());
  };

  useEffect(() => {
    // const didFocus = navigation.addListener('didFocus', async () => {
      console.log("Inside")
      // setRole('UNAUTHED');
      const getUser = async () => {

      
      if(accessToken){
        const payload = getPayload(accessToken);
        console.log("Payload", accessToken)
        
        if (payload) {
          const currentUser = JSON.parse(await AsyncStorage.getItem('user'));
  
          if (currentUser.profile_photo_url) {
            setProfileImage({ uri: currentUser.profile_photo_url });
          }
  
          setRole(payload.role);
          setUser(currentUser);
  
          dispatch(getFollowingCount());
          dispatch(getLikedCount());
        }
      }
       else {
        setRole('UNAUTHED');
      }

      }
      getUser()
    // });

    // return () => {
    //   didFocus.remove();
    // };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar translucent={true} backgroundColor={'rgba(0, 0, 0, 0.1)'} barStyle="dark-content" />
      <SafeAreaView style={styles.fullWidth}>
      <ScrollView stickyHeaderIndices={[1]}>
        {role === '' && (
          <View style={styles.alignCenter}>
            <ActivityIndicator color="#d81b60" size="large" />
          </View>
        )}
 
        {role !== '' && (
          <View style={{justifyContent:'center', }}>
            {(role === 'AGENT' || role === 'USER') && (
              <View style={styles.photoContainer}>
                <Image style={styles.img} source={profileImage} />

                <View>
                  <Text style={styles.text}>
                    {user.first_name} {user.last_name}
                  </Text>

                  {/* <TouchableOpacity onPress={handleActionsPress}>
                    <Text style={[styles.text, styles.editLink]}>Edit photo</Text>
                  </TouchableOpacity> */}
                </View>
              </View>
            )}

      
              {role !== 'UNAUTHED' && (
                <View style={styles.ctaContainer}>
                  <TouchableOpacity onPress={() => navigation.navigate('LikedProperties')}>
                    <View style={styles.cta}>
                      <Text style={styles.ctaText}>{likedCount}</Text>

                      <Text style={styles.ctaDescription}>Liked properties</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => navigation.navigate('FollowContainer', { displayType: 'following' })}>
                    <View style={styles.cta}>
                      <Text style={styles.ctaText}>{followingCount}</Text>
                      <Text style={styles.ctaDescription}>Agents Following</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.listContainer}>
              
                {role === 'AGENT' && (
                  <ListSection style={styles.listGroup} title="My portfolio">
                    <ListItem
                      hasBorderBottom={true}
                      text="Active properties"
                      onPress={() => navigation.navigate('AgentProfile', { agentId: user.id, activeTab: 'active' })}
                    />
                    <ListItem
                      hasBorderBottom={true}
                      text="Offline properties"
                      onPress={() => navigation.navigate('AgentProfile', { agentId: user.id, activeTab: 'drafts' })}
                    />
                  </ListSection>
                )}

                <ListSection style={styles.listGroup} title="Account">
                  {role === 'UNAUTHED' && <ListItem hasBorderBottom={true} text="Login" onPress={() => navigation.navigate('Login')} />}
                  {role === 'UNAUTHED' && <ListItem hasBorderBottom={true} text="Invite Contacts" onPress={() => navigation.navigate('Contacts')} />}
                  {/* {role !== 'UNAUTHED' && <ListItem hasBorderBottom={true} text="Personal Information" onPress={() => editUserProfile()} />} */}

                  {role === 'AGENT' && <ListItem hasBorderBottom={true} text="Edit Profile Details" onPress={() => editAgentProfile()} />}
                </ListSection>

                {(role === 'UNAUTHED') && (
                  <ListSection style={styles.listGroup} title="Sign up as an agent">
                    <ListItem hasBorderBottom={true} text="Learn about signing up as an agent" onPress={() => console.log('this works')} />
                    <ListItem hasBorderBottom={true} text="Information for agencies" onPress={() => console.log('this works')} />
                  </ListSection>
                )}
                {(role === 'USER') && (
                  <ListSection style={styles.listGroup} title="Sign up as an agent">
                    {/* <ListItem hasBorderBottom={true} text="Request to sign up as an agent" onPress={() => agentRequest()} /> */}
                    <ListItem hasBorderBottom={true} text="Information for agencies" onPress={() => console.log('this works')} />
                  </ListSection>
                )}
                <ListSection style={styles.listGroup} title="General">
                  {role !== 'UNAUTHED' && <ListItem hasBorderBottom={true} text="Push notifications" onPress={() => console.log('this works')} />}
                  <ListItem hasBorderBottom={true} text="Privacy" onPress={() => navigation.navigate('TermsCondition',{type:'privacy'})} />
                  <ListItem hasBorderBottom={true} text="Terms of Service" onPress={() => navigation.navigate('TermsCondition',{type:'tc'})}/>
                  {role !== 'UNAUTHED' && <ListItem hasBorderBottom={true} text="Logout" onPress={() => onLogoutPressed()} />}
                </ListSection>

                <ListSection style={styles.listGroup} title="Support">
                  <ListItem hasBorderBottom={true} text="Report a problem" onPress={() => console.log('this works')} />
                </ListSection>
                
              </View>
              
          </View>
          
        )}
</ScrollView>
        {/* <CameraActions navigation={navigation} bgColor="#fff" color="#000" /> */}
        
      </SafeAreaView>
    </View>
  );
}

UserProfile.navigationOptions = {
  title: 'User Profile',
};

const styles = StyleSheet.create({
  alignCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent:'center'

    // height: Dimensions.get('window').height,
  },
  cta: {
    alignItems: 'center',
    paddingHorizontal: 36,
  },
  ctaContainer: {
    borderBottomColor: 'rgba(0,0,0,0.1)',
    borderBottomWidth: 0.5,
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  ctaDescription: {
    fontSize: 11,
    fontFamily: 'font-bold',
    color: colors.primary,
    textTransform: 'uppercase',
  },
  ctaText: {
    fontSize: 20,
    fontFamily: 'font-bold',
    marginBottom: 6,
  },
  editLink: {
    fontSize: 11,
    color: colors.primary,
    marginTop: 6,
    textTransform: 'uppercase',
  },
  fullWidth: {
    width: '100%',
    height: '100%',
    alignContent:'center',
    justifyContent:'center',
    paddingTop: 50
    // paddingTop:40
  },
  img: {
    borderRadius: 50,
    height: 100,
    marginRight: 13,
    width: 100,
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  listGroup: {
    marginTop: 26.5,
  },
  photoContainer: {
    alignItems: 'center',
    // flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    padding: 20,
  },
  text: {
    fontFamily: 'font-regular',
    fontSize: 15,
  },
});
