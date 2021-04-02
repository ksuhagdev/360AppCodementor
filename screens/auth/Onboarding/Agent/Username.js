import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useForm } from 'react-hook-form';
import { TextInput } from 'react-native-paper'
import Icon from 'react-native-vector-icons/Entypo';
import Icons from 'react-native-vector-icons/AntDesign'
import GradientButton from '../../../../components/Button'
// import axios from 'axios'
// import { TextField} from 'react-native-material-textfield'
const Username = (props) => {
    // const {register, handleSubmit} = useForm()
    const [username, setUsername] = useState();
    const [valid, setValid] = useState(false);

    return (
        <View style={{ backgroundColor: '#fff', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{
                flexDirection: 'row',
                paddingBottom: 10,
                width: '90%',
            }}>
                <TextInput
                    label="Username"
                    style={{ flex: 1, width: '80%', color: '#FF3257', backgroundColor: '#fff' }}
                    mode='outlined'
                    autoCapitalize={false}
                    value={username}
                    onChangeText={text => {
                        setUsername(text)
                        if (text.length > 5) {
                            let url = `http://13.211.132.117:3600/users/checkUniqueUsername/${text}`
                            console.log("URL", url)
                            fetch(url).then(result => result.json()).then(result => {
                                console.log("result from server", result.unique)
                                setValid(result.unique)
                            })
                        } else {
                            setValid(false)
                        }
                    }
                    }
                />

                <View style={{ position: 'absolute', right: 20, top: 25 }}>
                    {valid ? <Icons name="checkcircle" size={26} color='green' /> : <Icon name="circle-with-cross" size={26} color='red' />}
                </View>

            </View>
            <View>
                <Text>Please enter more than 6 characters username</Text>
            </View>
            {/* <View> */}
            <View>
                {valid ? <GradientButton
                    style={{ marginTop: 20, width: 300 }}

                    onPress={async () => {
                        console.log("Username", username)
                        console.log("TYPE", props.navigation.getParam('type'))
                        props.navigation.navigate('PersonalInfo', {username: username, type: props.navigation.getParam('type'),mobno: props.navigation.getParam('mobno')})
                    }}
                >
                    Next
          </GradientButton> : 
          <TouchableOpacity activeOpacity={1} style={{ marginTop: 20, width: 300, paddingVertical: 15, backgroundColor: 'gray' }}><Text style={{
                        backgroundColor: 'transparent',
                        fontSize: 14,
                        color: '#fff',
                        fontFamily: 'font-bold',
                        textTransform: 'uppercase', textAlign: 'center'
                    }}>Next</Text></TouchableOpacity>}
            </View>

            {/* </View> */}
            {/* <Text>Username</Text> */}
        </View>
    )
}

export default Username;