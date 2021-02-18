import React from 'react';
import { View, Image } from 'react-native';
import { Switch } from 'react-native-switch';
import { colors } from '../../theme/constants';

export default function({ value, handleChange }) {
  return (
    <Switch
      value={value}
      circleSize={22}
      barHeight={28}
      circleBorderWidth={0}
      renderInsideCircle={() => <Circle value={value} />}
      switchLeftPx={3}
      switchRightPx={3}
      backgroundInactive="rgba(0,0,0,0.1)"
      backgroundActive={colors.blue}
      onValueChange={isSwitchOn => handleChange(isSwitchOn)}
    />
  );
}

function Circle({ value }) {
  return (
    <View
      style={{
        width: 18,
        height: 18,
        borderRadius: 50,
        borderWidth: 9,
        borderColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {value && <Image source={require('../../assets/image/done-blue.png')} style={{ width: 12, height: 10 }} />}
    </View>
  );
}
