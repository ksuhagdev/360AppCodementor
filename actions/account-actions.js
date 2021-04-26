
import { StackActions, NavigationActions } from 'react-navigation';

import NavigationService from '../utils/NavigationService';
import { handleLoading } from './app';

import { removeData, removeToken } from '../helper/functions/storage';





export const logout = () => async dispatch => {
  dispatch(handleLoading(true));

  await removeToken();
  await removeData('user');
  await removeData('agency');
  await removeData('agent');

  
  
  dispatch(handleLoading(false));

  const logoutUser = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Login' })],
  });

  NavigationService.getNavigator().dispatch(logoutUser);

  return dispatch({ type: LOGOUT_SUCCESS });
};

