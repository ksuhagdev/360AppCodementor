import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  View,
  KeyboardAvoidingView,
  Text,
  SafeAreaView,
  Modal,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  StatusBar,
  Keyboard,
  Alert,
  StyleSheet,
} from 'react-native';
import { useForm } from 'react-hook-form';
import AsyncStorage from '@react-native-community/async-storage';
import Autocomplete from 'react-native-autocomplete-input';
import PhoneInput from 'react-native-phone-input';
import GradientButton from '../../../components/Button';
import { TitleTextField } from '../../../components/TextField';
import { updateProfile } from '../../../actions/account-actions';
import useSearchLocation from '../../../hooks/useSearchLocation';

export default function EditProfileInfo({ navigation }) {
  const [state, setState] = React.useState({
    id: null,
    first_name: null,
    last_name: null,
    email: null,
    phone: null,
    suburb: null,
    state: null,
    postcode: null,
    country: null,
  });
  const [phoneRef, setPhoneRef] = React.useState(null);
  const [hasLoaded, setHasLoaded] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState(null);
  const [hideResults, setHideResults] = React.useState(false);
  const dispatch = useDispatch();
  const { register, handleSubmit, setValue, errors, triggerValidation } = useForm({
    mode: 'onChange',
  });
  const { query, setQuery, search } = useSearchLocation();
  const { isProfileUpdating } = useSelector(store => store.account);

  const saveProfile = async () => {
    const userData = { ...state };

    Keyboard.dismiss();
    triggerValidation();

    if (state.phone && phoneRef.getValue()) {
      if (phoneRef.isValidNumber()) {
        userData.phone_country_code = `+${phoneRef.getCountryCode()}`;
      } else {
        return Alert.alert('Invalid phone number', 'Please enter a valid phone number before saving your personal information.');
      }
    }

    dispatch(updateProfile(userData));
  };

  const onLocationSelect = item => {
    setState({
      ...state,
      suburb: item.name,
      state: item.admin_name1,
      postcode: item.postcode,
      country: item.country_code,
    });
  };

  const updateField = (value, key) => {
    setState({
      ...state,
      [key]: value,
    });
    setValue(key, value);
    triggerValidation();
  };

  const onSearchChanged = text => {
    setQuery(text);
    setSearchValue(text);
    setHideResults(false);
  };

  const onSelect = item => {
    onLocationSelect(item);
    setSearchValue(`${item.name}, ${item.admin_name1}`);
    setHideResults(true);
    Keyboard.dismiss();
  };

  useEffect(() => {
    (async () => {
      const user = await AsyncStorage.getItem('user');
      const userData = JSON.parse(user);

      setState({
        id: userData.id,
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        phone: userData.phone,
        suburb: userData.suburb,
        state: userData.state,
        postcode: userData.postcode,
        country: userData.country || 'au',
      });

      register({ name: 'first_name' }, { required: true });
      register({ name: 'last_name' }, { required: true });
      setValue('first_name', userData.first_name);
      setValue('last_name', userData.last_name);

      if (userData.suburb && userData.state) {
        setQuery(`${userData.suburb}, ${userData.state}`);
      }

      if (userData.country && phoneRef) {
        phoneRef.selectCountry(userData.country.toLowerCase());
      }

      setHasLoaded(true);
    })();
  }, [phoneRef, setQuery, register, setValue]);

  if (!hasLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar translucent={true} backgroundColor={'rgba(0, 0, 0, 0.1)'} barStyle="dark-content" />

        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#d81b60" />
        </SafeAreaView>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent={true} backgroundColor={'rgba(0, 0, 0, 0.1)'} barStyle="dark-content" />

      <KeyboardAvoidingView style={styles.containerView} behavior="padding" enabled={true} keyboardVerticalOffset={100}>
        <ScrollView style={styles.scrollView}>
          <Text style={styles.header}>Personal information</Text>

          <View style={styles.formGroup}>
            <TitleTextField
              title="First Name"
              name="first_name"
              placeholder="e.g. Alanah"
              value={state.first_name}
              returnKeyType="done"
              errors={errors}
              handleChange={value => updateField(value, 'first_name')}
            />
          </View>

          <View style={styles.formGroup}>
            <TitleTextField
              title="Last Name"
              name="last_name"
              placeholder="e.g. Pearce"
              value={state.last_name}
              returnKeyType="done"
              errors={errors}
              handleChange={value => updateField(value, 'last_name')}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.text}>
              Phone <Text style={styles.italicText}>(optional)</Text>
            </Text>

            <PhoneInput
              ref={ref => setPhoneRef(ref)}
              style={styles.textInput}
              initialCountry="au"
              value={state.phone}
              textProps={{ placeholder: 'e.g. 0412345678', returnKeyType: 'done' }}
              textStyle={styles.textField}
              autoFormat={true}
              onChangePhoneNumber={number => updateField(number, 'phone')}
            />
          </View>

          {/* <Text style={[styles.header, styles.marginVert]}>Suburb</Text> */}

          {/* <View style={styles.formGroup}>
            <TouchableWithoutFeedback onPress={() => setIsModalOpen(true)}>
              <View style={styles.textInput}>
                {state.suburb !== null && (
                  <Text style={styles.textInputText}>
                    {state.suburb}, {state.state}
                  </Text>
                )}

                {state.suburb === null && <Text style={styles.textInputText}>Look up suburb</Text>}
              </View>
            </TouchableWithoutFeedback>
          </View> */}
        </ScrollView>

        <View style={styles.btnContainer}>
          <GradientButton onPress={handleSubmit(saveProfile)} disabled={isProfileUpdating} isActive={isProfileUpdating}>
            SAVE
          </GradientButton>
        </View>
      </KeyboardAvoidingView>

      <View>
        <Modal visible={isModalOpen} animationType="slide" onRequestClose={() => setIsModalOpen(false)}>
          <View style={styles.container}>
            <SafeAreaView style={styles.container}>
              <View style={styles.container}>
                <View style={styles.formGroup}>
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
                  />
                </View>
              </View>

              <View style={[styles.justifyEnd, styles.btnContainer, styles.btnBottom]}>
                <GradientButton onPress={() => setIsModalOpen(false)}>CLOSE</GradientButton>
              </View>
            </SafeAreaView>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

EditProfileInfo.navigationOptions = {
  title: 'Edit Personal Information',
};

const styles = StyleSheet.create({
  autocomplete: {
    zIndex: 20,
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
  btnContainer: {
    padding: 20,
  },
  container: {
    flex: 1,
  },
  containerView: {
    flex: 1,
    justifyContent: 'space-between',
  },
  formGroup: {
    marginVertical: 12,
  },
  header: {
    color: 'rgba(0,0,0,0.4)',
    fontSize: 11,
    fontFamily: 'font-light',
    textTransform: 'uppercase',
  },
  italicText: {
    fontStyle: 'italic',
  },
  itemAlign: {
    alignItems: 'stretch',
  },
  label: {
    color: 'rgba(0,0,0,0.5)',
    fontFamily: 'font-regular',
    fontSize: 13,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  marginVert: {
    marginVertical: 12,
  },
  scrollView: {
    padding: 20,
  },
  text: {
    color: 'rgba(0,0,0,0.5)',
    fontFamily: 'font-regular',
    fontSize: 13,
  },
  textField: {
    color: 'rgba(0,0,0,0.99)',
    fontFamily: 'font-light',
    fontSize: 15,
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
});
