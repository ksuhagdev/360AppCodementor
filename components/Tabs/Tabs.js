import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../theme/constants';

export default function Tabs({ isActive, children, ...rest }) {
  return (
    <TouchableOpacity {...rest}>
      <View style={[styles.container,{backgroundColor: isActive ? 'black' : '#F1F0EF', justifyContent: 'center'}]}>
        <Text style={[styles.text, {color: isActive ? 'white' : 'black'}]}>{children}</Text>

        {/* {isActive && <View style={styles.border} />} */}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  border: {
    width: '100%',
    marginTop: 2,
    height: 2,
    backgroundColor: colors.primary,
  },
  container: {
    // paddingBottom: 5,
    // paddingRight: 5,
    marginRight: 5,
    padding: 13
  },
  tabActive: {
    borderBottomColor: colors.primary,
    borderBottomWidth: 2,
  },
  text: {
    color: '#555',
    fontFamily: 'font-regular',
    fontSize: 12,
    marginRight: 28,
    // paddingBottom: 16,
    textAlign: 'center',
    width: '100%',
  },
});
