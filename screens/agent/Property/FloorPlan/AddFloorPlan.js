import React, { useEffect } from 'react';
import { View, Alert, Image, StyleSheet, StatusBar, Linking } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import GradientButton from '../../../../components/Button';
import BorderButton from '../../../../components/Button/BorderButton';
import { handleSnackbar } from '../../../../helper/functions/snackbar';
import Axios from '../../../../utils/axios-plugin';

export default function AddFloorPlan({ navigation }) {
  const [floorPlan, setFloorPlan] = React.useState(null);
  const [floorPlanUrl, setFloorPlanUrl] = React.useState(null);
  const [apiLoading, setApiLoading] = React.useState(false);
  const pickerOptions = {
    title: 'Add floor plan',
    cancelButtonTitle: 'Cancel',
    takePhotoButtonTitle: 'Take Photo',
    chooseFromLibraryButtonTitle: 'Upload from Gallery',
    cameraType: 'back',
    mediaType: 'photo',
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.75,
    allowsEditing: true,
    permissionDenied: {
      text: '360 needs permission to access to your Gallery to let you select a photo to upload, and permission to acess your camera to take a photo',
      reTryTitle: 'Retry',
      okTitle: 'Cancel',
    },
  };

  const getFormData = async () => {
    const data = new FormData();
    const name = `floor_plan_property_${navigation.getParam('propertyId')}`;

    data.append('floor_plan', { uri: floorPlan, type: 'image/png', name });

    return data;
  };

  const onPressSelect = () => {
    ImagePicker.showImagePicker(pickerOptions, response => {
      if (response.didCancel) {
      } else if (response.error) {
        Alert.alert(
          '',
          '360 needs permission to access your Gallery to let you select a photo to upload, and permission to access your camera to take a photo',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Open settings',
              onPress: () => {
                Linking.openSettings();
              },
            },
          ],
        );
      } else {
        setFloorPlan(response.uri);
      }
    });
  };

  const onUpload = async () => {
    setApiLoading(true);

    try {
      const payload = await getFormData();
      const propertyId = navigation.getParam('propertyId');

      const { data } = await Axios({
        url: `/properties/${propertyId}/add-floor-plan`,
        method: 'POST',
        data: payload,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });

      setApiLoading(false);
      setFloorPlan(null);
      setFloorPlanUrl(data.floor_plan_url);
    } catch (error) {
      console.log('Error: ', error);
      setApiLoading(false);
      handleSnackbar({
        message: 'Floor plan could not be uploaded at this time. Please retry in a little bit.',
      });
    }
  };

  useEffect(() => {
    if (navigation.getParam('floorPlanUrl', null)) {
      setFloorPlanUrl(navigation.getParam('floorPlanUrl'));
    }
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar translucent={true} backgroundColor={'rgba(0, 0, 0, 0.1)'} barStyle="dark-content" />

      {floorPlan && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: floorPlan }} resizeMode="cover" style={styles.image} />

          <View style={styles.button}>
            <BorderButton onPress={() => onUpload()} isActive={apiLoading} disabled={apiLoading}>
              UPLOAD
            </BorderButton>
          </View>
        </View>
      )}

      {!floorPlan && floorPlanUrl && <Image source={{ uri: floorPlanUrl }} resizeMode="contain" style={styles.image} />}

      {!floorPlan && !floorPlanUrl && <Icon name="image" size={250} color="#ddd" style={styles.placeholder} />}

      <View style={styles.button}>
        <GradientButton onPress={() => onPressSelect()} disabled={apiLoading}>
          ADD
        </GradientButton>
      </View>
    </View>
  );
}

AddFloorPlan.navigationOptions = ({ navigation }) => {
  return {
    title: 'Add Floor Plan',
  };
};

const styles = StyleSheet.create({
  button: {
    width: '50%',
    marginBottom: 15,
  },
  container: {
    backgroundColor: '#fff',
    flex: 1,
    width: '100%',
    alignItems: 'center',
    height: '100%',
    paddingTop: 100,
  },
  image: {
    width: '90%',
    height: 300,
    marginBottom: 20,
  },
  imageContainer: {
    alignItems: 'center',
    width: '100%',
    height: 300,
    marginBottom: 80,
  },
  placeholder: {
    marginBottom: 25,
  },
  text: {
    color: '#000',
  },
});
