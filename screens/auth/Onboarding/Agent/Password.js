import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import GradientButton from '../../../../components/Button'
const Password = (props) => {
    const [password, SetPassword] = useState('')
    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff'}}>

            <Text style={{fontSize:16, fontWeight: 'bold', }}>Set Password</Text>

            <TextInput
                    label="Password"
                    style={{ width: '80%', color: '#FF3257', backgroundColor: '#fff', marginTop: 20}}
                    mode='outlined'
                    autoCapitalize={false}
                    value={password}
                    secureTextEntry={true}
                    onChangeText={text => {
                        SetPassword(text)
                    }
                    }
                />
                <Text style={{marginTop:10, color:'gray'}}>This is the private password for your account</Text>
                <GradientButton
                style={{marginTop: 20,width:300}} onPress={() => props.navigation.navigate('AgencyDetail',{password: password, data: props.navigation.getParam('data')} )}
                >Done</GradientButton>
        </View>
    )
}

export default Password