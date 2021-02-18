import { LOADING_STATE } from '../store/types';

export const handleLoading = state => {
  return {
    type: LOADING_STATE,
    payload: state,
  };
};
