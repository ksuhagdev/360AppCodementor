import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { View, Alert } from 'react-native';
import GradientButton from '../../../../components/Button';
import { TitleTextField } from '../../../../components/TextField';
import { handleNewProperty } from '../../../../actions/property';

export default function AddTitle({ navigation }) {
  const [title, setTitle] = useState('');
  const dispatch = useDispatch();

  const handleBtnPress = () => {
    if (title) {
      dispatch(handleNewProperty({ title }));
      navigation.navigate('NewProperty_Screen3');
    } else {
      Alert.alert('Please enter all required fields');
    }
  };

  return (
    <View style={{ paddingHorizontal: 20, paddingVertical: 25, flex: 1 }}>
      <TitleTextField title="Title" placeholder="Bathroom with sauna" value={title} handleChange={text => setTitle(text)} />

      <View style={{ justifyContent: 'flex-end', flex: 1 }}>
        <GradientButton onPress={handleBtnPress}>DONE</GradientButton>
      </View>
    </View>
  );
}

AddTitle.navigationOptions = {
  title: 'Add Title',
};
