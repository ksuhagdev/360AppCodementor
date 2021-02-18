import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  PermissionsAndroid,
  Text,
  TextInput,
  Alert,
  Linking,
  Platform,
  AppState,
  StatusBar,
  StyleSheet,
} from 'react-native';
import Contacts from 'react-native-contacts';
import ActionSheet from 'react-native-action-sheet';
import AlertMessage from '../../../components/AlertMessage';
import GradientButton from '../../../components/Button';
import { inviteUser } from '../../../actions/account-actions';

const defaultImage = require('../../../assets/image/default-profile-pic.png');

export default function OpenContacts({ navigation }) {
  const [contacts, setContacts] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [neverAskAgain, setNeverAskAgain] = useState(false);
  const dispatch = useDispatch();

  const getContacts = () => {
    console.log('Getting contacts...');
    setIsLoading(true);

    Contacts.getAll((error, data) => {
      if (error) {
        Alert.alert('', error, [{ text: 'Dismiss' }]);
      } else {
        const contactsWithEmail = data.filter(contact => {
          return contact.emailAddresses && contact.emailAddresses.length > 0;
        });

        console.log('Contacts with an email address: ', contactsWithEmail);

        setIsLoading(false);
        setContacts(contactsWithEmail);
      }
    });
  };

  const requestContactsPermission = async () => {
    if (Platform.OS === 'ios') {
      Contacts.requestPermission((error, permission) => {
        if (error) {
          Alert.alert('', error, [{ text: 'Dismiss' }]);
        }

        if (permission === Contacts.PERMISSION_AUTHORIZED) {
          getContacts();
        }

        if (permission === Contacts.PERMISSION_DENIED) {
          setHasPermission(false);
        }
      });
    } else {
      const permission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: 'Contacts',
        message: 'Allow 360 to access your contacts to send them invites to join you on the 360 platform',
        buttonPositive: 'Allow',
      });

      if (permission === PermissionsAndroid.RESULTS.GRANTED) {
        setHasPermission(true);
        getContacts();
      } else if (permission === PermissionsAndroid.RESULTS.DENIED) {
        setHasPermission(false);
      } else {
        // NEVER_ASK_AGAIN
        setNeverAskAgain(true);
      }
    }
  };

  const handleAppState = appState => {
    if (appState === 'active') {
      if (!hasPermission) {
        requestContactsPermission();

        AppState.removeEventListener('change', handleAppState);
      }
    }
  };

  const openSettings = () => {
    // initialize again once the user returns from the permissions UI
    AppState.addEventListener('change', handleAppState);
    Linking.openSettings();
  };

  const onContactPressed = emailAddresses => {
    if (emailAddresses && emailAddresses.length) {
      const payload = {
        user_type: navigation.getParam('userType', 'AGENT'),
        property_id: navigation.getParam('propertyId', null),
        agency_id: navigation.getParam('agencyId', null),
      };

      if (navigation.getParam('userSubType', null)) {
        payload.user_sub_type = navigation.getParam('userSubType');
      }

      if (emailAddresses.length > 1) {
        const options = emailAddresses.map(email => {
          return email.email;
        });

        options.push('Cancel');

        ActionSheet.showActionSheetWithOptions(
          {
            options,
            title: 'Select an email',
            cancelButtonIndex: options.length - 1,
          },
          buttonIndex => {
            if (buttonIndex !== options.length - 1) {
              payload.email = options[buttonIndex];

              dispatch(inviteUser(payload));
            }
          },
        );
      } else {
        payload.email = emailAddresses[0].email;

        dispatch(inviteUser(payload));
      }
    }
  };

  const onSearch = text => {
    if (text && text.length > 2) {
      setSearchResults(
        contacts.filter(contact => {
          const givenName = contact.givenName || '';
          const familyName = contact.familyName || '';
          const emails = contact.emailAddresses || [];

          return givenName.indexOf(text) > -1 || familyName.indexOf(text) > -1 || emails.find(email => email.email.indexOf(text) > -1);
        }),
      );
    } else {
      setSearchResults([]);
    }
  };

  useEffect(() => {
    if (Platform.OS === 'ios') {
      Contacts.checkPermission((error, permission) => {
        if (error) {
          Alert.alert('', error, [{ text: 'Dismiss' }]);
        }

        if (permission === Contacts.PERMISSION_UNDEFINED) {
          requestContactsPermission();
        } else if (permission === Contacts.PERMISSION_DENIED) {
          setHasPermission(false);
        } else {
          // PERMISSION_AUTHORIZED
          setHasPermission(true);
          getContacts();
        }
      });
    } else {
      PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_CONTACTS).then(canRead => {
        if (!canRead) {
          requestContactsPermission();
        } else {
          setHasPermission(true);
          getContacts();
        }
      });
    }

    return () => {
      setContacts(null);
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar translucent={true} backgroundColor="rgba(0, 0, 0, 0.1)" barStyle="dark-content" />

      <SafeAreaView style={styles.container}>
        {hasPermission === false && (
          <View style={[styles.container, styles.alertContainer]}>
            <AlertMessage
              color="#fff"
              name="contacts"
              bgColor="#ccc"
              textColor="#ccc"
              textSize={12}
              message="360 does not have permission to access your contacts."
            />

            <View style={styles.btnContainer}>
              {Platform.OS === 'android' && neverAskAgain === true && <GradientButton onPress={() => openSettings()}>ALLOW ACCESS</GradientButton>}

              {Platform.OS === 'android' && neverAskAgain === false && (
                <GradientButton onPress={() => requestContactsPermission()}>ALLOW ACCESS</GradientButton>
              )}

              {Platform.OS === 'ios' && <GradientButton onPress={() => openSettings()}>ALLOW ACCESS</GradientButton>}
            </View>
          </View>
        )}

        {hasPermission === true && isLoading && (
          <View style={[styles.container, styles.alertContainer]}>
            <ActivityIndicator size="large" color="#d81b60" />

            <Text style={styles.greyText}>Getting your contacts...</Text>
          </View>
        )}

        {hasPermission === true && !isLoading && contacts !== null && contacts.length === 0 && (
          <View style={[styles.container, styles.alertContainer]}>
            <AlertMessage
              color="#fff"
              name="contacts"
              bgColor="#ccc"
              textColor="#ccc"
              textSize={12}
              message="No contacts found with an email address. 360 needs the email addresses of your contacts to send them invitations to join you on the platform."
            />
          </View>
        )}

        {hasPermission === true && !isLoading && contacts !== null && contacts.length > 0 && (
          <>
            <View styles={styles.searchContainer}>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="always"
                placeholder="Search contacts"
                returnKeyType="done"
                onChangeText={onSearch}
                style={[styles.textInput, Platform.OS === 'android' ? styles.textInputAndroid : styles.textInputIOS]}
              />
            </View>

            {searchResults.length === 0 && (
              <FlatList
                data={contacts}
                keyExtractor={item => item.recordID}
                renderItem={({ item }) => (
                  <TouchableOpacity key={item.recordID} onPress={() => onContactPressed(item.emailAddresses)}>
                    <View style={styles.contact}>
                      <Image source={item.hasThumbnail ? { uri: item.thumbnailPath } : defaultImage} style={styles.avatar} />

                      <View style={styles.listText}>
                        <Text style={styles.textMain}>
                          {item.givenName} {item.familyName}
                        </Text>

                        {item.emailAddresses && item.emailAddresses.length > 0 && <Text style={styles.textSub}>{item.emailAddresses[0].email}</Text>}
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}

            {searchResults.length > 0 && (
              <FlatList
                data={searchResults}
                keyExtractor={item => item.recordID}
                renderItem={({ item }) => (
                  <TouchableOpacity key={item.recordID} onPress={() => onContactPressed(item.emailAddresses)}>
                    <View style={styles.contact}>
                      <Image source={item.hasThumbnail ? { uri: item.thumbnailPath } : defaultImage} style={styles.avatar} />

                      <View style={styles.listText}>
                        <Text style={styles.textMain}>
                          {item.givenName} {item.familyName}
                        </Text>

                        {item.emailAddresses && item.emailAddresses.length > 0 && <Text style={styles.textSub}>{item.emailAddresses[0].email}</Text>}
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}
          </>
        )}
      </SafeAreaView>
    </View>
  );
}

OpenContacts.navigationOptions = {
  title: 'Invite others',
};

const styles = StyleSheet.create({
  alertContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  btnContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 10,
    justifyContent: 'flex-end',
  },
  contact: {
    alignItems: 'center',
    borderBottomColor: 'rgba(0, 0, 0, 0.2)',
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  greyText: {
    color: '#ccc',
    fontFamily: 'font-regular',
    fontSize: 12,
    textAlign: 'center',
  },
  listText: {
    marginLeft: 20,
    flex: 1,
  },
  textInput: {
    marginTop: 10,
    marginBottom: 15,
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
  },
  textInputIOS: {
    borderColor: 'transparent',
    borderWidth: 0.5,
    borderRadius: 6,
    color: 'rgba(0, 0, 0, 0.99)',
    fontFamily: 'font-light',
    fontSize: 14,
    paddingHorizontal: 26,
    paddingVertical: 6,
    marginHorizontal: 10,
    backgroundColor: '#f1f1f1',
  },
  textMain: {
    fontFamily: 'font-regular',
    fontSize: 15,
    lineHeight: 18,
  },
  textSub: {
    color: 'rgba(0, 0, 0, 0.5)',
    fontFamily: 'font-light',
    fontSize: 13,
    lineHeight: 16,
    paddingTop: 5,
  },
});
