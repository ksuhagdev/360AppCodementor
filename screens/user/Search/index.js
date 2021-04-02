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
import request from '../../../helper/functions/request';

// import useSearchLocation from '../../../hooks/useSearchLocation';
import { searchProperties, updateSearchFilters, getTrendingProperties } from '../../../actions/property';

const filterIcon = require('../../../assets/image/filter.png');
const placeholderImage = require('../../../assets/image/property-placeholder.png');

export default function Search({ navigation }) {
  const [currentHero, setCurrentHero] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const { width } = Dimensions.get('window');
  const imageDimension = width / 3 - 2;
  const [searchItem, setSearchItem] = useState(null)
  const [interval, updateInterval] = useState(null);
  const [hideResults, setHideResults] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  var { isSearchLoading, searchResults, searchFilters, trendingProperties } = useSelector(state => state.property);
  const [isHashtag, setisHashtags] = useState(false);
  const [trendLoading, settrendLoading] = useState(false)
  // const { query, setQuery, search } = useSearchLocation();
  const [searchResult, setSearchResult] = useState([])
  const [query, setQuery] = useState(null)
  const [mainImage, setmainImage] = useState(null)
  const onLocationSelect = async item => {
    // console.log('So the detasil', item.address_components)
    if(!isHashtag){
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
        hashtag: false,
        hastag: null
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
  }else{
    console.log("Hashtag Name", item)
    await dispatch(
      updateSearchFilters({
        ...searchFilters,
        hashtag: true,
        hastag: item
      }),
    );
    try{
      await dispatch(searchProperties());
      // const { searchResults} = useSelector(state => state.property);
      console.log("Search Results", searchResults)
      // if(searchResults){
        
          navigation.navigate('SuburbSelection', {
            item,
            properties: searchResults,
            filters: searchFilters,
          });
        
    }catch(err){
      console.log("Error from Search", err.message)
      Alert.alert(err.message)
    }
  }
      
   
    // }
  };

  const onTrendingPressed = (index, item) => {
    // console.log("Going Into Hero")
    
    navigation.navigate('VideoPlayScreen', { data: trendingProperties, CurrentIndex: index, item: item });
  };

  const onPropertyPressed = (propertyId, title) => {
    navigation.navigate('PropertyAddressNew', { propertyId, title });
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

    // if (searchFilters.suburb) {
    //   // Perform a new search
    //   if (interval) {
    //     clearInterval(interval);
    //     updateInterval(null);
    //   }

    //   dispatch(searchProperties());
    // }
      onSelect(searchItem)
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
  //   if(searchValue)
  
    if(searchValue.length > 0){
      if(searchValue.charAt(0) !=='#'){
        setisHashtags(false)
        fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${searchValue}&types=(regions)&key=AIzaSyCyWctabwPuw3UNXU7cSQ0ZmNLNrbyXDsU`).then(result => result.json()).then(final => {
          setSearchResult(final.predictions)
          console.log("Final", final)
        })
      }else{
        setisHashtags(true)
        console.log("Search Value hastagfss", searchValue)
        fetch(`http://13.211.132.117:3600/hashtags?tag=%23${searchValue.substring(1)}`).then(result => result.json()).then(result => {
          setSearchResult(result) 
        console.log("result from server is ::::", result)})
      }
    }else{
      setSearchResult([])
    }
  }, [searchValue])
  const onSelect = item => {
    // onLocationSelect(item);
    console.log("Item in onSelect", item)
    setSearchValue(isHashtag ? item : item.description)
    // setSearchValue(`${item.name}, ${item.admin_name1}`);
    // setHideResults(true);
    if(!isHashtag){
      fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${item.place_id}&fields=address_component&key=AIzaSyCyWctabwPuw3UNXU7cSQ0ZmNLNrbyXDsU`).then(result => result.json()).then(final => {
        console.log("Final Result", final.result.address_components)
        onLocationSelect(final.result)
      })
    }else{
      onLocationSelect(item)
    }
    
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
        <Autocomplete
          autoCorrect={false}
          data={searchResult}
          value={searchValue}
          hideResults={hideResults}
          onBlur={() => setHideResults(true)}
          placeholder="Search by Hastags # or Suburbs"
          keyExtractor={item => `${item.name}-${item.postcode} `}
          onChangeText={text => handleChange(text)}
          renderItem={({ item }) => (

            <TouchableOpacity style={styles.itemAlign} onPress={async () => {
              console.log("ITEM name for Search", item.name)
             await setSearchItem(isHashtag ? item.name : item)
              console.log("Search Item checking", searchItem)
              setIsModalOpen(isHashtag ? false : true)
      isHashtag ? onSelect(item.name) : null

            }}>
              <View style={styles.autoCompleteItem}>
                <Text style={styles.autoCompleteText}>
                  {!isHashtag ? item.description : item.name}
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
        <View style={[styles.container, styles.resultsContainer]}>
          <ScrollView>
            {currentHero !== null && (
              <TouchableOpacity onPress={() => onPropertyPressed(currentHero.id, currentHero.title)}>
                <ImageBackground source={currentHero.image} style={styles.hero}>
                  <View style={styles.overlay} />

                  <Text style={styles.heroText}>Watch   </Text>
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
                  return <TouchableOpacity onPress={() => onPropertyPressed(item.id, item.title)}>
                  <ImageBackground style={[styles.imgItem, { width: imageDimension, height: imageDimension }]} source={{ uri: item.main_image_url }}>
                  <Text style={styles.textOverlay}>{item.suburb}</Text>
                  </ImageBackground>
                </TouchableOpacity>
                }
              
                }
                keyExtractor={(item, index) => index}
              />
            </View>
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
    paddingTop: 0
    // flexDirection: 'row'
  },
  filterIcon: {
    width: 30,
    height: '100%',
    // justifyContent: 'center',
    // alignItems: 'center',
    position: 'absolute',
    top: Platform.OS === 'ios' ? 21 : 22,
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
    paddingTop: 0,
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
    paddingVertical: 5,
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
    top: 18,
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
  },textOverlay: {
    fontFamily: 'font-bold',
    fontSize: 12,
    padding: 6,
    zIndex: 2,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
});