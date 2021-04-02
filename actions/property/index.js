import { batch } from 'react-redux';
import Geolocation from 'react-native-geolocation-service';
import { StackActions, NavigationActions } from 'react-navigation';
import NavigationService from '../../utils/NavigationService';
import parseError from '../../utils/parse-api-error';
import { handleLoading } from '../app';
import request from '../../helper/functions/request';
import { getData } from '../../helper/functions/storage';
import { handleSnackbar } from '../../helper/functions/snackbar';
import Axios from '../../utils/axios-plugin';
// import {GOOGLE_API_KEY} from './../../utilsvariable';
import axios from 'axios';
import {
  HANDLE_ADD_PROPERTY,
  ALL_PROPERTIES,
  ALL_PROPERTIES_LOADING,
  ALL_PROPERTIES_ERROR,
  SET_CURRENT_PROPERTY,
  CLEAR_NEW_PROPERTY,
  PROPERTY_SEARCH_RESULTS,
  PROPERTY_SEARCH_IS_LOADING,
  CLEAR_PROPERTY_SEARCH_RESULTS,
  PROPERTY_SEARCH_FILTERS,
  SET_HASHTAGS,
  // SET_AUCTION_DATE,MUSIC_FILES, SET_TRENDINGPROPERTIES, MUSIC_TRENDING,
  SET_AUCTION_DATE,MUSIC_FILES, SET_TRENDINGPROPERTIES, MUSIC_TRENDING, MUSIC_GENRE,MUSIC_COUNT
} from '../../store/types';
import { StatusBar } from 'react-native';

export const setCurrentProperty = (id, property = {}) => {
  console.log("Setting Current ID", id, property)
  return {
    type: SET_CURRENT_PROPERTY,
    payload: {
      id,
      property,
    },
  };
};

export const handleNewProperty = details => {
  const property = { ...details };

  if (property.hashtags) {
    if (Array.isArray(property.hashtags)) {
      const hashtags = property.hashtags.map(hashtag => {
        return hashtag.name;
      });

      property.hashtags = hashtags.join(', ');
    }
  }

  return {
    type: HANDLE_ADD_PROPERTY,
    payload: {
      property,
    },
  };
};

export const clearNewProperty = () => {
  return {
    type: CLEAR_NEW_PROPERTY,
  };
};

export const setCurrentCampaign = details => {
  return {
    type: HANDLE_ADD_PROPERTY,
    payload: {
      campaign: details,
    },
  };
};

export const handleNewPropertyCampaign = details => async dispatch => {
  dispatch({
    type: HANDLE_ADD_PROPERTY,
    payload: {
      campaign: {
        ...details,
      },
    },
  });
  console.log("hangele New Property")
  dispatch(createProperty());
};

export const handleUpdateProperty = details => async dispatch => {
  dispatch({
    type: HANDLE_ADD_PROPERTY,
    payload: {
      campaign: {
        ...details,
      },
    },
  });

  await dispatch(updateProperty());
};

export const handleHashtags = tags => dispatch => {
  console.log('check for hastags ')
  dispatch({ type: SET_HASHTAGS, payload: tags });
};

const createProperty = () => async (dispatch, getState) => {
  
  const { newPropertyDetails, newPropertyCampaign, hashtags, auctionDates } = getState().property;
  const {accessToken} = getState().account;
 
  const data = {
    property: newPropertyDetails,
    campaign: newPropertyCampaign,
  };


  

  if (hashtags) {
    data.hashtags = hashtags;
  }
  if (auctionDates && auctionDates.length) {
    data.auction_dates = auctionDates.map(date => date.auction_date_time);
  }

  dispatch(handleLoading(true));
  

  try {
    const res = await request({
      url: '/properties',
      config: {
        method: 'POST',
        body: data,
      },
    });

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+accessToken
    }
    // const res = await axios.post('http://13.211.132.117:3600/properties',data, {headers: headers}).then((res) => console.log("resuled",res))
     console.log("Trying to Submit", res.data)

    if (res.data.property) {
      batch(() => {
        dispatch({
          type: HANDLE_ADD_PROPERTY,
          payload: {
            created: res.status !== 400,
          },
        });

        dispatch(setCurrentProperty(res.data.property.id, res.data.property));

        dispatch(clearNewProperty());
        dispatch({ type: SET_HASHTAGS, payload: null });
        dispatch({ type: SET_AUCTION_DATE, payload: [] });
        
      });

      handleSnackbar({ type: 'success', message: 'Property created' });
    }
  } catch (error) {
    console.log("Error",error)
    handleSnackbar({ message: parseError(error.response.data)});
  } finally {
    dispatch(handleLoading(false));
  }
};

