import React from 'react';
import { TouchableOpacity, ImageBackground, Text, StyleSheet, Dimensions } from 'react-native';

const imagePlaceholder = require('../../../assets/image/property-placeholder.png');

const width = Dimensions.get('window').width;
const imageDimension = width / 3 - 2;

export default function ResultTile({ property, handlePress }) {
  return (
    <TouchableOpacity onPress={() => handlePress(property.id)}>
      <ImageBackground style={styles.imgItem} source={property.main_image_url ? { uri: property.main_image_url } : imagePlaceholder}>
        <Text style={styles.textOverlay}>{property.title}</Text>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  imgItem: {
    width: imageDimension,
    height: imageDimension,
    justifyContent: 'flex-end',
    margin: 1,
  },
  textOverlay: {
    fontFamily: 'font-bold',
    fontSize: 12,
    padding: 6,
    zIndex: 2,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
});
