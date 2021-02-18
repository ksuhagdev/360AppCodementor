import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const arrowIcon = require('../../assets/image/arrow-right.png');
const defaultUserImage = require('../../assets/image/default-profile-pic.png');

export default function AvatarListItem({ hasBorderBottom = false, avatar, text, secondaryText, ...rest }) {
  const profileImage = avatar ? { uri: avatar } : defaultUserImage;
// console.log("Profile Image", avatar)
  return (
    <TouchableOpacity {...rest}>
      <View style={[styles.songContainer, hasBorderBottom ? styles.actionBtnBorderBottom : null]}>
        <Image source={profileImage} style={styles.avatar} />

        <View style={styles.listText}>
          <Text style={styles.textMain}>{text}</Text>
          {secondaryText && <Text style={styles.textSub}>{secondaryText}</Text>}
        </View>

        <View>
          <Image source={arrowIcon} style={styles.arrow} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  actionBtnBorderBottom: {
    borderBottomWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.2)',
  },
  arrow: {
    width: 12,
    height: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  listText: {
    marginLeft: 20,
    flex: 1,
  },
  songContainer: {
    alignItems: 'center',
    borderBottomColor: 'rgba(0,0,0,0.1)',
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    paddingVertical: 20,
  },
  textMain: {
    fontFamily: 'font-regular',
    fontSize: 15,
    lineHeight: 18,
  },
  textSub: {
    color: 'rgba(0,0,0,0.5)',
    fontFamily: 'font-light',
    fontSize: 13,
    lineHeight: 22,
  },
});
