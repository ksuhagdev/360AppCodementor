import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, StyleSheet, SafeAreaView, Text, ScrollView } from 'react-native';
import GradientButton from '../../../components/Button';
import Slider from '../../../components/helper/Slider';
import FilterTabs from '../../../components/Tabs/FilterTabs';
import { updateSearchFilters } from '../../../actions/property';

export default function SearchFilter({ onSearchPressed }) {
  const { searchFilters } = useSelector(store => store.property);
  const [campaignType, setCampaignType] = React.useState(getCampaignTypeLabel(searchFilters.campaignType));
  const [propertyType, setPropertyType] = React.useState(searchFilters.propertyType);
  const [state, setState] = React.useState({
    price: searchFilters.price,
    bedrooms: searchFilters.bedrooms,
    bathrooms: searchFilters.bathrooms,
    carSpace: searchFilters.carSpace,
  });
  const dispatch = useDispatch();

  const handleChange = (value, key) => {
    const data = { ...state, [key]: value };

    setState({ ...state, [key]: value });
    dispatch(updateSearchFilters({ ...data, campaignType: getCampaignType(campaignType), propertyType }));
  };

  const onCampaignTypeChanged = type => {
    setCampaignType(type);
    setState({
      ...state,
      price: type === 'FOR RENT' ? [250, 3000] : [200000, 10000000],
    });
    dispatch(updateSearchFilters({ ...state, campaignType: getCampaignType(type), propertyType }));
  };

  const onPropertyTypeChanged = type => {
    setPropertyType(getPropertyType(type));
    dispatch(updateSearchFilters({ ...state, campaignType: getCampaignType(campaignType), propertyType: getPropertyType(type) }));
  };

  return (
    <SafeAreaView style={styles.equalFlex}>
      <View style={styles.container}>
        <ScrollView style={styles.equalFlex}>
          <View style={styles.tabs}>
            <FilterTabs tabs={['FOR SALE']} activeTab={campaignType} onTabChanged={onCampaignTypeChanged} />
          </View>

          <View style={styles.tabs}>
            <FilterTabs
              tabs={['Houses', 'Apartments', 'Villas', 'Townhouses']}
              activeTab={getPropertyTypeLabel(propertyType)}
              onTabChanged={onPropertyTypeChanged}
            />
          </View>

          <View style={styles.sliderWrapper}>
            <Text style={styles.text}>Price Range</Text>

            {campaignType !== 'FOR RENT' && (
              <Slider
                valuePrefix="$"
                values={state.price}
                min={200000}
                maxValue={10000000}
                step={50000}
                snapped={true}
                allowOverlap={false}
                minMarkerOverlapDistance={20}
                handleValuesChange={values => handleChange(values, 'price')}
              />
            )}

            {campaignType === 'FOR RENT' && (
              <Slider valuePrefix="$" values={state.price} step={50} min={250} maxValue={3000} handleValuesChange={values => handleChange(values, 'price')} />
            )}
          </View>

          <View style={[styles.sliderWrapper, styles.bedrooms]}>
            <Text style={styles.text}>How many bedrooms</Text>
            <Slider values={state.bedrooms} type="single" handleValuesChange={values => handleChange(values, 'bedrooms')} />
          </View>

          <View style={[styles.sliderWrapper, styles.bathrooms]}>
            <Text style={styles.text}>How many bathrooms</Text>
            <Slider values={state.bathrooms} type="single" handleValuesChange={values => handleChange(values, 'bathrooms')} />
          </View>

          <View style={[styles.sliderWrapper, styles.carSpaces]}>
            <Text style={styles.text}>How many car spaces</Text>
            <Slider values={state.carSpace} type="single" handleValuesChange={values => handleChange(values, 'carSpace')} />
          </View>
        </ScrollView>

        <View style={styles.btnContainer}>
          <GradientButton onPress={() => onSearchPressed(state, campaignType, propertyType)}>SEARCH</GradientButton>
        </View>
      </View>
    </SafeAreaView>
  );
}

SearchFilter.navigationOptions = {
  title: 'Property Details',
};

const getPropertyType = label => {
  return `${label.toLowerCase().substring(0, label.length - 1)}`;
};

const getPropertyTypeLabel = type => {
  return `${type[0].toUpperCase()}${type.substring(1, type.length)}s`;
};

const getCampaignType = label => {
  let type = 'PRIVATE_SALE';

  switch (label) {
    case 'FOR SALE':
      type = 'PRIVATE_SALE';
      break;
    case 'FOR RENT':
      type = 'RENTAL';
      break;
    case 'FOR AUCTION':
      type = 'AUCTION';
      break;
  }

  return type;
};

const getCampaignTypeLabel = type => {
  let label = 'FOR SALE';

  switch (type) {
    case 'RENTAL':
      label = 'FOR RENT';
      break;
    case 'AUCTION':
      label = 'FOR AUCTION';
      break;
    case 'PRIVATE_SALE':
      label = 'FOR SALE';
      break;
  }

  return label;
};

const styles = StyleSheet.create({
  bathrooms: {
    marginVertical: 23,
  },
  bedrooms: {
    marginTop: 23,
  },
  btnContainer: {
    justifyContent: 'flex-end',
  },
  carSpaces: {
    paddingBottom: 30,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 25,
    zIndex: 2,
  },
  equalFlex: {
    flex: 1,
  },
  sliderWrapper: {
    alignItems: 'center',
  },
  tabs: {
    marginBottom: 23,
  },
  text: {
    color: '#000',
    fontFamily: 'font-regular',
    fontSize: 15,
    marginBottom: 8,
  },
});
