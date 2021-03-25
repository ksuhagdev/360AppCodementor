import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet , Dimensions} from 'react-native';
import { TextInput } from 'react-native-paper';
import GradientButton from '../../../../components/Button'
const Password = (props) => {
    const [password, SetPassword] = useState('')
    const {width, height} =Dimensions.get('window')
    return (
        <View  style={{backgroundColor: '#fff' }}>
        <View style={{justifyContent: 'center', alignItems: 'center', marginTop:10}} >
          <Text style={{color:'grey', fontSize:16, justifyContent:'center'}}> Complete account setup  </Text>
        </View>
        <View >
        <Text style={{fontSize:16, fontWeight: 'bold',marginTop:height/5, marginLeft: 5 }}>Set Password</Text>

        <TextInput
        placeholder="Type-in"
        style={{ width: '80%', color: '#FF3257', backgroundColor: '#fff' }}
        //mode='outlined'
        autoCapitalize={false}
        value={password}
        secureTextEntry={true}
        onChangeText={text => {
            SetPassword(text)
        }
        }
    />
    <Text style={{fontSize:16, fontWeight: 'bold',marginTop:20, marginLeft: 5 }}>Retype Password</Text>

<TextInput
placeholder="Type-in"
style={{ width: '80%', color: '#FF3257', backgroundColor: '#fff' }}
//mode='outlined'
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
        </View>
    )
}

export default Password