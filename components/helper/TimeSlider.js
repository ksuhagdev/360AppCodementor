import React, { useEffect } from 'react';
import { ImageBackground, View, Text, StyleSheet } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

const sliderThumb = require('../../assets/image/component/slider-thumb.png');

export default function TimeSlider({ text, sliderValues, handleSliderChange, suffix = 'AM', sliderProps }) {
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.label}>{text}</Text>
      </View>

      <MultiSlider
        values={sliderValues}
        max={23.5}
        min={0}
        step={0.5}
        sliderLength={288}
        snapped={true}
        minMarkerOverlapDistance={20}
        trackStyle={styles.trackStyle}
        selectedStyle={styles.selectedStyle}
        customMarker={({ currentValue, enabled, valuePrefix, valueSuffix }) => (
          <ThumbButton value={currentValue} enabled={enabled} prefix={valuePrefix} suffix={valueSuffix} />
        )}
        onValuesChange={vals => handleSliderChange(vals)}
        {...sliderProps}
      />
    </>
  );
}

function ThumbButton({ value }) {
  const [currentValue, setCurrentValue] = React.useState('');
  const [suffix, setSuffix] = React.useState(' AM');

  useEffect(() => {
    const timeValue = value;
    let hours = parseInt(value % 12, 10).toString();
    let mins = (value * 60) % 60;

    if (hours === '0') {
      hours = '12';
    }

    if (mins === 0) {
      mins = '00';
    }

    setCurrentValue(`${hours}:${mins}`);

    if (timeValue >= 12) {
      setSuffix(' PM');
    }
  }, [value, currentValue, suffix]);

  return (
    <ImageBackground source={sliderThumb} style={styles.thumb}>
      <Text style={styles.textValue}>
        {currentValue}
        {suffix}
      </Text>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  label: {
    fontSize: 15,
    fontFamily: 'font-regular',
    color: '#000',
    marginBottom: 22,
  },
  selectedStyle: {
    backgroundColor: '#2d2d2d',
  },
  text: {
    fontSize: 15,
    fontFamily: 'font-regular',
    color: '#000',
    marginBottom: 22,
  },
  textValue: {
    fontFamily: 'font-bold',
    fontSize: 13,
    paddingTop: 60,
    width: 65,
    color: '#000',
    position: 'absolute',
  },
  thumb: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 36,
    height: 36,
  },
  trackStyle: {
    height: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
});
