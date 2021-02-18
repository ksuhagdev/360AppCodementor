import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const arrowRight = require('../../assets/image/arrow-right.png');
const addIcon = require('../../assets/image/add.png');
const moreVerticalIcon = require('../../assets/image/more-vert.png');
const dollarIcon = require('../../assets/image/dollar.png');

export default function ListItem({ hasBorderBottom = false, icon = 'right', text, secondaryText = null, customComponent = null, ...rest }) {
  return (
    <TouchableOpacity {...rest}>
      <View style={[styles.actionBtn, hasBorderBottom ? styles.actionBtnBorderBottom : null]}>
        <View>
          <Text style={styles.text}>{text}</Text>
          {secondaryText && <Text style={styles.secondaryText}>{secondaryText}</Text>}
        </View>
        {customComponent || getIconComponent(icon)}
      </View>
    </TouchableOpacity>
  );
}

function getIconComponent(icon) {
  let options = {
    source: null,
    style: {},
  };

  if (icon === 'right') {
    options = {
      source: arrowRight,
      style: { width: 12, height: 12 },
    };
  } else if (icon === 'add') {
    options = {
      source: addIcon,
      style: { width: 24, height: 24 },
    };
  } else if (icon === 'more') {
    options = {
      source: moreVerticalIcon,
      style: { width: 20, height: 4 },
    };
  } else if (icon === 'cash') {
    options = {
      source: dollarIcon,
      style: { width: 10, height: 18 },
    };
  }
  return <Image source={options.source} style={options.style} />;
}

const styles = StyleSheet.create({
  actionBtn: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 18,
  },
  actionBtnBorderBottom: {
    borderBottomWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.2)',
  },
  secondaryText: {
    color: 'rgba(0,0,0,0.4)',
  },
  text: {
    fontFamily: 'font-light',
    fontSize: 15,
  },
});
