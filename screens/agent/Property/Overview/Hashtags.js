import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, SafeAreaView, KeyboardAvoidingView, Text, StyleSheet } from 'react-native';
import GradientButton from '../../../../components/Button';
import { TextArea } from '../../../../components/TextField';
import { handleNewProperty, handleUpdateProperty, handleHashtags } from '../../../../actions/property';

export default function Hashtags({ hashtags, setIsOpen }) {
  const [value, setValue] = React.useState('');
  const [didUpdate, setDidUpdate] = React.useState(false);
  const dispatch = useDispatch();
  const { currentProperty } = useSelector(state => state.property);

  const handleChange = val => {
    setValue(val);
    setDidUpdate(true);

    if (val) {
      dispatch(handleHashtags(val));
    } else {
      dispatch(handleHashtags(null));
    }
  };

  const onUpdate = () => {
    if (didUpdate && value) {
      // Only dispatch actions if hashtags were updated
      dispatch(handleNewProperty(currentProperty.property));
      dispatch(handleUpdateProperty(currentProperty.campaign));
    }

    setIsOpen && setIsOpen(false);
  };

  useEffect(() => {
    if (hashtags && hashtags.length) {
      const values = hashtags.map(tag => {
        return tag.name;
      });

      setValue(values.join(' '));
    }
  }, [hashtags]);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView style={styles.container} enabled={true} keyboardVerticalOffset={100} behavior="padding">
          <View style={styles.header}>
            <Text style={styles.headerText}>Provide hashtags to help people search and find out something special about this property</Text>
          </View>

          <View style={styles.formGroup}>
            <TextArea
              title="#Hashtags"
              labelType="text"
              value={value}
              placeholder="Separated by a space, e.g. #mansion #sydney"
              maxLength={80}
              handleChange={text => handleChange(text)}
            />
          </View>

          <View style={styles.btnContainer}>
            <GradientButton onPress={() => onUpdate()}>DONE</GradientButton>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  btnContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 25,
  },
  formGroup: {
    paddingTop: 22,
  },
  header: {
    paddingTop: 25,
    paddingBottom: 23,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderBottomWidth: 0.5,
  },
  headerText: {
    fontSize: 15,
    lineHeight: 18,
    fontFamily: 'font-light',
  },
  italic: {
    fontStyle: 'italic',
  },
  label: {
    fontSize: 15,
    color: '#000',
    marginBottom: 4,
    fontFamily: 'font-regular',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
