import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, SafeAreaView, KeyboardAvoidingView, Text, StyleSheet, Keyboard, StatusBar } from 'react-native';
import { useForm } from 'react-hook-form';
import GradientButton from '../../components/Button';
import AlertMessage from '../../components/AlertMessage';
import { TitleTextField } from '../../components/TextField';
import { resetPassword } from '../../actions/account-actions';
import { RESET_PASSWORD_SUBMITTED } from '../../store/types';

export default function ForgotPassword({ navigation }) {
  const [email, setEmail] = React.useState(null);
  const dispatch = useDispatch();
  const { isResetPasswordLoading, isResetPasswordSubmitted } = useSelector(state => state.account);
  const { register, handleSubmit, errors, setValue, triggerValidation } = useForm({
    mode: 'onChange',
  });

  const onSubmit = () => {
    Keyboard.dismiss();
    triggerValidation();

    dispatch(resetPassword(email));
  };

  const handleChange = value => {
    setEmail(value);
    setValue('email', value);
    triggerValidation();
  };

  const goBack = () => {
    navigation.navigate('Login');
  };

  useEffect(() => {
    register('email', {
      required: true,
      pattern: {
        // eslint-disable-next-line no-control-regex, max-len
        value: /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i,
        message: 'Enter a valid email address',
      },
    });

    return () => {
      dispatch({ type: RESET_PASSWORD_SUBMITTED, payload: false });
    };
  }, [register, dispatch]);

  return (
    <View style={styles.container}>
      <StatusBar translucent={true} backgroundColor="rgba(0, 0, 0, 0.1)" barStyle="dark-content" />

      <SafeAreaView style={styles.container}>
        {!isResetPasswordSubmitted && (
          <KeyboardAvoidingView style={styles.container} enabled={true} keyboardVerticalOffset={100} behavior="padding">
            <View style={[styles.container, styles.content]}>
              <Text style={styles.title}>Reset your password</Text>

              <Text style={styles.text}>To begin the process of resetting your password, enter the email you signed up with below.</Text>

              <TitleTextField
                title="Email"
                name="email"
                value={email}
                autoCapitalize="none"
                autoCompleteType="email"
                autoCorrect={false}
                keyboardType="email-address"
                placeholder="Enter your email"
                returnKeyType="done"
                handleChange={text => handleChange(text, 'email')}
                errors={errors}
              />
            </View>

            <View style={styles.btnContainer}>
              <GradientButton isActive={isResetPasswordLoading} onPress={handleSubmit(onSubmit)}>
                Reset Password
              </GradientButton>
            </View>
          </KeyboardAvoidingView>
        )}

        {isResetPasswordSubmitted && (
          <View style={[styles.container, styles.content]}>
            <AlertMessage
              size={48}
              color="#fff"
              bgColor="#00ad00"
              textColor="#000"
              name="check"
              message="Check your email for instructions to reset your 360app password"
            />

            <GradientButton onPress={() => goBack()}>Okay, got it!</GradientButton>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

ForgotPassword.navigationOptions = {
  title: 'Forgot password',
};

const styles = StyleSheet.create({
  btnContainer: {
    paddingHorizontal: 20,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  text: {
    marginBottom: 40,
    lineHeight: 20,
    textAlign: 'center',
  },
  title: {
    fontFamily: 'font-bold',
    fontSize: 22,
    paddingVertical: 50,
    textAlign: 'center',
  },
});
