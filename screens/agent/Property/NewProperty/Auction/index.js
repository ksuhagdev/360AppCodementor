import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { SET_AUCTION_DATE } from '../../../../../store/types';
import EditAuctionDate from './EditAuctionDate';
import GradientButton from '../../../../../components/Button';
import SwitchSliderList from '../../../../../components/helper/SwitchSliderList';
import { handleNewPropertyCampaign, handleUpdateProperty } from '../../../../../actions/property';

export default function Auction({ navigation }) {
  const [state, setState] = React.useState({
    isSwitchOn: false,
    price: [200000, 500000],
  });
  const dispatch = useDispatch();
  const created = useSelector(store => store.property.newPropertyCreated);
  const updated = useSelector(store => store.property.propertyUpdated);
  const { newPropertyCampaign, auctionDates } = useSelector(store => store.property);

  const handleChange = (value, key) => {
    setState({ ...state, [key]: value });
  };

  const onDateAdded = auctionDate => {
    dispatch({
      type: SET_AUCTION_DATE,
      payload: auctionDates.concat({ id: auctionDates.length, auction_date_time: auctionDate }),
    });
  };

  const onDateUpdated = (auctionDate, index) => {
    const dates = auctionDates.map(date => {
      if (date.id === index) {
        // eslint-disable-next-line no-param-reassign
        date.auction_date_time = auctionDate;
      }

      return date;
    });

    dispatch({
      type: SET_AUCTION_DATE,
      payload: dates,
    });
  };

  const handleBtnSubmit = () => {
    const { isSwitchOn, price } = state;

    const data = {
      show_price_guide: isSwitchOn,
      min_price: price[0],
      max_price: price[1],
    };

    if (navigation.getParam('editing', false)) {
      dispatch(handleUpdateProperty(data));
    } else {
      dispatch(handleNewPropertyCampaign(data));
    }
  };

  useEffect(() => {
    if (navigation.getParam('editing', false)) {
      setState({
        price: newPropertyCampaign
          ? [parseInt(newPropertyCampaign.min_price, 10) || 200000, parseInt(newPropertyCampaign.max_price, 10) || 10000000]
          : [200000, 10000000],
        isSwitchOn: newPropertyCampaign ? newPropertyCampaign.show_price_guide : false,
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

      <View style={styles.containerView}>
        <View style={styles.switchContainer}>
          <SwitchSliderList
            text="Show price guide"
            switchState={state.isSwitchOn}
            step={50000}
            min={200000}
            max={10000000}
            sliderValues={state.price}
            handleSwitchChange={value => handleChange(value, 'isSwitchOn')}
            handleSliderChange={values => handleChange(values, 'price')}
          />
        </View>

        <EditAuctionDate isEditing={navigation.getParam('editing', false)} onCreate={onDateAdded} onUpdate={onDateUpdated} />

        <View style={styles.btnContainer}>
          <GradientButton onPress={handleBtnSubmit}>DONE</GradientButton>
        </View>
      </View>
    </SafeAreaView>
  );
}

Auction.navigationOptions = {
  title: 'Auction',
};

const styles = StyleSheet.create({
  btnContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    flex: 1,
  },
  containerView: {
    flex: 1,
    padding: 20,
    paddingBottom: 0,
  },
  switchContainer: {
    alignItems: 'center',
  },
});
