import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  ImageBackground,
  ActivityIndicator,
  Modal,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Platform,
  Keyboard,
  StatusBar,
  Alert,
} from 'react-native';
// import ColorFade from '../../../components/helper/ColorFade';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import Icon from 'react-native-vector-icons/MaterialIcons';
import Autocomplete from 'react-native-autocomplete-input';
import ResultTile from './ResultTile';
import SearchFilter from './Filter';
// import useSearchLocation from '../../../hooks/useSearchLocation';
import { searchProperties, updateSearchFilters, getTrendingProperties } from '../../../actions/property';

const filterIcon = require('../../../assets/image/filter.png');
const placeholderImage = require('../../../assets/image/property-placeholder.png');

export default function Search({ navigation }) {
  const [currentHero, setCurrentHero] = useState(null);
  const [searchValue, setSearchValue] = useState(null);
  const { width } = Dimensions.get('window');
  const imageDimension = width / 3 - 2;
  const [interval, updateInterval] = useState(null);
  const [hideResults, setHideResults] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  var { isSearchLoading, searchResults, searchFilters, trendingProperties } = useSelector(state => state.property);

  const [trendLoading, settrendLoading] = useState(false)
  // const { query, setQuery, search } = useSearchLocation();
  const [searchResult, setSearchResult] = useState([])
  const [query, setQuery] = useState(null)
  const [mainImage, setmainImage] = useState(null)
  const onLocationSelect = async item => {
    console.log('So the detasil', item.address_components)
    let Postcode, State, Country, Suburb;
    let results = []
    for (var i = 0; i < item.address_components.length; i++) {
      if (item.address_components[i].types.includes('postal_code')) {
        console.log("Success", item.address_components[i])
        Postcode = item.address_components[i].long_name
        console.log("Postcode is", Postcode)

      }
      if (item.address_components[i].types.includes('administrative_area_level_1')) {
        console.log("Success", item.address_components[i])
        State = item.address_components[i].short_name
        console.log("State is", State)
      }
      if (item.address_components[i].types.includes('administrative_area_level_2')) {
        console.log("Success", item.address_components[i])
        Suburb = item.address_components[i].short_name
        console.log("State is", State)
      }
      if (item.address_components[i].types.includes('country')) {
        console.log("Success", item.address_components[i])
        Country = item.address_components[i].short_name
        console.log("Suburb is", Country)
      }
    }
    console.log("Results of Search", Postcode, State, Country)

    await dispatch(
      updateSearchFilters({
        ...searchFilters,
        suburb: Postcode,
        state: State,
        country: Country,
      }),
    );

    if (interval) {
      clearInterval(interval);
      updateInterval(null);
    }
    try{
      await dispatch(searchProperties());
      // const { searchResults} = useSelector(state => state.property);
      console.log("Search Results", searchResults)
      // if(searchResults){
        
          navigation.navigate('SuburbSelection', {
            Suburb,
            properties: searchResults,
            filters: searchFilters,
          });
        
    }catch(err){
      console.log("Error from Search", err.message)
      Alert.alert(err.message)
    }
    
      
   
    // }
  };

  const onTrendingPressed = (index, item) => {
    // console.log("Going Into Hero")
    navigation.navigate('VideoPlayScreen', { data: trendingProperties, CurrentIndex: index, item: item });
  };

  const onPropertyPressed = (propertyId, title) => {
    navigation.navigate('PropertyAddress', { propertyId, title });
  };

  const onSuburbPressed = (suburb, data) => {
    navigation.navigate('SuburbSelection', {
      suburb,
      properties: data,
      filters: searchFilters,
    });
  };

  const onFiltersSet = (filters, campaignType, propertyType) => {
    const options = {
      campaignType: getCampaignType(campaignType),
      propertyType,
      ...filters,
    };

    dispatch(
      updateSearchFilters({
        ...searchFilters,
        ...options,
      }),
    );

    if (searchFilters.suburb) {
      // Perform a new search
      if (interval) {
        clearInterval(interval);
        updateInterval(null);
      }

      dispatch(searchProperties());
    }

    setIsModalOpen(false);
  };

  const setHeroSlider = () => {
    if (trendingProperties.length) {
      // const suburbs = Object.entries(searchResults).map(([suburb, data]) => suburb);
      const randomSuburb = trendingProperties[Math.floor(Math.random() * trendingProperties.length)];
      // const properties = searchResults[randomSuburb];
      const randomProperty = randomSuburb[Math.floor(Math.random() * trendingProperties.length)];
      // console.log("Results", randomSuburb)
      setCurrentHero({
        id: randomSuburb.id,
        title: randomSuburb.title,
        suburb: randomSuburb.suburb,
        image: randomSuburb.main_image_url ? { uri: randomSuburb.main_image_url } : placeholderImage,
      });
    }
  };

  const handleChange = text => {
    // setQuery(text);
    console.log("Text Length", text.length)
    if(text.length > 3){
      console.log("When the length of text")
      setHideResults(false)
    }
    setSearchValue(text);
    // setHideResults(false);
  };

  useEffect(() => {
    console.log("Search BValie", searchValue)
    fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${searchValue}&types=(regions)&key=AIzaSyCyWctabwPuw3UNXU7cSQ0ZmNLNrbyXDsU`).then(result => result.json()).then(final => {
      setSearchResult(final.predictions)
      console.log("Final", final)
    })


  }, [searchValue])
  const onSelect = item => {
    // onLocationSelect(item);
    setSearchValue(item.description)
    // setSearchValue(`${item.name}, ${item.admin_name1}`);
    // setHideResults(true);
    fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${item.place_id}&fields=address_component&key=AIzaSyCyWctabwPuw3UNXU7cSQ0ZmNLNrbyXDsU`).then(result => result.json()).then(final => {
      console.log("Final Result", final.result.address_components

      )
      onLocationSelect(final.result)
    })
    // console.log("Item", item)
    Keyboard.dismiss();
  };



  const getCampaignType = value => {
    let campaignType = 'PRIVATE_SALE';

    switch (value) {
      case 'FOR SALE':
        campaignType = 'PRIVATE_SALE';
        break;
      case 'FOR RENT':
        campaignType = 'RENTAL';
        break;
      case 'FOR AUCTION':
        campaignType = 'AUCTION';
        break;
    }

    return campaignType;
  };

  useEffect(() => {
    if (trendingProperties.length) {
      setHeroSlider();

      updateInterval(
        setInterval(() => {
          setHeroSlider();
        }, 5000),
      );
    }

    return () => {
      if (interval) {
        clearInterval(interval);
        updateInterval(null);
        setCurrentHero(null);
      }
    };
  }, [trendingProperties]);

  useEffect(() => {
    const getData = async () => {
      dispatch(
        getTrendingProperties()
      );
      trendingProperties = trendingProperties.filter(item => item.main_image_url !== null)
      console.log("Inside Search", trendingProperties.length)
      if (trendingProperties.length) {
        console.log("trending zero", trendingProperties[0])
        setmainImage(trendingProperties[0])
        console.log(trendLoading)
        // settrendLoading(true)
      }
    }
    getData()
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent={true} backgroundColor="rgba(0, 0, 0, 0.1)" animated barStyle="dark-content" />
      <View style={styles.searchBoxContainer}>
        <TouchableOpacity style={styles.searchIcon}>
          <Icon name="search" size={20} color="#a8a9a8" />
        </TouchableOpacity>
        {/* <GooglePlacesAutocomplete
                placeholder='Suburb or City'
                fetchDetails={true}
                autoFocus={false}
                styles={{textInput: {
                  marginLeft: 40,
                  borderBottomColor: 'rgba(0, 0, 0, 0.1)',
                  borderColor: 'transparent',
                  borderWidth: 0.5,
                  color: 'rgba(0,0,0,0.99)',
                  fontFamily: 'font-light',
                  fontSize: 15,
                  paddingHorizontal: 0,
                  paddingVertical: 10,
                  zIndex: 1,
                }}}
                onPress={async (data, details = null) => {
                  // 'details' is provided when fetchDetails = true
                  // console.log("Selected Address",details);
                  onSelect(details)
                  
                }}
                // getDefaultValue={() => ''}
                // listViewDisplayed='true'
                // keyboardShouldPersistTaps="handled"
                // GooglePlacesDetailsQuery={{ fields: 'formatted_address' }}
                // debounce={300}
                
                query={{
                  key:'AIzaSyCyWctabwPuw3UNXU7cSQ0ZmNLNrbyXDsU',
                  language: 'en',
                  type:'(cities)',
                  // components:'country:au'
                }}
              /> */}
        <Autocomplete
          autoCorrect={false}
          data={searchResult}
          value={searchValue}
          hideResults={hideResults}
          onBlur={() => setHideResults(true)}
          placeholder="Enter a suburb"
          keyExtractor={item => `${item.name}-${item.postcode}`}
          onChangeText={text => handleChange(text)}
          renderItem={({ item }) => (

            <TouchableOpacity style={styles.itemAlign} onPress={() => onSelect(item)}>
              <View style={styles.autoCompleteItem}>
                <Text style={styles.autoCompleteText}>
                  {item.description}

                </Text>
              </View>
            </TouchableOpacity>
          )}
          containerStyle={Platform.OS === 'ios' ? styles.autocompleteContainer : null}
          inputContainerStyle={styles.autoCompleteInput}
          listContainerStyle={Platform.OS === 'ios' ? styles.autoCompleteList : null}  
          style={Platform.OS === 'ios' ? styles.textInputIOS : styles.textInputAndroid}
        />

        <TouchableOpacity style={styles.filterIcon} onPress={() => setIsModalOpen(true)}>
          <Image source={filterIcon} />
        </TouchableOpacity>
      </View>


      {/* {isSearchLoading && !searchResults && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#d81b60" />

          <Text>Finding properties...</Text>
        </View>
      )} */}

      {/* {!isSearchLoading && searchResults && Object.entries(searchResults).length === 0 && (
        <View style={styles.loadingContainer}>
          <Text style={styles.greyText}>No properties found matching your search criteria. Try another search?</Text>
        </View>
      )} */}
        <View style={[styles.container, styles.resultsContainer]}>
          <ScrollView>
            {currentHero !== null && (
              <TouchableOpacity onPress={() => onPropertyPressed(currentHero.id, currentHero.title)}>
                <ImageBackground source={currentHero.image} style={styles.hero}>
                  <View style={styles.overlay} />

                  <Text style={styles.heroText}>Watch</Text>
                  <Text style={styles.heroText}>Properties You Might Like</Text>
                </ImageBackground>
              </TouchableOpacity>
            )}
            <View style={styles.container}>
              <FlatList
                numColumns={3}
                data={trendingProperties}
                renderItem={({ item, index }) =>{
                  // console.log("ITEM IN FLAT", item)
                  return <TouchableOpacity onPress={() => onTrendingPressed(index, item)}>
                  <Image style={[styles.imgItem, { width: imageDimension, height: imageDimension }]} source={{ uri: item.main_image_url }}>
                  </Image>
                </TouchableOpacity>
                }
              
                }
                keyExtractor={(item, index) => index}
              />
            </View>
            {/* {Object.entries(searchResults).map(([suburb, data]) => {
              return (
                <View style={styles.container} key={suburb}>
                  <View key={suburb}>
                    <View style={styles.heading}>
                      <Text style={styles.sectionTitle}>{suburb}</Text>

                      <TouchableOpacity onPress={() => onSuburbPressed(suburb, data)}>
                        <View style={styles.greyBox}>
                          <Text style={styles.btnText}>See all {data.length} properties</Text>
                        </View>
                      </TouchableOpacity>
                    </View>

                    <FlatList
                      data={data}
                      horizontal={true}
                      renderItem={({ item }) => (
                        <ResultTile key={item.id.toString()} property={item} handlePress={() => onPropertyPressed(item.id, item.title)} />
                      )}
                      keyExtractor={property => property.id.toString()}
                    />
                  </View>
                </View>
              );
            })} */}
          </ScrollView>
        </View>
      <View>
        <Modal visible={isModalOpen} animationType="slide" onRequestClose={() => setIsModalOpen(false)}>
          <SearchFilter onSearchPressed={onFiltersSet} />
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  autocompleteContainer: {
    // position: 'absolute',
    flex: 1,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  autoCompleteInput: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    borderWidth: 0,
    width: '100%'
  },
  autoCompleteItem: {
    backgroundColor: '#fff',
    borderBottomColor: 'rgba(0,0,0,0.1)',
    borderBottomWidth: 1,
    width: '100%',
    flex: 1,
  },
  autoCompleteList: {
    borderColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 3,
    width: '100%',
    flex: 1,
  },
  autoCompleteText: {
    fontFamily: 'font-regular',
    paddingHorizontal: 22,
    paddingVertical: 16,
  },
  autoCompleteTextInner: {
    color: 'rgba(0,0,0,0.7)',
    fontSize: 10,
    fontFamily: 'font-light',
  }, imgItem: {
    justifyContent: 'flex-end',
    margin: 1,
  },
  btnText: {
    fontFamily: 'font-light',
    fontSize: 12,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 20:0
    // flexDirection: 'row'
  },
  filterIcon: {
    width: 30,
    height: '100%',
    // justifyContent: 'center',
    // alignItems: 'center',
    position: 'absolute',
    top: Platform.OS === 'ios' ? 14 : 30,
    right: 12,
    zIndex: 1,
  },
  greyBox: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 4,
    paddingHorizontal: 11,
    paddingVertical: 10,
  },
  greyText: {
    color: '#ccc',
    fontFamily: 'font-regular',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  heading: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 16,
    paddingVertical: 16,
  },
  hero: {
    alignItems: 'center',
    height: 260,
    justifyContent: 'center',
  },
  heroText: {
    fontFamily: 'font-regular',
    fontSize: 22,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: -2, height: 2 },
    textShadowRadius: 4,
  },
  itemAlign: {
    alignItems: 'stretch',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    paddingHorizontal: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  resultsContainer: {
    paddingTop: Platform.OS === 'ios' ? 70 : 0,
  },
  searchBox: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 6,
    flexDirection: 'row',
    paddingHorizontal: 9,
    paddingVertical: 8,
  },
  searchBoxContainer: {
    backgroundColor: 'transparent',
    paddingVertical: 14,
    width: '100%',
    height: 'auto',
    flexDirection:'row',
    // position: 'absolute',
    zIndex: 4,
    justifyContent: 'center',
  },
  searchIcon: {
    position: 'absolute',
    zIndex: 2,
    top: Platform.OS === 'ios' ? 25 : 28,
    left: 16,
  },
  sectionTitle: {
    fontFamily: 'font-regular',
    fontSize: 15,
  },
  textInputAndroid: {
    color: 'rgba(0, 0, 0, 0.99)',
    fontFamily: 'font-light',
    fontSize: 15,
    paddingHorizontal: 28,
    paddingVertical: 10,
    marginHorizontal: 10,
    backgroundColor: '#fff',
    elevation: 3,
    zIndex: 1,
  },
  textInputIOS: {
    borderColor: 'transparent',
    borderWidth: 0.5,
    borderRadius: 6,
    color: 'rgba(0, 0, 0, 0.99)',
    fontFamily: 'font-light',
    fontSize: 14,
    paddingHorizontal: 26,
    paddingVertical: 12,
    marginHorizontal: 10,
    backgroundColor: '#f1f1f1',
    zIndex: 1,
  },
});