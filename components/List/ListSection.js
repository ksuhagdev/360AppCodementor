import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ListSection({ children, style, title }) {
  return (
    <View style={style}>
      <Text style={styles.label}>{title}</Text>

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: 'rgba(0,0,0,0.4)',
    fontSize: 11,
    fontFamily: 'font-bold',
    textTransform: 'uppercase',
  },
});
