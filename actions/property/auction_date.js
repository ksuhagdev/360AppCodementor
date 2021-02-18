import { handleLoading } from '../app';
import request from '../../helper/functions/request';
import parseError from '../../utils/parse-api-error';
import { handleSnackbar } from '../../helper/functions/snackbar';
import { SET_AUCTION_DATE } from '../../store/types';

export const getAuctionDates = () => async (dispatch, getState) => {
  const id = getState().property.currentPropertyId;

  try {
    const { data } = await request({
      url: `/properties/${id}/auction-dates`,
      config: { method: 'GET' },
    });

    dispatch({
      type: SET_AUCTION_DATE,
      payload: data,
    });
  } catch (error) {
    handleSnackbar({
      message: parseError(error.response.data),
    });
  }
};

export const addAuctionDate = date => async (dispatch, getState) => {
  const id = getState().property.currentPropertyId;
  dispatch(handleLoading(true));

  try {
    await request({
      url: `/properties/${id}/auction-dates`,
      config: {
        method: 'POST',
        body: { auction_date_time: date },
      },
    });

    dispatch(getAuctionDates());
    handleSnackbar({ message: 'Auction date added', type: 'success' });
  } catch (error) {
    console.log(error.message);
    handleSnackbar({
      message: parseError(error.response.data),
    });
  } finally {
    dispatch(handleLoading(false));
  }
};

export const updateAuctionDate = (previousDate, newDate) => async dispatch => {
  dispatch(handleLoading(true));

  try {
    await request({
      url: `/properties/${previousDate.property_auction_id}/auction-dates/${previousDate.id}`,
      config: {
        method: 'POST',
        body: { auction_date_time: newDate },
      },
    });

    handleSnackbar({ message: 'Auction date updated', type: 'success' });

    dispatch(getAuctionDates());
  } catch (error) {
    handleSnackbar({
      message: parseError(error.response.data),
    });
  } finally {
    dispatch(handleLoading(false));
  }
};

export const deleteAuctionDate = date => async dispatch => {
  dispatch(handleLoading(true));

  try {
    await request({
      url: `/properties/${date.property_auction_id}/auction-dates/${date.id}`,
      config: {
        method: 'DELETE',
      },
    });

    handleSnackbar({ message: 'Auction date deleted', type: 'success' });

    await dispatch(getAuctionDates());
  } catch (error) {
    handleSnackbar({
      message: parseError(error.response.data),
    });
  } finally {
    dispatch(handleLoading(false));
  }
};
