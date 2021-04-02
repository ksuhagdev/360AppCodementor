import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet , Dimensions,TouchableOpacity, KeyboardAvoidingView, Platform} from 'react-native';
import { TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Entypo';
import Icons from 'react-native-vector-icons/AntDesign'
import GradientButton from '../../../../components/Button'
const Password = (props) => {
    const [password, SetPassword] = useState('')
    const [retypePassword, setretypePassword] = useState('')
    const [valid, setValid] = useState(false)
    const {width, height} =Dimensions.get('window')
    return (
        <KeyboardAvoidingView  behavior={Platform.OS === 'ios'?'padding':'height'} style={{flex:1,backgroundColor: '#fff', justifyContent: 'center'}}>
        <View style={{justifyContent: 'space-between', alignItems: 'center', }}>
        {/* <Text style={{fontSize:16, fontWeight: 'bold',marginTop:height/5, marginLeft: 5 }}>Set Password</Text> */}

        <TextInput
        // placeholder="Type-in"
        label="Set Password"
        style={{ width: '80%', color: '#FF3257', backgroundColor: '#fff', paddingVertical: 20 }}
        mode='outlined'
        autoCapitalize={false}
        value={password}
        secureTextEntry={true}
        onChangeText={text => {
            SetPassword(text)
        }
        }
    />
 <View style={{
                flexDirection: 'row',
                paddingBottom: 10,
                width: '100%',justifyContent: 'center'
            }}>
<TextInput
        // placeholder="Type-in"
        label="Retype Password"
        style={{ width: '80%', color: '#FF3257', backgroundColor: '#fff', paddingVertical: 20 }}
        mode='outlined'
        autoCapitalize={false}
        value={retypePassword}
        secureTextEntry={true}
        onChangeText={text => {
            if(text == password){
                setValid(true)
            }else{
                setValid(false)
            }
            setretypePassword(text)
        }
        }
    />
     <View style={{ position: 'absolute', right: 50, top: 40 }}>
                    {valid ? <Icons name="checkcircle" size={26} color='green' /> : <Icon name="circle-with-cross" size={26} color='red' />}
                </View>
    </View>
    {/* <Text style={{fontSize:16, fontWeight: 'bold',marginTop:20, marginLeft: 5 }}>Retype Password</Text> */}

{/* <TextInput
// placeholder="Type-in"
label="Retype Password"
style={{ width: '80%', color: '#FF3257', backgroundColor: '#fff', paddingVertical: 20 }}
mode='outlined'
autoCapitalize={false}
value={password}
secureTextEntry={true}
onChangeText={text => {
    SetPassword(text)
}
}
/> */}
  

        </View>

             {valid ? <GradientButton
                style={{marginTop: 20,width: 400, marginLeft:10}} onPress={() => props.navigation.navigate('AgencyDetail',{password: password, data: props.navigation.getParam('data')} )}
                >Continue</GradientButton> : <TouchableOpacity style={{marginTop: 20,width: 400, marginLeft:10,paddingVertical:15, backgroundColor:'gray'}}><Text style={{backgroundColor: 'transparent',
                fontSize: 14,
                color: '#fff',
                fontFamily: 'font-bold',
                textTransform: 'uppercase',textAlign: 'center'}}>Continue</Text></TouchableOpacity>}
        </KeyboardAvoidingView>
    )
}

export default Password