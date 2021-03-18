import { createStackNavigator, } from 'react-navigation-stack';
import AgentHome from '../agent/AgentHome';
import Search from '../user/Search';
import SuburbSelection from '../user/Search/SuburbSelection';
import SearchFilter from '../user/Search/Filter';
import AgentProfile from '../agent/AgentProfile';
import PropertyAddress from '../agent/Property/Overview';
import RoomVideo from '../user/Agent/RoomVideo';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs'
import Login from '../auth/Login'; 
import {createSwitchNavigator} from 'react-navigation'
import VideoScroll from './../../components/List/VideoScroll'
import UserProfile from '../agent/UserProfile';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PhoneVerification from '../auth/Onboarding/PhoneVerfication';
import VerificationCode from '../auth/Onboarding/VerificationCode';
import Onboarding from '../auth/Onboarding/OnboardingScreen';
// import Hero from '../agent/AgentHome/Hero'
import React from 'react';
import  VideoPlayScreen from '../user/Search/VideoPlayScreen'
import {Platform, Text} from 'react-native'
// import AgentHome from '../agent/NewAgentHome'
const UnauthedNavigator = createStackNavigator(
  {
    Home: AgentHome,
    AgentProfile,
    PropertyAddress,
    RoomVideo,
    Search,
    SuburbSelection,
    SearchFilter,
  },
  {
    initialRouteName: 'Home',
    headerMode: 'screen',
    defaultNavigationOptions: {
      headerTintColor: '#000',
      headerTitleStyle: {
        fontFamily: 'font-regular',
        fontSize: 16,
      },
    },
  },
);
const HomeNav = createStackNavigator({
  
  AgentHome,
  VideoPlayScreen:{screen: VideoPlayScreen, navigationOptions:{
    headerTransparent: true,
    title:"",
    headerStyle: {
      position: 'absolute',
      backgroundColor: 'transparent',
      zIndex: 100,
      top: 0,
      left: 0,
      right: 0,
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
    }
  }},
  AgentProfile,
  PropertyAddress,
  RoomVideo,
})
const searchNav = createStackNavigator({
  Search,
  PropertyAddressNew: {screen: PropertyAddress},
  VideoPlayScreen:{screen: VideoPlayScreen, navigationOptions:{
    tabBarVisible:false,
    headerTransparent: true,
    title:"",
    headerStyle: {
      position: 'absolute',
      backgroundColor: 'transparent',
      zIndex: 100,
      top: 0,
      left: 0,
      right: 0,
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
    }
  }},
    SuburbSelection,
    SearchFilter,
    VideoScroll: {screen: VideoScroll, navigationOptions:{
      headerShown:false
    }}
})
const unauth = createMaterialBottomTabNavigator({
  Home: {screen: HomeNav, navigationOptions:{
    tabBarIcon:(tabInfo) => {
      return <Icon name="home" size={26} color={tabInfo.tintColor} />
    }
  }},
  Search: {screen: searchNav, navigationOptions:{
    tabBarIcon:(tabInfo) => {
      return <Icon name="search" size={26} color={tabInfo.tintColor} />
    }
  }},
  Inbox: {screen: Login, navigationOptions:{
    tabBarIcon:(tabInfo) => {
      return <Icon name="chat-bubble-outline" size={26} color={tabInfo.tintColor} />
    },
    tabBarLabel:Platform.OS === "android" ? (
      <Text style={{ 
        // fontFamily: "roboto-bold" 
      }}>Offers</Text>
    ) : (
      "Offers"
    ),
  }},
  UserProfile: {screen: UserProfile, navigationOptions:{
    tabBarIcon:(tabInfo) => {
      return <Icon name="person-outline" size={26} color={tabInfo.tintColor} />
    }
  }}
},{
  activeColor: '#fff',
  barStyle:{
    backgroundColor:'#000'
  }
})



const main = createSwitchNavigator({
  
  Onboarding:{screen: Onboarding, navigationOptions:{
    headerShown: false
  }},
  PhoneVerification: {screen: PhoneVerification, navigationOptions:{
    headerShown: false
  }},
  VerificationCode: {screen: VerificationCode, navigationOptions:{
    headerShown: false
  }},
  UNAUTH: unauth
},)

unauth.navigationOptions = {
  headerShown: false,
};

export default unauth;
