import request from '../helper/functions/request';
import { handleSnackbar } from '../helper/functions/snackbar';
import {
  ALL_FOLLOWERS,
  ALL_FOLLOWING,
  FOLLOWERS_IS_LOADING,
  FOLLOWING_IS_LOADING,
  FOLLOWING_COUNT,
  ALL_FOLLOWERS_LOADED,
  ALL_FOLLOWING_LOADED,
} from '../store/types';

export const getFollowers = start => async (dispatch, getState) => {
  dispatch({ type: FOLLOWERS_IS_LOADING, payload: true });

  const { followers } = getState().follow;
  const limit = 50;

  try {
    const { data } = await request({
      url: `/follows/followers?start=${start || 0}&limit=${limit}`,
      config: {
        method: 'GET',
      },
    });

    dispatch({
      type: ALL_FOLLOWERS_LOADED,
      payload: data && data.length === 0,
    });

    dispatch({
      type: ALL_FOLLOWERS,
      payload: start ? followers.concat(data) : data,
    });
  } catch (error) {
    handleSnackbar({ message: 'Followers could not be fetched. Please retry in a bit.' });
  } finally {
    dispatch({ type: FOLLOWERS_IS_LOADING, payload: false });
  }
};

export const getFollowing = start => async (dispatch, getState) => {
  dispatch({ type: FOLLOWING_IS_LOADING, payload: true });

  const { following } = getState().follow;
  const limit = 50;

  try {
    const { data } = await request({
      url: `/follows/following?start=${start || 0}&limit=${limit}`,
      config: {
        method: 'GET',
      },
    });

    dispatch({
      type: ALL_FOLLOWING_LOADED,
      payload: data && data.length === 0,
    });

    dispatch({
      type: ALL_FOLLOWING,
      payload: start ? following.concat(data) : data,
    });
  } catch (error) {
    console.log(error);
    handleSnackbar({ message: 'Error getting users you follow. Please retry in a bit.' });
  } finally {
    dispatch({ type: FOLLOWING_IS_LOADING, payload: false });
  }
};

export const getFollowingCount = () => async dispatch => {
  try {
    const { data } = await request({
      url: '/follows/count',
      config: {
        method: 'GET',
      },
    });

    dispatch({ type: FOLLOWING_COUNT, payload: data.total });
  } catch (error) {
    console.log(error);
  }
};
