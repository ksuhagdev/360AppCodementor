import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import GradientButton from '../Button';
import Button2 from '../Button/Button2'


export default function AlertMessage({ size, name, color, message, bgColor, textColor, textSize, showCtaButton, onButtonClicked,showLoginButton }) {
  const DEFAULT_SIZE = 48;
  const iconBgSize = size ? size * 1.75 : DEFAULT_SIZE * 1.75;

  const styles = StyleSheet.create({
   
    container: {
      flex: 1,
      width:'100%',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    ctaButton: {
      // marginTop: 20,
      // marginVertical: 3,
      width: '60%',
      height:70
    },
    iconContainer: {
      width: iconBgSize,
      height: iconBgSize,
      backgroundColor: bgColor,
      borderRadius: 999,
      textAlign: 'center',
    },
    text: {
      color: textColor || '#000',
      textAlign: 'center',
      lineHeight: 21,
      marginTop: 25,
      fontSize: textSize || 16,
      fontFamily: 'font-regular',
    },
    icon: {
      textAlign: 'center',
      lineHeight: iconBgSize,
    },
  });

  const ctaClick = () => {
    onButtonClicked && onButtonClicked();
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon size={size || DEFAULT_SIZE} name={name} color={color} style={styles.icon} />
      </View>

      <Text style={styles.text}>{message}</Text>

      {showCtaButton && (
        <View style={styles.ctaButton}>
          <GradientButton onPress={() => ctaClick()} style={styles.button}>
            DISCOVER
          </GradientButton>
        </View>
      )}
    </View>
  );
}
