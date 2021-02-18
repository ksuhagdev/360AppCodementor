import dayjs from 'dayjs';
import { decode } from 'base-64';

export const isTokenValid = token => {
  if (token) {
    const payload = getPayload(token);

    return dayjs().isBefore(dayjs(payload.exp * 1000));
  }

  return false;
};

export const isRenewalRequired = token => {
  if (token) {
    if (isTokenValid(token)) {
      const payload = getPayload(token);
      const timeToExpire = dayjs(payload.exp).diff(new Date(), 'day');

      return timeToExpire > 0 && timeToExpire <= 1;
    }

    // token is invalid, so it cannot be renewed
    return false;
  }

  return false;
};

export const getPayload = token => {

  if (token) {
    const payload = token.split('.')[1];

    return JSON.parse(decode(payload));
  }

  return null;
};
