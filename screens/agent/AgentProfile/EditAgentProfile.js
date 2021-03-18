import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, KeyboardAvoidingView, Text, SafeAreaView, ScrollView, ActivityIndicator, StatusBar,TextInput, TouchableOpacity, Keyboard, Alert, StyleSheet, Image } from 'react-native';
import { useForm } from 'react-hook-form';
import GradientButton from '../../../components/Button';
import { TitleTextField,TextArea2, TextArea,TitleTextField2 } from '../../../components/TextField';
import { updateProfile, getAgentProfileDetails } from '../../../actions/agent';
import { colors } from '../../../theme/constants';
const defaultProfileImage = require('../../../assets/image/default-profile-pic.png');
import { getPayload } from '../../../utils/TokenService';
import AsyncStorage from '@react-native-community/async-storage';
import Axios from '../../../utils/axios-plugin';
import { handleSnackbar } from '../../../helper/functions/snackbar';

import {
  launchCamera,
  launchImageLibrary
} from 'react-native-image-picker';

export default function EditAgentProfile({ navigation }) {
  const [profileImage, setProfileImage] = React.useState(defaultProfileImage);
  const [user, setUser] = React.useState({});

  const [firstname, setFirstname] = useState('')
  const [last_name, setLastName] = useState('')
  const [state, setState] = useState({
    title: null,
    profile_description: null,
    linkedin_url: null,
    instagram_url: null,
    facebook: null,
    twitter_url: null,
    youtube_url: null,
  });
  const [hasLoaded, setHasLoaded] = useState(false);
  const dispatch = useDispatch();
  const { register, handleSubmit, setValue, errors, triggerValidation } = useForm({
    mode: 'onChange',
  });
  const userId = navigation.getParam('agentId');
  const { isProfileLoading, isProfileUpdating, agentProfile } = useSelector(store => store.agent);
  const { accessToken, data } = useSelector(state => state.account);


  const saveProfile = () => {
    // triggerValidation();
    Keyboard.dismiss();

    if (state.title) {
      const urlTypes = ['linkedin_url', 'instagram_url', 'facebook', 'twitter_url', 'youtube_url'];
      const urls = {};

      urlTypes.forEach(urlType => {
        urls[urlType] = getUrlWithHandle(state[urlType], urlType);
      });

      agentProfile.agent = {
        ...agentProfile.agent,
        ...urls,
      };

      dispatch(updateProfile());
    } else {
      Alert.alert('', 'Enter your job title at your agency');
    }
  };

  const updateField = (value, key) => {
    setState({
      ...state,
      [key]: value,
    });
    setValue(key, value);
    // triggerValidation();
  };

  const getHandleFromUrl = url => {
    if (url) {
      const parts = url.split('/');

      return parts[parts.length - 1];
    }

    return null;
  };

  const getUrlWithHandle = (handle, domain) => {
    let url = null;

    if (!handle) {
      return null;
    }

    switch (domain) {
      case 'linkedin_url':
        url = `https://www.linkedin.com/in/${handle}`;
        break;
      case 'instagram_url':
        url = `https://www.instagram.com/${handle}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/${handle}`;
        break;
      case 'twitter_url':
        url = `https://www.twitter.com/${handle}`;
        break;
      case 'youtube_url':
        url = `https://www.youtube.com/user/${handle}`;
        break;
    }

    console.log('URL with handle: ', url);

    return url;
  };

  useEffect(() => {
    if (!agentProfile) {
      dispatch(getAgentProfileDetails(userId));
    }

    if (agentProfile && !hasLoaded) {
      const handleRegex = /^[a-z0-9\-_\.]+$/i;
      console.log("Agent Profile", agentProfile)
      setState({
        
        title: agentProfile.agent.title,
        profile_description: agentProfile.agent.profile_description,
        linkedin_url: getHandleFromUrl(agentProfile.agent.linkedin_url),
        instagram_url: getHandleFromUrl(agentProfile.agent.instagram_url),
        facebook: getHandleFromUrl(agentProfile.agent.facebook),
        twitter_url: getHandleFromUrl(agentProfile.agent.twitter_url),
        youtube_url: getHandleFromUrl(agentProfile.agent.youtube_url),
      });

      register({ name: 'title' }, { required: true });
      register({ name: 'linkedin_url' }, { pattern: { value: handleRegex, message: 'Enter a valid handle' }, required: false });
      register({ name: 'instagram_url' }, { pattern: { value: handleRegex, message: 'Enter a valid handle' }, required: false });
      register({ name: 'facebook' }, { pattern: { value: handleRegex, message: 'Enter a valid handle' }, required: false });
      register({ name: 'twitter_url' }, { pattern: { value: handleRegex, message: 'Enter a valid handle' }, required: false });
      register({ name: 'youtube_url' }, { pattern: { value: handleRegex, message: 'Enter a valid handle' }, required: false });

      setValue('title', agentProfile.agent.title);
      setValue('linkedin_url', getHandleFromUrl(agentProfile.agent.linkedin_url) || '');
      setValue('instagram_url', getHandleFromUrl(agentProfile.agent.instagram_url) || '');
      setValue('facebook', getHandleFromUrl(agentProfile.agent.facebook) || '');
      setValue('twitter_url', getHandleFromUrl(agentProfile.agent.twitter_url) || '');
      setValue('youtube_url', getHandleFromUrl(agentProfile.agent.youtube_url) || '');

      setHasLoaded(true);
    }
  }, [userId, agentProfile, register, setValue]);

  const chooseFile =() => {
    let options = {
      mediaType: 'image/jpeg',
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
    };
    launchImageLibrary(options, (response) => {
      console.log('Response = ', response);

      // if (response.didCancel) {
      //   alert('User cancelled camera picker');
      //   return;
      // } else if (response.errorCode == 'camera_unavailable') {
      //   alert('Camera not available on device');
      //   return;
      // } else if (response.errorCode == 'permission') {
      //   alert('Permission not satisfied');
      //   return;
      // } else if (response.errorCode == 'others') {
      //   alert(response.errorMessage);
      //   return;
      // }
      console.log('base64 -> ', response.base64);
      console.log('uri -> ', response.uri);
      console.log('width -> ', response.width);
      console.log('height -> ', response.height);
      console.log('fileSize -> ', response.fileSize);
      console.log('type -> ', response.type);
      console.log('fileName -> ', response.fileName);
      if(response.uri){
        setProfileImage({ uri: response.uri });
        updateProfilePhoto(response.uri)
      }
      
    });
  };

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

  useEffect(() => {
    // const didFocus = navigation.addListener('didFocus', async () => {
    console.log("Inside")
    // setRole('UNAUTHED');
    const getUser = async () => {


      // if(accessToken){
      const payload = getPayload(accessToken);
      console.log("Payload", accessToken)

      if (payload) {
        const currentUser = JSON.parse(await AsyncStorage.getItem('user'));

        if (currentUser.profile_photo_url) {
          setProfileImage({ uri: currentUser.profile_photo_url });
        }
        console.log("Cureent User", currentUser)
        setFirstname(currentUser.first_name);
        setLastName(currentUser.last_name)
        // setRole(payload.role);
        setUser(currentUser);

        // dispatch(getFollowingCount());
        // dispatch(getLikedCount());
      }
      // }
      //  else {
      //   setRole('UNAUTHED');
      // }

    }
    getUser()
    // });

    // return () => {
    //   didFocus.remove();
    // };
  }, []);

  if (isProfileLoading || !agentProfile || !agentProfile.agent) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar translucent={true} backgroundColor={'rgba(0, 0, 0, 0.1)'} barStyle="dark-content" />

        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#d81b60" />
        </SafeAreaView>
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent={true} backgroundColor={'rgba(0, 0, 0, 0.1)'} barStyle="dark-content" />
      <KeyboardAvoidingView style={styles.containerView} enabled={true} behavior="padding" keyboardVerticalOffset={100}>
        {/* <ScrollView style={styles.scrollView}>
        
      </ScrollView> */}
        {/* <View style={{justifyContent: 'center'}}> */}
        <View style={styles.photoContainer}>
          <Image style={styles.img} source={profileImage} />

          <View>

            <TouchableOpacity onPress={chooseFile}>
              <Text style={[styles.text, styles.editLink]}>Change Profile Picture</Text>
            </TouchableOpacity>
          </View>
        </View>
      
          <View style={{marginTop: 20, margin:10, flexDirection: 'row'}}>
            <Text style={{fontSize:16, width:'30%'}}>Name</Text>
            <View style={{flexDirection: 'row',width:'60%', borderBottomWidth: 0.25,}}>
            <Text style={{fontSize:16, width:'60%', marginBottom:15}}>{firstname} {last_name}</Text>
            
             {/* <TextInput style={{marginBottom: 15}}></TextInput> */}
          </View>
          </View>
          {/* <View style={{margin: 10, flexDirection: 'row'}}> */}
            {/* <Text style={{fontSize:16, width:'30%'}}>Website Link</Text> */}
            {/* <View style={{flexDirection: 'row',width:'60%', borderBottomWidth: 0.25,}}> */}
            <TitleTextField2 
            title="Agent Title"
            name="title"
            placeholder="e.g. Vice President"
            value={state.title}
            returnKeyType="done"
            errors={errors}
            handleChange={value => updateField(value, 'title')} ></TitleTextField2>
            <TitleTextField2 
            title="Website Link"
            name="linkedin_url"
            placeholder=""
            value={state.linkedin_url}
            returnKeyType="done"
            errors={errors}
            handleChange={value => updateField(value, 'linkedin_url')} ></TitleTextField2>
            {/* </View> */}
          {/* </View> */}
          {/* <View style={{margin: 10, flexDirection: 'row'}}>
            <Text style={{fontSize:16, width:'30%'}}>Name</Text>
            <View style={{flexDirection: 'row', borderBottomWidth: 0.25,}}>
            <Text style={{fontSize:16, width:'60%', marginBottom:15}}>Kuldeep Suhag</Text>


            </View>

            
          </View> */}
            <View style={styles.formGroup}>
            <TextArea2
              title="Bio"
              placeholder="Type your profile description here"
              value={state.profile_description}
              maxLength={280}
              handleChange={value => updateField(value, 'profile_description')}
            />
          </View>
        {/* <Text>Hey Their</Text> */}
        {/* </View> */}
        <View style={styles.btnContainer}>
          <GradientButton onPress={handleSubmit(saveProfile)} disabled={isProfileUpdating} isActive={isProfileUpdating}>
            SAVE
          </GradientButton>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent={true} backgroundColor={'rgba(0, 0, 0, 0.1)'} barStyle="dark-content" />

      <KeyboardAvoidingView style={styles.containerView} enabled={true} behavior="padding" keyboardVerticalOffset={100}>
        <ScrollView style={styles.scrollView}>
          <Text style={styles.header}>Agent information</Text>

          <View style={styles.formGroup}>
            <TitleTextField
              title="Title"
              name="title"
              placeholder="e.g. Vice President"
              value={state.title}
              returnKeyType="done"
              errors={errors}
              handleChange={value => updateField(value, 'title')}
            />
          </View>

          <View style={styles.formGroup}>
            <TextArea
              title="Profile description"
              placeholder="Type your profile description here"
              value={state.profile_description}
              maxLength={280}
              handleChange={value => updateField(value, 'profile_description')}
            />
          </View>

          <View style={styles.formGroup}>
            <TitleTextField
              title="LinkedIn URL"
              name="linkedin_url"
              prefix="linkedin.com/in/"
              placeholder="e.g. AmyHargreaves"
              value={state.linkedin_url}
              returnKeyType="done"
              errors={errors}
              handleChange={value => updateField(value, 'linkedin_url')}
            />
          </View>

          <View style={styles.formGroup}>
            <TitleTextField
              title="Instagram URL"
              name="instagram_url"
              prefix="instagram.com/"
              placeholder="e.g. @AmyHargreaves"
              value={state.instagram_url}
              returnKeyType="done"
              errors={errors}
              handleChange={value => updateField(value, 'instagram_url')}
            />
          </View>

          <View style={styles.formGroup}>
            <TitleTextField
              title="Facebook URL"
              name="facebook"
              prefix="facebook.com/"
              placeholder="e.g. AmyHargreaves"
              value={state.facebook}
              returnKeyType="done"
              errors={errors}
              handleChange={value => updateField(value, 'facebook')}
            />
          </View>

          <View style={styles.formGroup}>
            <TitleTextField
              title="Twitter URL"
              name="twitter_url"
              prefix="twitter.com/"
              placeholder="e.g. @AmyHargreaves"
              value={state.twitter_url}
              returnKeyType="done"
              errors={errors}
              handleChange={value => updateField(value, 'twitter_url')}
            />
          </View>

          <View style={[styles.formGroup, styles.formGroupLast]}>
            <TitleTextField
              title="YouTube URL"
              name="youtube_url"
              prefix="youtube.com/user/"
              placeholder="e.g. AmyHargreaves"
              value={state.youtube_url}
              returnKeyType="done"
              errors={errors}
              handleChange={value => updateField(value, 'youtube_url')}
            />
          </View>
        </ScrollView>

        <View style={styles.btnContainer}>
          <GradientButton onPress={handleSubmit(saveProfile)} disabled={isProfileUpdating} isActive={isProfileUpdating}>
            SAVE
          </GradientButton>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

EditAgentProfile.navigationOptions = {
  title: 'Edit Agent Profile',
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  photoContainer: {
    alignItems: 'center',
    // flexDirection: 'row',
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 0.25,
  }, img: {
    borderRadius: 50,
    height: 100,
    justifyContent: 'center',
    // marginRight: 13,
    width: 100,
  },
  text: {
    fontFamily: 'font-regular',
    fontSize: 15,
    color: colors.primary,
    margin: 15,
    fontWeight: 'bold',
  },containerView: {
        flex: 1,  
        // justifyContent: 'space-between',
      },
      container: {
            flex: 1,
            backgroundColor:'#fff'
          },
            formGroup: {
                marginVertical: 12,
              },
              formGroupLast: {
                paddingBottom: 30,
              },
                btnContainer: {
    padding: 20,
  },
  // },editLink: {
  //   fontSize: 11,
  //   color: colors.primary,
  //   marginTop: 6,
  //   textTransform: 'uppercase',
  // },
})
// const styles = StyleSheet.create({
//   btnContainer: {
//     padding: 20,
//   },
//   container: {
//     flex: 1,
//     backgroundColor:'#fff'
//   },
//   containerView: {
//     flex: 1,  
//     justifyContent: 'space-between',
//   },
//   formGroup: {
//     marginVertical: 12,
//   },
//   formGroupLast: {
//     paddingBottom: 30,
//   },
//   header: {
//     color: 'rgba(0,0,0,0.4)',
//     fontSize: 11,
//     fontFamily: 'font-light',
//     textTransform: 'uppercase',
//   },
//   italicText: {
//     fontStyle: 'italic',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: '100%',
//   },
//   marginVert: {
//     marginVertical: 12,
//   },
//   scrollView: {
//     padding: 20,
//   },
//   text: {
//     color: 'rgba(0,0,0,0.5)',
//     fontFamily: 'font-regular',
//     fontSize: 13,
//   },
//   textField: {
//     color: 'rgba(0,0,0,0.99)',
//     fontFamily: 'font-light',
//     fontSize: 15,
//   },
//   textInput: {
//     borderBottomColor: 'rgba(0, 0, 0, 0.1)',
//     borderColor: 'transparent',
//     borderWidth: 0.5,
//     paddingHorizontal: 0,
//     paddingVertical: 10,
//   },
// });