export const getTrendingProperties =  () => async(dispatch, getState) => {
 let data = '' 
  // const { accessToken, data } = getState().account;
  try{
    // dispatch({
    //   type: PROPERTY_SEARCH_IS_LOADING,
    //   payload: true,
    // });
  //   console.log("Inside Trending Video", accessToken, data)
  //  let res = await request({
  //     url: '/properties/trending',
  //     config: {
  //       method: 'GET',
  //     },
  //   });
  //   console.log("Resutl Config",res)
  //   await Axios.get(`http://13.211.132.117:3600/properties/trending`,  {
  //     headers: {
  //       Accept: 'application/json',
  //     },
  //   }).then(result => {
  //     console.log("Trending Resuylt", result)
  //   data = result.data
    
  // }).catch(error => {
  //   console.log( error);
  // });
  // let baseurl1 = "http://13.211.132.117:3600"
  let baseurl = 'https://api.360app.io/api'
    await axios({url: baseurl + `/properties/trending`, method:'GET'}).then(result => {
      // console.log("Trending Resuylt", result)
    data = result.data  
    // console.log("Trending Properties", data)
  }).catch(error => { 
    console.error( error);
  })

    dispatch({
      type: SET_TRENDINGPROPERTIES,
      payload: data
    });
  
}catch(error){
    handleSnackbar({ message: parseError(error.response.data) });
  }
  
  // console.log("Trending Data", data)
}

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
      // try {
              
      //   const { data } = await request({
      //     // url: `/properties?includeVideos=true&lat=${lat}&lng=${lng}&start=${start}&limit=${limit}`,
      //     url: `/properties/nearbyProperties?postcode=${Postcode}&state=${State}&country=${Country}&includeVideos=true`,
      //     // url: `/properties/nearbyPropertiesTemp?postcode=3192&state=VIC&country=AU&includeVideos=true&masterId=37&start=${start}&limit=${limit}`,
      //     config: { method: 'GET' },
      //   }).catch(err => console.error(err));
      //   // console.log("Data", data)
      //   //  console.log("Response Data from Get Properties", data)
      //   if (data && data.length) {
      //     dispatch({
      //       type: ALL_PROPERTIES,
      //       payload: allProperties.concat(data),
      //     });
      //   }
      // } catch (error) {
      //   console.log('Error', error)
      //   handleSnackbar({ message: parseError(error.response.data) });
      // } finally {
      //   dispatch({
      //     type: ALL_PROPERTIES_LOADING,
      //     payload: false,
      //   });
      // }
      

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

export const getMusicList = id => async (dispatch, getState) => {
  dispatch(handleLoading(false));
  try{const { data } = await request({
    // url: `/properties?includeVideos=true&lat=${lat}&lng=${lng}&start=${start}&limit=${limit}`,
    url: `/music?start=0&end=20`,
    config: { method: 'GET' },
  });
  //console.log("music data", data)
  dispatch({
    type: MUSIC_FILES,
    payload: data
   
  });
  dispatch({ type: MUSIC_FILES, payload: data });
}catch(error){
    handleSnackbar({ message: parseError(error.response.data) });
  }finally{
    dispatch(handleLoading(false));
   
  }

  
}

export const getMusicTrending = id => async (dispatch, getState) => {
  dispatch(handleLoading(false));
  try{const { data } = await request({
    // url: `/properties?includeVideos=true&lat=${lat}&lng=${lng}&start=${start}&limit=${limit}`,
    url: `/music/trending?start=0&end=10`,
    config: { method: 'GET' },
  });
  //console.log("music data", data)
  console.log("Music Trending Data", data)
  dispatch({
    type: MUSIC_TRENDING,
    payload: data
   
  });
  // dispatch({ type: MUSIC_FILES, payload: data });
}catch(error){
    handleSnackbar({ message: parseError(error.response.data) });
  }finally{
    dispatch(handleLoading(false));
   
  }

  
}



