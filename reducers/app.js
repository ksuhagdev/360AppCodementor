import { LOADING_STATE } from '../store/types';

const initialState = {
  loading: false,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOADING_STATE: {
      return {
        ...state,
        loading: action.payload,
      };
    }

    default:
      return state;
  }
}
