import {
  AUTH_SUCCESS,
  AUTH_FAIL,
  AUTH_TOKEN_UPDATED,
  USER_LOADED,
  PROFILE_LOADING,
  USER_PROFILE,
  PROFILE_IS_UPDATING,
  CLEAR_USER_PROFILE,
  LOGOUT_SUCCESS,
  RESET_PASSWORD_LOADING,
  RESET_PASSWORD_SUBMITTED,MOBILE_VERIFYING
} from '../store/types';

const initialState = {
  accessToken: false,
  data: {},
  userProfile: {},
  isProfileLoading: false,
  isProfileUpdating: false,
  isResetPasswordLoading: false,
  isResetPasswordSubmitted: false,
  mobile_verify: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case MOBILE_VERIFYING:{
      return{
        ...state,
        mobile_verify: action.payload
      }
    }
    case AUTH_SUCCESS: {
      return {
        ...state,
        accessToken: action.payload.accessToken || false,
        data: action.payload,
      };
    }

    case LOGOUT_SUCCESS:
    case AUTH_FAIL: {
      return {
        ...state,
        accessToken: false,
        data: {},
      };
    }

    case AUTH_TOKEN_UPDATED:
      return {
        ...state,
        accessToken: action.payload,
      };

    case PROFILE_LOADING:
      return {
        ...state,
        isProfileLoading: action.payload,
      };

    case PROFILE_IS_UPDATING:
      return {
        ...state,
        isProfileUpdating: action.payload,
      };

    case USER_PROFILE:
      return {
        ...state,
        userProfile: action.payload,
      };

    case CLEAR_USER_PROFILE:
      return {
        ...state,
        userProfile: action.payload,
      };

    case USER_LOADED: {
      return {
        ...state,
        accessToken: action.payload.accessToken || false,
        data: action.payload,
      };
    }

    case RESET_PASSWORD_LOADING:
      return {
        ...state,
        isResetPasswordLoading: action.payload,
      };

    case RESET_PASSWORD_SUBMITTED:
      return {
        ...state,
        isResetPasswordSubmitted: action.payload,
      };

    default:
      return state;
  }
}