export const getMusicCount = id => async (dispatch, getState) => {
  dispatch(handleLoading(false));
  try{const { data } = await request({
    // url: `/properties?includeVideos=true&lat=${lat}&lng=${lng}&start=${start}&limit=${limit}`,
    url: `/music/getCountByGenre`,
    config: { method: 'GET' },
  });
  console.log("music count", data)
  dispatch({
    type: MUSIC_COUNT,
    payload: data
  });
}catch(error){
  handleSnackbar({ message: parseError(error.response.data) });
}finally{
  dispatch(handleLoading(false));
 
}


}


  export const getMusicGenre = id => async (dispatch, getState) => {
    console.log("TYPE OF GENRE", id)
    dispatch(handleLoading(false));
    try{const { data } = await request({
      // url: `/properties?includeVideos=true&lat=${lat}&lng=${lng}&start=${start}&limit=${limit}`,
      url: `/music/getSongsByGenre?genre=jazz&start=0&end=10`,
      config: { method: 'GET' },
    });
    //console.log("music data", data)
    console.log("Music Genre Data", data)
    dispatch({
      type: MUSIC_GENRE,
      payload: data
     
    });
    // dispatch({ type: MUSIC_FILES, payload: data });
  }catch(error){
      handleSnackbar({ message: parseError(error.response.data) });
    }finally{
      dispatch(handleLoading(false));
     
    }
  
    
  }

export const getPropertyById = id => async (dispatch, getState) => {
  const { currentProperty } = getState().property;

  if (currentProperty && currentProperty.property && currentProperty.property.id === id) {
    // No need to hit the API, we already have it
    return false;
  }

  try {
    const { data } = await request({
      url: `/properties/${id}`,
      config: { method: 'GET' },
    });

    dispatch(setCurrentProperty(id, data));
    dispatch(addViewCountToProperty(id));
  } catch (error) {
    handleSnackbar({ message: parseError(error.response.data) });
  }
};

export const updateProperty = () => async (dispatch, getState) => {
  const { newPropertyDetails, newPropertyCampaign, hashtags } = getState().property;

  const payload = {
    property: newPropertyDetails,
    campaign: newPropertyCampaign,
  };

  if (hashtags) {
    payload.hashtags = hashtags;
  }

  payload.campaign.type = payload.property.campaign_type.toLowerCase();

  dispatch(handleLoading(true));

  try {
    const { data } = await request({
      url: `/properties/${payload.property.id}`,
      config: {
        method: 'POST',
        body: payload,
      },
    });

    batch(async () => {
      dispatch({
        type: HANDLE_ADD_PROPERTY,
        payload: {
          updated: true,
        },
      });
      dispatch(setCurrentProperty(data.property.id, data));
      dispatch(clearNewProperty());
      dispatch({ type: SET_HASHTAGS, payload: null });
    });

    handleSnackbar({ type: 'success', message: 'Property updated' });
  } catch (error) {
    handleSnackbar({ message: parseError(error.response.data) });
  } finally {
    dispatch(handleLoading(false));
  }
};

export const addViewCountToProperty = id => async () => {
  try {
    await request({
      url: `/properties/${id}/track-view`,
      config: {
        method: 'PATCH',
      },
    });
  } catch (error) {
    console.log(error.message);
  }
};

export const setLiveStatus = async status => async (dispatch, getState) => {
  const id = getState().property.currentPropertyId;
  dispatch(handleLoading(true));

  console.log('setLiveStatus', id);

  try {
    await request({
      url: `/properties/${id}/set-live`,
      config: {
        method: 'PATCH',
        body: { status },
      },
    });

    const message = status ? 'Campaign is now online' : 'Campaign has been taken offline';
    const { currentProperty, allProperties } = getState().property;
    let properties = [];

    currentProperty.property.is_live = status;

    if (status) {
      const property = { ...currentProperty.property };

      property.agency = property.agency.name;

      properties = [property].concat(allProperties);
    } else {
      properties = allProperties.filter(property => property.id !== currentProperty.property.id);
    }

    dispatch(setCurrentProperty(currentProperty.property.id, currentProperty));
    dispatch({ type: ALL_PROPERTIES, payload: properties });

    handleSnackbar({ message, type: 'success' });
  } catch (error) {
    handleSnackbar({ message: parseError(error.response.data) });
  } finally {
    dispatch(handleLoading(false));
  }
};

