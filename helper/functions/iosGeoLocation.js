/**
 * This function wraps Geolocation's getCurrentPosition into a promise
 */
import Geolocation from '@react-native-community/geolocation';

const getCurrentPosition = async () => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      pos => {
        resolve(pos);
      },
      err => {
        reject(err);
      },
    );
  });
};

export default { getCurrentPosition };
