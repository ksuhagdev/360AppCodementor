import React,{useState, useEffect} from 'react';
import {Text, View} from 'react-native';
import {TextInput} from 'react-native-paper';
import GradientButton from '../../../../components/Button';
import {useDispatch, useSelector} from 'react-redux';
import {agentLogin} from '../../../../actions/account-actions'
const AgentLogin = (props) => {
    const [username, setUsername] = useState('')
    const dispatch = useDispatch();
    const [password, setPassword] = useState('')
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            

            <TextInput
                    label="Username"
                    style={{ width: '80%', color: '#FF3257', backgroundColor: '#fff' }}
                    mode='outlined'
                    autoCapitalize={false}
                    value={username}
                    onChangeText={text => {
                        setUsername(text)
                    }}

                />

                <TextInput
                    label="Password"
                    style={{ width: '80%', color: '#FF3257', backgroundColor: '#fff', marginTop: 20 }}
                    mode='outlined'
                    autoCapitalize={false}
                    secureTextEntry={true}
                    value={password}
                    onChangeText={text => {
                        setPassword(text)
                    }
                    }
                />

<GradientButton
                style={{marginTop: 20,width:300}} onPress={() => {
                    // props.navigation.navigate('AgencyDetail')
                    let data = {
                        username: username, password: password
                    }

                    dispatch(agentLogin(data, props.navigation))

                }}
                >Login</GradientButton>
        </View>
    )
}

export default AgentLogin