import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function NoPermissionAccess() {
  return (
    <View style={styles.container}>
      <Text style={[styles.text, styles.h1]}>Shoot a video</Text>
      <Text style={styles.text}>Allow access to Camera</Text>
      <Text style={styles.text}>Allow access to Microphone</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
  text: {
    color: '#fff',
    fontFamily: 'font-light',
    fontSize: 15,
    marginVertical: 8,
  },
});
