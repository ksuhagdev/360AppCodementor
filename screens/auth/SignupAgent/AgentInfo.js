import React from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { stat } from 'react-native-fs';
import GradientButton from '../../../components/Button';
import { TitleTextField } from '../../../components/TextField';

export default function SignupAgentInfo({ navigation }) {
  const [state, setState] = React.useState({
    title: '',
    profile_description: '',
    name: '',
    address: '',
    agency_linkedin_profile_url: null,
    instagram_url: null,
    facebook_url: null,
    twitter_url: null,
    youtube_url: null,
    // instagram_url: null,
    // facebook_url: null,
    // twitter_url: null,
    // youtube_url: null,
  });
  const userInfo = navigation.state.params.previousInfo;
  const changeRequest = navigation.state.params.changeRequest;
  const handleChange = (value, key) => {
    setState({ ...state, [key]: value });
  };

  const handleOnPress = () => {
    const { title, profile_description } = state;
    if(changeRequest){
      const data = {
        previousInfo: {...navigation.state.params.state,
        agent: {title: state.title,profile_description: state.profile_description}},
        name: state.name, address: state.address
      }
      navigation.navigate('SignupAgencyInfo',{
        previousInfo: {...navigation.state.params.state,
          agent: {title: state.title,profile_description: state.profile_description}},
          name: state.name, address: state.address, changeRequest: true
      })
    }else if (title && profile_description) {
      navigation.navigate('SignupAgencyInfo', {
        previousInfo: { user: userInfo, agent: {title: state.title,profile_description: state.profile_description} },name: state.name, address: state.address, changeRequest: false
      });
    } else {
      Alert.alert('Please enter Title and profile description');
    }
  };

  return (
    <View style={{ paddingHorizontal: 20, paddingVertical: 25, flex: 1 }}>
      <ScrollView>
        <TitleTextField title="Your Job title" placeholder="Ex - Sales Agent, Auction Attractor" value={state.title} handleChange={text => handleChange(text, 'title')} />
        <View style={{ marginTop: 24 }}>
          <TitleTextField
            title="Your Profile description"
            value={state.profile_description}
            placeholder="Profile description"
            handleChange={text => handleChange(text, 'profile_description')}
          />
        </View>
        <TitleTextField title="Your agency name" value={state.name} placeholder="Agency name" handleChange={text => handleChange(text, 'name')} />
        <View style={{ marginTop: 24 }}>
          <TitleTextField
            title="Your agency address"
            value={state.address}
            placeholder="Enter your address"
            handleChange={text => handleChange(text, 'address')}
          />
        </View>
        {/* <View style={{ marginTop: 24 }}>
          <TitleTextField
            title="Your Instagram account"
            value={state.instagram_url}
            optional
            placeholder="Add"
            handleChange={text => handleChange(text, 'instagram_url')}
          />
        </View>
        <View style={{ marginTop: 24 }}>
          <TitleTextField
            title="Your Facebook page"
            value={state.facebook_url}
            optional
            placeholder="Add"
            handleChange={text => handleChange(text, 'facebook_url')}
          />
        </View>
        <View style={{ marginTop: 24 }}>
          <TitleTextField
            title="Your Twitter handle"
            value={state.twitter_url}
            optional
            placeholder="Add"
            handleChange={text => handleChange(text, 'twitter_url')}
          />
        </View>
        <View style={{ marginTop: 24 }}>
          <TitleTextField
            title="Your Youtube channel"
            value={state.youtube_url}
            optional
            placeholder="Add"
            handleChange={text => handleChange(text, 'youtube_url')}
          />
        </View> */}
      </ScrollView>

      <View style={{ justifyContent: 'flex-end' }}>
        <GradientButton onPress={handleOnPress}>DONE</GradientButton>
      </View>
    </View>
  );
}

SignupAgentInfo.navigationOptions = {
  title: 'Sign Up as Agent',
  headerTintColor: '#000',
  headerTitleStyle: {
    fontFamily: 'font-regular',
    fontSize: 16,
  },
};
