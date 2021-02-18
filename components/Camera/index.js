import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';
import { NoCameraPermission } from '../helper/NoPermission';
import { requestCamera } from '../../helper/functions/permission';
import { handleSnackbar } from '../../helper/functions/snackbar';
import ColorFade from '../helper/ColorFade';

export default function CameraView({ children }) {
  const [hasPermission, setHasPermission] = useState(false);

  React.useEffect(() => {
    (async () => {
      const { granted } = await Camera.getPermissionsAsync();
      setHasPermission(granted);
      if (!granted) {
        handlePermission();
        handleSnackbar({ message: 'No Permission to access Camera' });
      }
    })();
  }, []);

  const handlePermission = () => {
    requestCamera(granted => {
      setHasPermission(granted);
    });
  };

  // if (!hasPermission) {
  //   return <NoCameraPermission requestCamera={handlePermission} />;
  // }

  return (
    <View style={styles.container}>
      <Camera style={{ flex: 1 }} type={Camera.Constants.Type.back} ratio="16:9">
        <ColorFade colors={['rgba(0,0,0, 0.7)', 'transparent']} />
        <View style={styles.cameraWrapper} />
      </Camera>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  cameraWrapper: {
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    position: 'relative',
    // backgroundColor: "#000",
  },
});
