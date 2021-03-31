import React,{useState, useEffect} from 'react';
import {Text, View} from 'react-native';
import {TextInput} from 'react-native-paper';
import GradientButton from '../../../../components/Button';
import {useDispatch, useSelector} from 'react-redux';
import {agentLogin} from '../../../../actions/account-actions';
import request from '../../../../helper/functions/request';
import { setToken, setData, } from '../../../../helper/functions/storage';
import { handleSnackbar } from '../../../../helper/functions/snackbar';
import * as acc from '../../../../actions/account-actions';
import * as app from '../../../../actions/app'
import axios from 'axios';
const AgentLogin = (props) => {
    const [username, setUsername] = useState('')
    const dispatch = useDispatch();
    const [password, setPassword] = useState('')
    // const dispatch = useDispatch();
    const Login = async(payload) => {
            // dispatch(app.handleLoading(true))
            // // dispatch(handleLoading(true));
            // dispatch(acc.NewUserAllProperty())
            // dispatch(acc.clearSearch())
            let url = '/users/agent/new_login'
            console.log("Login in Agent Screeen", payload, url)

           await axios.post(`http://13.211.132.117:3600${url}`, payload, {
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
              }).then().catch(err => {
                  console.log("Error in Agent", err)
              });
            //   console.log("Data from Login", data)

            // try {
             // console.log(payload);
            //   const { data } = await request({
            //     url: url,
            //     config: {
            //       method: 'POST',
            //       body: payload,
            //     },
            //   });
            //   console.log("Data", data)
          
          //     fetch("http://13.211.132.117:3600/users/agent/new_login",
          // {
          //     headers: {
          //       'Accept': 'application/json',
          //       'Content-Type': 'application/json'
          //     },
          //     method: "POST",x
          //     body: JSON.stringify(payload)
          // }).then(function(res){ console.log(res) })
          // .catch(function(res){ console.log(res) })
          
              //console.log("User data After Login", data)
            //   await dispatch(acc.agentAuthSuccess(data))
              
            //   await setToken(data.auth_token);
            //   await setData('user', data.user);
          
            //   if (data.agent) {
            //     await setData('agent', data.agent);
            //     await setData('agency', data.agency);
            //   }
          
            //   handleSnackbar({
            //     message: 'Logged in',
            //     type: 'success',
            //   });
          
              // try {
              //   const fcmToken = await AsyncStorage.getItem('fcmToken');
              //   console.log({
              //     fireBaseToken: fcmToken,
              //     userIdOrEmail: payload.email,
              //   });
              //   const status = await request({
              //     url: '/push-notify/capture',
              //     config: {
              //       method: 'POST',
              //       body: {
              //         fireBaseToken: fcmToken,
              //         userIdOrEmail: payload.email,
              //       },
              //     },
              //   });
              //   // console.log('Status of FCM token save: ', status);
              // } catch (error) {
              //   console.log('FCM token save failed  with error: ', error.message, error);
              // }
          
              // const loginUser = StackActions.reset({
              //   index: 0,
              //   actions: [NavigationActions.navigate({ routeName: data.user.role })],
              // });
          
              // navigation.dispatch(loginUser);
            // } catch (error) {
            //     console.log("Error")
            // //   console.log(error.response.data);
            // //   console.log({ ...error });
            // //   handleSnackbar({
            // //     message: parseError(error.response.data),
            // //     indefinite: true,
            // //   });
            // } 
            // finally {
            //     // dispatch(app.handleLoading(false))
            // //   dispatch(app.handleLoading(false));
            // }
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:'#fff'}}>
            

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
                    // Login(data)
                    try{
                        dispatch(agentLogin(data, props.navigation))
                    }catch(e){
                        console.log("Error", e)
                    }
                    

                }}
                >Login</GradientButton>



        </View>
    )
}

export default AgentLogin