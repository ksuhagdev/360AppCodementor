import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CameraWrapper({ children, data, customStyles }) {
  return (
    <View style={[styles.cameraContents, customStyles]}>
      <View style={styles.cameraHead}>
        <Text style={styles.text}>{data.name}</Text>
        <View style={styles.headDetails}>
          <View style={styles.headBox}>
            <Text style={styles.text}>{data.suburb}</Text>
          </View>
          <View style={[styles.headBox, { marginRight: 0 }]}>
            <Text style={styles.text}>{data.date}</Text>
          </View>
        </View>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  cameraContents: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    // paddingHorizontal: 15,
    paddingVertical: 10,
  },
  cameraHead: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 12,
    width: '100%',
  },
  headBox: {
    backgroundColor: '#b22c5a',
    borderRadius: 4,
    marginHorizontal: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  headDetails: {
    flexDirection: 'row',
  },
  text: {
    color: '#ffffff',
    fontFamily: 'font-regular',
    fontSize: 11,
  },
});