export const deleteProperty = async id => async (dispatch, getState) => {
  dispatch(handleLoading(true));

  try {
    await request({
      url: `/properties/${id}`,
      config: {
        method: 'DELETE',
      },
    });

    let { allProperties } = getState().property;

    allProperties = allProperties.filter(property => {
      return property.id !== parseInt(id, 10);
    });

    dispatch({
      type: ALL_PROPERTIES,
      payload: allProperties,
    });
    handleSnackbar({ message: 'Property profile deleted' });
  } catch (error) {
    handleSnackbar({ message: parseError(error.response.data) });
  } finally {
    dispatch(handleLoading(false));
  }
};

export const uploadPropertyVideo = payload => async (dispatch, getState) => {
  const createFormData = obj => {
    const data = new FormData();

    data.append('files[]', { uri: obj.files[0], type: 'video/mp4', name: 'video_file.mp4' });
    data.append('files[]', { uri: obj.files[1], type: 'image/jpeg', name: 'video_file.jpg' });
    data.append('title', 'null');
    data.append('video_type', obj.video_type);
    return data;
  };

  dispatch(handleLoading(true));

  try {
    const { currentProperty } = getState().property;
    let property = null;
    let propertyId = null;
    let propertyTitle = null;
    let videos = [];

    if (currentProperty && currentProperty.property) {
      property = currentProperty.property;
    }

    if (property && property.id) {
      propertyId = property.id;
      propertyTitle = property.title;
      videos = property.videos;
    }

    console.log(
      {
        propertyId,
        propertyTitle,
        ...payload,
      },
      createFormData(payload),
    );

    const existingVideo = videos.find(x => x.video_type === payload.video_type);
    let url = `/property-videos/vod/${propertyId}`;

    if (existingVideo) {
      // Video type exists, so we need to do an UPDATE API call
      url += `/video/${existingVideo.id}`;
    }
    handleSnackbar({ type: 'success', message: 'Uploading and Processing your video' });
    dispatch(setCurrentProperty(property.id, property));

    const res = await Axios.post(url, createFormData(payload), {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log(res);

    const updatedVideos = property.videos.filter(video => video.video_type !== payload.video_type).concat(res.data);

    property.videos = updatedVideos;
    property.campaign = currentProperty.campaign;

    // dispatch(setCurrentProperty(property.id, property));
    handleSnackbar({ type: 'success', message: 'Property video successfully uploaded, Processing Video......' });

    return {
      ...res.data,
      propertyId,
      propertyTitle,
    };
  } catch (error) {
    handleSnackbar({ message: error && error.response ? parseError(error.response.data) : error });
  } finally {
    dispatch(handleLoading(false));
  }
};
// export const uploadPropertyVideo = payload => async (dispatch, getState) => {
 
//   const createFormData = obj => {
//     const data = new FormData();

//     data.append('files[]', { uri: obj.files[0], type: 'video/mp4', name: 'video_file.mp4' });
//     data.append('files[]', { uri: obj.files[1], type: 'image/jpeg', name: 'video_file.jpg' });
//     data.append('title', 'null');
//     data.append('video_type', obj.video_type);
//     return data;
//   };

//   dispatch(handleLoading(true));

//   try {
//     console.log("Inside Video Upload")
//     const { currentProperty } = getState().property;
//     let property = null;
//     let propertyId = null;
//     let propertyTitle = null;
//     let videos = [];
//     console.log("Current Property",currentProperty)

//     if (currentProperty && currentProperty.property) {
//       property = currentProperty.property;
//     }

//     if (property && property.id) {
//       propertyId = property.id;
//       propertyTitle = property.title;
//       videos = property.videos;
//     }

//     console.log("BOYYY",
//       {
//         propertyId,
//         propertyTitle,
//         ...payload,
//       },
//       createFormData(payload),
//     );

//     const {accessToken} = getState().account;
//      const existingVideo = videos.find(x => x.video_type === payload.video_type);
//     //let url = `https://api.360app.io/api/property-videos/vod/${propertyId}`;
//     let url = `/api/property-videos/vod/${propertyId}`;
//       console.log('Property ID', url)
//     if (existingVideo) {
//       // Video type exists, so we need to do an UPDATE API call
//       url += `/video/${existingVideo.id}`;
//     } 

//     // const res = await axios.post(url, payload,{
//     //   headers: {
//     //     Accept: 'application/json',
//     //     'Content-Type': 'multipart/form-data',
//     //     authorization: `Bearer ${accessToken}`
//     //   }
//     // })

//     // const res = await request({
//     //   url: url,
//     //   config: {
//     //     method: 'POST',
//     //     body: payload,
//     //     Accept: 'application/json',
//     //     'Content-Type': 'multipart/form-data',
//     //   },
//     // });
//     console.log("Uplaod URL", url)
//     const res = await Axios.post(url, createFormData(payload), {
//       headers: {
//         Accept: 'application/json',
//         'Content-Type': 'multipart/form-data',
//       },
//     });

//     console.log("Upload Complete",res);

//     const updatedVideos = property.videos.filter(video => video.video_type !== payload.video_type).concat(res.data);

//     property.videos = updatedVideos;
//     property.campaign = currentProperty.campaign;

//     dispatch(setCurrentProperty(property.id, property));
//     handleSnackbar({ type: 'success', message: 'Property video successfully uploaded' });

//     return {
//       ...res.data,
//       propertyId,
//       propertyTitle,
//     };
//   } catch (error) {
//     console.log("error", error.response)
//     handleSnackbar({ message: error && error.response ? parseError(error.response.data) : error });
//   } finally {
//     dispatch(handleLoading(false));
//   }
// };

export const updateSearchFilters = filters => async (dispatch, getState) => {
  const { searchFilters } = getState().property;
  const data = {
    ...searchFilters,
    ...filters,
  };

  dispatch({ type: PROPERTY_SEARCH_FILTERS, payload: data });
};

export const searchProperties = () => async (dispatch, getState) => {
  const { searchFilters } = getState().property;
  console.log("Search Property API", searchFilters)
  
  const filters = {
    bedrooms: searchFilters.bedrooms[0],
    bathrooms: searchFilters.bathrooms[0],
    car_spaces: searchFilters.carSpace[0],
    min_price: searchFilters.price[0],
    max_price: searchFilters.price[1],
    campaign_type: searchFilters.campaignType,
    property_type: searchFilters.propertyType,
    suburb: searchFilters.suburb || null,
    state: searchFilters.state || null,
    country: searchFilters.country || null,
  };

  dispatch({
    type: PROPERTY_SEARCH_IS_LOADING,
    payload: true,
  });

  dispatch({
    type: CLEAR_PROPERTY_SEARCH_RESULTS,
    payload: null,
  });
let url;
  const queryString = Object.entries(filters)
    .map(([key, val]) => `${key}=${val}`)
    .join('&');
  console.log("Query String", queryString)
  url = `/properties/newSearch?${queryString}`
  if(searchFilters.suburb){
    const filters2 = {
      bedrooms: searchFilters.bedrooms[0],
      bathrooms: searchFilters.bathrooms[0],
      car_spaces: searchFilters.carSpace[0],
      min_price: searchFilters.price[0],
      max_price: searchFilters.price[1],
      campaign_type: searchFilters.campaignType,
      property_type: searchFilters.propertyType,
      // suburb: searchFilters.suburb || null,
      state: searchFilters.state || null,
      country: searchFilters.country || null,
    };
    const queryString2 = Object.entries(filters2)
    .map(([key, val]) => `${key}=${val}`)
    .join('&');
    url = `/properties/newSearchCity?${queryString2}`
  }
  if(searchFilters.hashtag){
    console.log('Hashtags',searchFilters.hastag)
    url = `/properties/getTaggedProperties?tag=%23${searchFilters.hastag.substring(1)}`
  }
  try {
    const { data } = await request({
      url: url,
      config: {
        method: 'GET',
      },
    });
    console.log('Serch Data', data, url)
    dispatch({
      type: PROPERTY_SEARCH_RESULTS,
      payload: data,
    });

    console.log('Got search results: ', data[0].video);
  } catch (error) {
    console.log(error);
    throw new Error('Could not perform a property search at this time. Please retry in a bit.')
    // handleSnackbar({ message: 'Could not perform a property search at this time. Please retry in a bit.' });
  } finally {
    dispatch({
      type: PROPERTY_SEARCH_IS_LOADING,
      payload: false,
    });
  }
};

export const shareProperty = data => async () => {
  const user = await getData('user');
  const payload = {
    share_from: user.id,
    share_type: data.shareType,
  };

  try {
    await request({
      url: `/shares/${data.propertyId}`,
      config: {
        method: 'POST',
        body: payload,
      },
    });
  } catch (error) {
    console.log(error);
  }
};
