import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, StyleSheet, SafeAreaView, Text, Alert, StatusBar } from 'react-native';
import GradientButton from '../../../../components/Button';
import Slider from '../../../../components/helper/Slider';
import { handleNewProperty } from '../../../../actions/property';
import SwitchSliderList from '../../../../components/helper/SwitchSliderList';
import { handleNewPropertyCampaign, handleUpdateProperty } from '../../../../actions/property';
export default function PropertyDetails({ navigation }) {
  const [state, setState] = React.useState({
    num_bedrooms: [1],
    num_bathrooms: [1],
    num_garages: [1],
    price: [200000, 10000000],
    isSwitchOn: true,
  });

  const created = useSelector(store => store.property.newPropertyCreated);
  const updated = useSelector(store => store.property.propertyUpdated);
  const dispatch = useDispatch();
  const { currentPropertyId,newPropertyDetails,currentProperty,newPropertyCampaign } = useSelector(store => store.property);

  const handleChange = (value, key) => {
    setState({ ...state, [key]: value });
  };

  const handleBtnPress = () => {
    const { num_bathrooms, num_bedrooms, num_garages,isSwitchOn, price } = state;

    if (num_bathrooms && num_bedrooms && num_garages) {
      const data = {
        num_bathrooms: num_bathrooms[0],
        num_bedrooms: num_bedrooms[0],
        num_garages: num_garages[0],
        
      };
const data2 = {
        list_price: isSwitchOn,
      min_price: price[0],
      max_price: price[1],
      }
      // if (created) {
      //   navigation.pop(4);
      // }
  
      // if (updated) {
      //   navigation.pop(3);
      // }
      dispatch(handleNewProperty(data));
      dispatch(handleNewPropertyCampaign(data2));
      // if (navigation.getParam('editing', false)) {
      //   const nextScreen = {
      //     AUCTION: 'Auction',
      //     PRIVATE_SALE: 'PrivateSale',
      //     RENTAL: 'RentalSetup',
      //   };

      //   navigation.navigate(nextScreen[newPropertyDetails.campaign_type], { editing: true });
      // } else {
      //   navigation.navigate('NewProperty_Screen3');
      // }
    } else {
      Alert.alert('Please Enter all required fields');
    }
  };
  const handleChange2 = (value, key) => {
    setState({ ...state, [key]: value });
  };


  useEffect(() => {
    if (navigation.getParam('editing', false)) {
      setState({
        num_bedrooms: [newPropertyDetails ? newPropertyDetails.num_bedrooms : 1],
        num_bathrooms: [newPropertyDetails ? newPropertyDetails.num_bathrooms : 1],
        num_garages: [newPropertyDetails ? newPropertyDetails.num_garages : 1],
        price: newPropertyCampaign
          ? [parseInt(newPropertyCampaign.min_price, 10) || 200000, parseInt(newPropertyCampaign.max_price, 10) || 10000000]
          : [200000, 10000000],
        isSwitchOn: newPropertyCampaign ? newPropertyCampaign.list_price : false,
      });
    }

    if (created) {
      if(currentPropertyId){
        console.log("New Property", currentProperty)
        navigation.navigate('PropertyAddress', { propertyId: currentPropertyId, title: currentProperty.title });
 
      }
    }
  }, [setState, navigation,created, updated, newPropertyDetails]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent={true} backgroundColor={'rgba(0, 0, 0, 0.1)'} barStyle="dark-content" />

      <View style={styles.containerView}>
        <View style={styles.sliderWrapper}>
          <Text style={styles.text}>How many bedrooms</Text>
          <Slider values={state.num_bedrooms} type="single" handleValuesChange={values => handleChange(values, 'num_bedrooms')} />
        </View>

        <View style={styles.sliderWrapper}>
          <Text style={styles.text}>How many bathrooms</Text>
          <Slider values={state.num_bathrooms} type="single" handleValuesChange={values => handleChange(values, 'num_bathrooms')} />
        </View>

        <View style={styles.sliderWrapper}>
          <Text style={styles.text}>How many car spaces</Text>
          <Slider values={state.num_garages} type="single" handleValuesChange={values => handleChange(values, 'num_garages')} />
        </View>
 <View style={styles.sliderWrapper}>
        <SwitchSliderList
          text="Show Price?"
          switchState={state.isSwitchOn}
          step={50000}
          min={200000}
          max={10000000}
          sliderValues={state.price}
          handleSwitchChange={value => handleChange2(value, 'isSwitchOn')}
          handleSliderChange={values => handleChange2(values, 'price')}
        />
      </View>

      
        <View style={styles.buttonWrapper}>
          <GradientButton onPress={handleBtnPress}>CONTINUE</GradientButton>
        </View>
      </View>
    </SafeAreaView>
  );
}

PropertyDetails.navigationOptions = {
  title: 'Property Details',
};

const styles = StyleSheet.create({
 
  container: {
    flex: 1,
  },
  containerView: {
    paddingTop: 25,
    paddingHorizontal: 25,
    flex: 1,
  },
  sliderWrapper: {
    alignItems: 'center',
    marginVertical: 30,
  },
  text: {
    color: '#000',
    fontFamily: 'font-regular',
    fontSize: 15,
    marginBottom: 12,
  },
});
