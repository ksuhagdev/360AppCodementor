import React, { useEffect } from 'react';
import { View, FlatList, TouchableOpacity, StatusBar, ScrollView, ImageBackground, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ResultTile from './ResultTile';
import {useSelector} from 'react-redux'
const placeholderImage = require('../../../assets/image/property-placeholder.png');

export default function SuburbSelection({ navigation }) {
  const [currentHero, setCurrentHero] = React.useState(null);
  const suburb = navigation.getParam('Suburb');
  const filters = navigation.getParam('filters', null);
  var {searchResults } = useSelector(state => state.property);
  const properties = searchResults;
  console.log("Suburb Selection properties", properties)
  let interval;

  const onPropertyPressed = (propertyId, title) => {
    navigation.navigate('PropertyAddress', { propertyId, title });
  };

  const onBackPressed = () => {
    navigation.pop(1);
  };

  const setHeroSlider = () => {
    if (interval) {
      clearInterval(interval);
      setCurrentHero(null);
    }

    if (properties.length) {
      const randomProperty = properties[Math.floor(Math.random() * properties.length)];

      setCurrentHero({
        id: randomProperty.id,
        title: randomProperty.title,
        suburb: randomProperty.suburb,
        image: randomProperty.main_image_url ? { uri: randomProperty.main_image_url } : placeholderImage,
      });
    }
  };

  useEffect(() => {
    if(
      properties
    ){
    if (properties.length) {
      setHeroSlider();

      setInterval(() => {
        setHeroSlider();
      }, 5000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }
  }, [properties]);

  return (
    <View style={styles.equalFlex}>
      <StatusBar translucent={true} backgroundColor="rgba(0, 0, 0, 0.1)" barStyle="light-content" />

      <ScrollView>
        {currentHero !== null && (
          <TouchableOpacity onPress={() => onPropertyPressed(currentHero.id, currentHero.title)}>
            <ImageBackground source={currentHero.image} style={styles.hero}>
              <View style={styles.overlay} />

              <View style={styles.backBtnContainer}>
                <TouchableOpacity onPress={() => onBackPressed()}>
                  <Icon name="arrow-back" color="#fff" size={32} />
                </TouchableOpacity>
              </View>

              <View style={styles.heroTextContainer}>
                <Text style={[styles.suburb, styles.textShadow]}>{suburb}</Text>
                <Text style={[styles.propertiesCount, styles.textShadow]}>
                 Number of properties in this area: {properties.length} {filters.property_type}
                </Text>
                <Text style={[styles.filterText, styles.textShadow]}>
                  with {filters.bedrooms} bedrooms, {filters.bathrooms} bathrooms, {filters.car_spaces} car spaces
                </Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        )}

        <View style={styles.equalFlex}>
          <FlatList
            numColumns={3}
            data={properties}
            renderItem={({ item }) => <ResultTile property={item} handlePress={() => onPropertyPressed(item.id, item.title)} />}
            keyExtractor={item => item.id}
          />
        </View>
      </ScrollView>
    </View>
  );
}

SuburbSelection.navigationOptions = ({ navigation }) => {
  return {
    title: navigation.getParam('suburb'),
    headerShown: false,
  };
};

const styles = StyleSheet.create({
  back: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  backBtnContainer: {
    position: 'absolute',
    top: 40,
    left: 10,
  },
  equalFlex: {
    flex: 1,
  },
  filterText: {
    fontFamily: 'font-regular',
    color: '#fff',
    fontSize: 13,
    marginTop: 10,
  },
  hero: {
    alignItems: 'center',
    height: 260,
    justifyContent: 'center',
  },
  heroTextContainer: {
    alignItems: 'center',
    paddingHorizontal: 26,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  propertiesCount: {
    fontFamily: 'font-regular',
    color: '#fff',
    fontSize: 22,
  },
  suburb: {
    fontFamily: 'font-bold',
    color: '#fff',
    fontSize: 22,
  },
  textShadow: {
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: -2, height: 2 },
    textShadowRadius: 4,
  },
});
