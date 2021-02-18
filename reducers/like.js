import { LIKED_PROPERTIES, CLEAR_LIKED_PROPERTIES, LIKED_PROPERTIES_COUNT, LIKED_PROPERTIES_IS_LOADING } from '../store/types';

const initialState = {
  likedProperties: [],
  likedCount: 0,
  isLikedLoading: false,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LIKED_PROPERTIES:
    case CLEAR_LIKED_PROPERTIES:
      return {
        ...state,
        likedProperties: action.payload,
      };

    case LIKED_PROPERTIES_COUNT:
      return {
        ...state,
        likedCount: action.payload,
      };

    case LIKED_PROPERTIES_IS_LOADING:
      return {
        ...state,
        isLikedLoading: action.payload,
      };

    default:
      return state;
  }
}
