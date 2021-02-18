export default function formatDateTime(str) {
  const date = new Date(str);
  const hour = date.getHours();
  const min = padZero(date.getMinutes());
  const get12Hour = hours => {
    return hours > 12 ? hours - 12 : hours;
  };
  const getAmPm = hours => {
    return hours >= 12 ? 'PM' : 'AM';
  };

  return `${date.toString().split('GMT+')[0]}at ${get12Hour(hour)}:${min} ${getAmPm(hour)}`;
}

const padZero = number => {
  return number < 10 ? `0${number}` : number;
};
