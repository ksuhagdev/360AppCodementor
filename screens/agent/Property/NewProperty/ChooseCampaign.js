import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView, View, Alert, StatusBar, StyleSheet } from 'react-native';
import ListItem from '../../../../components/List/ListItem';
import Checkbox from '../../../../components/helper/Checkbox';
import GradientButton from '../../../../components/Button';
import { handleNewProperty } from '../../../../actions/property';

export default function ChooseCampaign({ navigation }) {
  const [state, setState] = useState({
    AUCTION: false,
    PRIVATE_SALE: false,
    RENTAL: false,
  });
  const dispatch = useDispatch();
  const { newPropertyDetails } = useSelector(store => store.property);

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
  };

  const handleNavigate = () => {
    const navigateScreens = {
      AUCTION: 'Auction',
      PRIVATE_SALE: 'PrivateSale',
      RENTAL: 'RentalSetup',
    };

    const selected = Object.keys(state).find(stateKey => state[stateKey]);
    console.log("Selected Key", selected)
    if (selected) {
      dispatch(handleNewProperty({ campaign_type: selected }));
      navigation.navigate(navigateScreens[selected]);
    } else Alert.alert('', 'Please select a campaign type.');
  };

  useEffect(() => {
    if (navigation.getParam('editing', false)) {
      setState({
        AUCTION: newPropertyDetails.campaign_type === 'AUCTION',
        PRIVATE_SALE: newPropertyDetails.campaign_type === 'PRIVAE_SALE',
        RENTAL: newPropertyDetails.campaign_type === 'RENTAL',
      });
    }
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent={true} backgroundColor={'rgba(0, 0, 0, 0.1)'} barStyle="dark-content" />

      <View style={styles.containerView}>
        <View style={styles.listView}>
          <ListItem
            onPress={() => handleChange('AUCTION')}
            text="Auction"
            hasBorderBottom
            activeOpacity={0.6}
            customComponent={<Checkbox checked={state.AUCTION} handleOnPress={() => handleChange('AUCTION')} />}
          />
          <ListItem
            onPress={() => handleChange('PRIVATE_SALE')}
            text="Private Sale"
            hasBorderBottom
            activeOpacity={0.6}
            customComponent={<Checkbox checked={state.PRIVATE_SALE} handleOnPress={() => handleChange('PRIVATE_SALE')} />}
          />
          <ListItem
            onPress={() => handleChange('RENTAL')}
            text="Rental"
            activeOpacity={0.6}
            customComponent={<Checkbox checked={state.RENTAL} handleOnPress={() => handleChange('RENTAL')} />}
          />
        </View>

        <View style={styles.btnContainer}>
          <GradientButton onPress={handleNavigate}>CONTINUE</GradientButton>
        </View>
      </View>
    </SafeAreaView>
  );
}

ChooseCampaign.navigationOptions = {
  title: 'Choose Campaign',
};

const styles = StyleSheet.create({
  btnContainer: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  container: {
    flex: 1,
  },
  containerView: {
    padding: 20,
    paddingTop: 0,
    flex: 1,
  },
  listView: {
    flex: 1,
    justifyContent: 'flex-start',
  },
});
