import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { isTokenValid, getPayload } from '../../../utils/TokenService';

const createIcon = require('../../../assets/image/property-logo.png');

export default function NavActions({ navigation, bgColor, color }) {
  const [isAgent, setIsAgent] = React.useState(false);
  const { accessToken, data } = useSelector(state => state.account);

  useEffect(() => {
    if (accessToken) {
      (async () => {
        const user = getPayload(accessToken);

        setIsAgent(user.role === 'AGENT');
      })();
    }
  }, [accessToken]);

  const handleOnPress = (to, isProtected) => {
    if (isProtected) {
      if (!isTokenValid(accessToken)) {
        return navigation.navigate('Login');
      }
    }

    navigation.navigate(to);
  };

  
  return (
    <View style={[styles.container, bgColor ? { backgroundColor: bgColor } : styles.transparentBg]}>
      <View style={styles.cameraTabs}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <View style={styles.iconContainer}>
            <Icon name="home" size={26} color={color || '#fff'} />
            <Text style={[styles.text, color ? { color } : styles.lightText]}>Home</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
          <View style={styles.iconContainer}>
            <Icon name="search" size={26} color={color || '#fff'} />
            <Text style={[styles.text, color ? { color } : styles.lightText]}>Discover</Text>
          </View>
        </TouchableOpacity>

        {isAgent && (
          <TouchableOpacity onPress={() => navigation.navigate('NewProperty_Screen1')}>
            <View style={styles.iconContainer}>
              <Image source={createIcon} style={styles.createIcon} />
              <Text style={[styles.text, color ? { color } : styles.lightText]}>Property</Text>
            </View>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => handleOnPress('Inbox', true)}>
          <View style={styles.iconContainer}>
            <Icon name="chat-bubble-outline" size={26} color={color || '#fff'} />
            <Text style={[styles.text, color ? { color } : styles.lightText]}>Inbox</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleOnPress('UserProfile')}>
          <View style={styles.iconContainer}>
            <Icon name="person-outline" size={26} color={color || '#fff'} />
            <Text style={[styles.text, color ? { color } : styles.lightText]}>Profile</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cameraTabs: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 20,
    width: '100%',
  },
  container: {
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    borderTopWidth: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 15,
    paddingTop: 15,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  createIcon: {
    width: 33,
    height: 33,
  },
  iconContainer: {
    alignItems: 'center',
  },
  lightText: {
    color: '#fff',
  },
  text: {
    fontFamily: 'font-regular',
    fontSize: 10,
  },
  transparentBg: {
    backgroundColor: 'transparent',
  },
  whiteBg: {
    backgroundColor: '#fff',
  },
});
