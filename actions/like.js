import request from '../helper/functions/request';
import { handleSnackbar } from '../helper/functions/snackbar';
import { LIKED_PROPERTIES, LIKED_PROPERTIES_COUNT, LIKED_PROPERTIES_IS_LOADING } from '../store/types';

export const getLikedProperties = start => async (dispatch, getState) => {
  dispatch({ type: LIKED_PROPERTIES_IS_LOADING, payload: true });

  const { likedProperties } = getState().like;
  const limit = 50;

  try {
    const { data } = await request({
      url: `/likes?start=${start || 0}&limit=${limit}`,
      config: {
        method: 'GET',
      },
    });

    if (data && data.length) {
      dispatch({
        type: LIKED_PROPERTIES,
        payload: start ? likedProperties.concat(data) : data,
      });
    }
  } catch (error) {
    console.log(error);
    handleSnackbar({ message: 'Liked properties could not be fetched. Please retry in a bit.' });
  } finally {
    dispatch({ type: LIKED_PROPERTIES_IS_LOADING, payload: false });
  }
};

export const getLikedCount = () => async dispatch => {
  try {
    const { data } = await request({
      url: '/likes/count',
      config: {
        method: 'GET',
      },
    });

    dispatch({
      type: LIKED_PROPERTIES_COUNT,
      payload: data.total,
    });
  } catch (error) {
    console.log(error);
  }
};
