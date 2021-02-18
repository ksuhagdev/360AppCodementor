import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export function AddBtn({ custom, size }) {
  return (
    <View style={[styles.add, custom]}>
      <Icon name="add" size={size} color="#fff" />
    </View>
  );
}

const styles = StyleSheet.create({
  add: {
    alignItems: 'center',
    backgroundColor: '#d81b60',
    borderRadius: 50,
    bottom: 15,
    height: 20,
    justifyContent: 'center',
    left: 10,
    position: 'absolute',
    shadowColor: '#111',

    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 15.19,
    width: 20,
  },
});
