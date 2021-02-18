import { NavigationActions } from 'react-navigation';

let _navigator;

function getNavigator() {
  return _navigator;
}

function setTopLevelNavigator(ref) {
  _navigator = ref;
}

function navigate(routeName, params) {
  _navigator.dispatch(NavigationActions.navigate({ routeName, params }));
}

export default {
  navigate,
  getNavigator,
  setTopLevelNavigator,
};
