import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { colors } from '../../theme/constants';

export default function Checkbox({ checked, handleOnPress }) {
  return (
    <TouchableOpacity onPress={handleOnPress}>
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: 50,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: checked ? colors.blue : '#D9D9D9',
        }}>
        {checked && <Image source={require('../../assets/image/done-white.png')} style={{ width: 15, height: 12 }} />}
      </View>
    </TouchableOpacity>
  );
}
