import React from 'react';
import { ImageBackground, Image, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import ColorFade from '../../../../components/helper/ColorFade';

const addBtn = require('../../../../assets/image/add.png');
const editBtn = require('../../../../assets/image/edit.png');
const placeholder = require('../../../../assets/image/video-placeholder.png');

export default function VideoTile({ item, hasAccess, onAddPressed, onUpdatePressed, ...rest }) {
  const { width } = Dimensions.get('window');
  const imageDimension = width / 3 - 2;
  const image = item.thumbnail_url ? { uri: item.thumbnail_url } : placeholder;

  if(hasAccess && item.video_url === undefined) {
    return (
      <TouchableOpacity  onPress = {(hasAccess && item.video_url === undefined) ? () => onAddPressed(item.video_type) : null }>
  
      
      <ImageBackground style={[styles.imgItem, { width: imageDimension, height: imageDimension }]} source={image} {...rest}>
        <ColorFade height={118} colors={['transparent', 'rgba(0,0,0,0.3)']} />
  
        {hasAccess && item.video_url !== undefined && (
          <TouchableOpacity style={styles.imgBtn} onPress={() => onUpdatePressed(item.video_type)}>
            <Image style={styles.img} source={editBtn} />
          </TouchableOpacity>
        )}
  
        {hasAccess && item.video_url === undefined && (
          <TouchableOpacity style={styles.imgBtn} onPress={() => onAddPressed(item.video_type)}>
            <Image style={styles.img} source={addBtn} />
          </TouchableOpacity>
        )}
  
        <Text style={styles.title}>{item.video_type}</Text>
      </ImageBackground>
      </TouchableOpacity>
    );
  }
  return (
    
    
    <ImageBackground style={[styles.imgItem, { width: imageDimension, height: imageDimension }]} source={image} {...rest}>
      <ColorFade height={118} colors={['transparent', 'rgba(0,0,0,0.3)']} />

      {hasAccess && item.video_url !== undefined && (
        <TouchableOpacity style={styles.imgBtn} onPress={() => onUpdatePressed(item.video_type)}>
          <Image style={styles.img} source={editBtn} />
        </TouchableOpacity>
      )}

      {hasAccess && item.video_url === undefined && (
        <TouchableOpacity style={styles.imgBtn} onPress={() => onAddPressed(item.video_type)}>
          <Image style={styles.img} source={addBtn} />
        </TouchableOpacity>
      )}

      <Text style={styles.title}>{item.video_type}</Text>
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
  },
  title: {
    fontFamily: 'font-bold',
    fontSize: 12,
    textTransform: 'capitalize',
    padding: 6,
    zIndex: 2,
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 4,
  },
});
