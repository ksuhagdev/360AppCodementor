import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import GradientButton from '../../../../../components/Button';
import SwitchSliderList from '../../../../../components/helper/SwitchSliderList';
import { handleNewPropertyCampaign, handleUpdateProperty } from '../../../../../actions/property';

export default function PrivateSale({ navigation }) {
  const [state, setState] = React.useState({
    price: [200000, 10000000],
    isSwitchOn: true,
  });
  const dispatch = useDispatch();
  const created = useSelector(store => store.property.newPropertyCreated);
  const updated = useSelector(store => store.property.propertyUpdated);
  const { currentPropertyId, currentProperty } = useSelector(state => state.property);
  
  const { newPropertyCampaign } = useSelector(store => store.property);

  const handleChange = (value, key) => {
    setState({ ...state, [key]: value });
  };

  const handleBtnSubmit = async() => {
    const { isSwitchOn, price } = state;

    const data = {
      list_price: isSwitchOn,
      min_price: price[0],
      max_price: price[1],
    };

    if (navigation.getParam('editing', false)) {
      dispatch(handleUpdateProperty(data));
    } else {
      await dispatch(handleNewPropertyCampaign(data));
      
      // navigation.navigate('PropertyAddress', { propertyId: currentPropertyId, title: "New" })
      
    }
  };

  useEffect(() => {
    console.log('Campaign: ', newPropertyCampaign);

    if (navigation.getParam('editing', false)) {
      setState({
        price: newPropertyCampaign
          ? [parseInt(newPropertyCampaign.min_price, 10) || 200000, parseInt(newPropertyCampaign.max_price, 10) || 10000000]
          : [200000, 10000000],
        isSwitchOn: newPropertyCampaign ? newPropertyCampaign.list_price : false,
      });
    }

    if (created) {
      navigation.pop(4);
    }

    if (updated) {
      navigation.pop(3);
    }
  }, [navigation, created, updated, newPropertyCampaign]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent={true} backgroundColor={'rgba(0, 0, 0, 0.1)'} barStyle="dark-content" />

      <View style={styles.sliderWrapper}>
        <SwitchSliderList
          text="Show Price?"
          switchState={state.isSwitchOn}
          step={50000}
          min={200000}
          max={10000000}
          sliderValues={state.price}
          handleSwitchChange={value => handleChange(value, 'isSwitchOn')}
          handleSliderChange={values => handleChange(values, 'price')}
        />
      </View>

      <View style={styles.btnContainer}>
        <GradientButton onPress={handleBtnSubmit}>DONE</GradientButton>
      </View>
    </SafeAreaView>
  );
}

PrivateSale.navigationOptions = {
  title: 'Private Sale',
};

const styles = StyleSheet.create({
  btnContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    margin: 20,
    flex: 1,
  },
  sliderWrapper: {
    alignItems: 'center',
    paddingBottom: 30,
  },
});
