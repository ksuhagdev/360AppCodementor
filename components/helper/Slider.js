import React, { useEffect } from 'react';
import { Text, ImageBackground, StyleSheet } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

const sliderThumb = require('../../assets/image/component/slider-thumb.png');

export default function({ values = [], maxValue = 10, step = 1, min = 1, type = 'multi', handleValuesChange, ...rest }) {
  const [minVal, setMinVal] = React.useState('');
  const [minSuffix, setMinSuffix] = React.useState('');
  const [maxVal, setMaxVal] = React.useState('');
  const [maxSuffix, setMaxSuffix] = React.useState('');

  const onValuesChanged = vals => {
    if (type === 'multi') {
      setDisplayValues(vals[0], 'min');
      setDisplayValues(vals[1], 'max');
    }

    handleValuesChange(vals);
  };

  const setDisplayValues = (value, valueType) => {
    const decimalPlaces = 1;
    const suffixes = ['', 'K', 'M', 'B', 'T'];

    if (value < 999) {
      if (valueType === 'min') {
        setMinVal(value);
      } else {
        setMaxVal(value);
      }
    } else {
      const power = value.toPrecision(2).split('e'); // get the power
      const place = power.length === 1 ? 0 : Math.floor(Math.min(power[1].slice(1), 14) / 3);
      const decimal = place < 1 ? value.toFixed(decimalPlaces) : (value / 10 ** (place * 3)).toFixed(1 + decimalPlaces);
      const decimalDigits = decimal < 0 ? decimal : Math.abs(decimal);

      if (valueType === 'min') {
        setMinVal(decimalDigits);
        setMinSuffix(suffixes[place]);
      } else {
        setMaxVal(decimalDigits);
        setMaxSuffix(suffixes[place]);
      }
    }
  };

  useEffect(() => {
    if (type === 'multi' && values && values.length) {
      onValuesChanged(values);
    }
  }, [values]);

  return (
    <>
      <MultiSlider
        values={values}
        max={maxValue}
        min={min}
        step={step}
        sliderLength={288}
        trackStyle={styles.trackStyle}
        selectedStyle={styles.selectedStyle}
        customMarker={({ currentValue }) => <ThumbButton currentValue={currentValue} type={type} />}
        onValuesChange={vals => onValuesChanged(vals)}
        {...rest}
      />

      {type === 'multi' && (
        <>
          <Text style={[styles.textValue, styles.minValue]}>
            {minVal} {minSuffix}
          </Text>

          <Text style={[styles.textValue, styles.maxValue]}>
            {maxVal} {maxSuffix}
          </Text>
        </>
      )}
    </>
  );
}

function ThumbButton({ currentValue, type }) {
  return (
    <ImageBackground source={sliderThumb} style={styles.thumb}>
      {type === 'single' && <Text style={styles.singleTextValue}>{currentValue}</Text>}
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  maxValue: {
    right: -10,
  },
  minValue: {
    left: -10,
  },
  selectedStyle: {
    backgroundColor: '#2d2d2d',
  },
  singleTextValue: {
    fontFamily: 'font-bold',
    fontSize: 12,
    paddingTop: 60,
    color: '#000',
    position: 'absolute',
  },
  thumb: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 36,
    height: 36,
  },
  textValue: {
    fontFamily: 'font-bold',
    fontSize: 13,
    top: 80,
    color: '#000',
    position: 'absolute',
    zIndex: 3,
    width: 60,
    textAlign: 'center',
  },
  trackStyle: {
    height: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
});
