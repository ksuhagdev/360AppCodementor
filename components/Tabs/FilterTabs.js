import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function FilterTabs({ tabs, activeTab, onTabChanged }) {
  const [active, setActive] = useState(0);

  const handlePress = index => {
    setActive(index);

    onTabChanged(tabs[index]);
  };

  useEffect(() => {
    if (activeTab) {
      const index = tabs.indexOf(activeTab);

      if (index > -1) {
        setActive(index);
      }
    }
  }, []);

  return (
    <View style={styles.tabContainer}>
      {tabs.map((item, index) => (
        <Tab key={index} index={index} activeIndex={active} onPress={() => handlePress(index)}>
          {item}
        </Tab>
      ))}
    </View>
  );
}

function Tab({ activeIndex, index, children, ...rest }) {
  return (
    <TouchableOpacity style={styles.equalFlex} activeOpacity={0.6} {...rest}>
      <View style={[styles.tab, activeIndex === index ? styles.tabActive : null]}>
        <Text style={[styles.text, activeIndex === index ? styles.tabActiveText : null]}>{children}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  equalFlex: {
    flex: 1,
  },
  tab: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabActive: {
    backgroundColor: '#272627',
    borderRadius: 4,
    elevation: 5,
  },
  tabActiveText: {
    color: '#fff',
  },
  tabContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 5,
    flexDirection: 'row',
    padding: 4,
  },
  text: {
    color: '#111',
    fontFamily: 'font-regular',
    fontSize: 12,
  },
});
