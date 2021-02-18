import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, KeyboardAvoidingView, Text, SafeAreaView, ScrollView, ActivityIndicator, StatusBar, Keyboard, Alert, StyleSheet } from 'react-native';
import { useForm } from 'react-hook-form';
import GradientButton from '../../../components/Button';
import { TitleTextField, TextArea } from '../../../components/TextField';
import { updateProfile, getAgentProfileDetails } from '../../../actions/agent';

export default function EditAgentProfile({ navigation }) {
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

  const saveProfile = () => {
    triggerValidation();
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
    triggerValidation();
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
  btnContainer: {
    padding: 20,
  },
  container: {
    flex: 1,
  },
  containerView: {
    flex: 1,
    justifyContent: 'space-between',
  },
  formGroup: {
    marginVertical: 12,
  },
  formGroupLast: {
    paddingBottom: 30,
  },
  header: {
    color: 'rgba(0,0,0,0.4)',
    fontSize: 11,
    fontFamily: 'font-light',
    textTransform: 'uppercase',
  },
  italicText: {
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  marginVert: {
    marginVertical: 12,
  },
  scrollView: {
    padding: 20,
  },
  text: {
    color: 'rgba(0,0,0,0.5)',
    fontFamily: 'font-regular',
    fontSize: 13,
  },
  textField: {
    color: 'rgba(0,0,0,0.99)',
    fontFamily: 'font-light',
    fontSize: 15,
  },
  textInput: {
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderColor: 'transparent',
    borderWidth: 0.5,
    paddingHorizontal: 0,
    paddingVertical: 10,
  },
});
