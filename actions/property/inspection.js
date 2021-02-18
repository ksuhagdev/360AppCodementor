import { handleLoading } from '../app';
import request from '../../helper/functions/request';
import parseError from '../../utils/parse-api-error';
import { handleSnackbar } from '../../helper/functions/snackbar';
import { SET_INSPECTION_TIME } from '../../store/types';

export const getAllInspectionTimes = () => async (dispatch, getState) => {
  const id = getState().property.currentPropertyId;
  dispatch(handleLoading(true));

  try {
    const { data } = await request({
      url: `/properties/${id}/inspection-times`,
      config: { method: 'GET' },
    });

    dispatch({
      type: SET_INSPECTION_TIME,
      payload: data,
    });
  } catch (error) {
    handleSnackbar({
      message: parseError(error.response.data),
    });
  } finally {
    dispatch(handleLoading(false));
  }
};

export const addInspectionTime = time => async (dispatch, getState) => {
  const id = getState().property.currentPropertyId;
  dispatch(handleLoading(true));
  try {
    await request({
      url: `/properties/${id}/inspection-times`,
      config: {
        method: 'POST',
        body: { inspection_date_time: time },
      },
    });

    dispatch(getAllInspectionTimes());
    handleSnackbar({ message: 'Inspection time added', type: 'success' });
  } catch (error) {
    handleSnackbar({
      message: parseError(error.response.data),
    });
  } finally {
    dispatch(handleLoading(false));
  }
};

export const updateInspectionTime = (previousTime, newTime) => async dispatch => {
  dispatch(handleLoading(true));
  try {
    await request({
      url: `/properties/${previousTime.property_id}/inspection-times/${previousTime.id}`,
      config: {
        method: 'POST',
        body: { inspection_date_time: newTime },
      },
    });

    dispatch(getAllInspectionTimes());
    handleSnackbar({ message: 'Inspection time updated', type: 'success' });
  } catch (error) {
    handleSnackbar({
      message: parseError(error.response.data),
    });
  } finally {
    dispatch(handleLoading(false));
  }
};

export const deleteInspectionTime = date => async dispatch => {
  dispatch(handleLoading(true));
  try {
    await request({
      url: `/properties/${date.property_id}/inspection-times/${date.id}`,
      config: {
        method: 'DELETE',
      },
    });

    await dispatch(getAllInspectionTimes());

    handleSnackbar({ message: 'Inspection time deleted', type: 'success' });
  } catch (error) {
    handleSnackbar({
      message: parseError(error.response.data),
    });
  } finally {
    dispatch(handleLoading(false));
  }
};
