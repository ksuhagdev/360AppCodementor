import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';

export default function AutoCompleteBox({
  search,
  query,
  label = 'Look up suburb',
  placeholder,
  containerStyle,
  inputStyle,
  listStyle,
  style,
  setQuery,
  handleSelect,
}) {
  const [hideResult, hideResults] = useState(false);
  const [value, setValue] = useState(null);

  const onSelect = item => {
    handleSelect(item);
    setValue(`${item.name}, ${item.admin_name1}`);
    hideResults(true);
  };

  const handleChange = text => {
    setQuery(text);
    setValue(text);
    hideResults(false);
  };

  return (
    <View>
      {label !== '' && <Text style={styles.autoComplete}>{label}</Text>}

      <Autocomplete
        autoCorrect={false}
        data={search.result}
        value={value}
        defaultValue={query}
        hideResults={hideResult}
        onBlur={() => hideResults(true)}
        placeholder={placeholder || 'Suburb, state'}
        keyExtractor={item => `${item.name}-${item.postcode}`}
        onChangeText={text => handleChange(text)}
        renderItem={({ item }) => <Item item={item} onSelect={onSelect} />}
        inputContainerStyle={inputStyle || styles.autoCompleteInput}
        listContainerStyle={listStyle || styles.autoCompleteList}
        style={style || styles.textInput}
      />
    </View>
  );
}

function Item({ item, onSelect }) {
  return (
    <TouchableOpacity style={styles.itemAlign} onPress={() => onSelect(item)}>
      <View style={styles.autoCompleteItem}>
        <Text style={styles.autoCompleteText}>
          {item.name}
          {'  '}
          <Text style={styles.autoCompleteTextInner}>
            {item.admin_name1}, {item.country_code}
          </Text>
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  autoComplete: {
    fontSize: 13,
    fontFamily: 'font-regular',
    color: 'rgba(0,0,0,0.5)',
  },
  autoCompleteInput: {
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderWidth: 0.5,
    paddingTop: 9,
    paddingHorizontal: 0,
    borderColor: 'transparent',
  },
  autoCompleteItem: {
    backgroundColor: '#fff',
    borderBottomColor: 'rgba(0,0,0,0.1)',
    borderBottomWidth: 1,
    width: '100%',
    flex: 1,
  },
  autoCompleteList: {
    borderColor: 'rgba(0,0,0,0.3)',
    position: 'absolute',
    zIndex: 20,
    width: '100%',
    top: 30,
  },
  autoCompleteText: {
    fontFamily: 'font-regular',
    paddingHorizontal: 22,
    paddingVertical: 16,
  },
  autoCompleteTextInner: {
    color: 'rgba(0,0,0,0.7)',
    fontSize: 10,
    fontFamily: 'font-light',
  },
  itemAlign: {
    alignItems: 'stretch',
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
  },
});
