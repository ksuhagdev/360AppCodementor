import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaView, View, ScrollView, Modal, Alert, StyleSheet } from 'react-native';
import ActionSheet from 'react-native-action-sheet';
import dayjs from 'dayjs';
import ListItem from '../../../../../components/List/ListItem';
import GradientButton from '../../../../../components/Button';
import { getAllInspectionTimes, deleteInspectionTime } from '../../../../../actions/property/inspection';
import EditDateTime from '../../../DateTime/Edit';

export default function EditInspectionTime({ onClose }) {
  const [showDate, setShowDate] = React.useState(false);
  const [currentDate, setCurrentDate] = React.useState(null);
  const { inspectionTimes } = useSelector(state => state.property);
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
            Alert.alert('Delete inspection date', 'Are you sure you want to delete this inspection date?', [
              {
                text: 'Yes, Delete',
                onPress: () => {
                  dispatch(deleteInspectionTime(item));
                },
              },
              { text: 'Cancel', style: 'cancel' },
            ]);
            break;
        }
      },
    );
  };

  const addInspectionTime = () => {
    setCurrentDate(null);
    setShowDate(true);
  };

  const formatDateTime = date => {
    return dayjs(date).format('ddd D MMM [at] h:mm A');
  };

  useEffect(() => {
    dispatch(getAllInspectionTimes());
  }, [dispatch]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.container, styles.containerView]}>
        <ListItem text={'Add inspection date & time'} hasBorderBottom icon="add" onPress={() => addInspectionTime()} />

        <ScrollView style={styles.container}>
          {inspectionTimes.map(item => (
            <ListItem key={item.id} text={formatDateTime(item.inspection_date_time)} hasBorderBottom icon="more" onPress={() => dateActions(item)} />
          ))}
        </ScrollView>

        <View style={styles.justifyEnd}>
          <GradientButton onPress={() => onClose(false)}>DONE</GradientButton>
        </View>
      </View>

      <View>
        <Modal visible={showDate} animationType="slide" onRequestClose={() => setShowDate(false)}>
          <EditDateTime type="inspection" date={currentDate} onClose={setShowDate} />
        </Modal>
      </View>
    </SafeAreaView>
  );
}

EditInspectionTime.navigationOptions = {
  title: 'Edit Inspection Times',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerView: {
    padding: 20,
  },
  justifyEnd: {
    justifyContent: 'flex-end',
  },
});
