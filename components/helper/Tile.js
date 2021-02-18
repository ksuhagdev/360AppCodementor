import React from 'react';
import { ImageBackground, Image, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import ColorFade from './ColorFade';

export default function ImageTile({ item, onButtonPressed, ...rest }) {
  const { width } = Dimensions.get('window');
  const imageDimension = width / 3 - 2;

  return (
    <ImageBackground style={[styles.imgItem, { width: imageDimension, height: imageDimension }]} source={item.img} {...rest}>
      <ColorFade height={118} colors={['transparent', 'rgba(0,0,0,0.3)']} />
      {item.imgBtn && (
        <TouchableOpacity style={styles.imgBtn} onPress={onButtonPressed}>
          <Image style={styles.img} source={item.imgBtn} />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{item.title}</Text>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  img: {
    height: 24,
    width: 24,
  },
  imgBtn: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 2,
  },
  imgItem: {
    justifyContent: 'flex-end',
    margin: 1,
    padding: 6,
  },
  title: {
    fontFamily: 'font-bold',
    fontSize: 12,
    zIndex: 2,
    color: '#fff',
  },
});
