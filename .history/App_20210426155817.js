import React from 'react';
import { Provider } from 'react-redux';
import { View, Alert, Text } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
// import useFont from './hooks/useFont';
import AppLoading from './components/helper/AppLoading';
import store from './store';
import Axios from './utils/axios-plugin';
import requestInterceptors from './utils/request-interceptors';
import NavigationService from './utils/NavigationService';
import Home from './screens/agent/AgentHome'


requestInterceptors({
  store,
  $http: Axios,
});

const MainNavigator = createStackNavigator(
  {
    Home
  },
);

// const BottomNavigator = createMaterialBottomTabNavigator()
const AppContainer = createAppContainer(MainNavigator);

export default function App() {
  // const fontLoaded = useFont();
  console.disableYellowBox = true;
  return (
    <Provider store={store}>
      <View style={{ flex: 1 }}>
        
          <AppContainer
            ref={navigatorRef => {
              NavigationService.setTopLevelNavigator(navigatorRef);
            }}
          />

        {/* <AppLoading fontLoaded={fontLoaded} /> */}
      </View>
    </Provider>
  );
}
