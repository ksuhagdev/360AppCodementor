import { createStackNavigator, HeaderBackButton } from 'react-navigation-stack';
import { Button } from 'react-native'
import AgentHome from './AgentHome';
import UserProfile from './UserProfile';
import AgentProfile from './AgentProfile';
import CameraSession from './CameraSession';
import EditDateAndTime from './DateTime/Edit';
import InviteOthers from './Property/Campaign/InviteOthers';
import PrivateEmail from './Email/private';
import Verification from './Verification';
import DiscoverSoundtrack from './Soundtrack/Discover';
import TrackList from './Soundtrack/Tracks';
import OpenContacts from './Contacts';
import NewProperty from './Property/NewProperty';
import PropertyDetails from './Property/NewProperty/PropertyDetails';
import ChooseCampaign from './Property/NewProperty/ChooseCampaign';
import Auction from './Property/NewProperty/Auction';
import PrivateSale from './Property/NewProperty/PrivateSale';
import EditInspectionTime from './Property/NewProperty/Auction/EditInspectionTime';
import RentalSetup from './Property/NewProperty/RentalSetup';
import PropertyAddress from './Property/Overview';
import CaptureVideo from './TikTok/CaptureVideo';
import EditVideo from './CameraSession/EditVideo';
import EditPersonalInfo from '../user/Profile/EditInfo';
import EditAgentProfile from './AgentProfile/EditAgentProfile';
import AddFloorPlan from './Property/FloorPlan/AddFloorPlan';
import Search from '../user/Search';
import SuburbSelection from '../user/Search/SuburbSelection';
import Inbox from '../user/Inbox';
import Chat from '../user/Inbox/Chat';
import RoomVideo from '../user/Agent/RoomVideo';
import TrimVideo from '../agent/CameraSession/TrimVideo';
import VideoScroll from '../../components/List/VideoScroll';
import Icon from 'react-native-vector-icons/MaterialIcons';
import React from 'react'
import { Platform, Text, Image } from 'react-native'
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs'
import plusIcon from '../../assets/image/plusButton2.png'
import Hero from './AgentHome/Hero'
import VideoPlayScreen from '../user/Search/VideoPlayScreen'
import Music from './Music';
import Genre from './Music/Genre'
import FollowContainer from '../follow/FollowContainer';

import LikedProperties from '../like/LikedProperties';

// const AgentNavigator = createStackNavigator(
//   {
//     Home: AgentHome,
//     Hero: Hero,
//     AgentProfile,
//     PropertyAddress,
//     UserProfile,
//     CameraSession,
//     DiscoverSoundtrack,
//     TrackList,
//     NewProperty_Screen1: NewProperty,
//     NewProperty_Screen2: PropertyDetails,
//     NewProperty_Screen3: ChooseCampaign,
//     RentalSetup,
//     PrivateSale,
//     Auction,
//     EditDateAndTime,
//     EditInspectionTime,
//     InviteOthers,
//     Verification,
//     PrivateEmail,
//     OpenContacts,
//     CaptureVideo,
//     EditVideo,
//     EditPersonalInfo,
//     EditAgentProfile,
//     AddFloorPlan,
//     Search,
//     SuburbSelection,
//     Inbox,
//     Chat,
//     RoomVideo,
//     TrimVideo,
//     VideoScroll: {
//       screen: VideoScroll, navigationOptions: {
//         headerShown: false
//       }
//     }
//     // VideoTrim
//   },
//   {
//     initialRouteName: 'Home',
//     defaultNavigationOptions: {
//       headerTintColor: '#000',
//       headerTitleStyle: {
//         fontFamily: 'font-regular',
//         fontSize: 16,
//       },
//     },
//   },
// );

const AgentHomeNav = createStackNavigator({
  Home: AgentHome,
  AgentProfile,
  Hero: { screen: Hero, navigationOptions: { headerShown: false } },
  VideoPlayScreen: {
    screen: VideoPlayScreen, navigationOptions: {
      headerTransparent: true,
      title: "",
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
    }
  },
  PropertyAddress,
  Music,
  Genre:{screen: Genre, navigationOptions:{ headerShown: false}},
  UserProfile,
  CameraSession,
  DiscoverSoundtrack,
  TrackList,
  NewProperty_Screen1: NewProperty,
  NewProperty_Screen2: PropertyDetails,
  NewProperty_Screen3: ChooseCampaign,
  RentalSetup,
  PrivateSale,
  Auction,
  EditDateAndTime,
  EditInspectionTime,
  InviteOthers,
  Verification,
  PrivateEmail,
  OpenContacts,
  CaptureVideo,
  EditVideo,
  EditPersonalInfo,
  EditAgentProfile,
  AddFloorPlan,
  Search,
  SuburbSelection,
  Inbox,
  Chat,
  RoomVideo,
  TrimVideo,
  VideoScroll: {
    screen: VideoScroll, navigationOptions: {
      headerShown: false
    }
  }
})

