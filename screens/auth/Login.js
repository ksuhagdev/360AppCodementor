import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { View, ScrollView, Text, Alert, TouchableOpacity, StatusBar, StyleSheet } from 'react-native';
import ActionSheet from 'react-native-action-sheet';
import { login } from '../../actions/account-actions';
import BorderButton from '../../components/Button/BorderButton';
import GradientButton from '../../components/Button';
import { TitleTextField } from '../../components/TextField';
import { colors } from '../../theme/constants';

export default function Login({ navigation }) {
  const { register, handleSubmit, errors, setValue, triggerValidation } = useForm({
    mode: 'onChange',
  });

  const [state, setState] = React.useState({
    email: '',
    password: '',
  });
  const dispatch = useDispatch();

  useEffect(() => {
    register(
      { name: 'email' },
      {
        required: true,
        pattern: {
          // eslint-disable-next-line no-control-regex
          value: /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i,
          message: 'Enter a valid email address',
        },
      },
    );
    register({ name: 'password' }, { required: true });
  }, [register]);

  const handleChange = (value, key) => {
    setState({ ...state, [key]: value });
    setValue(key, value);
    // triggerValidation();
  };

  const handleOnPress = () => {
    const { email, password } = state;

    if (email && password) {
      dispatch(login(state, navigation));
    } else {
      Alert.alert('Please enter your email and password');
    }
  };

  const showSignupOptions = () => {
    const options = ['Signup as a User', 'Signup as an Agent', 'Cancel'];

    ActionSheet.showActionSheetWithOptions(
      {
        options,
        title: 'Sign up to 360app',
        cancelButtonIndex: 2,
      },
      buttonIndex => {
        switch (buttonIndex) {
          case 0:
            navigation.navigate('SignupAsUser');
            break;
          case 1:
            navigation.navigate('SignupAsAgent');
            break;
        }
      },
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent={true} backgroundColor="rgba(0, 0, 0, 0.1)" barStyle="dark-content" />

      <ScrollView style={styles.scrollContainer} keyboardDismissMode="interactive">
        <Text style={styles.header}>Login to your account</Text>

        <TitleTextField
          title="Email"
          name="email"
          value={state.email}
          autoCapitalize="none"
          autoCompleteType="email"
          autoCorrect={false}
          keyboardType="email-address"
          placeholder="Enter your email"
          handleChange={text => handleChange(text, 'email')}
          errors={errors}
        />

        <View style={styles.formGroup}>
          <TitleTextField
            title="Password"
            name="password"
            value={state.password}
            placeholder="Enter your Password"
            autoCompleteType="password"
            autoCorrect={false}
            secureTextEntry
            handleChange={text => handleChange(text, 'password')}
            errors={errors}
          />
        </View>

        <View style={[styles.formGroup, styles.flexEnd]}>
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.ctaText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.btnContainer}>
          <GradientButton onPress={handleSubmit(handleOnPress)}>Login</GradientButton>
        </View>

        <View>
          <BorderButton onPress={() => navigation.navigate('UNAUTHED')}>Continue as Guest</BorderButton>
        </View>

        <View style={styles.signUp}>
          <Text styles={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => showSignupOptions()}>
            <Text style={styles.ctaText}>Sign up!</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

Login.navigationOptions = {
  title: 'Login',
  headerShown: false,
};

const styles = StyleSheet.create({
  btnContainer: {
    marginTop: 40,
    marginBottom: 20,
  },
  container: {
    flex: 1,
  },
  ctaText: {
    fontFamily: 'font-bold',
    fontSize: 14,
    color: colors.primary,
    paddingLeft: 3,
  },
  flexEnd: {
    alignItems: 'flex-end',
  },
  formGroup: {
    marginTop: 25,
  },
  header: {
    fontFamily: 'font-bold',
    fontSize: 22,
    paddingVertical: 50,
    textAlign: 'center',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingVertical: 25,
  },
  signUp: {
    marginTop: 70,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signupText: {
    fontSize: 12,
    fontFamily: 'font-light',
  },
});
