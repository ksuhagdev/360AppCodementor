import React from 'react';
import { useDispatch } from 'react-redux';
import { View, ScrollView, Text, Alert } from 'react-native';
import { signupAsUser } from '../../actions/account-actions';
import GradientButton from '../../components/Button';
import { TitleTextField } from '../../components/TextField';

export default function SignupAsUser({ navigation }) {
  const [state, setState] = React.useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });
  const dispatch = useDispatch();

  const handleChange = (value, key) => {
    setState({ ...state, [key]: value });
  };

  const handleOnPress = () => {
    const { first_name, last_name, email, password } = state;

    if (first_name && last_name && email && password) {
      dispatch(signupAsUser(state, navigation));
    } else {
      Alert.alert('Please enter all required fields');
    }
  };

  return (
    <View
      style={{
        paddingHorizontal: 20,
        paddingVertical: 25,
        flex: 1,
      }}>
      <ScrollView>
        <View style={{ marginTop: 12 }}>
          <TitleTextField
            title="First name"
            value={state.first_name}
            placeholder="Enter your first name"
            handleChange={text => handleChange(text, 'first_name')}
          />
        </View>
        <View style={{ marginTop: 24 }}>
          <TitleTextField title="Last name" value={state.last_name} placeholder="Enter your last name" handleChange={text => handleChange(text, 'last_name')} />
        </View>
        <View style={{ marginTop: 24 }}>
          <TitleTextField title="Email" value={state.email} placeholder="Enter your email" handleChange={text => handleChange(text, 'email')} />
        </View>
        <View style={{ marginTop: 24 }}>
          <TitleTextField
            title="Password"
            value={state.password}
            placeholder="Password"
            secureTextEntry
            handleChange={text => handleChange(text, 'password')}
          />
        </View>

        <View style={{ marginTop: 50 }}>
          <GradientButton onPress={handleOnPress}>Signup</GradientButton>
        </View>
      </ScrollView>
    </View>
  );
}

SignupAsUser.navigationOptions = {
  title: 'Signup as user',
  headerTintColor: '#000',
  headerTitleStyle: {
    fontFamily: 'font-regular',
    fontSize: 16,
  },
};
