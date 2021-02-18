import React from 'react';
import { View, Text } from 'react-native';
import GradientButton from '../../../components/Button';
import { TextField } from '../../../components/TextField';

export default function PrivateEmail({ navigation }) {
  const [value, setValue] = React.useState('');

  return (
    <View style={{ paddingHorizontal: 20, paddingVertical: 25, flex: 1 }}>
      <View
        style={{
          paddingBottom: 23,
          borderBottomColor: 'rgba(0, 0, 0, 0.1)',
          borderBottomWidth: 0.5,
        }}>
        <Text style={{ fontSize: 15, lineHeight: 18, fontFamily: 'font-light' }}>
          Please provide a private email, so that we can assing your account to as a back-up email authentication
        </Text>
      </View>
      <View style={{ paddingTop: 22 }}>
        <Text
          style={{
            fontSize: 15,
            color: '#000',
            marginBottom: 4,
            fontFamily: 'font-regular',
          }}>
          Your personal email
        </Text>
        <TextField value={value} placeholder="Please provide for additional authentication" handleChange={text => setValue(text)} />
      </View>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <GradientButton>DONE</GradientButton>
      </View>
    </View>
  );
}

PrivateEmail.navigationOptions = {
  title: 'Private Email',
};
