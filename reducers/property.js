import {
  HANDLE_ADD_PROPERTY,
  ALL_PROPERTIES,
  ALL_PROPERTIES_LOADING,
  ALL_PROPERTIES_ERROR,
  SEARCH_LOCATION,
  SET_CURRENT_PROPERTY,
  CLEAR_NEW_PROPERTY,
  SET_INSPECTION_TIME,
  SET_AUCTION_DATE,
  PROPERTY_SEARCH_RESULTS,
  PROPERTY_SEARCH_IS_LOADING,
  CLEAR_PROPERTY_SEARCH_RESULTS,
  PROPERTY_SEARCH_FILTERS,
  SET_HASHTAGS,
  SET_TRENDINGPROPERTIES
} from '../store/types';

const initialState = {
  allProperties: [],
  allPropertiesLoading: false,
  allPropertiesError: 0,
  trendingProperties: [],
  currentPropertyId: null,
  currentProperty: null,
  searchLocation: [],
  searchFilters: {
    campaignType: 'PRIVATE_SALE',
    propertyType: 'house',
    price: [200000, 10000000],
    bedrooms: [1],
    bathrooms: [1],
    carSpace: [0],
    suburb: null,
    state: null,
    country: null,
  },
  newPropertyDetails: undefined,
  newPropertyCampaign: undefined,
  newPropertyCreated: null,
  inspectionTimes: [],
  auctionDates: [],
  searchResults: null,
  isSearchLoading: false,
  hashtags: null,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case HANDLE_ADD_PROPERTY:
      return {
        ...state,
        newPropertyDetails: {
          ...state.newPropertyDetails,
          ...action.payload.property,
        },
        newPropertyCampaign: {
          ...state.newPropertyCampaign,
          ...(action.payload.campaign ? action.payload.campaign : {}),
        },
        newPropertyCreated: action.payload.created ? action.payload.created : null,
        propertyUpdated: action.payload.updated ? action.payload.updated : null,
      };

    case ALL_PROPERTIES:
      return {
        ...state,
        allProperties: action.payload,
      };

    case ALL_PROPERTIES_LOADING:
      return {
        ...state,
        allPropertiesLoading: action.payload,
      };

    case ALL_PROPERTIES_ERROR:
      return {
        ...state,
        allPropertiesError: action.payload,
      };

    case SEARCH_LOCATION:
      return {
        ...state,
        searchLocation: action.payload,
      };

    case SET_CURRENT_PROPERTY:
      return {
        ...state,
        currentPropertyId: action.payload.id,
        currentProperty: action.payload.property,
      };
    case SET_TRENDINGPROPERTIES:
      //  console.log("Inside Reducers", action)
      return {
        ...state, 
        trendingProperties: action.payload
      }
    case CLEAR_NEW_PROPERTY:
      return {
        ...state,
        newPropertyDetails: undefined,
        newPropertyCampaign: undefined,
      };

    case SET_INSPECTION_TIME:
      return {
        ...state,
        inspectionTimes: action.payload,
      };

    case SET_AUCTION_DATE:
      return {
        ...state,
        auctionDates: action.payload,
      };

    case PROPERTY_SEARCH_RESULTS:
      return {
        ...state,
        searchResults: action.payload,
      };

    case PROPERTY_SEARCH_IS_LOADING:
      return {
        ...state,
        isSearchLoading: action.payload,
      };

    case CLEAR_PROPERTY_SEARCH_RESULTS:
      return {
        ...state,
        searchResults: null,
      };

    case PROPERTY_SEARCH_FILTERS:
      return {
        ...state,
        searchFilters: action.payload,
      };

    case SET_HASHTAGS:
      return {
        ...state,
        hashtags: action.payload,
      };

    default:
      return state;
  }
}
