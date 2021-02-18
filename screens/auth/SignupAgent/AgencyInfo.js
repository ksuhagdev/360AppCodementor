import React from 'react';
import { useDispatch } from 'react-redux';
import { View, ScrollView, Alert } from 'react-native';
import GradientButton from '../../../components/Button';
import { TitleTextField } from '../../../components/TextField';
import { signupAsAgent, requestforAgent } from '../../../actions/account-actions';

export default function SignupAgencyInfo({ navigation }) {
  const [state, setState] = React.useState({
     name: navigation.state.params.name,
    address: navigation.state.params.address,
    agency_linkedin_profile_url: null,
    instagram_url: null,
    facebook_url: null,
    twitter_url: null,
    youtube_url: null,
  });
  const dispatch = useDispatch();
  const previousInfo = navigation.state.params.previousInfo;
  const changeRequest = navigation.state.params.changeRequest
  const handleChange = (value, key) => {
    setState({ ...state, [key]: value });
  };

  const handleOnPress = () => {
    
   
    // var agency = [...previousInfo.agency, state]
    
    // const signupData = {
    //   agency:agency,
    //   user: previousInfo.user,
    //   agent:previousInfo.agent
    // }
    if(changeRequest){
      const signupData = {
        ...navigation.state.params.previousInfo,
        agency: state
      };
      console.log("Sign up for request", signupData)
      dispatch(requestforAgent(signupData,navigation))
    }else{
      const signupData = {
        ...previousInfo,
        agency: state,
      };
      console.log("Previous Data",signupData)
     dispatch(signupAsAgent(signupData, navigation));
    }
  };

  return (
    <View style={{ paddingHorizontal: 20, paddingVertical: 25, flex: 1 }}>
      <ScrollView>
        {/* <TitleTextField title="Your agency name" value={state.name} placeholder="Agency name" handleChange={text => handleChange(text, 'name')} />
        <View style={{ marginTop: 24 }}>
          <TitleTextField
            title="Your agency address"
            value={state.address}
            placeholder="Enter your address"
            handleChange={text => handleChange(text, 'address')}
          />
        </View>
         */}
         <View style={{ marginTop: 24 }}>
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
        </View>
        <View style={{ marginTop: 24, marginBottom: 30 }}>
          <TitleTextField
            title="Your LinkedIn profile"
            value={state.agency_linkedin_profile_url}
            optional
            placeholder="Senior Partner for example"
            handleChange={text => handleChange(text, 'agency_linkedin_profile_url')}
          />
        </View>
      </ScrollView>

      <View style={{ justifyContent: 'flex-end' }}>
        <GradientButton onPress={handleOnPress}>CONTINUE</GradientButton>
      </View>
    </View>
  );
}

SignupAgencyInfo.navigationOptions = {
  title: 'Sign Up as Agent',
  headerTintColor: '#000',
  headerTitleStyle: {
    fontFamily: 'font-regular',
    fontSize: 16,
  },
};
