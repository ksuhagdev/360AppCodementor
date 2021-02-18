import {
  ALL_FOLLOWERS,
  FOLLOWERS_IS_LOADING,
  ALL_FOLLOWING,
  FOLLOWING_IS_LOADING,
  FOLLOWERS_COUNT,
  FOLLOWING_COUNT,
  ALL_FOLLOWING_LOADED,
  ALL_FOLLOWERS_LOADED,
} from '../store/types';

const initialState = {
  followers: [],
  following: [],
  followersCount: 0,
  followingCount: 0,
  isFollowersLoading: false,
  isFollowingLoading: false,
  allFollowingLoaded: false,
  allFollowersLoaded: false,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ALL_FOLLOWERS:
      return {
        ...state,
        followers: action.payload,
      };

    case ALL_FOLLOWING:
      return {
        ...state,
        following: action.payload,
      };

    case FOLLOWERS_COUNT:
      return {
        ...state,
        followersCount: action.payload,
      };

    case FOLLOWING_COUNT:
      return {
        ...state,
        followingCount: action.payload,
      };

    case FOLLOWERS_IS_LOADING:
      return {
        ...state,
        isFollowersLoading: action.payload,
      };

    case FOLLOWING_IS_LOADING:
      return {
        ...state,
        isFollowingLoading: action.payload,
      };

    case ALL_FOLLOWING_LOADED:
      return {
        ...state,
        allFollowingLoaded: action.payload,
      };

    case ALL_FOLLOWERS_LOADED:
      return {
        ...state,
        allFollowersLoaded: action.payload,
      };

    default:
      return state;
  }
}
