import React, { useEffect } from 'react';
import { View, ScrollView, Alert, StatusBar, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import GradientButton from '../../../../../components/Button';
import ListItem from '../../../../../components/List/ListItem';
import Switch from '../../../../../components/helper/Switch';
import { TextArea, CashTextField } from '../../../../../components/TextField';
import { handleNewPropertyCampaign, handleUpdateProperty } from '../../../../../actions/property';

export default function RentalSetup({ navigation }) {
  const { register, handleSubmit, errors, setValue, triggerValidation } = useForm({
    mode: 'onChange',
  });

  const [state, setState] = React.useState({
    pets_allowed: false,
    is_furnished: false,
    notes: null,
    weekly_rent: '0',
    bond: '0',
  });
  const dispatch = useDispatch();
  const created = useSelector(store => store.property.newPropertyCreated);
  const updated = useSelector(store => store.property.propertyUpdated);
  const { newPropertyCampaign } = useSelector(store => store.property);

  useEffect(() => {
    register({ name: 'bond' }, { required: true });
    register({ name: 'weekly_rent' }, { required: true });
  }, [register]);

  const handleChange = (value, key) => {
    setState({ ...state, [key]: value });
    setValue(key, value);
    triggerValidation();
  };

  const handleBtnSubmit = () => {
    triggerValidation();
    const { weekly_rent, bond } = state;

    if (weekly_rent && bond) {
      const data = {
        ...state,
        weekly_rent: parseInt(weekly_rent, 10),
        bond: parseInt(bond, 10),
        type: 'rental',
      };

      if (navigation.getParam('editing', false)) {
        dispatch(handleUpdateProperty(data));
      } else {
        dispatch(handleNewPropertyCampaign(data));
      }
    } else {
      Alert.alert('Please specify the weekly rent and bond amounts before proceeding');
    }
  };

  useEffect(() => {
    if (navigation.getParam('editing', false)) {
      setState({
        pets_allowed: newPropertyCampaign ? newPropertyCampaign.pets_allowed : false,
        is_furnished: newPropertyCampaign ? newPropertyCampaign.is_furnished : false,
        notes: newPropertyCampaign ? newPropertyCampaign.notes : null,
        weekly_rent: newPropertyCampaign ? parseFloat(newPropertyCampaign.weekly_rent) || 0 : 0,
        bond: newPropertyCampaign ? parseFloat(newPropertyCampaign.bond) || 0 : 0,
      });
      setValue('bond', newPropertyCampaign.bond);
      setValue('weekly_rent', newPropertyCampaign.weekly_rent);
    }

    if (created) {
      navigation.pop(4);
    }

    if (updated) {
      navigation.pop(3);
    }
  }, [navigation, created, updated, newPropertyCampaign, register, setValue]);

  return (
    <View style={styles.container}>
      <StatusBar translucent={true} backgroundColor={'rgba(0, 0, 0, 0.1)'} barStyle="dark-content" />
      <ScrollView style={styles.scrollView}>
        <View>
          <CashTextField title="Bond" name="bond" placeholder="Bond" value={state.bond} handleChange={value => handleChange(value, 'bond')} errors={errors} />

          <CashTextField
            title="Weekly Rent"
            name="weekly_rent"
            placeholder="Weekly Rent"
            value={state.weekly_rent}
            handleChange={value => handleChange(value, 'weekly_rent')}
            errors={errors}
          />

          <ListItem
            text="Pets allowed?"
            hasBorderBottom
            activeOpacity={1}
            customComponent={<Switch value={state.pets_allowed} handleChange={value => handleChange(value, 'pets_allowed')} />}
          />
          <ListItem
            text="Furnished?"
            hasBorderBottom
            activeOpacity={1}
            customComponent={<Switch value={state.is_furnished} handleChange={value => handleChange(value, 'is_furnished')} />}
          />
          <TextArea
            title="Notes"
            containerStyles={styles.textArea}
            value={state.notes}
            placeholder="If available provide any additional info"
            maxLength={280}
            handleChange={text => handleChange(text, 'notes')}
          />
        </View>
      </ScrollView>

      <View style={styles.btnContainer}>
        <GradientButton onPress={handleSubmit(handleBtnSubmit)}>DONE</GradientButton>
      </View>
    </View>
  );
}

RentalSetup.navigationOptions = {
  title: 'Rental Setup',
};

const styles = StyleSheet.create({
  btnContainer: {
    justifyContent: 'flex-end',
  },
  container: {
    padding: 20,
    paddingTop: 0,
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingVertical: 20,
  },
  textArea: {
    marginTop: 18,
  },
});
