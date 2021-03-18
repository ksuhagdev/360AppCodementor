import React, { useEffect } from 'react';
import { TextInput, StyleSheet, Text, View, Image } from 'react-native';

const dollarIcon = require('../../assets/image/dollar.png');

const styles = StyleSheet.create({
  dollarIcon: {
    width: 10,
    height: 18,
    position: 'absolute',
    top: 15,
    right: 5,
  },
  equalFlex: {
    flex: 1,
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'flex-end',
  },
  marginBottom15: {
    marginBottom: 15,
  },
  flexDirectionRow: {
    flexDirection: 'row',
  },
  justifyContentSpace: {
    justifyContent: 'space-between',
  },
  italicText: {
    fontStyle: 'italic',
  },
  label: {
    color: '#000',
    fontFamily: 'font-light',
  },
  maxLengthHint: {
    fontFamily: 'font-bold',
    fontSize: 11,
    color: 'rgba(0,0,0,0.4)',
  },
  positionRelative: {
    position: 'relative',
  },
  prefix: {
    paddingVertical: 10,
    fontSize: 15,
    fontFamily: 'font-regular',
    color: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'space-around',
    marginRight: 8,
  },
  text: {
    color: 'rgba(0,0,0,0.5)',
    fontFamily: 'font-regular',
    fontSize: 13,
    zIndex: 1,
  },
  textError: {
    color: 'rgba(255,0,0,0.9)',
    fontFamily: 'font-regular',
    fontSize: 13,
    zIndex: 1,
  },
  textField: {
    height: 130,
  },
  textInput: {
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderColor: 'transparent',
    borderWidth: 0.5,
    color: 'rgba(0,0,0,0.99)',
    fontFamily: 'font-light',
    fontSize: 15,
    paddingHorizontal: 0,
    paddingVertical: 10,
    zIndex: 1,
  },
  textInputError: {
    borderBottomColor: 'rgba(255, 0, 0, 1)',
    borderColor: 'transparent',
    borderWidth: 0.5,
    color: 'rgba(0,0,0,0.99)',
    fontFamily: 'font-light',
    fontSize: 15,
    paddingHorizontal: 0,
    paddingVertical: 10,
    zIndex: 1,
  },
});

export function TextField({ value, handleChange, ...rest }) {
  return <TextInput style={styles.textInput} onChangeText={handleChange} value={value} {...rest} />;
}

export function TitleTextField({ title, value, prefix, name, handleChange, errors, optional = false, ...rest }) {
  return (
    <View>
      <Text style={errors && name && errors[name] ? styles.textError : styles.text}>
        {title} {optional && <Text style={styles.italicText}>(optional)</Text>}
        <Text>
          {errors && name && errors[name] && errors[name].type === 'required' && <Text>(Required)</Text>}
          {errors && name && errors[name] && errors[name].type === 'pattern' && <Text>({errors[name].message})</Text>}
        </Text>
      </Text>

      <View style={styles.flexRow}>
        {prefix && <Text style={[styles.wot, styles.prefix]}>{prefix}</Text>}

        <TextInput
          style={[styles.equalFlex, errors && name && errors[name] ? styles.textInputError : styles.textInput]}
          onChangeText={handleChange}
          value={value}
          {...rest}
        />
      </View>
    </View>
  );
}

export function TitleTextField2({ title, value, prefix, name, handleChange, errors, optional = false, ...rest }) {
  return (
    <View style={{ flexDirection: 'row', margin: 10 }}>
      <View style={{ width: '30%' }}>
        <Text style={{ fontSize: 16 }}>
          {title}
        </Text>
      </View>


      {/* <View style={styles.flexRow}> */}
      {/* {prefix && <Text style={[styles.wot, styles.prefix]}>{prefix}</Text>} */}
<View style={{width:'60%', borderBottomWidth: 0.25, }}>
<TextInput
        style={{marginBottom:15}}
        onChangeText={handleChange}
        value={value}
        {...rest}
      />
</View>
      
      {/* </View> */}
    </View>
  );
}


export function CashTextField({ title, value, name, errors, handleChange, optional = false, customStyles = {}, ...rest }) {
  return (
    <View style={{ ...customStyles }}>
      <Text style={errors && name && errors[name] ? styles.textError : styles.text}>
        {title} {optional && <Text style={styles.italicText}>(optional)</Text>}
        <Text>{errors && name && errors[name] && errors[name].type === 'required' && <Text>(Required)</Text>}</Text>
      </Text>

      <View style={[styles.flexDirectionRow, styles.justifyContentSpace, styles.positionRelative, styles.marginBottom15]}>
        <TextInput
          style={errors && name && errors[name] ? [styles.textInputError, styles.equalFlex] : [styles.textInput, styles.equalFlex]}
          keyboardType="numeric"
          onChangeText={handleChange}
          value={value}
          {...rest}
        />
        <Image source={dollarIcon} style={styles.dollarIcon} />
      </View>
    </View>
  );
}

export function TextArea({ title, labelType = 'label', optional = true, maxLength, value, handleChange, placeholder = '', containerStyles = {}, ...rest }) {
  const [remainingLength, setRemainingLength] = React.useState(maxLength);

  useEffect(() => {
    if (maxLength > 0) {
      if (remainingLength >= 0) {
        if (value) {
          setRemainingLength(maxLength - value.length);
        } else {
          setRemainingLength(maxLength);
        }
      }
    }
  }, [maxLength, remainingLength, value]);

  return (
    <>
      <View style={[styles.flexDirectionRow, styles.justifyContentSpace, containerStyles]}>
        <Text style={[styles.text, labelType === 'label' ? styles.label : null]}>
          {title} {optional && <Text style={styles.italicText}>(optional)</Text>}
        </Text>

        <Text style={styles.maxLengthHint}>{remainingLength}</Text>
      </View>

      <TextField
        value={value}
        onChangeText={text => handleChange(text)}
        multiline={true}
        numberOfLines={15}
        maxLength={maxLength || 255}
        underlineColorAndroid="transparent"
        placeholder={placeholder}
        placeholderTextColor="rgba(0,0,0,0.4)"
        style={[styles.textInput, styles.textField]}
        {...rest}
      />
    </>
  );
}

export function TextArea2({ title, labelType = 'label', optional = true, maxLength, value, handleChange, placeholder = '', containerStyles = {}, ...rest }) {
  const [remainingLength, setRemainingLength] = React.useState(maxLength);

  useEffect(() => {
    if (maxLength > 0) {
      if (remainingLength >= 0) {
        if (value) {
          setRemainingLength(maxLength - value.length);
        } else {
          setRemainingLength(maxLength);
        }
      }
    }
  }, [maxLength, remainingLength, value]);

  return (
    <View style={{ flexDirection: 'row', margin: 10 }}>
      <View style={{ width: '30%' }}>
        <Text style={{ fontSize: 17 }}>
          {title}
        </Text>

        {/* <Text style={styles.maxLengthHint}>{remainingLength}</Text> */}
      </View>

      <TextField
        value={value}
        onChangeText={text => handleChange(text)}
        multiline={true}
        numberOfLines={15}
        maxLength={maxLength || 255}
        underlineColorAndroid="transparent"
        placeholder={placeholder}
        placeholderTextColor="rgba(0,0,0,0.4)"
        style={[styles.textInput, styles.textField, { width: '65%' }]}
        {...rest}
      />
    </View>
  );
}