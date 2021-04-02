import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Switch from './Switch';
import Slider from './Slider';
import Icons from 'react-native-vector-icons/FontAwesome5';

import Tabs from '../Tabs/Tabs';
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
  openCurrency,
  typeCurrency
}) {
  const [activeTab, setActiveTab] = React.useState('FixedPrice');
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.text}>{text}</Text>

        {showSwitch && (
          <Switch
            value={switchState}
            handleChange={(value) => handleSwitchChange(value)}
          />
        )}
      </View>

      {/* {switchState && (
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
      )} */}

      {switchState && (
        <>
          <View style={styles.tabsContainer}>
            <Tabs
              style={{width: '45%'}}
              isActive={activeTab === 'FixedPrice'}
              onPress={() => setActiveTab('FixedPrice')}>
              Fixed Price
            </Tabs>

            <Tabs
              style={{width: '45%'}}
              isActive={activeTab === 'PriceRange'}
              onPress={() => setActiveTab('PriceRange')}>
              Price Range
            </Tabs>
          </View>
          {activeTab === 'FixedPrice' && (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  borderBottomWidth: 0.25,
                  padding: 10,
                  borderColor: 'gray',
                }}>
                <TextInput
                  style={styles.input}
                  placeholder=" $ 1000"
                  keyboardType="numeric"
                />
                <TouchableOpacity
                  onPress={
                    openCurrency
                  }>
                  <Text style={{marginTop: 20}}>
                    {' '}
                    {typeCurrency} <Icons name="caret-down" size={20} color="#517fa4" />
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
          {activeTab === 'PriceRange' && (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  borderBottomWidth: 0.25,
                  padding: 10,
                  borderColor: 'gray',
                }}>
                <Text style={{color: 'grey', marginTop: 20}}> Min </Text>
                <TextInput
                  style={styles.input}
                  placeholder=" $ 1000"
                  keyboardType="numeric"
                />
                <TouchableOpacity  onPress={
                    openCurrency
                  }>
                  <Text style={{marginTop: 20}}>
                    {' '}
                    {typeCurrency} <Icons name="caret-down" size={20} color="#517fa4" />
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  // justifyContent: 'space-between',
                  borderBottomWidth: 0.25,
                  width:'100%',
                  padding: 20,
                  borderColor: 'gray',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                <Text style={{color: 'grey',}}> Max </Text>
                <TextInput
                  style={{width:'100%'}}
                  placeholder=" $ 1000"
                  keyboardType="numeric"
                />
              </View>
            </>
          )}
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    // flex: 1,
  },
  text: {
    fontSize: 15,
    fontFamily: 'font-regular',
    color: '#000',
    marginBottom: 22,
  },
  tabsContainer: {
    marginTop: 5,
    flexDirection: 'row',
    // justifyContent: 'center',
  },
  input: {
    width: '80%',
    marginTop: 20,
    // borderBottomWidth:0.7
  },
});
