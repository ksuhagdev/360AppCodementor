const parseError = error => {
  let message = '';

  if (error && error.message) {
    if (typeof error.message === 'string') {
      message = error.message;
    } else if (typeof error.message === 'object') {
      message = error.message.error;
    }
  }

  return message;
};

export default parseError;
