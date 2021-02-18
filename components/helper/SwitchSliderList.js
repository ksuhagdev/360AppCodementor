import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Switch from './Switch';
import Slider from './Slider';

export default function SwitchSliderList({
  text,
  switchState = null,
  showSwitch = true,
  sliderValues,
  min = 1,
  max = 10,
  step = 1,
  handleSwitchChange,
  handleSliderChange,
  valuePrefix = '$',
  valueSuffix = 'M',
  sliderProps,
}) {
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.text}>{text}</Text>

        {showSwitch && <Switch value={switchState} handleChange={value => handleSwitchChange(value)} />}
      </View>

      {switchState && (
        <Slider
          enabledOne={switchState}
          enabledTwo={switchState}
          valuePrefix={valuePrefix}
          valueSuffix={valueSuffix}
          values={sliderValues}
          min={min}
          max={max}
          step={step}
          handleValuesChange={values => handleSliderChange(values)}
          {...sliderProps}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  text: {
    fontSize: 15,
    fontFamily: 'font-regular',
    color: '#000',
    marginBottom: 22,
  },
});
