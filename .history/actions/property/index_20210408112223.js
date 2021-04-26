
import Geolocation from 'react-native-geolocation-service';

import parseError from '../../utils/parse-api-error';

import request from '../../helper/functions/request';

import { handleSnackbar } from '../../helper/functions/snackbar';



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
  let url;
  Geolocation.getCurrentPosition( 
    async position => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      console.log("The Current Position is", position)
    //  const locationurl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=41.8842,-87.6388&key=AIzaSyCyWctabwPuw3UNXU7cSQ0ZmNLNrbyXDsU`
      const locationurl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyCyWctabwPuw3UNXU7cSQ0ZmNLNrbyXDsU`
      
  fetch(locationurl)
      .then(res => res.json())
      .then(async (resJson)  => {
        // the response had a deeply nested structure :/
          var Postcode, State, Country
          if(resJson.status == 'OK'){
            for(var i = 0; i < resJson.results[0].address_components.length; i++){
              if(resJson.results[0].address_components[i].types.includes('postal_code')){
                console.log("Success", resJson.results[0].address_components[i])
                 Postcode = resJson.results[0].address_components[i].long_name
                console.log("Postcode is", Postcode)
              }
              if(resJson.results[0].address_components[i].types.includes('administrative_area_level_1')){
                console.log("Success", resJson.results[0].address_components[i])
                 State = resJson.results[0].address_components[i].short_name
                console.log("State is", State)
              }
              if(resJson.results[0].address_components[i].types.includes('country')){
                console.log("Success", resJson.results[0].address_components[i])
                 Country = resJson.results[0].address_components[i].short_name
                console.log("Suburb is", Country)
              }
              // console.log("Types",resJson.results[0].address_components[i].types.includes('postal_code'))
            }
            console.log("Result", Postcode,State, Country)
            let url = `/properties/nearbyProperties?postcode=${Postcode}&state=${State}&country=${Country}&includeVideos=true&start=${start}&limit=${limit}`
            try {
              
              const { data } = await request({
                // url: `/properties?includeVideos=true&lat=${lat}&lng=${lng}&start=${start}&limit=${limit}`,
                url: url,
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
            
          }
        
      })
      .catch((e) => {
        console.log('Error in getAddressFromCoordinates', e)
      })
      
    },
    error => {
      console.log(error);
      dispatch({
        type: ALL_PROPERTIES_LOADING,
        payload: false,
      });

      dispatch({
        type: ALL_PROPERTIES_ERROR,
        payload: error.code,
      });
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 1800000 },
  );
};

