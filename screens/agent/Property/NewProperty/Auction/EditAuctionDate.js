import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, ScrollView, Modal, Alert, StyleSheet } from 'react-native';
import ActionSheet from 'react-native-action-sheet';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import ListItem from '../../../../../components/List/ListItem';
import { getAuctionDates, deleteAuctionDate } from '../../../../../actions/property/auction_date';
import EditDateTime from '../../../DateTime/Edit';
import { SET_AUCTION_DATE } from '../../../../../store/types';

export default function EditAuctionDate({ isEditing, onCreate, onUpdate }) {
  const [showDate, setShowDate] = React.useState(false);
  const [currentDate, setCurrentDate] = React.useState({});
  const { auctionDates } = useSelector(state => state.property);
  const dispatch = useDispatch();
  const ActionSheetButtons = ['Edit date', 'Delete date', 'Cancel'];

  const dateActions = item => {
    ActionSheet.showActionSheetWithOptions(
      {
        options: ActionSheetButtons,
        cancelButtonIndex: 2,
        destructiveButtonIndex: 1,
      },
      buttonIndex => {
        switch (buttonIndex) {
          case 0:
            setCurrentDate(item);
            setShowDate(true);
            break;
          case 1:
            Alert.alert(
              'Delete auction date',
              'Are you sure you want to delete this auction date?',
              [
                {
                  text: 'Yes, Delete',
                  onPress: () => {
                    if (isEditing) {
                      // Call the API directly
                      dispatch(deleteAuctionDate(item));
                    } else {
                      // Delete the auction date from store
                      const dates = auctionDates.filter(date => {
                        return date.id !== item.id;
                      });

                      dispatch({ type: SET_AUCTION_DATE, payload: dates });
                    }
                  },
                },
                { text: 'Cancel', style: 'cancel' },
              ],
              { cancelable: false },
            );
            break;
        }
      },
    );
  };

  const addDate = () => {
    setCurrentDate(null);
    setShowDate(true);
  };

  const formatDateTime = date => {
    dayjs.extend(utc);

    return dayjs(date).format('ddd D MMM [at] h:mm A');
  };

  useEffect(() => {
    if (isEditing) {
      dispatch(getAuctionDates());
    }
  }, [dispatch, isEditing]);

  return (
    <View style={styles.container}>
      <View style={[styles.container, styles.containerView]}>
        <ListItem text={'Add auction date'} hasBorderBottom icon="add" onPress={() => addDate()} />

        <ScrollView style={styles.container}>
          {auctionDates.map(item => (
            <ListItem key={item.id} text={formatDateTime(item.auction_date_time)} hasBorderBottom icon="more" onPress={() => dateActions(item)} />
          ))}
        </ScrollView>
      </View>

      <View>
        <Modal visible={showDate} animationType="slide" onRequestClose={() => setShowDate(false)}>
          <EditDateTime type="auction" date={currentDate} onCreate={onCreate} onUpdate={onUpdate} onClose={setShowDate} />
        </Modal>
      </View>
    </View>
  );
}

EditAuctionDate.navigationOptions = {
  title: 'Auction Dates',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerView: {
    marginTop: 40,
    padding: 0,
  },
  justifyEnd: {
    justifyContent: 'flex-end',
  },
});
