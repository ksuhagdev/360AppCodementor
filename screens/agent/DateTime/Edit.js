import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { SafeAreaView, ScrollView, View, StyleSheet } from 'react-native';
import dayjs from 'dayjs';
import BorderButton from '../../../components/Button/BorderButton';
import GradientButton from '../../../components/Button';
import TimeSlider from '../../../components/helper/TimeSlider';
import Calender from '../../../components/helper/Calender';
import ColorFade from '../../../components/helper/ColorFade';
import { handleSnackbar } from '../../../helper/functions/snackbar';
import { addInspectionTime, updateInspectionTime } from '../../../actions/property/inspection';
import { addAuctionDate, updateAuctionDate } from '../../../actions/property/auction_date';

export default function EditDateAndTime({ type, date, isEditing, onCreate, onUpdate, onClose }) {
  const [state, setState] = useState({
    time: [10],
    date: null,
  });
  const dispatch = useDispatch();

  const handleChange = (value, key) => {
    setState({ ...state, [key]: value });
  };

  const handleOnPress = day => {
    handleChange(day.dateString, 'date');
  };

  const handleAddPress = () => {
    const dateTime = state.date ? new Date(state.date) : new Date();

    dateTime.setHours(parseInt(state.time, 10));
    dateTime.setMinutes((state.time * 60) % 60);

    if (!date) {
      if (type === 'inspection') {
        dispatch(addInspectionTime(dateTime));
      } else if (type === 'auction') {
        if (isEditing) {
          // If the associated property is being updated, call the API
          dispatch(addAuctionDate(dateTime));
        } else {
          // Return the dateTime to the parent and let it deal with it
          try {
            onCreate(dateTime);
            handleSnackbar({ type: 'success', message: 'Auction date added' });
          } catch (e) {
            console.error(e);
          }
        }
      }
    } else {
      if (type === 'inspection') {
        dispatch(updateInspectionTime(date, dateTime));
      } else if (type === 'auction') {
        if (isEditing) {
          // If the associated property is being updated, call the API directly
          dispatch(updateAuctionDate(date, dateTime));
        } else {
          // Return the dateTime to the parent and let it deal with it
          try {
            onUpdate(dateTime, date.id);
            handleSnackbar({ type: 'success', message: 'Auction date updated' });
          } catch (e) {
            console.error(e);
          }
        }
      }
    }
  };

  useEffect(() => {
    if (type === 'inspection') {
      setState({
        time: [10],
        date: date ? dayjs(date.inspection_date_time).toDate() : null,
      });
    } else if (type === 'auction') {
      setState({
        time: [10],
        date: date ? dayjs(date.auction_date_time).toDate() : null,
      });
    }

    if (state.date) {
      const hours = dayjs(state.date).format('H');
      const hourValue = parseInt(hours, 10);
      const minutes = dayjs(state.date).format('m');
      const minuteValue = parseFloat(minutes / 60);

      setState({
        date: state.date,
        time: [hourValue + minuteValue],
      });
    }
  }, [date, type, state.date]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Calender initialDate={state.date} onDayPress={handleOnPress} />
      </ScrollView>

      <View style={styles.containerView}>
        <ColorFade height={60} top={-60} colors={['rgba(255, 255, 255, 0.1)', '#fff']} />

        <View style={styles.switchContainer}>
          <TimeSlider text="Select Time" sliderValues={state.time} handleSliderChange={values => handleChange(values, 'time')} />
        </View>

        <GradientButton onPress={handleAddPress}>
          {date && 'UPDATE'}
          {!date && 'ADD'}
        </GradientButton>

        <BorderButton onPress={() => onClose(false)} style={styles.closeButton}>
          Close
        </BorderButton>
      </View>
    </SafeAreaView>
  );
}

EditDateAndTime.navigationOptions = {
  title: 'Edit Date & Time',
};

const styles = StyleSheet.create({
  closeButton: {
    marginTop: 10,
  },
  container: {
    flex: 1,
  },
  containerView: {
    paddingHorizontal: 20,
    zIndex: 1,
    position: 'relative',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0,0,0,0.2)',
  },
  switchContainer: {
    paddingBottom: 30,
    alignItems: 'center',
  },
});
