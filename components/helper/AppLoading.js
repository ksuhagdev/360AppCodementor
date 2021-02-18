import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { ActivityIndicator, View } from 'react-native';
import { colors } from '../../theme/constants';

function AppLoading({ fontLoaded }) {
  const loading = useSelector(state => state.app.loading);
  const show = loading || !fontLoaded;

  return (
    show && (
      <View
        style={{
          flex: 1,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.6)',
        }}>
        <ActivityIndicator size={50} color={colors.primary} />
      </View>
    )
  );
}

export default memo(AppLoading);
