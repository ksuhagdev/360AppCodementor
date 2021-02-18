import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { View, Linking, AppState, StyleSheet } from 'react-native';
import { RESULTS } from 'react-native-permissions';
import Details from './Details';
import { getAllProperties } from '../../../actions/property';
import { requestLocation } from '../../../helper/functions/permission';
import { NoLocationPermission } from '../../../components/helper/NoPermission';
import Hero from './Hero'
export default function AgentHome({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    requestPermission();
  }, []);

  const handleAppState = appState => {
    if (appState === 'active') {
      if (!hasPermission) {
        requestPermission();
        AppState.removeEventListener('change', handleAppState);
      }
    }
  };

  const requestPermission = async () => {
    const status = await requestLocation();
    
    switch (status) {
      case RESULTS.GRANTED:
        setHasPermission(true);
        setIsBlocked(false);
        dispatch(getAllProperties());
        break;
      case RESULTS.DENIED:
        setHasPermission(false);
        setIsBlocked(false);
        break;
      case RESULTS.BLOCKED:
        setHasPermission(false);
        setIsBlocked(true);
    }
  };

  const handlePermission = () => {
    if (isBlocked) {
      AppState.addEventListener('change', handleAppState);
      Linking.openSettings();
    } else {
      requestPermission();
    }
  };

  const getMoreProperties = () => {
    dispatch(getAllProperties());
  };

  if (hasPermission === false) {
    return <NoLocationPermission requestLocation={handlePermission} />;
  }else{

  }
  
  return (
    <View style={styles.equalFlex}>
      <Details navigation={navigation} onGetMoreProperties={getMoreProperties} />
    </View>
  );
}

const styles = StyleSheet.create({
  equalFlex: {
    flex: 1,
  },
});

AgentHome.navigationOptions = {
  headerShown: false,
};
