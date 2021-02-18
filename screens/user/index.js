import { createStackNavigator } from 'react-navigation-stack';
import AgentHome from '../agent/AgentHome';
import UserProfile from '../agent/UserProfile';
import EditProfileInfo from './Profile/EditInfo';
import Search from './Search';
import SuburbSelection from './Search/SuburbSelection';
import SearchFilter from './Search/Filter';
import Inbox from './Inbox';
import Chat from './Inbox/Chat';
import AgentProfile from '../agent/AgentProfile';
import PropertyAddress from '../agent/Property/Overview';
import RoomVideo from './Agent/RoomVideo';
import FollowContainer from '../follow/FollowContainer';
import LikedProperties from '../like/LikedProperties';
import VideoScroll from '../../components/List/VideoScroll'
import Icon from 'react-native-vector-icons/MaterialIcons';
import React from 'react'
import {Platform, Text} from 'react-native'
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs'
import VideoPlayScreen from './Search/VideoPlayScreen'
const UserNavigator = createStackNavigator(
  {
    Home: AgentHome,
    Inbox,
    Chat,
    UserProfile,
    AgentProfile,
    PropertyAddress,
    RoomVideo,
    EditProfileInfo,
    LikedProperties,
    Search,
    SuburbSelection,
    SearchFilter,
    FollowContainer,
    VideoScroll: {screen: VideoScroll, navigationOptions:{
      headerShown: false
    }}
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

const AgentHomeNav = createStackNavigator({
  Home: AgentHome,
    Inbox,
    // Hero:Hero,
    Chat,
    UserProfile,
    AgentProfile,
    PropertyAddress,
    RoomVideo,
    EditProfileInfo,
    LikedProperties,
    Search:{
      screen: Search, navigationOptions:{
        headerShown: false
      }
    },
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
    SuburbSelection,
    SearchFilter,
    FollowContainer,
    VideoScroll: {screen: VideoScroll, navigationOptions:{
      headerShown: false
    }}
})



const searchNav = createStackNavigator({
  Search : {screen: Search, navigationOptions:{
    headerShown: false
    }},
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
    // Hero: {
    //   screen: Hero, navigationOptions:{
    //     headerShown:false,
    //   }
    // },
  SuburbSelection,
  SearchFilter,
  FollowContainer,
  VideoScroll: {screen: VideoScroll, navigationOptions:{
    headerShown: false
  }},
  Home: AgentHome,
    Inbox,
    Chat,
    UserProfile,
    AgentProfile,
    PropertyAddress,
    RoomVideo,
    EditProfileInfo,
    LikedProperties,
})

const InboxNav = createStackNavigator({
  Inbox,
    Chat,
})

const UserProfileNav = createStackNavigator({
  UserProfile: {screen:UserProfile, navigationOptions:{
    headerShown: false
  }},
  AgentProfile,
  PropertyAddress,
  RoomVideo,
  EditProfileInfo,
  LikedProperties,
  Search,
  SuburbSelection,
  SearchFilter,
  FollowContainer,
  VideoScroll: {screen: VideoScroll, navigationOptions:{
    headerShown: false
  }},
  Home: AgentHome,
    Inbox,
    Chat,
})

const userNav = createMaterialBottomTabNavigator({
  Home: {screen: AgentHomeNav, navigationOptions:{
    tabBarIcon:(tabInfo) => {
      return <Icon name="home" size={26} color={tabInfo.tintColor} />
    }
  }},
  Search: {screen: searchNav, navigationOptions:{
    tabBarIcon:(tabInfo) => {
      return <Icon name="search" size={26} color={tabInfo.tintColor} />
    }
  }},
  Inbox: {screen: InboxNav, navigationOptions:{
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
  UserProfile: {screen: UserProfileNav, navigationOptions:{
    
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

userNav.navigationOptions = {
  headerShown: false,
};

export default userNav;
