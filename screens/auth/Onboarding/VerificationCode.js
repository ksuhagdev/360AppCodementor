import {Animated, Image, SafeAreaView, Text, View, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import loader from '../../../assets/lottie-animations/loader.json'
import AnimatedLoader from "react-native-animated-loader";
import GradientButton from '../../../components/Button'
import {useSelector, useDispatch} from 'react-redux'
import styles, {
  ACTIVE_CELL_BG_COLOR,
  CELL_BORDER_RADIUS,
  CELL_SIZE,
  DEFAULT_CELL_BG_COLOR,
  NOT_EMPTY_CELL_BG_COLOR,
} from './styles';
import axios from 'axios';
import * as account from '../../../actions/account-actions'
const {Value, Text: AnimatedText} = Animated;

const CELL_COUNT = 6;
const source = {
  uri:
    'https://user-images.githubusercontent.com/4661784/56352614-4631a680-61d8-11e9-880d-86ecb053413d.png',
};

const animationsColor = [...new Array(CELL_COUNT)].map(() => new Value(0));
const animationsScale = [...new Array(CELL_COUNT)].map(() => new Value(1));
const animateCell = ({hasValue, index, isFocused}) => {
  Animated.parallel([
    Animated.timing(animationsColor[index], {
      useNativeDriver: false,
      toValue: isFocused ? 1 : 0,
      duration: 250,
    }),
    Animated.spring(animationsScale[index], {
      useNativeDriver: false,
      toValue: hasValue ? 0 : 1,
      duration: hasValue ? 300 : 250,
    }),
  ]).start();
};

export default VerificationCode = ({navigation}) => {
    console.log("Verification Code",navigation.getParam('mobno'))
    // console.log("Verification Code", props)
  const [value, setValue] = useState('');
  const [loader,setLoader] = useState(false)
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
const {mobile_verify} = useSelector(state => state.account);
const dispatch = useDispatch();
  const renderCell = ({index, symbol, isFocused}) => {
    const hasValue = Boolean(symbol);
    const animatedCellStyle = {
      backgroundColor: hasValue
        ? animationsScale[index].interpolate({
            inputRange: [0, 1],
            outputRange: [NOT_EMPTY_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
          })
        : animationsColor[index].interpolate({
            inputRange: [0, 1],
            outputRange: [DEFAULT_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
          }),
      borderRadius: animationsScale[index].interpolate({
        inputRange: [0, 1],
        outputRange: [CELL_SIZE, CELL_BORDER_RADIUS],
      }),
      transform: [
        {
          scale: animationsScale[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0.2, 1],
          }),
        },
      ],
    };

    // Run animation on next event loop tik
    // Because we need first return new style prop and then animate this value
    setTimeout(() => {
      animateCell({hasValue, index, isFocused});
    }, 0);

    return (
      <AnimatedText
        key={index}
        style={[styles.cell, animatedCellStyle]}
        onLayout={getCellOnLayoutHandler(index)}>
        {symbol || (isFocused ? <Cursor /> : null)}
      </AnimatedText>
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      <Text style={styles.title}>Verification</Text>
      <Image style={styles.icon} source={source} />
      <Text style={styles.subTitle}>
        Please enter the verification code{'\n'}
        we send to {navigation.getParam('mobno')}
      </Text>

      <CodeField
        ref={ref}
        {...props}
        value={value}
        onChangeText={setValue}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={renderCell}
      />
      {/* <View style={styles.nextButton}>
        {/* <Text style={styles.nextButtonText}>Verify</Text> */}
        
      {/* </View> */} 
      <AnimatedLoader
        visible={loader}
        // overlayColor="rgba(255,255,255,0.75)"
        source={require('../../../assets/lottie-animations/loader2.json')}
        animationStyle={styles.lottie}
        speed={1}
      ></AnimatedLoader>
      <View style={{alignItems: 'center'}}>
      <GradientButton
            style={{marginTop: 20,width:300, justifyContent: 'center'}}
            
            onPress={async() => {
                console.log("Value",value)
            //   const checkValid = phoneInput.current?.isValidNumber(value);
            //   setShowMessage(true);
            //   setValid(checkValid ? checkValid : false);
            try{
              
              // setLoader(true);
              // navigation.navigate('UNAUTHED');
              if(navigation.getParam('type') == 'userSignUp' || navigation.getParam('type') == 'agentSignup'){
                await dispatch(account.verifyNumber(navigation.getParam('mobno'), value))

                navigation.navigate('Username',{type: navigation.getParam('type'), mobno: navigation.getParam('mobno')});
              }
              if(navigation.getParam('type') == 'userLogin'){
                console.log("TYPE ",navigation.getParam('type'))
                await dispatch(account.userlogin(navigation.getParam('mobno'), value,navigation))
                console.log("User Login Pressed")
              }
            }catch(e){
              console.log("Error",e)
            }
              

            
                
              // navigation.navigate('UNAUTH')
              // if(mobile_verify){
              //   // setLoader(true);
              //   // setInterval(() => {

              //   // },500);
                
              // }
            //   if(checkValid) {
            //     dispatch(account.phoneNumberVerification(formattedValue))
            //     props.navigation.navigate('VerificationCode',{mobno: formattedValue})
            //   }
            }}
          >
            Check
          </GradientButton>
          <TouchableOpacity onPress={()=> navigation.pop()}>
            <Text>Go Back</Text>
          </TouchableOpacity>
      </View>
      
    </SafeAreaView>
  );
};

