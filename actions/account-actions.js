import { Alert } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import NavigationService from '../utils/NavigationService';
import { handleLoading } from './app';
import request from '../helper/functions/request';
import { setToken, setData, removeData, removeToken, getToken, getData } from '../helper/functions/storage';
import parseError from '../utils/parse-api-error';
import { handleSnackbar } from '../helper/functions/snackbar';
import {
  AUTH_SUCCESS,
  AUTH_TOKEN_UPDATED,
  USER_LOADED,
  USER_PROFILE,
  PROFILE_LOADING,
  PROFILE_IS_UPDATING,
  CLEAR_USER_PROFILE,MOBILE_VERIFYING,
  LOGOUT_SUCCESS,
  RESET_PASSWORD_LOADING,
  RESET_PASSWORD_SUBMITTED,
  CLEAR_PROPERTY_SEARCH_RESULTS,
  ALL_PROPERTIES,
} from '../store/types';


export const NewUserAllProperty = () => async dispatch => {
  dispatch({ type: ALL_PROPERTIES, payload: [] });
}

export const clearSearch = () => async dispatch => {
  dispatch({ type: CLEAR_PROPERTY_SEARCH_RESULTS });

}

export const agentAuthSuccess = (data) => async dispatch => {
  dispatch({
    type: AUTH_SUCCESS,
    payload: {
      user: data.user,
      agency: data.agency,
      agent: data.agent,
      accessToken: data.auth_token,
    },
  });
}


export const loadProfile = userId => async dispatch => {
  dispatch({
    type: PROFILE_LOADING,
    payload: true,
  });

  try {
    const { data } = await request({
      url: `/users/profile/${userId}`,
      config: {
        method: 'GET',
      },
    });

    dispatch({
      type: USER_PROFILE,
      payload: data,
    });

    dispatch({
      type: PROFILE_LOADING,
      payload: false,
    });
  } catch (error) {
    handleSnackbar({
      message: parseError(error.response.data),
    });
  } finally {
    dispatch({
      type: PROFILE_LOADING,
      payload: false,
    });
  }
};

export const getCurrentProfile = () => async dispatch => {
  const user = await getData('user');
  console.log("Get Current Profile", user)

  if (user) {
    try {
      const { data } = await request({
        url: `/users/profile/${user.id}`,
        config: {
          method: 'GET',
        },
      });

      await setData('user', data.user);
    } catch (error) {
      console.log(error);
    }
  }
};

export const clearUserProfile = () => dispatch => {
  dispatch({
    type: CLEAR_USER_PROFILE,
    payload: {},
  });
};

export const loadSessionFromStorage = () => async dispatch => {
  dispatch(handleLoading(true));
  try {
    const accessToken = await getToken();
    const user = await getData('user');
    const agency = await getData('agency');
    const agent = await getData('agent');

    return dispatch({
      type: USER_LOADED,
      payload: {
        user,
        agency,
        agent,
        accessToken,
      },
    });
  } catch (error) {
    handleSnackbar({
      message: parseError(error.response.data),
    });

    return error;
  } finally {
    dispatch(handleLoading(false));
  }
};

export const requestforAgent = (data, navigation) => async dispatch => {
  dispatch(handleLoading(true));
  // console.log(data)
  try {
    const res = await request({
      url: '/signup/convertUserToAgent',
      config: {
        method: 'POST',
        body: data,
      },
    });

    dispatch({
      type: AUTH_SUCCESS,
      payload: { user: res.data.user },
    });

    // const loginUser = StackActions.reset({
    //   index: 0,
    //   actions: [NavigationActions.navigate({ routeName: 'Login' })],
    // });

    // NavigationService.getNavigator().dispatch(loginUser);

    Alert.alert(
      '',
      "Thank you for signing up to 360! A member of our team will get in touch with you soon to approve your account as an agent.",
      [{ text: 'OK' }],
    );

    handleSnackbar({
      message: 'Thank you for signing up to 360!',
      type: 'success',
      indefinite: true,
    });
    navigation.navigate('UserProfile')
  } catch (error) {
    handleSnackbar({
      message: parseError(error.response.data),
    });
  } finally {
    dispatch(handleLoading(false));
  }
};

