import React from 'react';
import { Picker } from 'react-native';

export default function({ items = [], selectedValue, onValueChange }) {
  return (
    <Picker
      mode="dialog"
      selectedValue={selectedValue}
      onValueChange={(itemValue, itemIndex) => onValueChange(itemValue)}
      style={{
        height: 40,
        width: '100%',
        borderColor: 'transparent',
        borderBottomColor: 'rgba(0,0,0,0.1)',
        borderBottomWidth: 0.5,
      }}
      itemStyle={{
        fontFamily: 'font-light',
        fontSize: 15,
      }}>
      {items.map((item, index) => (
        <Picker.Item key={index} label={item.label} value={item.value} />
      ))}
    </Picker>
  );
}
