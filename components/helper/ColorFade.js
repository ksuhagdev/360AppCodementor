import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function ColorFade({ height = 100, top = 0, zIndex = -1, colors }) {
  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top,
        height,
        zIndex,
      }}>
      <LinearGradient
        colors={colors}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </View>
  );
}