export const userlogin = (phone,verify, navigation) => async dispatch => {
  // dispatch(handleLoading(true));
  dispatch({ type: ALL_PROPERTIES, payload: [] });
  dispatch({ type: CLEAR_PROPERTY_SEARCH_RESULTS });
  console.log("User Login Function", phone, verify)
  try {
   // console.log(payload);
    const { data } = await request({
      url: `/users/new_login/verifyOTP/${phone.substring(1)}/${verify}`,
      config: {
        method: 'GET',
        // body: payload,
      },
    });

    //console.log("User data After Login", data)
    dispatch({
      type: AUTH_SUCCESS,
      payload: {
        user: data.user,
        agency: data.agency,
        agent: data.agent,
        accessToken: data.auth_token,
      },
    });
    
    await setToken(data.auth_token);
    await setData('user', data.user);

    if (data.agent) {
      await setData('agent', data.agent);
      await setData('agency', data.agency);
    }

    handleSnackbar({
      message: 'Logged in',
      type: 'success',
    });

    // try {
    //   const fcmToken = await AsyncStorage.getItem('fcmToken');
    //   console.log({
    //     fireBaseToken: fcmToken,
    //     userIdOrEmail: payload.email,
    //   });
    //   const status = await request({
    //     url: '/push-notify/capture',
    //     config: {
    //       method: 'POST',
    //       body: {
    //         fireBaseToken: fcmToken,
    //         userIdOrEmail: payload.email,
    //       },
    //     },
    //   });
    //   // console.log('Status of FCM token save: ', status);
    // } catch (error) {
    //   console.log('FCM token save failed  with error: ', error.message, error);
    // }

    const loginUser = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: data.user.role })],
    });

    navigation.dispatch(loginUser);
  } catch (error) {
    console.log("USER SIGNIN ERROR",error.response.data.message.message);
    // console.log({ ...error });
    
    handleSnackbar({
      message: parseError(error.response.data.message.message),
      indefinite: true,
    });
  } finally {
    dispatch(handleLoading(false));
  }
};

export const agentLogin = (payload, navigation) => async dispatch => {
  dispatch(handleLoading(true));
  dispatch({ type: ALL_PROPERTIES, payload: [] });
  dispatch({ type: CLEAR_PROPERTY_SEARCH_RESULTS });
  let url = '/users/agent/new_login'
  console.log("Login", payload, url)
  try {
   // console.log(payload);
    const { data } = await request({
      url: url,
      config: {
        method: 'POST',
        body: payload,
      },
    });

//     fetch("http://13.211.132.117:3600/users/agent/new_login",
// {
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json'
//     },
//     method: "POST",x
//     body: JSON.stringify(payload)
// }).then(function(res){ console.log(res) })
// .catch(function(res){ console.log(res) })

    //console.log("User data After Login", data)
    dispatch({
      type: AUTH_SUCCESS,
      payload: {
        user: data.user,
        agency: data.agency,
        agent: data.agent,
        accessToken: data.auth_token,
      },
    });
    
    await setToken(data.auth_token);
    await setData('user', data.user);

    if (data.agent) {
      await setData('agent', data.agent);
      await setData('agency', data.agency);
    }

    handleSnackbar({
      message: 'Logged in',
      type: 'success',
    });

    try {
      const fcmToken = await AsyncStorage.getItem('fcmToken');
      console.log({
        fireBaseToken: fcmToken,
        userIdOrEmail: payload.email,
      });
      const status = await request({
        url: '/push-notify/capture',
        config: {
          method: 'POST',
          body: {
            fireBaseToken: fcmToken,
            userIdOrEmail: payload.email,
          },
        },
      });
      // console.log('Status of FCM token save: ', status);
    } catch (error) {
      console.log('FCM token save failed  with error: ', error.message, error);
    }

    const loginUser = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: data.user.role })],
    });

    navigation.dispatch(loginUser);
  } catch (error) {
    console.log(error.response.data);
   
    //alert("you have entered incorrect username or password: Please try again  ")

    console.log({ ...error });
    handleSnackbar({
      message: parseError(error.response.data),
      // indefinite: true,
    });
  } 
  finally {
    dispatch(handleLoading(false));
  }
};


