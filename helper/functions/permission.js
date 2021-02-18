import { Platform } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

export async function requestLocation() {
  const rationale = {
    title: 'Location access',
    message: 'Allow 360 to access your current location so we can show you properties nearby your area',
    buttonPositive: 'Continue',
  };

  if (Platform.OS === 'ios') {
    const result = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

    if (result === RESULTS.DENIED) {
      const response = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE, rationale);

      return response;
    }

    return result;
  } else {
    const result = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

    if (result === RESULTS.DENIED) {
      const response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION, rationale);

      return response;
    }

    return result;
  }
}

export async function requestCamera() {
  if (Platform.OS === 'ios') {
    const result = await check(PERMISSIONS.IOS.CAMERA);

    if (result === RESULTS.DENIED) {
      const response = await request(PERMISSIONS.IOS.CAMERA);

      return response;
    }

    return result;
  } else {
    const result = await check(PERMISSIONS.ANDROID.CAMERA);

    if (result === RESULTS.DENIED) {
      const response = await request(PERMISSIONS.ANDROID.CAMERA);

      return response;
    }

    return result;
  }
}
