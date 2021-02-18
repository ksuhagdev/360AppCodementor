import React, { useState } from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native';
import ListItem from '../../../../components/List/ListItem';
import Checkbox from '../../../../components/helper/Checkbox';
import GradientButton from '../../../../components/Button';

export default function InviteOthers({ navigation }) {
  const [state, setState] = useState({
    agent: false,
    photographer: false,
    adminStaff: false,
    mediaStaff: false,
  });
  const [userType, setUserType] = useState(null);

  const handleChange = key => {
    const newState = {};

    Object.keys(state).forEach(type => {
      if (type !== key) {
        newState[type] = false;
      } else {
        newState[type] = true;
      }
    });

    setState(newState);
    setUserType(key.toUpperCase());
  };

  const selectContacts = () => {
    const params = {
      agencyId: navigation.getParam('agencyId'),
      propertyId: navigation.getParam('propertyId'),
      userType: 'AGENT',
    };

    if (!state.agent) {
      params.userSubType = userType;
    }

    navigation.navigate('OpenContacts', params);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerView}>
        <View style={styles.equalFlex}>
          <ListItem
            onPress={() => handleChange('agent')}
            text="Invite other agents"
            secondaryText="to handle the property"
            activeOpacity={0.6}
            hasBorderBottom
            customComponent={<Checkbox checked={state.agent} handleOnPress={() => handleChange('agent')} />}
          />
          <ListItem
            onPress={() => handleChange('photographer')}
            text="Invite photographers"
            secondaryText="to shoot and load videos"
            activeOpacity={0.6}
            hasBorderBottom
            customComponent={<Checkbox checked={state.photographer} handleOnPress={() => handleChange('photographer')} />}
          />
          <ListItem
            onPress={() => handleChange('adminStaff')}
            text="Invite admin staff"
            secondaryText="to upload property and campaign details"
            activeOpacity={0.6}
            hasBorderBottom
            customComponent={<Checkbox checked={state.adminStaff} handleOnPress={() => handleChange('adminStaff')} />}
          />
          <ListItem
            onPress={() => handleChange('mediaStaff')}
            text="Invite social media staff"
            secondaryText="to share videos on social media"
            activeOpacity={0.6}
            customComponent={<Checkbox checked={state.mediaStaff} handleOnPress={() => handleChange('mediaStaff')} />}
          />
        </View>

        <View style={[styles.equalFlex, styles.justifyEnd]}>
          <GradientButton onPress={() => selectContacts()}>FIND PEOPLE</GradientButton>
        </View>
      </View>
    </SafeAreaView>
  );
}

InviteOthers.navigationOptions = {
  title: 'Choose Campaign',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerView: {
    padding: 20,
    paddingTop: 0,
    flex: 1,
  },
  equalFlex: {
    flex: 1,
  },
  justifyEnd: {
    justifyContent: 'flex-end',
  },
});