export const login = (payload, navigation) => async dispatch => {
  dispatch(handleLoading(true));
  dispatch({ type: ALL_PROPERTIES, payload: [] });
  dispatch({ type: CLEAR_PROPERTY_SEARCH_RESULTS });
  let url = '/users/agent/new_login'
  console.log("Login", payload, url)
  try {
   // console.log(payload);
    const { data } = await request({
      url: url,
      config: {
        method: 'GET',
        body: payload,
      },
    });

    //console.log("User data After Login", data)
    dispatch({
      type: AUTH_SUCCESS,
      payload: {
        user: data.user,
        agency: data.agency,
        agent: data.agent,
        accessToken: data.auth_token,
      },
    });
    
    await setToken(data.auth_token);
    await setData('user', data.user);

    if (data.agent) {
      await setData('agent', data.agent);
      await setData('agency', data.agency);
    }

    handleSnackbar({
      message: 'Logged in',
      type: 'success',
    });

    try {
      const fcmToken = await AsyncStorage.getItem('fcmToken');
      console.log({
        fireBaseToken: fcmToken,
        userIdOrEmail: payload.email,
      });
      const status = await request({
        url: '/push-notify/capture',
        config: {
          method: 'POST',
          body: {
            fireBaseToken: fcmToken,
            userIdOrEmail: payload.email,
          },
        },
      });
      // console.log('Status of FCM token save: ', status);
    } catch (error) {
      console.log('FCM token save failed  with error: ', error.message, error);
    }

    const loginUser = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: data.user.role })],
    });

    navigation.dispatch(loginUser);
  } catch (error) {
    
    
    console.log(error.response.data);
    console.log({ ...error });
    handleSnackbar({
      message: parseError(error.response.data),
      indefinite: true,
    });
  } finally {
    dispatch(handleLoading(false));
  }
};

export const signupAsUser = (data, navigation) => async dispatch => {
  dispatch(handleLoading(true));

  const body = {
    ...data,
    role: 'USER',
  };
  console.log("USer signup", data)
  try {
    const res = await request({
      url: '/signup/new_user',
      config: {
        method: 'POST',
        body,
      },
    });
console.log("USER SIGNUP", res)
    dispatch({
      type: AUTH_SUCCESS,
      payload: { user: res.data },
    });

    handleSnackbar({
      message: 'Thank you for signing up to 360!',
      type: 'success',
      indefinite: true,
    });

    navigation.navigate('Login');
  } catch (error) {
    console.log("User Error", parseError(error.response.data))
    handleSnackbar({
      message: parseError(error.response.data.message),
    });
  } finally {
    dispatch(handleLoading(false));
  }
};

export const signupAsAgent = (data, navigation) => async dispatch => {
  dispatch(handleLoading(true));
  console.log("Agent Data", data)
  try {
    const res = await request({
      url: '/signup/new_agent',
      config: {
        method: 'POST',
        body: data,
      },
    });
    dispatch({
      type: AUTH_SUCCESS,
      payload: {
        user: data.user,
        agency: data.agency,
        agent: data.agent,
        accessToken: data.auth_token,
      },
    });
    console.log("Data", data)
    
    await setToken(data.auth_token);
    await setData('user', data.user);

    if (data.agent) {
      await setData('agent', data.agent);
      await setData('agency', data.agency);
    }

    handleSnackbar({
      message: 'Logged in',
      type: 'success',
    });

    try {
      const fcmToken = await AsyncStorage.getItem('fcmToken');
      console.log({
        fireBaseToken: fcmToken,
        userIdOrEmail: payload.email,
      });
      const status = await request({
        url: '/push-notify/capture',
        config: {
          method: 'POST',
          body: {
            fireBaseToken: fcmToken,
            userIdOrEmail: payload.email,
          },
        },
      });
      // console.log('Status of FCM token save: ', status);
    } catch (error) {
      console.log('FCM token save failed  with error: ', error.message, error);
    }
console.log("AGENT ROLE",data.user.role)
    // const loginUser = StackActions.reset({
    //   index: 0,
    //   // actions: [NavigationActions.navigate({ routeName: data.user.role })],
    //   actions: [NavigationActions.navigate({ routeName: 'USER'})],

    // });

    // navigation.dispatch(loginUser);
    } catch (error) {
    console.log("Error in Creating user", error.response.data.message);
    handleSnackbar({
      message: parseError(error.response.data),
    });
  } finally {
    dispatch(handleLoading(false));
  }
};

export const phoneNumberVerification = (number, type) => async dispatch => {
  dispatch({
    type: PROFILE_IS_UPDATING,
    payload: true,
  });
  
    // let url2 = `/property-videos/sendSMS?number=${number.substring(1)}&subject=360Sup
    let url = `/users/sendSMSforLogin?number=${number.substring(1)}&subject=360Support`
    if(type == 'userSignUp' || type == 'agentSignup'){
     url = `/users/sendSMSforSignup?number=${number.substring(1)}&subject=360Support`
    } 
  
  try {
    // http://13.211.132.117:3600/users/sendSMSforLogin?number=61403140529&subject=360Support
    // let url2 = `/users/sendSMSforLogin?number=61403140529&subject=360Support`
    console.log("URL", url)
    const { data } = await request({
      url: url,
      config: {
        method: 'GET',
        // body: userData,
      },
    });
    console.log("Phone Verification Response",data);
    
  } catch (error) {
    console.log(error.response);
    throw new Error('Server Error')

    // handleSnackbar({ message: 'Could not login at this time. Please retry in a bit.' });
  } finally {
    dispatch({ 
      type: PROFILE_IS_UPDATING,
      payload: false,
    });
  }
  
}

