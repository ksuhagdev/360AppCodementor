import React, { useEffect } from 'react';
import { View, Text, Image, StatusBar, StyleSheet } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import { useDispatch } from 'react-redux';
import { loadSessionFromStorage, getCurrentProfile, renewToken } from '../../actions/account-actions';
import {getTrendingProperties} from '../../actions/property'
import { isTokenValid, isRenewalRequired } from '../../utils/TokenService';

const splashImg = require('../../assets/image/splash.png');

export default function SplashScreen({ navigation }) {
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const { payload } = await dispatch(loadSessionFromStorage());
      const { accessToken, user } = payload;
      // console.log("Access Token", accessToken)
      if (accessToken && user && user.id) {
        if (isTokenValid(accessToken)) {
          const loadHome = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: user.role })],
          });

          if (isRenewalRequired(accessToken)) {
            dispatch(renewToken());
            dispatch(getTrendingProperties())
            dispatch(getCurrentProfile());
          } else {
            dispatch(getTrendingProperties())
            dispatch(getCurrentProfile());
          }

          setTimeout(() => {
            navigation.dispatch(loadHome);
          }, 3500);
        } else {
          // token expired, redirect to login page
          const login = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Login' })],
          });

          setTimeout(() => {
            navigation.dispatch(login);
          }, 3500);
        }
      } else {
        dispatch(getTrendingProperties())

        const loadUnauthed = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: 'Login' })],
        });

        setTimeout(() => {
          navigation.dispatch(loadUnauthed);
        }, 3500);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#000" animated barStyle="light-content" />

      <View style={styles.content}>
        <Image source={splashImg} style={styles.splashImg} />
      </View>

      <Text style={styles.text}>Copyright, {new Date().getFullYear()} 360app</Text>
    </View>
  );
}

SplashScreen.navigationOptions = {
  headerShown: false,
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#000',
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  splashImg: {
    width: 180,
    height: 147,
  },
  text: {
    fontFamily: 'font-light',
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 34,
  },
});
