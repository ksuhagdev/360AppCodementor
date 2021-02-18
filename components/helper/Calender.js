import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { CalendarList } from 'react-native-calendars';
import { colors } from '../../theme/constants';

export default function Calender({ initialDate, onDayPress }) {
  const [selected, setSelected] = useState('');

  const handlePress = day => {
    setSelected(day.dateString);
    onDayPress(day);
  };

  useEffect(() => {
    if (initialDate) {
      setSelected(dayjs(initialDate).format('YYYY-MM-DD'));
    }
  }, [initialDate]);

  return (
    <CalendarList
      minDate={new Date()}
      pastScrollRange={0}
      futureScrollRange={12}
      showScrollIndicator={true}
      scrollEnabled={true}
      onDayPress={handlePress}
      theme={{
        todayTextColor: colors.primary,
        dayTextColor: '#000',
        textDisabledColor: 'rgba(0,0,0,0.4)',
        monthTextColor: '#000',
        textDayFontFamily: 'font-light',
        textDayFontSize: 13,
        textMonthFontFamily: 'font-regular',
        textMonthFontSize: 15,
        textDayHeaderFontFamily: 'font-light',
        textDayHeaderFontSize: 12,
        'stylesheet.calendar.header': {
          header: {
            alignItems: 'flex-start',
          },
        },
      }}
      markedDates={{
        [selected]: { selected: true, marked: true, selectedColor: '#d81b60' },
      }}
    />
  );
}
