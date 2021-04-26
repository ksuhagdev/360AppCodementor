
import Geolocation from 'react-native-geolocation-service';

import parseError from '../../utils/parse-api-error';

import request from '../../helper/functions/request';

import { handleSnackbar } from '../../helper/functions/snackbar';

import axios from 'axios'

import {

  ALL_PROPERTIES,
  ALL_PROPERTIES_LOADING,
  ALL_PROPERTIES_ERROR,
  
} from '../../store/types';







export const getAllProperties = () => (dispatch, getState) => {
  dispatch({
    type: ALL_PROPERTIES_LOADING,
    payload: true,
  });

  dispatch({
    type: ALL_PROPERTIES_ERROR,
    payload: 0,
  });
  console.log("Video Time Before Calling the API", new Date().getTime());
  const { allProperties } = getState().property;
  const start = allProperties.length;
  const limit = 20;
  // let url;
  try {
              
    const { data } = await request({
      // url: `/properties?includeVideos=true&lat=${lat}&lng=${lng}&start=${start}&limit=${limit}`,
      url: `/properties/trialProperties`,
      // url: `/properties/nearbyPropertiesTemp?postcode=${Postcode}&state=${State}&country=${Country}&includeVideos=true&masterId=37&start=${start}&limit=${limit}`,
      config: { method: 'GET' },
    }).catch(err => console.error(err));
    // console.log("Data", data)
    //  console.log("Response Data from Get Properties",url, data)
    if (data && data.length) {
    console.log("Video Time After the result from the API", new Date().getTime());

      dispatch({
        type: ALL_PROPERTIES,
        payload: allProperties.concat(data),
      });
    }
  } catch (error) {
    console.log('Error', error)
    handleSnackbar({ message: parseError(error.response.data) });
  } finally {
    dispatch({
      type: ALL_PROPERTIES_LOADING,
      payload: false,
    });
  }
  
};

