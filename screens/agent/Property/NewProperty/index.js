import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Header } from 'react-navigation-stack'
import axios from 'axios';
import SwitchSliderList from '../../../../components/helper/SwitchSliderList';

import Slider from '../../../../components/helper/Slider';
import {
  View,
  SafeAreaView,
  Text,
  Modal,
  Switch,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  StatusBar,
  KeyboardAvoidingView,
} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ActionSheet from 'react-native-action-sheet';
import Autocomplete from 'react-native-autocomplete-input';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import GradientButton from '../../../../components/Button';
import { TitleTextField, TextArea } from '../../../../components/TextField';
import { handleNewProperty, handleHashtags,handleNewPropertyCampaign, clearNewProperty } from '../../../../actions/property';
import useSearchLocation from '../../../../hooks/useSearchLocation';
import { FlatList } from 'react-native';
import Details from '../../AgentHome/Details';

export default function NewProperty({ navigation }) {
  const { register, handleSubmit, errors, setValue, triggerValidation } = useForm({
    mode: 'onChange',
  });

  const [state, setState] = useState({
    title: '',
    property_type: '',
    area: null,
    has_space: false,
    has_open_area: false,
    property_site_url: null,
    state: null,
    street: null,
    country: null,
    postcode: null,
    suburb: null,
    hashtags: null,
    lat: null,
    lng: null,
    num_bedrooms: [1],
    num_bathrooms: [1],
    num_garages: [1],
    
  });

  const [state2, setState2] = useState({
    price: [200000, 10000000],
    isSwitchOn: true,
  })
  const [suburb, setsuburb] = useState(null);
  const [usstate, setMainState] = useState(null)
  const [street, setStreet] = useState(null)
  const [country, setCountry] = useState(null)
  const [postcode, setPostcode] = useState(null)
  // const [state, setState] = React.useState({
  //   num_bedrooms: [1],
  //   num_bathrooms: [1],
  //   num_garages: [1],
  // });
  // const [searchValue, setSearchValue] = useState(null);
  // const [hideResults, setHideResults] = useState(false);
  // const [enterManually, setenterManually] = useState(false)
  // const [searchResults, setSearchResults] = useState([])
  const { query, setQuery, search } = useSearchLocation();
  const dispatch = useDispatch();
  const { newPropertyDetails } = useSelector(store => store.property);
  const ActionSheetButtonsAndroid = ['House', 'Villa', 'Townhouse', 'Apartment', 'Studio'];
  const ActionSheetButtonsiOS = [...ActionSheetButtonsAndroid, 'Cancel'];

  const created = useSelector(store => store.property.newPropertyCreated);
  const updated = useSelector(store => store.property.propertyUpdated);
  const {currentPropertyId, currentProperty} = useSelector(store => store.property)
  const { newPropertyCampaign } = useSelector(store => store.property);

  useEffect(() => {
      register({ name: 'property_type' }, { required: true });
      register({name: 'title'}, {required: true});
      // register({name:'address'},{required: true});
      register({name:'area'},{required: true});
  }, [register]);

  const handleChange = (value, key) => {
    // console.log("Chnage Request",key, value)
    setState({ ...state, [key]: value });
    setValue(key, value);
    triggerValidation();
  };

  const handleChange2 = (value, key) => {
    setState2({ ...state2, [key]: value });
  };



  const setHashtags = value => {
    if (value) {
      dispatch(handleHashtags(value));
    } else {
      dispatch(handleHashtags(null));
    }

    handleChange(value, 'hashtags');
  };

  const handleBtnPress = async () => {
    triggerValidation();
    Keyboard.dismiss();

    const { property_type, area,num_bathrooms, num_bedrooms, num_garages  } = state;
    const {isSwitchOn, price} = state2
    const isEditing = navigation.getParam('editing', false);

    // const {  } = state;

    // if (num_bathrooms && num_bedrooms && num_garages) {
      // const data = {
      //   num_bathrooms: num_bathrooms[0],
      //   num_bedrooms: num_bedrooms[0],
      //   num_garages: num_garages[0],
      // };
      var PRIVATE_SALE = 'PrivateSale'
    if (property_type && suburb && state.title) {
      
      const data = {
        ...state,
        area: parseInt(area, 10),
        state: state, country: country, state: usstate,postcode: postcode,street: street, suburb: suburb,num_bathrooms: num_bathrooms[0],
        num_bedrooms: num_bedrooms[0],
        num_garages: num_garages[0],
         campaign_type: "PRIVATE_SALE"
      };
      const data2 = {
        list_price: isSwitchOn,
      min_price: price[0],
      max_price: price[1],
      }
      if (state.lat) {
        data.lat = parseFloat(state.lat);
      }

      if (state.lng) {
        data.lng = parseFloat(state.lng);
      }

      delete data.hashtags;

     await dispatch(handleNewProperty(data));
      dispatch(handleNewPropertyCampaign(data2));
      // navigation.navigate('NewProperty_Screen3', { editing: isEditing });
      // navigation.navigate('PrivateSale')
    } else {
      Alert.alert('Please enter all required fields');
    }
  };

  // const onHasSpaceChanged = value => {
  //   setState({
  //     ...state,
  //     has_space: value,
  //   });
  // };

  // const onHasOpenAreaChanged = value => {
  //   setState({
  //     ...state,
  //     has_open_area: value,
  //   });
  // };

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
      if(currentPropertyId){
        console.log("New Property", currentProperty)
        navigation.navigate('PropertyAddress', { propertyId: currentPropertyId, title: currentProperty.title });
 
      }
          }

    // if (updated) {
    //   navigation.pop(3);
    // }
  }, [navigation, created, updated, newPropertyCampaign]);


  const showPropertyTypes = () => {
    ActionSheet.showActionSheetWithOptions(
      {
        title: 'Select property type',
        options: Platform.OS === 'android' ? ActionSheetButtonsAndroid : ActionSheetButtonsiOS,
        cancelButtonIndex: 5,
      },
      buttonIndex => {
        if (buttonIndex < 5) {
          setState({
            ...state,
            property_type: ActionSheetButtonsAndroid[buttonIndex].toLowerCase(),
          });
          setValue('property_type', ActionSheetButtonsAndroid[buttonIndex].toLowerCase());
          triggerValidation();
        }
      },
    );
  };

  // const onLocationSelect = item => {
  //   setState({
  //     ...state,
  //     suburb: item.name,
  //     state: item.admin_name1,
  //     postcode: item.postcode,
  //     country: item.country_code,
  //   });
  //   setValue('suburb', item.name);
  //   triggerValidation();
  // };

  // const onSearchChanged = text => {
  //   setQuery(text);
  //   setSearchValue(text);
  //   setHideResults(false);
  // };

  // const onSelect = item => {
  //   onLocationSelect(item);
  //   setSearchValue(`${item.name}, ${item.admin_name1}`);
  //   setHideResults(true);
  //   Keyboard.dismiss();
  // };

  useEffect(() => {
    if (navigation.getParam('editing', false)) {
      setState({
        ...newPropertyDetails,
      });

      if (newPropertyDetails) {
        setValue('title', newPropertyDetails.title);
        setValue('street', newPropertyDetails.street);
        setValue('area', newPropertyDetails.area);
        setValue('suburb', newPropertyDetails.suburb);
        setValue('property_type', newPropertyDetails.property_type);

        if (newPropertyDetails.suburb) {
          setQuery(`${newPropertyDetails.suburb}, ${newPropertyDetails.state}`);
        }
      }
    }
  }, [navigation, newPropertyDetails, setQuery, setValue]);

  return (
    <View style={styles.container}>
      <StatusBar translucent={true} backgroundColor={'rgba(0, 0, 0, 0.1)'} barStyle="dark-content" />

      {/* <ScrollView bounces={true}>

      <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior="height" enabled={true} keyboardVerticalOffset={100}> */}
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" bounces={true} showsVerticalScrollIndicator={false}>
        <View>
          <TitleTextField
            title="Property Name"
            name="title"
            placeholder="Ex - Villa for Life"
            value={state.title}
            handleChange={text => handleChange(text, 'title')}
            errors={errors}
          />
        </View>
        

        {/* {enterManually ? <View><View style={styles.formGroup}>
          <TitleTextField
            title="Street Address"
            name="street"
            placeholder="Type in street address"
            value={street}
            handleChange={text => setStreet(text)}
            errors={errors}
          />
        </View>
          <View style={styles.formGroup}>
            <TitleTextField
              title="Suburb"
              name="suburb"
              placeholder="Type in street address"
              value={suburb}
              handleChange={text => setsuburb(text)}
              errors={errors}
            />
          </View>
          <View style={styles.formGroup}>
            <TitleTextField
              title="Postcode"
              name="postcode"
              keyboardType="numeric"
              placeholder="Type in Postcode address"
              value={postcode}
              handleChange={text => setPostcode(text)}
              errors={errors}
            />
          </View>
          <View style={styles.formGroup}>
            <TitleTextField
              title="State"
              name="state"
              placeholder="Type in State address"
              value={usstate}
              handleChange={text => setMainState(text)}
              errors={errors}
            />
          </View>
          <View style={styles.formGroup}>
            <TitleTextField
              title="Country"
              name="country"
              placeholder="Type in Postcode address"
              value={country}
              handleChange={text => setCountry(text)}
              errors={errors}
            />
          </View>
          </View> :  */}
          <View style={styles.formGroup}>
            
            <View style={styles.autocompleteContainer2}>
            <Text style={errors && errors.address ? styles.textError : styles.greyText}>Address</Text>
              <GooglePlacesAutocomplete
                placeholder='Enter the address'
                fetchDetails={true}
                autoFocus={false}
                styles={{textInput: {
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
                  var address = data.description.split(',')
                  console.log("Selected Address",address[0]);
                  setStreet(address[0])
                //  await handleChange(address[0],'street')
                  var Postcode, State, Country,suburb
                  for(var i = 0; i < details.address_components.length; i++){
                    if(details.address_components[i].types.includes('postal_code')){
                      console.log("Success", details.address_components[i])
                       Postcode = details.address_components[i].long_name
                       setPostcode(Postcode)
                      //  setState({ ...state, 'postcode': Postcode });
                    // await   handleChange(Postcode,'postcode')
                      console.log("Postcode is", Postcode)
                    }
                    if(details.address_components[i].types.includes('administrative_area_level_1')){
                      console.log("Success", details.address_components[i])
                       State = details.address_components[i].short_name
                       setMainState(State)
                  //  await    handleChange(State,'state')
                      console.log("State is", State)
                    }
                    if(details.address_components[i].types.includes('administrative_area_level_2') ){
                      console.log("Success", details.address_components[i])
                       suburb = details.address_components[i].short_name
                    // await   handleChange(suburb,'suburb')
                    setsuburb(suburb)
                      console.log("State is", suburb)
                    }
                    if(details.address_components[i].types.includes('country')){
                      console.log("Success", details.address_components[i])
                       Country = details.address_components[i].short_name
                       setCountry(Country)
                    // await   handleChange(Country,'country')
                      console.log("Suburb is", Country)
                    }
                }}}
                getDefaultValue={() => ''}
                listViewDisplayed='true'
                keyboardShouldPersistTaps="handled"
                // GooglePlacesDetailsQuery={{ fields: 'formatted_address' }}
                debounce={300}
                query={{
                  key:'AIzaSyCyWctabwPuw3UNXU7cSQ0ZmNLNrbyXDsU',
                  language: 'en',
                  type:'address'
                }}
              />
              </View>
              </View>

                {/* <TitleTextField
                title="Enter Address"
                name="Address"
                placeholder="Enter the address"
                value={searchValue}
                handleChange={text => searchAddress(text)}
                errors={errors}
              />
              {isShowingResults && <FlatList data={searchResults} renderItem={({ item, index }) => {
                return (<TouchableOpacity style={{
                  width: '100%',
    justifyContent: 'center',
    height: 40,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingLeft: 15,
                }}
                  onPress={() => setisShowingResults(false)}>
                  <Text>{item.description}</Text>
                </TouchableOpacity>)
              }}
                keyExtractor={(item) => item.id}
                style={{ width: 340, height: 200, backgroundColor: '#fff', position: 'absolute', top: 50 }}
            />}*/}
{/* <TouchableOpacity onPress={() => setenterManually(true)}><Text style={{ flexDirection: 'row-reverse', color: 'blue' }}>Enter Manually?</Text></TouchableOpacity> 
            </View>
            
            </View>
        } */}
        {/* <View style={styles.formGroup}>
            <Text style={errors && errors.suburb ? styles.textError : styles.greyText}>
              Suburb
              <Text>{errors && errors.suburb && errors.suburb.type === 'required' && <Text> (Required)</Text>}</Text>
            </Text>

            <TouchableWithoutFeedback onPress={() => setIsModalOpen(true)}>
              <View style={errors && errors.suburb ? styles.textInputError : styles.textInput}>
                {state.suburb !== null ? (
                  <Text style={styles.textInputText}>
                    {state.suburb}, {state.state}
                  </Text>
                ):( <Text style={styles.textInputText}>Look up suburb</Text>)}

                
              </View>
            </TouchableWithoutFeedback>
          </View> */}

        <View style={styles.formGroup}>
          <Text style={errors && errors.property_type ? styles.textError : styles.greyText}>Property Type</Text>

          <TouchableWithoutFeedback onPress={() => showPropertyTypes()}>
            <View style={errors && errors.property_type ? styles.textInputError : styles.textInput}>
              <Text style={styles.textInputText}>{state.property_type || 'Select'}</Text>

              <Icon name="chevron-down" size={24} color="#ddd" style={styles.icon} />
            </View>
          </TouchableWithoutFeedback>
        </View>

        <View style={styles.formGroup}>
          <TitleTextField
            title="Area(m2)"
            name="area"
            keyboardType="numeric"
            returnKeyType="done"
            placeholder="Type in area"
            value={state.area}
            handleChange={text => handleChange(text, 'area')}
            errors={errors}
          />
        </View>

        {/* <View style={styles.formGroup}>
          <Text style={styles.greyText}>Has Space</Text>

          {!state.has_space && <Text style={[styles.textInputText, styles.switchText]}>No</Text>}
          {state.has_space && <Text style={[styles.textInputText, styles.switchText]}>Yes</Text>}

          <Switch ios_backgroundColor="#ddd" trackColor="#d81b60" value={state.has_space} onValueChange={onHasSpaceChanged} style={styles.switch} />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.greyText}>Has Open Area</Text>

          {!state.has_open_area && <Text style={[styles.textInputText, styles.switchText]}>No</Text>}
          {state.has_open_area && <Text style={[styles.textInputText, styles.switchText]}>Yes</Text>}

          <Switch ios_backgroundColor="#ddd" trackColor="#d81b60" value={state.has_open_area} onValueChange={onHasOpenAreaChanged} style={styles.switch} />
        </View> */}

        <View style={styles.formGroup}>
          <TitleTextField
            title="More information"
            placeholder="Link to property website"
            returnKeyType="done"
            optional={true}
            value={state.property_site_url}
            handleChange={text => handleChange(text, 'property_site_url')}
          />
        </View>

        <View style={[styles.formGroup, styles.formGroupLast]}>
          <TextArea
            title="#Hashtags"
            labelType="text"
            value={state.hashtags}
            placeholder="Separated by a space, e.g. #mansion #sydney"
            maxLength={80}
            handleChange={text => setHashtags(text)}
          />
        </View>
        
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

        {/* <View style={styles.buttonWrapper}>
          <GradientButton onPress={handleBtnPress}>CONTINUE</GradientButton>
        </View> */}
      </View>
      

      
      <View style={styles.sliderWrapper}>
        <SwitchSliderList
          text="Show Price?"
          switchState={state2.isSwitchOn}
          step={50000}
          min={200000}
          max={10000000}
          sliderValues={state2.price}
          handleSwitchChange={value => handleChange2(value, 'isSwitchOn')}
          handleSliderChange={values => handleChange2(values, 'price')}
        />
      </View>

      

      <View style={[styles.justifyEnd, styles.btnContainer]}>
          <GradientButton onPress={handleSubmit(handleBtnPress)}>DONE</GradientButton>
        </View>
      </KeyboardAwareScrollView>
      {/* </KeyboardAvoidingView>
          
        </ScrollView> */}




      {/* <View>
        <Modal visible={isModalOpen} animationType="slide" onRequestClose={() => setIsModalOpen(false)}>
          <View style={styles.container}>
            <SafeAreaView style={styles.container}>
              <View style={styles.container}>
                <View style={[styles.formGroup, styles.autocomplete]}>
                  <Text style={styles.label}>Suburb</Text>

                  <Autocomplete
                    autoCorrect={false}
                    data={search.result}
                    value={searchValue}
                    defaultValue={query}
                    hideResults={hideResults}
                    onBlur={() => setHideResults(true)}
                    placeholder="Search suburbs"
                    keyExtractor={item => `${item.name}-${item.postcode}`}
                    onChangeText={text => onSearchChanged(text)}
                    renderItem={({ item }) => (
                      <TouchableOpacity style={styles.itemAlign} onPress={() => onSelect(item)}>
                        <View style={styles.autoCompleteItem}>
                          <Text style={styles.autoCompleteText}>
                            {item.name}
                            {'  '}
                            <Text style={styles.autoCompleteTextInner}>
                              {item.admin_name1}, {item.country_code}
                            </Text>
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                    containerStyle={styles.autocompleteContainer}
                    inputContainerStyle={styles.autoCompleteInput}
                    listContainerStyle={styles.autoCompleteList}
                    style={styles.textInput}
                    returnKeyType="done"
                  />
                </View>

                <View style={styles.formGroupContainer}>
                  <View style={styles.formGroup}>
                    <TitleTextField
                      title="Street View"
                      placeholder="Latitude, e.g. -33.860177"
                      optional={true}
                      keyboardType="numeric"
                      returnKeyType="done"
                      value={state.lat}
                      handleChange={text => handleChange(text, 'lat')}
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <TitleTextField
                      placeholder="Longitude, e.g. 151.087530"
                      keyboardType="numeric"
                      value={state.lng}
                      returnKeyType="done"
                      handleChange={text => handleChange(text, 'lng')}
                    />
                  </View>
                </View>
              </View>

              <View style={[styles.justifyEnd, styles.btnContainer, styles.btnBottom]}>
                <GradientButton onPress={() => setIsModalOpen(false)}>CLOSE</GradientButton>
              </View>
            </SafeAreaView>
          </View>
        </Modal>
      </View> */}
      
    </View>
  );
}