const searchNav = createStackNavigator({
  Search,
  SuburbSelection,
  PropertyAddressNew: { screen: PropertyAddress },
  UserProfile,
  Hero: { screen: Hero, navigationOptions: { headerShown: false } },
  VideoPlayScreen: {
    screen: VideoPlayScreen, navigationOptions: {
      headerTransparent: true,
      tabBarVisible: false,
      title: "",
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
    }
  },
  CameraSession,
  DiscoverSoundtrack,
  TrackList,
  NewProperty_Screen1: NewProperty,
  NewProperty_Screen2: PropertyDetails,
  NewProperty_Screen3: ChooseCampaign,
  RentalSetup,
  PrivateSale,
  Auction,
  EditDateAndTime,
  EditInspectionTime,
  InviteOthers,
  Verification,
  PrivateEmail,
  OpenContacts,
  CaptureVideo,
  EditVideo,
  EditPersonalInfo,
  EditAgentProfile,
  AddFloorPlan,
  Inbox,
  Chat,
  RoomVideo,
  TrimVideo,
  // VideoScroll: {screen: VideoScroll, navigationOptions:{
  //   headerShown: false
  // }}
})

const newPropertyNav = createStackNavigator({
  NewProperty_Screen1: NewProperty,
  NewProperty_Screen2: PropertyDetails,
  NewProperty_Screen3: ChooseCampaign,
  RentalSetup,
  PrivateSale,
  Auction,
  EditDateAndTime,
  EditInspectionTime,
  InviteOthers,
  Verification,
  PrivateEmail,
  OpenContacts,
  CaptureVideo,
  EditVideo,
  EditPersonalInfo,
  EditAgentProfile,
  AddFloorPlan,
  Inbox,
  Chat,

  RoomVideo,
  TrimVideo,
  VideoScroll: {
    screen: VideoScroll, navigationOptions: {
      headerShown: false
    }
  },
  Search,
  SuburbSelection,
  PropertyAddress: {
    screen: PropertyAddress, navigationOptions: ({ navigation }) => {
      return {
        headerLeft: (<HeaderBackButton onPress={() => { navigation.navigate('Home') }} />)
      }
    }
  },
  UserProfile,
  CameraSession,
  DiscoverSoundtrack,
  TrackList,
  AgentProfile,
})

const InboxNav = createStackNavigator({
  Inbox,
  Chat,
})

const UserProfileNav = createStackNavigator({
  UserProfile: {
    screen: UserProfile, navigationOptions: {
      headerShown: false
    }
  },
  NewProperty_Screen1: NewProperty,
  NewProperty_Screen2: PropertyDetails,
  NewProperty_Screen3: ChooseCampaign,
  RentalSetup,
  PrivateSale,
  Auction,
  EditDateAndTime,
  EditInspectionTime,
  InviteOthers,
  Verification,
  PrivateEmail,
  LikedProperties,
  FollowContainer,
  OpenContacts,
  CaptureVideo,
  EditVideo,
  EditPersonalInfo,
  EditAgentProfile,
  AddFloorPlan,
  Inbox,
  Chat,
  Music,
  RoomVideo,
  TrimVideo,
  VideoScroll: {
    screen: VideoScroll, navigationOptions: {
      headerShown: false
    }
  },
  Search,
  SuburbSelection,
  PropertyAddress,
  CameraSession,
  DiscoverSoundtrack,
  TrackList,
  AgentProfile,
})

UserProfileNav.navigationOptions = ({ navigation }) => {
  let { routeName } = navigation.state.routes[navigation.state.index];
  let navigationOptions = {};

  if (routeName === 'CameraSession') {
    navigationOptions.tabBarVisible = false;
  }

  return navigationOptions;
};


const agentAuth = createMaterialBottomTabNavigator({
  Home: {
    screen: AgentHomeNav, navigationOptions: {
      tabBarIcon: (tabInfo) => {
        return <Icon name="home" size={26} color={tabInfo.tintColor} />
      }
    }
  },
  Search: {
    screen: searchNav, navigationOptions: {
      tabBarIcon: (tabInfo) => {
        return <Icon name="search" size={26} color={tabInfo.tintColor} />
      }
    }
  },
  NewProperty: {
    screen: newPropertyNav, navigationOptions: {
      tabBarIcon: (tabInfo) => {
        return <Image
          source={plusIcon}
          style={{ height: 35, resizeMode: 'contain' }}
        />
      },
      tabBarLabel: Platform.OS === "android" ? (
        <Text style={{
          // fontFamily: "roboto-bold" 
        }}> </Text>
      ) : (
          ' '
        ),
    },
  },
  Inbox: {
    screen: InboxNav, navigationOptions: {
      tabBarIcon: (tabInfo) => {
        return <Icon name="chat-bubble-outline" size={26} color={tabInfo.tintColor} />
      },
      tabBarLabel: Platform.OS === "android" ? (
        <Text style={{
          // fontFamily: "roboto-bold" 
        }}>Inbox</Text>
      ) : (
          Inbox
        ),
    }
  },
  UserProfile: {
    screen: UserProfileNav, navigationOptions: {
      tabBarIcon: (tabInfo) => {
        return <Icon name="person-outline" size={26} color={tabInfo.tintColor} />
      },
    },
  }
}, {
  activeColor: '#fff',
  barStyle: {
    backgroundColor: '#000'
  },

})


agentAuth.navigationOptions = {
  headerShown: false,
};

export default agentAuth;
