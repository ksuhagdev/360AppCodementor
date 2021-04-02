import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
  StatusBar,
  Platform,
} from 'react-native';
import Tab from '../../../components/Tabs';
import PropertiesPanel from './panel';
import { getAgentProfileDetails, clearProfile, getLiveProperties, clearLiveProperties, getDraftProperties, clearDraftProperties } from '../../../actions/agent';
import request from '../../../helper/functions/request';
import { createConversation } from '../../../actions/message';
import { getPayload } from '../../../utils/TokenService';
import { handleSnackbar } from '../../../helper/functions/snackbar';

const messageIcon = require('../../../assets/image/message.png');
const callIcon = require('../../../assets/image/call.png');
const defaultProfileImage = require('../../../assets/image/default-profile-pic.png');

export default function AgentProfile({ navigation }) {
  const profile = useSelector(state => state.agent.agentProfile);
  const [hasAccess, setHasAccess] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState(navigation.getParam('activeTab', 'active'));
  const [isLoading, setIsLoading] = React.useState(false);
  const { accessToken } = useSelector(state => state.account);
  const { isLoadingLiveProperties } = useSelector(state => state.agent);
  const { isLoadingDraftProperties } = useSelector(state => state.agent);
  const { agentLiveProperties } = useSelector(state => state.agent);
  const { agentDraftProperties } = useSelector(state => state.agent);
  const dispatch = useDispatch();
  const agentId = navigation.getParam('agentId');

  useEffect(() => {
    const payload = getPayload(accessToken);

    if (payload && payload.sub === agentId) {
      // Current user is agent
      setHasAccess(true);
    }

    dispatch(getAgentProfileDetails(agentId));

    if (activeTab === 'active') {
      dispatch(getLiveProperties(agentId));
      console.log("Get Live Properties",agentLiveProperties)
    } else {
      dispatch(getDraftProperties(agentId));
    }

    return () => {
      dispatch(clearProfile());
      dispatch(clearLiveProperties());
      dispatch(clearDraftProperties());
    };
  }, [agentId]);

  const onActiveTabScroll = e => {
    let paddingToBottom = 40;

    paddingToBottom += e.nativeEvent.layoutMeasurement.height;

    if (e.nativeEvent.contentOffset.y >= e.nativeEvent.contentSize.height - paddingToBottom) {
      if (!isLoadingLiveProperties) {
        dispatch(getLiveProperties(agentId));
      }
    }
  };

  const onDraftsTabScroll = e => {
    let paddingToBottom = 40;

    paddingToBottom += e.nativeEvent.layoutMeasurement.height;

    if (e.nativeEvent.contentOffset.y >= e.nativeEvent.contentSize.height - paddingToBottom) {
      if (!isLoadingDraftProperties) {
        dispatch(getDraftProperties(agentId));
      }
    }
  };

  const follow = async () => {
    if (isLoading) {
      return false;
    }

    if (accessToken) {
      setIsLoading(true);

      try {
        await request({
          url: `/follows/follow/${agentId}`,
          config: {
            method: 'POST',
          },
        });

        profile.is_following = true;

        setIsLoading(false);
      } catch (error) {
        console.log(error);

        handleSnackbar({ message: 'Could not follow agent at this time. Please retry in a bit.' });
        setIsLoading(false);
      }
    } else {
      Alert.alert('Login required', 'You must be logged in to follow agents. Do you want to login/sign up?', [
        { text: 'Maybe later', style: 'cancel' },
        {
          text: 'Login',
          onPress: () => {
            navigation.navigate('Login');
          },
        },
      ]);
    }
  };

  const editProfile = () => {
    navigation.navigate('EditAgentProfile', { agentId });
  };

  const unfollow = async () => {
    if (isLoading) {
      return false;
    }

    setIsLoading(true);

    try {
      await request({
        url: `/follows/unfollow/${agentId}`,
        config: {
          method: 'DELETE',
        },
      });

      profile.is_following = false;

      setIsLoading(false);
    } catch (error) {
      console.log(error);

      handleSnackbar({ message: 'Could not unfollow agent at this time. Please retry in a bit.' });
      setIsLoading(false);
    }
  };

  const onMessagePressed = () => {
    if (accessToken) {
      navigation.navigate('Chat', { from: profile.user.first_name });
      dispatch(createConversation(agentId, 'No subject'));
    } else {
      Alert.alert('Login required', 'You must be logged in to send messages. Do you want to login/sign up?', [
        { text: 'Maybe later', style: 'cancel' },
        {
          text: 'Login',
          onPress: () => {
            navigation.navigate('Login');
          },
        },
      ]);
    }
  };

  const handlePhoneCall = () => {
    if (!profile.user.phone) {
      return Alert.alert('Agent has not provided a contact number');
    }

    if (Platform.OS === 'android') {
      Linking.openURL(`tel:${profile.user.phone_country_code}${profile.user.phone}`);
    } else {
      Linking.openURL(`telprompt:${profile.user.phone_country_code}${profile.user.phone}`);
    }
  };

  const switchTab = tab => {
    setActiveTab(tab);

    // Fetch data for the first time, only when required
    if (tab === 'drafts' && agentDraftProperties.length === 0) {
      dispatch(getDraftProperties(agentId));
    }

    if (tab === 'active' && agentLiveProperties.length === 0) {
      dispatch(getLiveProperties(agentId));
    }
  };

  return profile ? (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent={true} backgroundColor={'rgba(0, 0, 0, 0.1)'} barStyle="dark-content" />

      <View style={styles.info}>
        <Image style={styles.img} source={profile.user.profile_photo_url ? { uri: profile.user.profile_photo_url } : defaultProfileImage} />

        <View style={styles.profileSummary}>
          <Text style={styles.text}>
            {profile.user.first_name} {profile.user.last_name}
          </Text>

          <Text style={[styles.text, styles.agentTitle]}>{profile.agent.title}</Text>

          <Text style={styles.followers}>{profile.followers_count} Followers</Text>

          {hasAccess && (
            <TouchableOpacity onPress={() => editProfile()}>
              <View style={styles.editBtn}>
                <Text style={styles.editCTA}>Edit</Text>
              </View>
            </TouchableOpacity>
          )}

          {!hasAccess && profile.is_following && (
            <View style={styles.followBtn}>
              <TouchableOpacity onPress={() => unfollow()}>
                {!isLoading && <Text style={styles.followCTA}>Following</Text>}

                {isLoading && <ActivityIndicator size="small" color="#fff" />}
              </TouchableOpacity>
            </View>
          )}

          {!hasAccess && !profile.is_following && (
            <View style={styles.followBtn}>
              <TouchableOpacity onPress={() => follow()}>
                {!isLoading && <Text style={styles.followCTA}>Follow</Text>}

                {isLoading && <ActivityIndicator size="small" color="#fff" />}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <View style={styles.containerView}>
        <View style={styles.personalInfo}>
          <View>
            <Text style={styles.text}>{profile.agency.name}</Text>

            {/* <Text style={styles.agencyInfo}>{profile.agency.address}</Text> */}
          </View>
          </View>

          {!hasAccess && (
            <View style={styles.ctaContainer}>
              <TouchableOpacity style={styles.alignCenter} onPress={() => onMessagePressed()}>
                {/* <View > */}
                  {/* <Image source={messageIcon} style={styles.infoBtn} /> */}
                  <Text style={styles.ctaText}>Message</Text>
                {/* </View> */}
              </TouchableOpacity>

              <TouchableOpacity style={styles.alignCenter} onPress={handlePhoneCall}>
                {/* <View > */}
                  {/* <Image source={callIcon} style={styles.infoBtn} /> */}
                  <Text style={styles.ctaText}>Call</Text>
                {/* </View> */}
              </TouchableOpacity>
            </View>
          )}

        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>{profile.agent.profile_description}</Text>
        </View>
      </View>

      {hasAccess && (
        <View style={styles.tabsContainer}>
          <Tab isActive={activeTab === 'active'} onPress={() => switchTab('active')}>
            Active Properties
          </Tab>

          <Tab isActive={activeTab === 'drafts'} onPress={() => switchTab('drafts')}>
            Offline/Drafts
          </Tab>
        </View>
      )}

      {activeTab === 'active' && (
        <ScrollView style={styles.panelContainer} onScroll={onActiveTabScroll} scrollEventThrottle={400}>
          <PropertiesPanel hasAccess={hasAccess} navigation={navigation} data={agentLiveProperties} type="active" isLoading={isLoadingLiveProperties} />
        </ScrollView>
      )}

      {activeTab === 'drafts' && (
        <ScrollView style={styles.panelContainer} onScroll={onDraftsTabScroll} scrollEventThrottle={400}>
          <PropertiesPanel hasAccess={hasAccess} navigation={navigation} data={agentDraftProperties} type="draft" isLoading={isLoadingDraftProperties} />
        </ScrollView>
      )}
    </SafeAreaView>
  ) : (
    <View />
  );
}

AgentProfile.navigationOptions = {
  title: 'Agent Profile',
};

const styles = StyleSheet.create({
  agencyInfo: {
    fontSize: 12,
    fontFamily: 'font-light',
    color: 'rgba(0, 0, 0, 0.7)',
    marginTop: 7,
    maxWidth: '90%',
  },
  agentTitle: {
    fontSize: 13,
    marginTop: 4,
    fontFamily: 'font-light',
  },
  alignCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: 7,
    borderWidth: 0.5,
    width:'46%',
    borderRadius:5

  },
  container: {
    flex: 1,
    // backgroundColor: '#000',
  },
  containerView: {
    padding: 20,
  },
  ctaContainer: {
    flexDirection: 'row',
    justifyContent:'space-between',
  },
  ctaMargin: {
    marginLeft: 20,
  },
  ctaText: {
    justifyContent: 'center',
    alignSelf:'center',
    // marginTop: 4,
    // fontFamily: 'font-light',
    fontWeight: "bold",
    // textAlign: 'center',
  },
  descriptionContainer: {
    paddingVertical: 13.5,
  },
  descriptionText: {
    fontSize: 11,
    lineHeight: 18,
    fontFamily: 'font-regular',
  },
  editBtn: {
    backgroundColor: '#e5e5e5',
    borderRadius: 4,
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  editCTA: {
    fontSize: 12,
    fontFamily: 'font-regular',
  },
  followBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#ff0051',
    borderRadius: 8,
    marginTop: 8,
  },
  followCTA: {
    color: '#fff',
  },
  followers: {
    fontSize: 12,
    marginTop: 6,
    fontFamily: 'font-bold',
  },
  img: {
    borderRadius: 100,
    height: 115,
    marginRight: 13,
    width: 115,
  },
  info: {
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    flexDirection: 'row',
    padding: 20,
  },
  infoBtn: {
    height: 44,
    width: 44,
  },
  panelContainer: {
    marginTop: 40,
  },
  personalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    paddingBottom: 20,
  },
  profileSummary: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    flexWrap: 'wrap',
    marginLeft: 12,
  },
  tabsContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'font-regular',
    fontSize: 16,
  },
});