NewProperty.navigationOptions = ({ navigation }) => {
  const isEditing = navigation.getParam('editing', false);

  return {
    title: isEditing ? 'Update Property' : 'Set Up New Property',
  };
};

const styles = StyleSheet.create({
  autocomplete: {
    zIndex: 20,
  },autocompleteContainer2: {
    zIndex: 1,
  },
  autocompleteContainer: {
    position: 'absolute',
    flex: 1,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    zIndex: 1,
  },
  autoCompleteInput: {
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderWidth: 0.5,
    paddingTop: 9,
    paddingHorizontal: 0,
    borderColor: 'transparent',
  },
  autoCompleteItem: {
    backgroundColor: '#fff',
    borderBottomColor: 'rgba(0,0,0,0.1)',
    borderBottomWidth: 1,
    width: '100%',
    flex: 1,
  },
  autoCompleteList: {
    borderColor: 'rgba(0,0,0,0.3)',
    width: '100%',
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
  },
  btnBottom: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 20,
    zIndex: 1,
  },
  btnContainer: {
    padding: 20,
  },
  button: {
    backgroundColor: '#b8c',
    borderRadius: 4,
    marginLeft: 10,
    marginRight: 10,
    padding: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20
  },
  formGroup: {
    marginTop: 25,
  },
  formGroupContainer: {
    position: 'absolute',
    width: '100%',
    top: 80,
    paddingHorizontal: 20,
    zIndex: 1,
  },
  formGroupLast: {
    marginBottom: 40,
  },
  greyText: {
    color: 'rgba(0,0,0,0.5)',
    fontFamily: 'font-regular',
    fontSize: 13,
    marginBottom: 4,
  },
  icon: {
    position: 'absolute',
    right: 10,
    top: '50%',
  },
  itemAlign: {
    alignItems: 'stretch',
  },
  justifyEnd: {
    justifyContent: 'flex-end',
  },
  keyboardAvoidingView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  label: {
    color: 'rgba(0,0,0,0.5)',
    fontFamily: 'font-regular',
    fontSize: 13,
    paddingHorizontal: 20,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingVertical: 25,
  },
  switch: {
    position: 'absolute',
    right: 0,
    top: '50%',
  },
  switchText: {
    paddingTop: 10,
  },
  textInput: {
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderColor: 'transparent',
    borderWidth: 0.5,
    color: 'rgba(0,0,0,0.99)',
    fontFamily: 'font-light',
    fontSize: 15,
    paddingHorizontal: 0,
    paddingVertical: 10,
  },
  textInputText: {
    color: 'rgba(0,0,0,0.99)',
    fontFamily: 'font-light',
    fontSize: 15,
    textTransform: 'capitalize',
  },
  textInputError: {
    borderBottomColor: 'rgba(255, 0, 0, 1)',
    borderColor: 'transparent',
    borderWidth: 0.5,
    color: 'rgba(0,0,0,0.99)',
    fontFamily: 'font-light',
    fontSize: 15,
    paddingHorizontal: 0,
    paddingVertical: 10,
    zIndex: 1,
  },
  textError: {
    color: 'rgba(255,0,0,0.9)',
    fontFamily: 'font-regular',
    fontSize: 13,
    marginBottom: 4,
  },
  // SCreen 2 data
  buttonWrapper : {
    flex: 1,
    justifyContent: 'flex-end',
  },
  containerView: {
    
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
