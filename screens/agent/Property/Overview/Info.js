import React from 'react';
import { View, SafeAreaView, Text, Modal, ActivityIndicator, TouchableOpacity, Platform, Linking, Alert } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { RESULTS } from 'react-native-permissions';
import ImageViewer from 'react-native-image-zoom-viewer';
import { requestLocation } from '../../../../helper/functions/permission';
import styles from './styles';
import CampaignInfo from './CampaignInfo';
import GradientButton from '../../../../components/Button';
import NumberShortner from '../../../../utils/NumberShortner';

export default function AgentInfo({ navigation, currentProperty, isPreview, hasAccess }) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const viewFloorPlan = () => {
    if (currentProperty.property.floor_plan_url) {
      setIsModalOpen(true);
    } else {
      Alert.alert('No floor plan', 'Floor plan for this property has not been provided by the agency.', [{ text: 'OK' }]);
    }
  };

  const addFloorPlan = () => {
    navigation.navigate('AddFloorPlan', { propertyId: currentProperty.property.id, floorPlanUrl: currentProperty.property.floor_plan_url });
  };

  const openStreetView = () => {
    if (currentProperty.property.lat) {
      const scheme = 'https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=';
      const lat = currentProperty.property.lat;
      const lng = currentProperty.property.lng;
      const url = `${scheme}${lat},${lng}`;

      Linking.openURL(url);
    } else {
      Alert.alert('Street View unavailable', 'Street view information has not been set for this property.', [{ text: 'OK' }]);
    }
  };

  const getDirections = async () => {
    const scheme = Platform.select({ ios: 'maps:0,0?', android: 'https://www.google.com/maps/dir/?api=1&' });
    const lat = currentProperty.property.lat;
    const lng = currentProperty.property.lng;
    let url = '';

    if (currentProperty.property.lat && currentProperty.propety.lng) {
      const result = await requestLocation();

      switch (result) {
        case RESULTS.GRANTED:
          Geolocation.getCurrentPosition(
            async pos => {
              const userLat = pos.coords.latitude;
              const userLng = pos.coords.longitude;

              if (Platform.OS === 'ios') {
                url += `${scheme}daddr=${lat},${lng}&saddr=${userLat},${userLng}`;
              } else {
                url += `${scheme}origin=${userLat},${userLng}&destination=${lat},${lng}`;
              }

              Linking.openURL(url);
            },
            error => {
              Alert.alert('GPS location unavailable', '360 was unable to get your current location for getting directions', [{ text: 'OK' }]);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 900000 },
          );
          break;
        case RESULTS.DENIED:
        case RESULTS.BLOCKED:
          Alert.alert(
            'No location access',
            '360 does not have permission to access your current location. Grant location access to get directions from your current location.',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Allow',
                onPress: () => {
                  Linking.openSettings();
                },
              },
            ],
          );
      }
    } else if (currentProperty.property.street) {
      const street = currentProperty.property.street;
      const suburb = currentProperty.property.suburb;
      const state = currentProperty.property.state;
      const country = currentProperty.property.country;
      const destination = `${street}, ${suburb} ${state} ${country}`;

      const result = await requestLocation();

      switch (result) {
        case RESULTS.GRANTED:
          Geolocation.getCurrentPosition(
            async pos => {
              const userLat = pos.coords.latitude;
              const userLng = pos.coords.longitude;

              url += `${scheme}daddr=${destination}&saddr=${userLat},${userLng}`;

              Linking.openURL(url);
            },
            error => {
              Alert.alert('GPS location unavailable', '360 was unable to get your current location for getting directions', [{ text: 'OK' }]);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 900000 },
          );
          break;
        case RESULTS.DENIED:
        case RESULTS.BLOCKED:
          Alert.alert(
            'No location access',
            '360 does not have permission to access your current location. Grant location access to get directions from your current location.',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Allow',
                onPress: () => {
                  Linking.openSettings();
                },
              },
            ],
          );
      }
    } else {
      Alert.alert('No street address', 'Unable to get directions because a street address has not been set for this property', [{ text: 'OK' }]);
    }
  };

  return (
    <View style={styles.info}>
      <View style={styles.count}>
        <View style={styles.statsContainer}>
          <Text style={styles.stat}>{currentProperty.property.total_views ? NumberShortner.abbrNumber(currentProperty.property.total_views) : 0}</Text>
          <Text style={styles.statText}>Views</Text>
        </View>

        <View style={styles.statsContainer}>
          <Text style={styles.stat}>{NumberShortner.abbrNumber(currentProperty.property.total_likes)}</Text>
          <Text style={styles.statText}>Likes</Text>
        </View>
      </View>

      <View style={styles.ctaContainer}>
        {/* {hasAccess && !isPreview && (
          <TouchableOpacity style={styles.btnPrimary} title="Add Floor Plan" onPress={() => addFloorPlan()}>
            <Text style={[styles.boxText, styles.textWhite]}>Add Floor Plan</Text>
          </TouchableOpacity>
        )} */}

        {/* {(!hasAccess || isPreview) && (
          <View>
            <TouchableOpacity style={styles.btnSecondary} title="View Floor Plan" onPress={() => viewFloorPlan()}>
              <Text style={styles.boxText}>Floor Plan</Text>
            </TouchableOpacity>
          </View>
        )} */}

        {/* <TouchableOpacity style={styles.btnSecondary} title="Street View" onPress={() => openStreetView()}>
          <Text style={styles.boxText}>Street View</Text>
        </TouchableOpacity> */}

        <TouchableOpacity style={styles.btnSecondary} title="Get Directions" onPress={() => getDirections()}>
          <Text style={styles.boxText}>Get Directions</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.propertyInfoContainer}>
        <Text style={styles.propertyInfo}>
          {currentProperty.property.street}, {currentProperty.property.suburb}
        </Text>

        <Text style={styles.propertyInfo}>
          {currentProperty.property.num_bedrooms} Bedrooms,&nbsp;
          {currentProperty.property.num_bathrooms} Bathrooms,&nbsp;
          {currentProperty.property.num_garages} Car Spaces
        </Text>

        <CampaignInfo campaign={currentProperty.property.campaign} propertyId={currentProperty.property.id} isLive={currentProperty.property.is_live} />
      </View>

      <View>
        <Modal visible={isModalOpen} animationType="slide" transparent={false} onRequestClose={() => setIsModalOpen(false)}>
          {currentProperty.property.floor_plan_url && (
            <SafeAreaView style={styles.equalFlex}>
              <ImageViewer
                imageUrls={[{ url: currentProperty.property.floor_plan_url }]}
                loadingRender={() => <ActivityIndicator size="small" color="#d81b60" />}
              />

              <View>
                <GradientButton onPress={() => setIsModalOpen(false)}>CLOSE</GradientButton>
              </View>
            </SafeAreaView>
          )}
        </Modal>
      </View>
    </View>
  );
}
