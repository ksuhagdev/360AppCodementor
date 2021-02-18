const abbrNumber = num => {
  const decimalPlaces = 1;
  const suffixes = ['', 'K', 'M', 'B', 'T'];

  if (num < 999) {
    return num;
  }

  const power = num.toPrecision(2).split('e'); // get the power
  const place = power.length === 1 ? 0 : Math.floor(Math.min(power[1].slice(1), 14) / 3);
  const decimal = place < 1 ? num.toFixed(decimalPlaces) : (num / 10 ** (place * 3)).toFixed(1 + decimalPlaces);
  const decimalDigits = decimal < 0 ? decimal : Math.abs(decimal);

  return decimalDigits + suffixes[place];
};

export default {
  abbrNumber,
};
