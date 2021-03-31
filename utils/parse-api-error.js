const parseError = error => {
  let message = '';
  console.log('Error', error)
  if (error && error.message) {
    if (typeof error.message === 'string') {
      message = error.message;
    } else if (typeof error.message === 'object') {
      message = error.message.message;
    }
  }

  return message;
};

export default parseError;
