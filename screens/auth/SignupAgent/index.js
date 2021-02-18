import React from 'react';
import { View, ScrollView, Alert } from 'react-native';
import GradientButton from '../../../components/Button';
import { TitleTextField } from '../../../components/TextField';

export default function SignupAsAgent({ navigation }) {
  const [state, setState] = React.useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });

  const handleChange = (value, key) => {
    setState({ ...state, [key]: value });
  };

  const handleOnPress = () => {
    const { first_name, last_name, email, password } = state;

    if (first_name && last_name && email && password) {
      navigation.navigate('SignupAgentInfo', {
        previousInfo: { ...state, role: 'AGENT' }, changeRequest: false,
      });
    } else {
      Alert.alert('Please enter all required');
    }
  };

  return (
    <View style={{ paddingHorizontal: 20, paddingVertical: 25, flex: 1 }}>
      <ScrollView>
        <TitleTextField title="Your first name" value={state.first_name} placeholder="First name" handleChange={text => handleChange(text, 'first_name')} />
        <View style={{ marginTop: 24 }}>
          <TitleTextField title="Your last name" value={state.last_name} placeholder="Last name" handleChange={text => handleChange(text, 'last_name')} />
        </View>
        <View style={{ marginTop: 24 }}>
          <TitleTextField title="Your work email" value={state.email} placeholder="Email" keyboardType="email-address" handleChange={text => handleChange(text, 'email')} />
        </View>
        <View style={{ marginTop: 24 }}>
          <TitleTextField
            title="Password"
            value={state.password}
            placeholder="Enter your Password"
            secureTextEntry={true}
            handleChange={text => handleChange(text, 'password')}
          />
        </View>
      </ScrollView>

      <View style={{ justifyContent: 'flex-end' }}>
        <GradientButton onPress={handleOnPress}>CONTINUE</GradientButton>
      </View>
    </View>
  );
}

SignupAsAgent.navigationOptions = {
  title: 'Sign Up as Agent',
  headerTintColor: '#000',
  headerTitleStyle: {
    fontFamily: 'font-regular',
    fontSize: 16,
  },
};
