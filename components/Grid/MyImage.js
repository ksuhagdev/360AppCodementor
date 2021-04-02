import React, {useState} from 'react';
import {
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

const MyImage = ({style, sourceObj, onPress}) => {
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);
  return (
    <TouchableOpacity onPress={onPress}>
      {imageError || !sourceObj.main_image_url ? (
        <Image
          source={require('../../assets/image/camera/effects.png')}
          style={style}
          onLoadEnd={() => setLoading(false)}
        />
      ) : (
        <Image
          style={style}
          source={{uri: sourceObj.main_image_url}}
          onError={(e) => {
            setLoading(false);
            setImageError(true);
          }}
          onLoadEnd={() => setLoading(false)}
        />
      )}
      {loading && (
        <ActivityIndicator
          style={styles.activityIndicator}
          animating={loading}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  activityIndicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});

export default MyImage;