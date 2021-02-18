import Snackbar from 'react-native-snackbar';

export const handleSnackbar = ({ type = 'error', message, indefinite, action }) => {
  const config = {
    text: message,
    duration: indefinite ? Snackbar.LENGTH_INDEFINITE : Snackbar.LENGTH_LONG,
    backgroundColor: type === 'error' ? '#d32f2f' : '#2e7d32',
  };

  if (indefinite) {
    if (action) {
      config.action = action;
    } else {
      config.action = {
        text: 'Dismiss',
      };
    }
  } else {
    if (action) {
      config.action = action;
    }
  }

  Snackbar.show(config);
};
