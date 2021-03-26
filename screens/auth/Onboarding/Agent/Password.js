import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet , Dimensions, KeyboardAvoidingView, Platform} from 'react-native';
import { TextInput } from 'react-native-paper';
import GradientButton from '../../../../components/Button'
const Password = (props) => {
    const [password, SetPassword] = useState('')
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
    {/* <Text style={{fontSize:16, fontWeight: 'bold',marginTop:20, marginLeft: 5 }}>Retype Password</Text> */}

<TextInput
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
/>
  

        </View>

             <GradientButton
                style={{marginTop: 20,width: 400, marginLeft:10}} onPress={() => props.navigation.navigate('AgencyDetail',{password: password, data: props.navigation.getParam('data')} )}
                >Continue</GradientButton>
        </KeyboardAvoidingView>
    )
}

export default Password