export const verifyNumber = (number,verify) => async dispatch => {
  dispatch({
    type: MOBILE_VERIFYING,
    payload: null,
  });


    url = `/users/verifyOTP/${number.substring(1)}/${verify}`
  

  try {
    console.log(`URL FOR NUMBER VERIFY`, url)
    const {data} = await request({
      url: url,
      config: {
        method: 'GET',
        // body: userData,
      },
    });
    if(data.status === "verified"){
      console.log("Verification",data.status)
      dispatch({
        type: MOBILE_VERIFYING,
        payload: true,
      });
      // handleSnackbar({
      //   message: 'Mobile Number Successfully verified',
      //   type: 'success',
      //   indefinite: true,
      // });
    handleSnackbar({ message: 'Mobile Number Successfully verified',type: 'success' });

    }else{
      dispatch({
        type: MOBILE_VERIFYING,
        payload: false,
      });
    // handleSnackbar({ message: 'Incorrect Verification ID' });
    throw new Error('Incorrect Verification ID')

    }
    
    console.log("Phone Verification Response",data);
  } catch (error) {
    console.log("verify number",error.data);
    handleSnackbar({ message: 'Please Enter Correct Code' });
    throw new Error("Please Enter Correct Code")
  } finally {
    dispatch({ 
      type: PROFILE_IS_UPDATING,
      payload: false,
    });
  }
}

export const updateProfile = userData => async dispatch => {
  dispatch({
    type: PROFILE_IS_UPDATING,
    payload: true,
  });

  try {
    const { data } = await request({
      url: `/users/profile/${userData.id}`,
      config: {
        method: 'POST',
        body: userData,
      },
    });

    await setData('user', data);
    handleSnackbar({ message: 'Profile updated', type: 'success' });
  } catch (error) {
    console.log(error);
    handleSnackbar({ message: 'Could not update your profile at this time. Please retry in a bit.' });
  } finally {
    dispatch({
      type: PROFILE_IS_UPDATING,
      payload: false,
    });
  }
};

export const logout = () => async dispatch => {
  dispatch(handleLoading(true));

  await removeToken();
  await removeData('user');
  await removeData('agency');
  await removeData('agent');

  dispatch({ type: ALL_PROPERTIES, payload: [] });
  dispatch({ type: CLEAR_PROPERTY_SEARCH_RESULTS });
  dispatch(handleLoading(false));

  const logoutUser = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Login' })],
  });

  NavigationService.getNavigator().dispatch(logoutUser);

  return dispatch({ type: LOGOUT_SUCCESS });
};

export const inviteUser = payload => async dispatch => {
  dispatch(handleLoading(true));

  const user = await getData('user');
  const data = {
    invitations: [
      {
        ...payload,
        user_id: user.id,
      },
    ],
  };

  try {
    await request({
      url: '/users/invite',
      config: {
        method: 'POST',
        body: data,
      },
    });

    handleSnackbar({ message: `Invitation sent to ${payload.email}`, type: 'success' });
  } catch (error) {
    handleSnackbar({ message: parseError(error.response.data) });
  } finally {
    dispatch(handleLoading(false));
  }
};

export const resetPassword = email => async dispatch => {
  dispatch({ type: RESET_PASSWORD_LOADING, payload: true });

  try {
    await request({
      url: '/users/forgot-password',
      config: {
        method: 'POST',
        body: { email },
      },
    });

    dispatch({ type: RESET_PASSWORD_SUBMITTED, payload: true });
  } catch (error) {
    handleSnackbar({ message: parseError(error.response.data) });
  } finally {
    dispatch({ type: RESET_PASSWORD_LOADING, payload: false });
  }
};

export const renewToken = () => async dispatch => {
  try {
    const { data } = await request({
      url: '/users/renew-token',
      config: {
        method: 'POST',
      },
    });

    dispatch({
      type: AUTH_TOKEN_UPDATED,
      payload: data.auth_token,
    });

    await setToken(data.auth_token);
  } catch (e) {
    console.error('Could not renew auth token: ', e);
  }
};
function newFunction() {
  alert("Invalid ");
}

