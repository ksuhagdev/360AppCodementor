import {
  AGENT_PROFILE,
  AGENT_PROFILE_IS_LOADING,
  AGENT_PROFILE_IS_UPDATING,
  CLEAR_AGENT_PROFILE,
  AGENT_LIVE_PROPERTIES,
  AGENT_DRAFT_PROPERTIES,
  AGENT_LIVE_PROPERTIES_LOADING,
  AGENT_DRAFT_PROPERTIES_LOADING,
  CLEAR_AGENT_LIVE_PROPERTIES,
  CLEAR_AGENT_DRAFT_PROPERTIES,
} from '../store/types';
import request from '../helper/functions/request';
import parseError from '../utils/parse-api-error';
import { setData } from '../helper/functions/storage';
import { handleSnackbar } from '../helper/functions/snackbar';
// import axios from 'axios'

export const getAgentProfileDetails = id => async dispatch => {
  dispatch({ type: AGENT_PROFILE_IS_LOADING, payload: true });

  try {
    const { data } = await request({
      url: `/agents/${id}`,
      config: {
        method: 'GET',
      },
    });

    dispatch({
      type: AGENT_PROFILE,
      payload: data,
    });
  } catch (error) {
    handleSnackbar({
      message: parseError(error.response.data),
    });
  } finally {
    dispatch({ type: AGENT_PROFILE_IS_LOADING, payload: false });
  }
};

export const clearProfile = () => {
  return {
    type: CLEAR_AGENT_PROFILE,
  };
};

export const updateProfile = () => async (dispatch, getState) => {
  dispatch({ type: AGENT_PROFILE_IS_UPDATING, payload: true });

  const { agentProfile } = getState().agent;

  try {
    const { data } = await request({
      url: `/agents/${agentProfile.agent.id}`,
      config: {
        method: 'POST',
        body: { agent: agentProfile.agent },
      },
    });

    await setData('agent', data);

    dispatch({
      type: AGENT_PROFILE,
      payload: data,
    });
    handleSnackbar({ message: 'Agent profile updated.', type: 'success' });
  } catch (error) {
    handleSnackbar({ message: parseError(error.response.data) });
  } finally {
    dispatch({ type: AGENT_PROFILE_IS_UPDATING, payload: false });
  }
};

export const getLiveProperties = agentId => async (dispatch, getState) => {
  dispatch({ type: AGENT_LIVE_PROPERTIES_LOADING, payload: true });

  const { agentLiveProperties } = getState().agent;
  const start = agentLiveProperties.length;
  const limit = 25;

  

  try {
    const { data } = await request({
      url: `/agents/${agentId}/properties?status=true&includeVideos=true&start=${start}&limit=${limit}`,
      config: {
        method: 'GET',
      },
    });
    console.log("Data from Server for Live Properties", data)
    dispatch({
      type: AGENT_LIVE_PROPERTIES,
      payload: data,
    });

    dispatch({ type: AGENT_LIVE_PROPERTIES_LOADING, payload: false });
  } catch (error) {
    handleSnackbar({
      message: parseError(error.response.data),
    });
  }
};



export const getDraftProperties = agentId => async (dispatch, getState) => {
  dispatch({ type: AGENT_DRAFT_PROPERTIES_LOADING, payload: true });

  const { agentDraftProperties } = getState().agent;
  const start = agentDraftProperties.length;
  const limit = 25;

  try {
    const { data } = await request({
      url: `/agents/${agentId}/properties?status=false&includeVideos=true&start=${start}&limit=${limit}`,
      config: {
        method: 'GET',
      },
    });

    dispatch({
      type: AGENT_DRAFT_PROPERTIES,
      payload: data,
    });

    dispatch({ type: AGENT_DRAFT_PROPERTIES_LOADING, payload: false });
  } catch (error) {
    handleSnackbar({
      message: parseError(error.response.data),
    });
  }
};

export const clearLiveProperties = () => dispatch => {
  dispatch({
    type: CLEAR_AGENT_LIVE_PROPERTIES,
  });
};

export const clearDraftProperties = () => dispatch => {
  dispatch({
    type: CLEAR_AGENT_DRAFT_PROPERTIES,
  });
};
