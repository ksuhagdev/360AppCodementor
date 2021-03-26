import React from 'react';
import { Provider } from 'react-redux';
import { View, Alert, Text } from 'react-native';
// import messaging, { firebase } from '@react-native-firebase/messaging';
import { createAppContainer } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import { requestNotifications, checkNotifications } from 'react-native-permissions';
import { createStackNavigator } from 'react-navigation-stack';
import useFont from './hooks/useFont';
import AppLoading from './components/helper/AppLoading';
import CameraSession from './screens/agent/CameraSession'
import AgentNavigator from './screens/agent';
import Music from './screens/agent/Music'
import UserNavigator from './screens/user';
import UnauthedNavigator from './screens/unauthed';
import SignupAsUser from './screens/auth/SignupUser';
import Login from './screens/auth/Login';
import SignupAsAgent from './screens/auth/SignupAgent';
import SignupAgentInfo from './screens/auth/SignupAgent/AgentInfo';
import SignupAgencyInfo from './screens/auth/SignupAgent/AgencyInfo';
import ForgotPassword from './screens/auth/ForgotPassword';
import SplashScreen from './screens/splash';
import store from './store';
import Axios from './utils/axios-plugin';
import requestInterceptors from './utils/request-interceptors';
import NavigationService from './utils/NavigationService';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';

import {AgentLogin,AgencyApprovalMessage, OnboardingScreen, Username,AgencyDetail, PhoneVerification, VerificationCode, AgentOnboarding, PersonalInfo, Password } from './screens/auth/Onboarding'

const showAlert = (title, message) => {
  Alert.alert(title, message, [{ text: 'OK', onPress: () => console.log('OK Pressed') }], { cancelable: false });
};

// const messageListener = async () => {
//   console.log('message listener setup');

//   firebase.messaging().onMessage(message => {
//     console.log(JSON.stringify(message));
//   });

//   firebase.messaging().setBackgroundMessageHandler(async remoteMessage => {
//     console.log('Remote messages: ', remoteMessage);
//   });

//   messaging().setBackgroundMessageHandler(async remoteMessage => {
//     console.log('Message handled in the background!', remoteMessage);
//   });
// };

// const getFcmToken = async () => {
//   // console.log(await AsyncStorage.getItem('fcmToken', fcmToken));
//   const fcmToken = await messaging().getToken();

//   if (fcmToken) {
//     // console.log(fcmToken);
//     AsyncStorage.setItem('fcmToken', fcmToken);
//   } else {
//     showAlert('Failed', 'No token received');
//   }
//   return fcmToken;
// };

// async function requestPermission() {
//   await messaging().requestPermission();

//   const res = await checkNotifications();

//   if (res.status === 'denied') {
//     const { status, settings } = await requestNotifications(['alert', 'badge', 'sound']);
//     if (status === 'granted') {
//       return { status, settings };
//     } else {
//       throw new Error({ status, settings });
//     }
//   } else if (res.status === 'granted') {
//     return res;
//   }
// }

// async function registerAppWithFCM() {
//   console.log('registerAppWithFCM');

//   const status = await messaging().registerForRemoteNotifications();

//   await getFcmToken();
//   console.log('registerForRemoteNotifications: ', status);

//   messageListener();

//   return messaging().setBackgroundMessageHandler(async remoteMessage => {
//     console.log('Message handled in the background: ', remoteMessage);
//   });
// }

const checkPermission = async () => {
  // const enabled = false;
  const enabled = await messaging().hasPermission();
  console.log('checkPermission: ', enabled);

  try {
    const status = await requestPermission();
    console.log('checkPermission: ', status);
    if (status) {
      return registerAppWithFCM();
    } else {
      return false;
    }
  } catch (error) {
    console.warn(error.message, error);
  }
};

// checkPermission();

requestInterceptors({
  store,
  $http: Axios,
});

const MainNavigator = createStackNavigator(
  {
    // Music:Music,
    AGENT: AgentNavigator,
    USER: UserNavigator,
    Login: {
      screen: OnboardingScreen, navigationOptions: {
        headerShown: false
      },
    },
    AgentLogin:{ screen: AgentLogin, navigationOptions: {
      headerShown: false
    },},
    // Login,
    PhoneVerification: {
      screen: PhoneVerification, navigationOptions: {
        // headerShown: false
        title:'Complete account setup'
      },
    },
    VerificationCode: {
      screen: VerificationCode, navigationOptions: {
        // headerShown: false
        title:'Complete account setup'
      },
    },AgencyDetail: {
      screen: AgencyDetail, navigationOptions: {
        title:'Complete account setup'
      },
    },
    AgencyApprovalMessage: {
      screen: AgencyApprovalMessage, navigationOptions: {
        // title:'Complete account setup',
        headerShown: false
      },
    },
    Username: {
      screen: Username, navigationOptions: {
        // headerShown: false
        title:'Complete account setup'
      },
    },
    AgentOnboarding: {
      screen: AgentOnboarding, navigationOptions: {
        headerShown: false
      },
    },
    PersonalInfo: {
      screen: PersonalInfo, navigationOptions: {
        // headerShown: false
        title:'Complete account setup'
      },
    },
    Password: {
      screen: Password, navigationOptions: {
        // headerShown: false
        title:'Complete account setup'
      },
    },
    UNAUTHED: {
      screen: UnauthedNavigator, navigationOptions: {
        headerShown: false
      },
    },
    SignupAsUser,
    SignupAsAgent,
    ForgotPassword,
    SignupAgentInfo,
    SignupAgencyInfo,
    SplashScreen,
    CameraSession
  },
  {
    initialRouteName: 'SplashScreen',
    // headerMode: "none",
  },
);

// const BottomNavigator = createMaterialBottomTabNavigator()
const AppContainer = createAppContainer(MainNavigator);

export default function App() {
  const fontLoaded = useFont();

  console.disableYellowBox = true;
  // return(
  //   <View style={{flex: 1, justifyContent:'center', alignItems: 'center'}}>
  //     <Text>Testing</Text>
  //   </View>
  // )
  return (
    <Provider store={store}>
      <View style={{ flex: 1 }}>
        {fontLoaded && (
          <AppContainer
            ref={navigatorRef => {
              NavigationService.setTopLevelNavigator(navigatorRef);
            }}
          />
        )}
        <AppLoading fontLoaded={fontLoaded} />
      </View>
    </Provider>
  );
}
