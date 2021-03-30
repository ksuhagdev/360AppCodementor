import React from 'react';
import { Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function GradientButton2({ children, ...rest }) {
  return (
    <TouchableOpacity activeOpacity={0.7} {...rest}>
      <LinearGradient colors={['#FF5039', '#E8048C']} start={[0.97, 0.13]} style={styles.gradient}>
        {!rest.isActive && <Text style={styles.text}>{children}</Text>}

        {rest.isActive && <ActivityIndicator size="small" color="#fff" />}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  gradient: {
    padding: 5,
    alignItems: 'center',
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12.84,
    elevation: 3,
  },
  text: {
    backgroundColor: 'transparent',
    fontSize: 14,
    color: '#fff',
    fontFamily: 'font-bold',
    // textTransform: 'uppercase',
  },
});
