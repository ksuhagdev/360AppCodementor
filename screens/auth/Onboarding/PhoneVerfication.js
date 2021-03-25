import React, { useState, useRef } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
  TouchableOpacity,
  Text,
  Alert,
  Dimensions
} from "react-native";
import PhoneInput from "react-native-phone-number-input";
import { Colors } from "react-native/Libraries/NewAppScreen";
import GradientButton from '../../../components/Button';
import {useSelector, useDispatch} from 'react-redux';
import * as account from '../../../actions/account-actions'
import axios from 'axios';
export default PhoneVerfication = (props) => {
  const [value, setValue] = useState("");
  const [formattedValue, setFormattedValue] = useState("");
  const [valid, setValid] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const phoneInput = useRef(null);
  const dispatch = useDispatch();
  const {width, height} =Dimensions.get('window')

  return (

    <>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <View style={{justifyContent: 'center', alignItems: 'center', marginTop:10}} >
          <Text style={{color:'grey', fontSize:16, justifyContent:'center'}}> Complete account setup  </Text>
        </View>
        <SafeAreaView style={styles.wrapper}>
          {showMessage && (
            <View style={styles.message}>
              
              <Text>Please Check your number again {formattedValue}</Text>
              
            </View>
          )}

<View style={{justifyContent: 'center', alignItems: 'center', marginTop:height/3 -200}}>
              <Text style={{fontSize:25, fontWeight: 'bold', fontFamily:'Montserrat',}}> Verify your phone number </Text>
              <Text style={{textAlign: 'center', marginTop: 20, fontFamily:'Montserrat',}}> To finish setting up your account, we'll need to send you a confirmation code. </Text>
            </View>


          <PhoneInput
            ref={phoneInput}
            defaultValue={value}
            defaultCode="AU"
            layout="first"
            onChangeText={(text) => {
              setValue(text);
              setValid(phoneInput.current?.isValidNumber(text));
              console.log("Is Phone Number Valid",phoneInput.current?.isValidNumber(text))
            }}
            onChangeFormattedText={(text) => {
              setFormattedValue(text);
            }}
            //withDarkTheme
            //withShadow
            autoFocus
          />
          {/* <View style={styles.buttonWrapper}> */}
           
          {valid ? <GradientButton
            style={{marginTop: 20,width:300}}
            
            onPress={async () => {
                console.log("Value",props.navigation.getParam('type'))
              const checkValid = phoneInput.current?.isValidNumber(value);
              // setShowMessage(true);
              // setValid(checkValid ? checkValid : false);
              if(checkValid) {
                try{
                  
                await dispatch(account.phoneNumberVerification(formattedValue,props.navigation.getParam('type')))
                props.navigation.navigate('VerificationCode',{mobno: formattedValue, type: props.navigation.getParam('type')})
                // props.navigation.navigate('Username',{mobno: formattedValue, type: props.navigation.getParam('type')})

                }catch(e){
                  Alert.alert("Server Error",e.message)
                }
                console.log("navigation.getParam('mobno'),",props.navigation.getParam('type'))

              }
            }}
          >
            Send confirmation code
          </GradientButton> : <TouchableOpacity style={{marginTop: 40,width:300,paddingVertical:15, backgroundColor:'gray'}}><Text style={{backgroundColor: 'transparent',
    fontSize: 14,
    color: '#fff',
    fontFamily: 'font-bold',
    textTransform: 'uppercase',textAlign: 'center'}}>Send confirmation code</Text></TouchableOpacity>}
          
          <View style={{justifyContent: 'center', alignItems: 'center', marginTop:20}}>
            <Text  style={{color:'grey', fontSize:16, justifyContent:'center'}}>Standard message, call and data rates may apply</Text>
          </View>

          <TouchableOpacity
            style={{marginTop: 20, justifyContent: 'center'}}
            
            onPress={() => {
                
                props.navigation.pop()
              
            }}
          >
            <Text style={{textDecorationLine:'underline'}}>Go Back</Text>
          </TouchableOpacity>
          {/* </View> */}
         
        </SafeAreaView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',

    },
    wrapper: {
      flex: 1,
      // justifyContent: 'center',
      alignItems: 'center',
    },
    button: {
      marginTop: 20,
      height: 50,
      borderRadius:20,
      width: 300,
      justifyContent: 'center',
      alignItems: 'center',
    //   backgroundColor: '#7CDB8A',
      shadowColor: 'rgba(0,0,0,0.4)',
      shadowOffset: {
        width: 1,
        height: 5,
      },
      shadowOpacity: 0.34,
      shadowRadius: 6.27,
      elevation: 10,
    },
    buttonText:{
      color: 'white',
      fontSize: 14,
    },
    redColor: {
      backgroundColor: '#F57777'
    },
    message: {
      borderWidth: 1,
      borderRadius: 5,
      padding: 20,
      marginBottom: 20,
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
  });