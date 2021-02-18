import React from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';

export default function BorderButton({ children, ...props }) {
  return (
    <TouchableOpacity activeOpacity={0.7} {...props}>
      <View style={styles.button}>
        {!props.isActive && <Text style={styles.text}>{children}</Text>}

        {props.isActive && <ActivityIndicator size="small" color="#e7068c" />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 4,
    borderColor: '#e7068c',
    borderWidth: 2,
    backgroundColor: '#fff',
    paddingVertical: 15,
    alignItems: 'center',
  },
  text: {
    textTransform: 'uppercase',
    color: '#e7068c',
    fontFamily: 'font-bold',
    fontSize: 14,
  },
});
