import React from 'react';
import { View, Text, StatusBar, StyleSheet, TouchableOpacity } from 'react-native';

export function NoCameraPermission({ requestCamera }) {
  return (
    <View style={styles.container}>
      <StatusBar translucent={true} backgroundColor="rgba(0, 0, 0 ,0.1)" barStyle="light-content" />

      <Text style={[styles.text, styles.h1]}>Shoot videos</Text>
      <Text style={styles.text}>Allow access to Camera</Text>
      <Text style={styles.text}>Allow access to Microphone</Text>

      <TouchableOpacity onPress={requestCamera}>
        <View style={styles.btn}>
          <Text style={styles.text}>Allow</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export function NoLocationPermission({ requestLocation }) {
  return (
    <View style={styles.container}>
      <StatusBar translucent={true} backgroundColor="rgba(0, 0, 0 ,0.1)" barStyle="light-content" />

      <Text style={[styles.text, styles.h1]}>Location Access</Text>
      <Text style={styles.text}>Allow access to your current location</Text>
      <Text style={[styles.text, styles.smallText]}>To list all properties near you</Text>

      <TouchableOpacity onPress={requestLocation}>
        <View style={styles.btn}>
          <Text style={styles.text}>Allow</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderColor: 'rgba(255, 255, 255 ,0.7)',
    borderRadius: 4,
    borderWidth: 1,
    marginTop: 15,
    paddingHorizontal: 19,
  },
  container: {
    alignItems: 'center',
    backgroundColor: '#222222',
    flex: 1,
    justifyContent: 'center',
  },
  h1: {
    fontFamily: 'font-regular',
    fontSize: 25,
  },
  smallText: {
    fontSize: 11,
  },
  text: {
    color: '#fff',
    fontFamily: 'font-light',
    fontSize: 15,
    marginVertical: 8,
  },
});
